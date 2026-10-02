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
  ArrowRight
} from 'lucide-react';
import {
  UserAccountSettings,
  UserRole,
  PersonalityType,
  LearningStyle
} from '../types';

interface ProfileViewProps {
  settings: UserAccountSettings;
  onUpdateSettings: (updated: Partial<UserAccountSettings>) => void;
  onShowToast: (msg: string | { message: string; type?: 'info' | 'success' | 'warning' | 'error'; onUndo?: () => void; undoLabel?: string }) => void;
  onLockSession: () => void;
  onSwitchTab?: (tab: 'hub' | 'library' | 'workspace' | 'companion') => void;
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

export const ProfileView: React.FC<ProfileViewProps> = ({
  settings,
  onUpdateSettings,
  onShowToast,
  onLockSession,
  onSwitchTab
}) => {
  const [activeSection, setActiveSection] = useState<'ecosystem' | 'preferences' | 'identity' | 'security'>('ecosystem');
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

  const getUsernameError = (): string | null => {
    if (!identityTouched.username) return null;
    const trimmed = tempUsername.trim();
    if (!trimmed) return 'Username is required. Please specify a handle.';
    if (trimmed.length < 3) return `Username must be at least 3 characters (currently ${trimmed.length}).`;
    if (trimmed.length > 20) return `Username must be 20 characters or fewer (currently ${trimmed.length}).`;
    if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
      return 'Username may only contain letters, numbers, hyphens, and underscores.';
    }
    return null;
  };

