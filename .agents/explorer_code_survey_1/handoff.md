# HANDOFF REPORT — CODEBASE ARCHITECTURE SURVEY (FAI 2026 ADMISSIONS)

**Agent**: Codebase Architecture Explorer (`explorer_code_survey_1`)  
**Target Path**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Report Document**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_code_survey_1/code_report.md`  

---

## 1. OBSERVATION

1. **Admissions Page (`src/app/tuyen-sinh/page.js`)**:
   - File length: 302 lines. First line is `'use client';`.
   - Current structure:
     - Block 1 (Lines 13–37): Hero Section with subtitle mentioning *"môn thi năng lực đầu vào và hồ sơ thủ tục nhập học chính thức tại Viện Đào tạo Quốc tế FPT (FAI)"* (Line 34).
     - Block 2 (Lines 39–95): Section `#doi-tuong` with 3 target groups (THPT, ĐH/CĐ, Chuyển ngành).
     - Block 3 (Lines 97–152): Section `#phuong-thuc` titled *"Kiểm tra năng lực đầu vào"* with two test cards: *"Môn 1: Tiếng Anh"* (Lines 114–122) and *"Môn 2: Sáng Tạo / Logic"* (Lines 123–131).
     - Block 4 (Lines 154–243): Section `#ho-so` with 4-step flow where Step 2 is *"Kiểm tra năng lực: Làm bài kiểm tra đầu vào (Tiếng Anh & Sáng tạo/Logic)..."* (Lines 187–189), and dossier checklist contains 5 items including Bằng THPT, Học bạ, CCCD, Ảnh 3x4 (Lines 217–237).
     - Block 5 (Lines 245–294): Section CTA with old hotline `1900 6000` (Lines 278–280).
     - Line 298: `<Footer />` rendered directly at the bottom.
   - Missing sections: No `#hoc-bong`, no `#hoc-phi`, no `#dang-ky`, no FAQ.

2. **Styling & Dependency Stack (`package.json`, `src/app/globals.css`)**:
   - `package.json`: Contains `"dependencies": { "firebase": "^12.17.1", "lucide-react": "^1.21.0", "next": "16.2.9", "react": "19.2.4", "react-dom": "19.2.4", "swiper": "^12.2.0" }`.
   - **No Tailwind CSS**: Search for `tailwind` across `package.json` and `globals.css` returned 0 matches.
   - `globals.css` defines `:root` tokens (Lines 237–259):
     - `--primary: #E8741E`
     - `--secondary: #0D2137`
     - `--secondary-mid: #162B4A`
     - `--accent: #C9972C`
     - `--bg-cream: #F8FAFC`
     - `--font-sans: 'SVN-Sonoma', 'SVN-Poppins', ...`
   - Scroll margin for anchors (Lines 281–283): `section[id], div[id], [id] { scroll-margin-top: 110px; }`.

3. **Header Integration (`src/components/Header.jsx`)**:
   - Lines 115–119 (Desktop Megamenu) and Lines 226–230 (Mobile Submenu) link to:
     - `/tuyen-sinh#thong-tin`
     - `/tuyen-sinh#hoc-bong`
     - `/tuyen-sinh#hoc-phi`
     - `/tuyen-sinh#dang-ky`
     - `/tuyen-sinh#faq`

4. **Form Handling Pattern (`src/components/ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`)**:
   - Uses React local state `useState` for form fields (`fullName`, `email`, `phone`, `campus`, `course`, `agreeTerms`).
   - Uses `fetch(googleSheetScriptUrl, { method: 'POST', mode: 'no-cors', ... })`.
   - Privacy terms checkbox links externally to `https://fpt.edu.vn/thu-vien-anh/11140`.

5. **Dev Server & Route Status**:
   - Next.js dev server is running on PID 54207.
   - `curl -I http://localhost:3000/tuyen-sinh` returned `HTTP/1.1 200 OK`.
   - `npx eslint src/app/tuyen-sinh/page.js` exited with code 0 (zero lint errors).

---

## 2. LOGIC CHAIN

1. **From Observation 1 & 3**:
   - `Header.jsx` has active links pointing to `#thong-tin`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`, and `#faq`.
   - The current `tuyen-sinh/page.js` only provides `#doi-tuong`, `#phuong-thuc`, `#ho-so`. Clicking `#thong-tin`, `#hoc-bong`, `#hoc-phi`, or `#dang-ky` fails to scroll to dedicated sections because they do not exist yet.
   - Therefore, the new `tuyen-sinh/page.js` must assign:
     - `id="thong-tin"` (and alias `id="doi-tuong"`) to the Admissions Overview/Target Audience section.
     - `id="hoc-bong"` to the 4-brand Scholarship section.
     - `id="hoc-phi"` to the Hà Nội & Đà Nẵng Tuition Banking section.
     - `id="dang-ky"` to the Registration Form and Direct Contact section.

2. **From Observation 1 & Requirement R1.1**:
   - The entrance exam cards (Môn 1 Tiếng Anh, Môn 2 Sáng tạo/Logic in lines 97–152) and Step 2 in lines 187–189 contradict the 2026 direct admission mandate.
   - Therefore, Block 3 (`#phuong-thuc`) must be replaced with 2 direct admission cards (Đăng ký Online & Đăng ký Trực tiếp) with the explicit statement: *"Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"*.
   - The dossier checklist in lines 217–237 must be trimmed down from 5 items to exactly the 3 items specified in the Google Sheet.

