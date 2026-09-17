## 2026-09-03T16:14:07Z
You are worker_m2.
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

1. Read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T15:13:01Z).
2. Read /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md.
3. Read the Gemini & Fallback blueprint at:
   /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_gemini/handoff.md

Your exclusive write ownership:
- `fai/src/lib/contentFallback.js`
- `fai/src/lib/gemini.js`
- `fai/src/app/api/telegram/webhook/route.js`

Your assignment:
1. Create `src/lib/contentFallback.js`:
   - Implement `generateFallbackArticleOptions(userNotes, options)` based on Section 4.1 of `explorer_survey_gemini/handoff.md`.
   - Generates 2 distinct Vietnamese editorial options:
     * Option 1: Analytical, career, industry practical.
     * Option 2: Inspiring narrative, student experience, human-centric.
   - Adhere strictly to typography constraints:
     * `title`: string < 100 characters.
     * `excerpt`: string 120-220 characters.
     * `readTime`: string (e.g. "3 phút", "4 phút").
     * `contentHtml`: semantic HTML using `<h3>`, `<p>`, `<blockquote>`, `<ul>`, `<li>`, `<strong>`, `<em>`. Strictly NO `<h1>` or `<h2>`.
   - Specialized branches for:
     * Wireframing / UI/UX Design
     * AI-First Software Developer
     * THPT Gesture AI
     * General FAI Campus / Innovation
2. Hook into `src/lib/gemini.js`:
   - Import `generateFallbackArticleOptions`.
   - If `!apiKey || apiKey.trim() === ''`: seamlessly engage fallback pipeline and return fallback options with `isFallback: true` (ZERO crash).
   - In `catch (apiError)`: fallback seamlessly and log warning.
3. Verify in `src/app/api/telegram/webhook/route.js`:
   - Ensure `optionsResult` is saved to `telegram_sessions` under `step: 'AWAITING_OPTION_SELECTION'`.
   - Present the 2 options to Telegram with inline buttons `1️⃣ Chọn Phương Án 1` and `2️⃣ Chọn Phương Án 2`.
4. Test and verify:
   - Test generating options for all 3 Aptech topics and generic topics with empty `GEMINI_API_KEY`.
   - Assert all character lengths, HTML tags, and schema compatibility.
   - Run ESLint on touched files.
5. Write handoff report in `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2/handoff.md` and notify orchestrator_6 via send_message.
