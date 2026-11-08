import { memo } from 'react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Reveal from './Reveal';

const TONE = {
  dark: { title: 'text-white', subtitle: 'text-white/45' },
  light: {
    title: 'text-gray-900 dark:text-white',
    subtitle: 'text-gray-500 dark:text-gray-400',
  },
};

/**
 * The single section header for the home page.
 * Replaced four near-identical local copies (About, QuickActions, MediaHub, Hub).
 */
const SectionHeader = ({
  eyebrow,
  titleLead,
  titleAccent,
  subtitle,
  tone = 'dark',
  action,
  className = '',
}) => {
  const t = TONE[tone] ?? TONE.dark;

  return (
    <Reveal className={`flex flex-col gap-3 mb-16 sm:mb-24 ${className}`}>
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          <div className="w-5 h-0.5 rounded-full shrink-0" style={{ background: BRAND }} />
          <span
            className="text-[10px] font-black uppercase tracking-[0.24em]"
            style={{ color: BRAND }}
          >
            {eyebrow}
          </span>
        </div>
      )}

      <div className="flex items-end justify-between gap-6 flex-wrap">
        <h2
          className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight ${t.title}`}
        >
          {titleLead && <span>{titleLead} </span>}
          {titleAccent && <span style={{ color: BRAND }}>{titleAccent}</span>}
        </h2>
        {action}
      </div>

      {subtitle && (
        <p className={`text-base leading-relaxed max-w-lg ${t.subtitle}`}>{subtitle}</p>
      )}
    </Reveal>
  );
};

export default memo(SectionHeader);
