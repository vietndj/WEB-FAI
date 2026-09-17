# Báo Cáo Handoff: Khảo Sát Kỹ Thuật R2 & R4 (Telegram Bot Webhook & AI 2-Option Publishing Flow + Security)

**Agent:** `explorer_telegram_ai`  
**Working Directory:** `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_telegram_ai`  
**Target Recipient:** `parent` (`df6c1b63-ee58-4cad-81f0-63b8dcee5b36`)  
**Type:** Hard (Task complete)

---

## 1. Observation (Quan Sát Trực Tiếp)

1. **Next.js & API Route Handlers:**
   - Trong `fai/package.json` (dòng 14-16), Next.js đang ở phiên bản `"next": "16.2.9"`, `"react": "19.2.4"`.
   - Kiểm tra cây thư mục `src/app/` qua công cụ tìm kiếm: Thư mục `src/app/api` chưa từng tồn tại; chưa có bất kỳ tệp `route.js` nào trong mã nguồn ứng dụng FAI.
2. **Mô hình Dữ liệu Categories & Posts trong Firestore:**
   - Tệp `src/lib/firestore.js` (dòng 26-57): Hàm `getCategories(group)` thực hiện truy vấn Firestore collection `'categories'` với điều kiện `where('group', '==', group)` và sắp xếp `orderBy('order', 'asc')`.
   - Tệp `scripts/migrate-doi-song.js` (dòng 27-73): Xác nhận danh sách 5 danh mục cố định thuộc nhóm `'doi-song'` bao gồm:
     - `graduation`: *Lễ tốt nghiệp qua các năm\nLễ tôn vinh SVXS các học kỳ*
     - `enterprise`: *Doanh nghiệp & FAI*
     - `sharing`: *Nhỏ to cùng chia sẻ - Nói nhỏ nói to*
     - `contests`: *Sân chơi & giải thưởng*
     - `community`: *FAI & cộng đồng*
   - Tệp `src/app/doi-song/page.js` (dòng 285-303 và dòng 683): Trang `/doi-song` tải categories và posts thời gian thực từ Firestore (`getCategories('doi-song')`, `getPosts({ categoryId, published: true })`) và hiển thị `contentHtml` qua `dangerouslySetInnerHTML`.
   - Tệp `src/app/admin/posts/new/page.js` (dòng 94-111) và `[id]/page.js` (dòng 117-134): Bài viết yêu cầu các trường: `title`, `slug`, `categoryId`, `date` (định dạng `DD-MM-YYYY`), `image`, `excerpt`, `contentHtml`, `sourceUrl`, `author`, `readTime`, `order`, `published`, `group: 'doi-song'`.
3. **Môi trường & SDKs hiện tại:**
   - Trong `fai/package.json` (dòng 11-18), chưa có SDK của Telegram (như `telegraf`) và chưa có SDK của Google Gemini (như `@google/genai` hoặc `@google/generative-ai`).
   - Tệp `fai/.env.local` hiện chỉ chứa cấu hình Firebase Client (`NEXT_PUBLIC_FIREBASE_*`). Chưa có `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `TELEGRAM_ALLOWED_USERS`.
   - Kiểm tra kỹ năng hệ thống `/Users/vietmac/.gemini/config/skills/telegram-dispatcher/SKILL.md` và script `/Users/vietmac/Documents/CODE/Quản gia/telegram_notify.py`: Chat ID người dùng cá nhân của anh Việt là `2050406425`.
4. **Bảo vệ xác thực Admin:**
   - Tệp `src/app/admin/layout.js` (dòng 16-26): Đã cài đặt bộ lắng nghe trạng thái `onAuthStateChanged(auth, ...)` và tự động chuyển hướng về `/admin/login` nếu người dùng chưa đăng nhập.

---

## 2. Logic Chain (Chuỗi Lập Luận Từ Quan Sát Đến Giải Pháp)

1. **Khởi tạo Webhook Route Handler (Từ Quan sát 1):**
   - Vì Next.js 16 App Router hỗ trợ Route Handlers trực tiếp, ta chỉ cần tạo tệp `src/app/api/telegram/webhook/route.js` xuất hàm `POST(request)`.
   - Để tương thích với môi trường Node.js xử lý Buffer ảnh và SDK Firebase, cần khai báo `export const dynamic = 'force-dynamic'` và `export const runtime = 'nodejs'`.
2. **Cơ chế Bảo mật Kép (Từ Quan sát 1, 3 và Yêu cầu R4):**
   - **Lớp 1 (Secret Token):** Kiểm tra header `X-Telegram-Bot-Api-Secret-Token` đối chiếu với `process.env.TELEGRAM_WEBHOOK_SECRET`. Nếu không khớp, trả về HTTP 401 ngay lập tức để chặn request giả mạo.
   - **Lớp 2 (Whitelist User ID / Chat ID):** Trích xuất `update.message.from.id` hoặc `update.callback_query.from.id`, đối chiếu với biến `process.env.TELEGRAM_ALLOWED_USERS`. Nếu người lạ, bot từ chối thực thi và gửi tin nhắn cảnh báo chứa ID để xin cấp quyền.
3. **Tương thích Telegram API Không Cần Thư Viện Ngoài (Từ Quan sát 3):**
   - Các thư viện Telegram như `telegraf` hay `node-telegram-bot-api` thường gây lỗi trong môi trường Serverless/Edge do kỳ vọng tiến trình chạy liên tục (long-polling) hoặc dependencies cồng kềnh.
   - Sử dụng `fetch` nguyên bản của Node.js gọi trực tiếp Telegram Bot API (`https://api.telegram.org/bot<TOKEN>/...`) cho các phương thức: `sendMessage`, `answerCallbackQuery`, `getFile`, `editMessageText`. Giải pháp này 0-dependency, nhẹ, tin cậy tuyệt đối.
