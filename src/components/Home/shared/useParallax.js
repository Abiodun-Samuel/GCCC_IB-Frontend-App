import { useScroll, useTransform, useReducedMotion, useMotionValue } from 'framer-motion';

/**
 * Maps a section's scroll progress to a vertical offset.
 *
 * `distance` is the total travel in pixels across the section — negative moves the
 * layer up faster than the page (a "far" layer), positive moves it down.
 *
 * Returns a constant 0 when the user prefers reduced motion, so callers can bind
 * the result to `style={{ y }}` unconditionally.
 */
export const useParallax = (ref, distance) => {
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const moving = useTransform(scrollYProgress, [0, 1], [0, distance]);
  const still = useMotionValue(0);

  return reduced ? still : moving;
};

export default useParallax;
