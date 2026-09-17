# BRIEFING — 2026-09-03T14:57:40+07:00

## Mission
Exhaustively extract and itemize all functional, data, content, and UI requirements for FAI 2026 Admissions page from ORIGINAL_REQUEST.md and authoritative Google Sheet.

## 🔒 My Identity
- Archetype: Specification Miner
- Roles: teamwork_preview_spec_miner
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1
- Original parent: 37b46742-aec6-4227-8cb7-522d447ffe6c
- Milestone: admissions_page_2026_survey

## 🔒 Key Constraints
- Read-only: Do NOT implement anything.
- Do NOT run git commit / git push.
- Do NOT deploy to Vercel.
- Strictly adhere to local dev mode.
- Report all discoveries in spec_report.md and handoff.md.
- Send results to parent via send_message.

## Current Parent
- Conversation ID: 37b46742-aec6-4227-8cb7-522d447ffe6c
- Updated: not yet

## Task Summary
- **What to build**: Mining & documenting complete specification of FAI 2026 Admissions update (R1.1 - R1.5, R2, constraints).
- **Success criteria**: Comprehensive, structured spec report covering R1.1, R1.2, R1.3, R1.4, R1.5, R2, edge cases, tables with exact banking data, program names, scholarship structures, forms.
- **Interface contracts**: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md & Google Sheet (gid=1279045597)
- **Code layout**: Read-only extraction into .agents/spec_miner_survey_1/

## Key Decisions Made
- Extracted exact CSV data from Google Sheet `https://docs.google.com/spreadsheets/d/1o-AA9iOXfsjGD-nKaFo-KDH4wqzT61hzoUK5WuuHSmU/export?format=csv&gid=1279045597` using curl.
- Reconciled typos in the raw sheet ("Tân bịnh" -> "Tân binh", "công chức" -> "công chứng", "Đào tạoc" -> "Đào tạo").
- Mapped 11 training programs across 4 brands with exact character strings.
- Formulated banking contracts for Hanoi (`00006969813`, TPBank, `FAIHN_hotensinhvien_HP HK 1`) and Danang (`03557714109`, TPBank, `FAIDN_hotensinhvien_HP HK 1`).
- Confirmed removal of FAQ block and documented Header anchor link interaction.
- Documented full findings in `spec_report.md` and `handoff.md`.

## Artifact Index
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/spec_report.md — Full specification report
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/handoff.md — Handoff report
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/progress.md — Liveness and task progress tracking
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/spec_miner_survey_1/DISPATCH.md — Task dispatch log
