import React from 'react';

interface SkeletonLoaderProps {
  type?: 'card' | 'shelf' | 'bento' | 'table' | 'metrics' | 'bento-crdt';
  count?: number;
  className?: string;
  label?: string;
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  type = 'card',
  count = 3,
  className = '',
  label = 'Loading workspace components...'
}) => {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={label}
      aria-busy="true"
      className={`w-full select-none ${className}`}
    >
      <span className="sr-only">{label}</span>

      {/* METRICS SKELETON (Mirrors Hub telemetry status cards) */}
      {type === 'metrics' && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="p-3.5 sm:p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="w-20 h-3 rounded skeleton-shimmer" />
                <div className="w-5 h-5 rounded skeleton-shimmer" />
              </div>
              <div className="w-28 h-6 rounded skeleton-shimmer" />
              <div className="w-full h-1.5 rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      )}

      {/* CARD SKELETON (Mirrors tasks, schedule rows, focus tabs) */}
      {type === 'card' && (
        <div className="space-y-3">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className="w-1/3 h-4 rounded skeleton-shimmer" />
                <div className="w-16 h-3 rounded skeleton-shimmer" />
              </div>
              <div className="w-3/4 h-3 rounded skeleton-shimmer" />
              <div className="w-1/2 h-3 rounded skeleton-shimmer" />
              <div className="pt-2 flex items-center justify-between border-t border-neutral-800/80">
                <div className="w-20 h-2.5 rounded skeleton-shimmer" />
                <div className="w-12 h-2.5 rounded skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SHELF SKELETON (Mirrors customized bookshelf physical volume grid) */}
      {type === 'shelf' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: count || 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[1/1.38] rounded-r-lg rounded-l-sm bg-neutral-900 border border-neutral-800 p-3 sm:p-4 flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="w-16 h-3 rounded skeleton-shimmer" />
                  <div className="w-6 h-6 rounded skeleton-shimmer" />
                </div>
                <div className="w-full h-20 rounded skeleton-shimmer opacity-40" />
                <div className="w-4/5 h-3.5 rounded skeleton-shimmer" />
                <div className="w-1/2 h-2.5 rounded skeleton-shimmer" />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div className="w-12 h-2 rounded skeleton-shimmer" />
                <div className="w-4 h-4 rounded-full skeleton-shimmer" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BENTO SKELETON (Mirrors 12-column bento modular workspace) */}
      {type === 'bento' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4">
          <div className="md:col-span-8 min-h-[260px] rounded-lg bg-neutral-900 border border-neutral-800 p-4 sm:p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-44 h-4 rounded skeleton-shimmer" />
                <div className="w-20 h-4 rounded skeleton-shimmer" />
              </div>
              <div className="w-full h-28 rounded skeleton-shimmer" />
            </div>
            <div className="w-28 h-3 rounded skeleton-shimmer" />
          </div>
          <div className="md:col-span-4 min-h-[260px] rounded-lg bg-neutral-900 border border-neutral-800 p-4 sm:p-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-28 h-4 rounded skeleton-shimmer" />
              <div className="w-24 h-24 rounded-full mx-auto skeleton-shimmer" />
            </div>
            <div className="w-full h-8 rounded skeleton-shimmer" />
          </div>
        </div>
      )}

      {/* BENTO-CRDT SKELETON (Mirrors Shared Bento tiles with co-presence indicators) */}
      {type === 'bento-crdt' && (
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-between">
            <div className="space-y-2">
              <div className="w-48 h-4 rounded skeleton-shimmer" />
              <div className="w-72 h-3 rounded skeleton-shimmer" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded skeleton-shimmer" />
              <div className="w-8 h-8 rounded skeleton-shimmer" />
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-lg bg-neutral-900 border border-neutral-800 p-4 flex flex-col justify-between space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-32 h-4 rounded skeleton-shimmer" />
                  <div className="flex gap-1">
                    <div className="w-6 h-6 rounded skeleton-shimmer" />
                    <div className="w-6 h-6 rounded skeleton-shimmer" />
                  </div>
                </div>
                <div className="space-y-2 flex-1">
                  <div className="w-full h-12 rounded skeleton-shimmer" />
                  <div className="w-full h-12 rounded skeleton-shimmer" />
                  <div className="w-3/4 h-8 rounded skeleton-shimmer" />
                </div>
                <div className="w-full h-9 rounded skeleton-shimmer" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TABLE SKELETON */}
      {type === 'table' && (
        <div className="space-y-2">
          {Array.from({ length: count }).map((_, i) => (
            <div
              key={i}
              className="p-3 rounded bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="w-6 h-6 rounded skeleton-shimmer shrink-0" />
                <div className="space-y-1 flex-1">
                  <div className="w-1/3 h-3 rounded skeleton-shimmer" />
                  <div className="w-1/2 h-2.5 rounded skeleton-shimmer" />
                </div>
              </div>
              <div className="w-16 h-3 rounded skeleton-shimmer shrink-0" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
