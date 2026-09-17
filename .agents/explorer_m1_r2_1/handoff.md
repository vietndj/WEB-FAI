# Investigation & Implementation Strategy: Milestone 1 Resilience & Stability Fixes

**Agent**: `explorer_m1_r2_1`  
**Role**: Teamwork Explorer (Investigation & Synthesis)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_1`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Status**: COMPLETE (Ready for Implementer / Worker)

---

## 1. Observation

A forensic investigation of the codebase, upstream review findings from `reviewer_m1_bot_2/handoff.md` (specifically Section 1.3: *Adversarial Stress-Test Failures & Findings*), and our empirical test execution (`scripts/challenger-empirical-m1.mjs`) revealed four specific resilience and error-handling defects across two core files:
1. `src/app/api/telegram/webhook/route.js`
2. `scripts/telegram-polling-bridge.mjs`

### 1.1 Finding 1: Unhandled TypeError on Malformed Photo Array
- **Location**: `src/app/api/telegram/webhook/route.js:280-281`
- **Observed Code**:
  ```javascript
  // b. Photo Received
  if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
    const session = await getTelegramSession(chatId);

    // Pick highest resolution photo
    const highestPhoto = message.photo[message.photo.length - 1];
    const photoFileId = highestPhoto.file_id;
  ```
- **Observed Behavior**:
  - When an adversarial or malformed update is posted with `message.photo = [null]` or `message.photo = [{}]`, `message.photo.length > 0` evaluates to `true`.
  - Accessing `highestPhoto.file_id` on `null` immediately throws:
    ```
    TypeError: Cannot read properties of null (reading 'file_id')
    ```
  - Accessing `highestPhoto.file_id` on `{}` yields `undefined`, which subsequently crashes `downloadFileBuffer(undefined)` or `getFile(undefined)` during downstream API calls.
  - The unhandled exception bubbles to the top-level route catch block, returning `HTTP 500 Internal Server Error`.
  - In Telegram Bot Webhook architecture, Telegram repeatedly redelivers updates that receive HTTP 500 responses, causing a persistent crash-retry storm.

### 1.2 Finding 2: Delayed Signal Listener Registration in Polling Bridge
- **Location**: `scripts/telegram-polling-bridge.mjs:186-187`
- **Observed Code**:
  ```javascript
  async function main() {
    ...
    // Check bot identity
    const botInfo = await callTelegramApi('getMe');       // Line 149 (async network call)
    ...
    const webhookInfo = await getWebhookInfo();           // Line 158 (async network call)
    await deleteWebhook({ drop_pending_updates: false }); // Line 161 (async network call)
    ...
    // Graceful shutdown handling
    const shutdown = () => { ... };
    process.on('SIGINT', shutdown);                       // Line 186
    process.on('SIGTERM', shutdown);                      // Line 187
  ```
- **Observed Behavior**:
  - `SIGINT` and `SIGTERM` listeners are registered inside `main()`, placed after three sequential asynchronous HTTPS network calls to `api.telegram.org` (`getMe`, `getWebhookInfo`, `deleteWebhook`).
  - These startup network round-trips take 500ms to 2500ms depending on DNS and TLS handshakes.
  - If a termination signal is delivered during this startup window (as tested by `scripts/challenger-empirical-m1.mjs` Suite 3), Node.js default OS signal handling terminates the process abruptly (`exit code: null`, `signal: SIGINT`), bypassing clean shutdown logging and socket pool destruction (`telegramAgent.destroy()`).

### 1.3 Finding 3: Premature Offset Advancement on Forwarding Failure
- **Location**: `scripts/telegram-polling-bridge.mjs:205-209`
- **Observed Code**:
  ```javascript
  if (Array.isArray(updates) && updates.length > 0) {
    console.log(`📩 [${new Date().toLocaleTimeString()}] Received ${updates.length} update(s)`);
    for (const update of updates) {
      await forwardUpdate(update);
      offset = update.update_id + 1;
    }
  }
  ```
- **Observed Behavior**:
  - If `http://localhost:3000` is restarting (Turbopack compilation, hot reload) or temporarily offline, `forwardUpdate(update)` catches the network error (`ECONNREFUSED` or HTTP 500) and logs a warning.
  - However, line 207 unconditionally increments `offset = update.update_id + 1`.
  - In Telegram Bot API, calling `getUpdates({ offset: update_id + 1 })` permanently acknowledges that update. Telegram drops it from its queue.
  - Result: Any Telegram message or button click arriving while the Next.js development server is briefly offline is permanently dropped without recovery.

### 1.4 Finding 4: Uncaught JSON Parse SyntaxError Returns HTTP 500
- **Location**: `src/app/api/telegram/webhook/route.js:73`
- **Observed Code**:
  ```javascript
  // 2. Parse Telegram Update body
  const body = await request.json();
  const { message, callback_query } = body;
  ```
- **Observed Behavior**:
  - If a malformed payload (truncated JSON, empty string, or non-JSON body) is delivered to the webhook endpoint, `request.json()` throws a `SyntaxError`.
  - Because `request.json()` is not wrapped in a dedicated try-catch block, the error triggers the outer catch block at line 371, returning `HTTP 500 Internal Server Error`.
  - Under RFC 9110 §15.5.1, client-side malformed syntax is a `400 Bad Request`.
  - Furthermore, if the request body is valid JSON but not an object (e.g. `null`, `"a string"`, or `12345`), `const { message } = body` throws `TypeError: Cannot destructure property 'message' of 'body' as it is null`, which also erroneously returns HTTP 500 instead of HTTP 400.

### 1.5 Finding 5: Uncaught Outbound Notification Errors in Callback Queries
- **Location**: `src/app/api/telegram/webhook/route.js:139-144, 151`
- **Observed Code**:
  ```javascript
  if (!session || !session.generatedOptions) {
    await sendMessage(
      chatId,
      '⚠️ Phiên làm việc đã hết hạn hoặc không tìm thấy bài viết. Vui lòng gửi lệnh /dangbai để bắt đầu lại.'
    );
    return NextResponse.json({ ok: true });
  }
  ```
- **Observed Behavior**:
  - If Telegram API rate limits rapid consecutive requests to the same chat (`429 Too Many Requests`), `callTelegramApi` throws. Without a try-catch surrounding `sendMessage`, this unhandled error bubbles up and turns an expired session notice into an HTTP 500 response.

---

## 2. Logic Chain

1. **Webhook Robustness Principle**:
   - A public webhook endpoint must never throw unhandled TypeErrors or return HTTP 500 for malformed input payloads.
   - Returning HTTP 500 signals to Telegram that an internal server outage occurred, prompting Telegram to endlessly retry the same poisoned update.
   - All input validation (JSON parsing, body type check, photo array structure) must be handled defensibly and fail fast with appropriate status codes:
     - Invalid JSON or non-object payloads must return `HTTP 400 Bad Request`.
     - Valid Telegram payloads that lack actionable content (e.g. malformed photo items) must return `HTTP 200 { ok: true }` to cleanly acknowledge and consume the update without side effects.
     - Auxiliary notifications sent back to Telegram (`sendMessage` on expired sessions) should be wrapped in defensive try-catches so Telegram API rate-limiting or network issues never fail the incoming webhook acknowledgement.

2. **Process Lifecycle Management**:
   - In daemon workers (`telegram-polling-bridge.mjs`), process lifecycle hooks (`process.on('SIGINT')`, `process.on('SIGTERM')`) must be attached synchronously during module initialization.
   - Attaching signal listeners after asynchronous network I/O leaves a critical vulnerability window where process termination is uncontrolled, leaving sockets open and failing empirical automated verification.

3. **Queue Acknowledgment & Zero Message Loss**:
   - In distributed messaging and polling architectures, offset progression equals acknowledgment.
   - A polling bridge must only advance `offset` when the downstream consumer has successfully acknowledged receipt (`response.ok`).
   - If delivery encounters a transient failure (server offline or HTTP 5xx), the bridge must retry with exponential backoff.
   - If retries are exhausted, the bridge must halt batch processing and retain the unacknowledged `offset` so that messages are re-fetched once the server recovers.
   - Conversely, if the server explicitly rejects an update with `HTTP 4xx` (permanent client error/poison pill), retrying will never succeed; the bridge must advance `offset` to prevent queue deadlock.

---

## 3. Caveats

- **Explorer Role Constraint**: In strict adherence to Teamwork Explorer boundaries, this agent performed read-only analysis and empirical validation. No source files in `/Users/vietmac/Documents/CODE/WEB- FAI/fai` were directly modified by this agent.
- **Development Environment Dependency**: The Next.js dev server must be running on `http://localhost:3000` for the polling bridge and test runner to communicate with the local webhook.
- **Telegram Rate Limits**: Heavy concurrent bursts (> 10 parallel requests to `api.telegram.org` within 100ms) can encounter Telegram rate limiting; the keep-alive HTTPS agent pool absorbs this, but empirical tests should account for API round-trip times.

---

## 4. Conclusion & Precise Worker Implementation Strategy

The worker (implementer) should apply the following targeted modifications across the two files:

### 4.1 Fix for `src/app/api/telegram/webhook/route.js`

#### Change A: Defensive JSON Body Parsing & Type Validation (Lines 72-76)
**Replace**:
```javascript
    // 2. Parse Telegram Update body
    const body = await request.json();
    const { message, callback_query } = body;
```
**With**:
```javascript
    // 2. Parse Telegram Update body
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.warn('[Webhook] Malformed JSON payload received:', parseErr.message);
      return NextResponse.json(
        { error: 'Bad Request', details: 'Malformed JSON payload' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      console.warn('[Webhook] Invalid update payload type:', typeof body);
      return NextResponse.json(
        { error: 'Bad Request', details: 'Update payload must be a JSON object' },
        { status: 400 }
      );
    }

    const { message, callback_query } = body;
```

#### Change B: Photo Array Null-Safety (Lines 276-285)
**Replace**:
```javascript
      // b. Photo Received
      if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
        const session = await getTelegramSession(chatId);

        // Pick highest resolution photo
        const highestPhoto = message.photo[message.photo.length - 1];
        const photoFileId = highestPhoto.file_id;
        const userNotes = message.caption || text || '';
```
**With**:
```javascript
      // b. Photo Received
      if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
        // Defensive check: filter for non-null items with valid string file_id
        const validPhotos = message.photo.filter(
          (p) => p && typeof p.file_id === 'string' && p.file_id.trim().length > 0
        );

        if (validPhotos.length === 0) {
          console.warn(`[Webhook] Photo array present but contains no valid photo items from chatId ${chatId}`);
          return NextResponse.json({ ok: true });
        }

        const session = await getTelegramSession(chatId);

        // Pick highest resolution photo
        const highestPhoto = validPhotos[validPhotos.length - 1];
        const photoFileId = highestPhoto.file_id;
        const userNotes = message.caption || text || '';
```

#### Change C: Defensive Notification Sending in Option Callbacks (Lines 138-144)
**Replace**:
```javascript
        if (!session || !session.generatedOptions) {
          await sendMessage(
            chatId,
            '⚠️ Phiên làm việc đã hết hạn hoặc không tìm thấy bài viết. Vui lòng gửi lệnh /dangbai để bắt đầu lại.'
          );
          return NextResponse.json({ ok: true });
        }
```
**With**:
```javascript
        if (!session || !session.generatedOptions) {
          try {
            await sendMessage(
              chatId,
              '⚠️ Phiên làm việc đã hết hạn hoặc không tìm thấy bài viết. Vui lòng gửi lệnh /dangbai để bắt đầu lại.'
            );
          } catch (sendErr) {
            console.warn('[Webhook] Could not send expired session notice:', sendErr.message);
          }
          return NextResponse.json({ ok: true });
        }
```

---

### 4.2 Fix for `scripts/telegram-polling-bridge.mjs`

#### Change A: Register Signal Handlers at Startup (Top Level)
Place the signal listeners at the top level immediately after importing `telegramAgent` (around line 72), before `main()` is executed:
```javascript
let isRunning = true;

// Graceful shutdown handling (registered at startup before any async operations)
const shutdown = (signal) => {
  if (!isRunning) return;
  console.log(`\n🛑 [PollingBridge] Received termination signal (${signal || 'SIGINT'}). Shutting down cleanly...`);
  isRunning = false;
  try {
    telegramAgent?.destroy();
  } catch {
    // Ignore teardown error
  }
  process.exit(0);
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
```

#### Change B: Add Retry Wrapper for Local Forwarding
Add `forwardUpdateWithRetry` right below `forwardUpdate` (around line 138):
```javascript
async function forwardUpdateWithRetry(update, maxRetries = 3) {
  let attempt = 0;
  let delay = 500;

  while (isRunning && attempt <= maxRetries) {
    attempt++;
    const res = await forwardUpdate(update);

    if (res.ok) {
      return { success: true, res };
    }

    // Permanent client errors (4xx): payload rejected by webhook, do not retry endlessly
    if (res.status && res.status >= 400 && res.status < 500) {
      console.warn(`  ⚠️ [PollingBridge] Update #${update.update_id} rejected with HTTP ${res.status} (client error). Skipping retry.`);
      return { success: false, clientError: true, res };
    }

    // Transient failure (network drop or 5xx server error): retry if attempts remain
    if (attempt <= maxRetries && isRunning) {
      console.warn(`  ⏳ [PollingBridge] Retry ${attempt}/${maxRetries} for update #${update.update_id} in ${delay}ms...`);
      await new Promise((r) => setTimeout(r, delay));
      delay *= 2;
    }
  }

  return { success: false, clientError: false };
}
```

#### Change C: Clean up `main()` and Implement Resilient Offset Advancement
Inside `main()`:
1. Remove `let isRunning = true;`, `const shutdown = ...`, and `process.on('SIGINT', shutdown)` / `process.on('SIGTERM', shutdown)` (since they are now in module scope).
2. Replace lines 203-210 with:
```javascript
      if (Array.isArray(updates) && updates.length > 0) {
        console.log(`📩 [${new Date().toLocaleTimeString()}] Received ${updates.length} update(s)`);
        for (const update of updates) {
          if (!isRunning) break;

          const delivery = await forwardUpdateWithRetry(update, 3);

          if (delivery.success) {
            // Only advance offset if successfully delivered to webhook
            offset = update.update_id + 1;
          } else if (delivery.clientError) {
            // For malformed updates rejected with 4xx, advance offset to avoid queue deadlock
            console.warn(`⚠️ [PollingBridge] Advancing offset past permanently rejected update #${update.update_id}`);
            offset = update.update_id + 1;
          } else {
            // Transient failure (server down or 5xx after all retries):
            // DO NOT advance offset. Break loop to retry on next poll cycle.
            console.error(`❌ [PollingBridge] Failed to forward update #${update.update_id} after retries. Retaining offset ${offset} for next poll.`);
            break;
          }
        }
      }
