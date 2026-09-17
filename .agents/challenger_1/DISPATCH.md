# Challenger 1 Task

Role: teamwork_preview_challenger
Working Directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_1
Target: Empirical adversarial verification of FAI 2026 Admissions Page

## 2026-09-03T08:04:38Z
You are Challenger 1 for the FAI 2026 Admissions Page project.
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_1
Target implementation file: /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js
Original request path: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
Project plan path: /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md

MANDATORY FIRST STEPS:
1. You MUST read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md.

YOUR TASK:
Empirically stress-test the admissions page running on http://localhost:3000/tuyen-sinh and analyze src/app/tuyen-sinh/page.js:
1. Write and execute test scripts in your working directory (or run node/curl commands) that test:
   - Live HTTP 200 response on http://localhost:3000/tuyen-sinh.
   - Comprehensive assertion of all 11 exact course names in the rendered HTML.
   - Exact bank account numbers (00006969813, 03557714109) and transfer syntax strings.
   - Proof that no old entrance exams exist in the rendered output ("Môn 1", "Môn 2", "Kiểm tra năng lực").
   - Proof that FAQ is not rendered.
   - Verification of contact hotlines and consent link.
2. Record all empirical test results in /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_1/challenge_report.md.
3. Issue a verdict: APPROVE (if all empirical tests pass) or REQUEST_CHANGES in your handoff report at /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_1/handoff.md.
4. Send a message to parent when complete.
