# Original User Request

## 2026-09-03T07:53:13Z

# Teamwork Project Prompt

Requested team: Team đầy đủ (Full multi-agent team)

Cập nhật lại toàn bộ nội dung và giao diện trang Tuyển sinh (`/tuyen-sinh`) trên môi trường local Next.js theo tài liệu đặc tả tuyển sinh FAI 2026 từ Google Sheet, đảm bảo giao diện chuyên nghiệp, hiện đại, tương thích responsive và tuyệt đối chỉ chạy trên local.

Working directory: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`
Integrity mode: development

Tài liệu tham khảo nội dung:
- Nguồn Google Sheet: `https://docs.google.com/spreadsheets/d/1o-AA9iOXfsjGD-nKaFo-KDH4wqzT61hzoUK5WuuHSmU/edit?gid=1279045597#gid=1279045597`

## Requirements

### R1. Cập nhật nội dung trang Tuyển sinh (`src/app/tuyen-sinh/page.js`)
Cập nhật đầy đủ các phần theo dữ liệu từ Google Sheet:
1. **Quy chế tuyển sinh & Điều kiện nhập học**:
   - Đối tượng tuyển sinh: Cơ hội rộng mở cho người đam mê (Viện Đào tạo Quốc tế FPT chào đón tất cả các ứng viên mong muốn sở hữu kỹ năng chuyên môn thực chiến quốc tế, không giới hạn độ tuổi hay chuyên ngành nền tảng). Nhấn mạnh đối tượng "Người đi làm chuyển ngành" (muốn thay đổi công việc hiện tại, tìm kiếm nghề truyền cảm hứng và thu nhập lý tưởng).
   - Cách thức đăng ký: Bỏ hoàn toàn phần thi tuyển / kiểm tra năng lực cũ (Môn 1 Tiếng Anh, Môn 2 Sáng tạo/Logic). Thay bằng 2 hình thức xét tuyển thẳng:
     + Đăng ký Online: Nhập học trực tuyến tại website Viện Đào tạo Quốc tế FPT. Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển.
     + Đăng ký trực tiếp: Tại các cơ sở của Viện Đào tạo Quốc tế FPT. Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển.
   - Hồ sơ nhập học: Rút gọn chính xác theo mẫu: 01 Phiếu đăng ký nhập học, 01 Bản sao công chứng CCCD, 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết".

2. **Học bổng và Ưu đãi nhập học 2026**:
   Tạo khối hiển thị phân chia theo 4 sản phẩm/thương hiệu đào tạo (dạng tab hoặc grid card trực quan):
   - **FPT Aptech**: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 2 triệu.
   - **FPT Arena Multimedia**: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu.
   - **FPT Skillking**: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu.
   - **FPT Jetking**: Học bổng tài năng Chip Design 8 triệu, Học bổng tài năng AI Agent 8 triệu.

3. **Chính sách học phí 2026**:
   Thiết kế khối thông tin chuyển khoản học phí rõ ràng cho 2 khu vực:
   - **Hà Nội**: STK `00006969813` - Trường Đại học FPT - Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội - Cú pháp: `FAIHN_hotensinhvien_HP HK 1`.
   - **Đà Nẵng**: STK `03557714109` - Phân hiệu trường Đại học FPT tại TP Đà Nẵng - Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng - Cú pháp: `FAIDN_hotensinhvien_HP HK 1`.
   Kèm lưu ý chọn đúng tài khoản tương ứng với cơ sở đang theo học.

4. **Loại bỏ khối Câu hỏi thường gặp (FAQ)**:
   Không hiển thị khối FAQ trên trang này.

