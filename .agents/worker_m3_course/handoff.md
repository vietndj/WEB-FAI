# Handoff Report: CourseLayout & 11 Pages Refactoring (Milestone 3)

**Date**: 2026-09-03  
**Agent**: worker_m3_course (CourseLayout & 11 Pages Refactoring Worker)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_course`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Milestone**: M3 — CourseLayout & 11 Pages Refactoring  
**Status**: COMPLETE (Hard Handoff)

---

## 1. Observation

### 1.1 Baseline State Prior to M3 Execution
- The 11 course pages in `src/app/dao-tao/` were monolithic God Files with an aggregate count of **5,878 lines of code**:
  - `src/app/dao-tao/aptech/accp/page.js`: 520 lines
  - `src/app/dao-tao/aptech/1-nam/page.js`: 658 lines
  - `src/app/dao-tao/aptech/6-thang/page.js`: 542 lines
  - `src/app/dao-tao/aptech/100-200h/page.js`: 738 lines
  - `src/app/dao-tao/arena/amsp/page.js`: 629 lines
  - `src/app/dao-tao/arena/6-18-thang/page.js`: 340 lines
  - `src/app/dao-tao/arena/100h/page.js`: 467 lines
  - `src/app/dao-tao/skillking/18-thang/page.js`: 500 lines
  - `src/app/dao-tao/skillking/100h/page.js`: 312 lines
  - `src/app/dao-tao/chip-design/page.js`: 597 lines
  - `src/app/dao-tao/ai-agent/page.js`: 575 lines
- All 11 pages contained duplicated Hero sections, duplicated ScrollSpy `IntersectionObserver` logic, duplicated switchers, duplicated overview stat cards, and duplicated CTA/form/footer code.
- All 11 pages were marked `'use client'`, preventing Next.js App Router native SEO `metadata` exports.
- `src/components/course/` directory did not exist.
- `src/data/courses.js` did not exist.

### 1.2 Delivered Artifacts & Exact File Layout
We created and refactored the following components and data modules:

1. **Modular Course Layout Components in `src/components/course/`**:
   - `CourseHero.jsx` (230 lines): Renders particle background, watermark text, brand badge, multi-line titles (`\n` line-breaks), logo, description paragraphs, core highlight callout card, hero stats pills, and optimized Next.js banner image.
   - `CourseOverviewStats.jsx` (215 lines): Renders 4 light overview stat cards with dynamic Lucide icon resolution (`BookOpen`, `Clock`, `Trophy`, `Briefcase`, `Award`, `Layers`, `Cpu`, `Bot`, `Sparkles`) and the total duration breakdown banner.
   - `CourseCurriculumTabs.jsx` (520 lines): Complete multi-archetype curriculum renderer supporting:
     - **Archetype 1 (Semesters)**: Sticky tab switcher, active semester card, detailed subjects list, and 3-column grid (`coreStack`, `aiTools`, `careers`).
     - **Archetype 2 (Subjects Grid)**: 10-subject dark cyber glass cards, official certificate card with Aptech CPISM badge, and target career cards.
     - **Archetype 3 (Course Modules)**: Sticky course tab switcher (100H/200H), module tables with STT, subject name, duration, role badge, and content description.
     - **Archetype 4 (Track Cards)**: 3 track duration cards (6, 12, 18 months) with skills lists and 8-item Studio Tools grid (`.beau-tech-grid`).
     - **Archetype 5 (Short Courses)**: 3-4 workshop cards with badges, icons, descriptions, subjects/skills list, and output credentials.
   - `CourseHighlights.jsx` (160 lines): Renders why-choose-us feature cards in light theme with dynamic Lucide icon resolution (`ShieldCheck`, `BrainCircuit`, `Zap`, `Globe`, `Wrench`, `FolderGit2`, etc.).
   - `CourseCTABanner.jsx` (42 lines): Dark tech bottom banner with glowing circle and `TechCTAButton`.
   - `CourseLayout.jsx` (277 lines, `'use client'`): Master layout orchestrator with ScrollSpy `IntersectionObserver` driving `.active-sec-${activeSection}` CSS radial gradient animations, brand presets (`aptech`, `arena`, `skillking`, `chip-design`, `ai-agent`, `jetking`), automatic switcher detection, form integration, and global footer.

2. **Central Data Layer**:
   - `src/data/courses.js` (680 lines): Single Source of Truth exporting all 11 course prop objects:
     - `COURSE_ACCP`
     - `COURSE_APTECH_1NAM`
     - `COURSE_APTECH_6THANG`
     - `COURSE_APTECH_100_200H`
     - `COURSE_ARENA_AMSP`
     - `COURSE_ARENA_6_18THANG`
     - `COURSE_ARENA_100H`
     - `COURSE_SKILLKING_18THANG`
     - `COURSE_SKILLKING_100H`
     - `COURSE_CHIP_DESIGN`
     - `COURSE_AI_AGENT`
   - `src/data/programs.js`: Re-exports all course objects via `export * from './courses';`.

3. **11 Refactored Course Pages in `src/app/dao-tao/`**:
   - Every file refactored to an 11-line pure React Server Component (no `'use client'`), exporting Next.js SEO `metadata` and rendering `<CourseLayout {...COURSE_DATA} activePath="..." />`.
   - Aggregate line count across all 11 pages: **121 lines** (down from **5,878 lines**, achieving a **97.9% code reduction**).

---

## 2. Logic Chain

1. **Client vs Server Boundary**:
   - The outer `.beau-subpage-container` requires dynamic classes (`active-sec-0`, `active-sec-1`...) to animate background radial gradients on scroll. Furthermore, curriculum tabs require interactive state (`useState(activeTab)`).
   - Marking `CourseLayout.jsx` with `'use client'` encapsulates the client state, scroll listener, and tab transitions in a single reusable layout.
   - This architectural choice freed all 11 course `page.js` files to be pure React Server Components, unlocking native Next.js `metadata` exports for SEO.
2. **Unified Curriculum Archetype Engine**:
   - Rather than forcing non-standard courses to pass unwieldy inline JSX into page templates, `CourseCurriculumTabs.jsx` inspects the data signature (`semesters`, `subjects`, `courses`, `tracks`, `shortCourses`) and auto-renders the corresponding UI structure.
   - This abstraction allowed 100% of the 11 pages to share the exact same 11-line RSC pattern.
3. **Single Source of Truth (SSoT)**:
   - All text copy, course titles, module breakdowns, duration hours, Zalo links, and form presets reside exclusively in `src/data/courses.js`.
   - Modifying a course detail in `courses.js` instantly propagates to the page without touching any JSX component.

---

## 3. Caveats

- `src/app/globals.css`, `public/fonts/`, `src/app/lien-he/page.js`, `src/app/tuyen-sinh/`, `src/app/ve-fai/`, `src/components/tuyen-sinh/`, and `src/components/ve-fai/` were strictly preserved and not modified by this worker.
- All brand Zalo links were preserved:
  - Aptech: `https://zalo.me/fptaptech`
  - Arena: `https://zalo.me/fptarenaofficial`
  - Skillking: `https://zalo.me/fptskillkingofficial`
  - Jetking: `https://zalo.me/jetkingfpt`

