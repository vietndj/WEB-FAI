# BRIEFING — 2026-09-03T18:21:00+07:00

## Mission
Decompose `src/app/tuyen-sinh/page.js` and `src/app/ve-fai/page.js` into modular components under `src/components/tuyen-sinh/` and `src/components/ve-fai/`, reducing page line counts to < 250 lines while preserving 100% functionality, animations, visual fidelity, data integration, and anchors.

## 🔒 My Identity
- Archetype: implementer
- Roles: implementer, qa
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2_decomp
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M2 - Component Decomposition

## 🔒 Key Constraints
- EXCLUSIVE WRITE OWNERSHIP:
  * `src/components/tuyen-sinh/`: HeroSection.jsx, TargetAudienceSection.jsx, AdmissionMethodSection.jsx, ScholarshipTabSection.jsx, TuitionBankSection.jsx, OnlineRegistrationSection.jsx
  * `src/app/tuyen-sinh/page.js` (< 250 lines)
  * `src/components/ve-fai/`: AboutHeroSection.jsx, AboutPhilosophyStatsSection.jsx, AboutValuesSection.jsx, AboutTimelineSection.jsx, AboutProgramsSection.jsx, AboutCTASection.jsx, AboutContactBannerSection.jsx
  * `src/app/ve-fai/page.js` (< 250 lines)
- DO NOT TOUCH: globals.css, fonts, lien-he, form sections, src/data/* (read-only), other pages.
- Local dev only: NO git commit/push, NO Vercel deploy.
- Tests on http://localhost:3000.
- Zero ESLint errors, successful Next.js build.

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:15:00+07:00

## Task Summary
- **What to build**: Component decomposition for Tuyển Sinh and Về FAI pages.
- **Success criteria**:
  1. All 13 modular component files created with clean exports and proper 'use client' directives where needed.
  2. Both page files reduced to < 250 lines (Server Components with SEO metadata).
  3. All data imported from `@/data/*`.
  4. ESLint clean, build clean, HTTP 200 on both routes.
- **Interface contracts**: explorer blueprints in `.agents/explorer_m2_1/`, `.agents/explorer_m2_2/`, `.agents/explorer_m2_3/`.

## Key Decisions Made
- `src/app/tuyen-sinh/page.js` reduced from 1,995 lines to 40 lines as a React Server Component exporting SEO metadata.
- `src/app/ve-fai/page.js` reduced from 1,011 lines to 48 lines as a React Server Component exporting SEO metadata.
- Isolated client-side hooks (`useState`, `useEffect`, `useRef`, clipboard API, form submissions) exclusively into leaf interactive components (`ScholarshipTabSection`, `TuitionBankSection`, `OnlineRegistrationSection`, `AboutHeroSection`, `AboutPhilosophyStatsSection`, `AboutTimelineSection`).
- Removed typewriter interval re-render bottleneck on `ve-fai` root page by encapsulating it in `AboutHeroSection`.
- Formatted scholarship items as `{item.unit ? `${item.value} ${item.unit}` : item.value}` to properly preserve labels like "14 Triệu".

## Change Tracker
- **Files modified**:
  * `src/app/tuyen-sinh/page.js`: Reduced to 40 lines (Server Component + SEO metadata).
  * `src/app/ve-fai/page.js`: Reduced to 48 lines (Server Component + SEO metadata).
  * `src/components/tuyen-sinh/HeroSection.jsx`: Created (Header eyebrow, H1, quick jump pills).
  * `src/components/tuyen-sinh/TargetAudienceSection.jsx`: Created (3 audience cards, 6M badge, anchors).
  * `src/components/tuyen-sinh/AdmissionMethodSection.jsx`: Created (Online & direct admission, 4 steps, 3 dossiers).
  * `src/components/tuyen-sinh/ScholarshipTabSection.jsx`: Created (4 brand tabs, SSoT scholarship data).
  * `src/components/tuyen-sinh/TuitionBankSection.jsx`: Created (TPBank HN & DN, 1-click copy, #faq anchor).
  * `src/components/tuyen-sinh/OnlineRegistrationSection.jsx`: Created (11 programs, SSoT contacts, form validation).
  * `src/components/ve-fai/AboutHeroSection.jsx`: Created (Isolated typewriter & particle canvas).
  * `src/components/ve-fai/AboutPhilosophyStatsSection.jsx`: Created (4 animated counters, count-up hook).
  * `src/components/ve-fai/AboutValuesSection.jsx`: Created (Mission, vision, culture, 4 IGSM pillars).
  * `src/components/ve-fai/AboutTimelineSection.jsx`: Created (5 cyber milestones, glowing progress beam).
  * `src/components/ve-fai/AboutProgramsSection.jsx`: Created (4 brand program cards with logos).
  * `src/components/ve-fai/AboutCTASection.jsx`: Created (Orange gradient partnership banner).
  * `src/components/ve-fai/AboutContactBannerSection.jsx`: Created (Join banner with custom SVG arrow).
- **Build status**: PASS (Next.js build succeeded in 4.6s, 34/34 static pages generated).
- **Pending issues**: None.

## Quality Status
- **Build/test result**: PASS (`npm run build` completed with 0 errors).
- **Lint status**: PASS (0 errors, 0 warnings across all 15 touched/created files).
- **Runtime status**: PASS (HTTP 200 verified on `http://localhost:3000/tuyen-sinh` and `http://localhost:3000/ve-fai`).
- **Tests added/modified**: E2E curl tests and build pipeline.

## Artifact Index
- `.agents/worker_m2_decomp/DISPATCH.md` — Dispatch assignment
- `.agents/worker_m2_decomp/BRIEFING.md` — Persistent memory
- `.agents/worker_m2_decomp/progress.md` — Progress tracker and heartbeat
- `.agents/worker_m2_decomp/handoff.md` — Final handoff report
