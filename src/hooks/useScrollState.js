import { useState, useEffect, useCallback } from 'react';

export function useScrollState({
    topOffset = 50,
    backToTopOffset = 500,
    smoothScroll = true,
} = {}) {
    const [scrolled, setScrolled] = useState(false);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const handleScroll = useCallback(() => {
        const scrollPosition = window.pageYOffset;

        setScrolled(scrollPosition > topOffset);
        setShowBackToTop(scrollPosition > backToTopOffset);
    }, [topOffset, backToTopOffset]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        if (smoothScroll) {
            const root = document.documentElement;
            const previous = root.style.scrollBehavior;
            root.style.scrollBehavior = 'smooth';

            return () => {
                window.removeEventListener('scroll', handleScroll);
                root.style.scrollBehavior = previous;
            };
        }

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll, smoothScroll]);

    return { scrolled, showBackToTop };
}
