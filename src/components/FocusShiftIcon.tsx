import React from 'react';

interface FocusShiftIconProps {
  className?: string;
  size?: number;
  active?: boolean;
}

export const FocusShiftIcon: React.FC<FocusShiftIconProps> = ({
  className = '',
  size = 28,
  active = false
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-all ${className}`}
      aria-label="Focus Shift Prototype Icon"
    >
      {/* Outer rounded container border */}
      <rect
        x="6"
        y="6"
        width="88"
        height="88"
        rx="16"
        stroke={active ? '#ffffff' : '#525252'}
        strokeWidth="6"
        fill={active ? 'rgba(255, 255, 255, 0.15)' : '#171717'}
        className="transition-colors"
      />
      {/* Large dominant active card on the left */}
      <rect
        x="17"
        y="17"
        width="44"
        height="66"
        rx="6"
        fill={active ? '#ffffff' : '#888888'}
        className="transition-colors"
      />
      {/* Top smaller card on the right */}
      <rect
        x="66"
        y="17"
        width="17"
        height="19"
        rx="4"
        fill={active ? '#cccccc' : '#525252'}
        className="transition-colors"
      />
      {/* Middle smaller card on the right */}
      <rect
        x="66"
        y="40.5"
        width="17"
        height="19"
        rx="4"
        fill={active ? '#a3a3a3' : '#404040'}
        className="transition-colors"
      />
      {/* Bottom smaller card on the right */}
      <rect
        x="66"
        y="64"
        width="17"
        height="19"
        rx="4"
        fill={active ? '#737373' : '#262626'}
        className="transition-colors"
      />
    </svg>
  );
};
