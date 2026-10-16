import { Flashcard, StudyRoom, PracticeExam, CompetencyVector, DailyReflectionLog } from '../types/study';

export const INITIAL_FLASHCARDS: Flashcard[] = [];

export const INITIAL_STUDY_ROOMS: StudyRoom[] = [];

export const INITIAL_PRACTICE_EXAMS: PracticeExam[] = [];

export const INITIAL_COMPETENCY_VECTOR: CompetencyVector = {
  domainScores: {},
  dominantLearningStyle: 'Reading & Synthesis',
  coreStrengths: [],
  developmentAreas: []
};

export const INITIAL_DAILY_REFLECTIONS: DailyReflectionLog[] = [
  {
    id: 'reflection-' + new Date().toISOString().slice(0, 10),
    date: new Date().toISOString().slice(0, 10),
    moodScore: 0,
    energyLevel: 0,
    focusQuality: 0,
    learningNote: '',
    gratitudeEntry: '',
    tomorrowGoal: '',
    wellnessRating: 0
  }
];
