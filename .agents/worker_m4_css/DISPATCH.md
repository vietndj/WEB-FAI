## 2026-09-03T11:55:15Z
You are worker_m4_css (Design System & CSS Standardization Worker).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m4_css
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY READING:
1. Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
2. Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
3. CSS Design System Specifications: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_component_survey/handoff.md (Section 2.4)

EXCLUSIVE WRITE OWNERSHIP:
1. `src/styles/fai-design-system.css` (Create new)
2. `src/app/layout.js` (Import the new css: `import "@/styles/fai-design-system.css";`)
3. Components in:
   - `src/components/tuyen-sinh/`
   - `src/components/ve-fai/`
   - `src/components/course/`

STRICTLY FORBIDDEN:
- DO NOT touch `src/app/globals.css`, `public/fonts/`, or `src/app/lien-he/page.js` (Avoid conflicts with parallel font thread).
- DO NOT touch `src/data/*`.
- DO NOT run git commit, git push, or deploy to Vercel production.

TASKS:
1. Create `src/styles/fai-design-system.css` based on Section 2.4 of `explorer_component_survey/handoff.md`:
   - Surfaces: `.fai-card-glass`, `.fai-card-glass-dark`, `.fai-card-elevated`
   - Badges: `.fai-badge`, `.fai-badge-primary`, `.fai-badge-secondary`, `.fai-badge-accent`, `.fai-badge-success`
   - Typography: `.fai-section-eyebrow`, `.fai-section-heading`, `.fai-section-heading-light`, `.fai-section-description`
   - Forms: `.fai-form-group`, `.fai-form-label`, `.fai-form-input`, `.fai-form-select`, `.fai-form-error`
   - Buttons: `.fai-btn-copy`, `.fai-btn-copy-success`
   - Strict preservation of brand tokens: `--primary` (#E8741E), `--secondary` (#0D2137), `--accent` (#C9972C), and fonts `var(--font-sans)` ('SVN-Sonoma'), `var(--font-heading-medium)` ('SVN-Sonoma Medium').
2. Import `src/styles/fai-design-system.css` in `src/app/layout.js`.
3. In `src/components/tuyen-sinh/`, `src/components/ve-fai/`, and `src/components/course/`, replace repeating inline styles (`style={{...}}`) with these shared `.fai-*` classes wherever applicable to eliminate inline style bloat.
4. Verify responsive design on mobile (375px), tablet (768px), and desktop (1280px) to ensure no horizontal overflow.

VERIFICATION:
- `npx eslint src/styles/ src/components/tuyen-sinh/ src/components/ve-fai/ src/components/course/ src/app/layout.js` (must have 0 errors).
- `npm run build` (must compile successfully with 0 errors across all 34 routes).
- Verify runtime endpoints via curl on `http://localhost:3000`.

Write completion report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m4_css/handoff.md` and report via send_message.

## 2026-09-03T12:05:37Z
**Context**: Milestone 4 Status Check
**Content**: Please report your current step and ETA for completing `src/styles/fai-design-system.css` and the component refactoring.
**Action**: Reply with brief status update.
