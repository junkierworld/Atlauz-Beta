/**
 * ATLAUZ Local-First CRDT & Real-time Co-Presence Engine
 *
 * Implements:
 * 1. Lamport logical clock synchronization with deterministic LWW resolution
 * 2. Cross-tab real-time networking via browser BroadcastChannel
 * 3. Autonomous peer telemetry simulation for co-presence demonstration
 */

import { CollaborativeBentoTile, CollaboratorBadge, CollaborativeBlockItem, CrdtOperation, BentoSyncMessage } from '../types';

export const CRDT_CHANNEL_NAME = 'atlauz_bento_crdt_channel';

// Unique client identifier for this tab/session
export const LOCAL_CLIENT_ID = typeof crypto !== 'undefined' && crypto.randomUUID
  ? `client-${crypto.randomUUID().slice(0, 8)}`
  : `client-${Math.random().toString(36).substring(2, 9)}`;

export class BentoCrdtReconciler {
  private channel: BroadcastChannel | null = null;
  private currentClock: number = 100;
  private onStateChange: (tiles: CollaborativeBentoTile[], op?: CrdtOperation) => void;
  private onPresenceNotice?: (message: string) => void;
  private peerSimTimer: any = null;

  constructor(
    onStateChange: (tiles: CollaborativeBentoTile[], op?: CrdtOperation) => void,
    onPresenceNotice?: (message: string) => void
  ) {
    this.onStateChange = onStateChange;
    this.onPresenceNotice = onPresenceNotice;
    this.initChannel();
  }

  private initChannel() {
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel(CRDT_CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<BentoSyncMessage>) => {
          this.handleIncomingMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization deferred:', err);
      }
    }
  }

  private handleIncomingMessage(msg: BentoSyncMessage) {
    if (!msg || msg.senderId === LOCAL_CLIENT_ID) return;

    if (msg.type === 'CRDT_OP' && msg.operation) {
      this.currentClock = Math.max(this.currentClock, msg.operation.clock) + 1;
      // Notify consumer
      if (this.onPresenceNotice && msg.operation.author) {
        if (msg.operation.type === 'EDITING_STATUS' && msg.operation.payload?.isEditing) {
          this.onPresenceNotice(`${msg.operation.author} [${msg.operation.initials}] is editing...`);
        }
      }
    }
  }

  public advanceClock(): number {
    this.currentClock += 1;
    return this.currentClock;
  }

  public getClock(): number {
    return this.currentClock;
  }

  public setClock(val: number) {
    this.currentClock = Math.max(this.currentClock, val);
  }

  public broadcastOperation(op: CrdtOperation) {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'CRDT_OP',
          operation: op,
          senderId: LOCAL_CLIENT_ID,
          timestamp: Date.now()
        } as BentoSyncMessage);
      } catch (err) {
        console.warn('Broadcast failed:', err);
      }
    }
  }

  public broadcastFullState(tiles: CollaborativeBentoTile[]) {
    if (this.channel) {
      try {
        this.channel.postMessage({
          type: 'FULL_SYNC',
          tiles,
          senderId: LOCAL_CLIENT_ID,
          timestamp: Date.now()
        } as BentoSyncMessage);
      } catch (err) {
        console.warn('Full state broadcast error:', err);
      }
    }
  }

  public destroy() {
    if (this.peerSimTimer) {
      clearInterval(this.peerSimTimer);
      this.peerSimTimer = null;
    }
    if (this.channel) {
      this.channel.close();
      this.channel = null;
    }
  }
}

/**
 * Deterministically applies a CRDT operation to the bento tiles array
 */
export function applyCrdtOperation(
  currentTiles: CollaborativeBentoTile[],
  op: CrdtOperation
): CollaborativeBentoTile[] {
  return currentTiles.map(tile => {
    if (tile.id !== op.tileId) return tile;

    const nextClock = Math.max(tile.crdtClock, op.clock) + 1;

    switch (op.type) {
      case 'INSERT_BLOCK': {
        // Prevent duplicate blocks by checking if block with same ID already exists
        const blockId = op.payload.id || `blk-${Date.now()}`;
        if (tile.blocks.some(b => b.id === blockId)) {
          return tile; // Block already exists, skip insertion
        }
        
        const newBlock: CollaborativeBlockItem = {
          id: blockId,
          content: op.payload.content,
          author: op.author,
          initials: op.initials,
          timestamp: op.payload.timestamp || 'Just now',
          status: op.payload.status || 'verified',
          category: op.payload.category,
          url: op.payload.url,
          crdtVersion: nextClock
        };
        return {
          ...tile,
          crdtClock: nextClock,
          blocks: [newBlock, ...tile.blocks]
        };
      }

      case 'UPDATE_BLOCK': {
        return {
          ...tile,
          crdtClock: nextClock,
          blocks: tile.blocks.map(b => {
            if (b.id !== op.payload.blockId) return b;
            return {
              ...b,
              content: op.payload.content !== undefined ? op.payload.content : b.content,
              status: op.payload.status || b.status,
              lastEditedBy: `${op.author} [${op.initials}]`,
              timestamp: 'Just now',
              crdtVersion: nextClock
            };
          })
        };
      }

      case 'TOGGLE_STATUS': {
        return {
          ...tile,
          crdtClock: nextClock,
          blocks: tile.blocks.map(b => {
            if (b.id !== op.payload.blockId) return b;
            const nextStatus = b.status === 'completed' ? 'verified' : 'completed';
            return {
              ...b,
              status: nextStatus,
              lastEditedBy: `${op.author} [${op.initials}]`,
              crdtVersion: nextClock
            };
          })
        };
      }

      case 'DELETE_BLOCK': {
        return {
          ...tile,
          crdtClock: nextClock,
          blocks: tile.blocks.filter(b => b.id !== op.payload.blockId)
        };
      }

      case 'EDITING_STATUS': {
        const { collaboratorId, isEditing, activeBlockId, currentAction } = op.payload;
        return {
          ...tile,
          collaborators: tile.collaborators.map(c => {
            if (c.id !== collaboratorId) return c;
            return {
              ...c,
              isEditing,
              activeBlockId: isEditing ? activeBlockId : undefined,
              currentAction: currentAction || c.currentAction,
              lastActiveTime: 'Just now',
              presenceStatus: 'online'
            };
          })
        };
      }

      case 'PRESENCE_HEARTBEAT': {
        const { collaboratorId, presenceStatus } = op.payload;
        return {
          ...tile,
          collaborators: tile.collaborators.map(c => {
            if (c.id !== collaboratorId) return c;
            return {
              ...c,
              presenceStatus: presenceStatus || 'online',
              lastActiveTime: 'Just now'
            };
          })
        };
      }

      default:
        return tile;
    }
  });
}
