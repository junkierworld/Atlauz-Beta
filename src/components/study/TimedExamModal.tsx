import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Clock,
  Award,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { PracticeExam } from '../../types/study';

interface TimedExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam: PracticeExam | null;
  onPassExam: (examId: string, score: number) => void;
  onShowToast: (msg: string) => void;
}

export const TimedExamModal: React.FC<TimedExamModalProps> = ({
  isOpen,
  onClose,
  exam,
  onPassExam,
  onShowToast
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [secondsRemaining, setSecondsRemaining] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [finalScore, setFinalScore] = useState<number>(0);

  useEffect(() => {
    if (exam && isOpen) {
      setSecondsRemaining(exam.durationMinutes * 60);
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setIsSubmitted(false);
      setFinalScore(0);
    }
  }, [exam, isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isSubmitted || secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen, isSubmitted, secondsRemaining]);

  if (!isOpen || !exam) return null;

  const currentQ = exam.questions[currentQuestionIndex];
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (qIdx: number, optionIdx: number) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [qIdx]: optionIdx
    }));
  };

  const handleSubmitExam = () => {
    let correct = 0;
    exam.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.answerIndex) {
        correct++;
      }
    });

    const scorePct = Math.round((correct / exam.questions.length) * 100);
    setFinalScore(scorePct);
    setIsSubmitted(true);

    if (scorePct >= exam.passingScorePercent) {
      onPassExam(exam.id, scorePct);
      onShowToast(`🎉 Passed capstone exam with ${scorePct}%! Accreditations unlocked.`);
    } else {
      onShowToast(`Scored ${scorePct}%. Required: ${exam.passingScorePercent}% to pass.`);
    }
  };

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isPassed = finalScore >= exam.passingScorePercent;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-3xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
                <Award className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-white block">
                  TIMED PRACTICE CAPSTONE EXAM
                </span>
                <span className="text-[11px] text-neutral-400">
                  {exam.title} • Passing Threshold: {exam.passingScorePercent}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono">
              {!isSubmitted && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black border border-neutral-800 text-xs text-amber-400 font-bold">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{formatTimer(secondsRemaining)}</span>
                </div>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Exam Body */}
          {!isSubmitted ? (
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
              {/* Question Navigation Bubbles */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 border-b border-neutral-850 pb-3 font-mono text-xs">
                {exam.questions.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentQuestionIndex(idx)}
                    className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-colors ${
                      currentQuestionIndex === idx
                        ? 'bg-white text-black ring-2 ring-white/50'
                        : selectedAnswers[idx] !== undefined
                        ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                        : 'bg-neutral-900 text-neutral-500 hover:text-white'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                <span className="text-neutral-500 text-[11px] ml-auto">
                  {answeredCount}/{exam.questions.length} Answered
                </span>
              </div>

              {/* Current Question */}
              {currentQ && (
                <div className="space-y-4 flex-1">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase text-neutral-400">
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </span>
                    <h3 className="text-base sm:text-lg font-semibold text-white leading-snug">
                      {currentQ.question}
                    </h3>
                  </div>

                  <div className="space-y-2.5 pt-2">
                    {currentQ.options.map((opt, optIdx) => {
                      const isSelected = selectedAnswers[currentQuestionIndex] === optIdx;

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                          className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs sm:text-sm flex items-start gap-3 ${
                            isSelected
                              ? 'bg-white text-black font-semibold border-white ring-2 ring-white/50'
                              : 'bg-neutral-900/70 border-neutral-800 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-900'
                          }`}
                        >
                          <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-mono shrink-0 mt-0.5 ${
                            isSelected ? 'border-black text-black font-bold' : 'border-neutral-700 text-neutral-400'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </span>
                          <span className="flex-1 leading-relaxed">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Bottom Nav Controls */}
              <div className="pt-4 border-t border-neutral-850 flex items-center justify-between font-mono">
                <button
                  type="button"
                  disabled={currentQuestionIndex === 0}
                  onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 disabled:opacity-30 text-xs"
                >
                  Previous
                </button>

                <div className="flex items-center gap-2">
                  {currentQuestionIndex < exam.questions.length - 1 ? (
                    <button
                      type="button"
                      onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                      className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold"
                    >
                      Next Question
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmitExam}
                      className="px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs shadow-lg"
                    >
                      Submit Exam
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* EXAM RESULTS & REVIEW */
            <div className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto">
              {/* Score Banner */}
              <div className={`p-6 rounded-2xl border text-center space-y-3 font-mono ${
                isPassed
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                  : 'bg-rose-950/40 border-rose-800 text-rose-200'
              }`}>
                <div className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border-2 border-current">
                  {isPassed ? <CheckCircle2 className="w-7 h-7" /> : <AlertCircle className="w-7 h-7" />}
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl sm:text-2xl font-bold">
                    {isPassed ? 'Capstone Exam Passed!' : 'Capstone Threshold Not Met'}
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans">
                    You scored <strong className="text-white text-sm">{finalScore}%</strong> (Passing threshold is {exam.passingScorePercent}%).
                  </p>
                </div>
              </div>

              {/* Question-by-Question Review */}
              <div className="space-y-3">
                <span className="font-mono text-xs font-bold uppercase tracking-wider text-neutral-400 block">
                  Conceptual Review Breakdown
                </span>

                <div className="space-y-3 font-mono text-xs">
                  {exam.questions.map((q, idx) => {
                    const studentChoice = selectedAnswers[idx];
                    const isCorrect = studentChoice === q.answerIndex;

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-xl border space-y-2 ${
                          isCorrect
                            ? 'bg-black/60 border-neutral-800'
                            : 'bg-rose-950/20 border-rose-900/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="font-bold text-white text-xs">
                            {idx + 1}. {q.question}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                            isCorrect ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-950 text-rose-300'
                          }`}>
                            {isCorrect ? 'Correct' : 'Incorrect'}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                          {q.explanation}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200"
                >
                  Close & Return
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
