import React, { useState } from 'react';
import { Fingerprint, Lock, KeyRound, ArrowRight } from 'lucide-react';
import { AtlauzLogo } from './AtlauzLogo';

interface LockScreenProps {
  username: string;
  onUnlock: () => void;
  onShowToast: (msg: string) => void;
}

export const LockScreen: React.FC<LockScreenProps> = ({ username, onUnlock, onShowToast }) => {
  const [pin, setPin] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBiometricAuth = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onUnlock();
      onShowToast('Biometric passkey verified. Welcome back.');
    }, 500);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length >= 4) {
      onUnlock();
      onShowToast('Vault unlocked via passkey.');
    } else {
      onShowToast('Please enter at least 4 digits.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 select-none animate-fade-in font-sans">
      <div className="relative z-10 w-full max-w-sm rounded-xl bg-neutral-900 border border-neutral-700 p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Emblem & Status */}
        <div className="relative mb-3">
          <div className="w-14 h-14 rounded-lg bg-neutral-800 border border-neutral-600 flex items-center justify-center p-2">
            <AtlauzLogo variant="icon" size={32} animated={true} />
          </div>
          <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white ring-2 ring-neutral-900 flex items-center justify-center text-[9px] font-bold text-black font-mono">
            ✓
          </span>
        </div>

        <AtlauzLogo variant="wordmark" size="sm" animated={true} className="mb-2" />
        <h2 className="text-xs font-mono font-bold text-white tracking-widest uppercase">
          [VAULT ENCRYPTION LOCKED]
        </h2>
        <p className="text-xs text-neutral-400 mt-1 max-w-[260px]">
          15-minute background idle guard active. Re-authenticate to resume session.
        </p>

        {/* User Identity Chip */}
        <div className="mt-3 px-3 py-1 rounded bg-neutral-800 border border-neutral-700 text-xs font-mono text-neutral-300">
          @{username}
        </div>

        {/* Biometric Button */}
        <button
          onClick={handleBiometricAuth}
          disabled={isVerifying}
          className="mt-6 w-full py-2.5 px-4 rounded bg-white text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-neutral-200 active:scale-95 transition-all"
        >
          <Fingerprint className="w-5 h-5 text-black" />
          <span>{isVerifying ? 'Verifying Sensor...' : 'Unlock via Biometrics'}</span>
        </button>

        <div className="flex items-center gap-2 my-4 w-full">
          <div className="flex-1 h-px bg-neutral-800" />
          <span className="text-[10px] uppercase font-mono text-neutral-500">or enter PIN</span>
          <div className="flex-1 h-px bg-neutral-800" />
        </div>

        {/* PIN Entry Fallback with Inline Validation */}
        <form onSubmit={handlePinSubmit} className="w-full flex flex-col gap-1.5 text-left">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3.5 pointer-events-none" />
              <input
                id="lock-pin-input"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="4-digit PIN (e.g. 1234)"
                maxLength={6}
                value={pin}
                aria-invalid={pin.length > 0 && pin.length < 4}
                aria-describedby={pin.length > 0 && pin.length < 4 ? 'pin-error-desc' : undefined}
                onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
                className="w-full min-h-[44px] bg-neutral-950 text-white text-xs pl-9 pr-3 py-2.5 rounded border border-neutral-700 focus:outline-none focus:border-white font-mono focus-visible:ring-2 focus-visible:ring-white"
              />
            </div>
            <button
              type="submit"
              disabled={pin.length < 4}
              aria-label="Submit PIN to unlock vault"
              className="min-h-[44px] min-w-[44px] px-3.5 rounded bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs active:scale-95 transition-all border border-neutral-600 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center focus-visible:ring-2 focus-visible:ring-white"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          {pin.length > 0 && pin.length < 4 && (
            <p id="pin-error-desc" className="text-[11px] text-red-400 font-mono mt-0.5">
              PIN must contain at least 4 numeric digits ({pin.length}/4 entered).
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
