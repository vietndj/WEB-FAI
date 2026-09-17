# Báo Cáo Khảo Sát & Thiết Kế Kỹ Thuật: Telegram Bot Webhook & AI 2-Option Publishing Flow (R2 & R4)

**Người thực hiện:** `explorer_telegram_ai`  
**Dự án:** FAI Web (`WEB- FAI/fai`)  
**Thời gian:** 2026-09-03  
**Phạm vi:** Yêu cầu R2 (Telegram Bot Webhook & AI Publishing Flow) & R4 (Security & Error Handling)

---

## 1. TỔNG QUAN HIỆN TRẠNG HỆ THỐNG (CURRENT STATE)

### 1.1 Cấu trúc Next.js và API Routes
- **Phiên bản Framework:** Next.js `16.2.9` (App Router), React `19.2.4`.
- **Thư mục API hiện tại:** Chưa tồn tại thư mục `src/app/api`. Toàn bộ ứng dụng hiện đang xử lý dữ liệu qua Client-side Firebase SDK trực tiếp tại các trang (`src/app/doi-song/page.js`, `src/app/admin/posts/...`).
- **Mô hình Route Handler của Next.js App Router:**
  - Route handlers được khai báo bằng file `route.js` trong thư mục con tương ứng, ví dụ: `src/app/api/telegram/webhook/route.js`.
  - Hỗ trợ các hàm HTTP export: `export async function POST(request) { ... }`.
  - Cần khai báo `export const dynamic = 'force-dynamic';` và `export const runtime = 'nodejs';` để đảm bảo Next.js xử lý động mọi Webhook request từ Telegram trên môi trường Node.js.

### 1.2 Cấu trúc Dữ liệu Chuyên mục (Categories) & Bài viết (Posts)
- **Categories Firestore:**
  - Collection: `categories`.
  - Hàm truy vấn chuẩn trong `src/lib/firestore.js`: `getCategories('doi-song')` trả về mảng danh mục được sắp xếp theo `order: 'asc'`.
  - 5 danh mục chuẩn hiện có trong nhóm `doi-song`:
    1. `graduation`: *Lễ tốt nghiệp qua các năm / Lễ tôn vinh SVXS các học kỳ* (eyebrow: *Mốc son vinh quang*)
    2. `enterprise`: *Doanh nghiệp & FAI* (eyebrow: *Kết nối việc làm thực chiến*)
    3. `sharing`: *Nhỏ to cùng chia sẻ - Nói nhỏ nói to* (eyebrow: *Góc tâm sự & kinh nghiệm*)
    4. `contests`: *Sân chơi & giải thưởng* (eyebrow: *Khai phá tài năng*)
    5. `community`: *FAI & cộng đồng* (eyebrow: *Trách nhiệm xã hội & Trải nghiệm*)
- **Posts Firestore:**
  - Collection: `posts`.
  - Schema tài liệu bài viết:
    - `id`: Slug định danh document
    - `title`: Tiêu đề bài viết
    - `slug`: Đường dẫn URL thân thiện
    - `categoryId`: ID danh mục liên kết (ví dụ: `'enterprise'`, `'sharing'`)
    - `date`: Ngày đăng hiển thị (chuẩn `DD-MM-YYYY`, ví dụ: `03-09-2026`)
    - `image`: URL ảnh đại diện trên Cloud Storage (loại bỏ hoàn toàn Base64 theo R1)
    - `excerpt`: Tóm tắt ngắn gọn 1-2 câu
    - `contentHtml`: Nội dung bài viết định dạng Semantic HTML (`<h3>`, `<p>`, `<blockquote>`, `<ul>`, `<li>`)
    - `sourceUrl`: Link bài gốc (nếu có, mặc định rỗng)
    - `author`: Tác giả (mặc định `'FAI Editorial'`)
    - `readTime`: Thời gian đọc ước tính (ví dụ: `'3 phút'`)
    - `order`: Thứ tự ưu tiên (số nguyên, mặc định `0`)
    - `published`: Trạng thái hiển thị (`true` để xuất bản ngay trên `/doi-song`)
    - `group`: Nhóm giao diện (`'doi-song'`)
    - `createdAt` / `updatedAt`: `serverTimestamp()` từ Firestore

