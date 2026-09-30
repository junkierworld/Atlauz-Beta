import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Plus,
  Search,
  Pin,
  Star,
  Palette,
  FileText,
  Presentation,
  Book,
  GraduationCap,
  FileCode,
  Heart,
  Maximize2,
  ChevronDown,
  Check,
  CheckSquare,
  Square,
  Trash2,
  Copy,
  Edit3,
  X,
  ListTodo,
  FileEdit,
  Sun,
  Moon,
  Tag,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { ResourceItem, ResourceType, UserRole, LibraryTaskItem } from '../types';
import { BadgeSelector } from './BadgeSelector';
import { AVAILABLE_BADGES, initialLibraryTasks } from '../data';
import { isLightBackground, getAdaptiveTextColor, getAdaptiveSubtextColor } from '../utils/contrast';

interface LibraryViewProps {
  resources: ResourceItem[];
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onTogglePin: (resourceId: string) => void;
  onToggleFavorite: (resourceId: string) => void;
  onUpdateBadge: (resourceId: string, badge: string) => void;
  onUpdateCoverColor: (resourceId: string, color: string) => void;
  onUpdateResource?: (resourceId: string, updated: Partial<ResourceItem>) => void;
  onShowToast: (msg: string) => void;
  userRole?: UserRole;
}

