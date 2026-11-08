const VALID_SOURCES = new Set(['onsite', 'online']);

/**
 * QR codes printed for the building point at `/?source=onsite`. Clock-in now lives
 * on the dashboard, so forward those scans.
 *
 * Deliberately rebuilds the target from a whitelist rather than forwarding the
 * original query string — that makes an open redirect impossible.
 *
 * Guests are safe to redirect too: ProtectedRoute preserves `pathname + search`
 * in `?redirect=` and PublicRoute reads it back after login, so the source
 * survives the round trip through the login screen.
 */
export const shouldRedirectToDashboard = (search) => {
  const source = new URLSearchParams(search).get('source');
  return VALID_SOURCES.has(source) ? `/dashboard?source=${source}` : null;
};

export default shouldRedirectToDashboard;
