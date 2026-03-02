// import { memo, useState } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { Download, X, Smartphone } from 'lucide-react';
// import { usePWAInstall } from '@/hooks/usePWAInstall';

// const BRAND = '#0998d5';
// const BRAND_RGB = '9,152,213';

// const PWAInstallBanner = memo(() => {
//     const { isInstallable, promptInstall } = usePWAInstall();
//     const [dismissed, setDismissed] = useState(false);

//     return (
//         <AnimatePresence>
//             {isInstallable && !dismissed && (
//                 <motion.div
//                     initial={{ opacity: 0, y: 80 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0, y: 80 }}
//                     transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
//                     className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center px-4 sm:px-6"
//                 >
//                     <div
//                         className="relative w-full max-w-sm sm:max-w-md flex items-center gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-3.5 rounded-2xl overflow-hidden"
//                         style={{
//                             background: 'rgba(8, 15, 26, 0.82)',
//                             backdropFilter: 'blur(20px)',
//                             WebkitBackdropFilter: 'blur(20px)',
//                             border: `1px solid rgba(${BRAND_RGB}, 0.25)`,
//                             boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(${BRAND_RGB},0.08), 0 4px 24px rgba(${BRAND_RGB},0.15)`,
//                         }}
//                     >
//                         {/* Ambient glow */}
//                         <div
//                             className="absolute inset-0 pointer-events-none"
//                             style={{
//                                 background: `radial-gradient(ellipse 80% 60% at 0% 100%, rgba(${BRAND_RGB},0.10) 0%, transparent 65%)`,
//                             }}
//                         />

//                         {/* Left accent line */}
//                         <div
//                             className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
//                             style={{ background: `linear-gradient(180deg, ${BRAND}, rgba(${BRAND_RGB},0.20))` }}
//                         />

//                         {/* Icon */}
//                         <div
//                             className="relative z-10 shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center"
//                             style={{
//                                 background: `rgba(${BRAND_RGB}, 0.12)`,
//                                 border: `1px solid rgba(${BRAND_RGB}, 0.22)`,
//                             }}
//                         >
//                             <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: BRAND }} />
//                         </div>

//                         {/* Text */}
//                         <div className="relative z-10 flex-1 min-w-0">
//                             <p className="text-[13px] sm:text-sm font-bold text-white leading-tight truncate">
//                                 Install GCCC App
//                             </p>
//                             <p className="text-[10px] sm:text-xs text-white/40 mt-0.5 truncate">
//                                 Faster access · Works offline
//                             </p>
//                         </div>

//                         {/* Actions */}
//                         <div className="relative z-10 flex items-center gap-2 shrink-0">
//                             <button
//                                 onClick={promptInstall}
//                                 className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
//                                 style={{
//                                     background: `linear-gradient(135deg, ${BRAND} 0%, rgba(${BRAND_RGB},0.75) 100%)`,
//                                     boxShadow: `0 2px 14px rgba(${BRAND_RGB},0.35)`,
//                                 }}
//                             >
//                                 <Download className="w-3 h-3" />
//                                 Install
//                             </button>
//                             <button
//                                 onClick={() => setDismissed(true)}
//                                 className="p-1.5 rounded-lg transition-colors hover:bg-white/8"
//                                 style={{ color: 'rgba(255,255,255,0.30)' }}
//                                 aria-label="Dismiss"
//                             >
//                                 <X className="w-3.5 h-3.5" />
//                             </button>
//                         </div>
//                     </div>
//                 </motion.div>
//             )}
//         </AnimatePresence>
//     );
// });

// PWAInstallBanner.displayName = 'PWAInstallBanner';
// export default PWAInstallBanner;
import { memo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, Plus } from 'lucide-react';
import { usePWAInstall } from '@/hooks/usePWAInstall';

const BRAND = '#0998d5';
const BRAND_RGB = '9,152,213';

