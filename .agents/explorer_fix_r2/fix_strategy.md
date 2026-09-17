# Fix Strategy — Iteration 2: FAI 2026 Admissions Page

**Target Implementation File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`  
**Boundary Constraint**: Single-file modification. Do NOT modify `src/app/globals.css`. Do NOT run `git commit` or `git push`.  
**Challenger 2 Verdict Addressed**: `REQUEST_CHANGES` (Defect 1: Phone regex pipe leak; Defect 2: 12-column mobile grid collapse).

---

## 1. Problem Analysis & Evidence

### Defect 1: Phone Regex Permitting Pipe Character `|`
- **Location**: `src/app/tuyen-sinh/page.js`, line 308:
  ```javascript
  const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
  ```
- **Root Cause**: Inside a regular expression character class `[...]`, the vertical bar `|` is treated as a literal character, not as a disjunction operator. Consequently, strings starting with `'0|'` followed by 8 digits (such as `'0|12345678'` and `'0|98765432'`) evaluate to `true`.
- **Challenger Verification**: Confirmed by `test_2_regex_validation.js` reporting 2 adversarial failures.

### Defect 2: 12-Column Grid Squeezing on Mobile Viewports (< 992px)
- **Location**:
  - Block 4 (lines 931-1011): 12-column container with children `.admissions-steps-col` (`gridColumn: 'span 7'`) and `.admissions-dossier-col` (`gridColumn: 'span 5'`).
  - Block 7 (lines 1544-1641): 12-column container with children `.admissions-contact-col` (`gridColumn: 'span 5'`) and `.admissions-form-col` (`gridColumn: 'span 7'`).
- **Root Cause**: Inline styles `gridColumn: 'span 7'` and `'span 5'` within `gridTemplateColumns: 'repeat(12, 1fr)'` lock elements side-by-side on all viewports. Without responsive overrides, on a 375px mobile screen (iPhone SE), available width (343px minus gap) is split into 122.1px (contact) and 170.9px (form). The inner form grid (`minmax(220px, 1fr)`) blows out horizontally, causing layout collapse and clipping.
- **Single-File Constraint**: Per project architecture, `src/app/globals.css` must remain untouched to respect single-file component ownership. Responsive styling must be embedded directly within `page.js`.

---

## 2. Precise Implementation Instructions for Worker

The Worker must apply exactly two modifications to `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`:

### Change 1: Correct Phone Regex (Line 308)

Replace line 308:
```javascript
// BEFORE:
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;

// AFTER:
    const phoneRegex = /^(0[35789])[0-9]{8}$/;
```

**Rationale**: `[35789]` defines the exact set of standard Vietnamese mobile network prefixes (03x, 05x, 07x, 08x, 09x) followed by 8 digits (10 digits total), strictly eliminating pipe matching while maintaining full validity for all real VN phone numbers.

---

### Change 2: Embed Responsive `<style>` & Apply Container Class Names

#### Sub-step 2A: Add `<style>` block in returned JSX (Lines 384-388)
Directly inside `<div className="admissions-page-container" ...>`:

```jsx
// BEFORE:
  return (
    <div className="admissions-page-container" style={{ backgroundColor: '#ffffff', color: '#1a2332', fontFamily: 'var(--font-sans)' }}>
      <main className="sub-page-main" style={{ padding: 0 }}>

// AFTER:
  return (
    <div className="admissions-page-container" style={{ backgroundColor: '#ffffff', color: '#1a2332', fontFamily: 'var(--font-sans)' }}>
      <style>{`
        @media (max-width: 992px) {
          .admissions-steps-grid,
          .admissions-contact-grid {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .admissions-steps-col,
          .admissions-dossier-col,
          .admissions-contact-col,
          .admissions-form-col {
            grid-column: span 12 !important;
            width: 100% !important;
          }
        }
      `}</style>
      <main className="sub-page-main" style={{ padding: 0 }}>
```

#### Sub-step 2B: Add `className="admissions-steps-grid"` to Block 4 Container (Line ~931)
```jsx
// BEFORE:
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>

// AFTER:
          <div className="container">
            <div className="admissions-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>
```

#### Sub-step 2C: Add `className="admissions-contact-grid"` to Block 7 Container (Line ~1544)
```jsx
// BEFORE:
          <div className="container">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>

// AFTER:
          <div className="container">
            <div className="admissions-contact-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>
```

---

## 3. Verification Protocol for Worker

After applying the changes, the Worker must execute these verification checks in order:

### Check 1: Verify Phone Regex
```bash
node .agents/challenger_2/test_2_regex_validation.js
```
- **Success Criteria**: Part 2.1 displays `[PASS]` for all 19 test cases. Zero failures reported under `[CRITICAL/HIGH FINDING]`.

### Check 2: Verify Scholarship & Brand Data Integrity
```bash
node .agents/challenger_2/test_1_scholarships.js
```
- **Success Criteria**: `=== TEST 1 RESULT: ALL PASSED ===` (Exit code 0).

### Check 3: Verify Tailwind Independence & CSS Variables
```bash
node .agents/challenger_2/test_3_css_vars_and_tailwind.js
```
- **Success Criteria**: `PASS: Zero Tailwind utility classes detected in page.js.` and all CSS variables defined (Exit code 0).

### Check 4: ESLint Clean Run
```bash
cd fai && npx eslint src/app/tuyen-sinh/page.js
```
- **Success Criteria**: Exit code 0, 0 errors, 0 warnings.

### Check 5: Turbopack Dev Server Liveness
```bash
curl -sI http://localhost:3000/tuyen-sinh
```
- **Success Criteria**: `HTTP/1.1 200 OK`.

---

## 4. Why This Fix Is Guaranteed to Pass Challenger 2

1. **Exact Match with Challenger 2 Expectations**:
   - Challenger 2 handoff report explicitly recommended:
     - Phone regex: `const phoneRegex = /^(0[35789])[0-9]{8}$/;`
     - CSS media query: `.admissions-steps-col`, `.admissions-dossier-col`, `.admissions-contact-col`, `.admissions-form-col { grid-column: span 12 !important; }`
2. **Single-File Isolation**:
   - Does not touch `src/app/globals.css` or any other shared system files.
   - Preserves Next.js Client Component encapsulation.
3. **Robust Mobile UX**:
   - Collapses 12-column layouts into clean single-column tracks on screens < 992px.
   - Expands form width on mobile from cramped ~170.9px to full container width (~343px on iPhone SE), preventing layout overflow.
