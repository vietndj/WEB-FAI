# Forensic Audit Report — Milestone 3: FPT Aptech Articles Ingestion, Watermarking & Cloudflare Storage

**Agent**: `auditor_m3_apt`  
**Auditee**: `worker_m3_aptech`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Work Product**: `scripts/seed-aptech-posts.mjs`, Firestore collection `posts`, Cloudflare R2 assets, public route `/doi-song`, CMS route `/admin/posts/[id]`  
**Profile**: General Project (Development Mode per `ORIGINAL_REQUEST.md`)  
**Date**: 2026-09-03  
**Verdict**: **`CLEAN`**

---

## 1. Observation

### 1.1 Authentic FPT Aptech Articles Verification
Direct HTTP inspection of live URLs on `https://aptech.fpt.edu.vn/`:
- **Article 1**: `https://aptech.fpt.edu.vn/wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung.html`
  - Status: `HTTP/2 200 OK`
  - Live `<title>`: `"Wireframing – Thiết kế từ góc nhìn của người dùng"`
  - Live `og:image`: `"https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/Wireframing.png"`
- **Article 2**: `https://aptech.fpt.edu.vn/ai-first-software-developer.html`
  - Status: `HTTP/2 200 OK`
  - Live `<title>`: `"AI-first software developer: Làm chủ ai để phát triển phần mềm"`
  - Live `og:image`: `"https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/Human-Led.png"`
- **Article 3**: `https://aptech.fpt.edu.vn/hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi.html`
  - Status: `HTTP/2 200 OK`
  - Live `<title>`: `"Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ"`
  - Live `og:image`: `"https://aptech.fpt.edu.vn/wp-content/uploads/2026/07/z7988408161872_067e48a784b07b4c6aa8b755447aac2f-1067x800.jpg"`

All 3 articles exist, are authentic, and match the ingested headlines and original images.

### 1.2 Cloudflare R2 Storage & CDN Delivery (< 350KB, WebP)
Empirical verification of CDN edge response headers (`curl -s -I`):
1. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/dbc6b1642de2-wireframing-thiet-ke-tu-goc-nhin-cua-ngu.webp`:
   - `HTTP/1.1 200 OK`
   - `Content-Type: image/webp`
   - `Content-Length: 24166` (23.6 KB < 350 KB)
   - `Cache-Control: public, max-age=31536000, immutable`
   - `Server: cloudflare`
2. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/84b82657fa85-ai-first-software-developer-lam-chu-ai-d.webp`:
   - `HTTP/1.1 200 OK`
   - `Content-Type: image/webp`
   - `Content-Length: 155280` (151.6 KB < 350 KB, down from 1.63 MB)
   - `Server: cloudflare`
3. `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/ef03005bdb0f-hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-apte.webp`:
   - `HTTP/1.1 200 OK`
   - `Content-Type: image/webp`
   - `Content-Length: 55912` (54.6 KB < 350 KB)
   - `Server: cloudflare`

### 1.3 Zero Base64 in Firestore `posts` Collection
Querying the live Firestore `posts` collection:
- `wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung`:
  - `isR2Url: true` (`https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/...`)
  - `isBase64Image: false`
  - `contentHtmlHasBase64: false`
- `ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep`:
  - `isR2Url: true`
  - `isBase64Image: false`
  - `contentHtmlHasBase64: false`
- `hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi`:
  - `isR2Url: true`
  - `isBase64Image: false`
  - `contentHtmlHasBase64: false`
- Global collection scan across all 18 documents in `posts`:
  - Total posts scanned: 18
  - Posts containing Base64 strings: **0**

### 1.4 Genuine FAI Logo Watermark Compositing Proof
Sharp RGB-aligned pixel differential comparison between raw unwatermarked sources and Cloudflare R2 processed assets:
- Logo source verified: `public/logo_fpt_fai.png` (PNG 4470x940, 4 channels with alpha).
- **Article 1 (`Wireframing`)**:
  - Top-Left (unwatermarked region): mean RGB difference = `0.00`, significant diff pixels (>15) = `0 / 20000` (0.0%).
  - Bottom-Right (watermark location): mean RGB difference = `10.70`, significant diff pixels (>15) = `4110 / 16800` (**24.5%**).
- **Article 2 (`AI-first software developer`)**:
  - Top-Left (unwatermarked region): mean RGB difference = `0.83`.
  - Bottom-Right (watermark location): mean RGB difference = `22.35`, significant diff pixels (>15) = `4430 / 15350` (**28.9%**).
- **Article 3 (`Học sinh THPT chinh phục AI`)**:
  - Top-Left (unwatermarked region): mean RGB difference = `1.61`.
  - Bottom-Right (watermark location): mean RGB difference = `13.36`, significant diff pixels (>15) = `2703 / 10650` (**25.4%**).

This confirms authentic, genuine image compositing of the watermark in the bottom-right corner rather than a simulated or bypassed pipeline.

