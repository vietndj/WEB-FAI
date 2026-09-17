# Forensic Audit Report: Course Template Engine & 11 Course Pages (Milestone 3)

**Work Product**: Course Template Engine (`src/components/course/*`), Data Models (`src/data/courses.js`, `src/data/programs.js`), and 11 Course Pages in `src/app/dao-tao/`  
**Profile**: General Project (Development Mode per `ORIGINAL_REQUEST.md`)  
**Auditor**: `auditor_m3_course` (Forensic Integrity Auditor - Milestone 3)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/auditor_m3_course`  
**Verdict**: **CLEAN**

---

## 1. Observation

### 1.1 Source Code & Component Architecture
- **Component Directory**: `src/components/course/` contains 6 authentic, production-grade React components totaling **2,073 lines**:
  - `CourseLayout.jsx` (305 lines, `'use client'`): Master layout orchestrator integrating `IntersectionObserver` ScrollSpy (`.active-sec-${activeSection}`), brand presets (`aptech`, `arena`, `skillking`, `chip-design`, `ai-agent`, `jetking`), automatic switcher detection, form integration, and global footer.
  - `CourseHero.jsx` (226 lines): Renders particle background, watermark text, brand badge, multi-line titles, logo, description paragraphs, core highlight callout card, hero stats pills, and optimized Next.js banner image.
  - `CourseOverviewStats.jsx` (259 lines): Renders 4 light overview stat cards with dynamic Lucide icon resolution (`BookOpen`, `Clock`, `Trophy`, `Briefcase`, `Award`, `Layers`, `Cpu`, `Bot`, `Sparkles`) and the total duration breakdown banner.
  - `CourseCurriculumTabs.jsx` (1,062 lines): Multi-archetype curriculum renderer authentically supporting:
    - *Archetype 1 (Semesters)*: Sticky tab switcher, active semester card, detailed subjects list, and 3-column grid (`coreStack`, `aiTools`, `careers`).
    - *Archetype 2 (Subjects Grid)*: 10-subject dark cyber glass cards, official certificate card with Aptech CPISM badge, and target career cards.
    - *Archetype 3 (Course Modules)*: Sticky course tab switcher (100H/200H), module tables with STT, subject name, duration, role badge, and content description.
    - *Archetype 4 (Track Cards)*: 3 track duration cards (6, 12, 18 months) with skills lists.
    - *Archetype 5 (Short Courses)*: 3-4 workshop cards with badges, icons, descriptions, subjects/skills list, and output credentials.
  - `CourseHighlights.jsx` (185 lines): Renders why-choose-us feature cards in light theme with dynamic Lucide icon resolution (`ShieldCheck`, `BrainCircuit`, `Zap`, `Globe`, `Wrench`, `FolderGit2`, etc.).
  - `CourseCTABanner.jsx` (41 lines): Dark tech bottom banner with glowing circle and `TechCTAButton`.
- **Zero Dummy/Facade Stubs**: No hardcoded dummy test strings, no fake stubs (`TODO`, `NotImplemented`, `return <constant>`), and no pre-populated log files.

### 1.2 Centralized Data Modeling
- `src/data/courses.js` (1,130 lines): Single Source of Truth exporting all 11 course prop objects (`COURSE_ACCP`, `COURSE_APTECH_1NAM`, `COURSE_APTECH_6THANG`, `COURSE_APTECH_100_200H`, `COURSE_ARENA_AMSP`, `COURSE_ARENA_6_18THANG`, `COURSE_ARENA_100H`, `COURSE_SKILLKING_18THANG`, `COURSE_SKILLKING_100H`, `COURSE_CHIP_DESIGN`, `COURSE_AI_AGENT`).
- `src/data/programs.js` (409 lines): Re-exports all course objects via `export * from './courses';` and maintains `TRAINING_PROGRAMS_2026` representing all 11 official programs.

### 1.3 Course Pages Monolithic Reduction
All 11 course pages in `src/app/dao-tao/` were reduced from a monolithic aggregate of **5,878 lines** down to **11 lines each** (**121 lines total**, achieving a **97.9% code reduction**):
- `src/app/dao-tao/aptech/accp/page.js`: 11 lines
- `src/app/dao-tao/aptech/1-nam/page.js`: 11 lines
- `src/app/dao-tao/aptech/6-thang/page.js`: 11 lines
- `src/app/dao-tao/aptech/100-200h/page.js`: 11 lines
- `src/app/dao-tao/arena/amsp/page.js`: 11 lines
- `src/app/dao-tao/arena/6-18-thang/page.js`: 11 lines
- `src/app/dao-tao/arena/100h/page.js`: 11 lines
- `src/app/dao-tao/skillking/18-thang/page.js`: 11 lines
- `src/app/dao-tao/skillking/100h/page.js`: 11 lines
- `src/app/dao-tao/chip-design/page.js`: 11 lines
- `src/app/dao-tao/ai-agent/page.js`: 11 lines

All 11 pages are pure React Server Components (no `'use client'`), natively export Next.js SEO `metadata`, and delegate rendering to `<CourseLayout {...COURSE_* } />`.

### 1.4 Scope & Boundary Compliance
- `git diff --name-only src/app/globals.css public/fonts/ src/app/lien-he/page.js` returned empty output.
- `git log -n 3 --oneline` confirmed the latest commit is `1bda86c`. No git commit, git push, or Vercel deployment was made. Strictly local development preserved.

### 1.5 Automated Verification Tool Outputs
1. **ESLint**:
   Command: `npx eslint src/components/course/ src/data/courses.js src/app/dao-tao/`
   Output: Exit code 0, 0 errors, 0 warnings.
2. **Next.js Production Build**:
   Command: `npm run build`
   Output:
   ```
   ▲ Next.js 16.2.9 (Turbopack)
   ✓ Compiled successfully in 3.9s
   ✓ Generating static pages using 7 workers (34/34) in 330ms
   ```
   All 11 course routes compiled as static pre-rendered routes (`○  (Static)`).
3. **Live Route Verification (`http://localhost:3000`)**:
   Tested via curl loop across all 11 routes:
   - `/dao-tao/aptech/accp`: Status 200 | Size 87,592 bytes
   - `/dao-tao/aptech/1-nam`: Status 200 | Size 91,258 bytes
   - `/dao-tao/aptech/6-thang`: Status 200 | Size 92,945 bytes
   - `/dao-tao/aptech/100-200h`: Status 200 | Size 82,350 bytes
   - `/dao-tao/arena/amsp`: Status 200 | Size 80,918 bytes
   - `/dao-tao/arena/6-18-thang`: Status 200 | Size 76,306 bytes
   - `/dao-tao/arena/100h`: Status 200 | Size 82,120 bytes
   - `/dao-tao/skillking/18-thang`: Status 200 | Size 78,971 bytes
   - `/dao-tao/skillking/100h`: Status 200 | Size 76,148 bytes
   - `/dao-tao/chip-design`: Status 200 | Size 79,443 bytes
   - `/dao-tao/ai-agent`: Status 200 | Size 79,679 bytes
