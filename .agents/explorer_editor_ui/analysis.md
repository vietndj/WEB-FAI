# Comprehensive Investigation Report: WordPress-Grade CMS Rich Editorial Interface & Auth (R3 & R4)

**Subagent**: `explorer_editor_ui`  
**Date**: 2026-09-03  
**Target Repository**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Focus Area**: R3 (WordPress-Grade CMS TipTap Editor & Live Preview) & R4 (Firebase Auth & Security)

---

## 1. Executive Summary

- **Current Admin Editor Status**: The existing editor in `src/app/admin/posts/new/page.js` and `src/app/admin/posts/[id]/page.js` is a primitive, deprecated `contentEditable` `div` executing `document.execCommand`. It lacks support for multi-level headings (H2, H4), text alignment, dividers, inline image insertion with captions, bubble toolbars, and live preview.
- **Current Image Handling**: Images in the post editor are read into memory and stored directly as huge Base64 data URLs in Firestore documents (`uploadImage` in `src/lib/firestore.js:284-291`), violating production storage best practices.
- **Firebase Auth Guard**: Admin route protection is implemented via `src/app/admin/layout.js` using client-side `onAuthStateChanged`. Unauthenticated users are redirected to `/admin/login`. However, there is no email whitelist (any Google account can sign in), and no return URL preservation.
- **Public `/doi-song` Modal & CSS Vacuum**: The article modal in `src/app/doi-song/page.js:681` renders content inside `<div className="article-body-html">`. There are currently **zero** CSS rules defined for `.article-body-html` in the codebase. Crucially, global CSS (`src/app/globals.css:357`) specifies `ul, ol { list-style: none; }`, which completely strips bullet points and numbers from public articles.
- **Conflict Avoidance Rule**: The parallel font thread is actively editing `src/app/globals.css`. We MUST NOT edit `globals.css`. Instead, all shared typography for articles will be encapsulated in a new scoped stylesheet (`src/app/doi-song/article.css`), imported cleanly by both `/doi-song/page.js` and `admin.css`.
- **TipTap Ecosystem Compatibility**: TipTap v3 (`@tiptap/react@3.31.1`, `@tiptap/starter-kit@3.31.1`, `@tiptap/pm@3.31.1`) is 100% compatible with React 19 (`react: 19.2.4`) and Next.js 16 (`next: 16.2.9`). Dry-run installation succeeded with zero peer dependency conflicts. In Next.js, `immediatelyRender: false` is required to prevent SSR hydration mismatch.

---

## 2. Investigation of `/admin/posts/[id]` and `/admin/posts/new`

### 2.1 File Locations & Code Structure
- `src/app/admin/posts/new/page.js` (274 lines) — Handles creating new posts.
- `src/app/admin/posts/[id]/page.js` (305 lines) — Handles editing existing posts by document ID (`use(params).id`).
- Shared stylesheet: `src/app/admin/admin.css` (346 lines).

### 2.2 Current Inputs and State Management
Both pages maintain a React `formData` state object with the following schema:
```javascript
{
  title: '',          // Text input
  slug: '',           // Text input + auto-generate from title
  categoryId: '',     // Select dropdown (populated from getCategories('doi-song'))
  date: '',           // Text input (format DD-MM-YYYY)
  image: '',          // File input (base64) or manual URL input
  excerpt: '',        // Textarea (short description)
  contentHtml: '',    // Currently read from editorRef.current.innerHTML
  sourceUrl: '',      // Text input (optional link to external press release)
  author: '',         // Text input
  readTime: '',       // Text input (minutes)
  order: 0,           // Number input
  published: false,   // Checkbox (Draft vs Published)
  group: 'doi-song'   // Fixed group identifier
}
```

### 2.3 Current Editor Mechanism & Deficiencies
```javascript
// Lines 89-92 in new/page.js & Lines 112-115 in [id]/page.js:
const execCmd = (cmd, arg = null) => {
  document.execCommand(cmd, false, arg);
  editorRef.current.focus();
};
```
1. **Deprecated API**: `document.execCommand` was deprecated years ago by W3C. In modern browsers (Safari, Chrome, Firefox), it produces inconsistent, non-standard DOM nodes (`<b>` vs `<strong>`, font tags, arbitrary span styles).
2. **Missing Block Types**:
   - Only has H3 (`formatBlock, 'H3'`). Completely missing H2 and H4 headings.
   - Missing divider line (`<hr>`).
   - Missing text alignment (left, center, right, justify).
