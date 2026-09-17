# Project: FAI Web Telegram Bot Publishing & WordPress-Grade Editor

## Architecture
```
                        +---------------------------------------------+
                        |           Telegram Messenger (User)         |
                        +---------------------------------------------+
                                       |              ^
                 Webhook Update (POST) |              | Inline Keyboards / Messages
                                       v              |
                     +--------------------------------------+
                     |  /api/telegram/webhook/route.js      |
                     |  - Secret Token Validation (R4)      |
                     |  - Whitelist User Check (R4)         |
                     +--------------------------------------+
                                       |
                +----------------------+----------------------+
                |                                             |
                v                                             v
+-------------------------------+             +-------------------------------+
|     src/lib/gemini.js         |             |   src/lib/imageProcessor.js   |
| - Gemini 2.5 Flash            |             | - Sharp resize <= 1600px      |
| - 2 Distinct Article Options  |             | - Compress WebP < 350KB       |
| - Rich Semantic HTML          |             | - Watermark logo_fpt_fai.png  |
+-------------------------------+             +-------------------------------+
                |                                             |
                v                                             v
+-------------------------------+             +-------------------------------+
|     Firestore Database        | <---------- |     src/lib/cloudStorage.js   |
| - telegram_sessions           |             | - Cloudflare R2 (S3 client)   |
| - posts (Zero Base64)         |             | - Public CDN URL              |
| - categories ('doi-song')     |             +-------------------------------+
+-------------------------------+                             |
                |                                             |
                +----------------------+                      |
                                       |                      |
                                       v                      v
+-----------------------------------------------------------------------------+
|                               Web Interfaces                                |
|  1. Public: /doi-song (Renders posts, modal reader, isolated article.css)    |
|  2. Admin:  /admin/posts/[id] & /admin/posts/new                            |
|             (WordPress-Grade TipTap Editor, Bubble Menu, Live Preview)      |
|  3. Upload API: /api/upload (Web image upload & optimization)               |
+-----------------------------------------------------------------------------+
```

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F1 | Cloudflare R2 Cloud Storage | S3 Client module for R2 bucket `vietndjmedia`, returning public CDN URLs | M1 | ORIGINAL_REQUEST R1 |
| F2 | Server-Side Image Optimization & Watermark | Sharp pipeline: max-width 1600px, WebP compression <350KB, dynamic watermark `public/logo_fpt_fai.png` at 85% opacity bottom-right | M1 | ORIGINAL_REQUEST R1 |
| F3 | Unified Upload API Route | `src/app/api/upload/route.js` handling multipart uploads from admin & editor | M1 | ORIGINAL_REQUEST R1 |
| F4 | Base64 Elimination in Firestore | Refactor `uploadImage` in `src/lib/firestore.js` to upload to R2 and return public URL | M1 | ORIGINAL_REQUEST R1 |
| F5 | Telegram Webhook & Zero-Dependency Client | `src/app/api/telegram/webhook/route.js` and `src/lib/telegram.js` native fetch wrapper | M2 | ORIGINAL_REQUEST R2 |
| F6 | Dynamic Firestore Categories Keyboard | Query `categories` where `group == 'doi-song'`, render Telegram inline keyboard | M2 | ORIGINAL_REQUEST R2 |
| F7 | Gemini 2.5 Flash Dual-Option Generation | Multimodal prompt taking photo + text outline, outputting 2 complete articles with semantic HTML | M2 | ORIGINAL_REQUEST R2 |
| F8 | Interactive Telegram Publishing Session | Multi-step state machine in `telegram_sessions`, publishes chosen option to Firestore `posts` | M2 | ORIGINAL_REQUEST R2 |
| F9 | WordPress-Grade TipTap CMS Editor | Full TipTap v3 editor component with headings (H2-H4), blockquote, lists, divider, text align, Bubble Menu | M3 | ORIGINAL_REQUEST R3 |
| F10 | Inline Image Insertion with Caption | TipTap custom figure/figcaption node with image upload and caption editing | M3 | ORIGINAL_REQUEST R3 |
| F11 | Isolated Typography Stylesheet | `src/app/doi-song/article.css` resolving list reset from globals.css without modifying globals.css | M3 | ORIGINAL_REQUEST R3 |
| F12 | Exact Live Preview Modal | Real-time preview tab in admin editor matching `/doi-song` modal design 1:1 | M3 | ORIGINAL_REQUEST R3 |
| F13 | Telegram Webhook Security & Whitelist | Secret token header validation and `TELEGRAM_ALLOWED_USER_ID` authorization check | M4 | ORIGINAL_REQUEST R4 |
| F14 | Admin Route Auth Guard Verification | Verify and harden Firebase Auth protection on all `/admin/posts/*` routes | M4 | ORIGINAL_REQUEST R4 |
| F15 | End-to-End System Verification & Lint/Build | Comprehensive integration testing, local live test on port 3000, zero lint/build errors | M4 | ORIGINAL_REQUEST Acceptance |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Cloud Storage & Image Optimization Pipeline | F1, F2, F3, F4: R2 storage client, Sharp image optimization & watermarking, upload API route, Base64 elimination in Firestore | none | DONE (Verified: WebP <350KB, R2 CDN 200 OK, 0 Base64) |
| M2 | Telegram Bot Webhook & AI 2-Option Publishing Flow | F5, F6, F7, F8: Webhook route handler, Telegram client, Gemini 2.5 Flash prompt, session management, Firestore publishing | M1 | DONE (Verified: Secret token 401, Whitelist, 5 categories, Gemini 2.5 Flash, R2 pipeline, Firestore posts) |
| M3 | WordPress-Grade CMS Editor Interface | F9, F10, F11, F12: TipTap editor component, bubble toolbar, inline image captions, article.css typography, live preview modal | M1 | DONE (Verified: TipTap v3, Bubble Menu, article.css, Live Preview modal, 0 Base64) |
| M4 | Security, E2E Integration & Live Verification | F13, F14, F15: Secret token check, user whitelist, auth guards, local live verification, build & lint verification | M1, M2, M3 | DONE (Verified: 100% Acceptance Criteria Met, Audit CLEAN, 0 Errors) |

