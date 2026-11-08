import { memo } from 'react';

const shell = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.09)',
};

const Block = ({ className = '' }) => (
  <div className={`rounded bg-white/10 ${className}`} />
);

/** Mirrors the featured card geometry so the swap to real content does not jump. */
export const FeaturedSkeleton = memo(() => (
  <div
    data-testid="featured-skeleton"
    className="animate-pulse overflow-hidden rounded-2xl"
    style={shell}
  >
    <div style={{ height: 300, background: 'rgba(255,255,255,0.05)' }} />
    <div className="flex flex-col gap-4 p-5">
      <div className="flex justify-between">
        <Block className="h-6 w-24 rounded-full" />
        <Block className="h-6 w-24 rounded-xl" />
      </div>
      <Block className="h-6 w-3/4" />
      <Block className="h-3.5 w-1/2" />
      <Block className="h-3.5 w-1/3" />
      <Block className="h-3 w-full" />
      <Block className="h-3 w-4/5" />
      <div className="flex items-center justify-between pt-1">
        <Block className="h-6 w-24" />
        <Block className="h-8 w-20 rounded-xl" />
      </div>
    </div>
  </div>
));
FeaturedSkeleton.displayName = 'Events.FeaturedSkeleton';

const GridCardSkeleton = memo(() => (
  <div
    data-testid="event-grid-skeleton"
    className="animate-pulse overflow-hidden rounded-2xl"
    style={shell}
  >
    <div style={{ height: 180, background: 'rgba(255,255,255,0.05)' }} />
    <div className="flex flex-col gap-3 p-5">
      <Block className="h-5 w-20 rounded-full" />
      <Block className="h-5 w-3/4" />
      <Block className="h-3.5 w-1/2" />
      <Block className="h-3.5 w-1/3" />
    </div>
  </div>
));
GridCardSkeleton.displayName = 'Events.GridCardSkeleton';

export const GridSkeleton = memo(({ count = 3 }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <GridCardSkeleton key={i} />
    ))}
  </div>
));
GridSkeleton.displayName = 'Events.GridSkeleton';
