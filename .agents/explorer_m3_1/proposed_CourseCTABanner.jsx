'use client';

import TechCTAButton from '@/components/TechCTAButton';

export default function CourseCTABanner({
  themeColor = '#f37021',
  title,
  desc,
  buttonText = 'Tư vấn ngay',
  buttonHref
}) {
  if (!title) return null;

  return (
    <section className="beau-cta-section">
      <div className="beau-cta-bg-circle"></div>
      <div className="container beau-cta-inner" data-reveal>
        <h2 className="beau-cta-title">{title}</h2>
        {desc && (
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.1rem',
              maxWidth: '680px',
              margin: '14px auto 32px',
              lineHeight: '1.7'
            }}
          >
            {desc}
          </p>
        )}
        <TechCTAButton
          text={buttonText}
          href={buttonHref}
          style={{ background: themeColor }}
        />
      </div>
    </section>
  );
}
