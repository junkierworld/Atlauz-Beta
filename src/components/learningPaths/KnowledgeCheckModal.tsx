import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, ArrowRight, X, Sparkles, BookOpen, RotateCcw } from 'lucide-react';
import { LearningModule, KnowledgeQuestion } from '../../types/learningPath';

interface KnowledgeCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
  module: LearningModule;
  onPassCheck: (moduleId: string) => void;
}

export const KnowledgeCheckModal: React.FC<KnowledgeCheckModalProps> = ({
  isOpen,
  onClose,
  module,
  onPassCheck
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [answeredCorrectly, setAnsweredCorrectly] = useState(false);
  const [isPassed, setIsPassed] = useState(false);

  if (!isOpen || !module.knowledgeCheck || module.knowledgeCheck.length === 0) return null;

  const currentQ: KnowledgeQuestion = module.knowledgeCheck[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === module.knowledgeCheck.length - 1;

  const handleSelectOption = (idx: number) => {
    if (hasSubmitted) return;
    setSelectedOption(idx);
  };

  const handleVerifyAnswer = () => {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.answerIndex;
    setHasSubmitted(true);
    setAnsweredCorrectly(isCorrect);

    if (isCorrect && isLastQuestion) {
      setIsPassed(true);
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      onPassCheck(module.id);
      onClose();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setHasSubmitted(false);
      setAnsweredCorrectly(false);
    }
  };

  const handleRetryQuestion = () => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setAnsweredCorrectly(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="px-5 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <span className="font-mono text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  MODULE KNOWLEDGE CHECK
                </span>
                <span className="font-bold text-xs text-white line-clamp-1">
                  {module.title}
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              aria-label="Close knowledge check"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="px-6 pt-4 pb-2 flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>Question {currentQuestionIndex + 1} of {module.knowledgeCheck.length}</span>
            <span className="text-[10px] uppercase text-neutral-500">Self-Paced Mastery</span>
          </div>

          {/* Question & Options Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1">
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-semibold text-white leading-snug">
                {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-2.5">
              {currentQ.options.map((opt, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.answerIndex;

                let cardStyle = 'bg-neutral-900/70 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900';

                if (hasSubmitted) {
                  if (isSelected && isCorrectOption) {
                    cardStyle = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500';
                  } else if (isSelected && !isCorrectOption) {
                    cardStyle = 'bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500';
                  } else if (isCorrectOption) {
                    cardStyle = 'bg-emerald-950/20 border-emerald-600/50 text-emerald-300';
                  }
                } else if (isSelected) {
                  cardStyle = 'bg-white text-black font-semibold border-white ring-2 ring-white/50';
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={hasSubmitted}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${cardStyle}`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                      isSelected && !hasSubmitted
                        ? 'border-black text-black font-bold'
                        : 'border-neutral-700 text-neutral-400'
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 leading-relaxed">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Feedback & Explanation Card */}
            {hasSubmitted && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-xl border text-xs leading-relaxed space-y-1.5 ${
                  answeredCorrectly
                    ? 'bg-emerald-950/30 border-emerald-800/80 text-emerald-200'
                    : 'bg-rose-950/30 border-rose-800/80 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold font-mono text-[11px] uppercase">
                  {answeredCorrectly ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Correct Understanding Verified</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                      <span>Conceptual Review Needed</span>
                    </>
                  )}
                </div>
                <p className="text-neutral-300 text-xs pl-5">
                  {currentQ.explanation}
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer Controls */}
          <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-mono text-neutral-400 hover:text-white px-3 py-2 rounded-lg"
            >
              Exit Check
            </button>

            <div>
              {!hasSubmitted ? (
                <button
                  type="button"
                  disabled={selectedOption === null}
                  onClick={handleVerifyAnswer}
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 disabled:opacity-40 disabled:cursor-not-allowed shadow transition-all active:scale-95"
                >
                  Verify Answer
                </button>
              ) : answeredCorrectly ? (
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <span>{isLastQuestion ? 'Complete Module' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleRetryQuestion}
                  className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs flex items-center gap-1.5 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
