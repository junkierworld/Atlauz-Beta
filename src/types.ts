export type LearningStyle = 'Visual & Spatial' | 'Auditory & Acoustic' | 'Kinesthetic & Interactive' | 'Reading & Synthesis';

export type ThemeIntensityMode = 'focus' | 'fuller';

export type ResourceType =
  | 'notebook'
  | 'ebook'
  | 'lesson'
  | 'notepad'
  | 'journal'
  | 'pdf'
  | 'document'
  | 'presentation';

export interface ResourceBadge {
  id: string;
  label: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export type RoleShelfType = 'personal' | 'academic' | 'researcher' | 'educator';

export interface ResourceItem {
  id: string;
  type: ResourceType;
  title: string;
  description: string;
  category: string;
  tags: string[];
  coverColor: string;
  isPinned: boolean;
  isFavorite: boolean;
  badge: string;
  createdAt: string;
  updatedAt: string;
  roleShelf?: RoleShelfType;
  metadata: {
    // Notebook
    pages?: Array<{ id: string; title: string; content: string; badge?: string; isBookmarked?: boolean }>;
    activePageIndex?: number;
    // Ebook
    author?: string;
    progressPercent?: number;
    chapters?: Array<{ id: string; title: string; content: string; readingTime: string }>;
    activeChapterIndex?: number;
    fontSize?: number;
    ebookTheme?: 'sepia' | 'dark' | 'light';
    // Lesson
    instructor?: string;
    courseCode?: string;
    duration?: string;
    level?: string;
    modules?: Array<{ id: string; title: string; completed: boolean; duration: string }>;
    quizQuestions?: Array<{ question: string; options: string[]; answerIndex: number; explanation: string }>;
    // Notepad
    noteContent?: string;
    // Journal
    journalDate?: string;
    mood?: string;
    prompt?: string;
    reflections?: string[];
    isPrivate?: boolean;
    // PDF
    fileName?: string;
    fileSize?: string;
    pageCount?: number;
    currentPage?: number;
    highlights?: Array<{ id: string; page: number; text: string; note: string; color: string }>;
    // Document
    docContent?: string;
    collaborators?: string[];
    comments?: Array<{ id: string; author: string; text: string; time: string; resolved: boolean }>;
    // Presentation
    slideCount?: number;
    slides?: Array<{ id: string; title: string; body: string; notes: string; layout: string; bg: string }>;
    currentSlide?: number;
  };
}

export interface FishCompanion {
  id: string;
  name: string;
  species: string;
  color: string;
  accentColor: string;
  tailType: 'veil' | 'fan' | 'ribbon' | 'sword' | 'glow';
  personality: string;
  size: number;
  adoptedAt: string;
  isPrimary?: boolean;
}

export interface CompanionState {
  name: string; // User-given name of the primary companion
  stateMachine: string;
  learningStyle?: LearningStyle;
  fishes: FishCompanion[]; // Up to 5 fishes swimming in the rectangular fish tank
  primaryFishId?: string;
  headIndex: number;
  bodyIndex: number;
  tailIndex: number;
  eyesIndex: number;
  mouthIndex: number;
  baseColor: string;
  accentColor: string;
  featuresEnabled: boolean;
  messagesEnabled: boolean;
  customMessages: [string, string, string];
}

export interface CognitiveTelemetry {
  cognitiveVital: number; // e.g. 98.4%
  sessionMinutes: number; // e.g. 42
  streakDays: number; // e.g. 28
  isStreakFrozen: boolean;
  antiBurnoutActive: boolean;
  sleepHoursLogged: number;
  dailyGoalProgress: number; // 0 - 100
  zeroContextSwitchSavedHours: number; // e.g. 2.4h
}

export interface ScheduleBlock {
  id: string;
  title: string;
  time: string;
  type: 'deep_work' | 'rest_break' | 'sleep' | 'lecture';
  isWellnessRest: boolean;
  frozenStreakProtected?: boolean;
}

export interface ProjectItem {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  category: string;
  coverGradient: string;
  coverTitle: string;
  connectedApps: string[];
  focusHours: number;
  syncPercent: number;
  syncedNodes: number;
  isPinned?: boolean;
  badge?: string;
  notionBlocks: Array<{
    id: string;
    title: string;
    url: string;
    syncedAgo: string;
    items: Array<{ title: string; badge: string; expanded?: boolean }>;
    relation: string;
    rollup: string;
  }>;
  googleDocs: Array<{
    id: string;
    title: string;
    collaborators: string[];
    excerpt: string;
    section: string;
    attachedFiles: Array<{ name: string; type: 'folder' | 'sheet' | 'doc' }>;
  }>;
  canvaDeck: {
    title: string;
    slideCount: number;
    currentSlide: number;
    slides: Array<{ num: number; label: string; color: string }>;
  };
  deepSources: Array<{
    id: string;
    title: string;
    source: string;
    notes: string;
    tags: string[];
  }>;
}

export interface ConnectedApp {
  id: string;
  name: string;
  category: string;
  icon: string;
  connected: boolean;
  statusText: string;
  oauthScope: string;
  toggleKey?: string;
}

export type UserRole = 'Student' | 'Researcher' | 'Educator';

export type PersonalityType =
  | 'Analytical & Methodical'
  | 'Inquisitive & Exploratory'
  | 'Creative & Synthesizing'
  | 'Autonomous & Deep-Focus'
  | 'Collaborative & Mentoring';

export interface UserLearningPreferences {
  primaryStyle: LearningStyle;
  secondaryStyle: LearningStyle;
  tactileFeedback: boolean;
  audioPacingMultiplier: number; // 0.75, 1.0, 1.25, 1.5, 2.0
  autoSummaryOnCompletion: boolean;
  bentoDefaultMode: boolean;
  highContrastAdaptiveFont: boolean;
  notificationDigest: 'instant' | 'pomodoro_end' | 'daily_summary' | 'silent';
  breakIntervalMinutes: number; // 25, 45, 60
  soundEffects: boolean;
}

export interface SecurityAuditEntry {
  id: string;
  event: string;
  timestamp: string;
  device: string;
  status: 'verified' | 'alert';
}

export type LibraryShelvingMode = 'categories' | 'role_owned' | 'hybrid';

export type HubWidgetPreset = 'minimal' | 'balanced' | 'maximal' | 'custom';

export interface AppPermissionDetail {
  readAccess: boolean;
  writeAccess: boolean;
  backgroundSync: boolean;
  telemetryIsolation: boolean;
  lastSyncedAt?: string;
  tokenExpiresAt?: string;
}

export interface HubLayoutSettings {
  preset: HubWidgetPreset;
  showDateTime: boolean;
  showCompanionBubble: boolean;
  showPinnedContent: boolean;
  pinnedSlotCount: 2 | 4;
  customPinnedIds?: string[]; // Up to 4 chosen pinned resource or shortcut IDs
  showDueActivities: boolean;
  dueActivitiesLimit: number;
  showTodoTasks: boolean;
  showFocusModeShortcuts: boolean;
  showCognitiveMetrics: boolean;
  showStudyLoungeTicker: boolean;
  showFlashcardQueue: boolean;
  showWeatherEffect: boolean;
}

export interface HubTaskItem {
  id: string;
  title: string;
  completed: boolean;
  docTitle?: string;
  docType?: ResourceType;
  resourceId?: string;
  dueDate?: string;
  priority?: 'urgent' | 'medium' | 'normal';
}

export interface DueActivityItem {
  id: string;
  title: string;
  subtitle: string;
  dueDate: string;
  urgency: 'critical' | 'high' | 'normal';
  type: 'course_expiration' | 'assignment_due' | 'exam_scheduled' | 'research_review';
  pathId?: string;
  resourceId?: string;
  targetUnit?: string;
}

import type { AppThemeId } from './themes';

export interface UserAccountSettings {
  username: string;
  email: string;
  avatarUrl?: string;
  bio: string;
  personality: PersonalityType;
  role: UserRole;
  institution?: string;
  department?: string;
  goals: string[];
  learningPreferences: UserLearningPreferences;
  twoFactorEnabled: boolean;
  biometricsEnabled: boolean;
  idleTimerMinutes: number; // 15
  isLocked: boolean;
  theme: AppThemeId;
  themeIntensity?: ThemeIntensityMode;
  securityLogs: SecurityAuditEntry[];
  // v1.1.5 Academic Role & Active Ecosystem fields
  hubLayout?: HubLayoutSettings;
  libraryShelvingMode?: LibraryShelvingMode;
  appPermissions?: Record<string, AppPermissionDetail>;
}

export interface LibraryTaskItem {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'high' | 'medium' | 'normal';
  roleTag?: UserRole;
  dueDate?: string;
}


export type FocusCardPurpose =
  | 'notes'
  | 'docs'
  | 'lectures'
  | 'slides'
  | 'scratchpad'
  | 'milestones'
  | 'pdf'
  | 'journal';

export interface FocusCardItem {
  id: string;
  purpose: FocusCardPurpose;
  title: string;
  subtitle: string;
  category: string;
  badge: string;
  color: string;
  resourceId?: string;
  // Specific purposeful state data
  notesContent?: string;
  docContent?: string;
  lectureTopic?: string;
  lectureInstructor?: string;
  lectureProgress?: number; // 0 - 100
  lecturePlaying?: boolean;
  lectureTime?: string;
  slideCurrent?: number;
  slideTotal?: number;
  scratchpadText?: string;
  milestones?: Array<{ id: string; text: string; completed: boolean }>;
}

export interface CollaboratorBadge {
  id: string;
  initials: string;
  name: string;
  role?: string;
  institution?: string;
  isEditing: boolean;
  presenceStatus?: 'online' | 'idle' | 'offline';
  activeBlockId?: string;
  currentAction?: string;
  lastActiveTime: string;
  accessLevel?: 'read-only' | 'commenter' | 'co-editor';
}

export interface CollaborativeBlockItem {
  id: string;
  content: string;
  author: string;
  initials: string;
  timestamp: string;
  status?: 'verified' | 'editing' | 'completed' | 'draft';
  lastEditedBy?: string;
  crdtVersion?: number;
  category?: string;
  url?: string;
}

export interface CollaborativeBentoTile {
  id: string;
  title: string;
  type: 'task_board' | 'link_vault' | 'note_canvas';
  isShared: boolean;
  shareToken: string;
  accessLevel: 'read-only' | 'commenter' | 'co-editor';
  collaborators: CollaboratorBadge[];
  crdtClock: number;
  blocks: CollaborativeBlockItem[];
}

export interface CrdtOperation {
  opId: string;
  tileId: string;
  type: 'INSERT_BLOCK' | 'UPDATE_BLOCK' | 'DELETE_BLOCK' | 'TOGGLE_STATUS' | 'PRESENCE_HEARTBEAT' | 'EDITING_STATUS';
  clock: number;
  clientId: string;
  author: string;
  initials: string;
  payload: any;
  timestamp: number;
}

export interface BentoSyncMessage {
  type: 'CRDT_OP' | 'REQUEST_SYNC' | 'FULL_SYNC' | 'PEER_HEARTBEAT';
  operation?: CrdtOperation;
  tiles?: CollaborativeBentoTile[];
  senderId: string;
  timestamp: number;
}

export interface RestDayVaultEntry {
  id: string;
  date: string;
  triggerType: 'manual_schedule' | 'circadian_reset' | 'telemetry_fatigue_lock' | 'wellness_recovery';
  label: string;
  protectedStreakDay: number;
  sleepHours: number;
  wellnessHours: number;
  status: 'protected' | 'active_recovery';
  notes: string;
}

export interface ScrapbookItem {
  id: string;
  type: 'url' | 'text' | 'code' | 'image' | 'voice';
  title: string;
  content: string;
  domain?: string;
  previewText?: string;
  codeLanguage?: string;
  audioDuration?: string;
  stagedTime: string;
  tags: string[];
}

export interface StudioDeckSlide {
  id: string;
  title: string;
  layout: 'split_wireframe' | 'headline_metric' | 'bullet_grid' | 'full_canvas';
  body: string;
  notes: string;
  metricValue?: string;
  metricLabel?: string;
  blocks: Array<{ id: string; type: 'heading' | 'paragraph' | 'grid_box' | 'code_snippet'; text: string }>;
}

export interface StudioDocument {
  id: string;
  title: string;
  subtitle: string;
  format: 'deck' | 'document';
  slides: StudioDeckSlide[];
  contentMarkdown: string;
  updatedAt: string;
}


