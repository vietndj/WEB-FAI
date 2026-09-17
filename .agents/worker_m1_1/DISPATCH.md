## 2026-09-03T08:00:08Z

You are the Implementation Worker for the FAI 2026 Admissions Page project.
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_1
Project root: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Original request path: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
Project plan path: /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md

MANDATORY FIRST STEPS:
1. You MUST read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md before starting work.
2. Read the survey findings:
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/spec_report.md
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_code_survey_1/code_report.md
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_env_survey_1/env_report.md

WRITE OWNERSHIP:
You have exclusive write ownership of:
`/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`
Do NOT edit any other project source files.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

STRICT CONSTRAINTS:
- STRICT LOCAL DEVELOPMENT: As specified in /Users/vietmac/Documents/CODE/WEB- FAI/GEMINI.md, absolutely NO git commit, NO git push, and NO deployment to Vercel/Production. Test and verify strictly against the local server (http://localhost:3000/tuyen-sinh).
- NO Tailwind CSS: Pure CSS variables and inline styles with standard flex/grid layout matching existing design system (e.g. var(--primary), var(--secondary), var(--bg-cream)).

IMPLEMENTATION REQUIREMENTS:
1. Hero Section: Title "QUY CHẾ TUYỂN SINH 2026", modern subtitle, trust badges, quick navigation pills linking to `#thong-tin`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`.
2. Target Audience (`#thong-tin` / `#doi-tuong`): Open opportunity for all passionate learners, strongly emphasizing "Người đi làm chuyển ngành" (muốn thay đổi công việc hiện tại, tìm kiếm nghề truyền cảm hứng và thu nhập lý tưởng).
3. Direct Admissions (`#phuong-thuc`): 2 direct admission methods (Đăng ký Online & Đăng ký Trực tiếp) with prominent text "Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển". Completely eliminate all legacy test modules ("Môn 1: Tiếng Anh", "Môn 2: Sáng Tạo / Logic").
4. 4-Step Flow & Dossier (`#ho-so`): Step 2 updated to direct admission consultation. Exact 3-item simplified dossier: 01 Phiếu đăng ký nhập học, 01 Bản sao công chứng CCCD, 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết".
5. Scholarships & Incentives 2026 (`#hoc-bong`): Interactive 4-brand tab/card display:
   - FPT Aptech: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 2 triệu.
   - FPT Arena Multimedia: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu.
   - FPT Skillking: Học bổng tài năng 14 triệu, Khuyến khích nhập học 10 triệu, Ưu đãi chuyển ngành 6 triệu, Học bổng "Tân binh sáng tạo" 1.5 - 2 triệu.
   - FPT Jetking: Học bổng tài năng Chip Design 8 triệu, Học bổng tài năng AI Agent 8 triệu.
6. Tuition Banking Policy 2026 (`#hoc-phi`): 2 dedicated banking cards for Hanoi and Danang:
   - Hà Nội: STK `00006969813` - Trường Đại học FPT - Ngân hàng Tiên Phong (TPBank) chi nhánh Hà Nội - Cú pháp: `FAIHN_hotensinhvien_HP HK 1`.
   - Đà Nẵng: STK `03557714109` - Phân hiệu trường Đại học FPT tại TP Đà Nẵng - Ngân hàng Tiên Phong (TPBank) chi nhánh Đà Nẵng - Cú pháp: `FAIDN_hotensinhvien_HP HK 1`.
   - Include 1-click copy buttons for STK and transfer syntax with visual copy feedback. Notice for choosing correct campus.
7. Omit FAQ: Do NOT render any FAQ section on this page.
8. Online Registration Form & Direct Contact (`#dang-ky`):
   - Hotlines: Hà Nội `024 7300 8855` • Đà Nẵng `0236 730 8826`, Email: `fai@fpt.edu.vn`.
   - Form fields: Full Name, Phone Number (with regex validation), Email, Campus selection (Hà Nội or Đà Nẵng).
   - Program dropdown with all 11 exact programs cleanly grouped by the 4 brands:
     * Lập trình Fullstack 2 năm - FPT Aptech
     * Lập trình Back end 1 năm - FPT Aptech
     * Lập trình Front end 6 tháng - FPT Aptech
     * Bộ khóa học Lập trình ngắn hạn (100 - 200 giờ) - FPT Aptech
     * Arena Multimedia Specialist Program (2 năm) - FPT Arena Multimedia
     * Thiết kế 2D, 3D, Game và App (6–18 tháng) - FPT Arena Multimedia
     * Bộ khóa học Multimedia ngắn hạn (100 giờ) - FPT Arena Multimedia
     * Fullstack Digital Marketing With AI (18 tháng) - FPT Skillking
     * Bộ khóa học Digital Marketing ngắn hạn (100 giờ) - FPT Skillking
     * Thiết kế vi mạch bán dẫn quốc tế tích hợp AI (2 năm) - FPT Jetking
     * Lập trình AI Agent (6 tháng - 2 năm) - FPT Jetking
   - Mandatory Consent Checkbox: "Đồng ý để dữ liệu cá nhân của Anh/Chị được thu thập trên trang này, được xử lý và lưu trữ bởi Tổ chức giáo dục FPT cho mục đích và theo điều kiện đã được công bố tại Quy định bảo vệ dữ liệu cá nhân của Tổ chức giáo dục FPT tại đây" (link `https://fpt.edu.vn/thu-vien-anh/11140` with target="_blank" rel="noopener noreferrer").
   - Interactive submission with loading spinner and success confirmation modal/card.
9. Verification:
   - Run `npx eslint src/app/tuyen-sinh/page.js` to ensure 0 lint errors.
   - Run `curl -s -I http://localhost:3000/tuyen-sinh` to ensure HTTP 200 OK.
   - Check local rendered content via curl or text extraction.
10. Write your handoff report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_1/handoff.md` and send a completion message to parent.
