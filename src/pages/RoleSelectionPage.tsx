import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { UserRole } from '../types';
import { BookOpen, Search, Presentation } from 'lucide-react';

interface RoleOption {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const ROLES: RoleOption[] = [
  {
    role: 'Student',
    title: 'Student',
    description:
      'Coursework mastery, lecture review & anti-burnout pacing active.',
    icon: <BookOpen className="w-8 h-8" />,
  },
  {
    role: 'Researcher',
    title: 'Researcher',
    description:
      'Hadal acoustics, citation matrix & deep sources active.',
    icon: <Search className="w-8 h-8" />,
  },
  {
    role: 'Educator',
    title: 'Educator',
    description:
      'Curriculum architecture, 16:9 slides & cohort metrics active.',
    icon: <Presentation className="w-8 h-8" />,
  },
];

export const RoleSelectionPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setRole, loading, error } = useRegister();

  const state = (location.state as any) || {};
  const username = state.username;
  const userId = state.userId;
  const email = state.email;
  const firstName = state.firstName;
  const lastName = state.lastName;

  const handleContinue = async () => {
    if (!selectedRole) return;

    const success = await setRole(selectedRole, userId, username, email, firstName, lastName);

    if (success) {
      // Navigate to profile setup instead of hub
      navigate('/profile-setup', {
        state: {
          userId,
          username,
          email,
          firstName,
          lastName,
          role: selectedRole
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Heading */}
        <h1 className="text-3xl font-mono font-bold text-neutral-100 mb-2">
          Select Your Role
        </h1>
        <p className="text-sm font-mono text-neutral-500 mb-8">
          How you'll use ATLAUZ
        </p>

        {/* Role Cards */}
        <div className="space-y-4 mb-8">
          {ROLES.map((roleOption) => (
            <button
              key={roleOption.role}
              type="button"
              onClick={() => setSelectedRole(roleOption.role)}
              className={`w-full text-left p-6 rounded border cursor-pointer transition-all ${
                selectedRole === roleOption.role
                  ? 'border-neutral-600 bg-neutral-800/50'
                  : 'border-neutral-700 bg-neutral-900/50 hover:border-neutral-600'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="text-neutral-500 mt-1 flex-shrink-0">
                  {roleOption.icon}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg font-mono font-bold text-neutral-100 mb-1">
                    {roleOption.title}
                  </h3>
                  <p className="text-sm font-mono text-neutral-400">
                    {roleOption.description}
                  </p>
                </div>

                {/* Checkbox */}
                <div
                  className={`w-5 h-5 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                    selectedRole === roleOption.role
                      ? 'bg-neutral-600 border-neutral-600'
                      : 'border-neutral-600'
                  }`}
                >
                  {selectedRole === roleOption.role && (
                    <span className="text-neutral-900 font-bold text-sm">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-950/50 border border-red-700/50 rounded mb-6">
            <p className="text-xs font-mono text-red-400">{error}</p>
          </div>
        )}

        {/* Continue Button */}
        <button
          onClick={handleContinue}
          disabled={!selectedRole || loading}
          className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors"
        >
          {loading ? 'SETTING UP...' : 'CONTINUE'}
        </button>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-xs font-mono text-neutral-600 text-center">
            v1.0.0 • Production
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