  const getEmailError = (): string | null => {
    if (!identityTouched.email) return null;
    const trimmed = tempEmail.trim();
    if (!trimmed) return 'Email address is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      return 'Please enter a valid email address (e.g. scholar@university.edu).';
    }
    return null;
  };

  const usernameError = getUsernameError();
  const emailError = getEmailError();

  const handleSaveIdentity = () => {
    setIdentityTouched({ username: true, email: true });
    const uTrimmed = tempUsername.trim();
    const eTrimmed = tempEmail.trim();
    const uErr = uTrimmed.length < 3 || uTrimmed.length > 20 || !/^[a-zA-Z0-9_-]+$/.test(uTrimmed);
    const eErr = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(eTrimmed);
    if (uErr || eErr) {
      onShowToast({
        message: 'Please resolve input validation errors before saving.',
        type: 'error'
      });
      return;
    }
    onUpdateSettings({
      username: uTrimmed,
      email: eTrimmed
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
    const nextGoals = (settings.goals || []).filter((_, i) => i !== idx);
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
      <section className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-neutral-800 border-2 border-neutral-600 flex items-center justify-center shrink-0 shadow-inner">
              <User className="w-8 h-8 text-neutral-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                  {settings.username}
                </h1>
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-neutral-800 text-neutral-200 border border-neutral-700 uppercase">
                  {settings.role}
                </span>
                <span className="px-2 py-0.5 text-xs font-mono rounded bg-neutral-800 text-neutral-400 border border-neutral-700">
                  {settings.personality.split('&')[0].trim()}
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 font-mono">{settings.email}</p>
              <p className="text-xs text-neutral-400 mt-0.5">
                {settings.institution} • {settings.department}
              </p>
            </div>
          </div>

          {/* Quick Lock / Export Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onLockSession}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold transition-all active:scale-95"
              title="Immediately lock workspace with biometric security"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Lock Session</span>
            </button>
            <button
              onClick={handleExportVault}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-neutral-950 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 text-xs font-bold transition-all active:scale-95"
              title="Export complete encrypted vault snapshot"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Vault</span>
            </button>
          </div>
        </div>

        {/* Prototype Architecture Navigation Sub-Tabs */}
        <div className="flex items-center gap-1 mt-6 border-b border-neutral-800 overflow-x-auto no-scrollbar">
          {[
            { id: 'ecosystem', label: '1. Role Ecosystem', icon: Compass },
            { id: 'preferences', label: '2. Learning Preferences', icon: Sliders },
            { id: 'identity', label: '3. Bio & Personality', icon: User },
            { id: 'security', label: '4. Account & Security', icon: Shield }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeSection === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold tracking-wide border-b-2 transition-all whitespace-nowrap ${
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

      {/* SECTION 1: ROLE ECOSYSTEM & PERSONALIZED ARCHITECTURE */}
      {activeSection === 'ecosystem' && (
        <section className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono">
                  <Compass className="w-4 h-4 text-white" />
                  Select Academic Role & Active Ecosystem
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Each role activates a tailored ecosystem across the Hub, Library collections, and Workspace multi-tabs.
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
                    className={`cursor-pointer rounded-lg p-4 border transition-all relative ${
                      isSelected
                        ? 'bg-neutral-800 border-white shadow-lg ring-1 ring-white/50'
                        : 'bg-neutral-950/70 border-neutral-800 hover:border-neutral-600 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-md ${isSelected ? 'bg-white text-black' : 'bg-neutral-800 text-white'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h3 className="text-sm font-bold text-white font-mono">{r}</h3>
                      </div>
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-white bg-neutral-900 border border-neutral-600 px-2 py-0.5 rounded-full">
                          <Check className="w-3 h-3 text-white" />
                          ACTIVE
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed min-h-[36px]">
                      {spec.tagline}
                    </p>

                    <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-400 font-mono">
                      <span className="text-neutral-300 font-bold block mb-1">Tailored Workspace:</span>
                      {spec.workspaceLayout}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Ecosystem Deep Dive */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">Current Ecosystem Profile</span>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <currentRoleSpec.icon className="w-5 h-5 text-white" />
                  {currentRoleSpec.title}
                </h3>
              </div>
              <span className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-neutral-800 text-white border border-neutral-700">
                ACTIVE MODE
              </span>
            </div>

            {/* Ecosystem KPI Tiles */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentRoleSpec.ecosystemDeliverables.map((item, idx) => (
                <div key={idx} className="bg-neutral-950 border border-neutral-800 rounded-md p-3">
                  <div className="text-[11px] text-neutral-400 font-mono">{item.label}</div>
                  <div className="text-base font-bold text-white mt-1 font-mono">{item.value}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{item.hint}</div>
                </div>
              ))}
            </div>

            {/* Ecosystem Features List */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-neutral-300 uppercase tracking-wider font-mono">
                Ecosystem Operational Capabilities:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRoleSpec.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded bg-neutral-950/80 border border-neutral-800 text-xs text-neutral-300"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar: Navigate to tailored space */}
            <div className="p-3 bg-neutral-950 border border-neutral-800 rounded-md flex items-center justify-between flex-wrap gap-2">
              <div className="text-xs text-neutral-400">
                Library bias: <span className="text-white font-medium">{currentRoleSpec.libraryBias}</span>
              </div>
              {onSwitchTab && (
                <div className="flex gap-2">
                  <button
                    onClick={() => onSwitchTab('workspace')}
                    className="px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <span>Open 8-Tab Workspace</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: LEARNING PREFERENCES TOGGLES & STYLES */}
      {activeSection === 'preferences' && (
        <section className="space-y-6">
          {/* Primary & Secondary Learning Styles */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono mb-1">
              <Sliders className="w-4 h-4 text-white" />
              Cognitive Learning Style Configuration
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
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
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">
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

          {/* Toggle Switches Panel */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4">
              Hardware Sensory & Ergonomic Preferences
            </h3>

            <div className="divide-y divide-neutral-800">
              {/* High-Contrast Adaptable Font Color */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Adaptable High-Contrast Font Readability</div>
                  <div className="text-[11px] text-neutral-400">
                    Prioritizes readability: dynamically enforces crisp black text on light backgrounds and pure white on dark backgrounds.
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleTogglePreference(
                      'highContrastAdaptiveFont',
                      !settings.learningPreferences?.highContrastAdaptiveFont
                    )
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.learningPreferences?.highContrastAdaptiveFont
                      ? 'bg-white'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.learningPreferences?.highContrastAdaptiveFont
                        ? 'translate-x-6 bg-black'
                        : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Bento Box Layout Preference */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Bento Mode Default in Workspace</div>
                  <div className="text-[11px] text-neutral-400">
                    Arranges active tasks, telemetries, notes, and audio scrubber into an adaptive modular bento grid layout.
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleTogglePreference('bentoDefaultMode', !settings.learningPreferences?.bentoDefaultMode)
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.learningPreferences?.bentoDefaultMode
                      ? 'bg-white'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.learningPreferences?.bentoDefaultMode
                        ? 'translate-x-6 bg-black'
                        : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Tactile Haptic Actuation */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Linear Resonant Haptic Actuation</div>
                  <div className="text-[11px] text-neutral-400">
                    Simulates sub-1ms physical tactile feedback on cards, tabs, and reel interactions.
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleTogglePreference('tactileFeedback', !settings.learningPreferences?.tactileFeedback)
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.learningPreferences?.tactileFeedback
                      ? 'bg-white'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.learningPreferences?.tactileFeedback
                        ? 'translate-x-6 bg-black'
                        : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Auto-Summary on Completion */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Auto-Summary on Chapter / Task Finish</div>
                  <div className="text-[11px] text-neutral-400">
                    Generates a concise markdown bullet synthesis whenever a reading chapter or milestone task is completed.
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleTogglePreference(
                      'autoSummaryOnCompletion',
                      !settings.learningPreferences?.autoSummaryOnCompletion
                    )
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.learningPreferences?.autoSummaryOnCompletion
                      ? 'bg-white'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.learningPreferences?.autoSummaryOnCompletion
                        ? 'translate-x-6 bg-black'
                        : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Sound Effects */}
              <div className="py-3.5 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-bold text-white font-mono">Mechanical & Sonic Audio Feedback</div>
                  <div className="text-[11px] text-neutral-400">
                    Plays subtle robotic relays and sinusoidal audio cues when organizing tabs or stacking card piles.
                  </div>
                </div>
                <button
                  onClick={() =>
                    handleTogglePreference('soundEffects', !settings.learningPreferences?.soundEffects)
                  }
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.learningPreferences?.soundEffects
                      ? 'bg-white'
                      : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.learningPreferences?.soundEffects
                        ? 'translate-x-6 bg-black'
                        : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Audio Pacing Multiplier Selector */}
            <div className="mt-5 pt-4 border-t border-neutral-800">
              <label className="text-xs font-bold text-white font-mono block mb-2">
                Default Lecture Speech Pacing Multiplier:
              </label>
              <div className="flex gap-2 flex-wrap">
                {[0.75, 1.0, 1.25, 1.5, 2.0].map(multiplier => (
                  <button
                    key={multiplier}
                    onClick={() => handleTogglePreference('audioPacingMultiplier', multiplier)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                      settings.learningPreferences?.audioPacingMultiplier === multiplier
                        ? 'bg-white text-black'
                        : 'bg-neutral-950 text-neutral-300 border border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {multiplier}x Speed
                  </button>
                ))}
              </div>
            </div>

            {/* Break Interval Timer Selector */}
            <div className="mt-4 pt-4 border-t border-neutral-800">
              <label className="text-xs font-bold text-white font-mono block mb-2">
                Deep Work Cognitive Cadence Interval:
              </label>
              <div className="flex gap-2 flex-wrap">
                {[
                  { min: 25, label: '25m (Pomodoro Focus)' },
                  { min: 45, label: '45m (Deep Flow Matrix)' },
                  { min: 60, label: '60m (Immersion Cadence)' }
                ].map(item => (
                  <button
                    key={item.min}
                    onClick={() => handleTogglePreference('breakIntervalMinutes', item.min)}
                    className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                      settings.learningPreferences?.breakIntervalMinutes === item.min
                        ? 'bg-white text-black'
                        : 'bg-neutral-950 text-neutral-300 border border-neutral-700 hover:border-neutral-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 3: BIO, PERSONALITY & GOALS */}
      {activeSection === 'identity' && (
        <section className="space-y-6">
          {/* Personality Type Selector */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono mb-1">
              <Sparkles className="w-4 h-4 text-white" />
              Cognitive Personality Archetype
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Informs reflection prompts, companion reassurance pacing, and working-memory organization.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PERSONALITY_TYPES.map(p => {
                const isSelected = settings.personality === p.type;
                return (
                  <div
                    key={p.type}
                    onClick={() => {
                      onUpdateSettings({ personality: p.type });
                      onShowToast(`Personality archetype set to ${p.type}`);
                    }}
                    className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
                      isSelected
                        ? 'bg-neutral-800 border-white ring-1 ring-white/50'
                        : 'bg-neutral-950 border-neutral-800 hover:border-neutral-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-bold text-white font-mono">{p.type}</div>
                      {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      {p.tagline}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Scholarly Identity & Email Credentials with Real-time Inline Validation */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-white" />
                  <span>Scholarly Identity & Credentials</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Public academic handle and cryptographic communication relay address.
                </p>
              </div>

              {!isEditingIdentity ? (
                <button
                  type="button"
                  onClick={() => {
                    setTempUsername(settings.username);
                    setTempEmail(settings.email);
                    setIsEditingIdentity(true);
                  }}
                  className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-bold text-white transition-all min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white shrink-0"
                >
                  Edit Credentials
                </button>
              ) : (
                <div className="flex gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingIdentity(false);
                      setIdentityTouched({});
                    }}
                    className="px-3.5 py-2 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveIdentity}
                    className="px-3.5 py-2 rounded bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold min-h-[44px] flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>

            {isEditingIdentity ? (
              <div className="space-y-4 pt-2">
                {/* Username Input */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="temp-username-input" className="text-xs font-mono text-neutral-300 font-bold">
                      Academic Handle (Username):
                    </label>
                    <span className="text-[10px] font-mono text-neutral-500">{tempUsername.length}/20</span>
                  </div>
                  <input
                    id="temp-username-input"
                    type="text"
                    value={tempUsername}
                    onBlur={() => setIdentityTouched(prev => ({ ...prev, username: true }))}
                    onChange={e => {
                      setTempUsername(e.target.value);
                      if (!identityTouched.username) setIdentityTouched(prev => ({ ...prev, username: true }));
                    }}
                    className={`w-full bg-neutral-950 border rounded px-3 py-2 text-xs font-mono text-white outline-none min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-white ${
                      usernameError ? 'border-red-500' : 'border-neutral-700 focus:border-white'
                    }`}
                  />
                  {usernameError ? (
                    <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{usernameError}</span>
                    </p>
                  ) : identityTouched.username && (
                    <p className="text-[11px] text-neutral-400 mt-1 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Handle verified.</span>
                    </p>
                  )}
                </div>

                {/* Email Input */}
                <div>
                  <label htmlFor="temp-email-input" className="text-xs font-mono text-neutral-300 font-bold block mb-1">
                    Primary Institutional Email:
                  </label>
                  <input
                    id="temp-email-input"
                    type="email"
                    value={tempEmail}
                    onBlur={() => setIdentityTouched(prev => ({ ...prev, email: true }))}
                    onChange={e => {
                      setTempEmail(e.target.value);
                      if (!identityTouched.email) setIdentityTouched(prev => ({ ...prev, email: true }));
                    }}
                    className={`w-full bg-neutral-950 border rounded px-3 py-2 text-xs font-mono text-white outline-none min-h-[44px] transition-colors focus-visible:ring-2 focus-visible:ring-white ${
                      emailError ? 'border-red-500' : 'border-neutral-700 focus:border-white'
                    }`}
                  />
                  {emailError ? (
                    <p className="text-[11px] text-red-400 mt-1 font-mono flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{emailError}</span>
                    </p>
                  ) : identityTouched.email && (
                    <p className="text-[11px] text-neutral-400 mt-1 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      <span>Email format verified.</span>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono">
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Username / Handle</div>
                  <div className="text-white font-bold mt-0.5">@{settings.username}</div>
                </div>
                <div className="p-3 rounded bg-neutral-950 border border-neutral-800">
                  <div className="text-[10px] text-neutral-500 uppercase">Verified Relay Email</div>
                  <div className="text-white font-bold mt-0.5 truncate">{settings.email}</div>
                </div>
              </div>
            )}
          </div>

          {/* Academic Statement & Bio */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Academic Statement & Bio
              </h3>
              {!isEditingBio ? (
                <button
                  onClick={() => setIsEditingBio(true)}
                  className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-xs font-mono font-bold text-white transition-all"
                >
                  Edit Bio
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditingBio(false)}
                    className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-mono"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBio}
                    className="px-2.5 py-1 rounded bg-white text-black hover:bg-neutral-200 text-xs font-mono font-bold"
                  >
                    Save Statement
                  </button>
                </div>
              )}
            </div>

            {isEditingBio ? (
              <div className="space-y-2 mt-2">
                <textarea
                  value={tempBio}
                  onChange={e => setTempBio(e.target.value)}
                  rows={4}
                  className="w-full rounded bg-neutral-950 border border-neutral-700 p-3 text-xs text-white focus:outline-none focus:border-white font-mono leading-relaxed"
                  placeholder="Enter your scholarly goals, research disciplines, or academic statement..."
                />
                <div className="text-right text-[11px] text-neutral-400 font-mono">
                  {tempBio.length} characters
                </div>
              </div>
            ) : (
              <div className="p-4 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 font-mono leading-relaxed">
                {settings.bio || 'No academic statement provided yet. Click "Edit Bio" to set.'}
              </div>
            )}
          </div>

          {/* Goals / Milestones Tracker */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
                Active Academic Goals & Milestones
              </h3>
              <span className="text-xs font-mono text-neutral-400">
                {(settings.goals || []).length} of 8 slots
              </span>
            </div>

            <form onSubmit={handleAddGoal} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newGoalText}
                onChange={e => setNewGoalText(e.target.value)}
                placeholder="Add next goal (e.g. Master thesis chapter 4, pass oral exam)..."
                className="flex-1 bg-neutral-950 border border-neutral-700 rounded-md px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-white text-black hover:bg-neutral-200 rounded-md text-xs font-bold font-mono flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </form>

            <div className="space-y-2">
              {(settings.goals || []).map((goal, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between gap-3 p-2.5 rounded bg-neutral-950 border border-neutral-800 text-xs text-neutral-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-neutral-500 text-[10px] w-4">{idx + 1}.</span>
                    <span className="font-sans">{goal}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveGoal(idx)}
                    className="p-1 rounded text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: ACCOUNT & SECURITY SETTINGS */}
      {activeSection === 'security' && (
        <section className="space-y-6">
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2 font-mono mb-1">
              <Shield className="w-4 h-4 text-white" />
              Cryptographic Account & Biometric Security
            </h2>
            <p className="text-xs text-neutral-400 mb-4">
              Manage passkeys, biometric session enforcement, multi-factor tokens, and idle lockouts.
            </p>

            <div className="space-y-4">
              {/* Biometrics Toggle */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neutral-900 text-white border border-neutral-700 mt-0.5">
                    <Fingerprint className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Biometric Passkey Authentication</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Enforces TouchID / FaceID / WebAuthn passkey handshake when unlocking the workstation.
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-1">
                      Status: {settings.biometricsEnabled ? 'Enforced (FIDO2 Hardware Bound)' : 'Disabled'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const next = !settings.biometricsEnabled;
                    onUpdateSettings({ biometricsEnabled: next });
                    onShowToast(next ? 'Biometric Passkey Enforcement Enabled' : 'Biometric Passkey Disabled');
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    settings.biometricsEnabled ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full transition-transform ${
                      settings.biometricsEnabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-neutral-400'
                    }`}
                  />
                </button>
              </div>

              {/* Two-Factor Authentication Toggle */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-neutral-900 text-white border border-neutral-700 mt-0.5">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Two-Factor Authenticator (2FA / TOTP)</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">
                      Requires SHA-256 rotating time-based tokens for changing profile keys or exporting vaults.
                    </div>
                    {backupCode && (
                      <div className="mt-2 p-2 bg-neutral-900 border border-neutral-700 rounded font-mono text-xs text-white">
                        Emergency Backup Key: <span className="underline font-bold">{backupCode}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGenerateBackupCode}
                    disabled={isGeneratingBackupCode}
                    className="px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-mono transition-all"
                  >
                    {isGeneratingBackupCode ? 'Generating...' : 'New Key'}
                  </button>
                  <button
                    onClick={() => {
                      const next = !settings.twoFactorEnabled;
                      onUpdateSettings({ twoFactorEnabled: next });
                      onShowToast(next ? 'Two-Factor Authentication Active' : 'Two-Factor Disabled');
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                      settings.twoFactorEnabled ? 'bg-white' : 'bg-neutral-800 border border-neutral-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full transition-transform ${
                        settings.twoFactorEnabled ? 'translate-x-6 bg-black' : 'translate-x-0 bg-neutral-400'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Idle Lockout Timer */}
              <div className="p-4 rounded-lg bg-neutral-950 border border-neutral-800">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-xs font-bold text-white font-mono">Auto-Lock Idle Security Boundary</div>
                    <div className="text-[11px] text-neutral-400">
                      Workstation locks automatically to protect research data after inactivity.
                    </div>
                  </div>
                  <span className="font-mono text-xs text-white font-bold px-2 py-0.5 bg-neutral-900 border border-neutral-700 rounded">
                    {settings.idleTimerMinutes} Minutes
                  </span>
                </div>

                <div className="flex gap-2 mt-3 flex-wrap">
                  {[5, 15, 30, 60].map(min => (
                    <button
                      key={min}
                      onClick={() => {
                        onUpdateSettings({ idleTimerMinutes: min });
                        onShowToast(`Idle lock interval set to ${min} minutes`);
                      }}
                      className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition-all ${
                        settings.idleTimerMinutes === min
                          ? 'bg-white text-black'
                          : 'bg-neutral-900 text-neutral-300 border border-neutral-700 hover:border-neutral-500'
                      }`}
                    >
                      {min}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tamper-Evident Security Audit Log */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5">
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-1 flex items-center gap-2">
              <Clock className="w-4 h-4 text-white" />
              Cryptographic Security Audit Log
            </h3>
            <p className="text-xs text-neutral-400 mb-3">
              Immutable ledger of recent authentication events, passkey handshakes, and system states.
            </p>

            <div className="space-y-2">
              {(settings.securityLogs || []).map(entry => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between gap-3 p-2.5 rounded bg-neutral-950 border border-neutral-800 text-xs"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                    <div>
                      <div className="text-neutral-200 font-mono font-medium">{entry.event}</div>
                      <div className="text-[10px] text-neutral-400 font-mono">{entry.device}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-neutral-400 font-mono">{entry.timestamp}</div>
                    <span className="text-[9px] font-mono font-bold text-white bg-neutral-800 border border-neutral-700 px-1.5 py-0.5 rounded uppercase">
                      {entry.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
