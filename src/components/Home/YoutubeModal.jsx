import { useRef, memo, useCallback, useState, useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { X, Play, CheckCircle2, Youtube, Calendar, Sparkles } from 'lucide-react';
import { useYouTubeCompletion } from '@/hooks/useYouTubeCompletion';
import { useAwardPoints } from '@/queries/user.query';
import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const formatDate = (iso) =>
    iso
        ? new Date(iso).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        })
        : null;

/* ─────────────────────────────────────────────
   SKELETON
   ─ Rendered with z-10 ON TOP of the player.
     Removed once player fires onReady.
     This is the correct layering pattern — we
     must NOT apply opacity to the YT target div
     because YT.Player() replaces that element
     entirely (detaching it from the DOM), making
     any subsequent React style updates no-ops on
     the stale ref. The skeleton sits above and is
     conditionally removed instead.
───────────────────────────────────────────── */
const PlayerSkeleton = memo(() => (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/60 dark:bg-black/70">
        <div className="relative flex items-center justify-center">
            <span
                className="absolute w-16 h-16 rounded-full animate-ping"
                style={{ background: `rgba(${BRAND_RGB},0.25)` }}
            />
            <div
                className="relative flex items-center justify-center w-14 h-14 rounded-full"
                style={{
                    background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.55), rgba(${BRAND_RGB},0.25))`,
                    border: `1px solid rgba(${BRAND_RGB},0.45)`,
                }}
            >
                <Play size={20} fill="white" className="ml-0.5 text-white" />
            </div>
        </div>
        <span className="text-xs font-semibold tracking-widest uppercase text-white/35">
            Loading player…
        </span>
    </div>
));
PlayerSkeleton.displayName = 'YouTubeModal.PlayerSkeleton';

/* ─────────────────────────────────────────────
   COMPLETION BADGE
───────────────────────────────────────────── */
const CompletionBadge = memo(() => (
    <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full z-20"
        style={{
            background: 'rgba(16,185,129,0.18)',
            border: '1px solid rgba(16,185,129,0.40)',
            boxShadow: '0 4px 24px rgba(16,185,129,0.22)',
        }}
    >
        <CheckCircle2 size={14} style={{ color: '#10b981' }} />
        <span className="text-xs font-bold text-emerald-400">Watched — points awarded!</span>
        <Sparkles size={12} className="text-emerald-500/70" />
    </div>
));
CompletionBadge.displayName = 'YouTubeModal.CompletionBadge';

/* ─────────────────────────────────────────────
   MODAL CONTENT
───────────────────────────────────────────── */
const YouTubeModalContent = memo(({ video, title, isAuthenticated, user, onClose }) => {
    const containerRef = useRef(null);
    const { mutate: awardPoints } = useAwardPoints();
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [hasCompleted, setHasCompleted] = useState(false);

    const videoId = video?.video_id;
    const dateStr = formatDate(video?.published_at);

    const handleComplete = useCallback(() => {
        setHasCompleted(true);
        if (isAuthenticated) {
            awardPoints({ userId: user?.id, action: 'media.video_watched' });
        }
    }, [isAuthenticated, awardPoints, user]);

    const handleReady = useCallback(() => setIsPlayerReady(true), []);

    useYouTubeCompletion({
        videoId,
        containerRef,
        onComplete: handleComplete,
        onReady: handleReady,
        enabled: !!videoId,
    });

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full flex flex-col dark:bg-gray-950 bg-gray-900"
            style={{
                borderRadius: '1.25rem',
                /*
                 * box-shadow outline replaces overflow:hidden + border.
                 * overflow:hidden on a parent that contains a cross-origin
                 * iframe causes clipping in Safari and older Chromium when
                 * combined with border-radius. Using box-shadow for the
                 * visible border avoids that entirely.
                 */
                boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.08),
                    0 32px 80px rgba(0,0,0,0.70),
                    0 0 0 1.5px rgba(${BRAND_RGB},0.14)
                `,
            }}
        >
            {/* ── Branded top accent bar ────────────────────────────── */}
            <div
                className="h-[2px] w-full shrink-0"
                style={{
                    borderRadius: '1.25rem 1.25rem 0 0',
                    background: `linear-gradient(90deg, transparent 0%, rgba(${BRAND_RGB},0.9) 35%, rgba(${BRAND_RGB},0.55) 65%, transparent 100%)`,
                }}
            />

            {/* ── Header ────────────────────────────────────────────── */}
            <div className="flex items-start justify-between gap-3 px-5 pt-4 pb-3 border-b border-white/[0.06]">
                <div className="flex items-start gap-3 min-w-0">
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg mt-0.5 bg-red-600/15 border border-red-600/25">
                        <Youtube size={14} className="text-red-500" />
                    </div>

                    <div className="min-w-0">
                        {/*
                          Two-line clamp + native tooltip for full text on hover.
                          word-break:break-word handles slug-style / URL titles
                          with no natural whitespace break points.
                        */}
                        <p
                            className="text-sm font-bold leading-snug text-white/90 line-clamp-2"
                            title={title}
                            style={{ wordBreak: 'break-word' }}
                        >
                            {title || 'Untitled Video'}
                        </p>

                        {dateStr && (
                            <div className="flex items-center gap-1.5 mt-1">
                                <Calendar size={10} className="text-white/30" />
                                <span className="text-[10px] font-medium text-white/30">{dateStr}</span>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={onClose}
                    aria-label="Close video"
                    className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full
                               bg-white/[0.06] border border-white/10 text-white/55
                               transition-all duration-150 hover:bg-white/[0.12] hover:text-white
                               hover:scale-105 active:scale-90 focus:outline-none"
                >
                    <X size={14} strokeWidth={2.5} />
                </button>
            </div>

            {/* ── Player ────────────────────────────────────────────── */}
            {/*
              CRITICAL STACKING RULES:
              ─────────────────────────────────────────────────────────
              1. NO overflow:hidden on this container or any ancestor.
                 overflow:hidden + border-radius clips cross-origin iframes
                 in Safari / Chromium with hardware compositing enabled.

              2. NO backdropFilter anywhere in this subtree.
                 CSS backdrop-filter creates a new stacking context.
                 Cross-origin iframes (YouTube) will go blank or invisible
                 inside a backdrop-filter stacking context in Chromium ≤ 110
                 and all WebKit. The fix is already applied to the backdrop
                 overlay (bg-black/80 without blur).

              3. NO opacity mutation on containerRef.
                 YT.Player(element) REPLACES the target div with a new
                 <iframe> element in-place. React's ref then points to the
                 detached original div. Setting style.opacity on it is a
                 complete no-op — the visible iframe is unaffected.
                 Correct pattern: skeleton sits z-10 on top, is removed when
                 the player fires onReady. No opacity on the YT target.
              ─────────────────────────────────────────────────────────
            */}
            <div className="relative w-full bg-black" style={{ paddingBottom: '56.25%' }}>
                {/* YT mounts here — replaces this div with <iframe> in-place */}
                <div
                    ref={containerRef}
                    className="absolute inset-0 w-full h-full"
                />

                {/* Skeleton: z-10, above the iframe, removed on onReady */}
                {!isPlayerReady && <PlayerSkeleton />}

                {/* Points badge: z-20, shown once video completes */}
                {hasCompleted && isAuthenticated && <CompletionBadge />}
            </div>

            {/* ── Footer ────────────────────────────────────────────── */}
            <div
                className="flex items-center justify-between px-5 py-3 border-t border-white/[0.05]"
                style={{ borderRadius: '0 0 1.25rem 1.25rem' }}
            >
                <span
                    className="text-[10px] font-semibold uppercase tracking-widest"
                    style={{ color: `rgba(${BRAND_RGB},0.45)` }}
                >
                    GCCC Ibadan
                </span>

                {!hasCompleted && isAuthenticated && (
                    <span className="text-[10px] font-medium text-white/20">
                        Watch to end to earn points
                    </span>
                )}
                {hasCompleted && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400">
                        <CheckCircle2 size={10} />
                        Points earned
                    </span>
                )}
            </div>
        </div>
    );
});
YouTubeModalContent.displayName = 'YouTubeModal.Content';

