import React, { useState, useEffect, useRef, useCallback, useMemo, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import { Wifi, WifiOff } from 'lucide-react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HubView } from './components/HubView';
import { LibraryView } from './components/LibraryView';
import { CompanionView } from './components/CompanionView';
import { WorkspaceView } from './components/WorkspaceView';
import { SidebarDrawer } from './components/SidebarDrawer';
import { LockScreen } from './components/LockScreen';
import { Toast, ToastItem } from './components/Toast';

// Lazy load resource editors and heavy modals
const GoogleDocsEditor = lazy(() => import('./components/GoogleDocsEditor').then(m => ({ default: m.GoogleDocsEditor })));
const PresentationEditor = lazy(() => import('./components/PresentationEditor').then(m => ({ default: m.PresentationEditor })));
const NotebookViewer = lazy(() => import('./components/NotebookViewer').then(m => ({ default: m.NotebookViewer })));
const EbookReader = lazy(() => import('./components/EbookReader').then(m => ({ default: m.EbookReader })));
const LessonViewer = lazy(() => import('./components/LessonViewer').then(m => ({ default: m.LessonViewer })));
const NotepadViewer = lazy(() => import('./components/NotepadViewer').then(m => ({ default: m.NotepadViewer })));
const JournalViewer = lazy(() => import('./components/JournalViewer').then(m => ({ default: m.JournalViewer })));
const PdfViewer = lazy(() => import('./components/PdfViewer').then(m => ({ default: m.PdfViewer })));
const CreateResourceModal = lazy(() => import('./components/CreateResourceModal').then(m => ({ default: m.CreateResourceModal })));
const FishingReelModal = lazy(() => import('./components/FishingReelModal').then(m => ({ default: m.FishingReelModal })));
const ProfileView = lazy(() => import('./components/ProfileView').then(m => ({ default: m.ProfileView })));
import {
  initialCompanion,
  initialTelemetry,
  defaultProjects,
  initialSchedule,
  initialConnectedApps,
  initialSettings,
  initialResources,
  initialCollaborativeBentoTiles
} from './data';
import {
  CompanionState,
  FishCompanion,
  CognitiveTelemetry,
  ScheduleBlock,
  ConnectedApp,
  UserAccountSettings,
  ResourceItem,
  CollaborativeBentoTile
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'library' | 'workspace' | 'companion' | 'profile'>('hub');
  const [companion, setCompanion] = useState<CompanionState>(initialCompanion);
  const [telemetry, setTelemetry] = useState<CognitiveTelemetry>(initialTelemetry);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(initialSchedule);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>(initialConnectedApps);
  const [settings, setSettings] = useState<UserAccountSettings>(initialSettings);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [toastState, setToastState] = useState<ToastItem | string | null>(null);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  // Functional resource library states
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isFishingModalOpen, setIsFishingModalOpen] = useState<boolean>(false);

  // Collaborative Bento Workspaces state (CRDT & Co-Presence)
  const [collabTiles, setCollabTiles] = useState<CollaborativeBentoTile[]>(initialCollaborativeBentoTiles);

  // Swipe / Long-press detection for mobile gesture navigation
  const touchStartXRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  const showToast = useCallback((toastInput: string | ToastItem, onUndoCallback?: () => void) => {
    if (typeof toastInput === 'string') {
      setToastState(onUndoCallback ? { message: toastInput, onUndo: onUndoCallback } : toastInput);
    } else {
      setToastState(toastInput);
    }
    setTimeout(() => {
      setToastState(prev => (prev === toastInput ? null : prev));
    }, 3200);
  }, []);

  const handleToggleDistractionFree = useCallback((forceState?: boolean) => {
    setIsDistractionFree(prev => {
      const next = forceState !== undefined ? forceState : !prev;
      if (next) {
        setActiveTab('workspace');
      }
      return next;
    });
  }, []);

  // Keyboard shortcut Esc to exit distraction-free mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDistractionFree) {
        setIsDistractionFree(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDistractionFree]);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync learning style across browser tabs via BroadcastChannel
  useEffect(() => {
    if (typeof window === 'undefined' || !('BroadcastChannel' in window)) return;

    const channel = new BroadcastChannel('companion-settings');
    channel.onmessage = (event) => {
      if (event.data.type === 'LEARNING_STYLE_CHANGE' && event.data.learningStyle) {
        setCompanion(prev => ({ ...prev, learningStyle: event.data.learningStyle }));
      }
    };

    return () => channel.close();
  }, []);

  const handleUpdateCompanion = useCallback((updated: Partial<CompanionState>) => {
    setCompanion(prev => ({ ...prev, ...updated }));
    // Sync learning style to localStorage for cross-tab sync
    if (updated.learningStyle && typeof window !== 'undefined') {
      localStorage.setItem('companionLearningStyle', updated.learningStyle);
      // Broadcast to other tabs
      const channel = new BroadcastChannel('companion-settings');
      channel.postMessage({ type: 'LEARNING_STYLE_CHANGE', learningStyle: updated.learningStyle });
      channel.close();
    }
  }, []);

  const handleCatchNewFish = useCallback((newFish: FishCompanion) => {
    setTelemetry(prev => ({
      ...prev,
      streakDays: Math.max(0, prev.streakDays - 20)
    }));
    setCompanion(prev => {
      const existing = prev.fishes || [];
      if (existing.length >= 5) return prev;
      const nextFishes = [...existing, newFish];
      return {
        ...prev,
        fishes: nextFishes,
        primaryFishId: prev.primaryFishId || newFish.id,
        name: prev.name || newFish.name
      };
    });
  }, []);

  const handleRenameFish = useCallback((fishId: string, newName: string) => {
    setCompanion(prev => {
      const updatedFishes = (prev.fishes || []).map(f =>
        f.id === fishId ? { ...f, name: newName } : f
      );
      const isPrimary = prev.primaryFishId === fishId || prev.fishes?.length === 1;
      return {
        ...prev,
        fishes: updatedFishes,
        name: isPrimary ? newName : prev.name
      };
    });
  }, []);

  const handleSetPrimaryFish = useCallback((fishId: string) => {
    setCompanion(prev => {
      const target = prev.fishes?.find(f => f.id === fishId);
      const updatedFishes = (prev.fishes || []).map(f => ({
        ...f,
        isPrimary: f.id === fishId
      }));
      return {
        ...prev,
        primaryFishId: fishId,
        name: target?.name || prev.name,
        fishes: updatedFishes
      };
    });
  }, []);

  const handleAddBonusStreaks = useCallback((amount: number) => {
    setTelemetry(prev => ({
      ...prev,
      streakDays: prev.streakDays + amount
    }));
  }, []);

  const handleToggleStreakFreeze = useCallback(() => {
    setTelemetry(prev => ({
      ...prev,
      isStreakFrozen: !prev.isStreakFrozen
    }));
  }, []);

  const handleToggleAppConnection = useCallback((appId: string) => {
    setConnectedApps(prev =>
      prev.map(a =>
        a.id === appId
          ? {
              ...a,
              connected: !a.connected,
              statusText: !a.connected ? 'Connected via OAuth 2.0' : 'Disconnected'
            }
          : a
      )
    );
  }, []);

  const handleUpdateSettings = useCallback((updated: Partial<UserAccountSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  }, []);

  const handleToggleTheme = useCallback(() => {
    setSettings(prev => {
      const nextTheme = prev.theme === 'dark' ? 'light' : 'dark';
      if (nextTheme === 'light') {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      } else {
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
      return { ...prev, theme: nextTheme };
    });
  }, []);

  const handleOpenResource = useCallback((res: ResourceItem) => {
    setActiveResourceId(res.id);
  }, []);

  const handleCloseResource = useCallback(() => {
    setActiveResourceId(null);
  }, []);

  const handleUpdateResource = useCallback((id: string, updated: Partial<ResourceItem>) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updated, updatedAt: 'Just now' } : item))
    );
  }, []);

  const handleUpdateCoverColor = useCallback((id: string, color: string) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, coverColor: color } : item))
    );
  }, []);

  const handleTogglePin = useCallback((id: string) => {
    setResources(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, isPinned: !r.isPinned } : r));
      return next;
    });
  }, []);

  const handleToggleFavorite = useCallback((id: string) => {
    setResources(prev => {
      const next = prev.map(r => (r.id === id ? { ...r, isFavorite: !r.isFavorite } : r));
      return next;
    });
  }, []);

  const handleUpdateBadge = useCallback((id: string, badge: string) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, badge } : item))
    );
  }, []);

  const handleCreateResource = useCallback((newRes: ResourceItem, openImmediately: boolean) => {
    setResources(prev => [newRes, ...prev]);
    if (openImmediately) {
      setActiveResourceId(newRes.id);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;
    const duration = Date.now() - touchStartTimeRef.current;
    if (touchStartXRef.current < 50 && diffX > 60 && duration < 500) {
      setSidebarOpen(true);
    }
  }, []);

  // Sync theme class on mount
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const activeProject = defaultProjects[0];
  const activeResource = useMemo(
    () => resources.find(r => r.id === activeResourceId) || null,
    [resources, activeResourceId]
  );

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`w-full relative selection:bg-white selection:text-black transition-colors duration-300 ${
        isDistractionFree
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-screen'
      } ${
        settings.theme === 'dark'
          ? isDistractionFree
            ? 'bg-[#090909] text-[#e5e5e5]'
            : 'bg-[#0a0a0a] text-[#e5e5e5]'
          : 'bg-[#f5f5f5] text-[#171717]'
      }`}
    >
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 z-[9999] bg-red-900 border-b border-red-700 px-4 py-2 flex items-center gap-2 text-white text-xs sm:text-sm">
          <WifiOff className="w-4 h-4 flex-shrink-0" />
          <span className="font-mono">You are offline • Changes will sync when connection restored</span>
        </div>
      )}

      {/* Prototype Wireframe Architectural Grid (z-0) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ${
          isDistractionFree ? 'opacity-15' : 'opacity-40'
        }`}
      >
        <div className="absolute inset-0 bg-prototype-grid" />
      </div>

      {/* Global App Header (z-50) */}
      <Header
        activeTab={activeTab}
        onOpenSidebar={() => setSidebarOpen(true)}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onLockScreen={() => handleUpdateSettings({ isLocked: true })}
        isDistractionFree={isDistractionFree}
        onToggleDistractionFree={handleToggleDistractionFree}
      />

      {/* Main Viewport Stage (z-10) */}
      <main
        className={`relative z-10 w-full transition-all duration-300 ${
          isDistractionFree
            ? 'h-[100dvh] max-h-[100dvh] overflow-hidden p-2 sm:p-3 flex flex-col'
            : 'min-h-screen pt-24 pb-24 px-3 sm:px-4'
        }`}
      >
        {activeTab === 'hub' && (
          <HubView
            telemetry={telemetry}
            connectedApps={connectedApps}
            resources={resources}
            companion={companion}
            onOpenResource={handleOpenResource}
            onCreateResourceClick={() => setIsCreateModalOpen(true)}
            onOpenLibrary={() => setActiveTab('library')}
            onOpenWorkspace={() => setActiveTab('workspace')}
            onOpenFishing={() => setIsFishingModalOpen(true)}
            onOpenProfile={() => setActiveTab('profile')}
            onShowToast={showToast}
            userRole={settings.role}
            settings={settings}
          />
        )}

        {activeTab === 'library' && (
          <LibraryView
            resources={resources}
            onOpenResource={handleOpenResource}
            onCreateResourceClick={() => setIsCreateModalOpen(true)}
            onTogglePin={handleTogglePin}
            onToggleFavorite={handleToggleFavorite}
            onUpdateBadge={handleUpdateBadge}
            onUpdateCoverColor={handleUpdateCoverColor}
            onUpdateResource={handleUpdateResource}
            onShowToast={showToast}
            userRole={settings.role}
            settings={settings}
          />
        )}

        {activeTab === 'workspace' && (
          <WorkspaceView
            project={activeProject}
            resources={resources}
            onOpenResource={handleOpenResource}
            onShowToast={showToast}
            isDistractionFree={isDistractionFree}
            onToggleDistractionFree={handleToggleDistractionFree}
            userRole={settings.role}
            collabBentoTiles={collabTiles}
            onUpdateCollabBentoTiles={setCollabTiles}
            settings={settings}
          />
        )}

        {activeTab === 'companion' && (
          <CompanionView
            companion={companion}
            onUpdateCompanion={handleUpdateCompanion}
            telemetry={telemetry}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onShowToast={showToast}
            onOpenFishing={() => setIsFishingModalOpen(true)}
            onRenameFish={handleRenameFish}
            onSetPrimaryFish={handleSetPrimaryFish}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onShowToast={showToast}
            onLockSession={() => handleUpdateSettings({ isLocked: true })}
            onSwitchTab={tab => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Sliding Sidebar Drawer (z-40) - Hidden in No Distraction Mode */}
      {!isDistractionFree && (
        <SidebarDrawer
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          companion={companion}
          onUpdateCompanion={handleUpdateCompanion}
          telemetry={telemetry}
          onToggleStreakFreeze={handleToggleStreakFreeze}
          schedule={schedule}
          connectedApps={connectedApps}
          onToggleAppConnection={handleToggleAppConnection}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          resources={resources}
          onOpenResource={handleOpenResource}
          onCreateResourceClick={() => setIsCreateModalOpen(true)}
          onNavigateTab={tab => setActiveTab(tab)}
          onLockScreen={() => handleUpdateSettings({ isLocked: true })}
          onOpenFishing={() => setIsFishingModalOpen(true)}
          onShowToast={showToast}
        />
      )}

      {/* Biometric Passkey Lock Screen Overlay (z-50) */}
      {settings.isLocked && (
        <LockScreen
          username={settings.username}
          onUnlock={() => handleUpdateSettings({ isLocked: false })}
          onShowToast={showToast}
        />
      )}

      {/* Create Resource Modal */}
      <Suspense fallback={null}>
        <CreateResourceModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateResource={handleCreateResource}
          onShowToast={showToast}
          settings={settings}
        />
      </Suspense>

      {/* Deep-Sea Fishing Rod Reeling & 3-Click Mystery Can Modal */}
      <Suspense fallback={null}>
        <FishingReelModal
          isOpen={isFishingModalOpen}
          onClose={() => setIsFishingModalOpen(false)}
          telemetry={telemetry}
          currentFishCount={companion.fishes?.length || 1}
          onCatchNewFish={handleCatchNewFish}
          onAddBonusStreaks={handleAddBonusStreaks}
          onShowToast={showToast}
          settings={settings}
        />
      </Suspense>

      {/* Full Feature Editors & Viewers (Maximizing on Click, Shrinking on Close) */}
      <AnimatePresence>
        {activeResource && (
          <Suspense fallback={null}>
            <React.Fragment key={activeResource.id}>
            {activeResource.type === 'document' && (
              <GoogleDocsEditor
                document={activeResource}
                onClose={handleCloseResource}
                onUpdateDocument={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'presentation' && (
              <PresentationEditor
                presentation={activeResource}
                onClose={handleCloseResource}
                onUpdatePresentation={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'notebook' && (
              <NotebookViewer
                notebook={activeResource}
                onClose={handleCloseResource}
                onUpdateNotebook={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'ebook' && (
              <EbookReader
                ebook={activeResource}
                onClose={handleCloseResource}
                onUpdateEbook={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'lesson' && (
              <LessonViewer
                lesson={activeResource}
                onClose={handleCloseResource}
                onUpdateLesson={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'notepad' && (
              <NotepadViewer
                notepad={activeResource}
                onClose={handleCloseResource}
                onUpdateNotepad={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'journal' && (
              <JournalViewer
                journal={activeResource}
                onClose={handleCloseResource}
                onUpdateJournal={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}

            {activeResource.type === 'pdf' && (
              <PdfViewer
                pdf={activeResource}
                onClose={handleCloseResource}
                onUpdatePdf={updated => handleUpdateResource(activeResource.id, updated)}
                onShowToast={showToast}
              />
            )}
            </React.Fragment>
          </Suspense>
        )}
      </AnimatePresence>

      {/* Floating Interaction Feedback Toast */}
      <Toast toast={toastState} onDismiss={() => setToastState(null)} />

      {/* Bottom Navigation Dock (z-50) - Hidden in No Distraction Mode */}
      {!isDistractionFree && (
        <BottomNav
          activeTab={activeTab}
          onChangeTab={tab => setActiveTab(tab)}
        />
      )}
    </div>
  );
}
