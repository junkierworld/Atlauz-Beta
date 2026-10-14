export interface Flashcard {
  id: string;
  deckId: string;
  deckTitle: string;
  frontPrompt: string;
  backAnswer: string;
  boxLevel: number; // 1 to 5 (Leitner system)
  lastReviewedAt?: string;
  intervalDays: number;
}

export interface StudyRoomParticipant {
  id: string;
  name: string;
  avatar: string;
  focusGoal: string;
  status: 'In Deep Flow' | 'Reviewing Flashcards' | 'Synthesizing Notes' | 'Resting';
}

export interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  hostName: string;
  roomMode: 'Deep Focus' | 'Leitner Sprints' | 'Quiet Library';
  sprintMinutesRemaining: number;
  participants: StudyRoomParticipant[];
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface PracticeExam {
  id: string;
  pathId: string;
  title: string;
  domain: string;
  durationMinutes: number;
  passingScorePercent: number;
  questions: ExamQuestion[];
}

export interface DailyReflectionLog {
  date: string;
  morningIntention: string;
  eveningSummary: string;
  focusHours: number;
  moodScore: number; // 1 to 5
}

export interface CompetencyVector {
  computerScience: number; // 0 - 100
  cognitiveScience: number;
  marineEcology: number;
  systemsArchitecture: number;
  researchMethodology: number;
}
