import { fmtTime, fmtTimeRange, fmtDateRange } from '@/components/Home/events/eventFormat';

describe('fmtTime', () => {
  test('renders 12-hour time with a meridiem, matching the original behaviour', () => {
    expect(fmtTime('09:30:00')).toBe('9:30 AM');
    expect(fmtTime('14:05')).toBe('2:05 PM');
  });

  test('handles midnight and noon correctly', () => {
    expect(fmtTime('00:15')).toBe('12:15 AM');
    expect(fmtTime('12:00')).toBe('12:00 PM');
  });

  test('returns an empty string for missing input', () => {
    expect(fmtTime(null)).toBe('');
    expect(fmtTime(undefined)).toBe('');
    expect(fmtTime('')).toBe('');
  });
});

describe('fmtTimeRange', () => {
  test('joins start and end when both are present', () => {
    expect(fmtTimeRange({ start_time: '09:00', end_time: '12:00' })).toBe('9:00 AM – 12:00 PM');
  });

  test('falls back to the start alone when there is no end', () => {
    expect(fmtTimeRange({ start_time: '09:00' })).toBe('9:00 AM');
  });

  test('falls back to the legacy time field when start_time is absent', () => {
    expect(fmtTimeRange({ time: 'Noon' })).toBe('Noon');
  });
});

describe('fmtDateRange', () => {
  test('returns the single date when there is no end date', () => {
    expect(fmtDateRange({ date: 'March 1, 2026', end_date: null })).toBe('March 1, 2026');
  });

  test('joins start and end when they differ', () => {
    const out = fmtDateRange({ date: 'March 1, 2026', end_date: '2026-03-03' });
    expect(out).toMatch(/March 1, 2026/);
    expect(out).toMatch(/–/);
  });

  test('collapses to one date when the end date matches the start', () => {
    expect(fmtDateRange({ date: 'March 1, 2026', end_date: '2026-03-01' })).toBe('March 1, 2026');
  });
});
