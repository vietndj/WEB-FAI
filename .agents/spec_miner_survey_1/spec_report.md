# BÁO CÁO ĐẶC TẢ CHI TIẾT DỰ ÁN TRANG TUYỂN SINH FAI 2026
**Tài liệu**: Detailed Requirements & Specification Extraction Report  
**Đối tượng khảo sát**: Trang Tuyển sinh FAI (`/tuyen-sinh`)  
**Mã dự án**: FAI-ADMISSIONS-2026  
**Thời gian thực hiện**: 2026-09-03  
**Tác giả**: Specification Miner Agent (`spec_miner_survey_1`)  
**Nguồn đặc tả có thẩm quyền**: 
1. `ORIGINAL_REQUEST.md` (`/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md`)
2. Google Spreadsheet FAI 2026: `https://docs.google.com/spreadsheets/d/1o-AA9iOXfsjGD-nKaFo-KDH4wqzT61hzoUK5WuuHSmU/edit?gid=1279045597#gid=1279045597` (trích xuất trực tiếp qua CSV export API)
3. Hiện trạng mã nguồn Next.js: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js` và các thành phần liên quan (`Header.jsx`, `ScholarshipFormSection.jsx`, `globals.css`).

---

## 1. TỔNG QUAN VÀ BỐI CẢNH NÂNG CẤP

Trang Tuyển sinh hiện tại của Viện Đào tạo Quốc tế FPT (`/tuyen-sinh`) đang chứa các thông tin cũ từ quy chế tuyển sinh các năm trước:
- Vẫn duy trì bài kiểm tra năng lực đầu vào 2 môn ("Môn 1: Tiếng Anh", "Môn 2: Sáng tạo / Logic") và quy trình 4 bước có thi tuyển.
- Hồ sơ nhập học cũ gồm 5 loại giấy tờ (Bằng THPT, Học bạ, CCCD, Ảnh 3x4, Phiếu đăng ký).
- Chưa có khối thông tin Học bổng & Ưu đãi tuyển sinh 2026 cho 4 sản phẩm đào tạo.
- Chưa có khối Chính sách học phí với số tài khoản và cú pháp chuyển khoản chính thức cho cơ sở Hà Nội và Đà Nẵng.
- Thiếu Form đăng ký trực tuyến với danh sách 11 chương trình đào tạo và điều khoản bảo mật dữ liệu theo quy định FPT.
- Thông tin liên hệ hiển thị hotline cũ (`1900 6000`) thay vì các đường dây nóng trực tiếp của 2 cơ sở.

Bản đặc tả này xác định toàn bộ yêu cầu nâng cấp toàn diện trang Tuyển sinh 2026 theo cơ chế xét tuyển thẳng, số hóa và minh bạch tài chính.

---

## 2. BẢNG TÍNH NĂNG KHÁM PHÁ (FEATURES DISCOVERED)

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| F01 | R1.1 Quy chế tuyển sinh | Định vị đối tượng tuyển sinh 2026 | Hiển thị thông điệp "Cơ hội rộng mở cho người đam mê", chào đón mọi ứng viên, không giới hạn độ tuổi/nền tảng. Nhấn mạnh "Người đi làm chuyển ngành" muốn đổi nghề nhàm chán sang công việc truyền cảm hứng, thu nhập lý tưởng. Giữ song song đối tượng Tốt nghiệp THPT và Sinh viên ĐH/CĐ. | Props dữ liệu đối tượng | Giao diện thẻ/card trực quan, badge nhận diện | Fallback nội dung mặc định nếu thiếu props | ORIGINAL_REQUEST.md § R1.1, Google Sheet B4 |
| F02 | R1.1 Quy chế tuyển sinh | 2 Hình thức xét tuyển thẳng | Xoá bỏ 100% bài thi năng lực ("Môn 1 Tiếng Anh", "Môn 2 Sáng tạo/Logic"). Công bố rõ ràng 2 phương thức: (1) Đăng ký Online trên website FAI; (2) Đăng ký trực tiếp tại cơ sở FAI. Khẳng định: "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển". | Tương tác chọn phương thức hoặc xem chi tiết | Khối hiển thị 2 cột/card đối xứng với thông điệp xét tuyển thẳng rõ nét | N/A (Static presentation) | ORIGINAL_REQUEST.md § R1.1, Google Sheet B5 |
| F03 | R1.1 Quy chế tuyển sinh | Hồ sơ nhập học rút gọn (3 mục) | Tối giản thủ tục nhập học chỉ còn đúng 03 giấy tờ: 01 Phiếu đăng ký nhập học, 01 Bản sao công chứng CCCD, 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết". Loại bỏ bằng THPT, học bạ, ảnh thẻ 3x4 cũ. | Checklist giấy tờ | Khối checklist hiện đại với icon trực quan, hướng dẫn chuẩn bị | N/A (Static presentation) | ORIGINAL_REQUEST.md § R1.1, Google Sheet B6 |
| F04 | R1.2 Học bổng & Ưu đãi | Danh mục Học bổng FPT Aptech | Hiển thị 4 mức học bổng/ưu đãi: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 2 triệu. | Dữ liệu học bổng Aptech | Tab / Card card có số tiền lớn, điều kiện tóm tắt, CTA nhận tư vấn | N/A | ORIGINAL_REQUEST.md § R1.2, Google Sheet B7 |
| F05 | R1.2 Học bổng & Ưu đãi | Danh mục Học bổng FPT Arena Multimedia | Hiển thị 4 mức học bổng/ưu đãi: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu. | Dữ liệu học bổng Arena | Tab / Card với visual thương hiệu Arena | N/A | ORIGINAL_REQUEST.md § R1.2, Google Sheet B7 |
| F06 | R1.2 Học bổng & Ưu đãi | Danh mục Học bổng FPT Skillking | Hiển thị 4 mức học bổng/ưu đãi: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu. | Dữ liệu học bổng Skillking | Tab / Card với visual thương hiệu Skillking | N/A | ORIGINAL_REQUEST.md § R1.2, Google Sheet B7 |
| F07 | R1.2 Học bổng & Ưu đãi | Danh mục Học bổng FPT Jetking | Hiển thị 2 mức học bổng chuyên sâu công nghệ cao: Học bổng tài năng Chip Design 8 triệu, Học bổng tài năng AI Agent 8 triệu. | Dữ liệu học bổng Jetking | Tab / Card với visual thương hiệu Jetking | N/A | ORIGINAL_REQUEST.md § R1.2, Google Sheet B7 |
| F08 | R1.2 Học bổng & Ưu đãi | Bộ lọc/Tab chuyển đổi 4 thương hiệu | Cho phép người dùng chuyển đổi nhanh giữa 4 thương hiệu đào tạo (Aptech, Arena, Skillking, Jetking) hoặc xem dạng lưới so sánh tổng hợp. | Click chọn tab thương hiệu | Trạng thái hiển thị tương ứng với màu thương hiệu đặc trưng | Mặc định hiển thị tab đầu tiên (FPT Aptech) | ORIGINAL_REQUEST.md § R1.2, Ref BUV Scholarship pattern |
| F09 | R1.3 Chính sách học phí | Tài khoản học phí Cơ sở Hà Nội | Công bố số tài khoản TPBank Hà Nội: STK `00006969813` - Tên TK: Trường Đại học FPT - Ngân hàng: Tiên Phong (TPBank) chi nhánh Hà Nội - Cú pháp: `FAIHN_hotensinhvien_HP HK 1`. | Thao tác copy số tài khoản hoặc cú pháp | Box hiển thị ngân hàng chuẩn xác, nút 1-click Copy STK & Cú pháp | Báo lỗi hoặc không copy nếu browser chặn clipboard | ORIGINAL_REQUEST.md § R1.3, Google Sheet B8 |
| F10 | R1.3 Chính sách học phí | Tài khoản học phí Cơ sở Đà Nẵng | Công bố số tài khoản TPBank Đà Nẵng: STK `03557714109` - Tên TK: Phân hiệu trường Đại học FPT tại TP Đà Nẵng - Ngân hàng: Tiên Phong (TPBank) chi nhánh Đà Nẵng - Cú pháp: `FAIDN_hotensinhvien_HP HK 1`. | Thao tác copy số tài khoản hoặc cú pháp | Box hiển thị ngân hàng chuẩn xác, nút 1-click Copy STK & Cú pháp | Báo lỗi hoặc không copy nếu browser chặn clipboard | ORIGINAL_REQUEST.md § R1.3, Google Sheet B8 |
| F11 | R1.3 Chính sách học phí | Hướng dẫn & Lưu ý chuyển khoản | Cung cấp lời dẫn và lưu ý bắt buộc: chọn đúng tài khoản tương ứng với cơ sở theo học; điền chính xác cú pháp chuyển khoản để hệ thống ghi nhận kịp thời. | Dữ liệu hướng dẫn | Khối ghi chú nổi bật với icon cảnh báo an toàn | N/A | ORIGINAL_REQUEST.md § R1.3, Google Sheet B8 |
| F12 | R1.4 Loại bỏ FAQ | Triệt để loại bỏ khối FAQ | Không render bất kỳ khối Accordion hay danh sách câu hỏi thường gặp nào trên trang `/tuyen-sinh`. | Không nhận component FAQ | Giao diện sạch sẽ, tập trung vào tuyển sinh, học bổng, học phí và form đăng ký | N/A | ORIGINAL_REQUEST.md § R1.4, Google Sheet B9 |
| F13 | R1.5 Liên hệ trực tiếp | Thông tin Hotline & Email tuyển sinh | Cập nhật Hotline 2 cơ sở: `024 7300 8855` (Hà Nội) • `0236 730 8826` (Đà Nẵng), Email: `fai@fpt.edu.vn`. Giờ hỗ trợ: `8:00 - 21:00 hàng ngày`. Thay thế số hotline cũ `1900 6000`. | Click vào link gọi `tel:` hoặc gửi mail `mailto:` | Mở ứng dụng điện thoại / email tương ứng | N/A | ORIGINAL_REQUEST.md § R1.5, Google Sheet B10 |
| F14 | R1.5 Form đăng ký | Nhập thông tin cá nhân cơ bản | Trường Họ và tên (text), Số điện thoại (tel), Email (email). | Người dùng nhập ký tự | Validate độ dài, định dạng email, định dạng số điện thoại VN | Hiển thị thông báo lỗi inline/banner nếu để trống hoặc sai định dạng | ORIGINAL_REQUEST.md § R1.5, Google Sheet B10 |
| F15 | R1.5 Form đăng ký | Dropdown chọn chương trình đào tạo | Dropdown / Select chứa ĐỦ 11 chương trình đào tạo chính xác từng chữ theo tài liệu FAI 2026. Có thể gom nhóm theo 4 thương hiệu để tiện tra cứu. | Người dùng chọn 1 option từ danh sách | Giá trị được ghi vào state `formData.course` | Mặc định chọn khóa học đầu tiên hoặc placeholder yêu cầu chọn | ORIGINAL_REQUEST.md § R1.5, Google Sheet B10 |
| F16 | R1.5 Form đăng ký | Lựa chọn Cơ sở đào tạo | Tùy chọn 2 cơ sở: `Hà Nội` hoặc `Đà Nẵng` (dạng Radio button hoặc Select button nổi bật). | Người dùng chọn 1 cơ sở | Giá trị được ghi vào state `formData.campus` | Bắt buộc phải chọn 1 trong 2 cơ sở (mặc định Hà Nội) | ORIGINAL_REQUEST.md § R1.5, Google Sheet B10 |
| F17 | R1.5 Form đăng ký | Checkbox bắt buộc Điều khoản bảo vệ dữ liệu | Checkbox xác nhận đồng ý với Quy định bảo vệ dữ liệu cá nhân của FPT kèm liên kết ngoại `https://fpt.edu.vn/thu-vien-anh/11140` (mở tab mới an toàn). | Click checkbox toggle | State `agreeTerms: true/false` | Chặn submit và hiển thị cảnh báo đỏ nếu chưa tick checkbox | ORIGINAL_REQUEST.md § R1.5, Google Sheet B10 |
| F18 | R1.5 Form đăng ký | Xử lý gửi đăng ký & Phản hồi thành công | Gửi dữ liệu đăng ký qua API/Google Sheet script; hiển thị trạng thái loading spinner khi submit; thông báo thành công đẹp mắt và tự động reset form. | Click nút "Đăng ký tuyển sinh ngay" | Màn hình/Alert xác nhận "Đăng ký thành công!", nhân viên tư vấn sẽ liên hệ | Báo lỗi nếu kết nối thất bại | ORIGINAL_REQUEST.md § R1.5, `ScholarshipFormSection.jsx` pattern |
| F19 | R2 Kỹ thuật & UI | Điều hướng Anchor Link chuẩn | Đặt các ID cho các khối: `#thong-tin`, `#hoc-bong`, `#hoc-phi`, `#dang-ky` để tương thích hoàn hảo với Megamenu trong `Header.jsx`. | Người dùng click menu trên Header | Cuộn mượt (smooth scroll) tới chính xác vị trí khối tương ứng | N/A | Khám phá thêm từ `Header.jsx` lines 115-119 |
| F20 | R2 Kỹ thuật & UI | Responsive & Design System Tokens | Sử dụng đồng bộ biến CSS: `--primary: #E8741E`, `--secondary: #0D2137`, `--bg-cream: #F8FAFC`, `--font-sans: 'SVN-Sonoma'`. Đảm bảo co giãn tối ưu trên mobile (375px), tablet (768px), desktop (1200px+). | Độ phân giải màn hình | Giao diện linh hoạt, không bị vỡ layout, không overflow ngang | N/A | ORIGINAL_REQUEST.md § R2, `globals.css` |

