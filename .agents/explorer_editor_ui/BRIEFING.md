# BRIEFING — 2026-09-03T15:58:10+07:00

## Mission
Investigate R3 & R4: WordPress-Grade CMS Rich Editorial Interface (TipTap) & Auth for Admin Posts and synchronization with /doi-song modal.

## 🔒 My Identity
- Archetype: explorer
- Roles: investigation, synthesis
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_editor_ui
- Original parent: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Milestone: Investigation R3 & R4

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Follow Rule 1 & Rule 2 (system prompt protection)
- Avoid file conflicts with parallel font thread (DO NOT touch globals.css)
- No git commit / push, no deploy

## Current Parent
- Conversation ID: df6c1b63-ee58-4cad-81f0-63b8dcee5b36
- Updated: 2026-09-03T15:58:10+07:00

## Investigation State
- **Explored paths**:
  - `src/app/admin/posts/new/page.js` & `src/app/admin/posts/[id]/page.js`
  - `src/app/admin/layout.js`, `src/app/admin/admin.css`, `src/app/admin/login/page.js`
  - `src/app/doi-song/page.js` (lines 601-714 modal)
  - `src/app/globals.css` (reset and typography lines 357, 5380-5550)
  - TipTap v3 packages compatibility with React 19 & Next.js 16
- **Key findings**:
  - Current editor is deprecated `contentEditable` + `document.execCommand` with minimal buttons.
  - Image upload currently converts files to Base64 data URLs in Firestore.
  - Auth guard exists in `AdminLayout` via `onAuthStateChanged`, but lacks email whitelist.
  - `.article-body-html` in `/doi-song` has zero CSS rules, and lists are broken due to `list-style: none` in `globals.css`.
  - To avoid conflict with active font thread, typography should be placed in `src/app/doi-song/article.css` and imported by `doi-song/page.js` and `admin.css`.
  - TipTap packages verified 100% compatible with React 19 via dry-run installation; `immediatelyRender: false` is required in `useEditor`.
- **Unexplored areas**: None. All R3 and R4 requirements thoroughly investigated.

## Key Decisions Made
- Architecture for M3: Create reusable `TipTapEditor`, `ArticlePreviewModal`, and `src/app/doi-song/article.css`.
- Support image captions via custom TipTap Image extension parsing/rendering `<figure class="article-figure"><img ... /><figcaption class="article-caption">...</figcaption></figure>`.
- BubbleMenu imported from `@tiptap/react/menus`.

## Artifact Index
- `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_editor_ui/analysis.md` — Full investigation analysis
- `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_editor_ui/handoff.md` — 5-component handoff report
