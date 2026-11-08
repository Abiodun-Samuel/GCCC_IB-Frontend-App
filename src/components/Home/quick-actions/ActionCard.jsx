import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '@/components/Home/shared/motion';

/**
 * One quick action.
 *
 * The original ghost-image treatment is kept exactly as it was: the photo sits
 * in the top-right atmospheric zone, rotated and duotoned in the card accent,
 * reading as texture rather than as content.
 *
 * What changed is only the motion — the card now rises on a spring-like eased
 * curve instead of a linear transition, the reveal is staggered per card, and
 * every animated property is transform or opacity so nothing triggers layout.
 */
const ActionCard = memo(({ meta, link, index }) => {
  const { num, Icon, label, title, body, cta, color, colorRGB, light } = meta;
  const reduced = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduced ? 0 : 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-12%' }}
      transition={{
        duration: reduced ? DUR.fast : DUR.slow,
        delay: reduced ? 0 : index * 0.1,
        ease: EASE_OUT,
      }}
      className="h-full"
    >
      <Link
        to={link.to}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col overflow-hidden rounded border border-gray-100 bg-white transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-2 hover:shadow-xl active:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-gray-800 dark:bg-gray-900"
        style={{ outlineColor: color }}
      >
        {/* Colour top bar */}
        <div className="h-1 w-full shrink-0" style={{ background: color }} />

        {/* Ghost image — atmospheric texture, not content. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-2 h-52 w-52 -rotate-[12deg] select-none overflow-hidden rounded-xl opacity-[0.12] transition-[opacity,transform] duration-700 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-105 group-hover:opacity-[0.24]"
        >
          <img src={link.src} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />

          <div
            className="absolute inset-0"
            style={{ background: `rgba(${colorRGB}, 0.55)`, mixBlendMode: 'multiply' }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse at 60% 40%, transparent 30%, rgba(255,255,255,0.85) 100%)',
            }}
          />
        </div>

        <div className="relative z-10 flex flex-1 flex-col gap-5 p-6 sm:p-7">
          <div className="flex items-start justify-between">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110 group-hover:-rotate-6"
              style={{ background: light }}
            >
              <Icon size={22} style={{ color }} strokeWidth={1.8} />
            </div>
            <span
              className="select-none text-2xl font-black tabular-nums opacity-[0.10] transition-opacity duration-500 group-hover:opacity-100 dark:opacity-[0.06]"
              style={{ color }}
            >
              {num}
            </span>
          </div>

          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-[10px] font-black uppercase tracking-[0.20em]" style={{ color }}>
              {label}
            </p>
            <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-900 sm:text-2xl dark:text-white">
              {title}
            </h3>
            <div
              className="my-1 h-0.5 w-8 origin-left rounded-full transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-x-[2.5]"
              style={{ background: `${color}45` }}
            />
            <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400">{body}</p>
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-black/5 pt-4 dark:border-white/5">
            <span className="text-sm font-semibold" style={{ color }}>
              {cta}
            </span>
            <span
              className="flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:translate-x-1 group-hover:-translate-y-1"
              style={{ background: light }}
            >
              <ArrowUpRight size={15} style={{ color }} strokeWidth={2.2} />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});
ActionCard.displayName = 'QA.ActionCard';

export default ActionCard;
