# FAI 2026 Admissions Page — Environment & Server Survey Report

**Survey Date:** 2026-09-03  
**Working Directory:** `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Explorer Role:** Environment & Server Explorer (`teamwork_preview_explorer`)  
**Status:** Dev Server Active, Git Safe, Lint Verified  

---

## 1. Executive Summary

- **Dev Server Status**: Currently **RUNNING** on `http://localhost:3000` (PID 54206 / 54207). Tested route `http://localhost:3000/tuyen-sinh` responds with `HTTP/1.1 200 OK`.
- **Runtime Stack**: Node.js `v26.3.0`, npm `11.16.0`, Next.js `16.2.9` (App Router with Turbopack), React `19.2.4`, React-DOM `19.2.4`.
- **Language & Types**: Pure JavaScript (`.js` / `.jsx`), path aliasing via `jsconfig.json` (`@/* -> ./src/*`). No TypeScript configured.
- **Git & Safety Status**: Zero staged changes across both root and `fai` repositories. Branch `main` is clean vs origin. Strict local development constraints enforced: **NO git commit, NO git push, NO Vercel deployment**.
- **Linting & Verification**: Targeted linting (`npx eslint src/app/tuyen-sinh/page.js`) passes with **0 errors and 0 warnings** (Exit code 0). Read-only and side-effect free.

---

## 2. Runtime Environment & Dependencies

### 2.1 System & Package Manager
- **OS**: macOS (Darwin 24.6.0)
- **Node.js**: `v26.3.0`
- **npm**: `11.16.0`

### 2.2 Application Stack (`fai/package.json`)
```json
{
  "name": "fai",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "firebase": "^12.17.1",
    "lucide-react": "^1.21.0",
    "next": "16.2.9",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "swiper": "^12.2.0"
  },
  "devDependencies": {
    "eslint": "^9",
    "eslint-config-next": "16.2.9"
  }
}
```

### 2.3 Key Observations on Stack
1. **Next.js 16.2.9 & React 19.2.4**:
   - Modern Next.js version with React 19 support.
   - As documented in `fai/AGENTS.md`: Notice potential breaking changes from older Next.js versions.
   - `src/app/tuyen-sinh/page.js` uses `'use client'` at the top of the file, allowing full React hook usage (`useState`, event handlers, interactive tabs/forms).
2. **Icons**: `lucide-react` (`^1.21.0`) is available and used for all UI icons.
3. **TypeScript**: Project does not use TypeScript. There are no `.ts` or `.tsx` files in `src/`. `jsconfig.json` defines `@/*` pointing to `./src/*`.

---

## 3. Dev Server Status & Operations

### 3.1 Current Status
- **URL**: `http://localhost:3000`
- **Admissions Route**: `http://localhost:3000/tuyen-sinh`
- **HTTP Response**:
  ```http
  HTTP/1.1 200 OK
  Vary: rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding
  Cache-Control: no-cache, must-revalidate
  X-Powered-By: Next.js
  Content-Type: text/html; charset=utf-8
  Connection: keep-alive
  ```
- **Active Process**:
  - Parent: PID `54206` (`node /Users/vietmac/Documents/CODE/WEB- FAI/fai/node_modules/.bin/next dev`)
  - Child Server: PID `54207` (`next-server (v16.2.9)`)
  - Listening on: `TCP *:3000 (LISTEN)`

### 3.2 Server Management Commands
- **Check Server Status**:
  ```bash
  curl -s -I http://localhost:3000/tuyen-sinh
  # or
  lsof -nP -iTCP:3000 -sTCP:LISTEN
  ```
- **Start Dev Server** (if stopped):
  ```bash
  cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
  npm run dev
  ```
- **Hot Reload**: The server uses Turbopack / Fast Refresh. Saving `src/app/tuyen-sinh/page.js` will hot-reload the UI automatically without restarting the server.

---

