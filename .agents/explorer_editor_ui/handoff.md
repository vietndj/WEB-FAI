# Handoff Report: Investigation of WordPress-Grade Editor & Auth (R3 & R4)

**Agent**: `explorer_editor_ui`  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_editor_ui`  
**Target Project**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Handoff Type**: Hard (Investigation Phase Complete)

---

## 1. Observation

### 1.1 Admin Posts Editor
- **File**: `src/app/admin/posts/new/page.js` (lines 89-92, 156-176) & `src/app/admin/posts/[id]/page.js` (lines 112-115, 180-200):
  ```javascript
  const execCmd = (cmd, arg = null) => {
    document.execCommand(cmd, false, arg);
    editorRef.current.focus();
  };
  ```
  The editor uses a basic `contentEditable` `div` with `document.execCommand`. The only toolbar buttons provided are: B, I, H3, • List, 1. List, "Quote", Link.
- **Missing Elements**: No H2 or H4 headings, no divider (`<hr>`), no text alignment options (left, center, right, justify), no bubble/floating selection toolbar, no inline image upload/insertion with captions, and no live preview capability.
- **State Handling**: Content is read synchronously on save via `editorRef.current.innerHTML` (`new/page.js:97`, `[id]/page.js:120`). In `[id]/page.js:77`, it is initialized via `editorRef.current.innerHTML = postData.contentHtml || '';`. Changes are not tracked in React state during typing.
- **Image Upload in Editor**: In `src/lib/firestore.js:284-291`, `uploadImage(file)` uses `FileReader.readAsDataURL(file)` to convert images into Base64 strings.

### 1.2 Firebase Auth Protection
- **File**: `src/app/admin/layout.js` (lines 16-26, 42-48):
  ```javascript
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else if (!pathname.startsWith('/admin/login')) {
        router.push('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, pathname]);
  ```
  Unauthenticated visits to `/admin/posts/[id]` or any `/admin/*` route trigger a client-side redirect to `/admin/login`.
- **Security Gap**: `src/app/admin/login/page.js:19-28` executes `signInWithPopup(auth, new GoogleAuthProvider())` with no email domain or whitelist verification. Any Google account can access CMS admin pages.

### 1.3 `/doi-song` Public Page and Modal Rendering
- **File**: `src/app/doi-song/page.js` (lines 601-714):
  Article detail is rendered in a fixed modal overlay (`rgba(5, 12, 26, 0.85)` + `backdropFilter: 'blur(8px)'`), inside an 850px-wide white card (`borderRadius: '24px'`).
  Article body is rendered at line 681:
  ```jsx
  <div 
    className="article-body-html"
    style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155' }}
    dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml || `<p>${selectedPost.excerpt}</p>` }}
  />
  ```
- **Styling Vacuum**: Ripgrep search for `article-body-html` across the codebase returns ONLY line 681 of `doi-song/page.js`. Zero CSS rules exist for this class.
- **Broken List Reset**: `src/app/globals.css:357` specifies:
  ```css
  ul, ol {
    list-style: none;
  }
  ```
  All bulleted and numbered lists rendered in `.article-body-html` lose their bullets and numbers unless explicitly restored with `list-style: disc !important;` / `list-style: decimal !important;`.
- **Active Font Thread Rule**: `src/app/globals.css` is currently modified by a parallel thread (conversation `68e35354-1360-4e56-88eb-b75f5b3d996d`). We must NOT edit `src/app/globals.css`.

### 1.4 TipTap Ecosystem Compatibility
- **Environment**: Next.js `16.2.9`, React `19.2.4`, Firebase `12.17.1`, Lucide-react `1.21.0`.
- **Command Output**:
  - `npm view @tiptap/react peerDependencies`: Supports `^17.0.0 || ^18.0.0 || ^19.0.0`.
  - `npm install --dry-run @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-bubble-menu @tiptap/extension-link @tiptap/extension-placeholder`: Succeeded with 0 conflicts, 57 packages added.
  - In TipTap v3 (`3.31.1`), `BubbleMenu` is exported from `@tiptap/react/menus`.
  - In Next.js App Router, `immediatelyRender: false` must be passed to `useEditor` to prevent SSR hydration errors.

---

## 2. Logic Chain

1. **Premise 1**: The existing `contentEditable` + `document.execCommand` implementation is deprecated, lacks essential block types (H2, H4, alignment, divider), does not support inline images with captions or bubble menus, and has no live preview (Observation 1.1).  
   $\rightarrow$ Therefore, upgrading to TipTap v3 is necessary and solves all editorial requirements specified in R3.
2. **Premise 2**: TipTap packages natively support React 19 and Next.js 16 without peer dependency errors (Observation 1.4).  
   $\rightarrow$ Therefore, installation can proceed cleanly with npm without breaking existing dependencies.
3. **Premise 3**: In Next.js App Router, TipTap's default client-side DOM manipulation causes hydration mismatches if rendered immediately during SSR (Observation 1.4).  
   $\rightarrow$ Therefore, setting `immediatelyRender: false` in `useEditor` is required to ensure 100% hydration safety.
4. **Premise 4**: Global CSS resets `ul, ol { list-style: none; }` and `.article-body-html` has no CSS definitions in the codebase (Observation 1.3).  
   $\rightarrow$ Therefore, rich content (lists, blockquotes, headings, images, captions) will render broken or unstyled in `/doi-song` unless dedicated typography CSS is provided.
5. **Premise 5**: Modifying `src/app/globals.css` risks merge conflicts with the active font thread (Observation 1.3).  
   $\rightarrow$ Therefore, all typography rules for `.article-body-html` and `.article-figure` must be placed in an isolated stylesheet `src/app/doi-song/article.css` and imported directly by `src/app/doi-song/page.js` and `src/app/admin/admin.css`.
6. **Premise 6**: The admin route guard in `src/app/admin/layout.js` protects all `/admin/*` pages client-side via Firebase `onAuthStateChanged`, but permits any Google account without checking a whitelist (Observation 1.2).  
   $\rightarrow$ Therefore, R4 requires adding an email whitelist check to prevent unauthorized Google accounts from modifying posts.

---

## 3. Caveats

1. **Storage Dependency**: Inline image uploads in TipTap depend on Milestone 1 (M1 - Cloud Storage & Watermarking Pipeline). While M1 is being implemented, TipTap can support image insertion via external image URL, and can easily connect to `uploadImage` once M1's storage endpoint is active.
2. **Server-Side Rendering (SSR) Guard**: TipTap cannot run on the server. The `TipTapEditor` component MUST have `'use client';` and `immediatelyRender: false`.
3. **Email Whitelist Storage**: If an admin email whitelist is enforced, it can be defined in `.env.local` (`NEXT_PUBLIC_ADMIN_EMAILS`) or directly in Firestore.

---

## 4. Conclusion

- **R3 (Editor & Preview)** is fully mapped and ready for Milestone 3:
  - Install TipTap packages: `@tiptap/react`, `@tiptap/pm`, `@tiptap/starter-kit`, `@tiptap/extension-text-align`, `@tiptap/extension-bubble-menu`, `@tiptap/extension-image`, `@tiptap/extension-link`, `@tiptap/extension-underline`, `@tiptap/extension-placeholder`.
  - Create `src/app/doi-song/article.css` for isolated, conflict-free article styling (fixing the broken lists issue and styling headings, blockquotes, and figures).
  - Create reusable `TipTapEditor` with top Gutenberg toolbar, selection Bubble Menu, custom image with caption node, and dual Edit / Live Preview tabs.
  - Create `ArticlePreviewModal` matching the exact `/doi-song` modal card.
  - Refactor `src/app/admin/posts/new/page.js` and `src/app/admin/posts/[id]/page.js` to use `TipTapEditor`.
- **R4 (Auth)**:
  - Existing `AdminLayout` route guard ensures `/admin/posts/[id]` cannot be viewed without Firebase login.
  - Harden by adding whitelist validation and preserving return URL.

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Check TipTap Compatibility**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npm view @tiptap/react peerDependencies
   npm install --dry-run @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-image @tiptap/extension-text-align @tiptap/extension-bubble-menu @tiptap/extension-link @tiptap/extension-placeholder
   ```
2. **Inspect Current Editor in Admin**:
   ```bash
   grep -n "contentEditable" src/app/admin/posts/new/page.js src/app/admin/posts/\[id\]/page.js
   ```
3. **Inspect List Reset and Missing Article CSS**:
   ```bash
   grep -n "list-style: none" src/app/globals.css
   grep -rn "article-body-html" src/app/
   ```
4. **Inspect Auth Guard**:
   ```bash
   cat src/app/admin/layout.js | grep -A 15 "onAuthStateChanged"
   ```
5. **Verify Local Dev Server**:
   ```bash
   curl -I http://localhost:3000/doi-song
   curl -I http://localhost:3000/admin/posts
   ```
