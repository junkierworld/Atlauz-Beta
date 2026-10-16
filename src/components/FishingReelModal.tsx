import React, { useState, useEffect } from 'react';
import {
  X,
  Check,
  Gift
} from 'lucide-react';
import { FishCompanion, CognitiveTelemetry, UserAccountSettings } from '../types';
import { generateRandomFish } from '../utils/fishSpecies';
import { AtlauzFish } from './AtlauzFish';

interface FishingReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  telemetry: CognitiveTelemetry;
  currentFishCount: number;
  onCatchNewFish: (fish: FishCompanion) => void;
  onAddBonusStreaks: (amount: number) => void;
  onShowToast: (msg: string) => void;
  settings?: UserAccountSettings;
}

type FishingStage = 'ready' | 'casting' | 'reeling' | 'can_sealed' | 'revealed';

export const FishingReelModal: React.FC<FishingReelModalProps> = ({
  isOpen,
  onClose,
  telemetry,
  currentFishCount,
  onCatchNewFish,
  onAddBonusStreaks,
  onShowToast,
  settings
}) => {
  const isDark = settings?.theme === 'dark';
  const [stage, setStage] = useState<FishingStage>('ready');
  const [depthMeters, setDepthMeters] = useState(0);
  const [canClickCount, setCanClickCount] = useState(0); // 0, 1, 2, 3
  const [pendingFish, setPendingFish] = useState<FishCompanion | null>(null);
  const [customFishName, setCustomFishName] = useState('');
  const [shakeCan, setShakeCan] = useState(false);

  // Reset state on open
  useEffect(() => {
    if (isOpen) {
      setStage('ready');
      setDepthMeters(0);
      setCanClickCount(0);
      setPendingFish(null);
      setCustomFishName('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const hasEnoughStreaks = telemetry.streakDays >= 20;
  const isTankFull = currentFishCount >= 5;

  const handleStartFishing = () => {
    if (isTankFull) {
      onShowToast('Fish tank is at capacity (5/5 fishes).');
      return;
    }

    if (!hasEnoughStreaks) {
      onShowToast('You need 20 streaks to cast the deep sea rod.');
      return;
    }

    // Begin casting animation
    setStage('casting');
    setDepthMeters(10);

    // Prepare fish to be discovered
    const newFish = generateRandomFish(currentFishCount);
    setPendingFish(newFish);
    setCustomFishName(newFish.name);

    // Deep sea descent animation
    let depth = 10;
    const descentInterval = setInterval(() => {
      depth += Math.floor(Math.random() * 80 + 60);
      if (depth >= 1250) {
        clearInterval(descentInterval);
        setDepthMeters(1250);
        setStage('reeling');

        // Reeling in animation
        setTimeout(() => {
          setStage('can_sealed');
          setCanClickCount(0);
          onShowToast('Salvage tin hooked. Click 3 times to unseal.');
        }, 1600);
      } else {
        setDepthMeters(depth);
      }
    }, 100);
  };

  const handleCanClick = () => {
    if (stage !== 'can_sealed') return;

    setShakeCan(true);
    setTimeout(() => setShakeCan(false), 250);

    const nextCount = canClickCount + 1;
    setCanClickCount(nextCount);

    if (nextCount === 1) {
      onShowToast('Click 1/3: Vacuum seal released.');
    } else if (nextCount === 2) {
      onShowToast('Click 2/3: Lid unlatched.');
    } else if (nextCount >= 3) {
      onShowToast('Click 3/3: Tin unsealed.');
      setTimeout(() => {
        setStage('revealed');
      }, 400);
    }
  };

  const handleConfirmAdoption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFish) return;

    const finalFish: FishCompanion = {
      ...pendingFish,
      name: customFishName.trim() || pendingFish.name
    };

    onCatchNewFish(finalFish);
    onShowToast(`"${finalFish.name}" placed into observation tank.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 animate-fade-in font-sans">
      {/* Backdrop */}
      <div
        onClick={() => stage !== 'casting' && stage !== 'reeling' && onClose()}
        className={`fixed inset-0 backdrop-blur-md transition-opacity bg-black/85`}
      />

      {/* Main Modal Frame */}
      <div className={`relative w-full max-w-lg rounded-lg p-5 sm:p-6 shadow-2xl z-10 overflow-hidden flex flex-col items-center ${isDark ? 'bg-neutral-900 border border-neutral-700 text-white' : 'bg-neutral-50 border border-neutral-300 text-black'}`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={stage === 'casting' || stage === 'reeling'}
          className={`absolute top-4 right-4 p-1.5 rounded text-xs font-mono transition-colors disabled:opacity-30 ${isDark ? 'text-neutral-400 hover:text-white hover:bg-neutral-800' : 'text-neutral-600 hover:text-black hover:bg-neutral-200'}`}
        >
          [X]
        </button>

        {/* STAGE 1: READY / CASTING LAUNCHPAD */}
        {stage === 'ready' && (
          <div className="flex flex-col items-center text-center space-y-4 w-full py-2">
            <div className={`w-12 h-12 rounded border flex items-center justify-center text-2xl font-mono ${isDark ? 'border-neutral-700 bg-neutral-800 text-white' : 'border-neutral-300 bg-neutral-200 text-black'}`}>
              [R]
            </div>

            <div>
              <div className="flex items-center justify-center gap-2">
                <h2 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                  Deep-Sea Salvage Rod
                </h2>
                <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded font-bold uppercase border ${isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-200 text-neutral-700 border-neutral-300'}`}>
                  [PROTOTYPE]
                </span>
              </div>
              <p className={`text-xs max-w-sm mt-1 ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Convert 20 focus streaks into a deep probe to salvage a new aquatic specimen for your tank.
              </p>
            </div>

            {/* Streak & Capacity Gauges */}
            <div className="grid grid-cols-2 gap-2.5 w-full max-w-xs pt-1 font-mono">
              <div className={`p-3 rounded text-center border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'}`}>
                <span className={`text-[10px] uppercase block ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Streak Balance</span>
                <span className={`text-lg font-bold tabular-nums ${isDark ? 'text-white' : 'text-black'}`}>
                  {telemetry.streakDays}d
                </span>
                <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Cost: 20d</span>
              </div>

              <div className={`p-3 rounded text-center border ${isDark ? 'bg-neutral-950 border-neutral-800' : 'bg-neutral-100 border-neutral-300'}`}>
                <span className={`text-[10px] uppercase block ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>Tank Capacity</span>
                <span className={`text-lg font-bold tabular-nums ${isDark ? 'text-white' : 'text-black'}`}>
                  {currentFishCount}/5
                </span>
                <span className={`text-[10px] block ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>{5 - currentFishCount} open</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 w-full max-w-xs pt-2">
              <button
                onClick={handleStartFishing}
                disabled={!hasEnoughStreaks || isTankFull}
                className={`py-2.5 px-4 rounded font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  hasEnoughStreaks && !isTankFull
                    ? 'bg-white text-black hover:bg-neutral-200 active:scale-95'
                    : isDark ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700' : 'bg-neutral-300 text-neutral-600 cursor-not-allowed border border-neutral-400'
                }`}
              >
                <span>{isTankFull ? 'Tank Capacity Reached (5/5)' : 'Cast Rod (20 Streaks)'}</span>
              </button>

              <button
                onClick={() => {
                  onAddBonusStreaks(20);
                  onShowToast('Added +20 Streaks Bonus.');
                }}
                className={`py-1.5 px-3 rounded text-xs font-mono flex items-center justify-center gap-1.5 transition-colors border ${isDark ? 'bg-neutral-950 hover:bg-neutral-800 text-neutral-400 hover:text-white border-neutral-800' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-600 hover:text-black border-neutral-300'}`}
              >
                <Gift className="w-3.5 h-3.5" />
                <span>+20 Streaks (Test / Demo)</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: CASTING & DEEP WATER DESCENT */}
        {stage === 'casting' && (
          <div className="flex flex-col items-center text-center space-y-4 py-6 w-full animate-fade-in font-mono">
            {/* Animated Fishing Line */}
            <div className="relative w-48 h-36 flex items-center justify-center">
              <svg viewBox="0 0 200 160" className="w-full h-full">
                <path
                  d="M 30 140 Q 60 40 160 20"
                  stroke={isDark ? "#ffffff" : "#000000"}
                  strokeWidth="3"
                  fill="none"
                  strokeLinecap="round"
                >
                  <animate
                    attributeName="d"
                    dur="1.5s"
                    repeatCount="indefinite"
                    values="
                      M 30 140 Q 60 40 160 20;
                      M 30 140 Q 80 60 170 35;
                      M 30 140 Q 60 40 160 20
                    "
                  />
                </path>
                <circle cx="45" cy="120" r="6" fill={isDark ? "#888888" : "#777777"} />
                <path
                  d="M 160 20 Q 155 70 155 160"
                  stroke={isDark ? "#cccccc" : "#999999"}
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  fill="none"
                >
                  <animate
                    attributeName="stroke-dashoffset"
                    from="0"
                    to="-40"
                    dur="0.8s"
                    repeatCount="indefinite"
                  />
                </path>
              </svg>
            </div>

            {/* Depth Counter HUD */}
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2">
                <span className={`w-2 h-2 rounded-full animate-ping ${isDark ? 'bg-white' : 'bg-black'}`} />
                <span className={`font-mono text-xl font-bold tracking-wider tabular-nums ${isDark ? 'text-white' : 'text-black'}`}>
                  {depthMeters} METERS
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                {depthMeters < 300
                  ? 'Descending through epipelagic zone...'
                  : depthMeters < 800
                  ? 'Reeling through mesopelagic zone...'
                  : 'Probing bathyal seabed trench...'}
              </p>
            </div>
          </div>
        )}

        {/* STAGE 3: REELING IN WITH A BITE */}
        {stage === 'reeling' && (
          <div className="flex flex-col items-center text-center space-y-4 py-6 w-full animate-fade-in font-mono">
            <div className={`relative w-28 h-28 flex items-center justify-center rounded-full border-2 animate-spin ${isDark ? 'border-neutral-700 border-t-white' : 'border-neutral-300 border-t-black'}`}>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-black'}`}>[!]</span>
            </div>

            <div className="space-y-1">
              <h3 className={`text-base font-bold ${isDark ? 'text-white' : 'text-black'}`}>[SPECIMEN HOOKED]</h3>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Reeling salvage payload to observation surface...
              </p>
            </div>
          </div>
        )}

        {/* STAGE 4: MYSTERY TIN (3 CLICKS TO OPEN GRADUALLY) */}
        {stage === 'can_sealed' && (
          <div className="flex flex-col items-center text-center space-y-4 py-3 w-full animate-fade-in font-sans">
            <div>
              <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold border ${isDark ? 'bg-neutral-800 text-neutral-300 border-neutral-700' : 'bg-neutral-200 text-neutral-700 border-neutral-300'}`}>
                [SALVAGE RETRIEVED]
              </span>
              <h2 className={`text-base font-bold mt-1.5 ${isDark ? 'text-white' : 'text-black'}`}>
                Deep-Sea Specimen Canister
              </h2>
              <p className={`text-xs ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Click canister <span className={`font-bold ${isDark ? 'text-white' : 'text-black'}`}>3 times</span> to release safety latch.
              </p>
            </div>

            {/* Click Progress Indicator */}
            <div className="flex items-center gap-2 font-mono">
              {[1, 2, 3].map(step => (
                <div
                  key={step}
                  className={`flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-bold transition-all ${
                    canClickCount >= step
                      ? 'bg-white text-black'
                      : isDark ? 'bg-neutral-800 text-neutral-500 border border-neutral-700' : 'bg-neutral-200 text-neutral-600 border border-neutral-300'
                  }`}
                >
                  {canClickCount >= step ? <Check className="w-3 h-3 stroke-[3]" /> : <span>{step}</span>}
                  <span>Latch {step}</span>
                </div>
              ))}
            </div>

            {/* INTERACTIVE MYSTERY CAN GRAPHIC */}
            <div
              onClick={handleCanClick}
              className={`relative cursor-pointer select-none transition-transform duration-150 py-2 ${
                shakeCan ? 'animate-wiggle scale-95' : 'hover:scale-105'
              }`}
              title="Click the canister to unseal it"
            >
              {/* Can SVG in monochrome */}
              <svg viewBox="0 0 160 180" className="w-36 h-40">
                <defs>
                  <linearGradient id="canBodyGradMono" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={isDark ? "#1a1a1a" : "#e5e5e5"} />
                    <stop offset="35%" stopColor={isDark ? "#333333" : "#d0d0d0"} />
                    <stop offset="50%" stopColor={isDark ? "#666666" : "#b0b0b0"} />
                    <stop offset="75%" stopColor={isDark ? "#333333" : "#d0d0d0"} />
                    <stop offset="100%" stopColor={isDark ? "#1a1a1a" : "#e5e5e5"} />
                  </linearGradient>

                  <linearGradient id="lidGradMono" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={isDark ? "#cccccc" : "#8c7370"} />
                    <stop offset="50%" stopColor={isDark ? "#888888" : "#6b5b56"} />
                    <stop offset="100%" stopColor={isDark ? "#444444" : "#4a3f3b"} />
                  </linearGradient>
                </defs>

                {/* Cylinder Shadow */}
                <ellipse cx="80" cy="155" rx="55" ry="12" fill={isDark ? "#000000" : "#cccccc"} opacity={isDark ? "0.6" : "0.3"} />

                {/* Cylinder Body */}
                <rect x="25" y="45" width="110" height="95" fill="url(#canBodyGradMono)" stroke={isDark ? "#737373" : "#a0a0a0"} strokeWidth="1.5" rx="2" />
                <ellipse cx="80" cy="140" rx="55" ry="14" fill="url(#canBodyGradMono)" stroke={isDark ? "#737373" : "#a0a0a0"} strokeWidth="1.5" />

                {/* Technical Prototype Canister Label */}
                <rect x="35" y="65" width="90" height="50" rx="3" fill={isDark ? "#111111" : "#f5f5f5"} stroke={isDark ? "#525252" : "#c0c0c0"} strokeWidth="1" />
                <text x="80" y="85" textAnchor="middle" fill={isDark ? "#ffffff" : "#000000"} fontSize="9" fontWeight="bold" fontFamily="Helvetica">
                  ATLAUZ SPECIMEN
                </text>
                <text x="80" y="98" textAnchor="middle" fill={isDark ? "#a3a3a3" : "#666666"} fontSize="8" fontFamily="Helvetica">
                  [LATCH: {canClickCount}/3]
                </text>

                {/* LID STATES (Unopened vs cracked vs open) */}
                {canClickCount === 0 && (
                  <g>
                    <ellipse cx="80" cy="45" rx="55" ry="14" fill="url(#lidGradMono)" stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1.5" />
                    <ellipse cx="80" cy="45" rx="42" ry="9" fill="none" stroke={isDark ? "#262626" : "#e0e0e0"} strokeWidth="1" strokeDasharray="3 2" />
                    <circle cx="80" cy="45" r="5" fill={isDark ? "#111111" : "#ffffff"} stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1" />
                  </g>
                )}

                {canClickCount === 1 && (
                  <g>
                    <ellipse cx="80" cy="45" rx="55" ry="14" fill={isDark ? "#111111" : "#f5f5f5"} stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1" />
                    <path
                      d="M 28 45 C 32 30, 115 15, 130 38"
                      fill="url(#lidGradMono)"
                      stroke={isDark ? "#ffffff" : "#000000"}
                      strokeWidth="1.5"
                    />
                  </g>
                )}

                {canClickCount >= 2 && (
                  <g>
                    <ellipse cx="80" cy="45" rx="55" ry="14" fill={isDark ? "#0a0a0a" : "#ffffff"} stroke={isDark ? "#ffffff" : "#000000"} strokeWidth="1" />
                    <path
                      d="M 32 45 C 40 10, 110 -5, 125 18"
                      fill="url(#lidGradMono)"
                      stroke={isDark ? "#ffffff" : "#000000"}
                      strokeWidth="1.5"
                    />
                    {/* Fish Tail Emerging */}
                    <path
                      d="M 78 45 C 65 25, 60 30, 58 18 C 65 14, 75 22, 78 30 C 82 22, 92 14, 98 18 C 96 30, 91 25, 78 45 Z"
                      fill={isDark ? "#ffffff" : "#000000"}
                      stroke={isDark ? "#262626" : "#e0e0e0"}
                      strokeWidth="1"
                    >
                      <animateTransform
                        attributeName="transform"
                        type="rotate"
                        values="-10 78 45; 10 78 45; -10 78 45"
                        dur="0.4s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </g>
                )}
              </svg>

              <div className={`mt-2 inline-flex items-center gap-1 px-3 py-1 rounded text-xs font-mono font-bold border ${isDark ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-neutral-200 border-neutral-300 text-black'}`}>
                <span>
                  {canClickCount === 0
                    ? 'Click to Unseal (1/3)'
                    : canClickCount === 1
                    ? 'Click to Open Latch (2/3)'
                    : 'Click to Reveal Specimen (3/3)'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* STAGE 5: REVEAL & NAME YOUR NEW COMPANION */}
        {stage === 'revealed' && pendingFish && (
          <form onSubmit={handleConfirmAdoption} className="flex flex-col items-center text-center space-y-4 py-2 w-full animate-fade-in font-sans">
            <div className={`flex items-center gap-1.5 px-3 py-0.5 rounded text-xs font-mono font-bold border ${isDark ? 'bg-neutral-800 text-white border-neutral-700' : 'bg-neutral-200 text-black border-neutral-300'}`}>
              <span>[NEW SPECIMEN SALVAGED]</span>
            </div>

            {/* Fish Vector Silhouette */}
            <div className="relative w-32 h-24 flex items-center justify-center">
              <AtlauzFish
                headIndex={1}
                bodyIndex={1}
                tailIndex={pendingFish.tailType === 'fan' ? 2 : 1}
                eyesIndex={1}
                baseColor={isDark ? "#ffffff" : "#000000"}
                accentColor={isDark ? "#888888" : "#777777"}
                eyeColor={isDark ? "#ffffff" : "#000000"}
                size={110}
                animated={true}
                isSwimming={true}
              />
            </div>

            <div>
              <span className={`text-xs font-mono block ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                Species: {pendingFish.species}
              </span>
              <p className={`text-xs mt-0.5 max-w-sm ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Personality: <span className={`font-medium ${isDark ? 'text-white' : 'text-black'}`}>{pendingFish.personality}</span>
              </p>
            </div>

            {/* Name Input */}
            <div className="w-full max-w-xs space-y-1.5 text-left font-mono">
              <label className={`text-xs font-bold flex items-center justify-between uppercase ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`}>
                <span>[Designate Name]</span>
                <span className={`text-[10px] ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>Required</span>
              </label>
              <input
                type="text"
                maxLength={18}
                value={customFishName}
                onChange={e => setCustomFishName(e.target.value)}
                placeholder="e.g. Echo, Apollo, Marina..."
                className={`w-full rounded px-3 py-2 text-sm font-bold outline-none focus:border-opacity-100 font-mono border ${isDark ? 'bg-neutral-950 border-neutral-700 text-white focus:border-white' : 'bg-neutral-100 border-neutral-300 text-black focus:border-black'}`}
                autoFocus
              />
            </div>

            {/* Quick Name Suggestions */}
            <div className="flex items-center gap-1 flex-wrap justify-center font-mono">
              {['Marina', 'Apollo', 'Celeste', 'Zephyr', 'Echo'].map(name => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setCustomFishName(name)}
                  className={`px-2 py-0.5 rounded text-[10px] border transition-colors ${isDark ? 'bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white border-neutral-700' : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-600 hover:text-black border-neutral-300'}`}
                >
                  {name}
                </button>
              ))}
            </div>

            {/* Confirm */}
            <button
              type="submit"
              disabled={!customFishName.trim()}
              className="w-full max-w-xs py-2.5 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 active:scale-95 transition-all flex items-center justify-center gap-1.5 font-mono"
            >
              <span>Add {customFishName.trim() || 'Specimen'} to Tank</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
