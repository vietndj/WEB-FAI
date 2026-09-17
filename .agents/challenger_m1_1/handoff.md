# Handoff Report — Milestone 1 Adversarial Verification

**Agent**: `challenger_m1_1`  
**Handoff Type**: Hard (Adversarial Audit Complete)  
**Date**: 2026-09-03  
**Verdict**: **REQUEST_CHANGES**  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m1_1`  
**Target Project Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  

---

## 1. Observation

1. **Large Image Test (>1600px width)**:
   - Evaluated 2400x1600 input image via `processImage` in `fai/scripts/verify-empirical-m1.mjs`.
   - Result: Resized down to 1600x1067, maintaining exact 1.5:1 aspect ratio.
   - Format: `webp`.
   - Output byte size: 17,730 bytes (17.3 KB), well under the 350KB ceiling.
   - Verbatim verification log:
     ```
     Input: 2400x1600, size: 279280 bytes
     Output: 1600x1067, format: webp, size: 17730 bytes
     - Max width <= 1600: PASS (1600)
     - Aspect ratio preserved: PASS
     - Format is WebP: PASS
     - Size < 350KB: PASS (17730 / 358400)
     ```

2. **Small Image Test (<500px width: 400x300)**:
   - Evaluated 400x300 input image via `processImage`.
   - Result: Preserved original dimensions 400x300 without enlargement.
   - Format: `webp`.
   - Output byte size: 2,438 bytes.
   - Verbatim verification log:
     ```
     Input: 400x300, size: 5471 bytes
     Output: 400x300, format: webp, size: 2438 bytes
     - Without enlargement: PASS (400x300)
     - Format is WebP: PASS
     - Size < 350KB: PASS (2438 / 358400)
     ```

3. **High Complexity / High Entropy Image Size Failure**:
   - Evaluated 1600x1200 random noise input (5,771,480 raw bytes).
   - In `fai/src/lib/imageProcessor.js` (lines 113–120):
     ```javascript
     // Adaptive compression loop to guarantee file size < 350KB
     while (webpBuffer.length > targetMaxBytes && quality > 40) {
       quality -= 10;
       webpBuffer = await sharp(resizedBuffer)
         .composite(compositeOperations)
         .webp({ quality, effort: 4 })
         .toBuffer();
     }
     ```
   - When `quality` steps down from 82 to 72, 62, 52, 42, 32, the loop condition `quality > 40` evaluates to `false` and terminates.
   - Output WebP size is **874,546 bytes (854.0 KB)** against the required ceiling of **358,400 bytes (350 KB)** (exceeds limit by 516,146 bytes, 2.44x over limit).
   - Live upload to `http://localhost:3000/api/upload` confirmed that this 854 KB file was accepted and uploaded directly to Cloudflare R2:
     ```json
     {
       "success": true,
       "url": "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/7bae82da3432-noise.webp",
       "sizeBytes": 874946,
       "format": "webp",
       "width": 1600,
       "height": 1200
     }
     ```
     This strictly violates Acceptance Criteria R1: "dung lượng < 350KB".

4. **Small Image Edge Case Crash (<140px width or <30px height)**:
   - In `fai/src/lib/imageProcessor.js` (lines 71–74):
     ```javascript
     // Watermark width: ~20% of actual image width, clamped between 140px and 320px
     const wmWidth = Math.round(Math.min(Math.max(actualW * 0.20, 140), 320));
     // Watermark margin: 2% of actual image width, clamped between 16px and 32px
     const wmMargin = Math.round(Math.min(Math.max(actualW * 0.02, 16), 32));
     ```
   - The watermark `public/logo_fpt_fai.png` has native dimensions 4470 x 940 (aspect ratio 4.755:1). At minimum width 140px, its height is ~29.4px.
   - When an image has `actualW < 140` (e.g. 100x100 avatar/icon) or `actualH < 30` (e.g. 300x25 banner), the watermark dimensions exceed the base image dimensions.
   - Sharp throws an uncaught exception:
     `Image to composite must have same dimensions or smaller`
   - Uploading a 100x100 image via `POST http://localhost:3000/api/upload` results in an unhandled 500 error:
     ```json
     HTTP/1.1 500 Internal Server Error
     {
       "success": false,
       "error": "Image to composite must have same dimensions or smaller"
     }
     ```

5. **Watermark Placement & Opacity**:
   - Evaluated 1000x800 base image with watermark enabled vs disabled.
   - Top-left 100x100 region delta: 0 (completely untouched).
   - Bottom-right watermark region delta: 160,872 (distinct logo overlay detected).
   - Watermark opacity test: Compared 85% opacity buffer against 100% opacity buffer. Measured peak channel value: 204 vs 255 (`204 / 255 = 0.800`), matching the 85% alpha multiplication logic.

6. **Live Upload to Cloudflare R2 & CDN Verification**:
   - Executed live multipart upload to `http://localhost:3000/api/upload`.
   - Response: HTTP 200 OK with valid JSON containing public CDN URL, S3 key, format `webp`, dimensions, and size.
   - Performed `curl -s -I <cdn_url>`:
     ```http
     HTTP/1.1 200 OK
     Date: Thu, 03 Sep 2026 09:07:56 GMT
     Content-Type: image/webp
     Content-Length: 39128
     Cache-Control: public, max-age=31536000, immutable
     Server: cloudflare
     ```
   - Delete endpoint `DELETE /api/upload?key=...` was also tested and confirmed returning `{"success":true}`.

