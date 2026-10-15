import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Layers,
  Plus,
  Play,
  Pause,
  RotateCcw,
  Clock,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Minimize2,
  X,
  Info,
  SlidersHorizontal,
  RotateCw,
  Volume2,
  VolumeX,
  LayoutGrid,
  Square,
  CheckSquare,
  GripVertical,
  Compass,
  FileText,
  FileCode,
  GraduationCap,
  Copy,
  ChevronLeft,
  ChevronUp,
  ChevronDown,
  ChevronsRight,
  Check,
  Zap,
  Sliders,
  Users
} from 'lucide-react';
import { ProjectItem, ResourceItem, FocusCardItem, FocusCardPurpose, UserRole, CollaborativeBentoTile } from '../types';
import { initialCollaborativeBentoTiles } from '../data';
import { FULLER_WORKSPACE_TOOL_TAB_COLORS } from '../themes';
import { FocusShiftIcon } from './FocusShiftIcon';
import { FocusCardRenderer } from './FocusCardRenderer';
import { FocusAddCardModal } from './FocusAddCardModal';
import { RoboticCardsReorganizer, RoboticPhase } from './RoboticCardsReorganizer';
import { FocusTransitionIntro } from './FocusTransitionIntro';
import { CollaborativeBentoView } from './CollaborativeBentoView';
import { SkeletonLoader } from './SkeletonLoader';
import { roboticSound } from '../utils/roboticSound';
import { isLightBackground, getAdaptiveTextColor } from '../utils/contrast';

interface WorkspaceViewProps {
  project: ProjectItem;
  resources?: ResourceItem[];
  onOpenResource?: (resource: ResourceItem) => void;
  onShowToast: (msg: string) => void;
  isDistractionFree: boolean;
  onToggleDistractionFree: (active?: boolean) => void;
  userRole?: UserRole;
  collabBentoTiles?: CollaborativeBentoTile[];
  onUpdateCollabBentoTiles?: (tiles: CollaborativeBentoTile[]) => void;
  settings?: { theme?: 'light' | 'dark' };
}

// 8 Tabs utilizing Monochrome Prototype Palette (Standard human working-memory chunking):
const DEFAULT_EIGHT_TABS: FocusCardItem[] = [
  {
    id: 'tab-notes',
    purpose: 'notes',
    title: 'Research Syntheses & Notes',
    subtitle: 'Markdown & Working Memory Buffer',
    category: 'Field Notes',
    badge: 'Core Focus',
    color: '#ffffff',
    notesContent: `# Cognitive Science & UI Architecture Notes

### Key Finding 1: Dynamic Multi-Tab Chunking
Distraction-free focus environments support stacking up to **8 active tabs** corresponding to expanded working memory limits. When in landscape mode, tabs collapse strictly to icons on the left side for pure visual flow. When in portrait, tabs are horizontally arranged across the top.

### Key Finding 2: Sensory Sonar Transducers
- Acoustic carrier: Resynthesized at 240 Hz sinusoidal waveform
- Latency target: Sub-1ms LRA haptic actuation
- Next step: Review §3.4 equations with Dr. Sarah Lin and Elena

*Drafted in Atlauz Distraction-Free Focus Shift Engine.*`
  },
  {
    id: 'tab-docs',
    purpose: 'docs',
    title: 'Google Docs: Marine UI Acoustics Paper',
    subtitle: 'Collaborative Thesis Draft § 3.4',
    category: 'Google Docs',
    badge: 'Live Draft',
    color: '#e5e5e5',
    docContent:
      'Hydrophone frequency profiles (20Hz - 200kHz) are compressed directly into tactile waveform packets, enabling tactile sonar feedback for researchers on touchscreens without acoustic latency. High-impedance transducer signals are normalized using discrete Fourier transforms with saltwater attenuation compensation.'
  },
  {
    id: 'tab-lectures',
    purpose: 'lectures',
    title: 'Lecture: Transformer Mechanics & Sensory Loops',
    subtitle: 'COGS-492 • Dr. Sarah Lin',
    category: 'Interactive Lecture',
    badge: 'Active Audio',
    color: '#cccccc',
    lectureTopic: 'Transformer Mechanics & Attention Mastery',
    lectureInstructor: 'Dr. Sarah Lin • Visiting Faculty',
    lectureProgress: 35
  },
  {
    id: 'tab-slides',
    purpose: 'slides',
    title: 'Canva Slide Deck: Deep Oceanic UI',
    subtitle: '16:9 Presentation Pitch',
    category: 'Canva Deck',
    badge: 'Canva Sync',
    color: '#a3a3a3',
    slideCurrent: 1,
    slideTotal: 4
  },
  {
    id: 'tab-scratchpad',
    purpose: 'scratchpad',
    title: 'Instant Scratchpad: Neural Idea Dump',
    subtitle: 'Unstructured Brainstorm Buffer',
    category: 'Scratchpad',
    badge: 'Quick Capture',
    color: '#888888',
    scratchpadText: `## Rapid Ideas & Hypotheses
• Investigate whether LRA tactile feedback at 240Hz reduces task-switching cognitive fatigue.
• Verify that 8 stacked tabs in landscape provide instant 1-click access without attention residue.
• Drag and drop tabs to reorder your stack with browser-like efficiency.`
  },
  {
    id: 'tab-milestones',
    purpose: 'milestones',
    title: 'Sprint Milestones & Deliverables',
    subtitle: 'Action Items & Progress Tracker',
    category: 'Deliverables',
    badge: 'Milestone',
    color: '#737373',
    milestones: [
      { id: 'm-1', text: 'Stack up to 8 focus tabs in workspace', completed: true },
      { id: 'm-2', text: 'Support drag-and-drop reordering across tabs and piles', completed: true },
      { id: 'm-3', text: 'Adaptive Bento grid layout mode with live tiles', completed: true },
      { id: 'm-4', text: 'Monochrome grayscale prototype with Helvetica typography', completed: true }
    ]
  },
  {
    id: 'tab-pdf',
    purpose: 'pdf',
    title: 'Bathypelagic Acoustic Transmission Spec',
    subtitle: 'Research PDF & Formula Reference',
    category: 'PDF Reader',
    badge: 'Whitepaper',
    color: '#525252'
  },
  {
    id: 'tab-ecosystem',
    purpose: 'journal',
    title: 'Role Ecosystem & Working Memory Hub',
    subtitle: 'Personalized Synthesis Matrix',
    category: 'Ecosystem Hub',
    badge: '8th Tab',
    color: '#333333'
  }
];

