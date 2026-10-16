import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HubView } from './components/HubView';
import { LibraryView } from './components/LibraryView';
import { CompanionView } from './components/CompanionView';
import { WorkspaceView } from './components/WorkspaceView';
import { SidebarDrawer } from './components/SidebarDrawer';
import { LockScreen } from './components/LockScreen';
import { Toast, ToastItem } from './components/Toast';
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
import { VersionHistoryModal } from './components/VersionHistoryModal';
import { CurricularPortalModal } from './components/learningPaths/CurricularPortalModal';
import { FlashcardsModal } from './components/study/FlashcardsModal';
import { StudyRoomsModal } from './components/study/StudyRoomsModal';
import { NoteGraphModal } from './components/tools/NoteGraphModal';
import { DailyReflectionModal } from './components/tools/DailyReflectionModal';
import { PomodoroEyeBreakModal } from './components/tools/PomodoroEyeBreakModal';
import { ThemePickerModal } from './components/ThemePickerModal';
import { applyThemeToDocument, ATLAUZ_THEMES } from './themes';
import { useOfflineSync } from './hooks/useOfflineSync';
import { LearningPath, EarnedCertificate } from './types/learningPath';
import { INITIAL_LEARNING_PATHS } from './data/initialLearningPaths';
import {
  Flashcard,
  StudyRoom,
  CompetencyVector,
  DailyReflectionLog
} from './types/study';
import {
  INITIAL_FLASHCARDS,
  INITIAL_STUDY_ROOMS,
  INITIAL_COMPETENCY_VECTOR,
  INITIAL_DAILY_REFLECTIONS
} from './data/initialStudyData';
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
import {
  loadStoredData,
  saveStoredData,
  clearUserSession,
  STORAGE_KEYS
} from './utils/storage';

