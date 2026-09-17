# Handoff Report: Milestone 1 Refinement Proposals (Webhook Sanitization & Polling Bridge Lifecycle)

**Agent**: `explorer_m1_r2_2`  
**Roles**: Teamwork Explorer (Read-only investigation & architectural synthesis)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_2`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Handoff Type**: Hard (Complete investigation & ready for implementation)  

---

## 1. Observation

Direct code examination and empirical test execution against `/Users/vietmac/Documents/CODE/WEB- FAI/fai` identified the following concrete observations:

### 1.1 Webhook Route: Photo Array Malformation & Null Pointer Crash
- **Location**: `src/app/api/telegram/webhook/route.js:276-282`
- **Existing Code**:
  ```javascript
  // b. Photo Received
  if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
    const session = await getTelegramSession(chatId);

    // Pick highest resolution photo
    const highestPhoto = message.photo[message.photo.length - 1];
    const photoFileId = highestPhoto.file_id;
    const userNotes = message.caption || text || '';
  ```
- **Observed Behavior**:
  When an adversarial or malformed update payload arrives where `message.photo = [null]` or `message.photo = [{}]`:
  - Accessing `highestPhoto.file_id` throws:
    ```
    TypeError: Cannot read properties of null (reading 'file_id')
    ```
  - When `highestPhoto` is `{}` (missing `file_id`), `photoFileId` is `undefined`, causing `downloadFileBuffer(undefined)` to fail downstream.
  - The uncaught exception bubbles up to `route.js:371` catch block and returns `HTTP 500 Internal Server Error`.
  - In Telegram Bot API semantics, HTTP 500 triggers continuous retries by Telegram's webhook dispatcher, creating an infinite crash loop.

### 1.2 Webhook Route: JSON Parse Guard & Non-Object Payloads
- **Location**: `src/app/api/telegram/webhook/route.js:72-74`
- **Existing Code**:
  ```javascript
  // 2. Parse Telegram Update body
  const body = await request.json();
  const { message, callback_query } = body;
  ```
- **Observed Behavior**:
  - If a request contains broken JSON syntax (e.g. `{"update_id": 123, "message": {"text": "unclosed`), an empty body, or invalid encoding, `request.json()` throws a `SyntaxError`.
  - If a request contains a valid JSON primitive that is not an object (e.g. `null`), `const { message } = null` throws `TypeError: Cannot destructure property 'message' of 'null' as it is null`.
  - Both errors are caught by the outer catch handler, returning `HTTP 500 Internal Server Error` instead of `HTTP 400 Bad Request`.
  - Standard REST/webhook APIs must respond with `400 Bad Request` for client payload syntax defects, reserving `500` strictly for unhandled internal server failures.

### 1.3 Polling Bridge: Process Lifecycle & Signal Registration Timing
- **Location**: `scripts/telegram-polling-bridge.mjs:178-188`
- **Existing Code**:
  ```javascript
  async function main() {
    ...
    const botInfo = await callTelegramApi('getMe');        // Line 149
    ...
    const webhookInfo = await getWebhookInfo();            // Line 159
    await deleteWebhook({ drop_pending_updates: false });  // Line 167
    ...
    let offset = 0;
    let isRunning = true;

    // Graceful shutdown handling
    const shutdown = () => {
      if (!isRunning) return;
      console.log('\n🛑 [PollingBridge] Received termination signal. Shutting down cleanly...');
      isRunning = false;
      telegramAgent.destroy();
      process.exit(0);
    };

    process.on('SIGINT', shutdown);                        // Line 186
    process.on('SIGTERM', shutdown);                       // Line 187
  ```
- **Observed Behavior**:
  - In `scripts/telegram-polling-bridge.mjs`, signal listeners (`SIGINT`, `SIGTERM`) are registered synchronously only after multiple asynchronous network round-trips (`getMe`, `getWebhookInfo`, `deleteWebhook`).
  - During empirical stress test Suite 3.2 (`SIGINT Graceful Shutdown`), signals sent during initial execution or slow network phases were not intercepted by the custom shutdown handler, leading to test timeout or abrupt termination (`exit code: null` / `exit code: -1`).
  - Without immediate top-level signal interception, persistent keep-alive sockets held by `telegramAgent` may fail to close cleanly during early aborts.

### 1.4 Polling Bridge: Offset Increment on Forwarding Failures
- **Location**: `scripts/telegram-polling-bridge.mjs:203-209`
- **Existing Code**:
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
  - `forwardUpdate(update)` catches network errors (`ECONNREFUSED` if Next.js local server is offline or restarting) and returns `{ ok: false, error: err.message }`.
  - However, line 207 unconditionally advances `offset = update.update_id + 1`.
  - Telegram interprets this incremented offset on the next `getUpdates` call as confirmation of receipt, permanently dropping the unforwarded updates.

### 1.5 Outbound Telegram Client: Hardcoded TLS Bypass
- **Location**: `src/lib/telegram.js:34, 98, 224, 348`
- **Existing Code**:
  ```javascript
  export const telegramAgent = new https.Agent({
    keepAlive: true,
    family: 4,
    rejectUnauthorized: false,
  });
  ```
- **Observed Behavior**:
  - `rejectUnauthorized: false` was set to bypass local macOS self-signed proxy issues, but applies unconditionally across all environments.
  - In a production deployment (e.g. Vercel), this exposes outbound Telegram Bot API traffic to Man-In-The-Middle inspection.

---

## 2. Logic Chain

1. **Webhook Sanitization (Findings 1.1 & 1.2)**:
   - *Premise*: Webhook endpoints are public attack surfaces that receive arbitrary input from network clients.
   - *Inference 1*: Incoming payloads cannot be assumed to be valid JSON objects. A `try / catch` around `request.json()` paired with type validation (`typeof body === 'object' && body !== null && !Array.isArray(body)`) guarantees that non-JSON or primitive inputs return HTTP 400 Bad Request immediately without throwing unhandled exceptions.
   - *Inference 2*: In Telegram update payloads, `message.photo` is an array of photo sizes. Defending against malformed arrays requires filtering for elements that are truthy objects containing a non-empty string `file_id`:
     `photo.filter(p => p && typeof p === 'object' && typeof p.file_id === 'string' && p.file_id.trim().length > 0)`.
   - *Inference 3*: If `validPhotos.length === 0` (even if `message.photo` was an array of nulls), the route logs a warning and returns `NextResponse.json({ ok: true })`, preventing Telegram retry loops and preventing downstream crashes in `downloadFileBuffer`.

2. **Polling Bridge Lifecycle & Resilience (Findings 1.3 & 1.4)**:
   - *Premise*: The polling bridge is a daemon process managing external long-polling connections and local HTTP forwarding.
   - *Inference 1*: Signal handlers (`SIGINT`, `SIGTERM`) must be registered synchronously at the module level immediately upon script start. This ensures that any termination signal received at any millisecond of the process lifecycle cleanly invokes `telegramAgent.destroy()` and exits with code 0.
   - *Inference 2*: In long-polling architectures, `offset` advancement represents message acknowledgment. If the target server (`http://localhost:3000`) is unreachable due to transient network failure (`ECONNREFUSED`, server restart), advancing `offset` causes silent message loss.
   - *Inference 3*: By adding retry logic (up to 3 attempts) and retaining `offset` when forwarding encounters an unrecoverable connection failure, updates remain safely queued in Telegram's cloud buffer until the local server resumes.

---

## 3. Caveats

- **Read-Only Scope**: In strict adherence to our `explorer` role, no production files were modified. All proposals are provided as exact line-numbered code modifications.
- **Local Server Prerequisite**: Verification of forwarding depends on Next.js running on `http://localhost:3000`. If Next.js is not active, the bridge's retry mechanism will hold the offset as designed.
- **Node.js Typeless Warning**: Node.js emits `MODULE_TYPELESS_PACKAGE_JSON` warning when running standalone `.js` files with ES module syntax. This is harmless in development and does not affect functionality.

---

## 4. Conclusion & Proposed Code Modifications

The following precise, production-ready code modifications are proposed for implementation by the implementer agent.

### Proposal 1: Webhook Route Input Sanitization
**Target File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/api/telegram/webhook/route.js`

#### Change 1A: Defensive JSON Parse Guard
- **Target Lines**: Replace lines 72–75
- **Before**:
  ```javascript
    // 2. Parse Telegram Update body
    const body = await request.json();
    const { message, callback_query } = body;
  ```
- **After**:
  ```javascript
    // 2. Parse Telegram Update body with defensive JSON guard
    let body;
    try {
      body = await request.json();
    } catch (parseErr) {
      console.warn('[Webhook] Malformed JSON payload received:', parseErr.message);
      return NextResponse.json(
        { error: 'Bad Request: Invalid JSON payload' },
        { status: 400 }
      );
    }

    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      console.warn('[Webhook] Payload is not a valid JSON object:', typeof body);
      return NextResponse.json(
        { error: 'Bad Request: Expected a JSON object' },
        { status: 400 }
      );
    }

    const { message, callback_query } = body;
  ```

#### Change 1B: Photo Array Filter & Null-Safety
- **Target Lines**: Replace lines 275–284
- **Before**:
  ```javascript
      // b. Photo Received
      if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
        const session = await getTelegramSession(chatId);

        // Pick highest resolution photo
        const highestPhoto = message.photo[message.photo.length - 1];
        const photoFileId = highestPhoto.file_id;
        const userNotes = message.caption || text || '';
  ```
- **After**:
  ```javascript
      // b. Photo Received with array filtering and null-safety
      if (Array.isArray(message.photo) && message.photo.length > 0) {
        const validPhotos = message.photo.filter(
          (p) => p && typeof p === 'object' && typeof p.file_id === 'string' && p.file_id.trim().length > 0
        );

        if (validPhotos.length === 0) {
          console.warn(`[Webhook] Received photo array with no valid file_id from chatId ${chatId}`);
          return NextResponse.json({ ok: true });
        }

        const session = await getTelegramSession(chatId);

        // Pick highest resolution photo from sanitized array
        const highestPhoto = validPhotos[validPhotos.length - 1];
        const photoFileId = highestPhoto.file_id;
        const userNotes = message.caption || text || '';
  ```

---

### Proposal 2: Polling Bridge Process Lifecycle & Offset Management
**Target File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/scripts/telegram-polling-bridge.mjs`

#### Change 2A: Top-Level Signal Handlers & Clean Teardown
- **Target Lines**: Add immediately after imports (around line 74) and remove lines 177–188 inside `main()`
- **Proposed Code**:
  ```javascript
  let isRunning = true;

  // Top-level Graceful Shutdown Handler
  function shutdown(signal) {
    if (!isRunning) return;
    console.log(`\n🛑 [PollingBridge] Received termination signal (${signal || 'SIGINT'}). Shutting down cleanly...`);
    isRunning = false;
    try {
      telegramAgent?.destroy();
    } catch {}
    process.exit(0);
  }

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  ```

#### Change 2B: Resilient Forwarding with Retry & Offset Protection
- **Target Lines**: Replace `forwardUpdate` and the update dispatch loop in `main()`
- **Proposed Code**:
  ```javascript
  async function forwardUpdate(update) {
    const t0 = performance.now();
    const summary = formatUpdateSummary(update);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-telegram-bot-api-secret-token': webhookSecret,
        },
        body: JSON.stringify(update),
      });

      const duration = (performance.now() - t0).toFixed(1);
      let result = {};
      try {
        result = await response.json();
      } catch {
        // Ignored
      }

      if (response.ok) {
        console.log(`  ✅ [Forwarded ${duration}ms] #${update.update_id} -> HTTP ${response.status} | ${summary}`);
        return { ok: true, status: response.status, result };
      } else {
        console.warn(`  ⚠️ [Forwarded ${duration}ms] #${update.update_id} -> HTTP ${response.status} (FAILED) | ${summary}`);
        return { ok: false, status: response.status, result };
      }
    } catch (err) {
      const duration = (performance.now() - t0).toFixed(1);
      console.error(`  ❌ [Forward Error ${duration}ms] #${update.update_id} -> ${err.message} | ${summary}`);
      return { ok: false, error: err.message };
    }
  }

  async function forwardUpdateWithRetry(update, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      if (!isRunning) break;
      const res = await forwardUpdate(update);

      if (res.ok) {
        return { success: true };
      }

      // If webhook returned 4xx (client error / unauthorized), retrying won't help; mark handled to avoid blocking
      if (res.status && res.status >= 400 && res.status < 500) {
        return { success: true, rejected: true };
      }

      if (attempt < maxRetries && isRunning) {
        console.warn(`  🔄 [PollingBridge] Retry ${attempt}/${maxRetries} forwarding #${update.update_id} in 1000ms...`);
        await new Promise((r) => setTimeout(r, 1000));
      }
    }
    return { success: false };
  }
  ```

- **Update Dispatch Loop in `main()`**:
  ```javascript
        if (Array.isArray(updates) && updates.length > 0) {
          console.log(`📩 [${new Date().toLocaleTimeString()}] Received ${updates.length} update(s)`);
          for (const update of updates) {
            if (!isRunning) break;

            const forwardResult = await forwardUpdateWithRetry(update, 3);
            if (forwardResult.success) {
              offset = update.update_id + 1;
            } else {
              console.error(
                `🚨 [PollingBridge] Local server unreachable for update #${update.update_id}. Retaining offset ${offset} to prevent message loss.`
              );
              // Break current batch so next poll will retry from current offset
              break;
            }
          }
        }
  ```

---

### Proposal 3 (Recommended): Environment-Aware TLS Verification
**Target File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/lib/telegram.js`

