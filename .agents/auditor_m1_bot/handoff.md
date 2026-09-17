# Milestone 1 Forensic Audit Report: Telegram Webhook Handler & Local Polling Bridge

**Auditor**: `auditor_m1_bot`  
**Target Milestone**: Milestone 1 (Telegram Network Optimization & Local Polling Bridge)  
**Work Product**: 
- `fai/src/lib/telegram.js`
- `fai/src/app/api/telegram/webhook/route.js`
- `fai/scripts/telegram-polling-bridge.mjs`  
**Integrity Mode**: `development` (per `ORIGINAL_REQUEST.md` 2026-09-03T15:13:01Z)  
**Verdict**: **`CLEAN`**

---

## 1. Observation

### 1.1 Static Analysis & Integrity Checks
- **Source Files Inspected**:
  - `src/lib/telegram.js` (408 lines):
    - Imports native `node:dns`, `node:https`, `node:tls`.
    - Enforces IPv4 resolution via `dns.setDefaultResultOrder('ipv4first')` (lines 16–20).
    - Persistent `https.Agent` configured with `keepAlive: true`, `family: 4`, `maxSockets: 50`, overriding `createConnection` using `tls.connect` with `family: 4, autoSelectFamily: false, servername: 'api.telegram.org'` (lines 28–49).
    - Authentic API execution in `callTelegramApi` via native `https.request` targeting `api.telegram.org:443/bot<TOKEN>/${method}` (lines 75–134).
    - Genuinely implements `sendMessage`, `sendPhoto` (multipart buffer upload), `editMessageText`, `getFile`, `downloadFileBuffer`, `deleteWebhook`, `getWebhookInfo`, and `getUpdates` (lines 142–401).
    - `answerCallbackQuery` calls real Telegram API, catching Telegram code 400 (`query is too old`) and returning `{ ok: false, ignored: true, description }` without throwing (lines 264–293).
    - Zero hardcoded bot tokens or secret keys: uses `process.env.TELEGRAM_BOT_TOKEN` (lines 51–57).
  - `src/app/api/telegram/webhook/route.js` (379 lines):
    - Validates `x-telegram-bot-api-secret-token` header against `process.env.TELEGRAM_WEBHOOK_SECRET`, rejecting mismatches with HTTP 401 (lines 64–70).
    - Validates sender ID against `process.env.TELEGRAM_ALLOWED_USER_ID || process.env.TELEGRAM_ALLOWED_USERS` (lines 39–49, 87–99).
    - Wraps `answerCallbackQuery` in `safeAnswerCallback` (lines 52–58).
    - Real session handling via `setTelegramSession`, `getTelegramSession`, `clearTelegramSession`.
  - `scripts/telegram-polling-bridge.mjs` (242 lines):
    - Loads `.env.local` safely (lines 33–58).
    - Deletes active webhook on Telegram (`deleteWebhook`) to switch bot to polling mode (lines 157–167).
    - Authentically invokes `getUpdates` in an async loop with `offset` management and long-polling timeout (lines 191–215).
    - Forwards updates via POST to `http://localhost:3000/api/telegram/webhook` with `x-telegram-bot-api-secret-token` (lines 103–137).
    - Supports `--once` CLI flag for deterministic single-poll execution (lines 211–215).