3. **No Bubble / Floating Toolbar**: Formatting requires scrolling up to the top toolbar every time text is selected.
4. **No Inline Image Insertion with Captions**: Currently, the only image in the post is the single featured cover image in the sidebar. There is zero capability to insert inline editorial photos with captions into the article flow.
5. **No Live Preview**: Authors cannot verify how their article will appear on `/doi-song` before publishing.
6. **State Sync Disconnect**: In `[id]/page.js`, content is set via `editorRef.current.innerHTML = postData.contentHtml || '';` in `useEffect`. Changes in the editor do not reflect in React state until `handleSave` is clicked, making real-time validation or live preview impossible.

---

## 3. Firebase Auth Enforcement & Route Protection (R4)

### 3.1 Auth Guard Implementation in `src/app/admin/layout.js`
All pages under `/admin` (including `/admin/posts`, `/admin/posts/new`, `/admin/posts/[id]`, `/admin/categories`) are wrapped by `AdminLayout`:
```javascript
// src/app/admin/layout.js
export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

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

  if (pathname.startsWith('/admin/login')) return <>{children}</>;
  if (loading) return <div ...>Đang tải...</div>;
  if (!user) return null; // Redirecting

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">...</aside>
      <main className="admin-main-content">{children}</main>
    </div>
  );
}
```

### 3.2 Login Flow in `src/app/admin/login/page.js`
- Uses Firebase `signInWithPopup(auth, new GoogleAuthProvider())`.
- On auth state change, redirects to `/admin`.

### 3.3 Security Assessment & Hardening Recommendations (R4)
1. **Client-side Route Protection**: For Next.js client-rendered admin pages, `onAuthStateChanged` prevents unauthenticated users from rendering the admin layout or interacting with post management.
2. **Missing Access Whitelist**: Currently, ANY valid Google account can log in and manage posts. To fulfill R4 security standards:
   - Introduce an admin email whitelist (e.g. env `ADMIN_ALLOWED_EMAILS` or a Firestore `admins` collection).
   - If `currentUser.email` is not in the whitelist, immediately trigger `signOut(auth)` and display an unauthorized warning: *"Tài khoản của bạn không có quyền truy cập hệ thống CMS FAI."*
3. **Deep-link Return URL**: When an unauthenticated editor clicks a Telegram Bot edit link (`https://.../admin/posts/[id]`), `AdminLayout` redirects to `/admin/login`. After login, `login/page.js` currently routes them to `/admin` instead of returning them to the target post. We should preserve `redirect=/admin/posts/[id]` in search parameters.

---

## 4. Public `/doi-song` Page & Modal Rendering Investigation

### 4.1 Modal Architecture in `src/app/doi-song/page.js`
When a user clicks any article card on `/doi-song`, `setSelectedPost(post)` is triggered, rendering the detail modal (lines 601–714):

