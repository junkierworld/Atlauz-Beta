import {
  CompanionState,
  CognitiveTelemetry,
  ScheduleBlock,
  ProjectItem,
  ConnectedApp,
  UserAccountSettings,
  ResourceItem,
  ResourceBadge,
  CollaborativeBentoTile,
  RestDayVaultEntry,
  ScrapbookItem
} from './types';

export const AVAILABLE_BADGES: ResourceBadge[] = [
  { id: 'favorite', label: '★ Favorite', icon: 'Star', color: '#ffffff', bgColor: 'rgba(255, 255, 255, 0.15)', borderColor: 'rgba(255, 255, 255, 0.35)' },
  { id: 'priority', label: '● Priority', icon: 'Flame', color: '#f5f5f5', bgColor: 'rgba(240, 240, 240, 0.15)', borderColor: 'rgba(240, 240, 240, 0.35)' },
  { id: 'milestone', label: '◆ Milestone', icon: 'Trophy', color: '#e5e5e5', bgColor: 'rgba(220, 220, 220, 0.15)', borderColor: 'rgba(220, 220, 220, 0.35)' },
  { id: 'insight', label: '▲ Insight', icon: 'Lightbulb', color: '#d4d4d4', bgColor: 'rgba(200, 200, 200, 0.15)', borderColor: 'rgba(200, 200, 200, 0.35)' },
  { id: 'mastered', label: '✓ Mastered', icon: 'GraduationCap', color: '#a3a3a3', bgColor: 'rgba(160, 160, 160, 0.15)', borderColor: 'rgba(160, 160, 160, 0.35)' },
  { id: 'serene', label: '■ Balanced', icon: 'Leaf', color: '#cccccc', bgColor: 'rgba(180, 180, 180, 0.15)', borderColor: 'rgba(180, 180, 180, 0.35)' },
  { id: 'research', label: '◉ Research', icon: 'FlaskConical', color: '#e0e0e0', bgColor: 'rgba(224, 224, 224, 0.15)', borderColor: 'rgba(224, 224, 224, 0.35)' },
  { id: 'core', label: '✦ Core Spec', icon: 'Pin', color: '#ffffff', bgColor: 'rgba(255, 255, 255, 0.18)', borderColor: 'rgba(255, 255, 255, 0.4)' }
];

// Empty companion for new users
export const initialCompanion: CompanionState = {
  name: 'Companion',
  stateMachine: 'Serene_Balanced.json',
  fishes: [],
  headIndex: 1,
  bodyIndex: 1,
  tailIndex: 2,
  eyesIndex: 3,
  mouthIndex: 1,
  baseColor: '#ffffff',
  accentColor: '#888888',
  featuresEnabled: true,
  messagesEnabled: true,
  customMessages: ['', '', '']
};

// Empty telemetry for new users
export const initialTelemetry: CognitiveTelemetry = {
  cognitiveVital: 0,
  sessionMinutes: 0,
  streakDays: 0,
  isStreakFrozen: false,
  antiBurnoutActive: true,
  sleepHoursLogged: 0,
  dailyGoalProgress: 0,
  zeroContextSwitchSavedHours: 0
};

// Minimal default project for new users
export const defaultProjects: ProjectItem[] = [
  {
    id: 'workspace-default',
    code: 'WORKSPACE',
    title: 'My Workspace',
    subtitle: 'Start creating and organizing your projects here.',
    category: 'Personal Workspace',
    coverGradient: 'from-neutral-800 to-neutral-900',
    coverTitle: 'Welcome to Your Workspace',
    connectedApps: [],
    focusHours: 0,
    syncPercent: 0,
    syncedNodes: 0,
    notionBlocks: [],
    googleDocs: [],
    canvaDeck: {
      title: 'Your Presentations',
      slideCount: 0,
      currentSlide: 0,
      slides: []
    },
    deepSources: []
  }
];

// Empty schedule for new users
export const initialSchedule: ScheduleBlock[] = [];

// Empty connected apps for new users
export const initialConnectedApps: ConnectedApp[] = [];

// Minimal settings for new users (gets populated from auth context)
export const initialSettings: UserAccountSettings = {
  username: 'User',
  email: '',
  avatarUrl: '',
  bio: '',
  personality: 'Autonomous & Deep-Focus',
  role: 'Student',
  institution: '',
  department: '',
  goals: [],
  learningPreferences: {
    primaryStyle: 'Reading & Synthesis',
    secondaryStyle: 'Kinesthetic & Interactive',
    tactileFeedback: true,
    audioPacingMultiplier: 1.0,
    autoSummaryOnCompletion: false,
    bentoDefaultMode: false,
    highContrastAdaptiveFont: false,
    notificationDigest: 'silent',
    breakIntervalMinutes: 45,
    soundEffects: true
  },
  twoFactorEnabled: false,
  biometricsEnabled: false,
  idleTimerMinutes: 15,
  isLocked: false,
  theme: 'dark',
  themeIntensity: 'focus',
  hubLayout: {
    preset: 'balanced',
    showDateTime: true,
    showCompanionBubble: true,
    showPinnedContent: true,
    pinnedSlotCount: 4,
    customPinnedIds: [],
    showDueActivities: true,
    dueActivitiesLimit: 3,
    showTodoTasks: true,
    showFocusModeShortcuts: true,
    showCognitiveMetrics: false,
    showStudyLoungeTicker: false,
    showFlashcardQueue: false,
    showWeatherEffect: true
  },
  libraryShelvingMode: 'hybrid',
  appPermissions: {},
  securityLogs: []
};

// Empty library tasks
export const initialLibraryTasks: Array<{
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'high' | 'medium' | 'normal';
  roleTag: 'Student' | 'Researcher' | 'Educator';
  dueDate?: string;
}> = [];

// Empty resources
export const initialResources: ResourceItem[] = [];

// Empty collaborative bento tiles
export const initialCollaborativeBentoTiles: CollaborativeBentoTile[] = [];

// Empty rest days vault
export const initialRestDaysVault: RestDayVaultEntry[] = [];

// Empty scrapbook
export const initialScrapbookItems: ScrapbookItem[] = [];