// ─── iOS step-by-step guide ───────────────────────────────────────────────────
const IOSGuide = memo(() => (
    <div className="flex items-center gap-2 flex-wrap mt-1">
        {[
            { Icon: Share, text: 'Tap Share' },
            { Icon: Plus, text: 'Add to Home Screen' },
        ].map(({ Icon, text }, i) => (
            <div key={i} className="flex items-center gap-1.5">
                {i > 0 && (
                    <span className="text-white/20 text-[10px] select-none">→</span>
                )}
                <div
                    className="flex items-center gap-1 px-2 py-1 rounded-lg"
                    style={{
                        background: `rgba(${BRAND_RGB},0.10)`,
                        border: `1px solid rgba(${BRAND_RGB},0.20)`,
                    }}
                >
                    <Icon className="w-3 h-3 shrink-0" style={{ color: BRAND }} />
                    <span className="text-[10px] text-white/55 whitespace-nowrap">{text}</span>
                </div>
            </div>
        ))}
    </div>
));
IOSGuide.displayName = 'PWAInstallBanner.IOSGuide';

// ─── Banner ───────────────────────────────────────────────────────────────────
const PWAInstallBanner = memo(() => {
    const { isInstallable, isInstalled, isIOSDevice, promptInstall } = usePWAInstall();
    const [dismissed, setDismissed] = useState(false);

    return (
        <AnimatePresence>
            {isInstallable && !isInstalled && !dismissed && (
                <motion.div
                    initial={{ opacity: 0, y: 80 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 80 }}
                    transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                    className="fixed bottom-4 left-0 right-0 z-[9999] flex justify-center px-4 sm:px-6"
                >
                    <div
                        className="relative w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden"
                        style={{
                            background: 'rgba(8, 15, 26, 0.88)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: `1px solid rgba(${BRAND_RGB}, 0.25)`,
                            boxShadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(${BRAND_RGB},0.08), 0 4px 24px rgba(${BRAND_RGB},0.15)`,
                        }}
                    >
                        {/* Ambient glow */}
                        <div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `radial-gradient(ellipse 80% 60% at 0% 100%, rgba(${BRAND_RGB},0.10) 0%, transparent 65%)`,
                            }}
                        />

                        {/* Left accent line */}
                        <div
                            className="absolute left-0 top-3 bottom-3 w-[3px] rounded-full"
                            style={{ background: `linear-gradient(180deg, ${BRAND}, rgba(${BRAND_RGB},0.20))` }}
                        />

                        {/* Content */}
                        <div className="relative z-10 flex items-start gap-3 sm:gap-4 px-4 py-3 sm:px-5 sm:py-3.5">

                            {/* Icon */}
                            <div
                                className="shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mt-0.5"
                                style={{
                                    background: `rgba(${BRAND_RGB}, 0.12)`,
                                    border: `1px solid rgba(${BRAND_RGB}, 0.22)`,
                                }}
                            >
                                <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: BRAND }} />
                            </div>

                            {/* Text + action */}
                            <div className="flex-1 min-w-0">

                                {/* Header row */}
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="text-[13px] sm:text-sm font-bold text-white leading-tight truncate">
                                            Install GCCC App
                                        </p>
                                        <p className="text-[10px] sm:text-xs text-white/40 mt-0.5">
                                            {isIOSDevice
                                                ? 'Add to your home screen in 2 steps'
                                                : 'Faster access · Works offline'}
                                        </p>
                                    </div>

                                    {/* Dismiss */}
                                    <button
                                        onClick={() => setDismissed(true)}
                                        className="shrink-0 p-1.5 rounded-lg transition-colors"
                                        style={{ color: 'rgba(255,255,255,0.28)' }}
                                        aria-label="Dismiss"
                                    >
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>

                                {/* iOS guide OR install button */}
                                {isIOSDevice ? (
                                    <IOSGuide />
                                ) : (
                                    <button
                                        onClick={promptInstall}
                                        className="mt-2 flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-bold text-white transition-all duration-200 hover:opacity-90 active:scale-95"
                                        style={{
                                            background: `linear-gradient(135deg, ${BRAND} 0%, rgba(${BRAND_RGB},0.75) 100%)`,
                                            boxShadow: `0 2px 14px rgba(${BRAND_RGB},0.35)`,
                                        }}
                                    >
                                        <Download className="w-3 h-3" />
                                        Install
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

PWAInstallBanner.displayName = 'PWAInstallBanner';
export default PWAInstallBanner;