## 2026-09-03T11:21:49Z

<USER_REQUEST>
You are challenger_m2_1 (Empirical Verification Challenger - Tuyen Sinh).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_1
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md (Read first!)
- Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
- Worker M2 Handoff: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m2_decomp/handoff.md

TASK:
Empirically and adversarially test the Tuyển Sinh page decomposition:
1. Run `wc -l src/app/tuyen-sinh/page.js` and verify it is strictly < 250 lines.
2. Test HTML rendered by `http://localhost:3000/tuyen-sinh`:
   - Check that all 11 courses appear in the rendered registration section or option elements.
   - Check that all 4 scholarship brands appear (Aptech, Arena, Skillking, Jetking).
   - Check that scholarship values render with units ("14 Triệu", "10 Triệu", "6 Triệu", "8 Triệu").
   - Check that both TPBank accounts (Hanoi 00006969813, Danang 03557714109) and transfer syntax appear.
   - Check that anchor `#faq` is present.
   - Check that hotline numbers from `src/data/contacts.js` appear.
3. Provide verdict: APPROVE or CHALLENGE_DETECTED.

STRICT CONSTRAINTS:
- Read-only challenger!
- Local dev only! Do not run git commit/push.
- Write handoff to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/challenger_m2_1/handoff.md` and report via send_message.
</USER_REQUEST>
