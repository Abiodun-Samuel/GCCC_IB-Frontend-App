import { memo, useCallback, useState } from 'react';
import { Check, Flame, Images, RefreshCw } from 'lucide-react';
import GameModal from './GameModal';
import HangoutPhoto from './HangoutPhoto';
import { CONTAINER, SECTION, SECTION_INTRO, SECTION_TITLE } from './hangoutStyles';
import { DISPLAY } from './HangoutTheme';
import { mostPicked } from './hangoutUtils';

const PHOTO_SIZES = '(max-width: 1023px) 46vw, 19vw';

const countLabel = (count) => (count === 1 ? '1 going' : `${count.toLocaleString('en-GB')} going`);

/** The round marker on each photo: empty to show it can be picked, ticked once it is. */
const PickMarker = ({ selected, selectable }) => {
  if (!selected && !selectable) return null;
  return (
    <span
      aria-hidden="true"
      className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-sm transition
        ${selected ? 'bg-(--hg-brand) text-white' : 'bg-white/85 text-transparent ring-2 ring-inset ring-white backdrop-blur-sm'}`}
    >
      <Check size={17} strokeWidth={3} />
    </span>
  );
};

/**
 * One game: the photo and name are the radio for picking it (when
 * `selectable`), and "Photos & video" opens its window.
 */
const GameCard = ({ game, selected, selectable, locked, isTop, onSelect, onOpen }) => {
  const Icon = game.icon;
  const inputId = `game-${game.slug}`;
  const status = selected ? (locked ? 'Your game' : 'Picked') : game.count > 0 ? countLabel(game.count) : null;

  const body = (
    <>
      <span
        className={`relative block overflow-hidden rounded-2xl bg-(--hg-line) ring-offset-[3px] ring-offset-(--hg-surface) transition-shadow
          ${selected ? 'ring-[3px] ring-(--hg-brand)' : ''}`}
      >
        <HangoutPhoto photo={game.cover} Icon={Icon} sizes={PHOTO_SIZES} decorative />
        <PickMarker selected={selected} selectable={selectable} />
        {isTop && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-[#062c4f]">
            <Flame size={13} className="text-orange-500" aria-hidden="true" />
            Most picked
          </span>
        )}
      </span>
      <span className="mt-3.5 block">
        <span className="block text-base font-bold leading-snug text-(--hg-ink) sm:text-lg">{game.name}</span>
        {game.tagline && <span className="mt-1 hidden text-sm leading-snug text-(--hg-muted) sm:block">{game.tagline}</span>}
        {status && <span className="mt-1.5 block text-sm font-semibold text-(--hg-brand)">{status}</span>}
      </span>
    </>
  );

  return (
    <li className="flex flex-col">
      {selectable ? (
        <label
          htmlFor={inputId}
          className="block cursor-pointer rounded-2xl has-[input:focus-visible]:outline-none has-[input:focus-visible]:ring-4 has-[input:focus-visible]:ring-(--hg-brand)/40"
        >
          <input
            id={inputId}
            type="radio"
            name="game"
            value={game.name}
            checked={selected}
            onChange={() => onSelect(game.name)}
            className="sr-only"
          />
          {body}
        </label>
      ) : (
        <div>{body}</div>
      )}
      <button
        type="button"
        onClick={(event) => onOpen({ game, opener: event.currentTarget })}
        aria-label={`More about ${game.name}: photos and video`}
        className="mt-2.5 inline-flex w-fit items-center gap-1.5 rounded-full py-1 text-sm font-semibold text-(--hg-brand) underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40"
      >
        <Images size={15} aria-hidden="true" />
        Photos &amp; video
      </button>
    </li>
  );
};

/**
 * The games, which are also where you pick yours. `mode`:
 *   pick    – registration is open: the cards are a radio group
 *   locked  – registered: shows the member's game, nothing to pick
 *   view    – loading, failed or closed: just the games
 */
const GamesSection = ({ games, mode, selected, error, onSelect, onRetry, loadFailed }) => {
  // { game, opener } while a game window is open.
  const [opened, setOpened] = useState(null);
  const top = mostPicked(games);
  const selectable = mode === 'pick';

  const pickFromModal = useCallback((name) => {
    onSelect(name);
    setOpened(null);
  }, [onSelect]);

  return (
    <section id="games" className={`${SECTION} bg-(--hg-surface)`} aria-labelledby="games-title">
      <div className={CONTAINER}>
        <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="games-title" className={SECTION_TITLE}>
              {selectable ? 'Pick your game' : `${games.length} games at Agodi`}
            </h2>
            <p className={SECTION_INTRO}>
              {selectable
                ? 'You play one game on the day, so choose the one you’d enjoy most. Tap a game to pick it, or open it for photos, a video and tips.'
                : 'Open any game for photos, a video and tips.'}
            </p>
          </div>
          {selectable && selected && (
            <p className="inline-flex items-center gap-2.5 self-start rounded-full bg-(--hg-tint) py-2 pl-2 pr-4 lg:self-auto" aria-live="polite">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-(--hg-brand) text-white">
                <Check size={15} strokeWidth={3} aria-hidden="true" />
              </span>
              <span className={`${DISPLAY} text-lg font-extrabold text-(--hg-ink)`}>You picked {selected}</span>
            </p>
          )}
        </header>

        {loadFailed && (
          <div className="mt-8 flex flex-col items-start gap-3 rounded-2xl bg-(--hg-tint) p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-base text-(--hg-ink)">Registration couldn’t load. Check your connection and try again.</p>
            <button type="button" onClick={onRetry} className="inline-flex items-center gap-2 rounded-full bg-(--hg-action) px-5 py-2.5 text-sm font-bold text-(--hg-on-action) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40">
              <RefreshCw size={15} aria-hidden="true" />
              Try again
            </button>
          </div>
        )}

        {error && (
          <p id="game-error" role="alert" className="mt-8 rounded-2xl bg-red-50 px-5 py-4 text-base font-semibold text-red-700 dark:bg-red-950/40 dark:text-red-300">
            {error}
          </p>
        )}

        <div role={selectable ? 'radiogroup' : undefined} aria-labelledby={selectable ? 'games-title' : undefined} aria-describedby={error ? 'game-error' : undefined}>
          <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-5">
            {games.map((game) => (
              <GameCard
                key={game.name}
                game={game}
                selected={selected === game.name}
                selectable={selectable}
                locked={mode === 'locked'}
                isTop={top === game.name}
                onSelect={onSelect}
                onOpen={setOpened}
              />
            ))}
          </ul>
        </div>
      </div>

      {opened && (
        <GameModal
          game={opened.game}
          picked={selected === opened.game.name}
          canPick={selectable}
          onPick={pickFromModal}
          onClose={() => setOpened(null)}
          returnFocusTo={opened.opener}
        />
      )}
    </section>
  );
};

export default memo(GamesSection);
