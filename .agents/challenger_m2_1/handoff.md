# HANDOFF REPORT — CHALLENGER M2: TUYỂN SINH EMPIRICAL VERIFICATION

**Agent**: `challenger_m2_1` (Empirical Verification Challenger - Tuyen Sinh)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_1`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Verdict**: **CHALLENGE_DETECTED**  

---

## 1. Observation

### 1.1. Line Count Verification
- Target file: `src/app/tuyen-sinh/page.js`
- Command: `wc -l src/app/tuyen-sinh/page.js`
- Output:
  ```
  40 src/app/tuyen-sinh/page.js
  ```
- Result: **PASS** (40 lines < 250 lines requirement). File is a pure React Server Component exporting `metadata`.

### 1.2. Production Build and Lint Checks
- Command: `npx eslint src/app/tuyen-sinh/page.js src/components/tuyen-sinh/`
- Output: 0 errors, 0 warnings. Result: **PASS**.
- Command: `npm run build`
- Output:
  ```
  ✓ Compiled successfully in 4.4s
  ✓ Generating static pages using 7 workers (34/34) in 401ms
  Route (app): ○ /tuyen-sinh (Static)
  ```
- Result: **PASS**.

### 1.3. Empirical HTML Rendering Verification (`http://localhost:3000/tuyen-sinh`)
Executed via Node.js fetch against the live local development server:

1. **Course List Check (All 11 Courses in Registration Section / Option Elements)**:
   - `Lập trình Fullstack 2 năm - FPT Aptech` -> Found (`true`)
   - `Lập trình Back end 1 năm - FPT Aptech` -> Found (`true`)
   - `Lập trình Front end 6 tháng - FPT Aptech` -> Found (`true`)
   - `Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech` -> Found (`true`)
   - `Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia` -> Found (`true`)
   - `Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia` -> Found (`true`)
   - `Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia` -> Found (`true`)
   - `Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking` -> Found (`true`)
   - `Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking` -> Found (`true`)
   - `Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking` -> Found (`true`)
   - `Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking` -> Found (`true`)
   - Result: **PASS** (11/11 courses found in `<option>` elements).

2. **Scholarship Brand Tabs (All 4 Brands)**:
   - `FPT Aptech` -> Found (`true`)
   - `FPT Arena Multimedia` -> Found (`true`)
   - `FPT Skillking` -> Found (`true`)
   - `FPT Jetking` -> Found (`true`)
   - Result: **PASS** (All 4 brand tabs rendered with offer counts).

3. **Scholarship Values and Units ("14 Triệu", "10 Triệu", "6 Triệu", "8 Triệu")**:
   - `14 Triệu` -> Found (`true` in Aptech card)
   - `10 Triệu` -> Found (`true` in Aptech card)
   - `6 Triệu` -> Found (`true` in Aptech card)
   - `8 Triệu` -> **NOT FOUND** (`false` in initial rendered HTML and `.next/server/app/tuyen-sinh.html`)
   - Result: **FAIL / CHALLENGE DETECTED**.

4. **TPBank Accounts & Transfer Syntax**:
   - Hanoi STK `00006969813` -> Found (`true`)
   - Hanoi Name `Trường Đại học FPT` -> Found (`true`)
   - Hanoi Bank `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội` -> Found (`true`)
   - Hanoi Syntax `FAIHN_hotensinhvien_HP HK 1` -> Found (`true`)
   - Danang STK `03557714109` -> Found (`true`)
   - Danang Name `Phân hiệu trường Đại học FPT tại TP Đà Nẵng` -> Found (`true`)
   - Danang Bank `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng` -> Found (`true`)
   - Danang Syntax `FAIDN_hotensinhvien_HP HK 1` -> Found (`true`)
   - Result: **PASS**.

5. **Anchor `#faq`**:
   - `<span id="faq" style="position:relative;top:-120px;visibility:hidden;display:block"></span>` -> Found (`true`)
   - Result: **PASS**.

6. **Hotline Numbers from `src/data/contacts.js`**:
   - `024 7300 8855` -> Found (`true`)
   - `0236 730 8826` -> Found (`true`)
   - Result: **PASS**.

7. **Removal of Old Entrance Exam**:
   - "Môn 1: Tiếng Anh", "Môn 2: Sáng Tạo / Logic" -> Not found (`false`).
   - "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển" -> Found (`true`).
   - Result: **PASS**.

8. **Admission Dossier**:
   - 01 Phiếu đăng ký nhập học -> Found (`true`)
   - 01 Bản sao công chứng CCCD -> Found (`true`)
   - 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết" -> Found (`true`)
   - Result: **PASS**.

---

## 2. Logic Chain

