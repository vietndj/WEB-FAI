# BRIEFING — 2026-09-03T22:20:00+07:00

## Mission
Investigate Gemini API integration in WEB-FAI codebase, .env.local configuration, design a resilient Fallback Content Pipeline for 2 article options, and inspect pending state storage.

## 🔒 My Identity
- Archetype: explorer
- Roles: survey, investigation, synthesis
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_gemini
- Original parent: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Milestone: Milestone 6 - Telegram Bot AI Draft Generation & Gemini Survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement directly in src/
- Only write metadata and reports inside /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_gemini/
- Adhere to local development rules: no git commit/push, no vercel deploy

## Current Parent
- Conversation ID: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Updated: 2026-09-03T22:20:00+07:00

## Investigation State
- **Explored paths**:
  - `fai/.env.local`: Confirmed `GEMINI_API_KEY=` is empty; `GEMINI_MODEL=gemini-2.5-flash`.
  - `fai/src/lib/gemini.js`: Verified `@google/genai` usage, `DEFAULT_MODEL`, strict throw when apiKey missing.
  - `fai/src/app/api/telegram/webhook/route.js`: Investigated photo handling, session transitions, and error abort when Gemini throws.
  - `fai/src/lib/telegramSession.js`: Audited Firestore collection `telegram_sessions` for storing `generatedOptions` (`option1`, `option2`).
  - `fai/src/app/doi-song/page.js` & `article.css`: Verified article rendering, modal display, and typography styling for HTML tags (`h3`, `p`, `blockquote`, `ul`, `li`).
  - `fai/src/app/admin/posts/[id]/page.js`: Confirmed TipTap editor compatibility with generated HTML schema.
- **Key findings**:
  - Currently, missing `GEMINI_API_KEY` throws a hard error in `src/lib/gemini.js` line 80, causing the Telegram webhook to send an error message and abort the publishing flow.
  - Session state is persisted in Firestore document `telegram_sessions/${chatId}` with `{ option1, option2 }`.
  - An Intelligent Fallback Pipeline can be modularized in `src/lib/contentFallback.js` and hooked into `src/lib/gemini.js` to guarantee zero crashes and zero 500 errors.
  - Regex keyword nuance: "Wireframing" does not contain "wireframe" due to the dropped 'e', requiring `/wirefram/i`.
- **Unexplored areas**: None for this survey scope. All 5 pillars investigated and empirically validated.

## Key Decisions Made
- Architecture: Fallback generator placed in `src/lib/contentFallback.js` and automatically triggered by `src/lib/gemini.js` whenever `apiKey` is empty or the Google GenAI call encounters errors/timeouts.
- Headline & Content Strategy: Decompose titles and match domain keywords to produce:
  - Option 1: Tin tức & Góc nhìn chuyên sâu / Thực chiến (Báo chí, phân tích, chuẩn kỹ năng doanh nghiệp).
  - Option 2: Câu chuyện truyền cảm hứng / Trải nghiệm thực tế (Cảm xúc, câu chuyện FAI Life, tinh thần vượt ngưỡng).
- Strict constraints enforced: Title < 100 chars, Excerpt 120-220 chars, Semantic HTML with `<h3>` (no `<h1>` or `<h2>`).

## Artifact Index
- DISPATCH.md — Initial task dispatch
- BRIEFING.md — Persistent working memory
- progress.md — Liveness heartbeat
- handoff.md — Comprehensive 5-component handoff report
