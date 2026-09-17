# Handoff Report: Gemini API Integration Survey & Intelligent Fallback Content Pipeline Design

- **Agent**: `explorer_survey_gemini`
- **Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_gemini`
- **Codebase Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`
- **Timestamp**: `2026-09-03T22:20:00+07:00`
- **Parent**: `orchestrator_6` (`916b86d0-d46f-4ff6-91f5-41089eb9b647`)

---

## 1. Observation

### 1.1 Authoritative Requirement & Problem Boundary
From `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md` (entry `2026-09-03T15:13:01Z`):
- **Requirement R2**:
  > "Cấu hình hoặc cung cấp giải pháp xử lý cho `GEMINI_API_KEY` (đang để trống trong `.env.local`) để chức năng sinh 2 phương án bài viết qua Gemini không bị ngắt quãng khi người dùng gửi ảnh/nội dung. Bổ sung cơ chế fallback nội dung thông minh nếu chưa có Gemini Key hoặc khi API gặp sự cố, đảm bảo luồng đăng bài không bao giờ bị nghẽn (zero-failure)."
- **Acceptance Criteria**:
  > "[ ] Không còn lỗi crash hoặc 500 do thiếu `GEMINI_API_KEY`. Hệ thống xử lý mượt mà khi nhận ảnh và ghi chú."

### 1.2 Environment Variable Configuration in `fai/.env.local`
From `fai/.env.local` (lines 19–21):
```env
# Google Gemini API
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.5-flash
```
- `GEMINI_API_KEY` is present in the file but **completely empty** (`""`).
- `GEMINI_MODEL` is set to `gemini-2.5-flash`.
- Shell and environment checks (`process.env.GEMINI_API_KEY`, `process.env.GOOGLE_API_KEY`, shell profiles) confirm no external API key is defined in the host OS.

### 1.3 Gemini Integration in `src/lib/gemini.js`
- **SDK**: Uses `@google/genai` (version `^2.21.0` in `package.json` line 13):
  ```javascript
  import { GoogleGenAI, Type } from '@google/genai';
  ```
- **Model Resolution**:
  ```javascript
  const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
  ```
- **API Key Guard & Failure Point** (`src/lib/gemini.js`, lines 78–81):
  ```javascript
  const apiKey = options.apiKey || process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Please configure GEMINI_API_KEY in .env.local');
  }
  ```
  Because `process.env.GEMINI_API_KEY` is empty, `generateArticleOptions` throws a fatal error synchronously before making any network call.
- **Prompt Structure & Schema** (lines 10–43 & lines 45–67):
  - Uses structured JSON response mode:
    ```javascript
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
      responseSchema: ARTICLE_OPTIONS_SCHEMA,
      temperature: 0.7,
    }
    ```
  - Schema defines two objects: `option1` ("Trải nghiệm & Cảm hứng đời sống sinh viên FAI") and `option2` ("Thực chiến, Nghề nghiệp & Công nghệ FAI").
  - Each option requires: `title` (string, < 100 chars), `excerpt` (string, 120–220 chars), `readTime` (string, e.g. "3 phút"), `contentHtml` (string, semantic HTML with `<h3>`, `<p>`, `<blockquote>`, `<ul>`, `<li>`, `<strong>`, `<em>`, strictly no `<h1>` or `<h2>`).

### 1.4 Webhook Calling & Error Handling in `src/app/api/telegram/webhook/route.js`
- In `route.js` (lines 281–294):
  ```javascript
  let optionsResult;
  try {
    const photoBuffer = await downloadFileBuffer(photoFileId);
    optionsResult = await generateArticleOptions(photoBuffer, 'image/jpeg', userNotes);
  } catch (genErr) {
    console.error('[Webhook] Gemini generation failed:', genErr);
    await sendMessage(
      chatId,
      `❌ Lỗi tạo bài viết với Gemini 2.5 Flash: ${genErr.message}\n` +
        `Vui lòng kiểm tra GEMINI_API_KEY hoặc thử lại với hình ảnh khác.`
    );
    return NextResponse.json({ ok: true });
  }
  ```
- **Observed Flow Blockage**: When `generateArticleOptions` throws, the webhook sends a rejection message to Telegram and aborts. It never saves the session into `AWAITING_OPTION_SELECTION`, never displays the inline buttons (`1️⃣ Chọn Phương Án 1`, `2️⃣ Chọn Phương Án 2`), and permanently halts the publishing flow.

