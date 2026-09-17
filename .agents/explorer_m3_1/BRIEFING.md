# BRIEFING — 2026-09-03T18:40:00+07:00

## Mission
Analyze the 11 course pages in src/app/dao-tao/ and design the exact architecture, props, and code implementation of src/components/course/CourseLayout.jsx.

## 🔒 My Identity
- Archetype: explorer
- Roles: CourseLayout Architecture Researcher
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_1
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M3.1

## 🔒 Key Constraints
- Read-only investigation — do NOT implement in src/
- Local dev only!
- All proposals, diffs, or code implementations for CourseLayout must be written to .agents/explorer_m3_1/

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:40:00+07:00

## Investigation State
- **Explored paths**:
  - `src/app/dao-tao/aptech/accp/page.js` (520 lines)
  - `src/app/dao-tao/aptech/1-nam/page.js` (658 lines)
  - `src/app/dao-tao/aptech/6-thang/page.js` (542 lines)
  - `src/app/dao-tao/aptech/100-200h/page.js` (738 lines)
  - `src/app/dao-tao/arena/amsp/page.js` (629 lines)
  - `src/app/dao-tao/arena/6-18-thang/page.js` (340 lines)
  - `src/app/dao-tao/arena/100h/page.js` (467 lines)
  - `src/app/dao-tao/skillking/18-thang/page.js` (500 lines)
  - `src/app/dao-tao/skillking/100h/page.js` (312 lines)
  - `src/app/dao-tao/chip-design/page.js` (597 lines)
  - `src/app/dao-tao/ai-agent/page.js` (575 lines)
  - Sub-program switchers: Aptech, Arena, Skillking, Jetking ProgramSwitchers
  - Forms: ScholarshipFormSection, Arena100hFormSection, Skillking100hFormSection
- **Key findings**:
  - All 11 pages share identical container + scroll spy observer logic, `.beau-hero`, `.beau-cta-section`, form embed, and footer.
  - 6 courses have tabbed semester curricula (`accp`, `1-nam`, `amsp`, `skillking/18-thang`, `chip-design`, `ai-agent`).
  - 5 courses have custom / specialized curricula (`6-thang` 10-subject grid, `100-200h` 3-course table, `6-18-thang` 3 tracks + tools grid, `arena/100h` 4 modules, `skillking/100h` 3 modules).
  - Decomposing `CourseLayout` into atomic components (`CourseHero`, `CourseOverviewStats`, `CourseCurriculumTabs`, `CourseHighlights`, `CourseCTABanner`) prevents creating another monolithic God File and respects the < 250 line guideline.
- **Unexplored areas**: None, full sweep complete.

## Key Decisions Made
- Architected `CourseLayout` as an atomic composition of 5 sub-components (`CourseHero`, `CourseOverviewStats`, `CourseCurriculumTabs`, `CourseHighlights`, `CourseCTABanner`), re-exported both default and named exports.
- Supported both standard tabbed semesters via `semesters` prop and custom curriculum via `curriculumSlot` / `customContent`.
- Created working prototypes in `.agents/explorer_m3_1/`.

## Artifact Index
- `proposed_CourseLayout.jsx` — Orchestrator component
- `proposed_CourseHero.jsx` — Hero section
- `proposed_CourseOverviewStats.jsx` — Overview stats and duration breakdown banner
- `proposed_CourseCurriculumTabs.jsx` — Interactive tabbed semester curriculum
- `proposed_CourseHighlights.jsx` — Feature cards
- `proposed_CourseCTABanner.jsx` — Bottom CTA banner
- `sample_accp_page.js` — Refactored example for tabbed courses (520 -> 145 lines)
- `sample_6thang_page.js` — Refactored example for custom courses (542 -> 134 lines)
- `handoff.md` — Final handoff report
