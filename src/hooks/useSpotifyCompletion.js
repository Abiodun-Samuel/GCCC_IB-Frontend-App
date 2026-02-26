import { useEffect, useRef } from 'react';

/**
 * Fire `onComplete` when the user has listened past this fraction.
 * 90% is generous enough to handle tab-close before the final second.
 */
const COMPLETION_THRESHOLD = 0.9;

/**
 * useSpotifyCompletion
 * ─────────────────────────────────────────────
 * Listens to the Spotify embed's postMessage events.
 * Spotify fires `{ type: 'playback_update', payload: { position, duration, isPaused } }`
 * every second while a track plays.
 *
 * Calls `onComplete` exactly once per mount when
 * position / duration >= COMPLETION_THRESHOLD.
 *
 * @param {object}   opts
 * @param {Function} opts.onComplete - stable callback (wrap in useCallback)
 * @param {boolean}  [opts.enabled]  - false → no listener attached
 */
export const useSpotifyCompletion = ({ onComplete, enabled = true }) => {
    const firedRef = useRef(false);
    const onCompleteRef = useRef(onComplete);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

    useEffect(() => {
        if (!enabled) return;
        firedRef.current = false;

        const handler = (event) => {
            // ── Origin guard ──────────────────────────────────────────────
            if (!event.origin.includes('spotify.com')) return;

            let payload;
            try {
                payload = typeof event.data === 'string'
                    ? JSON.parse(event.data)
                    : event.data;
            } catch {
                return;
            }

            if (payload?.type !== 'playback_update') return;

            const { position, duration, isPaused } = payload.payload ?? {};

            // Skip tick events that arrive while paused or before media is ready
            if (!duration || isPaused) return;

            const ratio = position / duration;
            if (ratio >= COMPLETION_THRESHOLD && !firedRef.current) {
                firedRef.current = true;
                onCompleteRef.current?.();
            }
        };

        window.addEventListener('message', handler);
        return () => window.removeEventListener('message', handler);
    }, [enabled]);
};