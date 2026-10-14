import React, { useState } from 'react';
import {
  Clock,
  Activity,
  Sliders,
  MessageSquare,
  Save,
  RotateCcw,
  CheckCircle2,
  Code,
  Palette,
  Eye,
  Layers,
  Sparkles,
  Waves,
  TrendingUp,
  Fish,
  Snowflake
} from 'lucide-react';
import { FishTank } from './FishTank';
import { AtlauzFish } from './AtlauzFish';
import { AtlauzLogo } from './AtlauzLogo';
import { StreakIcebergVisualizer } from './StreakIcebergVisualizer';
import { CompanionState, CognitiveTelemetry, UserAccountSettings } from '../types';

interface CompanionViewProps {
  companion: CompanionState;
  onUpdateCompanion: (updated: Partial<CompanionState>) => void;
  telemetry: CognitiveTelemetry;
  settings: UserAccountSettings;
  onUpdateSettings: (updated: Partial<UserAccountSettings>) => void;
  onShowToast: (msg: string) => void;
  onOpenFishing: () => void;
  onRenameFish: (fishId: string, newName: string) => void;
  onSetPrimaryFish: (fishId: string) => void;
}

const COLOR_SWATCHES = [
  { name: 'Pure White (100%)', hex: '#ffffff' },
  { name: 'Bright Silver (85%)', hex: '#e5e5e5' },
  { name: 'Light Slate (70%)', hex: '#cccccc' },
  { name: 'Medium Gray (55%)', hex: '#a3a3a3' },
  { name: 'Graphite (40%)', hex: '#737373' },
  { name: 'Dark Carbon (25%)', hex: '#525252' },
  { name: 'Deep Onyx (15%)', hex: '#262626' }
];

const HEAD_OPTIONS = [
  { id: 1, title: 'Atlauz Chevron <•', desc: 'Apex aerodynamic geometry' },
  { id: 2, title: 'Torpedo Apex', desc: 'Streamlined profile frame' },
  { id: 3, title: 'Hydrofoil Dual', desc: 'Symmetrical lateral plane' },
  { id: 4, title: 'Segmented Crest', desc: 'Dorsal structural ridge' }
];

const BODY_OPTIONS = [
  { id: 1, title: 'Streamline Hull', desc: 'Standard rib chassis' },
  { id: 2, title: 'Lattice Frame', desc: 'Modular grid sensor matrix' },
  { id: 3, title: 'Plated Carbon', desc: 'Overlapping structural plates' },
  { id: 4, title: 'Core Matrix', desc: 'Minimalist load-bearing shell' }
];

const TAIL_OPTIONS = [
  { id: 1, title: 'Split-Blade < Tail', desc: 'Dual chevron propulsion fin' },
  { id: 2, title: 'Veil Fin', desc: 'Undulating mono-sheet fin' },
  { id: 3, title: 'Twin Streamers', desc: 'Extended dual trailing fins' },
  { id: 4, title: 'Vortex Jet', desc: 'Cylindrical kinetic drive' }
];

const EYE_OPTIONS = [
  { id: 1, title: 'Focal Core •', desc: 'Central point reference marker' },
  { id: 2, title: 'Concentric Reticle', desc: 'Calibrated dual ring reticle' },
  { id: 3, title: 'Linear Optics', desc: 'Horizontal slit sensor bar' },
  { id: 4, title: 'Quad Marker', desc: '4-point geometric crosshair' }
];

