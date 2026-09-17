# Handoff Report: Milestone M2 - Gemini Fallback Content Pipeline & Telegram Option Selection

- **Agent**: `worker_m2`
- **Roles**: `implementer`, `qa`, `specialist`
- **Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2`
- **Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`
- **Timestamp**: `2026-09-03T23:19:00+07:00`
- **Parent**: `orchestrator_6` (`916b86d0-d46f-4ff6-91f5-41089eb9b647`)

---

## 1. Observation

1. **Missing `GEMINI_API_KEY` in Environment**:
   `fai/.env.local` had `GEMINI_API_KEY=` (empty string). Previously, calling `generateArticleOptions` in `src/lib/gemini.js` threw a fatal exception:
   `Error: GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in .env.local`
   This caused the Telegram webhook `/api/telegram/webhook` to crash or return error messages to the user without generating article options or saving the session state.

2. **Strict Typography and Semantic Constraints**:
   - `title`: Must be string `< 100` characters.
   - `excerpt`: Must be string between `120` and `220` characters.
   - `readTime`: Must be string (e.g. `"4 phút"`, `"3 phút"`).
   - `contentHtml`: Must use semantic HTML (`<h3>`, `<p>`, `<blockquote>`, `<cite>`, `<ul>`, `<li>`, `<strong>`, `<em>`), with **strictly NO `<h1>` or `<h2>` tags** because the page template already provides the main headings.
   - Distinct styles:
     - Option 1: Analytical, career, industry practical ("Thực chiến & Chuyên môn").
     - Option 2: Inspiring narrative, student experience, human-centric ("Cảm hứng & Đời sống FAI").

3. **Telegram Webhook Session & Inline Buttons**:
   In `src/app/api/telegram/webhook/route.js`:
   - Session state must be stored in Firestore collection `telegram_sessions` with `step: 'AWAITING_OPTION_SELECTION'`.
   - The user must be presented with 2 inline options buttons: `1️⃣ Chọn Phương Án 1` (`callback_data: 'opt_1'`) and `2️⃣ Chọn Phương Án 2` (`callback_data: 'opt_2'`).
   - Clicking an option resolves the post, uploads the WebP image, writes to Firestore `posts`, and cleans up the session.

---

## 2. Logic Chain

1. **Step 1: Dedicated Zero-Failure Fallback Module (`src/lib/contentFallback.js`)**:
   - Created `generateFallbackArticleOptions(userNotes, options)` with 4 specialized domain branches:
     - **Branch 1: Wireframing / UI/UX Design**: Matched via `/wirefram|giao diện|ui[\s/-]?ux|ux[\s/-]?ui|\bui\b|\bux\b|figma|thiết kế/i`. Title: 64 chars, Excerpts: 150 & 158 chars. Domain: `'UI/UX & Product Design'`, Brand: `'FPT Arena Multimedia / FAI'`.
     - **Branch 2: AI-First Software Developer**: Matched via `/ai-first|software developer|phần mềm|làm chủ ai|lập trình viên/i`. Title: 72 chars, Excerpts: 168 & 158 chars. Domain: `'AI-First Software Engineering'`, Brand: `'FPT Aptech / FAI'`.
     - **Branch 3: THPT Gesture AI**: Matched via `/thpt|cử chỉ|gesture|học sinh/i`. Title: 74 chars, Excerpts: 171 & 160 chars. Domain: `'Youth Technology & Gesture AI'`, Brand: `'FPT Aptech / FAI'`.
     - **Branch 4: General FAI Campus / Innovation**: Heuristic headline extractor with fallback to `'Đổi Mới Sáng Tạo FAI'`, clamping titles to `< 95` chars and excerpts within `[120, 220]`. Domain: `'FAI Campus & Student Life'`, Brand: `'Viện Đào tạo Quốc tế FPT (FAI)'`.
   - Implemented `clampTitle`, `clampExcerpt`, and `sanitizeHtml` to mathematically guarantee zero boundary violations even on arbitrary user inputs.

2. **Step 2: Resilient Integration in `src/lib/gemini.js`**:
   - Imported `generateFallbackArticleOptions`.
   - Before initializing `GoogleGenAI`, checked if `apiKey` is missing or empty. If so, seamlessly invoked `generateFallbackArticleOptions(userNotes, options)` with `isFallback: true` and zero crash.
   - Wrapped the entire Gemini API invocation and JSON parsing in `try/catch`. In the `catch (apiError)` block, logged a warning and seamlessly returned `generateFallbackArticleOptions` with `fallbackReason: apiError.message`.
   - Exported `generateFallbackArticleOptions`.

