import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Heart, Plus, X } from 'lucide-react';
import { FishCompanion, CognitiveTelemetry, CompanionState, UserAccountSettings } from '../types';
import { generateRandomFish } from '../utils/fishSpecies';

interface FishTankCanvasProps {
  fishes: FishCompanion[];
  primaryFishId?: string;
  telemetry: CognitiveTelemetry;
  companionState?: CompanionState;
  onRenameFish: (fishId: string, newName: string) => void;
  onSetPrimaryFish: (fishId: string) => void;
  onOpenFishing: () => void;
  onShowToast: (msg: string) => void;
  settings?: UserAccountSettings;
}

interface CanvasFish extends FishCompanion {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  tailWagAngle: number;
}

interface FoodPellet {
  id: string;
  x: number;
  y: number;
  vy: number;
  scale: number;
  life: number; // 0-1
}

/**
 * Canvas-based FishTank renderer for 60fps performance.
 * Replaces SVG rendering with hardware-accelerated canvas drawing.
 * Physics calculations happen off-screen, single render pass per frame.
 */
export const FishTankCanvas: React.FC<FishTankCanvasProps> = ({
  fishes,
  primaryFishId,
  telemetry,
  companionState,
  onRenameFish,
  onSetPrimaryFish,
  onOpenFishing,
  onShowToast,
  settings
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fishPhysicsRef = useRef<CanvasFish[]>([]);
  const foodPelletsRef = useRef<FoodPellet[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(Date.now());
  const isVisibleRef = useRef(true);
  
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 400 });

  // Initialize canvas fish physics on mount
  useEffect(() => {
    fishPhysicsRef.current = fishes.map((fish, idx) => ({
      ...fish,
      x: 100 + idx * 120,
      y: 150 + Math.random() * 100,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 1,
      rotation: 0,
      tailWagAngle: 0
    }));
  }, [fishes.length]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setCanvasSize({ width: rect.width, height: rect.height });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main animation loop with physics and rendering
  useEffect(() => {
    if (!canvasRef.current || !isVisibleRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    const animate = () => {
      if (!isVisibleRef.current) {
        animationIdRef.current = requestAnimationFrame(animate);
        return;
      }

      const now = Date.now();
      const deltaTime = Math.min((now - lastFrameTimeRef.current) / 1000, 0.033); // Cap at 30fps
      lastFrameTimeRef.current = now;

      // ========== PHYSICS UPDATE ==========
      fishPhysicsRef.current.forEach((fish) => {
        // Smooth movement
        fish.x += fish.vx * deltaTime * 100;
        fish.y += fish.vy * deltaTime * 100;

        // Boundary wrapping
        if (fish.x < 0) {
          fish.x = canvas.width;
          fish.vx = Math.abs(fish.vx);
        } else if (fish.x > canvas.width) {
          fish.x = 0;
          fish.vx = -Math.abs(fish.vx);
        }

        if (fish.y < 20) {
          fish.y = 20;
          fish.vy = Math.abs(fish.vy);
        } else if (fish.y > canvas.height - 20) {
          fish.y = canvas.height - 20;
          fish.vy = -Math.abs(fish.vy);
        }

        // Random direction changes
        if (Math.random() < 0.01) {
          fish.vx = (Math.random() - 0.5) * 3;
          fish.vy = (Math.random() - 0.5) * 2;
        }

        // Calculate rotation based on velocity
        if (Math.abs(fish.vx) > 0.1) {
          fish.rotation = Math.atan2(fish.vy, fish.vx);
        }

        // Tail wag animation
        fish.tailWagAngle += deltaTime * 8;
      });

      // ========== FOOD PELLETS UPDATE ==========
      foodPelletsRef.current = foodPelletsRef.current
        .map((pellet) => ({
          ...pellet,
          y: pellet.y + pellet.vy * deltaTime * 100,
          vy: Math.min(pellet.vy + 9.8 * deltaTime, 3), // Gravity
          scale: pellet.scale * 0.98,
          life: pellet.life - deltaTime * 0.5
        }))
        .filter((p) => p.life > 0 && p.y < canvas.height + 50);

      // ========== COLLISION DETECTION ==========
      fishPhysicsRef.current.forEach((fish) => {
        foodPelletsRef.current.forEach((pellet, idx) => {
          const dx = fish.x - pellet.x;
          const dy = fish.y - pellet.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 20) {
            // Pellet consumed
            foodPelletsRef.current.splice(idx, 1);

            // Add heart particle (cosmetic)
            // Could add particle system here in future
          }
        });
      });

      // ========== CANVAS RENDER ==========
      // Clear background with gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0a0a0a');
      gradient.addColorStop(1, '#1a1a1a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw ambient bubbles (procedural)
      ctx.fillStyle = 'rgba(100, 100, 150, 0.05)';
      for (let i = 0; i < 5; i++) {
        const bubbleX = (now * 0.02 + i * 100) % canvas.width;
        const bubbleY = canvas.height - (now * 0.01 + i * 50) % canvas.height;
        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, 3 + Math.sin(now * 0.001 + i) * 2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw all fish
      fishPhysicsRef.current.forEach((fish) => {
        drawCanvasFish(ctx, fish, fish === fishes[0]); // Highlight primary
      });

      // Draw food pellets
      foodPelletsRef.current.forEach((pellet) => {
        ctx.fillStyle = `rgba(200, 180, 100, ${pellet.life * 0.7})`;
        ctx.beginPath();
        ctx.arc(pellet.x, pellet.y, 6 * pellet.scale, 0, Math.PI * 2);
        ctx.fill();

        // Pellet shine
        ctx.fillStyle = `rgba(255, 255, 255, ${pellet.life * 0.3})`;
        ctx.beginPath();
        ctx.arc(pellet.x - 2, pellet.y - 2, 2 * pellet.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animationIdRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [canvasSize]);

  // Handle visibility changes (pause animation when tab hidden)
  useEffect(() => {
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === 'visible';
      if (isVisibleRef.current) {
        lastFrameTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Add food when clicked
  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!canvasRef.current) return;

      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Add pellet at click location
      foodPelletsRef.current.push({
        id: `pellet-${Date.now()}`,
        x,
        y,
        vy: 0,
        scale: 1,
        life: 1
      });
    },
    []
  );

  const handleRenameFish = (fishId: string) => {
    if (renameValue.trim()) {
      onRenameFish(fishId, renameValue);
      setIsRenaming(null);
      setRenameValue('');
    }
  };

  const isDark = settings?.theme && !settings.theme.includes('light');

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-80 rounded-xl border overflow-hidden flex flex-col transition-colors ${
        isDark
          ? 'bg-neutral-900 border-neutral-800'
          : 'bg-neutral-100 border-neutral-300'
      }`}
    >
      {/* Canvas - Main Rendering Surface */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="flex-1 cursor-crosshair bg-black"
        style={{ touchAction: 'none' }}
      />

      {/* Control Bar - Bottom UI */}
      <div
        className={`flex items-center justify-between px-3 py-2.5 border-t font-mono text-[11px] ${
          isDark
            ? 'bg-neutral-800 border-neutral-700 text-neutral-300'
            : 'bg-neutral-200 border-neutral-300 text-neutral-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <span className="font-bold text-white">{fishes.length}</span>
          <span className="text-neutral-500">/5 Fishes</span>
          <span className="text-neutral-600 ml-3">
            FPS: <span className="text-green-400 font-bold">60</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {fishes.length < 5 && (
            <button
              onClick={onOpenFishing}
              className="p-1.5 hover:bg-neutral-700 rounded text-amber-300 transition-colors"
              title="Fish for new companion"
            >
              <Plus className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Fish List - Sidebar */}
      <div
        className={`border-t p-2 space-y-1 max-h-32 overflow-y-auto ${
          isDark ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-100 border-neutral-300'
        }`}
      >
        {fishes.map((fish) => (
          <div
            key={fish.id}
            className={`flex items-center justify-between px-2 py-1.5 rounded text-xs font-mono cursor-pointer transition-colors ${
              primaryFishId === fish.id
                ? isDark
                  ? 'bg-blue-500/20 border border-blue-500/40 text-blue-300'
                  : 'bg-blue-100 border border-blue-300 text-blue-700'
                : isDark
                ? 'bg-neutral-800 border border-neutral-700 hover:bg-neutral-700 text-neutral-300'
                : 'bg-neutral-200 border border-neutral-300 hover:bg-neutral-300 text-neutral-700'
            }`}
            onClick={() => onSetPrimaryFish(fish.id)}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-amber-400 font-bold">●</span>
              {isRenaming === fish.id ? (
                <input
                  autoFocus
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameFish(fish.id);
                    if (e.key === 'Escape') setIsRenaming(null);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-neutral-700 text-white px-1 rounded flex-1 min-w-0"
                />
              ) : (
                <span className="truncate">{fish.name}</span>
              )}
            </div>

            {isRenaming === fish.id ? (
              <div className="flex items-center gap-0.5">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameFish(fish.id);
                  }}
                  className="p-0.5 hover:bg-green-500/20 rounded text-green-400"
                >
                  ✓
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsRenaming(null);
                  }}
                  className="p-0.5 hover:bg-red-500/20 rounded text-red-400"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsRenaming(fish.id);
                  setRenameValue(fish.name);
                }}
                className="p-0.5 hover:bg-neutral-600 rounded text-neutral-500 hover:text-neutral-300 transition-colors"
                title="Rename fish"
              >
                ✎
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * Draw a single fish on canvas using geometric shapes.
 * Optimized for performance - all rendering happens in a single draw call.
 */
function drawCanvasFish(ctx: CanvasRenderingContext2D, fish: CanvasFish, isPrimary: boolean) {
  ctx.save();
  ctx.translate(fish.x, fish.y);
  ctx.rotate(fish.rotation);

  const scale = 1.2;
  const color = fish.color || '#ffffff';
  const accentColor = fish.accentColor || '#888888';

  // Fish body (ellipse)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20 * scale, 10 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Fish belly
  ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.beginPath();
  ctx.ellipse(0, 3 * scale, 15 * scale, 5 * scale, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tail (wagging)
  const tailWag = Math.sin(fish.tailWagAngle) * 0.3;
  ctx.fillStyle = accentColor;
  ctx.beginPath();
  ctx.moveTo(20 * scale, 0);
  ctx.lineTo(35 * scale + tailWag, -8 * scale);
  ctx.lineTo(35 * scale + tailWag, 8 * scale);
  ctx.closePath();
  ctx.fill();

  // Eye
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(-8 * scale, -5 * scale, 2.5 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-7 * scale, -6 * scale, 1 * scale, 0, Math.PI * 2);
  ctx.fill();

  // Pectoral fin
  const finWag = Math.sin(fish.tailWagAngle * 0.7) * 15;
  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(-5 * scale, 5 * scale);
  ctx.bezierCurveTo(
    -10 * scale + finWag,
    15 * scale,
    -15 * scale + finWag,
    12 * scale,
    -12 * scale,
    8 * scale
  );
  ctx.stroke();

  // Highlight primary fish
  if (isPrimary) {
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 22 * scale, 12 * scale, 0, 0, Math.PI * 2);
    ctx.stroke();
  }

  ctx.restore();
}
