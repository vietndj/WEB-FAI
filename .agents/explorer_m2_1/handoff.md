# HANDOFF REPORT — MILESTONE 2: TUYỂN SINH PAGE DECOMPOSITION RESEARCH

**Agent**: `explorer_m2_1` (Codebase Researcher - Tuyen Sinh Decomposition)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_1`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Target File**: `src/app/tuyen-sinh/page.js` (1995 lines)  
**Date**: 2026-09-03  
**Status**: COMPLETED (Hard Handoff)  

---

## 1. Observation

### 1.1. Current State of `src/app/tuyen-sinh/page.js`
- **Total Lines**: 1,995 lines.
- **Nature**: Monolithic "God Component" marked with `'use client';` at line 1.
- **Contents**: Mixes static landing page presentation, hardcoded institutional data, clipboard utilities, tab switcher logic, multi-field form state, validation regexes, and inline responsive media queries into a single file.

### 1.2. State Variables and Handlers Audit
A complete audit of all state variables and functions in `src/app/tuyen-sinh/page.js` reveals:

| State / Handler | Definition Lines | Used Lines | Scope & Affinity | Target Component |
|---|---|---|---|---|
| `activeBrand`, `setActiveBrand` | L234 (`useState('aptech')`) | L1148, L1153, L382, L1195–1311 | ONLY used in Block 5 (Học bổng) | `ScholarshipTabSection.jsx` |
| `currentBrandData` | L382 | L1195–1311 | Derived from `activeBrand` | `ScholarshipTabSection.jsx` |
| `copiedField`, `setCopiedField` | L237 (`useState(null)`) | L1429, L1436–1438, L1480, L1487–1489 | ONLY used in Block 6 (Học phí) | `TuitionBankSection.jsx` |
| `handleCopy`, `fallbackCopy` | L254–283 | L1429, L1480 | Clipboard API with fallback | `TuitionBankSection.jsx` |
| `formData`, `setFormData` | L240–248 | L351–355, L1689, L1720, L1753, L1783, L1813, L1855, L1898 | Form input fields | `OnlineRegistrationSection.jsx` |
| `formErrors`, `setFormErrors` | L249 (`useState({})`) | L293–295, L334, L379, L1726, L1736, L1759, L1769, L1789, L1799, L1929 | Validation error map | `OnlineRegistrationSection.jsx` |
| `isSubmitting`, `setIsSubmitting` | L250 (`useState(false)`) | L340, L363, L1938, L1942, L1947, L1957 | Submit loading flag | `OnlineRegistrationSection.jsx` |
| `isSubmitted`, `setIsSubmitted` | L251 (`useState(false)`) | L364, L370, L1680 | Submission success view | `OnlineRegistrationSection.jsx` |
| `handleInputChange` | L286–296 | L1721, L1754, L1784, L1838, L1856, L1899 | Input change dispatcher | `OnlineRegistrationSection.jsx` |
| `validateForm` | L299–327 | L333 | Name, Phone (10 digits), Email, Agree checkbox | `OnlineRegistrationSection.jsx` |
| `handleFormSubmit` | L330–367 | L1709 | Async fetch to Google Script | `OnlineRegistrationSection.jsx` |
| `handleResetForm` | L369–380 | L1693 | Reset form to initial values | `OnlineRegistrationSection.jsx` |

**Crucial Observation**: **ZERO state variables or handlers are shared between sections!**
- Hero does not use state.
- TargetAudience does not use state.
- AdmissionMethod does not use state.
- ScholarshipTab only uses `activeBrand`.
- TuitionBank only uses `copiedField` / `handleCopy`.
- OnlineRegistration only uses form states and submit handlers.
- **Therefore, `page.js` itself requires NO state whatsoever.**

### 1.3. Hardcoded Data Structures Audit

1. **`TRAINING_PROGRAMS_2026`** (Lines 28–60, 33 lines):
   - Contains 11 programs grouped by 4 brands: FPT Aptech (4), FPT Arena Multimedia (3), FPT Skillking (2), FPT Jetking (2).
   - **Match**: Exactly identical to `TRAINING_PROGRAMS_2026` in `src/data/programs.js` (lines 7–43).
2. **`SCHOLARSHIP_BRANDS`** (Lines 63–202, 140 lines):
   - Contains 4 brand scholarship configurations (`aptech`, `arena`, `skillking`, `jetking`), items with title, value, amount, desc, badge.
   - **Match**: `src/data/scholarships.js` exports `SCHOLARSHIP_BRANDS` with identical structure, themes, tags, and amounts. (Note: in `scholarships.js`, `value` is `'14'` and `unit` is `'Triệu'`, whereas `page.js` had `value: '14 Triệu'`. Handled cleanly via `{item.unit && !item.value.includes(item.unit) ? `${item.value} ${item.unit}` : item.value}`).
3. **`TUITION_ACCOUNTS`** (Lines 205–230, 26 lines):
   - Contains 2 official TPBank transfer accounts for HN (`00006969813` - Trường Đại học FPT) and DN (`03557714109` - Phân hiệu trường Đại học FPT tại TP Đà Nẵng).
   - **Match**: Exactly identical to `TUITION_ACCOUNTS` in `src/data/tuition.js` (lines 7–34).
4. **Hardcoded Contacts, Hotlines & Webhooks**:
   - Lines 890–928: Hotlines HN `024 7300 8855` and ĐN `0236 730 8826` in Admission Method.
   - Lines 1603–1627: Hotlines HN & ĐN in Contact column.
   - Line 1638: Email `fai@fpt.edu.vn`.
   - Line 1650: Hours `8:00 - 21:00 hàng ngày`.
   - Line 344: Google Apps Script Webhook URL `https://script.google.com/macros/s/AKfycbwfPoh5H-YB8CcPWw9GijIv44YjXtHbrwdLX7XCMWnhTmg5ocW-aGt3PnCIMiC_pvSKrw/exec`.
   - Line 1911: Privacy Policy URL `https://fpt.edu.vn/thu-vien-anh/11140`.
   - **Match**: All of these exist verbatim in `src/data/contacts.js` (`HOTLINES`, `EMAILS`, `WORKING_HOURS`, `ADMISSION_CAMPUSES`, `EXTERNAL_LINKS`).

