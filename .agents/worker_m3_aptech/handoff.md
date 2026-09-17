# Handoff Report — M3: FPT Aptech Articles Ingestion, Image Watermarking & Cloud Storage Publishing

**Agent**: `worker_m3_aptech`  
**Parent**: `orchestrator_6` (`916b86d0-d46f-4ff6-91f5-41089eb9b647`)  
**Handoff Type**: Hard (Task Complete)  
**Date**: 2026-09-03  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Exclusive File Created**: `fai/scripts/seed-aptech-posts.mjs`

---

## 1. Observation

### 1.1 Live FPT Aptech Crawl & Ingestion
From live queries against `https://aptech.fpt.edu.vn/tin-tuc` and the respective article endpoints:
- **Article 1**:
  - Title: `"Wireframing – Thiết kế từ góc nhìn của người dùng"`
  - Source URL: `https://aptech.fpt.edu.vn/wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung.html`
  - Original Image: `https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/Wireframing.png` (116,505 bytes)
  - Assigned Category: `sharing` (`Nhỏ to cùng chia sẻ - Nói nhỏ nói to`)
  - Slug: `wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung`
- **Article 2**:
  - Title: `"AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp"`
  - Source URL: `https://aptech.fpt.edu.vn/ai-first-software-developer.html`
  - Original Image: `https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/Human-Led.png` (1,633,021 bytes)
  - Assigned Category: `enterprise` (`Doanh nghiệp & FAI`)
  - Slug: `ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep`
- **Article 3**:
  - Title: `"Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ"`
  - Source URL: `https://aptech.fpt.edu.vn/hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi.html`
  - Original Image: `https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/z7988408161872_067e48a784b07b4c6aa8b755447aac2f-1067x800.jpg` (86,089 bytes)
  - Assigned Category: `contests` (`Sân chơi & giải thưởng`)
  - Slug: `hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi`

### 1.2 Sharp Watermarking & WebP Compression
Invoked `processImage(rawBuffer, { maxWidth: 1600, maxHeight: 1600, quality: 82, watermark: true, watermarkOpacity: 0.85 })` from `src/lib/imageProcessor.js`:
- Logo watermark `public/logo_fpt_fai.png` composited at the bottom-right corner with safe bounding margins and 85% opacity.
- **Article 1 Image**:
  - Format: `webp`
  - Dimensions: `1487x744`
  - Size: `24,166` bytes (**23.6 KB**) (< 350 KB, passed)
- **Article 2 Image**:
  - Format: `webp`
  - Dimensions: `1536x1024`
  - Size: `155,280` bytes (**151.6 KB**) (< 350 KB, down from 1.63 MB, passed)
- **Article 3 Image**:
  - Format: `webp`
  - Dimensions: `1067x800`
  - Size: `55,912` bytes (**54.6 KB**) (< 350 KB, passed)

### 1.3 Cloudflare R2 Cloud Storage Uploads
Invoked `uploadToStorage(buffer, filename, 'image/webp')` from `src/lib/cloudStorage.js`:
- S3 client targeted bucket `vietndjmedia`.
- Generated URLs:
  1. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/dbc6b1642de2-wireframing-thiet-ke-tu-goc-nhin-cua-ngu.webp`
  2. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/84b82657fa85-ai-first-software-developer-lam-chu-ai-d.webp`
  3. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/ef03005bdb0f-hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-apte.webp`
- Direct HTTP `curl -I` against Cloudflare CDN edge returned:
  - `HTTP/1.1 200 OK`
  - `Content-Type: image/webp`
  - `Cache-Control: public, max-age=31536000, immutable`
  - `Server: cloudflare`

### 1.4 Firestore Collection `posts` Persistence
Saved documents to Firestore collection `posts`:
- Document 1: `doc(db, 'posts', 'wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung')`
- Document 2: `doc(db, 'posts', 'ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep')`
- Document 3: `doc(db, 'posts', 'hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi')`
- All required fields verified:
  - `id`: matching slug
  - `title`: exact headline
  - `slug`: normalized URL slug
  - `categoryId`: `sharing`, `enterprise`, `contests`
  - `date`: `03-09-2026`, `02-09-2026`, `01-09-2026`
  - `image`: Cloudflare R2 CDN URL (zero Base64 strings)
  - `excerpt`: summary string
  - `contentHtml`: semantic HTML (2800 - 3265 chars)
  - `sourceUrl`: canonical `https://aptech.fpt.edu.vn/...` URL
  - `author`: `'FPT Aptech'`
  - `readTime`: `'4 phút'`
  - `order`: `0`
  - `published`: `true`
  - `group`: `'doi-song'`
  - `createdAt` & `updatedAt`: Firestore Timestamps

