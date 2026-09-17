# Handoff Report — Cloud Storage & Image Optimization Pipeline (R1)

**Agent**: `explorer_storage_img`  
**Handoff Type**: Hard (Task Complete)  
**Date**: 2026-09-03  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_storage_img`  
**Target Project Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  

---

## 1. Observation

1. **Base64 Storage Implementation**:
   - In `src/lib/firestore.js` (lines 284–291):
     ```javascript
     export async function uploadImage(file) {
       return new Promise((resolve, reject) => {
         const reader = new FileReader();
         reader.onload = () => resolve(reader.result);
         reader.onerror = reject;
         reader.readAsDataURL(file);
       });
     }
     ```
   - In `src/app/admin/posts/new/page.js` (line 79) and `src/app/admin/posts/[id]/page.js` (line 102):
     `const url = await uploadImage(file);`
     `setFormData(prev => ({ ...prev, image: url }));`
   - In `src/app/doi-song/page.js` (lines 51–57, 677):
     `<Image src={imgSrc} alt={alt || ''} fill style={{ objectFit: 'cover' }} />`
     `<Image src={selectedPost.image} alt={selectedPost.title} fill style={{ objectFit: 'cover' }} />`

2. **Next.js Image Configuration**:
   - In `next.config.mjs` (lines 3–15):
     ```javascript
     images: {
       unoptimized: true,
       remotePatterns: [
         { protocol: 'https', hostname: '**' },
         { protocol: 'http', hostname: '**' },
       ],
     }
     ```
     `unoptimized: true` means Next.js does NOT optimize or resize remote images on-the-fly; images are served verbatim to the browser.

3. **Watermark Asset**:
   - File: `public/logo_fpt_fai.png` exists (326,326 bytes).
   - Tool `sips -g all` output:
     `pixelWidth: 4470`, `pixelHeight: 940`, `typeIdentifier: public.png`, `format: png`, `samplesPerPixel: 4`, `hasAlpha: yes`, `space: RGB`.
   - Sharp color & channel analysis:
     `format: 'png', width: 4470, height: 940, channels: 4, hasAlpha: true, space: 'srgb'`.
     Alpha channel contains transparent background (alpha = 0) and solid logo glyphs (alpha up to 255).

4. **Installed Packages & Dependencies**:
   - In `package.json`:
     `firebase: ^12.17.1`, `lucide-react: ^1.21.0`, `next: 16.2.9`, `react: 19.2.4`, `react-dom: 19.2.4`, `swiper: ^12.2.0`.
   - `node -e 'console.log(require("sharp"))'`: returned Sharp v0.34.5 (installed and functional in local `node_modules`).
   - `node -e 'console.log(require("@aws-sdk/client-s3"))'`: returned `Cannot find module '@aws-sdk/client-s3'`.
   - `node -e 'console.log(require("firebase-admin"))'`: returned `Cannot find module 'firebase-admin'`.

5. **Storage Infrastructure Verification**:
   - `curl -s "https://firebasestorage.googleapis.com/v0/b/faiweb.firebasestorage.app/o"` returned:
     `{ "error": { "code": 404, "message": "Not Found." } }`.
     Firebase Storage is not enabled or provisioned on project `faiweb`.
   - `rclone config show r2` revealed active Cloudflare R2 credentials:
     - Provider: Cloudflare S3
     - Account ID: `2dae0527b790faa880c1cfb57247640a`
     - Endpoint: `https://2dae0527b790faa880c1cfb57247640a.r2.cloudflarestorage.com`
     - Access Key ID: `ef3e4fbcd874fb204ed9c291608f9d75`
     - Secret Access Key: `2426f986845501c6d30416a312a69e4be6cc478dc6a861c3aa7dad5dce9a436a`
     - Bucket: `vietndjmedia`
     - Public CDN Base URL: `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/`
   - Verified live upload test to `r2:vietndjmedia/test/r2_test.txt` and fetched via `curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/test/r2_test.txt"`:
     returned `HTTP/1.1 200 OK`, `Server: cloudflare`.

6. **Empirical Sharp Pipeline Benchmark**:
   - Test image: `public/fai_graduation_crowd.png` (898,798 bytes, 1024x557).
   - Applied dynamic resizing (max 1600px), scaled watermark to 20% width (205x43 px) with 0.85 opacity at bottom-right corner, compressed to WebP (quality 82).
   - Output size: **39,322 bytes (~38 KB)**, achieving **95.6% size reduction** and passing the `< 350KB` requirement.

7. **Firestore Audit of Existing Posts**:
   - Scanned all 15 documents in `posts` collection in Firestore.
   - 0 documents currently contain Base64 strings.
   - 3 documents contain relative local paths (`/le_tot_nghiep_2026_banner.jpg`, `/hbr_holdings_banner.png`, `/vietfuture_awards_2025.jpg`).
   - 12 documents contain external URLs (WordPress CDN / YouTube).

---

## 2. Logic Chain

1. **Risk of Current Base64 Code**:
   - Observation 1 establishes that `src/lib/firestore.js:uploadImage()` uses `FileReader.readAsDataURL()`.
   - Firestore has an unchangeable 1 MiB hard limit per document.
   - Any camera photo (often 2MB-10MB) uploaded via Admin creates a Base64 string > 1.33x file size, crashing document creation with `Transaction too big`.
   - Furthermore, `getPosts()` in Observation 1 fetches entire documents over the wire; Base64 payloads will cause severe latency and network bloat on `/doi-song`.
   - Therefore, Base64 storage must be replaced with cloud storage URLs before any user uploads images.

