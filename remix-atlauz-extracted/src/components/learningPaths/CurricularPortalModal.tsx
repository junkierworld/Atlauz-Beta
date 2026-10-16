import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  GraduationCap,
  Award,
  BookOpen,
  CheckCircle2,
  Lock,
  Play,
  Sparkles,
  Waves,
  Layers,
  ChevronRight,
  Plus,
  ArrowRight,
  Clock,
  Check,
  Search,
  ExternalLink,
  ShieldCheck,
  Compass
} from 'lucide-react';
import { LearningPath, LearningModule, EarnedCertificate } from '../../types/learningPath';
import { ResourceItem, UserAccountSettings } from '../../types';
import { KnowledgeCheckModal } from './KnowledgeCheckModal';
import { CertificateModal } from './CertificateModal';
import { CustomPathBuilderModal } from './CustomPathBuilderModal';
import { PrintableChecklistModal } from '../study/PrintableChecklistModal';
import { TimedExamModal } from '../study/TimedExamModal';
import { INITIAL_PRACTICE_EXAMS } from '../../data/initialStudyData';
import { PracticeExam } from '../../types/study';
import { Printer, Timer, FileText } from 'lucide-react';

interface CurricularPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  paths: LearningPath[];
  earnedCertificates: EarnedCertificate[];
  resources: ResourceItem[];
  settings: UserAccountSettings;
  onEnrollPath: (pathId: string) => void;
  onCompleteModule: (pathId: string, moduleId: string) => void;
  onClaimCertificate: (path: LearningPath) => void;
  onCreateCustomPath: (newPath: LearningPath) => void;
  onOpenResource: (resource: ResourceItem) => void;
  onShowToast: (msg: string) => void;
}

