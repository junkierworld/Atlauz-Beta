import React, { useState, useEffect, useMemo } from 'react';
import {
  Rocket,
  ArrowRight,
  BookOpen,
  Plus,
  Clock,
  Pin,
  AlertTriangle,
  Play,
  Flame,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  MessageCircle,
  Shuffle,
  Volume2,
  Heart,
  Brain,
  Users,
  Share2,
  BookOpenCheck,
  Eye,
  LayoutGrid,
  Square,
  FileText,
  FileCode,
  GraduationCap,
  Sliders,
  ExternalLink,
  Check,
  Trash2,
  X,
  Target,
  Settings2,
  Edit3
} from 'lucide-react';
import {
  CognitiveTelemetry,
  ConnectedApp,
  ResourceItem,
  CompanionState,
  UserRole,
  HubLayoutSettings,
  LibraryTaskItem,
  DueActivityItem
} from '../types';
import { AtlauzFish } from './AtlauzFish';
import { FULLER_HUB_QUADRANT_COLORS } from '../themes';

interface HubViewProps {
  telemetry: CognitiveTelemetry;
  connectedApps: ConnectedApp[];
  resources: ResourceItem[];
  companion?: CompanionState;
  tasks?: LibraryTaskItem[];
  onToggleTask?: (taskId: string) => void;
  onAddTask?: (text: string, category: string, roleTag?: UserRole, resourceId?: string) => void;
  onDeleteTask?: (taskId: string) => void;
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onOpenLibrary: () => void;
  onOpenWorkspace: (mode?: 'dominant' | 'pile' | 'bento' | 'collab') => void;
  onOpenFishing?: () => void;
  onOpenProfile?: () => void;
  onShowToast: (msg: string | { message: string; type?: 'info' | 'success' | 'warning' | 'error' }) => void;
  userRole?: UserRole;
  hubLayout?: HubLayoutSettings;
  onOpenFlashcards?: () => void;
  onOpenStudyRooms?: () => void;
  onOpenNoteGraph?: () => void;
  onOpenDailyReflection?: () => void;
  onOpenEyeBreak?: () => void;
  onOpenCurricularPortal?: () => void;
  flashcardCount?: number;
}

const DEFAULT_DUE_ACTIVITIES: DueActivityItem[] = [
  {
    id: 'due-1',
    title: 'Hadal Acoustic Problem Set & Salinity Derivation',
    subtitle: 'Section 3.4 Hydrophone Waveforms • Thesis Draft',
    dueDate: 'DUE TODAY',
    urgency: 'critical',
    type: 'assignment_due',
    resourceId: 'res-doc-1',
    targetUnit: 'Eq 4.2'
  },
  {
    id: 'due-2',
    title: 'COGS-492 Attention Mechanism Midterm Exam',
    subtitle: 'Transformer Attention & Multi-Head Subspaces',
    dueDate: 'DUE TOMORROW',
    urgency: 'high',
    type: 'exam_scheduled',
    resourceId: 'res-ls-1',
    targetUnit: 'Mod 1-4'
  },
  {
    id: 'due-3',
    title: 'Expiring Course: Cognitive Neural Systems',
    subtitle: 'Certificate graduation window closing in 48h',
    dueDate: '2D LEFT',
    urgency: 'critical',
    type: 'course_expiration',
    targetUnit: 'Capstone'
  },
  {
    id: 'due-4',
    title: 'Oceanic UI Presentation Symposium Review',
    subtitle: '16:9 Canva Deck slide notes verification',
    dueDate: 'OCT 09',
    urgency: 'normal',
    type: 'research_review',
    resourceId: 'res-slide-1',
    targetUnit: 'Canva'
  },
  {
    id: 'due-5',
    title: 'Haptic Feedback Tactile Envelope Synthesis',
    subtitle: '240Hz sinusoidal audio waveform snippet export',
    dueDate: 'OCT 12',
    urgency: 'normal',
    type: 'assignment_due',
    targetUnit: 'Lab'
  }
];