---

## 3. BẢNG TRƯỜNG HỢP BIÊN & QUY TẮC DỮ LIỆU (EDGE CASES)

| # | Feature | Input / Tình huống | Hành vi mong đợi & Giải pháp đặc tả |
|---|---------|-------------------|-----------------------------------|
| E01 | R1.2 Học bổng | Dữ liệu gốc trong Google Sheet có lỗi chính tả: "Tân bịnh sáng tạo" | Tự động chuẩn hóa về chính tả tiếng Việt chính xác: **"Tân binh sáng tạo"** theo đúng chỉ đạo trong `ORIGINAL_REQUEST.md`. Không để lỗi gõ dấu xuất hiện trên UI. |
| E02 | R1.3 Chính sách học phí | Văn bản gốc trong Google Sheet ghi: "...tại các cơ sở khu vực phía Bắc như sau... Đà Nẵng:..." | Viết lại lời dẫn mạch lạc và chính xác về mặt địa lý: "Viện Đào tạo Quốc tế FPT hướng dẫn thông tin chuyển khoản tại các cơ sở (Hà Nội & Đà Nẵng) như sau. Học viên lưu ý chọn đúng tài khoản tương ứng với cơ sở đang theo học:" |
| E03 | R1.1 Hồ sơ nhập học | Google Sheet ghi "01 Bản sao công chức CCCD" | Chuẩn hóa chính xác thuật ngữ pháp lý là: **"01 Bản sao công chứng CCCD"** theo đúng văn bản hành chính và chỉ đạo tại `ORIGINAL_REQUEST.md`. |
| E04 | R1.1 Hình thức tuyển sinh | Google Sheet ghi "Đào tạoc Quốc Tế" | Chuẩn hóa lỗi chính tả thành **"Viện Đào tạo Quốc tế FPT"**. |
| E05 | R1.4 Header Megamenu FAQ | Header của toàn trang web hiện đang có link `href="/tuyen-sinh#faq"` | Khi loại bỏ khối FAQ trên trang `/tuyen-sinh`, nếu người dùng truy cập trực tiếp url `#faq` hoặc click từ menu, hệ thống không bị crash. Khuyến nghị: có thể đặt thẻ ẩn có id="faq" cuộn về form đăng ký hoặc giữ nguyên việc loại bỏ khối hiển thị FAQ theo đúng yêu cầu. |
| E06 | R1.5 Số điện thoại đăng ký | Thí sinh nhập SĐT chứa ký tự lạ hoặc thiếu số (VD: `098`, `abc`, `0123456789999`) | Client-side validation kiểm tra regex số điện thoại Việt Nam 10 chữ số bắt đầu bằng đầu số hợp lệ `^(0[3|5|7|8|9])[0-9]{8}$`. Hiển thị thông báo lỗi cụ thể: "Số điện thoại không hợp lệ (cần 10 chữ số hợp lệ)". |
| E07 | R1.5 Email đăng ký | Thí sinh nhập email sai định dạng (VD: `test@`, `fai.fpt`) | Kiểm tra định dạng RFC email hợp lệ `^[^\s@]+@[^\s@]+\.[^\s@]+$`. Báo lỗi nếu không hợp lệ. |
| E08 | R1.5 Checkbox điều khoản bảo vệ dữ liệu | Thí sinh điền đầy đủ form nhưng KHÔNG tick checkbox điều khoản | Form tuyệt đối KHÔNG cho phép submit; focus hoặc highlight viền đỏ checkbox và hiển thị cảnh báo: "Bạn cần đồng ý với Quy định bảo vệ dữ liệu cá nhân của FPT để tiếp tục." |
| E09 | R1.5 Dropdown 11 khóa học | Danh sách dài 11 mục có thể gây khó khăn cho người dùng trên màn hình điện thoại | Sử dụng `<optgroup>` phân chia theo 4 thương hiệu (FPT Aptech, FPT Arena Multimedia, FPT Skillking, FPT Jetking) giúp người dùng dễ dàng định vị khóa học mong muốn. |
| E10 | R1.3 Nút Copy STK & Cú pháp | Trình duyệt không hỗ trợ `navigator.clipboard` hoặc người dùng duyệt qua iframe | Bọc lệnh clipboard trong `try/catch`, fallback sử dụng `document.execCommand('copy')` nếu cần; hiển thị tooltip phản hồi "Đã sao chép!" trong 2 giây. |
| E11 | R2 Hydration error | Sử dụng các giá trị động ngẫu nhiên khi render phía máy chủ | Đảm bảo các component Form và Interactive chạy với `'use client'`; không khởi tạo state chứa giá trị phụ thuộc thời gian render máy chủ để đảm bảo không sinh lỗi React Hydration Mismatch. |