export const WorkspaceView: React.FC<WorkspaceViewProps> = ({
  project,
  resources = [],
  onOpenResource,
  onShowToast,
  isDistractionFree,
  onToggleDistractionFree,
  userRole = 'Student',
  collabBentoTiles,
  onUpdateCollabBentoTiles,
  settings
}) => {
  // Up to 8 Tabs State
  const [cards, setCards] = useState<FocusCardItem[]>(DEFAULT_EIGHT_TABS);
  const [activeCardId, setActiveCardId] = useState<string>(DEFAULT_EIGHT_TABS[0].id);

  // Layout View Modes: 'dominant' (Focus Shift) | 'pile' (Stacked Deck) | 'bento' (Adaptive Bento Grid) | 'collab' (Shared Bento)
  const [viewMode, setViewMode] = useState<'dominant' | 'pile' | 'bento' | 'collab'>('dominant');
  const [bentoSubTab, setBentoSubTab] = useState<'adaptive' | 'collaborative'>('adaptive');

  // Use collabBentoTiles from props directly without duplicate state
  const handleUpdateCollabTiles = useCallback((nextTiles: CollaborativeBentoTile[]) => {
    if (onUpdateCollabBentoTiles) {
      onUpdateCollabBentoTiles(nextTiles);
    }
  }, [onUpdateCollabBentoTiles]);

  // Add Tab Modal
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isLayoutTransitioning, setIsLayoutTransitioning] = useState<boolean>(false);

  const handleSwitchViewMode = (mode: 'dominant' | 'pile' | 'bento' | 'collab') => {
    if (viewMode !== mode) {
      setIsLayoutTransitioning(true);
      setViewMode(mode);
      if (mode === 'bento') setBentoSubTab('adaptive');
      if (mode === 'collab') setBentoSubTab('collaborative');
      if (soundEnabled) roboticSound.play('dockClick');
      setTimeout(() => setIsLayoutTransitioning(false), 200);
    }
  };

  // Focus Timer state (Pomodoro 25:00) - persisted to localStorage
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pomodoroSessionSeconds') : null;
    return saved ? Math.max(0, parseInt(saved, 10)) : 25 * 60;
  });
  const [isTimerRunning, setIsTimerRunning] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('pomodoroSessionRunning') : null;
    return saved === 'true';
  });

  // Drag and Drop State for tabs & piles
  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  // Pile Deck state
  const [pileOffsetIndex, setPileOffsetIndex] = useState<number>(0);

  // Audio mini player state for Bento & Lecture cards
  const [audioSpeed, setAudioSpeed] = useState<number>(1.25);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [bentoScratchpad, setBentoScratchpad] = useState<string>(
    '• Focus target: Finalize §3.4 equations\n• Working memory load: 0 context hops\n• Salinity attenuation constant verified'
  );

  // Timer interval effect
  const timerEndTimeRef = useRef<number | null>(null);

  // Persist timer state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pomodoroSessionSeconds', timerSeconds.toString());
      localStorage.setItem('pomodoroSessionRunning', isTimerRunning.toString());
    }
  }, [timerSeconds, isTimerRunning]);

  useEffect(() => {
    if (!isTimerRunning) {
      timerEndTimeRef.current = null;
      return;
    }

    // Set end time on first run
    if (!timerEndTimeRef.current) {
      timerEndTimeRef.current = Date.now() + timerSeconds * 1000;
    }

    const interval = setInterval(() => {
      if (!timerEndTimeRef.current) return;

      const now = Date.now();
      const remainingMs = Math.max(0, timerEndTimeRef.current - now);
      const remainingSeconds = Math.ceil(remainingMs / 1000);

      if (remainingSeconds <= 0) {
        setTimerSeconds(0);
        setIsTimerRunning(false);
        timerEndTimeRef.current = null;
        onShowToast('🔔 Focus sprint complete! Take a restorative breath.');
      } else {
        setTimerSeconds(remainingSeconds);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isTimerRunning, onShowToast]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Keyboard shortcut listener for tabs 1-8 and Esc
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1-8 keys switch tabs when not typing in an input/textarea
      const target = e.target as HTMLElement;
      const isInput = target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA';
      if (!isInput && e.key >= '1' && e.key <= '8') {
        const index = parseInt(e.key, 10) - 1;
        if (cards[index]) {
          setActiveCardId(cards[index].id);
          onShowToast(`Tab ${index + 1}: ${cards[index].title}`);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cards, onShowToast]);

  // Robotic Reorganization State
  const [roboticPhase, setRoboticPhase] = useState<RoboticPhase>('idle');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Focus Mode Entrance transition animation
  const [showFocusIntro, setShowFocusIntro] = useState<boolean>(false);
  const prevDistractionFreeRef = useRef<boolean>(isDistractionFree);

  useEffect(() => {
    if (!prevDistractionFreeRef.current && isDistractionFree) {
      setShowFocusIntro(true);
    }
    prevDistractionFreeRef.current = isDistractionFree;
  }, [isDistractionFree]);

  // Orientation detection
  const [isLandscape, setIsLandscape] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true;
    return window.innerWidth > window.innerHeight;
  });

  useEffect(() => {
    const checkOrientation = () => {
      const isWider = window.innerWidth > window.innerHeight;
      const mediaLandscape = window.matchMedia('(orientation: landscape)').matches;
      setIsLandscape(isWider || mediaLandscape);
    };

    checkOrientation();
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);
    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  interface ReorganizePlan {
    prevCard: FocusCardItem;
    targetCard: FocusCardItem;
    prevInitial: { left: number; top: number; width: number; height: number };
    targetInitial: { left: number; top: number; width: number; height: number };
  }
  const [reorganizePlan, setReorganizePlan] = useState<ReorganizePlan | null>(null);

  const stageContainerRef = useRef<HTMLDivElement>(null);
  const dominantContainerRef = useRef<HTMLDivElement>(null);
  const sideCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const timerRefs = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    return () => {
      timerRefs.current.forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    roboticSound.enabled = soundEnabled;
  }, [soundEnabled]);

  // Tab drag and drop reordering
  const handleDragStart = (id: string) => {
    setDraggedCardId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (id !== dragOverCardId) {
      setDragOverCardId(id);
    }
  };

  const handleDrop = (targetId: string) => {
    if (!draggedCardId || draggedCardId === targetId) {
      setDraggedCardId(null);
      setDragOverCardId(null);
      return;
    }

    const draggedIndex = cards.findIndex(c => c.id === draggedCardId);
    const targetIndex = cards.findIndex(c => c.id === targetId);
    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCards = [...cards];
    const [removed] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, removed);

    setCards(newCards);
    setDraggedCardId(null);
    setDragOverCardId(null);
    if (soundEnabled) roboticSound.play('dockClick');
    onShowToast(`Tab order updated: moved "${removed.title.slice(0, 18)}..."`);
  };

  // Switch dominant tab with reorganization animation
  const handleSelectCard = (clickedId: string) => {
    if (clickedId === activeCardId) return;
    if (roboticPhase !== 'idle') return;

    const targetCard = cards.find(c => c.id === clickedId);
    const currentDominant = cards.find(c => c.id === activeCardId) || cards[0];
    if (!targetCard) return;

    const stageEl = stageContainerRef.current;
    const domEl = dominantContainerRef.current;
    const targetEl = sideCardRefs.current.get(clickedId);

    timerRefs.current.forEach(clearTimeout);
    timerRefs.current = [];

    if (!stageEl || !domEl || !targetEl || viewMode !== 'dominant') {
      setActiveCardId(clickedId);
      onShowToast(`Focus Shifted to ${targetCard.title}`);
      return;
    }

    const stageRect = stageEl.getBoundingClientRect();
    const domRect = domEl.getBoundingClientRect();
    const targetRect = targetEl.getBoundingClientRect();

    const plan: ReorganizePlan = {
      prevCard: currentDominant,
      targetCard: targetCard,
      prevInitial: {
        left: domRect.left - stageRect.left,
        top: domRect.top - stageRect.top,
        width: domRect.width,
        height: domRect.height
      },
      targetInitial: {
        left: targetRect.left - stageRect.left,
        top: targetRect.top - stageRect.top,
        width: targetRect.width,
        height: targetRect.height
      }
    };

    setReorganizePlan(plan);
    setRoboticPhase('shrinking');
    if (soundEnabled) roboticSound.play('unclamp');

    const t1 = setTimeout(() => {
      setRoboticPhase('swapping');
      if (soundEnabled) roboticSound.play('slide');
    }, 450);

    const t2 = setTimeout(() => {
      setRoboticPhase('expanding');
      if (soundEnabled) roboticSound.play('dockClick');
    }, 950);

    const t3 = setTimeout(() => {
      setActiveCardId(clickedId);
      setRoboticPhase('idle');
      setReorganizePlan(null);
      onShowToast(`Focus Shifted to ${targetCard.title}`);
    }, 1300);

    timerRefs.current = [t1, t2, t3];
  };

  const handleUpdateCard = (id: string, updated: Partial<FocusCardItem>) => {
    setCards(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updated } : c))
    );
  };

  const handleChangePurpose = (cardId: string, newPurpose: FocusCardPurpose) => {
    setCards(prev =>
      prev.map(c => {
        if (c.id !== cardId) return c;
        const colorMap: Record<FocusCardPurpose, string> = {
          notes: '#ffffff',
          docs: '#e5e5e5',
          lectures: '#cccccc',
          slides: '#a3a3a3',
          scratchpad: '#888888',
          milestones: '#737373',
          pdf: '#525252',
          journal: '#333333'
        };
        const titleMap: Record<FocusCardPurpose, string> = {
          notes: 'Synthesized Notes',
          docs: 'Document Editor',
          lectures: 'Lecture Review',
          slides: 'Presentation Slides',
          scratchpad: 'Instant Scratchpad',
          milestones: 'Action Milestones',
          pdf: 'PDF Document Reader',
          journal: 'Daily Reflection'
        };
        return {
          ...c,
          purpose: newPurpose,
          title: titleMap[newPurpose] || c.title,
          color: colorMap[newPurpose] || c.color,
          subtitle: `${newPurpose.toUpperCase()} • Selected Tab`
        };
      })
    );
  };

  const handleRemoveCard = (id: string) => {
    if (cards.length <= 1) {
      onShowToast('At least 1 tab is required in focus mode');
      return;
    }
    const filtered = cards.filter(c => c.id !== id);
    setCards(filtered);
    if (activeCardId === id) {
      setActiveCardId(filtered[0].id);
    }
    onShowToast('Tab removed');
  };

  // Add new card (up to 8 tabs)
  const handleAddCard = (newCard: FocusCardItem) => {
    if (cards.length >= 8) {
      onShowToast('Maximum 8 tabs stacked in workspace');
      return;
    }
    setCards(prev => [...prev, newCard]);
    setActiveCardId(newCard.id);
    onShowToast(`Added tab (${cards.length + 1}/8)`);
  };

  const handleResetToDefaultEight = () => {
    setCards(DEFAULT_EIGHT_TABS);
    setActiveCardId(DEFAULT_EIGHT_TABS[0].id);
    onShowToast('Reset to 8 Focus Tabs');
  };

  const handleLaunchFullResource = (type: string) => {
    const found = resources.find(r => r.type === type);
    if (found && onOpenResource) {
      onOpenResource(found);
    } else {
      onShowToast(`Opening ${type} studio`);
    }
  };

  const dominantCard = useMemo(
    () => cards.find(c => c.id === activeCardId) || cards[0],
    [cards, activeCardId]
  );

  const sideCards = useMemo(
    () => cards.filter(c => c.id !== dominantCard.id),
    [cards, dominantCard.id]
  );

  // Stack Pile cycle controls
  const handleCyclePile = (direction: 'next' | 'prev') => {
    const currentIndex = cards.findIndex(c => c.id === activeCardId);
    let nextIndex = 0;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % cards.length;
    } else {
      nextIndex = (currentIndex - 1 + cards.length) % cards.length;
    }
    setActiveCardId(cards[nextIndex].id);
    if (soundEnabled) roboticSound.play('dockClick');
  };

  return (
    <div
      className={`w-full mx-auto transition-all font-sans select-none ${
        isDistractionFree
          ? 'max-w-7xl h-full flex flex-col min-h-0 overflow-hidden'
          : 'max-w-6xl space-y-4'
      }`}
    >
      {/* ================================================================= */}
      {/* WORKSPACE HEADER / CONTROLS (Standard Mode - Compact 2x2 Selector) */}
      {/* ================================================================= */}
      {!isDistractionFree && (
        <div
          style={{
            background: 'var(--theme-card-gradient, #121212)',
            borderColor: 'var(--theme-card-border, #404040)'
          }}
          className="rounded-xl border-2 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-sans shadow-xl transition-all duration-300"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-neutral-700 bg-neutral-950 flex items-center justify-center text-white shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 uppercase">
                  [{project.code}]
                </span>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight font-mono truncate">
                  {project.title}
                </h1>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase hidden xs:inline">
                  {userRole}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 mt-0.5 flex items-center gap-2">
                <span className="font-mono text-neutral-300">{cards.length}/8 Tabs Active</span>
                <span>•</span>
                <span className="text-[10px] text-neutral-400 hidden sm:inline">
                  Drag tabs to reorder
                </span>
              </p>
            </div>
          </div>

          {/* Action strip: 2x2 Compact Mode Grid + Add Tab */}
          <div className="flex items-center gap-2 font-mono shrink-0 self-stretch sm:self-auto justify-between sm:justify-end">
            {/* View Mode Selector: 2 Columns x 2 Rows Compact Grid */}
            <div
              role="tablist"
              aria-label="Workspace layout view modes"
              className="grid grid-cols-2 gap-1 bg-neutral-950 p-1 rounded-lg border border-neutral-800 text-xs"
            >
              <button
                role="tab"
                aria-selected={viewMode === 'dominant'}
                onClick={() => {
                  handleSwitchViewMode('dominant');
                  onShowToast('Focus Shift View (Dominant + Dock)');
                }}
                className={`min-touch-target px-2.5 py-1 rounded transition-all flex items-center justify-center gap-1.5 text-xs ${
                  viewMode === 'dominant'
                    ? 'bg-white text-black font-bold ring-1 ring-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Focus: Single dominant card with compact tab dock"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Focus</span>
              </button>

              <button
                role="tab"
                aria-selected={viewMode === 'pile'}
                onClick={() => {
                  handleSwitchViewMode('pile');
                  onShowToast('Browser Efficiency Stacked Card Pile');
                }}
                className={`min-touch-target px-2.5 py-1 rounded transition-all flex items-center justify-center gap-1.5 text-xs ${
                  viewMode === 'pile'
                    ? 'bg-white text-black font-bold ring-1 ring-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Pile: Stacked deck with hover elevation and drag reordering"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Pile</span>
              </button>

              <button
                role="tab"
                aria-selected={viewMode === 'bento'}
                onClick={() => {
                  handleSwitchViewMode('bento');
                  onShowToast('Adaptive Bento Layout');
                }}
                className={`min-touch-target px-2.5 py-1 rounded transition-all flex items-center justify-center gap-1.5 text-xs ${
                  viewMode === 'bento' && bentoSubTab === 'adaptive'
                    ? 'bg-white text-black font-bold ring-1 ring-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Bento: Modular tile layout"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Bento</span>
              </button>

              <button
                role="tab"
                aria-selected={viewMode === 'collab'}
                onClick={() => {
                  handleSwitchViewMode('collab');
                  onShowToast('Shared Bento Workspaces');
                }}
                className={`min-touch-target px-2.5 py-1 rounded transition-all flex items-center justify-center gap-1 text-xs ${
                  viewMode === 'collab' || (viewMode === 'bento' && bentoSubTab === 'collaborative')
                    ? 'bg-white text-black font-bold ring-1 ring-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Collab: Shared real-time CRDT tiles"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Collab</span>
              </button>
            </div>

            {/* Add Tab Button (Up to 8) */}
            {cards.length < 8 && (
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="min-touch-target px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Add Focus Tab (Up to 8 tabs)"
              >
                <Plus className="w-3.5 h-3.5 text-white" />
                <span className="hidden sm:inline">Add Tab</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* DISTRACTION-FREE SLIM HUD (Next to No Distraction Mode) */}
      {/* ================================================================= */}
      {isDistractionFree && (
        <div className="mb-2 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-2 shrink-0 animate-fade-in font-sans">
          <div className="flex items-center gap-2 min-w-0">
            <FocusShiftIcon size={16} active={true} />
            <div className="min-w-0 flex items-center gap-2">
              <span className="text-xs font-bold tracking-wide text-white font-mono">
                NO DISTRACTION MODE
              </span>
              <span className="text-[10px] text-neutral-400 font-mono hidden sm:inline">
                [Keys 1-8 to switch • Esc to exit]
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            {/* View Mode pills */}
            <div
              role="tablist"
              aria-label="Distraction free layout mode"
              className="flex items-center bg-neutral-950 p-0.5 rounded border border-neutral-800"
            >
              <button
                role="tab"
                aria-selected={viewMode === 'dominant'}
                onClick={() => handleSwitchViewMode('dominant')}
                className={`min-touch-target px-2.5 py-1 rounded text-[11px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white ${
                  viewMode === 'dominant' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Focus
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'pile'}
                onClick={() => handleSwitchViewMode('pile')}
                className={`min-touch-target px-2.5 py-1 rounded text-[11px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white ${
                  viewMode === 'pile' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Pile
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'bento'}
                onClick={() => handleSwitchViewMode('bento')}
                className={`min-touch-target px-2.5 py-1 rounded text-[11px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white ${
                  viewMode === 'bento' && bentoSubTab === 'adaptive' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Bento
              </button>
              <button
                role="tab"
                aria-selected={viewMode === 'collab'}
                onClick={() => handleSwitchViewMode('collab')}
                className={`min-touch-target px-2.5 py-1 rounded text-[11px] flex items-center justify-center gap-1 focus-visible:ring-2 focus-visible:ring-white ${
                  viewMode === 'collab' || (viewMode === 'bento' && bentoSubTab === 'collaborative') ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <span>Collab</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </button>
            </div>

            {/* Timer pill */}
            <div className="flex items-center gap-1.5 bg-neutral-950 border border-neutral-800 px-2 py-1 rounded">
              <Clock className="w-3 h-3 text-neutral-400" />
              <span className="font-bold text-white tabular-nums">{formatTimer(timerSeconds)}</span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-neutral-400 hover:text-white"
              >
                {isTimerRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
            </div>

            {/* EXIT BUTTON */}
            <button
              onClick={() => onToggleDistractionFree(false)}
              className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white text-xs font-semibold flex items-center gap-1 transition-all"
            >
              <X className="w-3.5 h-3.5" />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SKELETON TRANSITION OR ACTIVE WORKSPACE MODE */}
      {/* ================================================================= */}
      {isLayoutTransitioning && (
        <div className="w-full flex-1 p-4 sm:p-6 rounded-lg bg-neutral-900 border border-neutral-800 animate-fade-in">
          <SkeletonLoader type="bento" label="Transitioning workspace layout..." />
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE A: BENTO MODE ("A little bit of everything arranged in an adaptive bento layout") */}
      {/* ================================================================= */}
      {!isLayoutTransitioning && viewMode === 'bento' && (
        <div className="w-full flex-1 min-h-0 overflow-y-auto space-y-4 no-scrollbar pb-6 animate-fade-in">
          {/* Top Quick Bar with Adaptive Grid vs Shared Bento (CRDT) sub-tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-neutral-950 p-0.5 rounded border border-neutral-800">
                <button
                  onClick={() => setBentoSubTab('adaptive')}
                  className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                    bentoSubTab === 'adaptive'
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  <span>Adaptive Grid</span>
                </button>
                <button
                  onClick={() => setBentoSubTab('collaborative')}
                  className={`px-2.5 py-1 rounded transition-all flex items-center gap-1.5 ${
                    bentoSubTab === 'collaborative'
                      ? 'bg-white text-black font-bold'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Shared Bento (CRDT)</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                </button>
              </div>
              <span className="text-neutral-500 hidden md:inline">• 3 Shared Modules Active</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Role: {userRole}</span>
              <button
                onClick={() => setViewMode('dominant')}
                className="px-2 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 text-xs"
              >
                Focus Card
              </button>
            </div>
          </div>

          {bentoSubTab === 'collaborative' ? (
            <CollaborativeBentoView
              tiles={collabBentoTiles || initialCollaborativeBentoTiles}
              onUpdateTiles={handleUpdateCollabTiles}
              onShowToast={onShowToast}
              isDistractionFree={isDistractionFree}
            />
          ) : (
            /* Bento Grid Container */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4">
            {/* TILE 1: FOCAL TASK CARD (Span 8) */}
            <div className="lg:col-span-8 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between min-h-[380px] relative overflow-hidden">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-white text-black font-bold uppercase">
                      FOCAL TILE: {dominantCard.purpose}
                    </span>
                    <span className="text-neutral-400 truncate max-w-[200px]">{dominantCard.title}</span>
                  </div>
                  <button
                    onClick={() => setViewMode('dominant')}
                    className="text-neutral-400 hover:text-white flex items-center gap-1"
                  >
                    <span>Full Focus</span>
                    <Maximize2 className="w-3 h-3" />
                  </button>
                </div>

                <div className="h-[280px] overflow-y-auto no-scrollbar">
                  <FocusCardRenderer
                    card={dominantCard}
                    isDominant={true}
                    isMobileLandscape={isLandscape}
                    onUpdateCard={handleUpdateCard}
                    onRemoveCard={handleRemoveCard}
                    onChangePurpose={handleChangePurpose}
                    onLaunchFullResource={handleLaunchFullResource}
                    onShowToast={onShowToast}
                  />
                </div>
              </div>

              {/* Quick Tab Switcher inside Tile 1 */}
              <div className="pt-2 border-t border-neutral-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar text-[11px] font-mono">
                <span className="text-neutral-500 shrink-0">Switch Tile:</span>
                {cards.map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveCardId(c.id);
                      onShowToast(`Bento focal tile: ${c.title}`);
                    }}
                    className={`px-2 py-0.5 rounded transition-all shrink-0 ${
                      c.id === dominantCard.id
                        ? 'bg-white text-black font-bold'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {i + 1}. {c.purpose}
                  </button>
                ))}
              </div>
            </div>

            {/* TILE 2: COGNITIVE VITAL & FOCUS CADENCE (Span 4) */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between min-h-[380px]">
              <div>
                <div className="flex items-center justify-between pb-2 mb-3 border-b border-neutral-800 font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    Cognitive Cadence
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase">TELEMETRY</span>
                </div>

                {/* Circular Pomodoro Timer Display */}
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4 text-center my-3">
                  <div className="text-3xl font-mono font-bold text-white tabular-nums tracking-wider">
                    {formatTimer(timerSeconds)}
                  </div>
                  <div className="text-[11px] text-neutral-400 font-mono mt-1">
                    Sprint Interval: {isTimerRunning ? 'Active Focus Flow' : 'Paused / Standby'}
                  </div>

                  <div className="flex items-center justify-center gap-2 mt-3">
                    <button
                      onClick={() => setIsTimerRunning(!isTimerRunning)}
                      className="px-4 py-1.5 rounded bg-white text-black font-mono font-bold text-xs flex items-center gap-1.5 hover:bg-neutral-200"
                    >
                      {isTimerRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isTimerRunning ? 'Pause Sprint' : 'Start Sprint'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsTimerRunning(false);
                        setTimerSeconds(25 * 60);
                      }}
                      className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                      title="Reset timer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Telemetry Stats */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">COGNITIVE VITAL</div>
                    <div className="text-white font-bold text-sm mt-0.5">98.4%</div>
                  </div>
                  <div className="bg-neutral-950 p-2 rounded border border-neutral-800">
                    <div className="text-neutral-500 text-[10px]">ACTIVE STREAK</div>
                    <div className="text-white font-bold text-sm mt-0.5">28 Days Safe</div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono mt-3">
                Zero context-switch buffer active. Tabs synchronized.
              </div>
            </div>

            {/* TILE 3: BENTO RAPID SCRATCHPAD BUFFER (Span 4) */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-white" />
                    Rapid Bento Scratchpad
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(bentoScratchpad);
                      onShowToast('Scratchpad copied');
                    }}
                    className="p-1 text-neutral-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>

                <textarea
                  value={bentoScratchpad}
                  onChange={e => setBentoScratchpad(e.target.value)}
                  rows={6}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white font-mono outline-none focus:border-white leading-relaxed resize-none"
                  placeholder="Drop sudden thoughts or formula snippets here..."
                />
              </div>
              <div className="text-[10px] text-neutral-500 font-mono mt-2">
                Auto-saves to active buffer.
              </div>
            </div>

            {/* TILE 4: ROLE ECOSYSTEM & ACTION CHECKLIST (Span 4) */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-white" />
                    {userRole} Ecosystem Checklist
                  </span>
                  <span className="text-[10px] text-neutral-400 uppercase font-mono">ROLE ACTIVE</span>
                </div>

                <div className="space-y-1.5 max-h-[140px] overflow-y-auto no-scrollbar font-mono text-xs">
                  {[
                    { text: 'Cross-align lecture notes with primary thesis drafts', done: true },
                    { text: 'Validate citation matrices in deep sources registry', done: true },
                    { text: 'Check Hadal sonar transducer calibration metrics', done: false },
                    { text: 'Complete reading quiz checkpoints in Library', done: false }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-1.5 rounded bg-neutral-950 border border-neutral-800">
                      {item.done ? (
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                      ) : (
                        <Square className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      )}
                      <span className={`text-[11px] truncate ${item.done ? 'line-through text-neutral-500' : 'text-neutral-300'}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono mt-2">
                Aligned with {userRole} role preferences.
              </div>
            </div>

            {/* TILE 5: AUDIO LECTURE SCRUBBER (Span 4) */}
            <div className="lg:col-span-4 bg-neutral-900 border border-neutral-800 rounded-lg p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-neutral-800 font-mono text-xs">
                  <span className="text-white font-bold flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-white" />
                    Lecture Audio Stream
                  </span>
                  <span className="text-[10px] text-neutral-400">Dr. Sarah Lin</span>
                </div>

                <div className="p-3 bg-neutral-950 border border-neutral-800 rounded space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-neutral-300">COGS-492: Transformers</span>
                    <span className="text-neutral-500">14:22 / 42:00</span>
                  </div>

                  {/* Scrubber track */}
                  <div className="w-full bg-neutral-800 rounded-full h-1.5 relative overflow-hidden">
                    <div className="bg-white h-full w-[35%]" />
                  </div>

                  <div className="flex items-center justify-between pt-1 font-mono text-xs">
                    <button
                      onClick={() => setIsAudioPlaying(!isAudioPlaying)}
                      className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1"
                    >
                      {isAudioPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      <span>{isAudioPlaying ? 'Pause' : 'Play'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      {[1.0, 1.25, 1.5].map(spd => (
                        <button
                          key={spd}
                          onClick={() => setAudioSpeed(spd)}
                          className={`px-1.5 py-0.5 rounded text-[10px] ${
                            audioSpeed === spd ? 'bg-white text-black font-bold' : 'text-neutral-400'
                          }`}
                        >
                          {spd}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-neutral-500 font-mono mt-2">
                Acoustic transcript synchronized with notes.
              </div>
            </div>
          </div>
          )}
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE D: STANDALONE SHARED BENTO WORKSPACES (CRDT & Co-Presence) */}
      {/* ================================================================= */}
      {!isLayoutTransitioning && viewMode === 'collab' && (
        <div className="w-full flex-1 min-h-0 overflow-y-auto space-y-4 no-scrollbar pb-6 animate-fade-in">
          <CollaborativeBentoView
            tiles={collabBentoTiles || initialCollaborativeBentoTiles}
            onUpdateTiles={handleUpdateCollabTiles}
            onShowToast={onShowToast}
            isDistractionFree={isDistractionFree}
          />
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE B: BROWSER EFFICIENCY STACKED CARD PILE ("PILE MODE") */}
      {/* Cards stacked up in a physical prototype pile that can be flipped & reordered */}
      {/* ================================================================= */}
      {!isLayoutTransitioning && viewMode === 'pile' && (
        <div className="w-full flex-1 min-h-0 flex flex-col justify-between py-2 animate-fade-in font-sans">
          {/* Top Pile Deck HUD */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-xs font-mono mb-4">
            <div className="flex items-center gap-2">
              <Square className="w-4 h-4 text-white" />
              <span className="font-bold text-white">Browser Stack Pile</span>
              <span className="text-neutral-500 hidden sm:inline">• Drag & drop or use Bring Up / Send Down</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCyclePile('prev')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1"
                title="Cycle previous card to top"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>
              <button
                onClick={() => handleCyclePile('next')}
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-white flex items-center gap-1"
                title="Cycle next card to top"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('dominant')}
                className="px-2.5 py-1 rounded bg-white text-black font-bold"
              >
                Expand Top
              </button>
            </div>
          </div>

          {/* Physical 3D Stacked Pile Container with Spaced Out Depth & Hover Physics */}
          <div className="relative flex-1 min-h-[500px] flex items-center justify-center p-4">
            <div className="relative w-full max-w-2xl h-[460px]">
              {cards.map((card, index) => {
                const isActive = card.id === dominantCard.id;
                // Compute offset in stack: active is on top
                const activeIndex = cards.findIndex(c => c.id === dominantCard.id);
                const stackDistance = (index - activeIndex + cards.length) % cards.length;
                const isTopFour = stackDistance < 5;

                const topOffset = stackDistance * 26; // More spaced out
                const scale = Math.max(0.82, 1 - stackDistance * 0.035);
                const zIndex = 25 - stackDistance;

                const handleBringForward = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  setActiveCardId(card.id);
                  if (soundEnabled) roboticSound.play('dockClick');
                  onShowToast(`Elevated "${card.title}" to top of pile`);
                };

                const handlePushBack = (e: React.MouseEvent) => {
                  e.stopPropagation();
                  const nextIndex = (index + 1) % cards.length;
                  setActiveCardId(cards[nextIndex].id);
                  if (soundEnabled) roboticSound.play('dockClick');
                  onShowToast(`Sent "${card.title}" down in stack`);
                };

                return (
                  <motion.div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card.id)}
                    onDragOver={e => handleDragOver(e, card.id)}
                    onDrop={() => handleDrop(card.id)}
                    onClick={() => {
                      setActiveCardId(card.id);
                      if (soundEnabled) roboticSound.play('dockClick');
                    }}
                    animate={{
                      top: topOffset,
                      scale: scale,
                      zIndex: zIndex,
                      opacity: isTopFour ? 1 : 0.25
                    }}
                    transition={{ type: 'spring', stiffness: 280, damping: 24 }}
                    className={`absolute inset-x-0 mx-auto w-full h-[360px] rounded-xl border p-4 sm:p-5 cursor-pointer shadow-2xl transition-all duration-200 hover:-translate-y-3 hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.8)] ${
                      isActive
                        ? 'bg-neutral-900 border-white ring-1 ring-white/50'
                        : 'bg-neutral-950 border-neutral-700 hover:border-neutral-400'
                    } ${dragOverCardId === card.id ? 'ring-2 ring-white' : ''}`}
                  >
                    {/* Header Strip with Hover Up/Down Clickable Options */}
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2 mb-3 font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <GripVertical className="w-3.5 h-3.5 text-neutral-500 cursor-grab" />
                        <span className="font-bold text-white uppercase">
                          {card.purpose}
                        </span>
                        <span className="text-neutral-400 hidden xs:inline truncate max-w-[200px]">{card.title}</span>
                      </div>

                      {/* Clickable Hover Up & Down Controls */}
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={handleBringForward}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[10px] font-bold border border-neutral-700 flex items-center gap-1 transition-all"
                          title="Hover Up: Bring this card to front of pile"
                        >
                          <ChevronUp className="w-3 h-3" />
                          <span>Bring Up</span>
                        </button>

                        <button
                          onClick={handlePushBack}
                          className="px-2 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 hover:text-white text-[10px] font-bold border border-neutral-700 flex items-center gap-1 transition-all"
                          title="Send Down: Push this card backward in stack"
                        >
                          <ChevronDown className="w-3 h-3" />
                          <span>Send Down</span>
                        </button>

                        {isActive && (
                          <span className="px-2 py-0.5 rounded bg-white text-black font-bold text-[10px] hidden sm:inline">
                            TOP
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Content Preview */}
                    <div className="h-[220px] overflow-y-auto no-scrollbar font-mono text-xs text-neutral-300">
                      <div className="text-sm font-bold text-white mb-1">{card.title}</div>
                      <div className="text-[11px] text-neutral-400 mb-3">{card.subtitle}</div>

                      {card.notesContent && (
                        <div className="p-3 rounded bg-neutral-950 border border-neutral-800 font-mono text-xs whitespace-pre-wrap leading-relaxed text-neutral-300">
                          {card.notesContent.slice(0, 320)}...
                        </div>
                      )}

                      {card.docContent && (
                        <div className="p-3 rounded bg-neutral-950 border border-neutral-800 font-mono text-xs leading-relaxed text-neutral-300">
                          {card.docContent}
                        </div>
                      )}

                      {card.scratchpadText && (
                        <div className="p-3 rounded bg-neutral-950 border border-neutral-800 font-mono text-xs whitespace-pre-wrap leading-relaxed text-neutral-300">
                          {card.scratchpadText}
                        </div>
                      )}

                      {card.milestones && (
                        <div className="space-y-1.5">
                          {card.milestones.map(m => (
                            <div key={m.id} className="flex items-center gap-2 p-1.5 rounded bg-neutral-950 border border-neutral-800">
                              {m.completed ? <Check className="w-3.5 h-3.5 text-white" /> : <Square className="w-3.5 h-3.5 text-neutral-500" />}
                              <span className={m.completed ? 'line-through text-neutral-500' : 'text-neutral-300'}>{m.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Card Footer */}
                    <div className="absolute bottom-3 inset-x-5 flex items-center justify-between text-[11px] text-neutral-500 font-mono pt-2 border-t border-neutral-800/80">
                      <span>Click to cycle • Up/Down to shift elevation</span>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          setViewMode('dominant');
                        }}
                        className="text-white hover:underline flex items-center gap-1 font-bold"
                      >
                        <span>Focus</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODE C: CLASSIC FOCUS SHIFT (Dominant Card + Dock with Drag & Drop) */}
      {/* ================================================================= */}
      {!isLayoutTransitioning && viewMode === 'dominant' && (
        <div
          ref={stageContainerRef}
          className={`relative flex ${
            isLandscape ? 'flex-row' : 'flex-col'
          } gap-2 sm:gap-3 transition-all flex-1 min-h-0 w-full overflow-hidden ${
            isDistractionFree
              ? 'h-full max-h-full'
              : 'h-[calc(100vh-220px)] min-h-[500px]'
          }`}
        >
          {/* Robotic Reorganization Active Overlay */}
          {reorganizePlan && (
            <RoboticCardsReorganizer
              phase={roboticPhase}
              prevCard={reorganizePlan.prevCard}
              targetCard={reorganizePlan.targetCard}
              prevInitial={reorganizePlan.prevInitial}
              targetInitial={reorganizePlan.targetInitial}
              isDistractionFree={isDistractionFree}
              isMobileLandscape={isLandscape}
              onUpdateCard={handleUpdateCard}
              onRemoveCard={handleRemoveCard}
              onChangePurpose={handleChangePurpose}
              onLaunchFullResource={handleLaunchFullResource}
              onShowToast={onShowToast}
            />
          )}

          {/* ========================================================= */}
          {/* 1. THE STACKED TABS WITH DRAG & DROP REORDERING */}
          {/* Up to 8 tabs. Left vertical in landscape, top horizontal in portrait. */}
          {/* ========================================================= */}
          <div
            className={`
              order-1 shrink-0
              ${
                isLandscape
                  ? 'w-14 sm:w-16 h-full flex flex-col items-center justify-between py-2 border-r border-neutral-800'
                  : 'w-full flex flex-row items-center justify-center gap-2 py-1.5 px-2 border-b border-neutral-800 overflow-x-auto no-scrollbar mx-auto'
              }
            `}
          >
            {/* Tabs List Centered & Fit to Screen */}
            <div
              className={`
                ${
                  isLandscape
                    ? 'flex flex-col items-center justify-center gap-2 w-full max-h-full overflow-y-auto no-scrollbar'
                    : 'flex flex-row items-center justify-center gap-2 w-full overflow-x-auto no-scrollbar mx-auto'
                }
              `}
            >
              {sideCards.map(sideCard => {
                const isTargetMoving =
                  reorganizePlan && reorganizePlan.targetCard.id === sideCard.id;
                const isDragging = draggedCardId === sideCard.id;
                const isDragOver = dragOverCardId === sideCard.id;

                const toolTheme = FULLER_WORKSPACE_TOOL_TAB_COLORS[sideCard.purpose.toLowerCase()];

                return (
                  <div
                    key={`side-${sideCard.id}`}
                    ref={el => {
                      if (el) sideCardRefs.current.set(sideCard.id, el);
                      else sideCardRefs.current.delete(sideCard.id);
                    }}
                    draggable
                    onDragStart={() => handleDragStart(sideCard.id)}
                    onDragOver={e => handleDragOver(e, sideCard.id)}
                    onDrop={() => handleDrop(sideCard.id)}
                    onClick={() => handleSelectCard(sideCard.id)}
                    style={
                      toolTheme
                        ? {
                            backgroundColor: toolTheme.bg,
                            borderColor: toolTheme.border,
                            boxShadow: `0 0 12px ${toolTheme.glow}`
                          }
                        : undefined
                    }
                    className={`
                      w-10 h-10 sm:w-11 sm:h-11 aspect-square shrink-0 rounded border
                      cursor-grab active:cursor-grabbing overflow-hidden relative group flex items-center justify-center touch-manipulation transform-gpu transition-all ${
                      isTargetMoving ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    } ${isDragging ? 'opacity-50 scale-95' : ''} ${isDragOver ? 'ring-2 ring-white' : ''}`}
                    title={`${sideCard.title} (${sideCard.purpose}) • Drag to reorder`}
                  >
                    {/* Left Accent Bar (landscape) or Bottom Accent Bar (horizontal) */}
                    <div
                      style={{ backgroundColor: toolTheme ? toolTheme.border : '#ffffff' }}
                      className={`absolute transition-all ${
                        isLandscape
                          ? 'inset-y-0 left-0 w-1 h-full group-hover:w-1.5'
                          : 'inset-x-0 bottom-0 h-1 w-full group-hover:h-1.5'
                      }`}
                    />

                    {/* Purpose Icon */}
                    <span
                      style={{ color: toolTheme ? toolTheme.text : '#ffffff' }}
                      className="font-mono text-[9px] uppercase font-bold group-hover:text-white"
                    >
                      {sideCard.purpose.slice(0, 3)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom Dock Controls */}
            {isLandscape && (
              <div className="flex flex-col items-center gap-2 pt-2 border-t border-neutral-800 w-full">
                <button
                  onClick={() => setViewMode('bento')}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  title="Switch to Bento Mode"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('pile')}
                  className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white"
                  title="Switch to Browser Pile Mode"
                >
                  <Square className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          {/* ========================================================= */}
          {/* 2. THE DOMINANT ACTIVE FOCUS CARD */}
          {/* ========================================================= */}
          <div
            ref={dominantContainerRef}
            className={`order-2 flex-1 min-h-0 w-full rounded-lg bg-neutral-900 border border-neutral-700 flex flex-col overflow-hidden shadow-2xl relative transition-all ${
              roboticPhase !== 'idle' ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <FocusCardRenderer
              card={dominantCard}
              isDominant={true}
              isMobileLandscape={isLandscape}
              onUpdateCard={handleUpdateCard}
              onRemoveCard={handleRemoveCard}
              onChangePurpose={handleChangePurpose}
              onLaunchFullResource={handleLaunchFullResource}
              onShowToast={onShowToast}
            />
          </div>
        </div>
      )}

      {/* Focus Mode Intro Transition */}
      <AnimatePresence>
        {showFocusIntro && (
          <FocusTransitionIntro cards={cards} onComplete={() => setShowFocusIntro(false)} />
        )}
      </AnimatePresence>

      {/* Add Card Modal */}
      <FocusAddCardModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCard={handleAddCard}
        currentCardCount={cards.length}
        resources={resources}
        onShowToast={onShowToast}
        settings={settings}
      />
    </div>
  );
};
