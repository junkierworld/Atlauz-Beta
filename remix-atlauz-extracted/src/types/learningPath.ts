import { ResourceType, FishCompanion } from '../types';

export interface KnowledgeQuestion {
  id: string;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface LearningModule {
  id: string;
  title: string;
  summary: string;
  durationMinutes: number;
  resourceType: ResourceType;
  resourceId?: string;
  concepts: string[];
  knowledgeCheck: KnowledgeQuestion[];
  isCompleted: boolean;
  completedAt?: string;
}

export interface PathCapstoneReward {
  badgeId: string;
  badgeTitle: string;
  badgeIcon: string;
  badgeDescription: string;
  certificateTitle: string;
  honorLevel: 'Summa Cum Laude' | 'Mastery with Distinction' | 'Certified Scholar';
  unlockedFish: FishCompanion;
}

export interface LearningPath {
  id: string;
  title: string;
  codename: string;
  domain: 'Computer Science' | 'Cognitive Science' | 'Marine Biology' | 'Systems Architecture' | 'General';
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  description: string;
  estimatedHours: number;
  modules: LearningModule[];
  reward: PathCapstoneReward;
  isCustom?: boolean;
  isEnrolled: boolean;
  enrolledAt?: string;
  completedAt?: string;
}

export interface EarnedCertificate {
  id: string;
  pathId: string;
  pathTitle: string;
  studentName: string;
  verificationHash: string;
  issuedAt: string;
  badgeTitle: string;
  badgeIcon: string;
  honorLevel: 'Summa Cum Laude' | 'Mastery with Distinction' | 'Certified Scholar';
  instructor: string;
  unlockedFishName: string;
}
