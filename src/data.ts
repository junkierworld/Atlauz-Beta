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

export const initialCompanion: CompanionState = {
  name: 'Finley',
  stateMachine: 'Serene_Balanced.json',
  primaryFishId: 'fish-1',
  fishes: [
    {
      id: 'fish-1',
      name: 'Finley',
      species: 'Monochrome Specimen',
      color: '#ffffff',
      accentColor: '#888888',
      tailType: 'veil',
      personality: 'Curious & Calm Flow',
      size: 1.0,
      adoptedAt: 'Found in Deep Trench',
      isPrimary: true
    }
  ],
  headIndex: 1,
  bodyIndex: 1,
  tailIndex: 2,
  eyesIndex: 3,
  mouthIndex: 1,
  baseColor: '#ffffff',
  accentColor: '#888888',
  featuresEnabled: true,
  messagesEnabled: true,
  customMessages: [
    'Take a deep breath and stay hydrated.',
    'Zero friction: 0 context switches across all-in-one tools.',
    'Reaching New Depths: Milestone unlocked.'
  ]
};

export const initialTelemetry: CognitiveTelemetry = {
  cognitiveVital: 98.4,
  sessionMinutes: 42,
  streakDays: 28,
  isStreakFrozen: false,
  antiBurnoutActive: true,
  sleepHoursLogged: 7.8,
  dailyGoalProgress: 78,
  zeroContextSwitchSavedHours: 2.4
};

export const defaultProjects: ProjectItem[] = [
  {
    id: 'cogs-492',
    code: 'COGS-PROD',
    title: 'Cognitive Science & UI Architecture',
    subtitle: 'Unified cross-suite repository modeling multimodal interaction models, cognitive load offloading, cooperative thesis drafts, and interactive design decks.',
    category: 'COGS-492 • Neural Systems',
    coverGradient: 'from-[#021b2b] via-[#05111d] to-[#090e1c]',
    coverTitle: 'Reaching New Depths',
    connectedApps: ['Notion', 'Google Docs', 'Canva', 'Figma'],
    focusHours: 42.5,
    syncPercent: 100,
    syncedNodes: 48,
    notionBlocks: [
      {
        id: 'nb-1',
        title: 'Attention Mechanism & Multi-Head Transformers',
        url: 'notion.so/wiki/cogs-attention',
        syncedAgo: '4m ago',
        relation: 'Relation: Google Thesis Doc #3',
        rollup: 'Rollup: 99.8% Confidence',
        items: [
          { title: 'Vaswani et al. Attention Is All You Need (Paper Notes)', badge: 'ArXiv Synced', expanded: true },
          { title: 'Context Window Compression & Distillation Mechanics', badge: '12 Records', expanded: false }
        ]
      },
      {
        id: 'nb-2',
        title: 'Sprint 04: Cognitive Load & Spatial UI Canvas',
        url: 'notion.so/wiki/cogs-sprint04',
        syncedAgo: '18m ago',
        relation: 'Relation: Design System Spec v2',
        rollup: 'Rollup: 8 Tasks In Progress',
        items: [
          { title: 'Bento Box Modular Layout & Concealment Testing', badge: 'Validated', expanded: false },
          { title: 'Biomimetic Avatar Visual Telemetry Feed', badge: 'In Review', expanded: false }
        ]
      }
    ],
    googleDocs: [
      {
        id: 'gd-1',
        title: 'Live Draft: Marine UI Acoustics Paper',
        collaborators: ['EK', 'DL', 'You'],
        section: 'Live Cursor at §3.4',
        excerpt: '§ 3.4 Bathypelagic Audio-Haptic Feedback Architecture: Hydrophone frequency profiles (20Hz - 200kHz) are compressed directly into tactile waveform packets, enabling tactile sonar feedback for researchers on touchscreens without high acoustic latency...',
        attachedFiles: [
          { name: 'Drive/Mariana_Raw_Audio', type: 'folder' },
          { name: 'Sheets/Frequency_Matrix.gsheet', type: 'sheet' }
        ]
      }
    ],
    canvaDeck: {
      title: 'Canva Pitch: Deep Oceanic UI (16:9)',
      slideCount: 18,
      currentSlide: 4,
      slides: [
        { num: 1, label: 'Slide 1: Title', color: 'bg-[#00f2fe]/70' },
        { num: 2, label: 'Slide 2: Sonar', color: 'bg-[#89ceff]' },
        { num: 3, label: 'Slide 3: UI Spec', color: 'bg-[#fcb88b]' },
        { num: 4, label: 'Slide 4: Mariana', color: 'bg-[#00f2fe]' }
      ]
    },
    deepSources: [
      {
        id: 'ds-1',
        title: 'Deep Trench Acoustic Scattering Models',
        source: 'arxiv:2403.09112 • Cited by 14',
        notes: 'Benchmark paper on abyssal acoustic duct propagation and waveform rendering algorithms.',
        tags: ['Acoustics', 'Bathyal', 'Waveforms']
      },
      {
        id: 'ds-2',
        title: 'ocean-acoustics-rust / Mariana-Core',
        source: 'github.com • main v2.1',
        notes: 'Real-time Rust audio engine compiled to WebAssembly for tactile soundscape playback.',
        tags: ['WebAssembly', 'FFT Signal', 'Live Engine']
      }
    ]
  }
];