---

## 4. CHI TIẾT ĐẶC TẢ TỪNG YÊU CẦU (DEEP-DIVE REQUIREMENTS)

### R1.1: QUY CHẾ TUYỂN SINH & ĐIỀU KIỆN NHẬP HỌC 2026

#### 1. Hero Header Section
- **Eyebrow**: `QUY CHẾ TUYỂN SINH 2026` (Màu cam `--primary`, chữ hoa, chữ đậm).
- **Tiêu đề chính**: `Quy chế tuyển sinh & Điều kiện nhập học` (Font SVN-Sonoma / Sans-serif, kích thước `clamp(2.3rem, 5.5vw, 4rem)`).
- **Đoạn mô tả dẫn dắt**: Cập nhật loại bỏ cụm từ "môn thi năng lực đầu vào", thay bằng:
  > "Thông tin chi tiết về đối tượng tuyển sinh, chính sách xét tuyển thẳng, chế độ học bổng và thủ tục nhập học chính thức năm 2026 tại Viện Đào tạo Quốc tế FPT (FAI)."

#### 2. Đối tượng tuyển sinh (`#thong-tin` / `#doi-tuong`)
- **Thông điệp cốt lõi**: `Cơ hội rộng mở cho người đam mê`.
- **Tuyên ngôn FAI**: "Viện Đào tạo Quốc tế FPT chào đón tất cả các ứng viên mong muốn sở hữu kỹ năng chuyên môn thực chiến quốc tế, không giới hạn độ tuổi hay chuyên ngành nền tảng."
- **3 Nhóm đối tượng trọng tâm**:
  1. **Học sinh tốt nghiệp THPT**: Các bạn chuẩn bị thi tốt nghiệp hoặc đã tốt nghiệp THPT, mong muốn học thẳng chương trình nghề quốc tế chuẩn mực, rút ngắn thời gian đào tạo và sớm gia nhập thị trường việc làm.
  2. **Sinh viên Đại học & Cao đẳng**: Sinh viên đang học hoặc đã tốt nghiệp muốn trang bị thêm kỹ năng thực chiến chuyên sâu, làm đồ án thực tế (project-based learning) để nâng cao lợi thế cạnh tranh.
  3. **Người đi làm chuyển ngành (ĐỐI TƯỢNG ĐẶC BIỆT ĐƯỢC NHẤN MẠNH)**:
     - **Mô tả chuẩn theo sheet**: "Muốn thay đổi công việc nhàm chán hiện tại bằng một nghề tràn đầy cảm hứng hoặc đang tìm kiếm một công việc với mức thu nhập lý tưởng."
     - Thích hợp học các ngành CNTT, Lập trình, Mỹ thuật đa phương tiện, Tiếp thị số hoặc Thiết kế vi mạch bán dẫn.

