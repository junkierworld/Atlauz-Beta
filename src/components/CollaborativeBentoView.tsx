import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Share2,
  Users,
  Lock,
  Unlock,
  Copy,
  Plus,
  Check,
  CheckCircle2,
  Clock,
  Sparkles,
  Link,
  Edit3,
  Trash2,
  Shield,
  Layers,
  FileText,
  CornerDownLeft,
  Eye,
  Sliders,
  RefreshCw,
  ExternalLink,
  Square,
  Activity,
  UserCheck,
  MessageSquare,
  Radio
} from 'lucide-react';
import {
  CollaborativeBentoTile,
  CollaboratorBadge,
  CollaborativeBlockItem,
  CrdtOperation,
  BentoSyncMessage
} from '../types';
import {
  BentoCrdtReconciler,
  applyCrdtOperation,
  LOCAL_CLIENT_ID
} from '../utils/crdtEngine';
import { CollaboratorPopover } from './CollaboratorPopover';

interface CollaborativeBentoViewProps {
  tiles: CollaborativeBentoTile[];
  onUpdateTiles: (tiles: CollaborativeBentoTile[]) => void;
  onShowToast: (msg: string) => void;
  isDistractionFree?: boolean;
  isDark?: boolean;
}

export const CollaborativeBentoView: React.FC<CollaborativeBentoViewProps> = ({
  tiles,
  onUpdateTiles,
  onShowToast,
  isDistractionFree = false,
  isDark = true
}) => {
  const [activeTileId, setActiveTileId] = useState<string>(tiles[0]?.id || 'collab-bento-1');
  const [defrostedTileIds, setDefrostedTileIds] = useState<{ [id: string]: boolean }>({
    'collab-bento-1': true,
    'collab-bento-2': true,
    'collab-bento-3': true
  });

  // Active popover state
  const [selectedCollaborator, setSelectedCollaborator] = useState<{
    collaborator: CollaboratorBadge;
    tileTitle: string;
    shareToken: string;
  } | null>(null);

  // Share Token Modal
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [selectedTileForShare, setSelectedTileForShare] = useState<CollaborativeBentoTile | null>(null);

  // New Block / Task / Link drafts
  const [draftInputs, setDraftInputs] = useState<{ [tileId: string]: string }>({});
  const [draftCategory, setDraftCategory] = useState<string>('Paper');

  // Peer simulation state
  const [isSimulatingLiveEdit, setIsSimulatingLiveEdit] = useState<boolean>(false);
  const [isAutoSimActive, setIsAutoSimActive] = useState<boolean>(true);
  const [activePeerNotification, setActivePeerNotification] = useState<string | null>(null);

  // Editing state for inline block modification
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [editingBlockText, setEditingBlockText] = useState<string>('');

  const tilesRef = useRef<CollaborativeBentoTile[]>(tiles);
  tilesRef.current = tiles;

  // CRDT Engine instance
  const reconcilerRef = useRef<BentoCrdtReconciler | null>(null);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    // Initialize CRDT reconciler — reconciler handles its own BroadcastChannel internally
    const reconciler = new BentoCrdtReconciler(
      (newTiles, op) => {
        if (op) {
          const reconciled = applyCrdtOperation(tilesRef.current, op);
          onUpdateTiles(reconciled);
        }
      },
      presenceMsg => {
        setActivePeerNotification(presenceMsg);
        setTimeout(() => setActivePeerNotification(null), 3000);
      }
    );
    reconcilerRef.current = reconciler;

    return () => {
      reconciler.destroy();
    };
  }, []);

  // Periodic autonomous peer simulation (subtle, realistic co-presence)
  useEffect(() => {
    if (!isAutoSimActive) return;

    const timeouts: NodeJS.Timeout[] = [];

    const interval = setInterval(() => {
      // Pick random simulated peer activity
      const actions = [
        {
          tileId: 'collab-bento-1',
          collaboratorId: 'u-1',
          author: 'Dr. Sarah Lin',
          initials: 'LK',
          action: 'Refining salinity coefficient in Eq. 4.2',
          blockId: 'blk-2'
        },
        {
          tileId: 'collab-bento-2',
          collaboratorId: 'u-4',
          author: 'Marcus Chen',
          initials: 'MC',
          action: 'Simulating tactile resonant impulse at 240Hz',
          blockId: 'note-blk-2'
        },
        {
          tileId: 'collab-bento-1',
          collaboratorId: 'u-2',
          author: 'R. Adams',
          initials: 'RA',
          action: 'Reviewing piezoceramic hydrophone response curve',
          blockId: 'blk-1'
        }
      ];

      const chosen = actions[Math.floor(Math.random() * actions.length)];

      // 1. Mark peer as actively editing
      const editOp: CrdtOperation = {
        opId: `op-${Date.now()}-edit`,
        tileId: chosen.tileId,
        type: 'EDITING_STATUS',
        clock: (tilesRef.current.find(t => t.id === chosen.tileId)?.crdtClock || 100) + 1,
        clientId: `peer-${chosen.collaboratorId}`,
        author: chosen.author,
        initials: chosen.initials,
        payload: {
          collaboratorId: chosen.collaboratorId,
          isEditing: true,
          activeBlockId: chosen.blockId,
          currentAction: chosen.action
        },
        timestamp: Date.now()
      };

      const withEditing = applyCrdtOperation(tilesRef.current, editOp);
      onUpdateTiles(withEditing);
      reconcilerRef.current?.broadcastOperation(editOp);

      // 2. Clear editing status after 2.5 seconds — track and cleanup timeout
      const idleTimeout = setTimeout(() => {
        const idleOp: CrdtOperation = {
          opId: `op-${Date.now()}-idle`,
          tileId: chosen.tileId,
          type: 'EDITING_STATUS',
          clock: (tilesRef.current.find(t => t.id === chosen.tileId)?.crdtClock || 100) + 1,
          clientId: `peer-${chosen.collaboratorId}`,
          author: chosen.author,
          initials: chosen.initials,
          payload: {
            collaboratorId: chosen.collaboratorId,
            isEditing: false,
            currentAction: 'Idle in synchronized canvas'
          },
          timestamp: Date.now()
        };
        const withIdle = applyCrdtOperation(tilesRef.current, idleOp);
        onUpdateTiles(withIdle);
        reconcilerRef.current?.broadcastOperation(idleOp);
        timeouts.splice(timeouts.indexOf(idleTimeout), 1);
      }, 2500);
      timeouts.push(idleTimeout);
    }, 12000);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [isAutoSimActive, onUpdateTiles]);

  // Toggle Defrost State
  const handleToggleDefrost = (tileId: string) => {
    setDefrostedTileIds(prev => ({
      ...prev,
      [tileId]: !prev[tileId]
    }));
    const nextState = !defrostedTileIds[tileId];
    onShowToast(nextState ? 'Tile Defrosted into 0px Sharp Clarity' : 'Tile Resting in 30px Frosted Blur');
  };

  // Dispatch Local CRDT Operation
  const dispatchLocalOperation = (
    tileId: string,
    type: CrdtOperation['type'],
    payload: any
  ) => {
    const tile = tiles.find(t => t.id === tileId);
    const clock = (tile?.crdtClock || 100) + 1;

    const op: CrdtOperation = {
      opId: `op-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      tileId,
      type,
      clock,
      clientId: LOCAL_CLIENT_ID,
      author: 'You',
      initials: 'YOU',
      payload,
      timestamp: Date.now()
    };

    const nextTiles = applyCrdtOperation(tiles, op);
    onUpdateTiles(nextTiles);
    reconcilerRef.current?.broadcastOperation(op);
  };

  // Add block / task / reference to active tile
  const handleAddBlock = (tile: CollaborativeBentoTile, e: React.FormEvent) => {
    e.preventDefault();
    const content = (draftInputs[tile.id] || '').trim();
    if (!content) return;

    if (tile.type === 'task_board') {
      dispatchLocalOperation(tile.id, 'INSERT_BLOCK', {
        id: `blk-${Date.now()}`,
        content,
        status: 'verified',
        timestamp: 'Just now'
      });
      onShowToast(`Task appended & synchronized (Clock v${tile.crdtClock + 1})`);
    } else if (tile.type === 'link_vault') {
      const isUrl = content.startsWith('http://') || content.startsWith('https://');
      const url = isUrl ? content : `https://${content}`;
      dispatchLocalOperation(tile.id, 'INSERT_BLOCK', {
        id: `link-${Date.now()}`,
        content,
        url,
        category: draftCategory,
        status: 'verified',
        timestamp: 'Just now'
      });
      onShowToast(`Reference URL cataloged into vault`);
    } else {
      // note_canvas
      dispatchLocalOperation(tile.id, 'INSERT_BLOCK', {
        id: `note-${Date.now()}`,
        content,
        status: 'verified',
        timestamp: 'Just now'
      });
      onShowToast(`Note block appended to canvas`);
    }

    setDraftInputs(prev => ({ ...prev, [tile.id]: '' }));
  };

  // Toggle task status
  const handleToggleTask = (tileId: string, blockId: string) => {
    dispatchLocalOperation(tileId, 'TOGGLE_STATUS', { blockId });
    onShowToast('Task status updated across CRDT nodes');
  };

  // Delete block
  const handleDeleteBlock = (tileId: string, blockId: string) => {
    dispatchLocalOperation(tileId, 'DELETE_BLOCK', { blockId });
    onShowToast('Block reconciled and removed from ledger');
  };

  // Inline edit block commit
  const handleSaveBlockEdit = (tileId: string, blockId: string) => {
    if (!editingBlockText.trim()) {
      setEditingBlockId(null);
      return;
    }
    dispatchLocalOperation(tileId, 'UPDATE_BLOCK', {
      blockId,
      content: editingBlockText.trim()
    });
    setEditingBlockId(null);
    setEditingBlockText('');
    onShowToast('Block update broadcast to peers');
  };

  // Manual Trigger for Peer Simulation
  const handleSimulatePeerActivity = () => {
    setIsSimulatingLiveEdit(true);
    onShowToast('Peer Dr. Sarah Lin [LK •] initiating block modification...');

    // 1. Mark Dr. Lin as actively editing block 2 in task board
    const editOp: CrdtOperation = {
      opId: `op-${Date.now()}-sim-edit`,
      tileId: 'collab-bento-1',
      type: 'EDITING_STATUS',
      clock: (tiles.find(t => t.id === 'collab-bento-1')?.crdtClock || 100) + 1,
      clientId: 'peer-u-1',
      author: 'Dr. Sarah Lin',
      initials: 'LK',
      payload: {
        collaboratorId: 'u-1',
        isEditing: true,
        activeBlockId: 'blk-2',
        currentAction: 'Refining salinity alpha constant: 0.048 dB/km'
      },
      timestamp: Date.now()
    };
    const intermediateTiles = applyCrdtOperation(tiles, editOp);
    onUpdateTiles(intermediateTiles);
    reconcilerRef.current?.broadcastOperation(editOp);

    // 2. After 1.8 seconds, Dr. Lin commits the reconciled block
    setTimeout(() => {
      const commitOp: CrdtOperation = {
        opId: `op-${Date.now()}-sim-commit`,
        tileId: 'collab-bento-1',
        type: 'UPDATE_BLOCK',
        clock: (tiles.find(t => t.id === 'collab-bento-1')?.crdtClock || 100) + 2,
        clientId: 'peer-u-1',
        author: 'Dr. Sarah Lin',
        initials: 'LK',
        payload: {
          blockId: 'blk-2',
          content: 'Incorporate seawater salinity attenuation alpha coefficient (α = 0.048 dB/km verified)',
          status: 'verified'
        },
        timestamp: Date.now()
      };

      const finalTiles = applyCrdtOperation(intermediateTiles, commitOp);

      // Release editing lock
      const idleOp: CrdtOperation = {
        opId: `op-${Date.now()}-sim-idle`,
        tileId: 'collab-bento-1',
        type: 'EDITING_STATUS',
        clock: commitOp.clock + 1,
        clientId: 'peer-u-1',
        author: 'Dr. Sarah Lin',
        initials: 'LK',
        payload: {
          collaboratorId: 'u-1',
          isEditing: false,
          currentAction: 'Idle in Hadal Task Board'
        },
        timestamp: Date.now()
      };

      const fullyReconciled = applyCrdtOperation(finalTiles, idleOp);
      onUpdateTiles(fullyReconciled);
      reconcilerRef.current?.broadcastOperation(commitOp);
      reconcilerRef.current?.broadcastOperation(idleOp);

      setIsSimulatingLiveEdit(false);
      onShowToast('✓ CRDT Reconciliation complete: Dr. Sarah Lin [LK] edit verified');
    }, 2000);
  };

  const handleOpenShare = (tile: CollaborativeBentoTile) => {
    setSelectedTileForShare(tile);
    setIsShareModalOpen(true);
  };

  const handleCopyShareLink = (token: string) => {
    const link = `${window.location.origin}/#bento-collab=${token}`;
    navigator.clipboard?.writeText(link);
    onShowToast('Cryptographic sharing token link copied to clipboard');
  };

  const handleUpdateAccessLevel = (newAccess: 'read-only' | 'commenter' | 'co-editor') => {
    if (!selectedTileForShare) return;
    const updated = tiles.map(t =>
      t.id === selectedTileForShare.id ? { ...t, accessLevel: newAccess, isShared: true } : t
    );
    onUpdateTiles(updated);
    setSelectedTileForShare(prev => (prev ? { ...prev, accessLevel: newAccess, isShared: true } : null));
    onShowToast(`Sharing permissions updated to [${newAccess.toUpperCase()}]`);
  };

  const activeTile = tiles.find(t => t.id === activeTileId) || tiles[0];

  return (
    <div className="w-full space-y-4 font-sans select-none animate-fade-in">
      {/* Top Header & Telemetry Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-neutral-900 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-neutral-800 border border-neutral-700 text-white shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight font-mono">
                Collaborative Bento Workspaces
              </h2>
              <span className="font-mono text-[9px] px-1.5 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-700 font-bold uppercase">
                CRDT CO-PRESENCE
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-2">
              <span>Local-first peer canvas sync via BroadcastChannel & Lamport clocks.</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline font-mono text-[10px] text-neutral-500">
                LWW Conflict-Free Resolution
              </span>
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2 font-mono text-xs">
          {/* Peer Activity Notification Pulse */}
          {activePeerNotification && (
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] animate-pulse ${
              isDark
                ? 'bg-neutral-950 border-neutral-700 text-white'
                : 'bg-neutral-100 border-neutral-400 text-neutral-900'
            }`}>
              <Activity className={`w-3 h-3 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
              <span>{activePeerNotification}</span>
            </div>
          )}

          {/* BroadcastChannel status pill */}
          <div className={`hidden sm:flex items-center gap-1.5 px-2 py-1 rounded border text-[10px] ${
            isDark
              ? 'bg-neutral-950 border-neutral-800 text-neutral-400'
              : 'bg-neutral-100 border-neutral-400 text-neutral-600'
          }`}>
            <Radio className={`w-3 h-3 animate-pulse ${isDark ? 'text-white' : 'text-neutral-900'}`} />
            <span>BROADCAST READY</span>
          </div>

          {/* Trigger Peer Simulation Button */}
          <button
            onClick={handleSimulatePeerActivity}
            disabled={isSimulatingLiveEdit}
            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 transition-all ${
              isSimulatingLiveEdit
                ? isDark
                  ? 'bg-neutral-800 text-neutral-500 border-neutral-700'
                  : 'bg-neutral-200 text-neutral-500 border-neutral-400'
                : isDark
                ? 'bg-neutral-950 hover:bg-neutral-800 text-white border-neutral-700 hover:border-white'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border-neutral-400 hover:border-neutral-600'
            }`}
            title="Simulate incoming peer block update and activity telemetry"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulatingLiveEdit ? 'animate-spin' : ''}`} />
            <span>Simulate Peer Edit</span>
          </button>

          {/* Share Token Button */}
          <button
            onClick={() => handleOpenShare(activeTile)}
            className={`px-3.5 py-1.5 rounded font-bold flex items-center gap-1.5 hover:scale-105 transition-all border ${
              isDark
                ? 'bg-white text-black hover:bg-neutral-200 border-white'
                : 'bg-neutral-900 text-white hover:bg-neutral-800 border-neutral-900'
            }`}
          >
            <Share2 className={`w-3.5 h-3.5 ${isDark ? 'text-black' : 'text-white'}`} />
            <span>Share Token</span>
          </button>
        </div>
      </div>

      {/* Bento Grid: 3 Interactive Collaborative Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {tiles.map(tile => {
          const isDefrosted = defrostedTileIds[tile.id] ?? false;
          const isSelected = activeTile.id === tile.id;
          const draftVal = draftInputs[tile.id] || '';

          return (
            <motion.div
              key={tile.id}
              layout
              onDoubleClick={() => handleToggleDefrost(tile.id)}
              onClick={() => setActiveTileId(tile.id)}
              className={`rounded-lg p-4 transition-all duration-300 relative flex flex-col justify-between cursor-pointer ${
                tile.type === 'task_board'
                  ? 'lg:col-span-7 min-h-[440px]'
                  : tile.type === 'note_canvas'
                  ? 'lg:col-span-5 min-h-[440px]'
                  : 'lg:col-span-12 min-h-[300px]'
              } ${
                isDefrosted
                  ? isDark
                    ? 'bg-neutral-900 border border-neutral-700 shadow-xl'
                    : 'bg-neutral-50 border border-neutral-300 shadow-lg'
                  : isDark
                  ? 'bg-neutral-900/60 backdrop-blur-xl border border-neutral-800'
                  : 'bg-neutral-100/60 backdrop-blur-xl border border-neutral-300'
              } ${isSelected ? isDark ? 'ring-1 ring-white/60' : 'ring-1 ring-neutral-900/60' : ''}`}
            >
              <div>
                {/* Tile Top Boundary: Minimalist Collaborator Badges & Telemetry */}
                <div className={`flex items-center justify-between pb-2.5 mb-3 border-b font-mono text-xs ${
                  isDark
                    ? 'border-neutral-800 text-neutral-400'
                    : 'border-neutral-300 text-neutral-600'
                }`}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-[10px] uppercase font-bold ${
                      isDark ? 'text-neutral-400' : 'text-neutral-600'
                    }`}>
                      [{tile.type.replace('_', ' ')}]
                    </span>
                    <h3 className={`font-bold text-sm truncate font-mono ${
                      isDark ? 'text-white' : 'text-neutral-900'
                    }`}>
                      {tile.title}
                    </h3>
                  </div>

                  {/* CO-PRESENCE FUNCTIONAL TELEMETRY BADGES */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Local User Badge */}
                    <div
                      className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold flex items-center gap-1 ${
                        isDark
                          ? 'bg-white text-black'
                          : 'bg-neutral-900 text-white'
                      }`}
                      title="You (Local Client Author) • Active"
                    >
                      <span>[YOU]</span>
                    </div>

                    {/* Remote Peer Collaborator Badges */}
                    {tile.collaborators.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setSelectedCollaborator({
                            collaborator: c,
                            tileTitle: tile.title,
                            shareToken: tile.shareToken
                          });
                        }}
                        className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-mono font-bold transition-all group ${
                          c.isEditing
                            ? isDark
                              ? 'bg-white text-black border-white ring-2 ring-white/30'
                              : 'bg-neutral-900 text-white border-neutral-900 ring-2 ring-neutral-900/30'
                            : isDark
                            ? 'bg-neutral-950 border-neutral-700 text-neutral-300 hover:border-white hover:text-white'
                            : 'bg-neutral-100 border-neutral-400 text-neutral-700 hover:border-neutral-600 hover:text-neutral-900'
                        }`}
                        title={`Click to inspect ${c.name} co-presence details & active block telemetry`}
                      >
                        <span>[{c.initials}]</span>

                        {/* Real-time high-contrast solid activity dot indicator */}
                        {c.isEditing && (
                          <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                            isDark ? 'bg-black' : 'bg-white'
                          }`} />
                        )}
                      </button>
                    ))}

                    {/* Share Access Pill */}
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleOpenShare(tile);
                      }}
                      className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1 ml-1 transition-colors ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-700 hover:border-white text-neutral-300 hover:text-white'
                          : 'bg-neutral-100 border-neutral-400 hover:border-neutral-600 text-neutral-700 hover:text-neutral-900'
                      }`}
                    >
                      {tile.isShared ? <Unlock className="w-2.5 h-2.5" /> : <Lock className="w-2.5 h-2.5" />}
                      <span className="uppercase">{tile.accessLevel}</span>
                    </button>
                  </div>
                </div>

                {/* ========================================================= */}
                {/* MODULE 1: SHARED PROJECT TASK BOARD */}
                {/* ========================================================= */}
                {tile.type === 'task_board' && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 px-1">
                      <span>Shared Sprint Milestones ({tile.blocks.length})</span>
                      <span className="text-[10px] text-neutral-500">Tap checkbox to verify</span>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                      {tile.blocks.map(block => {
                        const isTaskCompleted = block.status === 'completed';
                        const isBeingEdited = block.status === 'editing';

                        return (
                          <div
                            key={block.id}
                            className={`p-2.5 rounded border transition-all flex items-start justify-between gap-3 group ${
                              isBeingEdited
                                ? isDark
                                  ? 'border-white bg-neutral-900/80 ring-1 ring-white/20'
                                  : 'border-neutral-900 bg-neutral-100/80 ring-1 ring-neutral-900/20'
                                : isDark
                                ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                                : 'bg-neutral-100 border-neutral-400 hover:border-neutral-500'
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0 flex-1">
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleToggleTask(tile.id, block.id);
                                }}
                                className="mt-0.5 p-0.5 rounded text-neutral-400 hover:text-white shrink-0"
                              >
                                {isTaskCompleted ? (
                                  <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : (
                                  <Square className="w-4 h-4 text-neutral-500 hover:text-neutral-300" />
                                )}
                              </button>

                              <div className="space-y-1 min-w-0 flex-1">
                                <div className="flex items-center gap-2 text-[10px] text-neutral-500 font-mono">
                                  <span className="text-white font-bold">[{block.initials}]</span>
                                  <span>{block.author}</span>
                                  <span>•</span>
                                  <span>{block.timestamp}</span>
                                  {block.crdtVersion && (
                                    <span className="text-[9px] text-neutral-600">
                                      v{block.crdtVersion}
                                    </span>
                                  )}
                                </div>
                                <p
                                  className={`text-xs font-sans leading-relaxed ${
                                    isTaskCompleted
                                      ? 'line-through text-neutral-500'
                                      : 'text-neutral-200'
                                  }`}
                                >
                                  {block.content}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {block.status && (
                                <span
                                  className={`text-[9px] font-mono px-1.5 py-0.2 rounded border uppercase ${
                                    isBeingEdited
                                      ? 'bg-white text-black border-white font-bold'
                                      : isTaskCompleted
                                      ? 'bg-neutral-900 text-neutral-400 border-neutral-700'
                                      : 'bg-neutral-900 text-neutral-300 border-neutral-700'
                                  }`}
                                >
                                  {block.status}
                                </span>
                              )}

                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteBlock(tile.id, block.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-white transition-opacity"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* MODULE 2: COLLABORATIVE NOTE CANVAS */}
                {/* ========================================================= */}
                {tile.type === 'note_canvas' && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 px-1">
                      <span>Live Note Canvas Blocks ({tile.blocks.length})</span>
                      <span className="text-[10px] text-neutral-500">Double-click block to edit</span>
                    </div>

                    <div className="space-y-2 max-h-[250px] overflow-y-auto no-scrollbar pr-1">
                      {tile.blocks.map(block => {
                        const isBeingEdited = block.status === 'editing';
                        const isInlineEditingThis = editingBlockId === block.id;

                        return (
                          <div
                            key={block.id}
                            onDoubleClick={e => {
                              e.stopPropagation();
                              setEditingBlockId(block.id);
                              setEditingBlockText(block.content);
                            }}
                            className={`p-2.5 rounded border transition-all flex flex-col gap-2 group ${
                              isBeingEdited
                                ? isDark
                                  ? 'border-white bg-neutral-900 ring-1 ring-white/30'
                                  : 'border-neutral-900 bg-neutral-100 ring-1 ring-neutral-900/30'
                                : isDark
                                ? 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                                : 'bg-neutral-100 border-neutral-400 hover:border-neutral-500'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                              <div className="flex items-center gap-1.5">
                                <span className="text-white font-bold">[{block.initials}]</span>
                                <span>{block.author}</span>
                                <span>•</span>
                                <span>{block.timestamp}</span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {isBeingEdited && (
                                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-white text-black font-bold uppercase animate-pulse">
                                    PEER EDITING
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    setEditingBlockId(block.id);
                                    setEditingBlockText(block.content);
                                  }}
                                  className="p-1 text-neutral-400 hover:text-white"
                                  title="Edit Block"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={e => {
                                    e.stopPropagation();
                                    handleDeleteBlock(tile.id, block.id);
                                  }}
                                  className="p-1 text-neutral-500 hover:text-white"
                                  title="Delete Block"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {isInlineEditingThis ? (
                              <div
                                onClick={e => e.stopPropagation()}
                                className="space-y-2 pt-1"
                              >
                                <textarea
                                  value={editingBlockText}
                                  onChange={e => setEditingBlockText(e.target.value)}
                                  className="w-full bg-neutral-900 border border-neutral-700 rounded p-2 text-xs text-white font-mono outline-none focus:border-white resize-none h-16"
                                />
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setEditingBlockId(null)}
                                    className="px-2 py-1 rounded bg-neutral-800 text-neutral-400 hover:text-white text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSaveBlockEdit(tile.id, block.id)}
                                    className="px-2 py-1 rounded bg-white text-black font-bold text-[10px]"
                                  >
                                    Save CRDT Block
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-neutral-200 font-sans leading-relaxed">
                                {block.content}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ========================================================= */}
                {/* MODULE 3: REFERENCE & LINK VAULT */}
                {/* ========================================================= */}
                {tile.type === 'link_vault' && (
                  <div className="space-y-2 font-mono text-xs">
                    <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1 px-1">
                      <span>Shared Bibliographic Sources & Repositories ({tile.blocks.length})</span>
                      <span className="text-[10px] text-neutral-500">Clickout opens external source</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                      {tile.blocks.map(block => (
                        <div
                          key={block.id}
                          className={`p-3 rounded border hover:border-neutral-600 transition-all flex flex-col justify-between gap-2 group ${
                            isDark
                              ? 'bg-neutral-950 border-neutral-800'
                              : 'bg-neutral-100 border-neutral-400'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-neutral-500">
                              <span className="text-white font-bold">[{block.initials}] {block.author}</span>
                              <span className="px-1.5 py-0.2 rounded bg-neutral-900 border border-neutral-700 text-neutral-300 uppercase text-[9px]">
                                {block.category || 'Source'}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-200 font-sans line-clamp-2">
                              {block.content}
                            </p>
                          </div>

                          <div className="flex items-center justify-between pt-1 border-t border-neutral-800/80 text-[10px]">
                            <span className="text-neutral-500">{block.timestamp}</span>
                            <div className="flex items-center gap-2">
                              {block.url && (
                                <a
                                  href={block.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className="text-white hover:underline flex items-center gap-1 font-bold"
                                >
                                  <span>Open</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDeleteBlock(tile.id, block.id);
                                }}
                                className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-white transition-opacity"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Quick-Action Input Strip */}
              <div className="mt-3 pt-3 border-t border-neutral-800">
                <form
                  onSubmit={e => handleAddBlock(tile, e)}
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-2"
                >
                  {tile.type === 'link_vault' && (
                    <select
                      value={draftCategory}
                      onChange={e => setDraftCategory(e.target.value)}
                      className={`border rounded px-2 py-1.5 text-xs font-mono outline-none ${
                        isDark
                          ? 'bg-neutral-950 border-neutral-800 text-white'
                          : 'bg-neutral-100 border-neutral-400 text-neutral-900'
                      }`}
                    >
                      <option value="Paper">Paper</option>
                      <option value="Repository">Repository</option>
                      <option value="Dataset">Dataset</option>
                      <option value="Documentation">Docs</option>
                    </select>
                  )}

                  <input
                    type="text"
                    value={draftVal}
                    onChange={e =>
                      setDraftInputs(prev => ({
                        ...prev,
                        [tile.id]: e.target.value
                      }))
                    }
                    placeholder={
                      tile.type === 'task_board'
                        ? 'Append new task block...'
                        : tile.type === 'link_vault'
                        ? 'Paste source URL or ArXiv link...'
                        : 'Append new note thought block...'
                    }
                    className={`flex-1 border rounded px-2.5 py-1.5 text-xs font-mono outline-none focus:border-opacity-100 ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800 text-white placeholder-neutral-500 focus:border-white'
                        : 'bg-neutral-100 border-neutral-400 text-neutral-900 placeholder-neutral-600 focus:border-neutral-600'
                    }`}
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-white text-black font-mono font-bold text-xs flex items-center gap-1 hover:bg-neutral-200 transition-all shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-black" />
                    <span>Append</span>
                  </button>
                </form>

                <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono mt-2">
                  <div className="flex items-center gap-2">
                    <span>CRDT Clock: v{tile.crdtClock}</span>
                    <span>•</span>
                    <span>{tile.blocks.length} Blocks Reconciled</span>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleToggleDefrost(tile.id);
                    }}
                    className="text-neutral-400 hover:text-white underline"
                  >
                    {isDefrosted ? 'Frost (30px)' : 'Defrost (0px)'}
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Collaborator Details Popover Modal */}
      {selectedCollaborator && (
        <CollaboratorPopover
          collaborator={selectedCollaborator.collaborator}
          tileTitle={selectedCollaborator.tileTitle}
          shareToken={selectedCollaborator.shareToken}
          onClose={() => setSelectedCollaborator(null)}
          onShowToast={onShowToast}
        />
      )}

      {/* Cryptographic Share Token Modal */}
      {isShareModalOpen && selectedTileForShare && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 font-sans bg-black/80 backdrop-blur-md`}>
          <div className={`w-full max-w-md rounded-lg p-5 shadow-2xl space-y-4 border ${
            isDark
              ? 'bg-neutral-900 border-neutral-700 text-white'
              : 'bg-neutral-50 border-neutral-300 text-neutral-900'
          }`}>
            <div className={`flex items-center justify-between pb-2 border-b ${
              isDark ? 'border-neutral-800' : 'border-neutral-300'
            }`}>
              <div className="flex items-center gap-2">
                <Share2 className={`w-4 h-4 ${isDark ? 'text-white' : 'text-neutral-900'}`} />
                <h3 className={`font-bold text-sm font-mono uppercase ${
                  isDark ? 'text-white' : 'text-neutral-900'
                }`}>
                  Glass Canvas Token Sharing
                </h3>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className={`font-mono text-xs ${
                  isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                [X]
              </button>
            </div>

            <div>
              <span className={`text-[11px] font-mono block mb-1 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Target Bento Module:
              </span>
              <div className={`p-2.5 rounded border font-mono text-xs ${
                isDark
                  ? 'bg-neutral-950 border-neutral-800 text-white'
                  : 'bg-neutral-100 border-neutral-300 text-neutral-900'
              }`}>
                {selectedTileForShare.title}
              </div>
            </div>

            {/* Permission Selector */}
            <div>
              <span className={`text-[11px] font-mono block mb-1.5 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Cryptographic Access Level:
              </span>
              <div className="grid grid-cols-3 gap-2 font-mono text-xs">
                {(['read-only', 'commenter', 'co-editor'] as const).map(access => (
                  <button
                    key={access}
                    type="button"
                    onClick={() => handleUpdateAccessLevel(access)}
                    className={`py-1.5 px-2 rounded border uppercase font-bold text-[10px] transition-all ${
                      selectedTileForShare.accessLevel === access
                        ? isDark
                          ? 'bg-white text-black border-white'
                          : 'bg-neutral-900 text-white border-neutral-900'
                        : isDark
                        ? 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-600'
                        : 'bg-neutral-100 text-neutral-700 border-neutral-300 hover:border-neutral-400'
                    }`}
                  >
                    {access}
                  </button>
                ))}
              </div>
            </div>

            {/* Token URL Display */}
            <div>
              <span className={`text-[11px] font-mono block mb-1 ${
                isDark ? 'text-neutral-400' : 'text-neutral-600'
              }`}>
                Secure Token URL:
              </span>
              <div className={`flex items-center gap-2 p-2 rounded border font-mono text-xs ${
                isDark
                  ? 'bg-neutral-950 border-neutral-800'
                  : 'bg-neutral-100 border-neutral-300'
              }`}>
                <input
                  readOnly
                  value={`${window.location.origin}/#bento-collab=${selectedTileForShare.shareToken}`}
                  className={`bg-transparent w-full outline-none select-all ${
                    isDark ? 'text-neutral-300' : 'text-neutral-700'
                  }`}
                />
                <button
                  onClick={() => handleCopyShareLink(selectedTileForShare.shareToken)}
                  className={`p-1 rounded shrink-0 transition-colors ${
                    isDark
                      ? 'bg-neutral-800 hover:bg-neutral-700 text-white'
                      : 'bg-neutral-200 hover:bg-neutral-300 text-neutral-900'
                  }`}
                  title="Copy Link"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Collaborators List */}
            <div>
              <span className="text-[11px] text-neutral-400 font-mono block mb-1.5">
                Connected Co-Presence Avatars:
              </span>
              <div className="space-y-1.5 font-mono text-xs">
                {selectedTileForShare.collaborators.map(c => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-2 rounded border ${
                      isDark
                        ? 'bg-neutral-950 border-neutral-800'
                        : 'bg-neutral-100 border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-white font-bold text-[10px]">
                        [{c.initials}]
                      </span>
                      <span>{c.name}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500">{c.lastActiveTime}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex justify-end">
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="px-4 py-1.5 rounded bg-white text-black font-mono font-bold text-xs hover:bg-neutral-200 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
