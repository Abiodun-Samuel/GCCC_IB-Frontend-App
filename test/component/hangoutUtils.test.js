import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { Sparkles } from 'lucide-react';
import {
  directionsUrl, firstName, formatDate, formatNaira, formatTicketDate, formatTime, getCountdown, googleCalendarUrl,
  icsFile, inviteMessage, lockPageScroll, mapEmbedUrl, mostPicked, parseAmount, resolveGames, slugify, toDate,
  transferReference, youtubeEmbedUrl,
} from '@/components/hangout/hangoutUtils';
import { HANGOUT_GAMES } from '@/components/hangout/hangoutGames';
import {
  AGODI, FOOD_AND_DRINKS, GALLERY_PHOTOS, HERO_PHOTOS, PARK_FEATURES,
} from '@/components/hangout/hangoutContent';
import imageManifest from '@/components/Home/shared/imageManifest.json';
import { SHARE_BASE, SHARE_FLYER } from '@/components/hangout/shareImage';

const STARTS_AT = toDate('2026-11-28T10:00:00+01:00');
const PUBLIC_DIR = path.resolve(__dirname, '../../public');
const BACKEND_CONFIG = path.resolve(__dirname, '../../../backend/config/hangout.php');

describe('dates', () => {
  test('reads the time in Lagos, whatever the viewer zone', () => {
    expect(formatDate(STARTS_AT)).toBe('Saturday 28 November 2026');
    expect(formatTime(STARTS_AT)).toBe('10:00 AM');
    expect(formatTicketDate(STARTS_AT)).toEqual({ weekday: 'Sat', day: '28', month: 'Nov' });
    expect(toDate('not a date')).toBeNull();
    expect(formatDate(null)).toBeNull();
  });

  test('counts down in days, hours and minutes', () => {
    const target = STARTS_AT.getTime();
    expect(getCountdown(target, target - ((2 * 24 + 3) * 60 + 15) * 60 * 1000)).toEqual({ days: 2, hours: 3, minutes: 15, done: false });
    expect(getCountdown(target, target - 20 * 1000)).toMatchObject({ minutes: 1, done: false });
    expect(getCountdown(target, target + 1)).toMatchObject({ done: true });
    expect(getCountdown(undefined)).toBeNull();
  });
});

describe('money', () => {
  test.each([
    ['5000', 5000], ['₦5,000', 5000], ['5 000.50', 5000.5], [' 20000 ', 20000], ['NGN 1,000', 1000],
  ])('reads %p as %p', (text, amount) => {
    expect(parseAmount(text)).toBe(amount);
  });

  test('treats empty as no pledge and junk as invalid', () => {
    expect(parseAmount('')).toBeNull();
    expect(parseAmount(undefined)).toBeNull();
    expect(parseAmount('five')).toBeNaN();
    expect(parseAmount('10.555')).toBeNaN();
    expect(parseAmount('-50')).toBeNaN();
  });

  test('formats naira', () => {
    expect(formatNaira(5000)).toBe('₦5,000');
    expect(formatNaira(7500.5)).toBe('₦7,500.50');
    expect(formatNaira('abc')).toBe('');
  });

  test('builds a transfer description with the member’s name', () => {
    const account = { payment_description: 'GCCC Hangout 2026' };
    expect(transferReference(account, ' Ada Obi ')).toBe('GCCC Hangout 2026 - Ada Obi');
    expect(transferReference(account, '')).toBe('GCCC Hangout 2026');
  });
});

