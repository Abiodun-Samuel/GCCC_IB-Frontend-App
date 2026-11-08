import { DISPLAY } from './HangoutTheme';

// Shared class lists for the hangout page.

const BUTTON = `inline-flex items-center justify-center gap-2 rounded-full font-bold transition
  focus-visible:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-60`;

export const PRIMARY_BUTTON = `${BUTTON} bg-(--hg-action) px-6 py-3.5 text-base text-(--hg-on-action)
  hover:brightness-110 focus-visible:ring-(--hg-brand)/40`;

export const SECONDARY_BUTTON = `${BUTTON} bg-(--hg-surface) px-5 py-3 text-sm text-(--hg-ink)
  shadow-[0_0_0_1px_var(--hg-line)] hover:bg-(--hg-tint) focus-visible:ring-(--hg-brand)/40`;

/** For buttons on the deep blue bands. */
export const ON_DEEP_BUTTON = `${BUTTON} px-5 py-3 text-sm text-white ring-1 ring-white/30
  hover:bg-white/10 focus-visible:ring-white/50`;

/** White panels, lifted only by the faintest shadow. Dark mode uses a hairline. */
export const CARD = `rounded-3xl bg-(--hg-surface) shadow-[0_1px_2px_rgba(10,37,64,0.06)]
  dark:shadow-none dark:ring-1 dark:ring-(--hg-line)`;

/** Filled form fields: no border or outline; focus lifts the field instead. */
export const FIELD = `w-full rounded-2xl border-0 bg-(--hg-field) px-4 py-4 text-base text-(--hg-ink) outline-none
  placeholder:text-(--hg-muted)/60 transition-[background-color,box-shadow]
  focus:bg-(--hg-surface) focus:shadow-[0_1px_3px_rgba(7,121,173,0.25)]`;
export const FIELD_ERROR = 'bg-red-50 dark:bg-red-950/30';

export const SECTION = 'scroll-mt-20 py-20 sm:py-24 lg:py-32';
export const CONTAINER = 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8';
export const SECTION_TITLE = `${DISPLAY} text-4xl font-extrabold leading-[0.95] text-(--hg-ink) sm:text-5xl lg:text-[3.75rem]`;
export const SECTION_INTRO = 'mt-5 max-w-2xl text-lg leading-relaxed text-(--hg-muted)';
