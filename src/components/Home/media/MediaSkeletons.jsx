import { memo } from 'react';

const shell = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
};

const Shimmer = memo(({ className = '', style }) => (
  <div
    className={`animate-mh-shimmer rounded-lg ${className}`}
    style={{
      background:
        'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
      backgroundSize: '200% 100%',
      ...style,
    }}
  />
));
Shimmer.displayName = 'MediaHub.Shimmer';

/** Matches the real card geometry so the swap to loaded content does not jump. */
const VideoCardSkeleton = memo(() => (
  <div data-testid="video-skeleton" className="overflow-hidden rounded-2xl" style={shell}>
    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
      <Shimmer className="absolute inset-0 h-full w-full rounded-none" />
    </div>
    <div className="space-y-2.5 p-4">
      <Shimmer className="h-[14px] w-full" />
      <Shimmer className="h-[14px] w-4/5" />
      <div className="flex items-center justify-between pt-1">
        <Shimmer className="h-[11px] w-20" />
        <Shimmer className="h-[11px] w-14" />
      </div>
    </div>
  </div>
));
VideoCardSkeleton.displayName = 'MediaHub.VideoCardSkeleton';

export const VideoGridSkeleton = memo(({ count = 4 }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <VideoCardSkeleton key={i} />
    ))}
  </div>
));
VideoGridSkeleton.displayName = 'MediaHub.VideoGridSkeleton';
