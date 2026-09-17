# BRIEFING — 2026-09-03T11:38:00Z

## Mission
Investigate migration safety, build stability, and hydration boundaries for Milestone 3 (CourseLayout & 11 course pages).

## 🔒 My Identity
- Archetype: explorer
- Roles: Migration & Hydration Safety Researcher
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M3

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Local dev only — no git commit/push, no deploy
- Write handoff to /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/handoff.md
- Report via send_message to parent (e4b8befb-dbfe-4687-b7a1-9bbb40036eb1)

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T11:33:29Z

## Investigation State
- **Explored paths**: `src/app/dao-tao/` (all 11 course pages), `src/app/globals.css` (lines 5580-5710), `src/components/` (ParticleCanvas, ProgramSwitchers, ScholarshipFormSection, Footer), `src/app/tuyen-sinh/page.js`, `src/app/ve-fai/page.js`.
- **Key findings**:
  1. All 11 existing course pages currently use `'use client'` on line 1.
  2. The outer wrapper requires dynamic CSS classes `.theme-${brand}.active-sec-${activeSection}` driven by `IntersectionObserver` on `.beau-hero, .beau-section, .beau-cta-section`.
  3. Recommendation: Mark `CourseLayout.jsx` as `'use client'`. Keep each `page.js` as a Server Component without `'use client'` to allow exporting static Next.js `metadata` for full SEO indexing.
  4. Current line count across 11 pages is 5,867 lines. Refactored pages will be ~40 lines each (~440 lines total), eliminating ~5,427 lines from pages and over 5,800 lines of duplicated boilerplate.
  5. Tested HTTP 200 across all 11 routes — all returned 200 OK.
  6. ESLint on `src/app/dao-tao/` passes with 0 errors, 0 warnings.
- **Unexplored areas**: None. All questions in task specification resolved.

## Key Decisions Made
- CourseLayout.jsx MUST be `'use client'`: encapsulates `activeSection` IntersectionObserver and `activeTab` state.
- `page.js` for each of the 11 courses MUST be a Server Component: exports `metadata` for SEO and passes data props to `<CourseLayout />`.
- CourseLayout supports 3 curriculum patterns: `semesters` (tabs), `courses` (module tabs), and `customContent` (card grids).

## Artifact Index
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/BRIEFING.md — Persistent working memory
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/DISPATCH.md — Dispatch log
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/progress.md — Progress heartbeat log
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/handoff.md — 5-component handoff report