/* ─────────────────────────────────────────────
   MODAL — PORTAL + BACKDROP

   BACKDROP:
   Intentionally uses bg-black/80 WITHOUT backdropFilter/blur.
   CSS backdrop-filter on the overlay creates a new stacking context.
   Browsers (Chromium ≤ 110, all WebKit) will clip or blank out
   cross-origin iframes (YouTube) that are descendants of such a
   context. Plain semi-transparent bg is the correct pattern when
   the subtree contains third-party iframes.
───────────────────────────────────────────── */
const YouTubeModal = memo(({ video, isOpen, onClose, isAuthenticated, user, title }) => {
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => { if (e.key === 'Escape') onClose(); };
        document.addEventListener('keydown', handler);
        return () => document.removeEventListener('keydown', handler);
    }, [isOpen, onClose]);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [isOpen]);

    /*
     * Mounting YouTubeModalContent only while isOpen=true means every
     * open/close cycle produces a fresh component tree with fresh state
     * (isPlayerReady=false, hasCompleted=false). No manual state resets needed.
     */
    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-label={title ?? 'Watch video'}
        >
            {/* Backdrop — solid bg, NO backdropFilter (see note above) */}
            <div
                className="absolute inset-0 bg-black/80 dark:bg-black/85"
                onClick={onClose}
            />

            <div className="relative w-full max-w-4xl z-10">
                <YouTubeModalContent
                    video={video}
                    title={title}
                    isAuthenticated={isAuthenticated}
                    user={user}
                    onClose={onClose}
                />
            </div>
        </div>,
        document.body,
    );
});

YouTubeModal.displayName = 'YouTubeModal';
export default YouTubeModal;