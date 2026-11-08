import { memo, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

const COLORS = ['#0779ad', '#8fdcff', '#ffcf4a', '#38b6f0', '#ffffff'];
const PIECES = 36;

/** A single burst of confetti when someone registers. Skipped with reduced motion. */
const Confetti = () => {
  const reduceMotion = useReducedMotion();
  const pieces = useMemo(() => Array.from({ length: PIECES }, (_, i) => {
    const angle = (i / PIECES) * Math.PI * 2 + Math.random() * 0.4;
    const distance = 140 + Math.random() * 220;
    return {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance * 0.7 - 60,
      rotate: Math.random() * 540 - 270,
      color: COLORS[i % COLORS.length],
      round: i % 3 === 0,
      delay: Math.random() * 0.12,
    };
  }), []);

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute left-1/4 top-6 z-10">
      {pieces.map((piece, i) => (
        <motion.span
          key={i}
          className={`absolute block h-2.5 w-2 ${piece.round ? 'rounded-full' : 'rounded-[2px]'}`}
          style={{ backgroundColor: piece.color }}
          initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ x: piece.x, y: [0, piece.y, piece.y + 220], opacity: [1, 1, 0], rotate: piece.rotate, scale: 0.9 }}
          transition={{ duration: 1.8, delay: piece.delay, ease: 'easeOut', times: [0, 0.4, 1] }}
        />
      ))}
    </div>
  );
};

export default memo(Confetti);
