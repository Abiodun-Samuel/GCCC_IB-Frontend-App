import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from './motion';

/**
 * Reveals its children once, when they scroll into view.
 *
 * Under prefers-reduced-motion the vertical travel is dropped entirely and only
 * opacity is animated — the trigger for motion sickness is movement, not fades.
 */
const Reveal = ({ children, delay = 0, y = 24, as = 'div', className = '', ...rest }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-10%' });
  const reduced = useReducedMotion();

  const Component = motion[as] ?? motion.div;

  return (
    <Component
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: reduced ? 0 : y }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: reduced ? DUR.fast : DUR.base,
        delay: reduced ? 0 : delay,
        ease: EASE_OUT,
      }}
      {...rest}
    >
      {children}
    </Component>
  );
};

export default Reveal;