---

## 2. THIẾT KẾ KIẾN TRÚC TELEGRAM BOT WEBHOOK (R2 & R4)

### 2.1 Cơ chế Webhook Endpoint (`/api/telegram/webhook/route.js`)
Next.js App Router xử lý webhook request từ Telegram theo luồng:
```
Telegram Servers
       │
       ▼ HTTPS POST /api/telegram/webhook
┌────────────────────────────────────────────────────────┐
│ Bước 1: Kiểm tra Secret Token                          │
│ Header: X-Telegram-Bot-Api-Secret-Token               │
│ -> 401 Unauthorized nếu không khớp                     │
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Bước 2: Kiểm tra Whitelist Phân Quyền                  │
│ Sender User ID / Chat ID thuộc TELEGRAM_ALLOWED_USERS  │
│ -> Phản hồi từ chối nếu người lạ                       │
└────────────────────────────────────────────────────────┘
       │
       ▼
┌────────────────────────────────────────────────────────┐
│ Bước 3: Phân loại Update (Message vs CallbackQuery)    │
│ - /start hoặc /dangbai -> Trả về danh sách danh mục    │
│ - Chọn danh mục -> Lưu session, chờ gửi ảnh + text    │
│ - Gửi ảnh + text -> Gọi Gemini 2.5 Flash -> 2 Option   │
│ - Chọn Option 1/2 -> Đóng gói & lưu Firestore posts    │
└────────────────────────────────────────────────────────┘
       │
       ▼
HTTP 200 OK ({ ok: true })
```

### 2.2 Bảo mật Request với Secret Token (R4)
Khi kích hoạt Webhook qua Telegram Bot API `setWebhook`, ta gửi kèm tham số `secret_token`.
- **Cấu hình biến môi trường:** `TELEGRAM_WEBHOOK_SECRET`
- **Xác thực tại Next.js Route Handler:**
  ```javascript
  const secretHeader = request.headers.get('x-telegram-bot-api-secret-token');
  if (secretHeader !== process.env.TELEGRAM_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized secret token' }, { status: 401 });
  }
  ```

### 2.3 Phân Quyền Người Dùng (Whitelist Validation) (R4)
- **Cấu hình biến môi trường:**
  - `TELEGRAM_ALLOWED_USERS`: Danh sách User ID Telegram được phép (phân cách bằng dấu phẩy, ví dụ: `2050406425,123456789`).
  - `TELEGRAM_ALLOWED_CHATS`: Danh sách Chat ID nhóm/kênh được phép (nếu chạy trong group).