## 4. Git Architecture & Safety Constraints

### 4.1 Git Repository Structure
The workspace consists of a nested repository structure:
1. **Root Repository**: `/Users/vietmac/Documents/CODE/WEB- FAI`
   - Remote: `origin -> https://github.com/vietndj/WEB-FAI.git`
   - Branch: `main` (up to date with `origin/main`)
   - Untracked: `.agents/`, `kiem_thu_online_26_08/`
2. **Sub-Repository**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`
   - Remote: `origin -> https://github.com/vietndj/fai.git`
   - Branch: `main` (up to date with `origin/main`)
   - Unstaged modified files: `src/app/admin/admin.css`, `src/app/globals.css` (SVN-Sonoma font definitions)
   - Untracked files: `public/fonts/SVN-Sonoma-*.ttf` (16 font files)
   - Staged files: **0 files**

### 4.2 Local Development Constraints (`GEMINI.md`)
All downstream agents and implementers MUST strictly adhere to the user rules:
- ❌ **TẠM THỜI KHÔNG tự động chạy `git commit` / `git push`.**
- ❌ **TẠM THỜI KHÔNG deploy lên Vercel Production.**
- ✅ **Chỉ chỉnh sửa code trực tiếp trên Local và kiểm tra qua `http://localhost:3000`.**
- ✅ **Chỉ commit/push và deploy khi người dùng có yêu cầu cụ thể.**

---

## 5. Linting & Static Analysis

### 5.1 Configuration
- ESLint version: 9.x using Flat Config (`eslint.config.mjs`).
- Extends `eslint-config-next/core-web-vitals`.
- Global ignores: `.next/**`, `out/**`, `build/**`, `next-env.d.ts`.

### 5.2 Targeted Lint Test
We ran ESLint specifically on the admissions page:
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
npx eslint src/app/tuyen-sinh/page.js
```
- **Result**: Exit code `0` — **0 errors, 0 warnings**.
- **Safety**: Running `npx eslint src/app/tuyen-sinh/page.js` is 100% read-only and safe to run at any time during development or verification to ensure clean syntax.

### 5.3 Project-Wide Lint Note
Running `npm run lint` across the entire project currently reports pre-existing issues in unrelated files (e.g. `src/app/ve-fai/page.js`, `src/components/Counters.jsx` regarding React 19 `react-hooks/set-state-in-effect`, and unescaped entities in `Testimonials.jsx`). Implementers should use targeted linting on `src/app/tuyen-sinh/page.js` to avoid noise from existing files.

---

## 6. Design System & Styling Baseline

### 6.1 Color & Typography Variables (`src/app/globals.css`)
- **Primary Brand Color**: `--primary: #E8741E` (FPT Amber / Orange)
- **Primary Hover**: `--primary-hover: #c85f0e`
- **Dark Neutral**: `--secondary: #0D2137`, `--bg-dark: #0D2137`
- **Light Background**: `--bg-gray: #f1f5f9`, White `#ffffff`
- **Text Muted**: `var(--text-muted)`
- **Font Stack**: `--font-sans: 'SVN-Sonoma', 'SVN-Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;`

### 6.2 Target Page File
- File path: `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js`
- Format: Client Component (`'use client';`)
- Container classes: `.container`, `.section-eyebrow`, `.sub-page-main`

---

## 7. Recommendations for Implementation & Verification
1. **Editing**: Modify `/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js` directly.
2. **Verification Command**:
   - HTTP Check: `curl -s -I http://localhost:3000/tuyen-sinh` (expect HTTP 200)
   - Linter Check: `cd /Users/vietmac/Documents/CODE/WEB- FAI/fai && npx eslint src/app/tuyen-sinh/page.js` (expect 0 errors)
   - Browser Check: Inspect `http://localhost:3000/tuyen-sinh` locally.
3. **Safety Guarantee**: Keep changes local. Do not run any git commit or push commands.
