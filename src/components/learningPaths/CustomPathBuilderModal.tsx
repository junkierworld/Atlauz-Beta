import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Trash2, Sparkles, BookOpen, Layers } from 'lucide-react';
import { LearningPath, LearningModule } from '../../types/learningPath';
import { ResourceItem } from '../../types';

interface CustomPathBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  resources: ResourceItem[];
  onCreatePath: (newPath: LearningPath) => void;
  onShowToast: (msg: string) => void;
}

export const CustomPathBuilderModal: React.FC<CustomPathBuilderModalProps> = ({
  isOpen,
  onClose,
  resources,
  onCreatePath,
  onShowToast
}) => {
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<'Computer Science' | 'Cognitive Science' | 'Marine Biology' | 'Systems Architecture' | 'General'>('General');
  const [level, setLevel] = useState<'Foundational' | 'Intermediate' | 'Advanced'>('Foundational');
  const [description, setDescription] = useState('');
  const [estimatedHours, setEstimatedHours] = useState(8);
  const [modules, setModules] = useState<Array<{ title: string; summary: string; duration: number; resourceId: string }>>([
    { title: 'Core Principles & Overview', summary: 'Foundational review of primary objectives and definitions.', duration: 45, resourceId: resources[0]?.id || '' }
  ]);

  if (!isOpen) return null;

  const handleAddModule = () => {
    if (modules.length >= 8) {
      onShowToast('Maximum 8 modules per custom syllabus');
      return;
    }
    setModules(prev => [
      ...prev,
      {
        title: `Module ${prev.length + 1}: In-Depth Analysis`,
        summary: 'Focused exploration of core concepts and practical application.',
        duration: 45,
        resourceId: resources[0]?.id || ''
      }
    ]);
  };

  const handleRemoveModule = (idx: number) => {
    if (modules.length <= 1) return;
    setModules(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSavePath = () => {
    if (!title.trim()) {
      onShowToast('Please provide a path title');
      return;
    }

    const pathId = `custom-path-${Date.now()}`;
    const constructedModules: LearningModule[] = modules.map((m, idx) => ({
      id: `${pathId}-mod-${idx + 1}`,
      title: m.title.trim() || `Module ${idx + 1}`,
      summary: m.summary.trim() || 'Custom module syllabus.',
      durationMinutes: m.duration || 45,
      resourceType: 'notebook',
      resourceId: m.resourceId,
      concepts: ['Custom Student Concept', 'Self-Paced Research'],
      isCompleted: false,
      knowledgeCheck: [
        {
          id: `${pathId}-q-${idx + 1}`,
          question: `Did you complete the core reading and synthesis requirements for "${m.title}"?`,
          options: [
            'Yes, core concepts synthesized and verified',
            'In-progress, partially reviewed',
            'Pending review'
          ],
          answerIndex: 0,
          explanation: 'Self-paced completion confirmed.'
        }
      ]
    }));

    const newPath: LearningPath = {
      id: pathId,
      title: title.trim(),
      codename: `CUSTOM-${Date.now().toString().slice(-4)}`,
      domain,
      level,
      description: description.trim() || 'Student-crafted personalized learning syllabus.',
      estimatedHours: Number(estimatedHours) || 6,
      modules: constructedModules,
      isCustom: true,
      isEnrolled: true,
      enrolledAt: new Date().toISOString().slice(0, 10),
      reward: {
        badgeId: `badge-custom-${Date.now()}`,
        badgeTitle: `${title.trim()} Scholar`,
        badgeIcon: 'Award',
        badgeDescription: `Certified completion of custom student curriculum in ${domain}.`,
        certificateTitle: `Certificate of Mastery in ${title.trim()}`,
        honorLevel: 'Certified Scholar',
        unlockedFish: {
          id: `fish-custom-${Date.now()}`,
          name: 'Solas',
          species: 'Aurora Tetra',
          color: '#10b981',
          accentColor: '#34d399',
          tailType: 'ribbon',
          personality: 'Inquisitive & Scholarly',
          size: 30,
          adoptedAt: 'Graduation Day'
        }
      }
    };

    onCreatePath(newPath);
    onShowToast(`🎓 Created custom curriculum: "${newPath.title}"`);
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm select-none font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-2xl bg-neutral-950 border border-neutral-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white">
                <Layers className="w-4 h-4 text-neutral-300" />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">
                  BUILD CUSTOM CURRICULUM
                </span>
                <span className="text-[11px] text-neutral-400">
                  Link your shelf resources into an accredited student learning path
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Body */}
          <div className="p-6 space-y-5 overflow-y-auto flex-1 font-mono text-xs">
            {/* Title & Domain */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-neutral-400 text-[11px] uppercase font-bold">Curriculum Title</label>
                <input
                  type="text"
                  placeholder="e.g. Cognitive Systems & Neuroscience"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-neutral-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 text-[11px] uppercase font-bold">Academic Domain</label>
                <select
                  value={domain}
                  onChange={e => setDomain(e.target.value as any)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white outline-none focus:border-neutral-500"
                >
                  <option value="Computer Science">Computer Science</option>
                  <option value="Cognitive Science">Cognitive Science</option>
                  <option value="Marine Biology">Marine Biology</option>
                  <option value="Systems Architecture">Systems Architecture</option>
                  <option value="General">General Scholarship</option>
                </select>
              </div>
            </div>

            {/* Description & Estimated Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-neutral-400 text-[11px] uppercase font-bold">Syllabus Overview</label>
                <input
                  type="text"
                  placeholder="Short summary of student goals and subject scope..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white placeholder-neutral-600 outline-none focus:border-neutral-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-neutral-400 text-[11px] uppercase font-bold">Estimated Hours</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={estimatedHours}
                  onChange={e => setEstimatedHours(Number(e.target.value))}
                  className="w-full px-3.5 py-2 rounded-lg bg-black border border-neutral-800 text-white outline-none focus:border-neutral-500"
                />
              </div>
            </div>

            {/* Modules Sequence */}
            <div className="space-y-3 pt-2 border-t border-neutral-850">
              <div className="flex items-center justify-between">
                <span className="text-neutral-300 font-bold uppercase text-[11px] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Module Nodes ({modules.length})</span>
                </span>
                <button
                  type="button"
                  onClick={handleAddModule}
                  className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 hover:text-white text-[11px] flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Module</span>
                </button>
              </div>

              <div className="space-y-2.5">
                {modules.map((mod, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-black/80 border border-neutral-850 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-neutral-500 text-[10px]">Step {idx + 1}</span>
                      {modules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveModule(idx)}
                          className="text-neutral-500 hover:text-rose-400 p-1"
                          title="Remove module"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Module title..."
                        value={mod.title}
                        onChange={e => {
                          const val = e.target.value;
                          setModules(prev => prev.map((m, i) => i === idx ? { ...m, title: val } : m));
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 text-xs"
                      />

                      <select
                        value={mod.resourceId}
                        onChange={e => {
                          const val = e.target.value;
                          setModules(prev => prev.map((m, i) => i === idx ? { ...m, resourceId: val } : m));
                        }}
                        className="w-full px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 text-xs"
                      >
                        <option value="">Link Shelf Resource (Optional)</option>
                        {resources.map(res => (
                          <option key={res.id} value={res.id}>
                            {res.title} ({res.type})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between font-mono">
            <button
              type="button"
              onClick={onClose}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSavePath}
              className="px-5 py-2 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200 shadow transition-all active:scale-95 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Create & Enroll</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
