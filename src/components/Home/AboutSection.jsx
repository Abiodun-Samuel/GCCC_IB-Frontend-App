import { useRef, memo, useState, useEffect, useMemo, useCallback } from 'react';
import { Heart, Users, Crown, MapPin, Camera } from 'lucide-react';
import { SECTION_SPACING } from '@/utils/constant';

// ─── Constants ────────────────────────────────────────────────────────────────

const C = {
    primary: '#119bd6',
    primaryDim: 'rgba(17,155,214,0.12)',
    primaryBorder: 'rgba(17,155,214,0.22)',
    primaryGhost: 'rgba(17,155,214,0.055)',
    primaryStroke: 'rgba(17,155,214,0.07)',
};

const SLIDE_INTERVAL = 3200; // ms
const THUMB_COUNT = 5;

const VALUES = [
    {
        id: 'love',
        icon: Heart,
        title: 'Love',
        body: "Extending Christ's love to every person, no conditions.",
        isDefault: false,
    },
    {
        id: 'family',
        icon: Users,
        title: 'Family',
        body: 'Close-knit believers carrying one another through every season.',
        isDefault: true,
    },
    {
        id: 'kingdom',
        icon: Crown,
        title: 'Kingdom',
        body: 'Kingdom culture practiced in every space we occupy.',
        isDefault: false,
    },
];

const ABOUT_IMAGES = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    src: `/images/home/about/about${i + 1}.jpg`,
    alt: `GCCC Ibadan Community — photo ${i + 1}`,
}));

// ─── Utilities ────────────────────────────────────────────────────────────────

const fisherYates = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// ─── CSS (injected once) ──────────────────────────────────────────────────────

const STYLES = `
/* ── Glitch transition ──────────────────────────────────────────────────── */
@keyframes glitch-in {
  0%   { clip-path: inset(0 0 100% 0); opacity: 0; transform: translateX(-3px); filter: brightness(1.6) saturate(0); }
  8%   { clip-path: inset(0 0 70% 0);  opacity: 1; transform: translateX(4px);  filter: brightness(1.4) saturate(0.3) hue-rotate(30deg); }
  16%  { clip-path: inset(30% 0 40% 0); transform: translateX(-2px); filter: brightness(1.2) saturate(0.6); }
  24%  { clip-path: inset(60% 0 10% 0); transform: translateX(3px); }
  32%  { clip-path: inset(80% 0 0% 0);  transform: translateX(-1px); filter: brightness(1.05); }
  40%  { clip-path: inset(90% 0 0 0);   transform: translateX(0); filter: none; }
  50%  { clip-path: inset(0 0 0 0);     transform: translateX(0); filter: none; }
  /* micro-glitches after settle */
  52%  { clip-path: inset(0 0 0 0); transform: translateX(2px); filter: hue-rotate(10deg); }
  54%  { clip-path: inset(0 0 0 0); transform: translateX(0);   filter: none; }
  100% { clip-path: inset(0 0 0 0); transform: translateX(0);   filter: none; opacity: 1; }
}

@keyframes glitch-out {
  0%   { opacity: 1; transform: translateX(0); filter: none; }
  30%  { opacity: 1; transform: translateX(-3px); filter: brightness(1.3) hue-rotate(-15deg); }
  60%  { opacity: 0.6; transform: translateX(4px); }
  100% { opacity: 0; transform: translateX(0); }
}

@keyframes chromo-shift {
  0%   { text-shadow: 2px 0 #eb2225, -2px 0 #119bd6; }
  33%  { text-shadow: -3px 0 #eb2225, 3px 0 #119bd6; }
  66%  { text-shadow: 2px 0 #119bd6, -2px 0 #eb2225; }
  100% { text-shadow: 0 0 transparent; }
}

/* ── Image slots ────────────────────────────────────────────────────────── */
.img-slot {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.img-slot--entering {
  animation: glitch-in 0.72s cubic-bezier(0.16,1,0.3,1) forwards;
  z-index: 2;
}

.img-slot--leaving {
  animation: glitch-out 0.45s ease-in forwards;
  z-index: 1;
}

.img-slot--idle {
  opacity: 1;
  z-index: 0;
}

/* ── Progress bar ───────────────────────────────────────────────────────── */
@keyframes pb-fill {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
.progress-bar-fill {
  transform-origin: left;
  animation: pb-fill linear forwards;
}

/* ── Thumbnail strip ────────────────────────────────────────────────────── */
.thumb-btn {
  flex: 1;
  overflow: hidden;
  transition: height 0.3s ease, opacity 0.3s ease;
  cursor: pointer;
}
.thumb-btn img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ── Value card hover ───────────────────────────────────────────────────── */
.value-card {
  transition: transform 0.3s cubic-bezier(0.22,1,0.36,1),
              background-color 0.3s ease,
              box-shadow 0.3s ease;
}
.value-card:hover { transform: translateY(-4px); }

/* ── Corner brackets ────────────────────────────────────────────────────── */
.bracket {
  position: absolute;
  width: 24px;
  height: 24px;
  z-index: 30;
  pointer-events: none;
}
.bracket::before, .bracket::after {
  content: '';
  position: absolute;
  background-color: #119bd6;
}
.bracket::before { width: 100%; height: 2px; }
.bracket::after  { width: 2px;  height: 100%; }

.bracket--tl { top: -8px; left: -8px; }
.bracket--tl::before { top: 0; left: 0; }
.bracket--tl::after  { top: 0; left: 0; }

.bracket--tr { top: -8px; right: -8px; }
.bracket--tr::before { top: 0; right: 0; }
.bracket--tr::after  { top: 0; right: 0; }

.bracket--bl { bottom: -8px; left: -8px; }
.bracket--bl::before { bottom: 0; left: 0; }
.bracket--bl::after  { bottom: 0; left: 0; }

.bracket--br { bottom: -8px; right: -8px; }
.bracket--br::before { bottom: 0; right: 0; }
.bracket--br::after  { bottom: 0; right: 0; }

/* ── AOS overrides (make sure duration matches) ────────────────────────── */
[data-aos] { pointer-events: none; }
[data-aos].aos-animate { pointer-events: auto; }
`;

