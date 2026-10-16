import { Flashcard, StudyRoom, PracticeExam, CompetencyVector, DailyReflectionLog } from '../types/study';

export const INITIAL_FLASHCARDS: Flashcard[] = [
  {
    id: 'fc-1',
    deckId: 'deck-cs',
    deckTitle: 'Algorithms & Data Structures',
    frontPrompt: 'What defines the time complexity of lookup in a balanced Red-Black Tree?',
    backAnswer: 'O(log n). The tree maintains color balance invariants ensuring max height never exceeds 2 * log2(n + 1).',
    boxLevel: 2,
    intervalDays: 3
  },
  {
    id: 'fc-2',
    deckId: 'deck-cs',
    deckTitle: 'Algorithms & Data Structures',
    frontPrompt: 'What is the space complexity difference between DFS and BFS on a balanced binary tree?',
    backAnswer: 'DFS requires O(h) = O(log n) call stack space, whereas BFS requires O(w) = O(n/2) = O(n) queue space for the widest layer.',
    boxLevel: 1,
    intervalDays: 1
  },
  {
    id: 'fc-3',
    deckId: 'deck-cs',
    deckTitle: 'Algorithms & Data Structures',
    frontPrompt: 'Explain how Open Addressing resolves collisions in hash tables.',
    backAnswer: 'All elements reside within the array itself. When a collision occurs, it probes alternative slots systematically (Linear, Quadratic, or Double Hashing).',
    boxLevel: 3,
    intervalDays: 7
  },
  {
    id: 'fc-4',
    deckId: 'deck-cog',
    deckTitle: 'Cognitive Ergonomics',
    frontPrompt: 'What is Attention Residue, and how does it degrade focus?',
    backAnswer: 'When switching between tasks, working memory fragments remain anchored to the unfinished prior task, diminishing prefrontal executive capacity.',
    boxLevel: 2,
    intervalDays: 3
  },
  {
    id: 'fc-5',
    deckId: 'deck-cog',
    deckTitle: 'Cognitive Ergonomics',
    frontPrompt: 'Describe the duration and phases of the human Ultradian Rhythm.',
    backAnswer: 'Human alertness cycles through approximately 90-120 minutes of heightened cognitive throughput, followed by a 15-20 minute physiological dip.',
    boxLevel: 4,
    intervalDays: 14
  },
  {
    id: 'fc-6',
    deckId: 'deck-bio',
    deckTitle: 'Hadal Oceanography',
    frontPrompt: 'What critical piezolyte protects deep-sea cell proteins from hydrostatic denaturation?',
    backAnswer: 'Trimethylamine N-oxide (TMAO). It counteracts hydrostatic pressure distortion on water molecules, maintaining native protein folding.',
    boxLevel: 1,
    intervalDays: 1
  }
];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [
  {
    id: 'room-1',
    name: 'The Abyssal Reading Room',
    topic: 'Quiet Academic Synthesis & Non-Distracted Reading',
    hostName: 'Dr. Alvarez',
    roomMode: 'Quiet Library',
    sprintMinutesRemaining: 34,
    participants: [
      { id: 'p1', name: 'Elena R.', avatar: 'ER', focusGoal: 'Proofreading Chapter 4 Thesis', status: 'In Deep Flow' },
      { id: 'p2', name: 'Marcus K.', avatar: 'MK', focusGoal: 'Algorithms Problem Set 3', status: 'Reviewing Flashcards' },
      { id: 'p3', name: 'Dr. Alvarez', avatar: 'EA', focusGoal: 'Cognitive Architecture Review', status: 'Synthesizing Notes' }
    ]
  },
  {
    id: 'room-2',
    name: 'Distributed Systems Sprint Lounge',
    topic: 'Leitner Spaced Retrieval & Code Architecture',
    hostName: 'Dev Belo',
    roomMode: 'Leitner Sprints',
    sprintMinutesRemaining: 18,
    participants: [
      { id: 'p4', name: 'Dev Belo', avatar: 'DB', focusGoal: 'Event-Sourcing Benchmarks', status: 'In Deep Flow' },
      { id: 'p5', name: 'Dev Gultiano', avatar: 'DG', focusGoal: 'Cache Re-validation Protocols', status: 'Synthesizing Notes' },
      { id: 'p6', name: 'Aiden T.', avatar: 'AT', focusGoal: 'CAP Theorem Proofs', status: 'Reviewing Flashcards' }
    ]
  },
  {
    id: 'room-3',
    name: 'Hadal Marine Biology Lab',
    topic: 'Benthic Ecology & Hydrothermal Taxonomy',
    hostName: 'Prof. Marina',
    roomMode: 'Deep Focus',
    sprintMinutesRemaining: 45,
    participants: [
      { id: 'p7', name: 'Prof. Marina', avatar: 'PM', focusGoal: 'Piezolyte Cell Membrane Paper', status: 'In Deep Flow' },
      { id: 'p8', name: 'Sora W.', avatar: 'SW', focusGoal: 'Bioluminescent Enzymes Chart', status: 'Synthesizing Notes' }
    ]
  }
];

