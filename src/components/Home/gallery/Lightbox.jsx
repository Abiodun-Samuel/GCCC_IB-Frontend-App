import { memo, useCallback, useEffect, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Picture from '@/components/Home/shared/Picture';
import { getImage } from '@/components/Home/shared/homeImages';
import useLockBodyScroll from '@/components/Home/shared/useLockBodyScroll';
import { DUR, EASE_OUT } from '@/components/Home/shared/motion';

const FOCUSABLE = 'button, [href], [tabindex]:not([tabindex="-1"])';

/**
 * Full-screen image viewer.
 *
 * Owns no index state of its own — the parent decides which image is showing, so
 * there is one source of truth and no chance of the two drifting apart.
 */
const Lightbox = ({ images, index, onClose, onNavigate }) => {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const reduced = useReducedMotion();

  useLockBodyScroll();

  const image = getImage(images[index]);

  const goNext = useCallback(
    () => onNavigate((index + 1) % images.length),
    [index, images.length, onNavigate]
  );

  const goPrev = useCallback(
    () => onNavigate((index - 1 + images.length) % images.length),
    [index, images.length, onNavigate]
  );

  // Focus the close control on open so keyboard users land inside the dialog
  // rather than continuing from wherever they were on the page behind it.
  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goNext();
        return;
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goPrev();
        return;
      }
      if (e.key !== 'Tab') return;

      // Trap Tab inside the dialog: wrap at both ends rather than letting focus
      // escape to the page underneath, which is still rendered.
      const nodes = dialogRef.current?.querySelectorAll(FOCUSABLE);
      if (!nodes || nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose, goNext, goPrev]);

  return (
    <motion.div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/92 p-4 backdrop-blur-sm sm:p-8"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? DUR.fast : DUR.base, ease: EASE_OUT }}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close image viewer"
        className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        aria-label="Previous image"
        className="absolute left-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:left-6"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        aria-label="Next image"
        className="absolute right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-6"
      >
        <ChevronRight size={22} />
      </button>

      <motion.figure
        key={image.name}
        className="relative flex max-h-full max-w-5xl flex-col items-center gap-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: reduced ? DUR.fast : DUR.base, ease: EASE_OUT }}
      >
        <Picture
          name={image.name}
          sizes="100vw"
          className="block max-h-[78vh] overflow-hidden"
          imgClassName="max-h-[78vh] w-auto object-contain"
        />
        <figcaption className="flex items-center gap-3 text-center text-xs text-white/60">
          <span className="font-black tabular-nums" style={{ color: BRAND }}>
            {String(index + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <span className="max-w-md">{image.alt}</span>
        </figcaption>
      </motion.figure>
    </motion.div>
  );
};

export default memo(Lightbox);
