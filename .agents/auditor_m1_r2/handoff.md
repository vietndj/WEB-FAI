# Forensic Audit Report: Milestone 1 Round 2

**Agent**: `auditor_m1_r2`  
**Roles**: critic, specialist, auditor  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/auditor_m1_r2`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Integrity Mode**: Development (per `ORIGINAL_REQUEST.md`)  
**Verdict**: **`CLEAN`** (Zero Integrity Violations Detected)

---

## 1. Observation

Direct empirical observations gathered through independent source inspection and command execution:

### 1.1 Source Code Inspection (Target Files)
1. **`src/lib/telegram.js`**:
   - Lines 60–66: `getBotToken()` strictly reads `process.env.TELEGRAM_BOT_TOKEN`. Throws an explicit error if missing; contains no fallback hardcoded token or mock responses.
   - Lines 95–110: `callTelegramApi(method, payload, callOptions)` executes an authentic `https.request` targeting `hostname: 'api.telegram.org'`, `port: 443`, `path: /bot${token}/${method}` using IPv4-forced TLS connections.
   - Lines 176–262: `sendPhoto` performs authentic `multipart/form-data` uploads to `https://api.telegram.org/bot${token}/sendPhoto`.
   - Lines 334–380: `downloadFileBuffer` fetches the binary buffer directly from `https://api.telegram.org/file/bot${token}/${filePath}`.
   - Lines 25–34 & 43: TLS `rejectUnauthorized` is dynamically governed by `process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_TLS !== 'true' && process.env.TELEGRAM_INSECURE_TLS !== 'true'`.
   - No mock facades or fake responses exist in this module.

2. **`scripts/telegram-polling-bridge.mjs`**:
   - Lines 30–42: `SIGINT` and `SIGTERM` listeners are registered synchronously at the top level before dynamic imports and asynchronous calls.
   - Lines 168–184: Real verification of bot identity via `await callTelegramApi('getMe')` and webhook status checking via `await getWebhookInfo()` / `deleteWebhook({ drop_pending_updates: false })`.
   - Lines 198–236: Long-polling `getUpdates()` loop with resilient retry logic: updates are forwarded to the local webhook endpoint (`http://localhost:3000/api/telegram/webhook`) with `x-telegram-bot-api-secret-token`; update `offset` is incremented only upon verified delivery or permanent client rejection (4xx), preserving updates if the local server is temporarily unavailable.
   - Lines 88–101: Secrets (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`) are read from `process.env` (loaded from `.env.local`). Secrets printed in console logs are masked (`webhookSecret.slice(0, 6)}...`).

3. **`src/app/api/telegram/webhook/route.js`**:
   - Lines 64–70: Validates incoming `x-telegram-bot-api-secret-token` against `process.env.TELEGRAM_WEBHOOK_SECRET`, returning `401 Unauthorized` on mismatch or missing header.
   - Lines 73–89: Robust JSON parsing handling `SyntaxError` and invalid object types (primitives, arrays, null) returning `400 Bad Request` (`{ error: 'Bad Request', details: 'Invalid JSON payload' }`).
   - Lines 39–49 & 104–116: Enforces sender whitelist via `process.env.TELEGRAM_ALLOWED_USER_ID`, rejecting unauthorized senders with `unauthorized: true`.
   - Lines 297–302: Robust photo array filtering (`message.photo.filter((p) => p && typeof p.file_id === 'string')`), returning `NextResponse.json({ ok: true })` on malformed photo payloads without crashing.
   - Genuine integrations with Firestore (`getCategories`, `createPost`), Cloudflare R2 (`uploadToStorage`), Sharp (`processImage`), and Telegram API (`sendMessage`, `answerCallbackQuery`, `downloadFileBuffer`).

### 1.2 Live Empirical Connectivity to `api.telegram.org`
Executing a direct call to Telegram API using credentials loaded from `.env.local`:
- Command:
  ```bash
  node --env-file=.env.local -e "
  import('./src/lib/telegram.js').then(async ({ callTelegramApi, getWebhookInfo }) => {
    const me = await callTelegramApi('getMe');
    console.log('TELEGRAM GETME RESULT:', JSON.stringify(me));
    const wh = await getWebhookInfo();
    console.log('TELEGRAM WEBHOOK INFO:', JSON.stringify(wh));
  });
  "
  ```
- Verbatim Response:
  ```json
  TELEGRAM GETME RESULT: {"id":8768883845,"is_bot":true,"first_name":"FAI đăng tin","username":"FAI_dang_tin_bot","can_join_groups":true,"can_read_all_group_messages":false,"supports_inline_queries":false,"supports_guest_queries":false,"can_connect_to_business":false,"has_main_web_app":false,"has_topics_enabled":false,"allows_users_to_create_topics":false,"can_manage_bots":false,"supports_join_request_queries":false}
  TELEGRAM WEBHOOK INFO: {"url":"","has_custom_certificate":false,"pending_update_count":0,"allowed_updates":["message","callback_query"]}
  ```
- Without environment variables loaded, `src/lib/telegram.js` threw `Error: TELEGRAM_BOT_TOKEN is missing from environment variables.`, proving absence of hardcoded fallback mock data.

### 1.3 Polling Bridge Single-Run Execution
- Command: `node scripts/telegram-polling-bridge.mjs --once`
- Output:
  ```
  🚀 FAI Telegram Autonomous Local Polling Bridge
  📍 Webhook Target: http://localhost:3000/api/telegram/webhook
  🔑 Secret Token:   fai_te...2026
  ⚡ Mode:           Single Run (--once)
  🤖 Bot Identity:   @FAI_dang_tin_bot (FAI đăng tin, ID: 8768883845)
  ℹ️ Webhook is already empty (ready for long-polling).
  📡 Starting update loop (timeout: 25s, IPv4 enforced)...
  ✅ [PollingBridge] Single-poll verification complete (--once). Exiting.
  ```
- Exit code: `0`.

### 1.4 Direct Adversarial HTTP Assertions on Webhook Endpoint
- **Test 1 (Malformed JSON)**:
  `curl -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" -d '{"broken":'`
  -> Response: `{"error":"Bad Request","details":"Invalid JSON payload"}` (HTTP 400).
