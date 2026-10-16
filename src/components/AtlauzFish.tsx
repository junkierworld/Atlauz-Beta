import React from 'react';

export interface AtlauzFishProps {
  id?: string;
  headIndex?: number;
  bodyIndex?: number;
  tailIndex?: number;
  eyesIndex?: number;
  baseColor?: string;
  accentColor?: string;
  eyeColor?: string;
  size?: number;
  animated?: boolean;
  isSwimming?: boolean;
  className?: string;
  glow?: boolean;
  name?: string;
  showName?: boolean;
}

export const AtlauzFishComponent: React.FC<AtlauzFishProps> = ({
  id,
  headIndex = 1,
  bodyIndex = 1,
  tailIndex = 1,
  eyesIndex = 1,
  baseColor = '#d4d4d4',
  accentColor = '#737373',
  eyeColor = '#ffffff',
  size = 120,
  animated = true,
  isSwimming = true,
  className = '',
  name,
  showName = false
}) => {
  const uniqueId = React.useId().replace(/:/g, '');

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: (size * 60) / 100 }}
    >
      {showName && name && (
        <span className="absolute -top-4 px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-[10px] font-mono font-bold text-white whitespace-nowrap z-10">
          [{name}]
        </span>
      )}

      <svg
        viewBox="0 0 120 70"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id={`fishGrad-${uniqueId}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
            <stop offset="35%" stopColor={baseColor} stopOpacity="0.9" />
            <stop offset="70%" stopColor={accentColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor="#1a1a1a" stopOpacity="0.95" />
          </linearGradient>

          <linearGradient id={`brandAeroGrad-${uniqueId}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor={baseColor} />
            <stop offset="100%" stopColor={accentColor} />
          </linearGradient>
        </defs>

        {/* 1. TAIL COMPONENT (Propulsion Fin) */}
        <g id="fishTail">
          {/* Style 1: Atlauz Signature Split-Blade Chevron Tail `<` */}
          {tailIndex === 1 && (
            <g>
              <path
                d="M 32 35 L 8 16 C 4 14, 2 18, 5 22 L 18 35 L 5 48 C 2 52, 4 56, 8 54 Z"
                fill={accentColor}
                stroke="#ffffff"
                strokeWidth="1.5"
                opacity="0.9"
              >
                {animated && isSwimming && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-10 32 35; 10 32 35; -10 32 35"
                    dur="0.85s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <path
                d="M 30 35 L 14 24 M 30 35 L 14 46"
                stroke={baseColor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Style 2: Silk Luminescent Veil Fin */}
          {tailIndex === 2 && (
            <path
              d="M 32 35 C 16 10, 4 16, 2 30 C 0 44, 12 60, 32 35 Z"
              fill={accentColor}
              stroke={baseColor}
              strokeWidth="1.5"
              opacity="0.85"
            >
              {animated && isSwimming && (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-12 32 35; 12 32 35; -12 32 35"
                  dur="1.1s"
                  repeatCount="indefinite"
                />
              )}
            </path>
          )}

          {/* Style 3: Twin Cyber Ribbons */}
          {tailIndex === 3 && (
            <g fill="none" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round">
              <path d="M 32 32 C 18 18, 8 20, 2 14">
                {animated && isSwimming && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="-14 32 35; 14 32 35; -14 32 35"
                    dur="0.75s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
              <path d="M 32 38 C 18 52, 8 50, 2 56">
                {animated && isSwimming && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    values="14 32 35; -14 32 35; 14 32 35"
                    dur="0.75s"
                    repeatCount="indefinite"
                  />
                )}
              </path>
            </g>
          )}

          {/* Style 4: Plasma Vortex Ion Thruster */}
          {tailIndex >= 4 && (
            <g>
              <ellipse
                cx="18"
                cy="35"
                rx="14"
                ry="10"
                fill="none"
                stroke={accentColor}
                strokeWidth="2"
                strokeDasharray="4 3"
              >
                {animated && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 18 35"
                    to="360 18 35"
                    dur="3s"
                    repeatCount="indefinite"
                  />
                )}
              </ellipse>
              <circle cx="22" cy="35" r="4" fill={baseColor}>
                {animated && (
                  <animate attributeName="r" values="3;5.5;3" dur="0.9s" repeatCount="indefinite" />
                )}
              </circle>
            </g>
          )}
        </g>

        {/* 2. DORSAL (TOP) & VENTRAL (BOTTOM) STABILIZER FINS */}
        <path
          d="M 52 20 C 62 8, 76 12, 74 21 Z"
          fill={accentColor}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.8"
        />
        <path
          d="M 56 50 C 64 61, 74 57, 72 49 Z"
          fill={accentColor}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.7"
        />

        {/* 3. MAIN BODY CHASSIS */}
        <g id="fishBody">
          {/* Style 1: Atlauz Streamline Frame with Chevron Accent */}
          {bodyIndex === 1 && (
            <g>
              <path
                d="M 30 35 C 40 18, 85 16, 102 35 C 85 54, 40 52, 30 35 Z"
                fill={`url(#fishGrad-${uniqueId})`}
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path
                d="M 56 26 L 46 35 L 56 44"
                stroke="#ffffff"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.7"
              />
              <path
                d="M 72 26 L 62 35 L 72 44"
                stroke={baseColor}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
                opacity="0.9"
              />
            </g>
          )}

          {/* Style 2: Wireframe Hex Mesh Grid */}
          {bodyIndex === 2 && (
            <g>
              <path
                d="M 30 35 C 40 17, 85 15, 104 35 C 85 55, 40 53, 30 35 Z"
                fill={`url(#fishGrad-${uniqueId})`}
                stroke={baseColor}
                strokeWidth="2"
              />
              <circle cx="50" cy="35" r="2.2" fill="#ffffff" />
              <circle cx="62" cy="28" r="2" fill={baseColor} />
              <circle cx="62" cy="42" r="2" fill={baseColor} />
              <circle cx="74" cy="35" r="2.5" fill="#ffffff" />
              <line x1="50" y1="35" x2="62" y2="28" stroke={baseColor} strokeWidth="1" opacity="0.6" />
              <line x1="50" y1="35" x2="62" y2="42" stroke={baseColor} strokeWidth="1" opacity="0.6" />
              <line x1="62" y1="28" x2="74" y2="35" stroke={baseColor} strokeWidth="1" opacity="0.6" />
              <line x1="62" y1="42" x2="74" y2="35" stroke={baseColor} strokeWidth="1" opacity="0.6" />
            </g>
          )}

          {/* Style 3: Titanium Armored Plates */}
          {bodyIndex === 3 && (
            <g>
              <path
                d="M 30 35 C 40 18, 85 16, 102 35 C 85 54, 40 52, 30 35 Z"
                fill="#171717"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <path d="M 44 22 C 50 30, 50 40, 44 48" stroke={baseColor} strokeWidth="2.5" fill="none" />
              <path d="M 60 20 C 68 30, 68 40, 60 50" stroke={baseColor} strokeWidth="2.5" fill="none" />
              <path d="M 76 22 C 82 30, 82 40, 76 48" stroke={accentColor} strokeWidth="2.5" fill="none" />
            </g>
          )}

          {/* Style 4: Prismatic Crystal Core */}
          {bodyIndex >= 4 && (
            <g>
              <path
                d="M 30 35 C 42 16, 84 15, 104 35 C 84 55, 42 54, 30 35 Z"
                fill="url(#brandAeroGrad-${uniqueId})"
                fillOpacity="0.35"
                stroke="#ffffff"
                strokeWidth="2"
              />
              <polygon
                points="50,35 64,24 80,35 64,46"
                fill={baseColor}
                fillOpacity="0.8"
                stroke="#ffffff"
                strokeWidth="1.5"
              >
                {animated && (
                  <animate attributeName="fill-opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                )}
              </polygon>
            </g>
          )}

          {/* Lateral Energy Stripe */}
          <path
            d="M 42 35 Q 70 32 94 35"
            stroke={baseColor}
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.9"
          />
        </g>

        {/* 4. PECTORAL SIDE FIN */}
        <path
          d="M 70 37 C 58 45, 56 50, 62 52 C 70 50, 75 42, 70 37 Z"
          fill={accentColor}
          stroke="#ffffff"
          strokeWidth="1"
          opacity="0.9"
        >
          {animated && isSwimming && (
            <animateTransform
              attributeName="transform"
              type="rotate"
              values="0 70 37; 18 70 37; 0 70 37"
              dur="1s"
              repeatCount="indefinite"
            />
          )}
        </path>

        {/* 5. HEAD COMPONENT */}
        <g id="fishHead">
          {headIndex === 1 && (
            <path
              d="M 86 21 L 108 35 L 86 49"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          )}

          {headIndex === 2 && (
            <path
              d="M 85 24 Q 112 35 85 46"
              stroke={baseColor}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {headIndex === 3 && (
            <g stroke="#ffffff" strokeWidth="2" fill="none">
              <path d="M 88 20 C 96 14, 106 18, 108 28" />
              <path d="M 88 50 C 96 56, 106 52, 108 42" />
            </g>
          )}

          {headIndex >= 4 && (
            <path
              d="M 80 18 L 90 10 L 98 20 L 108 14 L 104 28"
              stroke={accentColor}
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
            />
          )}
        </g>

        {/* 6. EYE COMPONENT */}
        <g id="fishEye">
          {eyesIndex === 1 && (
            <g>
              <circle cx="92" cy="30" r="4.5" fill={eyeColor}>
                {animated && (
                  <animate attributeName="r" values="4;5.2;4" dur="2.4s" repeatCount="indefinite" />
                )}
              </circle>
              <circle cx="93.5" cy="28.5" r="1.5" fill="#0a0a0a" />
            </g>
          )}

          {eyesIndex === 2 && (
            <g>
              <circle cx="92" cy="30" r="6" fill="none" stroke={baseColor} strokeWidth="1.2" strokeDasharray="3 2">
                {animated && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from="0 92 30"
                    to="360 92 30"
                    dur="4s"
                    repeatCount="indefinite"
                  />
                )}
              </circle>
              <circle cx="92" cy="30" r="3" fill={eyeColor} />
              <circle cx="93" cy="29" r="1" fill="#0a0a0a" />
            </g>
          )}

          {eyesIndex === 3 && (
            <g>
              <rect x="86" y="27" width="12" height="5" rx="2.5" fill="#171717" stroke="#ffffff" strokeWidth="1" />
              <rect x="88" y="28.5" width="8" height="2" rx="1" fill={eyeColor} />
            </g>
          )}

          {eyesIndex >= 4 && (
            <g>
              <polygon
                points="92,25 94,30 99,30 95,33 97,38 92,35 87,38 89,33 85,30 90,30"
                fill={eyeColor}
                stroke="#ffffff"
                strokeWidth="0.8"
              />
              <circle cx="92" cy="31" r="1.2" fill="#0a0a0a" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};

// Memoize to prevent unnecessary re-renders when fish props haven't changed
export const AtlauzFish = React.memo(AtlauzFishComponent, (prevProps, nextProps) => {
  // Custom comparison: only re-render if key animation props change
  return (
    prevProps.id === nextProps.id &&
    prevProps.headIndex === nextProps.headIndex &&
    prevProps.bodyIndex === nextProps.bodyIndex &&
    prevProps.tailIndex === nextProps.tailIndex &&
    prevProps.eyesIndex === nextProps.eyesIndex
  );
});
