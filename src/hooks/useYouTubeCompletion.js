import { loadYouTubeAPI } from '@/lib/youtubeApi';
import { useEffect, useRef } from 'react';

/**
 * useYouTubeCompletion
 * ─────────────────────────────────────────────
 * Mounts a YouTube IFrame player into `containerRef`
 * and calls `onComplete` exactly once when the video ends.
 *
 * @param {object}   opts
 * @param {string}   opts.videoId      - YouTube video ID
 * @param {React.RefObject} opts.containerRef - ref to the mount <div>
 * @param {Function} opts.onComplete   - stable callback (wrap in useCallback)
 * @param {Function} [opts.onReady]    - fires once the player is ready to play
 * @param {boolean}  [opts.enabled]    - false → noop (skip for unauth users)
 */
export const useYouTubeCompletion = ({ videoId, containerRef, onComplete, onReady, enabled = true }) => {
    // Tracks whether we've already fired for this mount so we never double-award
    const firedRef = useRef(false);
    // Keep latest callbacks without re-running the effect
    const onCompleteRef = useRef(onComplete);
    const onReadyRef = useRef(onReady);
    useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);
    useEffect(() => { onReadyRef.current = onReady; }, [onReady]);

    useEffect(() => {
        if (!enabled || !videoId || !containerRef.current) return;

        let player;
        let destroyed = false;
        firedRef.current = false;

        loadYouTubeAPI()
            .then((YT) => {
                if (destroyed) return; // modal closed before API resolved

                player = new YT.Player(containerRef.current, {
                    videoId,
                    playerVars: { autoplay: 1, rel: 0, modestbranding: 1, playsinline: 1 },
                    events: {
                        onReady: () => {
                            if (!destroyed) onReadyRef.current?.();
                        },
                        onStateChange: ({ data }) => {
                            // Also surface "ready" on first PLAYING state as a fallback
                            // (some embeds fire onReady before the video is truly ready)
                            if (data === YT.PlayerState.PLAYING) {
                                onReadyRef.current?.();
                                onReadyRef.current = null; // only fire once
                            }
                            if (data === YT.PlayerState.ENDED && !firedRef.current) {
                                firedRef.current = true;
                                onCompleteRef.current?.();
                            }
                        },
                        onError: () => {
                            // Surface nothing to UI; mutation already has onError: ()=>{}
                        },
                    },
                });
            })
            .catch(() => {
                // YouTube API failed to load — silently no-op
            });

        return () => {
            destroyed = true;
            setTimeout(() => { player?.destroy(); }, 0);
        };
    }, [videoId, enabled]); // containerRef is stable — intentionally omitted
};