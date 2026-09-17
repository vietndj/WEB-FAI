## 2026-09-03T11:49:35Z

You are auditor_m3_course (Forensic Integrity Auditor - Milestone 3).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/auditor_m3_course
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
- Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
- Worker M3 Handoff: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_course/handoff.md

TASK:
Perform a comprehensive forensic integrity audit and empirical verification on Milestone 3:
1. Static Analysis & Authentic Implementations:
   - Verify `src/components/course/CourseLayout.jsx` and its subcomponents (`CourseHero.jsx`, `CourseOverviewStats.jsx`, `CourseCurriculumTabs.jsx`, `CourseHighlights.jsx`, `CourseCTABanner.jsx`) are authentic React components with genuine logic (no dummy stubs or facade mocks).
   - Verify `src/data/courses.js` and `src/data/programs.js` authentically model all 11 course offerings.
   - Verify all 11 course pages in `src/app/dao-tao/` are reduced from ~5,800 lines down to clean Server Components (< 200 lines each) using `<CourseLayout />`.
2. Scope & Boundary Compliance:
   - Check git status to ensure no forbidden files (`src/app/globals.css`, `public/fonts/*`, `src/app/lien-he/page.js`, `tuyen-sinh/`, `ve-fai/`) were modified.
   - Ensure strictly local development: no git commit, no git push, no Vercel production deployment.
3. Execution Validation:
   - Run `npx eslint src/components/course/ src/data/courses.js src/app/dao-tao/` (must have 0 errors).
   - Run `npm run build` (must successfully compile and prerender all 34 routes).
   - Test all 11 course routes against `http://localhost:3000` via curl loop to ensure HTTP 200.
4. Issue formal verdict: CLEAN or INTEGRITY VIOLATION.

Write full report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/auditor_m3_course/handoff.md` and report via send_message.