## Interface Contracts

### 1. Image Processor & Storage (`src/lib/imageProcessor.js`, `src/lib/cloudStorage.js`)
- `processImage(inputBuffer, options)`:
  - Input: `inputBuffer` (Buffer), `options` (`{ maxWidth: 1600, quality: 82, watermark: true }`)
  - Output: `Promise<{ buffer: Buffer, format: 'webp', width: number, height: number, sizeBytes: number }>`
- `uploadToStorage(buffer, filename, contentType)`:
  - Input: `buffer` (Buffer), `filename` (string), `contentType` (string, e.g. `'image/webp'`)
  - Output: `Promise<{ url: string, key: string }>` (Public CDN URL)

### 2. Upload API Route (`/api/upload`)
- Method: `POST` (multipart/form-data with field `'file'`)
- Headers: Optional auth token
- Response (200 OK): `{ success: true, url: string, sizeBytes: number, format: 'webp' }`
- Response (400/500): `{ success: false, error: string }`

### 3. Telegram Webhook (`/api/telegram/webhook`)
- Method: `POST`
- Headers: `X-Telegram-Bot-Api-Secret-Token: <TELEGRAM_WEBHOOK_SECRET>`
- Body: Telegram `Update` object
- Response: `200 OK` (immediately acknowledges or handles update)

### 4. Gemini 2.5 Flash Article Generator (`src/lib/gemini.js`)
- `generateArticleOptions(photoBuffer, mimeType, userNotes)`:
  - Input: `photoBuffer` (Buffer | null), `mimeType` (string | null), `userNotes` (string)
  - Output: `Promise<{ option1: ArticleOption, option2: ArticleOption }>`
  - `ArticleOption`: `{ title: string, excerpt: string, readTime: string, contentHtml: string }`

### 5. TipTap Editor Component (`src/components/admin/TipTapEditor.jsx`)
- Props:
  - `content`: string (initial HTML)
  - `onChange`: `(html: string) => void`
  - `placeholder`: string
- Features: Gutenberg top toolbar, selection Bubble Menu, inline image upload via `/api/upload`, caption support.

### 6. Isolated Typography (`src/app/doi-song/article.css`)
- Scope class: `.article-body-html`
- Rules: Explicit list styles (`disc`, `decimal`), margins, blockquote borders and background, H2-H4 typography, figure & figcaption styling.

## Code Layout & Write Ownership
- **Milestone 1 Owner**:
  - `src/lib/imageProcessor.js` (NEW)
  - `src/lib/cloudStorage.js` (NEW)
  - `src/app/api/upload/route.js` (NEW)
  - `src/lib/firestore.js` (MODIFIED: `uploadImage` function only)
  - `.env.local` (APPEND: R2 credentials)
- **Milestone 2 Owner**:
  - `src/lib/telegram.js` (NEW)
  - `src/lib/gemini.js` (NEW)
  - `src/app/api/telegram/webhook/route.js` (NEW)
  - `.env.local` (APPEND: Telegram & Gemini credentials)
- **Milestone 3 Owner**:
  - `src/app/doi-song/article.css` (NEW)
  - `src/components/admin/TipTapEditor.jsx` (NEW)
  - `src/components/admin/ArticlePreviewModal.jsx` (NEW)
  - `src/app/admin/posts/new/page.js` (MODIFIED)
  - `src/app/admin/posts/[id]/page.js` (MODIFIED)
  - `src/app/doi-song/page.js` (MODIFIED: import `article.css`)
- **Milestone 4 Owner**:
  - Verification test scripts & security validation.
- **RESTRICTED FILES (DO NOT TOUCH)**:
  - `src/app/globals.css` (Owned by parallel font thread)
  - `public/fonts/*` (Owned by parallel font thread)
  - `src/components/ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, `Skillking100hFormSection.jsx`, `src/app/lien-he/page.js`
