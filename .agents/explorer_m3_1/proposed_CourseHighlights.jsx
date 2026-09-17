'use client';

export default function CourseHighlights({
  themeColor = '#f37021',
  eyebrow = 'ĐẶC QUYỀN ĐÀO TẠO',
  title,
  desc,
  highlights = []
}) {
  if (!highlights || highlights.length === 0) return null;

  return (
    <section
      className="beau-section"
      style={{
        backgroundColor: '#F8FAFC',
        color: '#0f172a',
        padding: '100px 0 120px 0'
      }}
    >
      <div className="container" data-reveal>
        {(eyebrow || title || desc) && (
          <div style={{ textAlign: 'center', marginBottom: '54px' }}>
            {eyebrow && (
              <span
                className="beau-section-eyebrow"
                style={{
                  color: themeColor,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em'
                }}
              >
                {eyebrow}
              </span>
            )}
            {title && (
              <h2
                style={{
                  fontSize: 'clamp(2rem, 3.8vw, 2.8rem)',
                  fontWeight: 800,
                  color: 'var(--secondary)',
                  lineHeight: '1.25',
                  marginTop: '10px',
                  fontFamily: 'var(--font-sans)',
                  letterSpacing: '-0.02em',
                  textWrap: 'balance'
                }}
              >
                {title}
              </h2>
            )}
            {desc && (
              <p
                style={{
                  color: '#64748b',
                  maxWidth: '850px',
                  margin: '16px auto 0',
                  fontSize: '1.05rem',
                  lineHeight: '1.75',
                  textWrap: 'balance'
                }}
              >
                {desc}
              </p>
            )}
          </div>
        )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '28px'
          }}
        >
          {highlights.map((item, idx) => (
            <div
              key={idx}
              style={{
                background: '#ffffff',
                border: '1px solid rgba(0, 0, 0, 0.06)',
                borderRadius: '20px',
                padding: '36px 30px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.02)',
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {item.icon && (
                <div style={{ marginBottom: '18px', color: themeColor }}>
                  {item.icon}
                </div>
              )}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: 'var(--secondary)',
                  marginBottom: '12px',
                  fontFamily: 'var(--font-sans)',
                  textWrap: 'balance'
                }}
              >
                {item.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.96rem', lineHeight: '1.7', margin: 0 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
