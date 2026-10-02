import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  Book,
  GraduationCap,
  FileCode,
  Heart,
  FileText,
  Presentation,
  Plus,
  X,
  Pin,
  Star,
  AlertCircle,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { ResourceType, ResourceItem } from '../types';
import { AVAILABLE_BADGES } from '../data';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateResource: (resource: ResourceItem, openImmediately: boolean) => void;
  onShowToast: (msg: string) => void;
}

const RESOURCE_TYPES: Array<{
  type: ResourceType;
  label: string;
  icon: any;
  color: string;
  desc: string;
}> = [
  {
    type: 'notebook',
    label: 'Notebook',
    icon: BookOpen,
    color: '#ffffff',
    desc: 'Multi-page digital binder with tabs, bookmarks, and lab notes.'
  },
  {
    type: 'document',
    label: 'Document',
    icon: FileText,
    color: '#e5e5e5',
    desc: 'Full document editor with outline, comments, formatting.'
  },
  {
    type: 'presentation',
    label: 'Presentation',
    icon: Presentation,
    color: '#cccccc',
    desc: '16:9 canvas with slideshow mode and presenter notes.'
  },
  {
    type: 'ebook',
    label: 'Ebook',
    icon: Book,
    color: '#a3a3a3',
    desc: 'Digital book reader with chapters, font controls, and sepia mode.'
  },
  {
    type: 'lesson',
    label: 'Lesson',
    icon: GraduationCap,
    color: '#888888',
    desc: 'Course modules, syllabus checkpoints, and self-assessment quiz.'
  },
  {
    type: 'notepad',
    label: 'Notepad',
    icon: FileCode,
    color: '#737373',
    desc: 'Minimalist scratchpad for quick markdown idea dumps & code.'
  },
  {
    type: 'journal',
    label: 'Journal',
    icon: Heart,
    color: '#525252',
    desc: 'Mindful daily reflection with mood check-ins & private vault lock.'
  },
  {
    type: 'pdf',
    label: 'PDF Document',
    icon: FileText,
    color: '#262626',
    desc: 'Interactive PDF viewer with highlighter annotations and search.'
  }
];

