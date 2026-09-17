# BÁO CÁO KHẢO SÁT DỮ LIỆU CỨNG & BẢN ĐẶC TẢ KIẾN TRÚC DỮ LIỆU (SRC/DATA/)

**Agent:** `explorer_codebase_survey`  
**Ngày thực hiện:** 2026-09-03  
**Working Directory:** `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_codebase_survey`  
**Codebase:** `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/`  
**Authoritative Document:** `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md`

---

## 1. OBSERVATION (Quan sát thực tế trên Codebase)

Qua quét toàn bộ thư mục `fai/src/` bằng các công cụ `grep_search`, `find_by_name` và `view_file`, chúng tôi ghi nhận hiện trạng phân tán và hardcode dữ liệu như sau:

### 1.1. Hiện trạng thư mục `src/data/`
- Thư mục `src/data/` hiện chỉ có duy nhất 1 file: `src/data/news.js` (139 dòng, export `allNews`).
- Chưa có các tệp `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`.

### 1.2. Danh mục 11 Chương trình Đào tạo 2026 & Dropdown Đăng ký
1. **`src/app/tuyen-sinh/page.js`** (Lines 28-60):
   - Mảng `TRAINING_PROGRAMS_2026` được hardcode trực tiếp trên đầu trang với 4 brand:
     * FPT Aptech (4 khóa): Fullstack 2 năm, Backend 1 năm, Frontend 6 tháng, Khóa ngắn hạn (100 - 200 giờ).
     * FPT Arena Multimedia (3 khóa): AMSP 2 năm, 2D/3D/Game/App (6–18 tháng), Multimedia ngắn hạn (100 giờ).
     * FPT Skillking (2 khóa): Fullstack Digital Marketing With AI (18 tháng), Digital Marketing ngắn hạn (100 giờ).
     * FPT Jetking (2 khóa): Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm), Lập trình AI Agent (6 tháng - 2 năm).
   - Render trong form đăng ký tuyển sinh (Lines 1870-1879) dưới dạng `<optgroup>` và `<option>`.
2. **`src/components/Header.jsx`**:
   - Desktop Megamenu (Lines 68-98): Hardcode 11 đường dẫn và tên khóa học phân theo 4 cột (`brand-aptech`, `brand-arena`, `brand-skillking`, `brand-jetking`).
   - Mobile Submenu (Lines 195-217): Lặp lại danh sách khóa học với tên hơi lệch nhau (ví dụ: `Lập trình Back end (1 năm)`, `Thiết kế Vi mạch Bán dẫn`).
3. **`src/components/Footer.jsx`** (Lines 177-209):
   - Hardcode danh sách chương trình đào tạo & đường dẫn sang các website ngoài (`aptech.fpt.edu.vn`, `arena.fpt.edu.vn`, `skillking.fpt.edu.vn`, `jetking.fpt.edu.vn`).
4. **`src/components/ProgramBeau.jsx`** (Lines 10-101):
   - Mảng `programs` gồm 5 thẻ lớn (Aptech, Arena, Skillking, Jetking Chip, Jetking AI) chứa danh sách tag khóa học lặp lại danh mục 11 khóa học.
5. **`src/components/ProgramSelector.jsx`** (Lines 8-51):
   - Mảng `pillars` định nghĩa 3 thương hiệu cũ (Aptech, Arena, Skillking), thiếu hoàn toàn Jetking.
6. **`src/app/dao-tao/page.js`** (Lines 11-109):
   - Mảng `programs` định nghĩa 5 khối đào tạo kèm danh sách `curriculums` (chứa các sub-programs và href).
7. **Các bộ chuyển đổi Sticky Program Switchers**:
   - `src/components/AptechProgramSwitcher.jsx` (Lines 7-12): 4 chương trình Aptech.
   - `src/components/ArenaProgramSwitcher.jsx` (Lines 7-11): 3 chương trình Arena.
   - `src/components/SkillkingProgramSwitcher.jsx` (Lines 7-10): 2 chương trình Skillking.
   - `src/components/JetkingProgramSwitcher.jsx` (Lines 7-10): 2 chương trình Jetking.
8. **Các trang chi tiết và Form khóa ngắn hạn**:
   - `src/app/dao-tao/aptech/100-200h/page.js` (Lines 724-730): Mảng `courseOptions` 5 môn lập trình ngắn hạn.
   - `src/app/dao-tao/arena/6-18-thang/page.js` (Lines 327-332): Mảng `courseOptions` 4 chuyên ngành 6-18 tháng.
   - `src/app/dao-tao/arena/100h/page.js` (Lines 454-459) & `src/components/Arena100hFormSection.jsx` (Lines 322-325): 4 khóa học multimedia ngắn hạn.
   - `src/app/dao-tao/skillking/100h/page.js` (Lines 300-304) & `src/components/Skillking100hFormSection.jsx` (Lines 317-320): 3 khóa học digital marketing ngắn hạn.

---

### 1.3. Quỹ Học bổng & Ưu đãi 2026
1. **`src/app/tuyen-sinh/page.js`** (Lines 63-202):
   - Đối tượng `SCHOLARSHIP_BRANDS` chứa đầy đủ 4 thương hiệu với thông số chuẩn 2026:
     * **FPT Aptech**: Học bổng tài năng (14 Triệu), Khuyến khích nhập học (10 Triệu), Ưu đãi chuyển ngành (6 Triệu), Tân binh sáng tạo (2 Triệu).
     * **FPT Arena**: Học bổng tài năng (14 Triệu), Khuyến khích nhập học (10 Triệu), Ưu đãi chuyển ngành (6 Triệu), Tân binh sáng tạo (1.5 - 2 Triệu).
     * **FPT Skillking**: Học bổng tài năng (14 Triệu), Khuyến khích nhập học (10 Triệu), Ưu đãi chuyển ngành (6 Triệu), Tân binh sáng tạo (1.5 - 2 Triệu).
     * **FPT Jetking**: Học bổng tài năng Chip Design (8 Triệu), Học bổng tài năng AI Agent (8 Triệu).
2. **`src/components/ScholarshipFormSection.jsx`** (Lines 6-150):
   - Định nghĩa đối tượng `BRAND_PRESETS` với các badges:
     * Tồn tại sự không đồng nhất: Aptech có badge với tags `['C++', 'JAVA']`, `['PYTHON', 'DATABASE']`; Jetking Chip Design có thêm badge "VIP Miễn phí Coursera + Udemy", "LAB EDA Synopsys & Cadence"; Jetking AI Agent có "VIP Coursera + Udemy".
