## 2026-09-03T15:15:00Z

<USER_REQUEST>
You are explorer_survey_crawler.
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_crawler
Codebase directory: /Users/vietmac/Documents/CODE/WEB- FAI/fai

Your tasks:
1. Read the authoritative user request at /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically check the latest entry dated 2026-09-03T15:13:01Z).
2. Investigate the Image Optimization and Storage pipeline in the codebase:
   - Locate how images are downloaded, processed via `sharp`, compressed to WebP (< 350KB), and watermarked with `public/logo_fpt_fai.png`.
   - Check where images are stored (Firebase Storage / Cloud Storage / public folder / mock storage) and how public URLs are generated (no Base64 in Firestore!).
3. Investigate Firestore `posts` collection schema:
   - Check `src/lib/firebase.js` or admin SDK setup, collection name (`posts`), required document fields (`title`, `slug`, `excerpt`, `content`, `coverImage`, `categoryId`, `categoryName`, `published`, `createdAt`, `updatedAt`, `author`, `readingTime`, etc.).
   - Check existing categories in Firestore or `src/data/` to identify the correct categoryId for `doi-song` (Đời sống).
4. Investigate the 3 target articles on `https://aptech.fpt.edu.vn/tin-tuc`:
   - Article 1: "Wireframing – Thiết kế từ góc nhìn của người dùng"
   - Article 2: "AI-first software developer: Làm chủ ai để phát triển phần mềm và kiến tạo giá trị cho doanh nghiệp"
   - Article 3: "Học sinh THPT chinh phục AI tại FPT Aptech: Tự tay phát triển ứng dụng điều khiển bằng cử chỉ"
   - Examine the live URLs, fetch content/HTML from `https://aptech.fpt.edu.vn/tin-tuc` or web search / read_url_content, extract exact titles, cover image URLs, excerpts, and rich content.
5. Plan a crawling and simulation script that will:
   - Fetch the 3 articles with full content, images, and metadata.
   - Feed them through the image optimization + watermark pipeline.
   - Save the posts into Firestore collection `posts` under `doi-song`.
   - Verify how they render at `http://localhost:3000/doi-song` and in the CMS editor at `http://localhost:3000/admin/posts/[id]`.
6. Write a detailed, evidence-based investigation report to:
   /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_crawler/handoff.md
7. Update /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_survey_crawler/progress.md.
8. Send a message to orchestrator_6 with your key findings and handoff file path.
</USER_REQUEST>