---

## 2. Logic Chain

1. **Size Limit Guarantee (Observation 3)**:
   - The project requirement explicitly mandates that all processed images must have `dung lượng < 350KB`.
   - In `imageProcessor.js`, the adaptive loop only adjusts WebP quality down to `quality > 40`. For high-entropy images (textures, noise, fine patterns), lossy WebP compression alone cannot drop below 350KB without reducing spatial resolution.
   - Because the loop exits as soon as `quality <= 40`, `processImage` returns buffers exceeding 350KB (up to 854 KB in our empirical test), and `/api/upload` writes these oversized buffers directly to R2.
   - Therefore, the claim that the pipeline strictly guarantees `< 350KB` is false under high-entropy inputs.

2. **Small Image Compositing Resilience (Observation 4)**:
   - `imageProcessor.js` clamps the minimum watermark width to 140px via `Math.max(actualW * 0.20, 140)`.
   - If an uploaded image is smaller than 140px in width or ~30px in height, Sharp rejects the composite operation because the overlay buffer is larger than the underlying image.
   - This causes an uncaught error in `processImage` and triggers an HTTP 500 server error in `POST /api/upload`.
   - Therefore, the pipeline is fragile and crashes on valid small image inputs.

3. **Core Functionality Soundness (Observations 1, 2, 5, 6)**:
   - When images are of moderate to large size and moderate entropy, resizing (<= 1600px), aspect ratio maintenance, WebP encoding, watermark positioning at bottom-right, 85% opacity, and R2 S3 uploads operate correctly.
   - However, because the edge cases directly violate the core constraints and crash the API, the milestone cannot be marked complete without addressing these defects.

---

## 3. Caveats

- No Caveats. All tests were executed with fresh synthetic and real image inputs directly against the live Next.js dev server on port 3000 and Cloudflare R2 bucket `vietndjmedia`. Test artifacts uploaded to R2 during the audit were cleaned up via the DELETE endpoint.

---

## 4. Conclusion

**Verdict: REQUEST_CHANGES**

Milestone 1 is nearly complete but contains two confirmed defects that must be resolved:

1. **Defect 1 (CRITICAL - Hard Requirement Violation)**:
   - High complexity/high entropy images exceed the 350KB limit (empirically measured at 854 KB).
   - **Remediation**: In `src/lib/imageProcessor.js`, after the quality reduction loop reaches quality floor (e.g. 35 or 40), if `webpBuffer.length > targetMaxBytes`, add a dimension downscaling loop (e.g., iteratively scale width and height down by a factor of 0.85x or 0.8x) until `webpBuffer.length <= targetMaxBytes`.

2. **Defect 2 (HIGH - Uncaught 500 Error on Small Images)**:
   - Images with width < 140px or height < 30px trigger `Image to composite must have same dimensions or smaller` and crash `/api/upload` with HTTP 500.
   - **Remediation**: In `src/lib/imageProcessor.js`:
     - If `actualW < 140 || actualH < 40`, either:
       a) Skip watermark compositing entirely (`applyWatermark = false` for micro-images/icons), or
       b) Scale watermark proportionally to fit within `actualW * 0.5` and `actualH * 0.5` without a hard minimum clamp of 140px.

---

## 5. Verification Method

To independently reproduce and verify these findings:

1. **Run the Empirical Verification Suite**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   node scripts/verify-empirical-m1.mjs
   ```
   *Expected Output*:
   - `[FAIL] High Entropy Image (1600x1200 random noise): Output size 874546 bytes vs 358400 max`
   - `[FAIL] Tiny Image Edge Cases (<140px width / <30px height): Crashes: "Image to composite must have same dimensions or smaller"`

2. **Reproduce HTTP 500 on Small Upload**:
   ```bash
   node -e 'import("sharp").then(async ({default: sharp}) => {
     const buf = await sharp({ create: { width: 100, height: 100, channels: 3, background: { r: 255, g: 0, b: 0 } } }).png().toBuffer();
     const form = new FormData();
     form.append("file", new Blob([buf], { type: "image/png" }), "small.png");
     const res = await fetch("http://localhost:3000/api/upload", { method: "POST", body: form });
     console.log("Status:", res.status, await res.json());
   });'
   ```
   *Observed Result*:
   `Status: 500 { success: false, error: 'Image to composite must have same dimensions or smaller' }`

3. **Invalidation Conditions**:
   - This finding is invalidated once:
     1. Running `node scripts/verify-empirical-m1.mjs` outputs `OVERALL STATUS: ALL TESTS PASSED` with all 6 tests showing `[PASS]`.
     2. Uploading a 100x100 image returns `HTTP 200 OK` with `success: true`.
     3. Uploading a 1600x1200 random noise image returns `HTTP 200 OK` with `sizeBytes <= 358400`.