export const CurricularPortalModal: React.FC<CurricularPortalModalProps> = ({
  isOpen,
  onClose,
  paths,
  earnedCertificates,
  resources,
  settings,
  onEnrollPath,
  onCompleteModule,
  onClaimCertificate,
  onCreateCustomPath,
  onOpenResource,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'catalog' | 'enrolled' | 'certificates'>('enrolled');
  const [selectedPathId, setSelectedPathId] = useState<string>(paths[0]?.id || '');
  const [activeModuleForCheck, setActiveModuleForCheck] = useState<LearningModule | null>(null);
  const [viewingCertificate, setViewingCertificate] = useState<EarnedCertificate | null>(null);
  const [isCustomBuilderOpen, setIsCustomBuilderOpen] = useState(false);
  const [domainFilter, setDomainFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isPrintChecklistOpen, setIsPrintChecklistOpen] = useState<boolean>(false);
  const [activeExam, setActiveExam] = useState<PracticeExam | null>(null);

  const handleOpenExam = () => {
    if (!activePath) return;
    const foundExam = INITIAL_PRACTICE_EXAMS.find(e => e.pathId === activePath.id) || INITIAL_PRACTICE_EXAMS[0];
    setActiveExam(foundExam);
    onShowToast(`Commencing timed capstone exam: "${foundExam.title}"`);
  };

  const handlePassExam = (examId: string, score: number) => {
    onShowToast(`🎓 Passed capstone exam with ${score}%! Graduation ready.`);
    setActiveExam(null);
  };

  if (!isOpen) return null;

  const activePath = paths.find(p => p.id === selectedPathId) || paths[0];

  // Modules calculations
  const totalModules = activePath?.modules.length || 0;
  const completedModulesCount = activePath?.modules.filter(m => m.isCompleted).length || 0;
  const progressPercent = totalModules > 0 ? Math.round((completedModulesCount / totalModules) * 100) : 0;
  const isPathFullyCompleted = totalModules > 0 && completedModulesCount === totalModules;
  const existingCertificate = earnedCertificates.find(c => c.pathId === activePath?.id);

  // Filtered paths for catalog
  const filteredPaths = paths.filter(p => {
    const matchesDomain = domainFilter === 'all' || p.domain === domainFilter;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.codename.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeTab === 'enrolled') return p.isEnrolled && matchesDomain && matchesSearch;
    return matchesDomain && matchesSearch;
  });

  const handleLaunchKnowledgeCheck = (mod: LearningModule) => {
    setActiveModuleForCheck(mod);
  };

  const handlePassKnowledgeCheck = (moduleId: string) => {
    if (activePath) {
      onCompleteModule(activePath.id, moduleId);
      onShowToast(`🌟 Module completed: ${activePath.modules.find(m => m.id === moduleId)?.title}`);
    }
  };

  const handleOpenLinkedResource = (resourceId?: string) => {
    if (!resourceId) return;
    const target = resources.find(r => r.id === resourceId);
    if (target) {
      onOpenResource(target);
      onClose(); // Close portal to focus on the document
    } else {
      onShowToast('Linked shelf volume not found');
    }
  };

  const handleClaimReward = () => {
    if (!activePath) return;
    onClaimCertificate(activePath);
    // Open certificate immediately
    const cert = earnedCertificates.find(c => c.pathId === activePath.id) || {
      id: `cert-${Date.now()}`,
      pathId: activePath.id,
      pathTitle: activePath.title,
      studentName: settings.username,
      verificationHash: `ATL-2026-CERT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      badgeTitle: activePath.reward.badgeTitle,
      badgeIcon: activePath.reward.badgeIcon,
      honorLevel: activePath.reward.honorLevel,
      instructor: 'Dr. Eric Alvarez & Curriculum Board',
      unlockedFishName: activePath.reward.unlockedFish.name
    };
    setViewingCertificate(cert);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 bg-[#070707] flex flex-col h-[100dvh] max-h-[100dvh] w-full overflow-hidden font-sans select-none text-white">
        {/* Top Bar Contract (3 Zones) */}
        <div className="h-16 px-4 sm:px-6 bg-[#0d0d0d] border-b border-neutral-800 flex items-center justify-between shrink-0">
          {/* Zone 1: Brand & Portal Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
              <GraduationCap className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  ATLAUZ CURRICULAR ACADEMY
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-white font-mono text-[10px] font-bold">
                  ACCREDITED
                </span>
              </div>
              <p className="text-xs text-neutral-400 hidden sm:block">
                Structured Learning Paths • Conceptual Knowledge Checks • Verifiable Degrees
              </p>
            </div>
          </div>

          {/* Zone 2: Navigation Links / Segmented View */}
          <div className="flex items-center bg-black p-1 rounded-lg border border-neutral-800 text-xs font-mono">
            <button
              onClick={() => setActiveTab('enrolled')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'enrolled'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>My Enrolled</span>
              <span className="text-[10px] px-1.5 rounded bg-neutral-900 border border-neutral-800">
                {paths.filter(p => p.isEnrolled).length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'catalog'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <span>Catalog</span>
              <span className="text-[10px] px-1.5 rounded bg-neutral-900 border border-neutral-800">
                {paths.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('certificates')}
              className={`px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
                activeTab === 'certificates'
                  ? 'bg-white text-black font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Certificates</span>
              <span className="text-[10px] px-1.5 rounded bg-neutral-900 border border-neutral-800">
                {earnedCertificates.length}
              </span>
            </button>
          </div>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomBuilderOpen(true)}
              className="hidden md:flex min-h-[36px] px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 font-mono text-xs font-bold items-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Path</span>
            </button>

            <button
              onClick={onClose}
              aria-label="Close Curricular Portal"
              className="min-h-[36px] px-4 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow-lg active:scale-95 transition-all"
            >
              <X className="w-4 h-4" />
              <span>Exit Portal</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW A: CERTIFICATES VAULT TAB                                            */}
        {/* ========================================================================= */}
        {activeTab === 'certificates' ? (
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-5xl mx-auto w-full space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <h2 className="text-lg font-bold font-mono text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  <span>EARNED DEGREES & ACCREDITED CERTIFICATES</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Cryptographically hashed, printable credentials and verified honor standing
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded bg-neutral-900 border border-neutral-800 text-neutral-300">
                Total Certifications: {earnedCertificates.length}
              </span>
            </div>

            {earnedCertificates.length === 0 ? (
              <div className="p-12 text-center rounded-2xl border border-neutral-850 bg-neutral-950/60 space-y-3">
                <GraduationCap className="w-10 h-10 text-neutral-600 mx-auto" />
                <h3 className="text-sm font-semibold text-neutral-300">No Certificates Earned Yet</h3>
                <p className="text-xs text-neutral-500 max-w-md mx-auto">
                  Enroll in an accredited path in the Catalog, complete all sequential module knowledge checks, and claim your verified degree and rare companion fish.
                </p>
                <button
                  onClick={() => setActiveTab('catalog')}
                  className="px-4 py-2 rounded-lg bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 mt-2 inline-flex items-center gap-1.5"
                >
                  <span>Browse Path Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {earnedCertificates.map(cert => (
                  <div
                    key={cert.id}
                    className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 space-y-4 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold block">
                          {cert.honorLevel}
                        </span>
                        <h4 className="text-base font-bold text-white leading-snug">
                          {cert.pathTitle}
                        </h4>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs font-mono text-neutral-400 pt-2 border-t border-neutral-850">
                      <div className="flex justify-between">
                        <span>Recipient:</span>
                        <strong className="text-white">@{cert.studentName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Issued Date:</span>
                        <span className="text-neutral-300">{cert.issuedAt}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Companion:</span>
                        <span className="text-cyan-400 flex items-center gap-1">
                          <Waves className="w-3 h-3" /> {cert.unlockedFishName}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-neutral-500 truncate max-w-[180px]">
                        {cert.verificationHash}
                      </span>
                      <button
                        onClick={() => setViewingCertificate(cert)}
                        className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-mono text-xs font-semibold flex items-center gap-1.5"
                      >
                        <span>Inspect Certificate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ========================================================================= */
          /* VIEW B: TWO-ZONE ROADMAP & INTERACTIVE CURRICULAR STAGE                  */
          /* ========================================================================= */
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden min-h-0">
            {/* Left/Top Column: Path Switcher & Node Graph (65% width) */}
            <div className="flex-1 flex flex-col border-r border-neutral-800 overflow-hidden min-h-0 bg-[#070707]">
              {/* Path Filter & Search Strip */}
              <div className="p-3 sm:p-4 bg-neutral-900/60 border-b border-neutral-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                  {['all', 'Computer Science', 'Cognitive Science', 'Marine Biology', 'Systems Architecture'].map(dom => (
                    <button
                      key={dom}
                      onClick={() => setDomainFilter(dom)}
                      className={`px-3 py-1 rounded-full text-xs font-mono transition-colors whitespace-nowrap ${
                        domainFilter === dom
                          ? 'bg-neutral-200 text-black font-bold'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-850'
                      }`}
                    >
                      {dom === 'all' ? 'All Domains' : dom}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    placeholder="Filter roadmaps..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-8 pr-3 py-1.5 rounded-lg bg-black border border-neutral-800 text-xs font-mono text-white placeholder-neutral-600 outline-none w-40 sm:w-48"
                  />
                </div>
              </div>

              {/* Path Selector Carousel / Grid */}
              <div className="p-4 border-b border-neutral-800 flex gap-3 overflow-x-auto no-scrollbar shrink-0 bg-[#090909]">
                {filteredPaths.map(path => {
                  const isSelected = path.id === activePath?.id;
                  const completedCount = path.modules.filter(m => m.isCompleted).length;
                  const pPct = Math.round((completedCount / path.modules.length) * 100);

                  return (
                    <div
                      key={path.id}
                      onClick={() => setSelectedPathId(path.id)}
                      className={`p-3.5 rounded-xl border min-w-[240px] sm:min-w-[280px] max-w-[320px] cursor-pointer transition-all flex flex-col justify-between shrink-0 font-mono ${
                        isSelected
                          ? 'bg-[#141414] border-neutral-600 ring-1 ring-neutral-500'
                          : 'bg-[#0d0d0d] border-neutral-850 hover:border-neutral-700'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-neutral-400">
                          <span className="uppercase tracking-wider">{path.domain}</span>
                          <span>{path.estimatedHours}h</span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                          {path.title}
                        </h4>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px]">
                        <span className="text-neutral-400">
                          {completedCount}/{path.modules.length} Modules
                        </span>
                        <span className={`font-bold ${pPct === 100 ? 'text-emerald-400' : 'text-neutral-300'}`}>
                          {pPct}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Module Node Graph Stage */}
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
                {activePath ? (
                  <div className="max-w-2xl mx-auto space-y-8">
                    {/* Active Path Header Card */}
                    <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-3 font-mono">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[10px] font-bold">
                            {activePath.codename}
                          </span>
                          <span className="text-neutral-400 text-xs">
                            Level: {activePath.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <button
                            onClick={() => setIsPrintChecklistOpen(true)}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                            title="Generate clean printable syllabus checklist for physical binders"
                          >
                            <Printer className="w-3.5 h-3.5 text-neutral-400" />
                            <span>Print Syllabus</span>
                          </button>
                          <button
                            onClick={handleOpenExam}
                            className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700 hover:border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                            title="Take timed capstone practice exam"
                          >
                            <Timer className="w-3.5 h-3.5 text-amber-400" />
                            <span>Capstone Exam</span>
                          </button>
                          {!activePath.isEnrolled ? (
                            <button
                              onClick={() => {
                                onEnrollPath(activePath.id);
                                onShowToast(`Enrolled in "${activePath.title}"`);
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-white text-black font-bold text-xs hover:bg-neutral-200"
                            >
                              Enroll in Path
                            </button>
                          ) : (
                            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              Active Enrollment
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-white">
                        {activePath.title}
                      </h3>
                      <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                        {activePath.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1 pt-1">
                        <div className="flex justify-between text-[11px] text-neutral-400">
                          <span>Syllabus Completion</span>
                          <span className="font-bold text-white">{progressPercent}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Sequential Node Roadmap */}
                    <div className="relative pl-6 sm:pl-8 space-y-6">
                      {/* Vertical Connecting Cable */}
                      <div className="absolute left-[19px] sm:left-[27px] top-6 bottom-6 w-0.5 bg-neutral-800" />

                      {activePath.modules.map((mod, idx) => {
                        const isUnlocked = idx === 0 || activePath.modules[idx - 1].isCompleted;
                        const isCompleted = mod.isCompleted;

                        return (
                          <div key={mod.id} className="relative flex items-start gap-4">
                            {/* Node Status Pin */}
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 transition-colors ${
                              isCompleted
                                ? 'bg-emerald-950 border-emerald-500 text-emerald-400'
                                : isUnlocked
                                ? 'bg-black border-white text-white'
                                : 'bg-neutral-900 border-neutral-700 text-neutral-500'
                            }`}>
                              {isCompleted ? (
                                <Check className="w-4 h-4 stroke-[3]" />
                              ) : isUnlocked ? (
                                <span className="font-mono text-xs font-bold">{idx + 1}</span>
                              ) : (
                                <Lock className="w-3.5 h-3.5" />
                              )}
                            </div>

                            {/* Node Card */}
                            <div className={`flex-1 p-4 rounded-xl border transition-all ${
                              isCompleted
                                ? 'bg-[#0f1511] border-emerald-900/60'
                                : isUnlocked
                                ? 'bg-[#111111] border-neutral-700 ring-1 ring-neutral-700/50'
                                : 'bg-[#0a0a0a] border-neutral-850 opacity-60'
                            }`}>
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 font-mono">
                                <div>
                                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                    Stage {idx + 1} • {mod.durationMinutes} min • {mod.resourceType}
                                  </span>
                                  <h4 className="text-sm font-bold text-white">
                                    {mod.title}
                                  </h4>
                                </div>

                                <div className="flex items-center gap-2 shrink-0">
                                  {mod.resourceId && (
                                    <button
                                      type="button"
                                      onClick={() => handleOpenLinkedResource(mod.resourceId)}
                                      className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-mono flex items-center gap-1"
                                      title="Open linked study material in reader"
                                    >
                                      <BookOpen className="w-3 h-3" />
                                      <span>Study</span>
                                    </button>
                                  )}

                                  {isUnlocked && !isCompleted && (
                                    <button
                                      type="button"
                                      onClick={() => handleLaunchKnowledgeCheck(mod)}
                                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-200 text-black font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all"
                                    >
                                      <Play className="w-3 h-3 fill-current" />
                                      <span>Take Check</span>
                                    </button>
                                  )}

                                  {isCompleted && (
                                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                                      <CheckCircle2 className="w-3.5 h-3.5" />
                                      <span>Passed</span>
                                    </span>
                                  )}
                                </div>
                              </div>

                              <p className="text-xs text-neutral-400 font-sans mt-2 leading-relaxed">
                                {mod.summary}
                              </p>

                              {/* Key Concepts Chips */}
                              <div className="mt-3 flex flex-wrap gap-1.5">
                                {mod.concepts.map((concept, cIdx) => (
                                  <span
                                    key={cIdx}
                                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400"
                                  >
                                    {concept}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center text-neutral-500 font-mono text-xs">
                    Select a learning path to inspect syllabus roadmap.
                  </div>
                )}
              </div>
            </div>

            {/* Right/Bottom Column: Concept Deck & Capstone Recognition (35% width) */}
            <div className="w-full lg:w-96 border-t lg:border-t-0 border-neutral-800 bg-[#0c0c0c] flex flex-col p-6 space-y-6 overflow-y-auto shrink-0">
              {activePath && (
                <>
                  {/* Capstone Reward & Accreditation Card */}
                  <div className="p-5 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-4 font-mono">
                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                      <Award className="w-4 h-4" />
                      <span>CAPSTONE ACCREDITATION REWARDS</span>
                    </div>

                    <div className="space-y-3">
                      {/* Reward 1: Verifiable Degree */}
                      <div className="p-3 rounded-xl bg-black border border-neutral-850 space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Degree Certificate
                        </span>
                        <span className="text-xs font-bold text-white block">
                          {activePath.reward.certificateTitle}
                        </span>
                        <span className="text-[11px] text-amber-400/90 block">
                          Standing: {activePath.reward.honorLevel}
                        </span>
                      </div>

                      {/* Reward 2: Profile Badge */}
                      <div className="p-3 rounded-xl bg-black border border-neutral-850 space-y-1">
                        <span className="text-[10px] text-neutral-500 uppercase block">
                          Scholar Profile Badge
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400" />
                          <span className="text-xs font-bold text-neutral-200">
                            {activePath.reward.badgeTitle}
                          </span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans">
                          {activePath.reward.badgeDescription}
                        </p>
                      </div>

                      {/* Reward 3: Rare Companion Fish Unlock */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-neutral-950 to-cyan-950/40 border border-cyan-900/50 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-cyan-400 uppercase tracking-wider font-bold flex items-center gap-1.5">
                            <Waves className="w-3.5 h-3.5" />
                            <span>Exclusive Companion Species</span>
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                            Rare Unlock
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs text-black shadow-lg shrink-0"
                            style={{ backgroundColor: activePath.reward.unlockedFish.color }}
                          >
                            🐟
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-white block truncate">
                              "{activePath.reward.unlockedFish.name}" the {activePath.reward.unlockedFish.species}
                            </span>
                            <span className="text-[10px] text-neutral-400 block truncate">
                              {activePath.reward.unlockedFish.personality}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Capstone Claim Action */}
                    {isPathFullyCompleted ? (
                      existingCertificate ? (
                        <button
                          type="button"
                          onClick={() => setViewingCertificate(existingCertificate)}
                          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                        >
                          <Award className="w-4 h-4" />
                          <span>View Verified Certificate</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={handleClaimReward}
                          className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-xl transition-all active:scale-95 animate-pulse"
                        >
                          <Sparkles className="w-4 h-4" />
                          <span>Claim Degree & Unlock Rare Fish!</span>
                        </button>
                      )
                    ) : (
                      <div className="p-3 rounded-xl bg-neutral-900/60 border border-neutral-850 text-center text-xs text-neutral-500 font-mono">
                        Complete all {totalModules} modules ({completedModulesCount}/{totalModules} done) to graduate.
                      </div>
                    )}
                  </div>

                  {/* Academic Integrity & Non-AI Verification Note */}
                  <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-850 text-xs font-mono space-y-2 text-neutral-400">
                    <div className="flex items-center gap-2 text-neutral-300">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold uppercase text-[11px]">Academic Authenticity</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-neutral-400 font-sans">
                      All learning path accreditations adhere to deterministic scholarly verification. Zero AI hallucinations, pure human learning retention, and verifiable hash cryptographic stamping.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Knowledge Check Modal */}
        {activeModuleForCheck && (
          <KnowledgeCheckModal
            isOpen={Boolean(activeModuleForCheck)}
            onClose={() => setActiveModuleForCheck(null)}
            module={activeModuleForCheck}
            onPassCheck={handlePassKnowledgeCheck}
          />
        )}

        {/* Certificate Modal */}
        {viewingCertificate && (
          <CertificateModal
            isOpen={Boolean(viewingCertificate)}
            onClose={() => setViewingCertificate(null)}
            certificate={viewingCertificate}
            onShowToast={onShowToast}
          />
        )}

        {/* Custom Path Builder Modal */}
        {isCustomBuilderOpen && (
          <CustomPathBuilderModal
            isOpen={isCustomBuilderOpen}
            onClose={() => setIsCustomBuilderOpen(false)}
            resources={resources}
            onCreatePath={onCreateCustomPath}
            onShowToast={onShowToast}
          />
        )}

        {/* Printable Syllabus Checklist Modal */}
        {isPrintChecklistOpen && activePath && (
          <PrintableChecklistModal
            isOpen={isPrintChecklistOpen}
            onClose={() => setIsPrintChecklistOpen(false)}
            path={activePath}
            studentName={settings.username}
          />
        )}

        {/* Timed Practice Capstone Exam Modal */}
        {activeExam && (
          <TimedExamModal
            isOpen={Boolean(activeExam)}
            onClose={() => setActiveExam(null)}
            exam={activeExam}
            onPassExam={handlePassExam}
            onShowToast={onShowToast}
          />
        )}
      </div>
    </AnimatePresence>
  );
};
