# HANDOFF REPORT — CHALLENGER M2 RETEST: TUYỂN SINH VERIFICATION

**Agent**: `challenger_m2_retest` (Tuyển Sinh Retest Challenger)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_retest`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Verdict**: **APPROVE**  
**Handoff Type**: Hard (Task Complete)

---

## 1. Observation

All tests were executed empirically against the live local Next.js server (`http://localhost:3000/tuyen-sinh`) and the local build artifacts.

### 1.1. Verification of "8 Triệu" (Jetking Scholarships)
- **Command**:
  ```bash
  curl -s http://localhost:3000/tuyen-sinh | grep -o "8 Triệu" | wc -l
  ```
- **Observed Result**: Exactly `2` occurrences found in the SSR HTML payload (HTTP exit code 0).
- **Extracted Cards**:
  - `[CHIP DESIGN QUỐC TẾ] 8 Triệu - Học bổng tài năng Chip Design` (color: `#dc2626`)
  - `[AI AGENT TIÊN PHONG] 8 Triệu - Học bổng tài năng AI Agent` (color: `#dc2626`)
- **Static Pre-render HTML**:
  ```bash
  grep -o "8 Triệu" .next/server/app/tuyen-sinh.html | wc -l
  # Output: 2
  ```
- **Status**: **PASS**. The defect reported by `challenger_m2_1` is completely fixed.

### 1.2. Verification of "14 Triệu" (Aptech / Arena / Skillking Scholarships)
- **Command**:
  ```bash
  curl -s http://localhost:3000/tuyen-sinh | grep -o "14 Triệu" | wc -l
  ```
- **Observed Result**: Exactly `3` occurrences found in the SSR HTML payload (HTTP exit code 0).
- **Extracted Cards**:
  - Aptech: `[HỌC BỔNG XUẤT SẮC] 14 Triệu - Học bổng tài năng` (color: `#f37021`)
  - Arena Multimedia: `[HỌC BỔNG XUẤT SẮC] 14 Triệu - Học bổng tài năng` (color: `#ffb600`)
  - Skillking: `[HỌC BỔNG XUẤT SẮC] 14 Triệu - Học bổng tài năng` (color: `#09529c`)
- **Status**: **PASS**.

### 1.3. Verification of All 11 Courses in Dropdown
- **Command**: Parsed from `<select name="program">` inside the registration form on `http://localhost:3000/tuyen-sinh`.
- **Observed Result**: All 11 options present across 4 optgroups:
  1. `Lập trình Fullstack 2 năm - FPT Aptech` (optgroup: FPT Aptech)
  2. `Lập trình Back end 1 năm - FPT Aptech` (optgroup: FPT Aptech)
  3. `Lập trình Front end 6 tháng - FPT Aptech` (optgroup: FPT Aptech)
  4. `Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech` (optgroup: FPT Aptech)
  5. `Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia` (optgroup: FPT Arena Multimedia)
  6. `Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia` (optgroup: FPT Arena Multimedia)
  7. `Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia` (optgroup: FPT Arena Multimedia)
  8. `Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking` (optgroup: FPT Skillking)
  9. `Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking` (optgroup: FPT Skillking)
  10. `Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking` (optgroup: FPT Jetking)
  11. `Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking` (optgroup: FPT Jetking)
- **Status**: **PASS** (11/11 courses matched verbatim).

### 1.4. Verification of TPBank Accounts & Transfer Syntax
- **Hà Nội Campus**:
  - STK: `00006969813` (PASS)
  - Beneficiary: `Trường Đại học FPT` (PASS)
  - Bank & Branch: `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội` (PASS)
  - Transfer Syntax: `FAIHN_hotensinhvien_HP HK 1` (PASS)
- **Đà Nẵng Campus**:
  - STK: `03557714109` (PASS)
  - Beneficiary: `Phân hiệu trường Đại học FPT tại TP Đà Nẵng` (PASS)
  - Bank & Branch: `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng` (PASS)
  - Transfer Syntax: `FAIDN_hotensinhvien_HP HK 1` (PASS)
- **Status**: **PASS** (100% exact match).

### 1.5. Verification of Line Count Constraint
- **File**: `src/app/tuyen-sinh/page.js`
- **Command**:
  ```bash
  wc -l src/app/tuyen-sinh/page.js
  ```
- **Observed Result**: `40 src/app/tuyen-sinh/page.js`
- **Threshold**: < 250 lines.
- **Status**: **PASS** (40 lines < 250 lines).

### 1.6. Additional Rigorous Regression Checks
- **ESLint**:
  ```bash
  npx eslint src/app/tuyen-sinh/page.js src/components/tuyen-sinh/
  ```
  Output: 0 errors, 0 warnings (exit code 0).
- **Production Build**:
  ```bash
  npm run build
  ```
  Output: Compiled successfully in 4.3s, generating 34/34 static pages without errors (exit code 0).
