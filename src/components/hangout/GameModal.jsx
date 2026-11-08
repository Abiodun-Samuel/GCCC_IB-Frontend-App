import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react';
import PhotoCredit from './PhotoCredit';
import VideoEmbed from './VideoEmbed';
import { DISPLAY, THEME } from './HangoutTheme';
import { PRIMARY_BUTTON, SECONDARY_BUTTON } from './hangoutStyles';
import { lockPageScroll } from './hangoutUtils';

const FOCUSABLE = 'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';
const srcSet = (photo, ext) => photo.widths.map((w) => `${photo.path}-${w}.${ext} ${w}w`).join(', ');

/** The game's photos, one at a time at their own shape (letterboxed, never cropped). */
const PhotoViewer = ({ photos, gameName }) => {
  const [index, setIndex] = useState(0);
  const photo = photos[index];
  const go = (delta) => setIndex((i) => (i + delta + photos.length) % photos.length);

  if (!photo) return null;
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#06111d]">
        <picture>
          <source type="image/webp" srcSet={srcSet(photo, 'webp')} sizes="(max-width: 1023px) 92vw, 520px" />
          <img
            key={photo.path}
            src={`${photo.path}-${photo.widths[photo.widths.length - 1]}.jpg`}
            srcSet={srcSet(photo, 'jpg')}
            sizes="(max-width: 1023px) 92vw, 520px"
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            className="absolute inset-0 h-full w-full object-contain"
          />
        </picture>
        {photos.length > 1 && (
          <>
            <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#062c4f] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-sun)">
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next photo" className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#062c4f] shadow-sm transition hover:bg-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-sun)">
              <ChevronRight size={20} aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      <div className="mt-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-sm text-(--hg-muted)">
        <span aria-live="polite">Photo {index + 1} of {photos.length}</span>
        <PhotoCredit credit={photo.credit} />
      </div>

      {photos.length > 1 && (
        <ul className="mt-3 flex gap-2" aria-label={`${gameName} photos`}>
          {photos.map((item, i) => (
            <li key={item.path}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index ? 'true' : undefined}
                className={`block h-14 w-20 overflow-hidden rounded-lg bg-[#06111d] ring-2 transition focus-visible:outline-none focus-visible:ring-(--hg-sun) ${i === index ? 'ring-(--hg-brand)' : 'ring-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={`${item.path}-${item.widths[0]}.jpg`} alt="" loading="lazy" className="h-full w-full object-contain" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

/**
 * "More about this game": photos, a video and what to expect, with a button
 * to pick the game. Closes on Escape, the close button or the backdrop, and
 * hands focus back to `returnFocusTo` (the button that opened it; Safari
 * doesn't focus buttons on click, so document.activeElement can't be trusted).
 */
const GameModal = ({ game, picked, canPick, onPick, onClose, returnFocusTo }) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    const unlock = lockPageScroll();
    closeRef.current?.focus({ preventScroll: true });
    return () => {
      unlock();
      returnFocusTo?.focus?.({ preventScroll: true });
    };
  }, [returnFocusTo]);

  const onKeyDown = useCallback((event) => {
    if (event.key === 'Escape') {
      event.stopPropagation();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])];
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }, [onClose]);

  const photos = [game.cover, ...game.photos].filter(Boolean);
  const titleId = `game-modal-${game.slug}`;
  const Icon = game.icon;

  return createPortal(
    <div className={`${THEME} fixed inset-0 z-[99999] flex items-end justify-center font-outfit [-webkit-tap-highlight-color:transparent] sm:items-center sm:p-6`}>
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[#020b14]/70 backdrop-blur-sm"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onClose}
      />
      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onKeyDown={onKeyDown}
        initial={reduceMotion ? false : { opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex max-h-[92vh] supports-[height:100dvh]:max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-3xl bg-(--hg-surface) text-(--hg-ink) sm:rounded-3xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-(--hg-line) px-5 py-4 sm:px-8 sm:py-5">
          <div className="flex min-w-0 items-center gap-3.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-(--hg-tint) text-(--hg-brand)">
              {Icon && <Icon size={22} aria-hidden="true" />}
            </span>
            <div className="min-w-0">
              <h2 id={titleId} className={`${DISPLAY} text-2xl font-extrabold leading-tight sm:text-3xl`}>{game.name}</h2>
              {game.tagline && <p className="text-base text-(--hg-muted)">{game.tagline}</p>}
            </div>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-(--hg-ink) ring-1 ring-(--hg-line) transition hover:bg-(--hg-bg) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-5 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
            <PhotoViewer photos={photos} gameName={game.name} />

            <div>
              {game.description && <p className="text-lg leading-relaxed">{game.description}</p>}
              {game.expect?.length > 0 && (
                <>
                  <h3 className="mt-7 text-base font-bold">Good to know</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {game.expect.map((item) => (
                      <li key={item} className="flex gap-2.5 text-base leading-relaxed text-(--hg-muted)">
                        <Check size={18} className="mt-1 shrink-0 text-(--hg-brand)" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {game.count > 0 && (
                <p className="mt-6 text-base font-semibold">
                  {game.count === 1 ? '1 member has' : `${game.count.toLocaleString('en-GB')} members have`} picked {game.name} so far.
                </p>
              )}
            </div>
          </div>

          {game.video && (
            <div className="mt-10">
              <h3 className="mb-3 text-base font-bold">Watch</h3>
              <VideoEmbed video={game.video} className="max-w-3xl" />
            </div>
          )}
        </div>

        <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-(--hg-line) px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:px-8">
          <button type="button" onClick={onClose} className={SECONDARY_BUTTON}>Close</button>
          {canPick && (
            <button type="button" onClick={() => onPick(game.name)} disabled={picked} className={PRIMARY_BUTTON}>
              {picked ? <><Check size={18} aria-hidden="true" />This is your game</> : `Pick ${game.name}`}
            </button>
          )}
        </footer>
      </motion.div>
    </div>,
    document.body,
  );
};

export default memo(GameModal);