4. **Hiển thị Danh Mục Động & Tránh Giới Hạn Telegram (Từ Quan sát 2):**
   - Khi nhận `/start` hoặc `/dangbai`, bot gọi trực tiếp `getCategories('doi-song')` từ Firestore.
   - Tạo Inline Keyboard với `callback_data: cat_<categoryId>`. Vì ID danh mục rất ngắn (`graduation`, `enterprise`, etc.), độ dài callback_data chỉ ~15 bytes (dưới ngưỡng 64 bytes của Telegram).
5. **Quản lý Trạng thái Serverless Bền Vững (Từ Quan sát 1, 2):**
   - Vì Next.js serverless không giữ bộ nhớ RAM giữa các request, ta sử dụng Firestore collection `telegram_sessions` với Document ID là `String(chatId)`.
   - Session lưu giữ: `step`, `selectedCategoryId`, `photoFileId`, `rawNotes`, `generatedOptions`.
6. **Chiến lược Prompt & Định dạng Gemini 2.5 Flash (Từ Quan sát 2, 3 và Yêu cầu R2):**
   - Gemini 2.5 Flash có tính năng Multimodal: Tải ảnh Telegram qua `file_id`, truyền Base64 vào Gemini kèm ý tưởng/ghi chú thô của người dùng.
   - Dùng JSON Schema (`responseMimeType: "application/json"`) để ép AI trả về chính xác 2 phương án:
     - Phương án 1: Trải nghiệm & Cảm hứng (Storytelling, FAI Life).
     - Phương án 2: Thực chiến & Nghề nghiệp (Công nghệ, kỹ năng, doanh nghiệp).
   - Mỗi phương án cung cấp đầy đủ: `title`, `excerpt`, `readTime`, `contentHtml`.
7. **Định dạng Tin Nhắn Telegram Tránh Lỗi Parse (Từ Quan sát 2):**
   - Telegram HTML parser không hỗ trợ `<h3>`, `<p>`, `<ul>`, `<li>`. Nếu gửi chuỗi `contentHtml` trực tiếp vào Telegram với `parse_mode: 'HTML'`, Telegram sẽ ném lỗi `400 Bad Request`.
   - Do đó, tin nhắn gửi vào Telegram chỉ dùng text tóm tắt sạch (Title, Read Time, Excerpt). Toàn bộ `contentHtml` gốc được giữ nguyên trong session và ghi thẳng vào Firestore `posts` khi người dùng bấm chọn.
8. **Đóng Gói Xuất Bản & Tích Hợp Giao Diện Đời Sống (Từ Quan sát 2 và Yêu cầu R1, R2):**
   - Khi người dùng bấm `select_opt_1` hoặc `select_opt_2`, bot lấy `photoFileId`, chuyển qua pipeline xử lý ảnh M1 (watermark logo FAI + nén WebP + upload Cloud Storage).
   - Ghi bài viết mới vào Firestore collection `posts` với `published: true`.
   - Trang `/doi-song` tự động nhận và hiển thị bài viết mới ngay lập tức.
   - Bot phản hồi link xem bài trên web và link sửa tại `/admin/posts/[id]`.

---

## 3. Caveats (Các Điểm Cần Lưu Ý & Giới Hạn)

