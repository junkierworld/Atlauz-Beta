import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, GitCommit, Calendar, Clock, User, ShieldCheck, Sparkles, Layers, ChevronDown, ChevronUp, ChevronRight, Cpu, CheckCircle2, Users, Terminal } from 'lucide-react';

interface VersionTechSpecs {
  engine: string;
  storage: string;
  privacy: string;
  layout: string;
  framerate: string;
}

interface VersionPatch {
  version: string;
  codename: string;
  date: string;
  time: string;
  author: string;
  isCurrent?: boolean;
  highlight: string;
  specs: VersionTechSpecs;
  changes: {
    category: string;
    items: string[];
  }[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  subsystems: string;
  contributions: string;
  avatarGlyph: string;
}

export const ATLAUZ_ENGINEERING_CREW: TeamMember[] = [
  {
    id: 'gultiano',
    name: 'Developer Gultiano',
    role: 'Lead Systems Architect & Full-Stack Engine',
    subsystems: 'Core Workspace Layouts, Curricular Portals, Cognitive Study Suite, React/Vite Infrastructure',
    contributions: 'v1.0.0, v1.1.0 (with Dev Belo), v1.1.1, v1.1.2, v1.1.3, v1.1.4, v1.1.5, v1.2.0, and Before v1.0.0 Genesis',
    avatarGlyph: 'DG'
  },
  {
    id: 'belo',
    name: 'Developer Belo',
    role: 'Co-Architect & Distributed Workspaces',
    subsystems: 'Collaborative Bento CRDTs, Hadal Iceberg Visualizer, Distributed Study Sprints',
    contributions: 'v1.1.0 and Before v1.0.0 Genesis',
    avatarGlyph: 'DB'
  },
  {
    id: 'abalos',
    name: 'Developer Abalos',
    role: 'Curricular Frameworks & Pedagogy Systems',
    subsystems: 'Module Syllabus Architecture, Conceptual Knowledge Verifications, Accreditation Standards',
    contributions: 'Before v1.0.0 Genesis Architecture',
    avatarGlyph: 'DA'
  },
  {
    id: 'mabini',
    name: 'Developer Mabini',
    role: 'Web Audio DSP & Acoustic Ambience',
    subsystems: 'Web Audio API Synthesizers, Binaural White Noise Shaders, TTY Bell Frequency Modulation',
    contributions: 'Before v1.0.0 Genesis Architecture',
    avatarGlyph: 'DM'
  },
  {
    id: 'paycana',
    name: 'Developer Paycana',
    role: 'Visual Ergonomics & Typography Layouts',
    subsystems: 'Monochrome Phosphor Shaders, 5-Modality Readers, 20-20-20 Visual Rest Guidelines',
    contributions: 'Before v1.0.0 Genesis Architecture',
    avatarGlyph: 'DP'
  },
  {
    id: 'antonio',
    name: 'Developer Antonio',
    role: 'Local State Persistence & Vault Storage',
    subsystems: 'Schema-Validated LocalStorage, Hex-Dump Records, Offline Rest Days Vault',
    contributions: 'Before v1.0.0 Genesis Architecture',
    avatarGlyph: 'DAn'
  }
];

const PATCH_HISTORY: VersionPatch[] = [
  {
    version: 'v1.2.0',
    codename: 'Conceptual Atmosphere & 9 Living Themes Engine',
    date: 'October 06, 2026',
    time: '10:10 UTC',
    author: 'Developer Gultiano',
    isCurrent: true,
    highlight: 'Comprehensive sensory and atmospheric visual system introducing 9 handcrafted conceptual themes with soft ambient textures, adaptive color shades, and harmonized ecosystem styling. Includes Passionate Koi, Salmon Pink, Atlauz Blue, Summer Breeze, Coral Reef, Fancy Caviar, Atlauz Deluxe, Moonlight Delight, and Wishful Milkfish, complete with Header Quick Switcher and Scholar Profile gallery.',
    specs: {
      engine: 'React 18 + Vite + TypeScript Strict',
      storage: 'Persistent LocalStorage + CSS Custom Variables Engine',
      privacy: 'Zero Remote Telemetry & Complete Local Autonomy',
      layout: '9 Conceptual Palettes with Soft Ambient Canvas Textures',
      framerate: '60 FPS Smooth CSS Color Transitions & Texture Overlays'
    },
    changes: [
      {
        category: '9 Handcrafted Conceptual Living Themes',
        items: [
          'Passionate Koi: Fiery vitality and dynamic flow with crimson vermilion accents and Japanese watercolor texture.',
          'Salmon Pink: Warm rose dusk and soothing salmon blush with calming cognitive pace.',
          'Atlauz Blue: Abyssal pelagic trench with bioluminescent cerulean accents and sonar ripples.',
          'Summer Breeze: Coastal spruce with seafoam mint breeze and warm sunlit amber.',
          'Coral Reef: Oceanic reef trench with glowing coral magenta and tropical turquoise.',
          'Fancy Caviar: Ultra-luxe sturgeon black with golden caviar pearls and micro-dot texture.',
          'Atlauz Deluxe: Carbon titanium with imperial champagne gold and emerald jade highlights.',
          'Moonlight Delight: Midnight indigo ether with silver-violet moonlight and celestial stardust.',
          'Wishful Milkfish: Iridescent silver mist with pearlescent native marine heritage.'
        ]
      },
      {
        category: 'Soft Ambient Canvas Textures & Adaptive Shades',
        items: [
          'Engineered non-intrusive soft background ambient textures rendered via GPU hardware-accelerated CSS overlays.',
          'Dynamic adaptive font contrast ensuring razor-sharp legibility across all theme backgrounds and cards.',
          'Automatic harmonized aquarium lighting and tank gradient synchronization.'
        ]
      },
      {
        category: 'Theme Switcher Quick Bar & Scholar Profile Gallery',
        items: [
          'Added instant 1-tap Theme Palette pill button directly on the top global Header bar.',
          'Integrated full visual swatch gallery modal in Scholar Profile Preferences with mood descriptions.',
          'Instant non-blocking theme activation with zero page reloads or layout shift.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.5',
    codename: 'Academic Role & Active Ecosystem Rework',
    date: 'October 06, 2026',
    time: '08:35 UTC',
    author: 'Developer Gultiano',
    isCurrent: false,
    highlight: 'Comprehensive architectural rework decoupling Student, Researcher, and Educator role experiences into tailored active ecosystems. Transforms the Homepage into a distraction-free 2-Column Urgent Action Wireframe featuring Pinned Content (up to 4 quick-transport cards), Focus Mode Shortcuts (Focus, Bento, Pile, Collab), Due Activities sorted by urgency (with 3-item initial gate and expansion), and To-Do Tasks linked directly to notebooks and docs. Introduces the Modular Hub & Ecosystem Widget Customizer inside Scholar Profile with live preview presets, Hybrid Role-Owned Library Shelving, and Granular Connected App Permission Controls.',
    specs: {
      engine: 'React 18 + Vite + TypeScript Strict',
      storage: 'Persistent LocalStorage + Schema-Validated Snapshots',
      privacy: 'Per-App Granular Permissions (Read/Write/Sync/Isolation)',
      layout: '2-Column Urgent Action Wireframe & Modular Widget Matrix',
      framerate: '60 FPS Hardware-Accelerated Layout & Transitions'
    },
    changes: [
      {
        category: 'Zero-Clutter 2-Column Urgent Action Homepage',
        items: [
          'Engineered high-focus 2-column layout displaying strictly high-urgency study actions based on the wireframe design.',
          'Top Left: Pinned Content 2x2 matrix featuring up to 4 quick-transport shortcut cards across all app resources and widgets.',
          'Top Right: Focus Mode Shortcut stack providing 1-tap transport to Focus Mode, Bento Mode, Pile Mode, and Collab Mode.',
          'Bottom Left: Due Activities queue sorted by critical urgency with 3-item initial view and expandable drawer.',
          'Bottom Right: To-Do Tasks board specific to notebook and document actions with inline task creator and 1-tap jump.'
        ]
      },
      {
        category: 'Modular Hub Widget Customizer in Scholar Profile',
        items: [
          'Added dedicated Hub & Widget Customizer tab in Scholar Profile with phone-like modular widget toggles.',
          'Built-in layout presets: Minimalistic, Balanced Focus (Default), and Maximalist Living Ecosystem.',
          'Live interactive Homepage Preview mockup reflecting toggles in real-time before applying.'
        ]
      },
      {
        category: 'Hybrid Role-Owned Library Shelving System',
        items: [
          'Added multi-mode shelving system switchable between Subject Categories, Role-Owned Shelves, and Hybrid Mode.',
          'Dedicated shelves for Personal (Journals & Scratchpads), Academic (Coursework & Lessons), Researcher (Papers & PDFs), and Educator (Slides & Decks).',
          'Updated volume metadata editor with explicit Role Shelf selector and persistent assignment.'
        ]
      },
      {
        category: 'Connected App Permission & Security Matrix',
        items: [
          'Added explicit granular permission toggles for all integrated third-party apps (Google Drive, Google Calendar, Notion, Zotero, Canvas LMS, Spotify).',
          'Four-dimensional security gates: Read Access, Write Access, Background Sync, and Telemetry Isolation.',
          'Zero-telemetry policy enforced: third-party syncing is disabled by default until user explicitly authorizes.'
        ]
      },
      {
        category: 'Upcoming Role-Focused Roadmap Alignment',
        items: [
          'Planned and structured upcoming dedicated role releases: v1.1.6 Student Role Update, v1.1.7 Researcher Role Update, and v1.1.8 Educator Role Update.',
          'Maintained strict author attribution across Atlauz.co engineering history.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.4',
    codename: 'Cognitive Study Suite & Living Ecosystem',
    date: 'October 06, 2026',
    time: '07:30 UTC',
    author: 'Developer Gultiano',
    isCurrent: false,
    highlight: 'Comprehensive academic study and living ecosystem expansion introducing Spaced Repetition Flashcards with Leitner intervals, Collaborative Live Study Lounge, Competency Skill Radar Visualizer in Scholar Profile, Timed Practice Capstone Exams with passing grade gates, an interactive Bidirectional Note Knowledge Graph, Printable Syllabus Checklists, Aquarium Ambient Weather & Interactive Fish Playtime, and Circadian Bedtime Wind-Down & 20-20-20 Eye Breaks.',
    specs: {
      engine: 'React 18 + Vite + TypeScript Strict',
      storage: '100% Offline LocalStorage Persistence + JSON Export',
      privacy: 'Zero Remote Telemetry & Complete Local Autonomy',
      layout: 'Interactive 2D Physics Canvas, SVG Radar, & Modal Sandboxes',
      framerate: '60 FPS Hardware-Accelerated Vector Graphics & Physics'
    },
    changes: [
      {
        category: 'Spaced Repetition Active Recall Engine',
        items: [
          'Engineered interactive Flashcard Decks with 3D perspective flip animations and Leitner 5-box memory scheduling.',
          'Recall confidence rating controls (Again, Hard, Good, Easy) dynamically adjusting next review intervals.',
          'Visual mastery progress rings and daily review queue counters.'
        ]
      },
      {
        category: 'Live Collaborative Study Lounge',
        items: [
          'Virtual co-presence study lounge rooms with synchronized Pomodoro sprint timers.',
          'Peer intention tags and focus commitment check-ins promoting healthy study accountability.',
          'Focused quiet room mode eliminating distractions during deep research sprints.'
        ]
      },
      {
        category: 'Competency Skill Radar Visualizer',
        items: [
          'Dynamic multi-axis SVG spider radar chart embedded inside the Scholar Profile drawer.',
          'Tracks mastery vectors across Computer Science, Cognitive Science, Marine Ecology, Distributed Systems, and Research Methodology.',
          'Real-time polygon expansion as students complete courses, modules, and practice exams.'
        ]
      },
      {
        category: 'Timed Practice Capstone Exams',
        items: [
          'Formal timed assessment engine with ticking countdown clock and multi-question scenario evaluation.',
          'Strict passing threshold gate (>= 80%) required for course graduation and degree release.',
          'Instant review review breakdown with conceptual explanations for each exam question.'
        ]
      },
      {
        category: 'Interactive Bidirectional Knowledge Graph',
        items: [
          'Full-screen 2D interactive canvas mapping interconnected documents, notebooks, and concepts.',
          'Draggable node physics simulation with elastic force-directed link lines.',
          'Instant substring search filtering and 1-tap node launch directly into native readers.'
        ]
      },
      {
        category: 'Printable Syllabus Checklists',
        items: [
          'High-contrast, printable syllabus checklists designed for offline binders and physical desks.',
          'Course code headers, milestone check-off circles, and verifiable graduation hashes.'
        ]
      },
      {
        category: 'Aquarium Weather & Interactive Fish Playtime',
        items: [
          'Ambient tank climate shaders: Sunlight Shafts, Gentle Rain Ripples, and Midnight Abyss lunar glow.',
          'Interactive tap-ripples and pointer-tracking causing companion fish to follow touch coordinates and perform 360-degree loop-de-loops.',
          'Vitality boost feedback celebrating active study consistency.'
        ]
      },
      {
        category: 'Circadian Bedtime & 20-20-20 Eye Breaks',
        items: [
          'Gentle circadian sleep wind-down reminders and ambient warm amber dimming during sustained late-night sessions.',
          'Ergonomic 20-20-20 rule prompts (look 20 feet away for 20 seconds) paired with neck and shoulder stretches.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.3',
    codename: 'Curricular Learning Paths & Accredited Degrees',
    date: 'October 06, 2026',
    time: '06:45 UTC',
    author: 'Developer Gultiano',
    highlight: 'Transformed Atlauz from a self-directed study station into an accredited mastery academy by introducing the Curricular Learning Paths Portal within the Library, sequential node-based syllabi, self-paced conceptual knowledge checks, cryptographically hashed degree certificates, Scholar Profile badges, and rare living companion fish unlocks.',
    specs: {
      engine: 'React 18 + Vite SPA (TypeScript Strict)',
      storage: 'Persistent LocalStorage + Schema-Validated Snapshots',
      privacy: 'Zero Remote Telemetry & Complete Local Autonomy',
      layout: 'Two-Zone Interactive Sandbox (Node Stage + Concept Deck)',
      framerate: '60 FPS Vector Animations & DOM Transitions'
    },
    changes: [
      {
        category: 'Curricular Learning Paths Portal',
        items: [
          'Prominent Curricular Academy gateway banner card at the top of the Library above shelves.',
          'Two-zone full-screen learning portal featuring interactive node roadmaps and milestone concept decks.',
          'Syllabus catalog with domain filtering and built-in Custom Curriculum Builder.'
        ]
      },
      {
        category: 'Self-Paced Conceptual Knowledge Checks',
        items: [
          'Interactive milestone verification modal testing student comprehension with multiple-choice questions.',
          'Instant feedback with detailed pedagogical explanations and conceptual remediation.',
          'Passing checks illuminates node with green verification rings and unlocks subsequent stages.'
        ]
      },
      {
        category: 'Verifiable Cryptographic Degree Certificates',
        items: [
          'High-resolution printable certificate documents featuring the official Atlauz Gold Seal and academic lead signature.',
          'Unique cryptographic verification hash (e.g. ATL-2026-CERT-[HASH]) with 1-click clipboard copying.',
          'Dedicated Certificates Vault tab organizing all earned degrees and honor standings.'
        ]
      },
      {
        category: 'Rare Exotic Companion Fish Unlocks',
        items: [
          'Graduation unlocks rare species directly into the living aquarium: Luminescent Anglerfish, Ancient Coelacanth, Golden Nautilus, and Chromashift Betta.',
          'Distinctive biological traits, personality labels, and tank resident badges.'
        ]
      },
      {
        category: 'Scholar Profile Accreditations Showcase',
        items: [
          'Slide-out profile drawer section exhibiting earned degrees, verified tags, and direct navigation to the degree vault.',
          '100% offline persistence and complete inclusion in the JSON backup export/import pipeline.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.2',
    codename: 'Focus-Portal Shelves & Pet Welcome Cockpit',
    date: 'October 02, 2026',
    time: '13:40 UTC',
    author: 'Developer Gultiano',
    highlight: 'Major architectural upgrade transforming static library shelves into full-screen distraction-free Dark Focus Portals, overhauling Companion sub-navigation with a refined Aquarium/Streak/Anatomy taxonomy, shifting Light Mode to a calm light-gray architectural grid canvas, deploying the Hub Scholar Pet Welcome banner with 40-75s auto-rotating speech bubbles, streamlining the Workspace into a compact 2x2 mode matrix, and standardizing 1:1 bottom navigation touch targets.',
    specs: {
      engine: 'React 18 + Vite SPA (TypeScript Strict)',
      storage: '100% Offline LocalStorage Persistence',
      privacy: 'Zero Remote Telemetry & Complete Local Autonomy',
      layout: 'Single-Column Responsive Grid + Full-Screen Focus Portals',
      framerate: '60 FPS Hardware-Accelerated Canvas & CSS Transitions'
    },
    changes: [
      {
        category: 'Focus-Portal Shelves Architecture',
        items: [
          'Transformed static horizontal shelf rows on the main library hub into responsive, interactive Portal Shortcut Cards.',
          'Clicking any shelf transports the student into a dedicated, full-screen dark focus sanctuary (z-50 bg-[#070707]) that completely unmounts top app headers and bottom navigation docks.',
          'Built dedicated in-portal navigation header featuring a high-visibility "Exit Shelf" return trigger, real-time volume counters, and category iconography.',
          'Integrated in-shelf search filter with instant substring matching across document titles, authors, and metadata.',
          'Embedded multi-criteria sorting engine supporting Alphabetical (A-Z), Pinned Priority, Starred Favorites, and Chronological Recency.',
          'Rendered individual volume covers with dynamic spine styling, visual format indicators, and 1-tap reader launch.'
        ]
      },
      {
        category: 'Companion Aquarium Icon Taxonomy & Navigation',
        items: [
          'Standardized companion selection tabs into a crystal-clear 3-tier taxonomy: Aquarium (Aquarium icon), Streak History (Snowflake icon), and Anatomy/Biological Inspection (Fish icon).',
          'Completely purged redundant legacy Security tab from companion controls, eliminating visual clutter and consolidating security into the Profile Drawer.',
          'Enhanced sub-view switcher with active glow pill, subtle scale transitions, and instant DOM swap without page redraw lag.'
        ]
      },
      {
        category: 'Light Mode Gray-Grid Systemic Restyle',
        items: [
          'Shifted the light theme canvas from harsh pure white (#FFFFFF) to a soft, eye-comfort light-gray tone (#e5e7eb) with architectural white grid lines (rgba(255, 255, 255, 0.7)).',
          'Refactored surface tokens into layered slate-gray elevations (Surface-1: #eceef2, Surface-2: #f3f4f6, Surface-3: #e5e7eb, Surface-4: #d1d5db) with crisp Slate-700 text contrast.',
          'Enforced strict visual isolation ensuring physical book spines, document color bands, and living fish canvas retain 100% saturation and vividness without chromatic washout.'
        ]
      },
      {
        category: 'Hub Pet Welcome & Dynamic Motivational Bubble',
        items: [
          'Positioned the student active companion fish at the primary viewport pinnacle of the Daily Hub.',
          'Designed dynamic speech balloon featuring automated rotating quotes on a randomized 40–75 second cycle to encourage focus without becoming repetitive.',
          'Built-in 1-tap instant shuffle button enabling manual message cycling on demand.',
          'Curated positive psychology motivational phrases, cognitive pause reminders, and custom student reflection prompts.'
        ]
      },
      {
        category: 'Workspace Compact 2x2 Mode Selector & Clutter Stripping',
        items: [
          'Arranged Focus Mode, 3D Pile Stack, 2x2 Bento Grid, and Live Collab into a balanced 2-column × 2-row compact switcher.',
          'Purged redundant sprint timers and external "No Distraction" toggle buttons from the standard un-focused workspace header.',
          'Removed artificial numerical badge overlays from the 3D Pile Stack cards to ensure visual focus remains entirely on document contents and previews.'
        ]
      },
      {
        category: 'Uniform Bottom Navigation & Patch Accordion Polish',
        items: [
          'Standardized 1:1 aspect-ratio square buttons across all 5 bottom navigation tabs (Hub, Workspace, Library, Companion, Relax) with uniform touch hitboxes.',
          'Calibrated inactive tab opacity to 0.45 with high-contrast active state indicators.',
          'Engineered full-viewport modal containment (h-[100dvh] max-h-[100dvh]) with smooth hardware-accelerated touch-pan-y scrolling.',
          'Standardized patch log entries into clean header-only summaries with on-demand [Click More] expansion.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.1',
    codename: 'Shelves & Hadal Iceberg Expansion',
    date: 'October 02, 2026',
    time: '13:00 UTC',
    author: 'Developer Gultiano',
    highlight: 'Introduced foundational Library Shelves categorizing learning assets across academic subjects, introduced comprehensive MIME format visual differentiation (filmstrips, folders, hardcover books, softcover lessons, spiral notebooks), decluttered primary workstation headers, and deployed the Hadal Streak History Iceberg visualizer.',
    specs: {
      engine: 'React 18 + Tailwind CSS + Lucide Icons',
      storage: 'Persistent LocalStorage Key-Value Store',
      privacy: 'Zero External API Calls & Zero Analytics Tracking',
      layout: 'Horizontal Scrolling Categorical Shelves + 3D Iceberg Canvas',
      framerate: '60 FPS Vector & Canvas Interpolation'
    },
    changes: [
      {
        category: 'Library Shelves Architecture & Category Indexing',
        items: [
          'Pre-scan Shelf categorization grouping learning materials into Computer Science, Mathematics, Humanities, Biology, and Cognitive Science.',
          'Built category icons, internal shelf tag indexing, and instantaneous filter chips.',
          'Supported shelf reordering and instant book shelf assignment modal.'
        ]
      },
      {
        category: 'MIME & Format Visual Language Taxonomy',
        items: [
          'Google Slides rendered as tactile filmstrips with miniature slide preview frames.',
          'Google Docs and PDF research papers styled as professional folder binders with tabbed indexing.',
          'Full-term Course textbooks rendered as dark, cloth-bound hardcover books with embossed gold spine lettering.',
          'Standalone Lessons styled as clean light softcover volumes with chapter progress meters.',
          'Notebooks and Personal Study Journals presented with realistic spiral coil ring-bindings and tab dividers.'
        ]
      },
      {
        category: 'Companion Aquarium Streak History Iceberg',
        items: [
          'Engineered the Deep-Sea Hadal Iceberg visualizer mapping student study consistency and cognitive endurance across deep geological strata.',
          'Integrated multi-timeframe historical comparison supporting 7-Day Sprints, 30-Day Monthly Epochs, and 365-Day Academic Year views.',
          'Atmospheric Mountain Peak displaying active streak elevation, ambient rising oxygen bubbles, and royal blue abyssal freeze strata.',
          'Benthic oceanic depth gauge converting study minutes into oceanic oceanographic depth zones (Epipelagic to Hadal Trench).'
        ]
      },
      {
        category: 'Rest Days Vault & Streak Freezing Engine',
        items: [
          'Constructed Rest Days Vault protecting study streaks during deliberate recovery days, medical downtime, or designated academic pauses.',
          'Configurable weekly freeze allowances (1–3 days) preventing psychological burnout without punishing the student.',
          'Visual ice-crystal badge overlay on streak counters when active.'
        ]
      },
      {
        category: 'Header Decluttering & Robotic Tab Reorganizer',
        items: [
          'Removed non-essential status chips and secondary stats from the top header to maximize vertical screen space.',
          'Integrated Robotic Workspace Tab Reorganizer that auto-clusters open research tabs by subject tags and citation links.'
        ]
      }
    ]
  },
  {
    version: 'v1.1.0',
    codename: 'Workstation Streamline & Local Resilience',
    date: 'October 02, 2026',
    time: '09:30 UTC',
    author: 'Developer Gultiano and Developer Belo',
    highlight: 'Re-architected homepage into a cognitive Urgent Action Queue, implemented an anti-hoarding 8-tab LRU workspace cap, redesigned user profile & session telemetry in the sidebar, built JSON backup/restore import-export engine, and enhanced single-column mobile viewport reflow.',
    specs: {
      engine: 'React 18 + Lucide Icons + Motion',
      storage: 'JSON Schema-Validated LocalStorage Engine',
      privacy: 'Zero Third-Party Cloud Transmission',
      layout: 'Adaptive Single-Column Mobile Reflow + Desktop Split Cockpit',
      framerate: '60 FPS DOM & Transition Animations'
    },
    changes: [
      {
        category: 'Homepage Urgent Action Priority Queue',
        items: [
          'Eliminated dense dashboard telemetry in favor of a focused Urgent Action Queue highlighting high-stakes priorities.',
          'Real-time exam and assignment countdown timers with color-coded urgency thresholds (Amber < 72h, Crimson < 24h).',
          'One-click immediate resumption of in-progress documents, reading bookmarks, and active course modules.',
          'Collapsible secondary metrics drawer allowing students to inspect weekly telemetry only when intentionally requested.'
        ]
      },
      {
        category: 'Workspace Tab Hoarding Mitigation (8-Tab LRU Cap)',
        items: [
          'Implemented strict 8-tab ceiling in the central workspace to combat context switching and browser memory exhaustion.',
          'Least Recently Used (LRU) auto-archival system gracefully shelving inactive tabs to the persistent library shelf without data loss.',
          'Anti-hoarding warning modal with 1-tap shelf consolidation.'
        ]
      },
      {
        category: 'Sidebar Profile Remodel & Session Telemetry',
        items: [
          'Transformed generic sidebar into a personalized Scholar Profile and biometric workstation hub.',
          'Comprehensive study metrics: Deep Focus Hours, Average Session Length, Velocity Score, and Cognitive Rest Ratios.',
          'Passkey security lock allowing students to lock their active session with 1-click or biometric passkey simulation.'
        ]
      },
      {
        category: 'Fault-Tolerant Local Storage & Backup Engine',
        items: [
          'Zero-cloud offline-first data layer saving all documents, books, annotations, notes, and companion states directly to browser localStorage.',
          'One-click JSON backup export enabling students to download full workstation snapshots.',
          'Schema-validated JSON import tool with conflict detection and automated rollback protection.'
        ]
      }
    ]
  },
  {
    version: 'v1.0.0',
    codename: 'Atlauz Foundation Prototype',
    date: 'September 28, 2026',
    time: '00:00 UTC',
    author: 'Developer Gultiano',
    highlight: 'Initial foundation release establishing the zero-context-switch academic workstation, 5 comprehensive document reader & editor modalities, procedural living fish companion tank, 4 workspace layout matrices, adaptive white noise audio engine, and deterministic pure TypeScript architecture.',
    specs: {
      engine: 'React 18 + Vite + Tailwind CSS + Web Audio API',
      storage: 'Browser LocalStorage Key-Value Store',
      privacy: 'Zero Telemetry & Non-AI Deterministic Design',
      layout: '4 Workspace Layouts (Focus, 3D Pile, Bento, Collab)',
      framerate: '60 FPS Procedural HTML5 Canvas Rendering'
    },
    changes: [
      {
        category: 'Zero-Context-Switch Academic Workstation',
        items: [
          'Unified multi-modal academic workspace eliminating disruptive tab-switching between external readers, text editors, and study tools.',
          '4 high-productivity layout configurations: Immersive Single-Pane Focus, Interactive 3D Stack Deck (Pile Mode), 2x2 Bento Multitasking Grid, and Collaborative Split View.',
          'Persistent cross-document scratchpad allowing instant note capture without losing position in active study documents.',
          'Instant card maximizing on click and smooth spring shrinkage back to shelf or deck upon close.'
        ]
      },
      {
        category: 'Comprehensive 5-Modality Document Suite',
        items: [
          'Dedicated Google Docs rich text editor with full formatting controls, typography presets, word/character metrics, and distraction-free editing.',
          'Presentation viewer with 16:9 slide rendering, full-screen slide projector view, and speaker note integration.',
          'Realistic Ebook Reader with dual-column page flipping, adjustable font scales, sepia/dark themes, and persistent bookmarking.',
          'Spiral-bound Academic Notebook with lined ruled paper, chapter division, and quick syntax highlighting.',
          'High-fidelity PDF viewer with page jump controls, zoom magnification, and document outline navigation.',
          'Interactive Structured Lesson player with progressive step completion and mastery checks.'
        ]
      },
      {
        category: 'Biomimetic Living Fish Companion Tank',
        items: [
          'Canvas-based procedural aquatic companion simulating realistic biological swimming physics, tail wagging, and fin dynamics at 60 FPS.',
          'Real-time mood and vitality engine linked directly to student study consistency, focus sessions, and active study hours.',
          'Interactive feeding and care mechanics: tapping drops nourishing food pellets; fish tracks and swims toward food particles.',
          'Customizable fish anatomy: adjustable scale hues, fin styles, aquatic decorations, and tank lighting.',
          'Deep-sea fishing minigame with reeling mechanics and mystery cans to unlock exotic companion species and bonus streak boosts.'
        ]
      },
      {
        category: 'Adaptive Audio Synthesizer & White Noise Ambience',
        items: [
          'Web Audio API procedural sound engine generating customizable binaural white noise and soundscapes without external audio streams.',
          'Four ambient sound environments: Abyssal Rainstorm, Deep Nordic Forest, Ocean Breakers, and Cosmic Alpha Binaural Drone.',
          'Independent channel volume sliders and master mute controls.'
        ]
      },
      {
        category: 'Deterministic Architecture & Strict Engineering Standards',
        items: [
          'Engineered with 100% strict TypeScript types, zero untyped any leaks, and modular atomic components.',
          'Zero reliance on external AI chatbots, conversational assistants, or LLM hallucination engines—prioritizing pure, deterministic human scholarship and cognitive autonomy.',
          'Tailored dark mode palette with custom CSS variable tokens, high-contrast typography, and fluid micro-transitions.'
        ]
      }
    ]
  },
  {
    version: 'Before v1.0.0',
    codename: 'Historical Genesis Archive (v0.1 – v0.9 Legacy Platform)',
    date: 'August – September 2026',
    time: 'Pre-Release Archive',
    author: 'Developer Gultiano, Developer Belo, Developer Abalos, Developer Mabini, Developer Paycana, and Developer Antonio',
    highlight: 'Consolidated development chronicle of the experimental pre-release cycle (v0.1 through v0.9) built on an entirely different platform—a monolithic C/C++ terminal environment with libcurses and raw ANSI VT100 console rendering by the founding Atlauz.co crew (Developer Gultiano, Developer Belo, Developer Abalos, Developer Mabini, Developer Paycana, and Developer Antonio)—before the architecture was reimagined, rewritten from scratch, and migrated to modern Web standards.',
    specs: {
      engine: 'C/C++ Monolithic Daemon (libcurses / ANSI VT100)',
      storage: 'Raw Flat-File CSV & Binary Hex-Dump Records',
      privacy: '100% Air-Gapped Terminal Execution (Zero Sockets)',
      layout: 'Strict 80x24 Monospace Character Matrix',
      framerate: '10-20 Hz TTY Buffer Interrupt Refresh'
    },
    changes: [
      {
        category: 'Legacy Platform & Terminal Architecture (v0.1 - v0.3)',
        items: [
          'Authored as an experimental monolithic C daemon (libcurses) targeting UNIX pseudo-terminals.',
          'Prototyped the initial zero-context-switching academic model in strict 80-column monospace.',
          'Raw ANSI text buffer reader operating on direct file descriptors with manual line-wrap and page slicing.',
          'Monochrome green phosphor and amber CRT escape sequences for night study simulation.',
          'Direct terminal bell frequency modulation for sprint interval alerts.'
        ]
      },
      {
        category: 'ASCII Benthic Aquarium Engine (v0.4 - v0.6)',
        items: [
          'First living companion iteration rendered completely in braille and ASCII characters (><(((\'>) swimming across an 80×24 matrix.',
          'Rudimentary sinusoidal wave equations driving text-based fin undulations in terminal stdout.',
          'Keyboard-driven food pellet drops rendered as asterisk particles falling through text buffers.',
          'Early mood vitality state machine linking typed keystroke frequency to ASCII swim speed.'
        ]
      },
      {
        category: 'Pre-Web State Serialization & Web Migration (v0.7 - v0.9)',
        items: [
          'CSV and raw binary hex-dump state persistence prior to JSON localStorage transition.',
          'Early prototypes of categorical academic shelves and streak freeze mechanics.',
          'Experimental ASCII iceberg height calculation based on accumulated session minutes.',
          'Formal architectural decision by Developer Gultiano and Developer Belo to sunset the terminal daemon and re-engineer Atlauz natively on modern Web standards (React, TypeScript, Canvas, Web Audio).'
        ]
      }
    ]
  }
];

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  isOpen,
  onClose
}) => {
  // Expanded patch version state (starts collapsed so only version, developer, date and Click More button are shown)
  const [expandedVersions, setExpandedVersions] = useState<Record<string, boolean>>({});
  const [selectedCrewMember, setSelectedCrewMember] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleVersionExpand = (version: string) => {
    setExpandedVersions(prev => ({
      ...prev,
      [version]: !prev[version]
    }));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#070707] flex flex-col h-[100dvh] max-h-[100dvh] w-full overflow-hidden font-sans select-none"
      >
        {/* Top Header Bar with Return Button */}
        <div className="h-16 px-4 sm:px-6 bg-[#0d0d0d] border-b border-neutral-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-black border border-neutral-700 flex items-center justify-center text-white shrink-0">
              <GitCommit className="w-5 h-5 text-neutral-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  ATLAUZ SYSTEM PATCH LOG
                </span>
                <span className="px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-300 font-mono text-[10px] font-bold">
                  v1.2.0 CURRENT
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-emerald-400 font-mono text-[10px] font-bold">
                  By Atlauz.co
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Focus Mode • Click More on any release to inspect detailed specifications
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Version History"
            className="min-h-[40px] px-4 py-2 rounded-lg bg-white hover:bg-neutral-200 text-black font-mono font-bold text-xs flex items-center gap-2 shadow-lg active:scale-95 transition-all"
          >
            <X className="w-4 h-4" />
            <span>Exit Patch Log</span>
          </button>
        </div>

        {/* Scrollable Version Logs Container with explicit flex-1 min-h-0 and smooth touch scrolling */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain touch-pan-y p-4 sm:p-6 space-y-4 max-w-4xl mx-auto w-full">
          {/* THE ATLAUZ.CO ENGINEERING CREW ROSTER CARD */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-4 sm:p-5 space-y-3.5 font-mono shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-neutral-800/80 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 text-white flex items-center justify-center shrink-0">
                  <Users className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>The Atlauz.co Engineering Crew</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-emerald-400 border border-neutral-700">
                      6 Core Developers
                    </span>
                  </h3>
                  <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                    Architects of the deterministic zero-context-switch academic workstation
                  </p>
                </div>
              </div>
              <span className="text-[11px] text-neutral-400 font-semibold">
                Development Team: <strong className="text-white">Atlauz.co</strong>
              </span>
            </div>

            {/* 6 Developer Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {ATLAUZ_ENGINEERING_CREW.map(member => {
                const isSelected = selectedCrewMember === member.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => setSelectedCrewMember(isSelected ? null : member.id)}
                    className={`p-2.5 rounded-xl border transition-all cursor-pointer group flex flex-col justify-between ${
                      isSelected
                        ? 'bg-neutral-900 border-neutral-600 ring-1 ring-neutral-500'
                        : 'bg-[#111111] border-neutral-850 hover:border-neutral-700 hover:bg-neutral-900/60'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <div className="w-7 h-7 rounded-lg bg-black border border-neutral-800 text-white text-[11px] font-bold flex items-center justify-center shrink-0 shadow-inner group-hover:border-neutral-600">
                        {member.avatarGlyph}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                          {member.name}
                        </h4>
                        <span className="text-[10px] text-neutral-400 block truncate font-sans">
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 pt-1.5 border-t border-neutral-800/80 text-[10px] text-neutral-400 flex items-center justify-between">
                      <span className="text-neutral-500">Focus:</span>
                      <span className="text-neutral-300 font-semibold truncate max-w-[130px] text-right">
                        {member.id === 'gultiano' ? 'Lead Core v1.0+' : member.id === 'belo' ? 'v1.1.0 & Genesis' : 'Genesis Core'}
                      </span>
                    </div>

                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 pt-2 border-t border-neutral-800 space-y-1 font-sans text-[11px] text-neutral-300"
                      >
                        <p><strong className="text-white font-mono text-[10px]">Subsystems:</strong> {member.subsystems}</p>
                        <p><strong className="text-white font-mono text-[10px]">Contributions:</strong> {member.contributions}</p>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Archival Milestone Genesis Note */}
            <div className="p-2.5 rounded-xl bg-black border border-neutral-850 flex items-start gap-2 text-xs text-neutral-400 font-sans">
              <Terminal className="w-3.5 h-3.5 text-neutral-300 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                <strong className="text-white font-mono">Archival Genesis Note:</strong> The experimental pre-release cycle (<code className="text-neutral-200">v0.1 – v0.9</code> under <strong>Before v1.0.0</strong>) was co-developed by the entire 6-person Atlauz.co crew (Developer Gultiano, Developer Belo, Developer Abalos, Developer Mabini, Developer Paycana, and Developer Antonio) on the legacy terminal platform prior to modern Web standards.
              </p>
            </div>
          </div>

          {/* ACADEMIC ROLE & ACTIVE ECOSYSTEM ROADMAP CADENCE */}
          <div className="rounded-2xl border border-neutral-800 bg-[#0d0d0d] p-4 sm:p-5 space-y-3 font-mono shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Academic Role & Active Ecosystem Roadmap
                </h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-700">
                4-Patch Release Cycle
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {/* v1.1.5 */}
              <div className="p-3 rounded-xl bg-neutral-900/90 border border-emerald-500/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">v1.1.5</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-700/60 font-bold">
                    ACTIVE
                  </span>
                </div>
                <div className="text-[11px] text-emerald-300 font-bold">Role & Active Ecosystem</div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  2-Column Urgent Action Homepage, Profile Hub Customizer, Hybrid Shelving, & App Permissions.
                </p>
                <div className="text-[9px] text-neutral-500 pt-1 border-t border-neutral-800">
                  Author: <strong className="text-neutral-300">Dev Gultiano</strong>
                </div>
              </div>

              {/* v1.1.6 */}
              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">v1.1.6</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    NEXT
                  </span>
                </div>
                <div className="text-[11px] text-white font-bold">Student Role Update</div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Course syllabus trackers, exam sprint timers, spaced repetition queues, & cohort study sync.
                </p>
                <div className="text-[9px] text-neutral-500 pt-1 border-t border-neutral-850">
                  Author: <strong className="text-neutral-300">Dev Gultiano</strong>
                </div>
              </div>

              {/* v1.1.7 */}
              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">v1.1.7</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    PLANNED
                  </span>
                </div>
                <div className="text-[11px] text-white font-bold">Researcher Role Update</div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Citation matrices, PDF margin annotations, preprint distillation, & empirical graph synthesis.
                </p>
                <div className="text-[9px] text-neutral-500 pt-1 border-t border-neutral-850">
                  Author: <strong className="text-neutral-300">Dev Gultiano</strong>
                </div>
              </div>

              {/* v1.1.8 */}
              <div className="p-3 rounded-xl bg-black border border-neutral-800 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">v1.1.8</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800">
                    PLANNED
                  </span>
                </div>
                <div className="text-[11px] text-white font-bold">Educator Role Update</div>
                <p className="text-[10px] text-neutral-400 font-sans">
                  Curriculum builders, keynote deck builders, cohort grading rubrics, & student competency diagnostics.
                </p>
                <div className="text-[9px] text-neutral-500 pt-1 border-t border-neutral-850">
                  Author: <strong className="text-neutral-300">Dev Gultiano</strong>
                </div>
              </div>
            </div>
          </div>

          {PATCH_HISTORY.map(patch => {
            const isExpanded = expandedVersions[patch.version] ?? false;

            return (
              <div
                key={patch.version}
                className={`rounded-xl border transition-all overflow-hidden ${
                  patch.isCurrent
                    ? 'bg-[#111111] border-neutral-600 ring-1 ring-neutral-700/50'
                    : 'bg-[#0c0c0c] border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header Row: Only version name, Atlauz.co badge, developer name, date, and Click More button */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono">
                  <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
                    <span className="font-bold text-base text-white tracking-wide">
                      {patch.version}
                    </span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-neutral-300">
                        Atlauz.co
                      </span>
                      <span className="text-neutral-300 text-xs sm:text-sm font-semibold">
                        {patch.author}
                      </span>
                    </div>
                    <span className="text-neutral-400 text-xs">
                      {patch.date}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleVersionExpand(patch.version)}
                    className="min-h-[36px] px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 hover:text-white border border-neutral-700 font-mono text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 shrink-0"
                    aria-expanded={isExpanded}
                    title={isExpanded ? 'Click to collapse content' : 'Click more to reveal changelog content'}
                  >
                    <span>{isExpanded ? 'Click Less' : 'Click More'}</span>
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                {/* Expanded Detailed Changelog Content */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-neutral-800/80 p-4 sm:p-6 bg-black/60 space-y-5"
                    >
                      {/* Release Metadata Banner */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-lg bg-neutral-900/80 border border-neutral-800 font-mono text-xs">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-200 font-bold text-[11px] border border-neutral-700">
                            {patch.codename}
                          </span>
                          <span className="text-neutral-400 text-[11px]">
                            {patch.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>Release Lead: <strong className="text-white">{patch.author}</strong></span>
                        </div>
                      </div>

                      {/* Architecture & Engineering Highlight Narrative */}
                      {patch.highlight && (
                        <div className="p-4 rounded-xl bg-[#0e0e0e] border border-neutral-800/90 space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400">
                            <Sparkles className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Executive Engineering Summary</span>
                          </div>
                          <p className="text-xs sm:text-[13px] text-neutral-200 font-sans leading-relaxed">
                            {patch.highlight}
                          </p>
                        </div>
                      )}

                      {/* Technical Architecture & Audit Matrix */}
                      {patch.specs && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 px-1">
                            <Cpu className="w-3.5 h-3.5 text-neutral-300" />
                            <span>Technical Specifications & Verification Matrix</span>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 font-mono text-xs">
                            <div className="p-3 rounded-lg bg-black/70 border border-neutral-850 space-y-1">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Core Engine
                              </span>
                              <span className="text-white font-semibold text-[11px] block">
                                {patch.specs.engine}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/70 border border-neutral-850 space-y-1">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Persistence & Storage
                              </span>
                              <span className="text-white font-semibold text-[11px] block">
                                {patch.specs.storage}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/70 border border-neutral-850 space-y-1">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Privacy & Telemetry
                              </span>
                              <span className="text-white font-semibold text-[11px] block">
                                {patch.specs.privacy}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/70 border border-neutral-850 space-y-1">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Viewport Architecture
                              </span>
                              <span className="text-white font-semibold text-[11px] block">
                                {patch.specs.layout}
                              </span>
                            </div>
                            <div className="p-3 rounded-lg bg-black/70 border border-neutral-850 space-y-1 sm:col-span-2 lg:col-span-2">
                              <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
                                Graphics & Refresh Pipeline
                              </span>
                              <span className="text-white font-semibold text-[11px] block">
                                {patch.specs.framerate}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Exhaustive Module Categories Breakdown */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-400 px-1">
                          <span className="flex items-center gap-2">
                            <Layers className="w-3.5 h-3.5 text-neutral-300" />
                            <span>System Modules & Detailed Changelog Items</span>
                          </span>
                          <span className="text-neutral-400 font-normal">
                            {patch.changes.reduce((acc, c) => acc + c.items.length, 0)} Detailed Verified Enhancements
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {patch.changes.map((cat, idx) => (
                            <div
                              key={idx}
                              className="p-4 rounded-xl bg-black/90 border border-neutral-800/90 space-y-3 shadow-md flex flex-col justify-between"
                            >
                              <div className="space-y-2.5">
                                <div className="flex items-center justify-between gap-2 border-b border-neutral-850 pb-2">
                                  <span className="text-[12px] font-mono font-bold uppercase text-neutral-200 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                                    <span>{cat.category}</span>
                                  </span>
                                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-neutral-900 text-neutral-400 border border-neutral-800 shrink-0">
                                    {cat.items.length} items
                                  </span>
                                </div>
                                <ul className="space-y-2 text-xs text-neutral-300 font-sans leading-relaxed">
                                  {cat.items.map((item, itemIdx) => (
                                    <li key={itemIdx} className="flex items-start gap-2.5">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                                      <span className="text-neutral-300">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Bottom Status Bar */}
        <div className="h-12 px-6 bg-[#0a0a0a] border-t border-neutral-800 flex items-center justify-between text-xs font-mono text-neutral-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-neutral-300" />
            <span>Deterministic Non-AI Higher Education Workstation</span>
          </div>
          <span className="text-neutral-500">
            Developer Gultiano and Developer Belo • Verified Clean Release
          </span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