---

## 4. Conclusion

- **Milestone 3 is 100% complete and fully verified**.
- All 11 course pages in `/dao-tao/*` have been refactored into thin React Server Components.
- The monolithic boilerplate was eliminated, cutting total course page lines by **97.9%** (5,878 lines -> 121 lines).
- `CourseLayout.jsx` and its 5 subcomponents provide a robust, modular design system supporting all 5 curriculum archetypes.

---

## 5. Verification Method

To independently verify the implementation:

### 5.1 Static Code Analysis (ESLint)
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
npx eslint src/components/course/ src/data/courses.js src/data/programs.js src/app/dao-tao/
```
*Result*: Exit code 0, 0 errors, 0 warnings.

### 5.2 Production Build Verification
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
npm run build
```
*Result*: Next.js 16.2.9 (Turbopack) successfully compiled and generated 34/34 static pages without errors.

### 5.3 Live Server HTTP 200 & Clean SSR Payload Check
```bash
cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
node scripts/verify-course-refactor-m3.mjs
```
*Result*: **122/122 tests passed (0 failures)**:
- All 11 course routes returned `HTTP 200 OK`.
- Pre-rendered HTML payloads are comprehensive (>70KB each).
- Zero hydration errors found in rendered HTML.
- Total course page lines: 121 lines (97.9% reduction from 5,878 lines).
