## 2026-09-03T12:11:33Z
You are worker_m5_e2e (E2E Integration & Verification Worker).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m5_e2e
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY READING:
1. Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
2. Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md

TASKS:
1. Dynamic Single Source of Truth (SSoT) Propagation Test:
   - Create an automated test script in `scripts/verify-ssot-propagation.mjs` (or similar):
     * Temporarily modify a specific data field in `src/data/contacts.js` (e.g. `HOTLINES.hn` to `"0999.888.777"`).
     * Query `http://localhost:3000/tuyen-sinh`, `http://localhost:3000/ve-fai`, and `http://localhost:3000/dao-tao/aptech/accp`.
     * Assert that `"0999.888.777"` is actively reflected in the server-rendered HTML across multiple pages without modifying any component source files!
     * Immediately revert `src/data/contacts.js` back to its exact original state.
     * Verify that the original phone number is cleanly restored.
2. Full Route Health Probing:
   - Verify all 15 key routes on `http://localhost:3000`:
     * `/` (Home)
     * `/tuyen-sinh`
     * `/ve-fai`
     * `/lien-he`
     * `/dao-tao/aptech/accp`
     * `/dao-tao/aptech/1-nam`
     * `/dao-tao/aptech/6-thang`
     * `/dao-tao/aptech/100-200h`
     * `/dao-tao/arena/amsp`
     * `/dao-tao/arena/6-18-thang`
     * `/dao-tao/arena/100h`
     * `/dao-tao/skillking/18-thang`
     * `/dao-tao/skillking/100h`
     * `/dao-tao/chip-design`
     * `/dao-tao/ai-agent`
   - Assert all 15 routes return HTTP 200 with valid, non-empty HTML payloads.
3. Responsive & Layout Safeguards:
   - Audit CSS in `src/styles/fai-design-system.css` and components to verify responsive behavior at 375px (Mobile), 768px (Tablet), and 1280px (Desktop), confirming zero horizontal scroll overflow.
4. Next.js Production Build:
   - Run `npm run build` and confirm all 34 routes compile and prerender cleanly with 0 errors.
   - Run targeted ESLint across `src/data/`, `src/components/`, `src/app/`.

STRICT CONSTRAINTS:
- Local development only! DO NOT run git commit, git push, or deploy to Vercel production.
- Ensure any test modifications to `src/data/` are 100% reverted before concluding.

Write completion report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m5_e2e/handoff.md` and report via send_message.
