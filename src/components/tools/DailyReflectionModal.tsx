import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, Smile, Sparkles, Check, Calendar, Sun, Moon } from 'lucide-react';
import { DailyReflectionLog } from '../../types/study';

interface DailyReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  todayReflection: DailyReflectionLog | null;
  onSaveReflection: (reflection: DailyReflectionLog) => void;
  onShowToast: (msg: string) => void;
}

export const DailyReflectionModal: React.FC<DailyReflectionModalProps> = ({
  isOpen,
  onClose,
  todayReflection,
  onSaveReflection,
  onShowToast
}) => {
  const [morningIntention, setMorningIntention] = useState(todayReflection?.morningIntention || '');
  const [eveningSummary, setEveningSummary] = useState(todayReflection?.eveningSummary || '');
  const [moodScore, setMoodScore] = useState(todayReflection?.moodScore || 4);

  if (!isOpen) return null;

  const moods = [
    { score: 1, label: 'Exhausted', icon: '😴' },
    { score: 2, label: 'Fatigued', icon: '🌧️' },
    { score: 3, label: 'Balanced', icon: '🌿' },
    { score: 4, label: 'Focused Flow', icon: '⚡' },
    { score: 5, label: 'Peak Mastery', icon: '🌟' }
  ];

  const handleSave = () => {
    const log: DailyReflectionLog = {
      date: new Date().toISOString().slice(0, 10),
      morningIntention: morningIntention.trim() || 'Maintain steady deep work without context switches.',
      eveningSummary: eveningSummary.trim() || 'Synthesized key concepts and protected rest balance.',
      focusHours: todayReflection?.focusHours || 3.5,
      moodScore
    };

    onSaveReflection(log);
    onShowToast('📝 Academic reflection & mood log saved');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden text-white font-mono"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <BookOpen className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-white block">
                  DAILY ACADEMIC REFLECTION & MOOD JOURNAL
                </span>
                <span className="text-[11px] text-neutral-400">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
            {/* Cognitive Mood Selector */}
            <div className="space-y-2">
              <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider block">
                Cognitive State & Academic Mood
              </label>
              <div className="grid grid-cols-5 gap-2">
                {moods.map(m => (
                  <button
                    key={m.score}
                    type="button"
                    onClick={() => setMoodScore(m.score)}
                    className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                      moodScore === m.score
                        ? 'bg-white text-black font-bold border-white ring-2 ring-white/40'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-lg">{m.icon}</span>
                    <span className="text-[9px] text-center leading-tight truncate w-full">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Morning Intention */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Morning Focus Intention & Goal</span>
              </label>
              <textarea
                rows={3}
                value={morningIntention}
                onChange={e => setMorningIntention(e.target.value)}
                placeholder="What is the single most important academic problem to synthesize today?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-600 outline-none font-sans text-xs resize-none"
              />
            </div>

            {/* Evening Retrospective */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-neutral-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Evening Retrospective & Synthesis</span>
              </label>
              <textarea
                rows={3}
                value={eveningSummary}
                onChange={e => setEveningSummary(e.target.value)}
                placeholder="What concept did you master? What friction or context-switch did you avoid?"
                className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-neutral-800 text-white placeholder-neutral-600 outline-none font-sans text-xs resize-none"
              />
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-white text-black font-bold text-xs hover:bg-neutral-200 shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Journal Entry</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
