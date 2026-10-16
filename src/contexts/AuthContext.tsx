import React, { createContext, useState, useEffect, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { UserRole } from '../types';
import {
  getCurrentUser,
  getUserProfile,
  onAuthStateChange,
} from '../lib/supabase';

export interface UserProfile {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  theme?: string;
  avatar_url?: string;
  bio?: string;
  learning_style?: string;
  personality?: string;
  created_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
          const { profile: userProfile, error: profileError } =
            await getUserProfile(currentUser.id);

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setError('Failed to load user profile');
          } else {
            setProfile(userProfile);
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (authUser, session) => {
      if (authUser && session) {
        setUser(authUser);
        const { profile: userProfile } = await getUserProfile(authUser.id);
        setProfile(userProfile);
        setError(null);
      } else {
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const value: AuthContextType = {
    user,
    profile,
    role: profile?.role || null,
    loading,
    error,
    isAuthenticated: !!user && !!profile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