3. **Các trang chuyên ngành truyền prop `badges` ghi đè**:
   - `src/app/dao-tao/ai-agent/page.js` (Lines 554-567): 2 badges.
   - `src/app/dao-tao/chip-design/page.js` (Lines 570-585): 3 badges.
   - `src/app/dao-tao/aptech/100-200h/page.js` (Lines 710-723): 2 badges.
   - `src/app/dao-tao/arena/100h/page.js` (Lines 434-453): 3 badges.
   - `src/app/dao-tao/skillking/100h/page.js` (Lines 286-299): 2 badges.
4. **Các component form riêng lẻ**:
   - `src/components/Arena100hFormSection.jsx` (Lines 130-140): Hardcode badge 1.5 - 2M "Tân binh sáng tạo".
   - `src/components/Skillking100hFormSection.jsx` (Lines 125-135): Hardcode badge 1.5M "Học bổng Short Course".

---

### 1.4. Thông tin Tài khoản Học phí & Ngân hàng 2026
1. **`src/app/tuyen-sinh/page.js`** (Lines 205-230):
   - Mảng `TUITION_ACCOUNTS`:
     * **Hà Nội (`HN`)**: STK `00006969813` | Chủ TK `Trường Đại học FPT` | Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội | Cú pháp `FAIHN_hotensinhvien_HP HK 1` | Địa chỉ `Toà nhà FPT, Phố Dịch Vọng Hậu, Cầu Giấy, Hà Nội`.
     * **Đà Nẵng (`DN`)**: STK `03557714109` | Chủ TK `Phân hiệu trường Đại học FPT tại TP Đà Nẵng` | Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng | Cú pháp `FAIDN_hotensinhvien_HP HK 1` | Địa chỉ `Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng`.
   - Lines 1340-1550: Render 2 card tài khoản, copy clipboard và các lưu ý nộp học phí.

---

### 1.5. Thông tin Liên hệ, Hotline, Email, Campus & Endpoints
1. **Hotline chính thức**:
   - Hà Nội: `024 7300 8855` (tel: `02473008855`)
   - Đà Nẵng: `0236 730 8826` (tel: `02367308826`)
   - Xuất hiện lặp lại tại:
     * `src/app/tuyen-sinh/page.js`: Lines 907, 910, 1606, 1619.
     * `src/app/lien-he/page.js`: Lines 43, 50, 57, 64, 95, 102, 109, 569, 573.
     * `src/components/Footer.jsx`: Line 160.
     * `src/app/doi-song/page.js`: Lines 589-591.
2. **Email tiếp nhận**:
   - Chung FAI: `fai@fpt.edu.vn` (xuất hiện tại `tuyen-sinh/page.js:1639`, `Footer.jsx:165`).
   - Email từng cơ sở tại `src/app/lien-he/page.js`: `aptech.hn@fpt.edu.vn`, `aptech.hcm@fpt.edu.vn`, `farena.hn@fpt.edu.vn`, `farena.dn@fpt.edu.vn`, `farena.hcm@fpt.edu.vn`, `farena.ct@fpt.edu.vn`, `skillking.*`, `jetking.*`.
3. **Địa chỉ Campus mạng lưới**:
   - `src/app/lien-he/page.js` (Lines 7-164): 4 mảng campus riêng biệt (`aptechCampuses`, `arenaCampuses`, `skillkingCampuses`, `jetkingCampuses`).
   - `src/components/Footer.jsx` (Lines 90-153): Nhóm theo 4 thành phố (Hà Nội, TP.HCM, Đà Nẵng, Cần Thơ).
4. **Kênh Zalo & Tư vấn trực tuyến**:
   - General FAI: `https://zalo.me/3164559225263453576` (`Footer.jsx:40`, `TechCTAButton.jsx:8`, `dao-tao/page.js:333`).
   - FPT Aptech: `https://zalo.me/fptaptech`
   - FPT Arena: `https://zalo.me/fptarenaofficial`
   - FPT Skillking: `https://zalo.me/fptskillking`
   - FPT Jetking: `https://zalo.me/jetkingfpt`
5. **Đường dẫn Pháp lý & Google Apps Script**:
   - Link Quy định bảo vệ dữ liệu cá nhân FPT: `https://fpt.edu.vn/thu-vien-anh/11140` (xuất hiện tại `tuyen-sinh/page.js:1911`, `Arena100hFormSection.jsx:344`, `Skillking100hFormSection.jsx:338`).
   - Endpoint Google Apps Script tiếp nhận Lead:
     `https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec`
     (xuất hiện giống hệt nhau tại `tuyen-sinh/page.js:344`, `ScholarshipFormSection.jsx:162`, `Arena100hFormSection.jsx:8`, `Skillking100hFormSection.jsx:7`, và 5 trang `dao-tao/*`).

---

## 2. LOGIC CHAIN (Chuỗi suy luận kiến trúc)

1. **Từ Quan sát 1.1, 1.2 & 1.3**:
   - Cùng một tên chương trình học (ví dụ: `Lập trình Back end 1 năm`) đang được viết khác nhau giữa `tuyen-sinh/page.js`, `Header.jsx`, `AptechProgramSwitcher.jsx` và `dao-tao/page.js`.
   - Cùng một chính sách học bổng đang được khai báo độc lập tại `tuyen-sinh/page.js` và `ScholarshipFormSection.jsx`. Khi phòng tuyển sinh thay đổi mức học bổng (ví dụ: từ 14 triệu sang 15 triệu), dev phải lục và sửa ít nhất 8 tệp khác nhau, rất dễ sót hoặc mâu thuẫn số liệu.
   - *Suy ra*: Cần tách toàn bộ dữ liệu này ra `src/data/programs.js` và `src/data/scholarships.js` làm **Single Source of Truth**.

2. **Từ Quan sát 1.4**:
   - Dữ liệu tài khoản ngân hàng chuyển khoản học phí (Hà Nội & Đà Nẵng) chỉ xuất hiện tại `tuyen-sinh/page.js`, nhưng là thông tin tài chính nhạy cảm bậc nhất của nhà trường.
   - *Suy ra*: Việc tách `src/data/tuition.js` không chỉ giúp tái sử dụng nếu cần nhúng ở trang thanh toán hay modal khác, mà còn giúp bảo vệ tính toàn vẹn của STK và cú pháp chuyển khoản, tránh nguy cơ gõ sai khi sửa giao diện JSX.

