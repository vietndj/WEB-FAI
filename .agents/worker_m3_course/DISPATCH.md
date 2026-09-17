## 2026-09-03T11:40:58Z

You are worker_m3_course (CourseLayout & 11 Pages Refactoring Worker).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_course
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY READING (READ BEFORE WRITING ANY CODE):
1. Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
2. Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
3. CourseLayout Architecture & Code: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_1/handoff.md
4. Course Data Models & courses.js: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_2/handoff.md
5. Migration & Hydration Safety: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_3/handoff.md

EXCLUSIVE WRITE OWNERSHIP:
1. `src/components/course/`:
   - `CourseLayout.jsx` ('use client')
   - `CourseHero.jsx`
   - `CourseOverviewStats.jsx`
   - `CourseCurriculumTabs.jsx`
   - `CourseHighlights.jsx`
   - `CourseCTABanner.jsx`
2. `src/data/courses.js` (Created with all 11 course prop objects) & `src/data/programs.js` (re-export `export * from './courses'`)
3. The 11 course pages in `src/app/dao-tao/`:
   - `src/app/dao-tao/aptech/accp/page.js`
   - `src/app/dao-tao/aptech/1-nam/page.js`
   - `src/app/dao-tao/aptech/6-thang/page.js`
   - `src/app/dao-tao/aptech/100-200h/page.js`
   - `src/app/dao-tao/arena/amsp/page.js`
   - `src/app/dao-tao/arena/6-18-thang/page.js`
   - `src/app/dao-tao/arena/100h/page.js`
   - `src/app/dao-tao/skillking/18-thang/page.js`
   - `src/app/dao-tao/skillking/100h/page.js`
   - `src/app/dao-tao/chip-design/page.js`
   - `src/app/dao-tao/ai-agent/page.js`

DO NOT TOUCH:
- `src/app/globals.css`, `public/fonts/`, `src/app/lien-he/page.js`, `src/app/tuyen-sinh/`, `src/app/ve-fai/`, `src/components/tuyen-sinh/`, `src/components/ve-fai/`.

IMPLEMENTATION GUIDANCE:
- Reference `explorer_m3_1` for the modular structure of `CourseLayout.jsx` and its subcomponents.
- Reference `explorer_m3_2` for `courses.js` data models and props mapping.
- All 11 course `page.js` files must be React Server Components exporting Next.js SEO `metadata` and rendering `<CourseLayout {...COURSE_DATA} />`.
- Ensure all 5 curriculum archetypes render seamlessly (Semesters, Subjects grid, Module tabs, Track cards, Short course cards).
- Preserve all existing styling (.beau-* CSS classes), brand tokens, and assets.

STRICT CONSTRAINTS:
- Local development only! DO NOT run git commit, git push, or deploy to Vercel.
- Test directly on http://localhost:3000.

VERIFICATION:
1. `npx eslint src/components/course/ src/data/courses.js src/app/dao-tao/` -> 0 errors.
2. `npm run build` -> 0 compile errors, 34/34 static pages generated.
3. Verify `curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/dao-tao/...` returns 200 for all 11 routes.
4. Verify line counts of all 11 course pages (significant reduction from ~5,800 total lines).

Write your completion report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_course/handoff.md` and report back via send_message.
