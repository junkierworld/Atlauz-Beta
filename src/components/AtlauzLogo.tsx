import React from 'react';

export type AtlauzLogoVariant = 'wordmark' | 'icon' | 'horizontal-fish' | 'vertical' | 'badge';

interface AtlauzLogoProps {
  variant?: AtlauzLogoVariant;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | number;
  animated?: boolean;
  className?: string;
  glow?: boolean;
  eyeColor?: string;
  textColor?: string;
}

export const AtlauzLogo: React.FC<AtlauzLogoProps> = ({
  variant = 'wordmark',
  size = 'md',
  animated = true,
  className = '',
  eyeColor = '#ffffff',
  textColor = '#ffffff'
}) => {
  // Dimension resolver
  const getDimensions = () => {
    if (typeof size === 'number') {
      return { width: size * (variant === 'wordmark' ? 3.6 : variant === 'vertical' ? 1 : 1.2), height: size };
    }
    switch (size) {
      case 'xs':
        return variant === 'wordmark' ? { width: 84, height: 22 } : { width: 22, height: 22 };
      case 'sm':
        return variant === 'wordmark' ? { width: 110, height: 28 } : { width: 28, height: 28 };
      case 'lg':
        return variant === 'wordmark' ? { width: 180, height: 46 } : { width: 48, height: 48 };
      case 'xl':
        return variant === 'wordmark' ? { width: 240, height: 60 } : { width: 64, height: 64 };
      case 'md':
      default:
        return variant === 'wordmark' ? { width: 140, height: 36 } : { width: 36, height: 36 };
    }
  };

  const dims = getDimensions();

  // 1. STANDALONE ICON: Signature chevron fish-mark with white dot `<•`
  if (variant === 'icon' || variant === 'horizontal-fish') {
    return (
      <svg
        width={dims.width}
        height={dims.height}
        viewBox="0 0 100 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`shrink-0 select-none ${className}`}
        aria-label="Atlauz Logo Mark [Prototype]"
      >
        {/* Outer Chevron / Fish-Head Frame `<` */}
        <path
          d="M 82 14 L 24 38 C 18 40.5, 18 43.5, 24 46 L 82 70"
          stroke={textColor}
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Eye Dot `•` inside the apex */}
        <circle
          cx="48"
          cy="42"
          r="7.5"
          fill={eyeColor}
        >
          {animated && (
            <animate
              attributeName="r"
              values="6.8;8.2;6.8"
              dur="2.4s"
              repeatCount="indefinite"
            />
          )}
        </circle>

        {/* Inner pupil glint */}
        <circle cx="50" cy="40" r="2" fill="#0a0a0a" />
      </svg>
    );
  }

  // 2. BADGE VARIANT: Monochrome wireframe shield
  if (variant === 'badge') {
    return (
      <div
        className={`relative flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-700 p-1.5 ${className}`}
        style={{ width: dims.width, height: dims.height }}
      >
        <AtlauzLogo variant="icon" size="sm" animated={animated} eyeColor={eyeColor} />
      </div>
    );
  }

  // 3. VERTICAL STACKED VARIANT: Monochrome
  if (variant === 'vertical') {
    return (
      <div className={`flex flex-col items-center select-none font-sans font-bold tracking-tight ${className}`}>
        <div className="relative flex items-center justify-center w-8 h-8">
          <svg viewBox="0 0 60 60" className="w-full h-full" fill="none">
            <path
              d="M 12 50 L 30 12 L 48 50"
              stroke="#ffffff"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="30" cy="34" r="5" fill="#ffffff" />
          </svg>
        </div>
        <span className="text-white text-sm -mt-0.5">tl</span>
        <span className="text-neutral-400 text-sm -mt-0.5">au</span>
        <span className="text-white text-sm -mt-0.5">z</span>
      </div>
    );
  }

  // 4. FULL WORDMARK (Default): `<•` + `tl` + `au` + `z` in monochrome Helvetica
  return (
    <div
      className={`inline-flex items-center gap-1 select-none font-sans font-bold tracking-tight ${className}`}
      style={{ height: dims.height }}
    >
      <svg
        width={dims.width}
        height={dims.height}
        viewBox="0 0 240 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto overflow-visible"
        aria-label="Atlauz Official Wordmark [Prototype]"
      >
        {/* 1. LETTER 'A' (The Chevron Arch with eye dot) */}
        <g id="letterA">
          <path
            d="M 12 52 L 32 14 L 52 52"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="32"
            cy="36"
            r="5"
            fill={eyeColor}
          >
            {animated && (
              <animate
                attributeName="r"
                values="4.5;5.5;4.5"
                dur="2.5s"
                repeatCount="indefinite"
              />
            )}
          </circle>
          <circle cx="33.5" cy="34.5" r="1.5" fill="#0a0a0a" />
        </g>

        {/* 2. LETTER 't' (Crisp White) */}
        <g id="letterT">
          <path
            d="M 72 20 L 72 44 C 72 50, 77 52, 82 50"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 64 30 L 80 30"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* 3. LETTER 'l' (Crisp White Vertical Stem) */}
        <g id="letterL">
          <path
            d="M 94 14 L 94 50"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </g>

        {/* 4. LETTER 'a' (Monochrome Gray Accent) */}
        <g id="letterA_lower">
          <path
            d="M 132 34 C 132 26, 122 25, 115 28 C 108 31, 107 38, 107 42 C 107 48, 113 52, 121 52 C 127 52, 132 48, 132 44 L 132 26 L 132 52"
            stroke="#cccccc"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M 108 38 C 114 36, 130 36, 132 40"
            stroke="#cccccc"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </g>

        {/* 5. LETTER 'u' (Monochrome Gray Accent) */}
        <g id="letterU">
          <path
            d="M 148 26 L 148 42 C 148 50, 166 50, 166 42 L 166 26 M 166 38 L 166 52"
            stroke="#cccccc"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        {/* 6. LETTER 'z' (Crisp Modern White) */}
        <g id="letterZ">
          <path
            d="M 182 26 L 210 26 L 184 52 L 212 52"
            stroke="#ffffff"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};
