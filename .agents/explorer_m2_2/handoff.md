# HANDOFF REPORT — MILESTONE 2: VỀ FAI PAGE DECOMPOSITION RESEARCH

**Agent**: `explorer_m2_2` (Codebase Researcher - Ve Fai Decomposition)  
**Working Directory**: `/Users/vietmac/Documents/CODE/WEB- FAI/.agents/explorer_m2_2`  
**Target Codebase**: `/Users/vietmac/Documents/CODE/WEB- FAI/fai`  
**Target File**: `src/app/ve-fai/page.js` (1010 lines)  
**Date**: 2026-09-03  
**Status**: COMPLETED (Hard Handoff)

---

## 1. Observation

### 1.1. Current File Metrics & Structure
- **File path**: `src/app/ve-fai/page.js`
- **Total lines**: 1010 lines (verified via `wc -l`)
- **Current status**: HTTP 200 on `http://localhost:3000/ve-fai`
- **Current architecture**: Monolithic "God File" containing data arrays, custom hooks, helper components, stateful typewriter effects, intersection observers, and 7 distinct visual sections all bundled in one file.

### 1.2. Breakdown of Components & Sections Currently in `page.js`

| Line Range | Content / Feature | Visual Elements & Behavior | Proposed Destination Component |
|---|---|---|---|
| 1–10 | Direct Imports | React hooks, `ScrollTypewriter`, `ParticleCanvas`, `Footer`, `Image`, `Link`, Lucide icons | Split by component |
| 11–42 | `historyTimeline` data | 5 milestones (1999 Aptech, 2004 Arena, 2018 Skillking, 2025 Bán dẫn, 2025 AI Agent) | `AboutTimelineSection.jsx` |
| 46–69 | `programsList` data | 4 brand items (Aptech, Arena, Skillking, Jetking multi-course) | `AboutProgramsSection.jsx` |
| 75–93 | `useCountUp` custom hook | `requestAnimationFrame` with quartic ease-out curve | `AboutPhilosophyStatsSection.jsx` |
| 95–129 | `AboutStatNumber` helper | Formats numbers with thousand separator, renders large typography & suffix | `AboutPhilosophyStatsSection.jsx` |
| 131–212 | `VeFai` state & mount effects | Hero typewriter timers (55ms / 35ms), particles visibility toggle, IntersectionObserver for stats | Encapsulated into individual sections |
| 219–276 | **Section 1: Hero Section** | Dual-line dynamic typewriter (`"Viện đào tạo quốc tế FPT"` & `"FPT ACADEMY INTERNATIONAL"`), `ParticleCanvas` background | `src/components/ve-fai/AboutHeroSection.jsx` |
| 278–356 | **Section 2: Philosophy & Stats** | Dark navy gradient background, FAI philosophy statement, `ScrollTypewriter` for title, 4 animated count-up counters (27 năm, 60.000 sinh viên, 98% việc làm, 1000+ đối tác) | `src/components/ve-fai/AboutPhilosophyStatsSection.jsx` |
| 359–547 | **Section 3: Sứ Mệnh, Tầm Nhìn & Văn Hoá** | Minimalist flat layout, Sứ mệnh FPT Education, Triết lí giáo dục, Văn hoá FPT (Tôn đồng đổi chí gương sáng), Tầm nhìn Mega, 4 Trụ cột IGSM (Industry Relevant, Global, Smart Education, Mega) | `src/components/ve-fai/AboutValuesSection.jsx` |
| 549–809 | **Section 4: Cyber Timeline** | High-tech cyber aesthetic, horizontal glowing progress beam, year pill tabs (1999–2025), glassmorphism milestone detail card, prev/next controls | `src/components/ve-fai/AboutTimelineSection.jsx` |
| 812–903 | **Section 5: Training Programs** | White background, `ScrollTypewriter` header, 4 brand cards with official logos (`/logo_*.png`), multi-course bullets for Jetking | `src/components/ve-fai/AboutProgramsSection.jsx` |
| 906–960 | **Section 6: Business Partnership CTA** | Warm orange gradient (`#e8741e` to `#C9972C`), radial accent glow, enterprise partnership copy, pill button leading to `/lien-he` | `src/components/ve-fai/AboutCTASection.jsx` |
| 963–1003 | **Section 7: Contact / Careers Banner** | Clean white background, bottom-bordered full-width link "Gia nhập FAI cùng chúng tôi" with custom geometric SVG arrow to `/lien-he` | `src/components/ve-fai/AboutContactBannerSection.jsx` |
| 1007 | Global Footer | `<Footer />` shared component | Retained in `page.js` |

### 1.3. Critical Code Quality & ESLint Observations
1. **Unused Lucide Imports**:
   - `page.js` line 9 imports: `{ ArrowRight, Zap, Palette, Megaphone, Globe, Users, Target, GraduationCap, Sparkles }`.
   - Direct search confirmed that **only `ArrowRight`** is actually used (line 955 in the CTA button). The other 8 icons (`Zap, Palette, Megaphone, Globe, Users, Target, GraduationCap, Sparkles`) are legacy leftovers from earlier redesign iterations and can be omitted.
