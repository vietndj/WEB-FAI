# Handoff Report: Component Structure, Page Sizes, and CSS Styling Survey

**Date**: 2026-09-03  
**Agent**: explorer_component_survey  
**Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Milestone**: Architecture Survey & Decomposition Plan  

---

## 1. Observation

### 1.1 Local Dev Environment Status
- **Process**: `next-server (v16.2.9)` running on PID 54207 under user `vietmac`.
- **Port**: Port 3000 (`hbci`) is active and listening.
- **HTTP Connectivity**:
  - `curl -I http://localhost:3000/` returned `HTTP/1.1 200 OK`.
  - `curl -I http://localhost:3000/tuyen-sinh` returned `HTTP/1.1 200 OK`.
- **Framework & Libraries**: Next.js 16.2.9, React 19.2.4, Lucide-React 1.21.0, TipTap 3.31.1, Sharp 0.35.4.
- **Rules Compliance**: Local-only development; zero git commits/pushes, zero Vercel production deployments.

### 1.2 Page Size & Monolith Survey (Line Counts in `src/app/`)
| Rank | File Path | Line Count | Current Status / Nature |
|---|---|---|---|
| 1 | `src/app/tuyen-sinh/page.js` | **1,994** | God File: Contains data, validation, clipboard logic, 7 massive JSX sections, 259 inline styles |
| 2 | `src/app/ve-fai/page.js` | **1,010** | Monolithic: 7 sections, animation hooks, cyber timeline, 123 inline styles |
| 3 | `src/app/dao-tao/aptech/100-200h/page.js` | **737** | Duplicate course template |
| 4 | `src/app/doi-song/page.js` | **717** | Monolithic: Contains inline sub-components (`EditorialFeaturedArticle`), modals, filters |
| 5 | `src/app/dao-tao/aptech/1-nam/page.js` | **657** | Duplicate course template |
| 6 | `src/app/dao-tao/arena/amsp/page.js` | **628** | Duplicate course template |
| 7 | `src/app/lien-he/page.js` | **596** | Monolithic: Campus grids, contact form, maps |
| 8 | `src/app/dao-tao/chip-design/page.js` | **596** | Duplicate course template |
| 9 | `src/app/dao-tao/ai-agent/page.js` | **574** | Duplicate course template |
| 10 | `src/app/dao-tao/aptech/6-thang/page.js` | **541** | Duplicate course template |
| 11 | `src/app/dao-tao/aptech/accp/page.js` | **519** | Duplicate course template |
| 12 | `src/app/dao-tao/skillking/18-thang/page.js` | **499** | Duplicate course template |
| 13 | `src/app/dao-tao/arena/100h/page.js` | **466** | Duplicate course template |
| 14 | `src/app/dao-tao/page.js` | **365** | Overview catalog |
| 15 | `src/app/dao-tao/arena/6-18-thang/page.js` | **339** | Duplicate course template |
| 16 | `src/app/dao-tao/skillking/100h/page.js` | **311** | Duplicate course template |

### 1.3 Audit of `src/app/tuyen-sinh/page.js`
- **Total Lines**: 1,994 lines.
- **Data Embedded in File**:
  - Lines 28-62: `TRAINING_PROGRAMS_2026` (11 programs across Aptech, Arena, Skillking, Jetking).
  - Lines 63-204: `SCHOLARSHIP_BRANDS` (Aptech, Arena, Skillking, Jetking scholarship tiers, badges, themes).
  - Lines 205-231: `TUITION_ACCOUNTS` (Hà Nội STK `00006969813`, Đà Nẵng STK `03557714109`, syntax, bank details).
- **State & Logic Inside Component**:
  - `activeBrand`: string ('aptech'), lines 234. Used exclusively by the Scholarship block.
  - `copiedField`, `handleCopy`, `fallbackCopy`: lines 237-279. Used exclusively by the Tuition bank card block.
  - `formData`, `formErrors`, `isSubmitting`, `isSubmitted`, `handleInputChange`, `validateForm`, `handleFormSubmit`, `handleResetForm`: lines 240-394. Used exclusively by the Online Registration form block.
