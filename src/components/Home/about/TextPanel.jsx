import { memo } from 'react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Reveal from '@/components/Home/shared/Reveal';

const PRIMARY_GHOST = 'rgba(17,155,214,0.055)';
const PRIMARY_STROKE = 'rgba(17,155,214,0.07)';

const GhostWatermark = memo(() => (
  <div
    aria-hidden="true"
    className="pointer-events-none absolute bottom-16 left-0 right-0 select-none overflow-hidden"
  >
    <svg
      viewBox="0 0 800 160"
      preserveAspectRatio="xMidYMid meet"
      className="w-full"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="88%"
        textAnchor="middle"
        dominantBaseline="auto"
        fontWeight="900"
        fontSize="170"
        letterSpacing="-4"
        fill={PRIMARY_GHOST}
        stroke={PRIMARY_STROKE}
        strokeWidth="0.4"
      >
        GCCC IB
      </text>
    </svg>
  </div>
));
GhostWatermark.displayName = 'About.GhostWatermark';

const TextPanel = memo(() => (
  <div className="relative overflow-hidden">
    <GhostWatermark />
    <div className="relative z-10 flex flex-col gap-6">
      <Reveal
        as="h3"
        className="max-w-lg text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl dark:text-white"
      >
        Where <span style={{ color: BRAND }}>Love</span>,{' '}
        <span style={{ color: BRAND }}>Family</span> &amp;{' '}
        <span style={{ color: BRAND }}>Kingdom</span> converge.
      </Reveal>

      <Reveal
        as="p"
        delay={0.1}
        className="text-base leading-relaxed text-gray-600 dark:text-gray-400"
      >
        GCCC Ibadan is a growing community of close knit believers, extending the frontiers of
        the Kingdom on every side.
      </Reveal>

      <Reveal
        as="p"
        delay={0.18}
        className="text-base leading-relaxed text-gray-600 dark:text-gray-400"
      >
        We do the Word, yield to the Spirit and practice the Culture of God&rsquo;s Kingdom, with
        a deep desire to regularly experience and manifest the Glory of God.
      </Reveal>

      <Reveal delay={0.26} className="pl-4" style={{ borderLeft: `2px solid ${BRAND}` }}>
        <p className="text-lg font-semibold text-gray-700 dark:text-white">
          The plan is to take our generation for Jesus.
        </p>
      </Reveal>
    </div>
  </div>
));
TextPanel.displayName = 'About.TextPanel';

export default TextPanel;
