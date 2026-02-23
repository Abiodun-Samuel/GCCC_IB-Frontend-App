import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import {
    Youtube, Send, Music2, Play, ExternalLink,
    Tv2, BookOpen, Mic2, Star, ChevronRight,
    Headphones, Filter, Radio, ChevronUp,
} from 'lucide-react';

import AnimatedBackground, { BRAND, BRAND_RGB, PAGE_BG } from '@/components/common/AnimatedBackground';
import { SECTION_SPACING } from '@/utils/constant';
import { useVideos } from '@/queries/media.query';

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const cardShell = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.09)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
};

const glassInner = (alpha = 0.07) => ({
    background: `rgba(255,255,255,${alpha})`,
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
});

const INITIAL_COUNT = 4;
const PAGE_SIZE = 4;

/* ─────────────────────────────────────────────
   UTILITIES
───────────────────────────────────────────── */
const getCategory = (title) => {
    const t = title.toUpperCase();
    if (t.includes('SUNDAY SERVICE')) return 'sunday';
    if (t.includes('TUESDAY SERVICE')) return 'tuesday';
    if (t.includes('FRIDAY SERVICE')) return 'friday';
    if (t.includes('DIVINE DEMAND') || t.includes('PRAYER SCHOOL')) return 'teaching';
    if (t.includes('CROSS OVER') || t.includes('UNDIVIDED')) return 'special';
    return 'shorts';
};

const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const CATEGORY_META = {
    all: { label: 'All', Icon: Tv2, color: BRAND, colorRGB: BRAND_RGB },
    sunday: { label: 'Sunday', Icon: Star, color: '#f59e0b', colorRGB: '245,158,11' },
    tuesday: { label: 'Tuesday', Icon: BookOpen, color: '#10b981', colorRGB: '16,185,129' },
    friday: { label: 'Friday', Icon: Mic2, color: '#8b5cf6', colorRGB: '139,92,246' },
    teaching: { label: 'Teaching', Icon: Radio, color: BRAND, colorRGB: BRAND_RGB },
    special: { label: 'Special', Icon: Headphones, color: '#ec4899', colorRGB: '236,72,153' },
    shorts: { label: 'Shorts', Icon: Play, color: '#f43f5e', colorRGB: '244,63,94' },
};

/* ─────────────────────────────────────────────
   SKELETON
   ShimmerBlock now forwards the style prop so
   callers can pass inline overrides (e.g. height).
───────────────────────────────────────────── */
const ShimmerBlock = memo(({ className = '', style }) => (
    <div
        className={`rounded-lg animate-mh-shimmer ${className}`}
        style={{
            background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.09) 50%, rgba(255,255,255,0.04) 75%)',
            backgroundSize: '200% 100%',
            ...style,
        }}
    />
));
ShimmerBlock.displayName = 'MediaHub.ShimmerBlock';

/*
  VideoCardSkeleton mirrors the real VideoCard layout exactly:
  • Thumbnail  → 16:9 aspect ratio wrapper  (paddingBottom 56.25%)
  • Body       → p-4, title (2 lines ~42 px), date row (~20 px)
  Total height matches the rendered card so the grid never jumps.
*/
const VideoCardSkeleton = memo(() => (
    <div className="rounded-2xl overflow-hidden" style={cardShell}>
        {/* 16:9 thumbnail — wrapper holds the ratio, shimmer fills it */}
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <ShimmerBlock
                className="absolute inset-0 w-full h-full rounded-none"
            />
        </div>

        {/* Body — matches VideoCard's p-4 content */}
        <div className="p-4 space-y-2.5">
            {/* Title line 1 */}
            <ShimmerBlock className="h-[14px] w-full" />
            {/* Title line 2 */}
            <ShimmerBlock className="h-[14px] w-4/5" />
            {/* Date / Watch row */}
            <div className="flex items-center justify-between pt-1">
                <ShimmerBlock className="h-[11px] w-20" />
                <ShimmerBlock className="h-[11px] w-14" />
            </div>
        </div>
    </div>
));
VideoCardSkeleton.displayName = 'MediaHub.VideoCardSkeleton';

const VideoGridSkeleton = memo(({ count = 4 }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {Array.from({ length: count }).map((_, i) => <VideoCardSkeleton key={i} />)}
    </div>
));
VideoGridSkeleton.displayName = 'MediaHub.VideoGridSkeleton';