- **Section Breakdown in JSX**:
  - Lines 405-583: `BLOCK 1: HERO HEADER SECTION` (178 lines). Eyebrow, title, subtitle, anchor navigation pills, 4 summary stat cards.
  - Lines 585-725: `BLOCK 2: ĐỐI TƯỢNG TUYỂN SINH` (140 lines). 3 audience cards (Học sinh THPT, Sinh viên CĐ/ĐH, Người đi làm chuyển ngành).
  - Lines 727-935: `BLOCK 3: PHƯƠNG THỨC XÉT TUYỂN THẲNG` (208 lines). 2 direct admission methods (Online & Trực tiếp tại cơ sở, KHÔNG CẦN thi tuyển).
  - Lines 937-1102: `BLOCK 4: QUY TRÌNH 4 BƯỚC & HỒ SƠ RÚT GỌN` (165 lines). 4-step admission journey, 3-item concise document checklist.
  - Lines 1104-1324: `BLOCK 5: HỌC BỔNG VÀ ƯU ĐÃI NHẬP HỌC 2026` (220 lines). Brand tabs, fund cards, scholarship grid, eligibility notes.
  - Lines 1326-1547: `BLOCK 6: CHÍNH SÁCH HỌC PHÍ 2026` (221 lines). 2 banking cards (Hà Nội & Đà Nẵng), copy buttons, transfer syntax, warnings.
  - Lines 1549-1988: `BLOCK 7: ĐĂNG KÝ TUYỂN SINH TRỰC TUYẾN & LIÊN HỆ` (439 lines). Contact hotline box, campus addresses, interactive registration form with 11 programs dropdown, validation, terms checkbox.
- **Inline Styling**: Exactly 259 instances of `style={{...}}`.

### 1.4 Audit of `src/app/dao-tao/` (All 11 Course Pages)
- Across `aptech/` (4 courses), `arena/` (3 courses), `skillking/` (2 courses), and Jetking (`chip-design`, `ai-agent` - 2 courses), all 11 pages share an identical 5-to-6 section skeleton:
  1. `Hero`: `.beau-hero` with `ParticleCanvas`, `.beau-hero-bg-text`, `.beau-hero-brand` pill, `.beau-hero-title`, description, stats bar, banner image.
  2. `Highlights`: `.beau-section` with 3-4 feature cards.
  3. `Curriculum`: `.beau-section` with semester/module tabs, core stack badges, AI tool pills, career opportunities.
  4. `Admission / Scholarship Form`: Embedded `ScholarshipFormSection` or custom variation.
  5. `CTA Banner`: `.beau-cta-section` with `.beau-cta-bg-circle`, headline, and CTA button.
  6. Sub-program Switchers: `AptechProgramSwitcher`, `ArenaProgramSwitcher`, `SkillkingProgramSwitcher`, `JetkingProgramSwitcher`.
- The CSS for all these pages is already standardized in `globals.css` (lines 4327-5200) under the `.beau-*` prefix, but the JSX layout is copy-pasted across 11 files totaling over 5,800 lines.

### 1.5 Audit of `src/app/globals.css` and Design Tokens
- **Total Lines**: 6,460 lines.
- **Brand Tokens Preserved**:
  - `--primary: #E8741E` (FPT Amber)
  - `--primary-hover: #c85f0e`
  - `--secondary: #0D2137` (Deep Navy)
  - `--secondary-mid: #162B4A`
  - `--accent: #C9972C` (Gold)
  - `--bg-cream: #F8FAFC`
  - `--font-sans: 'SVN-Sonoma', 'SVN-Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
  - `--font-heading-medium: 'SVN-Sonoma Medium', 'SVN-Sonoma', 'SVN-Poppins', ...`
- **Inline Style Redundancy**: More than 1,200 inline styles across `src/app/` and `src/components/`, primarily repeating:
  - Glass cards (`rgba(255,255,255,0.03)` with blur, `rgba(255,255,255,0.7)` with blur).
  - Badges / Pill tags (`padding: 6px 14px; border-radius: 20px; font-weight: 700;`).
  - Section headings (`clamp()`, font-family `var(--font-heading-medium)`, weight 500, line-height 1.2).
  - Form inputs (`padding: 12px 16px; border: 1px solid #cbd5e1; border-radius: 10px;`).
  - Buttons (`padding: 14px 28px; border-radius: 12px; font-weight: 700;`).

---

## 2. Logic Chain & Proposals

