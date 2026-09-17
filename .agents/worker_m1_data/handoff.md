# HANDOFF REPORT — MILESTONE 1: CONTENT DECOUPLING & SINGLE SOURCE OF TRUTH

**Agent**: `worker_m1_data`  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/worker_m1_data`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Status**: COMPLETED (Hard Handoff)

---

## 1. Observation

### 1.1. Codebase State Before Changes
- Prior to Milestone 1, `src/data/` contained only `news.js` (139 lines). Key training programs, scholarship lists, tuition bank accounts, and contact networks were scattered and hardcoded across multiple monolithic files:
  - `src/components/Header.jsx`: Hardcoded 11 training program links in desktop megamenu (lines 68–98) and inconsistent names in mobile drawer (lines 198–217).
  - `src/components/Footer.jsx`: Hardcoded campus addresses across 4 cities (lines 95–153), hotlines, emails, and external brand links (lines 179–209).
  - `src/components/ScholarshipFormSection.jsx`: 145 lines of hardcoded `BRAND_PRESETS` (lines 6–150) and Google Apps Script URL.
  - `src/components/Arena100hFormSection.jsx`: Hardcoded course options (lines 320–327), campuses, and script URL.
  - `src/components/Skillking100hFormSection.jsx`: Hardcoded course options (lines 316–320), campuses, and script URL.
  - `src/components/*ProgramSwitcher.jsx`: 4 individual switcher components each hardcoding their own program list arrays.

### 1.2. Implementation Actions Performed
1. **Created 4 Centralized SSoT Data Modules**:
   - `src/data/programs.js`:
     * `TRAINING_PROGRAMS_2026`: 11 official programs categorized into 4 brands (`aptech`, `arena`, `skillking`, `jetking`).
     * `programsByBrand`: Rich brand metadata (id, name, tagline, logo, color, route) and detailed program models (id, name, fullName, duration, slug, route, degree, description, targetAudience, semesters).
     * Sub-course options: `aptechShortCourseOptions`, `arenaSpecializationOptions`, `arenaShortCourseOptions`, `skillkingShortCourseOptions`.
     * Switcher items: `aptechSwitcherItems`, `arenaSwitcherItems`, `skillkingSwitcherItems`, `jetkingSwitcherItems`.
     * Flat array: `ALL_PROGRAMS`.
   - `src/data/scholarships.js`:
     * `SCHOLARSHIP_BRANDS`: 4 brands with 2026 funds (Aptech 14M/10M/6M/2M, Arena 14M/10M/6M/1.5-2M, Skillking 14M/10M/6M/1.5-2M, Jetking 8M Chip Design & 8M AI Agent).
     * `BRAND_FORM_PRESETS` (and alias `BRAND_PRESETS`): Configured for `aptech`, `arena`, `skillking`, `chip-design`, `ai-agent` with titles, subtitles, and badges.
   - `src/data/tuition.js`:
     * `TUITION_ACCOUNTS`: Official TPBank accounts for Hanoi (`00006969813` - Trường Đại học FPT) and Da Nang (`03557714109` - Phân hiệu trường Đại học FPT tại TP Đà Nẵng).
     * `TUITION_TRANSFER_NOTES`: Guidelines on syntax, non-accented student name, semester format, and transaction receipt saving.
   - `src/data/contacts.js`:
     * `HOTLINES`: Hanoi `024 7300 8855` and Da Nang `0236 730 8826`.
     * `EMAILS`: `fai@fpt.edu.vn`.
     * `WORKING_HOURS`: `8:00 - 21:00 hàng ngày`.
     * `ADMISSION_CAMPUSES`: `['Hà Nội', 'Đà Nẵng']`.
     * `EXTERNAL_LINKS`: Privacy policy (`https://fpt.edu.vn/thu-vien-anh/11140`), Google Apps Script webhook, brand websites, and official Zalo links.
     * `aptechCampuses`, `arenaCampuses`, `skillkingCampuses`, `jetkingCampuses`, and `campusesByCity`.

2. **Refactored Consumer Components**:
   - `src/components/Header.jsx`: Replaced hardcoded desktop megamenu and mobile drawer with `programsByBrand` mapping. Removed broken `#faq` anchor.
   - `src/components/Footer.jsx`: Replaced hardcoded campuses with `campusesByCity` mapping, contact info with `HOTLINES`/`EMAILS`/`EXTERNAL_LINKS`, and brand websites with `EXTERNAL_LINKS.websites`.
   - `src/components/ScholarshipFormSection.jsx`: Replaced local 145-line `BRAND_PRESETS` with import from `@/data/scholarships`, replaced default script URL and privacy link with `EXTERNAL_LINKS`.
   - `src/components/Arena100hFormSection.jsx`: Imported `arenaShortCourseOptions`, `ADMISSION_CAMPUSES`, and `EXTERNAL_LINKS`. Escaped double quotes in JSX.
   - `src/components/Skillking100hFormSection.jsx`: Imported `skillkingShortCourseOptions`, `ADMISSION_CAMPUSES`, and `EXTERNAL_LINKS`.
   - `src/components/AptechProgramSwitcher.jsx`: Imported `aptechSwitcherItems`.
   - `src/components/ArenaProgramSwitcher.jsx`: Imported `arenaSwitcherItems`.
   - `src/components/SkillkingProgramSwitcher.jsx`: Imported `skillkingSwitcherItems`.
   - `src/components/JetkingProgramSwitcher.jsx`: Imported `jetkingSwitcherItems`.

---

## 2. Logic Chain

1. **Decoupling Data from Presentation**:
   - Hardcoding training program names, contact hotlines, and scholarship funds inside individual JSX components caused maintenance friction and data drift across the site.
   - Moving this data into structured ES modules under `src/data/` establishes a single authoritative source of truth (SSoT). Any downstream change to a phone number, course title, or tuition account requires editing only one line in `src/data/`.
2. **Preserving Backward Compatibility**:
   - By exporting both legacy identifiers/aliases (`BRAND_PRESETS`, `tuitionAccounts`, `CAMPUSES_BY_CITY`) and rich structured objects (`programsByBrand`, `SCHOLARSHIP_BRANDS`, `TUITION_ACCOUNTS`), we ensure that subsequent worker agents (M2: tuyen-sinh & ve-fai decomposition, M3: CourseLayout & dao-tao refactor) can consume data without breaking any existing component interface contracts.
3. **Strict Boundary Adherence**:
   - Only files assigned within `worker_m1_data` exclusive write ownership were modified or created. No git commit, git push, or Vercel deployment was executed.

---

## 3. Caveats

- **No Caveats**: All 4 data modules and 9 consumer components compile cleanly under Next.js Turbopack without errors, and all 34 routes build and render with HTTP 200 OK.

---

## 4. Conclusion

Milestone 1 is **100% complete and fully verified**:
- 4 central data modules established under `fai/src/data/`: `programs.js`, `scholarships.js`, `tuition.js`, `contacts.js`.
- All 9 shared consumer components refactored to consume from SSoT.
- Next.js production build (`npm run build`) completed successfully with 0 errors.
- ESLint passed with 0 errors.
- HTTP 200 OK confirmed across all major routes on `http://localhost:3000`.

---

## 5. Verification Method

To independently verify this milestone:

1. **Verify Source Files Exist**:
   ```bash
   ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/data"
   # Should list contacts.js, news.js, programs.js, scholarships.js, tuition.js
   ```

2. **Verify ESLint (0 errors)**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npx eslint src/data src/components/Header.jsx src/components/Footer.jsx src/components/ScholarshipFormSection.jsx src/components/Arena100hFormSection.jsx src/components/Skillking100hFormSection.jsx src/components/AptechProgramSwitcher.jsx src/components/ArenaProgramSwitcher.jsx src/components/SkillkingProgramSwitcher.jsx src/components/JetkingProgramSwitcher.jsx
   ```

3. **Verify Production Build**:
   ```bash
   npm run build
   # Expected output: Compiled successfully in ~4s, Generating static pages (34/34)
   ```

4. **Verify Runtime Status (HTTP 200)**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tuyen-sinh
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/dao-tao/aptech/accp
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/dao-tao/arena/100h
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/dao-tao/skillking/100h
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/lien-he
   ```

5. **Verify Data Propagation**:
   - Open `http://localhost:3000/` and inspect header megamenu and footer to confirm dynamic rendering of programs, hotlines (`024 7300 8855`, `0236 730 8826`), and email (`fai@fpt.edu.vn`).
