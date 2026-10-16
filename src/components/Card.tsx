import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  isDark?: boolean;
  onClick?: () => void;
  [key: string]: any;
}

/**
 * Shared Card wrapper component for consistent styling across ATLAUZ
 * Matches the Welcome card design system:
 * - Dark background (#121212 / bg-neutral-900/40)
 * - Low-contrast border
 * - Rounded corners
 * - Subtle hover effect
 * - Supports both dark and light themes
 * - Can be used as button-like or div
 */
export const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  isDark = true, 
  onClick,
  ...rest 
}) => {
  const Component = onClick ? 'button' : 'div';
  
  return (
    <Component
      onClick={onClick}
      className={`relative overflow-hidden rounded-lg border transition-all duration-300 ${
        isDark
          ? 'bg-neutral-900/40 border-neutral-800/60 hover:border-neutral-700/80'
          : 'bg-neutral-50/40 border-neutral-300/60 hover:border-neutral-400/80'
      } ${onClick ? 'cursor-pointer' : ''} ${className}`}
      {...rest}
    >
      {/* Subtle backdrop pattern - matches Welcome card */}
      <div
        className={`absolute inset-0 opacity-30 pointer-events-none ${
          isDark ? 'bg-neutral-800/5' : 'bg-neutral-900/5'
        }`}
      />

      {/* Content Container */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};

export default Card;
