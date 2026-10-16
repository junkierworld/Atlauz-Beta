import React, { useState, useMemo, useCallback } from 'react';
import {
  LayoutGrid,
  Square,
  Layers,
  Users,
  ArrowRight,
  Plus,
  Brain,
  Flame,
  BookOpen,
  FileText,
  X,
  Check,
  Trash2
} from 'lucide-react';
import { CognitiveTelemetry, ConnectedApp, ResourceItem, CompanionState, UserRole, UserAccountSettings, HubTaskItem } from '../types';

interface HubViewProps {
  telemetry: CognitiveTelemetry;
  connectedApps: ConnectedApp[];
  resources: ResourceItem[];
  companion?: CompanionState;
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onOpenLibrary: () => void;
  onOpenWorkspace: (mode?: 'dominant' | 'pile' | 'bento' | 'collab') => void;
  onOpenFishing?: () => void;
  onOpenProfile?: () => void;
  onShowToast: (msg: string) => void;
  userRole?: UserRole;
  settings?: UserAccountSettings;
  onOpenFlashcards?: () => void;
}

export const HubView = React.memo(function HubViewComponent({
  telemetry,
  resources,
  companion,
  onOpenWorkspace,
  onOpenFishing,
  onCreateResourceClick,
  onOpenLibrary,
  onShowToast,
  settings,
  onOpenFlashcards
}: HubViewProps) {
  // Get computed theme colors from CSS variables
  const getThemeColors = () => {
    const root = document.documentElement;
    const getColor = (varName: string) => getComputedStyle(root).getPropertyValue(varName).trim();
    
    return {
      primary: getColor('--theme-primary') || '#e63946',
      secondary: getColor('--theme-secondary') || '#f4a261',
      bgPrimary: getColor('--theme-bg-primary') || '#0a0a0a',
      bgSecondary: getColor('--theme-bg-secondary') || '#1a1a1a',
      cardBg: getColor('--theme-card-bg') || '#121212',
      cardBorder: getColor('--theme-card-border') || '#262626',
      textPrimary: getColor('--theme-text-primary') || '#ffffff',
      textSecondary: getColor('--theme-text-secondary') || '#d4d4d4',
      textMuted: getColor('--theme-text-muted') || '#888888',
      accentGlow: getColor('--theme-accent-glow') || 'rgba(230, 57, 70, 0.3)'
    };
  };
  
  const themeColors = useMemo(() => getThemeColors(), [settings?.theme]);
  
  // STATE: Pinned content
  const [pinnedPool, setPinnedPool] = useState<string[]>([]);
  const [activePinnedId, setActivePinnedId] = useState<string | null>(null);
  
  // STATE: Tasks (persisted to localStorage)
  const [tasks, setTasks] = useState<HubTaskItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('hubTasks') || '[]');
    } catch {
      return [];
    }
  });
  
  // STATE: Activities
  const [activities, setActivities] = useState<any[]>([]);
  
  // STATE: Modals
  const [isCustomizePinnedOpen, setIsCustomizePinnedOpen] = useState(false);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  
  // TASK OPERATIONS
  const saveTasks = useCallback((newTasks: HubTaskItem[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem('hubTasks', JSON.stringify(newTasks));
    } catch (e) {
      onShowToast('Failed to save tasks');
    }
  }, [onShowToast]);
  
  const addTask = useCallback((title: string) => {
    if (!title.trim()) return;
    const newTask: HubTaskItem = {
      id: `task-${Date.now()}`,
      title: title.trim(),
      completed: false,
      dueDate: ''
    };
    saveTasks([...tasks, newTask]);
    setTaskInput('');
    onShowToast('Task added');
  }, [tasks, saveTasks, onShowToast]);
  
  const toggleTask = useCallback((id: string) => {
    const updated = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks(updated);
  }, [tasks, saveTasks]);
  
  const deleteTask = useCallback((id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
    onShowToast('Task deleted');
  }, [tasks, saveTasks, onShowToast]);
  
  const updateTask = useCallback((id: string, title: string) => {
    if (!title.trim()) return;
    const updated = tasks.map(t => t.id === id ? { ...t, title: title.trim() } : t);
    saveTasks(updated);
    setEditingTaskId(null);
  }, [tasks, saveTasks]);
  
  // PINNED CONTENT OPERATIONS
  const resolveItemData = (id: string) => {
    if (id === 'res-streak-widget') {
      return {
        id: 'res-streak-widget',
        title: 'Streaks Iceberg',
        subtitle: `${telemetry.streakDays}-Day Flow`,
        tags: ['STREAK', 'FLOW'],
        icon: Flame,
        action: () => onOpenFishing?.()
      };
    }
    if (id === 'res-flashcard-widget') {
      return {
        id: 'res-flashcard-widget',
        title: 'Flashcard Decks',
        subtitle: 'Study & Review',
        tags: ['MEMORY', 'RECALL'],
        icon: Brain,
        action: () => onOpenFlashcards?.()
      };
    }
    const found = resources.find(r => r.id === id);
    if (found) {
      const typeTag = found.type.toUpperCase();
      const catTag = found.category.split('•')[0].trim().toUpperCase().slice(0, 8);
      return {
        id: found.id,
        title: found.title,
        subtitle: found.category,
        tags: [typeTag, catTag],
        icon: FileText,
        action: () => onOpenLibrary()
      };
    }
    return {
      id,
      title: 'Study Note',
      subtitle: 'Create a new resource',
      tags: ['NOTE', 'NEW'],
      icon: BookOpen,
      action: onCreateResourceClick
    };
  };

  const allResolvedPinned = useMemo(() => {
    return pinnedPool.length > 0 ? pinnedPool.map(id => resolveItemData(id)) : [];
  }, [pinnedPool, resources, telemetry.streakDays]);

  const activePinnedItem = useMemo(() => {
    if (!activePinnedId && allResolvedPinned.length > 0) return allResolvedPinned[0];
    return allResolvedPinned.find(p => p.id === activePinnedId) || null;
  }, [allResolvedPinned, activePinnedId]);

  const subPinnedItems = useMemo(() => {
    return activePinnedItem
      ? allResolvedPinned.filter(p => p.id !== activePinnedItem.id).slice(0, 4)
      : [];
  }, [allResolvedPinned, activePinnedItem]);

  const handlePromotePinned = (id: string) => {
    setActivePinnedId(id);
  };
  
  const handleAddPin = useCallback((resourceId: string) => {
    if (!pinnedPool.includes(resourceId)) {
      setPinnedPool([...pinnedPool, resourceId]);
      setActivePinnedId(resourceId);
      onShowToast('Resource pinned');
      setIsCustomizePinnedOpen(false);
    }
  }, [pinnedPool, onShowToast]);
  
  const handleRemovePin = useCallback((resourceId: string) => {
    setPinnedPool(pinnedPool.filter(id => id !== resourceId));
    if (activePinnedId === resourceId) {
      setActivePinnedId(null);
    }
    onShowToast('Resource unpinned');
  }, [pinnedPool, activePinnedId, onShowToast]);

  const ActivePinnedIcon = activePinnedItem?.icon || BookOpen;

  return (
    <>
      <div className="flex flex-col w-full max-w-5xl mx-auto min-h-screen select-none font-mono animate-fade-in justify-between p-1.5 sm:p-3 gap-2 overflow-hidden md:overflow-visible"
        style={{
          backgroundColor: themeColors.bgPrimary,
          color: themeColors.textPrimary
        }}
      >
        {/* 4-QUADRANT GRID */}
        <div className="grid grid-cols-2 grid-rows-2 gap-2 sm:gap-3 flex-1 min-h-0 w-full h-auto md:h-full">
          
          {/* QUADRANT 1: PINNED CONTENT (Top Left) */}
          <div className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.cardBorder,
              boxShadow: `0 4px 12px ${themeColors.accentGlow}`
            }}
          >
            <div className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.cardBorder
              }}
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block font-mono"
                style={{ color: themeColors.textSecondary }}
              >
                PINNED CONTENT
              </span>
            </div>

            {activePinnedItem ? (
              <>
                <div 
                  className="border rounded-xl p-2 sm:p-2.5 flex flex-col justify-between my-1 sm:my-1.5 flex-1 min-h-0 shadow-sm cursor-pointer text-left"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    borderColor: themeColors.primary,
                    borderWidth: '2px'
                  }}
                  onClick={activePinnedItem.action}
                >
                  <div className="flex items-start justify-between gap-1 w-full min-h-0">
                    <div className="min-w-0 flex-1">
                      <span className="text-[11px] sm:text-xs font-bold block truncate font-sans"
                        style={{ color: themeColors.textPrimary }}
                      >
                        {activePinnedItem.title}
                      </span>
                      <span className="text-[9px] block truncate mt-0.5"
                        style={{ color: themeColors.textMuted }}
                      >
                        {activePinnedItem.subtitle}
                      </span>
                    </div>
                    <div className="p-1 rounded-md border shrink-0"
                      style={{
                        backgroundColor: `${themeColors.primary}20`,
                        borderColor: themeColors.primary,
                        color: themeColors.primary
                      }}
                    >
                      <ActivePinnedIcon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-1.5 pt-1.5 border-t mt-1 shrink-0"
                    style={{ borderColor: themeColors.textMuted + '30' }}
                  >
                    <div className="flex items-center gap-1 flex-wrap overflow-hidden">
                      {activePinnedItem.tags.map((tag, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded-full border text-[8px] sm:text-[9px] font-bold uppercase tracking-tight"
                          style={{
                            backgroundColor: `${themeColors.primary}15`,
                            borderColor: themeColors.primary,
                            color: themeColors.secondary
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        activePinnedItem.action();
                      }}
                      className="px-2.5 py-1 rounded-full border font-mono font-bold text-[9px] sm:text-[10px] flex items-center gap-1 transition-all shrink-0 shadow-xs"
                      style={{
                        backgroundColor: themeColors.primary,
                        color: '#ffffff',
                        borderColor: themeColors.secondary
                      }}
                    >
                      <span>OPEN</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 sm:gap-1.5 shrink-0">
                  {subPinnedItems.map((slot) => {
                    const Icon = slot.icon;
                    return (
                      <button key={slot.id}
                        onClick={() => handlePromotePinned(slot.id)}
                        className="p-1.5 rounded-xl border transition-all flex items-center justify-center gap-1.5 min-h-[34px] sm:min-h-[40px]"
                        style={{
                          backgroundColor: themeColors.bgSecondary,
                          borderColor: themeColors.cardBorder,
                          color: themeColors.textSecondary
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.primary + '15';
                          e.currentTarget.style.borderColor = themeColors.primary;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = themeColors.bgSecondary;
                          e.currentTarget.style.borderColor = themeColors.cardBorder;
                        }}
                      >
                        <Icon className="w-3.5 h-3.5 shrink-0" style={{ color: themeColors.primary }} />
                        <span className="text-[9px] sm:text-[10px] font-bold truncate font-sans"
                          style={{ color: themeColors.textSecondary }}
                        >
                          {slot.title.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              <button
                type="button"
                className="flex-1 flex flex-col items-center justify-center text-center p-2 my-1 sm:my-1.5 cursor-pointer bg-transparent border-none"
                style={{ color: themeColors.textMuted }}
                onClick={() => setIsCustomizePinnedOpen(true)}
              >
                <Plus className="w-6 h-6 mb-2" style={{ color: themeColors.primary }} />
                <p className="text-xs mb-2">Add pinned content</p>
                <button 
                  type="button"
                  className="px-2.5 py-1 rounded text-[10px] font-mono font-bold"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: '#ffffff'
                  }}
                  onClick={() => setIsCustomizePinnedOpen(true)}
                >
                  Add
                </button>
              </button>
            )}

            <button onClick={() => setIsCustomizePinnedOpen(true)}
              className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.cardBorder,
                color: themeColors.textMuted
              }}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
                CONFIGURE
              </span>
            </button>
          </div>

          {/* QUADRANT 2: FOCUS SHORTCUTS (Top Right) - THEME COMPLIANT */}
          <div className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.secondary,
              boxShadow: `0 4px 12px ${themeColors.accentGlow}`
            }}
          >
            <div className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.secondary
              }}
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block font-mono"
                style={{ color: themeColors.secondary }}
              >
                FOCUS SHORTCUTS
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1 sm:gap-1.5 my-1 sm:my-1.5 flex-1 min-h-0">
              {[
                { icon: Square, label: 'FOCUS', action: () => onOpenWorkspace('dominant') },
                { icon: LayoutGrid, label: 'BENTO', action: () => onOpenWorkspace('bento') },
                { icon: Layers, label: 'PILE', action: () => onOpenWorkspace('pile') },
                { icon: Users, label: 'COLLAB', action: () => onOpenWorkspace('collab') }
              ].map(({ icon: Icon, label, action }) => (
                <button 
                  key={label}
                  type="button"
                  onClick={action}
                  className="p-1.5 sm:p-2 rounded-xl border transition-all flex flex-col justify-between items-center text-center min-h-0 shadow-xs"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    borderColor: themeColors.secondary
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.secondary + '20';
                    e.currentTarget.style.borderColor = themeColors.primary;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = themeColors.bgSecondary;
                    e.currentTarget.style.borderColor = themeColors.secondary;
                  }}
                >
                  <div className="p-1 rounded-md border shrink-0"
                    style={{
                      backgroundColor: `${themeColors.secondary}20`,
                      borderColor: themeColors.secondary,
                      color: themeColors.secondary
                    }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-bold uppercase block tracking-tight font-mono"
                    style={{ color: themeColors.textPrimary }}
                  >
                    {label}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full border font-mono font-bold text-[8px] sm:text-[9px] block shadow-xs"
                    style={{
                      backgroundColor: themeColors.primary,
                      borderColor: themeColors.secondary,
                      color: '#ffffff'
                    }}
                  >
                    OPEN
                  </span>
                </button>
              ))}
            </div>

            <button className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.secondary,
                color: themeColors.textMuted
              }}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
                CONFIGURE
              </span>
            </button>
          </div>

          {/* QUADRANT 3: DUE ACTIVITIES (Bottom Left) */}
          <div className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.cardBorder,
              boxShadow: `0 4px 12px ${themeColors.accentGlow}`
            }}
          >
            <div className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.cardBorder
              }}
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block font-mono"
                style={{ color: themeColors.textSecondary }}
              >
                DUE ACTIVITIES
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center p-2 my-1 sm:my-1.5"
              style={{ color: themeColors.textMuted }}
            >
              <p className="text-xs">No upcoming activities</p>
            </div>

            <button className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.cardBorder,
                color: themeColors.textMuted
              }}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
                CONFIGURE
              </span>
            </button>
          </div>

          {/* QUADRANT 4: TO-DO TASKS (Bottom Right) - FULLY INTERACTIVE */}
          <div className="border rounded-2xl p-2 sm:p-3 flex flex-col justify-between shadow-lg min-h-0 overflow-hidden"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.primary,
              boxShadow: `0 4px 12px ${themeColors.accentGlow}`
            }}
          >
            <div className="w-full py-1 px-2.5 rounded-full border text-center shrink-0 shadow-xs"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.primary
              }}
            >
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider block font-mono"
                style={{ color: themeColors.secondary }}
              >
                TO-DO TASKS
              </span>
            </div>

            <div className="flex-1 flex flex-col my-1 sm:my-1.5 min-h-0 overflow-y-auto">
              {tasks.length === 0 ? (
                <button
                  type="button"
                  className="flex flex-col items-center justify-center text-center p-2 flex-1 bg-transparent border-none cursor-pointer"
                  style={{ color: themeColors.textMuted }}
                  onClick={() => setIsTaskFormOpen(true)}
                >
                  <p className="text-xs mb-2">No tasks yet</p>
                  <button 
                    type="button"
                    onClick={() => setIsTaskFormOpen(true)}
                    className="px-2.5 py-1 rounded text-[10px] font-mono font-bold"
                    style={{
                      backgroundColor: themeColors.secondary,
                      color: '#ffffff'
                    }}
                  >
                    <Plus className="w-3 h-3 inline mr-1" />
                    Add Task
                  </button>
                </button>
              ) : (
                <div className="space-y-1 overflow-y-auto pr-1">
                  {tasks.map((task) => (
                    <div key={task.id}
                      className="p-1.5 rounded border flex items-center gap-1.5 text-xs group hover:border-opacity-100 transition-all"
                      style={{
                        backgroundColor: task.completed ? themeColors.bgSecondary + '50' : themeColors.bgSecondary,
                        borderColor: themeColors.primary,
                        opacity: task.completed ? 0.6 : 1
                      }}
                    >
                      <button onClick={() => toggleTask(task.id)} className="shrink-0"
                        style={{ color: task.completed ? themeColors.primary : themeColors.textMuted }}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      {editingTaskId === task.id ? (
                        <input
                          autoFocus
                          type="text"
                          defaultValue={task.title}
                          className="flex-1 bg-transparent text-[10px] border-none outline-none"
                          style={{ color: themeColors.textPrimary }}
                          onBlur={(e) => updateTask(task.id, e.currentTarget.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') updateTask(task.id, e.currentTarget.value);
                            if (e.key === 'Escape') setEditingTaskId(null);
                          }}
                        />
                      ) : (
                        <span className="flex-1 text-[9px] sm:text-[10px] truncate cursor-pointer"
                          style={{
                            color: task.completed ? themeColors.textMuted : themeColors.textPrimary,
                            textDecoration: task.completed ? 'line-through' : 'none'
                          }}
                          onClick={() => setEditingTaskId(task.id)}
                        >
                          {task.title}
                        </span>
                      )}
                      <button onClick={() => deleteTask(task.id)}
                        className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                        style={{ color: themeColors.primary }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {tasks.length > 0 && (
              <div className="mt-1 flex gap-1">
                <input
                  type="text"
                  placeholder="New..."
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.currentTarget.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addTask(taskInput);
                  }}
                  className="flex-1 px-2 py-1 rounded text-[9px] border"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    borderColor: themeColors.primary,
                    color: themeColors.textPrimary
                  }}
                />
                <button onClick={() => addTask(taskInput)}
                  className="px-2 py-1 rounded text-[9px] font-bold"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: '#ffffff'
                  }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            )}

            <button onClick={() => tasks.length === 0 && setIsTaskFormOpen(true)}
              className="w-full mt-1 sm:mt-1.5 py-0.5 sm:py-1 rounded-full border text-center transition-colors shrink-0"
              style={{
                backgroundColor: themeColors.bgSecondary,
                borderColor: themeColors.primary,
                color: themeColors.textMuted
              }}
            >
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider block font-mono">
                {tasks.length > 0 ? 'CONFIGURE' : 'ADD TASK'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMIZE PINNED CONTENT MODAL */}
      {isCustomizePinnedOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsCustomizePinnedOpen(false)}
        >
          <div className="bg-card rounded-lg border p-4 max-w-sm w-full max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.cardBorder
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-sm" style={{ color: themeColors.textPrimary }}>Pin a Resource</h3>
              <button onClick={() => setIsCustomizePinnedOpen(false)}>
                <X className="w-4 h-4" style={{ color: themeColors.textMuted }} />
              </button>
            </div>

            <div className="space-y-2">
              {['res-streak-widget', 'res-flashcard-widget'].map((id) => {
                const item = resolveItemData(id);
                const isPinned = pinnedPool.includes(id);
                return (
                  <button key={id}
                    onClick={() => isPinned ? handleRemovePin(id) : handleAddPin(id)}
                    className="w-full p-2 rounded border text-left text-xs transition-all"
                    style={{
                      backgroundColor: isPinned ? `${themeColors.primary}20` : themeColors.bgSecondary,
                      borderColor: isPinned ? themeColors.primary : themeColors.cardBorder,
                      color: themeColors.textPrimary
                    }}
                  >
                    <div className="font-bold">{item.title}</div>
                    <div style={{ color: themeColors.textMuted, fontSize: '0.75rem' }}>{item.subtitle}</div>
                  </button>
                );
              })}

              {resources.slice(0, 5).map((resource) => {
                const isPinned = pinnedPool.includes(resource.id);
                return (
                  <button key={resource.id}
                    onClick={() => isPinned ? handleRemovePin(resource.id) : handleAddPin(resource.id)}
                    className="w-full p-2 rounded border text-left text-xs transition-all"
                    style={{
                      backgroundColor: isPinned ? `${themeColors.primary}20` : themeColors.bgSecondary,
                      borderColor: isPinned ? themeColors.primary : themeColors.cardBorder,
                      color: themeColors.textPrimary
                    }}
                  >
                    <div className="font-bold truncate">{resource.title}</div>
                    <div style={{ color: themeColors.textMuted, fontSize: '0.75rem' }}>{resource.category}</div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TASK INPUT MODAL */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsTaskFormOpen(false)}
        >
          <div className="bg-card rounded-lg border p-4 max-w-sm w-full"
            style={{
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.cardBorder
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-sm mb-4" style={{ color: themeColors.textPrimary }}>Add a Task</h3>
            <div className="space-y-2">
              <input
                autoFocus
                type="text"
                placeholder="Task description..."
                value={taskInput}
                onChange={(e) => setTaskInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addTask(taskInput);
                    setIsTaskFormOpen(false);
                  }
                }}
                className="w-full px-3 py-2 rounded border text-sm"
                style={{
                  backgroundColor: themeColors.bgSecondary,
                  borderColor: themeColors.primary,
                  color: themeColors.textPrimary
                }}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    addTask(taskInput);
                    setIsTaskFormOpen(false);
                  }}
                  className="flex-1 px-3 py-2 rounded font-bold text-xs"
                  style={{
                    backgroundColor: themeColors.primary,
                    color: '#ffffff'
                  }}
                >
                  Add
                </button>
                <button
                  onClick={() => setIsTaskFormOpen(false)}
                  className="flex-1 px-3 py-2 rounded border text-xs"
                  style={{
                    backgroundColor: themeColors.bgSecondary,
                    borderColor: themeColors.cardBorder,
                    color: themeColors.textPrimary
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

export default HubView;