const DEFAULT_TASKS: LibraryTaskItem[] = [
  {
    id: 'ht-1',
    text: 'Draft Pacinian excitation in Docs 1',
    completed: false,
    category: 'Docs • Thesis',
    priority: 'high',
    roleTag: 'Student',
    dueDate: 'Today'
  },
  {
    id: 'ht-2',
    text: 'Review slides § 3.4 vocoder diagrams',
    completed: false,
    category: 'Slides • Canva',
    priority: 'high',
    roleTag: 'Researcher',
    dueDate: 'Today'
  },
  {
    id: 'ht-3',
    text: 'Complete biology check on vascular transport',
    completed: false,
    category: 'Notebook • Lab',
    priority: 'normal',
    roleTag: 'Student',
    dueDate: 'Tomorrow'
  },
  {
    id: 'ht-4',
    text: 'Export 240Hz waveform audio snippet',
    completed: false,
    category: 'Scratchpad • Audio',
    priority: 'medium',
    roleTag: 'Researcher',
    dueDate: 'Friday'
  }
];

export const HubView: React.FC<HubViewProps> = ({
  telemetry,
  connectedApps,
  resources,
  companion,
  tasks: propTasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
  onOpenResource,
  onCreateResourceClick,
  onOpenLibrary,
  onOpenWorkspace,
  onOpenFishing,
  onOpenProfile,
  onShowToast,
  userRole = 'Student',
  hubLayout,
  onOpenFlashcards,
  onOpenStudyRooms,
  onOpenNoteGraph,
  onOpenDailyReflection,
  onOpenEyeBreak,
  onOpenCurricularPortal,
  flashcardCount = 12
}) => {
  // Tasks state
  const [localTasks, setLocalTasks] = useState<LibraryTaskItem[]>(DEFAULT_TASKS);
  const tasks = propTasks && propTasks.length > 0 ? propTasks : localTasks;

  // Due activities state
  const [dueActivities, setDueActivities] = useState<DueActivityItem[]>(DEFAULT_DUE_ACTIVITIES);

  // Pinned item pool (up to 5 items in rotation)
  const [pinnedPool, setPinnedPool] = useState<string[]>(() => {
    if (hubLayout?.customPinnedIds && hubLayout.customPinnedIds.length >= 4) {
      return hubLayout.customPinnedIds;
    }
    return ['res-doc-1', 'res-slide-1', 'res-streak-widget', 'res-nb-1', 'res-flashcard-widget'];
  });

  // Active top-hierarchy selection state (similar to tabs in workspace)
  const [activePinnedId, setActivePinnedId] = useState<string>(() => pinnedPool[0] || 'res-doc-1');
  const [activeDueId, setActiveDueId] = useState<string>(() => DEFAULT_DUE_ACTIVITIES[0].id);

  // Modals state (all centered on screen)
  const [isCustomizePinnedOpen, setIsCustomizePinnedOpen] = useState<boolean>(false);
  const [isConfigureFocusOpen, setIsConfigureFocusOpen] = useState<boolean>(false);
  const [isConfigureDueOpen, setIsConfigureDueOpen] = useState<boolean>(false);
  const [isConfigureTasksOpen, setIsConfigureTasksOpen] = useState<boolean>(false);

  // New task form state
  const [newTaskText, setNewTaskText] = useState<string>('');
  const [newTaskCategory, setNewTaskCategory] = useState<string>('Docs • Thesis');

  // Format today's date
  const todayFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  }, []);

  // Resolve all pinned items data
  const resolveItemData = (id: string) => {
    if (id === 'res-streak-widget') {
      return {
        id: 'res-streak-widget',
        title: 'Streaks Iceberg',
        subtitle: `${telemetry.streakDays}-Day Hadal Flow`,
        tags: ['STREAK', 'FLOW'],
        icon: Flame,
        action: () => {
          if (onOpenFishing) onOpenFishing();
          else onOpenLibrary();
        }
      };
    }
    if (id === 'res-flashcard-widget') {
      return {
        id: 'res-flashcard-widget',
        title: 'Flashcard Decks',
        subtitle: `${flashcardCount} Review Cards`,
        tags: ['MEMORY', 'RECALL'],
        icon: Brain,
        action: () => {
          if (onOpenFlashcards) onOpenFlashcards();
        }
      };
    }
    const found = resources.find(r => r.id === id);
    if (found) {
      const typeTag = found.type.toUpperCase();
      const catTag = found.category.split('•')[0].trim().toUpperCase();
      return {
        id: found.id,
        title: found.title,
        subtitle: found.category,
        tags: [typeTag, catTag.slice(0, 8)],
        icon: found.type === 'document' ? FileText : found.type === 'presentation' ? Layers : found.type === 'notebook' ? BookOpen : FileCode,
        action: () => onOpenResource(found)
      };
    }
    return {
      id,
      title: 'Study Note',
      subtitle: 'General Workspace Note',
      tags: ['NOTE', 'ACTIVE'],
      icon: BookOpen,
      action: onOpenLibrary
    };
  };

  // Resolved list of all pinned items in rotation
  const allResolvedPinned = useMemo(() => {
    return pinnedPool.map(id => resolveItemData(id));
  }, [pinnedPool, resources, telemetry.streakDays, flashcardCount]);

  // The active featured pinned item (on top of hierarchy)
  const activePinnedItem = useMemo(() => {
    const found = allResolvedPinned.find(p => p.id === activePinnedId);
    return found || allResolvedPinned[0];
  }, [allResolvedPinned, activePinnedId]);

  // The sub-grid 4 pinned items (arranging below the top card)
  const subPinnedItems = useMemo(() => {
    return allResolvedPinned.filter(p => p.id !== activePinnedItem.id).slice(0, 4);
  }, [allResolvedPinned, activePinnedItem.id]);

  // The active featured due activity (on top of hierarchy)
  const activeDueActivity = useMemo(() => {
    const found = dueActivities.find(d => d.id === activeDueId);
    return found || dueActivities[0];
  }, [dueActivities, activeDueId]);

  // The sub-grid 4 due activities (arranging below the top card)
  const subDueActivities = useMemo(() => {
    return dueActivities.filter(d => d.id !== activeDueActivity.id).slice(0, 4);
  }, [dueActivities, activeDueActivity.id]);

  // Promote clicked item to top card (tab-like hierarchy arrangement)
  const handlePromotePinned = (id: string) => {
    setActivePinnedId(id);
  };

  const handlePromoteDue = (id: string) => {
    setActiveDueId(id);
  };

  // Task check toggle
  const handleTaskToggle = (id: string) => {
    if (onToggleTask) {
      onToggleTask(id);
    } else {
      setLocalTasks(prev =>
        prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
      );
    }
    onShowToast({ message: 'Task status updated', type: 'info' });
  };

  // Create new task submit
  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    if (onAddTask) {
      onAddTask(newTaskText.trim(), newTaskCategory, userRole);
    } else {
      const newTask: LibraryTaskItem = {
        id: `ht-${Date.now()}`,
        text: newTaskText.trim(),
        completed: false,
        category: newTaskCategory,
        priority: 'high',
        roleTag: userRole,
        dueDate: 'Today'
      };
      setLocalTasks(prev => [newTask, ...prev]);
    }
    setNewTaskText('');
    setIsConfigureTasksOpen(false);
    onShowToast({ message: 'Task added to urgent to-do queue', type: 'success' });
  };

  // Toggle pin in configuration modal
  const togglePinInModal = (id: string) => {
    setPinnedPool(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 4) {
          onShowToast({ message: 'Keep at least 4 pinned items for the 2x2 grid', type: 'warning' });
          return prev;
        }
        return prev.filter(x => x !== id);
      } else {
        if (prev.length >= 6) {
          onShowToast({ message: 'Maximum 6 pinned items in rotation', type: 'warning' });
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const ActivePinnedIcon = activePinnedItem.icon;

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto h-[calc(100dvh-5.5rem)] md:h-auto min-h-0 select-none font-mono text-neutral-200 animate-fade-in justify-between p-1.5 sm:p-3 gap-2 overflow-hidden md:overflow-visible">
      {/* ========================================================================= */}
      {/* 4-QUADRANT EXACT WIREFRAME DIVIDE (Viewport-Fitted on Phone & Adaptive)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 flex-1 min-h-0 w-full h-full">
        {/* ======================================================================= */}
        {/* QUADRANT 1: PINNED CONTENT (Top Left)                                   */}
        {/* ======================================================================= */}
        {/* ======================================================================= */}
        {/* QUADRANT 1: PINNED CONTENT (Top Left)                                   */}
        {/* ======================================================================= */}
        <div
          style={{
            background: 'rgba(8, 8, 10, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.12)'
          }}
          className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden relative transition-all duration-300"
        >
          {/* Header Pill */}
          <div
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
          >
            <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block truncate font-mono">
              PINNED CONTENT
            </span>
          </div>

          {/* Top Featured Card (Active in Hierarchy) */}
          <div
            style={{
              background: 'rgba(13, 13, 16, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="border rounded-xl p-2 sm:p-2.5 flex flex-col justify-between my-1 sm:my-1.5 flex-1 min-h-0 relative group shadow-sm"
          >
            <div className="flex items-start justify-between gap-1 w-full min-h-0">
              <div className="min-w-0 flex-1">
                <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[11px] sm:text-xs font-bold block truncate leading-tight font-sans">
                  {activePinnedItem.title}
                </span>
                <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-[9px] block truncate mt-0.5">
                  {activePinnedItem.subtitle}
                </span>
              </div>
              <div className="p-1 rounded-md bg-black/60 border border-white/10 text-white shrink-0">
                <ActivePinnedIcon className="w-3.5 h-3.5 text-neutral-300" />
              </div>
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/10 mt-1 shrink-0">
              <div className="flex items-center gap-1 flex-wrap overflow-hidden">
                {activePinnedItem.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'var(--theme-text-secondary, #e2e8f0)',
                      borderColor: 'rgba(255,255,255,0.1)'
                    }}
                    className="px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-bold uppercase tracking-tight truncate max-w-[60px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button
                onClick={activePinnedItem.action}
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-1 rounded-full border font-mono font-bold text-[9px] sm:text-[10px] flex items-center gap-1 transition-all active:scale-95 shrink-0 shadow-xs hover:border-white"
              >
                <span>OPEN</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* 2x2 Sub-Grid of Remaining Pinned Items */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 shrink-0">
            {subPinnedItems.map((slot, idx) => {
              const Icon = slot.icon;
              return (
                <button
                  key={`${slot.id}-${idx}`}
                  onClick={() => handlePromotePinned(slot.id)}
                  style={{
                    backgroundColor: 'rgba(10, 10, 14, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  className="p-1.5 rounded-xl border hover:border-white/40 hover:bg-black transition-all flex items-center justify-center gap-1.5 text-left group min-h-[34px] sm:min-h-[40px] relative overflow-hidden"
                  title={`Select ${slot.title} to promote to top`}
                >
                  <Icon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white shrink-0" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-neutral-300 group-hover:text-white truncate font-sans">
                    {slot.title.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Pill: Configure Button */}
          <button
            onClick={() => setIsCustomizePinnedOpen(true)}
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0 hover:border-white/30"
          >
            <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
              CONFIGURE
            </span>
          </button>
        </div>

        {/* ======================================================================= */}
        {/* QUADRANT 2: FOCUS SHORTCUTS (Top Right)                                 */}
        {/* ======================================================================= */}
        <div
          style={{
            background: 'rgba(8, 8, 10, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.12)'
          }}
          className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden relative transition-all duration-300"
        >
          {/* Header Pill */}
          <div
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
          >
            <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block truncate font-mono">
              FOCUS SHORTCUTS
            </span>
          </div>

          {/* 2x2 Grid of 4 Tall Vertical Mode Cards */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 my-1 sm:my-1.5 flex-1 min-h-0">
            {/* Focus Mode */}
            <button
              onClick={() => onOpenWorkspace('dominant')}
              style={{
                background: 'rgba(13, 13, 16, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.12)'
              }}
              className="p-1.5 sm:p-2 rounded-xl border hover:border-white/40 transition-all flex flex-col justify-between items-center text-center group min-h-0 relative shadow-xs"
            >
              <div className="p-1 rounded-md bg-black/60 border border-white/10 text-white shrink-0">
                <Square className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
              </div>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-[11px] font-bold uppercase block tracking-tight font-mono">
                FOCUS
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-0.5 rounded-full border font-mono font-bold text-[8px] sm:text-[9px] block shadow-xs group-hover:border-white"
              >
                OPEN
              </span>
            </button>

            {/* Bento Mode */}
            <button
              onClick={() => onOpenWorkspace('bento')}
              style={{
                background: 'rgba(13, 13, 16, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.12)'
              }}
              className="p-1.5 sm:p-2 rounded-xl border hover:border-white/40 transition-all flex flex-col justify-between items-center text-center group min-h-0 relative shadow-xs"
            >
              <div className="p-1 rounded-md bg-black/60 border border-white/10 text-white shrink-0">
                <LayoutGrid className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
              </div>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-[11px] font-bold uppercase block tracking-tight font-mono">
                BENTO
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-0.5 rounded-full border font-mono font-bold text-[8px] sm:text-[9px] block shadow-xs group-hover:border-white"
              >
                OPEN
              </span>
            </button>

            {/* Pile Mode */}
            <button
              onClick={() => onOpenWorkspace('pile')}
              style={{
                background: 'rgba(13, 13, 16, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.12)'
              }}
              className="p-1.5 sm:p-2 rounded-xl border hover:border-white/40 transition-all flex flex-col justify-between items-center text-center group min-h-0 relative shadow-xs"
            >
              <div className="p-1 rounded-md bg-black/60 border border-white/10 text-white shrink-0">
                <Layers className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
              </div>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-[11px] font-bold uppercase block tracking-tight font-mono">
                PILE
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-0.5 rounded-full border font-mono font-bold text-[8px] sm:text-[9px] block shadow-xs group-hover:border-white"
              >
                OPEN
              </span>
            </button>

            {/* Collab Mode */}
            <button
              onClick={() => onOpenWorkspace('collab')}
              style={{
                background: 'rgba(13, 13, 16, 0.9)',
                borderColor: 'rgba(255, 255, 255, 0.12)'
              }}
              className="p-1.5 sm:p-2 rounded-xl border hover:border-white/40 transition-all flex flex-col justify-between items-center text-center group min-h-0 relative shadow-xs"
            >
              <div className="p-1 rounded-md bg-black/60 border border-white/10 text-white shrink-0">
                <Users className="w-3.5 h-3.5 text-neutral-300 group-hover:text-white" />
              </div>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-[11px] font-bold uppercase block tracking-tight font-mono">
                COLLAB
              </span>
              <span
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-0.5 rounded-full border font-mono font-bold text-[8px] sm:text-[9px] block shadow-xs group-hover:border-white"
              >
                OPEN
              </span>
            </button>
          </div>

          {/* Bottom Pill: Configure Button */}
          <button
            onClick={() => setIsConfigureFocusOpen(true)}
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0 hover:border-white/30"
          >
            <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
              CONFIGURE
            </span>
          </button>
        </div>

        {/* ======================================================================= */}
        {/* QUADRANT 3: DUE ACTIVITIES (Bottom Left)                                */}
        {/* ======================================================================= */}
        <div
          style={{
            background: 'rgba(8, 8, 10, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.12)'
          }}
          className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden relative transition-all duration-300"
        >
          {/* Header Pill */}
          <div
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
          >
            <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block truncate font-mono">
              DUE ACTIVITIES
            </span>
          </div>

          {/* Top Featured Due Activity (Active in Hierarchy) */}
          <div
            style={{
              background: 'rgba(13, 13, 16, 0.9)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="border rounded-xl p-2 sm:p-2.5 flex flex-col justify-between my-1 sm:my-1.5 flex-1 min-h-0 relative group shadow-sm"
          >
            <div className="flex items-start justify-between gap-1 w-full min-h-0">
              <div className="min-w-0 flex-1">
                <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[11px] sm:text-xs font-bold block truncate leading-tight font-sans">
                  {activeDueActivity.title}
                </span>
                <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-[9px] block truncate mt-0.5">
                  {activeDueActivity.subtitle}
                </span>
              </div>
              <div
                style={{
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  borderColor: 'rgba(255,255,255,0.15)',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="w-6 h-6 rounded-md border flex items-center justify-center font-bold text-xs shrink-0 font-mono"
              >
                {activeDueActivity.id.replace('due-', '')}
              </div>
            </div>

            <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t border-white/10 mt-1 shrink-0">
              <div className="flex items-center gap-1 flex-wrap overflow-hidden">
                <span
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'var(--theme-text-secondary, #e2e8f0)',
                    borderColor: 'rgba(255,255,255,0.12)'
                  }}
                  className="px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-bold uppercase tracking-tight truncate max-w-[70px] font-mono"
                >
                  {activeDueActivity.dueDate}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    color: 'var(--theme-text-muted, #a3a3a3)',
                    borderColor: 'rgba(255,255,255,0.1)'
                  }}
                  className="px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-bold uppercase tracking-tight truncate max-w-[60px] font-mono"
                >
                  {activeDueActivity.targetUnit || 'UNIT'}
                </span>
              </div>

              <button
                onClick={() => onOpenWorkspace('dominant')}
                style={{
                  backgroundColor: 'rgba(20, 20, 28, 0.9)',
                  borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                  color: 'var(--theme-accent, #ffffff)'
                }}
                className="px-2.5 py-1 rounded-full border font-mono font-bold text-[9px] sm:text-[10px] flex items-center gap-1 transition-all active:scale-95 shrink-0 shadow-xs hover:border-white"
              >
                <span>OPEN</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

          {/* 2x2 Sub-Grid of Remaining Due Activities with Number Badges */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5 shrink-0">
            {subDueActivities.map((act, idx) => {
              const rankNum = act.id.replace('due-', '');
              return (
                <button
                  key={act.id}
                  onClick={() => handlePromoteDue(act.id)}
                  style={{
                    backgroundColor: 'rgba(10, 10, 14, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  className="p-1.5 rounded-xl border hover:border-white/40 transition-all flex items-center justify-between gap-1 text-left group min-h-[34px] sm:min-h-[40px] relative overflow-hidden"
                  title={`Promote activity #${rankNum} to top`}
                >
                  <div className="w-5 h-5 rounded-md bg-black/60 border border-white/10 text-neutral-300 group-hover:text-white flex items-center justify-center text-xs font-bold shrink-0 font-mono">
                    {rankNum}
                  </div>
                  <span className="text-[8px] sm:text-[9px] font-bold text-neutral-400 group-hover:text-white px-1 py-0.5 rounded bg-black/50 border border-white/10 shrink-0 font-mono">
                    {act.dueDate.includes('TODAY') ? 'DUE TODAY' : act.dueDate}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom Pill: Configure Button */}
          <button
            onClick={() => setIsConfigureDueOpen(true)}
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0 hover:border-white/30"
          >
            <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
              CONFIGURE
            </span>
          </button>
        </div>

        {/* ======================================================================= */}
        {/* QUADRANT 4: TO-DO-TASKS (Bottom Right)                                  */}
        {/* ======================================================================= */}
        <div
          style={{
            background: 'rgba(8, 8, 10, 0.95)',
            borderColor: 'rgba(255, 255, 255, 0.12)'
          }}
          className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden relative transition-all duration-300"
        >
          {/* Header Pill */}
          <div
            style={{
              backgroundColor: 'rgba(12, 12, 16, 0.95)',
              borderColor: 'rgba(255, 255, 255, 0.12)'
            }}
            className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
          >
            <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block truncate font-mono">
              TO-DO-TASKS
            </span>
          </div>

          {/* Stack of 2 Active Task Cards (Fitting Vertically) */}
          <div className="flex flex-col gap-1 sm:gap-1.5 my-1 sm:my-1.5 flex-1 min-h-0 justify-between">
            {tasks.slice(0, 2).map((t, idx) => {
              const catTags = t.category.split('•').map(x => x.trim().toUpperCase());
              return (
                <div
                  key={t.id}
                  style={{
                    background: 'rgba(13, 13, 16, 0.9)',
                    borderColor: 'rgba(255, 255, 255, 0.12)'
                  }}
                  className="border rounded-xl p-2 flex flex-col justify-between flex-1 min-h-0 relative shadow-sm"
                >
                  <div className="flex items-start justify-between gap-1.5 min-w-0">
                    <div className="flex items-start gap-1.5 min-w-0 flex-1">
                      <button
                        onClick={() => handleTaskToggle(t.id)}
                        className={`w-3.5 h-3.5 rounded mt-0.5 flex items-center justify-center border transition-colors shrink-0 ${
                          t.completed
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'bg-black/60 border-white/20 hover:border-white'
                        }`}
                      >
                        {t.completed && <Check className="w-2.5 h-2.5 text-white" />}
                      </button>
                      <span
                        className={`text-[10px] sm:text-[11px] block font-sans truncate leading-tight ${
                          t.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                        }`}
                      >
                        {t.text}
                      </span>
                    </div>

                    <button
                      onClick={() => onOpenWorkspace('dominant')}
                      style={{
                        backgroundColor: 'rgba(20, 20, 28, 0.9)',
                        borderColor: 'var(--theme-card-border, rgba(255,255,255,0.25))',
                        color: 'var(--theme-accent, #ffffff)'
                      }}
                      className="px-2 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-mono font-bold shrink-0 hover:border-white"
                    >
                      JUMP →
                    </button>
                  </div>

                  <div className="flex items-center gap-1 pt-1 border-t border-white/10 mt-1 shrink-0">
                    {catTags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        style={{
                          backgroundColor: 'rgba(0,0,0,0.5)',
                          color: 'var(--theme-text-secondary, #e2e8f0)',
                          borderColor: 'rgba(255,255,255,0.1)'
                        }}
                        className="px-1.5 py-0.2 rounded-full border text-[8px] sm:text-[9px] font-mono font-bold uppercase tracking-tight truncate max-w-[65px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Pill: Configure Button */}
          <button
            onClick={() => setIsConfigureTasksOpen(true)}
            className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 text-center transition-colors shrink-0"
          >
            <span className="text-[9px] sm:text-[10px] font-bold text-neutral-300 uppercase tracking-wider block">
              CONFIGURE
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: CONFIGURE PINNED SHORTCUTS (Centered on Screen)                  */}
      {/* ========================================================================= */}
      {isCustomizePinnedOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono">
          <div className="bg-[#0e0e0e] border border-neutral-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Pin className="w-4 h-4 text-white fill-current" />
                  <span>Configure Pinned Content</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Select 4 to 6 quick-transport cards to feature in the Hub rotation.
                </p>
              </div>
              <button
                onClick={() => setIsCustomizePinnedOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {/* Special widgets */}
              <div
                onClick={() => togglePinInModal('res-streak-widget')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  pinnedPool.includes('res-streak-widget')
                    ? 'bg-neutral-900 border-white text-white'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold font-sans">Streaks Hadal Iceberg</span>
                </div>
                {pinnedPool.includes('res-streak-widget') && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              <div
                onClick={() => togglePinInModal('res-flashcard-widget')}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  pinnedPool.includes('res-flashcard-widget')
                    ? 'bg-neutral-900 border-white text-white'
                    : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Brain className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold font-sans">Flashcard Memory Decks</span>
                </div>
                {pinnedPool.includes('res-flashcard-widget') && (
                  <Check className="w-4 h-4 text-emerald-400" />
                )}
              </div>

              {/* All library resources */}
              {resources.map(r => {
                const isSelected = pinnedPool.includes(r.id);
                return (
                  <div
                    key={r.id}
                    onClick={() => togglePinInModal(r.id)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-neutral-900 border-white text-white'
                        : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <BookOpen className="w-4 h-4 text-neutral-400 shrink-0" />
                      <div className="min-w-0">
                        <span className="text-xs font-bold font-sans block truncate text-white">
                          {r.title}
                        </span>
                        <span className="text-[10px] text-neutral-500 block truncate">
                          {r.category}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 ml-2" />
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-xs">
              <span className="text-neutral-400">
                Selected: <strong className="text-white">{pinnedPool.length}</strong> items in pool
              </span>
              <button
                onClick={() => {
                  setIsCustomizePinnedOpen(false);
                  onShowToast({ message: 'Pinned shortcuts updated', type: 'success' });
                }}
                className="px-4 py-2 rounded-full bg-white text-black font-bold font-mono hover:bg-neutral-200 transition-all"
              >
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: CONFIGURE FOCUS SHORTCUTS (Centered on Screen)                   */}
      {/* ========================================================================= */}
      {isConfigureFocusOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono">
          <div className="bg-[#0e0e0e] border border-neutral-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Target className="w-4 h-4 text-white" />
                  <span>Workspace Modes</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Select your default study layout or jump straight to a mode.
                </p>
              </div>
              <button
                onClick={() => setIsConfigureFocusOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsConfigureFocusOpen(false);
                  onOpenWorkspace('dominant');
                }}
                className="p-3 rounded-xl bg-black border border-neutral-800 hover:border-white text-left transition-all"
              >
                <Square className="w-4 h-4 text-white mb-1" />
                <span className="text-xs font-bold text-white block">Focus Mode</span>
                <span className="text-[10px] text-neutral-400 block font-sans">Single pane</span>
              </button>

              <button
                onClick={() => {
                  setIsConfigureFocusOpen(false);
                  onOpenWorkspace('bento');
                }}
                className="p-3 rounded-xl bg-black border border-neutral-800 hover:border-white text-left transition-all"
              >
                <LayoutGrid className="w-4 h-4 text-white mb-1" />
                <span className="text-xs font-bold text-white block">Bento Mode</span>
                <span className="text-[10px] text-neutral-400 block font-sans">2x2 multitasking</span>
              </button>

              <button
                onClick={() => {
                  setIsConfigureFocusOpen(false);
                  onOpenWorkspace('pile');
                }}
                className="p-3 rounded-xl bg-black border border-neutral-800 hover:border-white text-left transition-all"
              >
                <Layers className="w-4 h-4 text-white mb-1" />
                <span className="text-xs font-bold text-white block">Pile Mode</span>
                <span className="text-[10px] text-neutral-400 block font-sans">3D spatial stack</span>
              </button>

              <button
                onClick={() => {
                  setIsConfigureFocusOpen(false);
                  onOpenWorkspace('collab');
                }}
                className="p-3 rounded-xl bg-black border border-neutral-800 hover:border-white text-left transition-all"
              >
                <Users className="w-4 h-4 text-white mb-1" />
                <span className="text-xs font-bold text-white block">Collab Mode</span>
                <span className="text-[10px] text-neutral-400 block font-sans">CRDT multiplayer</span>
              </button>
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsConfigureFocusOpen(false)}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: CONFIGURE DUE ACTIVITIES (Centered on Screen)                    */}
      {/* ========================================================================= */}
      {isConfigureDueOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono">
          <div className="bg-[#0e0e0e] border border-neutral-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Due Activities Manager</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Select which activity takes top priority or jump directly into study.
                </p>
              </div>
              <button
                onClick={() => setIsConfigureDueOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 no-scrollbar">
              {dueActivities.map(act => (
                <div
                  key={act.id}
                  onClick={() => {
                    setActiveDueId(act.id);
                    setIsConfigureDueOpen(false);
                    onShowToast({ message: `Activity "${act.title}" set to top priority`, type: 'info' });
                  }}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    act.id === activeDueId
                      ? 'bg-neutral-900 border-amber-400 text-white'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-bold text-white block truncate font-sans">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate font-sans">
                      {act.subtitle}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-neutral-900 border border-neutral-700 text-[10px] text-amber-300 font-bold ml-2 shrink-0">
                    {act.dueDate}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsConfigureDueOpen(false)}
                className="px-4 py-2 rounded-full bg-white text-black font-bold font-mono text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CONFIGURE TO-DO TASKS & ADD TASK (Centered on Screen)            */}
      {/* ========================================================================= */}
      {isConfigureTasksOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 font-mono">
          <div className="bg-[#0e0e0e] border border-neutral-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Configure To-Do Tasks</span>
                </h3>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  Add new cross-document actions or manage your study queue.
                </p>
              </div>
              <button
                onClick={() => setIsConfigureTasksOpen(false)}
                className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Add Task Form */}
            <form onSubmit={handleCreateTask} className="space-y-2.5 p-3 rounded-xl bg-black border border-neutral-800">
              <span className="text-xs font-bold text-neutral-200 block uppercase">
                Add New Cross-Doc Task
              </span>
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                placeholder="e.g. Write Section 3.4 proof in Docs..."
                className="w-full bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-sans"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <select
                  value={newTaskCategory}
                  onChange={e => setNewTaskCategory(e.target.value)}
                  className="bg-neutral-900 border border-neutral-700 rounded-lg px-2.5 py-1.5 text-xs text-neutral-300 font-mono"
                >
                  <option value="Docs • Thesis">Docs • Thesis</option>
                  <option value="Slides • Canva">Slides • Canva</option>
                  <option value="Notebook • Lab">Notebook • Lab</option>
                  <option value="Scratchpad • Audio">Scratchpad • Audio</option>
                  <option value="Curriculum • Study">Curriculum • Study</option>
                </select>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-full bg-white text-black font-bold text-xs hover:bg-neutral-200 transition-all"
                >
                  Add Task
                </button>
              </div>
            </form>

            {/* All Current Tasks List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {tasks.map(t => (
                <div
                  key={t.id}
                  className="p-2.5 rounded-xl bg-black border border-neutral-800 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => handleTaskToggle(t.id)}
                      className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                        t.completed ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-neutral-900 border-neutral-700'
                      }`}
                    >
                      {t.completed && <Check className="w-3 h-3 text-white" />}
                    </button>
                    <span className={`text-xs font-sans truncate ${t.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {t.text}
                    </span>
                  </div>
                  <span className="text-[10px] text-neutral-400 font-mono shrink-0">
                    {t.category}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end pt-2 border-t border-neutral-800">
              <button
                onClick={() => setIsConfigureTasksOpen(false)}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-mono text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