5. **Đăng ký tuyển sinh trực tuyến & Liên hệ**:
   - Khối thông tin liên hệ: Hotline `024 7300 8855` • `0236 730 8826`, Email `fai@fpt.edu.vn`.
   - Form đăng ký trực tuyến gồm:
     + Họ và tên
     + Số điện thoại
     + Email
     + Dropdown chọn chương trình quan tâm (đủ 11 chương trình):
       * Lập trình Fullstack 2 năm - FPT Aptech
       * Lập trình Back end 1 năm - FPT Aptech
       * Lập trình Front end 6 tháng - FPT Aptech
       * Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech
       * Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia
       * Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia
       * Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia
       * Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking
       * Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking
       * Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking
       * Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking
     + Lựa chọn Cơ sở: Hà Nội hoặc Đà Nẵng
     + Checkbox bắt buộc: "Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập trên trang này, được xử lý và lưu trữ bởi Tổ chức giáo dục FPT cho mục đích và theo điều kiện đã được công bố tại Quy định bảo vệ dữ liệu cá nhân của Tổ chức giáo dục FPT tại đây" (link trỏ đến `https://fpt.edu.vn/thu-vien-anh/11140`).

### R2. Ràng buộc phát triển Local & Thẩm mỹ UI
- Chỉ cập nhật mã nguồn trên môi trường local, kiểm tra trực tiếp qua `http://localhost:3000/tuyen-sinh`.
- Tuyệt đối KHÔNG tự động `git commit`, `git push` hay deploy lên Vercel/Production.
- Giữ vững style thiết kế hiện đại, tinh gọn của website FAI (tone màu thương hiệu cam `--primary`, phông chữ, responsive tốt trên cả mobile và desktop, không gây lỗi React hydration).

## Acceptance Criteria

### Content & Logic Verification
- [ ] Truy cập `http://localhost:3000/tuyen-sinh` trả về HTTP Status 200 không có lỗi console hay crash Turbopack.
- [ ] Không còn xuất hiện nội dung thi tuyển / bài test đầu vào cũ ("Môn 1: Tiếng Anh", "Môn 2: Sáng Tạo / Logic").
- [ ] Mục Cách thức đăng ký hiển thị rõ ràng thông điệp "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển" cho cả 2 hình thức Online và Trực tiếp.
- [ ] Hồ sơ nhập học có đúng 3 mục theo sheet: Phiếu đăng ký, CCCD công chứng, Cam kết sinh viên.
- [ ] Khối học bổng hiển thị đầy đủ thông tin của 4 thương hiệu (Aptech, Arena Multimedia, Skillking, Jetking).
- [ ] Khối học phí hiển thị chi tiết số tài khoản, ngân hàng TPBank và cú pháp chuyển khoản cho cả Hà Nội và Đà Nẵng.
- [ ] Không có khối FAQ trên giao diện.
- [ ] Form đăng ký có đầy đủ các trường nhập liệu, dropdown đủ 11 khóa học, lựa chọn cơ sở và checkbox điều khoản bảo vệ dữ liệu với link ngoài `https://fpt.edu.vn/thu-vien-anh/11140`.

## Follow-up — 2026-09-03T08:12:06Z