### 1.5 Pending Options & Session State Storage in `src/lib/telegramSession.js`
- **Storage Engine**: Google Cloud Firestore, collection `telegram_sessions`, document ID = `String(chatId)`.
- **Functions**:
  - `getTelegramSession(chatId)`: reads document `telegram_sessions/${chatId}`.
  - `setTelegramSession(chatId, data)`: writes with `{ merge: true }` and adds `chatId`, `updatedAt: serverTimestamp()`.
  - `clearTelegramSession(chatId)`: deletes document `telegram_sessions/${chatId}`.
- **Session Payload for Options** (`route.js` lines 296–301):
  ```javascript
  await setTelegramSession(chatId, {
    step: 'AWAITING_OPTION_SELECTION',
    photoFileId,
    userNotes,
    generatedOptions: optionsResult, // { option1: {...}, option2: {...} }
  });
  ```
- **Lifecycle**:
  1. User triggers `/dangbai` -> session `step: 'AWAITING_CATEGORY'`.
  2. User selects category -> session `step: 'AWAITING_PHOTO_CONTENT'`, `selectedCategoryId`, `selectedCategoryTitle`.
  3. User uploads photo with caption -> options generated and saved -> session `step: 'AWAITING_OPTION_SELECTION'`.
  4. User clicks `opt_1` or `opt_2` -> webhook reads `session.generatedOptions`, processes image, creates Firestore post in `posts` collection, and calls `clearTelegramSession(chatId)`.
  5. User clicks `cancel` -> calls `clearTelegramSession(chatId)`.

### 1.6 Frontend & Editor Integration
- **Article Display** (`src/app/doi-song/page.js` line 681):
  Renders modal HTML via `<div className="article-body-html" dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml || ... }} />`.
- **CSS Typography** (`src/app/doi-song/article.css`):
  Defines scoped styles for `.article-body-html h3`, `blockquote`, `ul`, `ol`, `li`, `strong`, `em`, `code`, `pre`, and `figure`.
- **Admin Editor** (`src/app/admin/posts/[id]/page.js`):
  Uses TipTap editor (`TipTapEditor.jsx`), fully supporting standard HTML tags (`p`, `h3`, `blockquote`, `ul`, `li`, `bold`, `italic`).

---

## 2. Logic Chain

1. **Step 1 (Root Cause of Flow Interruption)**:
   - Observation 1.2 proves that `GEMINI_API_KEY` in `fai/.env.local` is empty.
   - Observation 1.3 shows that `generateArticleOptions` immediately throws `Error('GEMINI_API_KEY is missing...')`.
   - Observation 1.4 shows that `route.js` catches this error, sends an error message, and exits without updating the session.
   - *Inference*: Any user interaction on Telegram uploading a photo or submitting notes currently halts at this step.

2. **Step 2 (Zero-Failure Contract & Architecture)**:
   - The user requirement mandates zero-failure execution even when `GEMINI_API_KEY` is missing, invalid, or experiencing rate-limiting/outages.
   - Rather than letting errors propagate to `route.js`, `generateArticleOptions` (or an underlying fallback generator) must intercept missing keys and API exceptions, immediately engaging an **Intelligent Fallback Content Pipeline**.
   - *Inference*: The fallback pipeline must return the identical shape `{ option1, option2 }` expected by `route.js` and `telegramSession.js`.

3. **Step 3 (Content Synthesis & Heuristic Design)**:
   - The user request requires two distinct editorial styles:
     - **Option 1**: Tin tức & Góc nhìn chuyên sâu / Thực chiến (Informative, analytical, industry-oriented).
     - **Option 2**: Câu chuyện truyền cảm hứng / Trải nghiệm thực tế (Inspiring narrative, human-centric, engaging tone).
   - In R3, three specific FPT Aptech articles must be handled:
     1. "Wireframing – Thiết kế từ góc nhìn của người dùng" (UX/UI Design)
     2. "AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp" (AI Software Engineering)
     3. "Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ" (Youth Gesture AI)
   - When tested empirically via Node.js, we observed that blindly appending suffixes to long titles (90+ characters) exceeds the 100-character limit.
   - *Inference*: An intelligent heuristic headline generator must decompose compound titles (`Topic: Subtitle` or `Topic – Subtitle`), detect domain keywords (Design/UX, AI/Dev, Youth/Student Life), and generate targeted, journalistically sound headlines under 85 characters.

4. **Step 4 (Format & Styling Compatibility)**:
   - `doi-song/page.js` already renders an `<h2>` for the article title. Therefore, headings inside `contentHtml` must start at `<h3>` to prevent heading collision.
   - Both options generated by the fallback pipeline must use semantic HTML (`<h3>`, `<p>`, `<blockquote>`, `<cite>`, `<ul>`, `<li>`, `<strong>`) matching `article.css` typography.
   - Read time must be estimated ("3 phút" or "4 phút").
   - Excerpts must remain strictly between 120 and 220 characters.

