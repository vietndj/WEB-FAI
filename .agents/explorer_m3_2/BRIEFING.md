# BRIEFING — 2026-09-03T18:37:48+07:00

## Mission
Investigate data mapping for all 11 course pages into CourseLayout.jsx, check missing data in programs.js, analyze form differences, and specify exact props objects.

## 🔒 My Identity
- Archetype: explorer
- Roles: Course Data Mapping Researcher
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_2
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M3 (Course Page Template & Refactoring)

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Local dev only
- No git commit / push

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:33:41+07:00

## Investigation State
- **Explored paths**:
  - `src/data/programs.js`, `src/data/scholarships.js`, `src/data/tuition.js`, `src/data/contacts.js`
  - `src/components/ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, `Skillking100hFormSection.jsx`
  - All 11 course pages in `src/app/dao-tao/*`
- **Key findings**:
  1. `programs.js` currently contains high-level overview metadata, switchers, and short course options, but lacks rich course data (bannerImage, heroStats, overviewStats, detailed coreStack/aiTools/careers, whyChooseUs cards, CTA copy, form presets).
  2. `Arena100hFormSection` and `Skillking100hFormSection` are legacy standalone components. All 11 pages (including `arena/100h` and `skillking/100h`) currently use `ScholarshipFormSection` with dynamic props.
  3. The 11 pages exhibit 5 curriculum archetypes: tabbed semesters (6 pages), single-semester subject grid (1 page: `aptech/6-thang`), tabbed multi-courses (1 page: `aptech/100-200h`), track duration cards (1 page: `arena/6-18-thang`), and short-course chuyên đề cards (2 pages: `arena/100h`, `skillking/100h`).
  4. Best architecture: Create `src/data/courses.js` exporting 11 ready-to-use props objects, re-exported by `src/data/programs.js`.
- **Unexplored areas**: None for M3 data mapping scope.

## Key Decisions Made
- Recommend decoupling full course props into `src/data/courses.js` and re-exporting in `src/data/programs.js` to avoid God File in `programs.js`.
- Standardize all 11 course pages on `ScholarshipFormSection` via `formProps`.
- Support 5 curriculum types in `CourseLayout.jsx` or provide dedicated sub-renderers.

## Artifact Index
- DISPATCH.md — Task dispatch log
- BRIEFING.md — Persistent memory
- progress.md — Liveness heartbeat
- handoff.md — Final research report
