import React, { useState, useEffect, useRef } from 'react';
import {
  Edit2,
  Check,
  X,
  Plus,
  Heart,
  Droplets,
  Star
} from 'lucide-react';
import { FishCompanion, CognitiveTelemetry, CompanionState } from '../types';
import { AtlauzFish } from './AtlauzFish';
import { AquariumWeatherOverlay, AquariumWeather } from './companion/AquariumWeatherOverlay';

interface FishTankProps {
  fishes: FishCompanion[];
  primaryFishId?: string;
  telemetry: CognitiveTelemetry;
  companionState?: CompanionState;
  onRenameFish: (fishId: string, newName: string) => void;
  onSetPrimaryFish: (fishId: string) => void;
  onOpenFishing: () => void;
  onShowToast: (msg: string) => void;
}

interface FishPhysics {
  id: string;
  x: number; // 5 to 90 %
  y: number; // 15 to 80 %
  vx: number; // horizontal velocity
  vy: number; // vertical velocity
  direction: 1 | -1; // 1 = right, -1 = left
  targetY: number;
  swimPhase: number;
}

interface FoodPellet {
  id: string;
  x: number;
  y: number;
  opacity: number;
}

interface RippleEffect {
  id: string;
  x: number;
  y: number;
}

interface FloatingHeart {
  id: string;
  x: number;
  y: number;
}

