import { useState, useCallback } from 'react';
import { signIn } from '../lib/supabase';

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook to handle user login
 */
export function useLogin(): UseLoginReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        // Validate inputs
        if (!email || !password) {
          throw new Error('Email and password are required');
        }

        if (!email.includes('@')) {
          throw new Error('Please enter a valid email address');
        }

        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const { user, session, error: signInError } = await signIn(
          email,
          password
        );

        if (signInError) {
          throw signInError;
        }

        if (!user || !session) {
          throw new Error('Login failed - no session created');
        }

        return true;
      } catch (err: any) {
        const errorMessage =
          err?.message || 'Login failed. Please check your credentials.';
        setError(errorMessage);
        console.error('Login error:', err);
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
    login,
    loading,
    error,
    clearError,
  };
}

export default useLogin;
