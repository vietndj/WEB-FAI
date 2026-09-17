## 2026-09-03T10:52:00Z

You are worker_m1_data.
Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Authoritative requirement document: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (read this file first!).
Architecture & Milestones: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/PROJECT.md
Survey Reports to consult:
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_codebase_survey/handoff.md (contains exact data schemas, contracts, and proposed code)
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_spec_miner/handoff.md (contains full curriculum and program specifications)

Your Mission — Milestone 1: Content Decoupling & Single Source of Truth:
1. Build the 4 centralized data modules under src/data/:
   - `src/data/programs.js`: 11 official 2026 training programs across the 4 brands (Aptech, Arena, Skillking, Jetking), including program details, brand hierarchy, sub-course options, and switcher navigation items.
   - `src/data/scholarships.js`: 2026 scholarships & incentives for the 4 brands (Aptech, Arena, Skillking, Jetking) + BRAND_FORM_PRESETS for form headers/subtitles.
   - `src/data/tuition.js`: Bank transfer info for Hanoi (STK 00006969813) & Da Nang (STK 03557714109) TPBank, syntax, guidelines.
   - `src/data/contacts.js`: Hotlines (024 7300 8855 / 0236 730 8826), emails, working hours, campuses by brand and city, legal URLs, lead webhook endpoint.
2. Refactor shared consumer components to import from these data files instead of hardcoded strings:
   - `src/components/Header.jsx`: Import megamenu and mobile menu courses and links from `@/data/programs`.
   - `src/components/Footer.jsx`: Import campuses, hotlines, emails, social/zalo links from `@/data/contacts` and `@/data/programs`.
   - `src/components/ScholarshipFormSection.jsx`: Import presets, hotlines, and links from `@/data/*`.
   - `src/components/Arena100hFormSection.jsx` & `src/components/Skillking100hFormSection.jsx`: Import options and links from `@/data/*`.
   - `src/components/AptechProgramSwitcher.jsx`, `ArenaProgramSwitcher.jsx`, `SkillkingProgramSwitcher.jsx`, `JetkingProgramSwitcher.jsx`: Import switcher items from `@/data/programs`.
3. Verify:
   - Test build and check that `curl -I http://localhost:3000/` and other core pages return HTTP 200 OK without errors.
   - Verify that all imports resolve cleanly.

Exclusive Write Ownership:
- `fai/src/data/programs.js`
- `fai/src/data/scholarships.js`
- `fai/src/data/tuition.js`
- `fai/src/data/contacts.js`
- `fai/src/components/Header.jsx`
- `fai/src/components/Footer.jsx`
- `fai/src/components/ScholarshipFormSection.jsx`
- `fai/src/components/Arena100hFormSection.jsx`
- `fai/src/components/Skillking100hFormSection.jsx`
- `fai/src/components/AptechProgramSwitcher.jsx`
- `fai/src/components/ArenaProgramSwitcher.jsx`
- `fai/src/components/SkillkingProgramSwitcher.jsx`
- `fai/src/components/JetkingProgramSwitcher.jsx`

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

STRICT CONSTRAINTS:
- Local development only! DO NOT run git commit, git push, or deploy to Vercel production.
- Test directly on http://localhost:3000.

Write your report to /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data/handoff.md.
When finished, send a message back to parent orchestrator with your results.
