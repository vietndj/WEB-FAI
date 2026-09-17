# BÁO CÁO KIẾN TRÚC MÃ NGUỒN TRANG TUYỂN SINH FAI 2026
**Dự án**: Cập nhật toàn diện Trang Tuyển sinh FAI 2026 (`/tuyen-sinh`)  
**Đối tượng khảo sát**: Mã nguồn ứng dụng Next.js tại `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Vai trò**: Codebase Architecture Explorer (`explorer_code_survey_1`)  
**Thời gian khảo sát**: 2026-09-03  
**Môi trường thực thi**: Local Next.js 16.2.9 (Turbopack), React 19.2.4  

---

## 1. TỔNG QUAN KIẾN TRÚC HIỆN TẠI (EXECUTIVE ARCHITECTURAL SUMMARY)

Qua khảo sát toàn diện cấu trúc mã nguồn tại thư mục `/Users/vietmac/Documents/CODE/WEB- FAI/fai`, nhóm kiến trúc ghi nhận các phát hiện cốt lõi:

1. **Hiện trạng tệp đích `src/app/tuyen-sinh/page.js`**:
   - Tệp hiện có **302 dòng code**, được khai báo dưới dạng Client Component (`'use client'`).
   - Đang chứa các khối nội dung của quy chế tuyển sinh cũ (năm 2024/2025): duy trì 2 bài thi năng lực đầu vào ("Môn 1: Tiếng Anh", "Môn 2: Sáng Tạo / Logic"), quy trình 4 bước có kiểm tra năng lực, và bộ hồ sơ nhập học 5 mục (bằng cấp THPT, học bạ, CCCD, ảnh 3x4).
   - **Hoàn toàn chưa có**: Khối Học bổng & Ưu đãi 2026 (`#hoc-bong`), Khối Chính sách học phí ngân hàng (`#hoc-phi`), và Form đăng ký tuyển sinh trực tuyến (`#dang-ky`).
   - Số Hotline ở chân trang đang dùng đầu số cũ `1900 6000` thay vì số máy bàn trực tiếp của 2 cơ sở Hà Nội (`024 7300 8855`) và Đà Nẵng (`0236 730 8826`).

2. **Styling & Framework (KHÔNG SỬ DỤNG TAILWIND CSS)**:
   - Dự án **KHÔNG cài đặt Tailwind CSS** (trong `package.json` hoàn toàn không có `tailwindcss`, `postcss.config.js` hay bất kỳ utility class Tailwind nào).
   - Hệ thống giao diện sử dụng **Pure Modern CSS kết hợp CSS Custom Properties** tại `src/app/globals.css` (136KB) và các thuộc tính **inline styling (`style={{ ... }}`)** có tổ chức cao, kết hợp CSS Grid, Flexbox, `clamp()`, `minmax()`.
   - Bảng màu nhận diện thương hiệu được định nghĩa chặt chẽ trong `:root`:
     - `--primary`: `#E8741E` (FPT Amber / Cam FPT)
     - `--primary-hover`: `#c85f0e`
     - `--secondary`: `#0D2137` (Deep Navy)
     - `--secondary-mid`: `#162B4A` (Mid Navy)
     - `--accent`: `#C9972C` (Gold)
     - `--bg-cream`: `#F8FAFC` (Crisp neutral off-white)
     - `--bg-light`: `#ffffff`
     - `--font-sans`: `'SVN-Sonoma', 'SVN-Poppins', ...`
     - `--font-title`: `'GT-Sectra', serif`
     - Màu sắc thương hiệu con: FPT Aptech (`#f37021`), FPT Arena (`#ffb600`), FPT Skillking (`#09529c`), FPT Jetking (`#dc2626`).

3. **Thư viện Icon**:
   - Đang sử dụng `lucide-react` phiên bản `^1.21.0`.
   - Các icon cần thiết cho trang mới (`GraduationCap`, `CheckCircle2`, `Check`, `FileText`, `CreditCard`, `Building2`, `Sparkles`, `BookOpen`, `Send`, `Phone`, `Mail`, `MapPin`, `Clock`, `ArrowRight`, `ChevronDown`, `ShieldCheck`, `AlertCircle`, `ExternalLink`, `Copy`) đều sẵn sàng và hoạt động mượt mà.