- **Quy tắc chặn người lạ:**
  Nếu người gửi không thuộc whitelist:
  ```javascript
  const userId = String(update.message?.from?.id || update.callback_query?.from?.id);
  const allowedUsers = (process.env.TELEGRAM_ALLOWED_USERS || '').split(',').map(s => s.trim()).filter(Boolean);

  if (!allowedUsers.includes(userId)) {
    await sendTelegramMessage(chatId, `⛔ **Từ chối truy cập**\nBạn không có quyền đăng bài lên FAI Web.\nID của bạn: \`${userId}\`\nVui lòng liên hệ ban quản trị để được cấp quyền.`);
    return NextResponse.json({ ok: true });
  }
  ```

### 2.4 Giao tiếp với Telegram Bot API (Zero-Dependency)
Thay vì cài đặt các thư viện nặng như `telegraf` hay `node-telegram-bot-api` vốn xung đột với cơ chế serverless và lifecycle của Next.js, ta xây dựng module `src/lib/telegram.js` thuần bằng `fetch` nguyên bản của Node.js:
- `sendTelegramMessage(chatId, text, options)`: Gửi tin nhắn Markdown hoặc HTML kèm Inline Keyboard.
- `answerCallbackQuery(callbackQueryId, text, showAlert)`: Phản hồi lập tức nút bấm để tắt trạng thái loading trên ứng dụng Telegram.
- `getTelegramFile(fileId)`: Lấy thông tin `file_path` từ `getFile`.
- `downloadTelegramFileBuffer(filePath)`: Tải mảng nhị phân ảnh trực tiếp về Buffer.
- `editTelegramMessage(chatId, messageId, text, options)`: Cập nhật nội dung tin nhắn sau khi chọn phương án.

---

## 3. THIẾT KẾ QUẢN LÝ TRẠNG THÁI CUỘC HỘI THOẠI (STATE MACHINE)

Trong môi trường Serverless (Vercel / Next.js), mỗi webhook request là một tiến trình độc lập không duy trì bộ nhớ RAM. Do đó, trạng thái quy trình đăng bài nhiều bước phải được lưu trữ bền vững.

### 3.1 Lưu trữ Session tại Firestore (`telegram_sessions`)
- **Document ID:** `String(chatId)`
- **Schema tài liệu session:**
  ```typescript
  interface TelegramSession {
    chatId: number | string;
    userId: number | string;
    step: 'IDLE' | 'AWAITING_CONTENT' | 'AWAITING_SELECTION';
    selectedCategoryId?: string;
    selectedCategoryTitle?: string;
    photoFileId?: string;
    rawNotes?: string;
    generatedOptions?: Array<{
      optionNumber: number;
      angle: string;
      title: string;
      excerpt: string;
      readTime: string;
      contentHtml: string;
    }>;
    updatedAt: Timestamp;
  }
  ```

### 3.2 Vòng đời chuyển dịch trạng thái (State Transition)
1. **Lệnh `/start` hoặc `/dangbai`:**
   - Bot đọc danh sách danh mục từ Firestore qua `getCategories('doi-song')`.
   - Sinh Inline Keyboard các danh mục.
   - Session khởi tạo: `step = 'IDLE'`.
2. **Callback Query `cat_<categoryId>`:**
   - Bot cập nhật session: `step = 'AWAITING_CONTENT'`, `selectedCategoryId = categoryId`.
   - Gửi hướng dẫn: *"✅ Đã chọn chuyên mục: **{Tên}**\n\n📸 Vui lòng gửi 1 bức ảnh đại diện kèm nội dung/ý tưởng sơ lược (gửi trực tiếp trong caption ảnh hoặc nhắn ngay sau đó)."*
3. **Người dùng gửi Ảnh + Ý tưởng (Photo + Caption hoặc Photo rồi gửi Text):**
   - Lưu `photoFileId = message.photo[last].file_id` (lấy ảnh độ phân giải cao nhất).
   - Lưu `rawNotes = message.caption || message.text`.
   - Bot gửi tin nhắn tạm: *"⏳ Bot đang đọc ảnh và nhờ Gemini 2.5 Flash sáng tạo 2 phương án bài viết... Vui lòng đợi trong giây lát!"*
   - Gọi hàm sinh nội dung AI qua Gemini API.
   - Nhận kết quả 2 phương án, lưu vào session: `step = 'AWAITING_SELECTION'`, `generatedOptions = [opt1, opt2]`.
   - Gửi 2 phương án vào Telegram kèm Inline Keyboard:
     `[ 1️⃣ Chọn Phương Án 1 ]` `[ 2️⃣ Chọn Phương Án 2 ]`  
     `[ 🔄 Tạo lại phương án khác ]` `[ ❌ Hủy bỏ ]`
4. **Callback Query `select_opt_1` hoặc `select_opt_2`:**
   - Bot gọi `answerCallbackQuery` ngay lập tức: *"Đã chọn phương án! Đang đóng gói xuất bản..."*
   - Lấy phương án được chọn từ session.
   - Tải file ảnh từ Telegram qua `photoFileId`.
   - Gọi Pipeline xử lý ảnh (Milestone 1): nén WebP < 350KB, chèn watermark `public/logo_fpt_fai.png`, upload lên Cloud Storage và nhận public URL.
   - Ghi document mới vào Firestore collection `posts`:
     - `published: true`
     - `categoryId: session.selectedCategoryId`
     - `image: publicImageUrl`
     - `title`, `slug`, `excerpt`, `contentHtml`, `readTime` từ phương án AI.
   - Xóa session hoặc đặt lại `step = 'IDLE'`.
   - Gửi tin nhắn hoàn tất kèm link xem trực tiếp `/doi-song` và link sửa `/admin/posts/[id]`.

---

## 4. CHIẾN LƯỢC PROMPT VÀ TÍCH HỢP GEMINI 2.5 FLASH (R2)

### 4.1 Cấu hình & SDK
- **Model chuẩn:** `gemini-2.5-flash`
- **Khả năng Multimodal (Đa phương thức):** Cho phép truyền trực tiếp ảnh chụp từ Telegram (dưới dạng Base64 `inlineData`) kết hợp cùng ghi chú/ý tưởng thô của người dùng. Mô hình sẽ phân tích bối cảnh, con người, sự kiện trong ảnh để viết bài chuẩn xác, không bị "ảo giác".
- **Structured Outputs (JSON Schema):** Ép mô hình trả về cấu trúc JSON chuẩn 100%, loại bỏ lỗi parse markdown hoặc thiếu trường.

### 4.2 Đặc tả System Prompt & 2 Phương Án Khác Biệt
```text
Bạn là Trưởng ban Biên tập kiêm Chuyên gia Copywriting cấp cao của Viện Đào tạo Quốc tế FPT (FAI) — quản lý các chương trình đào tạo quốc tế: FPT Aptech, FPT Arena Multimedia, FPT Skillking và FPT Jetking.