1. **Defect Root Cause Analysis for "8 Triệu"**:
   - In `src/components/tuyen-sinh/ScholarshipTabSection.jsx`:
     - Line 7: `export default function ScholarshipTabSection({ initialBrand = 'aptech' })`
     - Line 8: `const [activeBrand, setActiveBrand] = useState(initialBrand);`
     - Line 9: `const currentBrandData = SCHOLARSHIP_BRANDS[activeBrand] || SCHOLARSHIP_BRANDS.aptech;`
     - Line 149: `{currentBrandData.items.map((item, idx) => (`
   - Because `ScholarshipTabSection.jsx` conditionally renders only the active tab's card items (`currentBrandData.items`), and `activeBrand` defaults to `'aptech'`:
     - The server-side rendering (SSR) and static pre-rendering (SSG) only generate cards for `SCHOLARSHIP_BRANDS.aptech` (which contain "14 Triệu", "10 Triệu", "6 Triệu", and "2 Triệu").
     - The scholarship items for `jetking` (which contain "8 Triệu" for Chip Design and "8 Triệu" for AI Agent) and `arena` (which contain "1.5 - 2 Triệu") are **never rendered into the initial HTML**.
   - They only render on the client side after hydration when a user manually clicks the "FPT Jetking" tab button.
2. **SEO and Accessibility Impact**:
   - Web crawlers, search engines (Googlebot), and HTTP scrapers do not execute client-side state manipulation. They only parse the initial HTML payload.
   - Because Jetking and Arena scholarship cards are unrendered on SSR, search engines cannot index the Jetking "8 Triệu" scholarship offers or Arena's graphic design scholarships.
3. **Task Requirement Discrepancy**:
   - The task specification explicitly mandates:
     `Check that scholarship values render with units ("14 Triệu", "10 Triệu", "6 Triệu", "8 Triệu")` in `HTML rendered by http://localhost:3000/tuyen-sinh`.
   - Empirically, fetching the HTML of `http://localhost:3000/tuyen-sinh` fails to find `"8 Triệu"`.

---

## 3. Caveats

- In a desktop browser with JavaScript enabled, clicking the "FPT Jetking" tab immediately displays the 2 scholarship cards ("8 Triệu"). However, the task specifically evaluates the rendered HTML from `http://localhost:3000/tuyen-sinh`.
- No other regressions were detected. All contact data, banking accounts, 11 courses, and page line counts adhere strictly to specifications.

---

## 4. Conclusion

Verdict: **CHALLENGE_DETECTED**

The Tuyển Sinh decomposition meets 9 out of 10 verification criteria, but fails on rendered HTML presence of the Jetking scholarship value ("8 Triệu") due to conditional tab rendering.

### Actionable Mitigation for Worker:
In `src/components/tuyen-sinh/ScholarshipTabSection.jsx`:
Instead of rendering only `{currentBrandData.items.map(...)}`, render all 4 brands' panels into the DOM and control their visibility via CSS `display`:
```jsx
{Object.values(SCHOLARSHIP_BRANDS).map((brand) => (
  <div
    key={brand.id}
    style={{
      display: activeBrand === brand.id ? 'grid' : 'none',
      maxWidth: '1160px',
      margin: '0 auto',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px'
    }}
  >
    {brand.items.map((item, idx) => (
       ...
    ))}
  </div>
))}
```
This change will:
1. Ensure all scholarship amounts ("14 Triệu", "10 Triệu", "6 Triệu", "8 Triệu", "1.5 - 2 Triệu") exist in the initial SSR HTML.
2. Satisfy all crawler / SEO requirements.
3. Allow `curl -s http://localhost:3000/tuyen-sinh | grep "8 Triệu"` to pass immediately.

---

## 5. Verification Method

To independently reproduce this finding:

1. **Verify Line Count**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   wc -l src/app/tuyen-sinh/page.js
   # Output: 40 (PASS)
   ```

2. **Verify Missing "8 Triệu" in HTML**:
   ```bash
   curl -s http://localhost:3000/tuyen-sinh | grep "8 Triệu"
   # Exit code: 1 (Nothing found - FAILS)

   curl -s http://localhost:3000/tuyen-sinh | grep "14 Triệu"
   # Output matches (PASS)
   ```

3. **Verify All 11 Courses Present in HTML**:
   ```bash
   node -e '
   fetch("http://localhost:3000/tuyen-sinh")
     .then(r => r.text())
     .then(html => {
       const courses = [
         "Lập trình Fullstack 2 năm - FPT Aptech",
         "Lập trình Back end 1 năm - FPT Aptech",
         "Lập trình Front end 6 tháng - FPT Aptech",
         "Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech",
         "Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia",
         "Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia",
         "Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia",
         "Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking",
         "Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking",
         "Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking",
         "Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking"
       ];
       const found = courses.filter(c => html.includes(c)).length;
       console.log("Courses in HTML:", found, "/", courses.length);
     });
   '
   # Output: Courses in HTML: 11 / 11 (PASS)
   ```

4. **Verify Banking and Hotlines**:
   ```bash
   curl -s http://localhost:3000/tuyen-sinh | grep "00006969813" # PASS
   curl -s http://localhost:3000/tuyen-sinh | grep "03557714109" # PASS
   curl -s http://localhost:3000/tuyen-sinh | grep "024 7300 8855" # PASS
   curl -s http://localhost:3000/tuyen-sinh | grep "0236 730 8826" # PASS
   ```
