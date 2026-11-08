import { screen } from '@testing-library/react';
import { render } from '../test-utils';
import MediaHub from '@/components/Home/media/MediaHub';

let mockVideos = {};

jest.mock('@/queries/media.query', () => ({ useVideos: () => mockVideos }));
jest.mock('@/queries/user.query', () => ({ useAwardPoints: () => ({ mutate: jest.fn() }) }));

const VIDEO = {
  video_id: 'abc123',
  title: 'SUNDAY SERVICE | March 2026 #gccc',
  published_at: '2026-03-01T10:00:00Z',
  thumbnail_high: 'https://i.ytimg.com/vi/abc123/hqdefault.jpg',
};

describe('MediaHub', () => {
  beforeEach(() => {
    mockVideos = { data: { data: [VIDEO] }, isLoading: false, isError: false };
  });

  test('keeps the #media anchor the header nav scrolls to', () => {
    const { container } = render(<MediaHub isAuthenticated={false} user={null} />);
    expect(container.querySelector('section#media')).toBeInTheDocument();
  });

  test('renders a video card', () => {
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByText(/SUNDAY SERVICE/)).toBeInTheDocument();
  });

  test('shows skeletons while loading', () => {
    mockVideos = { data: undefined, isLoading: true, isError: false };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getAllByTestId('video-skeleton').length).toBeGreaterThan(0);
  });

  test('shows an error state when the request fails', () => {
    mockVideos = { data: undefined, isLoading: false, isError: true };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByTestId('media-error')).toBeInTheDocument();
  });

  test('shows an empty state when there are no videos', () => {
    mockVideos = { data: { data: [] }, isLoading: false, isError: false };
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByTestId('media-empty')).toBeInTheDocument();
  });

  test('each video is reachable as a button with an accessible name', () => {
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.getByRole('button', { name: /Watch SUNDAY SERVICE/i })).toBeInTheDocument();
  });

  test('strips hashtags from the displayed title', () => {
    render(<MediaHub isAuthenticated={false} user={null} />);
    expect(screen.queryByText(/#gccc/)).not.toBeInTheDocument();
  });
});
