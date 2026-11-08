export const ATTENDANCE_SOURCES = { ONLINE: 'online', ONSITE: 'onsite' };

/**
 * Which attendance mode a scan represents. Anything that is not the exact string
 * "online" is treated as on-site — the QR codes in the building are the common
 * case, and a typo should not silently record someone as remote.
 */
export const resolveAttendanceSource = (searchParams) =>
  searchParams.get('source') === ATTENDANCE_SOURCES.ONLINE
    ? ATTENDANCE_SOURCES.ONLINE
    : ATTENDANCE_SOURCES.ONSITE;