// Inject styles once
let stylesInjected = false;
const injectStyles = () => {
    if (stylesInjected) return;
    const el = document.createElement('style');
    el.textContent = STYLES;
    document.head.appendChild(el);
    stylesInjected = true;
};

// ─── SectionLabel ─────────────────────────────────────────────────────────────

const SectionLabel = memo(() => (
    <div className="flex items-center gap-3 mb-10 sm:mb-12" data-aos="fade-up" data-aos-delay="0">
        <div
            className="h-px w-8"
            style={{ backgroundColor: C.primary }}
        />
        <span
            className="text-[11px] font-bold tracking-[0.25em] uppercase select-none"
            style={{ color: C.primary }}
        >
            Who We Are
        </span>
    </div>
));
SectionLabel.displayName = 'About.SectionLabel';

// ─── ProgressBar ─────────────────────────────────────────────────────────────

const ProgressBar = memo(({ current, duration }) => (
    <div className="absolute top-0 left-0 right-0 z-20 h-[2px] bg-white/10">
        <div
            key={`pb-${current}`}
            className="progress-bar-fill h-full"
            style={{
                backgroundColor: C.primary,
                animationDuration: `${duration}ms`,
            }}
        />
    </div>
));
ProgressBar.displayName = 'About.ProgressBar';

// ─── ThumbnailStrip ───────────────────────────────────────────────────────────

