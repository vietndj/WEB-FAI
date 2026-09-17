## 2026-09-03T11:26:30Z

You are worker_m2_fix (Scholarship SSR Render Fix Worker).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2_fix
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
- Challenger Defect Report: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_1/handoff.md

EXCLUSIVE WRITE OWNERSHIP:
`src/components/tuyen-sinh/ScholarshipTabSection.jsx`

TASK:
In `src/components/tuyen-sinh/ScholarshipTabSection.jsx`:
Currently, only `currentBrandData.items` is mapped in JSX, which renders only the cards of `activeBrand` (default 'aptech').
Consequently, Jetking's "8 Triệu" (and Arena's cards) are absent from the initial SSR HTML returned by `http://localhost:3000/tuyen-sinh`.
Refactor `ScholarshipTabSection.jsx` to render all 4 brand panels into the DOM, controlling visibility with CSS `display: activeBrand === brand.id ? 'grid' : 'none'`:
```jsx
{Object.values(SCHOLARSHIP_BRANDS).map((brand) => (
  <div
    key={brand.id}
    style={{
      display: activeBrand === brand.id ? 'grid' : 'none',
      maxWidth: '1160px',
      margin: '0 auto',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '24px'
    }}
  >
    {brand.items.map((item, idx) => (
       ...
    ))}
  </div>
))}
```
Keep the brand switcher tabs and header/banner fully functional and interactive.

VERIFICATION:
1. Run `curl -s http://localhost:3000/tuyen-sinh | grep "8 Triệu"` — must match!
2. Run `curl -s http://localhost:3000/tuyen-sinh | grep "14 Triệu"` — must match!
3. Run `npx eslint src/components/tuyen-sinh/ScholarshipTabSection.jsx` — 0 errors.
4. Run `npm run build` — must build cleanly.

Write completion report to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2_fix/handoff.md` and report back via send_message.