1. **Khóa API Gemini & Token Telegram:** Trong môi trường local hiện tại, chưa có giá trị thực của `GEMINI_API_KEY` và `TELEGRAM_BOT_TOKEN` trong file `.env.local`. Cần bổ sung vào `.env.local` để hệ thống hoạt động thực tế.
2. **Khớp nối với Milestone 1 (M1 - Storage & Image Processing):** Việc tối ưu ảnh và chèn logo FAI watermark thuộc phạm vi M1 do subagent `explorer_storage_img` / Worker M1 xây dựng. Webhook của R2 sẽ gọi trực tiếp module xử lý ảnh của M1 khi người dùng chọn phương án.
3. **Thời gian phản hồi của Webhook (Timeout):** Telegram yêu cầu Webhook trả về 200 OK nhanh chóng (dưới vài chục giây). Quá trình gọi Gemini 2.5 Flash thường mất 3-6 giây, hoàn toàn nằm trong ngưỡng an toàn. Tuy nhiên, nếu triển khai Vercel Hobby (giới hạn 10s hoặc 15s), cần gửi tin nhắn thông báo tiến trình cho người dùng trước khi gọi API.

---

## 4. Conclusion (Kết Luận Đánh Giá)

Hệ thống Telegram Bot Webhook và luồng tạo bài viết tự động 2 phương án bằng Gemini 2.5 Flash hoàn toàn khả thi và có thể tích hợp mượt mà vào kiến trúc Next.js App Router hiện tại của FAI Web với các đặc điểm:
- **Kiến trúc Zero-Dependency:** Không phụ thuộc vào thư viện bot nặng nề; sử dụng API tiêu chuẩn của Node.js và Firebase Firestore.
- **Bảo mật tuyệt đối (R4):** Kiểm soát nghiêm ngặt 2 lớp qua `X-Telegram-Bot-Api-Secret-Token` và whitelist `TELEGRAM_ALLOWED_USERS`.
- **Độ tin cậy cao:** Quản lý phiên làm việc đa bước qua Firestore `telegram_sessions`, hoàn toàn miễn nhiễm với hiện tượng mất trạng thái trên môi trường Serverless.
- **Tương thích 100% với giao diện `/doi-song`:** Cấu trúc dữ liệu bài viết khớp hoàn toàn với schema của trang người dùng và hệ thống quản trị admin.

---

## 5. Verification Method (Phương Pháp Kiểm Tra & Nghiệm Thu)

Sau khi Worker hoàn tất triển khai mã nguồn, người kiểm thử có thể độc lập xác thực theo các bước:

1. **Kiểm tra Secret Token (Bảo mật Webhook):**
   ```bash
   # Gửi request không có token -> Mong đợi HTTP 401
   curl -i -X POST http://localhost:3000/api/telegram/webhook \
     -H "Content-Type: application/json" \
     -d '{"update_id": 1}'
   ```
2. **Kiểm tra Whitelist Người Dùng:**
   ```bash
   # Gửi request giả lập người lạ không có trong TELEGRAM_ALLOWED_USERS
   curl -i -X POST http://localhost:3000/api/telegram/webhook \
     -H "Content-Type: application/json" \
     -H "X-Telegram-Bot-Api-Secret-Token: <SECRET>" \
     -d '{"update_id": 1, "message": {"from": {"id": 999999999}, "chat": {"id": 999999999}, "text": "/start"}}'
   # Mong đợi: Phản hồi từ chối quyền truy cập, không mở danh sách chuyên mục
   ```
3. **Kiểm tra Luồng Lấy Chuyên Mục Động:**
   - Gửi lệnh `/start` từ tài khoản nằm trong whitelist.
   - Kiểm tra tin nhắn Telegram trả về danh sách 5 nút inline tương ứng với 5 chuyên mục của `doi-song` trong Firestore.
4. **Kiểm tra Sinh 2 Phương Án Bài Viết:**
   - Gửi ảnh + ý tưởng mô tả.
   - Kiểm tra log và tin nhắn Telegram: Gemini 2.5 Flash trả về đúng 2 phương án với tiêu đề, tóm tắt và 2 nút chọn `[Chọn Phương Án 1]` và `[Chọn Phương Án 2]` trong < 15 giây.
5. **Kiểm tra Xuất Bản & Hiển Thị:**
   - Bấm `[Chọn Phương Án 1]`.
   - Kiểm tra bài viết mới xuất hiện trong collection `posts` trên Firebase Console.
   - Mở trình duyệt `http://localhost:3000/doi-song`, xác nhận bài viết mới xuất hiện ngay tại khối chuyên mục đã chọn với ảnh, tiêu đề và modal nội dung HTML chuẩn xác.
