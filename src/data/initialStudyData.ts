import { Flashcard, StudyRoom, PracticeExam, CompetencyVector, DailyReflectionLog } from '../types/study';

export const INITIAL_FLASHCARDS: Flashcard[] = [];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [];

export const INITIAL_PRACTICE_EXAMS: PracticeExam[] = [];

export const INITIAL_COMPETENCY_VECTOR: CompetencyVector = {
  computerScience: 0,
  cognitiveScience: 0,
  marineEcology: 0,
  systemsArchitecture: 0,
  researchMethodology: 0
};

export const INITIAL_DAILY_REFLECTIONS: DailyReflectionLog[] = [
  {
    date: new Date().toISOString().slice(0, 10),
    morningIntention: '',
    eveningSummary: '',
    focusHours: 0,
    moodScore: 0
  }
];