export const FishTank: React.FC<FishTankProps> = ({
  fishes,
  primaryFishId,
  telemetry,
  companionState,
  onRenameFish,
  onSetPrimaryFish,
  onOpenFishing,
  onShowToast
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedFishId, setSelectedFishId] = useState<string | null>(null);
  const [editingFishId, setEditingFishId] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');

  // Physics state for autonomous swimming
  const [fishPhysics, setFishPhysics] = useState<{ [id: string]: FishPhysics }>({});
  const [foodPellets, setFoodPellets] = useState<FoodPellet[]>([]);
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [weather, setWeather] = useState<AquariumWeather>('sunlight');
  const [isPlaytimeActive, setIsPlaytimeActive] = useState<boolean>(false);
  const [pointerTarget, setPointerTarget] = useState<{ x: number; y: number } | null>(null);

  // Initialize physics for fishes
  useEffect(() => {
    setFishPhysics(prev => {
      const next = { ...prev };
      fishes.forEach((fish, index) => {
        if (!next[fish.id]) {
          next[fish.id] = {
            id: fish.id,
            x: 15 + ((index * 20) % 70),
            y: 25 + ((index * 15) % 55),
            vx: (Math.random() * 0.3 + 0.25) * (Math.random() > 0.5 ? 1 : -1),
            vy: (Math.random() * 0.15 - 0.075),
            direction: Math.random() > 0.5 ? 1 : -1,
            targetY: 20 + Math.random() * 60,
            swimPhase: Math.random() * Math.PI * 2
          };
        }
      });
      return next;
    });
  }, [fishes]);

  // Main physics loop (autonomous swimming & food chasing)
  useEffect(() => {
    const interval = setInterval(() => {
      setFishPhysics(prev => {
        const updated = { ...prev };

        fishes.forEach(fish => {
          const state = updated[fish.id];
          if (!state) return;

          let newX = state.x;
          let newVx = state.vx;
          let newDirection = state.direction;
          let targetY = state.targetY;

          // If there is food, nearest fish steers towards it
          let targetX: number | null = null;
          if (foodPellets.length > 0) {
            const nearestPellet = foodPellets[0];
            targetX = nearestPellet.x;
            targetY = nearestPellet.y;
          } else if (isPlaytimeActive && pointerTarget) {
            targetX = pointerTarget.x;
            targetY = pointerTarget.y;
          }

          if (targetX !== null) {
            const dx = targetX - state.x;
            newDirection = dx > 0 ? 1 : -1;
            const speed = isPlaytimeActive && foodPellets.length === 0 ? 0.75 : 0.55;
            newVx = newDirection * (speed * (fish.size || 1));
            newX += newVx;
          } else {
            newX += newVx;
            // Boundary bounce
            if (newX > 88) {
              newX = 88;
              newDirection = -1;
              newVx = -Math.abs(newVx);
            } else if (newX < 8) {
              newX = 8;
              newDirection = 1;
              newVx = Math.abs(newVx);
            } else if (Math.random() < 0.015) {
              // Spontaneous direction change
              newDirection = (newDirection === 1 ? -1 : 1) as 1 | -1;
              newVx = newDirection * (Math.random() * 0.3 + 0.25);
            }
          }

          // Gentle vertical undulation
          const dy = targetY - state.y;
          let newY = state.y + dy * 0.035 + Math.sin(state.swimPhase) * 0.2;
          newY = Math.max(15, Math.min(80, newY));

          // Retarget vertical depth occasionally
          if (Math.random() < 0.02 && foodPellets.length === 0) {
            targetY = 20 + Math.random() * 55;
          }

          updated[fish.id] = {
            ...state,
            x: newX,
            y: newY,
            vx: newVx,
            vy: state.vy,
            direction: newDirection,
            targetY,
            swimPhase: state.swimPhase + 0.15
          };
        });

        return updated;
      });

      // Sink food pellets
      setFoodPellets(prev =>
        prev
          .map(p => ({ ...p, y: p.y + 0.6, opacity: p.opacity - 0.012 }))
          .filter(p => p.y < 88 && p.opacity > 0)
      );

      // Check if fish ate pellet
      if (foodPellets.length > 0) {
        setFishPhysics(currentPhys => {
          foodPellets.forEach(pellet => {
            fishes.forEach(fish => {
              const p = currentPhys[fish.id];
              if (p) {
                const dist = Math.hypot(p.x - pellet.x, p.y - pellet.y);
                if (dist < 7) {
                  // Fish ate food! Spawn heart
                  setFloatingHearts(hearts => [
                    ...hearts.slice(-6),
                    { id: `heart-${Date.now()}-${Math.random()}`, x: p.x, y: p.y - 6 }
                  ]);
                  // Remove pellet
                  setFoodPellets(pellets => pellets.filter(item => item.id !== pellet.id));
                }
              }
            });
          });
          return currentPhys;
        });
      }
    }, 50);

    return () => clearInterval(interval);
  }, [fishes, foodPellets]);

  // Mouse move handler for playtime following
  const handleTankMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !isPlaytimeActive) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(10, Math.min(90, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(20, Math.min(80, ((e.clientY - rect.top) / rect.height) * 100));
    setPointerTarget({ x, y });
  };

  const handleTankMouseLeave = () => {
    setPointerTarget(null);
  };

  // Click on tank to drop food & ripples & playtime tricks
  const handleTankClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    // Add ripple
    const rippleId = `rip-${Date.now()}`;
    setRipples(prev => [...prev.slice(-4), { id: rippleId, x: clickX, y: clickY }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== rippleId));
    }, 1200);

    // Drop food pellet
    const pelletId = `food-${Date.now()}`;
    setFoodPellets(prev => [...prev.slice(-3), { id: pelletId, x: clickX, y: clickY, opacity: 1 }]);

    if (isPlaytimeActive) {
      const heartId = `play-${Date.now()}`;
      setFloatingHearts(prev => [...prev.slice(-4), { id: heartId, x: clickX, y: clickY }]);
      setTimeout(() => {
        setFloatingHearts(prev => prev.filter(h => h.id !== heartId));
      }, 1500);
      onShowToast('✨ Companion responded to playtime interaction! Vitality +1');
    }
  };

  const handleStartRename = (fish: FishCompanion) => {
    setEditingFishId(fish.id);
    setNameInput(fish.name);
  };

  const handleSaveRename = (fishId: string) => {
    if (!nameInput.trim()) return;
    onRenameFish(fishId, nameInput.trim());
    setEditingFishId(null);
    onShowToast(`Companion renamed to "${nameInput.trim()}"`);
  };

  const selectedFish = fishes.find(f => f.id === selectedFishId) || null;
  const primaryFish = fishes.find(f => f.id === primaryFishId) || fishes[0];

  return (
    <div className="flex flex-col w-full space-y-3 font-sans">
      {/* Rectangular Observation Tank Container */}
      <div className="relative rounded-lg overflow-hidden border border-neutral-700 bg-neutral-950">
        {/* Tank Top Frame Bezel */}
        <div className="relative z-20 flex items-center justify-between px-3 sm:px-4 py-2 bg-neutral-900 border-b border-neutral-800">
          {/* Companion Name Display & Rename Action */}
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-2 h-2 rounded-full bg-white shrink-0" />
            {editingFishId === primaryFish?.id ? (
              <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
                <input
                  type="text"
                  maxLength={18}
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded border border-white focus:outline-none w-32 font-mono"
                  autoFocus
                  onKeyDown={e => e.key === 'Enter' && handleSaveRename(primaryFish.id)}
                />
                <button
                  onClick={() => handleSaveRename(primaryFish.id)}
                  className="p-1 rounded bg-white text-black hover:bg-neutral-200"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setEditingFishId(null)}
                  className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 min-w-0">
                <span className="font-bold text-white text-sm sm:text-base tracking-tight truncate">
                  {primaryFish?.name || 'Finley'}
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold shrink-0">
                  [PRIMARY SPECIMEN]
                </span>
                <button
                  onClick={() => primaryFish && handleStartRename(primaryFish)}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                  title="Rename your companion"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Tank Capacity & Fishing Rod Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-[11px] text-neutral-300 font-mono">
              <span className="font-bold text-white">{fishes.length}</span>
              <span className="text-neutral-500">/5 Fishes</span>
            </div>

            <button
              onClick={onOpenFishing}
              className="px-2.5 py-1 rounded bg-white text-black text-xs font-bold flex items-center gap-1.5 hover:bg-neutral-200 active:scale-95 transition-all font-mono"
              title="Spend 20 Streaks to reel in a new companion from the deep sea"
            >
              <span>[CAST ROD]</span>
              <span className="text-[10px] px-1 rounded bg-neutral-200 text-black font-bold">
                20d
              </span>
            </button>
          </div>
        </div>

        {/* AQUARIUM INTERIOR STAGE */}
        <div
          ref={containerRef}
          onClick={handleTankClick}
          onMouseMove={handleTankMouseMove}
          onMouseLeave={handleTankMouseLeave}
          className="relative w-full h-72 sm:h-80 select-none cursor-pointer overflow-hidden bg-neutral-950"
          title={isPlaytimeActive ? 'Playtime Active: Move cursor to guide fishes, click to do tricks!' : 'Click inside the tank to drop food and watch fishes gather'}
        >
          {/* Wireframe Depth Coordinate Grid */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-prototype-grid" />

          {/* AMBIENT CLIMATE WEATHER SHADERS */}
          {weather === 'sunlight' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/10 via-amber-400/5 to-transparent mix-blend-screen" />
              {/* Sunlight Shaft Rays */}
              <div
                className="absolute -top-10 left-10 w-32 h-96 bg-gradient-to-b from-amber-200/20 via-amber-300/5 to-transparent rotate-12 blur-sm pointer-events-none"
                style={{ transformOrigin: 'top left' }}
              />
              <div
                className="absolute -top-10 left-1/2 w-44 h-96 bg-gradient-to-b from-amber-100/15 via-amber-200/5 to-transparent -rotate-6 blur-md pointer-events-none"
                style={{ transformOrigin: 'top center' }}
              />
            </div>
          )}

          {weather === 'rain' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-blue-900/20 via-cyan-950/15 to-transparent" />
              {/* Rain Streaks */}
              <div className="absolute inset-0 opacity-25">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[1px] h-12 bg-cyan-200/60 rotate-[18deg] animate-pulse"
                    style={{
                      left: `${(i * 8.5) % 96}%`,
                      top: `${(i * 11) % 75}%`,
                      animationDuration: `${0.8 + (i % 3) * 0.4}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {weather === 'lunar' && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/35 via-purple-950/20 to-black/50" />
              {/* Lunar Stars */}
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-indigo-200/70 animate-ping"
                  style={{
                    left: `${15 + (i * 11)}%`,
                    top: `${10 + (i * 7)}%`,
                    animationDuration: `${2.5 + (i % 4) * 0.5}s`
                  }}
                />
              ))}
            </div>
          )}

          {/* Tank HUD & Weather Controls */}
          <div className="absolute top-2 left-3 font-mono text-[9px] text-neutral-500 pointer-events-none z-20 flex items-center gap-2">
            <span>[AQUATIC TANK STAGE: PROTOTYPE-01]</span>
            {isPlaytimeActive && (
              <span className="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 animate-pulse">
                PLAYTIME TRICKS ACTIVE
              </span>
            )}
          </div>

          <AquariumWeatherOverlay
            weather={weather}
            onChangeWeather={newW => {
              setWeather(newW);
              onShowToast(`Aquarium weather set to: ${newW.toUpperCase()}`);
            }}
            isPlaytimeActive={isPlaytimeActive}
            onTogglePlaytime={() => {
              const next = !isPlaytimeActive;
              setIsPlaytimeActive(next);
              onShowToast(next ? '🎮 Companion playtime active! Move cursor to guide fish' : 'Playtime mode concluded');
            }}
          />

          {/* Air Bubbler Column */}
          <div className="absolute bottom-6 left-8 w-6 h-full pointer-events-none flex flex-col justify-end items-center opacity-40">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-full border border-white/80 bg-white/20 absolute"
                style={{
                  bottom: `${(i * 14) % 90}%`,
                  left: `${(i * 7) % 18}px`,
                  animation: `floatUp ${2.5 + (i % 3) * 0.8}s ease-in infinite`,
                  animationDelay: `${i * 0.4}s`
                }}
              />
            ))}
          </div>

          {/* Fronds / Plant Vector Lines (Monochrome) */}
          <svg
            className="absolute bottom-0 inset-x-0 w-full h-28 pointer-events-none z-0 opacity-40"
            viewBox="0 0 800 140"
            preserveAspectRatio="none"
          >
            <path
              d="M 30 140 Q 20 80 40 30 Q 30 10 35 0"
              stroke="#525252"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="5s"
                repeatCount="indefinite"
                values="
                  M 30 140 Q 20 80 40 30 Q 30 10 35 0;
                  M 30 140 Q 40 80 25 30 Q 15 10 20 0;
                  M 30 140 Q 20 80 40 30 Q 30 10 35 0
                "
              />
            </path>
            <path
              d="M 50 140 Q 65 90 55 45 Q 45 20 50 5"
              stroke="#737373"
              strokeWidth="3.5"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="6s"
                repeatCount="indefinite"
                values="
                  M 50 140 Q 65 90 55 45 Q 45 20 50 5;
                  M 50 140 Q 40 90 60 45 Q 70 20 65 5;
                  M 50 140 Q 65 90 55 45 Q 45 20 50 5
                "
              />
            </path>
            <path
              d="M 750 140 Q 765 85 745 35 Q 735 15 740 0"
              stroke="#525252"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            >
              <animate
                attributeName="d"
                dur="5.5s"
                repeatCount="indefinite"
                values="
                  M 750 140 Q 765 85 745 35 Q 735 15 740 0;
                  M 750 140 Q 735 85 760 35 Q 770 15 765 0;
                  M 750 140 Q 765 85 745 35 Q 735 15 740 0
                "
              />
            </path>
          </svg>

          {/* Substrate bottom border line */}
          <div className="absolute bottom-0 inset-x-0 h-4 border-t border-neutral-800 bg-neutral-900/60 z-0" />

          {/* Interactive Food Pellets */}
          {foodPellets.map(pellet => (
            <div
              key={pellet.id}
              className="absolute w-2 h-2 rounded-full bg-white pointer-events-none z-20 shadow-[0_0_6px_#ffffff]"
              style={{
                left: `${pellet.x}%`,
                top: `${pellet.y}%`,
                opacity: pellet.opacity,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Water Ripples on Click */}
          {ripples.map(r => (
            <div
              key={r.id}
              className="absolute rounded-full border border-white/60 pointer-events-none animate-ping z-20"
              style={{
                left: `${r.x}%`,
                top: `${r.y}%`,
                width: '28px',
                height: '28px',
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}

          {/* Floating Indicators when fish eat */}
          {floatingHearts.map(h => (
            <div
              key={h.id}
              className="absolute pointer-events-none z-30 text-white font-bold text-xs flex items-center gap-1 animate-bounce font-mono"
              style={{
                left: `${h.x}%`,
                top: `${h.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <Heart className="w-3 h-3 fill-white text-white" />
              <span className="text-[10px] text-white">+1 FLOW</span>
            </div>
          ))}

          {/* SWIMMING FISHES (UP TO 5) */}
          {fishes.map((fish, fIdx) => {
            const phys = fishPhysics[fish.id] || {
              x: 50,
              y: 50,
              direction: 1,
              swimPhase: 0
            };
            const isSelected = selectedFishId === fish.id;
            const isPrimary = fish.id === primaryFishId;

            const tailIdx = isPrimary
              ? (companionState?.tailIndex || 1)
              : fish.tailType === 'ribbon' ? 3 : fish.tailType === 'fan' ? 2 : fish.tailType === 'sword' ? 4 : 1;
            const headIdx = isPrimary ? (companionState?.headIndex || 1) : ((fIdx % 4) + 1);
            const bodyIdx = isPrimary ? (companionState?.bodyIndex || 1) : (((fIdx + 1) % 4) + 1);
            const eyeIdx = isPrimary ? (companionState?.eyesIndex || 1) : 1;

            return (
              <div
                key={fish.id}
                onClick={e => {
                  e.stopPropagation();
                  setSelectedFishId(isSelected ? null : fish.id);
                }}
                className={`absolute z-20 transition-transform duration-300 cursor-pointer group ${
                  isSelected ? 'scale-110 drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]' : 'hover:scale-105'
                }`}
                style={{
                  left: `${phys.x}%`,
                  top: `${phys.y}%`,
                  transform: `translate(-50%, -50%) scaleX(${phys.direction})`,
                  width: `${74 * (fish.size || 1)}px`,
                  height: `${44 * (fish.size || 1)}px`
                }}
              >
                {/* Floating Tag */}
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-700 text-[10px] font-mono font-bold text-white whitespace-nowrap z-30 flex items-center gap-1"
                  style={{ transform: `translateX(-50%) scaleX(${phys.direction})` }}
                >
                  {isPrimary && <Star className="w-2.5 h-2.5 text-white fill-white" />}
                  <span>{fish.name}</span>
                </div>

                <AtlauzFish
                  headIndex={headIdx}
                  bodyIndex={bodyIdx}
                  tailIndex={tailIdx}
                  eyesIndex={eyeIdx}
                  baseColor={fish.color || '#ffffff'}
                  accentColor={fish.accentColor || '#888888'}
                  eyeColor="#ffffff"
                  size={70 * (fish.size || 1)}
                  animated={true}
                  isSwimming={true}
                />
              </div>
            );
          })}
        </div>

        {/* Tank Bottom Sub-HUD: Interaction hint & Fish Selector Strip */}
        <div className="p-3 bg-neutral-900 border-t border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-neutral-400">
            <Droplets className="w-3.5 h-3.5 text-neutral-300" />
            <span className="text-[11px]">
              Click tank to drop treats • Click a fish to inspect and rename
            </span>
          </div>

          {/* Quick Roster Thumbnails */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar font-mono">
            {fishes.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFishId(f.id)}
                className={`px-2 py-1 rounded border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  selectedFishId === f.id
                    ? 'bg-white text-black border-white'
                    : 'bg-neutral-950 text-neutral-300 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full border border-neutral-600" style={{ backgroundColor: f.color || '#ffffff' }} />
                <span className="truncate max-w-[80px]">{f.name}</span>
                {f.id === primaryFishId && (
                  <Star className="w-2.5 h-2.5 text-white fill-white" />
                )}
              </button>
            ))}

            {fishes.length < 5 && (
              <button
                onClick={onOpenFishing}
                className="px-2 py-1 rounded border border-dashed border-neutral-600 text-neutral-300 hover:border-white hover:text-white text-[11px] font-semibold flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3 h-3" />
                <span>Add ({5 - fishes.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SELECTED FISH INSPECTOR CARD */}
      {selectedFish && (
        <div className="p-3.5 rounded-lg bg-neutral-900 border border-neutral-700 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in font-sans">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded border border-neutral-600 bg-neutral-800 flex items-center justify-center text-sm font-bold shrink-0 font-mono text-white"
            >
              [F]
            </div>
            <div>
              <div className="flex items-center gap-2">
                {editingFishId === selectedFish.id ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      maxLength={18}
                      value={nameInput}
                      onChange={e => setNameInput(e.target.value)}
                      className="bg-black text-white text-xs font-bold px-2 py-0.5 rounded border border-white focus:outline-none w-28 font-mono"
                      autoFocus
                      onKeyDown={e => e.key === 'Enter' && handleSaveRename(selectedFish.id)}
                    />
                    <button
                      onClick={() => handleSaveRename(selectedFish.id)}
                      className="p-1 rounded bg-white text-black"
                    >
                      <Check className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => setEditingFishId(null)}
                      className="p-1 rounded bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-sm font-bold text-white">{selectedFish.name}</h3>
                    <button
                      onClick={() => handleStartRename(selectedFish)}
                      className="p-1 text-neutral-400 hover:text-white"
                      title="Rename companion"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  </>
                )}
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                  {selectedFish.species}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 font-mono">
                Personality: {selectedFish.personality} • {selectedFish.adoptedAt}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono">
            {selectedFish.id !== primaryFishId && (
              <button
                onClick={() => {
                  onSetPrimaryFish(selectedFish.id);
                  onShowToast(`"${selectedFish.name}" is now your Primary Companion`);
                }}
                className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold border border-neutral-600 flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 text-white" />
                <span>Set Primary</span>
              </button>
            )}

            <button
              onClick={() => {
                const phys = fishPhysics[selectedFish.id];
                if (phys) {
                  setFoodPellets(prev => [
                    ...prev,
                    { id: `treat-${Date.now()}`, x: phys.x, y: Math.max(20, phys.y - 15), opacity: 1 }
                  ]);
                  onShowToast(`Dropped special treat for ${selectedFish.name}`);
                }
              }}
              className="px-3 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-black" />
              <span>Feed Treat</span>
            </button>

            <button
              onClick={() => setSelectedFishId(null)}
              className="p-1.5 rounded text-neutral-400 hover:text-white hover:bg-neutral-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
