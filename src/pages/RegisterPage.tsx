import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRegister } from '../hooks/useRegister';
import { AtlauzLogo } from '../components/AtlauzLogo';

export const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [validationError, setValidationError] = useState('');

  const navigate = useNavigate();
  const { register, loading, error, clearError } = useRegister();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setValidationError('');

    // Validation
    if (!email || !password || !firstName || !lastName || !username) {
      setValidationError('All fields are required');
      return;
    }

    if (!email.includes('@')) {
      setValidationError('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setValidationError('Passwords do not match');
      return;
    }

    if (firstName.length < 2) {
      setValidationError('First name must be at least 2 characters');
      return;
    }

    if (lastName.length < 2) {
      setValidationError('Last name must be at least 2 characters');
      return;
    }

    if (username.length < 3) {
      setValidationError('Username must be at least 3 characters');
      return;
    }

    // Register
    const success = await register(email, password, username, firstName, lastName);

    if (success) {
      // Redirect to role selection
      navigate('/select-role', { state: { email, username, firstName, lastName } });
    }
  };

  const displayError = validationError || error;

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
          Create your account
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

          {/* First Name & Last Name (Side by side) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                First Name
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-neutral-400 mb-2">
                Last Name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
                disabled={loading}
              />
            </div>
          </div>

          {/* Username Input */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
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

          {/* Confirm Password Input */}
          <div>
            <label className="block text-xs font-mono text-neutral-400 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-neutral-800 border border-neutral-700 rounded font-mono text-neutral-100 placeholder-neutral-600 focus:outline-none focus:border-neutral-600 transition-colors"
              disabled={loading}
            />
          </div>

          {/* Error Message */}
          {displayError && (
            <div className="p-3 bg-red-950/50 border border-red-700/50 rounded">
              <p className="text-xs font-mono text-red-400">{displayError}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-neutral-800 hover:bg-neutral-700 disabled:bg-neutral-900 border border-neutral-700 rounded font-mono font-bold text-neutral-100 transition-colors"
          >
            {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-neutral-700" />
          <span className="text-xs font-mono text-neutral-600">OR</span>
          <div className="flex-1 h-px bg-neutral-700" />
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm font-mono text-neutral-500 mb-3">
            Already have an account?
          </p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="text-neutral-300 hover:text-neutral-100 font-mono font-semibold transition-colors"
          >
            Sign in here
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

export default RegisterPage;
