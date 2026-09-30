import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  CheckCircle2,
  Circle,
  Play,
  Star,
  Pin,
  Maximize2,
  Minimize2,
  X,
  Award,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { ResourceItem } from '../types';
import { BadgeSelector } from './BadgeSelector';

interface LessonViewerProps {
  lesson: ResourceItem;
  onClose: () => void;
  onUpdateLesson: (updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  onClose,
  onUpdateLesson,
  onShowToast
}) => {
  const [isMaximized, setIsMaximized] = useState(true);
  const [modules, setModules] = useState(
    lesson.metadata.modules || [
      { id: 'm-1', title: '1. Self-Attention Intuition', completed: true, duration: '12 mins' },
      { id: 'm-2', title: '2. Multi-Head Projections', completed: false, duration: '15 mins' }
    ]
  );
  const [showBadgePicker, setShowBadgePicker] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: number }>({});
  const [showQuizExplanations, setShowQuizExplanations] = useState<{ [key: number]: boolean }>({});

  const quizQuestions = lesson.metadata.quizQuestions || [];

  const toggleModule = (id: string) => {
    const updated = modules.map(m => (m.id === id ? { ...m, completed: !m.completed } : m));
    setModules(updated);
    onUpdateLesson({
      metadata: { ...lesson.metadata, modules: updated }
    });
    onShowToast('Lesson progress updated');
  };

  const togglePin = () => {
    const next = !lesson.isPinned;
    onUpdateLesson({ isPinned: next });
    onShowToast(next ? '📌 Pinned lesson to Hub' : 'Unpinned lesson');
  };

  const toggleFavorite = () => {
    const next = !lesson.isFavorite;
    onUpdateLesson({ isFavorite: next });
    onShowToast(next ? '⭐ Starred course lesson' : 'Removed from Starred');
  };

  const completedCount = modules.filter(m => m.completed).length;
  const progressPercent = Math.round((completedCount / modules.length) * 100);

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
            ? 'w-full h-full rounded-none sm:rounded-xl border border-[#06d6a0]/30'
            : 'w-full max-w-4xl h-[88vh] rounded-2xl border border-[#06d6a0]/40'
        }`}
      >
        {/* Header */}
        <div className="bg-[#07101f] border-b border-white/10 px-4 py-3 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#06d6a0]/20 text-[#06d6a0] flex items-center justify-center font-bold border border-[#06d6a0]/40">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base sm:text-lg">{lesson.title}</span>
                <button onClick={toggleFavorite} className="text-amber-400">
                  <Star className={`w-4 h-4 ${lesson.isFavorite ? 'fill-current' : ''}`} />
                </button>
                <button onClick={togglePin} className="text-[#00f2fe]">
                  <Pin className={`w-4 h-4 ${lesson.isPinned ? 'fill-current' : ''}`} />
                </button>

                {/* Badge selector */}
                <div className="relative">
                  <button
                    onClick={() => setShowBadgePicker(!showBadgePicker)}
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#06d6a0]/15 text-[#06d6a0] border border-[#06d6a0]/30 flex items-center gap-1"
                  >
                    <span>{lesson.badge || '🎓 Mastered'}</span>
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {showBadgePicker && (
                    <div className="absolute top-full left-0 mt-1 z-50">
                      <BadgeSelector
                        currentBadge={lesson.badge}
                        isPinned={lesson.isPinned}
                        isFavorite={lesson.isFavorite}
                        onSelectBadge={b => {
                          onUpdateLesson({ badge: b });
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
              <span className="text-xs text-white/50">
                {lesson.metadata.courseCode} • {lesson.metadata.instructor}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {/* Lesson Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {/* Progress Card */}
          <div className="bg-[#0e1d35] rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-mono text-[#06d6a0] font-bold">Course Mastery</span>
                <h3 className="text-lg font-bold mt-0.5">{completedCount} of {modules.length} Modules Finished</h3>
              </div>
              <span className="text-2xl font-extrabold text-[#06d6a0]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#06d6a0] h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Module Syllabus List */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bold text-sm uppercase text-white/70 tracking-wider">Lesson Syllabus & Interactive Notes</h4>
            <div className="space-y-2">
              {modules.map((m, idx) => (
                <div
                  key={m.id}
                  onClick={() => toggleModule(m.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    m.completed
                      ? 'bg-[#06d6a0]/10 border-[#06d6a0]/40 text-white'
                      : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {m.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-[#06d6a0] shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-white/40 shrink-0" />
                    )}
                    <span className={`text-sm ${m.completed ? 'line-through text-white/60' : 'font-medium'}`}>
                      {m.title}
                    </span>
                  </div>
                  <span className="text-xs text-white/50 font-mono">{m.duration}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Self-Assessment Checkpoint Quiz */}
          {quizQuestions.length > 0 && (
            <div className="bg-[#0e1d35] rounded-2xl border border-white/10 p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#00f2fe]" />
                <h4 className="font-bold text-base">Knowledge Check & Retention Quiz</h4>
              </div>

              <div className="space-y-4">
                {quizQuestions.map((q, qIdx) => {
                  const selected = quizAnswers[qIdx];
                  const hasAnswered = selected !== undefined;
                  const isCorrect = selected === q.answerIndex;

                  return (
                    <div key={qIdx} className="p-4 rounded-xl bg-black/30 border border-white/5 flex flex-col gap-3">
                      <span className="text-sm font-semibold text-white/90">
                        {qIdx + 1}. {q.question}
                      </span>
                      <div className="space-y-1.5">
                        {q.options.map((opt, optIdx) => {
                          const isOptSelected = selected === optIdx;
                          return (
                            <button
                              key={optIdx}
                              onClick={() => {
                                setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
                                setShowQuizExplanations({ ...showQuizExplanations, [qIdx]: true });
                                onShowToast(optIdx === q.answerIndex ? 'Correct answer! 🎉' : 'Incorrect, check explanation.');
                              }}
                              className={`w-full text-left p-2.5 rounded-lg text-xs transition-all border ${
                                hasAnswered
                                  ? optIdx === q.answerIndex
                                    ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-300 font-semibold'
                                    : isOptSelected
                                    ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                                    : 'bg-white/5 border-transparent text-white/50'
                                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>

                      {showQuizExplanations[qIdx] && (
                        <div className="p-3 rounded-lg bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-xs text-[#aceef3] leading-relaxed">
                          <span className="font-bold block mb-0.5">Explanation:</span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
