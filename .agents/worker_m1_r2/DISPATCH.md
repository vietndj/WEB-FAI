## 2026-09-03T15:52:00Z

<USER_REQUEST>
You are worker_m1_r2.
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_r2
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

1. Read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T15:13:01Z).
2. Read /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md.
3. Read the Explorer handoff report and patch:
   - `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_3/handoff.md`
   - `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_3/reviewer_2_fixes.patch`
   - `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_1/handoff.md`
4. Apply the 5 fixes:
   - In `src/app/api/telegram/webhook/route.js`:
     * Safeguard `request.json()` with try/catch returning HTTP 400 Bad Request on syntax error or invalid body.
     * Sanitize `message.photo` with `.filter((p) => p && typeof p.file_id === 'string')`. If empty, return HTTP 200 `{ ok: true }` without crashing.
   - In `scripts/telegram-polling-bridge.mjs`:
     * Register `SIGINT` and `SIGTERM` listeners synchronously at the top level so signals during startup are cleanly handled.
     * Only advance `offset` if `forwardUpdate` succeeded, or back off and retry on connection failures to prevent message loss.
   - In `src/lib/telegram.js`:
     * Make `rejectUnauthorized` configurable: use `process.env.NODE_ENV === 'production' && process.env.ALLOW_INSECURE_TLS !== 'true' ? true : false`.
5. Run tests:
   - Run `node scripts/challenger-empirical-m1.mjs` or your own test script verifying that malformed photo payloads return HTTP 200, malformed JSON returns HTTP 400, and bridge startup handles signals cleanly.
   - Run ESLint on touched files.
6. Write /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_r2/handoff.md and notify orchestrator_6.
</USER_REQUEST>
