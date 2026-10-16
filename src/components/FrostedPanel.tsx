import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Eye, EyeOff, Sparkles } from 'lucide-react';

interface FrostedPanelProps {
  id?: string;
  title: string;
  icon?: React.ReactNode;
  badge?: string;
  isFrosted: boolean;
  onToggleFrost: () => void;
  children: React.ReactNode;
  headerActions?: React.ReactNode;
  className?: string;
  isStreakFrozen?: boolean;
  isDark?: boolean;
}

export const FrostedPanel: React.FC<FrostedPanelProps> = ({
  id,
  title,
  icon,
  badge,
  isFrosted,
  onToggleFrost,
  children,
  headerActions,
  className = '',
  isStreakFrozen = false,
  isDark = true
}) => {
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Intentional long-press trigger for tactile defrosting (450ms)
  const handleTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      onToggleFrost();
    }, 450);
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  return (
    <motion.div
      layout
      id={id}
      onDoubleClick={onToggleFrost}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className={`rounded-lg transition-all duration-200 overflow-hidden relative ${
        isStreakFrozen
          ? isDark
            ? 'bg-freeze-pattern bg-neutral-950 border border-neutral-700/80 backdrop-blur-[20px]'
            : 'bg-freeze-pattern bg-neutral-100 border border-neutral-300/80 backdrop-blur-[20px]'
          : isFrosted
          ? isDark
            ? 'glass-frosted-idle p-3 sm:p-3.5 cursor-pointer select-none bg-neutral-900/50 border border-neutral-800'
            : 'glass-frosted-idle p-3 sm:p-3.5 cursor-pointer select-none bg-neutral-100/50 border border-neutral-300'
          : isDark
          ? 'glass-defrost-active p-4 sm:p-5 bg-neutral-900/40 border border-neutral-800'
          : 'glass-defrost-active p-4 sm:p-5 bg-neutral-50/40 border border-neutral-300'
      } ${className}`}
      title={isFrosted ? 'Double-tap or long-press to defrost' : 'Double-tap to frost'}
    >
      {/* HEADER: When frosted, only shows title & toggle */}
      <div
        onClick={isFrosted ? onToggleFrost : undefined}
        className="flex items-center justify-between gap-3 w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className={`shrink-0 transition-colors ${
              isFrosted
                ? isDark ? 'text-neutral-500' : 'text-neutral-500'
                : isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {icon}
            </div>
          )}

          <div className="flex items-center gap-2 truncate">
            <h3
              className={`font-bold truncate text-sm sm:text-base tracking-tight font-mono transition-colors ${
                isStreakFrozen
                  ? isDark ? 'text-neutral-500 line-through' : 'text-neutral-500 line-through'
                  : isFrosted
                  ? isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-700 hover:text-neutral-900'
                  : isDark ? 'text-white' : 'text-neutral-900'
              }`}
            >
              {title}
            </h3>

            {badge && (
              <span
                className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border truncate ${
                  isFrosted
                    ? isDark
                      ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                      : 'bg-neutral-200 border-neutral-400 text-neutral-700'
                    : isDark
                    ? 'bg-neutral-800 border-neutral-600 text-neutral-200'
                    : 'bg-neutral-200 border-neutral-400 text-neutral-700'
                }`}
              >
                {badge}
              </span>
            )}

            {isStreakFrozen && (
              <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase border ${
                isDark
                  ? 'bg-neutral-900 border-neutral-700 text-neutral-400'
                  : 'bg-neutral-200 border-neutral-400 text-neutral-600'
              }`}>
                [PAUSED // REST DAY]
              </span>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {!isFrosted && headerActions}

          <button
            onClick={e => {
              e.stopPropagation();
              onToggleFrost();
            }}
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all border ${
              isFrosted
                ? isDark
                  ? 'bg-neutral-900 text-neutral-400 hover:text-white border-neutral-800 hover:border-neutral-700'
                  : 'bg-neutral-100 text-neutral-600 hover:text-neutral-900 border-neutral-300 hover:border-neutral-400'
                : isDark
                ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-100 border border-neutral-700 hover:border-neutral-600'
                : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-950 border-neutral-400 hover:border-neutral-500'
            }`}
            title={isFrosted ? 'Click, double-tap, or long-press to defrost' : 'Click to frost into compact title'}
          >
            {isFrosted ? (
              <>
                <EyeOff className={`w-3 h-3 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`} />
                <span className="hidden sm:inline">FROSTED</span>
                <ChevronRight className={`w-3 h-3 ${isDark ? 'text-neutral-500' : 'text-neutral-600'}`} />
              </>
            ) : (
              <>
                <Eye className={`w-3 h-3 ${isDark ? 'text-neutral-100' : 'text-neutral-950'}`} />
                <span className="hidden sm:inline">DEFROSTED</span>
                <ChevronDown className={`w-3 h-3 ${isDark ? 'text-neutral-100' : 'text-neutral-950'}`} />
              </>
            )}
          </button>
        </div>
      </div>

      {/* BODY CONTENT: Revealed when Defrosted */}
      <AnimatePresence initial={false}>
        {!isFrosted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className={`pt-3 sm:pt-4 border-t mt-3 ${
              isDark ? 'border-neutral-800' : 'border-neutral-300'
            }`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