3. **From Observation 2**:
   - Because Tailwind CSS is absent, any attempt to use utility classes like `p-4`, `flex-col`, `bg-orange-500` will fail silently or render unstyled.
   - Therefore, all UI elements must use the established project pattern: pure inline styles (`style={{ ... }}`) referencing `:root` CSS variables (`var(--primary)`, `var(--secondary)`, `var(--bg-cream)`), `.container`, and modern CSS flex/grid layout.

4. **From Observation 1 & 4**:
   - Form handling in `tuyen-sinh/page.js` should adopt the battle-tested `ScholarshipFormSection` architecture: local `useState`, required field validation, phone regex check, Google Apps Script POST with `no-cors`, and success toggle.
   - The dropdown must list all 11 courses grouped cleanly by the 4 brands (Aptech, Arena, Skillking, Jetking).

5. **From Observation 1, 3 & Requirement R1.4**:
   - The page currently lacks an FAQ block. Requirement R1.4 explicitly demands: *"Loại bỏ khối Câu hỏi thường gặp (FAQ): Không hiển thị khối FAQ trên trang này."*
   - Therefore, the implementer must NOT render any FAQ section on `/tuyen-sinh`.

6. **From Observation 1, 2 & 5**:
   - Because `tuyen-sinh/page.js` is marked with `'use client'`, client-side interactive state (brand tabs, copy-to-clipboard buttons, form validation) will run cleanly without SSR hydration mismatch, provided browser globals like `navigator.clipboard` are called exclusively inside event handlers.

---

## 3. CAVEATS

1. **Header `#faq` anchor**:
   - `Header.jsx` currently retains `/tuyen-sinh#faq` in both desktop megamenu and mobile drawer. Since Requirement R1.4 dictates no FAQ on `/tuyen-sinh`, clicking this menu item will simply scroll to top or no-op. The user instructions specifically target `/tuyen-sinh/page.js` for updates. If the parent wants to remove `#faq` from `Header.jsx`, that would require an edit to `src/components/Header.jsx`.
2. **Local Google Script URL**:
   - The Google Apps Script webhook URL is inherited from existing form components (`AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw`). In local testing, requests run in `no-cors` mode and catch block ensures graceful fallback.
3. **Hotline Numbers**:
   - Replaced old `1900 6000` with the verified local numbers: Hà Nội `024 7300 8855` and Đà Nẵng `0236 730 8826`.

---

## 4. CONCLUSION

The architecture of `/Users/vietmac/Documents/CODE/WEB- FAI/fai` is fully mapped and verified.
To satisfy all acceptance criteria:
1. Replace `src/app/tuyen-sinh/page.js` with a comprehensive, self-contained Client Component.
2. Structure into 7 coherent sections:
   - Hero (`QUY CHẾ TUYỂN SINH 2026`)
   - Section 1: Đối tượng tuyển sinh (`#thong-tin` / `#doi-tuong`) emphasizing Career Changers.
   - Section 2: Phương thức tuyển sinh (`#phuong-thuc`) with 2 direct admission methods ("Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển").
   - Section 3: Quy trình 4 bước & Hồ sơ nhập học rút gọn (exact 3 items: Phiếu ĐK, CCCD công chứng, Cam kết sinh viên).
   - Section 4: Học bổng & Ưu đãi 2026 (`#hoc-bong`) with 4-brand tab switcher (Aptech, Arena, Skillking, Jetking).
   - Section 5: Chính sách học phí (`#hoc-phi`) with Hà Nội & Đà Nẵng TPBank cards and 1-click copy buttons.
   - Section 6: Đăng ký tuyển sinh trực tuyến & Hotline (`#dang-ky`) with 11-course dropdown, campus selector, required terms checkbox + link `https://fpt.edu.vn/thu-vien-anh/11140`.
   - Section 7: FAQ completely omitted.
3. Follow pure CSS / inline styles with CSS variables. Do NOT use Tailwind CSS.
4. Mount `<Footer />` at the bottom of the page.
5. Strict local constraint: No git commit/push, no deployment. Verify on `http://localhost:3000/tuyen-sinh`.

---

## 5. VERIFICATION METHOD

To independently verify all findings and the upcoming implementation:

1. **Verify Dev Server Response**:
   ```bash
   curl -I http://localhost:3000/tuyen-sinh
   # Expected: HTTP/1.1 200 OK
   ```

2. **Verify Elimination of Old Test Content**:
   ```bash
   grep -inE "Môn 1|Môn 2|Kiểm tra năng lực" /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js
   # Expected: 0 matches after implementation
   ```

3. **Verify Dossier Items Count**:
   Inspect `src/app/tuyen-sinh/page.js` to ensure exactly 3 dossier items exist (Phiếu đăng ký, CCCD công chứng, Cam kết).

4. **Verify Scholarship 4 Brands & Tuition Details**:
   Inspect `src/app/tuyen-sinh/page.js` for:
   - FPT Aptech, FPT Arena Multimedia, FPT Skillking, FPT Jetking
   - Hà Nội STK `00006969813` and Đà Nẵng STK `03557714109`
   - TPBank and transfer syntax strings.

5. **Verify Form Fields & 11 Courses**:
   Verify dropdown options count == 11, campus options == 2 (Hà Nội, Đà Nẵng), and external link `https://fpt.edu.vn/thu-vien-anh/11140`.

6. **Verify Lint Compliance**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npx eslint src/app/tuyen-sinh/page.js
   # Expected: 0 errors, 0 warnings
   ```