2. **Pre-existing ESLint `react-hooks/set-state-in-effect` Errors**:
   - Running `npx eslint src/app/ve-fai/page.js` detected 2 errors:
     * Line 80: Calling `setCount(0)` synchronously in `useEffect` when `!started`.
     * Line 171: Calling `setText1('')`, `setText2('')`, and `setIsDone(false)` synchronously on mount inside `useEffect` (redundant because initial `useState` already sets them).
   - In the proposed atomic components, removing redundant state setters in effects completely resolves these lint errors.
3. **Existing CSS Class Dependencies**:
   - `.about-hero-particles`, `.program-list-card`, `.typewriter-cursor`, `.about-join-link h2` are styled in `src/app/globals.css`.
   - All class names and inline styles must be strictly preserved to maintain 1:1 visual fidelity.
4. **Asset Verification**:
   - All referenced logos exist in `public/`: `logo_aptech.png`, `logo_arena.png`, `logo_skillking.png`, `logo_jetking.png`.

---

## 2. Logic Chain

1. **Problem Statement**:
   - `src/app/ve-fai/page.js` is over 1000 lines, violating the clean code architecture goal of `< 250 lines` per page file.
   - All state, animations, and section layouts are tightly coupled, making maintenance difficult and triggering React cascading render warnings.
2. **Decomposition Strategy**:
   - Each section is functionally distinct and visually self-contained.
   - By creating a new directory `src/components/ve-fai/` and creating 7 atomic components matching the project specification:
     1. `AboutHeroSection.jsx` (encapsulates hero typewriter & particle canvas state)
     2. `AboutPhilosophyStatsSection.jsx` (encapsulates `useCountUp`, `AboutStatNumber`, and viewport observer)
     3. `AboutValuesSection.jsx` (encapsulates values, vision, and 4 IGSM pillars)
     4. `AboutTimelineSection.jsx` (encapsulates interactive milestone state & timeline navigation)
     5. `AboutProgramsSection.jsx` (encapsulates brand program cards and logos)
     6. `AboutCTASection.jsx` (encapsulates enterprise partnership banner and button)
     7. `AboutContactBannerSection.jsx` (encapsulates careers CTA and SVG arrow)
3. **Resulting `page.js` Impact**:
   - `src/app/ve-fai/page.js` shrinks from **1010 lines down to ~38 lines** (96.2% line reduction).
   - `page.js` acts solely as an orchestrator assembling the 7 atomic components and the global `Footer`.

---

## 3. Blueprint & Concrete Component Implementations

Below are the complete, ready-to-implement blueprints for all 7 atomic components and the clean `page.js`.

### 3.1. `src/components/ve-fai/AboutHeroSection.jsx`
```jsx
'use client';

import { useState, useEffect } from 'react';
import ParticleCanvas from '@/components/ParticleCanvas';

export default function AboutHeroSection() {
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  const fullText1 = "Viện đào tạo quốc tế FPT";
  const fullText2 = "FPT ACADEMY INTERNATIONAL";

  useEffect(() => {
    let active = true;
    let timer1 = null;
    let timer2 = null;
    const chars1 = Array.from(fullText1);
    const chars2 = Array.from(fullText2);
    let index1 = 0;
    let index2 = 0;

    const startTimeout = setTimeout(() => {
      if (!active) return;
      setShowParticles(true);

      timer1 = setInterval(() => {
        if (!active) return;
        if (index1 < chars1.length) {
          const charToType = chars1[index1];
          setText1(prev => prev + charToType);
          index1++;
        } else {
          clearInterval(timer1);
          setTimeout(() => {
            if (!active) return;
            timer2 = setInterval(() => {
              if (!active) return;
              if (index2 < chars2.length) {
                const charToType = chars2[index2];
                setText2(prev => prev + charToType);
                index2++;
              } else {
                clearInterval(timer2);
                setIsDone(true);
              }
            }, 35);
          }, 250);
        }
      }, 55);
    }, 400);

    return () => {
      active = false;
      clearTimeout(startTimeout);
      if (timer1) clearInterval(timer1);
      if (timer2) clearInterval(timer2);
    };
  }, []);

  return (
    <section 
      className="about-hero-section" 
      style={{ 
        padding: '160px 0 100px 0', 
        position: 'relative', 
        overflow: 'hidden',
        minHeight: '42vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: '#F9FAFB'
      }}
    >
      {/* Antigravity particles background */}
      {showParticles && (
        <div style={{ position: 'absolute', inset: 0, opacity: isDone ? 1 : 0.6, transition: 'opacity 2s ease' }}>
          <ParticleCanvas className="about-hero-particles" />
        </div>
      )}

      <div className="container" style={{ position: 'relative', zIndex: 1, minHeight: '140px' }}>
        <div style={{ maxWidth: '980px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 6vw, 4.6rem)', 
            color: '#0D2137', 
            lineHeight: '1.15', 
            fontWeight: 500, 
            fontFamily: 'var(--font-heading-medium)', 
            letterSpacing: '-0.02em',
            margin: 0,
            minHeight: '1.2em'
          }}>
            {text1}
            {text1.length > 0 && !text2 && (
              <span className="typewriter-cursor">|</span>
            )}
          </h1>
          {text1.length === fullText1.length && (
            <p style={{ 
              fontSize: 'clamp(1.4rem, 3.5vw, 2.4rem)', 
              color: '#f37021', 
              fontWeight: 800, 
              marginTop: '12px', 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              fontFamily: 'var(--font-sans)', 
              margin: 0,
              minHeight: '1.2em'
            }}>
              {text2}
              {text2.length > 0 && !isDone && (
                <span className="typewriter-cursor">|</span>
              )}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
```