### 2.1 Proposal 1: Exact Decomposition Plan for `src/app/tuyen-sinh/page.js`
To reduce `page.js` from 1,994 lines to under 250 lines (specifically ~45 lines), the file is split into 6 atomic components under `src/components/tuyen-sinh/`:

```
src/components/tuyen-sinh/
├── HeroSection.jsx               # ~170 lines (Pure UI)
├── TargetAudienceSection.jsx     # ~140 lines (Pure UI)
├── AdmissionMethodSection.jsx    # ~350 lines (Combines Admission Methods + 4-Step Process & Dossier)
├── ScholarshipTabSection.jsx     # ~220 lines (Holds activeBrand state, imports from scholarships.js)
├── TuitionBankSection.jsx        # ~200 lines (Holds clipboard copy state, imports from tuition.js)
└── OnlineRegistrationSection.jsx # ~400 lines (Holds form state & validation, imports from programs.js & contacts.js)
```

#### Component Specifications:
1. **`HeroSection.jsx`**:
   - **Props**: None (or optional `brand` override).
   - **Content**: Block 1 from original file. Displays eyebrow with `Sparkles`, main H1 heading, description paragraph, quick jump anchor links (`#thong-tin`, `#phuong-thuc`, `#ho-so`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`), and 4 key metric pill cards.
   - **State**: None.

2. **`TargetAudienceSection.jsx`**:
   - **Props**: None.
   - **Content**: Block 2 from original file. Features 3 target group cards: (1) THPT Graduates, (2) College/University Students, (3) Career Switchers (highlighted with orange accent and badge).
   - **State**: None.

3. **`AdmissionMethodSection.jsx`**:
   - **Props**: None.
   - **Content**: Combines Block 3 (Phương thức xét tuyển thẳng: Online & Trực tiếp) and Block 4 (Quy trình 4 bước & Hồ sơ rút gọn 3 mục).
   - **Rationale for Combining**: Both blocks detail the legal admission mechanism and requirements. Merging them into this component maintains semantic cohesion while keeping the component under 360 lines.
   - **State**: None.

4. **`ScholarshipTabSection.jsx`**:
   - **Props**: None (or initialBrand = 'aptech').
   - **Dependencies**: Imports `SCHOLARSHIP_BRANDS` from `@/data/scholarships`.
   - **State**: `const [activeBrand, setActiveBrand] = useState('aptech')`.
   - **Content**: Block 5 from original file. Brand switcher pills, active brand fund card, scholarship breakdown cards (Tài năng, Khuyến khích, Chuyển ngành, Tân binh sáng tạo, Chip Design, AI Agent).

5. **`TuitionBankSection.jsx`**:
   - **Props**: None.
   - **Dependencies**: Imports `TUITION_ACCOUNTS` from `@/data/tuition`.
   - **State**: `const [copiedField, setCopiedField] = useState(null)`.
   - **Content**: Block 6 from original file. Two high-profile banking cards (Hà Nội TPBank & Đà Nẵng TPBank), 1-click clipboard copy handlers with checkmark feedback state, official transfer syntax, and verification guidelines.

6. **`OnlineRegistrationSection.jsx`**:
   - **Props**: None (or initialProgram).
   - **Dependencies**: Imports `TRAINING_PROGRAMS_2026` from `@/data/programs` and `CONTACTS_DATA` from `@/data/contacts`.
   - **State**: `formData`, `formErrors`, `isSubmitting`, `isSubmitted`, `validateForm`, `handleFormSubmit`, `handleResetForm`.
   - **Content**: Block 7 from original file. Left column: Admissions hotline and advisory channels. Right column: Registration form with 11 programs grouped by brand, campus selection, FPT data privacy terms checkbox (`https://fpt.edu.vn/thu-vien-anh/11140`), error feedback, and success confirmation screen.

#### Refactored `src/app/tuyen-sinh/page.js` Blueprint (< 50 lines):
```jsx
'use client';

import Footer from '@/components/Footer';
import HeroSection from '@/components/tuyen-sinh/HeroSection';
import TargetAudienceSection from '@/components/tuyen-sinh/TargetAudienceSection';
import AdmissionMethodSection from '@/components/tuyen-sinh/AdmissionMethodSection';
import ScholarshipTabSection from '@/components/tuyen-sinh/ScholarshipTabSection';
import TuitionBankSection from '@/components/tuyen-sinh/TuitionBankSection';
import OnlineRegistrationSection from '@/components/tuyen-sinh/OnlineRegistrationSection';

export default function TuyenSinh() {
  return (
    <div className="admissions-page-container" style={{ backgroundColor: '#ffffff', color: '#1a2332', fontFamily: 'var(--font-sans)' }}>
      <main className="sub-page-main" style={{ padding: 0 }}>
        <HeroSection />
        <TargetAudienceSection />
        <AdmissionMethodSection />
        <ScholarshipTabSection />
        <TuitionBankSection />
        <OnlineRegistrationSection />
      </main>
      <Footer />
    </div>
  );
}
```

---

### 2.2 Proposal 2: Decomposition of `src/app/ve-fai/page.js` and Other Monolithic Pages

#### A. `src/app/ve-fai/page.js` (1,010 lines -> ~45 lines)
Decompose into `src/components/ve-fai/`:
1. `AboutHeroSection.jsx` (~60 lines): Page title with `ScrollTypewriter`, `ParticleCanvas` background, intro subtitle.
2. `AboutPhilosophyStatsSection.jsx` (~80 lines): Dark navy philosophy section, `useCountUp` animated stats counters.
3. `AboutValuesSection.jsx` (~190 lines): Strategic mission, vision, and the 6 FPT core cultural values (Tôn - Đổi - Đồng, Chí - Gương - Sáng).
4. `AboutTimelineSection.jsx` (~260 lines): High-tech cyber timeline with 5 historical milestones (1999 Aptech, 2004 Arena, 2018 Skillking, 2025 Semiconductor & AI Agent).
5. `AboutProgramsSection.jsx` (~95 lines): 5 training brand cards with logos, titles, and routing links.
6. `AboutCTASection.jsx` (~60 lines): Orange-gold gradient CTA banner.
7. `AboutContactBannerSection.jsx` (~40 lines): Bottom horizontal link row to `/lien-he`.

#### B. `src/app/doi-song/page.js` (717 lines -> ~110 lines)
Decompose into `src/components/doi-song/`:
1. `EditorialFeaturedArticle.jsx` (already an inline component of 154 lines; extract into standalone file).
2. `CategoryFilterBar.jsx`: Category pill switcher and article search input.
3. `PostGrid.jsx`: Responsive grid of post cards with category badges and reading time.
4. `ArticleModal.jsx`: Full-screen reading modal with rich HTML renderer.

#### C. `src/app/lien-he/page.js` (596 lines -> ~90 lines)
Decompose into `src/components/lien-he/`:
1. `CampusCardsSection.jsx`: Hà Nội and Đà Nẵng campus information cards.
2. `ContactFormSection.jsx`: Direct message/inquiry submission form.
3. `CampusMapSection.jsx`: Responsive map embeds and transit directions.

---

### 2.3 Proposal 3: Reusable `CourseLayout.jsx` for All 11 Course Pages

Currently, all 11 course pages copy-paste ~500-750 lines of identical `.beau-*` layout code.
We propose creating a unified component: `src/components/course/CourseLayout.jsx` (or `src/components/CourseLayout.jsx`).

#### Interface Definition for `CourseLayout.jsx`:
```jsx
export default function CourseLayout({
  // Metadata & Branding
  brandKey,          // 'aptech' | 'arena' | 'skillking' | 'jetking'
  themeColor,        // '#f37021' | '#ffb600' | '#09529c' | '#dc2626'
  bgWatermark,       // 'FPT APTECH' | 'FPT ARENA' | '18 THÁNG' | 'SEMICONDUCTOR'
  brandBadge,        // Text for the pill badge in hero
  title,             // H1 title (string or JSX)
  description,       // Paragraph description
  stats,             // Array of { value, label } for the stats bar
  bannerImage,       // URL to banner graphic
  
  // Custom Navigation
  ProgramSwitcher,   // Sub-switcher component (e.g. AptechProgramSwitcher)
  
  // Dynamic Content Slots
  highlights,        // Array of { icon, title, desc }
  semesters,         // Array of semester details (coreStack, aiTools, careers, etc.)
  customContent,     // Optional arbitrary JSX slot between curriculum & form
  
  // Admissions & Scholarship Form
  formProps,         // Props passed directly to ScholarshipFormSection
  
  // Bottom Call To Action
  ctaTitle,          // Headline for bottom banner
  ctaDesc,           // Subtitle for bottom banner
  ctaButtonText,     // Custom button label
  ctaButtonHref      // Custom target link
}) {
  // Renders the standard .beau-hero, .beau-section, curriculum tabs, 
  // embedded ScholarshipFormSection, and .beau-cta-section
}
```

#### Impact on Course Pages:
A course page like `src/app/dao-tao/aptech/accp/page.js` drops from **519 lines to ~40 lines**:
```jsx
'use client';

import CourseLayout from '@/components/course/CourseLayout';
import AptechProgramSwitcher from '@/components/AptechProgramSwitcher';
import { COURSE_ACCP } from '@/data/programs';

export default function Fullstack2NamPage() {
  return (
    <CourseLayout
      {...COURSE_ACCP}
      ProgramSwitcher={<AptechProgramSwitcher currentPath="/dao-tao/aptech/accp" />}
    />
  );
}
```
**Total reduction across 11 course pages**: ~5,800 lines eliminated, zero code duplication.

---

### 2.4 Proposal 4: CSS Design System Utilities & Token Preservation

To eliminate over 1,200 repetitive inline styles without touching the existing 6,460 lines of `globals.css`, create `src/styles/fai-design-system.css` and import it into `src/app/globals.css` (or append it cleanly at the bottom):

```css
/* ==========================================================================
   FAI DESIGN SYSTEM UTILITIES (.fai-*)
   Strictly preserving brand tokens:
   --primary (#E8741E), --secondary (#0D2137), --accent (#C9972C)
   --font-sans ('SVN-Sonoma'), --font-heading-medium ('SVN-Sonoma Medium')
   ========================================================================== */

/* 1. Surfaces & Glassmorphism Cards */
.fai-card-glass {
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: var(--radius-md, 16px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

.fai-card-glass-dark {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md, 16px);
  color: #ffffff;
}

.fai-card-elevated {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: var(--radius-lg, 24px);
  box-shadow: 0 12px 36px rgba(13, 33, 55, 0.05);
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.fai-card-elevated:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 45px rgba(13, 33, 55, 0.09);
  border-color: #cbd5e1;
}

/* 2. Standardized Badges & Tag Pills */
.fai-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.fai-badge-primary {
  background: rgba(232, 116, 30, 0.1);
  color: var(--primary);
  border: 1px solid rgba(232, 116, 30, 0.25);
}
.fai-badge-secondary {
  background: rgba(13, 33, 55, 0.08);
  color: var(--secondary);
}
.fai-badge-accent {
  background: rgba(201, 151, 44, 0.12);
  color: var(--accent);
}
.fai-badge-success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #bbf7d0;
}

/* 3. Standardized Section Typography */
.fai-section-eyebrow {
  color: var(--primary);
  font-weight: 800;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  display: inline-block;
  margin-bottom: 12px;
}

.fai-section-heading {
  font-family: var(--font-heading-medium) !important;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500 !important;
  color: var(--secondary);
  line-height: 1.25;
  margin-bottom: 16px;
  letter-spacing: -0.02em;
}

.fai-section-heading-light {
  font-family: var(--font-heading-medium) !important;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 500 !important;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 16px;
}

.fai-section-description {
  color: var(--text-muted);
  font-size: 1.05rem;
  line-height: 1.75;
  max-width: 780px;
  margin-bottom: 32px;
}

/* 4. Form Controls */
.fai-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.fai-form-label {
  display: block;
  font-size: 0.88rem;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}

.fai-form-input,
.fai-form-select {
  width: 100%;
  padding: 13px 18px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-size: 0.95rem;
  font-family: var(--font-sans);
  background-color: #f8fafc;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.fai-form-input:focus,
.fai-form-select:focus {
  background-color: #ffffff;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(232, 116, 30, 0.15);
}

.fai-form-error {
  display: block;
  color: #dc2626;
  font-size: 0.82rem;
  margin-top: 4px;
  font-weight: 600;
}

/* 5. Standard Interactive Buttons */
.fai-btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  border: 1px solid #cbd5e1;
  background-color: #ffffff;
  color: var(--secondary);
  transition: all 0.2s ease;
}
.fai-btn-copy:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
}
.fai-btn-copy-success {
  background-color: #dcfce7 !important;
  border-color: #16a34a !important;
  color: #15803d !important;
}
```

---

## 3. Caveats

1. **Active Font Alignment**:
   - An ongoing or recent task (`Changing Default Web Font`) updated fonts to `SVN-Sonoma`. All new atomic components and CSS rules must strictly rely on `var(--font-sans)` and `var(--font-heading-medium)`. Never hardcode `fontFamily: 'Inter'` or `fontFamily: 'Montserrat'`.
2. **Next.js Hydration Mismatch**:
   - In `TuitionBankSection`, clipboard checkmark icons conditionally render based on `copiedField`. Ensure that initial SSR state matches client hydration (`useState(null)`).
   - In `ScholarshipTabSection` and `OnlineRegistrationSection`, default values must remain deterministic during SSR.
3. **Form Endpoint Compatibility**:
   - The Google Apps Script URL used in `OnlineRegistrationSection` and `ScholarshipFormSection` (`https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec`) uses `mode: 'no-cors'`. The payload structure (`fullName`, `phone`, `email`, `campus`, `course`) must be strictly preserved so data flows seamlessly into the Google Sheet.
4. **Read-Only Scope**:
   - This report is an analytical investigation. No application files have been modified during this survey.

---

## 4. Conclusion & Recommended Execution Roadmap

1. **Step 1: Content Decoupling (`src/data/`)**:
   Implement the 4 authoritative single-source-of-truth modules:
   - `src/data/programs.js` (11 programs + detailed syllabi for course pages)
   - `src/data/scholarships.js` (Aptech, Arena, Skillking, Jetking)
   - `src/data/tuition.js` (Hanoi & Danang TPBank STK & syntax)
   - `src/data/contacts.js` (Hotlines, emails, campus addresses)

2. **Step 2: CSS Design System Foundation**:
   Create `src/styles/fai-design-system.css` and wire it into the project, exposing the `.fai-*` classes without touching legacy declarations.

3. **Step 3: Tuyển sinh Decomposition**:
   Create `src/components/tuyen-sinh/` with the 6 proposed components (`HeroSection.jsx`, `TargetAudienceSection.jsx`, `AdmissionMethodSection.jsx`, `ScholarshipTabSection.jsx`, `TuitionBankSection.jsx`, `OnlineRegistrationSection.jsx`). Replace `src/app/tuyen-sinh/page.js` with the clean 40-line composition page.

4. **Step 4: Course Layout Architecture**:
   Implement `src/components/course/CourseLayout.jsx` and refactor the 11 course pages to consume `COURSE_*` data from `src/data/programs.js`.

5. **Step 5: Monolithic Pages Decomposition**:
   Refactor `src/app/ve-fai/page.js`, `src/app/doi-song/page.js`, and `src/app/lien-he/page.js` into atomic sub-components.

---

## 5. Verification Method

To independently verify the facts and proposals documented in this report:

1. **Verify Line Counts**:
   ```bash
   wc -l src/app/tuyen-sinh/page.js src/app/ve-fai/page.js src/app/doi-song/page.js src/app/lien-he/page.js
   ```
   *Expected*: `tuyen-sinh/page.js` ~1,994 lines, `ve-fai/page.js` ~1,010 lines.

2. **Verify Section Markers & Inline Styles**:
   ```bash
   grep -n "BLOCK " src/app/tuyen-sinh/page.js
   grep -c "style={{" src/app/tuyen-sinh/page.js
   ```
   *Expected*: 7 block comments, 259 inline style instances.

3. **Verify Course Layout Symmetry**:
   ```bash
   grep -n "<section" src/app/dao-tao/aptech/accp/page.js src/app/dao-tao/arena/amsp/page.js src/app/dao-tao/chip-design/page.js
   ```
   *Expected*: Identical `.beau-hero`, `.beau-section`, `.beau-cta-section` structure across all 11 courses.

4. **Verify Local Dev Server**:
   ```bash
   curl -I http://localhost:3000/
   curl -I http://localhost:3000/tuyen-sinh
   ```
   *Expected*: HTTP 200 OK on both endpoints.
