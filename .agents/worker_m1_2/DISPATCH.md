## 2026-09-03T09:14:25Z
You are worker_m1_2, the remediation worker subagent for Milestone 1 (Iteration 2).
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_2
Project source code directory: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY FIRST STEP:
You MUST read:
1. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T08:50:15Z)
2. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_2/PROJECT.md
3. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2/handoff.md
4. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2/analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

STRICT CONSTRAINTS:
1. Strict Local Development Only: TẠM THỜI KHÔNG tự động chạy git commit / git push, KHÔNG deploy lên Vercel Production.
2. DO NOT TOUCH: src/app/globals.css, public/fonts/*, src/app/lien-he/page.js, src/components/ScholarshipFormSection.jsx, Arena100hFormSection.jsx, Skillking100hFormSection.jsx.

YOUR TASK:
Apply the 4 code-level remediation blueprints from /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2/analysis.md:

1. Update /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/lib/imageProcessor.js:
   - Micro/thin image watermark boundary safety: Skip watermark if actualW < 160 || actualH < 60. When applying watermark, strictly bound watermark dimensions to maxAllowedW and maxAllowedH so it never exceeds canvas or crashes Sharp.
   - High-entropy image size ceiling guarantee: Two-stage compression pipeline. First reduce quality down to 35. If size is still > 350KB (358,400 bytes), iteratively downscale image dimensions by 0.85x and re-encode until WebP buffer is strictly <= 350KB.

2. Update /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/lib/cloudStorage.js:
   - Remove ALL plain-text fallback credentials. Read strictly from process.env.
   - Implement lazy S3Client initialization (getR2Client) with explicit Error if credentials missing.
   - Scope deleteFromStorage to keys starting with 'fai/posts/' to prevent arbitrary key deletion.

3. Update /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/api/upload/route.js:
   - Wrap request.formData() in try/catch to return HTTP 400 Bad Request on empty body or invalid multipart boundary.
   - Add max file size check (25MB) before file.arrayBuffer().
   - Validate file.type is image/*; return HTTP 400 otherwise.
   - Catch Sharp unsupported image format errors specifically and return HTTP 400 with message "Tệp tải lên không phải là định dạng hình ảnh hợp lệ."

4. Verification:
   - Test micro image (100x100) -> HTTP 200 OK.
   - Test high-entropy noise (1600x1200) -> HTTP 200 OK, size <= 350KB.
   - Test negative cases (text/plain, empty POST) -> HTTP 400 Bad Request.
   - Run npx eslint on modified files (0 errors).
   - Run npx next build (compiles cleanly).

Write /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_2/handoff.md with full Observation, Logic Chain, and Verification evidence, then send a message to parent.
