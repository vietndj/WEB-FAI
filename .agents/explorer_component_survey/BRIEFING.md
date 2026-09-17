# BRIEFING — 2026-09-03T17:48:45+07:00

## Mission
Investigate component structure, page sizes, and CSS styling in fai to propose modularization and reusable patterns.

## 🔒 My Identity
- Archetype: explorer
- Roles: explorer, investigator, synthesizer
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_component_survey
- Original parent: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Milestone: component_survey

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Local development only (no git commit/push, no deploy to Vercel)
- Preserve brand tokens (--primary, --secondary, --accent, fonts SVN-Sonoma, SVN-Poppins)
- .agents/ holds only metadata

## Current Parent
- Conversation ID: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Updated: not yet

## Investigation State
- **Explored paths**:
  - `src/app/tuyen-sinh/page.js` (1994 lines, 7 sections, 259 inline styles)
  - `src/app/ve-fai/page.js` (1010 lines, 7 sections, 123 inline styles)
  - `src/app/doi-song/page.js` (717 lines), `src/app/lien-he/page.js` (596 lines)
  - All 11 course pages in `src/app/dao-tao/` (`aptech`, `arena`, `skillking`, `chip-design`, `ai-agent`)
  - `src/app/globals.css` (6460 lines, design tokens, `.beau-` classes)
  - `src/components/ScholarshipFormSection.jsx`
  - Dev server: next-server v16.2.9, PID 54207, port 3000, 200 OK
- **Key findings**:
  - `src/app/tuyen-sinh/page.js` can be decomposed into 6 discrete components in `src/components/tuyen-sinh/` and reduced from 1994 lines to < 50 lines.
  - Data definitions (`TRAINING_PROGRAMS_2026`, `SCHOLARSHIP_BRANDS`, `TUITION_ACCOUNTS`, contacts) can be centralized into `src/data/`.
  - All 11 course pages follow identical layout structure with `.beau-` CSS classes, perfectly suited for `CourseLayout.jsx`.
  - Over 1,200 repetitive inline styles across pages can be replaced with standardized `.fai-*` utility classes.
- **Unexplored areas**: None, all 5 items fully surveyed.

## Key Decisions Made
- Finalized exact decomposition blueprints for `tuyen-sinh`, `ve-fai`, `dao-tao/*`, and CSS design system.
- Proceeding to write `handoff.md`.

## Artifact Index
- handoff.md — Comprehensive survey and proposal report
- progress.md — Liveness progress heartbeat
