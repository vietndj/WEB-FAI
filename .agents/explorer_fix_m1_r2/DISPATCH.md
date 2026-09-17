## 2026-09-03T09:10:36Z
You are explorer_fix_m1_r2, an exploration and remediation strategy subagent for Milestone 1 (Iteration 2).
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2
Project source code directory is: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY FIRST STEP:
You MUST read:
1. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T08:50:15Z)
2. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_2/PROJECT.md
3. Gate failure feedback from Iteration 1:
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/reviewer_m1_1/handoff.md
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/reviewer_m1_2/handoff.md
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m1_1/handoff.md
   - /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m1_2/handoff.md

YOUR MISSION:
Analyze the 4 defects reported by reviewers and challengers and design the exact code-level remediation strategy for worker_m1_2:
1. Fix micro/thin image watermark composite crash in src/lib/imageProcessor.js:
   - Current bug: wmWidth clamped to minimum 140px causes Sharp to throw "Image to composite must have same dimensions or smaller" when image width < 140px or height < 40px.
   - Strategy: If actualW < 160 or actualH < 60, scale watermark to fit inside image bounds with safe margins or skip watermark for tiny icons. Ensure watermark dimensions never exceed (actualW - 2*margin) and (actualH - 2*margin).
2. Fix high-entropy image size ceiling breach in src/lib/imageProcessor.js:
   - Current bug: When quality hits floor (40), WebP size on noisy 1600x1200 images can reach 854KB (> 350KB limit).
   - Strategy: If webpBuffer.length > targetMaxBytes after quality floor, iteratively downscale image dimensions (e.g. scale width/height by 0.85 each iteration) until the compressed WebP is strictly < 350KB.
3. Remove hardcoded fallback credentials in src/lib/cloudStorage.js:
   - Remove plain-text fallback strings for R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY.
   - Require them strictly from process.env; throw Error if missing.
4. Fix negative input handling in src/app/api/upload/route.js:
   - Wrap request.formData() in try/catch to return HTTP 400 Bad Request on parsing errors (empty body, bad boundary).
   - Check file.type before processing; return HTTP 400 if not an image.
   - Catch Sharp unsupported image format errors and return HTTP 400 with message "Tệp tải lên không phải là định dạng hình ảnh hợp lệ".
   - Check file.size <= 25MB before arrayBuffer().

Produce a comprehensive remediation plan in /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2/analysis.md and handoff.md, with exact code snippets ready for worker_m1_2.
When done, notify parent via send_message.
