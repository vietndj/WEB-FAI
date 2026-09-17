# BRIEFING — 2026-09-03T11:13:30Z

## Mission
Investigate `src/app/tuyen-sinh/page.js` (~1994 lines), state management, data dependencies, and design the blueprint for decomposition into 6 atomic components and clean page (<250 lines).

## 🔒 My Identity
- Archetype: explorer
- Roles: Codebase Researcher - Tuyen Sinh Decomposition
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_1
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M2 - Tuyen Sinh Refactoring & Decomposition

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or edit source code
- Local dev only — DO NOT run git commit/push or Vercel deployment
- Write reports and handoff in own folder only

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T11:13:30Z

## Investigation State
- **Explored paths**:
  - `src/app/tuyen-sinh/page.js` (1995 lines)
  - `src/data/programs.js` (TRAINING_PROGRAMS_2026)
  - `src/data/scholarships.js` (SCHOLARSHIP_BRANDS)
  - `src/data/tuition.js` (TUITION_ACCOUNTS)
  - `src/data/contacts.js` (HOTLINES, EMAILS, WORKING_HOURS, ADMISSION_CAMPUSES, EXTERNAL_LINKS)
  - `src/app/layout.js` (Header/Root layout)
  - `src/components/` (Components listing and existing patterns)
- **Key findings**:
  - `tuyen-sinh/page.js` currently holds 1995 lines of monolithic code containing hardcoded training programs, scholarships, tuition accounts, and contact hotlines.
  - State is strictly localized: `activeBrand` is only used in Scholarship section; `copiedField`/`handleCopy` is only used in Tuition section; `formData`/`formErrors`/`isSubmitting`/`isSubmitted`/`validateForm`/`handleFormSubmit`/`handleResetForm` are only used in Registration section.
  - Zero state is needed in `page.js`. `page.js` can become a clean Server Component (~60 lines) with rich SEO `metadata`, importing the 6 atomic components and `Footer`.
  - All data structures required by `tuyen-sinh` are already provided by `src/data/programs.js`, `src/data/scholarships.js`, `src/data/tuition.js`, and `src/data/contacts.js` from Milestone 1.
- **Unexplored areas**: None for Tuyển Sinh decomposition scope.

## Key Decisions Made
- Architecture: 6 atomic components in `src/components/tuyen-sinh/`:
  1. `HeroSection.jsx` (Server component, navigation pills & hero presentation)
  2. `TargetAudienceSection.jsx` (Server component, 3 audience cards & transition)
  3. `AdmissionMethodSection.jsx` (Server component, direct admissions & 3-item dossier)
  4. `ScholarshipTabSection.jsx` (Client component, `activeBrand` state, SCHOLARSHIP_BRANDS from data)
  5. `TuitionBankSection.jsx` (Client component, `copiedField` state, TUITION_ACCOUNTS from data)
  6. `OnlineRegistrationSection.jsx` (Client component, form state, TRAINING_PROGRAMS_2026 & contacts from data)
- `page.js` blueprint is ~60 lines (down from 1995 lines, >96% reduction), Server Component with SEO metadata.

## Artifact Index
- DISPATCH.md — Initial dispatch prompt
- BRIEFING.md — Persistent working memory
- progress.md — Liveness heartbeat
- handoff.md — Comprehensive research and decomposition blueprint report
