## 2026-09-03T16:22:42Z

You are worker_m3_aptech.
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_aptech
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

1. Read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T15:13:01Z).
2. Read /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md.
3. Read the Crawler & Image Pipeline blueprint at:
   /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_crawler/handoff.md

Your exclusive write ownership:
- `fai/scripts/seed-aptech-posts.mjs`

Your assignment:
1. Implement and run `scripts/seed-aptech-posts.mjs`:
   - Crawl/ingest the 3 required FPT Aptech articles:
     * Article 1: "Wireframing – Thiết kế từ góc nhìn của người dùng" (category: `sharing`)
     * Article 2: "AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp" (category: `enterprise`)
     * Article 3: "Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ" (category: `contests`)
   - For each article:
     * Fetch original image from `https://aptech.fpt.edu.vn/...`
     * Process image using `processImage` from `src/lib/imageProcessor.js`:
       - Composite FAI watermark `public/logo_fpt_fai.png` at bottom-right corner.
       - Compress to WebP (< 350KB).
     * Upload processed image buffer to Cloudflare R2 bucket `vietndjmedia` via `uploadToStorage` from `src/lib/cloudStorage.js`.
     * Store public CDN URL in document (strictly NO Base64 strings).
     * Insert/update post in Firestore `posts` collection with all required schema fields:
       `id`, `title`, `slug`, `categoryId`, `date`, `image` (R2 CDN URL), `excerpt`, `contentHtml`, `sourceUrl`, `author: 'FPT Aptech'`, `readTime: '4 phút'`, `order: 0`, `published: true`, `group: 'doi-song'`, `createdAt`, `updatedAt`.
2. Verify:
   - All 3 images return HTTP 200 from Cloudflare CDN (`pub-447bd44dfdac4938912655c855b8631c.r2.dev`), WebP format, < 350KB.
   - All 3 articles exist in Firestore `posts` under `group: 'doi-song'`.
   - `http://localhost:3000/doi-song` displays the 3 articles correctly in their respective category sections.
   - `http://localhost:3000/admin/posts/[id]` loads each article into TipTap editor successfully.
3. Document all details, CDN image URLs, Firestore IDs, and test commands in:
   `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_aptech/handoff.md`
   and notify orchestrator_6 via send_message.
