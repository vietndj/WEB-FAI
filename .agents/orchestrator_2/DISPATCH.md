## 2026-09-03T08:51:39Z

You are the Project Orchestrator (orchestrator_2) for the FAI Web Telegram Bot Publishing & WordPress-Grade Editor project.

Your working directory for coordination metadata is:
/Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_2

Project source code directory is:
/Users/vietmac/Documents/CODE/WEB- FAI/fai

The verbatim user specification is in:
/Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (read the latest section dated 2026-09-03T08:50:15Z).

Key constraints:
1. Strict Local Development Only: TẠM THỜI KHÔNG tự động chạy `git commit` / `git push`, KHÔNG deploy lên Vercel Production. Chỉ chỉnh sửa code trực tiếp trên Local và kiểm tra qua `http://localhost:3000`.
2. Architecture & Requirements:
   - R1: Cloud Storage & Image Optimization Pipeline: Remove all Base64 image storage in Firestore `posts`. Store images in Cloud Storage (Firebase Storage / R2), store public URLs in Firestore. Process all uploaded/received images with compression (<350KB, max width 1600px, WebP/JPEG) and watermark with `public/logo_fpt_fai.png` at corner.
   - R2: Telegram Bot Webhook & AI 2-Option Flow: Next.js API route `/api/telegram/webhook`. Inline keyboards for `doi-song` categories. User submits photo + rough text -> Gemini 2.5 Flash generates 2 distinct full article options (title, excerpt, rich semantic HTML, estimated read time). Inline keyboard to choose Option 1 or Option 2. Saves to Firestore collection `posts`, renders immediately on `/doi-song`. Replies with success message + link to `/admin/posts/[id]`.
   - R3: WordPress-Grade CMS Rich Editorial Interface: Upgrade `/admin/posts/[id]` and `/admin/posts/new` to modern TipTap / Gutenberg editor with headings (H2-H4), blockquote, lists, divider, text alignment, Bubble Menu / Floating Toolbar on text selection, inline images with captions, and exact Live Preview matching `/doi-song` modal.
   - R4: Security: Telegram Webhook Secret Token validation, User ID / Chat ID whitelist, Firebase Auth check on admin pages.
3. Execution & Decomposition:
   - Create your initial `plan.md`, `progress.md`, and `BRIEFING.md` in `.agents/orchestrator_2/`.
   - Spawn specialized subagents (e.g. explorer, worker/implementer, reviewer, challenger) according to teamwork conventions. Each subagent must have its own directory under `.agents/`.
   - Ensure lint and build pass without regressions.
   - When finished and all acceptance criteria are verified, report completion to the Sentinel so independent Victory Audit can run.

## 2026-09-03T08:57:13Z

[From Parent Sentinel]:
Telegram Bot Credentials & Whitelist Provided:
- `TELEGRAM_BOT_TOKEN=8768883845:AAEL32mZnUw8GG3ZrqeeENbTgs5ZRS87Vdk`
- `TELEGRAM_ALLOWED_USER_ID=2050406425`
Incorporate into `PROJECT.md` and relevant milestone specifications.
