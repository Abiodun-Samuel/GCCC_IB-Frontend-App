import { memo } from 'react';
import PhotoCredit from './PhotoCredit';
import { AGODI, FOOD_AND_DRINKS, PARK_FEATURES } from './hangoutContent';
import { HANGOUT_GAMES } from './hangoutGames';
import { CONTAINER } from './hangoutStyles';
import { youtubeWatchUrl } from './hangoutUtils';

// Every Creative Commons photo needs its credit; Pexels photos don't, but say where they're from.
const photos = [
  ...HANGOUT_GAMES.flatMap((game) => [game.cover, ...game.photos].filter(Boolean)),
  AGODI.photo,
  ...[...FOOD_AND_DRINKS, ...PARK_FEATURES].map((item) => item.photo),
];
const credited = photos.filter((photo) => photo.credit?.author);
const videos = [...HANGOUT_GAMES.map((game) => game.video), AGODI.video].filter(Boolean);

const HangoutCredits = () => (
  <footer className="border-t border-(--hg-line) bg-(--hg-surface) py-8">
    <div className={CONTAINER}>
      <details className="text-sm text-(--hg-muted)">
        <summary className="cursor-pointer font-semibold text-(--hg-ink) focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-(--hg-brand)/40">
          Photo and video credits
        </summary>
        <p className="mt-3">Game and park photos without a credit below are from Pexels.</p>
        <ul className="mt-3 grid gap-1.5 sm:grid-cols-2">
          {credited.map((photo) => (
            <li key={photo.path}>
              {photo.alt}. <PhotoCredit credit={photo.credit} />
            </li>
          ))}
        </ul>
        <p className="mt-4 font-semibold text-(--hg-ink)">Videos (YouTube)</p>
        <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
          {videos.map((video) => (
            <li key={video.id}>
              <a href={youtubeWatchUrl(video.id)} target="_blank" rel="noopener noreferrer" className="underline-offset-2 hover:underline">
                {video.title}
              </a>
              {' '}by {video.channel}
            </li>
          ))}
        </ul>
      </details>
    </div>
  </footer>
);

export default memo(HangoutCredits);
