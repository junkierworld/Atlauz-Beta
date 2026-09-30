import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HubView } from './components/HubView';
import { LibraryView } from './components/LibraryView';
import { CompanionView } from './components/CompanionView';
import { WorkspaceView } from './components/WorkspaceView';
import { SidebarDrawer } from './components/SidebarDrawer';
import { LockScreen } from './components/LockScreen';
import { Toast } from './components/Toast';
import { GoogleDocsEditor } from './components/GoogleDocsEditor';
import { PresentationEditor } from './components/PresentationEditor';
import { NotebookViewer } from './components/NotebookViewer';
import { EbookReader } from './components/EbookReader';
import { LessonViewer } from './components/LessonViewer';
import { NotepadViewer } from './components/NotepadViewer';
import { JournalViewer } from './components/JournalViewer';
import { PdfViewer } from './components/PdfViewer';
import { CreateResourceModal } from './components/CreateResourceModal';
import { FishingReelModal } from './components/FishingReelModal';
import { ProfileView } from './components/ProfileView';
import {
  initialCompanion,
  initialTelemetry,
  defaultProjects,
  initialSchedule,
  initialConnectedApps,
  initialSettings,
  initialResources
} from './data';
import {
  CompanionState,
  FishCompanion,
  CognitiveTelemetry,
  ScheduleBlock,
  ConnectedApp,
  UserAccountSettings,
  ResourceItem
} from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'library' | 'workspace' | 'companion' | 'profile'>('hub');
  const [companion, setCompanion] = useState<CompanionState>(initialCompanion);
  const [telemetry, setTelemetry] = useState<CognitiveTelemetry>(initialTelemetry);
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(initialSchedule);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>(initialConnectedApps);
  const [settings, setSettings] = useState<UserAccountSettings>(initialSettings);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);

  // Functional resource library states
  const [resources, setResources] = useState<ResourceItem[]>(initialResources);
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isFishingModalOpen, setIsFishingModalOpen] = useState<boolean>(false);

  // Swipe / Long-press detection for mobile gesture navigation
  const touchStartXRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 2400);
  };

  const handleToggleDistractionFree = (forceState?: boolean) => {
    const next = forceState !== undefined ? forceState : !isDistractionFree;
    setIsDistractionFree(next);
    if (next) {
      setActiveTab('workspace');
      showToast('No Distraction: Focus Shift Mode Active');
    } else {
      showToast('Exited No Distraction Mode');
    }
  };

  // Keyboard shortcut Esc to exit distraction-free mode
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDistractionFree) {
        setIsDistractionFree(false);
        showToast('Exited No Distraction Mode (Esc)');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDistractionFree]);

  const handleUpdateCompanion = (updated: Partial<CompanionState>) => {
    setCompanion(prev => ({ ...prev, ...updated }));
  };

  const handleCatchNewFish = (newFish: FishCompanion) => {
    // Deduct 20 streaks
    setTelemetry(prev => ({
      ...prev,
      streakDays: Math.max(0, prev.streakDays - 20)
    }));

    // Add new fish to tank (up to 5)
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
  };

  const handleRenameFish = (fishId: string, newName: string) => {
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
  };

  const handleSetPrimaryFish = (fishId: string) => {
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
  };

  const handleAddBonusStreaks = (amount: number) => {
    setTelemetry(prev => ({
      ...prev,
      streakDays: prev.streakDays + amount
    }));
  };

  const handleToggleStreakFreeze = () => {
    const nextFrozen = !telemetry.isStreakFrozen;
    setTelemetry(prev => ({
      ...prev,
      isStreakFrozen: nextFrozen
    }));
    showToast(nextFrozen ? 'Streak Frozen to Protect Recovery Balance' : 'Streak Resumed into Active Flow');
  };

  const handleToggleAppConnection = (appId: string) => {
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
  };

  const handleUpdateSettings = (updated: Partial<UserAccountSettings>) => {
    setSettings(prev => ({ ...prev, ...updated }));
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    if (nextTheme === 'light') {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
    setSettings(prev => ({ ...prev, theme: nextTheme }));
    showToast(`Theme switched to ${nextTheme === 'dark' ? 'Abyssal Dark' : 'Crystalline Light'}`);
  };

  // Resource Library Operations
  const handleOpenResource = (res: ResourceItem) => {
    setActiveResourceId(res.id);
    showToast(`Maximized ${res.title}`);
  };

  const handleCloseResource = () => {
    setActiveResourceId(null);
    showToast('Minimized back to shelf');
  };

  const handleUpdateResource = (id: string, updated: Partial<ResourceItem>) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, ...updated, updatedAt: 'Just now' } : item))
    );
  };

  const handleUpdateCoverColor = (id: string, color: string) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, coverColor: color } : item))
    );
  };

  const handleTogglePin = (id: string) => {
    const item = resources.find(r => r.id === id);
    if (!item) return;
    const next = !item.isPinned;
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, isPinned: next } : r))
    );
    showToast(next ? `📌 Pinned "${item.title}" to Hub & Sidebar` : `Unpinned "${item.title}"`);
  };

  const handleToggleFavorite = (id: string) => {
    const item = resources.find(r => r.id === id);
    if (!item) return;
    const next = !item.isFavorite;
    setResources(prev =>
      prev.map(r => (r.id === id ? { ...r, isFavorite: next } : r))
    );
    showToast(next ? `⭐ Added "${item.title}" to Favorites` : `Removed "${item.title}"`);
  };

  const handleUpdateBadge = (id: string, badge: string) => {
    setResources(prev =>
      prev.map(item => (item.id === id ? { ...item, badge } : item))
    );
    showToast(`Badge updated to ${badge}`);
  };

  const handleCreateResource = (newRes: ResourceItem, openImmediately: boolean) => {
    setResources(prev => [newRes, ...prev]);
    if (openImmediately) {
      setActiveResourceId(newRes.id);
    }
  };

  // Touch handlers on container
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartTimeRef.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const diffX = touchEndX - touchStartXRef.current;
    const duration = Date.now() - touchStartTimeRef.current;

    // Inward swipe from left edge (starting in first 50px of left screen)
    if (touchStartXRef.current < 50 && diffX > 60 && duration < 500) {
      setSidebarOpen(true);
    }
  };

  // Sync theme class on mount
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  const activeProject = defaultProjects[0];
  const activeResource = resources.find(r => r.id === activeResourceId) || null;

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
      <CreateResourceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateResource={handleCreateResource}
        onShowToast={showToast}
      />

      {/* Deep-Sea Fishing Rod Reeling & 3-Click Mystery Can Modal */}
      <FishingReelModal
        isOpen={isFishingModalOpen}
        onClose={() => setIsFishingModalOpen(false)}
        telemetry={telemetry}
        currentFishCount={companion.fishes?.length || 1}
        onCatchNewFish={handleCatchNewFish}
        onAddBonusStreaks={handleAddBonusStreaks}
        onShowToast={showToast}
      />

      {/* Full Feature Editors & Viewers (Maximizing on Click, Shrinking on Close) */}
      <AnimatePresence>
        {activeResource && (
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
        )}
      </AnimatePresence>

      {/* Floating Interaction Feedback Toast */}
      <Toast message={toastMessage} />

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