Nhiệm vụ: Phân tích hình ảnh thực tế và ghi chú/ý tưởng sơ lược từ phóng viên, giảng viên hoặc sinh viên, sau đó tạo ra CHÍNH XÁC 2 PHƯƠNG ÁN BÀI VIẾT HOÀN CHỈNH mang 2 góc nhìn và phong cách tự sự khác biệt rõ rệt.

1. PHƯƠNG ÁN 1: Góc nhìn Trải nghiệm & Cảm hứng (Narrative Storytelling)
- Phong cách: Giàu cảm xúc, chân thực, tái hiện đời sống và hành trình chuyển mình của sinh viên FAI ("Một cộng đồng - nhiều hành trình - không có khuôn mẫu", "Học để hiểu - Hiểu để làm được").
- Trọng tâm: Không khí sự kiện, cảm xúc tân khoa/sinh viên, tình bạn, vượt qua thử thách dự án.

2. PHƯƠNG ÁN 2: Góc nhìn Chuyên môn & Định hướng nghề nghiệp (Professional & Action-Oriented)
- Phong cách: Thực chiến, sắc sảo, năng động, mang đậm chất công nghệ và kỹ năng tương lai (AI, vi mạch, mỹ thuật số, fullstack, marketing).
- Trọng tâm: Giá trị sản phẩm thực tế, kỹ năng làm việc với doanh nghiệp, cơ hội việc làm và bài học nghề nghiệp đúc kết.

