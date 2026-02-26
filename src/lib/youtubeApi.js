let _readyPromise = null;

export const loadYouTubeAPI = () => {
    if (_readyPromise) return _readyPromise;

    _readyPromise = new Promise((resolve, reject) => {
        // Already loaded (e.g. HMR / double-render)
        if (window.YT?.Player) {
            resolve(window.YT);
            return;
        }

        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        tag.async = true;
        tag.onerror = () => reject(new Error('Failed to load YouTube IFrame API'));
        document.head.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => resolve(window.YT);
    });

    return _readyPromise;
};