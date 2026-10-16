import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLogin } from '../hooks/useLogin';
import { AtlauzLogo } from '../components/AtlauzLogo';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login, loading, error, clearError } = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const success = await login(email, password);

    if (success) {
      // Redirect to intended page or hub
      const from = (location.state as any)?.from?.pathname || '/hub';
      navigate(from);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-12">
            <AtlauzLogo variant="icon" size={48} animated={true} />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-mono font-bold text-neutral-100 mb-2 text-center">
          ATLAUZ
        </h1>
        <p className="text-sm font-mono text-neutral-500 mb-8 text-center">
          Cognitive learning workspace
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              disabled={loading}
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-950/50 border border-red-700/50 rounded">
              <p className="text-xs font-mono text-red-400">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors"
          >
            {loading ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-700" />
          <span className="text-xs font-mono text-neutral-600">OR</span>
          <div className="flex-1 h-px bg-neutral-700" />
        </div>

        {/* Register Link */}
        <div className="text-center">
          <p className="text-sm font-mono text-neutral-500 mb-3">
            Don't have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="text-neutral-300 hover:text-neutral-100 font-mono font-semibold transition-colors"
          >
            Create one now
          </button>
        </div>

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

export default LoginPage;