### 1.5 Git Repository Integrity & Zero Leaks
- `git status` check:
  - Untracked `.env*` files verified; `.env*` properly listed in `.gitignore` (line 34).
  - No `.env`, `.env.local`, or secret credentials tracked by git.
  - Zero commits made during Milestone 3 (`git log -n 1` remains `1bda86c`, matching pre-milestone state).
  - Zero git pushes executed.
  - Zero Vercel production deployments triggered.
  - Live scan for `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` across all git tracked files yielded zero matches.

### 1.6 Web & Admin Routes Health & Production Build
- `http://localhost:3000/doi-song`: `HTTP/1.1 200 OK`
- `http://localhost:3000/admin/posts/wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung`: `HTTP/1.1 200 OK`
- `http://localhost:3000/admin/posts/ai-first-software-developer-lam-chu-ai-de-phat-trien-phan-mem-va-kien-tao-gia-tri-cho-doanh-nghiep`: `HTTP/1.1 200 OK`
- `http://localhost:3000/admin/posts/hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi`: `HTTP/1.1 200 OK`
- TipTap retrieval via `getPostById(id)`: verified for all 3 posts with full `contentHtml` and `image`.
- `npm run build`: Compiled successfully in 4.6s with all 34 static/dynamic routes generated cleanly without errors.

---

## 2. Logic Chain

1. **Authenticity of Source Material**:
   - The user requested 3 specific articles from `https://aptech.fpt.edu.vn/tin-tuc`.
   - Direct HTTP requests to `aptech.fpt.edu.vn` confirmed the articles exist live, match the headlines, excerpts, and images. No fabrication or dummy data was used.

2. **Integrity of Storage & Optimization Pipeline**:
   - The user mandated zero Base64 strings in Firestore and public Cloudflare R2 storage with WebP compression < 350KB.
   - All 3 images were uploaded to Cloudflare R2 bucket `vietndjmedia` and return HTTP 200 OK from the CDN with sizes 23.6 KB, 151.6 KB, and 54.6 KB.
   - A full database scan of all 18 documents in Firestore collection `posts` revealed 0 occurrences of Base64 strings.

3. **Authenticity of Watermarking Process**:
   - The user required the FAI logo (`public/logo_fpt_fai.png`) to be composited onto the images.
   - Mathematical and pixel-by-pixel comparisons of the original remote images against the CDN images demonstrated that the unwatermarked regions remain identical (0.00 - 1.61 mean diff), whereas the bottom-right corner where the logo was composited exhibits significant modifications (10.70 - 22.35 mean diff across thousands of pixels). This establishes beyond doubt that `src/lib/imageProcessor.js` genuinely applied Sharp alpha compositing.

4. **Compliance with Safety & Operational Constraints**:
   - `ORIGINAL_REQUEST.md` and `GEMINI.md` forbid automated git commits, git pushes, and Vercel deployments.
   - Git logs confirm zero commits were made, git status shows zero staged files, and no secret keys were committed to git.

---

## 3. Caveats

- No caveats. All claims in `worker_m3_aptech/handoff.md` have been verified empirically against live external endpoints, the local codebase, and the production build.

---

## 4. Conclusion

The work product delivered for Milestone 3 fully satisfies all functional and non-functional requirements without any integrity violations, facade implementations, or hardcoded cheating.

**Verdict**: **`CLEAN`**

---

## 5. Verification Method

To independently reproduce this forensic audit:

### 5.1 Verify Live Aptech URLs
```bash
curl -s -I "https://aptech.fpt.edu.vn/wireframing-thiet-ke-tu-goc-nhin-cua-nguoi-dung.html" | head -n 3
curl -s -I "https://aptech.fpt.edu.vn/ai-first-software-developer.html" | head -n 3
curl -s -I "https://aptech.fpt.edu.vn/hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-aptech-tu-tay-phat-trien-ung-dung-dieu-khien-bang-cu-chi.html" | head -n 3
```

### 5.2 Verify Cloudflare R2 CDN Images
```bash
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/dbc6b1642de2-wireframing-thiet-ke-tu-goc-nhin-cua-ngu.webp" | grep -E "HTTP|content-type|content-length"
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/84b82657fa85-ai-first-software-developer-lam-chu-ai-d.webp" | grep -E "HTTP|content-type|content-length"
curl -s -I "https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/fai/posts/2026/09/ef03005bdb0f-hoc-sinh-thpt-chinh-phuc-ai-tai-fpt-apte.webp" | grep -E "HTTP|content-type|content-length"
```

### 5.3 Scan Firestore for Zero Base64
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
node --env-file=.env.local -e '
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
const app = initializeApp({ projectId: "faiweb", apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY });
const db = getFirestore(app);
const snap = await getDocs(collection(db, "posts"));
let b64 = 0;
snap.forEach(d => { if (JSON.stringify(d.data()).includes(";base64,")) b64++; });
console.log(`Scanned ${snap.size} posts. Base64 leaks: ${b64}`);
process.exit(b64 === 0 ? 0 : 1);
'
```

### 5.4 Check Git Hygiene & Build
```bash
git log -n 1 --oneline
git status -s
npm run build
```
