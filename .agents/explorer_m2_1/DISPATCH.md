## 2026-09-03T11:10:41Z
You are explorer_m2_1 (Codebase Researcher - Tuyen Sinh Decomposition).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_1
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (Read first!)
- Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
- Prior M1 Handoff: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data/handoff.md

TASK:
Deeply investigate `src/app/tuyen-sinh/page.js` (~1994 lines) in the codebase.
Analyze:
1. Exact state variables and handlers: `activeBrand`, `copiedField`, `formData`, `formErrors`, `isSubmitting`, `isSubmitted`, `handleCopy`, `validateForm`, `handleFormSubmit`, etc.
2. Data dependencies: How to replace hardcoded data inside `tuyen-sinh` with imports from `src/data/programs.js`, `src/data/scholarships.js`, `src/data/tuition.js`, `src/data/contacts.js`.
3. Detailed breakdown into 6 atomic components in `src/components/tuyen-sinh/`:
   - `HeroSection.jsx`
   - `TargetAudienceSection.jsx`
   - `AdmissionMethodSection.jsx`
   - `ScholarshipTabSection.jsx`
   - `TuitionBankSection.jsx`
   - `OnlineRegistrationSection.jsx`
4. Blueprint of `src/app/tuyen-sinh/page.js` to ensure it is clean and < 250 lines.

STRICT CONSTRAINTS:
- Read-only exploration! DO NOT write or edit source code files.
- Local dev only! DO NOT run git commit/push or Vercel deployment.
- Write your comprehensive findings to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_1/handoff.md` and report back via send_message.