```jsx
{/* ARTICLE DETAIL MODAL */}
{selectedPost && (
  <div style={{
    position: 'fixed', inset: 0, zIndex: 9999,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '20px', backgroundColor: 'rgba(5, 12, 26, 0.85)',
    backdropFilter: 'blur(8px)', animation: 'fadeInUp 0.3s ease'
  }} onClick={() => setSelectedPost(null)}>
    <div style={{
      backgroundColor: '#ffffff', color: '#1a2332',
      borderRadius: '24px', maxWidth: '850px', width: '100%',
      maxHeight: '90vh', overflowY: 'auto',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      position: 'relative', display: 'flex', flexDirection: 'column'
    }} onClick={(e) => e.stopPropagation()}>
      
      {/* Sticky Header */}
      <div style={{
        padding: '20px 30px', borderBottom: '1px solid rgba(0,0,0,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'sticky', top: 0, backgroundColor: '#ffffff', zIndex: 10
      }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', letterSpacing: '0.1em' }}>
          {selectedPost.date}
        </span>
        <button onClick={() => setSelectedPost(null)} style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
          <X size={18} />
        </button>
      </div>

      {/* Content Container */}
      <div style={{ padding: '30px 40px 40px 40px' }}>
        {/* Article Headline */}
        <h2 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
          color: 'var(--secondary)', lineHeight: '1.3', marginBottom: '20px',
          fontFamily: 'var(--font-sans)'
        }}>
          {selectedPost.title}
        </h2>

        {/* Featured Image */}
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', marginBottom: '30px' }}>
          <Image src={selectedPost.image} alt={selectedPost.title} fill style={{ objectFit: 'cover' }} />
        </div>

        {/* Article Body HTML */}
        <div 
          className="article-body-html"
          style={{ fontSize: '1.05rem', lineHeight: '1.8', color: '#334155' }}
          dangerouslySetInnerHTML={{ __html: selectedPost.contentHtml || `<p>${selectedPost.excerpt}</p>` }}
        />

        {/* External Source Link */}
        {selectedPost.sourceUrl && (
          <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid rgba(0,0,0,0.08)' }}>
            <a href={selectedPost.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ ... }}>
              Xem bài viết gốc trên trang báo <ArrowRight size={16} />
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
)}
```

### 4.2 The Styling Vacuum & Critical List Reset Bug
1. **Zero CSS for `.article-body-html`**: A search for `article-body-html` in the entire project reveals it appears ONLY on line 681 of `doi-song/page.js`. There are no styling definitions for this class anywhere in the project.
2. **Broken Lists Bug**: In `src/app/globals.css:357`:
   ```css
   ul, ol {
     list-style: none;
   }
   ```
   Because global CSS resets all lists to `list-style: none`, any `<ul>` or `<ol>` inside `selectedPost.contentHtml` renders with NO bullet points or numbers!
3. **Headings, Blockquotes & Images**: Without dedicated CSS rules, headings H2-H4 look unstyled, blockquotes lack the signature FPT Orange border and styling, and inline images risk overflowing or lacking captions.

### 4.3 Safe Styling Strategy (Parallel Thread Isolation)
- **Constraint**: The user explicitly forbade editing `src/app/globals.css` due to the parallel font thread.
- **Solution**: Create a dedicated stylesheet `src/app/doi-song/article.css` and import it directly into:
  - `src/app/doi-song/page.js`
  - `src/app/admin/admin.css`
- This ensures 100% style isolation without touching `globals.css`.

---

## 5. Modern TipTap Editor Integration Architecture

### 5.1 Package Audit & Verification
We verified the compatibility of the TipTap v3 packages with React 19 (`19.2.4`) and Next.js 16 (`16.2.9`):
- `npm view @tiptap/react peerDependencies`: Supports `'^17.0.0 || ^18.0.0 || ^19.0.0'`.
- `npm install --dry-run` succeeded with 57 packages added and 0 conflicts.

**Exact TipTap Packages Required**:
| Package | Version | Purpose |
|---|---|---|
| `@tiptap/react` | `^3.31.1` | React bindings, `useEditor`, `EditorContent` |
| `@tiptap/pm` | `^3.31.1` | ProseMirror core engine wrappers |
| `@tiptap/starter-kit` | `^3.31.1` | Document, Paragraph, Text, Bold, Italic, Strike, Code, Heading, Blockquote, Lists, HorizontalRule, History |
| `@tiptap/extension-heading` | `^3.31.1` | Bundled in StarterKit; configured for levels `[2, 3, 4]` |
| `@tiptap/extension-text-align` | `^3.31.1` | Text alignment (`left`, `center`, `right`, `justify`) via inline styles |
| `@tiptap/extension-bubble-menu`| `^3.31.1` | Floating context toolbar on text selection |
| `@tiptap/extension-image` | `^3.31.1` | Inline image insertion and rendering |
| `@tiptap/extension-link` | `^3.31.1` | Hyperlink insertion (`openOnClick: false`) |
| `@tiptap/extension-underline` | `^3.31.1` | Underline formatting (`<u>`) |
| `@tiptap/extension-placeholder`| `^3.31.1` | Ghost placeholder text when editor is empty |

