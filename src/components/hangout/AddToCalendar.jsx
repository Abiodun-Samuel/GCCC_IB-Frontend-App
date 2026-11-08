import { memo, useCallback } from 'react';
import { CalendarPlus, Download } from 'lucide-react';
import { downloadBlob, googleCalendarUrl, icsFile } from './hangoutUtils';

const LINK = `inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold transition-colors
  focus-visible:outline-none focus-visible:ring-4`;

/** "Add to calendar": Google Calendar, or an .ics file for everything else. `compact` shortens the labels. */
const AddToCalendar = ({ startsAt, tone = 'light', compact = false }) => {
  const downloadIcs = useCallback(() => {
    downloadBlob(new Blob([icsFile(startsAt)], { type: 'text/calendar;charset=utf-8' }), 'gccc-hangout-2026.ics');
  }, [startsAt]);

  if (!startsAt) return null;

  const style = tone === 'dark'
    ? 'text-white ring-1 ring-white/25 hover:bg-white/10 focus-visible:ring-white/50'
    : 'bg-(--hg-surface) text-(--hg-ink) shadow-[0_0_0_1px_var(--hg-line)] hover:bg-(--hg-tint) focus-visible:ring-(--hg-brand)/40';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <a
        href={googleCalendarUrl(startsAt)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={compact ? 'Add to Google Calendar' : undefined}
        className={`${LINK} ${style}`}
      >
        <CalendarPlus size={15} aria-hidden="true" />
        {compact ? 'Google Calendar' : 'Add to Google Calendar'}
      </a>
      <button
        type="button"
        onClick={downloadIcs}
        aria-label={compact ? 'Add to Apple Calendar or Outlook (.ics file)' : undefined}
        className={`${LINK} ${style}`}
      >
        <Download size={15} aria-hidden="true" />
        {compact ? 'Apple / Outlook' : 'Apple / Outlook (.ics)'}
      </button>
    </div>
  );
};

export default memo(AddToCalendar);
