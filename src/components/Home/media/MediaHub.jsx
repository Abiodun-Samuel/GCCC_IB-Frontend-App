import { memo, useCallback, useMemo, useState } from 'react';
import { ChevronUp, ExternalLink, Play, Send, Youtube } from 'lucide-react';

import AnimatedBackground, {
  BRAND,
  BRAND_RGB,
  PAGE_BG,
} from '@/components/common/AnimatedBackground';
import { SECTION_SPACING } from '@/utils/constant';
import { useVideos } from '@/queries/media.query';
import SectionHeader from '@/components/Home/shared/SectionHeader';
import Reveal from '@/components/Home/shared/Reveal';

import VideoCard from './VideoCard';
import FilterRow from './FilterRow';
import { VideoGridSkeleton } from './MediaSkeletons';
import { getCategory } from './mediaCategories';

const INITIAL_COUNT = 8;
const PAGE_SIZE = 8;

const FacebookIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 16 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const TikTokIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
  </svg>
);

const SOCIALS = [
  { href: 'https://www.youtube.com/@GcccIbadan', Icon: Youtube, title: 'YouTube' },
  { href: 'https://www.facebook.com/share/1K8ura74Dc/', Icon: FacebookIcon, title: 'Facebook' },
  { href: 'https://www.instagram.com/gcccibadan', Icon: InstagramIcon, title: 'Instagram' },
  { href: 'https://www.tiktok.com/@gcccibadan', Icon: TikTokIcon, title: 'TikTok' },
  { href: 'https://t.me/gcccibadan', Icon: Send, title: 'Telegram' },
];

const SocialChip = memo(({ href, icon: Icon, title }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    title={title}
    aria-label={title}
    className="flex h-10 w-10 items-center justify-center rounded-full text-white/55 transition-all duration-200 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }}
  >
    <Icon size={16} />
  </a>
));
SocialChip.displayName = 'MediaHub.SocialChip';

const PillButton = ({ onClick, children, subtle = false }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200 hover:opacity-85 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
    style={
      subtle
        ? {
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.38)',
          }
        : {
            background: `rgba(${BRAND_RGB},0.15)`,
            border: `1px solid rgba(${BRAND_RGB},0.28)`,
            color: BRAND,
          }
    }
  >
    {children}
  </button>
);

/**
 * MediaHub.
 *
 * A deliberate light touch: the data flow, category filters, pagination and the
 * YouTube modal are all unchanged. What changed is presentation — bigger 16:9
 * thumbnails, a play affordance that also appears on keyboard focus, a tighter
 * filter row and the shared section header.
 */
const MediaHub = ({ isAuthenticated = false, user }) => {
  const { data, isLoading, isError } = useVideos();

  const [activeFilter, setActiveFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);

  const uniqueVideos = useMemo(() => {
    if (!data?.data) return [];
    const seen = new Set();
    return data.data.filter((v) => {
      if (seen.has(v.video_id)) return false;
      seen.add(v.video_id);
      return true;
    });
  }, [data]);

  const categoryCounts = useMemo(() => {
    const counts = { all: uniqueVideos.length };
    uniqueVideos.forEach((v) => {
      const c = getCategory(v.title);
      counts[c] = (counts[c] || 0) + 1;
    });
    return counts;
  }, [uniqueVideos]);

  const filtered = useMemo(
    () =>
      activeFilter === 'all'
        ? uniqueVideos
        : uniqueVideos.filter((v) => getCategory(v.title) === activeFilter),
    [uniqueVideos, activeFilter]
  );

  const handleFilter = useCallback((cat) => {
    setActiveFilter(cat);
    setVisibleCount(INITIAL_COUNT);
  }, []);

  const handleLoadMore = useCallback(() => setVisibleCount((c) => c + PAGE_SIZE), []);
  const handleCollapse = useCallback(() => setVisibleCount(INITIAL_COUNT), []);

  const showLoadMore = visibleCount < filtered.length;
  const showCollapse = !isLoading && !isError && visibleCount > INITIAL_COUNT;

  const subtitle = isLoading
    ? 'Loading videos…'
    : `${uniqueVideos.length} video${uniqueVideos.length !== 1 ? 's' : ''} available`;

  return (
    <section
      id="media"
      className={`relative w-full overflow-hidden ${SECTION_SPACING}`}
      style={{ backgroundColor: PAGE_BG }}
    >
      <AnimatedBackground withBaseBg />

      <div className="container relative z-10 mx-auto px-2">
        <SectionHeader
          tone="dark"
          eyebrow="Watch & Listen"
          titleLead="Services &"
          titleAccent="Messages"
          subtitle={subtitle}
          action={
            <a
              href="https://www.youtube.com/@GcccIbadan"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-80"
              style={{ color: BRAND }}
            >
              View all on YouTube
              <ExternalLink size={13} />
            </a>
          }
        />

        <Reveal className="mb-8 flex flex-wrap items-center gap-2">
          {SOCIALS.map((s) => (
            <SocialChip key={s.title} href={s.href} icon={s.Icon} title={s.title} />
          ))}
        </Reveal>

        {!isLoading && !isError && uniqueVideos.length > 0 && (
          <FilterRow counts={categoryCounts} active={activeFilter} onChange={handleFilter} />
        )}

        {isLoading && <VideoGridSkeleton count={4} />}

        {!isLoading && isError && (
          <div
            data-testid="media-error"
            className="rounded-2xl p-10 text-center"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}
          >
            <p className="text-sm font-semibold" style={{ color: '#f87171' }}>
              Failed to load videos. Please try again later.
            </p>
          </div>
        )}

        {!isLoading && !isError && uniqueVideos.length === 0 && (
          <div
            data-testid="media-empty"
            className="rounded-2xl p-12 text-center"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <p className="text-sm font-bold text-white">No videos yet</p>
            <p className="mt-1 text-xs text-white/30">
              New messages are posted here after every service.
            </p>
          </div>
        )}

        {!isLoading && !isError && filtered.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filtered.slice(0, visibleCount).map((video, i) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  index={i}
                  user={user}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>

            {(showLoadMore || showCollapse) && (
              <div className="mt-8 flex items-center justify-center gap-2">
                {showLoadMore && (
                  <PillButton onClick={handleLoadMore}>
                    <Play size={11} fill={BRAND} style={{ color: BRAND }} />
                    Load more
                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                      &middot; {filtered.length - visibleCount}
                    </span>
                  </PillButton>
                )}
                {showCollapse && (
                  <PillButton onClick={handleCollapse} subtle>
                    <ChevronUp size={12} />
                    Show less
                  </PillButton>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default memo(MediaHub);
