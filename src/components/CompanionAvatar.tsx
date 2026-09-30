import React from 'react';
import { CompanionState, CognitiveTelemetry } from '../types';
import { AtlauzFish } from './AtlauzFish';

interface CompanionAvatarProps {
  companion: CompanionState;
  telemetry: CognitiveTelemetry;
  size?: number;
  interactive?: boolean;
  onTap?: () => void;
}

export const CompanionAvatar: React.FC<CompanionAvatarProps> = ({
  companion,
  telemetry,
  size = 200,
  interactive = true,
  onTap
}) => {
  const { baseColor, accentColor, headIndex = 1, bodyIndex = 1, tailIndex = 1, eyesIndex = 1 } = companion;

  const isFatigued = telemetry.sessionMinutes > 90;
  const displayBaseColor = isFatigued ? '#737373' : baseColor || '#ffffff';
  const displayAccentColor = isFatigued ? '#525252' : accentColor || '#a3a3a3';
  const displayEyeColor = '#ffffff';

  return (
    <div
      onClick={onTap}
      className={`relative flex items-center justify-center transition-transform duration-300 select-none font-sans ${
        interactive ? 'cursor-pointer hover:scale-105 active:scale-95' : ''
      }`}
      style={{ width: size, height: size }}
      title="Atlauz Study Companion Prototype"
    >
      {/* Background Reticle Field */}
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40"
      >
        {/* Outer Reticle Ring 1 */}
        <circle
          cx="100"
          cy="100"
          r="84"
          fill="none"
          stroke="#737373"
          strokeWidth="1.5"
          strokeDasharray="6 8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 100 100"
            to="360 100 100"
            dur="26s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Inner Reticle Ring 2 */}
        <circle
          cx="100"
          cy="100"
          r="68"
          fill="none"
          stroke="#a3a3a3"
          strokeWidth="1"
          strokeDasharray="3 5"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="360 100 100"
            to="0 100 100"
            dur="18s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>

      {/* Center Modular Atlauz Fish Companion */}
      <div className="relative z-10 flex items-center justify-center">
        <AtlauzFish
          headIndex={headIndex}
          bodyIndex={bodyIndex}
          tailIndex={tailIndex}
          eyesIndex={eyesIndex}
          baseColor={displayBaseColor}
          accentColor={displayAccentColor}
          eyeColor={displayEyeColor}
          size={size * 0.75}
          animated={true}
          isSwimming={true}
        />
      </div>

      {/* Status Badge */}
      <div
        className="absolute bottom-0 right-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-neutral-700 bg-neutral-900 text-white"
      >
        {isFatigued ? '[REST NEEDED]' : '[CALIBRATED]'}
      </div>
    </div>
  );
};
