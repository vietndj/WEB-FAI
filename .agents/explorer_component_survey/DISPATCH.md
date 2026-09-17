## 2026-09-03T10:45:32Z
You are explorer_component_survey.
Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_component_survey
Codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai
Authoritative requirement document: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (read this file first!).

Your mission:
Investigate the component structure, page sizes, and CSS styling in fai:
1. Inspect src/app/tuyen-sinh/page.js (line count, sections, dependencies, state, inline styling). Propose an exact decomposition plan into src/components/tuyen-sinh/ (HeroSection.jsx, TargetAudienceSection.jsx, AdmissionMethodSection.jsx, ScholarshipTabSection.jsx, TuitionBankSection.jsx, OnlineRegistrationSection.jsx) to get page.js under 250 lines.
2. Inspect src/app/ve-fai/page.js and other monolithic pages. Propose decomposition plan into atomic components.
3. Inspect all pages under src/app/dao-tao/ (aptech/, arena/, skillking/, jetking/). Analyze common layout patterns and design a reusable CourseLayout.jsx component.
4. Inspect src/app/globals.css and repetitive inline styles across pages (glassmorphism cards, badges, headings, gradients, buttons). Design standard reusable CSS utility classes (.fai-card-glass, .fai-badge, .fai-section-heading, etc.) while strictly preserving brand tokens (--primary, --secondary, --accent, fonts SVN-Sonoma, SVN-Poppins).
5. Check local dev environment (running ports, Turbopack, curl http://localhost:3000). Note: Local development only, no git commit/push or deploy.

Write your detailed analysis and proposal to /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_component_survey/handoff.md.
When finished, send a message back to parent orchestrator with a summary and the path to your handoff report.
