import { memo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { BRAND } from '@/components/common/AnimatedBackground';
import { EASE_OUT } from '@/components/Home/shared/motion';
import { COPY_PLACE } from './heroTiles';

const HEADLINE = {
  lead: ['Where', 'God', 'Meets'],
  accent: ['With', 'His', 'People'],
};

/**
 * Masked word reveal.
 *
 * The space sits OUTSIDE the mask as a real text node. Put it inside and the
 * overflow-hidden inline-block swallows it, which is what ran the words together
 * as "WhereGodMeets". A margin would fix the look but strip the space from the
 * DOM, leaving a screen reader to read the line as one word.
 */
const Word = memo(({ word, index, accent, reduced }) => (
  <>
    <span className="inline-block overflow-hidden align-bottom">
      <motion.span
        className="inline-block"
        style={accent ? { color: BRAND } : undefined}
        initial={{ y: reduced ? 0 : '116%', opacity: reduced ? 0 : 1 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: reduced ? 0.22 : 0.85,
          delay: reduced ? 0 : 0.06 + index * 0.055,
          ease: EASE_OUT,
        }}
      >
        {word}
      </motion.span>
    </span>{' '}
  </>
));
Word.displayName = 'Hero.Word';

const rise = (delay, reduced) => ({
  initial: { opacity: 0, y: reduced ? 0 : 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: reduced ? 0.22 : 0.7, delay: reduced ? 0 : delay, ease: EASE_OUT },
});

/**
 * The message, and the hole in the wall it sits in.
 *
 * This is a grid child, not an overlay. Making it a real cell is what keeps the
 * photographs from ever running underneath the headline, at any width, without
 * anything having to be measured at runtime.
 */
const HeroCopy = ({ reduced, onScrollToContact }) => (
  <div
    className={`${COPY_PLACE} z-20 mb-5 flex flex-col items-center justify-center gap-4 px-2 text-center sm:mb-7 sm:gap-5 lg:mb-0 lg:px-6`}
  >
    <motion.div {...rise(0, reduced)}>
      <span
        data-testid="hero-badge"
        className="inline-flex items-center gap-2 rounded-full bg-white/75 px-4 py-2 shadow-[0_2px_14px_rgba(12,58,86,0.10)] backdrop-blur-md dark:bg-white/10"
      >
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#0998d5] opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#0998d5]" />
        </span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#0998d5] sm:text-[10px]">
          Glory Centre Community Church
        </span>
        <Sparkles className="h-3 w-3 text-[#0998d5]" />
      </span>
    </motion.div>

    <h1 className="text-[2rem] font-bold leading-[1.04] tracking-[-0.025em] text-gray-900 sm:text-5xl lg:text-[3.4rem] xl:text-[4.1rem] dark:text-white">
      <span className="block">
        {HEADLINE.lead.map((w, i) => (
          <Word key={w} word={w} index={i} reduced={reduced} />
        ))}
      </span>
      <span className="block">
        {HEADLINE.accent.map((w, i) => (
          <Word key={w} word={w} index={HEADLINE.lead.length + i} accent reduced={reduced} />
        ))}
      </span>
    </h1>

    <motion.p
      {...rise(0.4, reduced)}
      className="max-w-md text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-300"
    >
      A vibrant family rooted and growing in the{' '}
      <span className="font-semibold text-[#0998d5]">Grace and Knowledge of God</span>.
    </motion.p>

    <motion.div {...rise(0.48, reduced)} className="flex flex-wrap items-center justify-center gap-3">
      <Link
        to="/#contact"
        onClick={onScrollToContact}
        className="group inline-flex items-center justify-center gap-2 rounded-full bg-[#0998d5] px-7 py-3 text-sm font-semibold text-white shadow-[0_8px_24px_-6px_rgba(9,152,213,0.55)] transition-[background,transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:bg-[#0886bd] hover:shadow-[0_14px_32px_-8px_rgba(9,152,213,0.65)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0998d5]"
      >
        <span>Join Our Community</span>
        <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1.5" />
      </Link>

      <a
        href="#about"
        className="inline-flex items-center justify-center rounded-full bg-white/75 px-6 py-3 text-sm font-semibold text-gray-700 shadow-[0_2px_14px_rgba(12,58,86,0.10)] backdrop-blur-md transition-[color,transform,background] duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#0998d5] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0998d5] dark:bg-white/10 dark:text-gray-100"
      >
        Who We Are
      </a>
    </motion.div>
  </div>
);

export default memo(HeroCopy);