- **Removal of Old Exam**: "Môn 1: Tiếng Anh", "Môn 2: Sáng Tạo / Logic" -> Completely absent (PASS).
- **Admission Mode**: "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển" -> Present (PASS).
- **Dossier (3 items)**:
  - 01 Phiếu đăng ký nhập học (PASS)
  - 01 Bản sao công chứng CCCD (PASS)
  - 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết" (PASS)
- **Privacy Checkbox**: Mandatory checkbox with legal link `https://fpt.edu.vn/thu-vien-anh/11140` (PASS).
- **Hotlines & Email**: `024 7300 8855`, `0236 730 8826`, `fai@fpt.edu.vn` (PASS).

---

## 2. Logic Chain

1. **Defect Resolution Logic**:
   - `worker_m2_fix` modified `src/components/tuyen-sinh/ScholarshipTabSection.jsx` to map over `Object.values(SCHOLARSHIP_BRANDS)`, rendering all 4 brand card containers into the DOM simultaneously, with visibility toggled via `style={{ display: activeBrand === brand.id ? 'grid' : 'none' }}`.
   - Because all brand elements exist in the React render tree during SSR, Next.js outputs all 14 cards (including Jetking's two 8M cards and Arena's 1.5 - 2M cards) directly into the generated HTML.
   - As observed empirically in Section 1.1, `curl -s http://localhost:3000/tuyen-sinh | grep -o "8 Triệu"` immediately returns 2 matches, confirming that crawlers, scrapers, and curl requests receive the complete content without requiring client-side JS evaluation.
2. **Structural & Content Integrity Logic**:
   - The dropdown options are dynamically generated from `src/data/programs.js`, matching all 11 specified programs across the 4 FAI brands.
   - Bank accounts and transfer syntaxes are loaded from `src/data/tuition.js`, eliminating hardcoded inconsistencies.
   - The page architecture decomposes into 6 atomic components inside `src/components/tuyen-sinh/`, keeping `src/app/tuyen-sinh/page.js` at a compact 40 lines.
   - No React hydration mismatches or layout regressions occur because server and client initial states (`activeBrand = 'aptech'`) align identically.
3. **Synthesis**:
   - All 6 task criteria and all user requirements are 100% satisfied based on direct empirical test execution.

---

## 3. Caveats

- **No caveats.** The fix introduces no regressions, passes all linting rules, and successfully builds statically and dynamically.

---

## 4. Conclusion

**Verdict**: **APPROVE**

All acceptance criteria for Milestone 2 (Tuyển Sinh page redesign and decoupling) have been empirically verified and fully met:
1. `8 Triệu` Jetking scholarships are present in SSR HTML (2 matches).
2. `14 Triệu` scholarships are present in SSR HTML (3 matches).
3. All 11 training programs are present in the registration dropdown.
4. TPBank accounts and transfer syntaxes for Hà Nội and Đà Nẵng match specifications exactly.
5. `src/app/tuyen-sinh/page.js` line count is 40 lines (well under the 250-line limit).
6. Build and lint passes cleanly.

---

## 5. Verification Method

To independently verify this report:

1. **Verify "8 Triệu" (Jetking)**:
   ```bash
   curl -s http://localhost:3000/tuyen-sinh | grep -o "8 Triệu" | wc -l
   # Expected output: 2
   ```

2. **Verify "14 Triệu" (Aptech, Arena, Skillking)**:
   ```bash
   curl -s http://localhost:3000/tuyen-sinh | grep -o "14 Triệu" | wc -l
   # Expected output: 3
   ```

3. **Verify Dropdown 11 Courses**:
   ```bash
   node -e '
   fetch("http://localhost:3000/tuyen-sinh")
     .then(r => r.text())
     .then(html => {
       const selectMatch = html.match(/<select[\s\S]*?<\/select>/)[0];
       const opts = [...selectMatch.matchAll(/<option\b[^>]*>([^<]+)<\/option>/g)].map(m => m[1].trim());
       console.log("Total options:", opts.length);
       process.exit(opts.length === 11 ? 0 : 1);
     });
   '
   # Expected exit code: 0, Total options: 11
   ```

4. **Verify TPBank Banking Data**:
   ```bash
   curl -s http://localhost:3000/tuyen-sinh | grep -q "00006969813" && echo "Hanoi STK PASS"
   curl -s http://localhost:3000/tuyen-sinh | grep -q "FAIHN_hotensinhvien_HP HK 1" && echo "Hanoi Syntax PASS"
   curl -s http://localhost:3000/tuyen-sinh | grep -q "03557714109" && echo "Danang STK PASS"
   curl -s http://localhost:3000/tuyen-sinh | grep -q "FAIDN_hotensinhvien_HP HK 1" && echo "Danang Syntax PASS"
   ```

5. **Verify Line Count**:
   ```bash
   wc -l src/app/tuyen-sinh/page.js
   # Expected: 40 (< 250)
   ```

6. **Verify Build & Lint**:
   ```bash
   npx eslint src/app/tuyen-sinh/page.js src/components/tuyen-sinh/
   npm run build
   # Expected exit code: 0
   ```