export const initialSchedule: ScheduleBlock[] = [
  { id: 's-1', title: 'Deep Work: Neural System Matrix', time: '08:00 - 10:30', type: 'deep_work', isWellnessRest: false },
  { id: 's-2', title: 'Cognitive Recalibration (Hydration & Walk)', time: '10:30 - 11:00', type: 'rest_break', isWellnessRest: true, frozenStreakProtected: true },
  { id: 's-3', title: 'Multi-Modal Synthesis: Google Hub + Notion', time: '11:00 - 13:00', type: 'deep_work', isWellnessRest: false },
  { id: 's-4', title: 'Nap / Circadian Reset Block', time: '13:00 - 13:45', type: 'sleep', isWellnessRest: true, frozenStreakProtected: true },
  { id: 's-5', title: 'Canva Visual Architecture Iteration', time: '14:00 - 16:00', type: 'deep_work', isWellnessRest: false },
  { id: 's-6', title: 'Evening Wind-Down & Sleep Boundary', time: '22:30 - 07:00', type: 'sleep', isWellnessRest: true, frozenStreakProtected: true }
];

export const initialConnectedApps: ConnectedApp[] = [
  { id: 'spotify', name: 'Spotify Study Audio', category: 'Audio Stream', icon: 'music_note', connected: true, statusText: 'Binaural Abyssal 432Hz Playing', oauthScope: 'user-read-playback-state' },
  { id: 'youtube', name: 'YouTube Ambient Lectures', category: 'Video Stream', icon: 'video_library', connected: false, statusText: 'Disconnected', oauthScope: 'readonly.metadata' },
  { id: 'ecosia', name: 'Ecosia Research Extension', category: 'Browser Tool', icon: 'eco', connected: true, statusText: 'Active • 14 Trees Planted', oauthScope: 'search.read' },
  { id: 'gmail', name: 'Gmail Research Digest', category: 'Communication', icon: 'mail', connected: true, statusText: 'Read-only Metadata • Zero Inbox', oauthScope: 'gmail.metadata.readonly' },
  { id: 'session', name: 'Session Biometric Tracking', category: 'Telemetry', icon: 'timer', connected: true, statusText: 'Active Pulse Guard', oauthScope: 'internal.keystore' }
];

export const initialSettings: UserAccountSettings = {
  username: 'polymath',
  email: 'junkierworld@gmail.com',
  avatarUrl: '',
  bio: 'Interdisciplinary scholar investigating cognitive neural architecture, oceanic haptics, and distraction-free spatial interfaces. Focusing on working-memory optimization and zero-latency synthesis.',
  personality: 'Analytical & Methodical',
  role: 'Student',
  institution: 'Department of Cognitive Science & Neural Engineering',
  department: 'Oceanic Acoustic Human-Computer Interaction Lab',
  goals: [
    'Complete thesis section §3.4 on Hadal sonar tactile envelopes',
    'Maintain a 30-day cognitive streak without attention residue',
    'Review 5 arXiv preprints on multimodal transformer distillation',
    'Author sensory lesson syllabus for incoming cohort'
  ],
  learningPreferences: {
    primaryStyle: 'Reading & Synthesis',
    secondaryStyle: 'Kinesthetic & Interactive',
    tactileFeedback: true,
    audioPacingMultiplier: 1.25,
    autoSummaryOnCompletion: true,
    bentoDefaultMode: false,
    highContrastAdaptiveFont: true,
    notificationDigest: 'pomodoro_end',
    breakIntervalMinutes: 45,
    soundEffects: true
  },
  twoFactorEnabled: true,
  biometricsEnabled: true,
  idleTimerMinutes: 15,
  isLocked: false,
  theme: 'dark',
  themeIntensity: 'focus',
  // v1.1.5 Academic Role & Active Ecosystem defaults
  hubLayout: {
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
  },
  libraryShelvingMode: 'hybrid',
  appPermissions: {
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
  },
  securityLogs: [
    { id: 'sec-1', event: 'WebAuthn Hardware Passkey Verified', timestamp: 'Today, 08:31 AM', device: 'Chrome 124 / macOS • 192.168.1.42', status: 'verified' },
    { id: 'sec-2', event: 'Biometric Face ID Handshake Signed', timestamp: 'Yesterday, 14:15 PM', device: 'Mobile Safari • iOS 18', status: 'verified' },
    { id: 'sec-3', event: 'Encrypted Vault Auto-Lock Enforced', timestamp: 'Sep 24, 22:00 PM', device: 'System Idle Timer (15 min)', status: 'verified' },
    { id: 'sec-4', event: 'Role Ecosystem Realigned: Student', timestamp: 'Sep 22, 10:12 AM', device: 'Local Profile Engine', status: 'verified' }
  ]
};