#### 3. Cách thức đăng ký — Xét tuyển thẳng 100%
- **BỎ HOÀN TOÀN**:
  - Không còn "Môn 1: Tiếng Anh (Bài thi đọc hiểu trắc nghiệm...)".
  - Không còn "Môn 2: Sáng Tạo / Logic (Bài thi tư duy logic...)".
  - Không còn quy trình có bước "Kiểm tra năng lực".
- **THAY THẾ BẰNG 2 HÌNH THỨC XÉT TUYỂN THẲNG**:
  - **Hình thức 1 — Đăng ký Online**:
    - Nội dung: "Đăng ký nhập học trực tuyến tại website của Viện Đào tạo Quốc tế FPT."
    - Thông điệp khẳng định: **"Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển."**
    - Hướng dẫn: Thí sinh điền thông tin vào form đăng ký trực tuyến, nộp bản scan/ảnh chụp hồ sơ và nhận kết quả xét tuyển nhanh chóng.
  - **Hình thức 2 — Đăng ký trực tiếp**:
    - Nội dung: "Đăng ký nhập học trực tiếp tại các cơ sở của Viện Đào tạo Quốc tế FPT."
    - Thông điệp khẳng định: **"Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển."**
    - Hướng dẫn: Thí sinh đến trực tiếp văn phòng tuyển sinh tại Hà Nội hoặc Đà Nẵng để được hướng dẫn nộp hồ sơ và hoàn tất thủ tục nhập học ngay trong ngày.

