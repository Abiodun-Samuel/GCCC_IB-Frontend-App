import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import EventsSection from '@/components/Home/events/EventsSection';

let mockClosest = {};
let mockList = {};
let mockAuth = { isAuthenticated: false, user: null };

jest.mock('@/queries/events.query', () => ({
  useClosestEvent: () => mockClosest,
  useEvents: () => mockList,
}));

jest.mock('@/store/auth.store', () => ({
  useAuthStore: () => mockAuth,
}));

jest.mock('@/queries/service.query', () => ({
  useCoreAppData: () => ({ data: { birthday_list: [], anniversary_list: [] } }),
}));

const base = {
  date: 'March 1, 2026',
  end_date: null,
  start_time: '09:00:00',
  end_time: '12:00:00',
  location: 'Bodija, Ibadan',
  description: 'A gathering of the whole family.',
  image: 'https://example.test/poster.jpg',
  has_streaming: false,
  is_registration_open: false,
};

const UPCOMING = { ...base, id: 1, title: 'Apostolic Congress', status: 'upcoming' };
const SECOND = { ...base, id: 2, title: 'Prayer School', status: 'upcoming' };
const LIVE = { ...base, id: 3, title: 'Sunday Service', status: 'ongoing' };

describe('EventsSection', () => {
  beforeEach(() => {
    mockAuth = { isAuthenticated: false, user: null };
    mockClosest = { data: { data: UPCOMING }, isLoading: false, isError: false };
    mockList = { data: { data: [UPCOMING, SECOND] }, isLoading: false, isError: false };
  });

  test('keeps the #events anchor the header nav scrolls to', () => {
    const { container } = render(<EventsSection />);
    expect(container.querySelector('section#events')).toBeInTheDocument();
  });

  test('features the next event when nothing is live', () => {
    render(<EventsSection />);
    expect(screen.getByText('Apostolic Congress')).toBeInTheDocument();
  });

  test('a live event takes the feature slot over the closest upcoming one', () => {
    mockList = { data: { data: [UPCOMING, SECOND, LIVE] }, isLoading: false, isError: false };
    const { container } = render(<EventsSection />);
    const feature = container.querySelector('article');
    expect(feature).toHaveTextContent('Sunday Service');
    // The card carries its own live badge, distinct from the section heading.
    expect(feature).toHaveTextContent(/Live Now/i);
  });

  test('exactly one event gets the card treatment; the rest are an index list', () => {
    const { container } = render(<EventsSection />);
    expect(container.querySelectorAll('article')).toHaveLength(1);
    expect(container.querySelectorAll('ul li').length).toBeGreaterThan(0);
  });

  test('the featured event is not repeated in the index list', () => {
    const { container } = render(<EventsSection />);
    const listText = [...container.querySelectorAll('ul li')].map((li) => li.textContent).join(' ');
    expect(listText).not.toMatch(/Apostolic Congress/);
    expect(listText).toMatch(/Prayer School/);
  });

  test('shows a skeleton while loading', () => {
    mockList = { data: undefined, isLoading: true, isError: false };
    render(<EventsSection />);
    expect(screen.getByTestId('featured-skeleton')).toBeInTheDocument();
    expect(screen.getByTestId('events-index-skeleton')).toBeInTheDocument();
  });

  test('shows an empty state when nothing is scheduled', () => {
    mockClosest = { data: { data: null }, isLoading: false, isError: false };
    mockList = { data: { data: [] }, isLoading: false, isError: false };
    render(<EventsSection />);
    expect(screen.getByTestId('featured-empty')).toBeInTheDocument();
    expect(screen.getByTestId('events-index-empty')).toBeInTheDocument();
  });

  test('hides the view-all link from guests', () => {
    render(<EventsSection />);
    expect(screen.queryByRole('link', { name: /all events/i })).not.toBeInTheDocument();
  });

  test('shows the view-all link to signed-in members', () => {
    mockAuth = { isAuthenticated: true, user: { id: 1 } };
    render(<EventsSection />);
    expect(screen.getByRole('link', { name: /all events/i })).toHaveAttribute(
      'href',
      '/dashboard/events'
    );
  });

  test('does not render celebrations for guests', () => {
    render(<EventsSection />);
    expect(screen.queryByTestId('celebrations')).not.toBeInTheDocument();
  });

  test('renders no attendance clock-in control', () => {
    mockAuth = { isAuthenticated: true, user: { id: 1 } };
    render(<EventsSection />);
    expect(screen.queryByRole('button', { name: /clock in/i })).not.toBeInTheDocument();
  });
});