export const initialLibraryTasks: Array<{
  id: string;
  text: string;
  completed: boolean;
  category: string;
  priority: 'high' | 'medium' | 'normal';
  roleTag: 'Student' | 'Researcher' | 'Educator';
  dueDate?: string;
}> = [
  {
    id: 'lt-1',
    text: 'Synthesize chapter 4 notes on oceanic sound wave attenuation',
    completed: true,
    category: 'Literature Note',
    priority: 'high',
    roleTag: 'Student',
    dueDate: 'Today'
  },
  {
    id: 'lt-2',
    text: 'Submit Quiz 3 on Transformer Attention heads and context pruning',
    completed: false,
    category: 'Coursework',
    priority: 'high',
    roleTag: 'Student',
    dueDate: 'Tomorrow'
  },
  {
    id: 'lt-3',
    text: 'Annotate Mariana acoustic PDF whitepaper with salinity coefficients',
    completed: true,
    category: 'Reading',
    priority: 'medium',
    roleTag: 'Researcher',
    dueDate: 'Friday'
  },
  {
    id: 'lt-4',
    text: 'Cross-verify citation matrices between arXiv:2403.09112 and Hydrophone benchmarks',
    completed: false,
    category: 'Citations',
    priority: 'high',
    roleTag: 'Researcher',
    dueDate: 'Oct 02'
  },
  {
    id: 'lt-5',
    text: 'Export Canva presentation deck slides for lecture symposium §1-4',
    completed: false,
    category: 'Curriculum',
    priority: 'medium',
    roleTag: 'Educator',
    dueDate: 'Next Week'
  },
  {
    id: 'lt-6',
    text: 'Calibrate rubric scoring weights for student haptic interaction project',
    completed: false,
    category: 'Assessment',
    priority: 'normal',
    roleTag: 'Educator',
    dueDate: 'Oct 08'
  }
];


