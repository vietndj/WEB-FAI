# BRIEFING — 2026-09-03T09:50:00Z

## Mission
Implement Milestone 3: WordPress-Grade CMS TipTap Editor Interface & Live Preview Modal for FAI Admin and Doi Song public page.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3
- Original parent: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Milestone: Milestone 3 (CMS TipTap Editor & Live Preview)

## 🔒 Key Constraints
- Strict Local Development Only: TẠM THỜI KHÔNG tự động chạy git commit / git push, KHÔNG deploy lên Vercel Production.
- DO NOT TOUCH: src/app/globals.css, public/fonts/*, src/app/lien-he/page.js, src/components/ScholarshipFormSection.jsx, Arena100hFormSection.jsx, Skillking100hFormSection.jsx.
- useEditor hook MUST pass immediatelyRender: false to avoid Next.js App Router SSR hydration mismatches.
- Overcome global reset in globals.css:357 (ul, ol { list-style: none; }) using scoped .article-body-html ul/ol/li with !important.
- Clean semantic HTML output to Firestore collection 'posts'.
- ESLint and npm run build must succeed with 0 errors.

## Current Parent
- Conversation ID: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Updated: 2026-09-03T09:50:00Z

## Task Summary
- **What to build**: TipTap Editor component, article typography CSS, Live Preview modal, integrate with /admin/posts/new and /admin/posts/[id], import article.css into /doi-song.
- **Success criteria**: TipTap fully functional (top toolbar, bubble menu, image upload to R2 via /api/upload, formatting, lists, quotes, tables/dividers), live preview modal matching /doi-song, admin pages upgraded, build & eslint pass.

## Change Tracker
- **Files modified**:
  - `fai/package.json` & `package-lock.json`: Added TipTap dependencies
  - `fai/src/app/doi-song/article.css`: Created isolated article typography styles scoped under `.article-body-html`
  - `fai/src/app/doi-song/page.js`: Imported `article.css` and cleaned up `PostCardImage`
  - `fai/src/app/admin/admin.css`: Imported `article.css` and added TipTap editor styles
  - `fai/src/components/admin/TipTapEditor.jsx`: Created Gutenberg-style editor with Bubble Menu, CustomImage, and `/api/upload` integration
  - `fai/src/components/admin/ArticlePreviewModal.jsx`: Created Live Preview modal matching `/doi-song` modal card
  - `fai/src/app/admin/posts/new/page.js`: Upgraded to TipTapEditor + Live Preview button
  - `fai/src/app/admin/posts/[id]/page.js`: Upgraded to TipTapEditor + Live Preview button
  - `fai/scripts/verify-empirical-m3.mjs`: Comprehensive verification suite (47/47 passing)
- **Build status**: PASS (Next.js 16.2.9 Turbopack build 34/34 routes in 3.7s, 0 errors)
- **Pending issues**: None

## Quality Status
- **Build/test result**: 47/47 empirical tests passed; `npm run build` succeeded with 0 errors.
- **Lint status**: `npx eslint` passed with 0 errors and 0 warnings.
- **Tests added/modified**: `scripts/verify-empirical-m3.mjs`

## Artifact Index
- `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/doi-song/article.css` — Scoped article typography
- `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/components/admin/TipTapEditor.jsx` — TipTap Editor Component
- `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/components/admin/ArticlePreviewModal.jsx` — Live Preview Modal
- `/Users/vietmac/Documents/CODE/WEB- FAI/fai/scripts/verify-empirical-m3.mjs` — Test verification suite
- `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3/handoff.md` — Final handoff report