- **Test 2 (Malformed Photo Payload `[null]`)**:
  `curl -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" -d '{"update_id":9999,"message":{"from":{"id":2050406425,"first_name":"Admin"},"chat":{"id":2050406425},"photo":[null]}}'`
  -> Response: `{"ok":true}` (HTTP 200).
- **Test 3 (Missing Secret Token)**:
  `curl -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -d '{"test":1}'`
  -> Response: `{"error":"Unauthorized secret token"}` (HTTP 401).
- **Test 4 (Invalid Secret Token)**:
  `curl -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -H "x-telegram-bot-api-secret-token: wrong_token" -d '{"test":1}'`
  -> Response: `{"error":"Unauthorized secret token"}` (HTTP 401).
- **Test 5 (Unauthorized User ID)**:
  `curl -X POST http://localhost:3000/api/telegram/webhook -H "Content-Type: application/json" -H "x-telegram-bot-api-secret-token: fai_telegram_secret_token_2026" -d '{"update_id":12345,"message":{"from":{"id":99999999,"first_name":"Attacker"},"chat":{"id":99999999},"text":"/start"}}'`
  -> Response: `{"ok":true,"unauthorized":true}` (HTTP 200).

### 1.5 Automated Empirical Test Suites
1. **Targeted Reviewer 2 Verification** (`scripts/verify-reviewer-2-fixes.mjs`):
   - Results: **18 passed, 0 failed**.
   - Verdict: `ALL FIXES VERIFIED SUCCESSFULLY`, exit code 0.
2. **Empirical Challenger Suite** (`scripts/challenger-empirical-m1.mjs`):
   - Scope: Concurrency bursts (5, 10, 15 parallel calls), connection pool keep-alive inspection, 10 expired callback queries, adversarial payload injections, OS signals (SIGINT/SIGTERM/--once).
   - Results: **39 passed, 0 failed**.
   - Verdict: `APPROVE`, exit code 0.
3. **ESLint Code Quality Check**:
   - Command: `npx eslint src/lib/telegram.js src/app/api/telegram/webhook/route.js scripts/telegram-polling-bridge.mjs scripts/challenger-empirical-m1.mjs scripts/verify-reviewer-2-fixes.mjs`
   - Results: Exit code 0, 0 errors, 0 warnings.