export const initialResources: ResourceItem[] = [
  {
    id: 'res-doc-1',
    type: 'document',
    title: 'Marine UI Acoustics & Haptic Sonar',
    description: 'Collaborative thesis draft on bathypelagic haptic compression, frequency envelopes, and tactile transducer interfaces.',
    category: 'Research Paper • Google Docs',
    tags: ['COGS-492', 'Audio-Haptic', 'Thesis', 'Sensory'],
    coverColor: '#ffffff',
    isPinned: true,
    isFavorite: true,
    badge: '● Priority',
    createdAt: '2026-09-12',
    updatedAt: 'Just now',
    roleShelf: 'researcher',
    metadata: {
      collaborators: ['EK', 'DL', 'You'],
      docContent: `<h1>§ 3.4 Bathypelagic Audio-Haptic Feedback Architecture</h1>
<p>Hydrophone frequency profiles (20Hz - 200kHz) recorded across the Mariana Hadal Zone are compressed directly into tactile waveform packets, enabling tactile sonar feedback for oceanographic researchers on glass touchscreens without high acoustic latency.</p>

<h2>1. Frequency Decimation and Resonant Tuning</h2>
<p>Because human mechanoreceptors (specifically Pacinian corpuscles) peak in sensitivity between <strong>200 Hz and 300 Hz</strong>, ultra-high frequency biological sonar clicks from deep odontocetes must undergo non-linear envelope distillation rather than crude pitch-shifting.</p>
<ul>
  <li><strong>Envelope Extraction:</strong> Hilbert transform pipeline executed on-device with zero buffer spill.</li>
  <li><strong>Harmonic Carrier:</strong> Resynthesized via local sinusoidal phase vocoder at 240 Hz.</li>
  <li><strong>Haptic Actuation:</strong> Linear Resonant Actuators (LRA) driven at sub-1ms impulse latency.</li>
</ul>

<h2>2. Collaborative Benchmark Table</h2>
<table border="1" style="width:100%; border-collapse:collapse; margin-top:12px;">
  <thead>
    <tr style="background-color:rgba(0, 242, 254, 0.1);">
      <th style="padding:6px; text-align:left;">Target Depth</th>
      <th style="padding:6px; text-align:left;">Propagation Attenuation</th>
      <th style="padding:6px; text-align:left;">Tactile Clarity Score</th>
      <th style="padding:6px; text-align:left;">Verification</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="padding:6px;">2,000 m (Bathyal)</td>
      <td style="padding:6px;">-1.2 dB / km</td>
      <td style="padding:6px;">98.4%</td>
      <td style="padding:6px; color:#06d6a0;">Passed ✓</td>
    </tr>
    <tr>
      <td style="padding:6px;">6,000 m (Abyssal)</td>
      <td style="padding:6px;">-3.8 dB / km</td>
      <td style="padding:6px;">95.1%</td>
      <td style="padding:6px; color:#06d6a0;">Passed ✓</td>
    </tr>
    <tr>
      <td style="padding:6px;">11,000 m (Hadal)</td>
      <td style="padding:6px;">-7.4 dB / km</td>
      <td style="padding:6px;">92.7%</td>
      <td style="padding:6px; color:#00f2fe;">Optimal ✓</td>
    </tr>
  </tbody>
</table>

<h2>3. Experimental Checkpoints</h2>
<p>Complete these sprint milestones prior to Friday's symposium peer review:</p>
<ul class="checklist" style="list-style-type:none; padding-left:0;">
  <li>☑ [x] Compile ArXiv preprint bibliography into Notion Linked Database</li>
  <li>☑ [x] Calibrate capacitive glass haptic transducers with acoustic sensor dummy</li>
  <li>☐ [ ] Finalize multi-author review with Dr. Kester and Elena</li>
</ul>`,
      comments: [
        { id: 'c-1', author: 'Elena K.', text: 'Equation 4.2 needs an explicit mention of seawater salinity compensation.', time: '14m ago', resolved: false },
        { id: 'c-2', author: 'David L.', text: 'The tactile clarity score on line 18 aligns with our wet-lab tests!', time: '1h ago', resolved: true }
      ]
    }
  },
  {
    id: 'res-slide-1',
    type: 'presentation',
    title: 'Deep Oceanic UI & Spatial Telemetry',
    description: 'Interactive presentation deck modeling the 16:9 spatial visual telemetry canvas and glassmorphic bento HUD.',
    category: 'Presentation • Google Slides',
    tags: ['Slides', 'Keynote', 'Pitch', 'Bento'],
    coverColor: '#e5e5e5',
    isPinned: true,
    isFavorite: false,
    badge: '◆ Milestone',
    createdAt: '2026-09-10',
    updatedAt: '2h ago',
    roleShelf: 'educator',
    metadata: {
      slideCount: 4,
      currentSlide: 1,
      slides: [
        {
          id: 'sl-1',
          title: 'Deep Oceanic UI: Spatial Architecture',
          body: 'Consolidating multi-tool cognitive focus through glassmorphic concealment and zero-context-switching workflows.',
          notes: 'Open by introducing the core problem: modern students lose 2.4 hours daily switching across 8 disjointed web browser tabs.',
          layout: 'title',
          bg: 'linear-gradient(135deg, #111111 0%, #1f1f1f 50%, #111111 100%)'
        },
        {
          id: 'sl-2',
          title: 'The Frosted vs. Defrost Concealment Strategy',
          body: '• Idle states apply wireframe concealment to prevent distraction.\n• Active double-tap defrosts the container into full view.\n• Preserves cognitive vitality over 4+ hour study blocks.',
          notes: 'Demonstrate live by double-clicking the bento container. Highlight the contrast in optical eye strain.',
          layout: 'content',
          bg: 'linear-gradient(135deg, #171717 0%, #262626 100%)'
        },
        {
          id: 'sl-3',
          title: 'Tactile Sonar & Hydrophone Transducers',
          body: 'Converting high-frequency oceanic signals into sub-1ms physical impulses for human mechanoreceptors.\n• Pacinian corpuscle resonance at 240Hz\n• Zero-loss on-device phase vocoder\n• Direct glass capacitive excitation',
          notes: 'Reference paper Section 3.4 published in the attached Google Docs buffer.',
          layout: 'content',
          bg: 'linear-gradient(135deg, #141414 0%, #222222 100%)'
        },
        {
          id: 'sl-4',
          title: 'Summary & Symposium Next Steps',
          body: '✓ Full ecosystem integration across Notion, Google Workspace, and Canva\n✓ Real-time living companion state machine\n✓ Verified 100% zero-drift cloud telemetry sync',
          notes: 'Invite committee questions and initiate live interactive sandbox preview.',
          layout: 'summary',
          bg: 'linear-gradient(135deg, #0f0f0f 0%, #1c1c1c 100%)'
        }
      ]
    }
  },
  {
    id: 'res-nb-1',
    type: 'notebook',
    title: 'COGS Laboratory Field Notebook',
    description: 'Multi-page interactive research notebook with page-level badges, bookmarks, and formula annotations.',
    category: 'Notebook • Laboratory',
    tags: ['Lab Notes', 'Formulas', 'Neuroscience'],
    coverColor: '#d4d4d4',
    isPinned: true,
    isFavorite: true,
    badge: '★ Favorite',
    createdAt: '2026-09-08',
    updatedAt: '35m ago',
    roleShelf: 'academic',
    metadata: {
      activePageIndex: 0,
      pages: [
        {
          id: 'p-1',
          title: 'Page 1: Synaptic Plasticity & Spike Timing',
          content: 'Heffian learning: Neurons that fire together, wire together. In Spike-Timing-Dependent Plasticity (STDP), the temporal window is bounded within ±20ms. If pre-synaptic activation precedes post-synaptic spike within this delta, Long-Term Potentiation (LTP) is induced.',
          badge: '★ Favorite',
          isBookmarked: true
        },
        {
          id: 'p-2',
          title: 'Page 2: Attention Head Scaled Dot-Products',
          content: 'Attention(Q, K, V) = softmax(QK^T / sqrt(d_k)) * V. The scaling factor 1/sqrt(d_k) prevents softmax gradient saturation when dimensionality is large. Multi-head projection preserves parallel representation subspaces.',
          badge: '▲ Insight',
          isBookmarked: false
        },
        {
          id: 'p-3',
          title: 'Page 3: Bathypelagic Acoustic Attenuation',
          content: 'Acoustic attenuation in saltwater: alpha(f) = A1*P1*f1*f^2 / (f1^2 + f^2) + A2*P2*f2*f^2 / (f2^2 + f^2) + A3*P3*f^2. Boric acid relaxation dominates below 1 kHz, while magnesium sulfate relaxation dominates between 1 kHz and 100 kHz.',
          badge: '◉ Research',
          isBookmarked: true
        }
      ]
    }
  },
  {
    id: 'res-eb-1',
    type: 'ebook',
    title: 'The Design of Everyday Cognitive Systems',
    description: 'Interactive digital ebook reader with chapter navigation, typography adjustments, sepia/dark modes, and bookmarks.',
    category: 'Ebook • Academic Press',
    tags: ['Reading', 'Cognitive UI', 'Design Theory'],
    coverColor: '#a3a3a3',
    isPinned: false,
    isFavorite: true,
    badge: '▲ Insight',
    createdAt: '2026-09-01',
    updatedAt: '1d ago',
    roleShelf: 'personal',
    metadata: {
      author: 'Prof. Don Norman & Alistair Vance',
      progressPercent: 44,
      fontSize: 16,
      ebookTheme: 'dark',
      activeChapterIndex: 1,
      chapters: [
        {
          id: 'ch-1',
          title: 'Chapter 1: The Affordances of Invisible Interfaces',
          readingTime: '12 min read',
          content: 'When an interface is truly natural, the tool disappears from consciousness. In biological deep-sea ecosystems, organisms do not perceive water as a medium; they inhabit pressure differentials as direct somatic information. Modern digital tools, by contrast, bombard students with chrome, menus, notifications, and context switches.'
        },
        {
          id: 'ch-2',
          title: 'Chapter 2: The Concealment Architecture of Focus',
          readingTime: '18 min read',
          content: 'Attention is an optical resource with finite metabolic replenishment. By adopting a frost-and-defrost concealment strategy, interface designers can shield peripheral vision from high-contrast noise until explicit user intent is signaled.'
        },
        {
          id: 'ch-3',
          title: 'Chapter 3: Tactile Sonar and Sub-Perceptual Haptics',
          readingTime: '15 min read',
          content: 'Sensory substitution provides cognitive offloading when visual channels are saturated. By transforming mathematical gradients into subtle tactile textures, students can feel the slope of an optimization curve or the density of an index without lifting their eyes from primary prose.'
        }
      ]
    }
  },
  {
    id: 'res-ls-1',
    type: 'lesson',
    title: 'Transformer Mechanics & Attention Mastery',
    description: 'Interactive structured course lesson with modules, interactive syllabus checkpoints, and self-assessment flashcards.',
    category: 'Lesson • Advanced Course',
    tags: ['COGS-492', 'Neural Nets', 'Transformers'],
    coverColor: '#737373',
    isPinned: true,
    isFavorite: true,
    badge: '✓ Mastered',
    createdAt: '2026-09-05',
    updatedAt: '4h ago',
    roleShelf: 'academic',
    metadata: {
      instructor: 'Dr. Sarah Lin, DeepMind Visiting Faculty',
      courseCode: 'COGS-492',
      duration: '45 mins',
      level: 'Advanced Undergraduate / Graduate',
      modules: [
        { id: 'm-1', title: '1. Self-Attention Intuition & Matrix Multiplication', completed: true, duration: '12 mins' },
        { id: 'm-2', title: '2. Multi-Head Representation Subspaces', completed: true, duration: '15 mins' },
        { id: 'm-3', title: '3. Positional Encoding: Sinusoidal vs Rotary Embeddings', completed: false, duration: '10 mins' },
        { id: 'm-4', title: '4. LayerNorm, Residual Connections & Gradient Highway', completed: false, duration: '8 mins' }
      ],
      quizQuestions: [
        {
          question: 'Why is the dot product scaled by 1/sqrt(d_k) in standard self-attention?',
          options: [
            'To reduce computational complexity from quadratic to linear',
            'To prevent large dot products from pushing softmax into regions with extremely small gradients',
            'To normalize the output vector magnitudes to unit sphere',
            'To prevent memory overflow on GPU tensor cores'
          ],
          answerIndex: 1,
          explanation: 'When d_k is large, dot products grow large in magnitude, pushing the softmax function into regions where gradients are extremely small (vanishing gradient problem). Dividing by sqrt(d_k) counters this effect.'
        },
        {
          question: 'What is the primary role of Multi-Head Attention over Single-Head Attention?',
          options: [
            'It enables the model to jointly attend to information from different representation subspaces at different positions',
            'It reduces total parameter count by a factor of 8',
            'It eliminates the need for positional encodings',
            'It converts recurrent neural networks into state-space models'
          ],
          answerIndex: 0,
          explanation: 'Multi-head attention allows the model to jointly attend to information from different representation subspaces, such as syntactic relations in one head and semantic dependencies in another.'
        }
      ]
    }
  },
  {
    id: 'res-np-1',
    type: 'notepad',
    title: 'Quick Scratchpad: Thesis Idea Dump',
    description: 'Instant scratchpad with markdown formatting, live word count, character count, and single-click copy.',
    category: 'Notepad • Scratchpad',
    tags: ['Quick Capture', 'Scratchpad', 'Ideas'],
    coverColor: '#525252',
    isPinned: false,
    isFavorite: false,
    badge: '■ Balanced',
    createdAt: '2026-09-14',
    updatedAt: '10m ago',
    roleShelf: 'personal',
    metadata: {
      noteContent: `# Rapid Research Notes & Thesis Sparks

* Investigate if **LRA tactile vibrations** at 240Hz cause finger fatigue after >45 minutes of continuous study.
* Check whether **Ecosia search API** can auto-populate paper bibtex directly into our Notion wiki.
* Companion state machine: add a "Resting Abyss" state when cognitive vitality drops below 60%.

## Code snippet for audio tactile mapping:
\`\`\`ts
const tactileFrequency = Math.min(300, Math.max(150, baseFreq * 0.12));
navigator.vibrate?.([tactileFrequency, 20, tactileFrequency * 0.8]);
\`\`\`
`
    }
  },
  {
    id: 'res-jn-1',
    type: 'journal',
    title: 'Daily Deep Work & Cognitive Recalibration',
    description: 'Daily reflective journal with mood check-ins, mindful prompts, and private encrypted entry locking.',
    category: 'Journal • Mindful Log',
    tags: ['Mindfulness', 'Reflection', 'Daily Log'],
    coverColor: '#404040',
    isPinned: false,
    isFavorite: true,
    badge: '■ Balanced',
    createdAt: '2026-09-17',
    updatedAt: 'Today, 08:30 AM',
    roleShelf: 'personal',
    metadata: {
      journalDate: 'September 17, 2026',
      mood: 'Deep Flow',
      prompt: 'What was your deepest breakthrough moment during today\'s study sprint?',
      reflections: [
        'Maintained 42 minutes of uninterrupted flow without a single browser tab hop.',
        'The Atlauz living companion pulse kept me grounded during complex math derivation.',
        'Hydrated at the 30-minute checkpoint; sleep schedule was protected by the anti-burnout freeze.'
      ],
      isPrivate: true
    }
  },
  {
    id: 'res-pdf-1',
    type: 'pdf',
    title: 'Bathypelagic Acoustic Transmission Spec',
    description: 'Full interactive PDF reader with page previews, text highlighter annotations, zoom controls, and search.',
    category: 'PDF Document • Whitepaper',
    tags: ['PDF', 'Acoustics', 'Whitepaper', 'Mariana'],
    coverColor: '#262626',
    isPinned: true,
    isFavorite: false,
    badge: '◉ Research',
    createdAt: '2026-09-02',
    updatedAt: '3d ago',
    roleShelf: 'researcher',
    metadata: {
      fileName: 'Mariana_Acoustic_Spec_v4.2.pdf',
      fileSize: '4.8 MB',
      pageCount: 16,
      currentPage: 3,
      highlights: [
        { id: 'hl-1', page: 3, text: 'Attenuation coefficient alpha = 0.048 dB/km at oceanic isotherms below 4°C', note: 'Critical constant for Equation 4', color: '#ffffff' },
        { id: 'hl-2', page: 4, text: 'Hydrophone transducer resonant array calibration at 11,034 meters depth', note: 'Tested at Challenger Deep site', color: '#a3a3a3' }
      ]
    }
  }
];