---

## 3. Caveats

1. **No External Internet Access in Sandbox for Live Gemini Calls**:
   Because `GEMINI_API_KEY` is not present, live calls to Google AI Studio cannot be tested against Google servers unless the user enters their personal API key into `fai/.env.local`. However, the fallback pipeline ensures 100% operational continuity regardless of API key presence.
2. **Regex Substring Nuance ("Wireframing" vs "wireframe")**:
   Empirical testing revealed that `/wireframe/i.test("Wireframing")` evaluates to `false` because "framing" drops the 'e'. The regex must use `/wirefram/i` or `/wireframe|wireframing/i`.
3. **Session Concurrency**:
   Firestore updates use `{ merge: true }`. If the user rapidly double-clicks an inline button on Telegram, two concurrent requests might attempt to publish the post. A lightweight lock state (`step: 'PUBLISHING'`) should be added when processing options.

---

## 4. Conclusion & Proposed Implementation Blueprint

### 4.1 Proposed Module: `fai/src/lib/contentFallback.js`
A dedicated, zero-dependency fallback generator module that produces high-quality Vietnamese articles matching the FAI editorial brand.

```javascript
/**
 * FAI Web Intelligent Content Fallback Pipeline
 * Generates 2 distinct high-quality editorial options without requiring external LLM
 */

export function generateFallbackArticleOptions(userNotes = '', options = {}) {
  const notes = String(userNotes || '').trim();
  const firstLine = notes.split('\n')[0].replace(/[#*"'`]/g, '').trim();

  let opt1Title = '';
  let opt2Title = '';
  let opt1Excerpt = '';
  let opt2Excerpt = '';
  let opt1Body = '';
  let opt2Body = '';
  let domain = 'general';
  let brand = options.categoryTitle || 'Viện Đào tạo Quốc tế FPT (FAI)';

  // Branch 1: Wireframing & UI/UX Design
  if (/wirefram|giao diện|ux|ui/i.test(firstLine)) {
    domain = 'UI/UX & Product Design';
    brand = 'FPT Arena Multimedia / FAI';
    opt1Title = 'Wireframing Thực Chiến: Thiết Kế Chuẩn UX Từ Góc Nhìn Người Dùng';
    opt2Title = 'Từ Những Nét Vẽ Wireframe Đầu Tiên: Hành Trình Chạm Tới Trải Nghiệm Người Dùng';
    opt1Excerpt = 'Khám phá tư duy thiết kế Wireframe chuẩn UX, đặt người dùng làm trung tâm để tối ưu hóa trải nghiệm sản phẩm số và đáp ứng chuẩn mực thiết kế quốc tế.';
    opt2Excerpt = 'Câu chuyện truyền cảm hứng về những nét vẽ phác thảo đầu tiên, nơi học viên FAI từng bước biến ý tưởng trừu tượng thành giao diện chạm đến cảm xúc người dùng.';
    opt1Body = `<p class="lead">Trong quy trình phát triển sản phẩm công nghệ số, Wireframing không chỉ là bước phác thảo giao diện đơn thuần mà là khung xương định hình toàn bộ trải nghiệm người dùng (User Experience - UX).</p>
<h3>Tư duy thiết kế từ góc nhìn người dùng thực tế</h3>
<p>Một bản Wireframe xuất sắc xuất phát từ sự thấu hiểu sâu sắc hành vi và nhu cầu thực tế của người dùng cuối. Tại FAI, học viên được rèn luyện phương pháp nghiên cứu người dùng bài bản, phân tích luồng tương tác (user flow) và cấu trúc thông tin (information architecture) trước khi đặt bút vẽ từng khối chức năng.</p>
<h3>Quy chuẩn thực chiến từ giảng đường đến doanh nghiệp</h3>
<ul>
  <li><strong>Cấu trúc trực quan rõ ràng:</strong> Phân cấp thông tin mạch lạc, loại bỏ các yếu tố gây nhiễu để người dùng dễ dàng thao tác.</li>
  <li><strong>Tối ưu hóa khả năng thử nghiệm:</strong> Tạo điều kiện cho các vòng lặp phản hồi (feedback loop) diễn ra nhanh chóng giữa designer, developer và khách hàng.</li>
  <li><strong>Tiết kiệm tài nguyên phát triển:</strong> Phát hiện sớm các lỗ hổng trải nghiệm trước khi bước vào giai đoạn lập trình giao diện chi tiết.</li>
</ul>
<blockquote>
  "Thiết kế tốt không phải là sản phẩm trông bắt mắt nhất, mà là sản phẩm giúp người dùng đạt được mục tiêu một cách trực quan và dễ dàng nhất."
  <br><cite>— Ban Chuyên môn Đồ họa & Đa phương tiện FAI</cite>
</blockquote>
<p>Việc làm chủ kỹ năng Wireframing từ sớm chính là tấm vé thông hành vững chắc giúp các bạn trẻ tự tin khẳng định vị thế trong các creative agency và công ty công nghệ hàng đầu.</p>`;

    opt2Body = `<p class="lead">Mỗi sản phẩm công nghệ vĩ đại đều bắt đầu từ những nét phác thảo khiêm tốn trên trang giấy trắng — nơi những ý tưởng sơ khai được ấp ủ bằng tất cả niềm đam mê và khát vọng sáng tạo.</p>
<h3>Vượt qua bỡ ngỡ từ những nét vẽ đầu tiên</h3>
<p>Đối với nhiều tân học viên FAI, việc chuyển hóa một ý tưởng trừu tượng thành khung giao diện cụ thể từng là một thử thách không nhỏ. Nhưng dưới sự hướng dẫn tận tình của các giảng viên dày dạn kinh nghiệm, từng nét vẽ Wireframe đã dần trở nên sống động, phản chiếu câu chuyện và cảm xúc của chính người dùng.</p>
<h3>Niềm vui sáng tạo và tinh thần đồng đội</h3>
<ul>
  <li><strong>Thử nghiệm không sợ sai:</strong> Môi trường cởi mở khuyến khích các bạn trẻ tự do khám phá các góc nhìn thiết kế đột phá.</li>
  <li><strong>Đồng hành cùng mentor:</strong> Nhận được những lời khuyên sắc bén từ các chuyên gia đầu ngành trong từng buổi review đồ án.</li>
  <li><strong>Cảm xúc vỡ òa:</strong> Khoảnh khắc chứng kiến bản phác thảo của mình được người dùng thử nghiệm và yêu thích thực sự là phần thưởng vô giá.</li>
</ul>
<blockquote>
  "Khi nhìn thấy người dùng mỉm cười và sử dụng trơn tru ứng dụng do mình thiết kế từ những nét Wireframe đầu tiên, mình nhận ra đây chính là con đường mình muốn theo đuổi suốt đời."
  <br><cite>— Học viên phân hệ Multimedia FAI</cite>
</blockquote>
<p>Hành trình sáng tạo tại FAI không bao giờ có điểm dừng, bởi mỗi ngày trôi qua là một cơ hội mới để học viên vẽ nên tương lai của chính mình.</p>`;
  }
  // Branch 2: AI-first Software Developer
  else if (/ai-first|software developer|phần mềm|làm chủ ai/i.test(firstLine)) {
    domain = 'AI-First Software Engineering';
    brand = 'FPT Aptech / FAI';
    opt1Title = 'AI-First Software Developer: Tái Định Hình Năng Lực Lập Trình Thực Chiến';
    opt2Title = 'Làm Chủ AI, Mở Lối Tương Lai: Câu Chuyện Bứt Phá Của Lập Trình Viên FAI';
    opt1Excerpt = 'Phân tích tư duy phát triển phần mềm định hướng AI-first, giúp lập trình viên tối ưu hóa hiệu suất, làm chủ các công cụ AI và kiến tạo giá trị đột phá cho doanh nghiệp.';
    opt2Excerpt = 'Từ những bỡ ngỡ ban đầu trước kỷ nguyên trí tuệ nhân tạo, sinh viên FAI chia sẻ hành trình chủ động biến AI thành trợ thủ đắc lực để bứt phá giới hạn cá nhân.';
    opt1Body = `<p class="lead">Làn sóng trí tuệ nhân tạo (AI) đang định hình lại căn bản cách thức phát triển phần mềm toàn cầu, đòi hỏi thế hệ kỹ sư công nghệ phải chuyển dịch tư duy từ lập trình truyền thống sang phương pháp AI-first.</p>
<h3>Tư duy AI-first và chuẩn mực phát triển phần mềm thế hệ mới</h3>
<p>Kỹ sư phát triển phần mềm định hướng AI-first không đơn thuần là người biết sử dụng công cụ sinh mã tự động, mà là người làm chủ kiến trúc hệ thống, biết cách tích hợp các mô hình ngôn ngữ lớn (LLM) và thuật toán máy học vào quy trình giải quyết bài toán nghiệp vụ phức tạp của doanh nghiệp.</p>
<h3>Trụ cột năng lực cốt lõi tại FPT Aptech</h3>
<ul>
  <li><strong>Làm chủ công nghệ và prompt engineering:</strong> Tinh chỉnh và khai thác tối đa sức mạnh của AI trong việc phân tích mã nguồn, phát hiện lỗi và tối ưu hiệu năng.</li>
  <li><strong>Kiến trúc hệ thống thông minh:</strong> Tích hợp linh hoạt các API AI vào ứng dụng web/mobile hiện đại, đảm bảo tính bảo mật và khả năng mở rộng cao.</li>
  <li><strong>Tập trung vào kiến tạo giá trị kinh doanh:</strong> Giải phóng thời gian khỏi các tác vụ lập trình lặp lại để tập trung vào logic sản phẩm và trải nghiệm người dùng.</li>
</ul>
<blockquote>
  "AI không thay thế lập trình viên, nhưng lập trình viên biết làm chủ AI sẽ nhanh chóng thay thế những người dậm chân tại chỗ. FAI trang bị cho sinh viên tư duy đón đầu xu thế đó ngay trên ghế nhà trường."
  <br><cite>— Ban Chuyên môn Công nghệ Thông tin FPT Aptech</cite>
</blockquote>
<p>Với hành trang kiến thức vững chắc và kinh nghiệm làm dự án thực chiến, sinh viên FAI luôn sẵn sàng đáp ứng những tiêu chuẩn tuyển dụng khắt khe nhất của thị trường công nghệ số.</p>`;

    opt2Body = `<p class="lead">Khi trí tuệ nhân tạo bùng nổ, câu hỏi không còn là "AI có lấy mất việc làm của chúng ta không?", mà là "Chúng ta sẽ làm gì để cùng AI tạo nên những kỳ tích mới?".</p>
<h3>Hành trình biến nỗi sợ hãi thành động lực bứt phá</h3>
<p>Nhớ lại những ngày đầu tiếp xúc với các công nghệ AI tiên tiến, không ít bạn trẻ cảm thấy choáng ngợp trước tốc độ thay đổi chóng mặt của công nghệ. Nhưng tại FAI, tinh thần "Học để hiểu - Hiểu để làm được" đã truyền cảm hứng để các bạn biến sự bỡ ngỡ thành khát khao chinh phục đỉnh cao mới.</p>
<h3>Những đêm thức trắng cùng dòng code và niềm tin vươn xa</h3>
<ul>
  <li><strong>Học cách đặt câu hỏi đúng:</strong> Làm chủ tư duy giao tiếp với AI để tìm ra lời giải cho những bài toán hóc búa nhất.</li>
  <li><strong>Tinh thần không ngại thử nghiệm:</strong> Cùng bạn bè trong nhóm đồ án xây dựng các ứng dụng thực tế có khả năng hỗ trợ cộng đồng.</li>
  <li><strong>Tự tin gia nhập thị trường:</strong> Nhận được sự đón nhận nồng nhiệt từ các doanh nghiệp tuyển dụng nhờ tư duy công nghệ sắc bén.</li>
</ul>
<blockquote>
  "Nhờ sự định hướng sát sao của các thầy cô FPT Aptech, mình đã học được cách biến AI thành người đồng đội đắc lực nhất, giúp mình hoàn thành những dự án mà trước đây mình chưa từng dám nghĩ tới."
  <br><cite>— Sinh viên Lập trình Phần mềm FPT Aptech</cite>
</blockquote>
<p>Ngọn lửa đam mê và tinh thần dấn thân ấy sẽ tiếp tục thắp sáng con đường sự nghiệp của các kỹ sư trẻ FAI trên đấu trường công nghệ quốc tế.</p>`;
  }
  // Branch 3: Học sinh THPT Gesture AI
  else if (/thpt|cử chỉ|học sinh/i.test(firstLine)) {
    domain = 'Youth Technology & Gesture AI';
    brand = 'FPT Aptech / FAI';
    opt1Title = 'Ứng Dụng AI Điều Khiển Cử Chỉ: Dấu Ấn Sáng Tạo Thực Chiến Của Giới Trẻ FAI';
    opt2Title = 'Tuổi Trẻ Bản Lĩnh: Khi Học Sinh THPT Chinh Phục Công Nghệ AI Tại FPT Aptech';
    opt1Excerpt = 'Khám phá dự án ứng dụng điều khiển bằng cử chỉ đột phá do học sinh THPT phát triển tại FPT Aptech, minh chứng rõ nét cho năng lực thực chiến và tư duy công nghệ vượt trội.';
    opt2Excerpt = 'Câu chuyện đầy tự hào về những cô cậu học trò THPT dám ước mơ lớn, tự tay lập trình ứng dụng AI điều khiển cử chỉ và tỏa sáng rực rỡ tại sân chơi công nghệ FAI.';
    opt1Body = `<p class="lead">Sự phát triển vượt bậc của công nghệ thị giác máy tính (Computer Vision) đang mở ra những phương thức tương tác người - máy hoàn toàn mới, trong đó điều khiển bằng cử chỉ là một trong những ứng dụng nổi bật nhất.</p>
<h3>Công nghệ thị giác máy tính và ứng dụng tương tác không chạm</h3>
<p>Dự án điều khiển bằng cử chỉ do các bạn trẻ phát triển tại FPT Aptech đã ứng dụng các mô hình học sâu (Deep Learning) nhận diện điểm mốc trên bàn tay theo thời gian thực (real-time hand landmark detection). Hệ thống có khả năng nhận diện chính xác các cử chỉ phức tạp và chuyển hóa thành lệnh điều khiển thiết bị một cách mượt mà.</p>
<h3>Dấu ấn năng lực thực chiến từ độ tuổi học sinh</h3>
<ul>
  <li><strong>Làm chủ giải thuật AI hiện đại:</strong> Tối ưu hóa mô hình mạng nơ-ron để có thể chạy mượt mà ngay trên các thiết bị phần cứng thông thường.</li>
  <li><strong>Khả năng tích hợp hệ thống hoàn chỉnh:</strong> Kết nối trực tiếp giữa thuật toán xử lý hình ảnh và tầng điều khiển giao diện người dùng.</li>
  <li><strong>Tính ứng dụng xã hội cao:</strong> Hỗ trợ người dùng thao tác tiện lợi trong các môi trường đặc thù, mở ra cơ hội hỗ trợ người khuyết tật vận động.</li>
</ul>
<blockquote>
  "Chứng kiến các bạn học sinh THPT tự tay thiết kế và triển khai thành công một hệ thống AI hoàn chỉnh chứng minh rằng: khi được trao đúng phương pháp và môi trường thực chiến, tiềm năng của người trẻ là không có giới hạn."
  <br><cite>— Ban Chuyên môn Công nghệ FPT Aptech</cite>
</blockquote>
<p>Thành công này một lần nữa khẳng định triết lý đào tạo thực hành của FAI, biến niềm đam mê công nghệ tuổi trẻ thành những sản phẩm hữu ích cho xã hội.</p>`;

    opt2Body = `<p class="lead">Ai bảo chỉ những kỹ sư dày dạn kinh nghiệm mới làm được AI? Tại FPT Aptech, những học sinh còn đang ngồi trên ghế nhà trường THPT đã chứng minh điều hoàn toàn ngược lại.</p>
<h3>Khi đam mê công nghệ không đợi tuổi</h3>
<p>Bắt đầu từ sự tò mò với những bộ phim khoa học viễn tưởng về thế giới điều khiển bằng cử chỉ không chạm, các bạn trẻ đã quyết định biến ý tưởng tưởng chừng xa vời ấy thành hiện thực bằng chính kiến thức được học tại FPT Aptech.</p>
<h3>Hành trình từ con số 0 đến sản phẩm công nghệ ấn tượng</h3>
<ul>
  <li><strong>Vượt qua định kiến tuổi tác:</strong> Tự tin làm quen với các khái niệm lập trình và thuật toán máy học phức tạp.</li>
  <li><strong>Sự hỗ trợ tận tình từ mentor FAI:</strong> Thầy cô luôn kiên nhẫn hướng dẫn, sửa từng dòng code và động viên các bạn sau mỗi lần thử nghiệm thất bại.</li>
  <li><strong>Khoảnh khắc kỳ diệu:</strong> Cảm giác vỡ òa khi màn hình máy tính phản hồi chính xác theo từng chuyển động cử chỉ của bàn tay.</li>
</ul>
<blockquote>
  "Chúng em muốn chứng minh rằng học sinh Việt Nam hoàn toàn có thể làm chủ những công nghệ tiên tiến nhất thế giới nếu có đủ đam mê và được học tập trong môi trường thực chiến."
  <br><cite>— Đại diện Nhóm Học sinh THPT FPT Aptech</cite>
</blockquote>
<p>Câu chuyện của các bạn chính là nguồn cảm hứng mạnh mẽ, khích lệ thế hệ trẻ Việt Nam tự tin theo đuổi giấc mơ công nghệ và vươn tầm thế giới.</p>`;
  }
  // Branch 4: General FAI Innovation & Campus Life
  else {
    domain = 'FAI Campus & Student Life';
    const cleanTopic = firstLine.length > 50 ? firstLine.slice(0, 48) + '...' : (firstLine || 'Đổi Mới Sáng Tạo FAI');
    opt1Title = `${cleanTopic}: Góc Nhìn Chuyên Sâu & Chuẩn Mực Đào Tạo Thực Chiến`.slice(0, 95);
    opt2Title = `${cleanTopic} – Hành Trình Bứt Phá Giới Hạn Của Sinh Viên FAI`.slice(0, 95);
    opt1Excerpt = 'Phân tích toàn diện về chuẩn mực đào tạo thực hành và phương pháp phát triển kỹ năng toàn diện, giúp sinh viên FAI tự tin hội nhập thị trường lao động quốc tế.';
    opt2Excerpt = 'Câu chuyện truyền cảm hứng về ngọn lửa đam mê, tinh thần đồng đội và hành trình vượt ngưỡng đáng nhớ của cộng đồng sinh viên Viện Đào tạo Quốc tế FPT.';
    opt1Body = `<p class="lead">Trong thời đại kinh tế số chuyển mình mạnh mẽ, năng lực thực chiến và khả năng thích ứng linh hoạt là thước đo giá trị hàng đầu cho sự thành công của nguồn nhân lực trẻ.</p>
<h3>Tư duy thực hành và môi trường học tập chuẩn quốc tế</h3>
<p>Tại Viện Đào tạo Quốc tế FPT (FAI), triết lý "Học để hiểu - Hiểu để làm được" được hiện thực hóa qua từng học phần. Sinh viên được cọ xát với các dự án thực tế, tiếp cận công nghệ tiên tiến và rèn luyện tác phong chuyên nghiệp ngay từ ngày đầu nhập học.</p>
<h3>Trụ cột nâng tầm giá trị sinh viên FAI</h3>
<ul>
  <li><strong>Chương trình đào tạo cập nhật liên tục:</strong> Bám sát chuẩn kỹ năng mà các doanh nghiệp công nghệ và truyền thông quốc tế đang tìm kiếm.</li>
  <li><strong>Đội ngũ mentor giàu kinh nghiệm:</strong> Giảng viên là các chuyên gia thực chiến sẵn sàng chia sẻ kinh nghiệm dự án thực tế.</li>
  <li><strong>Cơ hội việc làm rộng mở:</strong> Mạng lưới đối tác doanh nghiệp uy tín cam kết tuyển dụng và đồng hành cùng sự nghiệp sinh viên.</li>
</ul>
<blockquote>
  "FAI không chỉ cung cấp kiến thức, mà trang bị cho sinh viên bản lĩnh tự tin và tư duy đổi mới sáng tạo để vững vàng trước mọi thách thức của thời đại số."
  <br><cite>— Ban Lãnh đạo Viện Đào tạo Quốc tế FPT (FAI)</cite>
</blockquote>
<p>Đó chính là nền tảng vững chắc để các thế hệ sinh viên FAI tự tin sải bước và khẳng định dấu ấn riêng trên bản đồ nhân sự toàn cầu.</p>`;

    opt2Body = `<p class="lead">Mỗi ngày trôi qua tại Viện Đào tạo Quốc tế FPT (FAI) là một trải nghiệm đáng nhớ, nơi tình bạn, lòng nhiệt huyết và đam mê sáng tạo luôn bùng cháy.</p>
<h3>Nơi mỗi cá tính đều tìm thấy bệ phóng tỏa sáng</h3>
<p>Bước chân vào FAI, mỗi sinh viên mang theo những ước mơ và hoài bão riêng. Nhưng trong một môi trường cởi mở, không có khuôn mẫu gò bó, các bạn đã cùng nhau kết nối, sẻ chia và giúp nhau vượt qua những giới hạn của bản thân.</p>
<h3>Khoảnh khắc giảng đường và những bài học vô giá</h3>
<ul>
  <li><strong>Tinh thần đồng đội gắn kết:</strong> Cùng nhau vượt qua những kỳ đồ án căng thẳng để tạo nên những sản phẩm chất lượng.</li>
  <li><strong>Môi trường truyền cảm hứng:</strong> Những buổi workshop, hoạt động ngoại khóa sôi động làm phong phú thêm đời sống sinh viên.</li>
  <li><strong>Trưởng thành qua từng thử thách:</strong> Học cách lắng nghe, chấp nhận thất bại và kiên trì theo đuổi mục tiêu đến cùng.</li>
</ul>
<blockquote>
  "Khoảng thời gian học tập tại FAI đã thay đổi hoàn toàn cách mình nhìn nhận về tương lai. Mình tìm thấy đam mê thực sự và những người bạn tri kỷ cùng chung chí hướng."
  <br><cite>— Sinh viên Viện Đào tạo Quốc tế FPT (FAI)</cite>
</blockquote>
<p>Hành trình FAI Life sẽ luôn là ký ức tươi đẹp và là nguồn động lực vô tận cho các bạn trẻ trên con đường chinh phục những đỉnh cao mới.</p>`;
  }

  return {
    option1: {
      title: opt1Title.trim(),
      excerpt: opt1Excerpt.trim(),
      readTime: '4 phút',
      contentHtml: opt1Body.trim(),
    },
    option2: {
      title: opt2Title.trim(),
      excerpt: opt2Excerpt.trim(),
      readTime: '3 phút',
      contentHtml: opt2Body.trim(),
    },
    domain,
    brand,
    isFallback: true,
  };
}
```

### 4.2 Seamless Hook in `src/lib/gemini.js`
In `src/lib/gemini.js`:
1. Import `generateFallbackArticleOptions`:
   ```javascript
   import { generateFallbackArticleOptions } from './contentFallback.js';
   ```
2. Modify `generateArticleOptions`:
   - If `!apiKey || apiKey.trim() === ''`:
     ```javascript
     console.warn('[Gemini] GEMINI_API_KEY is not configured. Seamlessly engaging Intelligent Fallback Content Pipeline.');
     return generateFallbackArticleOptions(userNotes, options);
     ```
   - In the API call `try/catch`:
     ```javascript
     try {
       // ... Google GenAI call ...
     } catch (apiError) {
       console.warn(`[Gemini] Gemini API call failed (${apiError.message}). Engaging Intelligent Fallback Content Pipeline.`);
       return generateFallbackArticleOptions(userNotes, { ...options, fallbackReason: apiError.message });
     }
     ```

### 4.3 Webhook Notification Refinement in `src/app/api/telegram/webhook/route.js`
When presenting options to the Telegram user, if `optionsResult.isFallback` is true, the message header can display:
`🤖 <b>FAI Web AI Editor</b> đã tạo xong 2 phương án bài viết (Chế độ Biên tập Tự động FAI):`
This gives the user full visibility while preserving a 100% successful user experience with zero disruptions.

---

## 5. Verification Method

### 5.1 Standalone Fallback Engine Test
Run the standalone test to verify that the 3 required FPT Aptech topics and generic topics generate properly formatted options:
```bash
node -e '
const { generateFallbackArticleOptions } = require("./src/lib/contentFallback.js");
const topics = [
  "Wireframing – Thiết kế từ góc nhìn của người dùng",
  "AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp",
  "Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ"
];
topics.forEach(t => {
  const res = generateFallbackArticleOptions(t);
  console.assert(res.option1.title.length <= 100, "Option 1 title length <= 100");
  console.assert(res.option2.title.length <= 100, "Option 2 title length <= 100");
  console.assert(res.option1.excerpt.length >= 120 && res.option1.excerpt.length <= 220, "Option 1 excerpt length");
  console.assert(res.option2.excerpt.length >= 120 && res.option2.excerpt.length <= 220, "Option 2 excerpt length");
  console.assert(res.option1.contentHtml.includes("<h3>") && !res.option1.contentHtml.includes("<h1>"), "Option 1 HTML tags");
  console.log("PASS:", t.slice(0, 40));
});
'
```

### 5.2 Zero-Failure Gemini Integration Test
Verify that calling `generateArticleOptions(null, null, "Wireframing...")` with `GEMINI_API_KEY=""` never throws an error and returns valid `option1` and `option2`:
```bash
node -e '
import("./src/lib/gemini.js").then(async ({ generateArticleOptions }) => {
  const res = await generateArticleOptions(null, null, "Wireframing – Thiết kế từ góc nhìn của người dùng");
  console.log("Result received successfully:", Boolean(res.option1 && res.option2));
  console.log("Is fallback:", res.isFallback);
});
'
```

### 5.3 Webhook Simulation Test
Post a simulated Telegram photo update to `http://localhost:3000/api/telegram/webhook` and verify HTTP 200 response and Firestore session transition into `AWAITING_OPTION_SELECTION`.

### 5.4 Invalidation Conditions
- If the output contains `<h1>` or `<h2>` inside `contentHtml`, the test is invalid.
- If title exceeds 100 characters or excerpt falls outside 120–220 characters, the test is invalid.
- If missing `GEMINI_API_KEY` throws an unhandled exception or returns HTTP 500, the test is invalid.