export const CompanionView: React.FC<CompanionViewProps> = ({
  companion,
  onUpdateCompanion,
  telemetry,
  settings,
  onUpdateSettings,
  onShowToast,
  onOpenFishing,
  onRenameFish,
  onSetPrimaryFish
}) => {
  const [activeCompanionTab, setActiveCompanionTab] = useState<'aquarium' | 'iceberg' | 'anatomy'>('aquarium');
  const [activeComponentTab, setActiveComponentTab] = useState<'head' | 'body' | 'tail' | 'eyes' | 'colors'>('head');
  const [msg1, setMsg1] = useState(companion.customMessages[0]);
  const [msg2, setMsg2] = useState(companion.customMessages[1]);
  const [msg3, setMsg3] = useState(companion.customMessages[2]);
  const [handleInput, setHandleInput] = useState(settings.username);
  const [isApplying, setIsApplying] = useState(false);

  const primaryFish = companion.fishes?.find(f => f.id === companion.primaryFishId) || companion.fishes?.[0];

  const handleApply = () => {
    setIsApplying(true);
    onUpdateCompanion({
      customMessages: [msg1, msg2, msg3]
    });
    onUpdateSettings({
      username: handleInput
    });
    onShowToast('Companion Anatomy & Preferences Synced');
    setTimeout(() => setIsApplying(false), 600);
  };

  const handleReset = () => {
    onUpdateCompanion({
      name: 'Finley',
      headIndex: 1,
      bodyIndex: 1,
      tailIndex: 1,
      eyesIndex: 1,
      mouthIndex: 1,
      baseColor: '#ffffff',
      accentColor: '#888888',
      stateMachine: 'Serene_Balanced.json'
    });
    setMsg1('Take a deep breath and stay hydrated.');
    setMsg2('Zero friction: 0 context switches across all-in-one tools.');
    setMsg3('Reaching New Depths: Milestone unlocked.');
    setHandleInput('polymath');
    onShowToast('Companion anatomy reset to default specification');
  };

  return (
    <div className="flex flex-col w-full max-w-3xl mx-auto space-y-4 animate-fade-in pb-8 font-sans">
      {/* Top Banner: Companion & Aquarium Interface with Mode Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-neutral-900 px-4 py-3 rounded-xl border border-neutral-700 gap-3">
        <div className="flex items-center gap-2.5">
          <AtlauzLogo variant="icon" size={20} animated={false} />
          <div className="flex items-center gap-2">
            <span className="font-bold text-white text-sm sm:text-base font-mono uppercase tracking-wide">
              Companion & Aquarium
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-neutral-200 border border-neutral-700 font-bold">
              {companion.name || 'Finley'}
            </span>
          </div>
        </div>

        {/* Companion Sub-Tabs (Aquarium | Streak Snowflake | Anatomy Fish) */}
        <div
          role="tablist"
          aria-label="Companion view modes"
          className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800 text-xs font-mono overflow-x-auto no-scrollbar"
        >
          <button
            role="tab"
            aria-selected={activeCompanionTab === 'aquarium'}
            onClick={() => setActiveCompanionTab('aquarium')}
            className={`min-touch-target px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCompanionTab === 'aquarium'
                ? 'bg-white text-black font-bold ring-1 ring-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Aquarium</span>
          </button>

          <button
            role="tab"
            aria-selected={activeCompanionTab === 'iceberg'}
            onClick={() => {
              setActiveCompanionTab('iceberg');
              onShowToast('Opening Streak History Iceberg');
            }}
            className={`min-touch-target px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCompanionTab === 'iceberg'
                ? 'bg-white text-black font-bold ring-1 ring-white'
                : 'text-cyan-300 hover:text-white'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5 text-cyan-400" />
            <span>Streak</span>
          </button>

          <button
            role="tab"
            aria-selected={activeCompanionTab === 'anatomy'}
            onClick={() => setActiveCompanionTab('anatomy')}
            className={`min-touch-target px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeCompanionTab === 'anatomy'
                ? 'bg-white text-black font-bold ring-1 ring-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Fish className="w-3.5 h-3.5" />
            <span>Anatomy</span>
          </button>
        </div>
      </div>

      {/* MODE 1: LIVING RECTANGULAR FISHTANK & TELEMETRY */}
      {activeCompanionTab === 'aquarium' && (
        <div className="space-y-4 animate-fade-in">
          <section className="relative overflow-hidden rounded-xl bg-neutral-900 border border-neutral-700 p-3 sm:p-4 shadow-xl">
            <div className="relative z-10 flex flex-col space-y-3">
              {/* State Machine Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-neutral-800 text-white">
                  <Code className="w-3.5 h-3.5 text-neutral-400" />
                  <span className="font-mono text-[11px] text-neutral-300">
                    {companion.stateMachine}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-neutral-300 px-2.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>[{companion.fishes?.length || 1}/5 Active In Tank]</span>
                </div>
              </div>

              {/* Rectangular Fish Tank */}
              <FishTank
                fishes={companion.fishes || []}
                primaryFishId={companion.primaryFishId || companion.fishes?.[0]?.id}
                telemetry={telemetry}
                companionState={companion}
                onRenameFish={onRenameFish}
                onSetPrimaryFish={onSetPrimaryFish}
                onOpenFishing={onOpenFishing}
                onShowToast={onShowToast}
              />

              {/* Telemetry Dials Strip */}
              <div className="grid grid-cols-3 gap-2 w-full pt-1 font-mono">
                {/* Dial 1: Cognitive Vital */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-neutral-400" /> Vital
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                    {telemetry.cognitiveVital}%
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase">Calibrated</span>
                </div>

                {/* Dial 2: Session Dial */}
                <div className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-black border border-neutral-800">
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-400" /> Session
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                    {telemetry.sessionMinutes}m
                  </span>
                  <span className="text-[9px] text-neutral-500 uppercase">Focus Elapsed</span>
                </div>

                {/* Dial 3: Streak & Iceberg Quick Jump */}
                <div
                  onClick={() => setActiveCompanionTab('iceberg')}
                  className="flex flex-col items-center justify-center p-2.5 rounded-lg bg-black border border-cyan-800/80 hover:border-cyan-400 cursor-pointer group transition-all"
                  title="Click to open full Streak History Iceberg"
                >
                  <span className="text-[11px] text-cyan-300 flex items-center gap-1">
                    <span>🏔️</span> Iceberg
                  </span>
                  <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums group-hover:text-cyan-200">
                    {telemetry.streakDays}d Streak
                  </span>
                  <span className="text-[9px] text-cyan-400 font-bold group-hover:underline">
                    [Inspect History →]
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Quick Iceberg Teaser Card */}
          <div
            onClick={() => setActiveCompanionTab('iceberg')}
            className="p-4 rounded-xl bg-gradient-to-r from-[#041322] to-neutral-900 border border-cyan-900/60 hover:border-cyan-500 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏔️</span>
              <div>
                <span className="text-xs font-mono font-bold text-white block">
                  Streak History Iceberg Visualizer Active
                </span>
                <span className="text-[11px] text-cyan-300/80 font-mono">
                  Compare performance across Weeks, Months, and Year with bubble ice and blue academic freeze strata.
                </span>
              </div>
            </div>
            <button className="px-3 py-1.5 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-mono font-bold shrink-0">
              Open Iceberg →
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: STREAK HISTORY ICEBERG VISUALIZER */}
      {activeCompanionTab === 'iceberg' && (
        <div className="animate-fade-in">
          <StreakIcebergVisualizer
            telemetry={telemetry}
            onShowToast={onShowToast}
          />
        </div>
      )}

      {/* MODE 3: ANATOMY WORKSHOP */}
      {activeCompanionTab === 'anatomy' && (
        <section className="flex flex-col rounded-xl bg-neutral-900 border border-neutral-700 p-4 sm:p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-white text-base flex items-center gap-2">
                <Sliders className="w-4 h-4 text-white" /> Modular Anatomy Configuration
              </span>
              <span className="text-xs text-neutral-400">
                Tune specimen head, chassis body, tail geometry, and optical reticle
              </span>
            </div>
            <button
              onClick={() => onUpdateCompanion({ featuresEnabled: !companion.featuresEnabled })}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
                companion.featuresEnabled ? 'bg-white border-white' : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full transition-transform ${
                  companion.featuresEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'
                }`}
              />
            </button>
          </div>

          {companion.featuresEnabled && (
            <div className="space-y-4">
              {/* Live Interactive Specimen Stage */}
              <div className="relative rounded-xl bg-black border border-neutral-800 p-5 flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-prototype-grid opacity-15 pointer-events-none" />
                <div className="absolute top-2 left-2 text-[9px] font-mono text-neutral-500">
                  SPECIMEN_CHASSIS_01 // LIVE_VIEW
                </div>

                <div className="py-6 flex items-center justify-center">
                  <AtlauzFish
                    headIndex={companion.headIndex}
                    bodyIndex={companion.bodyIndex}
                    tailIndex={companion.tailIndex}
                    eyesIndex={companion.eyesIndex}
                    baseColor={companion.baseColor}
                    accentColor={companion.accentColor}
                    size={160}
                    animated={true}
                  />
                </div>

                <div className="text-center">
                  <span className="text-xs font-mono font-bold text-white block">
                    {primaryFish?.name || companion.name} ({primaryFish?.personality || 'Balanced'})
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    Species: {primaryFish?.species || 'Monochrome Specimen'} • Scale: 1.8x
                  </span>
                </div>
              </div>

              {/* Anatomy Component Tabs */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800 overflow-x-auto text-xs font-mono">
                {(['head', 'body', 'tail', 'eyes', 'colors'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveComponentTab(tab)}
                    className={`flex-1 min-touch-target py-1.5 px-3 rounded text-center transition-all capitalize ${
                      activeComponentTab === tab
                        ? 'bg-white text-black font-bold'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Head Selector */}
              {activeComponentTab === 'head' && (
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {HEAD_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateCompanion({ headIndex: opt.id })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        companion.headIndex === opt.id
                          ? 'bg-neutral-800 border-white text-white shadow'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.title}</span>
                      <span className="text-[10px] text-neutral-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Body Selector */}
              {activeComponentTab === 'body' && (
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {BODY_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateCompanion({ bodyIndex: opt.id })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        companion.bodyIndex === opt.id
                          ? 'bg-neutral-800 border-white text-white shadow'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.title}</span>
                      <span className="text-[10px] text-neutral-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Tail Selector */}
              {activeComponentTab === 'tail' && (
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {TAIL_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateCompanion({ tailIndex: opt.id })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        companion.tailIndex === opt.id
                          ? 'bg-neutral-800 border-white text-white shadow'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.title}</span>
                      <span className="text-[10px] text-neutral-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Eyes Selector */}
              {activeComponentTab === 'eyes' && (
                <div className="grid grid-cols-2 gap-2 font-mono">
                  {EYE_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => onUpdateCompanion({ eyesIndex: opt.id })}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        companion.eyesIndex === opt.id
                          ? 'bg-neutral-800 border-white text-white shadow'
                          : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-xs font-bold block">{opt.title}</span>
                      <span className="text-[10px] text-neutral-500">{opt.desc}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Colors Swatches */}
              {activeComponentTab === 'colors' && (
                <div className="space-y-3 font-mono">
                  <div>
                    <span className="text-xs text-neutral-400 block mb-2">Base Specimen Chassis Color:</span>
                    <div className="flex items-center gap-2 flex-wrap">
                      {COLOR_SWATCHES.map(swatch => (
                        <button
                          key={swatch.hex}
                          onClick={() => onUpdateCompanion({ baseColor: swatch.hex })}
                          style={{ backgroundColor: swatch.hex }}
                          title={swatch.name}
                          className={`w-9 h-9 rounded-lg border-2 transition-transform ${
                            companion.baseColor === swatch.hex
                              ? 'border-cyan-400 scale-110 shadow'
                              : 'border-neutral-700 hover:scale-105'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Dock */}
          <div className="flex items-center gap-2 pt-2 font-mono">
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="flex-1 py-2.5 px-4 rounded-lg bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isApplying ? 'SAVING...' : 'SAVE ANATOMY PREFERENCES'}</span>
            </button>

            <button
              onClick={handleReset}
              title="Reset to Factory Defaults"
              className="p-2.5 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 active:scale-95 transition-all text-xs font-bold flex items-center gap-1"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
