# Handoff Report — Challenger 2

**Milestone**: M1 (Admissions Landing Page `/tuyen-sinh`)  
**Verdict**: **REQUEST_CHANGES**  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_2`  
**Target File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`  

---

## 1. Observation

1. **Scholarship Brands & Program Data Integrity**:
   - `page.js` defines `TRAINING_PROGRAMS_2026` (lines 28-60) containing exactly 11 programs categorized across 4 brands (`FPT Aptech`, `FPT Arena Multimedia`, `FPT Skillking`, `FPT Jetking`).
   - `SCHOLARSHIP_BRANDS` (lines 63-202) defines 4 brands with exact scholarship tiers:
     - `aptech`: 14 Triệu, 10 Triệu, 6 Triệu, 2 Triệu.
     - `arena`: 14 Triệu, 10 Triệu, 6 Triệu, 1.5 - 2 Triệu.
     - `skillking`: 14 Triệu, 10 Triệu, 6 Triệu, 1.5 - 2 Triệu.
     - `jetking`: 8 Triệu (Chip Design), 8 Triệu (AI Agent).
   - `TUITION_ACCOUNTS` (lines 205-230) defines Hà Nội (STK `00006969813`, TPBank, syntax `FAIHN_hotensinhvien_HP HK 1`) and Đà Nẵng (STK `03557714109`, TPBank, syntax `FAIDN_hotensinhvien_HP HK 1`).
   - Verified via `node test_1_scholarships.js`: Output `ALL PASSED`.

2. **Phone Regex Character Class Bug**:
   - In `src/app/tuyen-sinh/page.js`, line 308:
     ```javascript
     const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
     ```
   - Executed via `node test_2_regex_validation.js`:
     - Test input `"0|12345678"` -> `phoneRegex.test("0|12345678")` returned `true`.
     - Test input `"0|98765432"` -> `phoneRegex.test("0|98765432")` returned `true`.
   - Explanation: Within a regular expression character class `[...]`, `|` is matched literally, allowing pipe characters as part of valid phone numbers.

3. **Tailwind Independence & CSS Variables**:
   - All 5 CSS variables referenced in `page.js` (`--font-sans`, `--primary`, `--secondary`, `--text-muted`, `--bg-cream`) exist in `:root` of `src/app/globals.css` (lines 237-259).
   - Zero Tailwind utility classes were found among the 11 `className` strings in `page.js`.
   - Verified via `node test_3_css_vars_and_tailwind.js`: Output `PASS: Zero Tailwind utility classes detected`, `PASS: All CSS variables used in page.js are defined in globals.css :root!`.

4. **12-Column Grid Squeezing on Mobile**:
   - In `src/app/tuyen-sinh/page.js`:
     - Line 931: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>`
     - Line 952: `<div style={{ gridColumn: 'span 7' }} className="admissions-steps-col">`
     - Line 1011: `<div style={{ gridColumn: 'span 5' }} className="admissions-dossier-col">`
     - Line 1544: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>`
     - Line 1547: `<div style={{ gridColumn: 'span 5' }} className="admissions-contact-col">`
     - Line 1641: `<div style={{ gridColumn: 'span 7' }} className="admissions-form-col">`
   - `src/app/globals.css` has zero rules or media queries targeting `.admissions-steps-col`, `.admissions-dossier-col`, `.admissions-contact-col`, or `.admissions-form-col`.
   - Executed via `node test_grid_mobile_calc.js`:
     - On 375px mobile viewport (iPhone SE), container available width = 343px.
     - With 50px gap in Block 7, `admissions-contact-col` is 122.1px wide; `admissions-form-col` is 170.9px wide.
     - The inner phone/email grid in the form specifies `repeat(auto-fit, minmax(220px, 1fr))`, causing form inputs to overflow the 170.9px parent container.

5. **Targeted ESLint Check**:
   - Command: `npx eslint src/app/tuyen-sinh/page.js` in `/Users/vietmac/Documents/CODE/WEB- FAI/fai`.
   - Exited with return code 0, 0 errors, 0 warnings.

