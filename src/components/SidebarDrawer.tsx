import React, { useState } from 'react';
import {
  X,
  LayoutDashboard,
  ChevronRight,
  Lock,
  Layers,
  BookOpen,
  FileText,
  Presentation,
  Plus,
  Pin,
  GraduationCap,
  Sliders
} from 'lucide-react';
import {
  CompanionState,
  CognitiveTelemetry,
  ScheduleBlock,
  ConnectedApp,
  UserAccountSettings,
  LearningStyle,
  ResourceItem
} from '../types';
import { AtlauzLogo } from './AtlauzLogo';

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
  onShowToast: (msg: string) => void;
}

export const SidebarDrawer = React.memo(function SidebarDrawerComponent({
  isOpen,
  onClose,
  companion,
  onUpdateCompanion,
  telemetry,
  onToggleStreakFreeze,
  connectedApps,
  onToggleAppConnection,
  settings,
  resources,
  onOpenResource,
  onCreateResourceClick,
  onNavigateTab,
  onLockScreen,
  onOpenFishing,
  onShowToast
}: SidebarDrawerProps) {
  if (!isOpen) return null;

  const pinnedResources = resources.filter(r => r.isPinned);

  const handleLearningStyleChange = (style: LearningStyle) => {
    onUpdateCompanion({ learningStyle: style });
    onShowToast(`Learning Style adjusted to ${style}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex font-sans">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 transition-opacity"
      />

      {/* Slide-over Standardized Sidebar Panel: 82vw on mobile for thumb reach, 320px on tablet/desktop */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Sitemap"
        className="relative w-[82vw] max-w-[340px] sm:w-80 sm:max-w-sm bg-neutral-950 border-r border-neutral-700 h-full flex flex-col z-10 shadow-2xl text-white animate-fade-in"
      >
        {/* Top Header & Student Profile */}
        <div className="p-3 sm:p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <AtlauzLogo variant="icon" size={20} animated={false} />
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs sm:text-sm tracking-tight text-white font-mono uppercase">ATLAUZ</span>
                <span className="text-[9px] font-mono px-1 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold">
                  SITEMAP
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 truncate">Prototype Navigation</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close sidebar navigation"
            className="w-8 h-8 rounded flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-xs focus-visible:ring-2 focus-visible:ring-white"
            title="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Card & Biometric Lock Strip */}
        <div className="px-3 py-2 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between shrink-0 font-mono">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded bg-neutral-800 text-white border border-neutral-700 flex items-center justify-center font-bold text-[10px] shrink-0">
              {settings.username.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0">
              <span className="font-bold text-[11px] text-white truncate block max-w-[120px]">
                @{settings.username}
              </span>
              <span className="text-[9px] text-neutral-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block" />
                <span>{settings.role || 'SCHOLAR'}</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              onClose();
              onLockScreen();
            }}
            className="min-h-[36px] px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-[11px] border border-neutral-700 flex items-center gap-1 shrink-0 focus-visible:ring-2 focus-visible:ring-white"
            title="Lock screen with Biometric Passkey"
          >
            <Lock className="w-3 h-3 text-neutral-300" />
            <span>Lock</span>
          </button>
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
          {/* SECTION 1: PRIMARY NAVIGATION */}
          <div className="space-y-1">
            <span className="text-[9px] font-mono uppercase tracking-wider text-neutral-400 block px-1">
              [Primary Views]
            </span>

            <div className="grid grid-cols-1 gap-1">
              {[
                { id: 'hub', label: 'Daily Hub', sub: 'Status, metrics & telemetry', icon: LayoutDashboard },
                { id: 'library', label: 'Bookshelf Library', sub: 'Indexed volumes, notes & tasks', icon: BookOpen },
                { id: 'workspace', label: 'Active Workspace', sub: '8-Tab multi-tool focus shift', icon: Layers },
                { id: 'companion', label: 'Companion Workshop', sub: 'Autonomous aquarium & anatomy', icon: Sliders },
                { id: 'profile', label: 'Profile & Ecosystem', sub: 'Roles, security & preferences', icon: Lock }
              ].map(item => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigateTab(item.id as any);
                      onClose();
                    }}
                    className="w-full min-h-[48px] flex items-center justify-between p-2.5 rounded hover:bg-neutral-900 border border-transparent hover:border-neutral-800 text-left transition-all group focus-visible:ring-2 focus-visible:ring-white"
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-neutral-400 group-hover:text-white" />
                      <div>
                        <div className="text-xs font-bold text-neutral-200 group-hover:text-white font-mono">
                          {item.label}
                        </div>
                        <div className="text-[10px] text-neutral-500 font-sans">
                          {item.sub}
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-300" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 2: QUICK CREATION SHELF */}
          <div className="p-3 rounded bg-neutral-900 border border-neutral-700 space-y-2">
            <div className="flex items-center justify-between font-mono">
              <span className="text-[10px] font-bold text-white flex items-center gap-1.5 uppercase">
                <Plus className="w-3 h-3 text-white" />
                [Quick Create]
              </span>
              <button
                onClick={() => {
                  onClose();
                  onCreateResourceClick();
                }}
                className="text-[10px] font-bold text-neutral-300 hover:text-white min-h-[32px] px-2 flex items-center"
              >
                All →
              </button>
            </div>

            <div className="grid grid-cols-2 gap-1.5 font-mono">
              <button
                onClick={() => {
                  onClose();
                  onCreateResourceClick();
                }}
                className="min-h-[44px] p-2 rounded bg-black hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-center gap-1.5 min-w-0 text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <BookOpen className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate text-[10px]">Notebook</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCreateResourceClick();
                }}
                className="min-h-[44px] p-2 rounded bg-black hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-center gap-1.5 min-w-0 text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <FileText className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate text-[10px]">Document</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCreateResourceClick();
                }}
                className="min-h-[44px] p-2 rounded bg-black hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-center gap-1.5 min-w-0 text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <Presentation className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate text-[10px]">Slides</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onCreateResourceClick();
                }}
                className="min-h-[44px] p-2 rounded bg-black hover:bg-neutral-800 border border-neutral-800 text-left text-xs transition-all flex items-center gap-1.5 min-w-0 text-white focus-visible:ring-2 focus-visible:ring-white"
              >
                <GraduationCap className="w-3.5 h-3.5 text-white shrink-0" />
                <span className="truncate text-[10px]">Lesson</span>
              </button>
            </div>
          </div>

          {/* SECTION 3: PINNED QUICK-ACCESS ASSETS */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-1 font-mono">
              <span className="text-[9px] uppercase tracking-wider text-neutral-400 flex items-center gap-1 truncate">
                <Pin className="w-2.5 h-2.5 text-white fill-current shrink-0" />
                <span>[Pinned: {pinnedResources.length}]</span>
              </span>
              <button
                onClick={() => {
                  onNavigateTab('library');
                  onClose();
                }}
                className="text-[9px] text-neutral-400 hover:text-white"
              >
                Library
              </button>
            </div>

            {pinnedResources.length === 0 ? (
              <p className="text-[10px] text-neutral-500 px-1 font-mono">
                No items pinned yet.
              </p>
            ) : (
              <div className="space-y-1">
                {pinnedResources.map(res => (
                  <div
                    key={res.id}
                    onClick={() => {
                      onOpenResource(res);
                      onClose();
                    }}
                    className="p-2 rounded bg-black hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 cursor-pointer flex items-center justify-between transition-all group"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-4 h-4 rounded flex items-center justify-center font-bold text-[9px] shrink-0 border border-neutral-700 bg-neutral-900 text-white"
                      >
                        ●
                      </div>
                      <span className="text-[11px] font-semibold text-white group-hover:underline truncate">
                        {res.title}
                      </span>
                    </div>
                    <span className="text-[9px] text-neutral-400 font-mono shrink-0 ml-1">OPEN</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 4: LEARNING STYLE & ADAPTIVE PREFERENCES */}
          <div className="p-3 rounded bg-neutral-900 border border-neutral-700 space-y-2">
            <span className="text-[10px] font-bold text-white flex items-center gap-1.5 font-mono uppercase">
              <Sliders className="w-3 h-3 text-white" />
              [Learning Style]
            </span>
            <div className="grid grid-cols-1 gap-1 font-mono">
              {(['Visual & Spatial', 'Auditory & Acoustic', 'Kinesthetic & Interactive', 'Reading & Synthesis'] as LearningStyle[]).map(style => (
                <button
                  key={style}
                  onClick={() => handleLearningStyleChange(style)}
                  className={`p-1.5 rounded text-left text-[10px] font-semibold border transition-all truncate ${
                    companion.learningStyle === style
                      ? 'bg-white text-black border-white'
                      : 'bg-black text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  {style}
                </button>
              ))}
            </div>
          </div>

          {/* SECTION 5: FISHING ROD STREAKS */}
          <div className="p-3 rounded bg-neutral-900 border border-neutral-700 space-y-2">
            <div className="flex items-center justify-between gap-1 font-mono">
              <span className="text-[10px] font-bold text-white flex items-center gap-1 truncate uppercase">
                <span>⚓</span>
                <span>[Rod Streaks]</span>
              </span>
              <button
                onClick={onToggleStreakFreeze}
                title={telemetry.isStreakFrozen ? 'Your streak is paused. Resume to continue counting.' : 'Pause your streak temporarily while you rest or recover. Your habit count stays safe.'}
                className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all shrink-0 ${
                  telemetry.isStreakFrozen
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                {telemetry.isStreakFrozen ? 'FROZEN' : 'FREEZE'}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 p-2 rounded bg-black border border-neutral-800 font-mono">
              <div className="min-w-0">
                <span className="text-xs font-bold text-white flex items-center gap-1 truncate tabular-nums">
                  {telemetry.streakDays}d Streak
                </span>
                <span className="text-[9px] text-neutral-400 block truncate">
                  {companion.name || 'Finley'}
                </span>
              </div>
              {onOpenFishing && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFishing();
                  }}
                  className="px-2 py-1 rounded bg-white text-black font-bold text-[10px] hover:bg-neutral-200 active:scale-95 transition-all text-center"
                >
                  Cast Rod
                </button>
              )}
            </div>
          </div>

          {/* SECTION 6: CONNECTED SUITES */}
          <div className="space-y-1 font-mono">
            <span className="text-[9px] uppercase tracking-wider text-neutral-400 block px-1">
              [Cloud Integrations]
            </span>
            <div className="grid grid-cols-2 gap-1">
              {connectedApps.map(app => (
                <button
                  key={app.id}
                  onClick={() => {
                    onToggleAppConnection(app.id);
                    onShowToast(`${app.name} status updated`);
                  }}
                  className={`p-1.5 rounded border flex items-center justify-between text-xs transition-all ${
                    app.connected
                      ? 'bg-black border-white text-white'
                      : 'bg-black border-neutral-850 text-neutral-500'
                  }`}
                >
                  <span className="truncate text-[10px] font-medium">{app.name}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${app.connected ? 'bg-white' : 'bg-neutral-600'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Theme & Lock Controls */}
        <div className="p-3 border-t border-neutral-800 bg-neutral-900 flex items-center justify-between text-xs shrink-0 font-mono">
          <div className="flex items-center gap-1 text-neutral-400 text-[10px]">
            <span>Theme:</span>
            <span className="text-white font-bold uppercase">{settings.theme}</span>
          </div>

          <button
            onClick={() => {
              onClose();
              onLockScreen();
            }}
            className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-[10px] border border-neutral-700 flex items-center gap-1"
          >
            <Lock className="w-3 h-3 text-white" />
            <span>Passkey</span>
          </button>
        </div>
      </div>
    </div>
  );
});