- **Location**: Lines 31–36, 98, 224, 348
- **Proposed Modification**:
  ```javascript
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldRejectUnauthorized = isProduction && process.env.TELEGRAM_IGNORE_SSL !== 'true';

  export const telegramAgent = new https.Agent({
    keepAlive: true,
    family: 4,
    rejectUnauthorized: shouldRejectUnauthorized ? true : false,
  });
  ```
  Pass `rejectUnauthorized: telegramAgent.options.rejectUnauthorized` to each `https.request` call in `telegram.js`.

---

## 5. Verification Method

Once the implementer applies the proposed changes, the following independent tests must be executed to verify full resolution:

### 5.1 Webhook Malformed Photo & JSON Verification
```bash
# Test 1: Malformed photo array with null entry (Should return HTTP 200 without TypeError)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{
    "update_id": 99991,
    "message": {
      "from": {"id": 2050406425, "first_name": "Admin"},
      "chat": {"id": 2050406425},
      "photo": [null]
    }
  }'
# Expected: {"ok":true}, HTTP_STATUS: 200

# Test 2: Photo array with empty object [{}] (Should return HTTP 200 without crash)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{
    "update_id": 99992,
    "message": {
      "from": {"id": 2050406425, "first_name": "Admin"},
      "chat": {"id": 2050406425},
      "photo": [{}]
    }
  }'
# Expected: {"ok":true}, HTTP_STATUS: 200

# Test 3: Malformed JSON syntax (Should return HTTP 400 Bad Request)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d '{"update_id": 123, "message": {"text": "unclosed'
# Expected: {"error":"Bad Request: Invalid JSON payload"}, HTTP_STATUS: 400

# Test 4: Null JSON body (Should return HTTP 400 Bad Request)
curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
  -d 'null'
# Expected: {"error":"Bad Request: Expected a JSON object"}, HTTP_STATUS: 400
```