6. **Turbopack Dev Runtime**:
   - `curl -sI http://localhost:3000/tuyen-sinh` returned `HTTP/1.1 200 OK`.
   - Client bundle compiled without runtime or syntax errors.

---

## 2. Logic Chain

1. **Step 1 (Data & Rules Compliance)**:
   - Based on Observation 1 and 3, all core business rules specified in `ORIGINAL_REQUEST.md` (4 scholarship brands with exact amounts, 11 training programs, 2 TPBank campus accounts, no FAQ section, no Tailwind, all CSS variables present) are completely implemented and functional.

2. **Step 2 (Regex Correctness)**:
   - Based on Observation 2, `[3|5|7|8|9]` includes ASCII character `|`. Because front-end validation is the primary barrier for the user form before submission to the Google Sheet webhook, permitting invalid characters like `|` corrupts submitted lead data.

3. **Step 3 (Mobile Responsive Integrity)**:
   - Based on Observation 4, inline styles `gridColumn: 'span 7'` and `span 5'` within a 12-column grid force side-by-side positioning regardless of screen width. Because no media queries override these inline styles, on mobile screens (< 768px down to 375px) the layout cannot stack vertically. This squashes the form down to ~171px and causes horizontal container blowout.

4. **Step 4 (Quality Gate Assessment)**:
   - Acceptance Criteria R2 requires: "responsive tốt trên cả mobile và desktop".
   - Because the 12-column grid fails to stack on mobile, and the phone validation contains a character class syntax bug, the implementation fails critical quality thresholds.

---

## 3. Caveats

- Backend storage relies on an external Google Apps Script URL (`https://script.google.com/macros/s/.../exec`) executed in `no-cors` mode; actual backend spreadsheet reception depends on Google's external infrastructure and was not altered or stress-tested to avoid spamming the sheet.
- Local tests were conducted on macOS environment running Next.js 16.2.9 Turbopack dev server on port 3000.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

The implementation is very solid in terms of visual aesthetics, copy accuracy, brand tier mapping, and ESLint compliance. However, it cannot be approved for production release until the following two defects are resolved:

1. **Fix Mobile Grid Collapse**:
   - In `src/app/globals.css`, add:
     ```css
     @media (max-width: 992px) {
       .admissions-steps-col,
       .admissions-dossier-col,
       .admissions-contact-col,
       .admissions-form-col {
         grid-column: span 12 !important;
       }
     }
     ```
   - (Or refactor lines 931 and 1544 in `src/app/tuyen-sinh/page.js` to stack on mobile viewports).

2. **Fix Phone Regex**:
   - In `src/app/tuyen-sinh/page.js`, change line 308 from:
     ```javascript
     const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
     ```
     to:
     ```javascript
     const phoneRegex = /^(0[35789])[0-9]{8}$/;
     ```

---

## 5. Verification Method

To independently verify these findings, run the following test scripts from `.agents/challenger_2`:

```bash
# 1. Verify scholarship data and program options
node .agents/challenger_2/test_1_scholarships.js

# 2. Verify regex validation defect (demonstrates pipe '|' acceptance)
node .agents/challenger_2/test_2_regex_validation.js

# 3. Verify Tailwind independence and CSS variable definitions
node .agents/challenger_2/test_3_css_vars_and_tailwind.js

# 4. Verify mobile grid calculation defect
node .agents/challenger_2/test_grid_mobile_calc.js

# 5. Verify targeted ESLint clean pass
cd fai && npx eslint src/app/tuyen-sinh/page.js
```

Invalidation conditions:
- If `node test_2_regex_validation.js` passes without reporting pipe character acceptance after modifying `phoneRegex`, Finding 2 is resolved.
- If media queries are added ensuring `.admissions-steps-col` and `.admissions-form-col` take `grid-column: span 12` on mobile (< 992px), Finding 1 is resolved.