3. **Từ Quan sát 1.5**:
   - Hotline và Email xuất hiện ở ít nhất 10 file khác nhau. Một thay đổi về đầu số tổng đài sẽ đòi hỏi find/replace thủ công trên toàn bộ codebase.
   - Địa chỉ Campus đang được khai báo theo 2 cấu trúc mâu thuẫn: `lien-he/page.js` phân theo Brand, còn `Footer.jsx` phân theo Thành phố.
   - *Suy ra*: `src/data/contacts.js` cần cung cấp cả 2 góc nhìn (theo Brand và theo Thành phố), đồng thời gom các hằng số liên lạc (Hotline, Email, Zalo, Giờ làm việc, Link điều khoản, Endpoint Script).

4. **Về khả năng tương thích ngược (Backward Compatibility)**:
   - Các component hiện tại như `tuyen-sinh/page.js` đang dùng `TRAINING_PROGRAMS_2026`, `SCHOLARSHIP_BRANDS`, `TUITION_ACCOUNTS`.
   - Để quá trình refactor diễn ra an toàn và không gây crash, các file trong `src/data/` PHẢI export cả các định dạng cũ (alias) lẫn các cấu trúc giàu ngữ nghĩa (Rich Objects).

---

## 3. CAVEATS (Giới hạn & Lưu ý)

1. **Quy tắc khóa phạm vi**:
   - Theo chỉ thị dự án và follow-up user prompt, chỉ thực hiện trên Local, không chạy `git commit` / `git push` hay deploy Vercel.
   - Không can thiệp vào các logic Telegram Webhook hay Firebase Auth của admin.
2. **Luồng Font chữ song song**:
   - User lưu ý có conversation song song đang đổi font sang SVN-Sonoma trong `globals.css`. Do đó khi thiết kế data contract, không nhúng các inline font styles vào data; chỉ nhúng các thuộc tính ngữ nghĩa (colors, badges, copy text).

---

## 4. CONCLUSION & RECOMMENDED DATA CONTRACTS

Khuyến nghị triển khai chính xác 4 tệp dữ liệu trung tâm trong `src/data/`:

### 4.1. `src/data/programs.js`

```javascript
/**
 * src/data/programs.js
 * Single Source of Truth for 11 FAI Training Programs (2026)
 */

export const TRAINING_PROGRAMS_2026 = [
  {
    brand: 'FPT Aptech',
    brandId: 'aptech',
    programs: [
      'Lập trình Fullstack 2 năm - FPT Aptech',
      'Lập trình Back end 1 năm - FPT Aptech',
      'Lập trình Front end 6 tháng - FPT Aptech',
      'Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech',
    ]
  },
  {
    brand: 'FPT Arena Multimedia',
    brandId: 'arena',
    programs: [
      'Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia',
      'Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia',
      'Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia',
    ]
  },
  {
    brand: 'FPT Skillking',
    brandId: 'skillking',
    programs: [
      'Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking',
      'Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking',
    ]
  },
  {
    brand: 'FPT Jetking',
    brandId: 'jetking',
    programs: [
      'Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking',
      'Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking',
    ]
  }
];

// Danh mục chi tiết từng chương trình đào tạo phục vụ Megamenu, Switchers và Dynamic Routing
export const programsByBrand = {
  aptech: {
    brandId: 'aptech',
    brandName: 'FPT Aptech',
    tagline: 'Đào tạo Lập trình viên Quốc tế',
    logo: '/logo_aptech.png',
    color: '#f37021',
    route: '/dao-tao/aptech',
    programs: [
      {
        id: 'aptech-accp',
        name: 'Lập trình Fullstack 2 năm',
        fullName: 'Lập trình Fullstack 2 năm - FPT Aptech',
        duration: '2 năm',
        slug: 'accp',
        route: '/dao-tao/aptech/accp'
      },
      {
        id: 'aptech-1-nam',
        name: 'Lập trình Back end 1 năm',
        fullName: 'Lập trình Back end 1 năm - FPT Aptech',
        duration: '1 năm',
        slug: '1-nam',
        route: '/dao-tao/aptech/1-nam'
      },
      {
        id: 'aptech-6-thang',
        name: 'Lập trình Front end 6 tháng',
        fullName: 'Lập trình Front end 6 tháng - FPT Aptech',
        duration: '6 tháng',
        slug: '6-thang',
        route: '/dao-tao/aptech/6-thang'
      },
      {
        id: 'aptech-100-200h',
        name: 'Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ)',
        fullName: 'Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech',
        duration: '100 - 200 giờ',
        slug: '100-200h',
        route: '/dao-tao/aptech/100-200h'
      }
    ]
  },
  arena: {
    brandId: 'arena',
    brandName: 'FPT Arena Multimedia',
    tagline: 'Mỹ thuật Đa phương tiện & Kỹ xảo Đồ họa',
    logo: '/logo_arena.png',
    color: '#ffb600',
    route: '/dao-tao/arena',
    programs: [
      {
        id: 'arena-amsp',
        name: 'Arena Multimedia Specialist Program (2 năm)',
        fullName: 'Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia',
        duration: '2 năm',
        slug: 'amsp',
        route: '/dao-tao/arena/amsp'
      },
      {
        id: 'arena-6-18-thang',
        name: 'Thiết kế 2D, 3D, Game và App (6–18 tháng)',
        fullName: 'Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia',
        duration: '6–18 tháng',
        slug: '6-18-thang',
        route: '/dao-tao/arena/6-18-thang'
      },
      {
        id: 'arena-100h',
        name: 'Bộ khóa học Multimedia ngắn hạn (100 giờ)',
        fullName: 'Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia',
        duration: '100 giờ',
        slug: '100h',
        route: '/dao-tao/arena/100h'
      }
    ]
  },
  skillking: {
    brandId: 'skillking',
    brandName: 'FPT Skillking',
    tagline: 'Digital Marketing Thực chiến với AI',
    logo: '/logo_skillking.png',
    color: '#09529c',
    route: '/dao-tao/skillking',
    programs: [
      {
        id: 'skillking-18-thang',
        name: 'Fullstack Digital Marketing With AI (18 tháng)',
        fullName: 'Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking',
        duration: '18 tháng',
        slug: '18-thang',
        route: '/dao-tao/skillking/18-thang'
      },
      {
        id: 'skillking-100h',
        name: 'Bộ khóa học Digital Marketing ngắn hạn (100 giờ)',
        fullName: 'Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking',
        duration: '100 giờ',
        slug: '100h',
        route: '/dao-tao/skillking/100h'
      }
    ]
  },
  jetking: {
    brandId: 'jetking',
    brandName: 'FPT Jetking',
    tagline: 'Thiết kế Vi mạch Bán dẫn & AI Agent',
    logo: '/logo_jetking.png',
    color: '#dc2626',
    route: '/dao-tao/chip-design',
    programs: [
      {
        id: 'jetking-chip-design',
        name: 'Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm)',
        fullName: 'Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking',
        duration: '2 năm',
        slug: 'chip-design',
        route: '/dao-tao/chip-design'
      },
      {
        id: 'jetking-ai-agent',
        name: 'Lập trình AI Agent (6 tháng - 2 năm)',
        fullName: 'Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking',
        duration: '6 tháng - 2 năm',
        slug: 'ai-agent',
        route: '/dao-tao/ai-agent'
      }
    ]
  }
};

// Sub-course dropdown options cho các khóa chuyên sâu và ngắn hạn
export const aptechShortCourseOptions = [
  'Lập trình Java Fullstack cơ bản & nâng cao',
  'Lập trình Python phân tích dữ liệu & AI',
  'Lập trình Web Front-end với ReactJS & NextJS',
  'Lập trình Backend với Node.js & RESTful API',
  'Lập trình C/C++ & Cấu trúc dữ liệu giải thuật'
];

export const arenaSpecializationOptions = [
  'Thiết kế đồ họa thương mại (6 tháng)',
  'Thiết kế Web & Kỹ thuật số UI/UX (12 tháng)',
  'Làm phim kỹ thuật số & Hoạt hình 3D (18 tháng)',
  'Thiết kế Game & Hoạt hình 3D (18 tháng)'
];

export const arenaShortCourseOptions = [
  'Thiết Kế Thương Hiệu - Thương Mại (100h)',
  'Thiết Kế App/Web UI/UX (100h)',
  'Làm Video/Clip Sáng Tạo (100h)',
  'Thiết Kế Cho Game & 3D (100h)'
];

export const skillkingShortCourseOptions = [
  'Social Media Creator & Ads Performance',
  'Google Mastery: SEO & Google Ads',
  'S-Commerce & TikTok Shop Mastery'
];

// Switcher items chuẩn dùng trực tiếp cho các component Switcher
export const aptechSwitcherItems = programsByBrand.aptech.programs.map(p => ({
  label: p.name,
  href: p.route,
  path: p.route
}));

export const arenaSwitcherItems = programsByBrand.arena.programs.map(p => ({
  label: p.name,
  href: p.route,
  path: p.route
}));

export const skillkingSwitcherItems = programsByBrand.skillking.programs.map(p => ({
  label: p.name,
  href: p.route,
  path: p.route
}));

export const jetkingSwitcherItems = programsByBrand.jetking.programs.map(p => ({
  label: p.name,
  href: p.route,
  path: p.route
}));
```