/* ─────────────────────────────────────────────
   SECTION HEADER
───────────────────────────────────────────── */
const SectionHeader = memo(({ eyebrow, titleWhite, titleBlue, subtitle, action, colorRGB = BRAND_RGB }) => (
    <div
        data-aos="fade"
        data-aos-duration="380"
        className="flex flex-col gap-2 mb-8"
    >
        <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2 min-w-0">
                {eyebrow && (
                    <div className="flex items-center gap-2">
                        <div
                            className="w-4 h-0.5 rounded-full shrink-0"
                            style={{ background: `rgba(${colorRGB},1)` }}
                        />
                        <span
                            className="text-[10px] font-black uppercase tracking-[0.24em]"
                            style={{ color: `rgba(${colorRGB},0.65)` }}
                        >
                            {eyebrow}
                        </span>
                    </div>
                )}
                <h2 className="text-2xl md:text-3xl font-black leading-tight tracking-tight">
                    {titleWhite && <span className="text-white">{titleWhite} </span>}
                    {titleBlue && <span style={{ color: `rgba(${colorRGB},1)` }}>{titleBlue}</span>}
                </h2>
                {subtitle && (
                    <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.30)' }}>
                        {subtitle}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0 pt-1">{action}</div>}
        </div>
    </div>
));
SectionHeader.displayName = 'MediaHub.SectionHeader';

/* ─────────────────────────────────────────────
   VIEW ALL LINK
───────────────────────────────────────────── */
const ViewAllLink = memo(({ href, label, colorRGB = BRAND_RGB }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-1.5 text-sm font-bold transition-all duration-200 whitespace-nowrap hover:gap-2.5"
        style={{ color: `rgba(${colorRGB},1)` }}
    >
        {label}
        <ExternalLink size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
));
ViewAllLink.displayName = 'MediaHub.ViewAllLink';

/* ─────────────────────────────────────────────
   SOCIAL CHIP
───────────────────────────────────────────── */
const SocialChip = memo(({ href, icon: Icon, label, colorRGB }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-center gap-2 p-2 rounded-full transition-transform duration-150 hover:scale-105 active:scale-95"
        style={{
            background: `rgba(${colorRGB},0.10)`,
            border: `1px solid rgba(${colorRGB},0.22)`,
            color: `rgba(${colorRGB},1)`,
        }}
        onMouseEnter={e => {
            e.currentTarget.style.background = `rgba(${colorRGB},0.18)`;
            e.currentTarget.style.boxShadow = `0 4px 18px rgba(${colorRGB},0.26)`;
        }}
        onMouseLeave={e => {
            e.currentTarget.style.background = `rgba(${colorRGB},0.10)`;
            e.currentTarget.style.boxShadow = 'none';
        }}
    >
        <Icon size={14} strokeWidth={2} />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">{label}</span>
        <ExternalLink size={11} className="opacity-0 group-hover:opacity-70 transition-opacity duration-200" />
    </a>
));
SocialChip.displayName = 'MediaHub.SocialChip';

/* ─────────────────────────────────────────────
   FILTER PILL
───────────────────────────────────────────── */
const FilterPill = memo(({ catKey, active, onClick, count }) => {
    const { label, Icon, color, colorRGB } = CATEGORY_META[catKey];
    const handleClick = useCallback(() => onClick(catKey), [catKey, onClick]);

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap focus:outline-none transition-all duration-200"
            style={
                active
                    ? { backgroundColor: color, color: '#fff', boxShadow: `0 4px 14px rgba(${colorRGB},0.42)` }
                    : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.10)', color: 'rgba(255,255,255,0.45)' }
            }
        >
            <Icon size={12} />
            {label}
            <span
                className="px-1.5 py-0.5 rounded-full text-xs font-bold leading-none"
                style={
                    active
                        ? { background: 'rgba(255,255,255,0.22)', color: '#fff' }
                        : { background: `rgba(${colorRGB},0.14)`, color }
                }
            >
                {count}
            </span>
        </button>
    );
});
FilterPill.displayName = 'MediaHub.FilterPill';

/* ─────────────────────────────────────────────
   CATEGORY BADGE
───────────────────────────────────────────── */
const CategoryBadge = memo(({ catKey }) => {
    const { label, colorRGB } = CATEGORY_META[catKey];
    return (
        <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest z-10"
            style={{ background: `rgba(${colorRGB},0.68)`, backdropFilter: 'blur(8px)', color: '#fff' }}
        >
            {label}
        </span>
    );
});
CategoryBadge.displayName = 'MediaHub.CategoryBadge';