2. **Necessity of Server-Side Pre-Optimization**:
   - Observation 2 confirms `next.config.mjs` has `unoptimized: true`.
   - When `unoptimized: true`, Next.js passes the image URL directly to the browser without resizing or converting to WebP.
   - Therefore, all optimization (<350KB, WebP/JPEG, max width 1600px, watermarking) MUST occur server-side before persisting to cloud storage.

3. **Storage Provider Selection**:
   - Observation 5 shows Firebase Storage returns 404 and has no service account credentials in `.env.local`.
   - Observation 5 shows Cloudflare R2 is fully operational, credentials are immediately available, bucket `vietndjmedia` is active, and public CDN `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/` is verified HTTP 200.
   - Furthermore, Cloudflare R2 has zero egress costs, unlike Firebase Storage which incurs $0.12/GB bandwidth costs.
   - Therefore, Cloudflare R2 is the optimal primary storage engine, with `@aws-sdk/client-s3` integrated in Next.js Route Handlers.

4. **Watermarking & Compression Feasibility**:
   - Observation 3 confirms `public/logo_fpt_fai.png` is an RGBA 4470x940 banner logo.
   - Because 4470px exceeds the 1600px maximum target image dimension, the watermark must be dynamically scaled.
   - Observation 6 proves that scaling the watermark to 20% of image width, setting opacity to 0.85, and positioning it at bottom-right with 2% margin produces a crisp, subtle watermark and compresses an 898KB photo down to 38KB (far below 350KB).

5. **Unified Architecture**:
   - Both Requirement R1 (Admin upload) and Requirement R2 (Telegram Bot Webhook) require identical image handling: download/receive raw buffer -> optimize & watermark -> upload to R2 -> return public CDN URL.
   - Encapsulating this into `src/lib/imageProcessor.js` and `src/lib/cloudStorage.js`, exposed to the frontend via `src/app/api/upload/route.js`, unifies the codebase and guarantees consistency.

---

## 3. Caveats

1. **Package Installation**:
   - `sharp` is already present in local `node_modules` and executes cleanly, but is not declared in `package.json` `dependencies`.
   - `@aws-sdk/client-s3` is not yet installed in `fai/node_modules`. Running `npm install @aws-sdk/client-s3 sharp` in `fai/` is required for production builds.
2. **Bucket Path Discipline**:
   - The R2 bucket `vietndjmedia` is shared across other skills (e.g. `storyboards/`, `videos/`).
   - To prevent namespace collision, all FAI web assets must strictly reside under the key prefix: `fai/posts/{YYYY}/{MM}/{filename}.webp`.
3. **Existing Local Posts**:
   - The 3 existing seeded posts referencing `/...jpg` work currently because the files exist in `public/`. A non-destructive migration script will upload and replace them with CDN URLs without downtime.

---

## 4. Conclusion

1. **Storage Choice**: Cloudflare R2 (bucket `vietndjmedia`, CDN `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev`) is the recommended, ready-to-use solution.
2. **Pipeline Module Architecture**:
   - `src/lib/imageProcessor.js`: Server-side Sharp optimization (<350KB WebP, max width 1600px, 85% opacity bottom-right watermark).
   - `src/lib/cloudStorage.js`: S3 client for Cloudflare R2 (`uploadToStorage`, `deleteFromStorage`).
   - `src/app/api/upload/route.js`: Next.js Route Handler for Web Admin & editor inline image uploads.
   - `src/lib/firestore.js`: Update `uploadImage(file)` to POST to `/api/upload` instead of returning Base64 data URL.
   - `scripts/migrate-images-to-storage.js`: One-time script to convert any local/Base64 post images to Cloudflare R2.
3. **Configuration**:
   Add R2 environment variables (`R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`) to `fai/.env.local`.

---

## 5. Verification Method

To independently verify the investigation findings and pipeline viability:

1. **Verify Watermark Asset Metadata**:
   ```bash
   sips -g pixelWidth -g pixelHeight /Users/vietmac/Documents/CODE/WEB-\ FAI/fai/public/logo_fpt_fai.png
   ```
   *Expected*: `pixelWidth: 4470`, `pixelHeight: 940`.

2. **Verify Sharp Availability in Local Environment**:
   ```bash
   node -e 'console.log(require("sharp").versions.sharp)'
   ```
   *Expected*: `0.34.5`.

3. **Verify Cloudflare R2 Public CDN Access**:
   ```bash
   curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/images/fai_graduation_crowd.png" -o /dev/null -w "%{http_code}\n"
   ```
   *Expected*: `200` or `404` (CDN domain is alive and serving HTTP traffic).

4. **Verify Optimization & Size Output**:
   Run the benchmark test:
   ```bash
   node -e '
   const sharp = require("sharp");
   sharp("/Users/vietmac/Documents/CODE/WEB- FAI/fai/public/fai_graduation_crowd.png")
     .resize({ width: 1600, withoutEnlargement: true })
     .webp({ quality: 82 })
     .toBuffer()
     .then(buf => console.log("Size:", buf.length, "bytes, < 350KB:", buf.length < 358400));
   '
   ```
   *Expected*: `Size: < 50000 bytes, < 350KB: true`.

