import React, { useState } from 'react';
import {
  X,
  Lock,
  BookOpen,
  Plus,
  Pin,
  Flame,
  Clock,
  Download,
  Upload,
  Layers,
  Settings,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Award,
  ChevronRight,
  Brain,
  Users,
  Share2,
  BookOpenCheck,
  Eye
} from 'lucide-react';
import {
  CompanionState,
  CognitiveTelemetry,
  ScheduleBlock,
  ConnectedApp,
  UserAccountSettings,
  ResourceItem
} from '../types';
import { EarnedCertificate } from '../types/learningPath';
import { AtlauzLogo } from './AtlauzLogo';
import { exportUserDataBackup, importUserDataBackup } from '../utils/storage';

interface SidebarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  companion: CompanionState;
  onUpdateCompanion: (updated: Partial<CompanionState>) => void;
  telemetry: CognitiveTelemetry;
  onToggleStreakFreeze: () => void;
  schedule: ScheduleBlock[];
  connectedApps: ConnectedApp[];
  onToggleAppConnection: (appId: string) => void;
  settings: UserAccountSettings;
  onUpdateSettings: (updated: Partial<UserAccountSettings>) => void;
  resources: ResourceItem[];
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onNavigateTab: (tab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile') => void;
  onLockScreen: () => void;
  onOpenFishing?: () => void;
  onOpenVersionHistory?: () => void;
  onShowToast: (msg: string) => void;
  earnedCertificates?: EarnedCertificate[];
  onOpenCurricularPortal?: () => void;
  onOpenFlashcards?: () => void;
  onOpenStudyRooms?: () => void;
  onOpenNoteGraph?: () => void;
  onOpenDailyReflection?: () => void;
  onOpenEyeBreak?: () => void;
}

