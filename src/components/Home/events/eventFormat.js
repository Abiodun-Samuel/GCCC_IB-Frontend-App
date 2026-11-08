/**
 * Formats an event time for display.
 *
 * Named `fmtTime24` in the original SanctuaryHub, which was a misnomer — it has
 * always produced 12-hour AM/PM output. Renamed to match what it does; the
 * output itself is unchanged, so event times still read exactly as before.
 *
 * Returns an empty string for missing input so callers can concatenate or fall
 * back with || safely.
 */
export const fmtTime = (t) => {
  if (!t) return '';
  const [hRaw, mRaw] = String(t).split(':');
  const h = parseInt(hRaw, 10);
  if (Number.isNaN(h)) return String(t);
  const m = mRaw ?? '00';
  return `${h % 12 || 12}:${m} ${h >= 12 ? 'PM' : 'AM'}`;
};

/** Joins a start and end time into a single range, or just the start. */
export const fmtTimeRange = (event) => {
  const start = fmtTime(event?.start_time) || event?.time || '';
  const end = fmtTime(event?.end_time);
  return end ? `${start} – ${end}` : start;
};

/** Collapses a start/end pair to one string, omitting a redundant end date. */
export const fmtDateRange = (event) => {
  if (!event?.end_date) return event?.date ?? '';

  const end = new Date(event.end_date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return end && end !== event.date ? `${event.date} – ${end}` : event.date;
};

/** Short form used on compact grid cards. */
export const fmtShortDate = (date) =>
  date ? new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
