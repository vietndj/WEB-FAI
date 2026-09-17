## 2026-09-03T10:45:32Z

Explore the entire codebase /Users/vietmac/Documents/CODE/WEB- FAI/fai/src/ to map out all hardcoded data and identify files that must be refactored to use src/data/:
1. Search for all instances of programs, courses, scholarships, tuition/bank info, hotlines, emails, addresses, and registration dropdown options across src/app/ and src/components/.
2. Audit existing files in src/data/ (if any exist) and identify what data structures should be created (programs.js, scholarships.js, tuition.js, contacts.js).
3. Identify all consumer files: /tuyen-sinh/page.js, /lien-he/page.js, /dao-tao/*, header/footer, registration modal/forms, etc.
4. Recommend exact exported shapes (data contracts/schemas) for programs.js, scholarships.js, tuition.js, and contacts.js so that components can easily import them.

Write your detailed analysis and findings to /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_codebase_survey/handoff.md.
When finished, send a message back to parent orchestrator with a summary and the path to your handoff report.
