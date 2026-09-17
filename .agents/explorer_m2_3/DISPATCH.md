## 2026-09-03T11:10:41Z
You are explorer_m2_3 (Codebase Researcher - Component Integration & Hydration).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (Read first!)
- Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
- Prior M1 Handoff: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data/handoff.md

TASK:
Investigate component integration, React 19 / Next.js 16 hydration safety, and SSoT data binding for Milestone 2:
1. Inspect `src/data/programs.js`, `src/data/scholarships.js`, `src/data/tuition.js`, `src/data/contacts.js` and verify exported APIs match what the new decomposed components need.
2. Inspect client-side hooks and state management across `tuyen-sinh` and `ve-fai` (`'use client'`, clipboard copying, form submit, counter animations) to guarantee zero SSR hydration mismatch.
3. Form submission integration: verify Google Apps Script endpoint URL and payload schema.
4. Define clear verification criteria and step-by-step guidance for the Worker agent that will implement Milestone 2.

STRICT CONSTRAINTS:
- Read-only exploration! DO NOT write or edit source code files.
- Local dev only! DO NOT run git commit/push or Vercel deployment.
- Write your comprehensive findings to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3/handoff.md` and report back via send_message.
