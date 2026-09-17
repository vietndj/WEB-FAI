# BRIEFING — 2026-09-03T10:55:00Z

## Mission
Survey entire codebase /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/ to identify all hardcoded content and design src/data/ schemas and consumer refactoring map.

## 🔒 My Identity
- Archetype: explorer
- Roles: explorer, survey, investigator, synthesis
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_codebase_survey
- Original parent: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Milestone: Codebase Hardcoded Data Survey & Data Schema Design

## 🔒 Key Constraints
- Read-only investigation — do NOT implement or modify source code in fai/src
- Local development only — do NOT run git commit, git push, or deploy to Vercel
- Write only to .agents/explorer_codebase_survey/
- Provide exact files, line numbers, data contracts, and consumer mapping

## Current Parent
- Conversation ID: 52138626-f9e8-4cb0-866c-d2dc96634c42
- Updated: 2026-09-03T10:55:00Z

## Investigation State
- **Explored paths**:
  - `src/data/news.js`
  - `src/app/tuyen-sinh/page.js`
  - `src/app/lien-he/page.js`
  - `src/app/doi-song/page.js`
  - `src/app/ve-fai/page.js`
  - `src/app/page.js`
  - `src/app/dao-tao/*` (all 15 route files)
  - `src/components/Footer.jsx`
  - `src/components/Header.jsx`
  - `src/components/ScholarshipFormSection.jsx`
  - `src/components/Arena100hFormSection.jsx`
  - `src/components/Skillking100hFormSection.jsx`
  - `src/components/AptechProgramSwitcher.jsx`
  - `src/components/ArenaProgramSwitcher.jsx`
  - `src/components/SkillkingProgramSwitcher.jsx`
  - `src/components/JetkingProgramSwitcher.jsx`
  - `src/components/ProgramBeau.jsx`
  - `src/components/ProgramSelector.jsx`
  - `src/components/TechCTAButton.jsx`
  - `src/components/NewsSection.jsx`
  - `src/components/NewsHeroSlider.jsx`
- **Key findings**:
  - High duplication of scholarship badges, tuition details, hotlines, emails, and program names across 18+ files.
  - Inconsistencies found between `tuyen-sinh/page.js` and `ScholarshipFormSection.jsx` presets.
  - 4 core data modules needed in `src/data/`: `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`.
- **Unexplored areas**: None within the scope of data survey.

## Key Decisions Made
- Designed backward-compatible schema exports so existing consumer files can import both flat structures (like `TRAINING_PROGRAMS_2026`) and rich structured objects.

## Artifact Index
- handoff.md — Complete 5-component handoff report
- progress.md — Real-time progress and heartbeat
- DISPATCH.md — Logged user instruction
