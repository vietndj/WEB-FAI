# BRIEFING — 2026-09-03T08:57:00Z

## Mission
Investigate R2 & R4: Telegram Bot Webhook & AI 2-Option Publishing Flow + Security for FAI Web.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigator, synthesizer
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_telegram_ai
- Original parent: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Milestone: M1_EXPLORATION_R2_R4

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code in fai
- Focus strictly on R2 & R4: Telegram Bot Webhook, Gemini AI 2-option generation, Telegram security/whitelist, Firestore categories & state management
- Local development mode compliance: no git commit/push, no production deploys

## Current Parent
- Conversation ID: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `fai/package.json`: Next.js 16.2.9, React 19.2.4, Firebase 12.17.1 (no telegram/gemini SDKs).
  - `fai/src/app/`: Checked API routes; `src/app/api` does not exist yet.
  - `fai/src/lib/firestore.js` & `scripts/migrate-doi-song.js`: Schema for 5 categories in `doi-song` and `posts` documents.
  - `fai/src/app/doi-song/page.js`: Dynamic rendering of `categoryBlocks` and article modal with `dangerouslySetInnerHTML`.
  - `fai/src/app/admin/layout.js`: Firebase Auth check with redirect to `/admin/login`.
  - `fai/.env.local`: Missing `TELEGRAM_*` and `GEMINI_*` env variables.
- **Key findings**:
  - Webhook route should be `src/app/api/telegram/webhook/route.js` with `export const dynamic = 'force-dynamic'` and `export const runtime = 'nodejs'`.
  - Telegram integration can be 100% zero-dependency using native Node.js `fetch`.
  - Security validated via `X-Telegram-Bot-Api-Secret-Token` and `TELEGRAM_ALLOWED_USERS` whitelist.
  - Multi-step bot session state should be maintained in Firestore collection `telegram_sessions` to survive serverless restarts.
  - Gemini 2.5 Flash prompt strategy uses multimodal vision + JSON Schema structured outputs for 2 distinct editorial angles.
  - Telegram HTML formatting constraint identified: web HTML tags (`<h3>`, `<p>`, `<ul>`, etc.) must not be passed to Telegram's HTML parser to avoid 400 Bad Request; preview is formatted cleanly, while raw HTML is preserved for Firestore `posts`.
- **Unexplored areas**: None for R2 & R4; ready for worker implementation.

## Key Decisions Made
- Architecture finalized and detailed in `analysis.md`.
- 5-component handoff report prepared in `handoff.md`.

## Artifact Index
- DISPATCH.md — record of incoming dispatch instructions
- BRIEFING.md — persistent state and context tracking
- progress.md — heartbeat and step tracking
- analysis.md — detailed technical investigation and architectural blueprint
- handoff.md — 5-component handoff report for parent/orchestrator
