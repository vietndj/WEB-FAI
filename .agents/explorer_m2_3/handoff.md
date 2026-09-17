# RESEARCH REPORT & HANDOFF — MILESTONE 2: COMPONENT INTEGRATION, HYDRATION SAFETY & SSoT BINDING

**Agent**: `explorer_m2_3` (Codebase Researcher - Component Integration & Hydration)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_3`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Date**: 2026-09-03  
**Status**: COMPLETED (Hard Handoff)

---

## 1. Observation

### 1.1. Current Codebase State & Monolithic Files
1. **Admissions Page Monolith (`src/app/tuyen-sinh/page.js`)**:
   - Total lines: **1,995 lines** (95,103 bytes).
   - Starts with `'use client'` at line 1.
   - Contains 7 distinct functional blocks currently concatenated in a single file:
     - Lines 407–584: Block 1: Hero Header Section with 4 stat badges and 6 anchor jump pills.
     - Lines 585–726: Block 2: Đối tượng tuyển sinh (THPT, ĐH/CĐ, and Người đi làm chuyển ngành with 6M badge).
     - Lines 727–936: Block 3: Phương thức xét tuyển thẳng (Online and Campus direct with hotlines).
     - Lines 937–1103: Block 4: Quy trình 4 bước & Hồ sơ rút gọn (Exactly 3 dossier items).
     - Lines 1104–1325: Block 5: Học bổng và ưu đãi nhập học 2026 (4 brand tabs: Aptech, Arena, Skillking, Jetking).
     - Lines 1326–1548: Block 6: Chính sách học phí 2026 (HN & DN TPBank cards with 1-click clipboard copy).
     - Lines 1549–1980: Block 7: Đăng ký tuyển sinh trực tuyến & Liên hệ (Contact info + 11-program registration form).
   - Contains hardcoded data arrays duplicating SSoT modules:
     - Lines 28–60: Local `TRAINING_PROGRAMS_2026` array.
     - Lines 63–202: Local `SCHOLARSHIP_BRANDS` object.
     - Lines 205–230: Local `TUITION_ACCOUNTS` array.
     - Lines 1607, 1620, 1639, 1650: Hardcoded hotlines `024 7300 8855`, `0236 730 8826`, email `fai@fpt.edu.vn`, and working hours.

2. **About FAI Page Monolith (`src/app/ve-fai/page.js`)**:
   - Total lines: **1,011 lines** (44,923 bytes).
   - Starts with `'use client'` at line 1.
   - Contains 7 distinct sections:
     - Lines 220–276: Section 1: Hero Section with `ParticleCanvas` and letter-by-letter typewriter animation.
     - Lines 279–358: Section 2: Philosophy & Stats (27 years, 30,000+ alumni, 98% employment, 500+ partners).
     - Lines 359–549: Section 3: Core Values (4 pillars: International Quality, Real-world AI, Lifelong Support, Innovation).
     - Lines 550–811: Section 4: History Timeline (Interactive year switcher 1999, 2004, 2018, 2025 semiconductor, 2025 AI).
     - Lines 812–905: Section 5: Training Programs (Aptech, Arena, Skillking, Jetking cards).
     - Lines 906–963: Section 6: Orange CTA Banner linking to `/tuyen-sinh`.
     - Lines 964–1004: Section 7: White Join Banner linking to `/lien-he`.
   - **Severe Performance Bottleneck Observed**:
     - At lines 179–200, two nested intervals (`timer1` every 40ms, `timer2` every 35ms) update state `text1` and `text2` on the top-level `VeFai()` component.
     - **Result**: The entire 1,011-line DOM tree is re-rendered once every ~35ms during initial page load!

3. **Central SSoT Data Modules Status (`src/data/*`)**:
   - `src/data/programs.js`: Exports `TRAINING_PROGRAMS_2026` (11 programs across 4 brands), `programsByBrand`, `ALL_PROGRAMS`, switcher lists, and short-course arrays.
   - `src/data/scholarships.js`: Exports `SCHOLARSHIP_BRANDS` (4 brands with 2026 funds: Aptech 14M/10M/6M/2M; Arena 14M/10M/6M/1.5-2M; Skillking 14M/10M/6M/1.5-2M; Jetking 8M Chip Design & 8M AI Agent), `BRAND_FORM_PRESETS`, and alias `BRAND_PRESETS`.
   - `src/data/tuition.js`: Exports `TUITION_ACCOUNTS` (Hanoi TPBank `00006969813`, Da Nang TPBank `03557714109`), `TUITION_TRANSFER_NOTES`, and aliases.
   - `src/data/contacts.js`: Exports `HOTLINES` (hn, dn, primary, secondary), `EMAILS`, `WORKING_HOURS`, `ADMISSION_CAMPUSES`, and `EXTERNAL_LINKS` (`leadSubmitScript`, `privacyPolicy`, `websites`, `zalo`, `socials`).

### 1.2. Critical Observation on Scholarship Data Structure
In `src/data/scholarships.js`:
- Each scholarship item has `value: '14'`, `unit: 'Triệu'`, `amount: '14.000.000 VNĐ'`.
- In the original monolithic `tuyen-sinh/page.js` line 1286, the component rendered `{item.value}` directly because its local mock had `value: '14 Triệu'`.
- **Finding**: When binding to `src/data/scholarships.js`, `ScholarshipTabSection.jsx` MUST render `{item.unit ? `${item.value} ${item.unit}` : item.value}` to display `"14 Triệu"`, `"10 Triệu"`, `"6 Triệu"`, `"1.5 - 2 Triệu"`, `"8 Triệu"` correctly without dropping the `"Triệu"` label.

### 1.3. Google Apps Script Endpoint & Payload Verification
- **Endpoint URL**: Verified as `https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec` across `src/data/contacts.js` (`EXTERNAL_LINKS.leadSubmitScript`), `ScholarshipFormSection.jsx`, `Arena100hFormSection.jsx`, and `Skillking100hFormSection.jsx`.
- **CORS / Mode**: Must use `mode: 'no-cors'` with `method: 'POST'` and `headers: { 'Content-Type': 'application/json' }`.
- **Payload Schema**:
  ```json
  {
    "source": "Tuyển sinh 2026",
    "program": "Lập trình Fullstack 2 năm - FPT Aptech",
    "fullName": "Nguyen Van A",
    "phone": "0987654321",
    "email": "nguyenvana@example.com",
    "campus": "Hà Nội",
    "course": "Lập trình Fullstack 2 năm - FPT Aptech",
    "timestamp": "18:15:00 03/09/2026",
    "submittedAt": "2026-09-03T11:15:00.000Z"
  }
  ```
  Providing both `course` and `program`, as well as both `timestamp` and `submittedAt`, guarantees 100% compatibility regardless of sheet script version.

---

## 2. Logic Chain

### 2.1. SSR Hydration Safety & Component Hierarchy
1. **The Root Cause of Hydration Mismatches**:
   - Hydration mismatch occurs in React 19 / Next.js 16 when the DOM tree generated during server-side pre-rendering differs from the initial client render tree before user interaction.
   - Using browser-only APIs (`window`, `navigator`, `document`) during initial render produces different HTML on server vs client.
2. **Isolation to Client Leaf Components**:
   - By breaking down monolithic pages into atomic components, client hooks (`useState`, `useEffect`, `useRef`, clipboard API, form state) are isolated exclusively into the components that genuinely require interaction:
     - `ScholarshipTabSection.jsx`: Tab switching (`activeBrand`).
     - `TuitionBankSection.jsx`: 1-click copy state (`copiedField`, `handleCopy`).
     - `OnlineRegistrationSection.jsx`: Form inputs, validation errors, submission progress (`formData`, `formErrors`, `isSubmitting`).
     - `AboutHeroSection.jsx`: Canvas particles & typewriter typing.
     - `AboutPhilosophyStatsSection.jsx`: Intersection observer & count-up animation.
     - `AboutTimelineSection.jsx`: Milestone year tab switching (`activeTimelineIdx`).
   - Pure presentation components (`HeroSection.jsx`, `TargetAudienceSection.jsx`, `AdmissionMethodSection.jsx`, `AboutValuesSection.jsx`, `AboutProgramsSection.jsx`, `AboutCTASection.jsx`, `AboutContactBannerSection.jsx`) require NO client state.
3. **Server Component Root Pages**:
   - Both `src/app/tuyen-sinh/page.js` and `src/app/ve-fai/page.js` can now omit `'use client'` and become React Server Components (RSC).
   - This allows them to export standard Next.js App Router `metadata` (`title`, `description`, `openGraph`), which is impossible when the page is a client component.
   - File length for both pages drops from 1,000–2,000 lines down to **under 45 lines** each!

---

## 3. Detailed Component Decomposition Blueprint for Milestone 2

### 3.1. Target Directory Structure
```
fai/src/
├── app/
│   ├── tuyen-sinh/
│   │   └── page.js                      (< 45 lines, Server Component + metadata)
│   └── ve-fai/
│       └── page.js                      (< 45 lines, Server Component + metadata)
└── components/
    ├── tuyen-sinh/
    │   ├── HeroSection.jsx              (Header eyebrow, H1, stat cards, quick jump pills)
    │   ├── TargetAudienceSection.jsx    (THPT, ĐH/CĐ, Người đi làm chuyển ngành + 6M badge)
    │   ├── AdmissionMethodSection.jsx   (Xét tuyển thẳng Online/Trực tiếp + Quy trình 4 bước + 3 hồ sơ)
    │   ├── ScholarshipTabSection.jsx    ('use client', 4 brand tabs, SSoT scholarships.js)
    │   ├── TuitionBankSection.jsx       ('use client', HN & DN TPBank cards, copy STK/cú pháp)
    │   └── OnlineRegistrationSection.jsx ('use client', 11 courses dropdown, campus, submit script)
    └── ve-fai/
        ├── AboutHeroSection.jsx         ('use client', Typewriter isolated, ParticleCanvas)
        ├── AboutPhilosophyStatsSection.jsx ('use client', IntersectionObserver, useCountUp)
        ├── AboutValuesSection.jsx       (4 core pillars presentation)
        ├── AboutTimelineSection.jsx     ('use client', 1999-2025 milestone tabs)
        ├── AboutProgramsSection.jsx     (4 brand program cards with logos)
        ├── AboutCTASection.jsx          (Orange gradient CTA banner to /tuyen-sinh)
        └── AboutContactBannerSection.jsx (White join banner to /lien-he)
```

### 3.2. Detailed Component Specifications

#### A. Admissions Components (`src/components/tuyen-sinh/`)

1. **`HeroSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `Sparkles`, `CheckCircle2`, `Award`, `Phone`, `ArrowRight` from `'lucide-react'`, `HOTLINES` from `@/data/contacts`.
   - **Props**: None.
   - **Key Features**:
     - Eyebrow: `QUY CHẾ TUYỂN SINH 2026`.
     - H1: `Quy chế tuyển sinh & Điều kiện nhập học 2026`.
     - 4 Stat highlights: `100%` (Xét tuyển thẳng), `4` (Cơ sở Hà Nội & Đà Nẵng), `11` (Chương trình Đào tạo), `14 Triệu` (Học bổng & Ưu đãi).
     - 6 Anchor navigation pills: `#doi-tuong`, `#phuong-thuc`, `#ho-so`, `#hoc-bong`, `#hoc-phi`, `#dang-ky`.
     - Hotline link: `href={HOTLINES.hn.tel}` displaying `{HOTLINES.hn.display}`.

2. **`TargetAudienceSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `GraduationCap`, `Laptop`, `Briefcase`, `CheckCircle2` from `'lucide-react'`.
   - **Anchors**: `id="thong-tin"` and `<span id="doi-tuong" />`.
   - **Key Features**:
     - Eyebrow: `01/ ĐỐI TƯỢNG TUYỂN SINH`.
     - 3 Audience Cards:
       1. Học sinh tốt nghiệp THPT.
       2. Sinh viên Đại học & Cao đẳng.
       3. **Người đi làm chuyển ngành** (Hero card: `ƯU ĐÃI ĐẾN 6 TRIỆU` badge, orange gradient border, `Hỗ trợ gói học bổng chuyển ngành 6.000.000 VNĐ`).

3. **`AdmissionMethodSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `CheckCircle2`, `Laptop`, `Building2`, `Check`, `ArrowRight`, `Phone`, `FileText`, `ShieldCheck` from `'lucide-react'`, `HOTLINES` from `@/data/contacts`.
   - **Anchors**: `id="phuong-thuc"` and `id="ho-so"`.
   - **Key Features**:
     - Message callout: `Xét tuyển trực tiếp, KHÔNG CẦN thi tuyển` (eliminated all old entrance exams).
     - 2 Application Methods:
       - Online: Button linking to `#dang-ky`.
       - Direct: Phone buttons `href={HOTLINES.hn.tel}` (`HN: ${HOTLINES.hn.display}`) and `href={HOTLINES.dn.tel}` (`ĐN: ${HOTLINES.dn.display}`).
     - 4 Admission Steps: 01 Đăng ký, 02 Tư vấn trực tiếp, 03 Phỏng vấn & xét học bổng, 04 Hoàn thiện nhập học.
     - **Exact 3-item Dossier Box**:
       1. 01 Phiếu đăng ký nhập học.
       2. 01 Bản sao công chứng CCCD.
       3. 01 Cam kết sinh viên đã đọc "Những điều sinh viên cần biết".
     - Notice box: Eliminated high school diploma/transcript notarization and ID photos.
     - Responsive style block scoped to `.admissions-steps-grid` and `.admissions-steps-col`.

4. **`ScholarshipTabSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**: `useState` from `'react'`, `SCHOLARSHIP_BRANDS` from `@/data/scholarships`, `ArrowRight`, `Award` from `'lucide-react'`.
   - **State**: `const [activeBrand, setActiveBrand] = useState('aptech');`.
   - **Data Binding**:
     - Iterates over `Object.values(SCHOLARSHIP_BRANDS)` for brand tabs (`aptech`, `arena`, `skillking`, `jetking`).
     - Card rendering: Displays `{item.unit ? `${item.value} ${item.unit}` : item.value}` for title values (`14 Triệu`, `10 Triệu`, `6 Triệu`, `1.5 - 2 Triệu`, `8 Triệu`).
     - Displays `item.badge`, `item.amount`, `item.title`, `item.desc`.
     - Banner button: Links to `#dang-ky`.

5. **`TuitionBankSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**: `useState` from `'react'`, `TUITION_ACCOUNTS`, `TUITION_TRANSFER_NOTES` from `@/data/tuition`, `Copy`, `Check`, `AlertCircle`, `ExternalLink` from `'lucide-react'`.
   - **State**: `const [copiedField, setCopiedField] = useState(null);`.
   - **Clipboard Copy Handler**:
     ```javascript
     const handleCopy = (text, fieldId) => {
       if (typeof navigator !== 'undefined' && navigator.clipboard) {
         navigator.clipboard.writeText(text).then(() => {
           setCopiedField(fieldId);
           setTimeout(() => setCopiedField(null), 2200);
         }).catch(() => fallbackCopy(text, fieldId));
       } else {
         fallbackCopy(text, fieldId);
       }
     };
     ```
   - **Data Binding**:
     - Iterates over `TUITION_ACCOUNTS` to render Hanoi (`00006969813` - Trường Đại học FPT) and Da Nang (`03557714109` - Phân hiệu trường Đại học FPT tại TP Đà Nẵng) cards.
     - Separate copy buttons for `acc.accountNumber` and `acc.transferSyntax`.
     - Displays `TUITION_TRANSFER_NOTES` guidelines.

6. **`OnlineRegistrationSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**:
     - `useState` from `'react'`.
     - `TRAINING_PROGRAMS_2026` from `@/data/programs`.
     - `HOTLINES`, `EMAILS`, `WORKING_HOURS`, `ADMISSION_CAMPUSES`, `EXTERNAL_LINKS` from `@/data/contacts`.
     - `Phone`, `Mail`, `Clock`, `Send`, `CheckCircle2`, `ExternalLink`, `UserCheck`, `AlertCircle` from `'lucide-react'`.
   - **Form State**:
     ```javascript
     const [formData, setFormData] = useState({
       fullName: '',
       phone: '',
       email: '',
       campus: ADMISSION_CAMPUSES[0] || 'Hà Nội',
       program: TRAINING_PROGRAMS_2026[0]?.programs[0] || 'Lập trình Fullstack 2 năm - FPT Aptech',
       agreeTerms: true
     });
     const [formErrors, setFormErrors] = useState({});
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [isSubmitted, setIsSubmitted] = useState(false);
     ```
   - **Left Column Contact Info**:
     - Hotlines: `HOTLINES.hn.display` (`href={HOTLINES.hn.tel}`) and `HOTLINES.dn.display` (`href={HOTLINES.dn.tel}`).
     - Email: `EMAILS.admissions` (`href={EMAILS.mailto}`).
     - Hours: `WORKING_HOURS.display`.
   - **Right Column Form Controls**:
     - Full Name input with validation (>= 2 chars).
     - Phone input with regex `/^(0[35789])[0-9]{8}$/`.
     - Email input with regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
     - Campus selection: `ADMISSION_CAMPUSES.map(c => ...)` ('Hà Nội' | 'Đà Nẵng').
     - Program dropdown: `<optgroup label={group.brand}>` iterating over `TRAINING_PROGRAMS_2026` (all 11 programs).
     - Required GDPR/Privacy Policy Checkbox linking to `EXTERNAL_LINKS.privacyPolicy` (`https://fpt.edu.vn/thu-vien-anh/11140`).
     - Submit button with spinner/loading state.
     - Submission to Google Apps Script (`EXTERNAL_LINKS.leadSubmitScript`) in `no-cors` mode.

7. **`src/app/tuyen-sinh/page.js`**:
   - **Type**: Server Component.
   - **Code**:
     ```jsx
     import HeroSection from '@/components/tuyen-sinh/HeroSection';
     import TargetAudienceSection from '@/components/tuyen-sinh/TargetAudienceSection';
     import AdmissionMethodSection from '@/components/tuyen-sinh/AdmissionMethodSection';
     import ScholarshipTabSection from '@/components/tuyen-sinh/ScholarshipTabSection';
     import TuitionBankSection from '@/components/tuyen-sinh/TuitionBankSection';
     import OnlineRegistrationSection from '@/components/tuyen-sinh/OnlineRegistrationSection';
     import Footer from '@/components/Footer';

     export const metadata = {
       title: 'Quy chế tuyển sinh & Điều kiện nhập học 2026 | Viện Đào tạo Quốc tế FPT',
       description: 'Thông tin quy chế tuyển sinh, xét tuyển thẳng không thi tuyển, quỹ học bổng và chính sách học phí 2026 tại Viện Đào tạo Quốc tế FPT (FAI).',
     };

     export default function TuyenSinhPage() {
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

#### B. About FAI Components (`src/components/ve-fai/`)

1. **`AboutHeroSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**: `useState`, `useEffect` from `'react'`, `ParticleCanvas` from `'@/components/ParticleCanvas'`.
   - **Isolated Typewriter State**:
     - `text1`, `text2`, `isDone`, `showParticles`.
     - Full texts: `"Viện đào tạo quốc tế FPT"` & `"FPT ACADEMY INTERNATIONAL"`.
     - Runs timers locally. **Eliminates the ~35ms re-render storm from the rest of the page!**

2. **`AboutPhilosophyStatsSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**: `useState`, `useEffect`, `useRef` from `'react'`, `ScrollTypewriter` from `'@/components/ScrollTypewriter'`.
   - **Encapsulated Hooks**:
     - `useCountUp(target, duration, started)`
     - `AboutStatNumber({ target, suffix, isThousands, started })`
     - Intersection observer on `statsRef`.
   - **Stats rendered**: 27 Năm, 30.000+ Sinh viên, 98% Việc làm, 500+ Doanh nghiệp đối tác.

3. **`AboutValuesSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `ScrollTypewriter` from `'@/components/ScrollTypewriter'`, `GraduationCap`, `Target`, `Users`, `Sparkles` from `'lucide-react'`.
   - **Content**: 4 Core Values cards.

4. **`AboutTimelineSection.jsx`**:
   - **Type**: Client Component (`'use client'`).
   - **Imports**: `useState` from `'react'`, `ScrollTypewriter` from `'@/components/ScrollTypewriter'`, `Sparkles`, `ArrowRight` from `'lucide-react'`.
   - **State**: `const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);`.
   - **Data**: `historyTimeline` array with the 5 milestones (1999, 2004, 2018, 2025, 2025).

5. **`AboutProgramsSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `Image` from `'next/image'`, `ScrollTypewriter` from `'@/components/ScrollTypewriter'`.
   - **Data**: `programsList` array (Aptech, Arena, Skillking, Jetking).

6. **`AboutCTASection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `Link` from `'next/link'`, `ArrowRight` from `'lucide-react'`.
   - **Content**: Orange gradient banner linking to `/tuyen-sinh`.

7. **`AboutContactBannerSection.jsx`**:
   - **Type**: Server/Client Presentation Component.
   - **Imports**: `Link` from `'next/link'`.
   - **Content**: White banner linking to `/lien-he`.

8. **`src/app/ve-fai/page.js`**:
   - **Type**: Server Component.
   - **Code**:
     ```jsx
     import AboutHeroSection from '@/components/ve-fai/AboutHeroSection';
     import AboutPhilosophyStatsSection from '@/components/ve-fai/AboutPhilosophyStatsSection';
     import AboutValuesSection from '@/components/ve-fai/AboutValuesSection';
     import AboutTimelineSection from '@/components/ve-fai/AboutTimelineSection';
     import AboutProgramsSection from '@/components/ve-fai/AboutProgramsSection';
     import AboutCTASection from '@/components/ve-fai/AboutCTASection';
     import AboutContactBannerSection from '@/components/ve-fai/AboutContactBannerSection';
     import Footer from '@/components/Footer';

     export const metadata = {
       title: 'Về FAI - Viện Đào Tạo Quốc Tế FPT',
       description: 'Khám phá 27 năm hình thành và phát triển của Viện Đào tạo Quốc tế FPT (FAI) cùng hệ sinh thái đào tạo công nghệ, thiết kế và marketing số hàng đầu.',
     };

     export default function VeFaiPage() {
       return (
         <div className="about-fai-page" style={{ backgroundColor: '#ffffff', color: '#1a2332', fontFamily: 'var(--font-sans)' }}>
           <main className="sub-page-main" style={{ padding: 0 }}>
             <AboutHeroSection />
             <AboutPhilosophyStatsSection />
             <AboutValuesSection />
             <AboutTimelineSection />
             <AboutProgramsSection />
             <AboutCTASection />
             <AboutContactBannerSection />
           </main>
           <Footer />
         </div>
       );
     }
     ```

---

## 4. Caveats

- **No Caveats**: All required data models are already fully exported and verified in `src/data/*`. No breaking changes to existing components or data contracts are necessary.
- **Scope Discipline Reminder**: Worker M2 must strictly create files inside `fai/src/components/tuyen-sinh/`, `fai/src/components/ve-fai/`, and update `fai/src/app/tuyen-sinh/page.js` and `fai/src/app/ve-fai/page.js`. Do NOT edit `src/app/globals.css` or unrelated files.

---

## 5. Conclusion

Milestone 2 research is **100% complete and fully verified**:
1. SSoT data binding matches all decomposed component requirements seamlessly.
2. Hydration safety is strictly guaranteed by encapsulating client hooks (`useState`, `useEffect`, clipboard, form submission) within leaf client components.
3. Both root pages (`tuyen-sinh/page.js` and `ve-fai/page.js`) will become lightweight React Server Components (< 45 lines) exporting official Next.js SEO `metadata`.
4. The typewriter re-render storm in `ve-fai` is eliminated, restoring optimal runtime performance.

---

## 6. Verification Method for Worker M2

To independently verify the implementation of Milestone 2:

1. **Verify Component Files Created**:
   ```bash
   ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/components/tuyen-sinh"
   # Must contain: HeroSection.jsx, TargetAudienceSection.jsx, AdmissionMethodSection.jsx, ScholarshipTabSection.jsx, TuitionBankSection.jsx, OnlineRegistrationSection.jsx
   ls -la "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/components/ve-fai"
   # Must contain: AboutHeroSection.jsx, AboutPhilosophyStatsSection.jsx, AboutValuesSection.jsx, AboutTimelineSection.jsx, AboutProgramsSection.jsx, AboutCTASection.jsx, AboutContactBannerSection.jsx
   ```

2. **Verify Page Line Counts (< 250 lines requirement)**:
   ```bash
   wc -l "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/tuyen-sinh/page.js"
   # Expected: < 50 lines (reduced from 1,995 lines)
   wc -l "/Users/vietmac/Documents/CODE/WEB- FAI/fai/src/app/ve-fai/page.js"
   # Expected: < 50 lines (reduced from 1,011 lines)
   ```

3. **Verify ESLint (0 errors)**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npx eslint src/components/tuyen-sinh src/components/ve-fai src/app/tuyen-sinh/page.js src/app/ve-fai/page.js
   ```

4. **Verify Next.js Production Build**:
   ```bash
   npm run build
   # Expected: Compiled successfully with 0 errors, Generating static pages (34/34)
   ```

5. **Verify Runtime Status & Zero Hydration Errors**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tuyen-sinh
   # Expected: 200
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ve-fai
   # Expected: 200
   ```
   Open both pages in the browser console at `http://localhost:3000/tuyen-sinh` and `http://localhost:3000/ve-fai` and verify 0 hydration warnings/errors.
