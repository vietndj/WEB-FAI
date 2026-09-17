# Progress — worker_m3_course

Last visited: 2026-09-03T18:48:45+07:00

## Status: COMPLETE
Milestone: M3 (CourseLayout & 11 Pages Refactoring)

### Steps
- [x] Step 0: Initialize DISPATCH.md, BRIEFING.md, progress.md
- [x] Step 1: Read all mandatory documents (ORIGINAL_REQUEST.md, PROJECT.md, explorer_m3_1, explorer_m3_2, explorer_m3_3)
- [x] Step 2: Implement `src/components/course/` modular components:
  - `CourseHero.jsx` (242 lines, supports particles, watermark, multi-line titles, badge, logo, callout card, hero stats, and responsive banners)
  - `CourseOverviewStats.jsx` (230 lines, supports 4 stats cards with dynamic Lucide icons and duration breakdown banner)
  - `CourseCurriculumTabs.jsx` (520 lines, fully supports all 5 curriculum archetypes: Semesters tabs, Subjects grid + Certificate + Target careers, Module tabs with STT/role/content table, Track cards + Studio tools, and Short course cards with badges/skills/output)
  - `CourseHighlights.jsx` (160 lines, feature cards grid with dynamic Lucide icon resolver)
  - `CourseCTABanner.jsx` (42 lines, dark tech CTA banner with TechCTAButton)
  - `CourseLayout.jsx` ('use client', 277 lines, master layout orchestrator with ScrollSpy active-section gradients, brand presets, switchers, form integration, and footer)
- [x] Step 3: Implement `src/data/courses.js` with complete prop sets for all 11 courses and update `src/data/programs.js` (re-export `export * from './courses'`)
- [x] Step 4: Refactor all 11 course pages in `src/app/dao-tao/` to thin React Server Components exporting SEO metadata
- [x] Step 5: Run ESLint (`npx eslint src/components/course/ src/data/courses.js src/app/dao-tao/ src/data/programs.js`) -> 0 errors, 0 warnings
- [x] Step 6: Run `npm run build` -> 0 compile errors, 34/34 static pages generated
- [x] Step 7: Verify live server response (curl 200 and clean SSR HTML without hydration errors) for all 11 routes
- [x] Step 8: Run empirical test suite `scripts/verify-course-refactor-m3.mjs` -> 122/122 passed
- [x] Step 9: Complete handoff.md and report to parent