export const CreateResourceModal: React.FC<CreateResourceModalProps> = ({
  isOpen,
  onClose,
  onCreateResource,
  onShowToast
}) => {
  const [selectedType, setSelectedType] = useState<ResourceType>('notebook');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedBadge, setSelectedBadge] = useState('★ Favorite');
  const [isPinned, setIsPinned] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Field validation and touched states
  const [touched, setTouched] = useState<{ title?: boolean; category?: boolean }>({});

  if (!isOpen) return null;

  // Real-time validation rules
  const getTitleError = (): string | null => {
    if (!touched.title) return null;
    const trimmed = title.trim();
    if (!trimmed) {
      return 'Title is required. Please provide a title for this volume.';
    }
    if (trimmed.length < 3) {
      return `Title must contain at least 3 characters (currently ${trimmed.length}).`;
    }
    if (trimmed.length > 80) {
      return `Title must be under 80 characters (currently ${trimmed.length}).`;
    }
    return null;
  };

  const titleError = getTitleError();
  const isTitleValid = touched.title && !titleError && title.trim().length >= 3;

  // Real-time parsed tags preview
  const parsedTags = tagsInput
    ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ title: true, category: true });

    if (!title.trim() || title.trim().length < 3) {
      onShowToast('Please provide a valid title (minimum 3 characters)');
      return;
    }

    const typeConfig = RESOURCE_TYPES.find(t => t.type === selectedType);
    const tags = parsedTags.length > 0 ? parsedTags : ['Workspace', selectedType];

    let metadata: any = {};
    if (selectedType === 'notebook') {
      metadata = {
        activePageIndex: 0,
        pages: [
          {
            id: `p-${Date.now()}-1`,
            title: 'Page 1: Introduction',
            content: 'Begin taking structured notes...',
            badge: selectedBadge,
            isBookmarked: true
          }
        ]
      };
    } else if (selectedType === 'document') {
      metadata = {
        collaborators: ['You'],
        docContent: `<h1>${title}</h1><p>Start drafting your collaborative document. All document formatting tools are available above.</p>`,
        comments: []
      };
    } else if (selectedType === 'presentation') {
      metadata = {
        slideCount: 2,
        currentSlide: 0,
        slides: [
          {
            id: `sl-${Date.now()}-1`,
            title: title,
            body: 'Subtitle / Key Thesis Argument',
            notes: 'Introductory talking points...',
            layout: 'title',
            bg: '#171717'
          },
          {
            id: `sl-${Date.now()}-2`,
            title: 'Overview & Objectives',
            body: '• Milestone 1: Data consolidation\n• Milestone 2: UI prototyping\n• Milestone 3: Symposium defense',
            notes: 'Elaborate on weekly checkpoints.',
            layout: 'content',
            bg: '#0a0a0a'
          }
        ]
      };
    } else if (selectedType === 'ebook') {
      metadata = {
        currentChapter: 1,
        fontSize: 'base',
        sepiaMode: false,
        chapters: [
          {
            id: 'ch-1',
            title: 'Chapter 1: Principles of Autonomous Systems',
            content: 'In autonomous telemetry systems, noise cancellation must be coupled with human tactile intuition.'
          },
          {
            id: 'ch-2',
            title: 'Chapter 2: Signal Transduction & Spatial Buffering',
            content: 'When multi-sensory signals converge, latency below 12 milliseconds produces perceived simultaneity.'
          }
        ]
      };
    } else if (selectedType === 'lesson') {
      metadata = {
        instructor: 'Dr. Sarah Lin',
        duration: '45 mins',
        currentModule: 1,
        modules: [
          { id: 'mod-1', title: '1. Theoretical Framework & Foundations', completed: true },
          { id: 'mod-2', title: '2. Mathematical Formulation of Wave Mechanics', completed: false }
        ]
      };
    } else if (selectedType === 'notepad') {
      metadata = {
        autoSaved: true,
        wordCount: 84
      };
    } else if (selectedType === 'journal') {
      metadata = {
        mood: 'calm',
        isLocked: false,
        streakDays: 14
      };
    } else if (selectedType === 'pdf') {
      metadata = {
        pageCount: 18,
        currentPage: 1,
        highlights: []
      };
    }

    const newResource: ResourceItem = {
      id: `res-${selectedType}-${Date.now()}`,
      type: selectedType,
      title: title.trim(),
      description: description.trim() || typeConfig?.desc || '',
      category: category.trim() || `${typeConfig?.label} • Workspace`,
      tags,
      coverColor: typeConfig?.color || '#ffffff',
      isPinned,
      isFavorite,
      badge: selectedBadge,
      createdAt: 'Today',
      updatedAt: 'Just now',
      metadata
    };

    onCreateResource(newResource, true);
    onShowToast(`Created ${typeConfig?.label}: "${newResource.title}"`);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 font-sans"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="bg-neutral-900 text-white border border-neutral-700 rounded-lg shadow-2xl w-full max-w-lg p-5 flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-white text-black flex items-center justify-center font-bold shrink-0">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 id="create-modal-title" className="font-bold text-sm sm:text-base text-white font-mono uppercase tracking-tight">
                [Create New Resource]
              </h3>
              <p className="text-[11px] text-neutral-400">
                Add notebook, doc, presentation, lesson, or journal
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal dialog"
            className="min-touch-target p-2 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-xs flex items-center justify-center transition-colors focus-visible:ring-2 focus-visible:ring-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4" noValidate>
          {/* Resource Type Grid */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2 font-mono">
              [Select Resource Type]
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Select resource type">
              {RESOURCE_TYPES.map(t => {
                const Icon = t.icon;
                const isSelected = selectedType === t.type;
                return (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    key={t.type}
                    onClick={() => setSelectedType(t.type)}
                    className={`min-touch-target p-2.5 rounded border flex flex-col items-center justify-center gap-1.5 transition-all text-center focus-visible:ring-2 focus-visible:ring-white ${
                      isSelected
                        ? 'bg-neutral-800 border-white text-white font-bold ring-1 ring-white/40'
                        : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-[11px] truncate w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input with Real-time Inline Validation */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="resource-title-input" className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
                [Title] <span className="text-neutral-400">*</span>
              </label>
              {title.length > 0 && (
                <span className={`text-[10px] font-mono ${title.length > 80 ? 'text-red-400' : 'text-neutral-500'}`}>
                  {title.length}/80
                </span>
              )}
            </div>

            <div className="relative">
              <input
                id="resource-title-input"
                type="text"
                required
                aria-required="true"
                aria-invalid={!!titleError}
                aria-describedby={titleError ? 'title-validation-error' : undefined}
                placeholder="e.g. Cognitive Systems Lab Notes, Chapter 4 Pitch..."
                value={title}
                onBlur={() => setTouched(prev => ({ ...prev, title: true }))}
                onChange={e => {
                  setTitle(e.target.value);
                  if (!touched.title) setTouched(prev => ({ ...prev, title: true }));
                }}
                className={`w-full bg-black border rounded px-3 py-2.5 text-xs sm:text-sm text-white placeholder-neutral-500 outline-none transition-colors min-h-[44px] focus-visible:ring-2 focus-visible:ring-white ${
                  titleError
                    ? 'border-red-500 focus:border-red-400'
                    : isTitleValid
                    ? 'border-white/80 focus:border-white'
                    : 'border-neutral-700 focus:border-white'
                }`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                {titleError && <AlertCircle className="w-4 h-4 text-red-400" />}
                {isTitleValid && <CheckCircle2 className="w-4 h-4 text-white" />}
              </div>
            </div>

            {/* Human-readable error / instruction message */}
            {titleError && (
              <p id="title-validation-error" className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1 font-mono animate-fade-in">
                <span>{titleError}</span>
              </p>
            )}
          </div>

          {/* Category & Course */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="resource-category-input" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1 font-mono">
                [Category / Course]
              </label>
              <input
                id="resource-category-input"
                type="text"
                placeholder="e.g. COGS-492, Research"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-white outline-none min-h-[44px] focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>

            <div>
              <label htmlFor="resource-tags-input" className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1 font-mono">
                [Tags] <span className="text-[10px] text-neutral-500 font-normal lowercase">(comma separated)</span>
              </label>
              <input
                id="resource-tags-input"
                type="text"
                placeholder="e.g. Thesis, Neural, Sprint"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-white outline-none min-h-[44px] focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>
          </div>

          {/* Real-time Parsed Tags Indicator */}
          {parsedTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap text-[11px] font-mono text-neutral-400">
              <span className="flex items-center gap-1 text-neutral-500">
                <Tag className="w-3 h-3" />
                Parsed tags:
              </span>
              {parsedTags.map((tag, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-200 border border-neutral-700">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Initial Status Badge Picker */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1.5 font-mono">
              [Assign Badge]
            </label>
            <div className="flex items-center gap-1.5 flex-wrap">
              {AVAILABLE_BADGES.map(b => (
                <button
                  type="button"
                  key={b.id}
                  onClick={() => setSelectedBadge(b.label)}
                  className={`min-touch-target px-3 py-1.5 rounded border text-xs font-mono transition-all flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white ${
                    selectedBadge === b.label
                      ? 'bg-white text-black border-white font-bold'
                      : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pin & Favorite Toggles */}
          <div className="flex items-center gap-3 pt-2 font-mono">
            <button
              type="button"
              onClick={() => setIsPinned(!isPinned)}
              aria-pressed={isPinned}
              className={`min-touch-target flex items-center justify-center gap-1.5 px-3.5 py-2 rounded border text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white ${
                isPinned
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>{isPinned ? '[PINNED]' : 'Pin to Hub'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              aria-pressed={isFavorite}
              className={`min-touch-target flex items-center justify-center gap-1.5 px-3.5 py-2 rounded border text-xs font-semibold transition-all focus-visible:ring-2 focus-visible:ring-white ${
                isFavorite
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-black border-neutral-800 text-neutral-400 hover:text-white'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{isFavorite ? '[STARRED]' : 'Star/Favorite'}</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2.5 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="min-touch-target px-4 py-2 rounded text-xs font-semibold text-neutral-400 hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-touch-target px-5 py-2 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 flex items-center gap-1.5 active:scale-95 transition-all focus-visible:ring-2 focus-visible:ring-white"
            >
              <Plus className="w-4 h-4 text-black" />
              <span>CREATE & OPEN</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