const ThumbnailStrip = memo(({ images, current, onSelect }) => {
    const half = Math.floor(THUMB_COUNT / 2);
    const start = Math.min(
        Math.max(0, current - half),
        Math.max(0, images.length - THUMB_COUNT),
    );
    const slice = images.slice(start, start + THUMB_COUNT);

    return (
        <div
            className="absolute bottom-0 left-0 right-0 z-20 flex gap-1 px-2 pb-2 pt-6"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.68) 0%, transparent 100%)' }}
        >
            {slice.map((img) => {
                const realIdx = images.indexOf(img);
                const isActive = realIdx === current;
                return (
                    <button
                        key={img.id}
                        onClick={() => onSelect(realIdx)}
                        aria-label={img.alt}
                        className="thumb-btn relative border-0 p-0 bg-transparent"
                        style={{ height: isActive ? 48 : 32, opacity: isActive ? 1 : 0.5 }}
                    >
                        <img src={img.src} alt={img.alt} loading="lazy" decoding="async" />
                        {isActive && (
                            <div
                                className="absolute inset-0 pointer-events-none"
                                style={{ boxShadow: `inset 0 0 0 1.5px ${C.primary}` }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
});
ThumbnailStrip.displayName = 'About.ThumbnailStrip';

// ─── SlideCounter ────────────────────────────────────────────────────────────

const SlideCounter = memo(({ current, total }) => (
    <div className="absolute top-4 right-4 z-20">
        <div
            className="flex items-center gap-1.5 px-2 py-1"
            style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
        >
            <Camera className="w-3 h-3 text-white/60" strokeWidth={1.5} />
            <span className="text-[10px] font-bold tracking-widest text-white/80 tabular-nums select-none font-mono">
                {String(current + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
            </span>
        </div>
    </div>
));
SlideCounter.displayName = 'About.SlideCounter';

// ─── LocationBadge ───────────────────────────────────────────────────────────

const LocationBadge = memo(() => (
    <div
        className="absolute bottom-16 left-3 z-20 flex items-center gap-1.5 px-2 py-1"
        style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
    >
        <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: C.primary }} strokeWidth={2.5} />
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-gray-700">
            Bodija · Ibadan
        </span>
    </div>
));
LocationBadge.displayName = 'About.LocationBadge';

// ─── GlitchSlider ─────────────────────────────────────────────────────────────
// Maintains prev + current slot; CSS animations handle the glitch transition.

const GlitchSlider = memo(({ images, current }) => {
    const [slots, setSlots] = useState({
        prev: null,
        curr: current,
        key: 0,
    });

    useEffect(() => {
        setSlots((s) => ({
            prev: s.curr,
            curr: current,
            key: s.key + 1,
        }));
    }, [current]);

    return (
        <div className="absolute inset-0">
            {/* Leaving slot */}
            {slots.prev !== null && slots.prev !== slots.curr && (
                <img
                    key={`leave-${slots.key}`}
                    src={images[slots.prev].src}
                    alt={images[slots.prev].alt}
                    className="img-slot img-slot--leaving"
                    decoding="async"
                />
            )}

            {/* Entering slot */}
            <img
                key={`enter-${slots.key}`}
                src={images[slots.curr].src}
                alt={images[slots.curr].alt}
                className="img-slot img-slot--entering"
                loading={slots.curr === 0 ? 'eager' : 'lazy'}
                decoding="async"
            />
        </div>
    );
});
GlitchSlider.displayName = 'About.GlitchSlider';

// ─── ImagePanel ───────────────────────────────────────────────────────────────

const ImagePanel = memo(() => {
    const images = useMemo(() => fisherYates(ABOUT_IMAGES), []);
    const [current, setCurrent] = useState(0);
    const intervalRef = useRef(null);

    const advance = useCallback(() => {
        setCurrent((c) => (c + 1) % images.length);
    }, [images.length]);

    // Prefetch next image
    const prefetchNext = useCallback(
        (idx) => {
            const next = images[(idx + 1) % images.length];
            const link = Object.assign(document.createElement('link'), {
                rel: 'prefetch',
                as: 'image',
                href: next.src,
            });
            document.head.appendChild(link);
            return link;
        },
        [images],
    );

    useEffect(() => {
        intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
        return () => clearInterval(intervalRef.current);
    }, [advance]);

    useEffect(() => {
        const link = prefetchNext(current);
        return () => link.remove();
    }, [current, prefetchNext]);

    const handleSelect = useCallback(
        (idx) => {
            clearInterval(intervalRef.current);
            setCurrent(idx);
            intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
        },
        [advance],
    );

    return (
        <div
            className="relative pb-6 pr-6"
            data-aos="fade-right"
            data-aos-delay="100"
            data-aos-duration="900"
        >
            {/* Offset background frame */}
            <div
                className="absolute pointer-events-none"
                style={{
                    inset: 0,
                    bottom: '1.5rem',
                    right: '1.5rem',
                    transform: 'translate(10px,10px)',
                    border: `1.5px solid ${C.primary}`,
                    opacity: 0.28,
                }}
            />

            {/* Image frame */}
            <div className="relative aspect-[4/3] overflow-visible">
                {/* Corner brackets */}
                <div className="bracket bracket--tl" />
                <div className="bracket bracket--tr" />
                <div className="bracket bracket--bl" />
                <div className="bracket bracket--br" />

                {/* Clipped slide area */}
                <div className="absolute inset-0 overflow-hidden">
                    <GlitchSlider images={images} current={current} />

                    {/* Scrim */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent pointer-events-none z-10" />

                    <ProgressBar current={current} duration={SLIDE_INTERVAL} />
                    <SlideCounter current={current} total={images.length} />
                    <LocationBadge />
                    <ThumbnailStrip images={images} current={current} onSelect={handleSelect} />
                </div>
            </div>

            {/* Float accent badge */}
            <div
                className="absolute -bottom-2 -right-2 z-30 bg-white shadow dark:bg-gray-900 flex items-stretch"
                data-aos="fade-left"
                data-aos-delay="500"
                data-aos-duration="700"
            >
                <div style={{ width: 3, backgroundColor: C.primary }} />
                <div className="px-3 py-2">
                    <p className="text-[10px] font-black tracking-[0.2em] uppercase text-gray-400 dark:text-gray-500 mb-0.5">
                        GCCC
                    </p>
                </div>
            </div>
        </div>
    );
});
ImagePanel.displayName = 'About.ImagePanel';

// ─── GhostWatermark ───────────────────────────────────────────────────────────

const GhostWatermark = memo(() => (
    <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute bottom-16 left-0 right-0 overflow-hidden"
    >
        <svg
            viewBox="0 0 800 160"
            preserveAspectRatio="xMidYMid meet"
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
        >
            <text
                x="50%" y="88%"
                textAnchor="middle"
                dominantBaseline="auto"
                fontFamily="'Arial Black','Impact',sans-serif"
                fontWeight="900"
                fontSize="170"
                letterSpacing="-4"
                fill={C.primaryGhost}
                stroke={C.primaryStroke}
                strokeWidth="0.4"
            >
                GCCC IB
            </text>
        </svg>
    </div>
));
GhostWatermark.displayName = 'About.GhostWatermark';

// ─── TextPanel ────────────────────────────────────────────────────────────────

const TextPanel = memo(() => (
    <div className="relative overflow-hidden">
        <GhostWatermark />

        <div className="relative z-10 flex flex-col gap-6">
            <h2
                className="text-3xl sm:text-4xl lg:text-[2.75rem] font-black leading-tight tracking-tight text-gray-900 dark:text-white"
                style={{ fontFamily: "'Georgia', serif" }}
                data-aos="fade-left"
                data-aos-delay="150"
                data-aos-duration="800"
            >
                Where{' '}
                <span style={{ color: C.primary }}>Love</span>,{' '}
                <span style={{ color: C.primary }}>Family</span>{' '}
                &amp;{' '}
                <span style={{ color: C.primary }}>Kingdom</span>{' '}
                converge.
            </h2>

            <p
                className="text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="250"
                data-aos-duration="700"
            >
                GCCC Ibadan is a growing community of close knit believers, extending
                the frontiers of the Kingdom on every side.
            </p>

            <p
                className="text-base text-gray-600 dark:text-gray-400 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="340"
                data-aos-duration="700"
            >
                We do the Word, yield to the Spirit and practice the Culture of God's
                Kingdom, with a deep desire to regularly experience and manifest the
                Glory of God.
            </p>

            <div
                className="pl-4"
                style={{ borderLeft: `2px solid ${C.primary}` }}
                data-aos="fade-up"
                data-aos-delay="430"
                data-aos-duration="700"
            >
                <p
                    className="text-lg font-bold text-gray-900 dark:text-white"
                    style={{ fontFamily: "'Georgia', serif" }}
                >
                    The plan is to take our generation for Jesus.
                </p>
            </div>
        </div>
    </div>
));
TextPanel.displayName = 'About.TextPanel';

// ─── ValueCard ────────────────────────────────────────────────────────────────

const ValueCard = memo(({ icon: Icon, title, body, isDefault, index }) => {
    const [hovered, setHovered] = useState(false);
    const active = isDefault || hovered;

    return (
        <div
            className="value-card relative flex flex-col gap-5 p-6 cursor-default overflow-hidden shadow
                 bg-gray-50 dark:bg-gray-900/70"
            style={active ? { backgroundColor: C.primary } : undefined}
            onMouseEnter={() => !isDefault && setHovered(true)}
            onMouseLeave={() => !isDefault && setHovered(false)}
            data-aos="fade-up"
            data-aos-delay={index * 100 + 100}
            data-aos-duration="700"
        >
            {/* Icon row */}
            <div className="flex items-center justify-between">
                <div
                    className="w-10 h-10 flex items-center justify-center transition-colors duration-300"
                    style={{ backgroundColor: active ? 'rgba(255,255,255,0.18)' : C.primaryDim }}
                >
                    <Icon
                        className="w-5 h-5 transition-colors duration-300"
                        style={{ color: active ? '#fff' : C.primary }}
                        strokeWidth={1.8}
                    />
                </div>
                <span
                    className="text-[11px] font-black tracking-widest tabular-nums select-none transition-colors duration-300"
                    style={{ color: active ? 'rgba(255,255,255,0.30)' : 'rgba(17,155,214,0.28)' }}
                >
                    0{index + 1}
                </span>
            </div>

            {/* Copy */}
            <div className="flex flex-col gap-1.5">
                <h4
                    className="text-base font-bold leading-snug transition-colors duration-300"
                    style={{ color: active ? '#fff' : undefined }}
                >
                    <span className={active ? '' : 'text-gray-900 dark:text-white'}>{title}</span>
                </h4>
                <p
                    className="text-sm leading-relaxed transition-colors duration-300"
                    style={{ color: active ? 'rgba(255,255,255,0.72)' : undefined }}
                >
                    <span className={active ? '' : 'text-gray-500 dark:text-gray-400'}>{body}</span>
                </p>
            </div>

            {/* Bottom accent bar */}
            <div
                className="mt-auto h-[2px] origin-left"
                style={{
                    backgroundColor: active ? 'rgba(255,255,255,0.32)' : C.primary,
                    opacity: active ? 1 : 0.2,
                    transform: active ? 'scaleX(1)' : 'scaleX(0.2)',
                    transition: 'all 0.5s ease',
                }}
            />
        </div>
    );
});
ValueCard.displayName = 'About.ValueCard';

// ─── ValuesGrid ───────────────────────────────────────────────────────────────

const ValuesGrid = memo(() => (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {VALUES.map((v, i) => (
            <ValueCard key={v.id} {...v} index={i} />
        ))}
    </div>
));
ValuesGrid.displayName = 'About.ValuesGrid';

// ─── Root ─────────────────────────────────────────────────────────────────────

const AboutSection = () => {
    useEffect(() => {
        injectStyles();
    }, []);

    return (
        <section
            id="about"
            className={`relative w-full bg-white dark:bg-gray-950 overflow-hidden ${SECTION_SPACING}`}
        >

            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
                <SectionLabel />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center mb-14 sm:mb-16">
                    <ImagePanel />
                    <TextPanel />
                </div>

                <ValuesGrid />
            </div>
        </section>
    );
};

export default memo(AboutSection);