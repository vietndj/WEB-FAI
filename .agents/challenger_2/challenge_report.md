# Challenge Report — FAI 2026 Admissions Page

**Target File**: `fai/src/app/tuyen-sinh/page.js`  
**Challenger**: Challenger 2 (Teamwork Preview Challenger — Empirical Challenger)  
**Date**: 2026-09-03  
**Status**: Completed  

---

## Challenge Summary

**Overall risk assessment**: **HIGH**  
While the data constants (4 scholarship brands & tiers, 11 training programs, tuition accounts), zero-Tailwind compliance, and CSS variable integration pass 100%, empirical adversarial testing revealed **two concrete defects**:
1. **Critical Responsive Layout Defect**: In Block 4 (Quy trình & Hồ sơ) and Block 7 (Liên hệ & Form đăng ký), the 12-column grid uses inline `style={{ gridColumn: 'span 7' }}` and `span 5` without mobile media query overrides. On mobile viewports (iPhone SE 375px up to Android 412px), columns are forced side-by-side, crushing the registration form down to ~171px and causing horizontal overflow.
2. **High Severity Regex Character Class Defect**: In `validateForm()`, the phone regex `/^(0[3|5|7|8|9])[0-9]{8}$/` treats the pipe symbol `|` as a literal character rather than an OR alternation inside `[...]`. As a result, adversarial phone numbers such as `0|12345678` are validated as legitimate phone numbers.

---

## Challenges

### [Critical] Challenge 1: 12-Column Grid Squeezes Layout & Breaks Usability on Mobile (< 768px)

- **Assumption challenged**: That using inline `style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)' }}` with inline child `gridColumn: 'span 7'` / `gridColumn: 'span 5'` provides a responsive layout across mobile and desktop.
- **Empirical Observation & Calculation**:
  - In Block 4 (`#ho-so`, lines 931-1011):
    - Container: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', alignItems: 'start' }}>`
    - Step column: `<div style={{ gridColumn: 'span 7' }} className="admissions-steps-col">`
    - Dossier column: `<div style={{ gridColumn: 'span 5' }} className="admissions-dossier-col">`
  - In Block 7 (`#dang-ky`, lines 1544-1641):
    - Container: `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '50px', alignItems: 'start' }}>`
    - Contact column: `<div style={{ gridColumn: 'span 5' }} className="admissions-contact-col">`
    - Form column: `<div style={{ gridColumn: 'span 7' }} className="admissions-form-col">`
  - Neither `admissions-steps-col`, `admissions-dossier-col`, `admissions-contact-col`, nor `admissions-form-col` have any responsive media queries in `globals.css` (verified via `test_3_css_vars_and_tailwind.js` and `test_4_responsive_layout.js`).
  - Even if standard media queries were added, inline `style="grid-column: span X"` has maximum CSS specificity and overrides classes without `!important`.
  - On iPhone SE (375px viewport with ~343px available container width and 50px gap in Block 7):
    - Contact column receives `(343 - 50) * 5 / 12 = 122.1px` width.
    - Registration form receives `(343 - 50) * 7 / 12 = 170.9px` width.
    - Inside the form, the phone/email grid uses `minmax(220px, 1fr)`. Because 220px > 170.9px, the form blows out and causes horizontal scrolling/overflow on mobile devices.
- **Blast radius**: Completely broken user experience for all mobile visitors (approx. 70-80% of traffic on education marketing landing pages). Form inputs and text become illegible and truncated.
- **Mitigation**:
  - In `globals.css`, add media queries:
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
  - Or better: In `page.js`, replace the 12-column inline grid for these two blocks with a flexbox/grid layout that collapses naturally or uses CSS classes with proper breakpoints.

---

### [High] Challenge 2: Phone Validation Regex Permitting Literal Pipe Characters

- **Assumption challenged**: That `phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;` correctly restricts Vietnamese phone prefixes to `03`, `05`, `07`, `08`, `09`.
- **Empirical Observation**:
  - In JavaScript RegExp, square brackets `[...]` denote a character set (class), NOT alternation groups. Inside a character class, `|` is matched literally as ASCII code 124 (`|`).
  - Therefore, `[3|5|7|8|9]` matches any character in the set `{'3', '|', '5', '7', '8', '9'}`.
  - Executed in `test_2_regex_validation.js`:
    - Input `"0|12345678"` -> Result: `true` (ACCEPTED).
    - Input `"0|98765432"` -> Result: `true` (ACCEPTED).
- **Blast radius**: Malformed phone numbers containing pipe characters pass front-end validation and get submitted to Google Sheets / CRM, causing data corruption or failed outreach.
- **Mitigation**:
  - Change `phoneRegex` to:
    ```javascript
    const phoneRegex = /^(0[35789])[0-9]{8}$/;
    ```
    or
    ```javascript
    const phoneRegex = /^0(3|5|7|8|9)[0-9]{8}$/;
    ```
  - Additionally, consider sanitizing leading `+84` (e.g. `phone.replace(/^\+84/, '0').replace(/\s+/g, '')`) so users entering standard international format `+84...` are not rejected.

