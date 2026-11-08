import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../test-utils';
import ServiceClockInCard from '@/components/dashboard/ServiceClockInCard';
import { resolveAttendanceSource } from '@/components/dashboard/attendanceSource';

const mockMutate = jest.fn();
let mockService = {};

jest.mock('@/queries/service.query', () => ({
  useTodaysService: () => mockService,
}));

jest.mock('@/queries/attendance.query', () => ({
  useMarkAttendance: () => ({ mutate: mockMutate, isPending: false, isSuccess: false }),
}));

describe('resolveAttendanceSource', () => {
  test('returns onsite by default', () => {
    expect(resolveAttendanceSource(new URLSearchParams(''))).toBe('onsite');
  });

  test('returns online only for the exact value', () => {
    expect(resolveAttendanceSource(new URLSearchParams('source=online'))).toBe('online');
    expect(resolveAttendanceSource(new URLSearchParams('source=ONLINE'))).toBe('onsite');
    expect(resolveAttendanceSource(new URLSearchParams('source=garbage'))).toBe('onsite');
  });
});

describe('ServiceClockInCard', () => {
  beforeEach(() => {
    mockMutate.mockClear();
    mockService = { data: undefined, isLoading: true, isError: false, refetch: jest.fn() };
  });

  test('shows a loading state while the service is being fetched', () => {
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-loading')).toBeInTheDocument();
  });

  test('shows the no-service state when the request errors', () => {
    mockService = { data: undefined, isLoading: false, isError: true, refetch: jest.fn() };
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-no-service')).toBeInTheDocument();
  });

  test('shows a countdown while the service is upcoming', () => {
    mockService = {
      data: {
        service: { id: 1, name: 'Sunday Service' },
        service_status: 'upcoming',
        seconds_until_start: 3600,
        can_mark: false,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };
    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-countdown')).toBeInTheDocument();
  });

  test('clocking in sends the service id and the resolved source', async () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ongoing',
        can_mark: true,
        attendance: null,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />, { route: '/dashboard?source=online' });

    await userEvent.click(screen.getByRole('button', { name: /clock in/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      service_id: 42,
      mode: 'online',
      status: 'present',
    });
  });

  test('shows the recorded state instead of the button once attendance exists', () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ongoing',
        can_mark: false,
        attendance: { id: 7, mode: 'onsite', marked_at: '09:00' },
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-recorded')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /clock in/i })).not.toBeInTheDocument();
  });

  test('shows the ended state after the service has finished', () => {
    mockService = {
      data: {
        service: { id: 42, name: 'Sunday Service' },
        service_status: 'ended',
        can_mark: false,
        attendance: null,
      },
      isLoading: false,
      isError: false,
      refetch: jest.fn(),
    };

    render(<ServiceClockInCard />);
    expect(screen.getByTestId('clockin-ended')).toBeInTheDocument();
  });
});
