# Execution Plan — FAI Web Architecture Refactoring

## 1. Overview
Refactor the FAI Web Next.js codebase to eliminate god-files, decouple content into a single source of truth in `src/data/`, modularize monolithic pages into atomic components (< 250 lines), extract repetitive CSS into shared utility classes, and verify on local environment (`http://localhost:3000`).

## 2. Phases & Milestones

### Phase 0: Survey & Exploration
- **Objectives**: Map full scope, inspect existing data structures, analyze page dependencies, audit inline CSS classes, check running local server.
- **Agents**:
  - `spec_miner`: Extract exact 11 training programs, scholarships, bank accounts, contacts from request & existing implementations.
  - `code_survey`: Map all files importing or hardcoding program info, contacts, tuition, forms across the entire `fai/src/` folder.
  - `component_survey`: Inspect `src/app/tuyen-sinh/page.js` (~2000 lines), `src/app/ve-fai/page.js` (~1000 lines), and `/dao-tao/*` routes to design component decomposition and reusable layouts.

### Phase 1: Milestone 1 — Content Decoupling & Single Source of Truth
- Implement centralized data files:
  - `src/data/programs.js`: 11 official 2026 programs with full metadata & roadmaps.
  - `src/data/scholarships.js`: Scholarships & incentives 2026 for Aptech, Arena, Skillking, Jetking.
  - `src/data/tuition.js`: Bank transfer info for Hanoi & Da Nang.
  - `src/data/contacts.js`: Hotlines, emails, campus addresses.
- Refactor core pages and forms to import from `src/data/`.
- Review, challenge, and forensic audit.

### Phase 2: Milestone 2 — Component Decomposition
- Decompose `src/app/tuyen-sinh/page.js` into atomic components in `src/components/tuyen-sinh/`:
  - `HeroSection.jsx`
  - `TargetAudienceSection.jsx`
  - `AdmissionMethodSection.jsx`
  - `ScholarshipTabSection.jsx`
  - `TuitionBankSection.jsx`
  - `OnlineRegistrationSection.jsx`
- Decompose `src/app/ve-fai/page.js` into atomic components in `src/components/ve-fai/`.
- Ensure main `page.js` files are under 250 lines.
- Review, challenge, and forensic audit.

### Phase 3: Milestone 3 — Reusable Course Layout for `/dao-tao/*`
- Build reusable `CourseLayout.jsx` in `src/components/dao-tao/` or shared components.
- Refactor `/dao-tao/aptech/*`, `/dao-tao/arena/*`, `/dao-tao/skillking/*`, `/dao-tao/jetking/*` to use the unified layout.
- Review, challenge, and forensic audit.

### Phase 4: Milestone 4 — Design System & CSS Standardization
- Extract repeating inline styles into shared classes in `src/app/globals.css` or dedicated CSS modules (`.fai-card-glass`, `.fai-badge`, `.fai-section-heading`, etc.).
- Maintain brand tokens (`--primary`, `--secondary`, `--accent`) and fonts (`SVN-Sonoma`, `SVN-Poppins`).
- Ensure no React hydration errors and verify responsive design (375px, 768px, 1280px).
- Review, challenge, and forensic audit.

### Phase 5: Milestone 5 — E2E Verification & SSoT Dynamic Test
- Verify all pages return HTTP 200 on `http://localhost:3000`.
- Verify dynamic update test: Change a value in `src/data/` and verify it propagates across all pages/forms without page edits.
- Ensure all acceptance criteria are fully met.
- Conduct final Victory Audit and handoff.