---

### [Medium] Challenge 3: Email Regex Permissiveness with Consecutive Dots

- **Assumption challenged**: That `emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;` adequately rejects invalid domain structures.
- **Empirical Observation**:
  - Executed in `test_2_regex_validation.js`:
    - Input `"user@domain..com"` -> Result: `true` (ACCEPTED).
  - The pattern only checks for at least one `@` and at least one `.`, allowing consecutive dots in the domain name.
- **Blast radius**: Low-to-medium. Some mistyped email addresses (double-click dot) will pass front-end validation.
- **Mitigation**:
  - Use a more robust standard email regex:
    ```javascript
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    ```

---

## Stress Test Results

| Test Scenario | Target | Expected Behavior | Actual Behavior | Result |
|---|---|---|---|:---:|
| 1.1 Training Programs Audit | 11 Programs across 4 brands | Exact 11 programs present | 11 exact programs verified | **PASS** |
| 1.2 Scholarship Brands Audit | 4 Brands in SCHOLARSHIP_BRANDS | aptech, arena, skillking, jetking | 4 brands present | **PASS** |
| 1.3 Aptech Scholarship Tiers | 14M, 10M, 6M, 2M | Match exactly | 14M, 10M, 6M, 2M matched | **PASS** |
| 1.4 Arena Scholarship Tiers | 14M, 10M, 6M, 1.5-2M | Match exactly | 14M, 10M, 6M, 1.5-2M matched | **PASS** |
| 1.5 Skillking Scholarship Tiers | 14M, 10M, 6M, 1.5-2M | Match exactly | 14M, 10M, 6M, 1.5-2M matched | **PASS** |
| 1.6 Jetking Scholarship Tiers | Chip Design 8M, AI Agent 8M | Match exactly | 8M, 8M matched | **PASS** |
| 1.7 Tuition Accounts Verification | HN & DN TPBank Accounts | HN: 00006969813, DN: 03557714109 | Exact match with copy syntax | **PASS** |
| 2.1 Standard VN Phone Validation | `0912345678`, `038...`, `077...` | Validated as `true` | Validated as `true` | **PASS** |
| 2.2 Pipe Injection in Phone | `"0|12345678"`, `"0|98765432"` | Validated as `false` | Validated as `true` (Accepted!) | **FAIL** |
| 2.3 International Prefix Handling | `"+84912345678"` | Gracefully handled or converted | Rejected as invalid | **WARN** |
| 2.4 Email Validation Standard | `test@fpt.edu.vn`, `user+tag@gmail.com` | Validated as `true` | Validated as `true` | **PASS** |
| 2.5 Email Double Dot | `"user@domain..com"` | Validated as `false` | Validated as `true` (Accepted) | **FAIL** |
| 3.1 CSS Variables Verification | `--font-sans`, `--primary`, etc. | All defined in `globals.css` :root | 5/5 variables verified | **PASS** |
| 3.2 Tailwind CSS Audit | Zero utility classes in `className` | 0 Tailwind utility classes | 0 detected | **PASS** |
| 3.3 Custom Class Definitions | Check `admissions-*` in `globals.css` | Defined in stylesheet | Missing from `globals.css` | **FAIL** |
| 4.1 Fluid Typography Audit | `clamp(...)` usage on headings | Dynamic viewport scaling | 8 clamp() calls active | **PASS** |
| 4.2 CSS Grid auto-fit Audit | `repeat(auto-fit, minmax(...))` | Multi-card responsive grids | 5 auto-fit grids active | **PASS** |
| 4.3 12-Col Grid Mobile Simulation | Block 4 & Block 7 on 375px mobile | Stack to 100% width | Stuck side-by-side (122px / 171px) | **FAIL** |
| 5.1 Targeted ESLint Check | `npx eslint src/app/tuyen-sinh/page.js` | 0 errors, 0 warnings | Clean exit (code 0) | **PASS** |
| 5.2 Next.js Turbopack Runtime | HTTP GET `/tuyen-sinh` | HTTP 200, clean compilation | HTTP 200, clean compilation | **PASS** |

---

## Unchallenged Areas

- **Backend Google Apps Script Integration**: The webhook endpoint `https://script.google.com/macros/s/.../exec` was not load-tested with high volume requests as this is an external third-party service outside local project scope.
- **Copy to Clipboard on Safari iOS Non-HTTPS**: Local development over HTTP relies on fallback `document.execCommand('copy')`, which is standard for HTTP environments.

---

## Conclusion & Verdict

**Verdict**: **REQUEST_CHANGES**  
The implementation has excellent content fidelity and clean ESLint compliance, but requires remediation of:
1. **Responsive layout failure in Block 4 and Block 7** on mobile viewports.
2. **Regex syntax bug in phone number validation** (`[3|5|7|8|9]` -> `[35789]`).
