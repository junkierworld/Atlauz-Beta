# Implementation Plan: Shared Bento Module System with CRDT Synchronization & Real-time Co-Presence

This plan details the implementation of a peer-to-peer, local-first shared Bento module system using Conflict-Free Replicated Data Type (CRDT) mechanics, multi-tab `BroadcastChannel` network communication, realistic background peer simulation, and high-contrast co-presence indicators within the project workspace.

---

## 1. Architecture & Synchronization Engine

### 1.1 CRDT State Model & Deterministic Conflict Resolution
* **Logical Clocks & Lamport Ordering:**
  * Each Bento module tile maintains a monotonically increasing Lamport clock (`crdtClock`) and a persistent unique tile ID.
  * Every mutation (block insertion, content edit, deletion, or reordering) is encapsulated into an atomic CRDT operation tuple:
    ```typescript
    interface CrdtOperation {
      opId: string;
      tileId: string;
      type: 'INSERT_BLOCK' | 'UPDATE_BLOCK' | 'DELETE_BLOCK' | 'PRESENCE_HEARTBEAT' | 'TYPING_STATUS';
      clock: number;
      clientId: string;
      author: string;
      initials: string;
      payload: any;
      timestamp: number;
    }
    ```
  * **Conflict Reconciliation:** Deterministic Last-Write-Wins (LWW) resolver with clock + `clientId` tie-breaking to guarantee convergent state across all concurrent instances without data loss.

### 1.2 Dual-Transport Engine
* **Transport A: Browser `BroadcastChannel`**
  * Uses `new BroadcastChannel('atlauz_bento_crdt_channel')` to synchronize real-time updates across multiple open browser tabs or windows instantly.
  * Enables true multi-client testing in separate windows on the user's desktop.
* **Transport B: Autonomous Peer Simulation Engine**
  * Simulates active collaborator agents (e.g., `Dr. Sarah Lin [LK]`, `R. Adams [RA]`, `Marcus Chen [MC]`) who autonomously:
    * Emit heartbeats to update co-presence status (Online, Away, Offline).
    * Engage in typing/editing sessions with live pulsing dots on specific blocks.
    * Commit verified collaborative research blocks into shared Bento modules.

---

## 2. Collaborative Bento Modules in Project Workspaces

We will integrate three dedicated, high-contrast Bento modules into `WorkspaceView.tsx` (available in Bento layout mode and via direct collaborative workspace controls):

### 2.1 Module 1: Shared Project Task Board (`task_board`)
* Collaborative multi-stage task matrix with CRDT verification clocks.
* Tasks tagged with creator initials, assignee badge, status (`verified`, `editing`, `completed`), and timestamp.
* Interactive controls: 1-click status change, add new research task, and filter by collaborator.

### 2.2 Module 2: Collaborative Note Canvas (`note_canvas`)
* Multi-author block-based text notes with inline collaborator attribution.
* Real-time remote block-locking when a peer is currently typing (surfacing who is editing which block).
* Markdown formatting support for equations, bullet points, and code excerpts.

### 2.3 Module 3: Reference & Link Vault (`link_vault`)
* Shared repository for academic sources, ArXiv papers, and datasets.
* Real-time link parsing, citation metrics, and peer contributor badges.
* Quick-add URL input with automatic domain extraction and verification stamps.

---

## 3. Co-Presence & Telemetry Presentation

Following the user's preference for **high-contrast initials badges with pulsing activity dots and edit popovers**:

### 3.1 Typographic Badge Avatars
* Crisp black-and-white monospaced badges (`[LK]`, `[RA]`, `[MC]`, `[YOU]`) positioned along the top boundary of each shared tile.
* Distinctive styling:
  * **Local User:** Inverted solid black background with white text (`[YOU]`).
  * **Remote Active Collaborators:** Sharp 1px neutral border with pure white monospaced initials.
  * **Active Editing Signal:** Solid high-contrast white dot (`•`) with a subtle rhythmic pulse next to the initials when the collaborator is currently modifying a block.

### 3.2 Rich Collaborator Edit Popover
* Clicking or hovering any collaborator badge opens a geometric wireframe popover displaying:
  * Collaborator full name, academic affiliation, and avatar initials.
  * Real-time activity status (e.g., `"Active now • Editing Eq. 4.2 in Task Board"`).
  * Access level pill: `[CO-EDITOR]`, `[COMMENTER]`, or `[READ-ONLY]`.
  * Cryptographic token link generator for inviting additional research peers.
  * Activity history log of recent CRDT operations executed by this peer.

---

## 4. Implementation Steps & File Modifications

1. **`src/types.ts`:**
   * Extend `CollaborativeBentoTile` and `CollaboratorBadge` with CRDT metadata (`lamportClock`, `clientId`, `presenceStatus`, `currentFocusBlockId`, `lastKeystroke`).
   * Define `CrdtOperation` and `BentoSyncMessage` event types.

2. **`src/utils/crdtEngine.ts` (New Utility):**
   * Implement deterministic Lamport clock advancement.
   * Create `CrdtReconciler` class managing local ledger, operation queue, and broadcast messaging.
   * Provide hook `useCrdtBentoSync` with automatic cleanup, BroadcastChannel dispatch, and peer simulation loop.

3. **`src/components/CollaborativeBentoView.tsx`:**
   * Upgrade with full BroadcastChannel listener and real-time state synchronization.
   * Implement the high-contrast collaborator badge strip with pulsing dots and interactive popover.
   * Add interactive block editing, task completion, and link ingestion with instant broadcast.
   * Embed defrost/frost glassmorphism toggles (30px blur idle vs. 0px sharp active).

4. **`src/components/WorkspaceView.tsx`:**
   * Embed the live `CollaborativeBentoView` directly inside the Bento Grid layout mode and provide a quick-access toggle in the workspace control strip.
   * Sync active workspace project tasks with the collaborative Bento ledger.

5. **`src/components/CollaboratorPopover.tsx` (New Component):**
   * Accessible, high-contrast modal popover for inspecting peer presence, last active timestamp, active editing block, and cryptographic link sharing.

6. **Testing & Verification:**
   * Validate multi-window BroadcastChannel synchronization across two independent browser windows.
   * Verify peer simulation intervals (Dr. Sarah Lin and R. Adams making periodic collaborative contributions).
   * Run `compile_applet` and `lint_applet` to guarantee clean builds.