QUY TẮC NỘI DUNG (ÁP DỤNG CHO CẢ 2 PHƯƠNG ÁN):
- Tiêu đề (title): Hấp dẫn, báo chí, dưới 100 ký tự.
- Tóm tắt (excerpt): Súc tích 1-2 câu (120 - 220 ký tự).
- Thời gian đọc (readTime): Ước tính số phút (ví dụ: "3 phút", "4 phút").
- Nội dung (contentHtml): Bài viết hoàn chỉnh 350 - 550 từ định dạng Semantic HTML:
  + Dùng <h3> cho tiêu đề các phần (tuyệt đối KHÔNG dùng <h1> hoặc <h2> vì đã có ở header trang).
  + Dùng <p> cho từng đoạn văn rõ ràng.
  + Dùng <blockquote> cho trích dẫn phát biểu tâm đắc của giảng viên/sinh viên/chuyên gia.
  + Dùng <ul>, <li> nếu có danh sách điểm nhấn hoặc lưu ý.
  + Dùng <strong>, <em> nhấn mạnh từ khóa tự nhiên.
  + Không chứa khối code markdown (như ```html), chỉ trả về chuỗi HTML chuẩn bên trong JSON.
```

### 4.3 JSON Schema chi tiết
```json
{
  "type": "OBJECT",
  "properties": {
    "options": {
      "type": "ARRAY",
      "items": {
        "type": "OBJECT",
        "properties": {
          "optionNumber": { "type": "INTEGER" },
          "angle": { "type": "STRING", "description": "Tên góc nhìn của phương án" },
          "title": { "type": "STRING", "description": "Tiêu đề bài viết" },
          "excerpt": { "type": "STRING", "description": "Mô tả ngắn gọn" },
          "readTime": { "type": "STRING", "description": "Thời gian đọc ước tính" },
          "contentHtml": { "type": "STRING", "description": "Nội dung Semantic HTML chuẩn" }
        },
        "required": ["optionNumber", "angle", "title", "excerpt", "readTime", "contentHtml"]
      }
    }
  },
  "required": ["options"]
}
```

---

## 5. TRÌNH BÀY NỘI DUNG TRÊN TELEGRAM & XỬ LÝ ĐẶC THÙ TELEGRAM HTML

### 5.1 Lưu ý cốt tử về định dạng Telegram
- Trình phân tích `parse_mode: 'HTML'` của Telegram chỉ hỗ trợ một tập thẻ rất nhỏ: `<b>`, `<i>`, `<code>`, `<pre>`, `<a>`, `<blockquote>`.
- Các thẻ HTML chuẩn web như `<h3>`, `<p>`, `<ul>`, `<li>` **KHÔNG ĐƯỢC HỖ TRỢ** trong Telegram. Nếu gửi trực tiếp `contentHtml` với `parse_mode: 'HTML'`, Telegram API sẽ báo lỗi `400 Bad Request: can't parse entities`.
- **Giải pháp tối ưu:**
  - Trong tin nhắn Telegram gửi người dùng duyệt phương án: Chỉ hiển thị Tiêu đề, Thời gian đọc, Mô tả tóm tắt (Excerpt) và 1 trích đoạn ngắn dạng văn bản thuần/Telegram Markdown.
  - Toàn bộ chuỗi `contentHtml` đầy đủ giữ nguyên vẹn trong Firestore Session, sẵn sàng ghi vào document `posts` khi người dùng bấm chọn.

### 5.2 Mẫu giao diện tin nhắn Telegram hiển thị 2 phương án
```text
🤖 FAI Web AI Editor đã phân tích ảnh & ý tưởng của bạn và tạo ra 2 phương án bài viết:

━━━━━━━━━━━━━━━━━━━━
🌟 PHƯƠNG ÁN 1: [Trải nghiệm & Cảm hứng]
📌 Tiêu đề: Khép lại hành trình "Being", sẵn sàng bứt phá đến chân trời "Beyond"
⏱ Thời gian đọc: 3 phút
📖 Tóm tắt: Gần 300 tân khoa đến từ FPT Aptech, FPT Arena Multimedia, FPT Skillking và FPT Jetking đã cùng nhau đánh dấu cột mốc trưởng thành tại Lễ Tốt nghiệp 2026 với chủ đề "Beyond Being".

━━━━━━━━━━━━━━━━━━━━
🚀 PHƯƠNG ÁN 2: [Thực chiến & Nghề nghiệp]
📌 Tiêu đề: Tân khoa FAI 2026: Bản lĩnh công nghệ thực chiến mở lối tương lai
⏱ Thời gian đọc: 4 phút
📖 Tóm tắt: Tốt nghiệp không chỉ là cột mốc khép lại chặng đường học tập, mà là bệ phóng đưa những kỹ sư, nhà thiết kế trẻ tự tin bước vào thị trường lao động toàn cầu.
━━━━━━━━━━━━━━━━━━━━

👇 Vui lòng chọn phương án bạn ưng ý nhất bên dưới để xuất bản:
```
**Inline Keyboard đi kèm:**
```
[ 1️⃣ Chọn Phương Án 1 ]  [ 2️⃣ Chọn Phương Án 2 ]
[ 🔄 Tạo lại phương án ]  [ ❌ Hủy bỏ ]
```

---

## 6. TÍCH HỢP VỚI HỆ THỐNG HIỆN TẠI (POST-PUBLISH INTEGRATION)

### 6.1 Ghi nhận vào Firestore & Hiển thị trên `/doi-song`
Khi người dùng chọn Phương án 1 hoặc 2:
1. Hàm tạo bài viết gọi `createPost(postPayload)` (đã có sẵn trong `src/lib/firestore.js`).
2. Do trang `/doi-song` truy vấn Firestore theo thời gian thực:
   ```javascript
   const categories = await getCategories('doi-song');
   const blocks = await Promise.all(
     categories.map(async (cat) => {
       const posts = await getPosts({ categoryId: cat.id, published: true });
       return { ...cat, posts };
     })
   );
   ```
   Bài viết mới lập tức xuất hiện ngay trên khối chuyên mục tương ứng mà không cần build lại ứng dụng.
3. Slug tự động sinh qua hàm `generateSlug(title) + '-' + Date.now().toString().slice(-4)` đảm bảo tính duy nhất.

### 6.2 Phản hồi Telegram sau khi xuất bản
Tin nhắn gửi người dùng:
```text
🎉 Xuất bản bài viết thành công!

📰 Tiêu đề: Lễ Tốt nghiệp 2026 Viện Đào tạo Quốc tế FPT Hà Nội...
📂 Chuyên mục: Lễ tốt nghiệp qua các năm
⏱ Thời gian đọc: 3 phút
📅 Ngày đăng: 03-09-2026

🌐 Xem bài viết trên web:
https://fai-gamma.vercel.app/doi-song

✏️ Chỉnh sửa chi tiết bài viết (Yêu cầu đăng nhập Admin):
https://fai-gamma.vercel.app/admin/posts/abc123xyzDocId
```

---

## 7. ĐẶC TẢ BIẾN MÔI TRƯỜNG & DANH SÁCH GÓI CẦN THIẾT

### 7.1 Biến môi trường cần thêm vào `.env.local`
```env
# ==========================================
# TELEGRAM BOT & SECURITY (R2 & R4)
# ==========================================
TELEGRAM_BOT_TOKEN=8964853536:AAHuRNm_hY-YQtveBD1HlmthN4I5xpVzM8U
TELEGRAM_WEBHOOK_SECRET=fai_telegram_secure_token_2026
TELEGRAM_ALLOWED_USERS=2050406425
TELEGRAM_ALLOWED_CHATS=2050406425

# ==========================================
# GOOGLE GEMINI AI (R2)
# ==========================================
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash

# ==========================================
# PUBLIC APP URL
# ==========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 7.2 Thư viện (Dependencies)
- **Tùy chọn A (Khuyên dùng - Zero external SDK cho Telegram & Gemini):**
  - Telegram Bot API: Dùng `fetch` native của Node.js.
  - Gemini 2.5 Flash: Dùng `fetch` native gọi Google AI Studio REST API với JSON Schema.
  - Lợi ích: Tối đa hóa hiệu năng, giảm dung lượng bundle, không lo lỗi xung đột phiên bản với Next.js 16 / React 19.
- **Tùy chọn B:**
  - Cài đặt `@google/genai` (SDK chính thức mới của Google) để quản lý Gemini call.

---

## 8. KẾT LUẬN & ĐỀ XUẤT CHO BƯỚC THỰC THI (WORKER RECOMMENDATIONS)

1. **Cấu trúc Module đề xuất tạo mới:**
   - `src/app/api/telegram/webhook/route.js`: Webhook Route Handler chính.
   - `src/lib/telegram.js`: Tiện ích gọi Telegram Bot API (`sendMessage`, `getFile`, `answerCallbackQuery`, etc.).
   - `src/lib/gemini.js`: Hàm gọi Gemini 2.5 Flash sinh 2 phương án bài viết qua Vision/Multimodal.
   - `src/lib/telegramSession.js`: Hàm quản lý session trên collection Firestore `telegram_sessions`.
2. **Khớp nối với Milestone 1 (Storage & Image Pipeline):**
   - Webhook Bot tải buffer ảnh từ Telegram -> chuyển qua hàm `processAndWatermarkImage(buffer)` của Worker M1 -> nhận URL Cloud Storage -> gán vào `post.image`.
3. **Tính sẵn sàng:**
   - Tất cả các điểm nghẽn kỹ thuật (bảo mật Secret Token, whitelist User ID, Firestore categories, state machine, format Telegram HTML, prompt Gemini) đã được định hình chi tiết và sẵn sàng cho đội ngũ Worker triển khai.
