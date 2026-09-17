# BRIEFING — 2026-09-03T11:00:00Z

## Mission
Milestone 1: Content Decoupling & Single Source of Truth — Build 4 centralized data modules under `src/data/` and refactor shared consumer components to import from them.

## 🔒 My Identity
- Archetype: Implementer
- Roles: implementer, qa, specialist
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data
- Original parent: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Milestone: Milestone 1: Content Decoupling & Single Source of Truth

## 🔒 Key Constraints
- Local development only! DO NOT run git commit, git push, or deploy to Vercel production.
- Test directly on http://localhost:3000.
- Mandatory Integrity: No cheating, no fake mocks, genuine logic.
- Scope lock: Only write to owned files:
  - `fai/src/data/programs.js`
  - `fai/src/data/scholarships.js`
  - `fai/src/data/tuition.js`
  - `fai/src/data/contacts.js`
  - `fai/src/components/Header.jsx`
  - `fai/src/components/Footer.jsx`
  - `fai/src/components/ScholarshipFormSection.jsx`
  - `fai/src/components/Arena100hFormSection.jsx`
  - `fai/src/components/Skillking100hFormSection.jsx`
  - `fai/src/components/AptechProgramSwitcher.jsx`
  - `fai/src/components/ArenaProgramSwitcher.jsx`
  - `fai/src/components/SkillkingProgramSwitcher.jsx`
  - `fai/src/components/JetkingProgramSwitcher.jsx`

## Current Parent
- Conversation ID: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Updated: 2026-09-03T11:00:00Z

## Task Summary
- **What to build**: Centralized data modules (`programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`) and refactored shared consumer components (Header, Footer, ScholarshipFormSection, Arena100hFormSection, Skillking100hFormSection, Switchers).
- **Success criteria**: 4 data modules complete and structured with all 2026 data. Shared components consume SSoT. Next.js build succeeds. Localhost:3000 returns 200 OK.
- **Interface contracts**: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/PROJECT.md
- **Code layout**: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/PROJECT.md § Code Layout

## Key Decisions Made
- Implemented full 2026 data schemas for 11 programs, 4 scholarship brands, 2 tuition bank accounts (HN & DN TPBank), and full campus/contact hubs.
- Maintained 100% backwards compatibility and export aliases so existing and future components won't break.
- Dynamic mapping in `Header.jsx` for both desktop megamenu and mobile drawer menus.
- Dynamic mapping in `Footer.jsx` for campuses and contact channels.

## Artifact Index
- `.agents/worker_m1_data/DISPATCH.md` — Original task dispatch
- `.agents/worker_m1_data/BRIEFING.md` — Situational awareness
- `.agents/worker_m1_data/progress.md` — Liveness & heartbeat
- `.agents/worker_m1_data/handoff.md` — Milestone 1 completion report

## Change Tracker
- **Files modified**:
  - `src/data/programs.js`: 11 training programs, brand structure, short course options, switcher items, rich program details
  - `src/data/scholarships.js`: 4 brand scholarship portfolios, BRAND_FORM_PRESETS
  - `src/data/tuition.js`: Official HN (00006969813) & DN (03557714109) TPBank accounts and transfer notes
  - `src/data/contacts.js`: Hotlines, emails, working hours, campuses by brand and city, external links
  - `src/components/Header.jsx`: Megamenu and mobile drawer menu dynamically render from programsByBrand
  - `src/components/Footer.jsx`: Campuses and contacts dynamically render from contacts.js
  - `src/components/ScholarshipFormSection.jsx`: Uses BRAND_FORM_PRESETS, ADMISSION_CAMPUSES, and EXTERNAL_LINKS
  - `src/components/Arena100hFormSection.jsx`: Uses arenaShortCourseOptions, ADMISSION_CAMPUSES, and EXTERNAL_LINKS
  - `src/components/Skillking100hFormSection.jsx`: Uses skillkingShortCourseOptions, ADMISSION_CAMPUSES, and EXTERNAL_LINKS
  - `src/components/AptechProgramSwitcher.jsx`: Uses aptechSwitcherItems
  - `src/components/ArenaProgramSwitcher.jsx`: Uses arenaSwitcherItems
  - `src/components/SkillkingProgramSwitcher.jsx`: Uses skillkingSwitcherItems
  - `src/components/JetkingProgramSwitcher.jsx`: Uses jetkingSwitcherItems
- **Build status**: PASS (next build compiled in 4.2s, 34/34 routes static/dynamic)
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (npm run build succeeded, curl status 200 on all routes)
- **Lint status**: 0 errors (ESLint clean)
- **Tests added/modified**: Python urllib verification script for rendered HTML strings

## Loaded Skills
None