### 1.4. In-Page Navigation Anchors
The following DOM IDs are referenced by `src/components/Header.jsx` megamenu, `HeroSection` quick navigation pills, and CTAs across the site:
- `#thong-tin` / `#doi-tuong`: Target Audience section (Block 2).
- `#phuong-thuc`: Direct Admission methods (Block 3).
- `#ho-so`: 4-step process & 3-item Dossier (Block 4).
- `#hoc-bong`: Scholarship tabs (Block 5).
- `#hoc-phi`: Tuition banking info (Block 6).
- `#faq`: Hidden anchor (line 1546) preserving legacy bookmarks.
- `#dang-ky`: Online Registration form (Block 7).

---

## 2. Logic Chain

### 2.1. Decomposition Strategy: 6 Atomic Components
By mapping the 7 blocks in `tuyen-sinh/page.js` to 6 atomic components (merging Block 3: Phương thức and Block 4: Quy trình & Hồ sơ into `AdmissionMethodSection.jsx` as both belong to Admission Method & Procedures):

```
src/components/tuyen-sinh/
├── HeroSection.jsx              (Block 1: Hero Header & 6 Quick Navigation Pills)
├── TargetAudienceSection.jsx    (Block 2: 3 Audience Groups with highlight on Career Switchers)
├── AdmissionMethodSection.jsx   (Blocks 3 & 4: Direct Admission cards + 4-Step Process + 3-item Dossier)
├── ScholarshipTabSection.jsx    (Block 5: 4-Brand Scholarship Tabs & Cards Grid)
├── TuitionBankSection.jsx       (Block 6: TPBank HN & DN Transfer Cards + 1-Click Copy + Caution Banner + #faq)
└── OnlineRegistrationSection.jsx (Block 7: Contact Info + 11-Program Direct Registration Form + Validation)
```

### 2.2. State & Component Lifecycle Architecture

```
                                  src/app/tuyen-sinh/page.js
                                 (Server Component, ~60 lines)
                                   - SEO Metadata Export
                                   - Layout Assembling
                                   - Global Page Wrapper
                                              │
         ┌──────────────────┬─────────────────┼──────────────────┬──────────────────┐
         ▼                  ▼                 ▼                  ▼                  ▼
   HeroSection    TargetAudienceSection  AdmissionMethod  ScholarshipTab      TuitionBank      OnlineRegistration
  (Server Comp)       (Server Comp)       (Server Comp)    (Client Comp)     (Client Comp)       (Client Comp)
   - Sparkles         - 3 Cards           - 2 Methods      - activeBrand      - copiedField      - formData
   - Nav Pills        - #thong-tin        - 4 Steps        - SCHOLARSHIP_     - handleCopy       - formErrors
                                          - 3 Dossiers       BRANDS           - TUITION_         - isSubmitting
                                          - #phuong-thuc     from data          ACCOUNTS         - isSubmitted
                                          - #ho-so                            - #hoc-phi         - TRAINING_PROGRAMS
                                                                                                 - CONTACTS from data
                                                                                                 - #dang-ky
```

