import { LearningPath } from '../types/learningPath';

export const INITIAL_LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-cs-foundations',
    title: 'Computer Science & Algorithmic Complexity',
    codename: 'CS-101-ACADEMY',
    domain: 'Computer Science',
    level: 'Foundational',
    description: 'Master computational thinking, asymptotic runtime analysis, data structures, and deterministic state machines designed for rigorous software engineering.',
    estimatedHours: 14,
    isEnrolled: true,
    enrolledAt: '2026-10-01',
    reward: {
      badgeId: 'badge-algo-master',
      badgeTitle: 'Algorithmic Complexity Master',
      badgeIcon: 'Binary',
      badgeDescription: 'Certified proficiency in computational runtime analysis, graph traversal, and deterministic memory limits.',
      certificateTitle: 'Accreditation in Computer Science & Algorithms',
      honorLevel: 'Summa Cum Laude',
      unlockedFish: {
        id: 'fish-luminescent-angler',
        name: 'Nyx',
        species: 'Luminescent Angler',
        color: '#06b6d4',
        accentColor: '#38bdf8',
        tailType: 'glow',
        personality: 'Curious & Bioluminescent',
        size: 34,
        adoptedAt: 'Graduation Day'
      }
    },
    modules: [
      {
        id: 'cs-mod-1',
        title: 'Asymptotic Analysis & Big-O Bounds',
        summary: 'Deconstruct worst-case, best-case, and amortized complexity bounds. Formal proofs for logarithmic and polynomial algorithms.',
        durationMinutes: 45,
        resourceType: 'lesson',
        concepts: ['Worst-case O(n)', 'Amortized O(1)', 'Space-Time Tradeoffs'],
        isCompleted: true,
        completedAt: '2026-10-02',
        knowledgeCheck: [
          {
            id: 'cs-q1',
            question: 'What is the amortized runtime complexity of inserting an element into a dynamic array (vector)?',
            options: ['O(1) amortized', 'O(n) guaranteed', 'O(log n)', 'O(n^2)'],
            answerIndex: 0,
            explanation: 'While doubling array capacity requires an occasional O(n) reallocation, the amortized cost across n insertions remains constant O(1).'
          },
          {
            id: 'cs-q2',
            question: 'Which growth rate dominates for asymptotically large inputs (n -> infinity)?',
            options: ['O(n log n)', 'O(n^2)', 'O(2^n)', 'O(log n)'],
            answerIndex: 2,
            explanation: 'Exponential growth O(2^n) rapidly outstrips polynomial O(n^2) and linearithmic O(n log n) curves.'
          }
        ]
      },
      {
        id: 'cs-mod-2',
        title: 'Non-Linear Structures: Trees, Graphs & Hash Tables',
        summary: 'Architectural breakdown of self-balancing search trees, collision-resolution hash tables, and depth/breadth first graph traversals.',
        durationMinutes: 60,
        resourceType: 'notebook',
        concepts: ['Red-Black Invariants', 'Open Addressing', 'DFS vs BFS Traversal'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'cs-q3',
            question: 'What is the primary worst-case search complexity of a balanced Red-Black Binary Search Tree?',
            options: ['O(log n)', 'O(n)', 'O(1)', 'O(n log n)'],
            answerIndex: 0,
            explanation: 'Strict color balance rules ensure tree height never exceeds 2 * log2(n + 1), bounding lookup to O(log n).'
          },
          {
            id: 'cs-q4',
            question: 'Which graph traversal strategy guarantees discovering the shortest unweighted path between two nodes?',
            options: ['Breadth-First Search (BFS)', 'Depth-First Search (DFS)', 'Post-Order Traversal', 'Topological Sort'],
            answerIndex: 0,
            explanation: 'BFS explores neighbor layers concentrically, guaranteeing that the first time a target vertex is reached, the path length is minimal.'
          }
        ]
      },
      {
        id: 'cs-mod-3',
        title: 'Dynamic Programming & Memoization Patterns',
        summary: 'Transform exponential recursion into linear or polynomial solutions through optimal substructure identification and table memoization.',
        durationMinutes: 75,
        resourceType: 'document',
        concepts: ['Optimal Substructure', 'Overlapping Subproblems', 'Bottom-Up Tabulation'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'cs-q5',
            question: 'What two properties must a computational problem exhibit for dynamic programming to apply?',
            options: [
              'Optimal substructure and overlapping subproblems',
              'Greedy choice property and sorting stability',
              'Infinite recursion and divide-and-conquer base cases',
              'Hash collision resilience and tree balance'
            ],
            answerIndex: 0,
            explanation: 'DP depends on breaking a problem down into overlapping subproblems whose optimal solutions compose into the global optimum.'
          }
        ]
      }
    ]
  },
  {
    id: 'path-cognitive-ergonomics',
    title: 'Cognitive Ergonomics & High-Endurance Study Architecture',
    codename: 'COG-204-ACADEMY',
    domain: 'Cognitive Science',
    level: 'Intermediate',
    description: 'Practical neuroscience and attention design: minimize extraneous cognitive load, optimize ultradian focus cycles, and sustain academic stamina without burnout.',
    estimatedHours: 9,
    isEnrolled: true,
    enrolledAt: '2026-10-02',
    reward: {
      badgeId: 'badge-cognitive-shield',
      badgeTitle: 'Cognitive Ergonomics Scholar',
      badgeIcon: 'Brain',
      badgeDescription: 'Accredited mastery of attention gating, cognitive load reduction, and neurological rest balance.',
      certificateTitle: 'Accreditation in Cognitive Ergonomics & Focus Systems',
      honorLevel: 'Mastery with Distinction',
      unlockedFish: {
        id: 'fish-ancient-coelacanth',
        name: 'Archeion',
        species: 'Ancient Coelacanth',
        color: '#3b82f6',
        accentColor: '#1d4ed8',
        tailType: 'sword',
        personality: 'Stoic & Deep-Dwelling',
        size: 38,
        adoptedAt: 'Graduation Day'
      }
    },
    modules: [
      {
        id: 'cog-mod-1',
        title: 'Working Memory Limits & Context-Switch Penalties',
        summary: 'Quantify cognitive load theory (Intrinsic, Extraneous, Germane) and the physiological cost of task-switching.',
        durationMinutes: 40,
        resourceType: 'lesson',
        concepts: ["Miller's Law (4-7 chunks)", 'Attention Residue', 'Zero-Context-Switch Workstations'],
        isCompleted: true,
        completedAt: '2026-10-03',
        knowledgeCheck: [
          {
            id: 'cog-q1',
            question: 'What happens to cognitive performance when switching between tasks before completing the first?',
            options: [
              'Attention residue impairs working memory capacity on the secondary task',
              'Brain increases total synaptic throughput instantly',
              'Long-term retention improves due to spacing',
              'Prefrontal cortex experiences zero latency overhead'
            ],
            answerIndex: 0,
            explanation: 'Attention residue describes how cognitive fragments remain fixated on the prior incomplete activity, diminishing executive function.'
          }
        ]
      },
      {
        id: 'cog-mod-2',
        title: 'Ultradian Biological Rhythms & Deliberate Rest Cycles',
        summary: 'Harness the 90-minute human ultradian cycle to coordinate deep work sprints with neurological parasympathetic recovery.',
        durationMinutes: 50,
        resourceType: 'presentation',
        concepts: ['90-Minute Ultradian Rhythm', 'Parasympathetic Reset', 'Streak Iceberg Protection'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'cog-q2',
            question: 'According to human chronobiology, what is the optimal length of an ultradian alertness cycle before rest is needed?',
            options: ['Approximately 90 to 120 minutes', '6 to 8 continuous hours', '15 minutes strictly', '300 minutes without pause'],
            answerIndex: 0,
            explanation: 'Human neurobiology oscillates between high alertness and cognitive fatigue on approximately 90-120 minute ultradian rhythms.'
          }
        ]
      }
    ]
  },
  {
    id: 'path-marine-ecology',
    title: 'Marine Ecology & Hadal Oceanic Stratification',
    codename: 'BIO-305-ACADEMY',
    domain: 'Marine Biology',
    level: 'Advanced',
    description: 'Explore the biological adaptations, thermodynamic pressures, and chemotrophic ecosystems of Earth deep oceanic strata from Epipelagic to the Hadal Trench.',
    estimatedHours: 12,
    isEnrolled: false,
    reward: {
      badgeId: 'badge-hadal-diver',
      badgeTitle: 'Hadal Benthic Naturalist',
      badgeIcon: 'Compass',
      badgeDescription: 'Accredited understanding of oceanographic depth strata, piezolyte pressure adaptation, and benthic marine food webs.',
      certificateTitle: 'Accreditation in Marine Ecology & Hadal Oceanography',
      honorLevel: 'Summa Cum Laude',
      unlockedFish: {
        id: 'fish-golden-nautilus',
        name: 'Aurelius',
        species: 'Golden Nautilus',
        color: '#f59e0b',
        accentColor: '#fbbf24',
        tailType: 'fan',
        personality: 'Majestic Scholar',
        size: 32,
        adoptedAt: 'Graduation Day'
      }
    },
    modules: [
      {
        id: 'bio-mod-1',
        title: 'Oceanic Depth Zones: Sunlight to the Abyss',
        summary: 'Examine light attenuation and pressure gradients through Epipelagic (0-200m), Mesopelagic (200-1000m), Bathypelagic, and Hadal Trenches (>6000m).',
        durationMinutes: 55,
        resourceType: 'ebook',
        concepts: ['Photochemical Attenuation', 'Hydrostatic Pressure (1 atm per 10m)', 'Thermocline Stability'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'bio-q1',
            question: 'At what approximate ocean depth does complete solar darkness (aphotic zone) begin?',
            options: ['Approximately 1,000 meters', '50 meters', '10,000 meters', '200 meters'],
            answerIndex: 0,
            explanation: 'Below 1,000 meters in the bathypelagic zone, sunlight is completely extinguished; all ambient light is generated biologically via bioluminescence.'
          }
        ]
      },
      {
        id: 'bio-mod-2',
        title: 'Biochemical Adaptations to Extreme Hydrostatic Pressure',
        summary: 'Piezolytes, trimethylamine N-oxide (TMAO), and membrane homeoviscous fluidity that allow life to thrive under 1,000 atmospheres.',
        durationMinutes: 65,
        resourceType: 'document',
        concepts: ['TMAO Protein Stabilization', 'Unsaturated Membrane Lipids', 'Hydrothermal Vent Ecology'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'bio-q2',
            question: 'What critical organic osmolyte helps deep-sea organisms stabilize protein folding under immense hydrostatic pressure?',
            options: [
              'Trimethylamine N-oxide (TMAO)',
              'Sodium chloride crystals',
              'Hemoglobin variant C',
              'Pure lactic acid'
            ],
            answerIndex: 0,
            explanation: 'TMAO acts as a chemical chaperone (piezolyte) that counteracts water distortion and stabilizes proteins against pressure denaturation.'
          }
        ]
      }
    ]
  },
  {
    id: 'path-systems-engineering',
    title: 'Distributed Systems & Client-Side Architecture',
    codename: 'SYS-402-ACADEMY',
    domain: 'Systems Architecture',
    level: 'Advanced',
    description: 'Engineering resilient, zero-telemetry client applications: offline state machines, deterministic cache policies, and event-driven data hydration.',
    estimatedHours: 16,
    isEnrolled: false,
    reward: {
      badgeId: 'badge-systems-architect',
      badgeTitle: 'Distributed Systems Architect',
      badgeIcon: 'Cpu',
      badgeDescription: 'Accredited engineering of offline-first web applications, deterministic caching, and fault-tolerant local storage architectures.',
      certificateTitle: 'Accreditation in Modern Web Systems & Distributed State',
      honorLevel: 'Mastery with Distinction',
      unlockedFish: {
        id: 'fish-electric-betta',
        name: 'Zephyr',
        species: 'Chromashift Betta',
        color: '#8b5cf6',
        accentColor: '#ec4899',
        tailType: 'veil',
        personality: 'Energetic & Focused',
        size: 35,
        adoptedAt: 'Graduation Day'
      }
    },
    modules: [
      {
        id: 'sys-mod-1',
        title: 'Offline-First Client Storage & Event Sourcing',
        summary: 'Design zero-dependency client state layers with schema validation, conflict-free local reconciliation, and exportable portable snapshots.',
        durationMinutes: 60,
        resourceType: 'notebook',
        concepts: ['Local Key-Value Stores', 'Schema Serialization', 'Optimistic UI Updates'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'sys-q1',
            question: 'Why is client-side optimistic UI state management preferred in high-responsiveness academic workstations?',
            options: [
              'It updates local state immediately before network resolution, ensuring sub-16ms latency feedback',
              'It eliminates the need for data backups completely',
              'It automatically fixes server-side SQL queries',
              'It bypasses browser memory allocations'
            ],
            answerIndex: 0,
            explanation: 'Optimistic UI transitions reflect user intent instantaneously, masking network overhead and keeping interactions fluid.'
          }
        ]
      },
      {
        id: 'sys-mod-2',
        title: 'Fault-Tolerant Backup Engines & Data Portability',
        summary: 'Building defensible JSON export/import pipelines with checksum verification, atomic rollbacks, and schema evolution.',
        durationMinutes: 70,
        resourceType: 'lesson',
        concepts: ['JSON Schema Validation', 'Zero Vendor Lock-In', 'Atomic LocalStorage Writes'],
        isCompleted: false,
        knowledgeCheck: [
          {
            id: 'sys-q2',
            question: 'What is the most effective safeguard against corrupted student backup files during local storage import?',
            options: [
              'Strict schema validation with pre-flight dry-run verification before overwriting state',
              'Blindly executing JSON.parse without try-catch blocks',
              'Deleting existing storage before opening the file',
              'Ignoring format discrepancies'
            ],
            answerIndex: 0,
            explanation: 'Pre-flight schema validation checks every required field and structure before touching active state, allowing safe rollback if data is malformed.'
          }
        ]
      }
    ]
  }
];
