# BRIEFING — 2026-09-03T18:25:00+07:00

## Mission
Adversarially and empirically verify the decomposition of the Tuyển Sinh page (`src/app/tuyen-sinh/page.js`), ensuring line count < 250, data integrity, SSR/HTML rendering correctness, anchor navigation, and contract compliance.

## 🔒 My Identity
- Archetype: challenger
- Roles: critic, specialist
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_1
- Original parent: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Milestone: M2 - Decomposition of Tuyen Sinh Page
- Instance: 1 of 1

## 🔒 Key Constraints
- Review-only — do NOT modify implementation code
- Local dev only — do NOT run git commit or git push
- Empirical proof required — run verification code ourselves, no trusting claims
- Output handoff report to `.agents/challenger_m2_1/handoff.md` and send report via `send_message`

## Current Parent
- Conversation ID: e4b8befb-dbfe-4687-b7a1-9bbb40036eb1
- Updated: 2026-09-03T18:25:00+07:00

## Review Scope
- **Files to review**:
  - `fai/src/app/tuyen-sinh/page.js`
  - `fai/src/components/tuyen-sinh/*`
  - `fai/src/data/admissions.js`, `fai/src/data/contacts.js`, `fai/src/data/scholarships.js`, `fai/src/data/tuition.js`
- **Interface contracts**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md`
- **Review criteria**: line count strictly < 250, 11 courses present, 4 scholarship brands with units, 2 TPBank accounts & transfer syntax, `#faq` anchor, hotline numbers, build & SSR render health.

## Attack Surface
- **Hypotheses tested**:
  - `src/app/tuyen-sinh/page.js` line count < 250: VERIFIED (40 lines).
  - All 11 courses rendered in dropdown: VERIFIED (11/11).
  - 4 scholarship brands rendered: VERIFIED (Aptech, Arena, Skillking, Jetking in tab buttons).
  - Scholarship values ("14 Triệu", "10 Triệu", "6 Triệu", "8 Triệu") in rendered HTML: CHALLENGE DETECTED ("8 Triệu" is missing from initial SSR HTML because only active tab `aptech` is rendered).
  - TPBank accounts (HN 00006969813, DN 03557714109) & syntax: VERIFIED.
  - Anchor `#faq` present: VERIFIED (`<span id="faq" .../>`).
  - Hotlines from `contacts.js`: VERIFIED (`024 7300 8855`, `0236 730 8826`).
  - Production build & lint: VERIFIED (34/34 static routes, 0 ESLint errors).
- **Vulnerabilities found**:
  - In `ScholarshipTabSection.jsx`, conditional tab rendering omits non-active tab cards (Jetking "8 Triệu", Arena, Skillking) from the server-rendered HTML.
- **Untested angles**:
  - Live lead submit POST to Google Sheet script (mock tested in component).

## Loaded Skills
None currently assigned.

## Key Decisions Made
- Formulated verdict: CHALLENGE_DETECTED based on empirical absence of "8 Triệu" in rendered HTML.
- Provided concrete mitigation for worker to render all tab panels with CSS display toggle.

## Artifact Index
- `.agents/challenger_m2_1/DISPATCH.md` — Incoming dispatch log
- `.agents/challenger_m2_1/BRIEFING.md` — Agent state & memory
- `.agents/challenger_m2_1/progress.md` — Progress tracker
- `.agents/challenger_m2_1/handoff.md` — Final handoff report
