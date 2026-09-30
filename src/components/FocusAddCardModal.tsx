import React, { useState } from 'react';
import {
  X,
  Plus,
  Edit3,
  FileText,
  GraduationCap,
  Presentation,
  ListTodo,
  Info,
  BookOpen
} from 'lucide-react';
import { FocusCardItem, FocusCardPurpose, ResourceItem } from '../types';

interface FocusAddCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (card: FocusCardItem) => void;
  currentCardCount: number;
  resources: ResourceItem[];
  onShowToast: (msg: string) => void;
}

export const FocusAddCardModal: React.FC<FocusAddCardModalProps> = ({
  isOpen,
  onClose,
  onAddCard,
  currentCardCount,
  resources,
  onShowToast
}) => {
  const [selectedPurpose, setSelectedPurpose] = useState<FocusCardPurpose>('notes');
  const [cardTitle, setCardTitle] = useState('');
  const [selectedResourceId, setSelectedResourceId] = useState<string>('');

  if (!isOpen) return null;

  const purposeOptions: Array<{
    purpose: FocusCardPurpose;
    label: string;
    description: string;
    icon: any;
    color: string;
  }> = [
    {
      purpose: 'notes',
      label: 'Interactive Notes',
      description: 'Markdown note-taking with formulas, code formatting, and live counter.',
      icon: Edit3,
      color: '#ffffff'
    },
    {
      purpose: 'docs',
      label: 'Google Docs Draft',
      description: 'Collaborative thesis draft with real-time sync and review notes.',
      icon: FileText,
      color: '#e5e5e5'
    },
    {
      purpose: 'lectures',
      label: 'Lecture & Audio',
      description: 'Audio/video lecture stream with scrubber and synchronized transcript.',
      icon: GraduationCap,
      color: '#cccccc'
    },
    {
      purpose: 'slides',
      label: 'Presentation Deck',
      description: '16:9 interactive slide deck preview, slide switcher, and notes.',
      icon: Presentation,
      color: '#a3a3a3'
    },
    {
      purpose: 'scratchpad',
      label: 'Instant Scratchpad',
      description: 'Rapid single-click brainstorm scratchpad auto-saved to local memory.',
      icon: Edit3,
      color: '#888888'
    },
    {
      purpose: 'milestones',
      label: 'Sprint Milestones',
      description: 'Interactive sprint deliverables checklist and completion tracker.',
      icon: ListTodo,
      color: '#737373'
    },
    {
      purpose: 'pdf',
      label: 'PDF Research Document',
      description: 'Whitepaper & spec document reader with page navigation.',
      icon: BookOpen,
      color: '#525252'
    }
  ];

  const handleSelectResource = (resId: string) => {
    setSelectedResourceId(resId);
    const found = resources.find(r => r.id === resId);
    if (found) {
      setCardTitle(found.title);
      if (found.type === 'document') setSelectedPurpose('docs');
      else if (found.type === 'presentation') setSelectedPurpose('slides');
      else if (found.type === 'lesson') setSelectedPurpose('lectures');
      else if (found.type === 'notebook') setSelectedPurpose('notes');
      else if (found.type === 'pdf') setSelectedPurpose('pdf');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentCardCount >= 7) {
      onShowToast('Maximum 7 tabs stacked in focus mode');
      onClose();
      return;
    }

    const opt = purposeOptions.find(p => p.purpose === selectedPurpose);
    const title = cardTitle.trim() || opt?.label || 'New Focus Tab';

    const newCard: FocusCardItem = {
      id: `tab-${Date.now()}`,
      purpose: selectedPurpose,
      title,
      subtitle: `${opt?.label || selectedPurpose} • Focused Tab`,
      category: 'Workspace Custom',
      badge: 'Focus Tab',
      color: opt?.color || '#ffffff',
      resourceId: selectedResourceId || undefined,
      notesContent:
        selectedPurpose === 'notes'
          ? `# ${title}\n\nStart drafting structured research notes here...`
          : undefined,
      docContent:
        selectedPurpose === 'docs'
          ? `Draft content for ${title}. Live cursor and collaborator comments enabled.`
          : undefined,
      lectureTopic: selectedPurpose === 'lectures' ? title : undefined,
      lectureInstructor: selectedPurpose === 'lectures' ? 'Lead Faculty' : undefined,
      lectureProgress: 0,
      slideCurrent: 1,
      slideTotal: 4,
      scratchpadText:
        selectedPurpose === 'scratchpad'
          ? `## Quick Idea Buffer for ${title}\n- Point 1\n- Point 2`
          : undefined,
      milestones:
        selectedPurpose === 'milestones'
          ? [
              { id: 'm-new-1', text: 'Define project scope & objectives', completed: false },
              { id: 'm-new-2', text: 'Conduct initial literature review', completed: false }
            ]
          : undefined
    };

    onAddCard(newCard);
    onShowToast(`Stacked "${title}" (${opt?.label})`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 select-none animate-fade-in font-sans">
      <div className="relative w-full max-w-md rounded-lg bg-neutral-900 border border-neutral-700 p-5 shadow-2xl flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <span>Stack Focus Tab</span>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                [{currentCardCount + 1}/7]
              </span>
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5">
              Add up to 7 concurrent focus cards corresponding to working memory.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-800 font-mono text-xs"
          >
            [X]
          </button>
        </div>

        {/* Capacity banner */}
        <div className="p-3 rounded border border-neutral-800 bg-neutral-950 flex items-start gap-2.5 text-xs">
          <Info className="w-4 h-4 text-white shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 font-mono">
              <span className="font-bold text-white">Tab Capacity:</span>
              <span className="font-bold text-neutral-300">{currentCardCount} / 7 Active</span>
            </div>
            <span className="text-[11px] text-neutral-400 mt-0.5 block">
              In landscape mode, all tabs collapse to clean icons for zero-friction cognitive flow.
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Pick Purpose */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 block font-mono uppercase">[Select Purpose]</label>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 no-scrollbar">
              {purposeOptions.map(opt => {
                const Icon = opt.icon;
                const isSelected = selectedPurpose === opt.purpose;
                return (
                  <button
                    key={opt.purpose}
                    type="button"
                    onClick={() => {
                      setSelectedPurpose(opt.purpose);
                      if (!cardTitle || purposeOptions.some(p => p.label === cardTitle)) {
                        setCardTitle(opt.label);
                      }
                    }}
                    className={`p-2.5 rounded border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-800 border-white text-white font-bold'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded flex items-center justify-center border border-neutral-700 bg-neutral-900 text-white">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white truncate">{opt.label}</span>
                    </div>
                    <p className="text-[10px] text-neutral-400 line-clamp-2">{opt.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Tab Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-neutral-300 block font-mono uppercase">[Tab Label / Title]</label>
            <input
              type="text"
              value={cardTitle}
              onChange={e => setCardTitle(e.target.value)}
              placeholder="e.g. Cognitive Neuro-Acoustics Notes"
              className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-white"
            />
          </div>

          {/* Or link existing Library Resource */}
          {resources.length > 0 && (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 block font-mono uppercase">
                [Link Library Resource]
              </label>
              <select
                value={selectedResourceId}
                onChange={e => handleSelectResource(e.target.value)}
                className="w-full bg-neutral-950 border border-neutral-800 rounded px-3 py-2 text-xs text-white outline-none focus:border-white font-mono"
              >
                <option value="">-- Choose from Shelf --</option>
                {resources.map(r => (
                  <option key={r.id} value={r.id} className="bg-neutral-900 text-white">
                    [{r.type.toUpperCase()}] {r.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={currentCardCount >= 7}
              className="px-4 py-1.5 rounded bg-white text-black text-xs font-bold hover:bg-neutral-200 flex items-center gap-1.5 disabled:opacity-40"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Stack Tab</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
