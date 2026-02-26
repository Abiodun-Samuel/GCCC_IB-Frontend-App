import { useState, useEffect } from 'react';

let cachedPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    cachedPrompt = e;
});

export const usePWAInstall = () => {
    const [isInstallable, setIsInstallable] = useState(!!cachedPrompt);
    const [isInstalled, setIsInstalled] = useState(
        () => window.matchMedia('(display-mode: standalone)').matches
    );

    useEffect(() => {
        if (isInstalled) return;

        if (cachedPrompt) {
            setIsInstallable(true);
        }

        const onPrompt = (e) => {
            e.preventDefault();
            cachedPrompt = e;
            setIsInstallable(true);
        };

        const onInstalled = () => {
            cachedPrompt = null;
            setIsInstalled(true);
            setIsInstallable(false);
        };

        window.addEventListener('beforeinstallprompt', onPrompt);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            window.removeEventListener('beforeinstallprompt', onPrompt);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, [isInstalled]);

    const promptInstall = async () => {
        if (!cachedPrompt) return;
        await cachedPrompt.prompt();
        const { outcome } = await cachedPrompt.userChoice;
        if (outcome === 'accepted') setIsInstalled(true);
        cachedPrompt = null;
        setIsInstallable(false);
    };

    return { isInstallable, isInstalled, promptInstall };
};