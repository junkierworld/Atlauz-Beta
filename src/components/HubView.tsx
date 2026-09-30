import React, { useState } from 'react';
import {
  Rocket,
  Activity,
  ArrowRight,
  Database,
  Cloud,
  Palette,
  Pin,
  BookOpen,
  Plus,
  Clock,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { CognitiveTelemetry, ConnectedApp, ResourceItem, CompanionState, UserRole } from '../types';
import { FrostedPanel } from './FrostedPanel';
import { AtlauzLogo } from './AtlauzLogo';

interface HubViewProps {
  telemetry: CognitiveTelemetry;
  connectedApps: ConnectedApp[];
  resources: ResourceItem[];
  companion?: CompanionState;
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onOpenLibrary: () => void;
  onOpenWorkspace: () => void;
  onOpenFishing?: () => void;
  onOpenProfile?: () => void;
  onShowToast: (msg: string) => void;
  userRole?: UserRole;
}

export const HubView: React.FC<HubViewProps> = ({
  telemetry,
  connectedApps,
  resources,
  companion,
  onOpenResource,
  onCreateResourceClick,
  onOpenLibrary,
  onOpenWorkspace,
  onOpenFishing,
  onOpenProfile,
  onShowToast,
  userRole = 'Student'
}) => {
  // Frosted states map: when frosted, panel minimizes to ONLY show the title
  const [frostedStates, setFrostedStates] = useState<{ [key: string]: boolean }>({
    sprint: false,       // Defrosted by default
    pinned: false,       // Defrosted by default
    wellness: true,      // Frosted by default
    integrations: true   // Frosted by default
  });

  const toggleFrost = (key: string) => {
    const isCurrentlyFrosted = frostedStates[key];
    const nextState = !isCurrentlyFrosted;
    setFrostedStates(prev => ({ ...prev, [key]: !prev[key] }));
    onShowToast(nextState ? 'Panel Concealed to title' : 'Panel Revealed with full details');
  };

  const pinnedResources = resources.filter(r => r.isPinned);

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-3.5 animate-fade-in pb-20 font-sans">
      {/* Top Prototype State Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 rounded border border-neutral-800 bg-neutral-900/60 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white shrink-0" />
          <span className="font-mono text-neutral-300 text-[11px] font-bold uppercase tracking-wider">
            [PROTOTYPE: WIREFRAME ENGINE]
          </span>
        </div>
        <span className="text-neutral-400 font-mono text-[11px]">
          Conceal / Reveal Panels Active
        </span>
      </div>

      {/* Role Ecosystem Bar */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-neutral-800 text-white border border-neutral-700 font-mono font-bold text-[10px] uppercase">
            {userRole}
          </div>
          <div>
            <div className="font-bold text-white font-mono text-xs flex items-center gap-1.5">
              <span>{userRole === 'Student' ? 'Student Scholar Ecosystem' : userRole === 'Researcher' ? 'Investigator & Researcher Ecosystem' : 'Educator & Faculty Ecosystem'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">ONLINE</span>
            </div>
            <div className="text-[11px] text-neutral-400 mt-0.5">
              {userRole === 'Student'
                ? 'Coursework mastery, lecture review & anti-burnout pacing active.'
                : userRole === 'Researcher'
                ? 'Hadal acoustics, citation matrix & deep sources active.'
                : 'Curriculum architecture, 16:9 slides & cohort metrics active.'}
            </div>
          </div>
        </div>

        {onOpenProfile && (
          <button
            onClick={onOpenProfile}
            className="px-2.5 py-1 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 font-mono text-[11px] flex items-center gap-1 shrink-0 self-start sm:self-auto"
          >
            <span>Tune Preferences</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* HERO: Functional Summary & Daily Telemetry */}
      <div className="rounded-lg bg-neutral-900 border border-neutral-700 p-4 sm:p-5 relative">
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded border border-neutral-700 bg-neutral-850 flex items-center justify-center shrink-0">
              <AtlauzLogo variant="icon" size={24} animated={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <AtlauzLogo variant="wordmark" size="xs" animated={true} />
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                  ACTIVE
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5">
                Cognitive balance • Zero context-switching workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full xs:w-auto justify-end">
            <button
              onClick={onOpenLibrary}
              className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs border border-neutral-600 flex items-center gap-1.5 transition-all"
            >
              <BookOpen className="w-3.5 h-3.5 text-white" />
              <span>Library ({resources.length})</span>
            </button>

            <button
              onClick={onCreateResourceClick}
              className="px-3.5 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 active:scale-95 transition-all flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create</span>
            </button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div
            onClick={onOpenFishing}
            className="rounded border border-neutral-700 bg-neutral-950 p-3 hover:border-neutral-500 transition-all cursor-pointer group"
            title="Click to cast fishing rod to reel in a companion fish"
          >
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[10px] uppercase flex items-center gap-1">
                <span>[STREAK]</span> Deep Telemetry
              </span>
              <span className="text-[10px] font-bold text-white font-mono">
                {Math.floor(telemetry.streakDays / 20)} Cast Available
              </span>
            </div>
            <div className="flex items-center justify-between my-1">
              <span className="text-xl sm:text-2xl font-bold text-white tracking-tight tabular-nums">
                {telemetry.streakDays} Days
              </span>
              {onOpenFishing && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onOpenFishing();
                  }}
                  className="px-2.5 py-1 rounded bg-white text-black text-[10px] font-mono font-bold hover:bg-neutral-200"
                >
                  Cast Rod (20d)
                </button>
              )}
            </div>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (telemetry.streakDays / 20) * 100)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-1">
              <span>{telemetry.streakDays % 20}/20 streaks to cast</span>
              <span>Tank: {companion?.fishes?.length || 1}/5 Fishes</span>
            </div>
          </div>

          <div className="rounded border border-neutral-700 bg-neutral-950 p-3">
            <div className="flex items-center justify-between text-neutral-400 text-xs">
              <span className="font-mono text-[10px] uppercase">[COMPANION TANK]</span>
              <Activity className="w-3.5 h-3.5 text-neutral-300" />
            </div>
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight block my-1">
              {companion?.name || 'Finley'}
            </span>
            <div className="w-full bg-neutral-800 rounded-full h-1.5 overflow-hidden">
              <div className="bg-neutral-300 h-full rounded-full" style={{ width: '92%' }} />
            </div>
            <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono mt-1">
              <span>State: Autonomous Swimming</span>
              <span className="text-white font-semibold">Primary Specimen</span>
            </div>
          </div>
        </div>
      </div>

      {/* PANEL 1: ACTIVE SPRINT */}
      <FrostedPanel
        id="panel-sprint"
        title="Active Mission: Neural Systems & UI Architecture"
        icon={<Rocket className="w-4 h-4 text-white" />}
        badge="Active Sprint"
        isFrosted={frostedStates.sprint}
        onToggleFrost={() => toggleFrost('sprint')}
      >
        <div className="space-y-3 font-sans">
          <p className="text-neutral-300 text-xs leading-relaxed">
            Multi-tool sprint compiling research synthesis, architectural models, and collaborative decks with zero context switches.
          </p>

          <div className="flex items-center flex-wrap gap-1.5 font-mono text-[11px]">
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center gap-1.5">
              <Database className="w-3 h-3 text-neutral-400" /> Notion Wiki [SYNCED]
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center gap-1.5">
              <Cloud className="w-3 h-3 text-neutral-400" /> Google Drive [LIVE]
            </span>
            <span className="px-2 py-1 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 flex items-center gap-1.5">
              <Palette className="w-3 h-3 text-neutral-400" /> Canva Deck [SYNCED]
            </span>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
              <Clock className="w-3.5 h-3.5 text-neutral-300" />
              <span>Session: 4.5h Logged Today</span>
            </div>

            <button
              onClick={onOpenWorkspace}
              className="px-3.5 py-1.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all flex items-center gap-1"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FrostedPanel>

      {/* PANEL 2: PINNED PRIORITY ASSETS */}
      <FrostedPanel
        id="panel-pinned"
        title={`Pinned Quick-Launch Shelf (${pinnedResources.length})`}
        icon={<Pin className="w-4 h-4 text-white" />}
        badge="Shelf"
        isFrosted={frostedStates.pinned}
        onToggleFrost={() => toggleFrost('pinned')}
        headerActions={
          <button
            onClick={onOpenLibrary}
            className="text-[11px] text-neutral-300 hover:text-white font-mono underline mr-1"
          >
            [ALL BOOKS] →
          </button>
        }
      >
        {pinnedResources.length === 0 ? (
          <p className="text-xs text-neutral-500 py-2">
            No pinned assets. Click the pin button on any book or doc in your library to pin it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pinnedResources.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenResource(item)}
                className="p-3 rounded border border-neutral-800 bg-neutral-950 hover:border-neutral-600 transition-all cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded border border-neutral-700 bg-neutral-900 flex items-center justify-center font-bold text-xs shrink-0 text-white">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-xs text-white group-hover:underline truncate block">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-mono truncate block mt-0.5">
                      <span>{item.category}</span>
                      <span className="mx-1">/</span>
                      <span>{item.badge || 'Core'}</span>
                    </span>
                  </div>
                </div>
                <span className="text-[11px] font-mono font-bold text-neutral-400 group-hover:text-white transition-colors">
                  [OPEN]
                </span>
              </div>
            ))}
          </div>
        )}
      </FrostedPanel>

      {/* PANEL 3: WELL-BEING & RECOVERY */}
      <FrostedPanel
        id="panel-wellness"
        title="Circadian Boundary & Anti-Burnout Telemetry"
        icon={<ShieldCheck className="w-4 h-4 text-white" />}
        badge={telemetry.isStreakFrozen ? 'Frozen' : 'Active'}
        isFrosted={frostedStates.wellness}
        onToggleFrost={() => toggleFrost('wellness')}
      >
        <div className="space-y-3 font-sans">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400 block text-[10px] font-mono uppercase">Bedtime Boundary</span>
              <span className="font-bold text-white text-sm font-mono">23:00 - 07:00</span>
            </div>
            <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800">
              <span className="text-neutral-400 block text-[10px] font-mono uppercase">Burnout Shield</span>
              <span className="font-bold text-white text-sm font-mono">[PROTECTED]</span>
            </div>
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Atlauz monitors cognitive load and study streaks. When rest periods approach, non-essential notifications are muted to protect cognitive recovery.
          </p>
        </div>
      </FrostedPanel>

      {/* PANEL 4: CROSS-SUITE INTEGRATIONS */}
      <FrostedPanel
        id="panel-integrations"
        title="Connected Workspace Integrations"
        icon={<ExternalLink className="w-4 h-4 text-white" />}
        badge="OAuth 2.0"
        isFrosted={frostedStates.integrations}
        onToggleFrost={() => toggleFrost('integrations')}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
          {connectedApps.map(app => (
            <div
              key={app.id}
              className="p-2.5 rounded bg-neutral-950 border border-neutral-800 flex items-center justify-between text-xs"
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${app.connected ? 'bg-white' : 'bg-neutral-600'}`} />
                <span className="font-semibold text-white truncate">{app.name}</span>
              </div>
              <span className="text-[10px] text-neutral-400">
                {app.connected ? '[LINKED]' : '[OFFLINE]'}
              </span>
            </div>
          ))}
        </div>
      </FrostedPanel>
    </div>
  );
};
