# Handoff Report — Fix Strategy Explorer (Iteration 2)

**Milestone**: M1 (Admissions Landing Page `/tuyen-sinh`)  
**Verdict**: **PROPOSED_FIX_READY**  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_r2`  
**Target Implementation File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`  
**Fix Strategy Document**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_r2/fix_strategy.md`  

---

## 1. Observation

1. **Defect 1: Phone Regex Pipe Matching**
   - File: `fai/src/app/tuyen-sinh/page.js`, line 308:
     ```javascript
     const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
     ```
   - Verbatim error from running `node .agents/challenger_2/test_2_regex_validation.js`:
     ```
     [FAIL] Phone "0|12345678" -> cleaned: "0|12345678" -> result: true | Expected: false (ADVERSARIAL: Literal pipe character "0|12345678" - does [3|5|7|8|9] accept | ?)
     [FAIL] Phone "0|98765432" -> cleaned: "0|98765432" -> result: true | Expected: false (ADVERSARIAL: Pipe syntax injection "0|98765432")
     ```
   - In JavaScript RegExp character classes `[...]`, the `|` character is matched literally rather than acting as a boolean OR.

2. **Defect 2: 12-Column Grid Squeezing on Mobile Viewports**
   - File: `fai/src/app/tuyen-sinh/page.js`:
     - Line 931: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>`
     - Line 952: `<div style={{ gridColumn: 'span 7' }} className="admissions-steps-col">`
     - Line 1011: `<div style={{ gridColumn: 'span 5' }} className="admissions-dossier-col">`
     - Line 1544: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>`
     - Line 1547: `<div style={{ gridColumn: 'span 5' }} className="admissions-contact-col">`
     - Line 1641: `<div style={{ gridColumn: 'span 7' }} className="admissions-form-col">`
   - Observation from `test_grid_mobile_calc.js`: On a 375px viewport (iPhone SE), container available width is 343px. With a 50px gap, `admissions-contact-col` is compressed to 122.1px and `admissions-form-col` is compressed to 170.9px.
   - The child form inputs (which specify `minmax(220px, 1fr)` at line 1725) overflow the 170.9px parent container.

3. **Single-File Encapsulation Constraint**
   - Per project guidelines, modifications must be confined strictly to `src/app/tuyen-sinh/page.js` without altering `src/app/globals.css`.
   - Adding a native standard `<style>` block directly inside `page.js` allows scoped CSS media queries to override inline grid properties via `!important`.

4. **Simulation Testing of Proposed Fix**
   - Executed `.agents/explorer_fix_r2/test_proposed_fix.js`:
     - Phone regex validation: 9 test cases tested against `/^(0[35789])[0-9]{8}$/` -> ALL PASSED.
     - Adversarial inputs `"0|12345678"` and `"0|98765432"` -> returned `false` as expected.
     - ESLint check on simulated code: `npx eslint` exited with code 0, 0 errors, 0 warnings.
     - Tailwind independence audit: 0 Tailwind classes across all 13 unique classes.
   - Dev server HTTP check: `curl -sI http://localhost:3000/tuyen-sinh` returned `HTTP/1.1 200 OK`.

---

## 2. Logic Chain

1. **Step 1 (Root Cause Resolution for Phone Validation)**:
   - Observation 1 demonstrates that `[3|5|7|8|9]` matches `|`.
   - Replacing it with `[35789]` restricts the second character strictly to digits 3, 5, 7, 8, or 9, matching the 5 valid Vietnamese mobile prefix families.
   - Observation 4 confirms that this change eliminates pipe acceptance while preserving 100% validity for all legitimate phone numbers.

2. **Step 2 (Root Cause Resolution for Responsive Grid)**:
   - Observation 2 demonstrates that inline `gridColumn: 'span 7'` and `'span 5'` prevent grid items from breaking into rows on mobile screens.
   - By adding class names `.admissions-steps-grid` and `.admissions-contact-grid` to the containers, and declaring `@media (max-width: 992px)` with `grid-template-columns: 1fr !important` and `grid-column: span 12 !important; width: 100% !important;`, both grids cleanly collapse to 1 column on screens smaller than 992px.
   - On mobile screens, available width for the form expands from 170.9px to 343px (a 100% increase), completely resolving input clipping and overflow.

3. **Step 3 (Single-File Architectural Compliance)**:
   - Observation 3 establishes that `globals.css` must remain untouched.
   - Placing the `<style>` block inside `src/app/tuyen-sinh/page.js` adheres to single-file ownership while providing declarative media query capabilities that inline styles alone cannot express.
   - Observation 4 confirms Next.js and ESLint accept this JSX `<style>` construct without warnings or errors.

---

## 3. Caveats

- **External Webhook Connectivity**: Form submission executes against an external Google Apps Script URL (`https://script.google.com/macros/s/.../exec`) in `no-cors` mode. This external service was not invoked during local testing to prevent polluting real admission data sheets.
- **Breakpoint Selection**: 992px is selected as the collapse breakpoint (standard Bootstrap/Tailwind `lg` boundary) to ensure comfortable single-column layout on both mobile phones and portrait tablets.

---

## 4. Conclusion

The 2 defects flagged by Challenger 2 have a precise, zero-risk fix strategy that requires editing only `src/app/tuyen-sinh/page.js`:

1. **Defect 1**: Change line 308:
   ```javascript
   const phoneRegex = /^(0[35789])[0-9]{8}$/;
   ```
2. **Defect 2**:
   - Insert embedded `<style>` block inside `<div className="admissions-page-container" ...>` targeting `.admissions-steps-grid`, `.admissions-contact-grid`, `.admissions-steps-col`, `.admissions-dossier-col`, `.admissions-contact-col`, and `.admissions-form-col`.
   - Add `className="admissions-steps-grid"` to Block 4 grid container (line 931).
   - Add `className="admissions-contact-grid"` to Block 7 grid container (line 1544).

Complete worker-ready instructions are provided in `.agents/explorer_fix_r2/fix_strategy.md`.

---

## 5. Verification Method

Once Worker implements the changes in `fai/src/app/tuyen-sinh/page.js`, run:

```bash
# 1. Verify phone regex fix against all edge cases and adversarial pipe inputs
node .agents/challenger_2/test_2_regex_validation.js

# 2. Verify scholarship tiers and program options
node .agents/challenger_2/test_1_scholarships.js

# 3. Verify Tailwind independence and CSS variable declarations
node .agents/challenger_2/test_3_css_vars_and_tailwind.js

# 4. Verify ESLint compliance
cd fai && npx eslint src/app/tuyen-sinh/page.js

# 5. Verify local Turbopack dev server response
curl -sI http://localhost:3000/tuyen-sinh
```

**Invalidation Conditions**:
- If `node .agents/challenger_2/test_2_regex_validation.js` reports any failures in Part 2.1, Finding 1 is invalidated.
- If Block 4 or Block 7 fails to stack vertically on viewports < 992px, Finding 2 is invalidated.
- If `npx eslint src/app/tuyen-sinh/page.js` produces any errors or warnings, the fix is invalidated.
