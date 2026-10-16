import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Copy,
  Check,
  Shield,
  Activity,
  UserCheck,
  Clock,
  Sparkles,
  Link,
  Layers,
  Edit3
} from 'lucide-react';
import { CollaboratorBadge } from '../types';

interface CollaboratorPopoverProps {
  collaborator: CollaboratorBadge | null;
  tileTitle: string;
  shareToken: string;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const CollaboratorPopover: React.FC<CollaboratorPopoverProps> = ({
  collaborator,
  tileTitle,
  shareToken,
  onClose,
  onShowToast
}) => {
  const [copied, setCopied] = React.useState<boolean>(false);

  if (!collaborator) return null;

  const handleCopyLink = () => {
    const inviteUrl = `${window.location.origin}/#bento-collab=${shareToken}`;
    navigator.clipboard?.writeText?.(inviteUrl);
    setCopied(true);
    onShowToast(`Copied token link for ${collaborator.name}`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in font-sans">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.15 }}
          className="w-full max-w-md bg-neutral-950 border border-neutral-700 rounded-lg shadow-2xl p-5 text-neutral-200 select-none"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-sm px-2 py-1 rounded bg-white text-black font-extrabold tracking-wider">
                [{collaborator.initials}]
              </span>
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>{collaborator.name}</span>
                  {collaborator.isEditing && (
                    <span className="inline-flex items-center gap-1 font-mono text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 border border-neutral-700 text-white font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      EDITING
                    </span>
                  )}
                </h3>
                <p className="text-[11px] font-mono text-neutral-400">
                  {collaborator.role || 'Research Co-Investigator'}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded text-neutral-400 hover:text-white hover:bg-neutral-900 border border-transparent hover:border-neutral-800 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Content */}
          <div className="py-4 space-y-3.5 text-xs font-mono">
            {/* Institution / Lab */}
            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 flex items-center justify-between">
              <span className="text-neutral-400">Affiliation / Lab</span>
              <span className="text-white font-medium text-right">
                {collaborator.institution || 'Oceanic Cognitive Architecture'}
              </span>
            </div>

            {/* Current Tile Context */}
            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 space-y-1">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-neutral-300" />
                  Active Bento Canvas
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700">
                  {collaborator.accessLevel || 'Co-Editor'}
                </span>
              </div>
              <div className="text-white font-bold truncate">{tileTitle}</div>
            </div>

            {/* Live Co-Presence Telemetry */}
            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400 flex items-center gap-1.5">
                  <Activity className="w-3 h-3 text-white" />
                  Live Activity Telemetry
                </span>
                <span className="text-neutral-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {collaborator.lastActiveTime}
                </span>
              </div>

              <div className="text-neutral-300 bg-neutral-950 p-2 rounded border border-neutral-800 text-[11px] leading-relaxed">
                {collaborator.isEditing ? (
                  <div className="flex items-start gap-1.5 text-white">
                    <span className="font-bold">•</span>
                    <span>
                      {collaborator.currentAction ||
                        `Active keystrokes in block #${collaborator.activeBlockId || 'crdt-block'}`}
                    </span>
                  </div>
                ) : (
                  <div className="text-neutral-400">
                    Presence verified. Idle in view buffer without pending write conflicts.
                  </div>
                )}
              </div>
            </div>

            {/* Cryptographic Access Token */}
            <div className="p-2.5 rounded bg-neutral-900/80 border border-neutral-800 space-y-1.5">
              <div className="flex items-center justify-between text-neutral-400">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3 h-3 text-neutral-300" />
                  Cryptographic Session Link
                </span>
                <span className="text-[10px] text-neutral-500">CRDT Lamport LWW</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={`#bento-collab=${shareToken}`}
                  className="flex-1 bg-neutral-950 border border-neutral-800 px-2.5 py-1.5 rounded text-[11px] text-neutral-300 font-mono select-all focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-2.5 py-1.5 rounded bg-white text-black hover:bg-neutral-200 text-xs font-bold flex items-center gap-1 transition-all shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-between font-mono text-xs">
            <span className="text-[10px] text-neutral-500">
              Verified Co-Presence Telemetry
            </span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold border border-neutral-700 transition-all"
            >
              Dismiss
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
