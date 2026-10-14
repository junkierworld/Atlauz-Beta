import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Eye, CheckCircle2, RotateCcw, Sparkles } from 'lucide-react';

interface PomodoroEyeBreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const PomodoroEyeBreakModal: React.FC<PomodoroEyeBreakModalProps> = ({
  isOpen,
  onClose,
  onShowToast
}) => {
  const [seconds, setSeconds] = useState(20);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setSeconds(20);
    setIsCompleted(false);

    const timer = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCompleted(true);
          onShowToast('✨ 20-20-20 Eye Strain Break Complete. Ciliary muscles relaxed!');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl p-6 sm:p-8 text-center space-y-6 text-white font-mono"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-full mx-auto bg-cyan-950/60 border border-cyan-800 text-cyan-300 flex items-center justify-center">
              <Eye className="w-6 h-6" />
            </div>
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-bold block">
              20-20-20 OCULAR REST PROTOCOL
            </span>
            <h3 className="text-base font-bold text-white">
              Look at an object 20 feet away
            </h3>
          </div>

          {/* 20s Circle Progress */}
          <div className="relative w-36 h-36 mx-auto flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                stroke="#06b6d4"
                strokeWidth="6"
                strokeDasharray={377}
                strokeDashoffset={377 - (377 * (20 - seconds)) / 20}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-linear"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-bold text-white tabular-nums">
                {seconds}s
              </span>
              <span className="text-[10px] text-neutral-400">Resting Eyes</span>
            </div>
          </div>

          <p className="text-xs text-neutral-300 font-sans leading-relaxed">
            Fix your gaze past the screen boundary. Gently drop your shoulders, unclench your jaw, and take two slow abdominal breaths.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all active:scale-95 shadow"
            >
              {isCompleted ? 'Resume Study Sprint' : 'Skip & Resume'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