### 5.2 Next.js SSR Hydration Safeguard
To prevent React hydration mismatch errors in Next.js 16:
```javascript
const editor = useEditor({
  extensions: [...],
  content: initialContent,
  immediatelyRender: false, // MANDATORY for Next.js SSR safety
  onUpdate: ({ editor }) => {
    onChange(editor.getHTML());
  },
});
```

### 5.3 Inline Image with Caption Architecture
To support image captions cleanly without breaking standard HTML rendering:
We create a custom extension extending `Image`:
```javascript
import Image from '@tiptap/extension-image';

export const CustomImage = Image.extend({
  name: 'customImage',
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: {
        default: '',
        parseHTML: element => {
          const figcaption = element.querySelector('figcaption');
          return figcaption ? figcaption.textContent : (element.getAttribute('data-caption') || element.getAttribute('title') || '');
        },
        renderHTML: attributes => {
          if (!attributes.caption) return {};
          return { 'data-caption': attributes.caption, title: attributes.caption };
        },
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    const { caption, ...imgAttrs } = HTMLAttributes;
    if (caption) {
      return [
        'figure',
        { class: 'article-figure' },
        ['img', imgAttrs],
        ['figcaption', { class: 'article-caption' }, caption],
      ];
    }
    return ['img', imgAttrs];
  },
  parseHTML() {
    return [
      {
        tag: 'figure',
        getAttrs: element => {
          const img = element.querySelector('img');
          const figcaption = element.querySelector('figcaption');
          if (!img) return false;
          return {
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt'),
            caption: figcaption ? figcaption.textContent : '',
          };
        },
      },
      {
        tag: 'img[src]',
        getAttrs: element => ({
          src: element.getAttribute('src'),
          alt: element.getAttribute('alt'),
          caption: element.getAttribute('data-caption') || element.getAttribute('title') || '',
        }),
      },
    ];
  },
});
```
**Benefits**:
1. Renders clean semantic HTML: `<figure class="article-figure"><img src="..." alt="..." /><figcaption class="article-caption">Chú thích</figcaption></figure>`.
2. Fully backwards-compatible with standard `<img>` tags and AI-generated articles.
3. Renders identically in both the admin Live Preview and the `/doi-song` modal.

### 5.4 Bubble Menu / Floating Toolbar
In `@tiptap/react@3.31.1`, BubbleMenu is imported from `@tiptap/react/menus`:
```jsx
import { BubbleMenu } from '@tiptap/react/menus';

{editor && (
  <BubbleMenu editor={editor} tippyOptions={{ duration: 150, placement: 'top' }}>
    <div className="admin-bubble-menu">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'active' : ''}><Bold size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'active' : ''}><Italic size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={editor.isActive('underline') ? 'active' : ''}><Underline size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'active' : ''}><Strikethrough size={15} /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'active' : ''}><Code size={15} /></button>
      <button type="button" onClick={handleLinkPrompt} className={editor.isActive('link') ? 'active' : ''}><Link size={15} /></button>
    </div>
  </BubbleMenu>
)}
```

### 5.5 Fixed Top Toolbar
A WordPress Gutenberg-style top toolbar structured in functional groups:
1. **History**: Undo (`Undo`), Redo (`Redo`)
2. **Hierarchy**: Heading 2 (`H2`), Heading 3 (`H3`), Heading 4 (`H4`), Normal Text (`P`)
3. **Inline Formatting**: Bold (`B`), Italic (`I`), Underline (`U`), Strike (`S`), Inline Code (`Code`)
4. **Lists**: Bullet List (`• List`), Numbered List (`1. List`)
5. **Callout**: Blockquote (`"Quote"`)
6. **Divider**: Horizontal Rule (`Divider`)
7. **Alignment**: Left, Center, Right, Justify
8. **Media**: Insert Image (URL / Upload + Caption)
9. **Link**: Insert / Edit Link
10. **Live Preview Switcher**: Toggle between "Soạn thảo" and "Xem trước (Live Preview)"

---

## 6. Real-Time Live Preview Matching `/doi-song` Modal

