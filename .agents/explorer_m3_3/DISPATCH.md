# Dispatch Log

## 2026-09-03T11:33:29Z
Task received from parent:
Investigate migration safety, build stability, and hydration boundaries for Milestone 3:
1. Determine whether `CourseLayout.jsx` should be marked `'use client'` or split into Server/Client boundaries (tabs in curriculum need `useState`).
2. Verify that reducing each course page from ~500-750 lines down to ~40 lines will maintain 100% functional and visual equivalence.
3. Design the verification plan:
   - Command to test HTTP 200 across all 11 routes (`/dao-tao/aptech/accp`, `/dao-tao/arena/amsp`, etc.).
   - ESLint and build verification commands.
   - Code duplication metrics (~5,800 lines eliminated).