export const initialCollaborativeBentoTiles: CollaborativeBentoTile[] = [
  {
    id: 'collab-bento-1',
    title: 'Hadal Acoustic Task Board',
    type: 'task_board',
    isShared: true,
    shareToken: 'atlauz-bento-token-7f9a12c',
    accessLevel: 'co-editor',
    crdtClock: 142,
    collaborators: [
      {
        id: 'u-1',
        initials: 'LK',
        name: 'Dr. Sarah Lin',
        role: 'Visiting Faculty • Acoustic Lead',
        institution: 'Woods Hole & MIT',
        isEditing: true,
        presenceStatus: 'online',
        activeBlockId: 'blk-2',
        currentAction: 'Refining salinity coefficient in Eq. 4.2',
        lastActiveTime: 'Just now',
        accessLevel: 'co-editor'
      },
      {
        id: 'u-2',
        initials: 'RA',
        name: 'R. Adams',
        role: 'Signal Processing Specialist',
        institution: 'Scripps Oceanic',
        isEditing: false,
        presenceStatus: 'online',
        currentAction: 'Reviewing piezoceramic test telemetry',
        lastActiveTime: '2m ago',
        accessLevel: 'co-editor'
      },
      {
        id: 'u-3',
        initials: 'EL',
        name: 'Elena K.',
        role: 'Postgraduate Fellow',
        institution: 'Hadal Biosystems',
        isEditing: false,
        presenceStatus: 'idle',
        currentAction: 'Viewing task progression matrix',
        lastActiveTime: '14m ago',
        accessLevel: 'commenter'
      }
    ],
    blocks: [
      {
        id: 'blk-1',
        content: 'Calibrate piezoceramic hydrophone response curve (-182 dB ref 1V/uPa)',
        author: 'R. Adams',
        initials: 'RA',
        timestamp: '10:14 AM',
        status: 'verified',
        crdtVersion: 12
      },
      {
        id: 'blk-2',
        content: 'Incorporate seawater salinity attenuation alpha coefficient into Eq. 4.2',
        author: 'Dr. Sarah Lin',
        initials: 'LK',
        timestamp: 'Just now',
        status: 'editing',
        crdtVersion: 15
      },
      {
        id: 'blk-3',
        content: 'Compile bibliography into shared Notion & Google Docs live block',
        author: 'Elena K.',
        initials: 'EL',
        timestamp: '09:40 AM',
        status: 'completed',
        crdtVersion: 9
      }
    ]
  },
  {
    id: 'collab-bento-2',
    title: 'Collaborative Note Canvas: Signal Vocoder',
    type: 'note_canvas',
    isShared: true,
    shareToken: 'atlauz-bento-token-3d8e5b0',
    accessLevel: 'co-editor',
    crdtClock: 98,
    collaborators: [
      {
        id: 'u-1',
        initials: 'LK',
        name: 'Dr. Sarah Lin',
        role: 'Visiting Faculty • Acoustic Lead',
        institution: 'Woods Hole & MIT',
        isEditing: false,
        presenceStatus: 'online',
        currentAction: 'Reviewing spectral resolution formulas',
        lastActiveTime: '5m ago',
        accessLevel: 'co-editor'
      },
      {
        id: 'u-4',
        initials: 'MC',
        name: 'Marcus Chen',
        role: 'Hardware Transducer Engineer',
        institution: 'Tokyo Tech MechE',
        isEditing: true,
        presenceStatus: 'online',
        activeBlockId: 'note-blk-2',
        currentAction: 'Simulating tactile resonant impulse at 240Hz',
        lastActiveTime: 'Just now',
        accessLevel: 'co-editor'
      }
    ],
    blocks: [
      {
        id: 'note-blk-1',
        content: 'FFT frame window set to 2048 samples with 75% overlap for acoustic spectrogram smoothness.',
        author: 'Dr. Sarah Lin',
        initials: 'LK',
        timestamp: '10:02 AM',
        status: 'verified',
        crdtVersion: 6
      },
      {
        id: 'note-blk-2',
        content: 'Tactile resonant frequency confirmed at 240Hz for LRA impulse latency under 0.8ms.',
        author: 'Marcus Chen',
        initials: 'MC',
        timestamp: 'Just now',
        status: 'editing',
        crdtVersion: 8
      }
    ]
  },
  {
    id: 'collab-bento-3',
    title: 'Hadal Link & Deep Sources Vault',
    type: 'link_vault',
    isShared: true,
    shareToken: 'atlauz-bento-token-a901ff4',
    accessLevel: 'co-editor',
    crdtClock: 34,
    collaborators: [
      {
        id: 'u-2',
        initials: 'RA',
        name: 'R. Adams',
        role: 'Signal Processing Specialist',
        institution: 'Scripps Oceanic',
        isEditing: false,
        presenceStatus: 'online',
        currentAction: 'Indexing oceanic open datasets',
        lastActiveTime: '1h ago',
        accessLevel: 'co-editor'
      },
      {
        id: 'u-1',
        initials: 'LK',
        name: 'Dr. Sarah Lin',
        role: 'Visiting Faculty • Acoustic Lead',
        institution: 'Woods Hole & MIT',
        isEditing: false,
        presenceStatus: 'online',
        currentAction: 'Bookmarking bathyal propagation papers',
        lastActiveTime: '22m ago',
        accessLevel: 'co-editor'
      }
    ],
    blocks: [
      {
        id: 'link-1',
        content: 'https://arxiv.org/abs/2403.09112 — Deep Trench Acoustic Scattering Models (Cited by 14)',
        author: 'R. Adams',
        initials: 'RA',
        timestamp: 'Yesterday',
        status: 'verified',
        url: 'https://arxiv.org/abs/2403.09112',
        category: 'Paper',
        crdtVersion: 3
      },
      {
        id: 'link-2',
        content: 'https://github.com/ocean-acoustics-rust/mariana-core — Wasm FFT Synthesizer Engine v2.1',
        author: 'You',
        initials: 'YOU',
        timestamp: 'Sep 24',
        status: 'verified',
        url: 'https://github.com/ocean-acoustics-rust/mariana-core',
        category: 'Repository',
        crdtVersion: 5
      }
    ]
  }
];