### 6.1 Dual-View Experience
To give the editorial team maximum agility, we recommend two complementary preview modes:
1. **Inline Tab Toggle**: Switch effortlessly between `[ Soạn thảo ]` and `[ Xem trước ]` right within the main editor card.
2. **Fullscreen Modal Preview**: A dedicated "Xem trước Modal Đời Sống" button that renders the post inside the EXACT backdrop-filtered overlay (`rgba(5, 12, 26, 0.85)` + `backdropFilter: blur(8px)`), with the exact modal card (850px max-width, 24px border-radius, date badge, close button, title, featured cover, body HTML, and source button).

### 6.2 Pixel-Perfect Unified CSS Specification
Saved in `src/app/doi-song/article.css`:
```css
/* Unified Article Content Typography for /doi-song and Admin Live Preview */
.article-body-html {
  font-family: var(--font-sans), sans-serif;
  font-size: 1.05rem;
  line-height: 1.85;
  color: #334155;
  word-break: break-word;
}

.article-body-html p {
  margin-top: 0;
  margin-bottom: 1.25rem;
}

.article-body-html h2 {
  font-family: var(--font-sans), sans-serif;
  font-size: clamp(1.4rem, 2.5vw, 1.85rem);
  font-weight: 800;
  color: var(--secondary, #0D2137);
  margin-top: 2.25rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

.article-body-html h3 {
  font-family: var(--font-sans), sans-serif;
  font-size: clamp(1.2rem, 2vw, 1.45rem);
  font-weight: 700;
  color: var(--secondary, #0D2137);
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  line-height: 1.35;
}

.article-body-html h4 {
  font-family: var(--font-sans), sans-serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--secondary, #0D2137);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.article-body-html blockquote {
  border-left: 4px solid var(--primary, #E8741E);
  background: #f8fafc;
  padding: 16px 24px;
  margin: 1.75rem 0;
  border-radius: 0 12px 12px 0;
  font-style: italic;
  font-size: 1.125rem;
  color: #1e293b;
  line-height: 1.65;
}

.article-body-html blockquote p {
  margin-bottom: 0;
}

/* Explicit list restoration overriding global reset */
.article-body-html ul {
  list-style: disc !important;
  padding-left: 1.75rem !important;
  margin-top: 0;
  margin-bottom: 1.25rem;
}

.article-body-html ol {
  list-style: decimal !important;
  padding-left: 1.75rem !important;
  margin-top: 0;
  margin-bottom: 1.25rem;
}

.article-body-html li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.article-body-html li p {
  margin-bottom: 0.25rem;
}

.article-body-html hr {
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 2.25rem 0;
}

.article-body-html a {
  color: var(--primary, #E8741E);
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.2s;
}

.article-body-html a:hover {
  color: var(--primary-hover, #c85f0e);
}

.article-body-html code {
  background: #f1f5f9;
  color: #0f172a;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 0.9em;
}

.article-body-html figure.article-figure,
.article-body-html figure {
  margin: 2rem 0;
  text-align: center;
}

.article-body-html figure img,
.article-body-html img {
  max-width: 100%;
  height: auto;
  border-radius: 12px;
  display: block;
  margin: 0 auto;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.article-body-html figcaption.article-caption,
.article-body-html figcaption {
  font-size: 0.875rem;
  color: #64748b;
  font-style: italic;
  margin-top: 0.5rem;
  text-align: center;
}
```

---

## 7. Implementation Roadmap & Blueprint for Milestone 3 & 4

### Proposed Component Decomposition
1. `src/app/doi-song/article.css`: Unified typography rules (safe from font thread conflict).
2. `src/components/admin/TipTapEditor.jsx`: Full-featured TipTap wrapper with top toolbar, bubble menu, custom image extension, and tabs for Edit vs Preview.
3. `src/components/admin/ArticlePreviewModal.jsx`: Reusable modal preview component replicating `/doi-song` modal.
4. Refactor `src/app/admin/posts/new/page.js` and `src/app/admin/posts/[id]/page.js`: Replace the `contentEditable` div with `<TipTapEditor content={formData.contentHtml} onChange={...} />`.
5. Auth hardening in `src/app/admin/layout.js`: Add admin email whitelist checking and return URL handling.
