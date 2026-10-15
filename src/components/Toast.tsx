import React from 'react';
import { Check, AlertCircle, AlertTriangle, Info, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface ToastItem {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  onUndo?: () => void;
  undoLabel?: string;
}

interface ToastProps {
  toast: ToastItem | string | null;
  onDismiss?: () => void;
}

export const Toast: React.FC<ToastProps> = React.memo(({ toast, onDismiss }) => {
  if (!toast) return null;

  const data: ToastItem = typeof toast === 'string' ? { message: toast, type: 'success' } : toast;

  const getIcon = () => {
    switch (data.type) {
      case 'error':
        return <AlertCircle className="w-3.5 h-3.5 text-white stroke-[2.5]" />;
      case 'warning':
        return <AlertTriangle className="w-3.5 h-3.5 text-black stroke-[2.5]" />;
      case 'info':
        return <Info className="w-3.5 h-3.5 text-white stroke-[2.5]" />;
      case 'success':
      default:
        return <Check className="w-3.5 h-3.5 text-black stroke-[3]" />;
    }
  };

  const getIconBadgeBg = () => {
    switch (data.type) {
      case 'error':
        return 'bg-neutral-800 border border-neutral-600';
      case 'warning':
        return 'bg-neutral-200 text-black';
      case 'info':
        return 'bg-neutral-800 border border-neutral-600';
      case 'success':
      default:
        return 'bg-white text-black';
    }
  };

  return (
    <AnimatePresence>
      <div
        role="status"
        aria-live="polite"
        className="fixed bottom-20 inset-x-4 z-50 flex justify-center pointer-events-auto select-none"
      >
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-md w-full sm:w-auto px-4 py-2.5 rounded-lg bg-neutral-950 border border-neutral-700 shadow-2xl flex items-center justify-between gap-3 text-white text-xs font-mono font-medium"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 ${getIconBadgeBg()}`}
            >
              {getIcon()}
            </div>
            <span className="truncate text-neutral-200 font-sans text-xs">
              {data.message}
            </span>
          </div>

          {/* Interactive Undo Button */}
          {data.onUndo && (
            <button
              type="button"
              onClick={e => {
                e.stopPropagation();
                data.onUndo?.();
                onDismiss?.();
              }}
              className="px-2 py-1 rounded bg-white text-black hover:bg-neutral-200 active:scale-95 font-mono text-[11px] font-bold flex items-center gap-1 transition-all shrink-0 focus-visible:ring-2 focus-visible:ring-white"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{data.undoLabel || 'Undo'}</span>
            </button>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
});