---

### 4.2. `src/data/scholarships.js`

```javascript
/**
 * src/data/scholarships.js
 * Quỹ học bổng và ưu đãi tuyển sinh 2026 theo 4 thương hiệu đào tạo FAI
 */

export const SCHOLARSHIP_BRANDS = {
  aptech: {
    id: 'aptech',
    name: 'FPT Aptech',
    tagline: 'Đào tạo Lập trình viên Quốc tế',
    themeColor: '#f37021',
    accentBg: 'rgba(243, 112, 33, 0.08)',
    borderColor: 'rgba(243, 112, 33, 0.25)',
    gradientBg: 'linear-gradient(135deg, #f37021 0%, #d85d0d 100%)',
    campuses: ['Hà Nội'],
    items: [
      {
        id: 'aptech-tai-nang',
        title: 'Học bổng tài năng',
        value: '14',
        unit: 'Triệu',
        amount: '14.000.000 VNĐ',
        desc: 'Dành cho thí sinh có thành tích học tập xuất sắc hoặc thể hiện đam mê lập trình công nghệ vượt trội.',
        badge: 'HỌC BỔNG XUẤT SẮC',
        tags: ['C++', 'JAVA']
      },
      {
        id: 'aptech-nhap-hoc-som',
        title: 'Khuyến khích nhập học',
        value: '10',
        unit: 'Triệu',
        amount: '10.000.000 VNĐ',
        desc: 'Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục nhập học sớm các đợt mở lớp mới năm 2026.',
        badge: 'NHẬP HỌC SỚM',
        tags: ['FULLSTACK', 'AI POWERED']
      },
      {
        id: 'aptech-chuyen-nganh',
        title: 'Ưu đãi chuyển ngành',
        value: '6',
        unit: 'Triệu',
        amount: '6.000.000 VNĐ',
        desc: 'Chính sách trợ lực đặc quyền dành riêng cho người đi làm và sinh viên chuyển hướng sang ngành Lập trình.',
        badge: 'DÀNH CHO NGƯỜI CHUYỂN NGÀNH',
        tags: ['PYTHON', 'DATABASE']
      },
      {
        id: 'aptech-tan-binh',
        title: 'Học bổng "Tân binh sáng tạo"',
        value: '2',
        unit: 'Triệu',
        amount: '2.000.000 VNĐ',
        desc: 'Quỹ hỗ trợ tân sinh viên gia nhập các chuyên ngành Lập trình Fullstack và Backend.',
        badge: 'QUỸ TÂN BINH',
        tags: ['TÂN SINH VIÊN']
      }
    ]
  },
  arena: {
    id: 'arena',
    name: 'FPT Arena Multimedia',
    tagline: 'Mỹ thuật Đa phương tiện & Kỹ xảo Đồ họa',
    themeColor: '#ffb600',
    accentBg: 'rgba(255, 182, 0, 0.1)',
    borderColor: 'rgba(255, 182, 0, 0.3)',
    gradientBg: 'linear-gradient(135deg, #ffb600 0%, #d97706 100%)',
    btnTextColor: '#000000',
    campuses: ['Hà Nội', 'Đà Nẵng'],
    items: [
      {
        id: 'arena-tai-nang',
        title: 'Học bổng tài năng',
        value: '14',
        unit: 'Triệu',
        amount: '14.000.000 VNĐ',
        desc: 'Dành cho thí sinh có năng khiếu mỹ thuật, đồ họa, video hoặc portfolio sáng tạo nổi bật.',
        badge: 'HỌC BỔNG XUẤT SẮC'
      },
      {
        id: 'arena-nhap-hoc-som',
        title: 'Khuyến khích nhập học',
        value: '10',
        unit: 'Triệu',
        amount: '10.000.000 VNĐ',
        desc: 'Ưu đãi trừ trực tiếp vào học phí khi hoàn tất thủ tục đăng ký sớm trong kỳ tuyển sinh.',
        badge: 'NHẬP HỌC SỚM'
      },
      {
        id: 'arena-chuyen-nganh',
        title: 'Ưu đãi chuyển ngành',
        value: '6',
        unit: 'Triệu',
        amount: '6.000.000 VNĐ',
        desc: 'Dành riêng cho người đi làm muốn đổi việc, theo đuổi đam mê thiết kế Multimedia, 2D/3D & Game.',
        badge: 'DÀNH CHO NGƯỜI CHUYỂN NGÀNH'
      },
      {
        id: 'arena-tan-binh',
        title: 'Học bổng "Tân binh sáng tạo"',
        value: '1.5 - 2',
        unit: 'Triệu',
        amount: '1.500.000 – 2.000.000 VNĐ',
        desc: 'Khuyến khích tân sinh viên hoàn tất hồ sơ sớm vào các chuyên ngành Mỹ thuật số.',
        badge: 'QUỸ TÂN BINH'
      }
    ]
  },
  skillking: {
    id: 'skillking',
    name: 'FPT Skillking',
    tagline: 'Digital Marketing Thực chiến với AI',
    themeColor: '#09529c',
    accentBg: 'rgba(9, 82, 156, 0.08)',
    borderColor: 'rgba(9, 82, 156, 0.25)',
    gradientBg: 'linear-gradient(135deg, #09529c 0%, #0284c7 100%)',
    campuses: ['Hà Nội', 'Đà Nẵng'],
    items: [
      {
        id: 'skillking-tai-nang',
        title: 'Học bổng tài năng',
        value: '14',
        unit: 'Triệu',
        amount: '14.000.000 VNĐ',
        desc: 'Dành cho thí sinh đam mê Digital Marketing và có tư duy kinh doanh trực tuyến đột phá cùng AI.',
        badge: 'HỌC BỔNG XUẤT SẮC'
      },
      {
        id: 'skillking-nhap-hoc-som',
        title: 'Khuyến khích nhập học',
        value: '10',
        unit: 'Triệu',
        amount: '10.000.000 VNĐ',
        desc: 'Ưu đãi trừ trực tiếp vào học phí cho các suất đăng ký nhập học sớm trong các đợt khai giảng.',
        badge: 'NHẬP HỌC SỚM'
      },
      {
        id: 'skillking-chuyen-nganh',
        title: 'Ưu đãi chuyển ngành',
        value: '6',
        unit: 'Triệu',
        amount: '6.000.000 VNĐ',
        desc: 'Hỗ trợ chuyển đổi sự nghiệp toàn diện sang Tiếp thị số đa kênh tích hợp trí tuệ nhân tạo.',
        badge: 'DÀNH CHO NGƯỜI CHUYỂN NGÀNH'
      },
      {
        id: 'skillking-tan-binh',
        title: 'Học bổng "Tân binh sáng tạo"',
        value: '1.5 - 2',
        unit: 'Triệu',
        amount: '1.500.000 – 2.000.000 VNĐ',
        desc: 'Quỹ tài trợ tân binh đăng ký khóa Fullstack Digital Marketing With AI.',
        badge: 'QUỸ TÂN BINH'
      }
    ]
  },
  jetking: {
    id: 'jetking',
    name: 'FPT Jetking',
    tagline: 'Thiết kế Vi mạch Bán dẫn & AI Agent',
    themeColor: '#dc2626',
    accentBg: 'rgba(220, 38, 38, 0.08)',
    borderColor: 'rgba(220, 38, 38, 0.25)',
    gradientBg: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
    campuses: ['Hà Nội', 'Đà Nẵng'],
    items: [
      {
        id: 'jetking-chip-design',
        title: 'Học bổng tài năng Chip Design',
        value: '8',
        unit: 'Triệu',
        amount: '8.000.000 VNĐ',
        desc: 'Dành cho học viên theo học ngành Thiết kế vi mạch bán dẫn quốc tế tích hợp AI 2 năm.',
        badge: 'CHIP DESIGN QUỐC TẾ'
      },
      {
        id: 'jetking-ai-agent',
        title: 'Học bổng tài năng AI Agent',
        value: '8',
        unit: 'Triệu',
        amount: '8.000.000 VNĐ',
        desc: 'Dành cho học viên theo học ngành Lập trình AI Agent chuyên sâu đón đầu làn sóng Generative AI.',
        badge: 'AI AGENT TIÊN PHONG'
      }
    ]
  }
};

// Preset cấu hình cho Form Section (ScholarshipFormSection)
export const BRAND_FORM_PRESETS = {
  aptech: {
    ...SCHOLARSHIP_BRANDS.aptech,
    defaultHeaderTitle: 'NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT APTECH',
    defaultFormTitle: 'BẠN CÓ MUỐN TRỞ THÀNH LẬP TRÌNH VIÊN QUỐC TẾ?',
    defaultFormSubtitle: 'Đăng ký nhận tư vấn lộ trình học & học bổng 2026'
  },
  arena: {
    ...SCHOLARSHIP_BRANDS.arena,
    defaultHeaderTitle: 'NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT ARENA',
    defaultFormTitle: 'BẠN CÓ MUỐN TRỞ THÀNH CHUYÊN GIA MULTIMEDIA?',
    defaultFormSubtitle: 'Đăng ký nhận tư vấn lộ trình Mỹ thuật đa phương tiện Quốc tế'
  },
  skillking: {
    ...SCHOLARSHIP_BRANDS.skillking,
    defaultHeaderTitle: 'NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT SKILLKING',
    defaultFormTitle: 'BẠN CÓ MUỐN TRỞ THÀNH CHUYÊN GIA DIGITAL MARKETING?',
    defaultFormSubtitle: 'Đăng ký nhận tư vấn lộ trình học & ưu đãi học bổng 2026'
  },
  'chip-design': {
    ...SCHOLARSHIP_BRANDS.jetking,
    defaultHeaderTitle: 'NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT JETKING CHIP DESIGN',
    defaultFormTitle: 'BẠN CÓ MUỐN TRỞ THÀNH KỸ SƯ THIẾT KẾ VI MẠCH BÁN DẪN?',
    defaultFormSubtitle: 'Đăng ký nhận tư vấn lộ trình Thiết kế Vi Mạch Bán Dẫn Quốc Tế 2 năm',
    campuses: ['Hà Nội']
  },
  'ai-agent': {
    ...SCHOLARSHIP_BRANDS.jetking,
    defaultHeaderTitle: 'NHẬN THÔNG TIN TƯ VẤN VỀ CHƯƠNG TRÌNH HỌC & HỌC BỔNG 2026 TẠI FPT JETKING AI AGENT',
    defaultFormTitle: 'BẠN CÓ MUỐN TRỞ THÀNH KỸ SƯ AI AGENT TIÊN PHONG?',
    defaultFormSubtitle: 'Đăng ký nhận tư vấn lộ trình Lập trình Hệ thống AI Agent',
    campuses: ['Hà Nội', 'Đà Nẵng']
  }
};
```

