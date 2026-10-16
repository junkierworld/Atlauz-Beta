import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  Sparkles,
  BookOpen,
  ChevronRight,
  ArrowRight,
  Flame,
  Brain
} from 'lucide-react';
import { Flashcard } from '../../types/study';

interface FlashcardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  flashcards: Flashcard[];
  onUpdateFlashcard: (cardId: string, updated: Partial<Flashcard>) => void;
  onCreateFlashcard: (card: Flashcard) => void;
  onShowToast: (msg: string) => void;
}

export const FlashcardsModal: React.FC<FlashcardsModalProps> = ({
  isOpen,
  onClose,
  flashcards,
  onUpdateFlashcard,
  onCreateFlashcard,
  onShowToast
}) => {
  const [activeDeck, setActiveDeck] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCreatingCard, setIsCreatingCard] = useState(false);

  // New Card State
  const [newPrompt, setNewPrompt] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newDeckTitle, setNewDeckTitle] = useState('Algorithms & Data Structures');

  if (!isOpen) return null;

  const decks = Array.from(new Set(flashcards.map(c => c.deckTitle)));
  const filteredCards = activeDeck === 'all'
    ? flashcards
    : flashcards.filter(c => c.deckTitle === activeDeck);

  const currentCard = filteredCards[currentIndex] || filteredCards[0];

  const handleFlip = () => {
    setIsFlipped(prev => !prev);
  };

  const handleScoreCard = (quality: 'again' | 'hard' | 'good' | 'easy') => {
    if (!currentCard) return;

    let nextBox = currentCard.boxLevel;
    let nextInterval = currentCard.intervalDays;

    if (quality === 'again') {
      nextBox = 1;
      nextInterval = 1;
    } else if (quality === 'hard') {
      nextBox = Math.max(1, currentCard.boxLevel);
      nextInterval = 2;
    } else if (quality === 'good') {
      nextBox = Math.min(5, currentCard.boxLevel + 1);
      nextInterval = Math.round(currentCard.intervalDays * 2.2);
    } else if (quality === 'easy') {
      nextBox = Math.min(5, currentCard.boxLevel + 2);
      nextInterval = Math.round(currentCard.intervalDays * 3.5);
    }

    onUpdateFlashcard(currentCard.id, {
      boxLevel: nextBox,
      intervalDays: nextInterval,
      lastReviewedAt: new Date().toISOString().slice(0, 10)
    });

    onShowToast(`Box ${nextBox} • Next review in ${nextInterval} days`);

    // Advance to next card
    setIsFlipped(false);
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleSaveNewCard = () => {
    if (!newPrompt.trim() || !newAnswer.trim()) {
      onShowToast('Please fill in both front prompt and back answer');
      return;
    }

    const newCard: Flashcard = {
      id: `fc-${Date.now()}`,
      deckId: `deck-${Date.now()}`,
      deckTitle: newDeckTitle.trim() || 'General Scholarship',
      frontPrompt: newPrompt.trim(),
      backAnswer: newAnswer.trim(),
      boxLevel: 1,
      intervalDays: 1
    };

    onCreateFlashcard(newCard);
    setNewPrompt('');
    setNewAnswer('');
    setIsCreatingCard(false);
    onShowToast('Created new spaced-retrieval flashcard');
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Brain className="w-5 h-5 text-neutral-300" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                  LEITNER SPACED RETRIEVAL ENGINE
                </span>
                <span className="text-[11px] text-neutral-400">
                  Active Recall Memory Reinforcement • 5-Box Spaced Repetition
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsCreatingCard(prev => !prev)}
                className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-750 text-white font-mono text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isCreatingCard ? 'Review' : 'Add Card'}</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isCreatingCard ? (
            /* CREATE CARD FORM */
            <div className="p-6 space-y-4 overflow-y-auto font-mono text-xs flex-1">
              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase font-bold text-[11px]">Deck Category</label>
                <input
                  type="text"
                  value={newDeckTitle}
                  onChange={e => setNewDeckTitle(e.target.value)}
                  placeholder="e.g. Algorithms & Data Structures"
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase font-bold text-[11px]">Front Prompt (Question / Problem)</label>
                <textarea
                  rows={3}
                  value={newPrompt}
                  onChange={e => setNewPrompt(e.target.value)}
                  placeholder="Formulate the prompt or conceptual query..."
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white outline-none resize-none font-sans text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 uppercase font-bold text-[11px]">Back Answer (Synthesis / Explanation)</label>
                <textarea
                  rows={4}
                  value={newAnswer}
                  onChange={e => setNewAnswer(e.target.value)}
                  placeholder="Comprehensive answer and core principles..."
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white outline-none resize-none font-sans text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingCard(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveNewCard}
                  className="px-5 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200"
                >
                  Save Flashcard
                </button>
              </div>
            </div>
          ) : (
            /* FLASHCARD STUDY VIEW */
            <div className="flex-1 flex flex-col p-6 space-y-5 overflow-y-auto">
              {/* Deck Selector Strip */}
              <div className="flex items-center justify-between gap-2 border-b border-neutral-800 pb-3 font-mono text-xs flex-wrap">
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                  <button
                    type="button"
                    onClick={() => { setActiveDeck('all'); setCurrentIndex(0); setIsFlipped(false); }}
                    className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-colors ${
                      activeDeck === 'all'
                        ? 'bg-white text-black font-bold'
                        : 'bg-neutral-900 text-neutral-400 hover:text-white'
                    }`}
                  >
                    All Decks ({flashcards.length})
                  </button>
                  {decks.map(d => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => { setActiveDeck(d); setCurrentIndex(0); setIsFlipped(false); }}
                      className={`px-3 py-1 rounded-full whitespace-nowrap text-xs transition-colors ${
                        activeDeck === d
                          ? 'bg-white text-black font-bold'
                          : 'bg-neutral-900 text-neutral-400 hover:text-white'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                <span className="text-neutral-400 text-xs">
                  Card {currentIndex + 1} of {filteredCards.length}
                </span>
              </div>

              {/* 3D Perspective Flashcard Container */}
              {currentCard ? (
                <div className="flex-1 flex flex-col justify-center py-2">
                  <div
                    onClick={handleFlip}
                    className="min-h-[260px] p-8 rounded-3xl bg-gradient-to-b from-neutral-900 to-black border-2 border-neutral-800 hover:border-neutral-700 cursor-pointer shadow-2xl flex flex-col justify-between transition-all select-none relative group"
                  >
                    {/* Top Card Badge Bar */}
                    <div className="flex items-center justify-between font-mono text-xs">
                      <span className="px-2.5 py-1 rounded-md bg-neutral-800 text-neutral-300 font-bold text-[10px] uppercase">
                        {currentCard.deckTitle}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-700/50 text-emerald-300 text-[10px] font-bold">
                          Leitner Box {currentCard.boxLevel} / 5
                        </span>
                        <span className="text-neutral-500 text-[10px] flex items-center gap-1">
                          <RotateCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                          Tap to Flip
                        </span>
                      </div>
                    </div>

                    {/* Card Content (Prompt or Answer) */}
                    <div className="my-auto py-6 text-center space-y-3">
                      {!isFlipped ? (
                        <div className="space-y-2">
                          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-500 block">
                            PROMPT
                          </span>
                          <h3 className="text-lg sm:text-xl font-semibold text-white leading-relaxed">
                            {currentCard.frontPrompt}
                          </h3>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-2"
                        >
                          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 block">
                            ANSWER & KEY PRINCIPLE
                          </span>
                          <p className="text-sm sm:text-base font-sans text-neutral-200 leading-relaxed text-left sm:text-center max-w-xl mx-auto">
                            {currentCard.backAnswer}
                          </p>
                        </motion.div>
                      )}
                    </div>

                    {/* Bottom Status */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-neutral-500 pt-2 border-t border-neutral-850">
                      <span>Interval: {currentCard.intervalDays} Days</span>
                      <span className="text-neutral-400">{isFlipped ? 'Review Answer' : 'Click to Reveal'}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center text-neutral-500 font-mono text-xs">
                  No cards in this deck. Add your first card above!
                </div>
              )}

              {/* Leitner Score Rating Bar (Shown when flipped) */}
              {isFlipped && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-4 gap-2 font-mono text-xs pt-2"
                >
                  <button
                    type="button"
                    onClick={() => handleScoreCard('again')}
                    className="p-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/50 border border-rose-800 text-rose-200 flex flex-col items-center gap-0.5 transition-all"
                  >
                    <span className="font-bold text-[11px]">Again</span>
                    <span className="text-[9px] text-rose-400">Box 1 (1d)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScoreCard('hard')}
                    className="p-2.5 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 border border-amber-800 text-amber-200 flex flex-col items-center gap-0.5 transition-all"
                  >
                    <span className="font-bold text-[11px]">Hard</span>
                    <span className="text-[9px] text-amber-400">+2 Days</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScoreCard('good')}
                    className="p-2.5 rounded-xl bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800 text-blue-200 flex flex-col items-center gap-0.5 transition-all"
                  >
                    <span className="font-bold text-[11px]">Good</span>
                    <span className="text-[9px] text-blue-400">Level Up</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleScoreCard('easy')}
                    className="p-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800 text-emerald-200 flex flex-col items-center gap-0.5 transition-all"
                  >
                    <span className="font-bold text-[11px]">Easy</span>
                    <span className="text-[9px] text-emerald-400">Mastered</span>
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
