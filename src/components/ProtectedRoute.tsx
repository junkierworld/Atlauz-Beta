import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f5f5f5] dark:bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 w-12 h-12 rounded-full border-2 border-gray-300 dark:border-gray-700 border-t-gray-800 dark:border-t-gray-400 animate-spin mx-auto"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