---

### 4.3. `src/data/tuition.js`

```javascript
/**
 * src/data/tuition.js
 * Thông tin tài khoản ngân hàng chuyển khoản học phí chính thức 2026
 */

export const TUITION_ACCOUNTS = [
  {
    campusKey: 'HN',
    campusName: 'Cơ sở Hà Nội',
    badge: 'HÀ NỘI CAMPUS',
    accountNumber: '00006969813',
    accountName: 'Trường Đại học FPT',
    bankName: 'Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội',
    shortBank: 'TPBank',
    branch: 'Chi nhánh Hà Nội',
    transferSyntax: 'FAIHN_hotensinhvien_HP HK 1',
    syntaxExample: 'FAIHN_NguyenVanAn_HP HK 1',
    address: 'Toà nhà FPT, Phố Dịch Vọng Hậu, Cầu Giấy, Hà Nội'
  },
  {
    campusKey: 'DN',
    campusName: 'Cơ sở Đà Nẵng',
    badge: 'ĐÀ NẴNG CAMPUS',
    accountNumber: '03557714109',
    accountName: 'Phân hiệu trường Đại học FPT tại TP Đà Nẵng',
    bankName: 'Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng',
    shortBank: 'TPBank',
    branch: 'Chi nhánh Đà Nẵng',
    transferSyntax: 'FAIDN_hotensinhvien_HP HK 1',
    syntaxExample: 'FAIDN_TranThiBinh_HP HK 1',
    address: 'Khu đô thị công nghệ FPT Đà Nẵng, P. Hòa Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng'
  }
];

export const TUITION_TRANSFER_NOTES = [
  'Học viên ghi chính xác cú pháp chuyển khoản tương ứng với cơ sở đăng ký học (HN hoặc DN).',
  'Ghi rõ họ và tên không dấu (ví dụ: NguyenVanAn) và kỳ đóng học phí (ví dụ: HP HK 1).',
  'Lưu lại hình ảnh biên lai giao dịch thành công để nộp kèm hồ sơ nhập học hoặc gửi cho cán bộ tuyển sinh phụ trách.',
  'Mọi khoản thanh toán cần được thực hiện qua đúng số tài khoản TPBank chính thức công bố tại trang này.'
];
```