### 1.2 Empirical Dynamic Validation
- **Outbound Latency Benchmark to Telegram API**:
  Executed:
  ```bash
  node --env-file=.env.local -e '
  async function verify() {
    const { callTelegramApi, telegramAgent } = await import("./src/lib/telegram.js");
    const times = [];
    for (let i = 0; i < 5; i++) {
      const t0 = performance.now();
      const res = await callTelegramApi("getMe");
      const dur = performance.now() - t0;
      times.push(dur);
      console.log(`Call ${i+1}: ${dur.toFixed(1)}ms - bot @${res.username}`);
    }
    const warmAvg = times.slice(1).reduce((a, b) => a + b, 0) / 4;
    console.log("Warm Keep-Alive Latency:", warmAvg.toFixed(1) + "ms (Target < 1000ms)");
    telegramAgent.destroy();
  }
  verify();
  '
  ```
  Result verbatim:
  ```
  Call 1: 642.2ms - bot @FAI_dang_tin_bot
  Call 2: 207.1ms - bot @FAI_dang_tin_bot
  Call 3: 205.6ms - bot @FAI_dang_tin_bot
  Call 4: 205.8ms - bot @FAI_dang_tin_bot
  Call 5: 215.9ms - bot @FAI_dang_tin_bot
  Warm Keep-Alive Latency: 208.6ms (Target < 1000ms)
  ```
  *Bot username `@FAI_dang_tin_bot` verified live directly from Telegram servers.*

- **Polling Bridge Single-Poll Execution**:
  Executed:
  ```bash
  node scripts/telegram-polling-bridge.mjs --once
  ```
  Result verbatim:
  ```
  ════════════════════════════════════════════════════════════
  🚀 FAI Telegram Autonomous Local Polling Bridge
  ════════════════════════════════════════════════════════════
  📍 Webhook Target: http://localhost:3000/api/telegram/webhook
  🔑 Secret Token:   fai_te...2026
  ⚡ Mode:           Single Run (--once)
  🤖 Bot Identity:   @FAI_dang_tin_bot (FAI đăng tin, ID: 8768883845)
  ℹ️ Webhook is already empty (ready for long-polling).
  📡 Starting update loop (timeout: 25s, IPv4 enforced)...

  ✅ [PollingBridge] Single-poll verification complete (--once). Exiting.
  ```
  *Exited cleanly with status code 0.*

- **Webhook Route Security & Resilience**:
  1. Missing secret token:
     `POST http://localhost:3000/api/telegram/webhook` without header -> returned `{"error":"Unauthorized secret token"}` (HTTP 401).
  2. Invalid secret token:
     `POST http://localhost:3000/api/telegram/webhook` with `wrong_secret_123` -> returned `{"error":"Unauthorized secret token"}` (HTTP 401).
  3. Unauthorized sender:
     `POST http://localhost:3000/api/telegram/webhook` with sender ID `999999999` -> returned `{"ok":true,"unauthorized":true}` (HTTP 200).
  4. Expired callback query resilience:
     `POST http://localhost:3000/api/telegram/webhook` with stale query ID `stale_query_test_123` -> returned `{"ok":true}` (HTTP 200) without crashing with HTTP 500.

- **ESLint Cleanliness**:
  Executed:
  ```bash
  npx eslint src/lib/telegram.js src/app/api/telegram/webhook/route.js scripts/telegram-polling-bridge.mjs
  ```
  Result: Exit code 0, 0 errors, 0 warnings.

### 1.3 Security, Git & Deployment Audit
- **Git Status & History**:
  - `git status` confirms untracked/unstaged files only.
  - `git log -1` confirms the last commit is `1bda86c` from earlier by the user (`Thu Sep 3 16:40:11 2026 +0700`).
  - Exactly **0 git commits**, **0 git pushes**, and **0 Vercel deployments** were initiated.
- **Credentials & Secret Hygiene**:
  - `git check-ignore -v .env.local` confirms `.env.local` is ignored by `.gitignore:34:.env*`.
  - Targeted ripgrep scan across all tracked files for the bot token `8768883845` revealed 0 occurrences in git-tracked files. The token exists strictly in `.env.local`.

---

## 2. Logic Chain

1. **Absence of Prohibited Patterns (No Cheating)**:
   - Observation 1.1 confirms that `src/lib/telegram.js` makes authentic HTTPS calls to `api.telegram.org`. There are no dummy mocks, stub returns, or pre-populated response payloads.
   - Observation 1.2 demonstrates that `callTelegramApi('getMe')` dynamically contacts Telegram servers and obtains live data (`@FAI_dang_tin_bot`) with real round-trip network timings.
   - Therefore, the implementation is authentic and contains no facade pattern or hardcoded test bypass.