export const INITIAL_PRACTICE_EXAMS: PracticeExam[] = [
  {
    id: 'exam-cs-capstone',
    pathId: 'path-cs-foundations',
    title: 'CS-101 Capstone Practice Exam',
    domain: 'Computer Science',
    durationMinutes: 20,
    passingScorePercent: 80,
    questions: [
      {
        id: 'ex-q1',
        question: 'Which of the following sorting algorithms is guaranteed to run in O(n log n) time in the worst case with O(1) auxiliary space?',
        options: ['Heapsort', 'Quicksort', 'Merge Sort', 'Insertion Sort'],
        answerIndex: 0,
        explanation: 'Heapsort sorts in-place using the binary heap property, achieving O(n log n) worst-case time with strictly O(1) auxiliary space.'
      },
      {
        id: 'ex-q2',
        question: 'In a hash table with load factor alpha = n/m, what happens to lookup performance as alpha exceeds 1.0 in separate chaining?',
        options: [
          'Average lookup time degrades proportionally to O(1 + alpha)',
          'Immediate memory buffer overflow exception occurs',
          'Complexity becomes exponentially O(2^n)',
          'The table stops hashing and defaults to binary search'
        ],
        answerIndex: 0,
        explanation: 'Under separate chaining, chained bucket length grows with alpha, yielding expected lookup of O(1 + alpha).'
      },
      {
        id: 'ex-q3',
        question: 'What is the topological sort order invariant on a Directed Acyclic Graph (DAG)?',
        options: [
          'For every directed edge (u, v), vertex u appears before vertex v in the ordering',
          'Vertices are arranged strictly by ascending in-degree values',
          'Edges must strictly form an Eulerian cycle',
          'Vertex discovery timestamp equals finish timestamp'
        ],
        answerIndex: 0,
        explanation: 'Topological sort linearizes vertices such that all directed dependencies point forward from left to right.'
      },
      {
        id: 'ex-q4',
        question: 'Why does Dijkstra algorithm fail on graphs containing negative edge weights?',
        options: [
          'It greedily marks vertices finalized, assuming shorter paths cannot subsequently be found via negative edges',
          'It causes a division-by-zero hardware trap',
          'Priority queues cannot compare negative numbers',
          'It converts directed graphs into undirected graphs'
        ],
        answerIndex: 0,
        explanation: 'Dijkstras greedy proof relies on non-negative edge weights; once a node is marked visited, it cannot relax further.'
      },
      {
        id: 'ex-q5',
        question: 'What is the primary trade-off of B-Trees over Binary Search Trees in disk-backed storage engines?',
        options: [
          'High branching factor minimizes disk block reads by matching node size to page blocks',
          'B-Trees eliminate the need for key comparisons',
          'B-Trees require zero memory allocations',
          'BSTs cannot store integer keys'
        ],
        answerIndex: 0,
        explanation: 'B-Trees have wide branching factors (hundreds of keys per node), reducing tree height to 3-4 levels to minimize expensive I/O seeks.'
      }
    ]
  },
  {
    id: 'exam-cog-capstone',
    pathId: 'path-cognitive-ergonomics',
    title: 'COG-204 Capstone Practice Exam',
    domain: 'Cognitive Science',
    durationMinutes: 15,
    passingScorePercent: 80,
    questions: [
      {
        id: 'ex-q6',
        question: 'According to Swellers Cognitive Load Theory, which form of cognitive load should instructional interface design actively minimize?',
        options: ['Extraneous Cognitive Load', 'Germane Cognitive Load', 'Intrinsic Cognitive Load', 'Semantic Load'],
        answerIndex: 0,
        explanation: 'Extraneous load stems from poor interface presentation and distracting layout clutter, stealing working memory from core learning.'
      },
      {
        id: 'ex-q7',
        question: 'What neurobiological mechanism facilitates consolidation during the parasympathetic rest phase of an Ultradian cycle?',
        options: [
          'Hippocampal sharp-wave ripples replay daytime neural patterns to the neocortex',
          'Prefrontal cortex increases cortisol release',
          'Dopamine receptors permanently downregulate',
          'Amygdala overrides sensory gating'
        ],
        answerIndex: 0,
        explanation: 'During quiet wakeful rest, hippocampal sharp-wave ripples replay learned memory representations, solidifying long-term retention.'
      },
      {
        id: 'ex-q8',
        question: 'What is the 20-20-20 ergonomic visual rule designed to alleviate during digital workstation use?',
        options: [
          'Every 20 minutes, look at an object 20 feet away for 20 seconds to relax ciliary muscle spasm',
          'Read 20 pages every 20 hours with 20% brightness',
          'Blink 20 times every 20 seconds for 20 minutes',
          'Sleep 20 hours after 20 focus sessions'
        ],
        answerIndex: 0,
        explanation: 'Looking at distant objects allows the eyes ciliary focusing muscles to fully relax, preventing digital eye strain and asthenopia.'
      }
    ]
  }
];

export const INITIAL_COMPETENCY_VECTOR: CompetencyVector = {
  computerScience: 82,
  cognitiveScience: 74,
  marineEcology: 45,
  systemsArchitecture: 68,
  researchMethodology: 78
};

export const INITIAL_DAILY_REFLECTIONS: DailyReflectionLog[] = [
  {
    date: '2026-10-05',
    morningIntention: 'Complete asymptotic analysis proofs and maintain 90-minute ultradian study rhythm.',
    eveningSummary: 'Mastered Red-Black tree rotation proofs. Took two deliberate eye-strain breaks without context switching.',
    focusHours: 4.5,
    moodScore: 5
  }
];
