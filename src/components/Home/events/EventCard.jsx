import { memo, useCallback, useState } from 'react';
import {
  Calendar,
  CalendarClock,
  Clock,
  MapPin,
  Mic,
  Share2,
  UserCheck,
  UserPlus,
  Video,
  Wifi,
} from 'lucide-react';

import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';
import { Toast } from '@/lib/toastify';
import { buildShareText, fetchEventImageFile } from '@/utils/helper';
import { fmtDateRange, fmtShortDate, fmtTimeRange } from './eventFormat';

const TEAL = '#07c4b8';
const TEAL_RGB = '7,196,184';

const STATUS_CFG = {
  ongoing: { label: 'Live Now', colorRGB: '52,211,153', color: '#34d399', pulse: true },
  upcoming: { label: 'Upcoming', colorRGB: '56,189,248', color: '#38bdf8', pulse: false },
  past: { label: 'Ended', colorRGB: '148,163,184', color: '#94a3b8', pulse: false },
};

const doShare = async (event) => {
  const url = `${window.location.origin}/events/${event.id}`;
  const richText = buildShareText(event, url);

  if (typeof navigator.share === 'function') {
    const imageFile = await fetchEventImageFile(event.image);
    if (imageFile) {
      const p = { title: event.title, text: richText, files: [imageFile] };
      if (navigator.canShare?.(p)) {
        try {
          await navigator.share(p);
          return;
        } catch (e) {
          if (e?.name === 'AbortError') return;
        }
      }
    }
    const p2 = { title: event.title, text: richText, url };
    if (navigator.canShare?.(p2) ?? true) {
      try {
        await navigator.share(p2);
        return;
      } catch (e) {
        if (e?.name === 'AbortError') return;
      }
    }
  }

  try {
    await navigator.clipboard.writeText(richText);
    Toast.success('Event details copied!');
  } catch {
    Toast.error('Could not share event');
  }
};

