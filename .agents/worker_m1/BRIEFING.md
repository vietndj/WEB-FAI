# BRIEFING — 2026-09-03T22:39:00+07:00

## Mission
Implement Milestone 1: Telegram IPv4 Network Optimization, Resilient Webhook Callback Handling, and Standalone Autonomous Polling Bridge (`fai/src/lib/telegram.js`, `fai/src/app/api/telegram/webhook/route.js`, `fai/scripts/telegram-polling-bridge.mjs`).

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1
- Original parent: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Milestone: M1 - Cloud Storage & Image Optimization Pipeline
- Re-assigned parent: 916b86d0-d46f-4ff6-91f5-41089eb9b647 (orchestrator_6)
- Current Milestone: M1 - Telegram IPv4 Network Optimization & Local Polling Bridge

## 🔒 Key Constraints
- Strict Local Development Only: TẠM THỜI KHÔNG tự động chạy git commit / git push, KHÔNG deploy lên Vercel Production.
- DO NOT TOUCH: src/app/globals.css, public/fonts/*, src/app/lien-he/page.js, src/components/ScholarshipFormSection.jsx, Arena100hFormSection.jsx, Skillking100hFormSection.jsx.
- Integrity Mandate: Genuine implementation, no hardcoded results/dummy facades. Real S3 upload to Cloudflare R2, real sharp image processing.
- Exclusive write ownership: `fai/src/lib/telegram.js`, `fai/src/app/api/telegram/webhook/route.js`, `fai/scripts/telegram-polling-bridge.mjs`. Do NOT modify other files.
- macOS TLS & IPv6 resolution: enforce IPv4 DNS order and family: 4 https.Agent to eliminate 15s connection timeouts.
- Latency target: all Telegram API calls must resolve in < 1 second.
- answerCallbackQuery resilience: never crash or return 500 when query is expired/too old.

## Current Parent
- Conversation ID: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Updated: 2026-09-03T22:39:00+07:00

## Task Summary
- **What to build**:
  1. Optimize `src/lib/telegram.js`:
     - IPv4 resolution via `dns.setDefaultResultOrder('ipv4first')`.
     - `https.Agent({ keepAlive: true, family: 4, rejectUnauthorized: false })` with `createConnection` override enforcing `tls.connect` with IPv4, `autoSelectFamily: false`, and `rejectUnauthorized: false`.
     - macOS TLS/cert issue handling, latency < 1s.
     - Safe `answerCallbackQuery` wrapper ignoring HTTP 400 (`query is too old`).
  2. Optimize `src/app/api/telegram/webhook/route.js`:
     - Safeguard callback query handling against uncaught errors using `safeAnswerCallback`.
  3. Build `scripts/telegram-polling-bridge.mjs`:
     - Long-polling bridge loading `.env.local`.
     - `deleteWebhook({ drop_pending_updates: false })` on start.
     - `getUpdates` with timeout 25, offset, IPv4 agent.
     - Forward to `http://localhost:3000/api/telegram/webhook` with `x-telegram-bot-api-secret-token`.
     - Exponential backoff retry logic.
     - `--once` flag support for clean testing/verification.
  4. Benchmark & Test:
     - Compare Telegram API latency before and after IPv4 optimization (< 1s).
     - Verify simulated update forwarding to local webhook with 200 OK across 7 test cases.
  5. Document in `handoff.md` and update `progress.md`.
- **Success criteria**:
  - Outbound latency < 1s (warm keep-alive average ~350-740ms).
  - Zero 500 crashes on expired callback queries (HTTP 200 returned).
  - Polling bridge starts, deletes webhook, long-polls, forwards updates with secret token header, handles errors gracefully, and `--once` exits 0.

## Key Decisions Made
- In `src/lib/telegram.js`, overrode `telegramAgent.createConnection` with `tls.connect` specifying `{ family: 4, autoSelectFamily: false, rejectUnauthorized: false, servername: 'api.telegram.org' }`. This bypasses Undici's Happy Eyeballs socket stalls on macOS and enforces strict IPv4 routing across all requests.
- In `callTelegramApi`, used per-request `AbortController` instead of `req.setTimeout`, preventing socket pool timeout leaks from aborting idle keepalive sockets.
- In `getUpdates`, dynamically calculated HTTP request timeout as `(timeoutSec + 15) * 1000`, ensuring long-polling requests (25s) never trigger spurious client-side timeouts.
- In `src/app/api/telegram/webhook/route.js`, introduced `safeAnswerCallback` helper to catch and log non-fatal callback acknowledgment errors, ensuring session state transitions always complete even if Telegram rejects an expired callback query ID.
- In `scripts/telegram-polling-bridge.mjs`, configured `--once` mode to use `timeout: 0` for instant, non-blocking verification passes.

## Artifact Index
- DISPATCH.md — Assignment instructions
- BRIEFING.md — Working memory & state
- progress.md — Liveness heartbeat
- handoff.md — 5-component handoff report

## Change Tracker
- **Files modified**:
  - `fai/src/lib/telegram.js`: Enforced IPv4, keepAlive HTTPS agent, createConnection TLS override, safe answerCallbackQuery, deleteWebhook/getUpdates exports
  - `fai/src/app/api/telegram/webhook/route.js`: Safeguarded category, option, and cancel callback queries with safeAnswerCallback
  - `fai/scripts/telegram-polling-bridge.mjs`: Built autonomous long-polling bridge with .env.local loader, webhook deletion, IPv4 polling, update forwarding, exponential backoff, and --once flag
- **Build status**: PASS
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (All 7 Webhook integration test scenarios passed, bridge `--once` passed with code 0)
- **Lint status**: PASS (0 errors, 0 warnings on modified files via ESLint)
- **Tests added/modified**: 7-scenario integration test covering auth, unauthorized sender, valid commands, callbacks, and expired queries

## Loaded Skills
None
