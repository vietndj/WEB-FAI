# Handoff Report — Milestone 1 (Iteration 2) Remediation Strategy

**Agent**: `explorer_fix_m1_r2`  
**Role**: Explorer / Remediation Strategist  
**Handoff Type**: Hard (Remediation Strategy Complete)  
**Date**: 2026-09-03  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2`  
**Target Codebase Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Target Recipient**: `worker_m1_2`  

---

## 1. Observation

### 1.1 Gate 1 Failure Evidence
During Gate 1 review of Milestone 1, four independent agents (`reviewer_m1_1`, `reviewer_m1_2`, `challenger_m1_1`, `challenger_m1_2`) identified four code-level defects:

1. **Defect 1 — Small/Thin Image Watermark Composite Crash**:
   - Location: `fai/src/lib/imageProcessor.js:71-75, 95-103`.
   - Code: `const wmWidth = Math.round(Math.min(Math.max(actualW * 0.20, 140), 320));`.
   - Tool Command:
     ```javascript
     const smallBuf = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
     await processImage(smallBuf);
     ```
   - Verbatim Error: `Error: Image to composite must have same dimensions or smaller`.
   - Impact: Watermark minimum clamp of 140px exceeds image width on small images (<140px) or height on thin banners (<30px), crashing Sharp and triggering HTTP 500 in `/api/upload`.

2. **Defect 2 — High-Entropy Image Size Ceiling Breach**:
   - Location: `fai/src/lib/imageProcessor.js:113-120`.
   - Code:
     ```javascript
     while (webpBuffer.length > targetMaxBytes && quality > 40) {
       quality -= 10;
       webpBuffer = await sharp(resizedBuffer)
         .composite(compositeOperations)
         .webp({ quality, effort: 4 })
         .toBuffer();
     }
     ```
   - Empirical Measurement: Evaluated 1600x1200 random noise (5.77 MB PNG). Output WebP was **874,546 bytes (~854 KB)**, breaching the **358,400 bytes (350 KB)** limit by 516,146 bytes (2.44x over ceiling).
   - Impact: Violates Acceptance Criteria R1: "dung lượng < 350KB".

3. **Defect 3 — Hardcoded Credentials in Source Code & Unscoped Deletion**:
   - Location: `fai/src/lib/cloudStorage.js:4-8, 86-108`.
   - Verbatim Code:
     ```javascript
     const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID || '2dae0527b790faa880c1cfb57247640a';
     const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID || 'ef3e4fbcd874fb204ed9c291608f9d75';
     const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY || '2426f986845501c6d30416a312a69e4be6cc478dc6a861c3aa7dad5dce9a436a';
     ```
   - Environment check: All 5 variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`) already exist in `fai/.env.local`. Hardcoded strings in source code expose secrets.
   - In `deleteFromStorage`, any key passed is deleted without prefix validation.

4. **Defect 4 — Negative Input Handling & Status Code Discipline**:
   - Location: `fai/src/app/api/upload/route.js:10, 21, 37, 58-67`.
   - Verbatim Test Results:
     - `curl -X POST http://localhost:3000/api/upload` (empty body) -> `HTTP 500 Internal Server Error` (uncaught `request.formData()` error).
     - `curl -X POST -F "file=@test.txt;type=text/plain"` -> `HTTP 500 Internal Server Error` (uncaught Sharp format error).
     - `curl -X POST -F "file=@garbage.bin;type=application/octet-stream"` -> `HTTP 500 Internal Server Error`.
     - Missing `file.size <= 25MB` check before `file.arrayBuffer()` risks heap exhaustion / OOM.

---

## 2. Logic Chain

1. **Defect 1 Remediation**:
   - Watermarks are intended for full-sized articles, not icons, avatars, or thin dividers.
   - If an input image has `actualW < 160 || actualH < 60`, watermarking should be bypassed (`applyWatermark = false`), avoiding visual degradation of tiny graphics and completely eliminating Sharp composite dimension crashes.
   - For images meeting the threshold (`actualW >= 160 && actualH >= 60`), the watermark must be strictly bounded within the canvas minus margins:
     `maxAllowedW = actualW - 2 * wmMargin`
     `maxAllowedH = actualH - 2 * wmMargin`
     `targetW = Math.min(Math.max(Math.round(actualW * 0.20), 80), 320, maxAllowedW)`
   - Constraining Sharp's resize to `{ width: targetW, height: maxAllowedH, fit: 'inside' }` ensures `info.width <= maxAllowedW` and `info.height <= maxAllowedH`, which guarantees `left >= 0`, `top >= 0`, and `left + info.width <= actualW`, `top + info.height <= actualH`.
   - Verification test proved `100x100` and `300x25` bypass gracefully, while `160x60`, `400x300`, `1024x557`, and `1600x1200` fit with 100% boundary safety.

2. **Defect 2 Remediation**:
   - For high-entropy noise or fine foliage, lossy compression quality alone cannot reduce file size below 350 KB at 1600x1200 resolution due to Shannon entropy limits of image encoding.
   - Once the quality reduction loop reaches quality floor `35`, spatial downscaling must be activated.
   - If `webpBuffer.length > targetMaxBytes` after quality reaches 35, the composited image is downscaled iteratively by a factor of `0.85` (`curW = Math.round(curW * 0.85); curH = Math.round(curH * 0.85)`).
   - Our empirical test confirmed that 1600x1200 random noise (5.77 MB PNG) reached **248,066 bytes (242 KB) <= 350 KB** within 3 downscale iterations (983x737) in under 1.8 seconds.