const PRESET_COLORS = [
  { name: 'Pure White (100%)', color: '#ffffff' },
  { name: 'Bright Silver (85%)', color: '#e5e5e5' },
  { name: 'Steel Gray (70%)', color: '#cccccc' },
  { name: 'Medium Gray (55%)', color: '#a3a3a3' },
  { name: 'Graphite (40%)', color: '#737373' },
  { name: 'Charcoal (30%)', color: '#525252' },
  { name: 'Dark Slate (20%)', color: '#404040' },
  { name: 'Deep Carbon (10%)', color: '#1a1a1a' }
];

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  onOpenResource,
  onCreateResourceClick,
  onTogglePin,
  onToggleFavorite,
  onUpdateBadge,
  onUpdateCoverColor,
  onUpdateResource,
  onShowToast,
  userRole = 'Student'
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'bookshelf' | 'notepad_tasks'>('bookshelf');
  const [activeTypeFilter, setActiveTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(null);
  const [activeBadgePickerId, setActiveBadgePickerId] = useState<string | null>(null);

  // Dedicated in-bounds Volume Content & Color Editor
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editColor, setEditColor] = useState('#ffffff');
  const [editBadge, setEditBadge] = useState('');
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [editIsFavorite, setEditIsFavorite] = useState(false);

  // Notepad / Todo Section States
  const [tasks, setTasks] = useState<LibraryTaskItem[]>(initialLibraryTasks as LibraryTaskItem[]);
  const [taskFilter, setTaskFilter] = useState<'all' | 'pending' | 'completed' | 'role'>('all');
  const [newTaskText, setNewTaskText] = useState('');
  const [newTaskCategory, setNewTaskCategory] = useState('Research');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'normal'>('medium');

  // Interactive Scratchpad Notes State with Adaptable Paper Tone
  const [notepadPaperTone, setNotepadPaperTone] = useState<'light' | 'dark'>('dark');
  const [notepadContent, setNotepadContent] = useState<string>(
    `# Library Working Memory & Reading Scratchpad\n\n• High-priority citation: Verify Hadal salinity attenuation constant (alpha = 0.048 dB/km) in §3.4\n• Note from Dr. Sarah Lin: Review context window pruning algorithms before Wednesday\n• Next reading milestone: Finish Chapter 5 of Acoustic Signal Processing\n\n*Adaptable font color active: text automatically flips between deep carbon and pure white based on paper tone.*`
  );

  const startEditing = (res: ResourceItem) => {
    setEditingResource(res);
    setEditTitle(res.title);
    setEditCategory(res.category);
    setEditDescription(res.description);
    setEditTags(res.tags.join(', '));
    setEditColor(res.coverColor || '#ffffff');
    setEditBadge(res.badge || '★ Favorite');
    setEditIsPinned(res.isPinned);
    setEditIsFavorite(res.isFavorite);
    setActiveColorPickerId(null);
    setActiveBadgePickerId(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingResource) return;
    if (!editTitle.trim()) {
      onShowToast('Please provide a title for the volume');
      return;
    }

    const updatedTags = editTags.split(',').map(t => t.trim()).filter(Boolean);

    if (onUpdateResource) {
      onUpdateResource(editingResource.id, {
        title: editTitle.trim(),
        category: editCategory.trim() || 'General Research',
        description: editDescription.trim(),
        tags: updatedTags,
        coverColor: editColor,
        badge: editBadge,
        isPinned: editIsPinned,
        isFavorite: editIsFavorite
      });
    }

    // Also trigger individual updaters if present
    if (editColor !== editingResource.coverColor) {
      onUpdateCoverColor(editingResource.id, editColor);
    }
    if (editBadge !== editingResource.badge) {
      onUpdateBadge(editingResource.id, editBadge);
    }
    if (editIsPinned !== editingResource.isPinned) {
      onTogglePin(editingResource.id);
    }
    if (editIsFavorite !== editingResource.isFavorite) {
      onToggleFavorite(editingResource.id);
    }

    onShowToast(`Saved changes for "${editTitle.trim()}"`);
    setEditingResource(null);
  };

  const getIconForType = (type: ResourceType) => {
    switch (type) {
      case 'notebook': return BookOpen;
      case 'document': return FileText;
      case 'presentation': return Presentation;
      case 'ebook': return Book;
      case 'lesson': return GraduationCap;
      case 'notepad': return FileCode;
      case 'journal': return Heart;
      case 'pdf': return FileText;
      default: return BookOpen;
    }
  };

  // Todo operations
  const handleToggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: LibraryTaskItem = {
      id: `task-${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      category: newTaskCategory,
      priority: newTaskPriority,
      roleTag: userRole,
      dueDate: 'Today'
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskText('');
    onShowToast('Task registered in Library matrix');
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    onShowToast('Task removed');
  };

  const handleCopyNotes = () => {
    navigator.clipboard?.writeText(notepadContent);
    onShowToast('Scratchpad notes copied to clipboard');
  };

  const filteredTasks = tasks.filter(t => {
    if (taskFilter === 'pending') return !t.completed;
    if (taskFilter === 'completed') return t.completed;
    if (taskFilter === 'role') return t.roleTag === userRole;
    return true;
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const taskProgress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredResources = resources.filter(res => {
    if (activeTypeFilter === 'pinned' && !res.isPinned) return false;
    if (activeTypeFilter === 'favorites' && !res.isFavorite) return false;
    if (activeTypeFilter !== 'all' && activeTypeFilter !== 'pinned' && activeTypeFilter !== 'favorites') {
      if (res.type !== activeTypeFilter) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = res.title.toLowerCase().includes(q);
      const matchCategory = res.category.toLowerCase().includes(q);
      const matchTags = res.tags.some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchCategory && !matchTags) return false;
    }
    return true;
  });

  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto space-y-6 animate-fade-in pb-20 font-sans select-none">
      {/* Top Banner: Customized Library Bookshelf & Mode Selector */}
      <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded bg-neutral-800 text-white border border-neutral-700">
              <BookOpen className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-white tracking-tight font-mono">
                  Library Bookshelf & Task Matrix
                </h1>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                  PROTOTYPE
                </span>
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-400 border border-neutral-700 uppercase">
                  {userRole}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Tactile book volumes, reading scratchpad notes, and role-aligned research checklists with adaptive font contrast.
              </p>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs: Bookshelf vs Notepad/Todo */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1 rounded-md border border-neutral-800 shrink-0">
          <button
            onClick={() => setActiveViewTab('bookshelf')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeViewTab === 'bookshelf'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Bookshelf ({resources.length})</span>
          </button>
          <button
            onClick={() => setActiveViewTab('notepad_tasks')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
              activeViewTab === 'notepad_tasks'
                ? 'bg-white text-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Notepad & Tasks ({tasks.length})</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: BOOKSHELF VOLUMES */}
      {/* ========================================================================= */}
      {activeViewTab === 'bookshelf' && (
        <div className="space-y-6">
          {/* Quick Tasks Strip Banner above Bookshelf */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 sm:px-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-neutral-800 text-white border border-neutral-700 uppercase shrink-0">
                Active Checklist
              </span>
              <span className="text-neutral-300 truncate">
                {completedCount} of {tasks.length} tasks completed ({taskProgress}%)
              </span>
            </div>
            <button
              onClick={() => setActiveViewTab('notepad_tasks')}
              className="text-xs font-mono text-neutral-300 hover:text-white flex items-center gap-1 shrink-0 underline"
            >
              <span>Open Notepad & Tasks</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-3 flex flex-col sm:flex-row items-center gap-2.5">
            <div className="flex-1 w-full flex items-center gap-2 bg-neutral-950 px-3 py-2 rounded border border-neutral-800 text-xs">
              <Search className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                type="text"
                placeholder="Search bookshelf by title, subject, or tags..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none w-full placeholder-neutral-500 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-500 hover:text-white text-xs font-mono"
                >
                  [X]
                </button>
              )}
            </div>

            {/* Category Filter Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto no-scrollbar text-xs font-mono">
              {[
                { id: 'all', label: 'All' },
                { id: 'pinned', label: 'Pinned' },
                { id: 'favorites', label: 'Starred' },
                { id: 'document', label: 'Docs' },
                { id: 'presentation', label: 'Slides' },
                { id: 'notebook', label: 'Notebooks' },
                { id: 'pdf', label: 'PDFs' },
                { id: 'lesson', label: 'Lessons' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTypeFilter(tab.id)}
                  className={`px-2.5 py-1.5 rounded transition-all whitespace-nowrap ${
                    activeTypeFilter === tab.id
                      ? 'bg-white text-black font-bold'
                      : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              onClick={onCreateResourceClick}
              className="w-full sm:w-auto px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-mono font-bold text-xs border border-neutral-600 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Volume</span>
            </button>
          </div>

          {/* BOOKSHELF GRID (Acting like physical books with customizable covers & ADAPTIVE FONT READABILITY) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs px-1 font-mono">
              <span className="font-bold uppercase tracking-wider text-neutral-300">
                Volumes On Shelf ({filteredResources.length})
              </span>
              <span className="text-neutral-500 hidden sm:inline">
                Click book to open • Palette icon to adjust cover shade
              </span>
            </div>

            {filteredResources.length === 0 ? (
              <div className="p-12 rounded-lg bg-neutral-900 border border-neutral-800 text-center flex flex-col items-center justify-center gap-2">
                <BookOpen className="w-8 h-8 text-neutral-500" />
                <span className="font-bold text-sm text-white font-mono">No books found in this shelf section</span>
                <p className="text-xs text-neutral-400 max-w-xs">
                  Create a new notebook, doc, presentation, or lesson to expand your customized library.
                </p>
                <button
                  onClick={onCreateResourceClick}
                  className="mt-2 px-4 py-1.5 rounded bg-white text-black font-mono font-bold text-xs"
                >
                  + Create New Volume
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                <AnimatePresence>
                  {filteredResources.map(book => {
                    const Icon = getIconForType(book.type);
                    const isColorPickerOpen = activeColorPickerId === book.id;
                    const isBadgePickerOpen = activeBadgePickerId === book.id;

                    // ADAPTABLE FONT COLOR COMPUTATION FOR MAXIMUM READABILITY
                    const cover = book.coverColor || '#1a1a1a';
                    const isLight = isLightBackground(cover);
                    const textColor = getAdaptiveTextColor(cover);
                    const subtextColor = getAdaptiveSubtextColor(cover);

                    return (
                      <motion.div
                        key={book.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        whileHover={{ y: -4, transition: { duration: 0.15 } }}
                        className="relative group flex flex-col items-center select-none"
                      >
                        {/* PHYSICAL BOOK COVER CONTAINER WITH ADAPTIVE CONTRAST TEXT */}
                        <div
                          onClick={() => onOpenResource(book)}
                          style={{
                            backgroundColor: cover,
                            color: textColor
                          }}
                          className={`w-full aspect-[1/1.38] rounded-r-lg rounded-l-sm cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-3 sm:p-4 border ${
                            isLight
                              ? 'border-neutral-400 shadow-md ring-1 ring-black/10'
                              : 'border-neutral-700 shadow-xl'
                          }`}
                        >
                          {/* Realistic Book Spine Groove */}
                          <div
                            className={`absolute top-0 bottom-0 left-0 w-3.5 z-10 pointer-events-none ${
                              isLight
                                ? 'bg-black/15 border-r border-black/20'
                                : 'bg-black/50 border-r border-black/40'
                            }`}
                          />
                          <div
                            className={`absolute top-0 bottom-0 left-3.5 w-0.5 pointer-events-none ${
                              isLight ? 'bg-white/40' : 'bg-white/10'
                            }`}
                          />

                          {/* Top Status & Controls */}
                          <div className="flex items-start justify-between relative z-20 pl-2">
                            <div
                              className={`p-1.5 rounded border flex items-center justify-center ${
                                isLight
                                  ? 'bg-black text-white border-black'
                                  : 'bg-neutral-900 text-white border-neutral-700'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </div>

                            <div
                              className="flex items-center gap-1"
                              onClick={e => e.stopPropagation()}
                            >
                              <button
                                onClick={() => onToggleFavorite(book.id)}
                                className={`p-1 rounded border transition-all ${
                                  isLight
                                    ? book.isFavorite
                                      ? 'bg-black text-white border-black'
                                      : 'bg-white/80 text-black border-neutral-400 hover:bg-black hover:text-white'
                                    : book.isFavorite
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black/70 text-neutral-400 border-neutral-700 hover:text-white'
                                }`}
                                title={book.isFavorite ? 'Starred' : 'Star Volume'}
                              >
                                <Star className={`w-3 h-3 ${book.isFavorite ? 'fill-current' : ''}`} />
                              </button>

                              <button
                                onClick={() => onTogglePin(book.id)}
                                className={`p-1 rounded border transition-all ${
                                  isLight
                                    ? book.isPinned
                                      ? 'bg-black text-white border-black'
                                      : 'bg-white/80 text-black border-neutral-400 hover:bg-black hover:text-white'
                                    : book.isPinned
                                    ? 'bg-white text-black border-white'
                                    : 'bg-black/70 text-neutral-400 border-neutral-700 hover:text-white'
                                }`}
                                title={book.isPinned ? 'Pinned to Hub' : 'Pin to Hub'}
                              >
                                <Pin className={`w-3 h-3 ${book.isPinned ? 'fill-current' : ''}`} />
                              </button>
                            </div>
                          </div>

                          {/* Book Front Title & Typography: READABILITY PRIORITIZED */}
                          <div className="relative z-20 pl-2 my-auto">
                            <span
                              style={{ color: subtextColor }}
                              className="text-[10px] uppercase font-mono tracking-wider block mb-1 font-bold"
                            >
                              {book.category}
                            </span>
                            <h3
                              style={{ color: textColor }}
                              className="font-bold text-sm sm:text-base leading-tight line-clamp-3 font-sans"
                            >
                              {book.title}
                            </h3>
                            <p
                              style={{ color: subtextColor }}
                              className="text-[10px] mt-1 line-clamp-2 leading-relaxed"
                            >
                              {book.description}
                            </p>
                          </div>

                          {/* Bottom Spine Ribbon / Badge */}
                          <div
                            className={`relative z-20 pl-2 flex items-center justify-between pt-2 border-t ${
                              isLight ? 'border-neutral-300' : 'border-neutral-800'
                            }`}
                          >
                            <span
                              className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold truncate max-w-[100px] border ${
                                isLight
                                  ? 'bg-black text-white border-black'
                                  : 'bg-neutral-900 text-white border-neutral-700'
                              }`}
                            >
                              {book.badge || '★ Favorite'}
                            </span>

                            <span
                              style={{ color: textColor }}
                              className="text-[10px] font-bold group-hover:scale-105 transition-transform flex items-center gap-0.5 font-mono"
                            >
                              [OPEN] <Maximize2 className="w-2.5 h-2.5" />
                            </span>
                          </div>
                        </div>

                        {/* Quick Customization Controls Under Book */}
                        <div className="w-full mt-2 flex items-center justify-between px-1 text-xs">
                          {/* Palette Button */}
                          <div className="relative">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setActiveColorPickerId(isColorPickerOpen ? null : book.id);
                                setActiveBadgePickerId(null);
                              }}
                              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white py-0.5 px-1.5 rounded hover:bg-neutral-800 transition-colors font-mono"
                              title="Quick Color Palette"
                            >
                              <Palette className="w-3 h-3" />
                              <span className="hidden xs:inline">Cover</span>
                            </button>

                            {/* Color Picker Dropdown */}
                            {isColorPickerOpen && (
                              <>
                                <div
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveColorPickerId(null);
                                  }}
                                  className="fixed inset-0 z-40 bg-black/50"
                                />
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="fixed sm:absolute bottom-4 sm:bottom-full left-4 sm:left-0 right-4 sm:right-auto mx-auto sm:mx-0 max-w-xs sm:max-w-none sm:w-52 z-50 p-3 rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col gap-2 font-sans"
                                >
                                  <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                                    <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                                      [COVER SHADE]
                                    </span>
                                    <button
                                      onClick={() => setActiveColorPickerId(null)}
                                      className="text-neutral-500 hover:text-white text-xs px-1 font-mono"
                                    >
                                      [X]
                                    </button>
                                  </div>

                                  <div className="grid grid-cols-4 gap-1.5">
                                    {PRESET_COLORS.map(c => (
                                      <button
                                        key={c.color}
                                        type="button"
                                        onClick={() => {
                                          onUpdateCoverColor(book.id, c.color);
                                          if (onUpdateResource) onUpdateResource(book.id, { coverColor: c.color });
                                          setActiveColorPickerId(null);
                                          onShowToast(`Cover shade set to ${c.name}`);
                                        }}
                                        style={{ backgroundColor: c.color }}
                                        className="w-8 h-8 rounded border border-neutral-700 hover:scale-105 active:scale-95 transition-transform flex items-center justify-center"
                                        title={c.name}
                                      >
                                        {book.coverColor === c.color && (
                                          <Check className={`w-3.5 h-3.5 ${isLightBackground(c.color) ? 'text-black' : 'text-white'}`} />
                                        )}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Badge Button */}
                          <div className="relative">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                setActiveBadgePickerId(isBadgePickerOpen ? null : book.id);
                                setActiveColorPickerId(null);
                              }}
                              className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white py-0.5 px-1.5 rounded hover:bg-neutral-800 transition-colors font-mono"
                              title="Assign Badge"
                            >
                              <Tag className="w-3 h-3" />
                              <span className="hidden xs:inline">Badge</span>
                            </button>

                            {isBadgePickerOpen && (
                              <>
                                <div
                                  onClick={e => {
                                    e.stopPropagation();
                                    setActiveBadgePickerId(null);
                                  }}
                                  className="fixed inset-0 z-40 bg-black/50"
                                />
                                <div
                                  onClick={e => e.stopPropagation()}
                                  className="fixed sm:absolute bottom-4 sm:bottom-full left-4 sm:left-0 right-4 sm:right-auto mx-auto sm:mx-0 max-w-xs sm:max-w-none sm:w-56 z-50 p-2.5 rounded-lg bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col gap-1.5 font-sans"
                                >
                                  <div className="flex items-center justify-between pb-1 border-b border-neutral-800">
                                    <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-wider">
                                      [SELECT BADGE]
                                    </span>
                                    <button
                                      onClick={() => setActiveBadgePickerId(null)}
                                      className="text-neutral-500 hover:text-white text-xs px-1 font-mono"
                                    >
                                      [X]
                                    </button>
                                  </div>

                                  <div className="max-h-48 overflow-y-auto space-y-1 no-scrollbar">
                                    {AVAILABLE_BADGES.map(b => (
                                      <button
                                        key={b.id}
                                        type="button"
                                        onClick={() => {
                                          onUpdateBadge(book.id, b.label);
                                          if (onUpdateResource) onUpdateResource(book.id, { badge: b.label });
                                          setActiveBadgePickerId(null);
                                          onShowToast(`Badge set to ${b.label}`);
                                        }}
                                        className="w-full text-left px-2 py-1.5 rounded hover:bg-neutral-800 text-xs text-white flex items-center justify-between transition-colors font-mono"
                                      >
                                        <span>{b.label}</span>
                                        {book.badge === b.label && <Check className="w-3 h-3 text-white" />}
                                      </button>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>

                          {/* Quick Edit */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              startEditing(book);
                            }}
                            className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-white py-0.5 px-1.5 rounded hover:bg-neutral-800 transition-colors font-mono"
                            title="Edit details"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span className="hidden xs:inline">Edit</span>
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: NOTEPAD / TODO TASKS NOTES SECTION IN LIBRARY */}
      {/* ========================================================================= */}
      {activeViewTab === 'notepad_tasks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: INTERACTIVE TODO TASKS MATRIX (5 COLS) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <ListTodo className="w-4 h-4 text-white" />
                      Library Reading Tasks & Checkpoints
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Checkpoints linked to your {userRole} role ecosystem.
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-neutral-800 text-white border border-neutral-700">
                    {completedCount}/{tasks.length}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-neutral-950 rounded-full h-2 mb-4 border border-neutral-800 overflow-hidden">
                  <div
                    className="bg-white h-full transition-all duration-300"
                    style={{ width: `${taskProgress}%` }}
                  />
                </div>

                {/* Task Filter Tabs */}
                <div className="flex gap-1 mb-3 text-[11px] font-mono">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'pending', label: 'Active' },
                    { id: 'completed', label: 'Done' },
                    { id: 'role', label: `My Role (${userRole})` }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setTaskFilter(tab.id as any)}
                      className={`px-2 py-1 rounded transition-colors ${
                        taskFilter === tab.id
                          ? 'bg-white text-black font-bold'
                          : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Add Task Form */}
                <form onSubmit={handleAddTask} className="space-y-2 mb-4 p-2.5 rounded bg-neutral-950 border border-neutral-800">
                  <input
                    type="text"
                    value={newTaskText}
                    onChange={e => setNewTaskText(e.target.value)}
                    placeholder="Add task (e.g. Read §3, annotate formula)..."
                    className="w-full bg-neutral-900 border border-neutral-700 rounded px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 font-mono focus:outline-none focus:border-white"
                  />
                  <div className="flex items-center justify-between gap-2">
                    <select
                      value={newTaskPriority}
                      onChange={e => setNewTaskPriority(e.target.value as any)}
                      className="bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-[11px] text-neutral-300 font-mono focus:outline-none"
                    >
                      <option value="high">High Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="normal">Normal</option>
                    </select>

                    <button
                      type="submit"
                      className="px-3 py-1 bg-white text-black hover:bg-neutral-200 rounded font-mono font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add</span>
                    </button>
                  </div>
                </form>

                {/* Task List */}
                <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar">
                  {filteredTasks.length === 0 ? (
                    <div className="text-center py-8 text-neutral-500 text-xs font-mono">
                      No tasks matching this filter.
                    </div>
                  ) : (
                    filteredTasks.map(t => (
                      <div
                        key={t.id}
                        className={`p-2.5 rounded border transition-all flex items-start justify-between gap-2 ${
                          t.completed
                            ? 'bg-neutral-950/60 border-neutral-800/60 opacity-60'
                            : 'bg-neutral-950 border-neutral-800'
                        }`}
                      >
                        <button
                          onClick={() => handleToggleTask(t.id)}
                          className="mt-0.5 text-neutral-400 hover:text-white transition-colors shrink-0"
                        >
                          {t.completed ? (
                            <CheckSquare className="w-4 h-4 text-white" />
                          ) : (
                            <Square className="w-4 h-4 text-neutral-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <span
                            className={`text-xs block leading-snug ${
                              t.completed ? 'line-through text-neutral-500' : 'text-neutral-200'
                            }`}
                          >
                            {t.text}
                          </span>
                          <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px]">
                            {t.roleTag && (
                              <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                                {t.roleTag}
                              </span>
                            )}
                            <span className={`px-1.5 py-0.2 rounded ${
                              t.priority === 'high'
                                ? 'bg-white text-black font-bold'
                                : 'bg-neutral-900 border border-neutral-700 text-neutral-400'
                            }`}>
                              {t.priority}
                            </span>
                            {t.dueDate && <span className="text-neutral-500">{t.dueDate}</span>}
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteTask(t.id)}
                          className="p-1 text-neutral-600 hover:text-red-400 transition-colors"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: QUICK SCRATCHPAD NOTEPAD WITH ADAPTABLE FONT COLOR (7 COLS) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 sm:p-5">
                <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-3 flex-wrap gap-2">
                  <div>
                    <h2 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                      <FileEdit className="w-4 h-4 text-white" />
                      Reading Scratchpad & Synthesis Buffer
                    </h2>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      Prioritizing font readability with adaptive luminance contrast.
                    </p>
                  </div>

                  {/* Adaptable Font Readability Tone Switcher */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-neutral-950 p-0.5 rounded border border-neutral-800 font-mono text-xs">
                      <button
                        onClick={() => setNotepadPaperTone('light')}
                        className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                          notepadPaperTone === 'light'
                            ? 'bg-white text-black font-bold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                        title="Light Paper Tone: Enforces deep black text for high readability"
                      >
                        <Sun className="w-3 h-3" />
                        <span>Light Paper</span>
                      </button>
                      <button
                        onClick={() => setNotepadPaperTone('dark')}
                        className={`px-2 py-1 rounded flex items-center gap-1 transition-all ${
                          notepadPaperTone === 'dark'
                            ? 'bg-neutral-800 text-white font-bold'
                            : 'text-neutral-400 hover:text-white'
                        }`}
                        title="Dark Tone: Enforces pure white text for high readability"
                      >
                        <Moon className="w-3 h-3" />
                        <span>Dark Carbon</span>
                      </button>
                    </div>

                    <button
                      onClick={handleCopyNotes}
                      className="p-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700 transition-colors"
                      title="Copy notes"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Adaptive Notepad Textarea */}
                <div
                  className={`rounded-lg p-4 transition-colors duration-200 border ${
                    notepadPaperTone === 'light'
                      ? 'bg-white border-neutral-300 text-[#0a0a0a] shadow-inner'
                      : 'bg-neutral-950 border-neutral-800 text-[#f5f5f5]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-mono mb-2 pb-1 border-b border-neutral-300/40">
                    <span className={notepadPaperTone === 'light' ? 'text-neutral-600' : 'text-neutral-400'}>
                      ADAPTABLE INK: {notepadPaperTone === 'light' ? 'DEEP CARBON (#0A0A0A)' : 'CRISP WHITE (#FFFFFF)'}
                    </span>
                    <span className={notepadPaperTone === 'light' ? 'text-neutral-600' : 'text-neutral-400'}>
                      {notepadContent.split(/\s+/).filter(Boolean).length} words • {notepadContent.length} chars
                    </span>
                  </div>

                  <textarea
                    value={notepadContent}
                    onChange={e => setNotepadContent(e.target.value)}
                    rows={14}
                    style={{
                      color: notepadPaperTone === 'light' ? '#0a0a0a' : '#ffffff'
                    }}
                    className={`w-full bg-transparent resize-y outline-none font-mono text-xs leading-relaxed ${
                      notepadPaperTone === 'light'
                        ? 'placeholder-neutral-500'
                        : 'placeholder-neutral-600'
                    }`}
                    placeholder="Type synthesis thoughts, reading insights, or quick citations..."
                  />
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 font-mono">
                  <span>Auto-saved to working session</span>
                  <button
                    onClick={() => {
                      setNotepadContent('');
                      onShowToast('Scratchpad cleared');
                    }}
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    Clear Scratchpad
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT RESOURCE MODAL */}
      {/* ========================================================================= */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
          <div className="w-full max-w-lg bg-neutral-900 border border-neutral-700 rounded-lg p-5 text-white shadow-2xl font-sans">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
              <h2 className="text-base font-bold text-white font-mono">Edit Shelf Volume</h2>
              <button
                onClick={() => setEditingResource(null)}
                className="text-neutral-400 hover:text-white font-mono text-xs"
              >
                [X]
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 mt-4 text-xs">
              <div>
                <label className="block text-neutral-400 mb-1 font-mono">Volume Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-mono">Category / Course Code</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-mono">Description</label>
                <textarea
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-mono">Tags (comma separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded px-3 py-2 text-white font-mono outline-none focus:border-white"
                />
              </div>

              {/* Cover Shade Selector */}
              <div>
                <label className="block text-neutral-400 mb-1 font-mono">Cover Shade</label>
                <div className="grid grid-cols-8 gap-2">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setEditColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className="w-8 h-8 rounded border border-neutral-700 hover:scale-105 flex items-center justify-center"
                    >
                      {editColor === c.color && (
                        <Check className={`w-3.5 h-3.5 ${isLightBackground(c.color) ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={editIsPinned}
                    onChange={e => setEditIsPinned(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-700"
                  />
                  <span>Pin to Hub</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-mono">
                  <input
                    type="checkbox"
                    checked={editIsFavorite}
                    onChange={e => setEditIsFavorite(e.target.checked)}
                    className="rounded bg-neutral-950 border-neutral-700"
                  />
                  <span>Star Volume</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-mono"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded bg-white text-black hover:bg-neutral-200 font-mono font-bold"
                >
                  Save Volume
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
