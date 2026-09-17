# Challenge Report — FAI 2026 Admissions Page (/tuyen-sinh)

**Reviewer**: Challenger 1 (Teamwork Empirical Challenger: Critic & Specialist)  
**Target File**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`  
**Live Endpoint**: `http://localhost:3000/tuyen-sinh`  
**Execution Timestamp**: 2026-09-03T15:07:33+07:00 (UTC 2026-09-03T08:07:33Z)  

---

## Challenge Summary

- **Overall Risk Assessment**: **LOW**
- **Empirical Test Suite**: 38 assertions executed against live Next.js SSR + Client bundle.
- **Pass Rate**: 38/38 (100.0%)
- **Static Analysis (ESLint)**: 0 errors, 0 warnings (`npx eslint src/app/tuyen-sinh/page.js` passed clean).
- **Styling Conformance**: Inline styles + CSS variables strictly applied; 0 Tailwind CSS violations.
- **Git State Protection**: 0 commits, 0 pushes, 0 external deployments (fully strictly adhering to GEMINI.md).

---

## Stress Test Results

| # | Test Category | Assertion Name | Verification Method & Payload | Actual Observed Output | Status |
|---|---------------|----------------|--------------------------------|------------------------|--------|
| 1 | Protocol | HTTP Status 200 | `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/tuyen-sinh` | HTTP 200 OK | **PASS** |
| 2 | Protocol | Server Latency | Node.js `fetch()` timing | 99ms (< 500ms threshold) | **PASS** |
| 3 | Protocol | Content-Type | Response header inspection | `text/html; charset=utf-8` | **PASS** |
| 4 | Courses | Program 1 | Check presence of `Lập trình Fullstack 2 năm - FPT Aptech` | Exact match in HTML & `<option>` | **PASS** |
| 5 | Courses | Program 2 | Check presence of `Lập trình Back end 1 năm - FPT Aptech` | Exact match in HTML & `<option>` | **PASS** |
| 6 | Courses | Program 3 | Check presence of `Lập trình Front end 6 tháng - FPT Aptech` | Exact match in HTML & `<option>` | **PASS** |
| 7 | Courses | Program 4 | Check presence of `Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech` | Exact match in HTML & `<option>` | **PASS** |
| 8 | Courses | Program 5 | Check presence of `Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia` | Exact match in HTML & `<option>` | **PASS** |
| 9 | Courses | Program 6 | Check presence of `Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia` | Exact match in HTML & `<option>` | **PASS** |
| 10 | Courses | Program 7 | Check presence of `Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia` | Exact match in HTML & `<option>` | **PASS** |
| 11 | Courses | Program 8 | Check presence of `Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking` | Exact match in HTML & `<option>` | **PASS** |
| 12 | Courses | Program 9 | Check presence of `Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking` | Exact match in HTML & `<option>` | **PASS** |
| 13 | Courses | Program 10 | Check presence of `Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking` | Exact match in HTML & `<option>` | **PASS** |
| 14 | Courses | Program 11 | Check presence of `Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking` | Exact match in HTML & `<option>` | **PASS** |
| 15 | Banking | STK Hà Nội | Assert STK `00006969813` | Exact match | **PASS** |
| 16 | Banking | Account Hà Nội | Assert `Trường Đại học FPT` | Exact match | **PASS** |
| 17 | Banking | Bank Name Hà Nội | Assert `Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội` | Exact match | **PASS** |
| 18 | Banking | Syntax Hà Nội | Assert `FAIHN_hotensinhvien_HP HK 1` | Exact match with copy button | **PASS** |
| 19 | Banking | STK Đà Nẵng | Assert STK `03557714109` | Exact match | **PASS** |
| 20 | Banking | Account Đà Nẵng | Assert `Phân hiệu trường Đại học FPT tại TP Đà Nẵng` | Exact match | **PASS** |
| 21 | Banking | Bank Name Đà Nẵng | Assert `Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng` | Exact match | **PASS** |
| 22 | Banking | Syntax Đà Nẵng | Assert `FAIDN_hotensinhvien_HP HK 1` | Exact match with copy button | **PASS** |
| 23 | Banking | Campus Warning Note | Check notice on selecting correct campus STK | Rendered in tuition card footer | **PASS** |
| 24 | Old Exams | Abolition of "Môn 1" | Regex `/môn\s*1/i` against rendered HTML | 0 occurrences found | **PASS** |
| 25 | Old Exams | Abolition of "Môn 2" | Regex `/môn\s*2/i` against rendered HTML | 0 occurrences found | **PASS** |
| 26 | Old Exams | Removal of exam requirement | Check "Kiểm tra năng lực" as an admission test | Only reference is explicit declaration: *"xóa bỏ toàn bộ bài kiểm tra năng lực đầu vào"* | **PASS** |
| 27 | Old Exams | Direct Admissions Message | Assert *"Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển"* | Displayed prominently in hero badge & online/direct cards | **PASS** |
| 28 | FAQ | No FAQ block in `<main>` | Assert absence of FAQ heading & accordion inside `<main>` | Zero FAQ sections/accordions rendered in page body. Hidden `<span id="faq" />` anchor provided exclusively for Megamenu link safety | **PASS** |
| 29 | Contact | Hotline Hà Nội | Assert `024 7300 8855` | Exact match | **PASS** |
| 30 | Contact | Hotline Đà Nẵng | Assert `0236 730 8826` | Exact match | **PASS** |
| 31 | Contact | Email | Assert `fai@fpt.edu.vn` | Exact match | **PASS** |
| 32 | Contact | Consent Link | Assert `https://fpt.edu.vn/thu-vien-anh/11140` | Exact match in checkbox label anchor | **PASS** |
| 33 | Contact | Consent Text | Assert mandatory privacy text from R1.5 | Exact match | **PASS** |
| 34 | Dossier | Dossier item 1 | Assert `01 Phiếu đăng ký nhập học` | Exact match in Block 4 | **PASS** |
| 35 | Dossier | Dossier item 2 | Assert `01 Bản sao công chứng CCCD` | Exact match in Block 4 | **PASS** |
| 36 | Dossier | Dossier item 3 | Assert `01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết"` | Exact match in Block 4 | **PASS** |
| 37 | Audience | Highlight switchers | Assert highlight *"Người đi làm chuyển ngành"* | Highlight card in Block 2 | **PASS** |
| 38 | Linter | ESLint Validation | `npx eslint src/app/tuyen-sinh/page.js` | Exited 0 with 0 errors / 0 warnings | **PASS** |

