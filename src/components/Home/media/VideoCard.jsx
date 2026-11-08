import { memo, useMemo } from 'react';
import { ChevronRight, Play } from 'lucide-react';

import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';
import { useModal } from '@/hooks/useModal';
import YouTubeModal from './YoutubeModal';
import { CATEGORY_META, formatDate, getCategory } from './mediaCategories';

const CategoryBadge = memo(({ catKey }) => {
  const meta = CATEGORY_META[catKey] ?? CATEGORY_META.shorts;
  const { Icon } = meta;
  return (
    <span
      className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold"
      style={{
        background: `rgba(${meta.colorRGB},0.18)`,
        border: `1px solid rgba(${meta.colorRGB},0.32)`,
        color: meta.color,
        backdropFilter: 'blur(8px)',
      }}
    >
      <Icon size={9} />
      {meta.label}
    </span>
  );
});
CategoryBadge.displayName = 'MediaHub.CategoryBadge';

/**
 * One video.
 *
 * The play affordance reveals on hover AND on focus-within, so a keyboard user
 * gets the same signal a mouse user does. Thumbnails are remote YouTube URLs, so
 * they carry explicit 1280x720 dimensions rather than going through Picture.
 */
const VideoCard = memo(({ video, index, isAuthenticated, user }) => {
  const { isOpen, openModal, closeModal } = useModal(false);

  const cat = useMemo(() => getCategory(video.title), [video.title]);

  const cleanTitle = useMemo(
    () => String(video.title).replace(/#\w+/g, '').replace(/\|/g, '·').trim(),
    [video.title]
  );

  const dateStr = useMemo(() => formatDate(video.published_at), [video.published_at]);

  return (
    <>
      <div
        className="group overflow-hidden rounded-2xl transition-transform duration-[260ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 focus-within:-translate-y-1"
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.09)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          animationDelay: `${Math.min((index % 8) * 45, 280)}ms`,
        }}
      >
        <button
          type="button"
          onClick={openModal}
          className="relative block w-full overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          style={{ paddingBottom: '56.25%' }}
          aria-label={`Watch ${cleanTitle}`}
        >
          <img
            src={video.thumbnail_high}
            alt=""
            aria-hidden="true"
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105 group-focus-within:scale-105"
          />

          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.70) 0%,transparent 55%)' }}
          />

          <span
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <span
              className="flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                background: `linear-gradient(135deg,${BRAND},rgba(${BRAND_RGB},0.75))`,
                boxShadow: `0 0 28px rgba(${BRAND_RGB},0.60)`,
              }}
            >
              <Play size={20} fill="#fff" className="ml-0.5 text-white" />
            </span>
          </span>

          <CategoryBadge catKey={cat} />
        </button>

        <div className="p-4">
          <p className="mb-3 line-clamp-2 text-sm font-semibold leading-snug text-white/85 transition-colors duration-200 group-hover:text-white">
            {cleanTitle}
          </p>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.28)' }}>
              {dateStr}
            </span>
            <span className="flex items-center gap-0.5 text-xs font-bold" style={{ color: BRAND }}>
              Watch <ChevronRight size={11} />
            </span>
          </div>
        </div>
      </div>

      <YouTubeModal
        title={cleanTitle}
        user={user}
        video={video}
        isOpen={isOpen}
        onClose={closeModal}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
});
VideoCard.displayName = 'MediaHub.VideoCard';

export default VideoCard;