---

### 4.4. `src/data/contacts.js`

```javascript
/**
 * src/data/contacts.js
 * Mạng lưới liên hệ, hotline, campus, giờ làm việc và external links
 */

export const HOTLINES = {
  hn: {
    label: 'Cơ sở Hà Nội',
    display: '024 7300 8855',
    raw: '02473008855',
    tel: 'tel:02473008855'
  },
  dn: {
    label: 'Cơ sở Đà Nẵng',
    display: '0236 730 8826',
    raw: '02367308826',
    tel: 'tel:02367308826'
  },
  primary: '024 7300 8855',
  secondary: '0236 730 8826'
};

export const EMAILS = {
  general: 'fai@fpt.edu.vn',
  admissions: 'fai@fpt.edu.vn',
  mailto: 'mailto:fai@fpt.edu.vn'
};

export const WORKING_HOURS = {
  display: '8:00 - 21:00 hàng ngày',
  detail: 'Thời gian làm việc từ 8:00 - 21:00 hàng ngày, kể cả Thứ 7 và Chủ Nhật'
};

export const ADMISSION_CAMPUSES = ['Hà Nội', 'Đà Nẵng'];

export const EXTERNAL_LINKS = {
  privacyPolicy: 'https://fpt.edu.vn/thu-vien-anh/11140',
  leadSubmitScript: 'https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec',
  websites: {
    fai: 'https://fai.fpt.edu.vn',
    aptech: 'https://aptech.fpt.edu.vn',
    arena: 'https://arena.fpt.edu.vn',
    skillking: 'https://skillking.fpt.edu.vn',
    jetking: 'https://jetking.fpt.edu.vn'
  },
  zalo: {
    fai: 'https://zalo.me/3164559225263453576',
    aptech: 'https://zalo.me/fptaptech',
    arena: 'https://zalo.me/fptarenaofficial',
    skillking: 'https://zalo.me/fptskillking',
    jetking: 'https://zalo.me/jetkingfpt'
  }
};

// Mạng lưới campus chi tiết theo từng thương hiệu (phục vụ src/app/lien-he/page.js)
export const aptechCampuses = [
  {
    city: 'Hà Nội',
    name: 'FPT Aptech - Cơ sở Phan Tây Nhạc',
    address: 'Cổng số 1, Nhà E, Toà nhà FPT Polytechnic, 13 Phan Tây Nhạc, Phường Xuân Phương, TP Hà Nội',
    hotline: '0833 999 810',
    email: 'aptech.hn@fpt.edu.vn'
  },
  {
    city: 'Hà Nội',
    name: 'FPT Aptech - Cơ sở Tôn Thất Thuyết',
    address: '8 Tôn Thất Thuyết, Phường Cầu Giấy, TP Hà Nội',
    hotline: '0833 999 810',
    email: 'aptech.hn@fpt.edu.vn'
  },
  {
    city: 'TP. Hồ Chí Minh',
    name: 'FPT Aptech - Cơ sở 21 Bis Hậu Giang',
    address: '21 Bis Hậu Giang, Phường Tân Sơn Nhất, TP HCM',
    hotline: '0834 999 810',
    email: 'aptech.hcm@fpt.edu.vn'
  },
  {
    city: 'TP. Hồ Chí Minh',
    name: 'FPT Aptech - Cơ sở Nguyên Hồng',
    address: '84A Nguyên Hồng, P. Hạnh Thông, TP HCM',
    hotline: '0834 999 810',
    email: 'aptech.hcm@fpt.edu.vn'
  }
];

export const arenaCampuses = [
  {
    city: 'Hà Nội',
    name: 'FPT Arena - Cơ sở Đội Cấn',
    address: '264 Đội Cấn, Phường Ba Đình, TP Hà Nội',
    hotline: '024 7300 8855',
    email: 'farena.hn@fpt.edu.vn'
  },
  {
    city: 'Hà Nội',
    name: 'FPT Arena - Cơ sở Lương Yên',
    address: '94 Lương Yên, Phường Bạch Đằng, TP Hà Nội',
    hotline: '024 7300 8855',
    email: 'farena.hn@fpt.edu.vn'
  },
  {
    city: 'Hà Nội',
    name: 'FPT Arena - Cơ sở Phan Tây Nhạc',
    address: 'Cổng số 1, Nhà E, Toà nhà FPT Polytechnic, 13 Phan Tây Nhạc, Phường Xuân Phương, TP Hà Nội',
    hotline: '024 7300 8855',
    email: 'farena.hn@fpt.edu.vn'
  },
  {
    city: 'Đà Nẵng',
    name: 'FPT Arena - Cơ sở Đà Nẵng',
    address: '130 Đống Đa, Phường Hải Châu, TP Đà Nẵng',
    hotline: '0236 730 8826',
    email: 'farena.dn@fpt.edu.vn'
  },
  {
    city: 'TP Hồ Chí Minh',
    name: 'FPT Arena - Cơ sở 21 Bis Hậu Giang',
    address: '21 Bis Hậu Giang, Phường Tân Sơn Nhất, TP Hồ Chí Minh',
    hotline: '028 7300 8866',
    email: 'farena.hcm@fpt.edu.vn'
  },
  {
    city: 'TP Hồ Chí Minh',
    name: 'FPT Arena - Cơ sở Nguyên Hồng',
    address: '84A Nguyên Hồng, Phường Hạnh Thông, TP Hồ Chí Minh',
    hotline: '028 7300 8866',
    email: 'farena.hcm@fpt.edu.vn'
  },
  {
    city: 'Cần Thơ',
    name: 'FPT Arena - Cơ sở Cần Thơ',
    address: '55 Cách Mạng Tháng 8, Phường Cái Khế, TP Cần Thơ',
    hotline: '0292 730 8806',
    email: 'farena.ct@fpt.edu.vn'
  }
];

export const skillkingCampuses = [
  {
    city: 'Hà Nội',
    name: 'FPT Skillking - Cơ sở Phan Tây Nhạc',
    address: 'Cổng số 1, Nhà E, Toà nhà FPT Polytechnic, 13 Phan Tây Nhạc, Phường Xuân Phương, TP Hà Nội',
    hotline: '024 7300 8855',
    email: 'skillking.hn@fpt.edu.vn'
  },
  {
    city: 'Hà Nội',
    name: 'FPT Skillking - Cơ sở Lương Yên',
    address: '94 Lương Yên, Phường Bạch Đằng, TP Hà Nội',
    hotline: '024 7300 8855',
    email: 'skillking.hn@fpt.edu.vn'
  },
  {
    city: 'Đà Nẵng',
    name: 'FPT Skillking - Cơ sở Đà Nẵng',
    address: '130 Đống Đa, Phường Hải Châu, TP Đà Nẵng',
    hotline: '0236 730 8826',
    email: 'skillking.dn@fpt.edu.vn'
  },
  {
    city: 'TP Hồ Chí Minh',
    name: 'FPT Skillking - Cơ sở 21 Bis Hậu Giang',
    address: '21 Bis Hậu Giang, Phường Tân Sơn Nhất, TP Hồ Chí Minh',
    hotline: '028 7300 8866',
    email: 'skillking.hcm@fpt.edu.vn'
  },
  {
    city: 'TP Hồ Chí Minh',
    name: 'FPT Skillking - Cơ sở Nguyên Hồng',
    address: '84A Nguyên Hồng, Phường Hạnh Thông, TP Hồ Chí Minh',
    hotline: '028 7300 8866',
    email: 'skillking.hcm@fpt.edu.vn'
  },
  {
    city: 'Cần Thơ',
    name: 'FPT Skillking - Cơ sở Cần Thơ',
    address: '55 Cách Mạng Tháng 8, Phường Cái Khế, TP Cần Thơ',
    hotline: '0292 730 8806',
    email: 'skillking.ct@fpt.edu.vn'
  }
];

export const jetkingCampuses = [
  {
    city: 'Hà Nội',
    name: 'FPT Jetking - Cơ sở Phan Tây Nhạc',
    address: 'Cổng số 1, Nhà E, Toà nhà FPT Polytechnic, 13 Phan Tây Nhạc, Phường Xuân Phương, TP Hà Nội.',
    hotline: '0833 999 810',
    email: 'jetking.hn@fpt.edu.vn'
  },
  {
    city: 'Đà Nẵng',
    name: 'FPT Jetking - Cơ sở Đà Nẵng',
    address: '130 Đống Đa, Phường Hải Châu, TP Đà Nẵng.',
    hotline: '0941 173 530',
    email: 'jetking.dn@fpt.edu.vn'
  },
  {
    city: 'TP. Hồ Chí Minh',
    name: 'FPT Jetking - Cơ sở 21 Bis Hậu Giang',
    address: '21 Bis Hậu Giang, Phường Tân Sơn Nhất, TP HCM.',
    hotline: '0834 999 810',
    email: 'jetking.hcm@fpt.edu.vn'
  },
  {
    city: 'TP. Hồ Chí Minh',
    name: 'FPT Jetking - Cơ sở Nguyên Hồng',
    address: '84A Nguyên Hồng, P. Hạnh Thông, TP HCM',
    hotline: '0834 999 810',
    email: 'jetking.hcm@fpt.edu.vn'
  }
];

// Danh sách Campus gom theo Thành phố (phục vụ Footer.jsx)
export const campusesByCity = {
  hanoi: {
    city: 'Hà Nội',
    addresses: [
      '13 Phan Tây Nhạc, Phường Xuân Phương',
      '8 Tôn Thất Thuyết, Phường Cầu Giấy',
      '264 Đội Cấn, Phường Ba Đình',
      '94 Lương Yên, Phường Bạch Đằng'
    ]
  },
  hcm: {
    city: 'TP. Hồ Chí Minh',
    addresses: [
      '21 Bis Hậu Giang, Phường Tân Sơn Nhất',
      '84A Nguyên Hồng, Phường Hạnh Thông'
    ]
  },
  danang: {
    city: 'Đà Nẵng',
    addresses: [
      '130 Đống Đa, Phường Hải Châu'
    ]
  },
  cantho: {
    city: 'Cần Thơ',
    addresses: [
      '55 Cách Mạng Tháng Tám, Phường Cái Khế'
    ]
  }
};
```

