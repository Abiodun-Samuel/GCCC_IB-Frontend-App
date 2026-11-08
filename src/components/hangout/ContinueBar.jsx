import { memo, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';
import { scrollToSection } from './hangoutUtils';

/**
 * Once a game is picked, a small bar offers the way on to the form, and
 * steps aside while the form itself is on screen.
 */
const ContinueBar = ({ gameName, active }) => {
  const reduceMotion = useReducedMotion();
  const [formInView, setFormInView] = useState(false);

  useEffect(() => {
    if (!active) return undefined;
    const form = document.getElementById('register');
    if (!form || typeof IntersectionObserver === 'undefined') return undefined;
    const observer = new IntersectionObserver(([entry]) => setFormInView(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(form);
    return () => observer.disconnect();
  }, [active]);

  const show = active && !!gameName && !formInView;

  return (
    <AnimatePresence>
      {/* pr-24 leaves room for the site's own floating buttons on small screens. */}
      {show && (
        <motion.div
          key="continue"
          initial={reduceMotion ? false : { y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { y: 80, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex justify-start pl-4 pr-24 sm:justify-center sm:px-4"
        >
          <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-full bg-(--hg-deep) py-2 pl-5 pr-2 text-white shadow-[0_2px_6px_rgba(2,11,20,0.25)] ring-1 ring-white/15">
            <p className="flex min-w-0 items-center gap-2 text-sm font-semibold">
              <Check size={16} className="shrink-0 text-(--hg-sun)" aria-hidden="true" />
              <span className="truncate">{gameName}</span>
            </p>
            <button
              type="button"
              onClick={() => scrollToSection('register')}
              className="shrink-0 rounded-full bg-(--hg-sky) px-5 py-2.5 text-sm font-bold text-[#062c4f] transition hover:brightness-105 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Continue
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default memo(ContinueBar);
