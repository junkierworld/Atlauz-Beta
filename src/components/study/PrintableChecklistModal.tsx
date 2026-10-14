import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Printer, CheckSquare, Square, BookOpen, Award, FileText } from 'lucide-react';
import { LearningPath } from '../../types/learningPath';
import { AtlauzLogo } from '../AtlauzLogo';

interface PrintableChecklistModalProps {
  isOpen: boolean;
  onClose: () => void;
  path: LearningPath | null;
  studentName: string;
}

export const PrintableChecklistModal: React.FC<PrintableChecklistModalProps> = ({
  isOpen,
  onClose,
  path,
  studentName
}) => {
  if (!isOpen || !path) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden text-white"
        >
          {/* Header Controls */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-300 uppercase">
              <FileText className="w-4 h-4" />
              <span>PRINTABLE SYLLABUS CHECKLIST</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrint}
                className="px-3.5 py-1.5 rounded-lg bg-white text-black font-mono text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-200"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
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

          {/* Printable Sheet Canvas */}
          <div className="p-8 sm:p-10 space-y-6 overflow-y-auto bg-black text-white font-mono text-xs">
            {/* Sheet Header */}
            <div className="border-b-2 border-neutral-800 pb-5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AtlauzLogo variant="icon" size={24} animated={false} />
                  <span className="font-bold text-sm tracking-wider uppercase text-neutral-300">
                    ATLAUZ HIGHER ACADEMY
                  </span>
                </div>
                <span className="text-[11px] text-neutral-400">
                  Code: {path.codename}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white pt-1">
                {path.title}
              </h2>

              <div className="flex items-center justify-between text-neutral-400 text-[11px] pt-1">
                <span>Scholar: @{studentName}</span>
                <span>Domain: {path.domain} • {path.estimatedHours} Hours</span>
              </div>
            </div>

            {/* Syllabus Checklist Items */}
            <div className="space-y-4">
              <span className="text-neutral-400 uppercase tracking-widest text-[10px] font-bold block">
                CURRICULAR MILESTONES & KNOWLEDGE CHECKS
              </span>

              <div className="space-y-3">
                {path.modules.map((mod, idx) => (
                  <div
                    key={mod.id}
                    className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 space-y-2"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded border-2 border-neutral-600 flex items-center justify-center shrink-0 mt-0.5">
                        {mod.isCompleted && <span className="w-2.5 h-2.5 rounded-sm bg-white" />}
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-xs">
                            Module {idx + 1}: {mod.title}
                          </span>
                          <span className="text-[10px] text-neutral-400">
                            {mod.durationMinutes} min
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                          {mod.summary}
                        </p>

                        <div className="flex flex-wrap gap-1 pt-1">
                          {mod.concepts.map((c, cIdx) => (
                            <span key={cIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Verification Footer */}
            <div className="border-t border-neutral-850 pt-5 flex items-center justify-between text-[10px] text-neutral-500">
              <div className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-neutral-400" />
                <span>Capstone Reward: {path.reward.certificateTitle}</span>
              </div>
              <span>Hash Verification Ready</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
