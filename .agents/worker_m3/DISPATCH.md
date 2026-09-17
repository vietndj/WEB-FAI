## 2026-09-03T09:44:06Z
You are worker_m3, the implementation worker subagent for Milestone 3 (WordPress-Grade CMS TipTap Editor Interface & Live Preview).
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3
Project source code directory is: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY FIRST STEP:
You MUST read:
1. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T08:50:15Z)
2. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_2/PROJECT.md
3. /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_editor_ui/handoff.md and analysis.md

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

STRICT CONSTRAINTS:
1. Strict Local Development Only: TẠM THỜI KHÔNG tự động chạy git commit / git push, KHÔNG deploy lên Vercel Production.
2. DO NOT TOUCH: src/app/globals.css, public/fonts/*, src/app/lien-he/page.js, src/components/ScholarshipFormSection.jsx, Arena100hFormSection.jsx, Skillking100hFormSection.jsx.

YOUR SCOPE FOR MILESTONE 3:
1. Install TipTap dependencies in fai/:
   npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-heading @tiptap/extension-text-align @tiptap/extension-bubble-menu @tiptap/extension-image @tiptap/extension-link @tiptap/extension-underline @tiptap/extension-placeholder
   (Note: in useEditor hook, always pass immediatelyRender: false to avoid Next.js App Router SSR hydration mismatches).

2. Isolated Typography Stylesheet (src/app/doi-song/article.css):
   Create src/app/doi-song/article.css:
   - Provide complete typography styles scoped under .article-body-html.
   - CRITICAL: Overcome the global reset in globals.css:357 (ul, ol { list-style: none; }) by explicitly defining:
     .article-body-html ul { list-style: disc !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
     .article-body-html ol { list-style: decimal !important; padding-left: 1.5rem !important; margin: 1rem 0 !important; }
     .article-body-html li { margin-bottom: 0.5rem !important; }
   - Style h2, h3, h4 with hierarchy, margins, line-height, and FAI branding colors.
   - Style blockquote with left border accent, background tint, padding, and italic text.
   - Style hr divider.
   - Style figure and figcaption for inline images with captions.
   - Import src/app/doi-song/article.css into src/app/doi-song/page.js.

3. TipTap Editor Component (src/components/admin/TipTapEditor.jsx):
   Create src/components/admin/TipTapEditor.jsx ('use client';):
   - Gutenberg-style top toolbar with buttons:
     - Headings (H2, H3, H4), Paragraph
     - Bold, Italic, Underline, Strike, Code
     - Align Left, Center, Right, Justify
     - Bullet List, Ordered List
     - Blockquote, Horizontal Rule (Divider)
     - Insert Image: file picker that uploads image to /api/upload (storing to Cloudflare R2 and getting public URL), then inserts image with caption. Also supports image URL.
     - Undo, Redo
   - Selection Floating Toolbar / Bubble Menu (using @tiptap/react/menus or BubbleMenu):
     - Appears when text is highlighted: Bold, Italic, Underline, Strike, Link, Code.
   - Props: { value, onChange, placeholder }.

4. Live Preview Modal (src/components/admin/ArticlePreviewModal.jsx):
   Create src/components/admin/ArticlePreviewModal.jsx:
   - Matches the exact design of the public /doi-song modal card:
     - 850px max width, white card, rounded 24px, dark backdrop overlay.
     - Banner image, category badge, publication date, reading time, author.
     - Article body rendered inside <div className="article-body-html"> with article.css styles.
     - Close button and keyboard ESC to close.

5. Upgrade Admin Pages:
   - src/app/admin/posts/new/page.js:
     Replace the old contentEditable + execCommand editor with TipTapEditor.
     Add a "Xem trước (Live Preview)" button that opens ArticlePreviewModal with current form data.
   - src/app/admin/posts/[id]/page.js:
     Replace the old contentEditable + execCommand editor with TipTapEditor.
     Add a "Xem trước (Live Preview)" button that opens ArticlePreviewModal with current post data.
   - Ensure saving posts continues to write clean semantic HTML to Firestore collection 'posts'.

6. Verification:
   - Verify TipTapEditor renders cleanly on /admin/posts/new and /admin/posts/[id].
   - Verify Bubble Menu activates on text selection.
   - Verify image insertion with caption works.
   - Verify lists render with disc bullets and numbers inside .article-body-html.
   - Verify Live Preview modal matches /doi-song modal.
   - Run npx eslint on all created and modified files.
   - Run npm run build (must succeed with 0 errors).
