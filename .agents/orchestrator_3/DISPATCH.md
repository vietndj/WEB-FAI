## 2026-09-03T10:44:25Z

You are orchestrator_3 (Project Orchestrator) for the FAI Web architecture refactoring project.

Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Original user request file: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md

Please read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md for the full context and latest request (timestamp 2026-09-03T10:43:32Z).

Summary of Mission & Requirements:
1. Content Decoupling & Single Source of Truth:
   - Build centralized data modules under `src/data/`:
     * `src/data/programs.js`: 11 official 2026 training programs with detailed roadmaps.
     * `src/data/scholarships.js`: Scholarships & incentives 2026 for the 4 brands (Aptech, Arena, Skillking, Jetking).
     * `src/data/tuition.js`: Bank transfer info for Hanoi & Da Nang (account numbers, syntax).
     * `src/data/contacts.js`: Hotlines, emails, campus addresses.
   - Refactor core pages (`/tuyen-sinh`, `/lien-he`, `/dao-tao/*`, Form components) to import from these data files instead of hardcoded strings.
2. Component Decomposition:
   - Break down monolithic pages (e.g., `src/app/tuyen-sinh/page.js` ~2,000 lines, `src/app/ve-fai/page.js` ~1,000 lines) into independent atomic components in `src/components/tuyen-sinh/`, etc.
   - Main `page.js` files must be under 250 lines, serving as layout composition and SEO metadata.
   - Reusable layout component for `/dao-tao/*` to eliminate code duplication.
3. Design System & Style Standardization:
   - Extract repeating inline styles into shared classes in CSS (`.fai-card-glass`, `.fai-badge`, `.fai-section-heading`, etc.).
   - Preserve all brand color tokens (`--primary`, `--secondary`, `--accent`) and fonts (`SVN-Sonoma`, `SVN-Poppins`).
   - 100% responsive, no hydration mismatch errors.
4. Strict Constraints:
   - Local development only! DO NOT run git commit, git push, or deploy to Vercel production.
   - Test directly on http://localhost:3000.
   - Ensure all acceptance criteria are verified with actual tests / verification.

Your first steps:
- Create `BRIEFING.md`, `plan.md`, and `progress.md` in your working directory `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/`.
- Dispatch specialists (explorers, workers/implementers, reviewers) to execute and verify the project.
- Report completion and handoff when all acceptance criteria are met so that a Victory Audit can be conducted.
