import React from 'react';
import { LayoutDashboard, BookOpen, Layers, User } from 'lucide-react';
import { AtlauzLogo } from './AtlauzLogo';

interface BottomNavProps {
  activeTab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile';
  onChangeTab: (tab: 'hub' | 'library' | 'workspace' | 'companion' | 'profile') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-50 pb-safe bg-[#0d0d0d] border-t border-neutral-800">
      <div className="flex justify-around items-center h-14 max-w-lg mx-auto px-2">
        {/* Hub Tab */}
        <button
          onClick={() => onChangeTab('hub')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-2.5 rounded-md transition-all active:scale-95 ${
            activeTab === 'hub'
              ? 'text-white bg-neutral-800 border border-neutral-600'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-wide">Hub</span>
        </button>

        {/* Library Tab (Bookshelf) */}
        <button
          onClick={() => onChangeTab('library')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-2.5 rounded-md transition-all active:scale-95 ${
            activeTab === 'library'
              ? 'text-white bg-neutral-800 border border-neutral-600'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-wide">Library</span>
        </button>

        {/* Workspace Tab */}
        <button
          onClick={() => onChangeTab('workspace')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-2.5 rounded-md transition-all active:scale-95 ${
            activeTab === 'workspace'
              ? 'text-white bg-neutral-800 border border-neutral-600'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-wide">Workspace</span>
        </button>

        {/* Companion Tab */}
        <button
          onClick={() => onChangeTab('companion')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-2.5 rounded-md transition-all active:scale-95 ${
            activeTab === 'companion'
              ? 'text-white bg-neutral-800 border border-neutral-600'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <AtlauzLogo
            variant="icon"
            size={18}
            animated={activeTab === 'companion'}
            className={activeTab === 'companion' ? 'opacity-100' : 'opacity-60'}
          />
          <span className="text-[10px] font-bold tracking-wide">Companion</span>
        </button>

        {/* Profile Tab */}
        <button
          onClick={() => onChangeTab('profile')}
          className={`flex flex-col items-center justify-center gap-1 min-w-[56px] py-1 px-2.5 rounded-md transition-all active:scale-95 ${
            activeTab === 'profile'
              ? 'text-white bg-neutral-800 border border-neutral-600'
              : 'text-neutral-400 hover:text-white'
          }`}
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>
      </div>
    </nav>
  );
};

