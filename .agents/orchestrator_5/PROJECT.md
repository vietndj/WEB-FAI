# Project: FAI Web Architecture Refactoring

## Architecture
- **Framework**: Next.js 16.2.9 (App Router), React 19.2.4, Tailwind/Custom CSS.
- **Content Architecture**: Single Source of Truth (SSoT) pattern via centralized data modules in `src/data/`:
  - `src/data/programs.js`: 11 training programs, brand structure, syllabi, switcher links, short-course options.
  - `src/data/courses.js`: Rich course prop models for all 11 courses.
  - `src/data/scholarships.js`: 2026 scholarships, funds, badges, form presets for the 4 brands.
  - `src/data/tuition.js`: Official bank transfer accounts (Hà Nội & Đà Nẵng TPBank) and payment guidelines.
  - `src/data/contacts.js`: Hotlines, emails, campus locations, external URLs (privacy policy, lead webhook).
- **Component Architecture**: Atomic component decomposition:
  - `src/components/tuyen-sinh/`: 6 atomic sections for the Admissions page (< 250 lines for `page.js`).
  - `src/components/ve-fai/`: 7 atomic sections for the About FAI page (< 250 lines for `page.js`).
  - `src/components/course/`: Unified `CourseLayout.jsx` and 5 subcomponents (`CourseHero`, `CourseOverviewStats`, `CourseCurriculumTabs`, `CourseHighlights`, `CourseCTABanner`) eliminating ~5,800 lines of duplicate code across all 11 course pages.
- **Design System Architecture**: Shared CSS utilities in `src/styles/fai-design-system.css` imported into `globals.css`:
  - Surfaces: `.fai-card-glass`, `.fai-card-glass-dark`, `.fai-card-elevated`
  - Badges: `.fai-badge`, `.fai-badge-primary`, `.fai-badge-accent`, `.fai-badge-success`
  - Typography: `.fai-section-eyebrow`, `.fai-section-heading`, `.fai-section-description`
  - Forms: `.fai-form-group`, `.fai-form-label`, `.fai-form-input`, `.fai-form-select`, `.fai-form-error`
  - Controls: `.fai-btn-copy`, `.fai-btn-copy-success`
  - Strict preservation of brand tokens: `--primary` (#E8741E), `--secondary` (#0D2137), `--accent` (#C9972C), `--font-sans` ('SVN-Sonoma').

## Code Layout
- Metadata & Reports: `.agents/orchestrator_5/` (ONLY metadata/plans/progress, no source code).
- Source Code:
  - `fai/src/data/` (programs.js, courses.js, scholarships.js, tuition.js, contacts.js)
  - `fai/src/components/tuyen-sinh/` (HeroSection, TargetAudienceSection, AdmissionMethodSection, ScholarshipTabSection, TuitionBankSection, OnlineRegistrationSection)
  - `fai/src/components/ve-fai/` (AboutHeroSection, AboutPhilosophyStatsSection, AboutValuesSection, AboutTimelineSection, AboutProgramsSection, AboutCTASection, AboutContactBannerSection)
  - `fai/src/components/course/` (CourseLayout, CourseHero, CourseOverviewStats, CourseCurriculumTabs, CourseHighlights, CourseCTABanner)
  - `fai/src/styles/fai-design-system.css`
  - `fai/src/app/tuyen-sinh/page.js`, `fai/src/app/ve-fai/page.js`, `fai/src/app/dao-tao/*`

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Programs Data Module | Centralized `src/data/programs.js` for 11 programs | M1 | Survey |
| 2 | Scholarships Data Module | Centralized `src/data/scholarships.js` for 4 brands | M1 | Survey |
| 3 | Tuition Data Module | Centralized `src/data/tuition.js` for HN & DN TPBank | M1 | Survey |
| 4 | Contacts Data Module | Centralized `src/data/contacts.js` for hotlines/emails/campuses | M1 | Survey |
| 5 | Consumer Refactor (Shared Components) | Refactor Header, Footer, Switchers, FormSections to import from data | M1 | Survey |
| 6 | Tuyển sinh Page Decomposition | Decompose `tuyen-sinh/page.js` into 6 atomic components (< 250 lines) | M2 | Survey |
| 7 | Về FAI Page Decomposition | Decompose `ve-fai/page.js` into 7 atomic components (< 250 lines) | M2 | Survey |
| 8 | CourseLayout Reusable Component | Implement `src/components/course/CourseLayout.jsx` | M3 | Survey |
| 9 | Course Pages Refactor | Refactor all 11 course pages in `/dao-tao/*` to use CourseLayout | M3 | Survey |
| 10 | CSS Design System Utilities | Create `src/styles/fai-design-system.css` with `.fai-*` classes | M4 | Survey |
| 11 | Inline Style Reduction & Token Preservation | Replace repeating inline styles with CSS classes, preserve tokens | M4 | Survey |
| 12 | E2E Local Verification (HTTP 200 & Responsive) | Test all routes on http://localhost:3000, 375px/768px/1280px | M5 | Survey |
| 13 | Single Source of Truth Propagation Test | Verify changing data in `src/data/` dynamically updates all pages | M5 | Survey |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Data Modules & SSoT | Implement `src/data/` modules and refactor shared consumer components | None | DONE |
| M2 | Component Decomposition | Decompose `src/app/tuyen-sinh/page.js` and `src/app/ve-fai/page.js` | M1 | DONE |
| M3 | Reusable Course Layout | Implement `CourseLayout.jsx` and refactor 11 course pages | M1 | DONE |
| M4 | Design System & CSS Standardization | Implement `fai-design-system.css`, reduce inline styles, ensure responsive | M2, M3 | IN_PROGRESS |
| M5 | E2E Verification & Integration | Comprehensive verification on localhost:3000, SSoT dynamic update test | M1, M2, M3, M4 | PLANNED |
