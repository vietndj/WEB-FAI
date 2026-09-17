## 2026-09-03T08:08:49Z
You are the Fix Strategy Explorer for Iteration 2 of the FAI 2026 Admissions Page project.
Your working directory is: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_r2
Original request path: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
Challenger 2 handoff path: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_2/handoff.md
Target implementation file: /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js

MANDATORY FIRST STEPS:
1. You MUST read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md.
2. Read /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_2/handoff.md to understand the exact reasons for the REQUEST_CHANGES verdict.

YOUR TASK:
1. Investigate the 2 specific defects identified by Challenger 2 in src/app/tuyen-sinh/page.js:
   Defect 1: Phone regex /^(0[3|5|7|8|9])[0-9]{8}$/ on line 308 matches literal pipe '|'.
   Defect 2: 12-column grid in Block 4 (lines 931-1011) and Block 7 (lines 1544-1641) uses inline span 7 and span 5 without mobile breakpoint overrides, causing mobile layout collapse down to 122px-171px.
2. Formulate a precise, robust fix strategy:
   - Provide the exact corrected regex: /^(0[35789])[0-9]{8}$/.
   - Provide the exact responsive styling strategy to ensure on viewports < 992px, the 12-column grids collapse to 1-column (grid-template-columns: 1fr or grid-column: span 12 / 1 / -1 with 100% width). Note: It is best to embed this responsive style directly in page.js (via <style> block or clean inline media approach) to respect the single-file write ownership of src/app/tuyen-sinh/page.js without modifying globals.css.
3. Verify that the proposed fix retains 100% compliance with ESLint (npx eslint src/app/tuyen-sinh/page.js) and Turbopack dev server HTTP 200.
4. Write your findings and recommended Worker instructions in /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_fix_r2/fix_strategy.md and your handoff.md.
5. Send a message to parent when complete.
