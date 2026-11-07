import React from 'react';

/**
 * GATHERLY Brand Logo Component
 * 
 * Recreates the approved Campus Fest pavilion symbol and wordmark:
 * - Symmetrical turquoise/emerald pavilion roof
 * - Golden flagpole & waving flag
 * - Three cream-coloured human figures (central lead + 2 companions)
 * - Two curved golden wings enclosing the community in a welcoming cradle
 * - Uppercase serif typography for the GATHERLY wordmark
 * 
 * Variants:
 * - 'primary' (default): Deep emerald rounded-square with subtle gold outline
 * - 'light': Warm cream rounded-square with emerald roof and figures
 * - 'monochrome': Dark background with pure white symbol
 * - 'symbol': Pavilion symbol alone (transparent background)
 * - 'wordmark': Full lockup with symbol, vertical divider, serif GATHERLY, and tagline
 */
export const BrandLogo = ({
  variant = 'primary',
  size = 36,
  showText = false,
  subtitle = 'Campus Portal',
  style = {},
  className = '',
}) => {
  // Standalone pavilion vector elements (viewBox: 0 0 512 512)
  const renderPavilionGroup = (roofLeft, roofRight, gold, people, idPrefix = 'bl') => (
    <g>
      <defs>
        <linearGradient id={`${idPrefix}-roof-l`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={roofLeft.start} />
          <stop offset="40%" stopColor={roofLeft.mid} />
          <stop offset="100%" stopColor={roofLeft.end} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-roof-r`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={roofRight.start} />
          <stop offset="45%" stopColor={roofRight.mid} />
          <stop offset="100%" stopColor={roofRight.end} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-gold`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={gold.start} />
          <stop offset="40%" stopColor={gold.mid} />
          <stop offset="100%" stopColor={gold.end} />
        </linearGradient>
        <linearGradient id={`${idPrefix}-people`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={people.start} />
          <stop offset="100%" stopColor={people.end} />
        </linearGradient>
      </defs>

      {/* Flagpole */}
      <line x1="256" y1="120" x2="256" y2="74" stroke={`url(#${idPrefix}-gold)`} strokeWidth="5" strokeLinecap="round" />

      {/* Golden Flag */}
      <path
        d="M 256 78 C 285 70, 314 84, 338 86 C 334 98, 335 110, 328 120 C 300 116, 276 100, 256 112 Z"
        fill={`url(#${idPrefix}-gold)`}
      />

      {/* Pavilion Roof Left Half */}
      <path
        d="M 256 122 C 192 144, 116 186, 44 232 C 100 244, 185 236, 256 215 Z"
        fill={`url(#${idPrefix}-roof-l)`}
      />

      {/* Pavilion Roof Right Half */}
      <path
        d="M 256 122 C 320 144, 396 186, 468 232 C 412 244, 327 236, 256 215 Z"
        fill={`url(#${idPrefix}-roof-r)`}
      />

      {/* Left Golden Curved Side Wing / Cradle */}
      <path
        d="M 52 234 C 46 295, 78 376, 238 396 C 194 390, 108 362, 88 300 C 78 268, 78 244, 88 234 Z"
        fill={`url(#${idPrefix}-gold)`}
      />

      {/* Right Golden Curved Side Wing / Cradle */}
      <path
        d="M 460 234 C 466 295, 434 376, 274 396 C 318 390, 404 362, 424 300 C 434 268, 434 244, 424 234 Z"
        fill={`url(#${idPrefix}-gold)`}
      />

      {/* Center Person */}
      <circle cx="256" cy="265" r="32" fill={`url(#${idPrefix}-people)`} />
      <path
        d="M 216 384 C 216 308, 296 308, 296 384 C 296 390, 216 390, 216 384 Z"
        fill={`url(#${idPrefix}-people)`}
      />

      {/* Left Person */}
      <circle cx="178" cy="292" r="23" fill={`url(#${idPrefix}-people)`} />
      <path
        d="M 148 382 C 148 326, 206 326, 206 382 C 206 386, 148 386, 148 382 Z"
        fill={`url(#${idPrefix}-people)`}
      />

      {/* Right Person */}
      <circle cx="334" cy="292" r="23" fill={`url(#${idPrefix}-people)`} />
      <path
        d="M 306 382 C 306 326, 364 326, 364 382 C 364 386, 306 386, 306 382 Z"
        fill={`url(#${idPrefix}-people)`}
      />
    </g>
  );

  // Palettes per variant
  const themes = {
    primary: {
      bg: { start: '#043128', mid: '#02241D', end: '#011410' },
      border: '#EED58D',
      borderOpacity: 0.65,
      roofL: { start: '#3EE7C6', mid: '#24CDAB', end: '#129983' },
      roofR: { start: '#16A590', mid: '#0F7A69', end: '#075044' },
      gold: { start: '#FDDC72', mid: '#F5BD38', end: '#D69117' },
      people: { start: '#FFF9EE', end: '#F6E7CF' },
    },
    light: {
      bg: { start: '#FCF8F2', mid: '#F7EFE2', end: '#F1E4D0' },
      border: '#D9C2A0',
      borderOpacity: 0.5,
      roofL: { start: '#149A84', mid: '#0E7E6C', end: '#095C4F' },
      roofR: { start: '#0B6657', mid: '#074D41', end: '#04362E' },
      gold: { start: '#F5C442', mid: '#E2A622', end: '#C07C0A' },
      people: { start: '#0D6B5D', end: '#07473D' },
    },
    monochrome: {
      bg: { start: '#141414', mid: '#111313', end: '#0A0A0A' },
      border: '#333333',
      borderOpacity: 0.6,
      roofL: { start: '#FFFFFF', mid: '#FFFFFF', end: '#FFFFFF' },
      roofR: { start: '#E6E6E6', mid: '#E6E6E6', end: '#E6E6E6' },
      gold: { start: '#FFFFFF', mid: '#FFFFFF', end: '#FFFFFF' },
      people: { start: '#FFFFFF', end: '#FFFFFF' },
    },
  };

  const currentTheme = themes[variant] || themes.primary;

  // Variant: Standalone Wordmark SVG Lockup
  if (variant === 'wordmark') {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px', ...style }} className={className}>
        <svg
          viewBox="0 0 512 512"
          width={size}
          height={size}
          style={{ flexShrink: 0, display: 'block' }}
          role="img"
          aria-label="GATHERLY Pavilion Symbol"
        >
          {renderPavilionGroup(
            currentTheme.roofL,
            currentTheme.roofR,
            currentTheme.gold,
            currentTheme.people,
            'bl-wm'
          )}
        </svg>
        <div style={{ width: '1px', height: `${Math.round(size * 0.7)}px`, background: 'var(--accent-primary)', opacity: 0.35 }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontFamily: "Cinzel, 'Playfair Display', Georgia, serif",
              fontSize: `${Math.max(16, Math.round(size * 0.45))}px`,
              fontWeight: '700',
              letterSpacing: '0.12em',
              lineHeight: 1,
              color: 'var(--text-primary)',
            }}
          >
            GATHERLY
          </span>
          <span
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: `${Math.max(9, Math.round(size * 0.18))}px`,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: 'var(--accent-primary)',
              fontWeight: '600',
              marginTop: '4px',
            }}
          >
            — Campus Event &amp; Community Platform —
          </span>
        </div>
      </div>
    );
  }

  // Variant: Standalone Symbol (no squircle box)
  if (variant === 'symbol') {
    return (
      <svg
        viewBox="0 0 512 512"
        width={size}
        height={size}
        style={{ flexShrink: 0, display: 'block', ...style }}
        className={className}
        role="img"
        aria-label="GATHERLY Icon"
      >
        {renderPavilionGroup(
          currentTheme.roofL,
          currentTheme.roofR,
          currentTheme.gold,
          currentTheme.people,
          `bl-sym-${variant}`
        )}
      </svg>
    );
  }

  // Default: Primary / Light / Monochrome App Icon in Squircle Base
  const iconGraphic = (
    <svg
      viewBox="0 0 512 512"
      width={size}
      height={size}
      style={{ flexShrink: 0, display: 'block', ...style }}
      className={className}
      role="img"
      aria-label="GATHERLY App Icon"
    >
      <defs>
        <linearGradient id={`bl-box-bg-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={currentTheme.bg.start} />
          <stop offset="50%" stopColor={currentTheme.bg.mid} />
          <stop offset="100%" stopColor={currentTheme.bg.end} />
        </linearGradient>
      </defs>

      {/* Squircle App Icon Base */}
      <rect
        x="20"
        y="20"
        width="472"
        height="472"
        rx="116"
        fill={`url(#bl-box-bg-${variant})`}
        stroke={currentTheme.border}
        strokeWidth="2.5"
        strokeOpacity={currentTheme.borderOpacity}
      />

      {renderPavilionGroup(
        currentTheme.roofL,
        currentTheme.roofR,
        currentTheme.gold,
        currentTheme.people,
        `bl-app-${variant}`
      )}
    </svg>
  );

  if (!showText) {
    return iconGraphic;
  }

  // Combined Icon + Wordmark text (used in Navbar & Footer)
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }} className={className}>
      {iconGraphic}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: "Cinzel, 'Playfair Display', Georgia, serif",
            fontSize: '1.25rem',
            fontWeight: '700',
            letterSpacing: '0.06em',
            lineHeight: 1,
            color: 'var(--text-primary)',
          }}
        >
          GATHERLY
        </span>
        {subtitle && (
          <span
            style={{
              fontSize: '0.62rem',
              color: 'var(--accent-primary)',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              fontWeight: '700',
              fontFamily: 'var(--font-mono)',
              marginTop: '3px',
            }}
          >
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