export default function App() {
  const [activeTab, setActiveTab] = useState<'hub' | 'library' | 'workspace' | 'companion' | 'profile'>('hub');
  const [companion, setCompanion] = useState<CompanionState>(() =>
    loadStoredData(STORAGE_KEYS.COMPANION, initialCompanion)
  );
  const [telemetry, setTelemetry] = useState<CognitiveTelemetry>(() =>
    loadStoredData(STORAGE_KEYS.TELEMETRY, initialTelemetry)
  );
  const [schedule, setSchedule] = useState<ScheduleBlock[]>(initialSchedule);
  const [connectedApps, setConnectedApps] = useState<ConnectedApp[]>(initialConnectedApps);
  const [settings, setSettings] = useState<UserAccountSettings>(() =>
    loadStoredData(STORAGE_KEYS.SETTINGS, initialSettings)
  );
  const [learningPaths, setLearningPaths] = useState<LearningPath[]>(() =>
    loadStoredData(STORAGE_KEYS.LEARNING_PATHS, INITIAL_LEARNING_PATHS)
  );
  const [earnedCertificates, setEarnedCertificates] = useState<EarnedCertificate[]>(() =>
    loadStoredData(STORAGE_KEYS.EARNED_CERTIFICATES, [])
  );
  const [isCurricularPortalOpen, setIsCurricularPortalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [toastState, setToastState] = useState<ToastItem | string | null>(null);
  const [isDistractionFree, setIsDistractionFree] = useState<boolean>(false);

  // Functional resource library states with Local Storage persistence
  const [resources, setResources] = useState<ResourceItem[]>(() =>
    loadStoredData(STORAGE_KEYS.RESOURCES, initialResources)
  );
  const [activeResourceId, setActiveResourceId] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isFishingModalOpen, setIsFishingModalOpen] = useState<boolean>(false);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState<boolean>(false);
  // Study Suite v1.1.4 States & LocalStorage Persistence
  const [flashcards, setFlashcards] = useState<Flashcard[]>(() =>
    loadStoredData(STORAGE_KEYS.FLASHCARDS, INITIAL_FLASHCARDS)
  );
  const [studyRooms, setStudyRooms] = useState<StudyRoom[]>(() =>
    loadStoredData(STORAGE_KEYS.STUDY_ROOMS, INITIAL_STUDY_ROOMS)
  );
  const [competencies, setCompetencies] = useState<CompetencyVector>(() =>
    loadStoredData(STORAGE_KEYS.COMPETENCIES, INITIAL_COMPETENCY_VECTOR)
  );
  const [todayReflection, setTodayReflection] = useState<DailyReflectionLog>(() =>
    loadStoredData(STORAGE_KEYS.DAILY_REFLECTIONS, INITIAL_DAILY_REFLECTIONS[0])
  );

  const [isFlashcardsOpen, setIsFlashcardsOpen] = useState<boolean>(false);
  const [isStudyRoomsOpen, setIsStudyRoomsOpen] = useState<boolean>(false);
  const [isNoteGraphOpen, setIsNoteGraphOpen] = useState<boolean>(false);
  const [isDailyReflectionOpen, setIsDailyReflectionOpen] = useState<boolean>(false);
  const [isEyeBreakOpen, setIsEyeBreakOpen] = useState<boolean>(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState<boolean>(false);

  const handleUpdateFlashcard = (cardId: string, updated: Partial<Flashcard>) => {
    setFlashcards(prev => {
      const next = prev.map(c => (c.id === cardId ? { ...c, ...updated } : c));
      saveStoredData(STORAGE_KEYS.FLASHCARDS, next);
      return next;
    });
  };

  const handleCreateFlashcard = (card: Flashcard) => {
    setFlashcards(prev => {
      const next = [card, ...prev];
      saveStoredData(STORAGE_KEYS.FLASHCARDS, next);
      return next;
    });
  };

  const handleSaveReflection = (reflection: DailyReflectionLog) => {
    setTodayReflection(reflection);
    saveStoredData(STORAGE_KEYS.DAILY_REFLECTIONS, reflection);
  };

  // Collaborative Bento Workspaces state (CRDT & Co-Presence)
  const [collabTiles, setCollabTiles] = useState<CollaborativeBentoTile[]>(initialCollaborativeBentoTiles);

  // Swipe / Long-press detection for mobile gesture navigation
  const touchStartXRef = useRef<number>(0);
  const touchStartTimeRef = useRef<number>(0);

  const showToast = (toastInput: string | ToastItem, onUndoCallback?: () => void) => {
    if (typeof toastInput === 'string') {
      setToastState(onUndoCallback ? { message: toastInput, onUndo: onUndoCallback } : toastInput);
    } else {
      setToastState(toastInput);
    }
    setTimeout(() => {
      setToastState(prev => (prev === toastInput ? null : prev));
    }, 3200);
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

  // Wire up offline sync for operations that fail during network outages
  useOfflineSync(async (operations) => {
    // This callback handles syncing resources when back online
    // In v1.1, this will sync to backend; for now, it logs operations
    console.log(`[Offline Sync] Processing ${operations.length} pending operations`, operations);
  });

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

  const handleDeleteResource = (id: string) => {
    const target = resources.find(r => r.id === id);
    if (!target) return;
    const previous = [...resources];
    setResources(prev => prev.filter(r => r.id !== id));
    if (activeResourceId === id) {
      setActiveResourceId(null);
    }
    showToast({
      message: `Deleted "${target.title}"`,
      type: 'info',
      onUndo: () => setResources(previous),
      undoLabel: 'Undo'
    });
  };

  // Automatic Local Storage Persistence Synchronization
  useEffect(() => {
    saveStoredData(STORAGE_KEYS.RESOURCES, resources);
  }, [resources]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.SETTINGS, settings);
  }, [settings]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.TELEMETRY, telemetry);
  }, [telemetry]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.COMPANION, companion);
  }, [companion]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.LEARNING_PATHS, learningPaths);
  }, [learningPaths]);

  useEffect(() => {
    saveStoredData(STORAGE_KEYS.EARNED_CERTIFICATES, earnedCertificates);
  }, [earnedCertificates]);

  // Curricular Learning Paths Handlers
  const handleEnrollPath = (pathId: string) => {
    setLearningPaths(prev =>
      prev.map(p =>
        p.id === pathId
          ? { ...p, isEnrolled: true, enrolledAt: p.enrolledAt || new Date().toISOString().slice(0, 10) }
          : p
      )
    );
  };

  const handleCompleteModule = (pathId: string, moduleId: string) => {
    setLearningPaths(prev =>
      prev.map(p => {
        if (p.id !== pathId) return p;
        const updatedMods = p.modules.map(m =>
          m.id === moduleId ? { ...m, isCompleted: true, completedAt: new Date().toISOString().slice(0, 10) } : m
        );
        const allDone = updatedMods.every(m => m.isCompleted);
        return {
          ...p,
          modules: updatedMods,
          completedAt: allDone ? (p.completedAt || new Date().toISOString().slice(0, 10)) : p.completedAt
        };
      })
    );
  };

  const handleClaimCertificate = (path: LearningPath) => {
    const existing = earnedCertificates.find(c => c.pathId === path.id);
    if (existing) return;

    const newCert: EarnedCertificate = {
      id: `cert-${Date.now()}`,
      pathId: path.id,
      pathTitle: path.title,
      studentName: settings.username,
      verificationHash: `ATL-2026-CERT-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      issuedAt: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      badgeTitle: path.reward.badgeTitle,
      badgeIcon: path.reward.badgeIcon,
      honorLevel: path.reward.honorLevel,
      instructor: 'Dr. Eric Alvarez & Curriculum Board',
      unlockedFishName: path.reward.unlockedFish.name
    };

    setEarnedCertificates(prev => [newCert, ...prev]);

    // Add rare fish to companion aquarium if not present
    setCompanion(prev => {
      const alreadyHas = prev.fishes.some(f => f.name === path.reward.unlockedFish.name);
      if (alreadyHas) return prev;
      return {
        ...prev,
        fishes: [...prev.fishes, path.reward.unlockedFish]
      };
    });

    showToast(`🎓 Graduated! Unlocked "${path.reward.badgeTitle}" & rare fish "${path.reward.unlockedFish.name}"!`);
  };

  const handleCreateCustomPath = (newPath: LearningPath) => {
    setLearningPaths(prev => [newPath, ...prev]);
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

  // Sync theme class and conceptual CSS tokens on mount & update
  useEffect(() => {
    applyThemeToDocument(settings.theme || 'dark', settings.themeIntensity || 'focus');
    if (settings.theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [settings.theme, settings.themeIntensity]);

  const handleToggleThemeIntensity = () => {
    const nextIntensity = settings.themeIntensity === 'fuller' ? 'focus' : 'fuller';
    handleUpdateSettings({ themeIntensity: nextIntensity });
    showToast(
      nextIntensity === 'fuller'
        ? '🎨 Fuller Theme Mode Active: Rich Solid Colors & View Codings'
        : '🌙 Focus Mode Active: Deep Obsidian Dark Slate Surfaces'
    );
  };

  const activeProject = defaultProjects[0];
  const activeResource = resources.find(r => r.id === activeResourceId) || null;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        backgroundColor: 'var(--theme-bg-primary, #070707)',
        color: 'var(--theme-text-primary, #ffffff)'
      }}
      className={`w-full relative selection:bg-white selection:text-black transition-colors duration-300 ${
        isDistractionFree
          ? 'h-[100dvh] max-h-[100dvh] overflow-hidden'
          : 'min-h-screen'
      }`}
    >
      {/* Prototype Wireframe Architectural Grid & Immersive Theme Backdrop Pattern (z-0) */}
      <div
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden transition-opacity duration-500 ${
          isDistractionFree ? 'opacity-20' : 'opacity-60'
        }`}
      >
        {/* Architectural Grid */}
        <div
          className="absolute inset-0 bg-prototype-grid"
          style={{ filter: 'drop-shadow(0 0 8px var(--theme-accent))', opacity: 0.35 }}
        />
        {/* Unique Theme Backdrop Pattern */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--theme-backdrop-pattern, none)' }}
        />
        {/* Theme Soft Ambient Radial Light Gradient */}
        <div
          className="absolute inset-0"
          style={{ background: 'var(--theme-texture, none)' }}
        />
      </div>

      {/* Global App Header (z-50) */}
      <Header
        activeTab={activeTab}
        onOpenSidebar={() => setSidebarOpen(true)}
        settings={settings}
        onToggleTheme={handleToggleTheme}
        onToggleThemeIntensity={handleToggleThemeIntensity}
        onOpenThemePicker={() => setIsThemePickerOpen(true)}
        onLockScreen={() => handleUpdateSettings({ isLocked: true })}
        isDistractionFree={isDistractionFree}
        onToggleDistractionFree={handleToggleDistractionFree}
        onOpenProfile={() => setActiveTab('profile')}
        onLogout={() => {
          // Clear user session (NOT learning data) and redirect to home
          clearUserSession();
          window.location.href = '/';
        }}
      />

      {/* Main Viewport Stage (z-10) */}
      <main
        className={`relative z-10 w-full transition-all duration-300 ${
          isDistractionFree
            ? 'h-[100dvh] max-h-[100dvh] overflow-hidden p-1.5 sm:p-3 flex flex-col'
            : activeTab === 'hub'
            ? 'min-h-screen overflow-y-auto pt-16 pb-24 px-1.5 sm:px-4 sm:pt-24 flex flex-col'
            : 'min-h-screen pt-20 pb-24 px-3 sm:px-4'
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

      {/* Curricular Learning Paths & Degree Accreditations Full-Screen Portal */}
      <CurricularPortalModal
        isOpen={isCurricularPortalOpen}
        onClose={() => setIsCurricularPortalOpen(false)}
        paths={learningPaths}
        earnedCertificates={earnedCertificates}
        resources={resources}
        settings={settings}
        onEnrollPath={handleEnrollPath}
        onCompleteModule={handleCompleteModule}
        onClaimCertificate={handleClaimCertificate}
        onCreateCustomPath={handleCreateCustomPath}
        onOpenResource={handleOpenResource}
        onShowToast={showToast}
      />

      {/* Version History Full-Screen Focus Modal (v1.1.1 Patch Log) */}
      <VersionHistoryModal
        isOpen={isVersionHistoryOpen}
        onClose={() => setIsVersionHistoryOpen(false)}
      />

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

      {/* Spaced Repetition Flashcards Modal */}
      <FlashcardsModal
        isOpen={isFlashcardsOpen}
        onClose={() => setIsFlashcardsOpen(false)}
        flashcards={flashcards}
        onUpdateFlashcard={handleUpdateFlashcard}
        onCreateFlashcard={handleCreateFlashcard}
        onShowToast={showToast}
      />

      {/* Collaborative Live Study Lounge Rooms Modal */}
      <StudyRoomsModal
        isOpen={isStudyRoomsOpen}
        onClose={() => setIsStudyRoomsOpen(false)}
        rooms={studyRooms}
        settings={settings}
        onShowToast={showToast}
      />

      {/* Interactive Bidirectional Note Knowledge Graph Modal */}
      <NoteGraphModal
        isOpen={isNoteGraphOpen}
        onClose={() => setIsNoteGraphOpen(false)}
        resources={resources}
        onOpenResource={handleOpenResource}
        onShowToast={showToast}
      />

      {/* Daily Academic Reflection & Mood Journal Modal */}
      <DailyReflectionModal
        isOpen={isDailyReflectionOpen}
        onClose={() => setIsDailyReflectionOpen(false)}
        todayReflection={todayReflection}
        onSaveReflection={handleSaveReflection}
        onShowToast={showToast}
      />

      {/* Pomodoro 20-20-20 Eye Strain & Ergonomic Break Modal */}
      <PomodoroEyeBreakModal
        isOpen={isEyeBreakOpen}
        onClose={() => setIsEyeBreakOpen(false)}
        onShowToast={showToast}
      />

      {/* Living Themes & Conceptual Atmospheres Gallery Modal (v1.3.0) */}
      <ThemePickerModal
        isOpen={isThemePickerOpen}
        onClose={() => setIsThemePickerOpen(false)}
        currentTheme={settings.theme}
        intensityMode={settings.themeIntensity || 'focus'}
        onToggleIntensityMode={handleToggleThemeIntensity}
        onSelectTheme={themeId => {
          handleUpdateSettings({ theme: themeId });
          showToast({
            message: `Applied theme: ${ATLAUZ_THEMES[themeId]?.name || themeId}`,
            type: 'success'
          });
        }}
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
