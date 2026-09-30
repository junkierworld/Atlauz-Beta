import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';

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
  className = ''
}) => {
  return (
    <motion.div
      layout
      id={id}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
      className={`rounded-lg transition-all duration-200 overflow-hidden ${
        isFrosted
          ? 'bg-neutral-950 border border-neutral-800 p-3 sm:p-3.5 cursor-pointer select-none'
          : 'bg-neutral-900 border border-neutral-600 p-4 sm:p-5'
      } ${className}`}
    >
      {/* HEADER: When frosted, only shows title & toggle */}
      <div
        onClick={isFrosted ? onToggleFrost : undefined}
        className="flex items-center justify-between gap-3 w-full"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <div className={`shrink-0 transition-colors ${isFrosted ? 'text-neutral-500' : 'text-white'}`}>
              {icon}
            </div>
          )}

          <div className="flex items-center gap-2 truncate">
            <h3
              className={`font-bold truncate text-sm sm:text-base tracking-tight transition-colors ${
                isFrosted ? 'text-neutral-400 hover:text-white' : 'text-white'
              }`}
            >
              {title}
            </h3>

            {badge && (
              <span
                className={`text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border truncate ${
                  isFrosted
                    ? 'bg-neutral-900 border-neutral-800 text-neutral-400'
                    : 'bg-neutral-800 border-neutral-600 text-neutral-200'
                }`}
              >
                {badge}
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
            className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all ${
              isFrosted
                ? 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700'
                : 'bg-white text-black hover:bg-neutral-200 border border-white'
            }`}
            title={isFrosted ? 'Click to reveal details' : 'Click to conceal into compact title'}
          >
            {isFrosted ? (
              <>
                <EyeOff className="w-3 h-3 text-neutral-400" />
                <span className="hidden sm:inline">CONCEALED</span>
                <ChevronRight className="w-3 h-3 text-neutral-500" />
              </>
            ) : (
              <>
                <Eye className="w-3 h-3 text-black" />
                <span className="hidden sm:inline">REVEALED</span>
                <ChevronDown className="w-3 h-3 text-black" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* REVEALED CONTENT: When unfrosted, reveals full details */}
      <AnimatePresence initial={false}>
        {!isFrosted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="mt-4 pt-3.5 border-t border-neutral-800"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
