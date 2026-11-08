import { Sparkles } from 'lucide-react';
import { HANGOUT, VENUE } from './hangoutContent';
import { HANGOUT_GAMES } from './hangoutGames';

// ─── Games ────────────────────────────────────────────────────────────────────

export const slugify = (text) => String(text ?? '').toLowerCase().normalize('NFKD')
  .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'game';

/** A game the backend offers but hangoutGames.js doesn't describe yet. */
const plainGame = (name) => ({
  name, slug: slugify(name), tagline: null, description: null, expect: [], icon: Sparkles, cover: null, photos: [], video: null,
});

/**
 * The games to show. Before the API answers (or if it fails) that is every
 * game in hangoutGames.js, with no counts. Once it answers, only the games it
 * offers, in hangoutGames.js order, each with how many have picked it; games
 * only the API knows go last.
 */
export const resolveGames = (apiGames) => {
  if (!Array.isArray(apiGames)) return HANGOUT_GAMES.map((game) => ({ ...game, count: null }));

  const offered = new Map(apiGames
    .filter((game) => typeof game?.name === 'string' && game.name.trim() !== '')
    .map((game) => [game.name, Number(game.registrations_count) || 0]));
  const known = new Set(HANGOUT_GAMES.map((game) => game.name));

  return [
    ...HANGOUT_GAMES.filter((game) => offered.has(game.name)),
    ...[...offered.keys()].filter((name) => !known.has(name)).map(plainGame),
  ].map((game) => ({ ...game, count: offered.get(game.name) }));
};

/** The name of the game most people have picked, once at least `minimum` have. */
export const mostPicked = (games, minimum = 5) => {
  const top = games.reduce((best, game) => ((game.count ?? 0) > (best?.count ?? 0) ? game : best), null);
  return top && top.count >= minimum ? top.name : null;
};

export const firstName = (fullName) => String(fullName ?? '').trim().split(/\s+/)[0];

// Ibadan keeps West Africa Time (UTC+1) all year.
export const TIME_ZONE = 'Africa/Lagos';
export const HANGOUT_PATH = '/hangout';

// ─── Dates ────────────────────────────────────────────────────────────────────

/** A Date from an ISO string, or null if it doesn't parse. */
export const toDate = (iso) => {
  const date = new Date(iso ?? '');
  return Number.isNaN(date.getTime()) ? null : date;
};

const longDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: TIME_ZONE, weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
});
const clockTime = new Intl.DateTimeFormat('en-US', { timeZone: TIME_ZONE, hour: 'numeric', minute: '2-digit' });
const ticketParts = new Intl.DateTimeFormat('en-GB', { timeZone: TIME_ZONE, weekday: 'short', day: 'numeric', month: 'short' });

/** "Saturday 28 November 2026", in Lagos time whatever the viewer's zone. */
export const formatDate = (date) => (date ? longDate.format(date).replace(',', '') : null);

/** "10:00 AM", in Lagos time. */
export const formatTime = (date) => (date ? clockTime.format(date) : null);

/** { weekday: 'Sat', day: '28', month: 'Nov' } for the pass stub. */
export const formatTicketDate = (date) => {
  if (!date) return null;
  const parts = Object.fromEntries(ticketParts.formatToParts(date).map(({ type, value }) => [type, value]));
  return { weekday: parts.weekday, day: parts.day, month: parts.month };
};

const MINUTE = 60 * 1000;
const MINUTES_PER_DAY = 24 * 60;

/**
 * Whole days, hours and minutes left until `target`. Minutes round up so the
 * last minute reads "1 min" rather than "0 min".
 */
export const getCountdown = (target, now = Date.now()) => {
  const targetMs = target instanceof Date ? target.getTime() : target;
  if (!Number.isFinite(targetMs)) return null;

  const remaining = targetMs - now;
  if (remaining <= 0) return { days: 0, hours: 0, minutes: 0, done: true };

  const totalMinutes = Math.ceil(remaining / MINUTE);
  return {
    days: Math.floor(totalMinutes / MINUTES_PER_DAY),
    hours: Math.floor((totalMinutes % MINUTES_PER_DAY) / 60),
    minutes: totalMinutes % 60,
    done: false,
  };
};

// ─── Money ────────────────────────────────────────────────────────────────────

// In their own module so the admin view can use them without the page's content.
export { formatNaira, parseAmount } from './money';

/** The transfer description for someone's support, e.g. "GCCC Hangout 2026 - Ada Obi". */
export const transferReference = (account, fullName) =>
  [account?.payment_description, fullName?.trim()].filter(Boolean).join(' - ');

// ─── Maps ─────────────────────────────────────────────────────────────────────

