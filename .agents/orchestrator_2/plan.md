# Execution Plan — FAI Web Telegram Bot Publishing & WordPress-Grade Editor

## Overview
Build automated publishing via Telegram Bot with Gemini 2.5 Flash AI dual-option generation, Cloud Storage image optimization & watermarking pipeline, and WordPress-grade TipTap editor for FAI Web `/doi-song` and admin CMS.

## Phase 0: Survey & Codebase Investigation (Parallel Explorers)
- Dispatch 3 parallel Explorers:
  1. `explorer_storage_img`: Investigate existing storage/image handling in `fai`, Firestore `posts` schema, Firebase Storage / Cloudflare R2 credentials, `sharp` or image processing packages, watermark asset (`public/logo_fpt_fai.png`).
  2. `explorer_telegram_ai`: Investigate API routes (`src/app/api`), Telegram webhook mechanics, Gemini SDK / API configuration, environment variables, categories collection query (`group == "doi-song"`).
  3. `explorer_editor_ui`: Investigate `/admin/posts/[id]`, `/admin/posts/new`, current editor implementation, `/doi-song` page layout and modal rendering, TipTap packages, Firebase Auth protection.

## Phase 1: Architecture & Feature Inventory (PROJECT.md)
- Synthesize explorer reports into `PROJECT.md`.
- Establish Feature Inventory with full mapping to milestones.
- Define Interface Contracts and Code Layout.

## Phase 2: Implementation & Verification Milestones
- **Milestone 1 (M1): Cloud Storage & Image Optimization Pipeline**
  - Implement image processing service (compress <350KB, max width 1600px, WebP/JPEG, watermark `logo_fpt_fai.png`).
  - Implement Cloud Storage upload (Firebase Storage / R2), return public URL.
  - Eliminate Base64 storage in Firestore `posts`.
  - Gate: Explorer -> Worker -> 2 Reviewers -> 2 Challengers -> Auditor.

- **Milestone 2 (M2): Telegram Bot Webhook & AI 2-Option Publishing Flow**
  - Create `/api/telegram/webhook`.
  - Implement Telegram bot command/conversation flow:
    - Step 1: Query Firestore for categories in `doi-song`, show inline keyboard.
    - Step 2: Receive photo + text outline.
    - Step 3: Call Gemini 2.5 Flash to generate 2 distinct complete article options.
    - Step 4: Show inline keyboard `[Chọn Phương Án 1]` and `[Chọn Phương Án 2]`.
    - Step 5: On choice, optimize & watermark image, save article to Firestore `posts`.
    - Step 6: Reply with success message + link to `/admin/posts/[id]`.
  - Gate: Explorer -> Worker -> 2 Reviewers -> 2 Challengers -> Auditor.

- **Milestone 3 (M3): WordPress-Grade CMS Editor Interface**
  - Upgrade `/admin/posts/[id]` and `/admin/posts/new` to modern TipTap editor.
  - Implement rich content blocks: Headings (H2-H4), Paragraph, Blockquote, Lists, Divider, Text Alignment.
  - Implement Bubble Menu / Floating Toolbar on selection.
  - Implement inline image insertion with caption.
  - Implement Live Preview matching exact `/doi-song` article modal.
  - Ensure HTML compatibility between editor and `/doi-song` renderer.
  - Gate: Explorer -> Worker -> 2 Reviewers -> 2 Challengers -> Auditor.

- **Milestone 4 (M4): Security, Auth & End-to-End System Validation**
  - Validate Telegram Webhook Secret Token (`X-Telegram-Bot-Api-Secret-Token`).
  - Enforce Telegram User ID / Chat ID whitelist.
  - Verify Firebase Auth protection on `/admin/posts/*`.
  - Verify zero Base64 in Firestore, verify `/doi-song` renders new posts cleanly.
  - Ensure lint and build pass without regressions.
  - Gate: Explorer -> Worker -> 2 Reviewers -> 2 Challengers -> Auditor.

## Phase 3: Handover to Sentinel
- Prepare comprehensive handoff report (`handoff.md`).
- Notify parent (Sentinel) for independent Victory Audit.