### 1.6 Git & Deployment Constraints Verification
- `git status` in `/Users/vietmac/Documents/CODE/WEB- FAI`: Working directory clean with respect to git tracking; unstaged submodule changes only.
- `git status` in `/Users/vietmac/Documents/CODE/WEB- FAI/fai`: All modifications are unstaged working copy changes. No commits added.
- `git log -n 1 --stat`: Last commit is `1bda86c` dated `Thu Sep 3 16:40:11 2026 +07:00` (pre-sprint).
- Commit count during this sprint: **0**.
- Git pushes: **0**.
- Vercel deployments: **0**.
- Credential leaks: **None** (`.env.local` is gitignored via `.env*` in `.gitignore`, no secrets in tracked files).

---

## 2. Logic Chain

1. **Absence of Mock Facades**:
   - *Observation*: Source inspection of `src/lib/telegram.js`, `route.js`, and `telegram-polling-bridge.mjs` reveals zero stubbed responses, mock objects, or bypassed network calls.
   - *Logic*: All methods delegate directly to native Node.js `https.request` against `api.telegram.org` or to legitimate Next.js response helpers after performing genuine logic.
2. **Authentic Network Execution**:
   - *Observation*: Live execution of `callTelegramApi('getMe')` and `getWebhookInfo()` via Node.js contacted `api.telegram.org` and returned the live Telegram bot state for `@FAI_dang_tin_bot` (ID: 8768883845).
   - *Logic*: The network transport operates against official Telegram servers over TLS IPv4 keep-alive sockets without mock interceptors.
3. **Secure Credential Management**:
   - *Observation*: All tokens and secrets are accessed exclusively through `process.env`. If `TELEGRAM_BOT_TOKEN` is unset, execution halts with a missing variable error. `.env.local` is excluded by `.gitignore` (`.env*`).
   - *Logic*: Credential handling complies with development mode integrity requirements and prevents repository leaks.
4. **Adherence to Local-Only Constraints**:
   - *Observation*: `git status` and `git log` show zero commits created, zero pushes to remote, and no Vercel deployments triggered.
   - *Logic*: The user's explicit local-development-only constraints (`GEMINI.md` and `ORIGINAL_REQUEST.md`) have been strictly observed.

---

## 3. Caveats

- In development mode on macOS, `process.env.NODE_ENV !== 'production'` intentionally configures `rejectUnauthorized: false` in `src/lib/telegram.js` to prevent local TLS interception failures. In production (`NODE_ENV === 'production'`), strict certificate verification (`rejectUnauthorized: true`) is enforced by default.
- No other caveats or untested areas exist within Milestone 1.

---

## 4. Conclusion

**Verdict: `CLEAN`**

All components in Milestone 1 Round 2 (`src/app/api/telegram/webhook/route.js`, `scripts/telegram-polling-bridge.mjs`, `src/lib/telegram.js`) are genuine, robust, and free from mocks or facades. All 5 fixes identified by Reviewer 2 have been empirically verified. All user constraints regarding local development, credential safety, and zero git commits/pushes/deployments have been fully satisfied.

---

## 5. Verification Method

To reproduce and independently confirm the findings:

1. **Verify Live Telegram API Connection**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node --env-file=.env.local -e "
   import('./src/lib/telegram.js').then(async ({ callTelegramApi }) => {
     console.log(await callTelegramApi('getMe'));
   });
   "
   ```
   *Expected*: Returns genuine bot JSON: `id: 8768883845`, `username: "FAI_dang_tin_bot"`.

2. **Verify Polling Bridge Single-Poll**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node scripts/telegram-polling-bridge.mjs --once
   ```
   *Expected*: Exits with code 0.

3. **Execute Reviewer 2 Targeted Verification**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node scripts/verify-reviewer-2-fixes.mjs
   ```
   *Expected*: 18/18 PASS, Verdict: `ALL FIXES VERIFIED SUCCESSFULLY`.

4. **Execute Full Challenger Empirical Suite**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node scripts/challenger-empirical-m1.mjs
   ```
   *Expected*: 39/39 PASS, Verdict: `APPROVE`.

5. **Verify Zero Git Commits**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   git log -n 1 --stat
   git status
   ```
   *Expected*: HEAD commit remains `1bda86c`, changes are unstaged.