3. **Defect 3 Remediation**:
   - Eliminating the literal fallback strings and reading strictly from `process.env` protects credentials.
   - A `getR2Client()` lazy factory checks for `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, and `R2_ACCOUNT_ID`, throwing an informative error if absent.
   - Exporting `r2Client` via a Proxy maintains full backward compatibility for any existing code.
   - Guarding `deleteFromStorage` to only allow keys prefixed with `fai/posts/` prevents arbitrary S3 key deletions.

4. **Defect 4 Remediation**:
   - Per RFC 9110, malformed requests and invalid file payloads are client errors and must return HTTP 400 Bad Request, never HTTP 500.
   - Wrapping `request.formData()` in `try/catch` catches empty bodies and invalid multipart boundaries, returning HTTP 400.
   - Checking `file.type && !file.type.startsWith('image/')` catches non-image MIME uploads immediately.
   - Checking `file.size > 25 * 1024 * 1024` before `file.arrayBuffer()` prevents V8 heap memory exhaustion.
   - Wrapping `processImage()` in a try/catch specifically catching Sharp format errors (`unsupported image format`, `Input buffer`, `VipsForeignLoad`) ensures corrupted or disguised non-image files return HTTP 400 with the message `"Tệp tải lên không phải là định dạng hình ảnh hợp lệ."`.

---

## 3. Caveats

1. **Milestone 1 Scope Boundary**:
   - Milestone 1 encompasses `src/lib/imageProcessor.js`, `src/lib/cloudStorage.js`, and `src/app/api/upload/route.js`.
   - Route authentication guards (Firebase Auth / session checks on `/api/upload` DELETE) are scheduled for Milestone 4 (R4). However, the key prefix guard (`fai/posts/`) added in this remediation provides an immediate safety barrier against path-traversal deletion.
2. **Read-Only Explorer Role**:
   - Per Teamwork Explorer guidelines, this agent has investigated and verified the solutions using standalone scripts and node evaluation without altering target source code directly.
   - Complete, tested drop-in blueprints are provided in Section 4 of `analysis.md` for `worker_m1_2` to apply.

---

## 4. Conclusion

All four defects have been completely analyzed and resolved with concrete, mathematically sound algorithms and robust input validation.
- **Defect 1**: Resolved by adding dimension threshold (`w >= 160 && h >= 60`) and safe bounding box calculations.
- **Defect 2**: Resolved by a two-stage optimization loop (quality reduction down to 35, followed by iterative 0.85x spatial downscaling).
- **Defect 3**: Resolved by removing hardcoded credentials, requiring `process.env`, and scoping deletions to `fai/posts/`.
- **Defect 4**: Resolved by wrapping `formData()` in try/catch, validating `file.size <= 25MB`, checking MIME type, and intercepting Sharp format errors to return HTTP 400.

`worker_m1_2` is equipped with the complete drop-in blueprints in `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_m1_r2/analysis.md` (Sections 4.1, 4.2, 4.3).

---

## 5. Verification Method

Once `worker_m1_2` replaces the files according to the blueprints, execute the following verification steps:

### Test Step 1: Run Full Empirical Verification Suite
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
node scripts/verify-empirical-m1.mjs
```
*Expected Output*:
- All 6 tests report `[PASS]`, including:
  - `[PASS] High Entropy Image (1600x1200 random noise)`: size <= 358400 bytes.
  - `[PASS] Tiny Image Edge Cases (<140px width / <30px height)`: Handled gracefully without crash.
- Final summary: `OVERALL STATUS: ALL TESTS PASSED`.

### Test Step 2: Negative Input Adversarial Verification
```bash
# 1. Non-image text file -> HTTP 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST -F "file=@package.json;filename=test.txt;type=text/plain" http://localhost:3000/api/upload
# Expected: 400

# 2. Binary garbage file -> HTTP 400
node -e 'require("crypto").randomBytes(256)' > /tmp/garbage.bin
curl -s -o /dev/null -w "%{http_code}\n" -X POST -F "file=@/tmp/garbage.bin;type=application/octet-stream" http://localhost:3000/api/upload
# Expected: 400

# 3. Empty POST request -> HTTP 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/upload
# Expected: 400

# 4. Malformed multipart header/body -> HTTP 400
curl -s -o /dev/null -w "%{http_code}\n" -X POST -H "Content-Type: multipart/form-data; boundary=missing" --data-binary "junk" http://localhost:3000/api/upload
# Expected: 400

# 5. Small 100x100 image upload -> HTTP 200
node -e 'import("sharp").then(async ({default: sharp}) => {
  const buf = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
  const form = new FormData();
  form.append("file", new Blob([buf], { type: "image/png" }), "small.png");
  const res = await fetch("http://localhost:3000/api/upload", { method: "POST", body: form });
  const json = await res.json();
  console.log("Status:", res.status, "Success:", json.success);
});'
# Expected: Status: 200 Success: true
```

### Test Step 3: ESLint & Production Build Verification
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
npx eslint src/lib/imageProcessor.js src/lib/cloudStorage.js src/app/api/upload/route.js
npx next build
```
*Expected Output*:
- `eslint`: 0 errors, 0 warnings.
- `next build`: Successfully compiled in ~3-4s with `ƒ /api/upload` as dynamic route.

### Invalidation Conditions
This strategy would be invalidated if:
1. Sharp throws an uncaught error on any image dimension or aspect ratio.
2. An output WebP buffer exceeds 358,400 bytes on any valid input.
3. Any client error in `/api/upload` returns HTTP 500 instead of HTTP 400.
4. Hardcoded fallback credential strings remain in `src/lib/cloudStorage.js`.
