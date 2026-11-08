import { memo } from 'react';
import { CalendarDays, MapPin } from 'lucide-react';
import Picture from '@/components/Home/shared/Picture';
import AddToCalendar from './AddToCalendar';
import { DISPLAY } from './HangoutTheme';
import { HANGOUT, HERO_PHOTOS, VENUE } from './hangoutContent';
import { CONTAINER, PRIMARY_BUTTON } from './hangoutStyles';
import { formatDate, formatTime, scrollToSection } from './hangoutUtils';
import { useCountdown } from './useCountdown';

// Columns start at different heights so the photos read as a collage.
const COLUMN_OFFSETS = ['mt-10 sm:mt-14', 'mt-0', 'mt-16 sm:mt-24'];
const PHOTO_SIZES = '(max-width: 1023px) 31vw, 16vw';

/** The main line first (as the term), its detail under it. */
const Fact = ({ icon: Icon, label, children }) => (
  <div className="flex items-center gap-3.5 px-5 py-4 sm:py-5">
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-(--hg-tint) text-(--hg-brand)">
      <Icon size={20} aria-hidden="true" />
    </span>
    <div className="min-w-0">
      <dt className="text-base font-bold leading-snug text-(--hg-ink)">{children}</dt>
      <dd className="mt-0.5 text-sm text-(--hg-muted)">{label}</dd>
    </div>
  </div>
);

const Countdown = ({ startsAt }) => {
  const countdown = useCountdown(startsAt?.getTime());
  if (!countdown) return null;
  if (countdown.done) return <p className="text-base font-semibold text-(--hg-ink)">The hangout has started. See you there!</p>;

  const parts = [
    [countdown.days, countdown.days === 1 ? 'day' : 'days'],
    [countdown.hours, countdown.hours === 1 ? 'hour' : 'hours'],
    [countdown.minutes, 'min'],
  ];
  return (
    <p className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-(--hg-muted)">
      <span className="text-sm">Starts in</span>
      {parts.map(([value, label]) => (
        <span key={label} className="whitespace-nowrap">
          <span className={`${DISPLAY} text-3xl font-extrabold tabular-nums text-(--hg-ink)`}>{value}</span>
          <span className="ml-1 text-sm">{label}</span>
        </span>
      ))}
    </p>
  );
};

const GamesNote = ({ games }) => (
  <div className="hidden rounded-2xl bg-(--hg-bg) p-4 sm:block">
    <div className="flex -space-x-2" aria-hidden="true">
      {games.slice(0, 4).map(({ name, icon: Icon }) => (
        <span key={name} className="flex h-9 w-9 items-center justify-center rounded-full bg-(--hg-tint) text-(--hg-brand) ring-2 ring-(--hg-bg)">
          <Icon size={16} />
        </span>
      ))}
    </div>
    <p className={`${DISPLAY} mt-3 text-xl font-extrabold leading-tight text-(--hg-ink)`}>{games.length} games</p>
    <p className="text-sm text-(--hg-muted)">Pick the one you’ll play</p>
  </div>
);

/**
 * `open` is null until the API says whether registration is open, so the
 * page never promises registration it can't take.
 */
const HangoutHero = ({ startsAt, open, games }) => (
  <section aria-labelledby="hangout-title" className="relative overflow-hidden bg-(--hg-surface)">
    <div aria-hidden="true" className="pointer-events-none absolute -right-48 -top-48 hidden h-176 w-176 rounded-full bg-(--hg-tint) opacity-60 blur-3xl lg:block" />

    <div className={`${CONTAINER} relative grid items-center gap-14 pb-20 pt-10 sm:pt-14 lg:grid-cols-2 lg:gap-14 lg:pb-28 lg:pt-14`}>
      <div>
        {open !== null && (
          <p className="inline-flex items-center gap-2 rounded-full bg-(--hg-tint) px-3.5 py-1.5 text-sm font-semibold text-(--hg-brand)">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              {open && <span className="absolute inset-0 animate-ping rounded-full bg-(--hg-brand) opacity-60 motion-reduce:animate-none" />}
              <span className={`relative h-2 w-2 rounded-full ${open ? 'bg-(--hg-brand)' : 'bg-(--hg-muted)'}`} />
            </span>
            {open ? 'Registration is open' : 'Registration closed'}
          </p>
        )}

        <h1 id="hangout-title" className={`${DISPLAY} mt-6 text-[clamp(3.5rem,11vw,7.25rem)] font-extrabold leading-[0.86] text-(--hg-ink)`}>
          <span className="block">GCCC IB</span>
          <span className="block">Hangout</span>
          <span className="block">2026</span>
        </h1>
        <p className="mt-7 max-w-lg text-lg leading-relaxed text-(--hg-muted) sm:text-xl">{HANGOUT.intro}</p>

        <dl className="mt-9 grid divide-y divide-(--hg-surface) rounded-3xl bg-(--hg-bg) sm:grid-cols-[1.15fr_1fr] sm:divide-x sm:divide-y-0">
          <Fact icon={CalendarDays} label={formatTime(startsAt)}>{formatDate(startsAt)}</Fact>
          <Fact icon={MapPin} label={VENUE.area}>{VENUE.name}</Fact>
        </dl>

        <div className="mt-9 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => scrollToSection('games')} className={`${PRIMARY_BUTTON} px-7`}>
            {open === false ? 'See the games' : 'Pick your game'}
          </button>
          <AddToCalendar startsAt={startsAt} compact />
        </div>

        <div className="mt-9">
          <Countdown startsAt={startsAt} />
        </div>
      </div>

      {/* Each photo keeps its own shape; only the column starts are staggered. */}
      <div className="relative flex items-start gap-2.5 sm:gap-4">
        {HERO_PHOTOS.map((column, i) => (
          <div key={column[0]} className={`flex flex-1 flex-col gap-2.5 sm:gap-4 ${COLUMN_OFFSETS[i]}`}>
            {column.map((name) => (
              <div key={name} className="overflow-hidden rounded-2xl bg-(--hg-line) sm:rounded-[1.75rem]">
                <Picture name={name} sizes={PHOTO_SIZES} priority={name === HERO_PHOTOS[1][0]} className="block" imgClassName="block h-auto w-full" />
              </div>
            ))}
            {i === HERO_PHOTOS.length - 1 && <GamesNote games={games} />}
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default memo(HangoutHero);
