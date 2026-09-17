## 2026-09-03T11:33:29Z
You are explorer_m3_1 (CourseLayout Architecture Researcher).
Your working directory: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_1
Project codebase: /Users/vietmac/Documents/CODE/WEB- FAI/fai

MANDATORY READING:
- Original User Request: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/ORIGINAL_REQUEST.md
- Project Plan: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/orchestrator_4/PROJECT.md
- Prior Component Survey: /Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_component_survey/handoff.md

TASK:
Analyze the 11 course pages in `src/app/dao-tao/`:
- `aptech/accp`, `aptech/1-nam`, `aptech/6-thang`, `aptech/100-200h`
- `arena/amsp`, `arena/6-18-thang`, `arena/100h`
- `skillking/18-thang`, `skillking/100h`
- `chip-design`, `ai-agent`

Examine the shared layout structure:
1. Hero section: `.beau-hero`, `ParticleCanvas`, `.beau-hero-bg-text`, `.beau-hero-brand` pill, `.beau-hero-title`, description, stats bar, banner image.
2. Sub-program switchers: `AptechProgramSwitcher`, `ArenaProgramSwitcher`, `SkillkingProgramSwitcher`, `JetkingProgramSwitcher`.
3. Highlights section: 3-4 feature cards.
4. Curriculum section: tabs for semesters, core stack pills, AI tools, career opportunities.
5. Embedded Form section: `ScholarshipFormSection`, `Arena100hFormSection`, `Skillking100hFormSection`.
6. CTA Banner: `.beau-cta-section`.

Design the exact architecture, props, and code implementation of `src/components/course/CourseLayout.jsx`.

STRICT CONSTRAINTS:
- Read-only exploration!
- Local dev only!
- Write handoff to `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m3_1/handoff.md` and report via send_message.