describe('maps, calendar and video', () => {
  test('pins the venue, or draws a route from an origin', () => {
    expect(mapEmbedUrl()).toBe('https://maps.google.com/maps?q=Agodi+Gardens%2C+Parliament+Road%2C+Ibadan&z=15&output=embed');
    expect(mapEmbedUrl({ lat: 7.389312345, lng: 3.88 })).toContain('saddr=7.38931,3.88&daddr=Agodi+Gardens');
    expect(directionsUrl()).toBe('https://www.google.com/maps/dir/?api=1&destination=Agodi%20Gardens%2C%20Parliament%20Road%2C%20Ibadan');
  });

  test('adds the hangout to Google Calendar from 10 AM to 6 PM Lagos time', () => {
    const url = new URL(googleCalendarUrl(STARTS_AT));
    expect(url.searchParams.get('text')).toBe('GCCC Hangout 2026');
    expect(url.searchParams.get('dates')).toBe('20261128T090000Z/20261128T170000Z');
    expect(url.searchParams.get('location')).toContain('Agodi Gardens');
  });

  test('writes a valid .ics file', () => {
    const ics = icsFile(STARTS_AT);
    expect(ics).toMatch(/^BEGIN:VCALENDAR\r\n/);
    expect(ics).toContain('DTSTART:20261128T090000Z');
    expect(ics).toContain('DTEND:20261128T170000Z');
    expect(ics).toContain('LOCATION:Agodi Gardens\\, Parliament Road');
    expect(ics).toContain('UID:gccc-hangout-2026@gcccibadan.com');
    expect(ics).not.toContain('.org');
  });

  test('embeds YouTube without cookies', () => {
    expect(youtubeEmbedUrl('abc123')).toBe('https://www.youtube-nocookie.com/embed/abc123?autoplay=1&rel=0&playsinline=1');
  });
});

describe('sharing', () => {
  test('invites other members, naming the game', () => {
    const message = inviteMessage(STARTS_AT, 'Archery');
    expect(message).toContain("I've registered for the GCCC Hangout 2026 at Agodi Gardens, Ibadan on Saturday 28 November 2026, 10:00 AM");
    expect(message).toContain("I'm playing Archery");
    expect(message).toContain('the whole church family');
    expect(message).toMatch(/register here: http:\/\/localhost(:\d+)?\/hangout$/);
    expect(message).not.toMatch(/anyone|everyone|friends/i);
  });

  test('names and slugs', () => {
    expect(firstName('  Ada  Obi ')).toBe('Ada');
    expect(slugify('Trampoline & Bouncing Castle')).toBe('trampoline-bouncing-castle');
  });
});