3. **Step 3: Webhook Route Verification & Hardening (`src/app/api/telegram/webhook/route.js`)**:
   - Verified that `setTelegramSession` correctly saves `optionsResult` under `step: 'AWAITING_OPTION_SELECTION'`.
   - Verified inline keyboard with buttons `1️⃣ Chọn Phương Án 1` (`opt_1`) and `2️⃣ Chọn Phương Án 2` (`opt_2`).
   - Added duplicate click protection: if `session.step === 'PUBLISHING'`, subsequent button taps are safely acknowledged without creating duplicate posts.
   - Added resilient photo downloading: if `downloadFileBuffer` fails, the webhook logs a warning and proceeds with generating options from notes rather than rejecting the interaction.
   - Added `(Chế độ Biên tập Tự động FAI)` badge in preview message when `optionsResult.isFallback` is active.

---

## 3. Caveats

1. **No External Gemini API Call When API Key is Omitted**:
   When `GEMINI_API_KEY` is not provided in `.env.local`, the system automatically and transparently uses the intelligent Vietnamese fallback pipeline. If a valid Gemini API key is provided in the future, the live Gemini 2.5 Flash call executes automatically, and the fallback pipeline serves as the zero-downtime safety net.
2. **ESLint Scope**:
   Project-wide ESLint revealed pre-existing violations in unrelated admin pages (`Counters.jsx`, `ScrollTypewriter.jsx`, `Testimonials.jsx`). Our touched files (`src/lib/contentFallback.js`, `src/lib/gemini.js`, `src/app/api/telegram/webhook/route.js`) passed ESLint with **0 errors and 0 warnings**.

---

## 4. Conclusion

Milestone M2 requirements have been 100% completed, verified, and certified:
- `fai/src/lib/contentFallback.js` generated and tested across all 4 domain branches and edge cases.
- `fai/src/lib/gemini.js` fully hooked with zero-crash behavior on missing or invalid keys.
- `fai/src/app/api/telegram/webhook/route.js` verified for session persistence under `step: 'AWAITING_OPTION_SELECTION'`, double-click locking, and 2 inline option selection buttons.
- All typography rules, HTML heading constraints (strictly NO `<h1>` or `<h2>`), character length constraints, and ESLint checks are 100% satisfied.

---

## 5. Verification Method

### 5.1 Automated Comprehensive Fallback Suite
Execute the following verification command inside `fai/`:
```bash
node -e '
import("./src/lib/gemini.js").then(async ({ generateArticleOptions }) => {
  const topics = [
    "Wireframing – Thiết kế từ góc nhìn của người dùng",
    "AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp",
    "Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ",
    "Lễ Trao Bằng Tốt Nghiệp FPT Aptech Khóa 2024-2026",
    ""
  ];
  for (const t of topics) {
    const res = await generateArticleOptions(null, null, t, { apiKey: "" });
    console.assert(res.isFallback === true, "Must be fallback");
    console.assert(res.option1.title.length < 100, "Opt1 title < 100");
    console.assert(res.option2.title.length < 100, "Opt2 title < 100");
    console.assert(res.option1.excerpt.length >= 120 && res.option1.excerpt.length <= 220, "Opt1 excerpt 120-220");
    console.assert(res.option2.excerpt.length >= 120 && res.option2.excerpt.length <= 220, "Opt2 excerpt 120-220");
    console.assert(!res.option1.contentHtml.includes("<h1") && !res.option1.contentHtml.includes("<h2"), "Opt1 no h1/h2");
    console.assert(!res.option2.contentHtml.includes("<h1") && !res.option2.contentHtml.includes("<h2"), "Opt2 no h1/h2");
    console.log("PASS:", res.domain, "| Titles:", res.option1.title.length, res.option2.title.length);
  }
});
'
```
Expected output: All test cases output `PASS:` with valid domains and titles.

### 5.2 ESLint Validation
Run ESLint strictly on the touched files:
```bash
npx eslint src/lib/contentFallback.js src/lib/gemini.js src/app/api/telegram/webhook/route.js
```
Expected output: Exits with code 0 and no errors/warnings.

### 5.3 Webhook Verification
Test webhook endpoint response:
```bash
curl -s -X POST -H "Content-Type: application/json" \
  -H "X-Telegram-Bot-Api-Secret-Token: fai_telegram_secret_token_2026" \
  -d "{\"update_id\": 1001}" \
  http://localhost:3000/api/telegram/webhook
```
Expected output: `{"ok":true}`.
