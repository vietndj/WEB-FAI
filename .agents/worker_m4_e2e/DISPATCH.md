## 2026-09-03T16:42:07Z
You are worker_m4_e2e.
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m4_e2e
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

1. Read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (specifically 2026-09-03T15:13:01Z).
2. Read /Users/vietmac/Documents/CODE/WEB- FAI/PROJECT.md.

Your assignment:
1. Create and execute a unified master E2E test script `fai/scripts/master-e2e-verification.mjs` that systematically validates all acceptance criteria from the user request:
   - Section 1: Telegram Network & Polling Bridge (IPv4 DNS latency < 1s, keepAlive, expired query handling, polling bridge single run exits 0).
   - Section 2: Gemini & Fallback Content Pipeline (empty GEMINI_API_KEY does not crash, returns 2 high-quality Vietnamese options, title < 100, excerpt 120-220, semantic HTML with NO h1/h2).
   - Section 3: 3 Aptech Articles in Firestore & R2 Storage (all 3 articles exist under group 'doi-song', image URLs are on Cloudflare R2 CDN, WebP format, < 350KB, zero Base64 strings).
   - Section 4: Web UI & CMS Editor Routes (http://localhost:3000/doi-song returns HTTP 200, all 3 /admin/posts/[id] return HTTP 200).
   - Section 5: Full production build (`npm run build` exits 0).
2. Document all results with exact numbers, timings, CDN URLs, and status codes in:
   `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m4_e2e/handoff.md`
   and notify orchestrator_6 via send_message.
