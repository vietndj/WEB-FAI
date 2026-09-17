'use client';

import { BookOpen, Clock, Trophy, Briefcase } from 'lucide-react';

export default function CourseOverviewStats({
  themeColor = '#f37021',
  eyebrow = 'HÀNH TRÌNH TỔNG QUAN',
  title,
  desc,
  cards,
  durationBanner
}) {
  const defaultIcons = [
    <BookOpen key="1" size={34} style={{ color: themeColor, marginBottom: '14px' }} />,
    <Clock key="2" size={34} style={{ color: themeColor, marginBottom: '14px' }} />,
    <Trophy key="3" size={34} style={{ color: themeColor, marginBottom: '14px' }} />,
    <Briefcase key="4" size={34} style={{ color: themeColor, marginBottom: '14px' }} />
  ];

  return (
    <section
      className="beau-section"
      style={{
        backgroundColor: '#F8FAFC',
        color: '#0f172a',
        padding: '100px 0 110px 0',
        borderTop: 'none'
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
                  letterSpacing: '0.12em',
                  fontSize: '0.85rem'
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
                  maxWidth: '750px',
                  margin: '14px auto 0',
                  fontSize: '1.05rem',
                  lineHeight: '1.7',
                  textWrap: 'balance'
                }}
              >
                {desc}
              </p>
            )}
          </div>
        )}

        {/* Overview Stats Cards Grid */}
        {cards && cards.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px'
            }}
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: '20px',
                  padding: '32px 24px',
                  textAlign: 'center',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
                  transition: 'all 0.3s ease'
                }}
              >
                {card.icon ? (
                  <div style={{ display: 'inline-flex', marginBottom: '14px', color: themeColor }}>
                    {card.icon}
                  </div>
                ) : (
                  defaultIcons[idx % defaultIcons.length]
                )}
                <h3
                  style={{
                    fontSize: '2.5rem',
                    fontWeight: 900,
                    color: 'var(--secondary)',
                    margin: 0,
                    lineHeight: 1
                  }}
                >
                  {card.value}
                </h3>
                <p
                  style={{
                    color: '#64748b',
                    fontSize: '0.96rem',
                    marginTop: '10px',
                    margin: '10px 0 0',
                    fontWeight: 600
                  }}
                >
                  {card.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Total Duration Breakdown Banner */}
        {durationBanner && (
          <div
            style={{
              marginTop: '36px',
              background: '#ffffff',
              border: `1px solid ${themeColor}40`,
              borderLeft: `6px solid ${themeColor}`,
              borderRadius: '20px',
              padding: '32px 40px',
              boxShadow: '0 12px 35px rgba(0, 0, 0, 0.03)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '24px'
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '0.82rem',
                  color: themeColor,
                  fontWeight: 900,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {durationBanner.title || 'Tổng thời lượng đào tạo'}
              </span>
              <h4
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 800,
                  color: 'var(--secondary)',
                  margin: '6px 0 0',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {durationBanner.totalHours}
              </h4>
            </div>

            {durationBanner.breakdown && durationBanner.breakdown.length > 0 && (
              <div style={{ display: 'flex', gap: '36px', flexWrap: 'wrap' }}>
                {durationBanner.breakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={idx > 0 ? { borderLeft: '1px solid rgba(0,0,0,0.08)', paddingLeft: '36px' } : {}}
                  >
                    <span
                      style={{
                        color: '#64748b',
                        fontSize: '0.88rem',
                        display: 'block',
                        fontWeight: 600
                      }}
                    >
                      {item.label}
                    </span>
                    <strong
                      style={{
                        color: item.highlight ? themeColor : 'var(--secondary)',
                        fontSize: '1.3rem',
                        fontWeight: 800
                      }}
                    >
                      {item.hours}
                    </strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