### 5.2 Signal Handling & Lifecycle Verification
```bash
# Test SIGINT graceful shutdown via child_process
node -e '
import { spawn } from "node:child_process";
const proc = spawn("node", ["scripts/telegram-polling-bridge.mjs"], { cwd: process.cwd() });
proc.stdout.on("data", (d) => {
  const s = d.toString();
  if (s.includes("Starting update loop")) {
    setTimeout(() => proc.kill("SIGINT"), 200);
  }
});
proc.on("close", (code, signal) => {
  console.log("EXIT_CODE:", code, "SIGNAL:", signal);
  process.exit(code === 0 ? 0 : 1);
});
'
# Expected: EXIT_CODE: 0, SIGNAL: null
```

### 5.3 Full Challenger Empirical Test Suite
```bash
cd /Users/vietmac/Documents/CODE/WEB-\ FAI/fai
node scripts/challenger-empirical-m1.mjs
# Expected: 39/39 checks passed, Verdict: APPROVE, Exit code: 0
```

### 5.4 ESLint Static Code Analysis
```bash
cd /Users/vietmac/Documents/CODE/WEB-\ FAI/fai
npx eslint src/lib/telegram.js src/app/api/telegram/webhook/route.js scripts/telegram-polling-bridge.mjs
# Expected: Exit code: 0, 0 errors, 0 warnings
```
