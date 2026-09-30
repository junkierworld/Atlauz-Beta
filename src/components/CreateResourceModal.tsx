import React, { useState } from 'react';
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
  Star
} from 'lucide-react';
import { ResourceType, ResourceItem } from '../types';
import { AVAILABLE_BADGES } from '../data';

interface CreateResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateResource: (resource: ResourceItem, openImmediately: boolean) => void;
  onShowToast: (msg: string) => void;
}

const RESOURCE_TYPES: Array<{ type: ResourceType; label: string; icon: any; color: string; desc: string }> = [
  { type: 'notebook', label: 'Notebook', icon: BookOpen, color: '#ffffff', desc: 'Multi-page digital binder with tabs, bookmarks, and lab notes.' },
  { type: 'document', label: 'Document', icon: FileText, color: '#e5e5e5', desc: 'Full document editor with outline, comments, formatting.' },
  { type: 'presentation', label: 'Presentation', icon: Presentation, color: '#cccccc', desc: '16:9 canvas with slideshow mode and presenter notes.' },
  { type: 'ebook', label: 'Ebook', icon: Book, color: '#a3a3a3', desc: 'Digital book reader with chapters, font controls, and sepia mode.' },
  { type: 'lesson', label: 'Lesson', icon: GraduationCap, color: '#888888', desc: 'Course modules, syllabus checkpoints, and self-assessment quiz.' },
  { type: 'notepad', label: 'Notepad', icon: FileCode, color: '#737373', desc: 'Minimalist scratchpad for quick markdown idea dumps & code.' },
  { type: 'journal', label: 'Journal', icon: Heart, color: '#525252', desc: 'Mindful daily reflection with mood check-ins & private vault lock.' },
  { type: 'pdf', label: 'PDF Document', icon: FileText, color: '#262626', desc: 'Interactive PDF viewer with highlighter annotations and search.' }
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

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      onShowToast('Please enter a title');
      return;
    }

    const typeConfig = RESOURCE_TYPES.find(t => t.type === selectedType);
    const tags = tagsInput
      ? tagsInput.split(',').map(t => t.trim()).filter(Boolean)
      : ['Workspace', selectedType];

    let metadata: any = {};
    if (selectedType === 'notebook') {
      metadata = {
        activePageIndex: 0,
        pages: [
          { id: `p-${Date.now()}-1`, title: 'Page 1: Introduction', content: 'Begin taking structured notes...', badge: selectedBadge, isBookmarked: true }
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
          { id: 'ch-1', title: 'Chapter 1: Principles of Autonomous Systems', content: 'In autonomous telemetry systems, noise cancellation must be coupled with human tactile intuition.' },
          { id: 'ch-2', title: 'Chapter 2: Signal Transduction & Spatial Buffering', content: 'When multi-sensory signals converge, latency below 12 milliseconds produces perceived simultaneity.' }
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 font-sans">
      <div className="bg-neutral-900 text-white border border-neutral-700 rounded-lg shadow-2xl w-full max-w-lg p-5 flex flex-col max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-white text-black flex items-center justify-center font-bold">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white font-mono uppercase">[Create New Resource]</h3>
              <p className="text-[11px] text-neutral-400">Add notebook, doc, presentation, lesson, or journal</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-neutral-400 hover:text-white font-mono text-xs">
            [X]
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          {/* Resource Type Grid */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2 font-mono">
              [Select Resource Type]
            </label>
            <div className="grid grid-cols-4 gap-2">
              {RESOURCE_TYPES.map(t => {
                const Icon = t.icon;
                const isSelected = selectedType === t.type;
                return (
                  <button
                    type="button"
                    key={t.type}
                    onClick={() => setSelectedType(t.type)}
                    className={`p-2.5 rounded border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
                      isSelected
                        ? 'bg-neutral-800 border-white text-white font-bold'
                        : 'bg-black border-neutral-800 text-neutral-400 hover:border-neutral-600'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-[11px] truncate w-full">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1 font-mono">
              [Title]
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Cognitive Systems Lab Notes, Chapter 4 Pitch..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-xs sm:text-sm text-white placeholder-neutral-500 focus:border-white outline-none"
            />
          </div>

          {/* Category & Course */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1 font-mono">
                [Category / Course]
              </label>
              <input
                type="text"
                placeholder="e.g. COGS-492, Research"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-white outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-1 font-mono">
                [Tags]
              </label>
              <input
                type="text"
                placeholder="e.g. Thesis, Neural, Sprint"
                value={tagsInput}
                onChange={e => setTagsInput(e.target.value)}
                className="w-full bg-black border border-neutral-700 rounded px-3 py-2 text-xs text-white placeholder-neutral-500 focus:border-white outline-none"
              />
            </div>
          </div>

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
                  className={`px-2.5 py-1 rounded border text-xs font-mono transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-all ${
                isPinned
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-black border-neutral-800 text-neutral-400'
              }`}
            >
              <Pin className="w-3.5 h-3.5 fill-current" />
              <span>{isPinned ? '[PINNED]' : 'Pin to Hub'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFavorite(!isFavorite)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-semibold transition-all ${
                isFavorite
                  ? 'bg-neutral-800 border-white text-white'
                  : 'bg-black border-neutral-800 text-neutral-400'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{isFavorite ? '[STARRED]' : 'Star/Favorite'}</span>
            </button>
          </div>

          {/* Submit Action */}
          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-2 font-mono">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-white text-black font-bold text-xs hover:bg-neutral-200 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>CREATE & OPEN</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