### 2.3. Single Source of Truth (SSoT) Import Mapping

1. **`HeroSection.jsx`**:
   - Pure UI presentation component.
   - Imports: `Sparkles`, `UserCheck`, `CheckCircle2`, `FileText`, `Award`, `Copy`, `Send` from `lucide-react`.
   - Props: None required.

2. **`TargetAudienceSection.jsx`**:
   - Pure UI presentation component.
   - Anchors: `id="thong-tin"` and `<span id="doi-tuong" ... />`.
   - Imports: `GraduationCap`, `Laptop`, `Briefcase`, `CheckCircle2` from `lucide-react`.
   - Props: None required.

3. **`AdmissionMethodSection.jsx`**:
   - Anchors: `id="phuong-thuc"` and `id="ho-so"`.
   - Imports: `CheckCircle2`, `Check`, `Laptop`, `Building2`, `ArrowRight`, `Phone`, `FileText`, `ShieldCheck` from `lucide-react`.
   - SSoT Data: `import { HOTLINES } from '@/data/contacts';`.
   - Replaces hardcoded phone numbers with `HOTLINES.hn.display`, `HOTLINES.hn.tel`, `HOTLINES.dn.display`, `HOTLINES.dn.tel`.
   - Props: None required.

4. **`ScholarshipTabSection.jsx`**:
   - Marked `'use client';`.
   - Anchor: `id="hoc-bong"`.
   - Imports: `useState` from `'react'`, `ArrowRight` from `'lucide-react'`.
   - SSoT Data: `import { SCHOLARSHIP_BRANDS } from '@/data/scholarships';`.
   - State: `const [activeBrand, setActiveBrand] = useState('aptech');`.
   - Value formatting: `{item.unit && !item.value.includes(item.unit) ? `${item.value} ${item.unit}` : item.value}` to cleanly handle `'14 Triệu'` display.
   - Props: None required (can accept optional `initialBrand = 'aptech'`).

5. **`TuitionBankSection.jsx`**:
   - Marked `'use client';`.
   - Anchor: `id="hoc-phi"` (plus hidden `<span id="faq" ... />`).
   - Imports: `useState` from `'react'`, `Copy`, `Check`, `ShieldCheck`, `AlertCircle` from `'lucide-react'`.
   - SSoT Data: `import { TUITION_ACCOUNTS } from '@/data/tuition';`.
   - State: `const [copiedField, setCopiedField] = useState(null);`.
   - Handlers: `handleCopy` and `fallbackCopy`.
   - Props: None required.

6. **`OnlineRegistrationSection.jsx`**:
   - Marked `'use client';`.
   - Anchor: `id="dang-ky"`.
   - Imports: `useState` from `'react'`, `Phone`, `Mail`, `Clock`, `CheckCircle2`, `ExternalLink`, `Send` from `'lucide-react'`.
   - SSoT Data:
     * `import { TRAINING_PROGRAMS_2026 } from '@/data/programs';`
     * `import { HOTLINES, EMAILS, WORKING_HOURS, ADMISSION_CAMPUSES, EXTERNAL_LINKS } from '@/data/contacts';`
   - State:
     ```js
     const [formData, setFormData] = useState({
       fullName: '',
       phone: '',
       email: '',
       campus: ADMISSION_CAMPUSES[0] || 'Hà Nội',
       program: TRAINING_PROGRAMS_2026[0]?.programs?.[0] || 'Lập trình Fullstack 2 năm - FPT Aptech',
       agreeTerms: true
     });
     const [formErrors, setFormErrors] = useState({});
     const [isSubmitting, setIsSubmitting] = useState(false);
     const [isSubmitted, setIsSubmitted] = useState(false);
     ```
   - Form post uses `EXTERNAL_LINKS.leadSubmitScript`.
   - Privacy link uses `EXTERNAL_LINKS.privacyPolicy`.
   - Contact info uses `HOTLINES`, `EMAILS`, `WORKING_HOURS`.
   - Inline `@keyframes spin` included in local style block for 100% self-contained button spinner.

### 2.4. Page Blueprint (`src/app/tuyen-sinh/page.js`)
The new `src/app/tuyen-sinh/page.js` becomes an ultra-clean Server Component (~60 lines, well below the 250-line requirement):

