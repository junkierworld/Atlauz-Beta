import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  User,
  Shield,
  Sliders,
  Sparkles,
  Lock,
  Key,
  GraduationCap,
  FlaskConical,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Smartphone,
  Eye,
  Volume2,
  Check,
  Plus,
  Trash2,
  Download,
  Fingerprint,
  RefreshCw,
  Compass,
  Cpu,
  Layers,
  ArrowRight,
  Target,
  Users,
  GitCommit,
  Terminal,
  LayoutGrid,
  SlidersHorizontal,
  Square,
  Globe,
  Database,
  KeyRound,
  ShieldCheck,
  FileText,
  AlertTriangle,
  Pin,
  X,
  Palette
} from 'lucide-react';
import {
  UserAccountSettings,
  UserRole,
  PersonalityType,
  LearningStyle,
  HubLayoutSettings,
  HubWidgetPreset,
  AppPermissionDetail,
  LibraryShelvingMode
} from '../types';
import { ATLAUZ_THEMES, AppThemeId } from '../themes';
import { SkillRadarChart } from './tools/SkillRadarChart';
import { CompetencyVector } from '../types/study';
import { INITIAL_COMPETENCY_VECTOR } from '../data/initialStudyData';
import { ATLAUZ_ENGINEERING_CREW } from './VersionHistoryModal';

interface ProfileViewProps {
  settings: UserAccountSettings;
  onUpdateSettings: (updated: Partial<UserAccountSettings>) => void;
  onShowToast: (msg: string | { message: string; type?: 'info' | 'success' | 'warning' | 'error'; onUndo?: () => void; undoLabel?: string }) => void;
  onLockSession: () => void;
  onSwitchTab?: (tab: 'hub' | 'library' | 'workspace' | 'companion') => void;
  onOpenVersionHistory?: () => void;
  competencies?: CompetencyVector;
}

const LEARNING_STYLES: Array<{
  style: LearningStyle;
  description: string;
  icon: string;
}> = [
  {
    style: 'Reading & Synthesis',
    description: 'High-density textual synthesis, structured markdown, and deep citation cross-referencing.',
    icon: 'BookOpen'
  },
  {
    style: 'Visual & Spatial',
    description: 'Bento box layouts, 16:9 spatial canvases, slide cards, and visual conceptual mapping.',
    icon: 'Layers'
  },
  {
    style: 'Kinesthetic & Interactive',
    description: 'Direct manipulation, scratchpads, draggable stacks, and tactile haptic response.',
    icon: 'Cpu'
  },
  {
    style: 'Auditory & Acoustic',
    description: 'Pitch-controlled lectures, acoustic carrier waves, audio scrubber transcripts, and sonic pulses.',
    icon: 'Volume2'
  }
];

const PERSONALITY_TYPES: Array<{
  type: PersonalityType;
  tagline: string;
}> = [
  { type: 'Analytical & Methodical', tagline: 'Values precision, structured frameworks, and rigorous verification.' },
  { type: 'Inquisitive & Exploratory', tagline: 'Driven by curiosity, non-linear idea hopping, and novel discoveries.' },
  { type: 'Creative & Synthesizing', tagline: 'Finds hidden cross-domain patterns, visual metaphors, and holistic models.' },
  { type: 'Autonomous & Deep-Focus', tagline: 'Thrives in prolonged uninterrupted flow sessions with zero context friction.' },
  { type: 'Collaborative & Mentoring', tagline: 'Prioritizes clear explanations, co-authoring clarity, and team alignment.' }
];

const DEFAULT_HUB_LAYOUT: HubLayoutSettings = {
  preset: 'balanced',
  showDateTime: true,
  showCompanionBubble: true,
  showPinnedContent: true,
  pinnedSlotCount: 4,
  customPinnedIds: ['res-doc-1', 'res-slide-1', 'res-streak-widget', 'res-nb-1'],
  showDueActivities: true,
  dueActivitiesLimit: 3,
  showTodoTasks: true,
  showFocusModeShortcuts: true,
  showCognitiveMetrics: false,
  showStudyLoungeTicker: false,
  showFlashcardQueue: false,
  showWeatherEffect: true
};

