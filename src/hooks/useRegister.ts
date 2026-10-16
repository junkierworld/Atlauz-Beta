import { useState, useCallback } from 'react';
import { signUp, createUserProfile, updateUserProfile } from '../lib/supabase';
import { UserRole, PersonalityType, UserLearningPreferences } from '../types';

interface ProfileUpdateData {
  bio?: string;
  personality?: PersonalityType;
  institution?: string;
  department?: string;
  learningPreferences?: UserLearningPreferences;
}

interface UseRegisterReturn {
  register: (
    email: string,
    password: string,
    username: string,
    firstName?: string,
    lastName?: string
  ) => Promise<boolean>;
  setRole: (role: UserRole, userId?: string, username?: string, email?: string, firstName?: string, lastName?: string) => Promise<boolean>;
  completeProfile: (userId: string, profileData: ProfileUpdateData) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook to handle user registration
 */
export function useRegister(): UseRegisterReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [lastName, setLastName] = useState<string | null>(null);

  const register = useCallback(
    async (
      email: string,
      password: string,
      username: string,
      firstName?: string,
      lastName?: string
    ): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Validate inputs
        if (!email || !password || !username) {
          throw new Error('Email, password, and username are required');
        }

        if (!email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        if (username.length < 3) {
          throw new Error('Username must be at least 3 characters');
        }

        // Sign up
        const { user, session, error: signUpError } = await signUp(
          email,
          password
        );

        if (signUpError) {
          throw signUpError;
        }

        if (!user) {
          throw new Error('Registration failed - no user created');
        }

        // Store userId, username, email, firstName, and lastName for later role assignment
        setUserId(user.id);
        setUsername(username);
        setEmail(email);
        setFirstName(firstName || '');
        setLastName(lastName || '');
        
        // Also store in sessionStorage so it persists across navigation
        sessionStorage.setItem('pendingRegistrationData', JSON.stringify({
          userId: user.id,
          username: username,
          email: email,
          firstName: firstName || '',
          lastName: lastName || ''
        }));

        return true;
      } catch (err: any) {
        const errorMessage = err?.message || 'Registration failed. Try again.';
        setError(errorMessage);
        console.error('Registration error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const setRole = useCallback(
    async (role: UserRole, passedUserId?: string, passedUsername?: string, passedEmail?: string, passedFirstName?: string, passedLastName?: string): Promise<boolean> => {
      let finalUserId = passedUserId || userId;
      let finalUsername = passedUsername || username;
      let finalEmail = passedEmail || email;
      let finalFirstName = passedFirstName || firstName;
      let finalLastName = passedLastName || lastName;

      // If still not found, try sessionStorage
      if (!finalUserId || !finalUsername) {
        try {
          const stored = sessionStorage.getItem('pendingRegistrationData');
          if (stored) {
            const data = JSON.parse(stored);
            finalUserId = data.userId;
            finalUsername = data.username;
            finalEmail = data.email;
            finalFirstName = data.firstName;
            finalLastName = data.lastName;
          }
        } catch (e) {
          console.error('Failed to read from sessionStorage:', e);
        }
      }

      if (!finalUserId || !finalUsername) {
        setError('User ID or username not found. Please register again.');
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const { profile, error: profileError } = await createUserProfile(
          finalUserId,
          finalUsername,
          role,
          finalEmail || undefined,
          finalFirstName || undefined,
          finalLastName || undefined
        );

        if (profileError) {
          throw profileError;
        }

        if (!profile) {
          throw new Error('Failed to create user profile');
        }

        // Clear sessionStorage after successful profile creation
        sessionStorage.removeItem('pendingRegistrationData');

        return true;
      } catch (err: any) {
        const errorMessage =
          err?.message || 'Failed to set role. Please try again.';
        setError(errorMessage);
        console.error('Set role error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [userId, username, email, firstName, lastName]
  );

  const completeProfile = useCallback(
    async (userId: string, profileData: ProfileUpdateData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        if (!userId) {
          throw new Error('User ID is required');
        }

        // Build update object with snake_case keys for database
        const updateObj: Record<string, any> = {};
        
        if (profileData.bio !== undefined) updateObj.bio = profileData.bio;
        if (profileData.personality !== undefined) updateObj.personality = profileData.personality;
        if (profileData.institution !== undefined) updateObj.institution = profileData.institution;
        if (profileData.department !== undefined) updateObj.department = profileData.department;
        if (profileData.learningPreferences !== undefined) {
          updateObj.learning_preferences = profileData.learningPreferences;
        }

        const { profile, error: updateError } = await updateUserProfile(userId, updateObj);

        if (updateError) {
          throw updateError;
        }

        if (!profile) {
          throw new Error('Failed to update profile');
        }

        return true;
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to complete profile. Please try again.';
        setError(errorMessage);
        console.error('Complete profile error:', err);
        return false;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    register,
    setRole,
    completeProfile,
    loading,
    error,
    clearError,
  };
}

export default useRegister;
