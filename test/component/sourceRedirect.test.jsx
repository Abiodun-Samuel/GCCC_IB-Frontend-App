import { shouldRedirectToDashboard } from '@/components/Home/shared/homeRedirect';

describe('shouldRedirectToDashboard', () => {
  test('redirects for the two valid QR sources', () => {
    expect(shouldRedirectToDashboard('?source=onsite')).toBe('/dashboard?source=onsite');
    expect(shouldRedirectToDashboard('?source=online')).toBe('/dashboard?source=online');
  });

  test('ignores anything else, so arbitrary query strings cannot bounce visitors', () => {
    expect(shouldRedirectToDashboard('')).toBeNull();
    expect(shouldRedirectToDashboard('?source=')).toBeNull();
    expect(shouldRedirectToDashboard('?source=evil')).toBeNull();
    expect(shouldRedirectToDashboard('?source=ONSITE')).toBeNull();
    expect(shouldRedirectToDashboard('?utm_campaign=x')).toBeNull();
  });

  test('preserves nothing but the source, so no open redirect is possible', () => {
    expect(shouldRedirectToDashboard('?source=onsite&next=https://evil.test')).toBe(
      '/dashboard?source=onsite'
    );
  });
});