---

### 4.5. Bảng ma trận ánh xạ Consumer Files và Phương án Refactor

| Consumer File | Dữ liệu cũ đang bị hardcode | Tệp src/data/ cần import | Thuộc tính/Hàm cần dùng |
|---|---|---|---|
| **`src/app/tuyen-sinh/page.js`** | `TRAINING_PROGRAMS_2026`, `SCHOLARSHIP_BRANDS`, `TUITION_ACCOUNTS`, hotlines, emails, campuses, links | `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js` | `TRAINING_PROGRAMS_2026`, `SCHOLARSHIP_BRANDS`, `TUITION_ACCOUNTS`, `HOTLINES`, `EMAILS`, `ADMISSION_CAMPUSES`, `EXTERNAL_LINKS` |
| **`src/app/lien-he/page.js`** | 4 mảng campuses, hotlines, emails, giờ làm việc | `contacts.js` | `aptechCampuses`, `arenaCampuses`, `skillkingCampuses`, `jetkingCampuses`, `HOTLINES`, `WORKING_HOURS` |
| **`src/components/Footer.jsx`** | Địa chỉ 4 thành phố, hotline, email, brand websites | `contacts.js` | `campusesByCity`, `HOTLINES`, `EMAILS`, `EXTERNAL_LINKS` |
| **`src/components/Header.jsx`** | Megamenu 11 khóa học, mobile menu | `programs.js` | `programsByBrand` |
| **`src/components/ScholarshipFormSection.jsx`** | `BRAND_PRESETS`, badges, campuses, Google Script URL | `scholarships.js`, `contacts.js` | `BRAND_FORM_PRESETS`, `ADMISSION_CAMPUSES`, `EXTERNAL_LINKS` |
| **`src/components/Arena100hFormSection.jsx`** | 4 khóa học, badge 1.5-2M, campuses, script URL | `programs.js`, `scholarships.js`, `contacts.js` | `arenaShortCourseOptions`, `SCHOLARSHIP_BRANDS.arena`, `EXTERNAL_LINKS` |
| **`src/components/Skillking100hFormSection.jsx`** | 3 khóa học, badge 1.5M, campuses, script URL | `programs.js`, `scholarships.js`, `contacts.js` | `skillkingShortCourseOptions`, `SCHOLARSHIP_BRANDS.skillking`, `EXTERNAL_LINKS` |
| **`src/components/AptechProgramSwitcher.jsx`** | 4 items chương trình Aptech | `programs.js` | `aptechSwitcherItems` |
| **`src/components/ArenaProgramSwitcher.jsx`** | 3 items chương trình Arena | `programs.js` | `arenaSwitcherItems` |
| **`src/components/SkillkingProgramSwitcher.jsx`** | 2 items chương trình Skillking | `programs.js` | `skillkingSwitcherItems` |
| **`src/components/JetkingProgramSwitcher.jsx`** | 2 items chương trình Jetking | `programs.js` | `jetkingSwitcherItems` |
| **`src/app/dao-tao/page.js`** | 5 khối brand + curriculums, Zalo link | `programs.js`, `contacts.js` | `programsByBrand`, `EXTERNAL_LINKS.zalo` |
| **11 trang `src/app/dao-tao/*`** | Course options, scholarship badges, Zalo links | `programs.js`, `scholarships.js`, `contacts.js` | Short course options, brand badges, `EXTERNAL_LINKS.zalo` |
| **`src/app/doi-song/page.js`** | Hotline 024 7300 8855 | `contacts.js` | `HOTLINES.primary` |
| **`src/components/TechCTAButton.jsx`** | Zalo link mặc định | `contacts.js` | `EXTERNAL_LINKS.zalo.fai` |