#### 4. Hồ sơ nhập học rút gọn
Chỉ có đúng 03 mục:
1. **01 Phiếu đăng ký nhập học** (theo mẫu quy định của Viện Đào tạo FAI).
2. **01 Bản sao công chứng Căn cước công dân (CCCD)**.
3. **01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết"**.

*(Đã lược bỏ toàn bộ: 02 bản sao bằng tốt nghiệp THPT, 02 bản sao học bạ, 04 ảnh thẻ 3x4)*.

---

### R1.2: HỌC BỔNG VÀ ƯU ĐÃI NHẬP HỌC 2026 (4 THƯƠNG HIỆU ĐÀO TẠO)

Khối này nằm tại anchor `#hoc-bong`. Thiết kế dạng Tab Switcher hoặc Grid cards tương tác cao, lấy cảm hứng từ cấu trúc học bổng BUV với các con số nổi bật.

#### Bảng chi tiết học bổng 4 thương hiệu:

| Thương hiệu | Tên Học bổng / Ưu đãi | Giá trị (VNĐ) | Đối tượng / Tiêu chí áp dụng |
|-------------|-----------------------|---------------|------------------------------|
| **FPT Aptech** | Học bổng tài năng | **14.000.000 VNĐ** (14 triệu) | Thí sinh có thành tích học tập xuất sắc hoặc đam mê lập trình công nghệ |
| | Khuyến khích nhập học | **10.000.000 VNĐ** (10 triệu) | Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục nhập học sớm |
| | Ưu đãi chuyển ngành | **6.000.000 VNĐ** (6 triệu) | Dành cho sinh viên hoặc người đi làm chuyển hướng sang ngành Lập trình |
| | Học bổng "Tân binh sáng tạo" | **2.000.000 VNĐ** (2 triệu) | Dành cho tân sinh viên hoàn tất hồ sơ và nhập học các đợt mở lớp mới |
| **FPT Arena Multimedia** | Học bổng tài năng | **14.000.000 VNĐ** (14 triệu) | Thí sinh có năng khiếu mỹ thuật, đồ họa, video hoặc portfolio ấn tượng |
| | Khuyến khích nhập học | **10.000.000 VNĐ** (10 triệu) | Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục nhập học sớm |
| | Ưu đãi chuyển ngành | **6.000.000 VNĐ** (6 triệu) | Dành cho người đi làm chuyển hướng sang ngành Thiết kế Multimedia |
| | Học bổng "Tân binh sáng tạo" | **1.500.000 – 2.000.000 VNĐ** (1.5 - 2 triệu) | Khuyến khích tân sinh viên đăng ký sớm vào các chuyên ngành Mỹ thuật số |
| **FPT Skillking** | Học bổng tài năng | **14.000.000 VNĐ** (14 triệu) | Dành cho thí sinh đam mê Digital Marketing và tư duy kinh doanh trực tuyến |
| | Khuyến khích nhập học | **10.000.000 VNĐ** (10 triệu) | Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục nhập học sớm |
| | Ưu đãi chuyển ngành | **6.000.000 VNĐ** (6 triệu) | Hỗ trợ chuyển đổi nghề nghiệp sang Tiếp thị số đa kênh tích hợp AI |
| | Học bổng "Tân binh sáng tạo" | **1.500.000 – 2.000.000 VNĐ** (1.5 - 2 triệu) | Quỹ tân binh nhập học chuyên ngành Digital Marketing |
| **FPT Jetking** | Học bổng tài năng Chip Design | **8.000.000 VNĐ** (8 triệu) | Dành cho học viên theo học ngành Thiết kế vi mạch bán dẫn quốc tế |
| | Học bổng tài năng AI Agent | **8.000.000 VNĐ** (8 triệu) | Dành cho học viên theo học ngành Lập trình AI Agent chuyên sâu |