export const initialRestDaysVault: RestDayVaultEntry[] = [
  {
    id: 'rest-1',
    date: 'Sep 26, 2026',
    triggerType: 'telemetry_fatigue_lock',
    label: 'Cognitive Recovery & Circadian Realignment',
    protectedStreakDay: 28,
    sleepHours: 8.5,
    wellnessHours: 2.5,
    status: 'protected',
    notes: 'Cognitive vital dropped to 72% after prolonged multi-modal sprint. Automatic freeze engaged to preserve 28-day habit loop.'
  },
  {
    id: 'rest-2',
    date: 'Sep 19, 2026',
    triggerType: 'circadian_reset',
    label: 'Deep Sleep & Sensory Detox Block',
    protectedStreakDay: 21,
    sleepHours: 9.0,
    wellnessHours: 3.0,
    status: 'protected',
    notes: 'Scheduled restorative block post-sprint symposium. Anti-burnout guard activated without penalty.'
  },
  {
    id: 'rest-3',
    date: 'Sep 12, 2026',
    triggerType: 'manual_schedule',
    label: 'Symposium Buffer & Field Rest Day',
    protectedStreakDay: 14,
    sleepHours: 8.0,
    wellnessHours: 4.0,
    status: 'protected',
    notes: 'Pre-planned travel day; zero cognitive task switches logged.'
  }
];

