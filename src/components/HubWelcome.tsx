import React, { useState } from 'react';
import { X, Activity, Gauge, Flame } from 'lucide-react';
import { CognitiveTelemetry, UserAccountSettings } from '../types';

interface HubWelcomeProps {
  username: string;
  telemetry?: CognitiveTelemetry;
  settings?: UserAccountSettings;
  isFirstVisit?: boolean;
  onDismiss: () => void;
}

/**
 * PHASE 3 OPTIMIZATION: Animated Hero Welcome Card
 * 
 * Features:
 * - On-theme with ATLAUZ aesthetic (neutral, monospace, minimalist)
 * - GPU-accelerated animations
 * - Personalized greeting with username
 * - 3 key metrics at a glance
 * - Smooth fade-in/out with CSS animations
 * - Dismissible with button or close icon
 * - Respects prefers-reduced-motion for accessibility
 * - No emojis, pure typography and icons
 */
export const HubWelcome: React.FC<HubWelcomeProps> = ({
  username,
  telemetry,
  settings,
  isFirstVisit = false,
  onDismiss
}) => {
  const [isClosing, setIsClosing] = useState(false);
  const isDark = settings?.theme && !settings.theme.includes('light');
  const streakDays = telemetry?.streakDays || 0;
  const cognitiveVital = telemetry?.cognitiveVital || 0;
  const dailyProgress = telemetry?.dailyGoalProgress || 0;

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      onDismiss();
    }, 200); // Match animation duration
  };

  return (
    <div
      className={`mb-6 transition-all duration-200 ${
        isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100 animate-fade-in'
      }`}
    >
      {/* Hero Card - Minimal ATLAUZ Style */}
      <div
        className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
          isDark
            ? 'bg-neutral-900/40 border-neutral-800 hover:border-neutral-700'
            : 'bg-neutral-50/40 border-neutral-300 hover:border-neutral-400'
        }`}
      >
        {/* Subtle backdrop pattern (no animated gradients) */}
        <div className={`absolute inset-0 opacity-30 pointer-events-none ${
          isDark ? 'bg-neutral-800/5' : 'bg-neutral-900/5'
        }`} />

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-6">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className={`absolute top-4 right-4 p-1 rounded transition-colors ${
              isDark
                ? 'hover:bg-neutral-800/50 text-neutral-500 hover:text-neutral-300'
                : 'hover:bg-neutral-200/50 text-neutral-600 hover:text-neutral-900'
            }`}
            aria-label="Dismiss welcome"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Main Heading */}
          <div className="mb-5 pr-6">
            <h1
              className={`text-xl sm:text-2xl font-mono font-bold mb-1 ${
                isDark ? 'text-neutral-100' : 'text-neutral-950'
              }`}
            >
              Welcome, <span className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>{username}</span>
            </h1>

            {isFirstVisit && (
              <p
                className={`text-xs font-mono ${
                  isDark ? 'text-neutral-500' : 'text-neutral-600'
                }`}
              >
                Cognitive learning workspace initialized
              </p>
            )}
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            {/* Activity Card */}
            <div
              className={`flex flex-col items-start gap-2 p-3 rounded border transition-all ${
                isDark
                  ? 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                  : 'bg-neutral-100/40 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100/60'
              }`}
            >
              <Activity className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-700'}`} />
              <div>
                <div className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                  Session
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-700'}`}>
                  {telemetry?.sessionMinutes || 0} min
                </div>
              </div>
            </div>

            {/* Cognitive Vital */}
            <div
              className={`flex flex-col items-start gap-2 p-3 rounded border transition-all ${
                isDark
                  ? 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                  : 'bg-neutral-100/40 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100/60'
              }`}
            >
              <Gauge className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-700'}`} />
              <div>
                <div className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                  Vital
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-700'}`}>
                  {cognitiveVital}%
                </div>
              </div>
            </div>

            {/* Streak Info */}
            <div
              className={`flex flex-col items-start gap-2 p-3 rounded border transition-all ${
                isDark
                  ? 'bg-neutral-950/40 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900/50'
                  : 'bg-neutral-100/40 border-neutral-300 hover:border-neutral-400 hover:bg-neutral-100/60'
              }`}
            >
              <Flame className={`w-4 h-4 ${isDark ? 'text-neutral-500' : 'text-neutral-700'}`} />
              <div>
                <div className={`text-xs font-mono font-semibold ${isDark ? 'text-neutral-200' : 'text-neutral-900'}`}>
                  Streak
                </div>
                <div className={`text-[11px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-700'}`}>
                  {streakDays}d
                </div>
              </div>
            </div>
          </div>

          {/* Call-to-Action Button */}
          <button
            onClick={handleDismiss}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded font-mono text-xs font-bold transition-all ${
              isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 hover:border-neutral-600'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-950 border border-neutral-400 hover:border-neutral-500'
            }`}
          >
            <span>ACKNOWLEDGED</span>
            <span className="text-xs">→</span>
          </button>
        </div>
      </div>

      {/* Inline CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        /* Respect user's motion preferences */
        @media (prefers-reduced-motion: reduce) {
          .animate-fade-in {
            animation: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default HubWelcome;