const encodeQuery = (value) => encodeURIComponent(value).replace(/%20/g, '+');
const roundCoord = (value) => Math.round(value * 1e5) / 1e5;

/**
 * Google Maps embed of the venue. With an origin it draws the driving route
 * from there. Keyless — the classic `output=embed` URL.
 */
export const mapEmbedUrl = (origin) => {
  const place = encodeQuery(VENUE.mapsQuery);
  if (!origin) return `https://maps.google.com/maps?q=${place}&z=15&output=embed`;
  return `https://maps.google.com/maps?saddr=${roundCoord(origin.lat)},${roundCoord(origin.lng)}&daddr=${place}&output=embed`;
};

/** Google Maps directions to the venue, starting from the device's location. */
export const directionsUrl = () =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(VENUE.mapsQuery)}`;

// ─── YouTube ──────────────────────────────────────────────────────────────────

export const youtubeThumbnail = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
// playsinline keeps the video in the page on iPhone instead of jumping to full screen.
export const youtubeEmbedUrl = (id) => `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
export const youtubeWatchUrl = (id) => `https://www.youtube.com/watch?v=${id}`;

// ─── Calendar ─────────────────────────────────────────────────────────────────

const utcStamp = (date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

const calendarEvent = (startsAt) => ({
  title: HANGOUT.title,
  start: startsAt,
  end: toDate(HANGOUT.calendarEndsAt),
  location: `${VENUE.name}, ${VENUE.address}`,
  details: `Games, food and fellowship with GCCC Ibadan. ${VENUE.directions} Details: ${hangoutPageUrl()}`,
});

/** "Add to Google Calendar" link. */
export const googleCalendarUrl = (startsAt) => {
  const event = calendarEvent(startsAt);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${utcStamp(event.start)}/${utcStamp(event.end)}`,
    location: event.location,
    details: event.details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

const icsEscape = (text) => String(text).replace(/\\/g, '\\\\').replace(/[,;]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

/** An .ics file for Apple Calendar, Outlook and the rest. */
export const icsFile = (startsAt) => {
  const event = calendarEvent(startsAt);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GCCC Ibadan//Hangout//EN',
    'BEGIN:VEVENT',
    `UID:gccc-hangout-2026@gcccibadan.com`,
    `DTSTAMP:${utcStamp(new Date())}`,
    `DTSTART:${utcStamp(event.start)}`,
    `DTEND:${utcStamp(event.end)}`,
    `SUMMARY:${icsEscape(event.title)}`,
    `LOCATION:${icsEscape(event.location)}`,
    `DESCRIPTION:${icsEscape(event.details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
};

// ─── Registration ─────────────────────────────────────────────────────────────

/** The registration form's fields, empty. The game is picked outside the form. */
export const EMPTY_FORM = { full_name: '', email: '', phone_number: '', whatsapp_number: '', support_amount: '' };

// ─── Page & sharing ───────────────────────────────────────────────────────────

export const scrollToSection = (id) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

export const hangoutPageUrl = () => `${window.location.origin}${HANGOUT_PATH}`;

/** What a member sends other members after registering. */
export const inviteMessage = (startsAt, gameName) => {
  const when = [formatDate(startsAt), formatTime(startsAt)].filter(Boolean).join(', ');
  return `I've registered for the ${HANGOUT.title} at ${VENUE.name}, Ibadan${when ? ` on ${when}` : ''}`
    + `${gameName ? `, and I'm playing ${gameName}` : ''}. There are games, food and drinks for the whole church family. `
    + `Pick your game and register here: ${hangoutPageUrl()}`;
};

/** Saves a Blob as a file. */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = Object.assign(document.createElement('a'), { href: url, download: filename });
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Safari reads the blob after the click returns; revoking at once cancels the download.
  setTimeout(() => URL.revokeObjectURL(url), 60 * 1000);
};

/**
 * Stops the page behind a modal from scrolling, iOS Safari included (it
 * ignores `overflow: hidden` on <body>), and keeps the reader's place.
 * Returns the function that undoes it.
 */
export const lockPageScroll = () => {
  const { body, documentElement } = document;
  const scrollY = window.scrollY;
  const previous = {
    position: body.style.position, top: body.style.top, width: body.style.width,
    overflow: body.style.overflow, paddingRight: body.style.paddingRight,
  };
  // Stops the page shifting sideways when the desktop scrollbar disappears.
  const scrollbar = window.innerWidth - documentElement.clientWidth;

  Object.assign(body.style, { position: 'fixed', top: `-${scrollY}px`, width: '100%', overflow: 'hidden' });
  if (scrollbar > 0 && scrollbar < 40) body.style.paddingRight = `${scrollbar}px`;

  return () => {
    Object.assign(body.style, previous);
    window.scrollTo(0, scrollY);
  };
};