4. **Independent Adversarial Suite (`independent_audit.mjs`)**:
   Evaluated 154 integrity assertions covering file existence, Server Component boundaries, metadata exports, component complexity, token rendering, HTTP status, and hydration safety.
   Result: **154 passed, 0 failures**.

---

## 2. Logic Chain

1. **Authenticity vs Facade**:
   Inspection of `src/components/course/` confirms that each component implements its full UI logic and state machine. `CourseCurriculumTabs.jsx` specifically implements 5 separate curriculum engines dynamically chosen based on data structure (`semesters`, `subjects`, `courseModules`, `tracks`, `shortCourses`). This disproves any possibility of facade implementations or hardcoded cheating.
2. **SSoT Decoupling**:
   `src/data/courses.js` defines all 11 course offerings in complete detail. The 11 course pages in `src/app/dao-tao/` contain no inline content, only an import from `courses.js` and invocation of `CourseLayout`. The rendered HTML on `localhost:3000` proves that content from `courses.js` is rendered accurately in the SSR stream.
3. **Architectural Purity (Server vs Client)**:
   By confining client-side interactivity (ScrollSpy `IntersectionObserver`, tab switching `useState`) inside `CourseLayout.jsx`, the 11 page files became pure Server Components. This enables Next.js App Router native `metadata` export for SEO optimization while eliminating 5,757 lines of boilerplate.
4. **Constraint Adherence**:
   Git status and diff checks confirm that the boundary rules were observed: no commits were made, no production deployments occurred, and files undergoing concurrent edits (`globals.css`, `public/fonts/`, `lien-he/page.js`) were untouched.

---

## 3. Caveats

- No caveats. The implementation directly meets all requirements and acceptance criteria for Milestone 3 without workarounds or compromises.

---

## 4. Conclusion

- **Milestone 3 is verified 100% CLEAN**.
- The Course Template Engine and all 11 Course Pages are authentically implemented, fully functional, build cleanly under Turbopack, and pass all ESLint and empirical HTTP checks.
- Codebase bloat in `src/app/dao-tao/` was successfully eliminated (97.9% reduction).

---

## 5. Verification Method

To reproduce and verify these findings independently:

1. **Lint Verification**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npx eslint src/components/course/ src/data/courses.js src/app/dao-tao/
   ```
   *Expected result*: Exit code 0, 0 errors, 0 warnings.

2. **Next.js Production Build**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npm run build
   ```
   *Expected result*: Turbopack compiles successfully; 34/34 routes generated.

3. **HTTP 200 & Route Integrity Test**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   for route in /dao-tao/aptech/accp /dao-tao/aptech/1-nam /dao-tao/aptech/6-thang /dao-tao/aptech/100-200h /dao-tao/arena/amsp /dao-tao/arena/6-18-thang /dao-tao/arena/100h /dao-tao/skillking/18-thang /dao-tao/skillking/100h /dao-tao/chip-design /dao-tao/ai-agent; do
     STATUS=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000${route}")
     echo "${route}: HTTP ${STATUS}"
   done
   ```
   *Expected result*: All 11 routes output `HTTP 200`.

4. **Independent Adversarial Suite**:
   ```bash
   node "/Users/vietmac/Documents/CODE/WEB- FAI/.agents/auditor_m3_course/independent_audit.mjs"
   ```
   *Expected result*: `AUDIT SUMMARY: 154 checks evaluated, 0 failures. VERDICT: CLEAN`.