describe('games', () => {
  test('shows every game from the list until the API answers', () => {
    const games = resolveGames(undefined);
    expect(games.map((g) => g.name)).toEqual(HANGOUT_GAMES.map((g) => g.name));
    expect(games.every((g) => g.count === null)).toBe(true);
  });

  test('shows only the games the API offers, in list order, with counts; unknown ones last', () => {
    const games = resolveGames([
      { name: 'Board Games', registrations_count: 2 },
      { name: 'Golf Putting', registrations_count: 1 },
      { name: 'Paintball', registrations_count: 7 },
      { name: '' },
    ]);
    expect(games.map((g) => [g.name, g.count])).toEqual([['Paintball', 7], ['Board Games', 2], ['Golf Putting', 1]]);
    expect(games[2]).toMatchObject({ slug: 'golf-putting', icon: Sparkles, cover: null, photos: [], video: null });
  });

  test('names the most picked game once a few members have chosen', () => {
    expect(mostPicked([{ name: 'A', count: 2 }, { name: 'B', count: 4 }])).toBeNull();
    expect(mostPicked([{ name: 'A', count: 6 }, { name: 'B', count: 9 }])).toBe('B');
  });

  test('every game is complete: unique name and slug, tagline, description, tips, icon and video', () => {
    expect(new Set(HANGOUT_GAMES.map((g) => g.name)).size).toBe(HANGOUT_GAMES.length);
    expect(new Set(HANGOUT_GAMES.map((g) => g.slug)).size).toBe(HANGOUT_GAMES.length);
    HANGOUT_GAMES.forEach((game) => {
      expect(game.tagline).toBeTruthy();
      expect(game.description).toBeTruthy();
      expect(game.expect.length).toBeGreaterThan(0);
      expect(game.icon).toBeTruthy();
      expect(game.video.id).toMatch(/^[\w-]{11}$/);
      expect(game.photos.length).toBeGreaterThan(0);
    });
    expect(HANGOUT_GAMES.map((g) => g.name)).not.toContain('Basketball Shootout');
  });

  test('every Creative Commons photo carries its author and licence', () => {
    const photos = [
      ...HANGOUT_GAMES.flatMap((g) => [g.cover, ...g.photos]), AGODI.photo,
      ...[...FOOD_AND_DRINKS, ...PARK_FEATURES].map((item) => item.photo),
    ];
    photos.filter((p) => p.credit?.source === 'Wikimedia Commons').forEach((p) => {
      expect(p.credit).toMatchObject({ license: 'CC BY-SA 4.0', licenseUrl: expect.stringContaining('creativecommons.org') });
      expect(p.credit.author).toBeTruthy();
      expect(p.credit.url).toMatch(/^https:\/\/commons\.wikimedia\.org\/wiki\/File:/);
    });
  });

  test('every image file the page can ask for exists, in every size and format', () => {
    const photos = [
      ...HANGOUT_GAMES.flatMap((g) => [g.cover, ...g.photos]),
      ...[...FOOD_AND_DRINKS, ...PARK_FEATURES].map((a) => a.photo),
      AGODI.photo,
    ];
    const missing = photos.flatMap((photo) => photo.widths.flatMap((w) => ['webp', 'jpg']
      .map((ext) => `${photo.path}-${w}.${ext}`)
      .filter((file) => !existsSync(path.join(PUBLIC_DIR, file)))));
    expect(missing).toEqual([]);
    expect(existsSync(path.join(PUBLIC_DIR, SHARE_BASE))).toBe(true);
    expect(existsSync(path.join(PUBLIC_DIR, SHARE_FLYER))).toBe(true);
  });

  (existsSync(BACKEND_CONFIG) ? test : test.skip)('matches the games the backend accepts, name for name', () => {
    const config = readFileSync(BACKEND_CONFIG, 'utf8');
    const list = config.slice(config.indexOf("'games' => ["), config.indexOf('],', config.indexOf("'games' => [")));
    const backendNames = [...list.matchAll(/'([^']+)',/g)].map((m) => m[1]);
    expect(backendNames).toEqual(HANGOUT_GAMES.map((g) => g.name));
  });
});

test('the hero and the gallery each use their own church photos, all in the library', () => {
  const library = imageManifest.images ?? imageManifest;
  const hero = HERO_PHOTOS.flat();
  expect(hero.length).toBeGreaterThanOrEqual(6);
  expect(new Set([...hero, ...GALLERY_PHOTOS]).size).toBe(hero.length + GALLERY_PHOTOS.length);
  [...hero, ...GALLERY_PHOTOS].forEach((name) => expect(library[name]).toBeDefined());
  // The gallery grid lines up only if every photo is 3:2.
  GALLERY_PHOTOS.forEach((name) => expect(library[name].width / library[name].height).toBeCloseTo(1.5, 1));
  expect(GALLERY_PHOTOS.length % 3).toBe(0);
});

test('food, snacks, drinks and refreshments', () => {
  expect(FOOD_AND_DRINKS.map((item) => item.title)).toEqual(['Food', 'Snacks', 'Drinks', 'Refreshments']);
  FOOD_AND_DRINKS.forEach((item) => expect(item.description).toMatch(/\.$/));
});

test('the gardens have their photo and aerial video', () => {
  expect(AGODI.photo.credit).toMatchObject({ author: 'Eukoha', license: 'CC BY-SA 4.0' });
  expect(AGODI.video.id).toMatch(/^[\w-]{11}$/);
  expect(AGODI).not.toHaveProperty('history');
});

test('locks the page behind a window, iOS included, and puts the reader back', () => {
  window.scrollTo = jest.fn();
  Object.defineProperty(window, 'scrollY', { value: 640, configurable: true });
  const unlock = lockPageScroll();
  expect(document.body.style).toMatchObject({ position: 'fixed', top: '-640px', overflow: 'hidden' });
  unlock();
  expect(document.body.style.position).toBe('');
  expect(document.body.style.top).toBe('');
  expect(window.scrollTo).toHaveBeenCalledWith(0, 640);
});
