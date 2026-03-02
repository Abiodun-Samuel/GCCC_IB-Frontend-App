import { useState, useEffect } from 'react';

let cachedPrompt = null;

// Capture as early as possible — before React boots
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    cachedPrompt = e;
});

// iOS detection — covers iPhone, iPad (including iPadOS 13+)
const isIOS = () =>
    /iphone|ipad|ipod/i.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

// Standalone detection — works for both Android and iOS
const isInStandaloneMode = () =>
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

export const usePWAInstall = () => {
    const [isInstallable, setIsInstallable] = useState(!!cachedPrompt);
    const [isInstalled, setIsInstalled] = useState(isInStandaloneMode);
    const [isIOSDevice, setIsIOSDevice] = useState(false);

    useEffect(() => {
        // Already installed — nothing to do
        if (isInStandaloneMode()) {
            setIsInstalled(true);
            return;
        }

        // iOS never fires beforeinstallprompt — show manual guide instead
        if (isIOS()) {
            setIsIOSDevice(true);
            setIsInstallable(true);
            return;
        }

        // Android/Chrome — use cached prompt if already fired
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

    return { isInstallable, isInstalled, isIOSDevice, promptInstall };
};