export const SidebarDrawer: React.FC<SidebarDrawerProps> = ({
  isOpen,
  onClose,
  companion,
  telemetry,
  onToggleStreakFreeze,
  settings,
  resources,
  onOpenResource,
  onCreateResourceClick,
  onNavigateTab,
  onLockScreen,
  onOpenVersionHistory,
  onShowToast,
  earnedCertificates = [],
  onOpenCurricularPortal,
  onOpenFlashcards,
  onOpenStudyRooms,
  onOpenNoteGraph,
  onOpenDailyReflection,
  onOpenEyeBreak
}) => {
  const [importJsonInput, setImportJsonInput] = useState<string>('');
  const [showImportModal, setShowImportModal] = useState<boolean>(false);

  if (!isOpen) return null;

  const pinnedResources = resources.filter(r => r.isPinned);

  const handleExportBackup = () => {
    const data = exportUserDataBackup();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `atlauz-scholar-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('📥 Exported academic backup JSON');
  };

  const handleExecuteImport = () => {
    if (!importJsonInput.trim()) {
      onShowToast('Please paste valid JSON backup data');
      return;
    }
    const ok = importUserDataBackup(importJsonInput.trim());
    if (ok) {
      onShowToast('✅ Academic profile and data restored! Reloading session...');
      setTimeout(() => window.location.reload(), 800);
    } else {
      onShowToast('❌ Invalid backup JSON format');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex font-sans animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 transition-opacity"
      />

      {/* Slide-over User Profile Cockpit */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="User Profile & Academic Cockpit"
        className="relative w-[85vw] max-w-[340px] sm:w-80 bg-neutral-950 border-r border-neutral-800 h-full flex flex-col z-10 shadow-2xl text-white"
      >
        {/* Top Header */}
        <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 shrink-0">
          <div className="flex items-center gap-2.5">
            <AtlauzLogo variant="icon" size={20} animated={false} />
            <div>
              <span className="font-bold text-xs tracking-tight text-white font-mono uppercase">
                STUDENT PROFILE
              </span>
              <p className="text-[10px] text-neutral-400">Academic Overview & Session Hub</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-xs focus-visible:ring-2 focus-visible:ring-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Identity & Academic Card */}
        <div
          style={{
            background: 'var(--theme-hero-bg, rgba(18, 18, 18, 0.8))',
            borderColor: 'var(--theme-card-border, #262626)'
          }}
          className="p-4 border-b shrink-0 transition-all duration-300"
        >
          <div className="flex items-center gap-3">
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                borderColor: 'var(--theme-card-border, #ffffff)',
                color: 'var(--theme-text-primary, #ffffff)'
              }}
              className="w-11 h-11 rounded-xl border flex items-center justify-center font-mono font-bold text-sm shadow-inner shrink-0"
            >
              {settings.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <span
                style={{ color: 'var(--theme-text-primary, #ffffff)' }}
                className="font-bold text-sm truncate block font-mono"
              >
                @{settings.username}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span
                  style={{
                    backgroundColor: 'var(--theme-badge-bg, #262626)',
                    color: 'var(--theme-badge-text, #ffffff)',
                    borderColor: 'var(--theme-card-border, #404040)'
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded border font-bold uppercase"
                >
                  {settings.role || 'Scholar'}
                </span>
                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                  Synced
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-white/10 text-xs font-mono">
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                borderColor: 'var(--theme-card-border, #262626)'
              }}
              className="p-2 rounded-lg border"
            >
              <span className="text-[10px] text-neutral-400 block flex items-center gap-1">
                <Flame className="w-3 h-3 text-amber-400" /> Streak
              </span>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="font-bold text-sm">{telemetry.streakDays} Days</span>
            </div>

            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                borderColor: 'var(--theme-card-border, #262626)'
              }}
              className="p-2 rounded-lg border"
            >
              <span className="text-[10px] text-neutral-400 block flex items-center gap-1">
                <Clock className="w-3 h-3 text-sky-400" /> Focus Hours
              </span>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="font-bold text-sm">{(telemetry.sessionMinutes / 60).toFixed(1)}h</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {/* PINNED SHORTCUTS */}
          <div className="space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Pin className="w-3 h-3 text-white fill-current" />
                <span>Pinned Study Assets ({pinnedResources.length})</span>
              </span>
              <button
                onClick={() => {
                  onNavigateTab('library');
                  onClose();
                }}
                className="text-[10px] text-neutral-400 hover:text-white underline"
              >
                All
              </button>
            </div>

            {pinnedResources.length === 0 ? (
              <div className="p-3 rounded-lg border border-neutral-850 bg-neutral-950/40 text-center">
                <p className="text-[11px] text-neutral-500">No pinned items.</p>
                <p className="text-[10px] text-neutral-600 mt-0.5">Pin favorite books from the library for quick access.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {pinnedResources.slice(0, 4).map(res => (
                  <div
                    key={res.id}
                    onClick={() => {
                      onOpenResource(res);
                      onClose();
                    }}
                    className="p-2.5 rounded-lg bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0" />
                      <span className="text-xs font-semibold text-white group-hover:underline truncate">
                        {res.title}
                      </span>
                    </div>
                    <span className="text-[10px] text-neutral-500 font-mono shrink-0 ml-1">OPEN</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SCHOLAR ACCREDITATIONS & CREDENTIALS SHOWCASE */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>Accreditations & Degrees</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-amber-400 font-bold">
                {earnedCertificates.length} Earned
              </span>
            </div>

            {earnedCertificates.length === 0 ? (
              <div className="p-3 rounded-lg bg-black/60 border border-neutral-850 space-y-2">
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  No degrees claimed yet. Complete learning paths in the Library to earn verifiable certificates.
                </p>
                {onOpenCurricularPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCurricularPortal();
                    }}
                    className="w-full py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <GraduationCap className="w-3.5 h-3.5" />
                    <span>Explore Learning Paths</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="space-y-1.5 max-h-36 overflow-y-auto no-scrollbar">
                  {earnedCertificates.map(cert => (
                    <div
                      key={cert.id}
                      className="p-2.5 rounded-lg bg-black/80 border border-neutral-850 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <span className="text-xs font-bold text-white block truncate">
                          {cert.pathTitle}
                        </span>
                        <span className="text-[10px] text-amber-400 block truncate">
                          {cert.honorLevel}
                        </span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>

                {onOpenCurricularPortal && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenCurricularPortal();
                    }}
                    className="w-full py-2 rounded-lg bg-white hover:bg-neutral-200 text-black text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-all"
                  >
                    <span>View Degrees Vault</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* COGNITIVE STUDY TOOLS (v1.1.4) */}
          <div className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-emerald-400" />
                <span>Cognitive Study Tools</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-950 border border-neutral-800 text-emerald-400">
                v1.1.4
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {onOpenFlashcards && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenFlashcards();
                  }}
                  className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors flex items-center gap-2 text-white"
                >
                  <Brain className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="text-[11px] truncate">Flashcards</span>
                </button>
              )}

              {onOpenStudyRooms && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenStudyRooms();
                  }}
                  className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors flex items-center gap-2 text-white"
                >
                  <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span className="text-[11px] truncate">Study Lounge</span>
                </button>
              )}

              {onOpenNoteGraph && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenNoteGraph();
                  }}
                  className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors flex items-center gap-2 text-white"
                >
                  <Share2 className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span className="text-[11px] truncate">Note Graph</span>
                </button>
              )}

              {onOpenDailyReflection && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenDailyReflection();
                  }}
                  className="p-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-left transition-colors flex items-center gap-2 text-white"
                >
                  <BookOpenCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="text-[11px] truncate">Reflection</span>
                </button>
              )}
            </div>

            {onOpenEyeBreak && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenEyeBreak();
                }}
                className="w-full py-1.5 px-2.5 rounded-lg bg-blue-950/40 hover:bg-blue-900/50 border border-blue-900/60 text-blue-300 text-[11px] flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3 h-3" />
                  <span>20-20-20 Eye Break</span>
                </span>
                <span className="text-[10px] text-blue-400 font-bold">20s</span>
              </button>
            )}
          </div>

          {/* QUICK ACTIONS */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Quick Actions
            </span>

            <button
              onClick={() => {
                onClose();
                onCreateResourceClick();
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-white flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Create New Note / Volume</span>
            </button>

            <button
              onClick={() => {
                onClose();
                onNavigateTab('profile');
              }}
              className="w-full min-h-[40px] px-3 py-2 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-xs font-medium text-white flex items-center justify-between transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-neutral-400" />
                <span>Account & Preferences</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>
          </div>

          {/* DATA PERSISTENCE & LOCAL BACKUP */}
          <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-400 block">
              Data Backup & Sync
            </span>
            <p className="text-[11px] text-neutral-400">
              Save your local notes, flashcards, and reading states to a JSON file.
            </p>

            <div className="grid grid-cols-2 gap-1.5 pt-1 font-mono">
              <button
                onClick={handleExportBackup}
                className="min-h-[36px] px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-750 text-xs text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-white"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="min-h-[36px] px-2 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 border border-neutral-750 text-xs text-neutral-200 hover:text-white flex items-center justify-center gap-1.5 transition-colors focus-visible:ring-2 focus-visible:ring-white"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Session & Version History Controls */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-col gap-2 shrink-0 font-mono">
          <button
            onClick={() => {
              onClose();
              onLockScreen();
            }}
            className="w-full min-h-[38px] px-3 py-1.5 rounded-lg bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white text-xs border border-neutral-800 flex items-center justify-center gap-2 transition-all focus-visible:ring-2 focus-visible:ring-white"
          >
            <Lock className="w-3.5 h-3.5 text-neutral-400" />
            <span>Lock Screen & Session</span>
          </button>

          {/* Clickable Version History Patch Portal */}
          <button
            onClick={() => {
              onClose();
              if (onOpenVersionHistory) {
                onOpenVersionHistory();
              }
            }}
            className="w-full p-2.5 rounded-lg bg-black hover:bg-neutral-950 border border-neutral-800 hover:border-neutral-700 text-left transition-all group flex flex-col gap-1 focus-visible:ring-2 focus-visible:ring-white"
            title="Click to view full System Patch Log (Focus Mode)"
          >
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span className="font-bold text-white group-hover:underline">v1.2.0 Patch Log</span>
              </div>
              <span className="text-[10px] text-amber-300 font-bold uppercase bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                View Log →
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400">
              <span>Oct 06, 2026 • 10:10 UTC</span>
              <span className="text-neutral-300 font-semibold">By Developer Gultiano</span>
            </div>
          </button>
        </div>

        {/* Import JSON Modal Overlay */}
        {showImportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85">
            <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 max-w-sm w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-white uppercase">
                  Restore Academic Backup
                </span>
                <button
                  onClick={() => setShowImportModal(false)}
                  className="text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <textarea
                value={importJsonInput}
                onChange={e => setImportJsonInput(e.target.value)}
                placeholder="Paste backup JSON here..."
                className="w-full h-32 bg-black border border-neutral-700 rounded p-2 text-xs font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-white"
              />
              <div className="flex items-center justify-end gap-2 font-mono">
                <button
                  onClick={() => setShowImportModal(false)}
                  className="px-3 py-1.5 rounded bg-neutral-800 text-neutral-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteImport}
                  className="px-3 py-1.5 rounded bg-white text-black font-bold text-xs"
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