---

## 5. VERIFICATION METHOD (Cách kiểm tra & Nghiệm thu độc lập)

Sau khi implementer tạo 4 file trên trong `src/data/` và refactor các consumer files:

1. **Kiểm tra cú pháp và Build**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npm run build
   ```
   *Yêu cầu*: Build thành công không có lỗi syntax, không thiếu import, không có mismatch hydration.

2. **Kiểm tra Runtime Local**:
   ```bash
   npm run dev
   ```
   Truy cập các URL chính:
   - `http://localhost:3000/tuyen-sinh`: Đảm bảo dropdown đủ 11 khóa học, 4 tab học bổng hoạt động, khối STK copy được, hotline và email hiển thị đúng.
   - `http://localhost:3000/lien-he`: Đảm bảo các campus 4 brand và hotline hub hiển thị đầy đủ.
   - `http://localhost:3000/dao-tao/aptech/accp`: Đảm bảo sticky switcher và form học bổng render đúng.
   - `http://localhost:3000/`: Đảm bảo header megamenu và footer hiển thị chuẩn.

3. **Kiểm tra Single Source of Truth (Kiểm thử đổi 1 điểm)**:
   - Thử sửa số hotline `024 7300 8855` thành `024 7300 9999` trong `src/data/contacts.js`.
   - Mở đồng thời `/tuyen-sinh`, `/lien-he`, `/doi-song` và kiểm tra Footer. Số hotline mới phải tự động cập nhật đồng loạt tại tất cả các trang trên mà không cần sửa bất kỳ file JSX nào.