4. **Tích hợp Layout & Header/Footer**:
   - `RootLayout` (`src/app/layout.js`) bao bọc: `<ScrollReveal />`, `<Header />`, và `{children}`.
   - `<Footer />` **không** nằm trong `RootLayout` mà được import và render trực tiếp ở cuối mỗi trang (bao gồm cả `tuyen-sinh/page.js`).
   - Header có `padding-top` bù trừ sẵn (`92px` desktop, `72px` mobile), và `globals.css` đã cấu hình `scroll-margin-top: 110px` cho toàn bộ các phần tử có `[id]`. Khi người dùng click anchor link (`#thong-tin`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`), trình duyệt sẽ cuộn mượt và không bị che khuất bởi thanh Header cố định.

5. **Rủi ro Hydration Mismatch**:
   - `tuyen-sinh/page.js` là Client Component (`'use client'`).
   - Zero hydration mismatch: Toàn bộ dữ liệu hiển thị là tĩnh hoặc quản lý qua React `useState`. Các tác vụ phụ thuộc client (như `navigator.clipboard.writeText`) chỉ được kích hoạt trong onClick event handler, tuyệt đối an toàn trong môi trường SSR/Turbopack của Next.js 16 và React 19.

---

## 2. BẢN ĐỒ MÃ NGUỒN HIỆN TRẠNG (SOURCE CODE MAP)

### 2.1 Cấu trúc thư mục liên quan
```
fai/
├── package.json                   # Next 16.2.9, React 19.2.4, Lucide-react 1.21.0 (No Tailwind)
├── src/
│   ├── app/
│   │   ├── globals.css            # 136KB pure CSS, chứa :root color variables, .container, .btn
│   │   ├── layout.js              # RootLayout: ScrollReveal + Header + {children}
│   │   └── tuyen-sinh/
│   │       └── page.js            # [TỆP ĐÍCH] 302 dòng, giao diện tuyển sinh cũ cần thay thế
│   ├── components/
│   │   ├── Header.jsx             # Chứa Megamenu liên kết: #thong-tin, #hoc-bong, #hoc-phi, #dang-ky, #faq
│   │   ├── Footer.jsx             # Footer toàn hệ thống FAI, chứa địa chỉ campus & social
│   │   ├── ScrollReveal.jsx       # Hiệu ứng cuộn IntersectionObserver (client-only, return null)
│   │   └── ScholarshipFormSection.jsx # Mẫu form đăng ký & huy hiệu học bổng (dùng ở các trang dao-tao)
│   └── lib/
│       ├── firebase.js            # Khởi tạo Firebase SDK
│       └── firestore.js           # Truy vấn CMS cho tin tức, đời sống
```

### 2.2 So khớp Anchor Navigation với `Header.jsx`
Trong `src/components/Header.jsx` (dòng 115-119 và dòng 226-230), menu Tuyển sinh trỏ tới các anchor sau:
| Menu Text | Link Target | Tình trạng trong `tuyen-sinh/page.js` hiện tại | Yêu cầu trang Tuyển sinh mới 2026 |
|---|---|---|---|
| Thông tin tuyển sinh 2026 | `/tuyen-sinh#thong-tin` | **Chưa có** (chỉ có `id="doi-tuong"`) | **Bổ sung** `id="thong-tin"` tại khối Đối tượng tuyển sinh |
| Học bổng & Ưu đãi nhập học | `/tuyen-sinh#hoc-bong` | **Chưa có** | **Xây dựng mới** Khối Học bổng 4 thương hiệu (`id="hoc-bong"`) |
| Chính sách học phí | `/tuyen-sinh#hoc-phi` | **Chưa có** | **Xây dựng mới** Khối Học phí Hà Nội & Đà Nẵng (`id="hoc-phi"`) |
| Đăng ký tuyển sinh trực tuyến | `/tuyen-sinh#dang-ky` | **Chưa có** | **Xây dựng mới** Khối Form Đăng ký + Hotline (`id="dang-ky"`) |
| Câu hỏi thường gặp (FAQ) | `/tuyen-sinh#faq` | **Chưa có** | **Loại bỏ hoàn toàn** theo Requirement R1.4 |

---

## 3. BÓC TÁCH CÁC THÀNH PHẦN CŨ CẦN XÓA BỎ (LEGACY AUDIT)

Tại `src/app/tuyen-sinh/page.js`:

1. **Khối Phương thức tuyển sinh cũ (Dòng 97 – 152)**:
   - `id="phuong-thuc"`: Tiêu đề "Kiểm tra năng lực đầu vào".
   - Thẻ bài thi **Môn 1: Tiếng Anh** (Dòng 114 – 122): Đọc hiểu trắc nghiệm Tiếng Anh.
   - Thẻ bài thi **Môn 2: Sáng Tạo / Logic** (Dòng 123 – 131): Tư duy logic & cảm nhận thẩm mỹ.
   - *Hành động*: **Xoá bỏ 100%**. Thay bằng khối **Xét tuyển thẳng trực tiếp** với 2 hình thức: Đăng ký Online và Đăng ký Trực tiếp, khẳng định nổi bật: *"Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"*.

2. **Nội dung thi tuyển trong Quy trình tuyển sinh (Dòng 187 – 189)**:
   - Bước 02 cũ: *"Kiểm tra năng lực: Làm bài kiểm tra đầu vào (Tiếng Anh & Sáng tạo/Logic)..."*.
   - *Hành động*: **Cập nhật** Bước 02 thành *"Xét tuyển hồ sơ: Xét tuyển trực tiếp hồ sơ đăng ký, KHÔNG CẦN thi tuyển"*.

3. **Hồ sơ nhập học cũ 5 mục (Dòng 217 – 237)**:
   - Chứa: Bằng tốt nghiệp THPT, Bản sao Học bạ THPT, Bản sao CCCD, 04 ảnh 3x4, Phiếu đăng ký.
   - *Hành động*: **Thay thế hoàn toàn** bằng đúng 03 mục theo tài liệu tuyển sinh FAI 2026:
     1. `01 Phiếu đăng ký nhập học` (theo mẫu có sẵn của Viện Đào tạo FAI)
     2. `01 Bản sao công chứng CCCD`
     3. `01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết"`

4. **Câu văn dẫn dắt tại Hero & CTA (Dòng 34, Dòng 271)**:
   - Dòng 34: *"môn thi năng lực đầu vào và hồ sơ thủ tục nhập học..."* -> Sửa thành *"chính sách xét tuyển thẳng, chế độ học bổng và thủ tục nhập học..."*.
   - Dòng 271: *"bài thi năng lực đầu vào hoặc chế độ học bổng?..."* -> Sửa thành *"chính sách xét tuyển thẳng hoặc chế độ học bổng?..."*.

5. **Hotline cũ tại Block CTA (Dòng 278 – 280)**:
   - Đang dùng số tổng đài chung `1900 6000`.
   - *Hành động*: Thay thế bằng 2 Hotline chính thức của 2 cơ sở:
     - Hà Nội: `024 7300 8855`
     - Đà Nẵng: `0236 730 8826`

6. **Khối FAQ**:
   - Hiện trạng trang `tuyen-sinh/page.js` chưa có FAQ.
   - *Hành động*: Tuân thủ nghiêm ngặt Requirement R1.4: **Không thêm bất kỳ khối FAQ nào** vào trang này.

---

## 4. BẢN ĐẶC TẢ KIẾN TRÚC GIAO DIỆN MỚI FAI 2026

Trang Tuyển sinh mới sẽ được tái cấu trúc thành **7 Khối giao diện chuẩn mực** xếp theo luồng tư duy tuyển sinh hiện đại:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HERO BANNER: Quy chế tuyển sinh & Điều kiện nhập học    │
├─────────────────────────────────────────────────────────────┤
│ 2. ĐỐI TƯỢNG TUYỂN SINH (#thong-tin / #doi-tuong)           │
│    - Cơ hội rộng mở cho người đam mê                        │
│    - 3 Cards: THPT, Sinh viên ĐH/CĐ, Người chuyển ngành (★) │
├─────────────────────────────────────────────────────────────┤
│ 3. PHƯƠNG THỨC XÉT TUYỂN THẲNG (#phuong-thuc)               │
│    - Thông điệp: "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển" │
│    - Card 1: Đăng ký Online (Web FAI)                       │
│    - Card 2: Đăng ký Trực tiếp (Cơ sở HN & ĐN)              │
├─────────────────────────────────────────────────────────────┤
│ 4. QUY TRÌNH 4 BƯỚC & HỒ SƠ NHẬP HỌC RÚT GỌN (#ho-so)       │
│    - Quy trình 4 bước chuẩn xét tuyển thẳng                 │
│    - Checklist đúng 3 giấy tờ: Phiếu ĐK, CCCD, Cam kết      │
├─────────────────────────────────────────────────────────────┤
│ 5. HỌC BỔNG VÀ ƯU ĐÃI NHẬP HỌC 2026 (#hoc-bong)             │
│    - Tab Switcher: FPT Aptech | Arena | Skillking | Jetking │
│    - Grid Cards hiển thị số tiền lớn + điều kiện chi tiết    │
│    - Nút CTA dẫn trực tiếp xuống form đăng ký               │
├─────────────────────────────────────────────────────────────┤
│ 6. CHÍNH SÁCH HỌC PHÍ 2026 (#hoc-phi)                       │
│    - Hướng dẫn chuyển khoản & lưu ý cơ sở                   │
│    - Banking Card Hà Nội: STK 00006969813, Cú pháp + Copy   │
│    - Banking Card Đà Nẵng: STK 03557714109, Cú pháp + Copy  │
├─────────────────────────────────────────────────────────────┤
│ 7. ĐĂNG KÝ TUYỂN SINH TRỰC TUYẾN & LIÊN HỆ (#dang-ky)       │
│    - Cột Trái: Hotline HN & ĐN, Email, Giờ làm việc         │
│    - Cột Phải: Form 6 trường (Đủ 11 khóa học, Campus,       │
│      Checkbox cam kết bảo mật link FPT + Validation)         │
├─────────────────────────────────────────────────────────────┤
│ 8. FOOTER: Hệ thống Campus & Kênh truyền thông              │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. PHÂN TÍCH CHI TIẾT CÁC THÀNH PHẦN KỸ THUẬT

### 5.1 Khối Học bổng 2026 (Tab Switcher Component)
- **Cơ chế State**: Quản lý bằng `activeBrandTab` (`'aptech'`, `'arena'`, `'skillking'`, `'jetking'`).
- **Bảng dữ liệu chuẩn xác**:
  - **FPT Aptech** (Theme: `#f37021`):
    1. Học bổng tài năng: `14.000.000 VNĐ`
    2. Khuyến khích nhập học: `10.000.000 VNĐ`
    3. Ưu đãi chuyển ngành: `6.000.000 VNĐ`
    4. Học bổng "Tân binh sáng tạo": `2.000.000 VNĐ`
  - **FPT Arena Multimedia** (Theme: `#ffb600`):
    1. Học bổng tài năng: `14.000.000 VNĐ`
    2. Khuyến khích nhập học: `10.000.000 VNĐ`
    3. Ưu đãi chuyển ngành: `6.000.000 VNĐ`
    4. Học bổng "Tân binh sáng tạo": `1.500.000 - 2.000.000 VNĐ`
  - **FPT Skillking** (Theme: `#09529c`):
    1. Học bổng tài năng: `14.000.000 VNĐ`
    2. Khuyến khích nhập học: `10.000.000 VNĐ`
    3. Ưu đãi chuyển ngành: `6.000.000 VNĐ`
    4. Học bổng "Tân binh sáng tạo": `1.500.000 - 2.000.000 VNĐ`
  - **FPT Jetking** (Theme: `#dc2626`):
    1. Học bổng tài năng Chip Design: `8.000.000 VNĐ`
    2. Học bổng tài năng AI Agent: `8.000.000 VNĐ`

### 5.2 Khối Chính sách Học phí (Banking Cards & 1-Click Copy)
- **Thiết kế**: 2 thẻ Banking Card sang trọng đặt cạnh nhau trên nền tối Deep Navy (`#0D2137`) hoặc nền xám nhạt (`#F8FAFC`).
- **Tính năng tương tác**: Nút `Sao chép STK` và `Sao chép cú pháp` có tooltip phản hồi tức thì `Đã sao chép!`.
- **Dữ liệu 2 cơ sở**:
  - **Hà Nội**:
    - Số tài khoản: `00006969813`
    - Tên thụ hưởng: `Trường Đại học FPT`
    - Ngân hàng: `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội`
    - Cú pháp chuẩn: `FAIHN_hotensinhvien_HP HK 1`
  - **Đà Nẵng**:
    - Số tài khoản: `03557714109`
    - Tên thụ hưởng: `Phân hiệu trường Đại học FPT tại TP Đà Nẵng`
    - Ngân hàng: `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng`
    - Cú pháp chuẩn: `FAIDN_hotensinhvien_HP HK 1`
- **Lưu ý nghiệp vụ**: Đính kèm hộp cảnh báo an toàn về việc chọn đúng tài khoản tương ứng với cơ sở đang theo học.

### 5.3 Khối Form Đăng ký Tuyển sinh Trực tuyến
- **State cấu trúc**:
  ```javascript
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    course: 'Lập trình Fullstack 2 năm - FPT Aptech',
    campus: 'Hà Nội',
    agreeTerms: true,
  });
  ```
- **Danh sách 11 Chương trình đào tạo (Đầy đủ và chính xác 100%)**:
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
- **Validation quy chuẩn**:
  - Họ và tên: Bắt buộc, tối thiểu 2 ký tự.
  - Điện thoại: Bắt buộc, kiểm tra Regex số di động Việt Nam `^(0[3|5|7|8|9])[0-9]{8}$`.
  - Email: Bắt buộc, kiểm tra định dạng email chuẩn `^[^\s@]+@[^\s@]+\.[^\s@]+$`.
  - Cơ sở: Lựa chọn giữa `Hà Nội` hoặc `Đà Nẵng`.
  - Điều khoản bảo vệ dữ liệu cá nhân: Checkbox bắt buộc (`agreeTerms === true`), đính kèm liên kết mở tab mới tới `https://fpt.edu.vn/thu-vien-anh/11140`.
- **Luồng gửi dữ liệu (Submission Pipeline)**:
  - Gửi POST request dạng `no-cors` tới Google Apps Script URL (đã có sẵn pattern trong `ScholarshipFormSection.jsx`).
  - Hiển thị spinner loading "Đang gửi hồ sơ...".
  - Chuyển sang màn hình xác nhận thành công với icon `CheckCircle2` màu xanh lá và thông điệp tư vấn viên FAI sẽ liên hệ trong 24h.

---

## 6. PHÂN TÍCH ZERO HYDRATION MISMATCH & RESPONSIVE

1. **Hydration Safety**:
   - `tuyen-sinh/page.js` chạy với `'use client'`.
   - Tránh sử dụng `Date.now()`, `Math.random()`, hoặc kiểm tra `typeof window !== 'undefined'` trong phần render JSX khởi đầu.
   - Các API trình duyệt như `navigator.clipboard` chỉ được kích hoạt trong hàm xử lý sự kiện `handleCopy`.

2. **Responsive Engineering (Không Tailwind)**:
   - Sử dụng `.container` chuẩn từ `globals.css` (`max-width: 1320px`, `padding: 0 20px`).
   - Sử dụng CSS Grid linh hoạt:
     - `gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))'` cho các card học bổng và đối tượng.
     - Breakpoint co giãn linh hoạt bằng `clamp()` cho font size (ví dụ: `clamp(2rem, 5vw, 3.5rem)` cho tiêu đề lớn).
   - Layout 2 cột trên desktop (Đối tượng, Phương thức, Học phí, Form) tự động xếp dọc (1 cột) trên màn hình mobile dưới `768px`.

---

## 7. KẾT LUẬN & ĐỀ XUẤT CHO BƯỚC THỰC THI (ACTIONABLE RECOMMENDATIONS)

1. **Khuyến nghị cách triển khai**:
   - Viết trực tiếp cấu trúc mới vào `src/app/tuyen-sinh/page.js` theo mô hình tự đóng gói (self-contained client component) tương tự như `src/app/ve-fai/page.js` và `src/app/doi-song/page.js`. Điều này giúp code gọn gàng, tập trung toàn bộ state (Tab, Form, Copy) trong 1 tệp, loại bỏ rủi ro import vòng hoặc lỗi giải quyết đường dẫn.
2. **Kiểm tra tương thích**:
   - Đảm bảo giữ đúng các anchor ID: `#thong-tin`, `#doi-tuong`, `#phuong-thuc`, `#ho-so`, `#hoc-bong`, `#hoc-phi`, `#dang-ky` để tương thích hoàn toàn với Header Megamenu.
3. **Môi trường & Quy tắc**:
   - Kiểm tra trực tiếp trên `http://localhost:3000/tuyen-sinh`.
   - Tuyệt đối không commit/push git hoặc deploy production.
