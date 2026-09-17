# Project: Telegram Bot Interaction, Local Polling Bridge, Gemini Fallback Pipeline & FPT Aptech Integration

## Architecture
- **Inbound Bridge**: Standalone long-polling worker (`scripts/telegram-polling-bridge.mjs`) continuously polls Telegram (`https://api.telegram.org/bot<TOKEN>/getUpdates`) using IPv4-first and forwards updates to `http://localhost:3000/api/telegram/webhook` with the secret token header.
- **Outbound Telegram Engine**: `src/lib/telegram.js` configured with `dns.setDefaultResultOrder('ipv4first')`, `https.Agent({ family: 4, keepAlive: true, rejectUnauthorized: false })` to eliminate macOS 15s IPv6 timeouts and resolve callback queries in < 1s.
- **Content Generation Pipeline**: `src/lib/gemini.js` backed by `src/lib/contentFallback.js` providing zero-failure fallback generating 2 distinct high-quality Vietnamese articles (Analytical & Inspiring) with semantic HTML and exact character length limits.
- **Image & Storage Pipeline**: `src/lib/imageProcessor.js` (Sharp WebP < 350KB + FAI logo watermark overlay) and `src/lib/cloudStorage.js` (Cloudflare R2 public CDN URLs, zero Base64).
- **Article Database & CMS**: Firestore collection `posts` queried by `group: 'doi-song'` displayed on `/doi-song` and editable via `/admin/posts/[id]` in TipTap editor.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | F1. Telegram Network & TLS / IPv4 Optimization | IPv4 DNS resolution, keep-alive agent, resilient answerCallbackQuery | M1 | survey |
| 2 | F2. Local Polling Bridge | Long-polling bridge script forwarding updates to local webhook | M1 | survey |
| 3 | F3. Intelligent Content Fallback Pipeline | Zero-dependency 2-option Vietnamese article generator | M2 | survey |
| 4 | F4. Seamless Gemini Hook | Intercept missing key or API failures without crashing | M2 | survey |
| 5 | F5. Image Pipeline & Cloud Storage Integration | Sharp WebP < 350KB + FAI watermark + Cloudflare R2 CDN URL | M3 | survey |
| 6 | F6. 3 FPT Aptech Articles Ingestion | Crawl and publish 3 articles to Firestore `posts` under `doi-song` | M3 | survey |
| 7 | F7. E2E Verification & CMS Validation | Test all acceptance criteria, UI /doi-song, CMS, and Forensic Audit | M4 | survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Telegram Network Optimization & Local Polling Bridge | F1, F2 | none | DONE |
| M2 | Gemini API Key Handling & Content Fallback Pipeline | F3, F4 | none | DONE |
| M3 | FPT Aptech Articles Ingestion & Publishing | F5, F6 | M2 | DONE |
| M4 | E2E Testing, CMS Verification & Forensic Integrity Audit | F7 | M1, M2, M3 | DONE |

## Interface Contracts
### Polling Bridge -> Webhook
- URL: `http://localhost:3000/api/telegram/webhook`
- Method: `POST`
- Headers: `Content-Type: application/json`, `X-Telegram-Bot-Api-Secret-Token: <TELEGRAM_WEBHOOK_SECRET>`
- Body: standard Telegram Update object (`update_id`, `message`, `callback_query`)

### Gemini / Fallback Generator Contract
- Input: `userNotes: string`, `options: object`
- Output:
  ```json
  {
    "option1": {
      "title": "string (< 100 chars)",
      "excerpt": "string (120-220 chars)",
      "readTime": "4 phút",
      "contentHtml": "<h3>...</h3><p>...</p><blockquote>...</blockquote>"
    },
    "option2": {
      "title": "string (< 100 chars)",
      "excerpt": "string (120-220 chars)",
      "readTime": "3 phút",
      "contentHtml": "<h3>...</h3><p>...</p><blockquote>...</blockquote>"
    },
    "isFallback": true
  }
  ```

### Image Pipeline Contract
- Input: `Buffer` (JPEG/PNG/WebP)
- Output: `Buffer` (WebP < 350KB, watermarked bottom-right)
- Storage: Cloudflare R2 bucket `vietndjmedia`, key `fai/posts/{YYYY}/{MM}/{uuid}-{name}.webp`
- URL: `https://pub-447bd44dfdac4938912655c855b8631c.r2.dev/...`

### Firestore `posts` Document Contract
- Collection: `posts`
- Fields: `id`, `title`, `slug`, `categoryId`, `date`, `image`, `excerpt`, `contentHtml`, `sourceUrl`, `author`, `readTime`, `order`, `published: true`, `group: 'doi-song'`, `createdAt`, `updatedAt`

## Code Layout
- `fai/src/lib/telegram.js`: Outbound Telegram API client
- `fai/src/app/api/telegram/webhook/route.js`: Next.js Telegram Webhook route
- `fai/scripts/telegram-polling-bridge.mjs`: Standalone Local Polling Bridge
- `fai/src/lib/contentFallback.js`: Intelligent Fallback Content Generator
- `fai/src/lib/gemini.js`: Gemini integration with automatic fallback hook
- `fai/src/lib/imageProcessor.js`: Sharp WebP compression + FAI logo watermark
- `fai/src/lib/cloudStorage.js`: Cloudflare R2 S3-compatible client
- `fai/scripts/seed-aptech-posts.mjs`: FPT Aptech 3 articles crawling & publishing script
- `fai/src/app/doi-song/page.js`: Frontend public view
- `fai/src/app/admin/posts/[id]/page.js`: Admin TipTap editor CMS
