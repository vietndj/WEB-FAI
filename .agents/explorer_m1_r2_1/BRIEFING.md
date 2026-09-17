# BRIEFING — 2026-09-03T15:51:20Z

## Mission
Investigate and design line-by-line implementation strategy for 4 resilience & stability issues identified in Telegram bot webhook & polling bridge.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_1
- Original parent: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Milestone: milestone 1 round 2

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do NOT directly modify source code in fai
- Write only to your folder: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m1_r2_1/

## Current Parent
- Conversation ID: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Updated: 2026-09-03T15:48:02Z

## Investigation State
- **Explored paths**:
  - `src/app/api/telegram/webhook/route.js` (lines 70-100, 275-320, 360-379)
  - `scripts/telegram-polling-bridge.mjs` (lines 60-242)
  - `src/lib/telegram.js` (lines 30-60, 320-355)
  - `scripts/challenger-empirical-m1.mjs` (suites 1, 2, 3)
  - `.agents/reviewer_m1_bot_2/handoff.md` (section 1.3)
- **Key findings**:
  - Issue 1: `message.photo` with null or invalid entries crashes with unhandled TypeError on `highestPhoto.file_id`, returning HTTP 500 and causing Telegram retry storms.
  - Issue 2: Signal listeners in `telegram-polling-bridge.mjs` are registered after 3 async startup calls (`getMe`, `getWebhookInfo`, `deleteWebhook`), causing missed signals during startup and `exit code: null`.
  - Issue 3: `offset` was unconditionally incremented even when `forwardUpdate` failed (due to Next.js reboot / downtime), causing permanent dropped updates.
  - Issue 4: `request.json()` syntax errors bubbled to top-level catch and returned HTTP 500 instead of HTTP 400 Bad Request; non-object JSON bodies also caused destructuring TypeErrors.
- **Unexplored areas**: None for this scope.

## Key Decisions Made
- Provided complete line-by-line replacement strategies and verification commands for worker implementer.
- Authored 5-component handoff report in `handoff.md`.

## Artifact Index
- `DISPATCH.md` — Incoming task dispatch instructions
- `BRIEFING.md` — Persistent working memory index
- `progress.md` — Heartbeat and status log
- `handoff.md` — Comprehensive 5-component handoff report with implementation strategy
