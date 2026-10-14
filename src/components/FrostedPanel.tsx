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
  isStreakFrozen = false
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
          ? 'bg-freeze-pattern bg-neutral-950 border border-neutral-700/80 backdrop-blur-[20px]'
          : isFrosted
          ? 'glass-frosted-idle p-3 sm:p-3.5 cursor-pointer select-none'
          : 'glass-defrost-active p-4 sm:p-5'
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
            <div
              style={{ color: isFrosted ? 'var(--theme-text-muted, #888)' : 'var(--theme-accent, #fff)' }}
              className="shrink-0 transition-colors"
            >
              {icon}
            </div>
          )}

          <div className="flex items-center gap-2 truncate">
            <h3
              style={{ color: isFrosted ? 'var(--theme-text-muted, #aaa)' : 'var(--theme-text-primary, #fff)' }}
              className={`font-extrabold truncate text-sm sm:text-base tracking-tight font-mono transition-colors ${
                isStreakFrozen ? 'line-through opacity-60' : ''
              }`}
            >
              {title}
            </h3>

            {badge && (
              <span
                style={{
                  backgroundColor: isFrosted ? 'rgba(0,0,0,0.3)' : 'var(--theme-badge-bg, #262626)',
                  color: isFrosted ? 'var(--theme-text-muted, #aaa)' : 'var(--theme-badge-text, #ffffff)',
                  borderColor: 'var(--theme-card-border, #404040)'
                }}
                className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border truncate shadow-xs"
              >
                {badge}
              </span>
            )}

            {isStreakFrozen && (
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-400 uppercase">
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
            style={{
              backgroundColor: isFrosted ? 'rgba(0, 0, 0, 0.3)' : 'var(--theme-action-btn-bg, #ffffff)',
              color: isFrosted ? 'var(--theme-text-primary, #ffffff)' : 'var(--theme-action-btn-text, #000000)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="px-2.5 py-1 rounded text-[11px] font-mono font-extrabold flex items-center gap-1.5 transition-all border shadow-xs hover:scale-105 active:scale-95"
            title={isFrosted ? 'Click, double-tap, or long-press to defrost' : 'Click to frost into compact title'}
          >
            {isFrosted ? (
              <>
                <EyeOff className="w-3 h-3" />
                <span className="hidden sm:inline">FROSTED</span>
                <ChevronRight className="w-3 h-3" />
              </>
            ) : (
              <>
                <Eye className="w-3 h-3" />
                <span className="hidden sm:inline">DEFROSTED</span>
                <ChevronDown className="w-3 h-3" />
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
            className="pt-3 sm:pt-4 border-t border-neutral-800 mt-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
