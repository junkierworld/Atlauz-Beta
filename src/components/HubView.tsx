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
  settings?: { theme?: 'light' | 'dark' };
}

export const HubView = React.memo(function HubViewComponent({
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
  userRole = 'Student',
  settings = { theme: 'dark' }
}: HubViewProps) {
  const isDark = settings.theme === 'dark';
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
      <div className={`flex items-center justify-between px-3 py-1.5 rounded border text-xs ${
        isDark
          ? 'border-neutral-800 bg-neutral-900/60'
          : 'border-neutral-300 bg-neutral-100/60'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${
            isDark ? 'bg-white' : 'bg-neutral-900'
          }`} />
          <span className={`font-mono text-[11px] font-bold uppercase tracking-wider ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            [PROTOTYPE: WIREFRAME ENGINE]
          </span>
        </div>
        <span className={`font-mono text-[11px] ${
          isDark ? 'text-neutral-400' : 'text-neutral-600'
        }`}>
          Conceal / Reveal Panels Active
        </span>
      </div>

      {/* Role Ecosystem Bar */}
      <div className={`border rounded-lg p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
        isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-50 border-neutral-300'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`p-1.5 rounded font-mono font-bold text-[10px] uppercase border ${
            isDark
              ? 'bg-neutral-800 text-white border-neutral-700'
              : 'bg-neutral-200 text-neutral-900 border-neutral-400'
          }`}>
            {userRole}
          </div>
          <div>
            <div className={`font-bold font-mono text-xs flex items-center gap-1.5 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              <span>{userRole === 'Student' ? 'Student Scholar Ecosystem' : userRole === 'Researcher' ? 'Investigator & Researcher Ecosystem' : 'Educator & Faculty Ecosystem'}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded border ${
                isDark
                  ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                  : 'bg-neutral-200 text-neutral-700 border-neutral-400'
              }`}>ONLINE</span>
            </div>
            <div className={`text-[11px] mt-0.5 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
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
            className={`px-2.5 py-1 rounded font-mono text-[11px] flex items-center gap-1 shrink-0 self-start sm:self-auto border transition-all ${
              isDark
                ? 'bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white border-neutral-700'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-700 hover:text-neutral-900 border-neutral-300'
            }`}
          >
            <span>Tune Preferences</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* HERO: Functional Summary & Daily Telemetry */}
      <div className={`rounded-lg border p-4 sm:p-5 relative ${
        isDark
          ? 'bg-neutral-900 border-neutral-700'
          : 'bg-neutral-50 border-neutral-300'
      }`}>
        <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded border flex items-center justify-center shrink-0 ${
              isDark
                ? 'border-neutral-700 bg-neutral-850'
                : 'border-neutral-300 bg-neutral-100'
            }`}>
              <AtlauzLogo variant="icon" size={24} animated={true} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <AtlauzLogo variant="wordmark" size="xs" animated={true} />
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded border font-bold uppercase ${
                  isDark
                    ? 'bg-neutral-800 text-neutral-300 border-neutral-700'
                    : 'bg-neutral-200 text-neutral-700 border-neutral-400'
                }`}>
                  ACTIVE
                </span>
              </div>
              <p className={`text-[11px] mt-0.5 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Cognitive balance • Zero context-switching workspace
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full xs:w-auto justify-end">
            <button
              onClick={onOpenLibrary}
              className={`px-3 py-1.5 rounded font-semibold text-xs flex items-center gap-1.5 transition-all border ${
                isDark
                  ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-600'
                  : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900 border-neutral-400'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`} />
              <span>Library ({resources.length})</span>
            </button>

            <button
              onClick={onCreateResourceClick}
              className={`px-3.5 py-1.5 rounded font-bold text-xs active:scale-95 transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
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
            className={`rounded border p-3 hover:border-opacity-75 transition-all cursor-pointer group ${
              isDark
                ? 'border-neutral-700 bg-neutral-950 hover:border-neutral-500'
                : 'border-neutral-300 bg-neutral-100 hover:border-neutral-400'
            }`}
            title="Click to cast fishing rod to reel in a companion fish"
          >
            <div className={`flex items-center justify-between text-xs font-mono ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <span className="text-[10px] uppercase flex items-center gap-1">
                <span>[STREAK]</span> Deep Telemetry
              </span>
              <span className={`text-[10px] font-bold font-mono ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                {Math.floor(telemetry.streakDays / 20)} Cast Available
              </span>
            </div>
            <div className="flex items-center justify-between my-1">
              <span className={`text-xl sm:text-2xl font-bold tracking-tight tabular-nums ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>
                {telemetry.streakDays} Days
              </span>
              {onOpenFishing && (
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onOpenFishing();
                  }}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-200'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800'
                  }`}
                >
                  Cast Rod (20d)
                </button>
              )}
            </div>
            <div className={`w-full rounded-full h-1.5 overflow-hidden ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-300'
            }`}>
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  isDark ? 'bg-white' : 'bg-neutral-900'
                }`}
                style={{ width: `${Math.min(100, (telemetry.streakDays / 20) * 100)}%` }}
              />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono mt-1 ${
              isDark ? 'text-neutral-500' : 'text-neutral-600'
            }`}>
              <span>{telemetry.streakDays % 20}/20 streaks to cast</span>
              <span>Tank: {companion?.fishes?.length || 1}/5 Fishes</span>
            </div>
          </div>

          <div className={`rounded border p-3 ${
            isDark
              ? 'border-neutral-700 bg-neutral-950'
              : 'border-neutral-300 bg-neutral-100'
          }`}>
            <div className={`flex items-center justify-between text-xs font-mono ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <span className="text-[10px] uppercase">[COMPANION TANK]</span>
              <Activity className={`w-3.5 h-3.5 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`} />
            </div>
            <span className={`text-xl sm:text-2xl font-bold tracking-tight block my-1 ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}>
              {companion?.name || 'Finley'}
            </span>
            <div className={`w-full rounded-full h-1.5 overflow-hidden ${
              isDark ? 'bg-neutral-800' : 'bg-neutral-300'
            }`}>
              <div className={`h-full rounded-full ${
                isDark ? 'bg-neutral-300' : 'bg-neutral-600'
              }`} style={{ width: '92%' }} />
            </div>
            <div className={`flex items-center justify-between text-[10px] font-mono mt-1 ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <span>State: Autonomous Swimming</span>
              <span className={`font-semibold ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>Primary Specimen</span>
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
        isDark={isDark}
      >
        <div className="space-y-3 font-sans">
          <p className={`text-xs leading-relaxed ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            Multi-tool sprint compiling research synthesis, architectural models, and collaborative decks with zero context switches.
          </p>

          <div className={`flex items-center flex-wrap gap-1.5 font-mono text-[11px] ${
            isDark ? 'text-neutral-300' : 'text-neutral-700'
          }`}>
            <span className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                : 'bg-neutral-200 border-neutral-400 text-neutral-700'
            }`}>
              <Database className={`w-3 h-3 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`} /> Notion Wiki [SYNCED]
            </span>
            <span className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                : 'bg-neutral-200 border-neutral-400 text-neutral-700'
            }`}>
              <Cloud className={`w-3 h-3 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`} /> Google Drive [LIVE]
            </span>
            <span className={`px-2 py-1 rounded border flex items-center gap-1.5 ${
              isDark
                ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
                : 'bg-neutral-200 border-neutral-400 text-neutral-700'
            }`}>
              <Palette className={`w-3 h-3 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`} /> Canva Deck [SYNCED]
            </span>
          </div>

          <div className={`flex items-center justify-between pt-2 border-t ${
            isDark ? 'border-neutral-800' : 'border-neutral-300'
          }`}>
            <div className={`flex items-center gap-2 text-xs font-mono ${
              isDark ? 'text-neutral-400' : 'text-neutral-600'
            }`}>
              <Clock className={`w-3.5 h-3.5 ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`} />
              <span>Session: 4.5h Logged Today</span>
            </div>

            <button
              onClick={onOpenWorkspace}
              className={`px-3.5 py-1.5 rounded font-bold text-xs transition-all flex items-center gap-1 ${
                isDark
                  ? 'bg-white text-black hover:bg-neutral-200'
                  : 'bg-neutral-900 text-white hover:bg-neutral-800'
              }`}
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
        isDark={isDark}
        headerActions={
          <button
            onClick={onOpenLibrary}
            className={`text-[11px] font-mono underline mr-1 ${
              isDark
                ? 'text-neutral-300 hover:text-white'
                : 'text-neutral-700 hover:text-neutral-900'
            }`}
          >
            [ALL BOOKS] →
          </button>
        }
      >
        {pinnedResources.length === 0 ? (
          <p className={`text-xs py-2 ${
            isDark ? 'text-neutral-500' : 'text-neutral-600'
          }`}>
            No pinned assets. Click the pin button on any book or doc in your library to pin it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {pinnedResources.map(item => (
              <div
                key={item.id}
                onClick={() => onOpenResource(item)}
                className={`p-3 rounded border transition-all cursor-pointer flex items-center justify-between group ${
                  isDark
                    ? 'border-neutral-800 bg-neutral-950 hover:border-neutral-600'
                    : 'border-neutral-300 bg-neutral-100 hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded border flex items-center justify-center font-bold text-xs shrink-0 ${
                    isDark
                      ? 'border-neutral-700 bg-neutral-900 text-white'
                      : 'border-neutral-300 bg-neutral-200 text-neutral-900'
                  }`}>
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className={`font-bold text-xs group-hover:underline truncate block ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {item.title}
                    </span>
                    <span className={`text-[10px] font-mono truncate block mt-0.5 ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      <span>{item.category}</span>
                      <span className="mx-1">/</span>
                      <span>{item.badge || 'Core'}</span>
                    </span>
                  </div>
                </div>
                <span className={`text-[11px] font-mono font-bold transition-colors ${
                  isDark
                    ? 'text-neutral-400 group-hover:text-white'
                    : 'text-neutral-600 group-hover:text-neutral-900'
                }`}>
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
        isDark={isDark}
      >
        <div className="space-y-3 font-sans">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className={`p-2.5 rounded border ${
              isDark
                ? 'bg-neutral-950 border-neutral-800'
                : 'bg-neutral-100 border-neutral-300'
            }`}>
              <span className={`text-[10px] font-mono uppercase block ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>Bedtime Boundary</span>
              <span className={`font-bold text-sm font-mono ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>23:00 - 07:00</span>
            </div>
            <div className={`p-2.5 rounded border ${
              isDark
                ? 'bg-neutral-950 border-neutral-800'
                : 'bg-neutral-100 border-neutral-300'
            }`}>
              <span className={`text-[10px] font-mono uppercase block ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>Burnout Shield</span>
              <span className={`font-bold text-sm font-mono ${
                isDark ? 'text-white' : 'text-neutral-900'
              }`}>[PROTECTED]</span>
            </div>
          </div>
          <p className={`text-xs leading-relaxed ${
            isDark ? 'text-neutral-400' : 'text-neutral-700'
          }`}>
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
        isDark={isDark}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-xs">
          {connectedApps.map(app => (
            <div
              key={app.id}
              className={`p-2.5 rounded border flex items-center justify-between text-xs ${
                isDark
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-neutral-100 border-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  app.connected
                    ? isDark ? 'bg-white' : 'bg-neutral-900'
                    : isDark ? 'bg-neutral-600' : 'bg-neutral-400'
                }`} />
                <span className={`font-semibold truncate ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>{app.name}</span>
              </div>
              <span className={`text-[10px] ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                {app.connected ? '[LINKED]' : '[OFFLINE]'}
              </span>
            </div>
          ))}
        </div>
      </FrostedPanel>
    </div>
  );
});
