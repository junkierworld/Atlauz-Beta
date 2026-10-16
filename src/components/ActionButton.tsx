import React from 'react';

interface ActionButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  isDark?: boolean;
  disabled?: boolean;
  title?: string;
  icon?: React.ReactNode;
}

/**
 * Unified action button component for bottom action row
 * Matches the dark theme aesthetic of ACKNOWLEDGED button
 * 
 * Primary variant: Sleek dark button with outline
 * Secondary variant: Subtle dark card style
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  className = '',
  isDark = true,
  disabled = false,
  title,
  icon,
}) => {
  const baseStyles = 'p-3 rounded border font-bold text-xs text-center transition-all font-mono flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles =
    variant === 'primary'
      ? isDark
        ? 'bg-neutral-900 text-white border-neutral-700 hover:bg-neutral-800 hover:border-neutral-600 focus:ring-2 focus:ring-neutral-600'
        : 'bg-neutral-100 text-neutral-900 border-neutral-400 hover:bg-neutral-200 hover:border-neutral-500 focus:ring-2 focus:ring-neutral-300'
      : // Secondary variant
      isDark
      ? 'bg-neutral-900/40 text-neutral-200 border-neutral-800/60 hover:bg-neutral-900/60 hover:border-neutral-700/80'
      : 'bg-neutral-100/40 text-neutral-700 border-neutral-300/60 hover:bg-neutral-100/60 hover:border-neutral-400/80';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
};

export default ActionButton;