const ActionLink = ({ href, icon: Icon, label, background, border, color, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all hover:opacity-85 active:scale-95"
    style={{ background, border, color }}
  >
    <Icon size={11} />
    {label}
    {children}
  </a>
);

/**
 * One event.
 *
 * Event posters come from the API as arbitrary remote URLs, so this uses a plain
 * img rather than the Picture component — there is no generated manifest for
 * them and no intrinsic size known up front.
 *
 * Orientation is detected on load: portrait flyers get a taller box and
 * object-contain with a blurred fill behind, so a poster is never cropped
 * through its own text.
 */
const EventCard = memo(({ event, compact = false }) => {
  const [imgError, setImgError] = useState(false);
  const [isPortrait, setIsPortrait] = useState(false);

  const cfg = STATUS_CFG[event.status] || STATUS_CFG.upcoming;

  const handleShare = useCallback(() => doShare(event), [event]);

  const handleImgLoad = useCallback((e) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setIsPortrait(naturalHeight > naturalWidth);
  }, []);

  const hasVideo = event.has_streaming && !!event.video_streaming_link;
  const hasAudio = event.has_streaming && !!event.audio_streaming_link;
  const hasRegistration = event.is_registration_open && !!event.registration_link;

  const regDeadlineFmt = event.registration_deadline
    ? fmtShortDate(event.registration_deadline)
    : null;

  const imgHeight = compact ? 180 : isPortrait ? 420 : 300;

  return (
    <article
      className="ev-card flex flex-col overflow-hidden rounded-2xl"
      style={{
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.09)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        className="relative w-full overflow-hidden bg-black/30 transition-all duration-300"
        style={{ height: imgHeight }}
      >
        {!imgError ? (
          <>
            {isPortrait && !compact && (
              <img
                src={event.image}
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-2xl"
              />
            )}
            <img
              src={event.image}
              alt={event.title}
              onLoad={handleImgLoad}
              onError={() => setImgError(true)}
              loading="lazy"
              decoding="async"
              className={[
                'relative h-full w-full transition-transform duration-700 hover:scale-105',
                isPortrait && !compact ? 'object-contain' : 'object-cover object-top',
              ].join(' ')}
            />
          </>
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, rgba(${BRAND_RGB},0.07), rgba(${TEAL_RGB},0.04))`,
            }}
          >
            <Calendar size={36} style={{ color: `rgba(${BRAND_RGB},0.22)` }} strokeWidth={1} />
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold"
            style={{
              background: `rgba(${cfg.colorRGB},0.15)`,
              border: `1px solid rgba(${cfg.colorRGB},0.30)`,
              color: cfg.color,
            }}
          >
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full"
              style={{
                backgroundColor: cfg.color,
                ...(cfg.pulse && { animation: 'hub-ripple 1.6s ease-out infinite' }),
              }}
            />
            {cfg.label}
          </span>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-[11px] font-bold text-white"
            style={{ background: `rgba(${BRAND_RGB},0.55)` }}
          >
            <Clock size={11} />
            {fmtTimeRange(event)}
          </span>
        </div>

        <h3
          className="line-clamp-2 font-black leading-tight text-white"
          style={{ fontSize: compact ? '1rem' : '1.35rem', letterSpacing: '-0.015em' }}
        >
          {event.title}
        </h3>

        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-2.5">
            <CalendarClock
              size={13}
              className="mt-0.5 shrink-0"
              style={{ color: `rgba(${BRAND_RGB},0.70)` }}
            />
            <span className="text-sm leading-snug text-white/55">{fmtDateRange(event)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-2.5">
              <MapPin size={13} className="shrink-0" style={{ color: `rgba(${BRAND_RGB},0.70)` }} />
              <span className="truncate text-sm text-white/55">{event.location}</span>
            </div>
          )}
        </div>

        {event.description && !compact && (
          <p className="line-clamp-3 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.32)' }}>
            {event.description}
          </p>
        )}

        {(hasVideo || hasAudio || hasRegistration) && (
          <div className="flex flex-wrap gap-2">
            {hasVideo && (
              <ActionLink
                href={event.video_streaming_link}
                icon={Video}
                label="Watch Live"
                background="#cc000022"
                border="1px solid #cc000055"
                color="#f87171"
              />
            )}
            {hasAudio && (
              <ActionLink
                href={event.audio_streaming_link}
                icon={Mic}
                label="Listen Live"
                background={`rgba(${TEAL_RGB},0.12)`}
                border={`1px solid rgba(${TEAL_RGB},0.28)`}
                color={TEAL}
              />
            )}
            {hasRegistration && (
              <ActionLink
                href={event.registration_link}
                icon={UserPlus}
                label="Register / Invite"
                background={`rgba(${BRAND_RGB},0.13)`}
                border={`1px solid rgba(${BRAND_RGB},0.25)`}
                color="#7dd3fc"
              >
                {regDeadlineFmt && (
                  <span style={{ color: 'rgba(255,255,255,0.28)', fontWeight: 400 }}>
                    &middot; {regDeadlineFmt}
                  </span>
                )}
              </ActionLink>
            )}
          </div>
        )}

        <div
          className="mt-auto flex items-center justify-between gap-3 pt-1"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div className="flex flex-wrap items-center gap-2">
            {event.has_streaming && (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{ background: `rgba(${BRAND_RGB},0.14)`, color: '#7dd3fc' }}
              >
                <Wifi size={10} />
                Streaming
              </span>
            )}
            {event.is_registration_open && (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{ background: 'rgba(52,211,153,0.14)', color: '#6ee7b7' }}
              >
                <UserCheck size={10} />
                Open
              </span>
            )}
            {!event.has_streaming && !event.is_registration_open && (
              <span
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.28)' }}
              >
                <MapPin size={10} />
                In-person
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleShare}
            className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
            style={{
              background: `linear-gradient(135deg, ${BRAND} 0%, ${TEAL} 100%)`,
              boxShadow: `0 2px 14px rgba(${BRAND_RGB},0.32)`,
            }}
            aria-label={`Share ${event.title}`}
          >
            <Share2 size={13} />
            Share
          </button>
        </div>
      </div>
    </article>
  );
});
EventCard.displayName = 'Events.EventCard';

export default EventCard;
