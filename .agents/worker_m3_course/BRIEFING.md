# BRIEFING — 2026-09-03T18:48:45+07:00

## Mission
Refactor all 11 course pages in FAI website into thin React Server Components backed by a unified, modular CourseLayout component system and centralized courses.js data model.

## 🔒 My Identity
- Archetype: worker
- Roles: implementer, qa
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m3_course
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M3 (CourseLayout & 11 Pages Refactoring)

## 🔒 Key Constraints
- Local development only: NO git commit, NO git push, NO deploy to Vercel.
- DO NOT TOUCH: src/app/globals.css, public/fonts/, src/app/lien-he/page.js, src/app/tuyen-sinh/, src/app/ve-fai/, src/components/tuyen-sinh/, src/components/ve-fai/
- Exclusive write ownership: src/components/course/*, src/data/courses.js, src/data/programs.js, 11 course pages in src/app/dao-tao/
- All 11 course page.js must be RSC exporting SEO metadata and rendering <CourseLayout {...COURSE_DATA} />
- Preserve all existing styling (.beau-* CSS classes), brand tokens, assets
- Verification: eslint 0 errors, npm run build 0 errors (34/34 static pages), curl 200 on all 11 routes

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:48:45+07:00

## Task Summary
- **What was built**:
  - `src/components/course/`:
    - `CourseHero.jsx` (Hero with particles, watermark, brand badge, logo, callouts, hero stats, and banner)
    - `CourseOverviewStats.jsx` (Overview stats cards + duration breakdown banner)
    - `CourseCurriculumTabs.jsx` (Curriculum tabs supporting all 5 archetypes: Semesters, Subjects grid + Certificate + Target careers, Module tabs with module tables, Track cards + Studio tools, and Short course cards)
    - `CourseHighlights.jsx` (Why choose us cards with dynamic Lucide icon resolver)
    - `CourseCTABanner.jsx` (Bottom CTA section with TechCTAButton)
    - `CourseLayout.jsx` ('use client' master orchestrator with active-sec- ScrollSpy gradients, switchers, form integration, and footer)
  - `src/data/courses.js`: Central SSoT data module containing all 11 course prop objects
  - `src/data/programs.js`: Re-exports `export * from './courses'`
  - 11 course pages in `src/app/dao-tao/`: Refactored from monolithic 5,878 lines down to 121 lines of clean React Server Components exporting Next.js SEO metadata.
- **Success criteria**:
  - ESLint: 0 errors, 0 warnings across all files.
  - Next.js build: 34/34 static pages generated successfully.
  - Curl HTTP 200: All 11 routes return HTTP 200 with clean, comprehensive SSR HTML (>70KB each) and zero hydration errors.
  - Code reduction: Total course page lines dropped from 5,878 lines to 121 lines (97.9% reduction).

## Change Tracker
- **Files modified/created**:
  - `src/components/course/CourseHero.jsx`: Created (Hero section)
  - `src/components/course/CourseOverviewStats.jsx`: Created (Overview stats & duration banner)
  - `src/components/course/CourseCurriculumTabs.jsx`: Created (Supports all 5 curriculum archetypes)
  - `src/components/course/CourseHighlights.jsx`: Created (Why choose us cards)
  - `src/components/course/CourseCTABanner.jsx`: Created (Dark tech CTA banner)
  - `src/components/course/CourseLayout.jsx`: Created (Master client layout)
  - `src/data/courses.js`: Created (11 course data models)
  - `src/data/programs.js`: Re-exported `./courses`
  - 11 course pages in `src/app/dao-tao/`: Refactored to thin RSCs
  - `scripts/verify-course-refactor-m3.mjs`: Empirical verification test suite (122 tests)
- **Build status**: PASS (34/34 pages, Next.js 16.2.9 Turbopack)
- **Pending issues**: None

## Quality Status
- **Build/test result**: PASS (npm run build: 34/34 pages; verify script: 122/122 tests passed)
- **Lint status**: PASS (0 errors, 0 warnings)
- **Tests added/modified**: `scripts/verify-course-refactor-m3.mjs`

## Loaded Skills
- None

## Key Decisions Made
- `CourseLayout.jsx` marked `'use client'` to encapsulate `IntersectionObserver` scroll spy and state machine for tabs while preserving Server Component status for all 11 `page.js` files.
- `CourseCurriculumTabs.jsx` dynamically detects and natively renders all 5 curriculum archetypes (Semesters, Subjects grid, Module tabs, Track cards, Short courses), allowing every course page to simply pass `<CourseLayout {...COURSE_DATA} />`.
- All brand Zalo links (`https://zalo.me/fptaptech`, `https://zalo.me/fptarenaofficial`, `https://zalo.me/fptskillkingofficial`, `https://zalo.me/jetkingfpt`) and brand tokens preserved with 100% fidelity.

## Artifact Index
- DISPATCH.md — Assignment instructions
- BRIEFING.md — Persistent context
- progress.md — Liveness heartbeat
- handoff.md — Final handoff report
- scripts/verify-course-refactor-m3.mjs — Comprehensive empirical test suite