const DEFAULT_APP_PERMISSIONS: Record<string, AppPermissionDetail> = {
  'Google Drive': {
    readAccess: true,
    writeAccess: true,
    backgroundSync: true,
    telemetryIsolation: true,
    lastSyncedAt: 'Today, 08:30 AM'
  },
  'Google Calendar': {
    readAccess: true,
    writeAccess: false,
    backgroundSync: true,
    telemetryIsolation: true,
    lastSyncedAt: 'Today, 08:15 AM'
  },
  'Notion': {
    readAccess: true,
    writeAccess: true,
    backgroundSync: false,
    telemetryIsolation: true,
    lastSyncedAt: 'Yesterday, 19:40 PM'
  },
  'Zotero & arXiv': {
    readAccess: true,
    writeAccess: false,
    backgroundSync: true,
    telemetryIsolation: true,
    lastSyncedAt: 'Oct 05, 14:22 PM'
  },
  'Canvas LMS': {
    readAccess: true,
    writeAccess: false,
    backgroundSync: true,
    telemetryIsolation: true,
    lastSyncedAt: 'Today, 07:00 AM'
  }
};

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
  onLockSession,
  onSwitchTab,
  onOpenVersionHistory,
  competencies = INITIAL_COMPETENCY_VECTOR
}) => {
  const [activeSection, setActiveSection] = useState<'ecosystem' | 'hub_customizer' | 'preferences' | 'identity' | 'security' | 'credits'>('ecosystem');
  const [selectedCrewMember, setSelectedCrewMember] = useState<string | null>(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [tempBio, setTempBio] = useState(settings.bio || '');
  const [newGoalText, setNewGoalText] = useState('');
  const [isGeneratingBackupCode, setIsGeneratingBackupCode] = useState(false);
  const [backupCode, setBackupCode] = useState<string | null>(null);

  // Identity validation state
  const [isEditingIdentity, setIsEditingIdentity] = useState(false);
  const [tempUsername, setTempUsername] = useState(settings.username || '');
  const [tempEmail, setTempEmail] = useState(settings.email || '');
  const [identityTouched, setIdentityTouched] = useState<{ username?: boolean; email?: boolean }>({});

  const hubLayout: HubLayoutSettings = settings.hubLayout || DEFAULT_HUB_LAYOUT;
  const appPermissions: Record<string, AppPermissionDetail> = settings.appPermissions || DEFAULT_APP_PERMISSIONS;

  const getUsernameError = (): string | null => {
    if (!identityTouched.username) return null;
    const trimmed = tempUsername.trim();
    if (!trimmed) return 'Username is required. Please specify a handle.';
    if (trimmed.length < 3) return `Username must be at least 3 characters (currently ${trimmed.length}).`;
    if (trimmed.length > 20) return `Username must be 20 characters or fewer (currently ${trimmed.length}).`;
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return 'Username can only contain alphanumeric letters, underscores, and dashes.';
    }
    return null;
  };

  const getEmailError = (): string | null => {
    if (!identityTouched.email) return null;
    const trimmed = tempEmail.trim();
    if (!trimmed) return 'Email address is required for local cryptographic signing.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Please enter a valid academic email address (e.g. user@institution.edu).';
    }
    return null;
  };

  const usernameError = getUsernameError();
  const emailError = getEmailError();
  const isIdentityValid = !usernameError && !emailError && tempUsername.trim().length >= 3 && tempEmail.trim().length >= 5;

  const handleSaveIdentity = () => {
    setIdentityTouched({ username: true, email: true });
    if (!isIdentityValid) {
      onShowToast({
        message: usernameError || emailError || 'Please resolve validation errors before saving.',
        type: 'warning'
      });
      return;
    }

    onUpdateSettings({
      username: tempUsername.trim(),
      email: tempEmail.trim()
    });
    setIsEditingIdentity(false);
    onShowToast({
      message: 'Scholarly credentials & identity updated.',
      type: 'success'
    });
  };

  // Role ecosystem configurations
  const roleSpecs: Record<
    UserRole,
    {
      title: string;
      tagline: string;
      icon: any;
      versionBadge: string;
      features: string[];
      ecosystemDeliverables: Array<{ label: string; value: string; hint: string }>;
      primaryFocus: string;
      libraryBias: string;
      workspaceLayout: string;
    }
  > = {
    Student: {
      title: 'Student Scholar Ecosystem',
      tagline: 'Coursework mastery, lecture scrubbing, active memory retrieval & anti-burnout pacing.',
      icon: GraduationCap,
      versionBadge: 'Roadmap: v1.1.6 Dedicated Update',
      features: [
        'Automated lecture audio scrubbing with interactive timestamped transcripts',
        'Multi-module quiz checkpoint testing with instant explanations',
        'Cognitive anti-burnout streak protection freeze algorithms',
        'Targeted syllabus alignment for upcoming exam milestones'
      ],
      ecosystemDeliverables: [
        { label: 'Active Course', value: 'COGS-492', hint: 'Neural Systems & UI' },
        { label: 'Quiz Readiness', value: '94.2%', hint: '3 Modules Mastered' },
        { label: 'Streak Safe', value: 'Protected', hint: '28-Day Flow Intact' },
        { label: 'Working Memory', value: 'Optimal', hint: '0 Tab Hop Clutter' }
      ],
      primaryFocus: 'Interactive lectures, quiz retention drills, and study notes.',
      libraryBias: 'Textbooks, course notebooks, interactive lessons, flashcards.',
      workspaceLayout: '8-Tab multi-modal lecture notes, document thesis, and milestone checklist.'
    },
    Researcher: {
      title: 'Investigator & Researcher Ecosystem',
      tagline: 'Hadal acoustic telemetry, citation graphs, arXiv preprints & experimental manuscripts.',
      icon: FlaskConical,
      versionBadge: 'Roadmap: v1.1.7 Dedicated Update',
      features: [
        'Deep Sources bibliographic indexing with DOI and arXiv direct sync',
        'PDF annotation engine with formula references & high-contrast notes',
        'Collaborative Google Docs thesis drafting with live section anchoring',
        'Zero-context switch research matrix across papers and WebAssembly code'
      ],
      ecosystemDeliverables: [
        { label: 'Indexed Papers', value: '42 Preprints', hint: 'arXiv & Hadal DB' },
        { label: 'Draft Progress', value: '§ 3.4', hint: 'Oceanic Acoustics Paper' },
        { label: 'Citation Score', value: '98.4%', hint: 'Peer Verification' },
        { label: 'Deep Sources', value: '14 Active', hint: 'Cross-Linked in Hub' }
      ],
      primaryFocus: 'Primary source synthesis, PDF annotations, and empirical manuscripts.',
      libraryBias: 'Technical specs, whitepapers, peer-reviewed journals, lab notebooks.',
      workspaceLayout: 'Research syntheses, PDF spec formula reader, and citation matrices.'
    },
    Educator: {
      title: 'Educator & Faculty Ecosystem',
      tagline: 'Curriculum architecture, 16:9 presentation slide decks, grading rubrics & student cohorts.',
      icon: BookOpen,
      versionBadge: 'Roadmap: v1.1.8 Dedicated Update',
      features: [
        '16:9 presentation slide deck builder with spatial visual templates',
        'Structured syllabus and module creation for seminar cohorts',
        'Cognitive load monitoring tools for optimizing classroom pacing',
        'Direct export to Google Docs, Slides, and printable study guides'
      ],
      ecosystemDeliverables: [
        { label: 'Active Cohort', value: '48 Scholars', hint: 'Fall Seminar 2026' },
        { label: 'Slide Decks', value: '4 Active', hint: 'Oceanic UI Architecture' },
        { label: 'Lesson Units', value: '12 Units', hint: 'Published to Library' },
        { label: 'Engagement', value: '96.8%', hint: 'Zero Attention Drop' }
      ],
      primaryFocus: 'Pedagogical curriculum design, slide authoring, and student engagement.',
      libraryBias: 'Curriculum syllabi, teaching guides, slide presentations, course units.',
      workspaceLayout: 'Presentation editor, lesson module viewer, and grading rubric scratchpad.'
    }
  };

  const currentRoleSpec = roleSpecs[settings.role || 'Student'];

  const handleRoleSelect = (newRole: UserRole) => {
    onUpdateSettings({ role: newRole });
    onShowToast(`Activated ${newRole} Ecosystem. Tailored tools & metrics aligned.`);
  };

  const handleSaveBio = () => {
    onUpdateSettings({ bio: tempBio.trim() });
    setIsEditingBio(false);
    onShowToast('Personal bio and academic statement updated');
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newGoalText.trim();
    if (!trimmed) {
      onShowToast({ message: 'Please enter a goal description (minimum 3 characters).', type: 'warning' });
      return;
    }
    if (trimmed.length < 3) {
      onShowToast({ message: `Goal is too brief (${trimmed.length}/3 chars). Please provide more detail.`, type: 'warning' });
      return;
    }
    const currentGoals = settings.goals || [];
    if (currentGoals.length >= 8) {
      onShowToast({ message: 'Maximum 8 active goals reached. Complete or archive one to add more.', type: 'warning' });
      return;
    }
    onUpdateSettings({ goals: [...currentGoals, trimmed] });
    setNewGoalText('');
    onShowToast({ message: `Goal registered: "${trimmed}"`, type: 'success' });
  };

  const handleRemoveGoal = (idx: number) => {
    const targetGoal = (settings.goals || [])[idx];
    const nextGoals = (settings.goals || [])[idx] ? (settings.goals || []).filter((_, i) => i !== idx) : [];
    onUpdateSettings({ goals: nextGoals });
    onShowToast({
      message: `Goal removed: "${targetGoal}"`,
      onUndo: () => {
        const restored = [...nextGoals];
        restored.splice(idx, 0, targetGoal);
        onUpdateSettings({ goals: restored });
      },
      undoLabel: 'Undo'
    });
  };

  const handleTogglePreference = <K extends keyof typeof settings.learningPreferences>(
    key: K,
    value: typeof settings.learningPreferences[K]
  ) => {
    const updatedPreferences = {
      ...settings.learningPreferences,
      [key]: value
    };
    onUpdateSettings({ learningPreferences: updatedPreferences });
    onShowToast(`Preference "${String(key)}" updated`);
  };

  // Hub Widget Customizer Handlers
  const handleApplyPreset = (preset: HubWidgetPreset) => {
    let updated: HubLayoutSettings;
    if (preset === 'minimal') {
      updated = {
        preset: 'minimal',
        showDateTime: false,
        showCompanionBubble: false,
        showPinnedContent: true,
        pinnedSlotCount: 4,
        customPinnedIds: hubLayout.customPinnedIds,
        showDueActivities: true,
        dueActivitiesLimit: 3,
        showTodoTasks: true,
        showFocusModeShortcuts: true,
        showCognitiveMetrics: false,
        showStudyLoungeTicker: false,
        showFlashcardQueue: false,
        showWeatherEffect: false
      };
    } else if (preset === 'balanced') {
      updated = {
        preset: 'balanced',
        showDateTime: true,
        showCompanionBubble: true,
        showPinnedContent: true,
        pinnedSlotCount: 4,
        customPinnedIds: hubLayout.customPinnedIds,
        showDueActivities: true,
        dueActivitiesLimit: 3,
        showTodoTasks: true,
        showFocusModeShortcuts: true,
        showCognitiveMetrics: false,
        showStudyLoungeTicker: false,
        showFlashcardQueue: false,
        showWeatherEffect: true
      };
    } else if (preset === 'maximal') {
      updated = {
        preset: 'maximal',
        showDateTime: true,
        showCompanionBubble: true,
        showPinnedContent: true,
        pinnedSlotCount: 4,
        customPinnedIds: hubLayout.customPinnedIds,
        showDueActivities: true,
        dueActivitiesLimit: 6,
        showTodoTasks: true,
        showFocusModeShortcuts: true,
        showCognitiveMetrics: true,
        showStudyLoungeTicker: true,
        showFlashcardQueue: true,
        showWeatherEffect: true
      };
    } else {
      updated = { ...hubLayout, preset: 'custom' };
    }

    onUpdateSettings({ hubLayout: updated });
    onShowToast(`Applied ${preset.toUpperCase()} Homepage layout preset`);
  };

  const handleToggleWidget = <K extends keyof HubLayoutSettings>(key: K, value: HubLayoutSettings[K]) => {
    const updated: HubLayoutSettings = {
      ...hubLayout,
      preset: 'custom',
      [key]: value
    };
    onUpdateSettings({ hubLayout: updated });
    onShowToast(`Updated widget setting: ${String(key)}`);
  };

  // App Permission Toggle Handlers
  const handleToggleAppPermission = (appName: string, permKey: keyof AppPermissionDetail) => {
    const current = appPermissions[appName] || {
      readAccess: true,
      writeAccess: false,
      backgroundSync: false,
      telemetryIsolation: true,
      lastSyncedAt: 'Just now'
    };

    const nextPerms = {
      ...appPermissions,
      [appName]: {
        ...current,
        [permKey]: !current[permKey],
        lastSyncedAt: 'Just now'
      }
    };

    onUpdateSettings({ appPermissions: nextPerms });
    onShowToast(`Updated ${appName} permission: ${String(permKey)}`);
  };

  const handleGenerateBackupCode = () => {
    setIsGeneratingBackupCode(true);
    setTimeout(() => {
      const code = `ATLAUZ-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setBackupCode(code);
      setIsGeneratingBackupCode(false);
      onShowToast('New emergency cryptographic backup key generated');
    }, 600);
  };

  const handleExportVault = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(settings, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `atlauz_profile_vault_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Personal Learning Vault snapshot exported as JSON');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 font-sans select-none">
      {/* Top Banner / Hero Profile Card */}
      <section
        style={{
          background: 'var(--theme-hero-bg, #121212)',
          borderColor: 'var(--theme-card-border, #404040)'
        }}
        className="border-2 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.35)',
                borderColor: 'var(--theme-card-border, #ffffff)',
                color: 'var(--theme-text-primary, #ffffff)'
              }}
              className="w-16 h-16 rounded-xl border-2 flex items-center justify-center shrink-0 shadow-inner font-mono text-xl font-extrabold"
            >
              {settings.username.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  style={{ color: 'var(--theme-text-primary, #ffffff)' }}
                  className="text-xl sm:text-2xl font-black tracking-tight font-mono drop-shadow-sm"
                >
                  {settings.username}
                </h1>
                <span
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    color: 'var(--theme-text-primary, #ffffff)',
                    borderColor: 'rgba(255,255,255,0.3)'
                  }}
                  className="px-2.5 py-0.5 text-xs font-mono font-extrabold rounded-md border uppercase shadow-xs"
                >
                  {settings.role}
                </span>
                <span
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.25)',
                    color: 'var(--theme-text-secondary, #e5e5e5)'
                  }}
                  className="px-2.5 py-0.5 text-xs font-mono font-bold rounded-md border border-white/20"
                >
                  {settings.personality.split('&')[0].trim()}
                </span>
              </div>
              <p style={{ color: 'var(--theme-text-secondary, #d4d4d4)' }} className="text-xs font-bold mt-1 font-mono">{settings.email}</p>
              <p style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-xs font-medium mt-0.5">
                {settings.institution} • {settings.department}
              </p>
            </div>
          </div>

          {/* Quick Lock / Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onLockSession}
              style={{
                backgroundColor: 'var(--theme-action-btn-bg, #ffffff)',
                color: 'var(--theme-action-btn-text, #000000)',
                borderColor: 'rgba(255, 255, 255, 0.4)'
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-extrabold border transition-all hover:scale-105 active:scale-95 shadow-md"
              title="Immediately lock workspace with biometric security"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>
            <button
              onClick={handleExportVault}
              style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                borderColor: 'rgba(255, 255, 255, 0.3)',
                color: 'var(--theme-text-primary, #ffffff)'
              }}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold border transition-all hover:opacity-90 active:scale-95 shadow-xs"
              title="Export complete encrypted vault snapshot"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Vault</span>
            </button>
          </div>
        </div>

        {/* Prototype Architecture Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-white/20 overflow-x-auto custom-right-scrollbar pb-1">
          {[
            { id: 'ecosystem', label: '1. Role Ecosystem & Personas', icon: Compass },
            { id: 'hub_customizer', label: '2. Hub & Widget Customizer', icon: SlidersHorizontal },
            { id: 'preferences', label: '3. Learning Preferences', icon: Sliders },
            { id: 'identity', label: '4. Bio & Personality', icon: User },
            { id: 'security', label: '5. Account, Security & App Permissions', icon: Shield },
            { id: 'credits', label: '6. Atlauz.co Team & Credits', icon: Users }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold tracking-wide border-b-2 transition-all whitespace-nowrap font-mono ${
                  isActive
                    ? 'border-white text-white bg-neutral-800/60'
                    : 'border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/30'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* SECTION 1: ROLE ECOSYSTEM & PERSONALIZED ARCHITECTURE                     */}
      {/* ========================================================================= */}
      {activeSection === 'ecosystem' && (
        <section className="space-y-6">
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-5 shadow-xl transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2
                  style={{ color: 'var(--theme-text-primary, #ffffff)' }}
                  className="text-base font-bold flex items-center gap-2 font-mono drop-shadow-sm"
                >
                  <Compass className="w-4 h-4" />
                  Academic Roles & Active Ecosystem Architecture
                </h2>
                <p style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-xs mt-1 font-sans">
                  Student, Researcher, and Educator roles possess fundamentally distinct focus demands. Select your primary ecosystem to tailor workspace layouts, priority queues, and library bias.
                </p>
              </div>
            </div>

            {/* 3 Role Selection Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(['Student', 'Researcher', 'Educator'] as UserRole[]).map(r => {
                const spec = roleSpecs[r];
                const Icon = spec.icon;
                const isSelected = settings.role === r;

                return (
                  <div
                    key={r}
                    onClick={() => handleRoleSelect(r)}
                    style={{
                      background: isSelected ? 'var(--theme-card-surface, rgba(255,255,255,0.1))' : 'rgba(0,0,0,0.3)',
                      borderColor: isSelected ? 'var(--theme-accent, #ffffff)' : 'var(--theme-card-border, #404040)'
                    }}
                    className={`cursor-pointer rounded-xl p-4 border-2 transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'shadow-lg ring-1 ring-white/50 scale-[1.01]'
                        : 'hover:opacity-90'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            style={{
                              backgroundColor: isSelected ? 'var(--theme-action-btn-bg, #ffffff)' : 'rgba(0,0,0,0.4)',
                              color: isSelected ? 'var(--theme-action-btn-text, #000000)' : 'var(--theme-text-primary, #ffffff)',
                              borderColor: 'var(--theme-card-border, #404040)'
                            }}
                            className="p-2 rounded-lg border"
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <h3 style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-sm font-bold font-mono">{r}</h3>
                        </div>
                        {isSelected && (
                          <span
                            style={{
                              backgroundColor: 'var(--theme-action-btn-bg, #ffffff)',
                              color: 'var(--theme-action-btn-text, #000000)'
                            }}
                            className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full font-mono shadow-xs"
                          >
                            <Check className="w-3 h-3 stroke-[3]" />
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p style={{ color: 'var(--theme-text-secondary, #e5e5e5)' }} className="text-xs leading-relaxed font-sans min-h-[36px]">
                        {spec.tagline}
                      </p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10 space-y-2">
                      <div className="text-[11px] font-mono">
                        <span style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="font-bold block mb-0.5">Workspace Template:</span>
                        <span style={{ color: 'var(--theme-text-muted, #a3a3a3)' }}>{spec.workspaceLayout}</span>
                      </div>
                      <span
                        style={{
                          backgroundColor: 'var(--theme-badge-bg, rgba(0,0,0,0.4))',
                          color: 'var(--theme-badge-text, #ffffff)',
                          borderColor: 'var(--theme-card-border, #404040)'
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded border block text-center font-bold"
                      >
                        {spec.versionBadge}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Ecosystem Breakdown & Deliverables */}
            <div
              style={{
                backgroundColor: 'rgba(0,0,0,0.35)',
                borderColor: 'var(--theme-card-border, #404040)'
              }}
              className="mt-5 p-4 rounded-xl border font-mono"
            >
              <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Active Ecosystem Deliverables: {settings.role}
                </span>
                <span className="text-[11px] text-emerald-400 font-bold">● Synchronized</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                {currentRoleSpec.ecosystemDeliverables.map((deliv, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-neutral-900 border border-neutral-800">
                    <span className="text-[10px] text-neutral-400 block">{deliv.label}</span>
                    <span className="text-sm font-bold text-white block mt-0.5">{deliv.value}</span>
                    <span className="text-[10px] text-neutral-500 block truncate mt-0.5 font-sans">{deliv.hint}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Dynamic Competency Skill Radar Visualizer */}
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-5 space-y-3 font-sans shadow-xl"
          >
            <div>
              <h3 style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-base font-bold flex items-center gap-2 font-mono">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Scholar Competency Skill Radar</span>
              </h3>
              <p style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-xs mt-1">
                Multi-axis domain mastery vectors dynamically calculated from completed modules, syllabi milestones, and timed capstone exams.
              </p>
            </div>
            <SkillRadarChart competencies={competencies} />
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: HUB & WIDGET CUSTOMIZER (v1.1.5 Modular Customization)          */}
      {/* ========================================================================= */}
      {activeSection === 'hub_customizer' && (
        <section className="space-y-6 font-mono">
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-5 space-y-5 max-h-[680px] overflow-y-auto pr-2 custom-right-scrollbar shadow-xl"
          >
            <div className="border-b border-white/10 pb-4">
              <h2 style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-base font-bold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Homepage (Daily Hub) Widget Customizer</span>
              </h2>
              <p style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-xs mt-1 font-sans">
                Customize your homepage layout just like assembling phone widgets. Reduce visual clutter by showing only urgent action cards, or enable the full academic living suite.
              </p>
            </div>

            {/* Layout Presets Switcher */}
            <div>
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-2">
                1. Select Layout Density Preset:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  { id: 'minimal', label: 'Minimalist', desc: 'Barebones 2-col wireframe with urgent priorities only' },
                  { id: 'balanced', label: 'Balanced (Default)', desc: 'Wireframe + Date/Time + Pet greeting bubble' },
                  { id: 'maximal', label: 'Maximalist', desc: 'Full academic cockpit with living suite & telemetry' },
                  { id: 'custom', label: 'Custom Matrix', desc: 'Manually toggled component configurations' }
                ].map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleApplyPreset(p.id as HubWidgetPreset)}
                    className={`p-3 rounded-lg border text-left transition-all ${
                      hubLayout.preset === p.id
                        ? 'bg-neutral-800 border-white ring-1 ring-white/50 text-white'
                        : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                    }`}
                  >
                    <span className="text-xs font-bold block text-white">{p.label}</span>
                    <span className="text-[10px] text-neutral-400 block font-sans mt-1 leading-snug">
                      {p.desc}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Live Interactive Wireframe Mini-Preview Thumbnail */}
            <div className="p-4 rounded-xl bg-black border border-neutral-800 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Live Homepage Layout Wireframe Preview</span>
                </span>
                <span className="text-[10px] text-neutral-500">
                  Preset: {hubLayout.preset.toUpperCase()}
                </span>
              </div>

              {/* Wireframe Box Representation */}
              <div className="border border-dashed border-neutral-700 rounded-lg p-3 bg-neutral-950/80 space-y-2 text-[10px]">
                {hubLayout.showDateTime && (
                  <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 flex items-center justify-between">
                    <span>[Header] Tue, Oct 6 · {settings.role} Ecosystem</span>
                    <span>[Sovereign Mode]</span>
                  </div>
                )}

                {hubLayout.showCompanionBubble && (
                  <div className="p-2 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 flex items-center gap-2">
                    <span className="w-4 h-4 rounded bg-neutral-800 inline-block text-center text-[8px]">🐟</span>
                    <span className="truncate font-sans">"Zero friction: 0 context switches across all-in-one tools."</span>
                  </div>
                )}

                {/* 2-Column Wireframe Grid Preview */}
                <div className="grid grid-cols-2 gap-2">
                  {hubLayout.showPinnedContent ? (
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="font-bold text-white block">📌 Pinned Content (4 Slots)</span>
                      <div className="grid grid-cols-2 gap-1 text-[8px] text-neutral-400">
                        <span className="bg-black p-1 rounded">📄 Docs 1</span>
                        <span className="bg-black p-1 rounded">📊 Slides 3</span>
                        <span className="bg-black p-1 rounded">❄️ Streaks</span>
                        <span className="bg-black p-1 rounded">📓 Notebook</span>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded border border-neutral-900 text-neutral-600 text-center flex items-center justify-center">
                      (Pinned Content Disabled)
                    </div>
                  )}

                  {hubLayout.showFocusModeShortcuts ? (
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="font-bold text-white block">🎯 Focus Shortcuts (4)</span>
                      <div className="space-y-0.5 text-[8px] text-neutral-400">
                        <div className="bg-black px-1.5 py-0.5 rounded">1. Focus Mode</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">2. Bento Mode</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">3. Pile Mode</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">4. Collab Mode</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded border border-neutral-900 text-neutral-600 text-center flex items-center justify-center">
                      (Focus Shortcuts Disabled)
                    </div>
                  )}

                  {hubLayout.showDueActivities ? (
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="font-bold text-amber-300 block">⏰ Due Activities (Top 3)</span>
                      <div className="space-y-0.5 text-[8px] text-neutral-400">
                        <div className="bg-black px-1.5 py-0.5 rounded text-amber-200">1. Problem Set (Today)</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">2. Midterm Exam (Tomorrow)</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">3. Capstone Window (2d)</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded border border-neutral-900 text-neutral-600 text-center flex items-center justify-center">
                      (Due Activities Disabled)
                    </div>
                  )}

                  {hubLayout.showTodoTasks ? (
                    <div className="p-2.5 rounded bg-neutral-900 border border-neutral-800 space-y-1">
                      <span className="font-bold text-emerald-300 block">☑️ To-Do-Tasks</span>
                      <div className="space-y-0.5 text-[8px] text-neutral-400">
                        <div className="bg-black px-1.5 py-0.5 rounded">☑ Draft intro in Docs 1</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">☐ Review slides § 3.4</div>
                        <div className="bg-black px-1.5 py-0.5 rounded">☐ Biology verification check</div>
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded border border-neutral-900 text-neutral-600 text-center flex items-center justify-center">
                      (To-Do Tasks Disabled)
                    </div>
                  )}
                </div>

                {hubLayout.showStudyLoungeTicker && (
                  <div className="p-1.5 rounded bg-neutral-900 border border-neutral-800 text-[9px] text-cyan-300">
                    👥 Living Study Suite Active: Flashcards, Lounge, Note Graph & Eye Break
                  </div>
                )}
              </div>
            </div>

            {/* Granular Component Switches Matrix */}
            <div>
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider block mb-3">
                2. Granular Component Visibility Switches:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {/* Switch 1: Date and Time Bar */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Date & Time Header</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Displays weekday, date, and ecosystem sovereign state
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showDateTime', !hubLayout.showDateTime)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showDateTime ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showDateTime ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 2: Companion Greeting Bubble */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Companion Speech Balloon</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      40-75s rotating focus quotes and motivational thoughts
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showCompanionBubble', !hubLayout.showCompanionBubble)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showCompanionBubble ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showCompanionBubble ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 3: Pinned Content Matrix */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Pinned Content Matrix</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      4 fast-transport tiles to active docs, slides, and notes
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showPinnedContent', !hubLayout.showPinnedContent)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showPinnedContent ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showPinnedContent ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 4: Focus Mode Shortcut */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Focus Mode Shortcuts</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      1-click launch into Focus, Bento, Pile, and Collab modes
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showFocusModeShortcuts', !hubLayout.showFocusModeShortcuts)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showFocusModeShortcuts ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showFocusModeShortcuts ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 5: Due Activities Feed */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Due Activities Feed</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Impending exams, expiring courses, and assignment deadlines
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showDueActivities', !hubLayout.showDueActivities)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showDueActivities ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showDueActivities ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 6: To-Do-Tasks */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Cross-Document To-Do-Tasks</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Actionable task checklist with 1-click jump to source docs
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showTodoTasks', !hubLayout.showTodoTasks)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showTodoTasks ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showTodoTasks ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 7: Living Suite & Study Lounge */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Living Study Suite Widgets</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Flashcards, Study Lounge co-presence, and note graph
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      const next = !hubLayout.showStudyLoungeTicker;
                      handleToggleWidget('showStudyLoungeTicker', next);
                      handleToggleWidget('showFlashcardQueue', next);
                    }}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showStudyLoungeTicker ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showStudyLoungeTicker ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>

                {/* Switch 8: Aquarium Weather Shaders */}
                <div className="p-3.5 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-3">
                  <div>
                    <span className="font-bold text-white block">Aquarium Ambient Weather</span>
                    <span className="text-[11px] text-neutral-400 block font-sans">
                      Sunlight shafts, rain ripples, and lunar midnight abyss
                    </span>
                  </div>
                  <button
                    onClick={() => handleToggleWidget('showWeatherEffect', !hubLayout.showWeatherEffect)}
                    className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      hubLayout.showWeatherEffect ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full transition-transform ${hubLayout.showWeatherEffect ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: LEARNING PREFERENCES TOGGLES & STYLES                          */}
      {/* ========================================================================= */}
      {activeSection === 'preferences' && (
        <section className="space-y-6">
          {/* Primary & Secondary Learning Styles */}
          <div
            style={{
              background: 'var(--theme-card-gradient, #121212)',
              borderColor: 'var(--theme-card-border, #404040)'
            }}
            className="border-2 rounded-xl p-5 shadow-xl transition-all duration-300"
          >
            <h2 style={{ color: 'var(--theme-text-primary, #ffffff)' }} className="text-base font-bold flex items-center gap-2 font-mono mb-1">
              <Sliders className="w-4 h-4" />
              Cognitive Learning Style Configuration
            </h2>
            <p style={{ color: 'var(--theme-text-muted, #a3a3a3)' }} className="text-xs mb-4 font-sans">
              Select your primary and secondary cognitive modalities to tune interface densities, layout cues, and sensory pacing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEARNING_STYLES.map(item => {
                const isPrimary = settings.learningPreferences?.primaryStyle === item.style;
                const isSecondary = settings.learningPreferences?.secondaryStyle === item.style;

                return (
                  <div
                    key={item.style}
                    className={`rounded-lg p-4 border transition-all ${
                      isPrimary
                        ? 'bg-neutral-800 border-white ring-1 ring-white/40'
                        : isSecondary
                        ? 'bg-neutral-900 border-neutral-500'
                        : 'bg-neutral-950 border-neutral-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-bold text-white font-mono">{item.style}</div>
                      <div className="flex items-center gap-1.5">
                        {isPrimary && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-black font-bold">
                            PRIMARY
                          </span>
                        )}
                        {isSecondary && !isPrimary && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-700 text-neutral-200 font-bold border border-neutral-600">
                            SECONDARY
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3 font-sans">
                      {item.description}
                    </p>

                    <div className="flex gap-2 pt-2 border-t border-neutral-800/80">
                      <button
                        onClick={() => handleTogglePreference('primaryStyle', item.style)}
                        disabled={isPrimary}
                        className={`px-2.5 py-1 text-[11px] rounded font-mono font-bold transition-all ${
                          isPrimary
                            ? 'bg-white text-black cursor-default'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                        }`}
                      >
                        Set Primary
                      </button>
                      <button
                        onClick={() => handleTogglePreference('secondaryStyle', item.style)}
                        disabled={isSecondary}
                        className={`px-2.5 py-1 text-[11px] rounded font-mono font-bold transition-all ${
                          isSecondary
                            ? 'bg-neutral-700 text-white cursor-default border border-neutral-600'
                            : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700'
                        }`}
                      >
                        Set Secondary
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 23 Living Themes & Conceptual Atmosphere Section (v1.3.0) */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4 font-mono">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-amber-400" />
                  <span>23 Handcrafted Living Themes & Atmosphere</span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans mt-0.5">
                  Refined ROYGBIV-ordered mature palettes featuring adaptive color shades, subtle ambient textures, and synchronized aquarium lighting.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-amber-300 border border-neutral-750">
                v1.3.0 Active
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[520px] overflow-y-auto pr-2 custom-right-scrollbar">
              {Object.values(ATLAUZ_THEMES).map(t => {
                const isSelected = settings.theme === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => {
                      onUpdateSettings({ theme: t.id });
                      onShowToast(`Applied theme "${t.name}"`);
                    }}
                    style={{
                      backgroundColor: t.colors.bgPrimary,
                      borderColor: isSelected ? t.colors.accent : t.colors.cardBorder
                    }}
                    className={`cursor-pointer rounded-xl p-3.5 border transition-all relative overflow-hidden flex flex-col justify-between min-h-[130px] ${
                      isSelected
                        ? 'ring-2 ring-white/70 shadow-xl'
                        : 'hover:border-neutral-500 opacity-90 hover:opacity-100'
                    }`}
                  >
                    {/* Ambient Background Texture */}
                    <div
                      className="absolute inset-0 pointer-events-none opacity-40"
                      style={{ background: t.texturePattern }}
                    />

                    <div className="relative z-10 space-y-1">
                      <div className="flex items-center justify-between">
                        <span
                          style={{ color: t.colors.textPrimary }}
                          className="text-xs font-bold font-sans block truncate"
                        >
                          {t.name}
                        </span>
                        {isSelected && (
                          <span
                            style={{ backgroundColor: t.colors.accent, color: '#000' }}
                            className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <p
                        style={{ color: t.colors.textSecondary }}
                        className="text-[10px] font-sans line-clamp-2 leading-tight"
                      >
                        {t.tagline}
                      </p>
                    </div>

                    <div className="relative z-10 pt-2 flex items-center justify-between border-t border-white/10 mt-2">
                      <div className="flex items-center gap-1">
                        {t.swatches.map((color, cIdx) => (
                          <div
                            key={cIdx}
                            style={{ backgroundColor: color }}
                            className="w-3.5 h-3.5 rounded-full border border-black/30 shadow-xs"
                          />
                        ))}
                      </div>
                      <span
                        style={{
                          backgroundColor: t.colors.badgeBg,
                          color: t.colors.badgeText,
                          borderColor: t.colors.cardBorder
                        }}
                        className="px-1.5 py-0.5 rounded-full border text-[8px] font-bold uppercase truncate max-w-[90px]"
                      >
                        {t.id.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 4: BIO & PERSONALITY                                              */}
      {/* ========================================================================= */}
      {activeSection === 'identity' && (
        <section className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                <User className="w-4 h-4 text-white" />
                Academic Identity & Statement
              </h2>
              {!isEditingIdentity ? (
                <button
                  onClick={() => setIsEditingIdentity(true)}
                  className="px-3 py-1 bg-white text-black font-mono text-xs font-bold rounded hover:bg-neutral-200 transition-all"
                >
                  Edit Credentials
                </button>
              ) : (
                <div className="flex gap-2 font-mono">
                  <button
                    onClick={() => {
                      setTempUsername(settings.username);
                      setTempEmail(settings.email);
                      setIsEditingIdentity(false);
                    }}
                    className="px-2.5 py-1 bg-neutral-800 text-neutral-300 text-xs rounded hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveIdentity}
                    className="px-3 py-1 bg-white text-black font-bold text-xs rounded hover:bg-neutral-200"
                  >
                    Save
                  </button>
                </div>
              )}
            </div>

            {isEditingIdentity ? (
              <div className="space-y-3 font-mono text-xs">
                <div>
                  <label className="text-neutral-400 block mb-1">Scholar Handle</label>
                  <input
                    type="text"
                    value={tempUsername}
                    onChange={e => {
                      setTempUsername(e.target.value);
                      setIdentityTouched(p => ({ ...p, username: true }));
                    }}
                    className="w-full bg-black border border-neutral-700 rounded p-2 text-white outline-none focus:border-white"
                  />
                  {usernameError && <p className="text-[11px] text-red-400 mt-1">{usernameError}</p>}
                </div>
                <div>
                  <label className="text-neutral-400 block mb-1">Academic Email</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={e => {
                      setTempEmail(e.target.value);
                      setIdentityTouched(p => ({ ...p, email: true }));
                    }}
                    className="w-full bg-black border border-neutral-700 rounded p-2 text-white outline-none focus:border-white"
                  />
                  {emailError && <p className="text-[11px] text-red-400 mt-1">{emailError}</p>}
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-xs font-mono text-neutral-300">
                <p>Handle: <strong className="text-white">@{settings.username}</strong></p>
                <p>Verified Email: <strong className="text-white">{settings.email}</strong></p>
              </div>
            )}

            {/* Academic Bio / Statement */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">
                  Academic Focus Statement:
                </span>
                {!isEditingBio ? (
                  <button
                    onClick={() => {
                      setTempBio(settings.bio);
                      setIsEditingBio(true);
                    }}
                    className="text-neutral-400 hover:text-white text-xs font-mono underline"
                  >
                    Edit Statement
                  </button>
                ) : (
                  <div className="flex gap-2 font-mono">
                    <button
                      onClick={() => setIsEditingBio(false)}
                      className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveBio}
                      className="px-2.5 py-0.5 rounded bg-white text-black font-bold text-[11px]"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {isEditingBio ? (
                <textarea
                  value={tempBio}
                  onChange={e => setTempBio(e.target.value)}
                  className="w-full h-24 bg-black border border-neutral-700 rounded-lg p-2.5 text-xs text-white placeholder-neutral-500 font-sans focus:outline-none focus:border-white"
                />
              ) : (
                <p className="text-xs text-neutral-300 font-sans leading-relaxed p-3 rounded-lg bg-black border border-neutral-800">
                  "{settings.bio}"
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 5: ACCOUNT, SECURITY & GRANULAR APP PERMISSIONS                   */}
      {/* ========================================================================= */}
      {activeSection === 'security' && (
        <section className="space-y-6 font-mono">
          {/* INTEGRATED APPLICATIONS & GRANULAR PERMISSIONS */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Integrated Applications & Sovereign Permissions</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1 font-sans">
                  Every connected external tool requires explicit user permission. Configure granular read, write, background sync, and local telemetry shielding.
                </p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-emerald-400 border border-neutral-800">
                100% Client Sovereign
              </span>
            </div>

            <div className="space-y-3">
              {Object.entries(appPermissions).map(([appName, perms]) => (
                <div key={appName} className="p-4 rounded-xl bg-black border border-neutral-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-850 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-white text-xs font-bold">
                        {appName.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">{appName}</span>
                        <span className="text-[10px] text-neutral-500 block font-sans">
                          Status: Active Token · Last Synced: {perms.lastSyncedAt || 'Recent'}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 font-bold self-start sm:self-auto">
                      ● Local Isolation Shield Active
                    </span>
                  </div>

                  {/* 4 Granular Permission Toggles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                    {/* Perm 1: Read Access */}
                    <button
                      type="button"
                      onClick={() => handleToggleAppPermission(appName, 'readAccess')}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between gap-1 transition-all ${
                        perms.readAccess
                          ? 'bg-neutral-900 border-neutral-700 text-white'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                      }`}
                    >
                      <span className="text-[11px]">Read Data</span>
                      {perms.readAccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-neutral-600" />}
                    </button>

                    {/* Perm 2: Write Access */}
                    <button
                      type="button"
                      onClick={() => handleToggleAppPermission(appName, 'writeAccess')}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between gap-1 transition-all ${
                        perms.writeAccess
                          ? 'bg-neutral-900 border-neutral-700 text-white'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                      }`}
                    >
                      <span className="text-[11px]">Export / Write</span>
                      {perms.writeAccess ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-neutral-600" />}
                    </button>

                    {/* Perm 3: Background Sync */}
                    <button
                      type="button"
                      onClick={() => handleToggleAppPermission(appName, 'backgroundSync')}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between gap-1 transition-all ${
                        perms.backgroundSync
                          ? 'bg-neutral-900 border-neutral-700 text-white'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                      }`}
                    >
                      <span className="text-[11px]">Auto-Sync</span>
                      {perms.backgroundSync ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-neutral-600" />}
                    </button>

                    {/* Perm 4: Telemetry Isolation */}
                    <button
                      type="button"
                      onClick={() => handleToggleAppPermission(appName, 'telemetryIsolation')}
                      className={`p-2 rounded-lg border text-left flex items-center justify-between gap-1 transition-all ${
                        perms.telemetryIsolation
                          ? 'bg-neutral-900 border-emerald-700 text-emerald-300'
                          : 'bg-neutral-950 border-neutral-850 text-neutral-500'
                      }`}
                    >
                      <span className="text-[11px]">Shield Isolation</span>
                      {perms.telemetryIsolation ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-neutral-600" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Cryptographic Account & Biometric Security */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-white" />
              Cryptographic Account & Biometric Security
            </h2>

            <div className="space-y-3">
              {/* Biometrics Toggle */}
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neutral-900 text-white border border-neutral-700 mt-0.5">
                    <Fingerprint className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Biometric Passkey Authentication</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                      Enforces TouchID / FaceID / WebAuthn passkey handshake when unlocking.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !settings.biometricsEnabled;
                    onUpdateSettings({ biometricsEnabled: next });
                    onShowToast(next ? 'Biometric Passkey Enabled' : 'Biometric Passkey Disabled');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.biometricsEnabled ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-transform ${settings.biometricsEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                </button>
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neutral-900 text-white border border-neutral-700 mt-0.5">
                    <Key className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Two-Factor Authenticator (2FA / TOTP)</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5 font-sans">
                      Requires rotating time-based tokens for changing profile keys.
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !settings.twoFactorEnabled;
                    onUpdateSettings({ twoFactorEnabled: next });
                    onShowToast(next ? 'Two-Factor Authentication Active' : 'Two-Factor Disabled');
                  }}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.twoFactorEnabled ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full transition-transform ${settings.twoFactorEnabled ? 'translate-x-5 bg-black' : 'translate-x-0 bg-neutral-400'}`} />
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ========================================================================= */}
      {/* SECTION 6: ATLAUZ.CO ENGINEERING CREW & CREDITS                           */}
      {/* ========================================================================= */}
      {activeSection === 'credits' && (
        <section className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black border border-neutral-700 text-white flex items-center justify-center shrink-0 shadow-inner">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                    <span>The Atlauz.co Engineering Crew</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-950 text-emerald-400 border border-neutral-800">
                      6 Core Developers
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-400 mt-0.5 font-sans">
                    Founders and contributors of the deterministic academic workstation platform.
                  </p>
                </div>
              </div>

              {onOpenVersionHistory && (
                <button
                  onClick={onOpenVersionHistory}
                  className="px-3 py-1.5 rounded-md bg-neutral-950 hover:bg-neutral-800 text-white border border-neutral-750 font-mono text-xs font-bold flex items-center gap-2 transition-all self-start sm:self-auto"
                >
                  <GitCommit className="w-3.5 h-3.5 text-neutral-300" />
                  <span>Open System Patch Log</span>
                </button>
              )}
            </div>

            {/* Engineering Attribution Summary */}
            <div className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 font-mono text-xs space-y-2">
              <div className="flex items-center gap-2 text-neutral-300 font-bold">
                <span className="w-2 h-2 rounded-full bg-white inline-block" />
                <span>Author & Engineering Attribution Architecture</span>
              </div>
              <ul className="text-[11px] text-neutral-400 space-y-1 pl-4 list-disc font-sans">
                <li><strong className="text-neutral-200 font-mono">Before v1.0.0 (Legacy Genesis Archive):</strong> Full founding crew (Developer Gultiano, Developer Belo, Developer Abalos, Developer Mabini, Developer Paycana, and Developer Antonio).</li>
                <li><strong className="text-neutral-200 font-mono">v1.0.0 (Foundation Prototype):</strong> Developer Gultiano.</li>
                <li><strong className="text-neutral-200 font-mono">Next Release (v1.1.0 Workstation Streamline):</strong> Developer Gultiano and Developer Belo.</li>
                <li><strong className="text-neutral-200 font-mono">Subsequent Releases (v1.1.1, v1.1.2, v1.1.3, v1.1.4, v1.1.5):</strong> Developer Gultiano.</li>
              </ul>
            </div>

            {/* Interactive 6 Developer Roster Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {ATLAUZ_ENGINEERING_CREW.map(member => {
                const isSelected = selectedCrewMember === member.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedCrewMember(isSelected ? null : member.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-950 border-neutral-600 ring-1 ring-neutral-500'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-950'
                    }`}
                  >
                    <div>
                      <div className="flex items-start gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-black border border-neutral-800 text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-inner group-hover:border-neutral-600 font-mono">
                          {member.avatarGlyph}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate font-mono">
                            {member.name}
                          </h4>
                          <span className="text-[10px] text-neutral-400 block truncate font-sans mt-0.5">
                            {member.role}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-neutral-800/80 text-[10px] text-neutral-400 flex items-center justify-between font-mono">
                        <span className="text-neutral-500">Focus:</span>
                        <span className="text-neutral-300 font-semibold truncate max-w-[140px] text-right">
                          {member.id === 'gultiano' ? 'Lead Core v1.0+' : member.id === 'belo' ? 'v1.1.0 & Genesis' : 'Genesis Core'}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="mt-3 pt-2.5 border-t border-neutral-800 space-y-1.5 font-sans text-xs text-neutral-300">
                        <p><strong className="text-white font-mono text-[10px] block text-neutral-400">Subsystems:</strong> {member.subsystems}</p>
                        <p><strong className="text-white font-mono text-[10px] block text-neutral-400 mt-1">Contributions:</strong> {member.contributions}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Archival Terminal Genesis Footnote */}
            <div className="p-3 rounded-lg bg-black border border-neutral-800 flex items-start gap-2.5 text-xs text-neutral-400 font-sans">
              <Terminal className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong className="text-white font-mono">Team Entity:</strong> The official engineering team behind Atlauz is <strong className="text-white">Atlauz.co</strong>. All software modules, cognitive layouts, and physical simulations are engineered locally without external telemetry.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
