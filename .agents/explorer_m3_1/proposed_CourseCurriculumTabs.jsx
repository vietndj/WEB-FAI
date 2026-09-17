'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';

export default function CourseCurriculumTabs({
  themeColor = '#f37021',
  eyebrow = 'NỘI DUNG ĐÀO TẠO',
  title,
  desc,
  semesters = []
}) {
  const [activeTab, setActiveTab] = useState(0);

  if (!semesters || semesters.length === 0) return null;

  return (
    <section className="beau-section" style={{ padding: '100px 0 110px 0' }}>
      <div className="container" data-reveal>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          {eyebrow && (
            <span className="beau-section-eyebrow" style={{ color: themeColor }}>
              {eyebrow}
            </span>
          )}
          <h2 className="beau-section-title">
            {title || `Chi tiết chương trình học (${semesters.length} học kỳ)`}
          </h2>
          {desc && (
            <p style={{ color: 'rgba(255, 255, 255, 0.75)', maxWidth: '720px', margin: '12px auto 0', fontSize: '1.05rem', lineHeight: '1.7' }}>
              {desc}
            </p>
          )}
        </div>

        {/* Segmented Semester Tabs Switcher */}
        <div
          style={{
            position: 'sticky',
            top: '80px',
            zIndex: 90,
            padding: '12px 0',
            marginBottom: '36px',
            maxWidth: semesters.length <= 2 ? '800px' : '1100px',
            margin: '0 auto 36px'
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(auto-fit, minmax(${semesters.length <= 2 ? '260px' : '210px'}, 1fr))`,
              gap: '14px'
            }}
          >
            {semesters.map((sem, idx) => {
              const isActive = activeTab === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setActiveTab(idx)}
                  type="button"
                  style={{
                    padding: '14px 18px',
                    borderRadius: '16px',
                    border: isActive ? `1px solid ${themeColor}` : '1px solid rgba(255, 255, 255, 0.12)',
                    background: isActive
                      ? `linear-gradient(135deg, ${themeColor} 0%, rgba(13, 33, 55, 0.95) 100%)`
                      : 'rgba(13, 33, 55, 0.75)',
                    color: '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    textAlign: 'left',
                    boxShadow: isActive ? `0 10px 28px ${themeColor}66` : '0 4px 15px rgba(0,0,0,0.2)',
                    backdropFilter: 'blur(12px)',
                    WebkitBackdropFilter: 'blur(12px)'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 900,
                      color: isActive ? '#ffffff' : themeColor,
                      background: isActive ? 'rgba(0, 0, 0, 0.3)' : `${themeColor}26`,
                      padding: '4px 9px',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}
                  >
                    {sem.num}
                  </span>
                  <span
                    style={{
                      fontSize: '0.92rem',
                      fontWeight: isActive ? 800 : 600,
                      lineHeight: '1.3',
                      color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.85)'
                    }}
                  >
                    {sem.shortTitle}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Tab Detailed Content Card */}
        {semesters[activeTab] && (
          <div
            style={{
              background: 'linear-gradient(135deg, rgba(13, 33, 55, 0.88) 0%, rgba(22, 43, 74, 0.92) 100%)',
              border: `1px solid ${themeColor}4d`,
              borderRadius: '24px',
              padding: '40px 44px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              maxWidth: '1100px',
              margin: '0 auto'
            }}
          >
            <div style={{ marginBottom: '24px' }}>
              <span
                style={{
                  fontSize: '0.85rem',
                  color: themeColor,
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em'
                }}
              >
                {semesters[activeTab].num}
              </span>
              <h3
                style={{
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  margin: '6px 0 4px',
                  fontFamily: 'var(--font-sans)'
                }}
              >
                {semesters[activeTab].fullTitle || semesters[activeTab].title}
              </h3>
              {(semesters[activeTab].subTitle || semesters[activeTab].subtitle) && (
                <h4 style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.7)', fontWeight: 500, margin: 0 }}>
                  ({semesters[activeTab].subTitle || semesters[activeTab].subtitle})
                </h4>
              )}
            </div>

            {semesters[activeTab].desc && (
              <p
                style={{
                  color: 'rgba(255,255,255,0.88)',
                  fontSize: '1.05rem',
                  lineHeight: '1.75',
                  marginBottom: '36px',
                  paddingBottom: '24px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                {semesters[activeTab].desc}
              </p>
            )}

            {/* Optional Detailed Subjects Grid */}
            {semesters[activeTab].subjects && semesters[activeTab].subjects.length > 0 && (
              <div
                style={{
                  marginBottom: '36px',
                  paddingBottom: '28px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <h4
                  style={{
                    fontSize: '1rem',
                    color: themeColor,
                    fontWeight: 800,
                    margin: '0 0 20px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase'
                  }}
                >
                  Danh sách các môn học chi tiết:
                </h4>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '14px'
                  }}
                >
                  {semesters[activeTab].subjects.map((sub, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        background: 'rgba(255,255,255,0.03)',
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.06)'
                      }}
                    >
                      <Check size={18} style={{ color: themeColor, flexShrink: 0, marginTop: '2px' }} />
                      <span style={{ color: '#ffffff', fontSize: '0.94rem', fontWeight: 500 }}>{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 2 to 3 Columns Grid: Core Stack, AI Tools, Careers */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '36px'
              }}
            >
              {/* Column 1: Core Stack */}
              {semesters[activeTab].coreStack && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      color: themeColor,
                      fontWeight: 800,
                      margin: '0 0 16px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {semesters[activeTab].columnTitles?.col1 || 'Công nghệ lõi (Core Stack)'}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {semesters[activeTab].coreStack.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          color: 'rgba(255,255,255,0.95)',
                          fontSize: '0.96rem',
                          lineHeight: '1.5'
                        }}
                      >
                        <Check size={16} style={{ color: themeColor, flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Column 2: AI & Support Tools (Optional) */}
              {semesters[activeTab].aiTools && semesters[activeTab].aiTools.length > 0 && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      color: themeColor,
                      fontWeight: 800,
                      margin: '0 0 16px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {semesters[activeTab].columnTitles?.col2 || 'Công cụ AI & Hỗ trợ'}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {semesters[activeTab].aiTools.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          color: 'rgba(255,255,255,0.95)',
                          fontSize: '0.96rem',
                          lineHeight: '1.5'
                        }}
                      >
                        <Check size={16} style={{ color: themeColor, flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Column 3: Career Opportunities */}
              {semesters[activeTab].careers && (
                <div>
                  <h4
                    style={{
                      fontSize: '0.95rem',
                      color: themeColor,
                      fontWeight: 800,
                      margin: '0 0 16px',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase'
                    }}
                  >
                    {semesters[activeTab].columnTitles?.col3 || 'Cơ hội nghề nghiệp'}
                  </h4>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {semesters[activeTab].careers.map((item, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '10px',
                          color: 'rgba(255,255,255,0.95)',
                          fontSize: '0.96rem',
                          lineHeight: '1.5'
                        }}
                      >
                        <Check size={16} style={{ color: themeColor, flexShrink: 0, marginTop: '3px' }} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