### 3.2. `src/components/ve-fai/AboutPhilosophyStatsSection.jsx`
```jsx
'use client';

import { useState, useEffect, useRef } from 'react';
import ScrollTypewriter from '@/components/ScrollTypewriter';

function useCountUp(target, duration = 1800, started) {
  const [count, setCount] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    const tick = (now) => {
      const raw = Math.min((now - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - raw, 4);
      setCount(raw < 1 ? Math.round(ease * target) : target);
      if (raw < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [started, target, duration]);

  return count;
}

function AboutStatNumber({ target, suffix, isThousands, started, color = '#f37021' }) {
  const count = useCountUp(target, 1800, started);
  
  const formattedCount = isThousands 
    ? (count >= 1000 ? count.toLocaleString('vi-VN') : count)
    : count;

  return (
    <div style={{ 
      display: 'inline-flex', 
      alignItems: 'baseline', 
      gap: '4px', 
      fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
      color: color, 
      lineHeight: '1', 
      fontWeight: 800, 
      letterSpacing: '-0.03em' 
    }}>
      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 800, color: color }}>
        {formattedCount}
      </span>
      {suffix && (
        <span style={{ 
          fontSize: '0.55em', 
          fontWeight: 800, 
          color: color, 
          fontFamily: 'var(--font-sans)',
          lineHeight: '1'
        }}>
          {suffix}
        </span>
      )}
    </div>
  );
}

export default function AboutPhilosophyStatsSection() {
  const [statsStarted, setStatsStarted] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsStarted(true);
        }
      },
      { threshold: 0.15 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={statsRef}
      className="about-slogan-section" 
      style={{ 
        padding: '120px 0', 
        background: 'linear-gradient(135deg, #050c1a 0%, #0D2137 25%, #082240 50%, #0a1e35 75%, #050c1a 100%)',
        backgroundSize: '300% 300%',
        color: '#ffffff',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle dot overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '950px', marginBottom: '60px' }}>
          <h2 style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2rem)', fontWeight: 400, lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', fontFamily: 'var(--font-sans)' }}>
            Là đơn vị trực thuộc Tập đoàn FPT, FAI tự hào đồng hành cùng đất nước trong kỷ nguyên vươn mình, đưa thế hệ trẻ làm chủ các công nghệ cốt lõi, mỹ thuật số và truyền thông thực chiến thông qua các chương trình đào tạo chuyển giao quốc tế chuẩn mực nhất.
          </h2>
        </div>

        <div className="prosper-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '50px' }}>
          {/* Left Title */}
          <div style={{ gridColumn: 'span 4' }} className="prosper-title-col">
            <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', lineHeight: '1.3', fontFamily: 'var(--font-sans)' }}>
              <ScrollTypewriter text="Những con số biết nói" />
            </h3>
          </div>

          {/* Right Counters */}
          <div style={{ gridColumn: 'span 8' }} className="prosper-content-col">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px 60px' }}>
              <div>
                <AboutStatNumber target={27} suffix=" NĂM" started={statsStarted} />
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginTop: '15px' }}>
                  Đơn vị tiên phong liên kết đào tạo quốc tế của Tập đoàn FPT từ năm 1999, kiến tạo nguồn nhân lực chất lượng cao sẵn sàng làm việc toàn cầu.
                </p>
              </div>

              <div>
                <AboutStatNumber target={60000} isThousands={true} started={statsStarted} />
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginTop: '15px' }}>
                  Sinh viên đã lựa chọn
                </p>
              </div>

              <div>
                <AboutStatNumber target={98} suffix="%" color="var(--accent)" started={statsStarted} />
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginTop: '15px' }}>
                  Sinh viên có việc làm ngay sau khi tốt nghiệp
                </p>
              </div>

              <div>
                <AboutStatNumber target={1000} suffix="+" started={statsStarted} />
                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: '1.7', marginTop: '15px' }}>
                  Đối tác doanh nghiệp ký kết hợp tác phát triển nhân lực hằng năm.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 3.3. `src/components/ve-fai/AboutValuesSection.jsx`
```jsx
'use client';

import ScrollTypewriter from '@/components/ScrollTypewriter';