2. **Fulfillment of Milestone 1 Technical Objectives**:
   - macOS IPv6 connection timeout issue was resolved by enforcing IPv4 resolution and custom HTTPS agent socket creation (`tls.connect` with `family: 4`).
   - Empirical latency test measured warm average latency at **208.6ms**, easily satisfying the < 1000ms requirement.
   - Expired callback queries (HTTP 400 from Telegram API) are intercepted and resolved gracefully, eliminating HTTP 500 crashes and unhandled promise rejections.
   - Autonomous local polling bridge (`scripts/telegram-polling-bridge.mjs`) correctly handles webhook state, long-polling, and payload forwarding with secret tokens.

3. **Compliance with User & Project Constraints**:
   - `ORIGINAL_REQUEST.md` (2026-09-03T15:13:01Z) sets `Integrity mode: development` and mandates local execution without git commits/pushes or Vercel deployments.
   - Observation 1.3 confirms strict compliance: zero commits, zero pushes, zero remote deployments, and all credentials stored securely in `.env.local`.

---

## 3. Caveats

1. **Adversarial Edge-Case Findings (Robustness Recommendations)**:
   - In `src/app/api/telegram/webhook/route.js` line 280, if an incoming update provides a malformed `message.photo` array with null elements (e.g. `[null]`), `highestPhoto` is null, causing a TypeError on `.file_id`. (Normal Telegram clients will never send `[null]`, but defensive null checking `if (highestPhoto?.file_id)` is recommended).
   - In `scripts/telegram-polling-bridge.mjs`, when terminating via SIGINT/SIGTERM during an active 25s long-poll, the Node process waits for the pending HTTPS socket to close before exiting unless an `AbortController` is attached to abort the socket immediately.
2. **Local Environment Only**:
   - `scripts/telegram-polling-bridge.mjs` is intended strictly for local development. In production on Vercel, Telegram webhook must be registered with the production domain.
3. **Single Polling Concurrency**:
   - Running multiple bridge instances concurrently will cause Telegram HTTP 409 Conflict errors.

---

## 4. Conclusion

**Verdict**: **`CLEAN`**

The Milestone 1 work product delivered by `worker_m1` is authentic, secure, robust, and meets all specification requirements. No integrity violations, dummy facades, hardcoded test results, or credential leaks were detected.

---

## 5. Verification Method

To independently reproduce the forensic audit:

1. **Verify Outbound Latency (< 1000ms)**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node --env-file=.env.local -e '
   async function verify() {
     const { callTelegramApi, telegramAgent } = await import("./src/lib/telegram.js");
     for (let i = 0; i < 5; i++) {
       const t0 = performance.now();
       const res = await callTelegramApi("getMe");
       console.log(`Call ${i+1}: ${(performance.now() - t0).toFixed(1)}ms (@${res.username})`);
     }
     telegramAgent.destroy();
   }
   verify();
   '
   ```

2. **Verify Polling Bridge**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node scripts/telegram-polling-bridge.mjs --once
   ```

3. **Verify Webhook Authorization & Resilient Callback Handling**:
   ```bash
   # Unauthorized secret test (expect 401)
   curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -d '{"update_id":1}'

   # Expired callback test (expect 200)
   curl -s -w "\nHTTP_STATUS: %{http_code}\n" -X POST http://localhost:3000/api/telegram/webhook \
     -H "Content-Type: application/json" \
     -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" \
     -d '{"update_id":999,"callback_query":{"id":"stale_test","from":{"id":2050406425},"message":{"chat":{"id":2050406425}},"data":"cat_test"}}'
   ```

4. **Verify Git & Deployment Hygiene**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   git status
   git log -1 --oneline
   ```
