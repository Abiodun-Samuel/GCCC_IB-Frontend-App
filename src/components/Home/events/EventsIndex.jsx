import { memo, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Calendar, MapPin } from 'lucide-react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';
import { fmtShortDate, fmtTime } from './eventFormat';

const SPRING = { stiffness: 260, damping: 30, mass: 0.6 };
const PREVIEW_W = 260;
const PREVIEW_H = 170;

/**
 * A single row. Deliberately not a card: the list reads as an index or an
 * agenda, and the photography lives in the cursor preview rather than being
 * chopped into thumbnails.
 */
const Row = memo(({ event, index, onEnter, onLeave, isDimmed }) => {
  const dateLabel = fmtShortDate(event.start_date || event.date) || event.date;
  const timeLabel = fmtTime(event.start_time);

  return (
    <li>
      <Link
        to={`/events/${event.id}/registration`}
        onMouseEnter={() => onEnter(event, index)}
        onMouseLeave={onLeave}
        onFocus={() => onEnter(event, index)}
        onBlur={onLeave}
        className="group relative flex items-center gap-4 border-t py-6 transition-[opacity,padding] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:pl-3 focus-visible:pl-3 focus-visible:outline-2 focus-visible:outline-offset-4 sm:gap-8 sm:py-7"
        style={{
          borderColor: 'rgba(255,255,255,0.10)',
          opacity: isDimmed ? 0.32 : 1,
          outlineColor: BRAND,
        }}
      >
        {/* Wipe that fills the row on hover */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100"
          style={{ background: BRAND }}
        />

        <span
          className="w-8 shrink-0 text-[11px] font-black tabular-nums tracking-widest transition-colors duration-300"
          style={{ color: `rgba(${BRAND_RGB},0.55)` }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <span className="w-28 shrink-0 text-xs font-semibold text-white/45 sm:w-36 sm:text-sm">
          <span className="flex items-center gap-1.5">
            <Calendar size={11} className="shrink-0" />
            {dateLabel}
          </span>
          {timeLabel && <span className="mt-0.5 block pl-[18px] text-white/25">{timeLabel}</span>}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block truncate text-lg font-bold leading-tight text-white transition-colors duration-300 group-hover:text-[#0998d5] sm:text-2xl">
            {event.title}
          </span>
          {event.location && (
            <span className="mt-1 flex items-center gap-1.5 truncate text-xs text-white/35">
              <MapPin size={10} className="shrink-0" />
              {event.location}
            </span>
          )}
        </span>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-[transform,background] duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-focus-visible:translate-x-1"
          style={{ background: `rgba(${BRAND_RGB},0.12)` }}
        >
          <ArrowUpRight size={15} style={{ color: BRAND }} />
        </span>
      </Link>
    </li>
  );
});
Row.displayName = 'Events.Row';

/**
 * The upcoming-events index.
 *
 * Rows carry the facts; a single preview image tracks the cursor so the
 * photography is present without turning the list back into a grid of cards.
 * The preview is purely decorative and is never rendered for keyboard or
 * reduced-motion users, who get the row highlight instead.
 */
const EventsIndex = ({ events }) => {
  const reduced = useReducedMotion();
  const wrapRef = useRef(null);

  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  const handleMove = useCallback(
    (e) => {
      const rect = wrapRef.current?.getBoundingClientRect();
      if (!rect) return;
      x.set(e.clientX - rect.left - PREVIEW_W / 2);
      y.set(e.clientY - rect.top - PREVIEW_H / 2);
    },
    [x, y]
  );

  const handleEnter = useCallback((event) => {
    setActive(event);
    setVisible(true);
  }, []);

  const handleLeave = useCallback(() => setVisible(false), []);

  if (!events.length) return null;

  return (
    <div
      ref={wrapRef}
      className="relative"
      onMouseMove={reduced ? undefined : handleMove}
    >
      <ul className="list-none">
        {events.map((event, i) => (
          <Row
            key={event.id}
            event={event}
            index={i}
            onEnter={handleEnter}
            onLeave={handleLeave}
            isDimmed={visible && active?.id !== event.id}
          />
        ))}
      </ul>

      {/* Bottom rule so the last row closes the list */}
      <div aria-hidden="true" className="h-px w-full" style={{ background: 'rgba(255,255,255,0.10)' }} />

      {!reduced && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-0 z-20 hidden overflow-hidden rounded-sm shadow-2xl lg:block"
          style={{ x: sx, y: sy, width: PREVIEW_W, height: PREVIEW_H }}
          initial={false}
          animate={{
            opacity: visible && active?.image ? 1 : 0,
            scale: visible && active?.image ? 1 : 0.9,
          }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        >
          {active?.image && (
            <img
              src={active.image}
              alt=""
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default memo(EventsIndex);
