import { useEffect } from 'react';

/** Locks background scroll while a modal is mounted, restoring the previous value. */
export const useLockBodyScroll = () => {
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);
};

export default useLockBodyScroll;
