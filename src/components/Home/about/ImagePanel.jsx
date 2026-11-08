import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Camera, MapPin } from 'lucide-react';
import { BRAND } from '@/components/common/AnimatedBackground';
import Picture from '@/components/Home/shared/Picture';
import { ABOUT_IMAGES, getImage } from '@/components/Home/shared/homeImages';

const SLIDE_INTERVAL = 3200;
const THUMB_COUNT = 5;

const BRACKETS = [
  {
    pos: 'top-[-8px] left-[-8px]',
    bar: 'top-0 left-0 w-full h-[2px]',
    line: 'top-0 left-0 w-[2px] h-full',
  },
  {
    pos: 'top-[-8px] right-[-8px]',
    bar: 'top-0 right-0 w-full h-[2px]',
    line: 'top-0 right-0 w-[2px] h-full',
  },
  {
    pos: 'bottom-[-8px] left-[-8px]',
    bar: 'bottom-0 left-0 w-full h-[2px]',
    line: 'bottom-0 left-0 w-[2px] h-full',
  },
  {
    pos: 'bottom-[-8px] right-[-8px]',
    bar: 'bottom-0 right-0 w-full h-[2px]',
    line: 'bottom-0 right-0 w-[2px] h-full',
  },
];

const fisherYates = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ProgressBar = memo(({ current, duration }) => (
  <div className="absolute left-0 right-0 top-0 z-20 h-[2px] bg-white/10">
    <div
      key={`pb-${current}`}
      className="about-pb-fill h-full"
      style={{ backgroundColor: BRAND, animationDuration: `${duration}ms` }}
    />
  </div>
));
ProgressBar.displayName = 'About.ProgressBar';

const SlideCounter = memo(({ current, total }) => (
  <div className="absolute right-4 top-4 z-20">
    <div
      className="flex items-center gap-1.5 px-2 py-1"
      style={{ backgroundColor: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)' }}
    >
      <Camera className="h-3 w-3 text-white/60" strokeWidth={1.5} />
      <span className="select-none font-mono text-[10px] font-bold tabular-nums tracking-widest text-white/80">
        {String(current + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(total).padStart(2, '0')}
      </span>
    </div>
  </div>
));
SlideCounter.displayName = 'About.SlideCounter';

const LocationBadge = memo(() => (
  <div
    className="absolute bottom-16 left-3 z-20 flex items-center gap-1.5 px-2 py-1"
    style={{ backgroundColor: 'rgba(255,255,255,0.93)' }}
  >
    <MapPin className="h-2.5 w-2.5 shrink-0" style={{ color: BRAND }} strokeWidth={2.5} />
    <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
      Bodija &middot; Ibadan
    </span>
  </div>
));
LocationBadge.displayName = 'About.LocationBadge';

const ThumbnailStrip = memo(({ images, current, onSelect }) => {
  const half = Math.floor(THUMB_COUNT / 2);
  const start = Math.min(Math.max(0, current - half), Math.max(0, images.length - THUMB_COUNT));
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
            key={img.name}
            type="button"
            onClick={() => onSelect(realIdx)}
            aria-label={img.alt}
            aria-current={isActive}
            className="relative flex-1 cursor-pointer overflow-hidden border-0 bg-transparent p-0 transition-all duration-300"
            style={{ height: isActive ? 48 : 32, opacity: isActive ? 1 : 0.5 }}
          >
            <Picture
              name={img.name}
              alt=""
              sizes="120px"
              className="block h-full w-full"
              imgClassName="block h-full w-full object-cover"
            />
            {isActive && (
              <div
                className="pointer-events-none absolute inset-0"
                style={{ boxShadow: `inset 0 0 0 1.5px ${BRAND}` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
});
ThumbnailStrip.displayName = 'About.ThumbnailStrip';

/**
 * Cross-fades between slides using the glitch keyframes in index.css.
 *
 * Those classes carry position:absolute and inset:0, applied to the img itself.
 * A picture element is display:inline and establishes no containing block, so the
 * img still positions against this wrapper rather than against the picture.
 */
const GlitchSlider = memo(({ images, current }) => {
  const [slots, setSlots] = useState({ prev: null, curr: current, key: 0 });

  useEffect(() => {
    setSlots((s) => ({ prev: s.curr, curr: current, key: s.key + 1 }));
  }, [current]);

  return (
    <div className="absolute inset-0">
      {slots.prev !== null && slots.prev !== slots.curr && (
        <Picture
          key={`leave-${slots.key}`}
          name={images[slots.prev].name}
          alt=""
          sizes="(max-width: 1023px) 100vw, 50vw"
          imgClassName="about-img-leaving"
        />
      )}
      <Picture
        key={`enter-${slots.key}`}
        name={images[slots.curr].name}
        sizes="(max-width: 1023px) 100vw, 50vw"
        imgClassName="about-img-entering"
      />
    </div>
  );
});
GlitchSlider.displayName = 'About.GlitchSlider';

const ImagePanel = memo(() => {
  // Order is shuffled once per session, then frozen. Reshuffling on every render
  // would restart the slider whenever the parent updates.
  const images = useMemo(() => fisherYates(ABOUT_IMAGES.map(getImage)), []);
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef(null);

  const advance = useCallback(() => setCurrent((c) => (c + 1) % images.length), [images.length]);

  useEffect(() => {
    intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [advance]);

  const handleSelect = useCallback(
    (idx) => {
      clearInterval(intervalRef.current);
      setCurrent(idx);
      intervalRef.current = setInterval(advance, SLIDE_INTERVAL);
    },
    [advance]
  );

  return (
    <div className="relative pb-6 pr-6">
      {/* Offset background frame */}
      <div
        className="pointer-events-none absolute"
        style={{
          inset: 0,
          bottom: '1.5rem',
          right: '1.5rem',
          transform: 'translate(10px,10px)',
          border: `1.5px solid ${BRAND}`,
          opacity: 0.28,
        }}
      />

      <div className="relative aspect-[4/3] overflow-visible">
        {BRACKETS.map(({ pos, bar, line }) => (
          <div key={pos} className={`pointer-events-none absolute z-30 h-6 w-6 ${pos}`}>
            <span className={`absolute ${bar}`} style={{ backgroundColor: BRAND }} />
            <span className={`absolute ${line}`} style={{ backgroundColor: BRAND }} />
          </div>
        ))}

        <div className="absolute inset-0 overflow-hidden">
          <GlitchSlider images={images} current={current} />
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          <ProgressBar current={current} duration={SLIDE_INTERVAL} />
          <SlideCounter current={current} total={images.length} />
          <LocationBadge />
          <ThumbnailStrip images={images} current={current} onSelect={handleSelect} />
        </div>
      </div>

      <div className="absolute -bottom-2 -right-2 z-30 flex items-stretch bg-white shadow dark:bg-gray-900">
        <div style={{ width: 3, backgroundColor: BRAND }} />
        <div className="px-3 py-2">
          <p className="mb-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
            GCCC
          </p>
        </div>
      </div>
    </div>
  );
});
ImagePanel.displayName = 'About.ImagePanel';

export default ImagePanel;