```

---

### 4.3 Recommended Hardening: Environment-Aware TLS in `src/lib/telegram.js`
In `src/lib/telegram.js`:
Replace `rejectUnauthorized: false` on lines 34, 44, 98, 224, 348 with:
```javascript
const isProduction = process.env.NODE_ENV === 'production';
const rejectUnauthorized = isProduction;
```
This ensures strict SSL certificate verification in production deployments while maintaining seamless local macOS development compatibility.

---

## 5. Verification Method

Once the implementer has applied the changes, independently verify each fix using these exact commands:

### 5.1 Test Issue 1 & Issue 4: Webhook Resilience
```bash
# Test 1: Malformed JSON syntax (Expect HTTP 400 Bad Request)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{"update_id": 123, "message": {"text": "unclosed'

# Test 2: Non-object JSON null (Expect HTTP 400 Bad Request)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d 'null'

# Test 3: Malformed photo array [null] (Expect HTTP 200 OK)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{
    "update_id": 9999,
    "message": {
      "from": {"id": 2050406425, "first_name": "Admin"},
      "chat": {"id": 2050406425},
      "photo": [null]
    }
  }'

# Test 4: Photo array with empty object [{}] (Expect HTTP 200 OK)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{
    "update_id": 9998,
    "message": {
      "from": {"id": 2050406425, "first_name": "Admin"},
      "chat": {"id": 2050406425},
      "photo": [{}]
    }
  }'
```

### 5.2 Test Issue 2 & Issue 3: Bridge Process Lifecycle & Single Run
```bash
# Test Bridge Single Run
node scripts/telegram-polling-bridge.mjs --once
# Expected: Exits cleanly with code 0

# Run Full Empirical Suite
node scripts/challenger-empirical-m1.mjs
# Expected: Suite 3 SIGINT & SIGTERM tests pass with Exit code: 0
```

### 5.3 Verify Code Quality & Style
```bash
npx eslint src/lib/telegram.js src/app/api/telegram/webhook/route.js scripts/telegram-polling-bridge.mjs
# Expected: 0 errors, 0 warnings
```
