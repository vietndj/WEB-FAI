# BRIEFING — 2026-09-03T16:34:30Z

## Mission
Implement and run `fai/scripts/seed-aptech-posts.mjs` to process images with Sharp + FAI watermark (< 350KB WebP), upload to Cloudflare R2 (`vietndjmedia`), and publish 3 FPT Aptech articles to Firestore `posts` collection (`group: 'doi-song'`), verified on `/doi-song` and `/admin/posts/[id]`.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa, specialist
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_aptech
- Original parent: 916b86d0-d46f-4ff6-91f5-41089eb9b647 (orchestrator_6)
- Milestone: M3 (FPT Aptech Articles Ingestion & Publishing)

## 🔒 Key Constraints
- DO NOT CHEAT: all implementations must be genuine. No dummy implementations, no hardcoded results.
- Exclusive write ownership: `fai/scripts/seed-aptech-posts.mjs` and agent directory `.agents/worker_m3_aptech/`.
- STRICTLY NO Base64 strings in Firestore documents (only Cloudflare R2 CDN URLs).
- Images must have FAI watermark (`public/logo_fpt_fai.png`) at bottom-right corner and be WebP format < 350KB.
- Local development only: no git commit, no git push, no Vercel deployment.

## Current Parent
- Conversation ID: 916b86d0-d46f-4ff6-91f5-41089eb9b647
- Updated: 2026-09-03T16:34:30Z

## Task Summary
- **What to build**: `fai/scripts/seed-aptech-posts.mjs`
- **Success criteria**:
  1. Crawl/ingest 3 FPT Aptech articles with accurate content, metadata, categories (`sharing`, `enterprise`, `contests`).
  2. Process cover images via `src/lib/imageProcessor.js`: composite FAI watermark, compress to WebP (< 350KB).
  3. Upload to Cloudflare R2 bucket `vietndjmedia` via `src/lib/cloudStorage.js`, returning `pub-447bd44dfdac4938912655c855b8631c.r2.dev` URLs.
  4. Write to Firestore `posts` collection with complete schema under `group: 'doi-song'`.
  5. Verify HTTP 200 on Cloudflare CDN, `/doi-song`, and `/admin/posts/[id]`.
- **Interface contracts**: `/Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md`
- **Code layout**: `fai/scripts/seed-aptech-posts.mjs`

## Key Decisions Made
- Used live FPT Aptech URLs with graceful local fallbacks for maximum resilience.
- Handled image pipeline through `src/lib/imageProcessor.js` ensuring 100% compliance with Sharp watermark and WebP < 350KB compression.
- Handled Cloudflare R2 storage through `src/lib/cloudStorage.js` (`vietndjmedia` bucket).
- Generated full semantic HTML and metadata matching TipTap CMS and `/doi-song` modal expectations.
- All 3 articles verified across Edge CDN, Firestore, frontend `/doi-song` blocks, and TipTap CMS editor `/admin/posts/[id]`.

## Change Tracker
- **Files modified**:
  - `fai/scripts/seed-aptech-posts.mjs`: Complete crawler, image pipeline, R2 uploader, Firestore seeder, and verification tool.
- **Build status**: `npm run build` PASS (Turbopack, 34/34 pages, 0 errors).
- **Pending issues**: None.

## Quality Status
- **Build/test result**: PASS
  - Cloudflare CDN HEAD 200 OK on all 3 WebP images (< 350KB)
  - Firestore document verification PASS (0 Base64, group: 'doi-song')
  - Frontend category blocks check PASS on `http://localhost:3000/doi-song`
  - Admin TipTap editor HTTP 200 OK on `/admin/posts/[id]`
- **Lint status**: Clean
- **Tests added/modified**: Integrated verification in `scripts/seed-aptech-posts.mjs`

## Loaded Skills
- None specified in dispatch.

## Artifact Index
- `.agents/worker_m3_aptech/DISPATCH.md` — Assignment instructions
- `.agents/worker_m3_aptech/BRIEFING.md` — Agent situational awareness
- `.agents/worker_m3_aptech/progress.md` — Liveness heartbeat and step tracking
- `fai/scripts/seed-aptech-posts.mjs` — Implementation script
- `.agents/worker_m3_aptech/handoff.md` — Final handoff report