```jsx
import Footer from '@/components/Footer';
import HeroSection from '@/components/tuyen-sinh/HeroSection';
import TargetAudienceSection from '@/components/tuyen-sinh/TargetAudienceSection';
import AdmissionMethodSection from '@/components/tuyen-sinh/AdmissionMethodSection';
import ScholarshipTabSection from '@/components/tuyen-sinh/ScholarshipTabSection';
import TuitionBankSection from '@/components/tuyen-sinh/TuitionBankSection';
import OnlineRegistrationSection from '@/components/tuyen-sinh/OnlineRegistrationSection';

export const metadata = {
  title: 'Quy chế tuyển sinh & Điều kiện nhập học 2026 | Viện Đào tạo Quốc tế FPT',
  description: 'Thông tin chi tiết về đối tượng tuyển sinh, chính sách xét tuyển thẳng, chế độ học bổng và thủ tục nhập học chính thức năm 2026 tại Viện Đào tạo Quốc tế FPT (FAI).',
  openGraph: {
    title: 'Quy chế tuyển sinh & Điều kiện nhập học 2026 | FAI',
    description: 'Xét tuyển thẳng, không thi tuyển. Học bổng tài năng đến 14 triệu cho các ngành CNTT, Thiết kế, Digital Marketing, Bán dẫn & AI.'
  }
};

export default function TuyenSinh() {
  return (
    <div 
      className="admissions-page-container" 
      style={{ 
        backgroundColor: '#ffffff', 
        color: '#1a2332', 
        fontFamily: 'var(--font-sans)' 
      }}
    >
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

## 3. Caveats

1. **Responsive Styles Scoping**:
   - The media query for `.admissions-steps-grid` and `.admissions-contact-grid` (`@media (max-width: 992px)`) should be co-located directly inside `AdmissionMethodSection.jsx` and `OnlineRegistrationSection.jsx` respectively (or retained in `page.js` if global to the admissions layout). Co-locating in the respective components guarantees complete component atomicity.
2. **Backward Compatibility for Links**:
   - The hidden `<span id="faq" />` anchor must be preserved in `TuitionBankSection.jsx` to ensure any existing megamenu bookmarks or back-links do not break.
   - The double anchor `<span id="doi-tuong" />` in `TargetAudienceSection.jsx` must be kept alongside `id="thong-tin"`.
3. **Scholarship Unit Display**:
   - In `src/data/scholarships.js`, `value` is numeric (e.g. `'14'`) and `unit` is `'Triệu'`. The component must render `{item.value} {item.unit || ''}` (or `{item.unit && !item.value.includes(item.unit) ? `${item.value} ${item.unit}` : item.value}`) to match the original `'14 Triệu'` visual presentation.
4. **Read-only Compliance**:
   - This research was conducted under strict read-only constraints; no source files were modified during this stage.

---

## 4. Conclusion

The decomposition of `src/app/tuyen-sinh/page.js` is **100% mapped, architecturally sound, and ready for immediate implementation by `worker_m2_1`**:
- **Line Count Reduction**: From 1,995 lines down to ~60 lines in `src/app/tuyen-sinh/page.js` (>96% reduction).
- **6 Atomic Components**: Each under 380 lines, fully self-contained in `src/components/tuyen-sinh/`.
- **Zero State Leakage**: State is completely encapsulated where it belongs; `page.js` has zero state and becomes a Server Component supporting native SEO `metadata`.
- **SSoT Completeness**: All training programs, scholarship funds, tuition bank accounts, hotlines, emails, and form endpoints will be directly imported from `src/data/`.

---

## 5. Verification Method

For the subsequent implementation agent (`worker_m2_1`):

1. **Create Directory and Components**:
   - Create `src/components/tuyen-sinh/` with the 6 component files.
2. **Verify Component Implementations**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   npx eslint src/components/tuyen-sinh/ src/app/tuyen-sinh/page.js
   ```
3. **Verify Next.js Build**:
   ```bash
   npm run build
   ```
4. **Verify HTTP 200 & Navigation Targets on Localhost**:
   ```bash
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/tuyen-sinh
   ```
5. **Verify Interactive Features**:
   - Tab switching across Aptech, Arena, Skillking, Jetking in `ScholarshipTabSection`.
   - Clipboard copying of account numbers and transfer syntaxes in `TuitionBankSection`.
   - Client-side validation (empty name, invalid phone, missing terms) in `OnlineRegistrationSection`.
   - Form submission posting to `EXTERNAL_LINKS.leadSubmitScript`.
