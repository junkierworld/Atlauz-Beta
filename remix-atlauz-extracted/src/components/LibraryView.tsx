import React, { useState, useMemo } from 'react';
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
  ChevronUp,
  ChevronRight,
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
  ArrowRight,
  Film,
  Folder,
  SlidersHorizontal,
  Layers,
  ArrowLeft
} from 'lucide-react';
import { ResourceItem, ResourceType, UserRole, LibraryTaskItem, LibraryShelvingMode, RoleShelfType } from '../types';
import { BadgeSelector } from './BadgeSelector';
import { SkeletonLoader } from './SkeletonLoader';
import { AVAILABLE_BADGES, initialLibraryTasks } from '../data';
import { isLightBackground, getAdaptiveTextColor, getAdaptiveSubtextColor } from '../utils/contrast';
import { FULLER_SHELF_COLORS, FULLER_RESOURCE_CATEGORY_COLORS } from '../themes';

interface LibraryViewProps {
  resources: ResourceItem[];
  onOpenResource: (resource: ResourceItem) => void;
  onCreateResourceClick: () => void;
  onTogglePin: (resourceId: string) => void;
  onToggleFavorite: (resourceId: string) => void;
  onUpdateBadge: (resourceId: string, badge: string) => void;
  onUpdateCoverColor: (resourceId: string, color: string) => void;
  onUpdateResource?: (resourceId: string, updated: Partial<ResourceItem>) => void;
  onDeleteResource?: (resourceId: string) => void;
  onShowToast: (msg: string | { message: string; type?: 'info' | 'success' | 'warning' | 'error'; onUndo?: () => void; undoLabel?: string }) => void;
  userRole?: UserRole;
  libraryShelvingMode?: LibraryShelvingMode;
  onUpdateShelvingMode?: (mode: LibraryShelvingMode) => void;
  onOpenCurricularPortal?: () => void;
  enrolledPathsCount?: number;
  earnedCertificatesCount?: number;
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

export type ShelfSortOption = 'default' | 'tags' | 'a-z' | 'pinned' | 'starred';

interface ShelfDefinition {
  id: string;
  name: string;
  categoryKey: string;
  icon: any;
  iconName: string;
  description: string;
  items: ResourceItem[];
  tags: string[];
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  resources,
  onOpenResource,
  onCreateResourceClick,
  onTogglePin,
  onToggleFavorite,
  onUpdateBadge,
  onUpdateCoverColor,
  onUpdateResource,
  onDeleteResource,
  onShowToast,
  userRole = 'Student',
  libraryShelvingMode = 'hybrid',
  onUpdateShelvingMode,
  onOpenCurricularPortal,
  enrolledPathsCount = 0,
  earnedCertificatesCount = 0
}) => {
  const [activeViewTab, setActiveViewTab] = useState<'shelves' | 'notepad_tasks'>('shelves');
  const [shelvingMode, setShelvingMode] = useState<LibraryShelvingMode>(libraryShelvingMode);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [inShelfSearchQuery, setInShelfSearchQuery] = useState<string>('');
  const [activeColorPickerId, setActiveColorPickerId] = useState<string | null>(null);
  const [deletingResource, setDeletingResource] = useState<ResourceItem | null>(null);

  // Active Focused Shelf: null means main hub, string shelfId means full-screen dark focus mode
  const [activeFocusShelfId, setActiveFocusShelfId] = useState<string | null>(null);
  const [shelfSort, setShelfSort] = useState<ShelfSortOption>('default');

  // Dedicated in-bounds Volume Content & Color Editor
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTags, setEditTags] = useState('');
  const [editColor, setEditColor] = useState('#ffffff');
  const [editBadge, setEditBadge] = useState('');
  const [editRoleShelf, setEditRoleShelf] = useState<RoleShelfType>('personal');
  const [editIsPinned, setEditIsPinned] = useState(false);
  const [editIsFavorite, setEditIsFavorite] = useState(false);

  // Notepad / Todo Section States
  const [tasks, setTasks] = useState<LibraryTaskItem[]>(initialLibraryTasks as LibraryTaskItem[]);
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
    setEditRoleShelf(res.roleShelf || (res.type === 'document' || res.type === 'pdf' ? 'researcher' : res.type === 'presentation' ? 'educator' : res.type === 'lesson' || res.type === 'ebook' ? 'academic' : 'personal'));
    setEditIsPinned(res.isPinned);
    setEditIsFavorite(res.isFavorite);
    setActiveColorPickerId(null);
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
        roleShelf: editRoleShelf,
        isPinned: editIsPinned,
        isFavorite: editIsFavorite
      });
    }

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

    onShowToast(`Updated volume "${editTitle.trim()}"`);
    setEditingResource(null);
  };

  const handleShelvingModeChange = (mode: LibraryShelvingMode) => {
    setShelvingMode(mode);
    if (onUpdateShelvingMode) {
      onUpdateShelvingMode(mode);
    }
    onShowToast(`Shelving system set to ${mode === 'role_owned' ? 'Role-Owned Shelves' : mode === 'categories' ? 'Subject Categories' : 'Hybrid Mode'}`);
  };

  // Group resources into shelves based on active shelvingMode (Categories vs Role-Owned vs Hybrid)
  const shelvesData: ShelfDefinition[] = useMemo(() => {
    const shelfMap: Record<string, ShelfDefinition> = {};

    if (shelvingMode === 'role_owned') {
      // 4 Role-Owned Shelves
      const roleShelves: Array<{ key: string; name: string; desc: string; icon: any; iconName: string; matcher: (r: ResourceItem) => boolean }> = [
        {
          key: 'personal',
          name: '📁 Personal Shelf',
          desc: 'Personal journals, reflective study logs, and instant scratchpads',
          icon: Heart,
          iconName: 'Heart',
          matcher: r => (r.roleShelf === 'personal' || (!r.roleShelf && (r.type === 'journal' || r.type === 'notepad')))
        },
        {
          key: 'academic',
          name: '🎓 Academic & Student Shelf',
          desc: 'Enrolled coursework, lesson syllabi, and reference textbooks',
          icon: GraduationCap,
          iconName: 'GraduationCap',
          matcher: r => (r.roleShelf === 'academic' || (!r.roleShelf && (r.type === 'lesson' || r.type === 'ebook' || r.type === 'notebook')))
        },
        {
          key: 'researcher',
          name: '🔬 Researcher Shelf',
          desc: 'Thesis manuscripts, whitepapers, annotated PDFs, and lab notes',
          icon: Folder,
          iconName: 'Folder',
          matcher: r => (r.roleShelf === 'researcher' || (!r.roleShelf && (r.type === 'document' || r.type === 'pdf')))
        },
        {
          key: 'educator',
          name: '🏛️ Educator Shelf',
          desc: 'Keynote presentation decks, cohort slide templates, and rubrics',
          icon: Film,
          iconName: 'Film',
          matcher: r => (r.roleShelf === 'educator' || (!r.roleShelf && r.type === 'presentation'))
        }
      ];

      roleShelves.forEach(rs => {
        shelfMap[rs.name] = {
          id: `shelf-${rs.key}`,
          name: rs.name,
          categoryKey: rs.name,
          icon: rs.icon,
          iconName: rs.iconName,
          description: rs.desc,
          items: [],
          tags: []
        };
      });

      resources.forEach(res => {
        const matched = roleShelves.find(rs => rs.matcher(res)) || roleShelves[0];
        shelfMap[matched.name].items.push(res);
        res.tags.forEach(t => {
          if (!shelfMap[matched.name].tags.includes(t)) {
            shelfMap[matched.name].tags.push(t);
          }
        });
      });

      return Object.values(shelfMap);
    }

    if (shelvingMode === 'hybrid') {
      // Hybrid: Role-Owned Shelves as primary groupings with category breakdowns
      const hybridShelves: Array<{ key: string; name: string; desc: string; icon: any; iconName: string; matcher: (r: ResourceItem) => boolean }> = [
        {
          key: 'personal-hybrid',
          name: '📁 Personal Shelf (Journals & Scratchpads)',
          desc: 'Private journals, reflection notes, and unstructured drafts',
          icon: Heart,
          iconName: 'Heart',
          matcher: r => (r.roleShelf === 'personal' || (!r.roleShelf && (r.type === 'journal' || r.type === 'notepad')))
        },
        {
          key: 'academic-hybrid',
          name: '🎓 Academic Shelf (Courses & Lessons)',
          desc: 'Course curriculum modules, textbooks, and field notebooks',
          icon: GraduationCap,
          iconName: 'GraduationCap',
          matcher: r => (r.roleShelf === 'academic' || (!r.roleShelf && (r.type === 'lesson' || r.type === 'ebook' || r.type === 'notebook')))
        },
        {
          key: 'researcher-hybrid',
          name: '🔬 Researcher Shelf (Papers & Whitepapers)',
          desc: 'Empirical research drafts, annotated PDFs, and citation matrices',
          icon: Folder,
          iconName: 'Folder',
          matcher: r => (r.roleShelf === 'researcher' || (!r.roleShelf && (r.type === 'document' || r.type === 'pdf')))
        },
        {
          key: 'educator-hybrid',
          name: '🏛️ Educator Shelf (Slides & Decks)',
          desc: 'Curriculum decks, 16:9 presentation slides, and cohort rubrics',
          icon: Film,
          iconName: 'Film',
          matcher: r => (r.roleShelf === 'educator' || (!r.roleShelf && r.type === 'presentation'))
        }
      ];

      hybridShelves.forEach(hs => {
        shelfMap[hs.name] = {
          id: `shelf-${hs.key}`,
          name: hs.name,
          categoryKey: hs.name,
          icon: hs.icon,
          iconName: hs.iconName,
          description: hs.desc,
          items: [],
          tags: []
        };
      });

      resources.forEach(res => {
        const matched = hybridShelves.find(hs => hs.matcher(res)) || hybridShelves[0];
        shelfMap[matched.name].items.push(res);
        res.tags.forEach(t => {
          if (!shelfMap[matched.name].tags.includes(t)) {
            shelfMap[matched.name].tags.push(t);
          }
        });
      });

      return Object.values(shelfMap);
    }

    // Default 'categories' mode (by MIME & Subject categories)
    resources.forEach(res => {
      let shelfKey = 'General Research';
      let icon = Folder;
      let iconName = 'Folder';
      let desc = 'General study assets and notes';

      if (res.type === 'presentation') {
        shelfKey = 'Interactive Slides & Decks';
        icon = Film;
        iconName = 'Film';
        desc = 'Keynote slides, visual presentations, and pitch decks';
      } else if (res.type === 'document' || res.type === 'pdf') {
        shelfKey = 'Research Papers & Documents';
        icon = Folder;
        iconName = 'Folder';
        desc = 'Thesis drafts, Google Docs, and annotated whitepapers';
      } else if (res.type === 'notebook') {
        shelfKey = 'Laboratory Field Notebooks';
        icon = Book;
        iconName = 'Book';
        desc = 'Multi-page experimental laboratory notebooks with formulas';
      } else if (res.type === 'ebook') {
        shelfKey = 'Core Academic Reference Books';
        icon = BookOpen;
        iconName = 'BookOpen';
        desc = 'Comprehensive textbooks, chapters, and academic monographs';
      } else if (res.type === 'lesson') {
        shelfKey = 'Course Curriculum & Lessons';
        icon = GraduationCap;
        iconName = 'GraduationCap';
        desc = 'Structured course modules, checkpoints, and syllabus flashcards';
      } else if (res.type === 'journal') {
        shelfKey = 'Mindful Journals & Daily Logs';
        icon = Heart;
        iconName = 'Heart';
        desc = 'Mindful study reflections, mood logs, and personal insights';
      } else if (res.type === 'notepad') {
        shelfKey = 'Quick Scratchpads & Drafts';
        icon = FileText;
        iconName = 'FileText';
        desc = 'Instant capture scratchpads and idea dumps';
      }

      if (!shelfMap[shelfKey]) {
        shelfMap[shelfKey] = {
          id: `shelf-${shelfKey.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
          name: shelfKey,
          categoryKey: shelfKey,
          icon,
          iconName,
          description: desc,
          items: [],
          tags: []
        };
      }

      shelfMap[shelfKey].items.push(res);
      res.tags.forEach(t => {
        if (!shelfMap[shelfKey].tags.includes(t)) {
          shelfMap[shelfKey].tags.push(t);
        }
      });
    });

    return Object.values(shelfMap);
  }, [resources, shelvingMode]);

  const activeFocusShelf = useMemo(() => {
    if (!activeFocusShelfId) return null;
    return shelvesData.find(s => s.id === activeFocusShelfId) || null;
  }, [activeFocusShelfId, shelvesData]);

  // Processed items inside the focused shelf
  const focusedShelfItems = useMemo(() => {
    if (!activeFocusShelf) return [];
    let list = [...activeFocusShelf.items];

    if (inShelfSearchQuery.trim()) {
      const q = inShelfSearchQuery.toLowerCase();
      list = list.filter(
        r =>
          r.title.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.tags.some(t => t.toLowerCase().includes(q)) ||
          r.description.toLowerCase().includes(q)
      );
    }

    if (shelfSort === 'a-z') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (shelfSort === 'pinned') {
      list.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));
    } else if (shelfSort === 'starred') {
      list.sort((a, b) => (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0));
    } else if (shelfSort === 'tags') {
      list.sort((a, b) => (b.tags[0] || '').localeCompare(a.tags[0] || ''));
    }

    return list;
  }, [activeFocusShelf, inShelfSearchQuery, shelfSort]);

  // Helper to render distinct item physical visual representations
  const renderPhysicalCover = (book: ResourceItem) => {
    const isNotebook = book.type === 'notebook';
    const isJournal = book.type === 'journal';
    const isSlides = book.type === 'presentation';
    const isFolderDoc = book.type === 'document' || book.type === 'pdf';
    const isCourse = book.type === 'ebook';
    const isLesson = book.type === 'lesson';

    const categoryTheme = FULLER_RESOURCE_CATEGORY_COLORS[book.type];

    let computedCover = book.coverColor || (categoryTheme ? categoryTheme.bg : '#1a1a1a');
    if (isCourse && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#171717';
    } else if (isLesson && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#f0f0f0';
    } else if (isNotebook && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#1c1c1c';
    } else if (isJournal && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#e8e8e8';
    } else if (isSlides && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#262626';
    } else if (isFolderDoc && !book.coverColor) {
      computedCover = categoryTheme ? categoryTheme.bg : '#2a2a2a';
    }

    const isLight = isLightBackground(computedCover);
    const textColor = getAdaptiveTextColor(computedCover);
    const subtextColor = getAdaptiveSubtextColor(computedCover);

    return (
      <div
        onClick={() => onOpenResource(book)}
        style={{
          backgroundColor: computedCover,
          borderColor: categoryTheme ? categoryTheme.border : (isLight ? '#cbd5e1' : '#404040'),
          boxShadow: isLight
            ? '0 12px 28px -6px rgba(0, 0, 0, 0.4), inset 0 0 0 1px rgba(0,0,0,0.15)'
            : '0 12px 28px -6px rgba(0, 0, 0, 0.8), inset 0 0 0 1px rgba(255,255,255,0.15)'
        }}
        className="w-full aspect-[3/4] max-h-[220px] rounded-xl p-3 sm:p-4 flex flex-col justify-between cursor-pointer border-2 relative overflow-hidden transition-all duration-200 group-hover:scale-[1.02]"
      >
        {/* SPECIFIC VISUAL STYLES */}

        {/* 1. NOTEBOOK (Darker Shade + Spiral Rings on Left) */}
        {isNotebook && (
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-black/60 border-r border-white/20 flex flex-col justify-around py-3 items-center z-20">
            {Array.from({ length: 7 }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="w-3 h-2 rounded-full border border-neutral-400 bg-neutral-800 shadow-sm -ml-1"
                title="Notebook Spiral Ring"
              />
            ))}
          </div>
        )}

        {/* 2. JOURNAL (Lighter Shade + Spiral Rings on Left) */}
        {isJournal && (
          <div className="absolute top-0 bottom-0 left-0 w-4 bg-neutral-300/80 border-r border-neutral-400/50 flex flex-col justify-around py-3 items-center z-20">
            {Array.from({ length: 7 }).map((_, rIdx) => (
              <div
                key={rIdx}
                className="w-3 h-2 rounded-full border border-neutral-500 bg-neutral-200 shadow-sm -ml-1"
                title="Journal Spiral Ring"
              />
            ))}
          </div>
        )}

        {/* 3. GOOGLE SLIDES (Film Strip Perforations Top & Bottom) */}
        {isSlides && (
          <>
            <div className="absolute top-0 inset-x-0 h-3 bg-black/80 flex items-center justify-around px-1 z-20 border-b border-neutral-700">
              {Array.from({ length: 6 }).map((_, fIdx) => (
                <span key={fIdx} className="w-2 h-1.5 rounded-[1px] bg-neutral-400 inline-block" />
              ))}
            </div>
            <div className="absolute bottom-0 inset-x-0 h-3 bg-black/80 flex items-center justify-around px-1 z-20 border-t border-neutral-700">
              {Array.from({ length: 6 }).map((_, fIdx) => (
                <span key={fIdx} className="w-2 h-1.5 rounded-[1px] bg-neutral-400 inline-block" />
              ))}
            </div>
          </>
        )}

        {/* 4. DOCS / PDF (Folder Tab on Top Left) */}
        {isFolderDoc && (
          <div className="absolute top-0 left-0 right-12 h-3.5 bg-neutral-700/80 rounded-tr-lg border-b border-r border-neutral-600 flex items-center px-2 z-20">
            <span className="text-[8px] font-mono font-bold text-neutral-300 uppercase truncate">
              {book.type === 'pdf' ? 'PDF ARCHIVE' : 'DOC FOLDER'}
            </span>
          </div>
        )}

        {/* 5. COURSE (Darker Book Spine on Left) */}
        {isCourse && (
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-black/70 border-r border-white/10 z-10 flex flex-col justify-center items-center">
            <span className="text-[7px] font-mono text-neutral-500 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">
              COURSE HARDCOVER
            </span>
          </div>
        )}

        {/* 6. LESSON (Lighter Book Spine on Left) */}
        {isLesson && (
          <div className="absolute top-0 bottom-0 left-0 w-3.5 bg-neutral-300 border-r border-neutral-400 z-10 flex flex-col justify-center items-center">
            <span className="text-[7px] font-mono text-neutral-700 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180 font-bold">
              LESSON
            </span>
          </div>
        )}

        {/* Header Badges Strip */}
        <div className={`flex items-start justify-between z-10 ${isNotebook || isJournal || isCourse || isLesson ? 'pl-3' : ''} ${isSlides ? 'pt-2' : ''} ${isFolderDoc ? 'pt-2' : ''}`}>
          <div className="flex items-center gap-1.5">
            <div
              className={`p-1 rounded ${
                isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'
              }`}
            >
              {isSlides ? (
                <Film className="w-3.5 h-3.5" />
              ) : isFolderDoc ? (
                <Folder className="w-3.5 h-3.5" />
              ) : isNotebook ? (
                <Book className="w-3.5 h-3.5" />
              ) : isJournal ? (
                <Heart className="w-3.5 h-3.5" />
              ) : isLesson ? (
                <GraduationCap className="w-3.5 h-3.5" />
              ) : (
                <BookOpen className="w-3.5 h-3.5" />
              )}
            </div>

            <span
              style={{ color: textColor }}
              className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/20"
            >
              {isSlides ? 'Slides' : isFolderDoc ? (book.type === 'pdf' ? 'PDF' : 'Doc') : isCourse ? 'Course' : isLesson ? 'Lesson' : isNotebook ? 'Notebook' : isJournal ? 'Journal' : book.type}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {book.isPinned && (
              <span className={`p-1 rounded ${isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
                <Pin className="w-3 h-3 fill-current" />
              </span>
            )}
            {book.isFavorite && (
              <span className={`p-1 rounded ${isLight ? 'bg-black/10 text-black' : 'bg-white/10 text-white'}`}>
                <Star className="w-3 h-3 fill-current" />
              </span>
            )}
          </div>
        </div>

        {/* Volume Title & Category */}
        <div className={`space-y-1 z-10 my-auto ${isNotebook || isJournal || isCourse || isLesson ? 'pl-3' : ''}`}>
          <h4
            style={{ color: textColor }}
            className="font-bold text-xs sm:text-sm leading-snug line-clamp-3 font-mono tracking-tight"
          >
            {book.title}
          </h4>
          <span
            style={{ color: subtextColor }}
            className="text-[10px] font-mono block truncate opacity-85"
          >
            {book.category}
          </span>
        </div>

        {/* Footer Meta */}
        <div className={`flex items-center justify-between z-10 pt-1 border-t text-[9px] font-mono ${
          isLight ? 'border-black/15' : 'border-white/15'
        } ${isNotebook || isJournal || isCourse || isLesson ? 'pl-3' : ''} ${isSlides ? 'pb-2' : ''}`}>
          <span style={{ color: subtextColor }}>
            {book.tags[0] ? `#${book.tags[0]}` : book.type}
          </span>
          <span
            style={{ color: textColor }}
            className="font-bold uppercase tracking-wider group-hover:underline"
          >
            Open →
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 font-sans select-none animate-fade-in pb-12">
      {/* Top Banner with Navigation Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
            <BookOpen className="w-5 h-5 text-neutral-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                Academic Shelves Hub
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold">
                {shelvesData.length} Shelves • {resources.length} Volumes
              </span>
            </div>
            <p className="text-xs text-neutral-400">
              Select any shelf shortcut to enter full-screen dark focus mode
            </p>
          </div>
        </div>

        {/* Top View Toggle: Shelves vs Notepad/Tasks */}
        <div
          role="tablist"
          aria-label="Library sub views"
          className="flex items-center bg-black p-1 rounded-lg border border-neutral-800 text-xs font-mono"
        >
          <button
            role="tab"
            aria-selected={activeViewTab === 'shelves'}
            onClick={() => setActiveViewTab('shelves')}
            className={`min-touch-target px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeViewTab === 'shelves'
                ? 'bg-white text-black font-bold ring-1 ring-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Shelves Hub</span>
          </button>

          <button
            role="tab"
            aria-selected={activeViewTab === 'notepad_tasks'}
            onClick={() => setActiveViewTab('notepad_tasks')}
            className={`min-touch-target px-3.5 py-1.5 rounded-md transition-all flex items-center gap-1.5 ${
              activeViewTab === 'notepad_tasks'
                ? 'bg-white text-black font-bold ring-1 ring-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ListTodo className="w-3.5 h-3.5" />
            <span>Notepad & Tasks</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: SHELVES SHORTCUT PORTALS (v1.1.2 Focus Mode Architecture)         */}
      {/* ========================================================================= */}
      {activeViewTab === 'shelves' && (
        <div className="space-y-6 animate-fade-in">
          {/* Curricular Learning Paths & Accreditations Gateway Banner */}
          {onOpenCurricularPortal && (
            <div
              onClick={onOpenCurricularPortal}
              className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 hover:border-neutral-600 transition-all cursor-pointer shadow-lg group relative overflow-hidden select-none"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0 group-hover:scale-105 transition-transform shadow-inner">
                    <GraduationCap className="w-6 h-6 text-neutral-200" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                        CURRICULAR LEARNING PATHS & ACCREDITATIONS
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold uppercase">
                        Accredited Academy
                      </span>
                    </div>
                    <p className="text-xs text-neutral-400 font-sans max-w-xl leading-relaxed">
                      Follow structured syllabi with self-paced knowledge checks, earn cryptographically verified degree certificates, and unlock rare living companion fish.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center font-mono">
                  <div className="text-right hidden sm:block">
                    <span className="text-[11px] text-neutral-400 block">
                      {enrolledPathsCount} Enrolled · {earnedCertificatesCount} Degrees
                    </span>
                    <span className="text-[10px] text-emerald-400">● Interactive Roadmaps Ready</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCurricularPortal();
                    }}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs flex items-center gap-1.5 shadow active:scale-95 transition-all group-hover:ring-2 group-hover:ring-white/50"
                  >
                    <span>Launch Portal</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search & Actions Bar */}
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg"
          >
            <div className="flex-1 w-full flex items-center gap-2 bg-black/40 px-3 py-2 rounded-lg border border-white/20 text-xs">
              <Search className="w-4 h-4 text-neutral-400 shrink-0" />
              <input
                type="text"
                placeholder="Search across all shelves by title, category, or tag..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white outline-none w-full placeholder-neutral-400 font-mono"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-neutral-400 hover:text-white text-xs font-mono"
                >
                  [X]
                </button>
              )}
            </div>

            <button
              onClick={onCreateResourceClick}
              style={{
                backgroundColor: 'var(--theme-action-btn-bg, #ffffff)',
                color: 'var(--theme-action-btn-text, #000000)'
              }}
              className="min-touch-target w-full sm:w-auto px-4 py-2 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1.5 shrink-0 transition-all active:scale-95 shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Volume</span>
            </button>
          </div>

          {/* Shelving System Division Switcher (Categories vs Role Shelves vs Hybrid) */}
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs font-mono shadow-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                Shelving System:
              </span>
              <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="font-bold">
                {shelvingMode === 'hybrid' ? '⚡ Hybrid Mode' : shelvingMode === 'role_owned' ? '👤 Role-Owned Shelves' : '🗂️ Subject Categories'}
              </span>
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-lg border border-white/20 self-stretch sm:self-auto justify-between sm:justify-end">
              <button
                type="button"
                onClick={() => handleShelvingModeChange('categories')}
                className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                  shelvingMode === 'categories'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Subject Categories
              </button>

              <button
                type="button"
                onClick={() => handleShelvingModeChange('role_owned')}
                className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                  shelvingMode === 'role_owned'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Role Shelves
              </button>

              <button
                type="button"
                onClick={() => handleShelvingModeChange('hybrid')}
                className={`px-3 py-1.5 rounded text-[11px] font-bold transition-all ${
                  shelvingMode === 'hybrid'
                    ? 'bg-white text-black shadow-xs'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Hybrid Mode
              </button>
            </div>
          </div>

          {/* SHELVES SHORTCUT CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {shelvesData.map(shelf => {
              const ShelfIcon = shelf.icon;
              const matchesSearch = !searchQuery.trim() || 
                shelf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                shelf.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())) ||
                shelf.items.some(i => i.title.toLowerCase().includes(searchQuery.toLowerCase()));

              if (!matchesSearch) return null;

              return (
                <motion.div
                  key={shelf.id}
                  whileHover={{ y: -4, transition: { duration: 0.15 } }}
                  onClick={() => {
                    setActiveFocusShelfId(shelf.id);
                    setInShelfSearchQuery('');
                    setShelfSort('default');
                    onShowToast(`Transporting to ${shelf.name} (Focus Mode)`);
                  }}
                  style={{
                    background: 'var(--theme-card-gradient, #121212)',
                    borderColor: 'var(--theme-card-border, #404040)'
                  }}
                  className="rounded-2xl border-2 hover:border-white p-5 cursor-pointer group flex flex-col justify-between space-y-4 shadow-xl transition-all relative overflow-hidden"
                >
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-2xl pointer-events-none group-hover:bg-white/10 transition-colors" />

                  {/* Top Header */}
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0 group-hover:border-white transition-colors shadow-inner">
                        <ShelfIcon className="w-5 h-5 text-neutral-300 group-hover:text-white" />
                      </div>

                      <span className="px-2.5 py-1 rounded-full bg-black text-neutral-300 border border-neutral-750 font-mono text-[11px] font-bold">
                        {shelf.items.length} {shelf.items.length === 1 ? 'Volume' : 'Volumes'}
                      </span>
                    </div>

                    <h3 className="font-mono text-base font-bold text-white group-hover:underline tracking-tight mb-1">
                      {shelf.name}
                    </h3>
                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {shelf.description}
                    </p>
                  </div>

                  {/* Shelf Tags Chips */}
                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap mb-3">
                      {shelf.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 text-neutral-400 border border-neutral-800"
                        >
                          #{tag}
                        </span>
                      ))}
                      {shelf.tags.length > 3 && (
                        <span className="text-[10px] font-mono text-neutral-500">
                          +{shelf.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Enter Shortcut Action Prompt */}
                    <div className="pt-3 border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400 group-hover:text-white transition-colors">
                      <span className="text-[11px]">Enter Shelf Focus</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: NOTEPAD & TASKS SCRATCHPAD                                        */}
      {/* ========================================================================= */}
      {activeViewTab === 'notepad_tasks' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
          {/* TASK CHECKLIST SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono">
              <span className="font-bold text-white text-sm flex items-center gap-2">
                <ListTodo className="w-4 h-4 text-white" />
                Library Active Checklist
              </span>
              <span className="text-xs text-neutral-400">
                {tasks.filter(t => t.completed).length} / {tasks.length} Completed
              </span>
            </div>

            {/* Add Task Input */}
            <div className="flex items-center gap-2 font-mono text-xs">
              <input
                type="text"
                value={newTaskText}
                onChange={e => setNewTaskText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && newTaskText.trim()) {
                    setTasks(prev => [
                      ...prev,
                      {
                        id: `task-${Date.now()}`,
                        text: newTaskText.trim(),
                        completed: false,
                        category: newTaskCategory,
                        priority: newTaskPriority,
                        roleTag: userRole
                      }
                    ]);
                    setNewTaskText('');
                    onShowToast('Task added to library checklist');
                  }
                }}
                placeholder="Add new study checkpoint or reading goal..."
                className="flex-1 bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-white"
              />
              <button
                onClick={() => {
                  if (newTaskText.trim()) {
                    setTasks(prev => [
                      ...prev,
                      {
                        id: `task-${Date.now()}`,
                        text: newTaskText.trim(),
                        completed: false,
                        category: newTaskCategory,
                        priority: newTaskPriority,
                        roleTag: userRole
                      }
                    ]);
                    setNewTaskText('');
                    onShowToast('Task added to library checklist');
                  }
                }}
                className="px-3.5 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200 active:scale-95 transition-all"
              >
                Add
              </button>
            </div>

            {/* Tasks List */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto no-scrollbar font-mono text-xs">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() =>
                    setTasks(prev =>
                      prev.map(t => (t.id === task.id ? { ...t, completed: !t.completed } : t))
                    )
                  }
                  className={`p-3 rounded-lg border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                    task.completed
                      ? 'bg-black/40 border-neutral-850 opacity-60'
                      : 'bg-black border-neutral-800 hover:border-neutral-700 text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {task.completed ? (
                      <CheckSquare className="w-4 h-4 text-white shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-500 shrink-0" />
                    )}
                    <span className={`truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-200'}`}>
                      {task.text}
                    </span>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 shrink-0">
                    {task.category}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* READING SCRATCHPAD SECTION */}
          <div className="p-4 sm:p-5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-3 shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3 font-mono">
                <span className="font-bold text-white text-sm flex items-center gap-2">
                  <FileEdit className="w-4 h-4 text-white" />
                  Reading Scratchpad
                </span>

                {/* Tone Toggle */}
                <div className="flex items-center gap-1 bg-black p-0.5 rounded border border-neutral-800 text-xs">
                  <button
                    onClick={() => setNotepadPaperTone('dark')}
                    className={`px-2 py-0.5 rounded ${notepadPaperTone === 'dark' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}
                  >
                    Dark
                  </button>
                  <button
                    onClick={() => setNotepadPaperTone('light')}
                    className={`px-2 py-0.5 rounded ${notepadPaperTone === 'light' ? 'bg-white text-black font-bold' : 'text-neutral-400'}`}
                  >
                    Light
                  </button>
                </div>
              </div>

              <textarea
                value={notepadContent}
                onChange={e => setNotepadContent(e.target.value)}
                rows={12}
                style={{
                  backgroundColor: notepadPaperTone === 'light' ? '#f5f5f5' : '#050505',
                  color: notepadPaperTone === 'light' ? '#111111' : '#f5f5f5'
                }}
                className="w-full mt-3 p-3 rounded-xl border border-neutral-800 font-mono text-xs leading-relaxed outline-none focus:border-neutral-500 resize-none shadow-inner"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-800">
              <span>Auto-cached to session buffer</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(notepadContent);
                  onShowToast('Copied scratchpad text to clipboard');
                }}
                className="text-white hover:underline flex items-center gap-1 font-bold"
              >
                <Copy className="w-3 h-3" />
                <span>Copy Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL-SCREEN DARK FOCUS MODE SHELF OVERLAY (v1.1.2)                       */}
      {/* "similar to focus mode when clicked it would transport you to a darker   */}
      {/* background, no other content is shown not even the top and bottom bar,  */}
      {/* only an exit button"                                                     */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeFocusShelf && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-[#070707] text-white flex flex-col overflow-hidden font-sans select-none"
          >
            {/* Top Distraction-Free Header with Exit Button Only */}
            <div className="h-16 px-4 sm:px-6 bg-[#0d0d0d] border-b border-neutral-800 flex items-center justify-between gap-3 shrink-0">
              {/* Shelf Title & Icon */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-black border border-neutral-750 flex items-center justify-center text-white shrink-0">
                  {React.createElement(activeFocusShelf.icon, { className: 'w-4 h-4 text-neutral-300' })}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-tight">
                      {activeFocusShelf.name}
                    </h2>
                    <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 font-mono text-[10px] font-bold">
                      {focusedShelfItems.length} {focusedShelfItems.length === 1 ? 'Volume' : 'Volumes'}
                    </span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono hidden sm:inline">
                    Focus Mode • Zero Distraction Shelf View
                  </span>
                </div>
              </div>

              {/* Exit Button Only */}
              <button
                onClick={() => {
                  setActiveFocusShelfId(null);
                  onShowToast('Exited Shelf Focus View');
                }}
                className="min-h-[40px] px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
                title="Exit Shelf Focus View and return to Shelves Hub"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Shelf</span>
              </button>
            </div>

            {/* In-Shelf Sub-Controls: Search & Sort */}
            <div className="px-4 sm:px-6 py-3 bg-[#0a0a0a] border-b border-neutral-850 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 font-mono text-xs">
              <div className="w-full sm:max-w-md flex items-center gap-2 bg-black px-3 py-1.5 rounded-lg border border-neutral-800">
                <Search className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <input
                  type="text"
                  placeholder={`Search inside ${activeFocusShelf.name}...`}
                  value={inShelfSearchQuery}
                  onChange={e => setInShelfSearchQuery(e.target.value)}
                  className="bg-transparent text-white outline-none w-full placeholder-neutral-500 font-mono text-xs"
                />
                {inShelfSearchQuery && (
                  <button onClick={() => setInShelfSearchQuery('')} className="text-neutral-500 hover:text-white">
                    [X]
                  </button>
                )}
              </div>

              {/* Sort Pills */}
              <div className="flex items-center gap-1 bg-black p-1 rounded-lg border border-neutral-800">
                <span className="text-[10px] text-neutral-500 px-1.5 hidden sm:inline">Sort:</span>
                {(['default', 'tags', 'a-z', 'pinned', 'starred'] as ShelfSortOption[]).map(sOpt => (
                  <button
                    key={sOpt}
                    onClick={() => {
                      setShelfSort(sOpt);
                      onShowToast(`Sorted by ${sOpt.toUpperCase()}`);
                    }}
                    className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold transition-all ${
                      shelfSort === sOpt
                        ? 'bg-white text-black'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sOpt === 'default' ? 'Orig' : sOpt}
                  </button>
                ))}
              </div>
            </div>

            {/* Focused Shelf Volumes Grid Stage */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 no-scrollbar">
              <div className="max-w-6xl mx-auto">
                {focusedShelfItems.length === 0 ? (
                  <div className="p-16 rounded-2xl bg-[#0f0f0f] border border-neutral-800 text-center flex flex-col items-center justify-center gap-3 my-8">
                    <BookOpen className="w-10 h-10 text-neutral-600" />
                    <span className="font-bold text-sm text-white font-mono">
                      No volumes found matching query in this shelf
                    </span>
                    <button
                      onClick={onCreateResourceClick}
                      className="px-4 py-2 rounded-lg bg-white text-black font-mono font-bold text-xs"
                    >
                      + Create New Volume In Shelf
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 animate-fade-in">
                    {focusedShelfItems.map(book => (
                      <div key={book.id} className="relative group flex flex-col items-center">
                        {renderPhysicalCover(book)}

                        {/* Quick Action Toolbar Below Card */}
                        <div className="w-full flex items-center justify-between pt-2 px-1 text-[11px] font-mono text-neutral-400">
                          <button
                            onClick={() => startEditing(book)}
                            className="hover:text-white flex items-center gap-1 transition-colors"
                            title="Edit Title, Tags & Color"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => onTogglePin(book.id)}
                            className={`flex items-center gap-1 ${book.isPinned ? 'text-white' : 'hover:text-white'}`}
                          >
                            <Pin className="w-3 h-3" />
                          </button>

                          <button
                            onClick={() => onToggleFavorite(book.id)}
                            className={`flex items-center gap-1 ${book.isFavorite ? 'text-white' : 'hover:text-white'}`}
                          >
                            <Star className="w-3 h-3" />
                          </button>

                          {onDeleteResource && (
                            <button
                              onClick={() => setDeletingResource(book)}
                              className="text-neutral-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                              title="Delete Volume"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EDIT VOLUME MODAL */}
      {editingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in font-sans">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                Edit Volume Details
              </span>
              <button
                onClick={() => setEditingResource(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 font-mono text-xs">
              <div>
                <label className="text-neutral-400 block mb-1">Volume Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Shelf Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={e => setEditTags(e.target.value)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Role Shelf Ownership</label>
                <select
                  value={editRoleShelf}
                  onChange={e => setEditRoleShelf(e.target.value as RoleShelfType)}
                  className="w-full bg-black border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-white font-mono"
                >
                  <option value="personal">📁 Personal Shelf (Journals & Scratchpads)</option>
                  <option value="academic">🎓 Academic & Student Shelf (Courses & Lessons)</option>
                  <option value="researcher">🔬 Researcher Shelf (Papers & Whitepapers)</option>
                  <option value="educator">🏛️ Educator Shelf (Slides & Decks)</option>
                </select>
              </div>

              <div>
                <label className="text-neutral-400 block mb-1">Cover Tone</label>
                <div className="flex items-center gap-2 flex-wrap">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => setEditColor(c.color)}
                      style={{ backgroundColor: c.color }}
                      className={`w-7 h-7 rounded-full border-2 transition-transform ${
                        editColor === c.color ? 'border-white scale-110 shadow' : 'border-neutral-700'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setEditingResource(null)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-white text-black font-bold hover:bg-neutral-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE RESOURCE CONFIRMATION MODAL */}
      {deletingResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm font-sans">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <span className="font-mono text-sm font-bold text-red-400 uppercase">
                Delete Volume
              </span>
              <button
                onClick={() => setDeletingResource(null)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-mono leading-relaxed">
              Are you sure you want to delete <strong>"{deletingResource.title}"</strong> from your library shelf?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2 font-mono text-xs">
              <button
                onClick={() => setDeletingResource(null)}
                className="px-3.5 py-2 rounded-lg bg-neutral-800 text-neutral-300 font-bold hover:bg-neutral-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (onDeleteResource) {
                    onDeleteResource(deletingResource.id);
                  }
                  setDeletingResource(null);
                }}
                className="px-3.5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
