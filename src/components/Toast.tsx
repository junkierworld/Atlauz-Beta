import React from 'react';
import { Check } from 'lucide-react';

interface ToastProps {
  message: string | null;
}

export const Toast: React.FC<ToastProps> = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-20 inset-x-4 z-50 flex justify-center pointer-events-none animate-slide-up">
      <div className="max-w-md px-3.5 py-2 rounded-md bg-neutral-950 border border-neutral-700 shadow-2xl flex items-center gap-2 text-white text-xs font-medium font-sans">
        <div className="w-4 h-4 rounded-full bg-white text-black flex items-center justify-center shrink-0">
          <Check className="w-3 h-3 stroke-[3]" />
        </div>
        <span className="truncate">{message}</span>
      </div>
    </div>
  );
};