### 1.5 Local UI & CMS Verification
- `http://localhost:3000/doi-song`: Verified that categories `enterprise`, `sharing`, and `contests` query and return the 3 target posts in their respective category blocks.
- `http://localhost:3000/admin/posts/[id]`: Verified `HTTP/1.1 200 OK` on all 3 URLs, and confirmed `getPostById(id)` successfully retrieves full post data including `contentHtml` for the TipTap editor.
- Next.js production build `npm run build`: Compiled in 4.2s, generating all 34 routes with zero errors.

---

## 2. Logic Chain

1. **Pipeline Execution Integrity**:
   - The original requirement demanded genuine image processing, watermarking, and Cloudflare R2 storage without Base64 strings.
   - `scripts/seed-aptech-posts.mjs` directly calls production libraries `src/lib/imageProcessor.js` and `src/lib/cloudStorage.js`.
   - The images were fetched live from `https://aptech.fpt.edu.vn`, watermarked with `public/logo_fpt_fai.png`, converted to WebP format, compressed below 350KB, and pushed to Cloudflare R2 bucket `vietndjmedia`.
   - Verified that Cloudflare edge returned `HTTP 200 OK` and `Content-Type: image/webp`.

2. **Schema & UI Compatibility**:
   - `src/app/doi-song/page.js` queries categories where `group == 'doi-song'`, and then queries posts by `categoryId` with `published == true`.
   - By seeding Article 1 into `sharing`, Article 2 into `enterprise`, and Article 3 into `contests` with `published: true` and `group: 'doi-song'`, all three articles appear in the frontend carousels and modal view.
   - TipTap editor in `src/app/admin/posts/[id]/page.js` accepts semantic HTML (`<h2>`, `<p>`, `<ul>`, `<blockquote>`, `<cite>`). The generated `contentHtml` seamlessly loads into TipTap without schema errors.

---

## 3. Caveats

- **No caveats**. All 3 articles were crawled from live URLs, images were processed, watermarked, uploaded to R2, persisted to Firestore, and validated on frontend and admin routes.

---

## 4. Conclusion

Milestone M3 is **100% COMPLETE**:
1. `fai/scripts/seed-aptech-posts.mjs` is fully implemented and tested.
2. All 3 FPT Aptech articles are published to Firestore `posts` collection under `group: 'doi-song'`.
3. All 3 cover images are watermarked with the FAI logo, formatted as WebP (< 350KB), hosted on Cloudflare R2 CDN, and returning HTTP 200.
4. Base64 strings are strictly excluded from all documents.
5. All 3 articles are verified on `http://localhost:3000/doi-song` and accessible in TipTap editor at `http://localhost:3000/admin/posts/[id]`.
6. `npm run build` succeeds cleanly across all 34 routes.

---

## 5. Verification Method

To independently verify the implementation:

### 5.1 Re-run the Seeding Script
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
node --env-file=.env.local scripts/seed-aptech-posts.mjs
```
*Expected result*: Exit code 0, all 3 articles processed and saved.

### 5.2 Verify Cloudflare CDN Images
```bash
# Article 1 image
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/dbc6b1642de2-wireframing-thiet-ke-tu-goc-nhin-cua-ngu.webp" | grep -E "HTTP|content-type|content-length"

# Article 2 image
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/84b82657fa85-ai-first-software-developer-lam-chu-ai-d.webp" | grep -E "HTTP|content-type|content-length"

# Article 3 image
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/ef03005bdb0f-hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-apte.webp" | grep -E "HTTP|content-type|content-length"
```
*Expected result*: `HTTP/1.1 200 OK`, `content-type: image/webp`, all `content-length` values < 358400 bytes.

### 5.3 Verify Firestore Documents & Absence of Base64
```bash
node --env-file=.env.local -e '
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const app = initializeApp({
  projectId: "faiweb",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "faiweb.firebaseapp.com"
});
const db = getFirestore(app);

const ids = [
  "wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung",
  "ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep",
  "hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi"
];

for (const id of ids) {
  const s = await getDoc(doc(db, "posts", id));
  const d = s.data();
  console.log(id, "=> group:", d.group, "| category:", d.categoryId, "| base64:", d.image.startsWith("data:"));
}
'
```
*Expected result*: `group: doi-song`, `base64: false` for all 3 posts.

### 5.4 Verify Web Server & Admin Routes
```bash
curl -s -I "http://localhost:3000/doi-song" | head -n 3
curl -s -I "http://localhost:3000/admin/posts/wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung" | head -n 3
curl -s -I "http://localhost:3000/admin/posts/ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep" | head -n 3
curl -s -I "http://localhost:3000/admin/posts/hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi" | head -n 3
```
*Expected result*: `HTTP/1.1 200 OK` across all endpoints.

### 5.5 Verify Production Build
```bash
npm run build
```
*Expected result*: Compiled successfully with 0 errors.
