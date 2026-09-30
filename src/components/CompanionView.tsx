import React, { useState } from 'react';
import {
  Clock,
  Activity,
  Sliders,
  MessageSquare,
  Fingerprint,
  Save,
  RotateCcw,
  CheckCircle2,
  Code,
  Palette,
  Eye,
  Layers,
  Sparkles,
  Waves
} from 'lucide-react';
import { FishTank } from './FishTank';
import { AtlauzFish } from './AtlauzFish';
import { AtlauzLogo } from './AtlauzLogo';
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
    onShowToast('Companion Anatomy & Account Preferences Synced');
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
    onShowToast('Companion anatomy reset to default prototype specification');
  };

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto space-y-4 animate-fade-in pb-8 font-sans">
      {/* Top Banner: Companion & Aquarium Interface */}
      <div className="flex items-center justify-between bg-neutral-900 px-4 py-2.5 rounded-lg border border-neutral-700">
        <div className="flex items-center gap-2">
          <AtlauzLogo variant="icon" size={20} animated={false} />
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-white text-sm sm:text-base">
              COMPANION WORKSHOP
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold">
              {companion.name || 'Finley'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
          <span className="w-2 h-2 rounded-full bg-white" />
          <span className="font-mono text-neutral-300">
            [{companion.fishes?.length || 1}/5 In Tank]
          </span>
        </div>
      </div>

      {/* SECTION 1: Living Rectangular Fishtank Container */}
      <section className="relative overflow-hidden rounded-lg bg-neutral-900 border border-neutral-700 p-3 sm:p-4">
        <div className="relative z-10 flex flex-col space-y-3">
          {/* State Machine Specification Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-black border border-neutral-800 text-white">
              <Code className="w-3.5 h-3.5 text-neutral-400" />
              <span className="font-mono text-[11px] text-neutral-300">
                {companion.stateMachine}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-300 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-white" />
              <span>ACTIVE SPECIMEN</span>
            </div>
          </div>

          {/* Rectangular Fish Tank Component */}
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

          {/* Telemetry & Fishing Rod Dials */}
          <div className="grid grid-cols-3 gap-2 w-full pt-1 font-mono">
            {/* Dial 1: Cognitive Vital */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-neutral-400" /> Vital
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                {telemetry.cognitiveVital}%
              </span>
              <span className="text-[9px] text-neutral-500 uppercase">Calibrated</span>
            </div>

            {/* Dial 2: Session Dial */}
            <div className="flex flex-col items-center justify-center p-2.5 rounded bg-black border border-neutral-800">
              <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-neutral-400" /> Session
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                {telemetry.sessionMinutes}m
              </span>
              <span className="text-[9px] text-neutral-500 uppercase">Focus Elapsed</span>
            </div>

            {/* Dial 3: Fishing Rod Cast Streak */}
            <div
              onClick={onOpenFishing}
              className="flex flex-col items-center justify-center p-2.5 rounded bg-black border border-neutral-700 hover:border-white cursor-pointer group transition-all"
              title="Click to cast fishing line"
            >
              <span className="text-[11px] text-neutral-300 flex items-center gap-1">
                <span>⚓</span> Cast Rod
              </span>
              <span className="text-base sm:text-lg font-bold text-white tracking-tight tabular-nums">
                {telemetry.streakDays}d Streak
              </span>
              <span className="text-[9px] text-neutral-300 font-bold">
                [{Math.floor(telemetry.streakDays / 20)} Available]
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ATLAUZ FISH ANATOMY & MODULAR COMPONENT WORKSHOP */}
      <section className="flex flex-col rounded-lg bg-neutral-900 border border-neutral-700 p-4 sm:p-5 space-y-4">
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
            <div className="relative rounded bg-black border border-neutral-800 p-5 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-prototype-grid opacity-15 pointer-events-none" />
              <div className="absolute top-2 left-2 text-[9px] font-mono text-neutral-500">
                [CAD VIEW: ACTIVE WIREFRAME]
              </div>

              {/* Swimming Specimen Preview */}
              <div className="relative z-10 py-2">
                <AtlauzFish
                  headIndex={companion.headIndex || 1}
                  bodyIndex={companion.bodyIndex || 1}
                  tailIndex={companion.tailIndex || 1}
                  eyesIndex={companion.eyesIndex || 1}
                  baseColor={companion.baseColor || '#ffffff'}
                  accentColor={companion.accentColor || '#888888'}
                  eyeColor="#ffffff"
                  size={140}
                  animated={true}
                  isSwimming={true}
                  name={primaryFish?.name || companion.name}
                  showName={true}
                />
              </div>

              {/* Specification Chips Preview */}
              <div className="relative z-10 mt-2 flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-mono">
                <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                  Head: {HEAD_OPTIONS[(companion.headIndex || 1) - 1]?.title.split(' ')[0]}
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                  Body: {BODY_OPTIONS[(companion.bodyIndex || 1) - 1]?.title.split(' ')[0]}
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
                  Tail: {TAIL_OPTIONS[(companion.tailIndex || 1) - 1]?.title.split(' ')[0]}
                </span>
                <span className="px-2 py-0.5 rounded bg-white text-black font-bold">
                  Optic: {EYE_OPTIONS[(companion.eyesIndex || 1) - 1]?.title.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Component Anatomy Navigation Tabs */}
            <div className="grid grid-cols-5 gap-1 p-1 rounded bg-black border border-neutral-800 font-mono">
              <button
                onClick={() => setActiveComponentTab('head')}
                className={`py-1.5 text-xs font-bold rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeComponentTab === 'head'
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Head</span>
              </button>

              <button
                onClick={() => setActiveComponentTab('body')}
                className={`py-1.5 text-xs font-bold rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeComponentTab === 'body'
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Waves className="w-3.5 h-3.5" />
                <span>Body</span>
              </button>

              <button
                onClick={() => setActiveComponentTab('tail')}
                className={`py-1.5 text-xs font-bold rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeComponentTab === 'tail'
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tail</span>
              </button>

              <button
                onClick={() => setActiveComponentTab('eyes')}
                className={`py-1.5 text-xs font-bold rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeComponentTab === 'eyes'
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Optics</span>
              </button>

              <button
                onClick={() => setActiveComponentTab('colors')}
                className={`py-1.5 text-xs font-bold rounded transition-all flex flex-col sm:flex-row items-center justify-center gap-1 ${
                  activeComponentTab === 'colors'
                    ? 'bg-white text-black'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span>Grayscale</span>
              </button>
            </div>

            {/* TAB CONTENT: 1. HEAD COMPONENT */}
            {activeComponentTab === 'head' && (
              <div className="grid grid-cols-2 gap-2">
                {HEAD_OPTIONS.map(opt => {
                  const isSelected = (companion.headIndex || 1) === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onUpdateCompanion({ headIndex: opt.id });
                        onShowToast(`Head component calibrated: ${opt.title}`);
                      }}
                      className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{opt.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-1">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 2. BODY COMPONENT */}
            {activeComponentTab === 'body' && (
              <div className="grid grid-cols-2 gap-2">
                {BODY_OPTIONS.map(opt => {
                  const isSelected = (companion.bodyIndex || 1) === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onUpdateCompanion({ bodyIndex: opt.id });
                        onShowToast(`Body component calibrated: ${opt.title}`);
                      }}
                      className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{opt.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-1">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 3. TAIL COMPONENT */}
            {activeComponentTab === 'tail' && (
              <div className="grid grid-cols-2 gap-2">
                {TAIL_OPTIONS.map(opt => {
                  const isSelected = (companion.tailIndex || 1) === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onUpdateCompanion({ tailIndex: opt.id });
                        onShowToast(`Tail propulsion calibrated: ${opt.title}`);
                      }}
                      className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{opt.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-1">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 4. EYES COMPONENT */}
            {activeComponentTab === 'eyes' && (
              <div className="grid grid-cols-2 gap-2">
                {EYE_OPTIONS.map(opt => {
                  const isSelected = (companion.eyesIndex || 1) === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => {
                        onUpdateCompanion({ eyesIndex: opt.id });
                        onShowToast(`Optical reticle calibrated: ${opt.title}`);
                      }}
                      className={`p-3 rounded border text-left transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-neutral-800 border-white text-white'
                          : 'bg-black border-neutral-800 text-neutral-300 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs">{opt.title}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-white" />}
                      </div>
                      <span className="text-[11px] text-neutral-400 mt-1">{opt.desc}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* TAB CONTENT: 5. COLORS & PALETTE */}
            {activeComponentTab === 'colors' && (
              <div className="space-y-3 font-sans">
                {/* Base Body Tone */}
                <div className="p-3 rounded bg-black border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Chassis Base Shading</span>
                    <div className="flex items-center gap-2">
                      {COLOR_SWATCHES.map(sw => (
                        <button
                          key={sw.name}
                          onClick={() => {
                            onUpdateCompanion({ baseColor: sw.hex });
                            if (primaryFish) {
                              onRenameFish(primaryFish.id, primaryFish.name);
                            }
                          }}
                          className={`w-5 h-5 rounded border transition-transform ${
                            companion.baseColor === sw.hex ? 'scale-110 border-white ring-2 ring-white/50' : 'border-neutral-700'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={sw.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Accent Shading */}
                <div className="p-3 rounded bg-black border border-neutral-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white text-xs">Fin & Accent Shading</span>
                    <div className="flex items-center gap-2">
                      {COLOR_SWATCHES.map(sw => (
                        <button
                          key={sw.name}
                          onClick={() => onUpdateCompanion({ accentColor: sw.hex })}
                          className={`w-5 h-5 rounded border transition-transform ${
                            companion.accentColor === sw.hex ? 'scale-110 border-white ring-2 ring-white/50' : 'border-neutral-700'
                          }`}
                          style={{ backgroundColor: sw.hex }}
                          title={sw.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      {/* SECTION 3: Custom Messages & Cognitive Nudges */}
      <section className="flex flex-col rounded-lg bg-neutral-900 border border-neutral-700 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-base">Companion Prompts & Nudges</span>
          </div>
          <button
            onClick={() => onUpdateCompanion({ messagesEnabled: !companion.messagesEnabled })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
              companion.messagesEnabled ? 'bg-white border-white' : 'bg-neutral-800 border-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform ${
                companion.messagesEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'
              }`}
            />
          </button>
        </div>

        {companion.messagesEnabled && (
          <div className="space-y-2.5">
            {/* Message Slot 1 */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-400">SLOT 01 - Circadian Care</span>
              <input
                type="text"
                value={msg1}
                onChange={e => setMsg1(e.target.value)}
                className="w-full bg-black text-white text-xs font-semibold px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:border-white font-mono"
              />
            </div>

            {/* Message Slot 2 */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-400">SLOT 02 - Context Switch Zero</span>
              <input
                type="text"
                value={msg2}
                onChange={e => setMsg2(e.target.value)}
                className="w-full bg-black text-white text-xs font-semibold px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:border-white font-mono"
              />
            </div>

            {/* Message Slot 3 */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono text-neutral-400">SLOT 03 - Milestone Status</span>
              <input
                type="text"
                value={msg3}
                onChange={e => setMsg3(e.target.value)}
                className="w-full bg-black text-white text-xs font-semibold px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:border-white font-mono"
              />
            </div>
          </div>
        )}
      </section>

      {/* SECTION 4: Security & Biometrics */}
      <section className="flex flex-col rounded-lg bg-neutral-900 border border-neutral-700 p-4 sm:p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-white" />
            <span className="font-bold text-white text-base">Security & Authentication</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-black text-neutral-300 font-mono border border-neutral-800">
            LOCAL-SECURE
          </span>
        </div>

        {/* 15-min idle guard */}
        <div className="flex items-center justify-between p-2.5 rounded bg-black border border-neutral-800">
          <div>
            <span className="font-semibold text-white text-xs block">
              15-Min Background Idle Guard
            </span>
            <span className="text-[10px] text-neutral-400">
              Enforce passkey check upon inactivity
            </span>
          </div>
          <button
            onClick={() => onUpdateSettings({ biometricsEnabled: !settings.biometricsEnabled })}
            className={`w-10 h-5 rounded-full p-0.5 transition-colors border ${
              settings.biometricsEnabled ? 'bg-white border-white' : 'bg-neutral-800 border-neutral-700'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full transition-transform ${
                settings.biometricsEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'
              }`}
            />
          </button>
        </div>

        {/* Workspace Handle (8 / 16 limit) */}
        <div className="space-y-1 pt-1 font-mono">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400">Workspace User Identifier</span>
            <span className="text-neutral-300 tabular-nums">{handleInput.length} / 16</span>
          </div>
          <div className="relative">
            <input
              type="text"
              maxLength={16}
              value={handleInput}
              onChange={e => setHandleInput(e.target.value)}
              className="w-full bg-black text-white text-sm font-semibold px-3 py-2 rounded border border-neutral-700 focus:outline-none focus:border-white"
            />
            <CheckCircle2 className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
          </div>
        </div>
      </section>

      {/* ACTION FOOTER DOCK */}
      <div className="flex items-center gap-2 pt-1 font-mono">
        <button
          onClick={handleApply}
          disabled={isApplying}
          className="flex-1 py-2.5 px-4 rounded bg-white text-black font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all"
        >
          <Save className="w-4 h-4" />
          <span>{isApplying ? 'SAVING SPEC...' : 'SAVE COMPANION CONFIGURATION'}</span>
        </button>

        <button
          onClick={handleReset}
          title="Reset to Factory Defaults"
          className="p-2.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-700 active:scale-95 transition-all text-xs font-bold flex items-center gap-1"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">RESET</span>
        </button>
      </div>
    </div>
  );
};