---

### R1.3: CHÍNH SÁCH HỌC PHÍ 2026 (HÀ NỘI & ĐÀ NẴNG)

Khối này nằm tại anchor `#hoc-phi`. Thiết kế 2 thẻ tài khoản ngân hàng sang trọng (dạng Credit Card hoặc Banking Passbook hiện đại) với nhận diện ngân hàng TPBank:

#### Lời dẫn & Cảnh báo an toàn:
> "Để đảm bảo quyền lợi và tính chính xác khi nộp học phí, Viện Đào tạo Quốc tế FPT hướng dẫn thông tin chuyển khoản tại các cơ sở (Hà Nội & Đà Nẵng) như sau. Học viên lưu ý chọn đúng tài khoản tương ứng với cơ sở đang theo học:"

#### Chi tiết tài khoản ngân hàng thụ hưởng:

##### 1. Cơ sở Hà Nội
- **Số tài khoản**: `00006969813`
- **Đơn vị thụ hưởng (Tên tài khoản)**: `Trường Đại học FPT`
- **Ngân hàng**: `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội`
- **Cú pháp chuyển khoản (Nội dung CK)**: `FAIHN_hotensinhvien_HP HK 1`
- *Ví dụ thực tế*: Nếu học viên tên Nguyễn Văn An nộp học phí HK1 tại Hà Nội, cú pháp là: `FAIHN_NguyenVanAn_HP HK 1`.
- *Tính năng UX*: Nút sao chép 1 chạm cho STK và Cú pháp.

##### 2. Cơ sở Đà Nẵng
- **Số tài khoản**: `03557714109`
- **Đơn vị thụ hưởng (Tên tài khoản)**: `Phân hiệu trường Đại học FPT tại TP Đà Nẵng`
- **Ngân hàng**: `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng`
- **Cú pháp chuyển khoản (Nội dung CK)**: `FAIDN_hotensinhvien_HP HK 1`
- *Ví dụ thực tế*: Nếu học viên tên Trần Thị Bình nộp học phí HK1 tại Đà Nẵng, cú pháp là: `FAIDN_TranThiBinh_HP HK 1`.
- *Tính năng UX*: Nút sao chép 1 chạm cho STK và Cú pháp.

---

### R1.4: LOẠI BỎ HOÀN TOÀN KHỐI CÂU HỎI THƯỜNG GẶP (FAQ)

- Tuyệt đối không xuất hiện khối FAQ hay bất kỳ câu hỏi/câu trả lời mở rộng nào trên trang tuyển sinh.
- Mục tiêu: Giảm thiểu độ dài trang, tăng tính tập trung của người dùng vào hành động nộp hồ sơ xét tuyển và đăng ký tư vấn.

---

### R1.5: ĐĂNG KÝ TUYỂN SINH TRỰC TUYẾN & THÔNG TIN LIÊN HỆ

Khối này nằm tại anchor `#dang-ky`.

#### 1. Khối thông tin liên hệ tuyển sinh
- **Tiêu đề**: `Liên hệ để được tư vấn chương trình tuyển sinh`
- **Hotline hỗ trợ**:
  - Cơ sở Hà Nội: `024 7300 8855`
  - Cơ sở Đà Nẵng: `0236 730 8826`
  - *Hiển thị trực quan*: `024 7300 8855  •  0236 730 8826` (hỗ trợ click gọi trực tiếp `tel:`).
- **Email chính thức**: `fai@fpt.edu.vn` (hỗ trợ click gửi thư `mailto:`).
- **Thời gian hỗ trợ tư vấn**: `8:00 - 21:00 hàng ngày`.

#### 2. Form đăng ký tuyển sinh trực tuyến 2026
Form gồm 6 thành phần dữ liệu và nút bấm gửi:

1. **Họ và tên (`fullName`)**:
   - Kiểu: `text`
   - Bắt buộc: `required`
   - Placeholder: `Ví dụ: Nguyễn Văn An`
2. **Số điện thoại (`phone`)**:
   - Kiểu: `tel`
   - Bắt buộc: `required`
   - Placeholder: `Ví dụ: 0912 345 678`
   - Validation: 10 chữ số hợp lệ của các nhà mạng Việt Nam.
