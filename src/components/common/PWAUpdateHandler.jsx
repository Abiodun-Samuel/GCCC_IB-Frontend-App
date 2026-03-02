// import { useEffect } from 'react';
// import { useRegisterSW } from 'virtual:pwa-register/react';
// import { Toast } from '@/lib/toastify';

// const PWAUpdateHandler = () => {
//     const {
//         needRefresh: [needRefresh],
//         updateServiceWorker,
//     } = useRegisterSW({
//         onRegisteredSW(swUrl) {
//             // Optionally poll for updates every 60s in production
//             if (import.meta.env.PROD) {
//                 setInterval(async () => {
//                     const resp = await fetch(swUrl, { cache: 'no-store' });
//                     if (resp.status === 200) await resp.text(); // triggers update check
//                 }, 60_000);
//             }
//         },
//     });

//     useEffect(() => {
//         if (!needRefresh) return;
//         Toast.info('New update available — tap to reload.', {
//             autoClose: false,
//             closeOnClick: true,
//             onClick: () => updateServiceWorker(true),
//         });
//     }, [needRefresh, updateServiceWorker]);

//     return null;
// };

// export default PWAUpdateHandler;
import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Toast } from '@/lib/toastify';

// Must match cacheName values in vite.config.js workbox.runtimeCaching
// Add new names here whenever you add a new cache in vite.config.js
// Remove old names here to force-delete them from all devices on next load
const CURRENT_CACHES = [
    'gccc-api-cache',
    'gccc-js-chunks',
    'gccc-css-cache',
    'gccc-images',
    'gccc-svg-cache',
    'gccc-fonts',
];

const deleteOldCaches = async () => {
    try {
        const cacheNames = await caches.keys();
        await Promise.all(
            cacheNames
                .filter((name) => !CURRENT_CACHES.includes(name))
                .map((name) => caches.delete(name))
        );
    } catch {
        // caches API unavailable (HTTP, private browsing on some browsers)
    }
};

const PWAUpdateHandler = () => {
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl) {
            if (import.meta.env.PROD) {
                setInterval(async () => {
                    const resp = await fetch(swUrl, { cache: 'no-store' });
                    if (resp.status === 200) await resp.text();
                }, 60_000);
            }
        },
    });

    // Run once on mount — cleans stale caches from old SW versions
    useEffect(() => {
        if ('caches' in window) {
            deleteOldCaches();
        }
    }, []);

    useEffect(() => {
        if (!needRefresh) return;
        Toast.info('New update available — tap to reload.', {
            autoClose: false,
            closeOnClick: true,
            onClick: () => updateServiceWorker(true),
        });
    }, [needRefresh, updateServiceWorker]);

    return null;
};

export default PWAUpdateHandler;