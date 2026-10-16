import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { PersonalityType, LearningStyle, UserRole } from '../types';
import { ArrowRight } from 'lucide-react';

const PERSONALITY_OPTIONS: PersonalityType[] = [
  'Analytical & Methodical',
  'Inquisitive & Exploratory',
  'Creative & Synthesizing',
  'Autonomous & Deep-Focus',
  'Collaborative & Mentoring',
];

const LEARNING_STYLES: LearningStyle[] = [
  'Visual & Spatial',
  'Auditory & Acoustic',
  'Reading & Synthesis',
  'Kinesthetic & Interactive',
];

export const ProfileSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { completeProfile, loading, error } = useRegister();

  // Get state from role selection
  const state = (location.state as any) || {};
  const username = state.username;
  const userId = state.userId;
  const email = state.email;
  const firstName = state.firstName;
  const lastName = state.lastName;
  const role = state.role as UserRole;

  // Form state
  const [bio, setBio] = useState<string>('');
  const [personality, setPersonality] = useState<PersonalityType | null>(null);
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(null);
  const [institution, setInstitution] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'bio' | 'personality' | 'learning' | 'institution'>('bio');

  const canContinue = () => {
    switch (currentStep) {
      case 'bio':
        return bio.trim().length > 0;
      case 'personality':
        return personality !== null;
      case 'learning':
        return learningStyle !== null;
      case 'institution':
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'bio') {
      setCurrentStep('personality');
    } else if (currentStep === 'personality') {
      setCurrentStep('learning');
    } else if (currentStep === 'learning') {
      setCurrentStep('institution');
    }
  };

  const handleBack = () => {
    if (currentStep === 'personality') {
      setCurrentStep('bio');
    } else if (currentStep === 'learning') {
      setCurrentStep('personality');
    } else if (currentStep === 'institution') {
      setCurrentStep('learning');
    }
  };

  const handleComplete = async () => {
    if (!personality || !learningStyle) {
      // Should not happen with current UI but validate
      return;
    }

    const success = await completeProfile(
      userId,
      {
        bio,
        personality,
        institution: institution || undefined,
        department: department || undefined,
        learningPreferences: {
          primaryStyle: learningStyle,
          secondaryStyle: 'Auditory & Acoustic', // Default for now
          tactileFeedback: false,
          audioPacingMultiplier: 1.0,
          autoSummaryOnCompletion: false,
          bentoDefaultMode: false,
          highContrastAdaptiveFont: false,
          notificationDigest: 'instant',
          breakIntervalMinutes: 25,
          soundEffects: true,
        },
      }
    );

    if (success) {
      navigate('/hub');
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-mono font-bold text-neutral-100 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-sm font-mono text-neutral-500">
            {currentStep === 'bio' && 'Tell us about yourself'}
            {currentStep === 'personality' && 'What\'s your learning personality?'}
            {currentStep === 'learning' && 'How do you learn best?'}
            {currentStep === 'institution' && 'Where are you studying or working?'}
          </p>
          {/* Progress bar */}
          <div className="mt-4 flex gap-1">
            {['bio', 'personality', 'learning', 'institution'].map((step) => (
              <div
                key={step}
                className={`h-1 flex-1 rounded transition-colors ${
                  ['bio', 'personality', 'learning', 'institution'].indexOf(step) < ['bio', 'personality', 'learning', 'institution'].indexOf(currentStep)
                    ? 'bg-neutral-500'
                    : ['bio', 'personality', 'learning', 'institution'].indexOf(step) === ['bio', 'personality', 'learning', 'institution'].indexOf(currentStep)
                    ? 'bg-neutral-300'
                    : 'bg-neutral-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step: Bio */}
        {currentStep === 'bio' && (
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-300 mb-2">
                YOUR BIO
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a brief introduction about yourself, your interests, or learning goals..."
                className="w-full p-3 rounded border border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-600 font-mono text-sm focus:outline-none focus:border-neutral-600 resize-none"
                rows={6}
              />
              <div className="text-xs font-mono text-neutral-500 mt-2">
                {bio.length}/500 characters
              </div>
            </div>
          </div>
        )}

        {/* Step: Personality */}
        {currentStep === 'personality' && (
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              {PERSONALITY_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setPersonality(option)}
                  className={`w-full text-left p-4 rounded border transition-all ${
                    personality === option
                      ? 'border-neutral-600 bg-neutral-800/50'
                      : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        personality === option
                          ? 'bg-neutral-600 border-neutral-600'
                          : 'border-neutral-600'
                      }`}
                    >
                      {personality === option && (
                        <span className="text-neutral-900 font-bold text-sm">✓</span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-neutral-100">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Learning Style */}
        {currentStep === 'learning' && (
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
              {LEARNING_STYLES.map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setLearningStyle(style)}
                  className={`w-full text-left p-4 rounded border transition-all ${
                    learningStyle === style
                      ? 'border-neutral-600 bg-neutral-800/50'
                      : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                        learningStyle === style
                          ? 'bg-neutral-600 border-neutral-600'
                          : 'border-neutral-600'
                      }`}
                    >
                      {learningStyle === style && (
                        <span className="text-neutral-900 font-bold text-sm">✓</span>
                      )}
                    </div>
                    <span className="font-mono font-semibold text-neutral-100">{style}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Institution */}
        {currentStep === 'institution' && (
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-300 mb-2">
                INSTITUTION (OPTIONAL)
              </label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="University, School, Company, etc."
                className="w-full p-3 rounded border border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-600 font-mono text-sm focus:outline-none focus:border-neutral-600"
              />
            </div>
            <div>
              <label className="block text-xs font-mono font-bold text-neutral-300 mb-2">
                DEPARTMENT (OPTIONAL)
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g., Computer Science, Biology, Management"
                className="w-full p-3 rounded border border-neutral-700 bg-neutral-800/50 text-neutral-100 placeholder:text-neutral-600 font-mono text-sm focus:outline-none focus:border-neutral-600"
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-700/50 rounded mb-6">
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3">
          {currentStep !== 'bio' && (
            <button
              onClick={handleBack}
              className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors"
            >
              BACK
            </button>
          )}

          {currentStep !== 'institution' && (
            <button
              onClick={handleNext}
              disabled={!canContinue() || loading}
              className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors flex items-center justify-center gap-2"
            >
              NEXT <ArrowRight className="w-4 h-4" />
            </button>
          )}

          {currentStep === 'institution' && (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 px-4 py-3 bg-neutral-700 hover:bg-neutral-600 disabled:bg-neutral-800 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors"
            >
              {loading ? 'COMPLETING...' : 'COMPLETE'}
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-xs font-mono text-neutral-600 text-center">
            {`${firstName} ${lastName}`} • {role} • v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