3. **Email (`email`)**:
   - Kiểu: `email`
   - Bắt buộc: `required`
   - Placeholder: `Ví dụ: an.nguyen@gmail.com`
   - Validation: Đúng chuẩn định dạng email.
4. **Chương trình quan tâm (`program` / `course`)**:
   - Kiểu: Dropdown `<select>`
   - Bắt buộc: `required`
   - Danh sách ĐỦ 11 chương trình chuẩn xác từng từ theo đặc tả:
     1. `Lập trình Fullstack 2 năm - FPT Aptech`
     2. `Lập trình Back end 1 năm - FPT Aptech`
     3. `Lập trình Front end 6 tháng - FPT Aptech`
     4. `Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech`
     5. `Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia`
     6. `Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia`
     7. `Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia`
     8. `Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking`
     9. `Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking`
     10. `Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking`
     11. `Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking`
5. **Cơ sở dự tuyển (`campus`)**:
   - Kiểu: Radio button hoặc Pill buttons
   - Lựa chọn:
     - `Hà Nội` (Mặc định được chọn)
     - `Đà Nẵng`
6. **Checkbox Điều khoản bảo vệ dữ liệu cá nhân (`agreeTerms`)**:
   - Kiểu: `checkbox`
   - Bắt buộc: `required`
   - Nhãn chính: `Đồng ý với Quy định bảo vệ dữ liệu cá nhân`
   - Văn bản quy định đầy đủ:
     > "Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập trên trang này, được xử lý và lưu trữ bởi Tổ chức giáo dục FPT cho mục đích và theo điều kiện đã được công bố tại Quy định bảo vệ dữ liệu cá nhân của Tổ chức giáo dục FPT tại đây"
   - Siêu liên kết: Từ "tại đây" hoặc link trỏ đến `https://fpt.edu.vn/thu-vien-anh/11140` với thuộc tính `target="_blank"` và `rel="noopener noreferrer"`.
7. **Nút gửi đăng ký (`Submit Button`)**:
   - Nhãn: `Gửi hồ sơ đăng ký xét tuyển 2026` hoặc `Đăng ký tuyển sinh ngay`.
   - Trạng thái loading: "Đang gửi thông tin đăng ký...".
   - Trạng thái thành công: Thông báo cảm ơn và xác nhận chuyên viên tuyển sinh FAI sẽ liên hệ trong 24 giờ.

---

### R2: RÀNG BUỘC PHÁT TRIỂN & CHUẨN THIẾT KẾ LOCAL

1. **Chế độ phát triển Local**:
   - Kiểm tra trực tiếp trên `http://localhost:3000/tuyen-sinh`.
   - Tuyệt đối không tự động chạy `git commit`, `git push`.
   - Tuyệt đối không deploy lên Vercel Production.
2. **Ngôn ngữ thiết kế & Thẩm mỹ UI (Design System)**:
   - Màu sắc chủ đạo:
     - Màu cam FPT Amber: `var(--primary)` = `#E8741E` (nút bấm, điểm nhấn, con số học bổng, icon nổi bật).
     - Màu xanh hải quân Deep Navy: `var(--secondary)` = `#0D2137` (tiêu đề, khối tối màu sang trọng).
     - Màu nền sáng hiện đại: `var(--bg-cream)` = `#F8FAFC`, `#ffffff`.
     - Màu chữ tương phản: `var(--text-dark)` = `#1a2332`, `var(--text-muted)` = `#64748b`.
   - Phông chữ chuẩn mực:
     - Tiêu đề & Văn bản: `var(--font-sans)` (SVN-Sonoma / SVN-Poppins).
   - Tương thích Responsive:
     - Mobile (dưới 768px): Thẻ card co giãn 1 cột, nút bấm to dễ chạm, form giãn 100% chiều rộng.
     - Desktop (1024px trở lên): Cấu trúc 2 cột đối xứng hoặc lưới 4 cột rõ ràng, khoảng cách thoáng đãng.
   - Tránh lỗi React Hydration: Code sạch, không can thiệp DOM trực tiếp bằng client-only state trước khi mount.

---

## 5. SO SÁNH HIỆN TRẠNG MÃ NGUỒN VÀ TRẠNG THÁI MỤC TIÊU (DELTA ANALYSIS)