---

## Adversarial Stress Analysis & Edge Cases

### 1. Assumption Stress-Testing
- **Assumption 1: Header Megamenu link `/tuyen-sinh#faq` remains in `Header.jsx`.**
  - *Attack Scenario*: If an external user clicks "Câu hỏi thường gặp (FAQ)" in the global navbar, a 404 or broken jump might occur if `#faq` does not exist on the page.
  - *Mitigation verified*: Line 1529 of `page.js` contains `<span id="faq" style={{ position: 'relative', top: '-120px', visibility: 'hidden', display: 'block' }} />`. It smoothly absorbs the anchor jump without rendering any FAQ accordion or violating R1.4.

- **Assumption 2: Form validation edge cases (Whitespace, international numbers, malformed emails).**
  - *Attack Scenario*: Entering leading/trailing whitespaces or malformed phone numbers.
  - *Mitigation verified*: `page.js` applies `.trim()` and `.replace(/\s+/g, '')` before regex matching `/^(0[3|5|7|8|9])[0-9]{8}$/`. Unchecking consent fails client validation with explicit Vietnamese warning.

- **Assumption 3: React hydration mismatch with dynamic styles or SVG icons.**
  - *Attack Scenario*: Turbopack hydration failures caused by mismatched server/client rendering.
  - *Mitigation verified*: Dev server output checked; 0 Next.js error overlays, 0 hydration warnings.

- **Assumption 4: Scholarship tab data availability.**
  - *Attack Scenario*: Tabs render initial Aptech data on SSR, but clicking Arena/Skillking/Jetking could throw if data structure differed.
  - *Mitigation verified*: Client chunks `/static/chunks/src_1a7xj2f._.js` verified to contain complete `SCHOLARSHIP_BRANDS` data for all 4 brands (Jetking Chip Design 8M, AI Agent 8M, Arena 14M/10M/6M/1.5-2M, Skillking 14M/10M/6M/1.5-2M).

---

## Unchallenged Areas

- **Backend Google Apps Script execution**: The registration form dispatches `fetch(googleSheetUrl, { mode: 'no-cors' })`. We verified that the client component wraps this in `try...catch` and handles offline/network errors gracefully without blocking UI success state. Live spreadsheet row creation depends on Google Apps Script cloud availability.
