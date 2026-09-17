'use client';

import Image from 'next/image';
import ParticleCanvas from '@/components/ParticleCanvas';

export default function CourseHero({
  themeColor = '#f37021',
  badgeTextColor = '#ffffff',
  bgWatermark,
  brandBadge,
  brandBadgeStyle = {},
  title,
  subtitle,
  heroLogo,
  description,
  heroCallout,
  heroStats,
  bannerImage,
  bannerAlt
}) {
  return (
    <section className="beau-hero">
      <ParticleCanvas className="beau-hero-particles" />
      {bgWatermark && <div className="beau-hero-bg-text">{bgWatermark}</div>}

      <div className="container beau-hero-inner" data-reveal>
        {brandBadge && (
          <span
            className="beau-hero-brand"
            style={{
              backgroundColor: themeColor,
              color: badgeTextColor,
              fontWeight: 800,
              letterSpacing: '0.08em',
              padding: '8px 20px',
              borderRadius: '30px',
              display: 'inline-block',
              ...brandBadgeStyle
            }}
          >
            {brandBadge}
          </span>
        )}

        {title && (
          <h1
            className="beau-hero-title"
            style={{
              marginTop: '16px',
              fontSize: 'clamp(2rem, 4vw, 3.2rem)',
              lineHeight: '1.25',
              textWrap: 'balance'
            }}
          >
            {title}
          </h1>
        )}

        {subtitle && (
          <div
            style={{
              color: themeColor,
              fontSize: '1.25rem',
              fontWeight: 800,
              marginTop: '8px',
              letterSpacing: '0.04em'
            }}
          >
            {subtitle}
          </div>
        )}

        {heroLogo && (
          <div
            className="beau-hero-logo"
            style={{
              marginTop: '18px',
              marginBottom: '26px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Image
              src={heroLogo}
              alt="Brand Logo"
              width={220}
              height={64}
              style={{ objectFit: 'contain', objectPosition: 'left', width: 'auto', height: '56px' }}
              priority
            />
          </div>
        )}

        {description && (
          <div
            className="beau-hero-desc"
            style={{
              maxWidth: '900px',
              marginTop: '22px',
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: '1.05rem',
              lineHeight: '1.75'
            }}
          >
            {Array.isArray(description) ? (
              description.map((p, idx) => (
                <p key={idx} style={{ marginBottom: idx < description.length - 1 ? '16px' : 0 }}>
                  {p}
                </p>
              ))
            ) : typeof description === 'string' ? (
              <p>{description}</p>
            ) : (
              description
            )}
          </div>
        )}

        {/* Optional Hero Callout Highlight Card */}
        {heroCallout && (
          <div
            style={{
              marginTop: '44px',
              marginBottom: '44px',
              padding: '36px 44px',
              background: `linear-gradient(135deg, ${themeColor}2e 0%, rgba(13, 33, 55, 0.82) 40%, rgba(22, 43, 74, 0.9) 100%)`,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: `1px solid ${themeColor}59`,
              borderLeft: `6px solid ${themeColor}`,
              borderRadius: '24px',
              maxWidth: '1050px',
              boxShadow: `0 20px 50px rgba(0, 0, 0, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.2), 0 0 32px ${themeColor}1f`,
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {heroCallout.tag && (
              <div
                style={{
                  display: 'inline-block',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: `${themeColor}33`,
                  border: `1px solid ${themeColor}66`,
                  color: themeColor,
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.08em',
                  marginBottom: '14px',
                  textTransform: 'uppercase'
                }}
              >
                {heroCallout.tag}
              </div>
            )}
            <p
              style={{
                margin: 0,
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '1.15rem',
                lineHeight: '1.8',
                fontWeight: 400
              }}
            >
              {heroCallout.text || heroCallout.content || heroCallout}
            </p>
          </div>
        )}

        {/* Optional Hero Stats Bar */}
        {heroStats && heroStats.length > 0 && (
          <div className="beau-stats-bar">
            {heroStats.map((stat, idx) => (
              <div key={idx} className="beau-stat-item">
                <h3 style={{ color: stat.color || themeColor }}>
                  {stat.value || stat.title}
                </h3>
                <p>{stat.label || stat.desc}</p>
              </div>
            ))}
          </div>
        )}

        {/* Banner Image */}
        {bannerImage && (
          <div className="beau-hero-banner" style={{ marginTop: '36px' }}>
            <Image
              src={bannerImage}
              alt={bannerAlt || (typeof title === 'string' ? title : 'Course Banner')}
              width={1200}
              height={420}
              priority
              style={{ borderRadius: '16px', objectFit: 'cover' }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