/* ─────────────────────────────────────────────
   VIDEO CARD
───────────────────────────────────────────── */
const VideoCard = memo(({ video, index }) => {
    const cat = useMemo(() => getCategory(video.title), [video.title]);
    const cleanTitle = useMemo(
        () => video.title.replace(/#\w+/g, '').replace(/\|/g, '·').trim(),
        [video.title]
    );
    const dateStr = useMemo(() => formatDate(video.published_at), [video.published_at]);
    const href = `https://www.youtube.com/watch?v=${video.video_id}`;

    return (
        <div
            className="group rounded-2xl overflow-hidden transition-transform duration-[260ms] ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1"
            data-aos="fade"
            data-aos-duration="380"
            data-aos-delay={Math.min((index % 8) * 45, 280)}
            style={cardShell}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = `rgba(${BRAND_RGB},.32)`;
                e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,.45), 0 0 0 1px rgba(${BRAND_RGB},.14)`;
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <a href={href} target="_blank" rel="noopener noreferrer" className="block">
                <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
                    <img
                        src={video.thumbnail_high}
                        alt={cleanTitle}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top,rgba(0,0,0,0.70) 0%,transparent 55%)' }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div
                            className="flex items-center justify-center w-12 h-12 rounded-full"
                            style={{
                                background: `linear-gradient(135deg,${BRAND},rgba(${BRAND_RGB},0.75))`,
                                boxShadow: `0 0 28px rgba(${BRAND_RGB},0.60)`,
                            }}
                        >
                            <Play size={18} fill="#fff" className="ml-0.5" />
                        </div>
                    </div>
                    <CategoryBadge catKey={cat} />
                </div>
                <div className="p-4">
                    <p className="text-sm font-semibold leading-snug mb-3 line-clamp-2 text-white/85 transition-colors duration-200 group-hover:text-white">
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
            </a>
        </div>
    );
});
VideoCard.displayName = 'MediaHub.VideoCard';

/* ─────────────────────────────────────────────
   PAGE HEADER
───────────────────────────────────────────── */
const PageHeader = memo(() => (
    <div
        data-aos="fade"
        data-aos-duration="440"
        className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col mb-16 sm:mb-24 justify-between gap-3"
    >
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
                <div className="w-5 h-0.5 rounded-full shrink-0" style={{ background: BRAND }} />
                <span
                    className="text-[10px] font-black uppercase tracking-[0.24em]"
                    style={{ color: `rgba(${BRAND_RGB},0.65)` }}
                >
                    Media Resources
                </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight tracking-tight">
                Media &{' '}
                <span style={{ color: BRAND }}>Ministry Hub</span>
            </h1>
            <p className="text-base leading-relaxed max-w-lg" style={{ color: 'rgba(255,255,255,0.38)' }}>
                Watch services, dive into teachings, and listen to our podcast wherever you are.
            </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:pb-1 shrink-0">
            <SocialChip href="https://www.youtube.com/@GcccIbadan" icon={Youtube} label="YouTube" colorRGB="220,38,38" />
            <SocialChip href="https://t.me/Pastoropeyemipeter" icon={Send} label="Telegram" colorRGB="0,136,204" />
            <SocialChip href="https://open.spotify.com/show/5yc39lH1EtNRoUQb1mG7SY" icon={Music2} label="Podcast" colorRGB="29,185,84" />
        </div>
    </div>
));
PageHeader.displayName = 'MediaHub.PageHeader';

/* ─────────────────────────────────────────────
   VIDEO SECTION
───────────────────────────────────────────── */
const VideoSection = memo(() => {
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
        () => activeFilter === 'all'
            ? uniqueVideos
            : uniqueVideos.filter((v) => getCategory(v.title) === activeFilter),
        [uniqueVideos, activeFilter]
    );

    const handleFilter = useCallback((cat) => { setActiveFilter(cat); setVisibleCount(INITIAL_COUNT); }, []);
    const handleLoadMore = useCallback(() => setVisibleCount((c) => c + PAGE_SIZE), []);
    const handleCollapse = useCallback(() => setVisibleCount(INITIAL_COUNT), []);

    const showLoadMore = visibleCount < filtered.length;
    const showCollapse = !isLoading && !isError && visibleCount > INITIAL_COUNT;
    const subtitle = isLoading
        ? 'Loading videos…'
        : `${uniqueVideos.length} video${uniqueVideos.length !== 1 ? 's' : ''} available`;

    return (
        <div>
            <SectionHeader
                eyebrow="Videos"
                titleWhite="Services &"
                titleBlue="Messages"
                subtitle={subtitle}
                action={<ViewAllLink href="https://www.youtube.com/@GcccIbadan" label="View all on YouTube" />}
            />

            {/* Filter bar */}
            {!isLoading && !isError && (
                <div className="relative mb-8">
                    <div className="mh-filter-scroll flex items-center gap-2 pb-1 overflow-x-auto">
                        <Filter size={13} className="shrink-0" style={{ color: 'rgba(255,255,255,0.20)' }} />
                        {Object.keys(CATEGORY_META).map((key) =>
                            categoryCounts[key] ? (
                                <FilterPill
                                    key={key}
                                    catKey={key}
                                    active={activeFilter === key}
                                    onClick={handleFilter}
                                    count={categoryCounts[key]}
                                />
                            ) : null
                        )}
                    </div>
                    <div
                        className="absolute right-0 top-0 bottom-0 w-10 pointer-events-none"
                        style={{ background: `linear-gradient(90deg, transparent, ${PAGE_BG})` }}
                    />
                </div>
            )}

            {isLoading && <VideoGridSkeleton count={4} />}

            {isError && (
                <div
                    className="flex items-center justify-center py-16 rounded-2xl"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)' }}
                >
                    <p className="text-sm font-semibold" style={{ color: '#f87171' }}>
                        Failed to load videos. Please try again later.
                    </p>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.slice(0, visibleCount).map((video, i) => (
                            <VideoCard key={video.video_id} video={video} index={i} />
                        ))}
                    </div>

                    {/* ── Load more / collapse row ── */}
                    {(showLoadMore || showCollapse) && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            {showLoadMore && (
                                <button
                                    onClick={handleLoadMore}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold text-white transition-all duration-200 hover:opacity-85 focus:outline-none active:scale-95"
                                    style={{
                                        background: `rgba(${BRAND_RGB},0.15)`,
                                        border: `1px solid rgba(${BRAND_RGB},0.28)`,
                                        color: BRAND,
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.background = `rgba(${BRAND_RGB},0.22)`;
                                        e.currentTarget.style.borderColor = `rgba(${BRAND_RGB},0.45)`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.background = `rgba(${BRAND_RGB},0.15)`;
                                        e.currentTarget.style.borderColor = `rgba(${BRAND_RGB},0.28)`;
                                    }}
                                >
                                    <Play size={11} fill={BRAND} style={{ color: BRAND }} />
                                    Load more
                                    <span style={{ color: 'rgba(255,255,255,0.35)' }}>
                                        · {filtered.length - visibleCount}
                                    </span>
                                </button>
                            )}
                            {showCollapse && (
                                <button
                                    onClick={handleCollapse}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 hover:opacity-85 focus:outline-none active:scale-95"
                                    style={{
                                        ...glassInner(0.05),
                                        border: '1px solid rgba(255,255,255,0.10)',
                                        color: 'rgba(255,255,255,0.38)',
                                    }}
                                >
                                    <ChevronUp size={12} />
                                    Show less
                                </button>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
});
VideoSection.displayName = 'MediaHub.VideoSection';

/* ─────────────────────────────────────────────
   SPOTIFY SECTION
───────────────────────────────────────────── */
const SpotifySection = memo(() => (
    <div data-aos="fade" data-aos-duration="420">
        <SectionHeader
            eyebrow="Audio"
            titleWhite="Listen on"
            titleBlue="Podcast"
            subtitle="Stream our latest sermon episode"
            colorRGB="29,185,84"
            action={
                <ViewAllLink
                    href="https://open.spotify.com/show/5yc39lH1EtNRoUQb1mG7SY"
                    label="View all episodes"
                    colorRGB="29,185,84"
                />
            }
        />
        <div
            className="rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(29,185,84,0.05)',
                border: '1px solid rgba(29,185,84,0.18)',
                boxShadow: '0 8px 40px rgba(29,185,84,0.07)',
            }}
        >
            <iframe
                title="GCCC Ibadan Podcast"
                style={{ borderRadius: '12px', display: 'block' }}
                src="https://open.spotify.com/embed/show/5yc39lH1EtNRoUQb1mG7SY?utm_source=generator&theme=0"
                width="100%"
                height="352"
                frameBorder="0"
                allowFullScreen
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
            />
        </div>
    </div>
));
SpotifySection.displayName = 'MediaHub.SpotifySection';

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
const MediaHub = () => {
    useEffect(() => {
        document.documentElement.classList.add('aos-running');
        AOS.init({
            once: true,
            duration: 380,
            easing: 'ease-out-cubic',
            offset: 36,
            disableMutationObserver: false,
        });
    }, []);

    return (
        <section
            id='media'
            className={`relative overflow-hidden w-full ${SECTION_SPACING}`}
            style={{ backgroundColor: PAGE_BG }}
        >
            <AnimatedBackground withBaseBg={true} />
            <PageHeader />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col gap-16 sm:gap-20">
                <VideoSection />
                <SpotifySection />
            </div>
        </section>
    );
};

export default memo(MediaHub);