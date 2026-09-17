# BRIEFING — 2026-09-03T15:23:00Z

## Mission
Investigate Telegram bot (@FAI_dang_tin_bot) callback/button issue, webhook vs polling, macOS TLS/network issues, and design a robust local polling bridge.

## 🔒 My Identity
- Archetype: explorer
- Roles: survey, investigate, synthesize, handoff
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_telegram
- Original parent: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Milestone: Telegram Bot Polling & Callback Fix Investigation

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do NOT expose private secrets/keys from .env in reports or messages
- Local development mode rule: No git commit/push, no production deploy
- Communication protocol: send_message to parent (916b86d0-d46f-4ff6-91f5-41089eb9b647)

## Current Parent
- Conversation ID: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Updated: 2026-09-03T15:23:00Z

## Investigation State
- **Explored paths**: `fai/.env.local`, `src/lib/telegram.js`, `src/lib/telegramSession.js`, `src/app/api/telegram/webhook/route.js`, `src/lib/gemini.js`, `src/lib/imageProcessor.js`, `src/lib/cloudStorage.js`, `src/lib/firestore.js`, `https://aptech.fpt.edu.vn/tin-tuc`
- **Key findings**:
  1. Telegram Webhook URL is empty (`""`), and local Next.js runs on `http://localhost:3000`, so no inbound updates reach the app without a local polling bridge (`getUpdates`).
  2. IPv6 routing black-hole to `api.telegram.org` causes default Node.js DNS (`verbatim`) to stall for 14.7s on connect timeouts before falling back to IPv4. Enforcing IPv4 (`dns.setDefaultResultOrder('ipv4first')` or `family: 4`) cuts latency to 226ms - 709ms (< 1s).
  3. `answerCallbackQuery` errors on expired queries are unhandled in `route.js`, causing HTTP 500 crash and freezing user session.
  4. `GEMINI_API_KEY` is empty in `.env.local`, requiring an intelligent fallback content generator.
  5. Target 3 Aptech articles and high-res images crawled and verified.
- **Unexplored areas**: None. All tasks investigated with empirical data.

## Key Decisions Made
- Confirmed local polling bridge architecture with `deleteWebhook`, `getUpdates` long-polling, secret token forwarding, and IPv4-first connection pooling.
- Verified exact URLs and assets for the 3 Aptech articles.

## Artifact Index
- DISPATCH.md — Task instructions
- BRIEFING.md — Situational awareness
- progress.md — Liveness & status log
- handoff.md — Comprehensive investigation report