export const initialScrapbookItems: ScrapbookItem[] = [
  {
    id: 'sb-1',
    type: 'url',
    title: 'arXiv:2403.09112 • Hadal Acoustic Propagation',
    content: 'https://arxiv.org/abs/2403.09112',
    domain: 'arxiv.org',
    previewText: 'Empirical verification of ultrasonic acoustic duct scattering in Challenger Deep trench at 11,034 meters depth.',
    stagedTime: '12m ago',
    tags: ['Acoustics', 'Paper', 'Unfiled']
  },
  {
    id: 'sb-2',
    type: 'code',
    title: 'Fast Fourier Window Normalization (Rust Wasm)',
    content: `pub fn normalize_hadal_spectrum(bins: &mut [f32], salinity: f32) {\n    let alpha = 0.048 * (1.0 + (salinity - 35.0) * 0.02);\n    for (i, val) in bins.iter_mut().enumerate() {\n        *val *= (-alpha * (i as f32) * 0.001).exp();\n    }\n}`,
    codeLanguage: 'rust',
    stagedTime: '35m ago',
    tags: ['Code', 'Wasm', 'Algorithms']
  },
  {
    id: 'sb-3',
    type: 'text',
    title: 'Dr. Sarah Lin Symposium Feedback',
    content: 'Review the hydrophone voltage calibration curve in Section 3.4 before the Friday faculty presentation. Ensure the salinity coefficient constant matches the 4°C isothermal bathyal oceanic data.',
    stagedTime: '1h ago',
    tags: ['Notes', 'Review']
  },
  {
    id: 'sb-4',
    type: 'voice',
    title: 'Audio Memo: Circadian Cadence Check',
    content: 'Dictated audio transcript: "Remember to lock the 45-minute sprint cadence before the evening writing block to keep streak protection intact."',
    audioDuration: '0:42',
    stagedTime: '3h ago',
    tags: ['Voice', 'Cadence']
  }
];

