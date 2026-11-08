import { render } from '../test-utils';
import HomePage from '@/components/Home/HomePage';

jest.mock('@/store/auth.store', () => ({
  useAuthStore: () => ({ isAuthenticated: false, user: null }),
}));

jest.mock('@/queries/events.query', () => ({
  useClosestEvent: () => ({ data: { data: null }, isLoading: false, isError: false }),
  useEvents: () => ({ data: { data: [] }, isLoading: false, isError: false }),
}));

jest.mock('@/queries/service.query', () => ({
  useCoreAppData: () => ({ data: { birthday_list: [], anniversary_list: [] } }),
}));

jest.mock('@/queries/media.query', () => ({
  useVideos: () => ({ data: { data: [] }, isLoading: false, isError: false }),
}));

jest.mock('@/queries/user.query', () => ({
  useAwardPoints: () => ({ mutate: jest.fn() }),
}));

describe('HomePage', () => {
  test('renders every anchor the header nav scrolls to', () => {
    const { container } = render(<HomePage />);
    ['#hero', '#about', '#events', '#media'].forEach((id) => {
      expect(container.querySelector(`section${id}`)).toBeInTheDocument();
    });
  });

  test('renders exactly one level-1 heading', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll('h1')).toHaveLength(1);
  });

  test('sections appear in the specified order', () => {
    const { container } = render(<HomePage />);
    const ids = [...container.querySelectorAll('section[id]')].map((s) => s.id);
    expect(ids.indexOf('hero')).toBeLessThan(ids.indexOf('about'));
    expect(ids.indexOf('about')).toBeLessThan(ids.indexOf('events'));
    expect(ids.indexOf('events')).toBeLessThan(ids.indexOf('media'));
  });

  test('no image is loaded from a deleted legacy folder', () => {
    const { container } = render(<HomePage />);
    container.querySelectorAll('img, source').forEach((el) => {
      const url = el.getAttribute('src') || el.getAttribute('srcset') || '';
      expect(url).not.toMatch(/images\/gallery\/|images\/home\/(hero|about)\//);
    });
  });

  test('exactly one image on the page is prioritised', () => {
    const { container } = render(<HomePage />);
    expect(container.querySelectorAll('img[loading="eager"]')).toHaveLength(1);
  });
});