const fourPillars = [
  {
    letter: 'I',
    title: 'Industry Relevant',
    desc: 'Gắn liền với nhu cầu thực tiễn của doanh nghiệp và ngành công nghiệp'
  },
  {
    letter: 'G',
    title: 'Global',
    desc: 'Mang tính quốc tế, hội nhập và chuẩn mực đào tạo toàn cầu'
  },
  {
    letter: 'S',
    title: 'Smart Education',
    desc: 'Giáo dục thông minh dựa trên các công nghệ đào tạo tiên tiến nhất'
  },
  {
    letter: 'M',
    title: 'Mega',
    desc: 'Hệ thống giáo dục Mega quy mô rộng lớn, đa ngành và đa nền tảng'
  }
];

export default function AboutValuesSection() {
  return (
    <section 
      className="about-values-section" 
      style={{ 
        padding: '120px 0 140px 0', 
        backgroundColor: '#F8FAFC', 
        color: '#0f172a',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Main Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '860px', margin: '0 auto 72px auto' }}>
          <span style={{ color: '#f37021', fontWeight: 800, fontSize: '0.88rem', textTransform: 'uppercase', letterSpacing: '0.16em' }}>
            TỔ CHỨC GIÁO DỤC FPT
          </span>
          <h2 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 500, color: 'var(--secondary)', lineHeight: '1.2', marginTop: '14px', fontFamily: 'var(--font-heading-medium)', letterSpacing: '-0.02em' }}>
            <ScrollTypewriter text="Sứ Mệnh & Tầm Nhìn Chiến Lược" speed={12} />
          </h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', lineHeight: '1.8', marginTop: '16px' }}>
            Kim chỉ nam định hình chất lượng đào tạo, nuôi dưỡng khát vọng vươn tầm thế giới và phát triển bền vững cùng cộng đồng.
          </p>
        </div>

        {/* 3 Top Columns: Sứ mệnh, Triết lí, Văn hoá */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '48px',
            marginBottom: '80px'
          }}
        >
          {/* Sứ mệnh Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f37021', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                SỨ MỆNH
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f37021', marginBottom: '14px', fontFamily: 'var(--font-sans)' }}>
              Sứ mệnh FPT Education
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
              “Cung cấp năng lực cạnh tranh toàn cầu cho đông đảo người học, góp phần mở mang bờ cõi trí tuệ đất nước.”
            </p>
          </div>

          {/* Triết lí giáo dục Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f37021', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                TRIẾT LÍ GIÁO DỤC
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f37021', marginBottom: '14px', fontFamily: 'var(--font-sans)' }}>
              Triết lí giáo dục
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.8', margin: 0 }}>
              “Giáo dục đào tạo là tổ chức và quản trị việc tự học của người học.”
            </p>
          </div>

          {/* Văn hoá Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: '14px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f37021', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                VĂN HOÁ FPT
              </span>
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f37021', marginBottom: '14px', fontFamily: 'var(--font-sans)' }}>
              Văn hoá
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li style={{ fontSize: '0.96rem', color: '#475569', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f37021', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                <span><strong>Tôn đồng đổi chí gương sáng:</strong> (Tôn trọng, Đồng đội, Đổi mới, Chí công, Gương mẫu, Sáng tạo)</span>
              </li>
              <li style={{ fontSize: '0.96rem', color: '#475569', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f37021', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                <span><strong>Học thật, thi thật, thành công thật</strong></span>
              </li>
              <li style={{ fontSize: '0.96rem', color: '#475569', lineHeight: '1.6', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{ color: '#f37021', fontWeight: 800, fontSize: '1.1rem', lineHeight: 1 }}>•</span>
                <span><strong>Làm khác để làm tốt</strong></span>
              </li>
            </ul>
          </div>
        </div>

        {/* MINIMALIST FLAT VISION & 4 PILLARS */}
        <div 
          style={{ 
            paddingTop: '72px', 
            borderTop: '1px solid rgba(15, 23, 42, 0.08)',
            textAlign: 'center'
          }}
        >
          {/* Pure Editorial Vision Statement */}
          <div style={{ maxWidth: '960px', margin: '0 auto 64px auto' }}>
            <span style={{ 
              color: '#f37021', 
              fontWeight: 800, 
              fontSize: '0.85rem', 
              textTransform: 'uppercase', 
              letterSpacing: '0.16em',
              display: 'inline-block',
              marginBottom: '16px'
            }}>
              TẦM NHÌN FPT EDUCATION
            </span>
            <p style={{ 
              fontSize: 'clamp(1.5rem, 2.8vw, 2.15rem)', 
              fontWeight: 700, 
              color: 'var(--secondary)', 
              lineHeight: '1.5', 
              margin: 0,
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.02em'
            }}>
              “Trở thành một hệ thống giáo dục Mega mang tính quốc tế, đáp ứng nhu cầu của xã hội và dựa trên các công nghệ đào tạo tiên tiến nhất.”
            </p>
          </div>

          {/* 4 Flat Pillars Grid */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: '40px',
              textAlign: 'left'
            }}
          >
            {fourPillars.map((pillar, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f37021', lineHeight: 1, marginBottom: '14px', fontFamily: 'var(--font-sans)' }}>
                  {pillar.letter}
                </div>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f37021', margin: '0 0 10px 0', fontFamily: 'var(--font-sans)' }}>
                  {pillar.title}
                </h4>
                <p style={{ fontSize: '0.96rem', color: '#64748b', lineHeight: '1.65', margin: 0 }}>
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
```

### 3.4. `src/components/ve-fai/AboutTimelineSection.jsx`
```jsx
'use client';

import { useState } from 'react';
import ScrollTypewriter from '@/components/ScrollTypewriter';

const historyTimeline = [
  {
    year: '1999',
    subTitle: 'FPT Aptech',
    title: 'Thành lập FPT Aptech',
    desc: 'Là đơn vị sáng lập Aptech Việt Nam từ năm 1999, chương trình đào tạo Lập trình viên quốc tế FPT Aptech sở hữu 27 năm kinh nghiệm đào tạo theo chuẩn quốc tế, trở thành lựa chọn uy tín của người học và doanh nghiệp. Chương trình đào tạo tại FPT Aptech kết hợp giáo trình lập trình viên quốc tế ACCP Aptech với đào tạo thực tiễn tại doanh nghiệp FPT, giúp sinh viên vững chuyên môn, làm đúng nghề. FPT Aptech hiện là thành viên của mạng lưới hơn 3.200 trung tâm APTECH Worldwide tại 52 quốc gia.'
  },
  {
    year: '2004',
    subTitle: 'FPT Arena',
    title: 'Tiên phong khái niệm về Multimedia tại Việt Nam',
    desc: 'FPT Arena Multimedia là đơn vị tiên phong đưa và định hình khái niệm Multimedia – Mỹ thuật đa phương tiện tại Việt Nam. Trải qua hơn 22 năm phát triển, FPT Arena kế thừa văn hóa giáo dục của Tổ chức Giáo dục FPT và chuẩn đào tạo quốc tế của Tập đoàn Aptech (Ấn Độ), kiên định đào tạo gắn với thực tiễn, xây dựng đội ngũ giảng viên giàu kinh nghiệm và mạng lưới hợp tác quốc tế, góp phần hình thành thế hệ nhân lực sáng tạo cho ngành công nghiệp nội dung số Việt Nam.'
  },
  {
    year: '2018',
    subTitle: 'FPT Skillking',
    title: 'Bệ phóng Digital Marketing số toàn diện',
    desc: 'Chương trình đào tạo Digital Marketing FPT Skillking chính thức ra mắt vào năm 2018, là hệ thống đào tạo chuyên sâu về Digital Marketing đầu tiên tại Việt Nam, cung cấp chương trình Full-Stack Digital Marketing theo chuẩn quốc tế, góp phần đào tạo nguồn nhân lực chất lượng cao cho doanh nghiệp trong và ngoài nước.'
  },
  {
    year: '2025',
    subTitle: 'Vi mạch bán dẫn',
    title: 'Bước chân vào kỷ nguyên bán dẫn',
    desc: 'FAI tiếp tục khẳng định vai trò tiên phong khi mở rộng đào tạo Thiết kế vi mạch bán dẫn FPT Jetking, một trong những ngành công nghiệp lõi của kỷ nguyên công nghệ. Sự ra mắt chương trình đào tạo này không chỉ mở ra hướng đi mới mà còn đánh dấu bước tiến quan trọng trong chiến lược phát triển nhân lực bán dẫn tại Việt Nam.'
  },
  {
    year: '2025',
    subTitle: 'AI & Tự động hóa',
    title: 'Dẫn lối công nghệ mũi nhọn & tự động hóa',
    desc: 'Năm 2025, Chương trình AI Agent – FPT Jetking chính thức triển khai, kết hợp năng lực công nghệ của Tập đoàn FPT và kinh nghiệm đào tạo quốc tế của Tập đoàn Jetking (Ấn Độ), hướng tới đào tạo nhân lực làm chủ Trí tuệ Nhân tạo và tự động hóa trong kỷ nguyên số.'
  }
];

export default function AboutTimelineSection() {
  const [activeTimelineIdx, setActiveTimelineIdx] = useState(0);

  return (
    <section 
      className="about-history-section" 
      style={{ 
        padding: '100px 0 120px 0', 
        backgroundColor: '#070a10', 
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle tech grid background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: 'radial-gradient(rgba(232, 116, 30, 0.06) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px auto' }}>
          <span className="section-eyebrow" style={{ color: 'var(--primary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
            Hành trình phát triển
          </span>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', fontWeight: 500, color: '#ffffff', marginTop: '10px', fontFamily: 'var(--font-heading-medium)', letterSpacing: '-0.02em' }}>
            <ScrollTypewriter text="Những dấu ấn tiên phong" />
          </h2>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1.02rem', lineHeight: '1.75', marginTop: '15px' }}>
            Hơn 27 năm kiên định tiên phong đặt nền móng và định hình đào tạo công nghệ, mỹ thuật đa phương tiện &amp; kỹ năng thế hệ mới tại Việt Nam.
          </p>
        </div>

        {/* High-Tech Cyber Timeline Bar */}
        <div className="vinuni-timeline-axis-wrap" style={{ position: 'relative', margin: '40px 0 60px 0', padding: '10px 0' }}>
          {/* Horizontal Connecting Beam */}
          <div 
            style={{
              position: 'absolute',
              top: '32px',
              left: '60px',
              right: '60px',
              height: '3px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '3px',
              zIndex: 0
            }} 
          >
            {/* Active Orange Progress Line */}
            <div 
              style={{
                height: '100%',
                width: `${(activeTimelineIdx / (historyTimeline.length - 1)) * 100}%`,
                background: 'linear-gradient(90deg, var(--primary) 0%, #ff9e42 100%)',
                borderRadius: '3px',
                boxShadow: '0 0 12px var(--primary)',
                transition: 'width 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            />
          </div>

          {/* High-Tech Node Pills Container */}
          <div 
            className="vinuni-timeline-nodes-scroll"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              position: 'relative',
              zIndex: 1,
              overflowX: 'auto',
              padding: '10px 10px 15px 10px',
              gap: '12px',
              scrollbarWidth: 'none'
            }}
          >
            {historyTimeline.map((item, idx) => {
              const isActive = idx === activeTimelineIdx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTimelineIdx(idx)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flexShrink: 0,
                    outline: 'none',
                    width: '125px'
                  }}
                >
                  <div style={{ height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div 
                      style={{
                        padding: isActive ? '8px 18px' : '6px 14px',
                        borderRadius: '30px',
                        backgroundColor: isActive ? 'var(--primary)' : 'rgba(13, 29, 48, 0.95)',
                        border: isActive ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: isActive ? '0 0 25px rgba(232, 116, 30, 0.8), 0 0 40px rgba(232, 116, 30, 0.3)' : '0 4px 12px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                        backdropFilter: 'blur(8px)'
                      }}
                    >
                      <span 
                        style={{
                          width: isActive ? '7px' : '5px',
                          height: isActive ? '7px' : '5px',
                          borderRadius: '50%',
                          backgroundColor: isActive ? '#ffffff' : 'rgba(255,255,255,0.4)',
                          boxShadow: isActive ? '0 0 8px #ffffff' : 'none'
                        }} 
                      />
                      <span 
                        style={{
                          fontSize: isActive ? '0.9rem' : '0.82rem',
                          fontWeight: isActive ? 850 : 700,
                          color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                          whiteSpace: 'nowrap',
                          letterSpacing: '0.04em'
                        }}
                      >
                        {item.year}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Futuristic Glassmorphism Card */}
        <div 
          style={{
            backgroundColor: 'rgba(13, 29, 48, 0.65)',
            border: '1px solid rgba(232, 116, 30, 0.25)',
            borderRadius: '24px',
            padding: '45px',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4), 0 0 30px rgba(232, 116, 30, 0.05)',
            position: 'relative',
            transition: 'all 0.35s ease',
            minHeight: '280px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backdropFilter: 'blur(12px)'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ 
                  fontSize: '2rem', 
                  fontWeight: 900, 
                  color: 'var(--primary)', 
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.02em'
                }}>
                  Cột mốc {historyTimeline[activeTimelineIdx].year}
                </span>
                {historyTimeline[activeTimelineIdx].tag && (
                  <span style={{
                    backgroundColor: 'rgba(232, 116, 30, 0.15)',
                    color: 'var(--primary)',
                    border: '1px solid rgba(232, 116, 30, 0.3)',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    padding: '4px 14px',
                    borderRadius: '20px'
                  }}>
                    {historyTimeline[activeTimelineIdx].tag}
                  </span>
                )}
              </div>

              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.5)' }}>
                Cột mốc {activeTimelineIdx + 1} / {historyTimeline.length}
              </span>
            </div>

            <h3 style={{ 
              fontSize: 'clamp(1.3rem, 2.5vw, 1.75rem)', 
              fontWeight: 800, 
              color: '#ffffff', 
              marginBottom: '20px', 
              lineHeight: '1.4',
              fontFamily: 'var(--font-sans)',
              letterSpacing: '-0.01em'
            }}>
              {historyTimeline[activeTimelineIdx].title}
            </h3>

            <p style={{ 
              fontSize: '1.02rem', 
              color: 'rgba(255, 255, 255, 0.85)', 
              lineHeight: '1.85', 
              margin: 0,
              whiteSpace: 'pre-line'
            }}>
              {historyTimeline[activeTimelineIdx].desc}
            </p>
          </div>

          {/* Navigation Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '40px', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={() => setActiveTimelineIdx(prev => Math.max(0, prev - 1))}
              disabled={activeTimelineIdx === 0}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'none',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: activeTimelineIdx === 0 ? 'rgba(255, 255, 255, 0.25)' : '#ffffff',
                cursor: activeTimelineIdx === 0 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              ← Cột mốc trước
            </button>

            <button
              onClick={() => setActiveTimelineIdx(prev => Math.min(historyTimeline.length - 1, prev + 1))}
              disabled={activeTimelineIdx === historyTimeline.length - 1}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: activeTimelineIdx === historyTimeline.length - 1 ? 'rgba(255, 255, 255, 0.1)' : 'var(--primary)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: activeTimelineIdx === historyTimeline.length - 1 ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cột mốc tiếp theo →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### 3.5. `src/components/ve-fai/AboutProgramsSection.jsx`
```jsx
'use client';

import Image from 'next/image';
import ScrollTypewriter from '@/components/ScrollTypewriter';

const programsList = [
  {
    programName: <>Lập trình viên <br /> Quốc tế</>,
    color: '#f37021',
    logo: '/logo_aptech.png',
  },
  {
    programName: <>Thiết kế mỹ thuật <br /> đa phương tiện</>,
    color: '#ffb600',
    logo: '/logo_arena.png',
  },
  {
    programName: <>Digital Marketing</>,
    color: '#29a9e1',
    logo: '/logo_skillking.png',
    logoOffsetY: '-8px'
  },
  {
    isMulti: true,
    programs: ['Thiết kế vi mạch bán dẫn', 'Lập trình AI Agent'],
    color: '#ed232a',
    logo: '/logo_jetking.png',
  }
];

export default function AboutProgramsSection() {
  return (
    <section 
      className="about-programs-section" 
      style={{ 
        padding: '120px 0', 
        backgroundColor: '#ffffff', 
        color: '#1a2332',
        minHeight: '75vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div className="container">
        <div style={{ marginBottom: '50px', textAlign: 'center' }}>
          <span className="section-eyebrow" style={{ color: 'var(--primary)', fontWeight: 800 }}>MẠNG LƯỚI ĐÀO TẠO</span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 500, color: 'var(--secondary)', marginTop: '10px', fontFamily: 'var(--font-heading-medium)' }}>
            <ScrollTypewriter text="Các chương trình đào tạo" />
          </h2>
        </div>

        {/* 4 Program Cards (Centered Logo + Program Name) */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
            gap: '36px',
            alignItems: 'center' 
          }}
        >
          {programsList.map((prog, idx) => (
            <div 
              key={idx} 
              className="program-list-card"
              style={{ 
                background: 'transparent', 
                border: 'none', 
                borderRadius: '20px', 
                padding: '32px 20px', 
                boxShadow: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                transition: 'none',
                transform: 'none'
              }}
            >
              <div 
                style={{ 
                  height: '90px', 
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                  marginBottom: '24px',
                  position: 'relative'
                }}
              >
                <Image 
                  src={prog.logo} 
                  alt="Program Logo" 
                  width={300} 
                  height={90} 
                  style={{ 
                    objectFit: 'contain', 
                    objectPosition: 'center bottom', 
                    width: 'auto', 
                    height: '85px', 
                    maxWidth: '240px',
                    transform: prog.logoOffsetY ? 'translateY(' + prog.logoOffsetY + ')' : 'none'
                  }} 
                />
              </div>

              {prog.isMulti ? (
                <div style={{ textAlign: 'left', display: 'inline-flex', flexDirection: 'column', gap: '8px' }}>
                  {prog.programs.map((pName, pIdx) => (
                    <div key={pIdx} style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '8px', lineHeight: '1.4' }}>
                      <span style={{ color: '#f37021', fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>•</span>
                      <span>{pName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--secondary)', margin: 0, fontFamily: 'var(--font-sans)', lineHeight: '1.5' }}>
                  {prog.programName}
                </h3>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3.6. `src/components/ve-fai/AboutCTASection.jsx`
```jsx
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutCTASection() {
  return (
    <section 
      className="about-cta-section" 
      style={{ 
        padding: '100px 0', 
        background: 'linear-gradient(135deg, #e8741e 0%, #C9972C 100%)',
        color: '#ffffff',
        minHeight: '65vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Subtle decoration */}
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
        top: '-10%',
        right: '-10%',
        pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: '850px' }}>
          <span className="section-eyebrow" style={{ color: '#ffffff', opacity: 0.8, fontWeight: 800 }}>
            HỢP TÁC DOANH NGHIỆP
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', fontWeight: 500, color: '#ffffff', lineHeight: '1.3', marginTop: '15px', marginBottom: '40px', fontFamily: 'var(--font-heading-medium)' }}>
            FPT Academy International - Đối tác cung ứng nhân lực công nghệ số và sáng tạo uy tín hàng đầu của doanh nghiệp.
          </h2>
          <Link 
            href="/lien-he" 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '10px', 
              background: '#0D2137', 
              color: '#ffffff', 
              padding: '18px 40px', 
              borderRadius: '50px', 
              fontWeight: 700, 
              fontSize: '1rem',
              boxShadow: '0 10px 30px rgba(13,33,55,0.2)',
              transition: 'all 0.3s ease'
            }}
            className="about-cta-btn"
          >
            Hợp tác doanh nghiệp <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

### 3.7. `src/components/ve-fai/AboutContactBannerSection.jsx`
```jsx
import Link from 'next/link';

export default function AboutContactBannerSection() {
  return (
    <section 
      className="about-last-cta-section" 
      style={{ 
        padding: '80px 0', 
        backgroundColor: '#ffffff',
        color: '#0D2137',
        minHeight: '35vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <div className="container">
        <Link 
          href="/lien-he" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '30px 0',
            borderBottom: '2px solid var(--primary)',
            transition: 'all 0.3s ease',
            color: '#0D2137'
          }}
          className="about-join-link"
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, margin: 0, fontFamily: 'var(--font-sans)', color: '#0D2137' }}>
            Gia nhập FAI cùng chúng tôi
          </h2>
          <span style={{ color: 'var(--primary)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="45" viewBox="0 0 104.728 79.511">
              <g transform="translate(4.053 3.583)">
                <path d="M1,.528l87.979.946" transform="translate(0 35)" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="10"/>
                <path d="M0,0,37.165,36.172,0,72.345" transform="translate(56.34)" fill="none" stroke="currentColor" strokeLinecap="square" strokeMiterlimit="10" strokeWidth="10"/>
              </g>
            </svg>
          </span>
        </Link>
      </div>
    </section>
  );
}
```

### 3.8. Refactored `src/app/ve-fai/page.js` (Target: ~38 lines)
```jsx
'use client';

import AboutHeroSection from '@/components/ve-fai/AboutHeroSection';
import AboutPhilosophyStatsSection from '@/components/ve-fai/AboutPhilosophyStatsSection';
import AboutValuesSection from '@/components/ve-fai/AboutValuesSection';
import AboutTimelineSection from '@/components/ve-fai/AboutTimelineSection';
import AboutProgramsSection from '@/components/ve-fai/AboutProgramsSection';
import AboutCTASection from '@/components/ve-fai/AboutCTASection';
import AboutContactBannerSection from '@/components/ve-fai/AboutContactBannerSection';
import Footer from '@/components/Footer';

export default function VeFai() {
  return (
    <div className="about-page-container" style={{ backgroundColor: '#ffffff', color: '#1a2332' }}>
      <main className="sub-page-main" style={{ padding: 0 }}>
        {/* SECTION 1: Dynamic Typewriter Hero with Antigravity Particles */}
        <AboutHeroSection />

        {/* SECTION 2: FAI Philosophy & Animated Numbers */}
        <AboutPhilosophyStatsSection />

        {/* SECTION 3: Sứ Mệnh, Tầm Nhìn & Văn Hoá FPT Education */}
        <AboutValuesSection />

        {/* SECTION 4: High-Tech Cyber Timeline */}
        <AboutTimelineSection />

        {/* SECTION 5: Mạng lưới Chương trình Đào tạo */}
        <AboutProgramsSection />

        {/* SECTION 6: Hợp tác Doanh nghiệp CTA */}
        <AboutCTASection />

        {/* SECTION 7: Gia nhập FAI Banner */}
        <AboutContactBannerSection />
      </main>

      <Footer />
    </div>
  );
}
```

---

## 4. Caveats

1. **Read-Only Scope**: This report provides the research and complete component blueprints. No source files were modified or created in `src/`.
2. **Animation Continuity**:
   - The hero typewriter requires exact intervals (55ms and 35ms) to feel natural. The blueprint strictly maintains these constants.
   - Removing redundant state updates on mount fixes ESLint while retaining identical animation behavior.
3. **Responsive Timeline**:
   - `.vinuni-timeline-nodes-scroll` relies on `overflowX: 'auto'` and `scrollbarWidth: 'none'` for smooth horizontal mobile swiping. This styling is preserved intact.

---

## 5. Conclusion

1. `src/app/ve-fai/page.js` is currently a 1010-line monolithic component containing 7 distinct visual sections.
2. The decomposition into 7 atomic components under `src/components/ve-fai/` will reduce `page.js` to **~38 lines** (well below the 250-line ceiling).
3. The decomposition also fixes 2 pre-existing ESLint React 19 warnings and removes 8 unused Lucide icon imports.
4. The worker agent implementing Milestone 2 can use this handoff report as an exact, complete drop-in implementation plan.

---

## 6. Verification Method

To verify the investigation and test the subsequent implementation:

1. **Verify Line Counts & Current Status**:
   ```bash
   cd "/Users/vietmac/Documents/CODE/WEB- FAI/fai"
   wc -l src/app/ve-fai/page.js
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ve-fai
   # Returns 200
   ```

2. **Verify Static Assets**:
   ```bash
   ls -la public/logo_aptech.png public/logo_arena.png public/logo_skillking.png public/logo_jetking.png
   # All 4 logos confirmed present
   ```

3. **Post-Implementation Verification Commands**:
   ```bash
   # 1. Check line count of refactored page.js (< 250 lines)
   wc -l src/app/ve-fai/page.js
   
   # 2. Check ESLint for zero errors
   npx eslint src/app/ve-fai/page.js src/components/ve-fai/*.jsx
   
   # 3. Check Next.js build
   npm run build
   
   # 4. Check runtime status
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/ve-fai
   ```
