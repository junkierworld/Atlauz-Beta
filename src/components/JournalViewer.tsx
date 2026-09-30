import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Lock,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface JournalViewerProps {
  journal: ResourceItem;
  onClose: () => void;
  onUpdateJournal: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

const MOODS = [
  { emoji: '🌊', label: 'Deep Flow' },
  { emoji: '🧘', label: 'Calm' },
  { emoji: '⚡', label: 'Energetic' },
  { emoji: '😊', label: 'Inspired' },
  { emoji: '🌙', label: 'Reflective' }
];

export const JournalViewer: React.FC<JournalViewerProps> = ({
  journal,
  onClose,
  onUpdateJournal,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [mood, setMood] = useState(journal.metadata.mood || '🌊 Deep Flow');
  const [prompt, setPrompt] = useState(
    journal.metadata.prompt || "What was your deepest breakthrough moment during today's study sprint?"
  );
  const [reflections, setReflections] = useState(
    journal.metadata.reflections || [
      'Maintained 42 minutes of uninterrupted flow without a single browser tab hop.',
      'Protected circadian sleep boundary with anti-burnout freeze.'
    ]
  );
  const [newReflection, setNewReflection] = useState('');
  const [showBadgePicker, setShowBadgePicker] = useState(false);

  const addReflection = () => {
    if (!newReflection.trim()) return;
    const updated = [...reflections, newReflection.trim()];
    setReflections(updated);
    setNewReflection('');
    onUpdateJournal({
      metadata: { ...journal.metadata, reflections: updated, mood, prompt }
    });
    onShowToast('Journal reflection added');
  };

  const togglePin = () => {
    const next = !journal.isPinned;
    onUpdateJournal({ isPinned: next });
    onShowToast(next ? '📌 Pinned journal to Hub' : 'Unpinned journal');
  };

  const toggleFavorite = () => {
    const next = !journal.isFavorite;
    onUpdateJournal({ isFavorite: next });
    onShowToast(next ? '⭐ Starred journal' : 'Removed from Starred');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-2 bg-black/80 backdrop-blur-md overflow-hidden">
      <motion.div
        layout
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 280 }}
        className={`bg-[#0a1529] text-white flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'w-full h-full rounded-none sm:rounded-xl border border-[#89ceff]/30'
            : 'w-full max-w-3xl h-[84vh] rounded-2xl border border-[#89ceff]/40'
        }`}
      >
        {/* Header */}
        <div className="bg-[#081224] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#89ceff]/20 text-[#89ceff] flex items-center justify-center font-bold border border-[#89ceff]/40">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={journal.title}
                  onChange={e => onUpdateJournal({ title: e.target.value })}
                  className="font-bold text-base sm:text-lg bg-transparent border-b border-transparent hover:border-white/30 focus:border-[#89ceff] outline-none"
                />
                <button onClick={toggleFavorite} className="text-amber-400">
                  <Star className={`w-4 h-4 ${journal.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-[#00f2fe]">
                  <Pin className={`w-4 h-4 ${journal.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#89ceff]/15 text-[#89ceff] border border-[#89ceff]/30 flex items-center gap-1"
                  >
                    <span>{journal.badge || '🌿 Serene'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={journal.badge}
                        isPinned={journal.isPinned}
                        isFavorite={journal.isFavorite}
                        onSelectBadge={b => {
                          onUpdateJournal({ badge: b });
                          setShowBadgePicker(false);
                          onShowToast(`Badge set to ${b}`);
                        }}
                        onTogglePin={togglePin}
                        onToggleFavorite={toggleFavorite}
                        onClose={() => setShowBadgePicker(false)}
                      />
                    </div>
                  )}
                </div>
              </div>
              <span className="text-xs text-white/50">{journal.metadata.journalDate || 'Today'} • Mindful Reflection</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Biometric Encrypted
            </span>
            <button
              onClick={() => {
                setIsMaximized(!isMaximized);
                onShowToast(isMaximized ? 'Minimized' : 'Maximized Clean Clarity View');
              }}
              className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
            >
              {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-rose-500/20 text-white/60 hover:text-rose-400">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 max-w-2xl mx-auto w-full">
          {/* Mood Check-in */}
          <div className="bg-[#0d1e38] rounded-2xl p-4 border border-white/10 flex flex-col gap-2">
            <span className="text-xs uppercase font-mono text-[#89ceff] font-bold">Cognitive Mood Check-in</span>
            <div className="flex items-center gap-2 flex-wrap">
              {MOODS.map(m => (
                <button
                  key={m.label}
                  onClick={() => {
                    const next = `${m.emoji} ${m.label}`;
                    setMood(next);
                    onUpdateJournal({ metadata: { ...journal.metadata, mood: next } });
                  }}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    mood.includes(m.label)
                      ? 'bg-[#89ceff]/20 border-[#89ceff] text-[#89ceff] shadow-[0_0_10px_rgba(137,206,255,0.3)]'
                      : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  <span>{m.emoji}</span>
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily Thought Prompt */}
          <div className="bg-[#0d1e38] rounded-2xl p-5 border border-white/10 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-[#00f2fe] font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Prompt of the Day</span>
            </div>
            <p className="text-base font-semibold text-white/90 italic">"{prompt}"</p>
          </div>

          {/* Reflections List */}
          <div className="space-y-2.5">
            <span className="text-xs uppercase font-mono text-white/50 font-bold">Today's Entries</span>
            {reflections.map((r, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-sm leading-relaxed text-white/90">
                {r}
              </div>
            ))}
          </div>

          {/* New Entry Input */}
          <div className="bg-[#0d1e38] rounded-2xl p-3.5 border border-white/10 flex flex-col gap-2">
            <textarea
              value={newReflection}
              onChange={e => setNewReflection(e.target.value)}
              placeholder="Record a thought, insight, or gratitude..."
              className="w-full bg-black/20 rounded-xl p-3 border border-white/10 text-sm text-white/90 outline-none resize-none h-20"
            />
            <div className="flex justify-end">
              <button
                onClick={addReflection}
                className="px-4 py-1.5 bg-[#89ceff] text-black font-bold text-xs rounded-xl hover:brightness-110"
              >
                Log Reflection
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