[THÔNG BÁO QUAN TRỌNG TỪ USER]:
Người dùng đang chạy một luồng làm việc song song tại conversation "Changing Default Web Font" (ID: 68e35354-1360-4e56-88eb-b75f5b3d996d).
Luồng đó đang can thiệp:
1. Đổi font mặc định sang SVN-Sonoma trong `src/app/globals.css` và thư mục `public/fonts/`.
2. Chỉnh sửa các component cơ sở Hà Nội / Đà Nẵng trong `src/components/ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, `Skillking100hFormSection.jsx`.
3. Chỉnh sửa trang liên hệ `src/app/lien-he/page.js`.

QUY TẮC KHÓA PHẠM VI TUYỆT ĐỐI (AVOID FILE CONFLICTS):
- Đội ngũ Teamwork Tuyển sinh CHỈ ĐƯỢC PHÉP đọc/ghi duy nhất tệp `src/app/tuyen-sinh/page.js`.
- Tuyệt đối KHÔNG sửa đổi, ghi đè hay revert bất kỳ tệp nào khác, đặc biệt là `src/app/globals.css`, `public/fonts/`, `src/components/*` hay `src/app/lien-he/page.js`.
- Sử dụng biến CSS chuẩn `var(--font-sans)` để tự động đồng bộ font chữ mới nhất từ luồng font.

## 2026-09-03T08:50:15Z

Xây dựng hệ thống xuất bản bài viết tự động qua Telegram Bot cho FAI Web và nâng cấp trình soạn thảo bài viết chuẩn WordPress cho trang Đời Sống (https://fai-gamma.vercel.app/doi-song).

Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Integrity mode: development

## Requirements

### R1. Cloud Storage & Image Optimization Pipeline
- Xóa bỏ hoàn toàn cơ chế lưu ảnh Base64 trong Firestore documents.
- Chuyển sang lưu trữ file ảnh trên Cloud Storage (Firebase Storage / Cloudflare R2) và chỉ lưu trữ public URL trong document `posts`.
- Tự động hóa xử lý ảnh: Mọi ảnh nhận từ Telegram hoặc upload qua web phải đi qua pipeline tự động nén (định dạng WebP/JPEG tối ưu, dung lượng < 350KB, max width 1600px) và gắn watermark logo FAI (`public/logo_fpt_fai.png`) tinh tế, sắc nét ở góc ảnh.

### R2. Telegram Bot Webhook & AI 2-Option Publishing Flow
- Triển khai Telegram Bot qua Next.js Webhook endpoint (`/api/telegram/webhook`).
- Luồng tương tác của Bot:
  1. Khi nhận lệnh hoặc tương tác bắt đầu, Bot truy vấn Firestore và hiển thị bàn phím inline các danh mục thuộc group `doi-song`.
  2. Người dùng chọn danh mục, gửi kèm ảnh và ý tưởng/tóm tắt nội dung thô.
  3. Bot tự động nạp dữ liệu, gửi prompt tới Google Gemini API (Gemini 2.5 Flash) để sinh ra **2 phương án bài viết hoàn chỉnh khác biệt về góc nhìn/giọng văn** (bao gồm Tiêu đề hấp dẫn, Mô tả ngắn excerpt, Nội dung bài viết rich HTML chuẩn semantic, thời gian đọc ước tính).
  4. Bot gửi lại 2 phương án cho người dùng kèm các nút bấm inline: `[Chọn Phương Án 1]` và `[Chọn Phương Án 2]`.
  5. Khi người dùng bấm chọn: Bot tự động tối ưu & watermark ảnh, ghi bài viết vào Firestore collection `posts` (với categoryId đã chọn, `published: true` hoặc `false` tùy cấu hình), đảm bảo hiển thị tức thì trên giao diện `https://fai-gamma.vercel.app/doi-song`.
  6. Bot gửi tin nhắn xác nhận thành công kèm đường link truy cập trực tiếp trang chỉnh sửa chi tiết: `https://.../admin/posts/[id]`.

### R3. WordPress-Grade CMS Rich Editorial Interface
- Nghiên cứu và nâng cấp trình soạn thảo tại `/admin/posts/[id]` và `/admin/posts/new` từ trình soạn thảo thô sơ hiện tại lên chuẩn WordPress / Gutenberg / TipTap editor:
  - Hỗ trợ các khối nội dung phong phú: Tiêu đề đa cấp độ (H2, H3, H4), đoạn văn bản, trích dẫn nổi bật (Blockquote), danh sách (bullet, numbered), kẻ ngang (divider), căn chỉnh lề (trái, giữa, phải).
  - Thanh công cụ nổi (Bubble Menu / Floating Toolbar) khi bôi đen chữ để định dạng nhanh (Bold, Italic, Strikethrough, Code, Link).
  - Quản lý và chèn hình ảnh minh họa inline trong bài viết, kèm chú thích ảnh (caption).
  - Xem trước bài viết thời gian thực (Live Preview) tương ứng chính xác với giao diện Modal bài viết trên trang `/doi-song`.

### R4. Security & Error Handling
- Bảo mật Webhook Telegram bằng Secret Token xác thực request.
- Xác thực người gửi Telegram (chỉ cho phép các Telegram User ID / Chat ID được cấp quyền trong whitelist đăng bài).
- Đảm bảo trang chỉnh sửa `/admin/posts/[id]` yêu cầu đăng nhập Firebase Auth trước khi truy cập.

## Acceptance Criteria

### Storage & Image Processing
- [ ] Ảnh upload lên Firebase Storage trả về URL công khai, không còn bất kỳ chuỗi Base64 nào lưu trong collection `posts`.
- [ ] Ảnh được tự động nén dung lượng (< 350KB) và gắn logo FAI mờ tinh tế ở góc ảnh đúng tỷ lệ, không bị vỡ hình.

### Telegram Bot Publishing Flow
- [ ] Gửi lệnh / đăng bài hiển thị đúng danh sách danh mục lấy thời gian thực từ Firestore (`doi-song`).
- [ ] Gửi ảnh + ý tưởng trả về chính xác 2 phương án bài viết hoàn chỉnh từ Gemini API trong < 15 giây.
- [ ] Bấm chọn 1 trong 2 phương án sẽ lưu thành công bài viết vào Firestore và gửi lại link chỉnh sửa `/admin/posts/[id]`.
- [ ] Bài viết mới tạo xuất hiện đầy đủ trên trang `/doi-song` (tiêu đề, ảnh gắn logo, ngày tháng, nội dung mở ra modal chuẩn).
- [ ] Người lạ ngoài danh sách Telegram ID được phép không thể kích hoạt đăng bài.

### Editorial Interface
- [ ] Trang `/admin/posts/[id]` sở hữu bộ công cụ soạn thảo hiện đại chuẩn WordPress (Heading, List, Quote, Link, Image, Bubble toolbar).
- [ ] Định dạng HTML sinh ra từ editor tương thích hoàn toàn với renderer của trang công khai `/doi-song`.

## 2026-09-03T08:57:02Z

The user has provided the Telegram Bot Token:
TELEGRAM_BOT_TOKEN=8768883845:AAEL32mZnUw8GG3ZrqeeENbTgs5ZRS87Vdk

And the authorized user's Telegram Chat ID is:
TELEGRAM_ALLOWED_USER_ID=2050406425

Both have been written into `fai/.env.local`. Please inform orchestrator_2 and the explorer/implementer agents to use these credentials for the webhook and Telegram Bot implementation.

## 2026-09-03T10:43:32Z

# Teamwork Project Prompt

Requested team: Team đầy đủ (Full multi-agent team)

Tái cấu trúc kiến trúc dữ liệu và giao diện cho website Viện Đào tạo Quốc tế FPT (FAI Web), giải quyết triệt để tình trạng mã nguồn bị phình to (God Files), tách rời dữ liệu nội dung (Single Source of Truth) và module hóa giao diện (Atomic Components & Design System) trên toàn bộ 12 trang web để việc cập nhật nội dung và tinh chỉnh UI diễn ra nhanh chóng, an toàn.

Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Integrity mode: development

## Requirements

### R1. Tách rời Dữ liệu Nội dung (Content Decoupling & Single Source of Truth)
- Xây dựng thư mục dữ liệu tập trung `src/data/` làm nguồn chân lý duy nhất (Single Source of Truth) cho các thông tin thường xuyên biến động:
  1. `src/data/programs.js`: Danh mục 11 chương trình đào tạo chính thức năm 2026 kèm lộ trình chi tiết.
  2. `src/data/scholarships.js`: Toàn bộ quỹ học bổng và mức ưu đãi 2026 của 4 thương hiệu (Aptech, Arena, Skillking, Jetking).
  3. `src/data/tuition.js`: Thông tin tài khoản ngân hàng học phí (Hà Nội & Đà Nẵng, STK, cú pháp).
  4. `src/data/contacts.js`: Hotline, email, địa chỉ các cơ sở đào tạo.
- Refactor các trang cốt lõi (`/tuyen-sinh`, `/lien-he`, các trang `/dao-tao/*`, và các Form component) để import trực tiếp từ các file data này thay vì nhúng cứng (hardcoded) chuỗi văn bản trong JSX.
- Khi cần cập nhật 1 thông tin (ví dụ: đổi hotline, sửa số tiền học bổng, đổi tên khóa học), chỉ cần sửa tại 1 vị trí duy nhất trong `src/data/`.

### R2. Bẻ nhỏ các trang Monolithic thành Atomic Components (Component Decomposition)
- Phân rã các tệp trang khổng lồ (điển hình: `src/app/tuyen-sinh/page.js` gần 2,000 dòng, `src/app/ve-fai/page.js` hơn 1,000 dòng) thành các component con độc lập:
  - Cho `/tuyen-sinh`: Đặt trong `src/components/tuyen-sinh/` (`HeroSection.jsx`, `TargetAudienceSection.jsx`, `AdmissionMethodSection.jsx`, `ScholarshipTabSection.jsx`, `TuitionBankSection.jsx`, `OnlineRegistrationSection.jsx`).
  - Giảm độ dài của các file `page.js` chính xuống dưới 250 dòng, chỉ giữ vai trò lắp ghép layout và quản lý SEO metadata.
- Thiết kế component layout tái sử dụng cho các trang đào tạo (`/dao-tao/*`) để giảm trùng lặp mã nguồn giữa các chuyên ngành.

### R3. Chuẩn hóa Design System & Giảm tải Inline Styles
- Trích xuất các cụm inline styles lặp lại hàng trăm lần (Glassmorphism, Gradient card, Section headings, Badge, Form controls) vào các class dùng chung trong CSS (`.fai-card-glass`, `.fai-badge`, `.fai-section-heading`...).
- Giữ vững toàn bộ token màu thương hiệu (`--primary`, `--secondary`, `--accent`) và font chữ chuẩn (`SVN-Sonoma`, `SVN-Poppins`).
- Đảm bảo độ tương thích 100% trên các thiết bị di động và desktop, không gây lỗi React Hydration mismatch.

### R4. Ràng buộc phát triển Local
- Chỉ cập nhật mã nguồn trên môi trường local, kiểm tra trực tiếp qua `http://localhost:3000`.
- Tuyệt đối KHÔNG tự động `git commit`, `git push` hay deploy lên Vercel/Production.

## Acceptance Criteria

### Content Decoupling Verification
- [ ] Mọi thông tin về 11 khóa học, học bổng 4 thương hiệu, STK học phí và hotline đều được load từ `src/data/`. Không còn chuỗi văn bản thông tin tĩnh bị hardcode trùng lặp giữa các trang.
- [ ] Thay đổi thử nghiệm một giá trị trong file data (ví dụ: số hotline hoặc một mức học bổng) lập tức phản ánh đồng bộ trên cả trang Tuyển sinh, Liên hệ và Form tương ứng mà không cần sửa từng trang.

### UI & Architecture Verification
- [ ] File `src/app/tuyen-sinh/page.js` và các page lớn được giảm từ 1000-2000 dòng xuống dưới 250 dòng thông qua các sub-components.
- [ ] Ứng dụng build và chạy mượt mà trên môi trường local `http://localhost:3000` với HTTP Status 200 trên tất cả các route chính (`/`, `/tuyen-sinh`, `/dao-tao/aptech/accp`, `/lien-he`).
- [ ] Kiểm tra responsive trên các kích thước màn hình (Mobile 375px, Tablet 768px, Desktop 1280px) không bị tràn ngang (overflow-x: hidden), các tính năng tương tác (tab học bổng, nút copy STK, submit form) hoạt động chính xác 100%.
- [ ] Tuân thủ nghiêm ngặt quy tắc dự án: Chỉ chạy trên Local, không tự ý `git commit`, `git push` hay deploy Vercel Production.

## 2026-09-03T15:13:01Z

Khắc phục triệt để lỗi tương tác Telegram Bot (bấm nút không phản hồi), thiết lập Local Polling Bridge hai chiều, cấu hình API và tự động mô phỏng đăng thử nghiệm 3 bài viết mới nhất từ FPT Aptech (https://aptech.fpt.edu.vn/) lên hệ thống FAI Web.

Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Integrity mode: development

## Requirements

### R1. Sửa Lỗi Tương Tác Telegram Bot & Thiết Lập Local Polling Bridge
- Chẩn đoán và giải quyết dứt điểm nguyên nhân Telegram Bot (`@FAI_dang_tin_bot`) không phản hồi khi bấm nút trên giao diện Telegram (nguyên nhân do Webhook URL trên Telegram đang trống, server chạy Localhost không nhận được update từ Telegram, và lỗi xác thực chứng chỉ TLS trên môi trường macOS/Node.js).
- Triển khai **Local Polling Bridge** (Long-polling worker) tự động bắt các sự kiện `/start`, chọn danh mục, gửi ảnh + bài viết từ Telegram và chuyển tiếp mượt mà vào endpoint `/api/telegram/webhook` trên `http://localhost:3000`.
- Xử lý chứng chỉ mạng (bỏ qua lỗi self-signed SSL certificate khi gọi `api.telegram.org` trên máy Mac) để đảm bảo mọi lệnh gửi/nhận tin nhắn và `callback_query` phản hồi tức thì (< 1 giây).

### R2. Xử Lý Khóa API & Hoàn Thiện Luồng Sinh Bài Viết Tự Động
- Cấu hình hoặc cung cấp giải pháp xử lý cho `GEMINI_API_KEY` (đang để trống trong `.env.local`) để chức năng sinh 2 phương án bài viết qua Gemini không bị ngắt quãng khi người dùng gửi ảnh/nội dung.
- Bổ sung cơ chế fallback nội dung thông minh nếu chưa có Gemini Key hoặc khi API gặp sự cố, đảm bảo luồng đăng bài không bao giờ bị nghẽn (zero-failure).

### R3. Thu Thập & Đăng Thử Nghiệm 3 Bài Viết Thực Tế Từ FPT Aptech
- Crawl dữ liệu 3 bài viết mới nhất trực tiếp từ `https://aptech.fpt.edu.vn/tin-tuc`:
  1. Wireframing – Thiết kế từ góc nhìn của người dùng
  2. AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp
  3. Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ
- Trích xuất tiêu đề, hình ảnh đại diện và nội dung tóm tắt của từng bài.
- Chạy mô phỏng gửi vào luồng Telegram Bot: tối ưu ảnh WebP (< 350KB), gắn logo watermark FAI, lưu vào Firestore collection `posts` thuộc chuyên mục `doi-song`.
- Kiểm tra tính toàn vẹn và hiển thị thực tế trên giao diện web `http://localhost:3000/doi-song` và CMS `http://localhost:3000/admin/posts`.

### R4. Báo Cáo Kết Quả Nghiệm Thu & Hướng Dẫn Vận Hành
- Xuất bản báo cáo chi tiết gồm các bài viết đã đăng, link xem bài trên Local, link chỉnh sửa admin, hình ảnh sau khi gắn watermark logo FAI, và nhật ký phản hồi của Telegram Bot.

## Acceptance Criteria

### Telegram Bot & Local Bridge
- [ ] Bấm vào các nút danh mục hoặc chọn phương án trên Telegram phản hồi ngay lập tức, không bị treo hoặc quay tròn vô tận.
- [ ] Lệnh gửi tin nhắn và `answerCallbackQuery` hoàn tất thành công 100% không vướng lỗi TLS/Certificate.

### Gemini & Fallback Content Pipeline
- [ ] Không còn lỗi crash hoặc 500 do thiếu `GEMINI_API_KEY`. Hệ thống xử lý mượt mà khi nhận ảnh và ghi chú.

### Test 3 Bài Viết Aptech
- [ ] Cả 3 bài viết từ `https://aptech.fpt.edu.vn/` được nạp vào hệ thống thành công.
- [ ] Ảnh đại diện của 3 bài được tự động nén WebP, gắn watermark logo FAI góc phải, lưu trữ Cloud Storage CDN URL (không có Base64).
- [ ] Dữ liệu 3 bài viết xuất hiện đầy đủ trên Firestore `posts`, hiển thị chuẩn xác tại `http://localhost:3000/doi-song` và mở được trong trình soạn thảo TipTap tại `http://localhost:3000/admin/posts/[id]`.