| Hạng mục | Hiện trạng trong `src/app/tuyen-sinh/page.js` | Trạng thái yêu cầu mục tiêu 2026 | Hành động cần thực hiện |
|----------|---------------------------------------------|---------------------------------|-------------------------|
| **Hero Title & Subtitle** | Nhắc đến môn thi năng lực đầu vào | Xóa sạch môn thi; nhấn mạnh xét tuyển thẳng & học bổng 2026 | Sửa text Hero |
| **Đối tượng tuyển sinh** | 3 nhóm cơ bản, phần người chuyển ngành còn ngắn | Giữ 3 nhóm, mở rộng sâu sắc phần "Người đi làm chuyển ngành" (công việc tràn đầy cảm hứng, thu nhập lý tưởng) | Cập nhật copywriter của nhóm 3 |
| **Phương thức tuyển sinh** | Khối Môn 1 Tiếng Anh & Môn 2 Sáng tạo/Logic; kiểm tra năng lực đầu vào | XÓA SẠCH; thay bằng 2 hình thức: Đăng ký Online & Đăng ký trực tiếp với thông điệp "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển" | Thay thế toàn bộ khối Block 3 |
| **Quy trình tuyển sinh** | 4 bước có "Kiểm tra năng lực" | Cập nhật quy trình 4 bước tinh gọn theo xét tuyển thẳng | Cập nhật lại các bước quy trình |
| **Hồ sơ nhập học** | 5 loại giấy tờ (Bằng THPT, Học bạ, CCCD, Ảnh thẻ 3x4, Phiếu đăng ký) | Đúng 03 loại giấy tờ: Phiếu ĐK, Bản sao công chứng CCCD, Cam kết SV | Thay thế checklist hồ sơ |
| **Khối Học bổng 2026** | HOÀN TOÀN CHƯA CÓ | Khối hiển thị 4 thương hiệu (Aptech, Arena, Skillking, Jetking) với các mức 14tr, 10tr, 6tr, 2tr, 8tr | Xây dựng mới hoàn toàn khối Học bổng (`id="hoc-bong"`) |
| **Khối Chính sách học phí** | HOÀN TOÀN CHƯA CÓ | Khối hiển thị 2 cơ sở Hà Nội & Đà Nẵng: STK, TPBank, cú pháp `FAIHN_hotensinhvien_HP HK 1` & `FAIDN_hotensinhvien_HP HK 1` kèm nút Copy | Xây dựng mới hoàn toàn khối Học phí (`id="hoc-phi"`) |
| **Khối FAQ** | Đang không có trên trang nhưng có link `#faq` ở Header | Giữ nguyên việc KHÔNG hiển thị FAQ trên trang | Đảm bảo không render FAQ |
| **Hotline & Email** | Hotline cũ `1900 6000` | Hotline 2 cơ sở: `024 7300 8855` • `0236 730 8826`, Email `fai@fpt.edu.vn` | Cập nhật thông tin liên hệ |
| **Form đăng ký trực tuyến** | HOÀN TOÀN CHƯA CÓ TRÊN TRANG (chỉ có số hotline) | Form đầy đủ: Họ tên, SĐT, Email, 11 khóa học, chọn cơ sở Hà Nội/Đà Nẵng, Checkbox điều khoản bảo mật dữ liệu có link ngoại | Xây dựng mới hoàn toàn Form đăng ký trực tuyến (`id="dang-ky"`) |

---

## 6. DANH SÁCH 11 CHƯƠNG TRÌNH ĐÀO TẠO CHÍNH THỨC (CONTRACT DICTIONARY)

Dưới đây là 11 chuỗi ký tự định danh chuẩn xác cần đưa vào `<option>` của dropdown chương trình học:

```javascript
export const TRAINING_PROGRAMS_2026 = [
  // FPT Aptech
  "Lập trình Fullstack 2 năm - FPT Aptech",
  "Lập trình Back end 1 năm - FPT Aptech",
  "Lập trình Front end 6 tháng - FPT Aptech",
  "Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech",

  // FPT Arena Multimedia
  "Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia",
  "Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia",
  "Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia",

  // FPT Skillking
  "Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking",
  "Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking",

  // FPT Jetking
  "Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking",
  "Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking"
];
```

---

## 7. CẤU TRÚC DỮ LIỆU TÀI KHOẢN NGÂN HÀNG (BANKING CONTRACT)

```javascript
export const TUITION_BANK_ACCOUNTS_2026 = {
  hanoi: {
    campusName: "Cơ sở Hà Nội",
    accountNumber: "00006969813",
    accountName: "Trường Đại học FPT",
    bankName: "Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội",
    shortBank: "TPBank",
    transferSyntax: "FAIHN_hotensinhvien_HP HK 1",
    syntaxNote: "Ví dụ: FAIHN_NguyenVanA_HP HK 1"
  },
  danang: {
    campusName: "Cơ sở Đà Nẵng",
    accountNumber: "03557714109",
    accountName: "Phân hiệu trường Đại học FPT tại TP Đà Nẵng",
    bankName: "Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng",
    shortBank: "TPBank",
    transferSyntax: "FAIDN_hotensinhvien_HP HK 1",
    syntaxNote: "Ví dụ: FAIDN_NguyenVanA_HP HK 1"
  }
};
```

---

## 8. KẾT LUẬN & ĐỀ XUẤT CHO BƯỚC THỰC THI TIẾP THEO

Báo cáo đặc tả này đã xác minh và bóc tách đầy đủ 100% dữ liệu, cấu trúc giao diện, ràng buộc kỹ thuật và trường hợp biên của dự án Nâng cấp Trang Tuyển sinh FAI 2026. 

Các thông tin đã được kiểm chứng trực tiếp với cả `ORIGINAL_REQUEST.md`, Google Spreadsheet thực tế và mã nguồn hiện tại của dự án. Tất cả thông số kỹ thuật (STK, cú pháp, danh sách 11 khóa học, 4 thương hiệu học bổng, hotline, link điều khoản dữ liệu) đã được chuẩn hóa sẵn sàng để Planner lập kế hoạch chi tiết và Implementer triển khai chính xác, không còn bất kỳ điểm mơ hồ nào.
