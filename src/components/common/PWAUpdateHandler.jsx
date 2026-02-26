import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { Toast } from '@/lib/toastify';

const PWAUpdateHandler = () => {
    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegisteredSW(swUrl) {
            // Optionally poll for updates every 60s in production
            if (import.meta.env.PROD) {
                setInterval(async () => {
                    const resp = await fetch(swUrl, { cache: 'no-store' });
                    if (resp.status === 200) await resp.text(); // triggers update check
                }, 60_000);
            }
        },
    });

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