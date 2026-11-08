import { useEffect, useState } from 'react';
import { getCountdown } from './hangoutUtils';

/**
 * Days/hours/minutes until `targetMs`, refreshed every `intervalMs`.
 * Minute precision is all the page shows, so it re-renders twice a minute
 * at most and stops ticking once the target has passed.
 */
export const useCountdown = (targetMs, intervalMs = 30 * 1000) => {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!Number.isFinite(targetMs)) return undefined;

    const id = setInterval(() => {
      const current = Date.now();
      setNow(current);
      if (current >= targetMs) clearInterval(id);
    }, intervalMs);

    return () => clearInterval(id);
  }, [targetMs, intervalMs]);

  return getCountdown(targetMs, now);
};
