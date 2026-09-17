# BRIEFING — 2026-09-03T10:44:25Z

## Mission
Architectural refactoring of FAI Web: Content decoupling (Single Source of Truth in `src/data/`), component decomposition (breaking down monolithic pages into atomic components < 250 lines), design system CSS standardization, and E2E verification on local environment.

## 🔒 My Identity
- Archetype: Project Orchestrator
- Roles: orchestrator, user_liaison, human_reporter, successor
- Working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3
- Original parent: parent
- Original parent conversation ID: dbaa0f0c-f56d-4f46-850d-edb58f8d150d

## 🔒 My Workflow
- **Pattern**: Project Pattern (Survey -> Dual Track: Implementation & E2E Testing -> Decompose & Delegate / Iterate)
- **Scope document**: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/PROJECT.md
1. **Survey**: Dispatch 3 parallel Explorers (spec mining, code survey, architecture survey) to map the full scope and existing codebase.
2. **Decompose & Delegate**:
   - Milestone 1: Centralized Data Modules (src/data/programs.js, scholarships.js, tuition.js, contacts.js) & Single Source of Truth refactor across core pages & forms.
   - Milestone 2: Component Decomposition for /tuyen-sinh & /ve-fai into atomic components (< 250 lines) in src/components/.
   - Milestone 3: Reusable Course Layout component for /dao-tao/* and page refactoring.
   - Milestone 4: Design System CSS standardization (.fai-card-glass, .fai-badge, .fai-section-heading, etc.) and responsive/hydration hardening.
   - Milestone 5: E2E Verification & Integration (Tiers 1-4 validation on http://localhost:3000, testing dynamic data updates).
3. **On failure**:
   - Retry: nudge stuck agent or re-send task
   - Replace: spawn fresh agent with partial progress
   - Skip: proceed without (only if non-critical)
   - Redistribute: split stuck agent's remaining work
   - Redesign: re-partition decomposition
4. **Succession**: At 16 spawns, write handoff.md, spawn successor.
- **Work items**:
  1. Survey & Exploration [in-progress]
  2. Milestone 1: Data Modules & SSoT [pending]
  3. Milestone 2: Page Component Decomposition [pending]
  4. Milestone 3: Reusable Course Layout [pending]
  5. Milestone 4: Design System & CSS Standardization [pending]
  6. Milestone 5: E2E Verification & Hardening [pending]
- **Current phase**: 0 (Survey)
- **Current focus**: Surveying existing codebase and architecture

## 🔒 Key Constraints
- Local development only! DO NOT run git commit, git push, or deploy to Vercel production.
- Test directly on http://localhost:3000.
- Dispatch-only: NEVER write, modify, or create source code files directly. Delegate ALL work to subagents.
- Never run build/test commands directly — require workers to do so.
- Never reuse a subagent after it has delivered its handoff — always spawn fresh.
- Binary veto on forensic audit failure.

## Current Parent
- Conversation ID: dbaa0f0c-f56d-4f46-850d-edb58f8d150d
- Updated: 2026-09-03T10:44:25Z

## Key Decisions Made
- Initiated project orchestration for FAI Web architecture refactoring.
- Following Project Pattern: Starting with 3 Survey Explorers before finalizing PROJECT.md and executing milestones.

## Team Roster
| Agent | Type | Work Item | Status | Conv ID |
|-------|------|-----------|--------|---------|
| explorer_spec_miner | teamwork_preview_spec_miner | Specification mining for 11 programs, scholarships, tuition, contacts | completed | 9edb9c58-22b0-4847-8a1c-4bc777c3266d |
| explorer_codebase_survey | teamwork_preview_explorer | Codebase data & SSoT audit | completed | 9210190d-ce0a-44e5-8f05-6051c52217a6 |
| explorer_component_survey | teamwork_preview_explorer | Component decomposition & CSS design system survey | completed | 27e560cb-ceab-495f-9ea7-c715756d882e |
| worker_m1_data | teamwork_preview_worker | M1: Implement src/data/ and refactor shared components | in-progress | 0318ba89-3322-4e40-ac62-6f93886998ba |

## Succession Status
- Succession required: no
- Spawn count: 4 / 16
- Pending subagents: 0318ba89-3322-4e40-ac62-6f93886998ba
- Predecessor: none
- Successor: not yet spawned

## Active Timers
- Heartbeat cron: 52138626-f9e8-4cb0-866c-d2dc96634c42/task-19
- Safety timer: none

## Artifact Index
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md — User request record
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/DISPATCH.md — Dispatch log
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/BRIEFING.md — Working memory
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/plan.md — Project execution plan
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/progress.md — Liveness and progress tracker
- /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_3/PROJECT.md — Global architecture and feature index
