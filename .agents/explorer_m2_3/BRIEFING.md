# BRIEFING — 2026-09-03T18:14:00+07:00

## Mission
Investigate component integration, React 19 / Next.js 16 hydration safety, and SSoT data binding for Milestone 2.

## 🔒 My Identity
- Archetype: explorer
- Roles: Codebase Researcher - Component Integration & Hydration
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: Milestone 2

## 🔒 Key Constraints
- Read-only investigation — do NOT implement
- Do NOT modify codebase in /Users/vietmac/Documents/CODE/WEB- FAI/fai
- Local dev only — NO git commit/push, NO Vercel deployment
- All communications to parent via send_message

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:14:00+07:00

## Investigation State
- **Explored paths**:
  - `src/data/programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`
  - `src/app/tuyen-sinh/page.js` (1,995 lines)
  - `src/app/ve-fai/page.js` (1,011 lines)
  - `src/components/ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, `Skillking100hFormSection.jsx`
  - `src/components/ScrollTypewriter.jsx`, `ParticleCanvas.jsx`
- **Key findings**:
  - All 4 SSoT data modules already export complete datasets. No changes required to data layer.
  - In `src/data/scholarships.js`, `item.value` is numeric string (e.g. `'14'`) and `item.unit` is `'Triệu'`. Worker M2 must bind as `{item.unit ? `${item.value} ${item.unit}` : item.value}` to display `"14 Triệu"`.
  - Google Apps Script webhook URL is unified in `EXTERNAL_LINKS.leadSubmitScript`. Payload schema verified for backwards compatibility.
  - Hydration boundaries: Decomposing `tuyen-sinh` and `ve-fai` isolates client-side hooks (`useCountUp`, typewriter timers, clipboard copy, form state) into leaf client components, enabling both root `page.js` files to become Server Components exporting SEO `metadata`.
  - Typewriter re-render storm in `ve-fai` (re-rendering entire 1,011 lines every 35ms) will be completely eliminated by isolating state in `AboutHeroSection.jsx`.
- **Unexplored areas**: None. Milestone 2 scope is fully investigated and ready for implementation.

## Key Decisions Made
- Confirmed atomic component boundaries: 6 components for `tuyen-sinh`, 7 components for `ve-fai`.
- Defined exact prop interfaces, hook isolation rules, and Google Apps Script payload schema.

## Artifact Index
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3/DISPATCH.md — incoming task dispatch
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3/BRIEFING.md — persistent working memory
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3/progress.md — liveness heartbeat
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3/handoff.md — final research report
