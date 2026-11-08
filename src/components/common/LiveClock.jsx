import { memo, useEffect, useRef } from 'react';

const format = (date) =>
  date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });

/**
 * A clock that ticks every second by updating its own text, without a React
 * state update.
 *
 * A once-a-second state update in the header restarted any page render still
 * in progress, and React never times out the render that follows a lazy page
 * loading. Where a page took over a second to render (heavy pages on slower
 * phones, and Safari's engine in testing) it stayed on the loader for good.
 */
const LiveClock = ({ className = '' }) => {
  const ref = useRef(null);

  useEffect(() => {
    const tick = () => {
      if (ref.current) ref.current.textContent = format(new Date());
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return <span ref={ref} className={className}>{format(new Date())}</span>;
};

export default memo(LiveClock);
