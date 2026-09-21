import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: number;
  alt?: string;
  showText?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 40,
  alt = 'Nabiul Islam Logo',
  showText = true,
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden transition-transform duration-200 ${className}`}
      style={{ width: size, height: size }}
      title={alt}
    >
      <svg
        viewBox="0 0 512 512"
        width="100%"
        height="100%"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full select-none"
      >
        <defs>
          {/* Background Circle Radial Gradient */}
          <radialGradient id="compNavyBadgeGrad" cx="50%" cy="40%" r="52%">
            <stop offset="0%" stopColor="#142444" />
            <stop offset="35%" stopColor="#0E1930" />
            <stop offset="70%" stopColor="#080F1E" />
            <stop offset="100%" stopColor="#040812" />
          </radialGradient>

          {/* Subtle Edge Outer Ring Gradient */}
          <linearGradient id="compEdgeRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#142442" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#0A1426" stopOpacity="0.7" />
          </linearGradient>

          {/* Left Pillar Silver-White Gradient */}
          <linearGradient id="compLeftStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="50%" stopColor="#F3F6FA" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Center Diagonal Metallic Gradient */}
          <linearGradient id="compDiagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F8FAFC" />
            <stop offset="70%" stopColor="#E2E8F0" />
            <stop offset="100%" stopColor="#94A3B8" />
          </linearGradient>

          {/* Electric Cyan-Blue Accent Gradient (Top Right) */}
          <linearGradient id="compCyanAccentGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0062FF" />
            <stop offset="40%" stopColor="#0091FF" />
            <stop offset="80%" stopColor="#00D2FF" />
            <stop offset="100%" stopColor="#38BDF8" />
          </linearGradient>

          {/* Lower Right White Pillar Gradient */}
          <linearGradient id="compRightStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="60%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>

          {/* Shadow Filter */}
          <filter id="compShadowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.7" />
          </filter>

          {/* Soft Cyan Glow */}
          <filter id="compCyanGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#00D2FF" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* Circular Navy Emblem Background */}
        <circle
          cx="256"
          cy="256"
          r="242"
          fill="url(#compNavyBadgeGrad)"
          stroke="url(#compEdgeRingGrad)"
          strokeWidth="3.5"
        />

        {/* Monogram N Shape Group */}
        <g filter="url(#compShadowFilter)">
          {/* LEFT VERTICAL STEM */}
          <path
            d="M 158 155
               L 158 357
               L 190 357
               L 190 224
               Z"
            fill="url(#compLeftStemGrad)"
          />

          {/* DIAGONAL CONNECTOR */}
          <path
            d="M 158 155
               L 190 155
               L 322 330
               L 322 357
               L 289 357
               L 158 185
               Z"
            fill="url(#compDiagGrad)"
          />

          {/* ELECTRIC BLUE TOP-RIGHT ACCENT PARALLELOGRAM */}
          <path
            d="M 296 208
               L 354 145
               L 354 180
               L 296 242
               Z"
            fill="url(#compCyanAccentGrad)"
            filter="url(#compCyanGlow)"
          />

          {/* RIGHT LOWER WHITE PILLAR */}
          <path
            d="M 296 252
               L 354 190
               L 354 357
               L 322 357
               L 322 305
               L 296 334
               Z"
            fill="url(#compRightStemGrad)"
          />
        </g>

        {showText && (
          <text
            x="256"
            y="405"
            fontFamily="system-ui, -apple-system, 'Plus Jakarta Sans', sans-serif"
            fontSize="22"
            fontWeight="700"
            fill="#FFFFFF"
            letterSpacing="5.5"
            textAnchor="middle"
          >
            NABIUL ISLAM
          </text>
        )}
      </svg>
    </div>
  );
};
