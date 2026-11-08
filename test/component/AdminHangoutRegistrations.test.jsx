import { act, fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render } from '../test-utils';
import AdminHangoutRegistrations from '@/components/admin/hangout/AdminHangoutRegistrations';

const mockUseRegistrations = jest.fn();
jest.mock('@/queries/hangout.query', () => ({
  useHangoutRegistrations: (params) => mockUseRegistrations(params),
}));
const mockExport = jest.fn();
jest.mock('@/services/hangout.service', () => ({
  HangoutService: { exportRegistrations: (params) => mockExport(params) },
}));
jest.mock('@/lib/toastify', () => ({ Toast: { success: jest.fn(), error: jest.fn() } }));

const REGISTRATIONS = [
  {
    id: 2, full_name: 'Bola Ade', email: 'bola@example.com', phone_number: '08022222222', whatsapp_number: '08022222222',
    game: 'Archery', support_amount: 2000, created_at: '2026-10-02T09:00:00Z', updated_at: '2026-10-05T09:00:00Z',
  },
  {
    id: 1, full_name: 'Chidi Okafor', email: 'chidi@example.com', phone_number: '08011111111', whatsapp_number: null,
    game: 'Paintball', support_amount: null, created_at: '2026-10-01T09:00:00Z', updated_at: '2026-10-01T09:00:00Z',
  },
];
const RESPONSE = {
  data: {
    registrations: REGISTRATIONS,
    meta: { current_page: 1, per_page: 20, total: 2, last_page: 1, from: 1, to: 2, links: [] },
    summary: {
      total: 2, pledges: 1, total_pledged: 2000, registration_open: true,
      by_game: [{ game: 'Paintball', count: 1 }, { game: 'Archery', count: 1 }, { game: 'Bowling', count: 0 }],
    },
  },
};

const lastParams = () => mockUseRegistrations.mock.calls.at(-1)[0];

describe('AdminHangoutRegistrations', () => {
  beforeEach(() => {
    mockUseRegistrations.mockReset();
    mockUseRegistrations.mockReturnValue({ data: RESPONSE, isLoading: false, isFetching: false, isError: false, refetch: jest.fn() });
    mockExport.mockReset();
  });

  test('shows every registration detail and the totals', () => {
    render(<AdminHangoutRegistrations />);

    const rows = screen.getAllByRole('row').slice(1);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Bola Ade');
    expect(rows[0]).toHaveTextContent('bola@example.com');
    expect(rows[0]).toHaveTextContent('08022222222');
    expect(rows[0]).toHaveTextContent('Archery');
    expect(rows[0]).toHaveTextContent('₦2,000');
    const hrefs = within(rows[0]).getAllByRole('link').map((a) => a.getAttribute('href'));
    expect(hrefs).toEqual(['mailto:bola@example.com', 'tel:08022222222', 'https://wa.me/08022222222']);
    // No WhatsApp number: email and phone links only.
    expect(within(rows[1]).getAllByRole('link')).toHaveLength(2);
    expect(rows[1]).toHaveTextContent('Chidi Okafor');

    expect(screen.getByText('Support pledged').closest('div').parentElement).toHaveTextContent('₦2,000');
  });

  test('starts newest first, 20 a page', () => {
    render(<AdminHangoutRegistrations />);
    expect(lastParams()).toEqual({ sort: 'created_at', direction: 'desc', page: 1, per_page: 20 });
  });

  test('sorts by a column, and flips direction on a second click', () => {
    render(<AdminHangoutRegistrations />);

    fireEvent.click(screen.getByRole('button', { name: /^Name/ }));
    expect(lastParams()).toMatchObject({ sort: 'full_name', direction: 'asc' });
    expect(screen.getByRole('columnheader', { name: /Name/ })).toHaveAttribute('aria-sort', 'ascending');

    fireEvent.click(screen.getByRole('button', { name: /^Name/ }));
    expect(lastParams()).toMatchObject({ sort: 'full_name', direction: 'desc' });

    fireEvent.click(screen.getByRole('button', { name: /^Support/ }));
    expect(lastParams()).toMatchObject({ sort: 'support_amount', direction: 'desc' });
  });

  test('filters by game, from the breakdown or the dropdown', () => {
    render(<AdminHangoutRegistrations />);

    fireEvent.click(screen.getByTitle('Show Archery registrations'));
    expect(lastParams()).toMatchObject({ game: 'Archery', page: 1 });

    fireEvent.change(screen.getByLabelText('Filter by game'), { target: { value: 'Paintball' } });
    expect(lastParams()).toMatchObject({ game: 'Paintball' });
  });

  test('filters by support and searches after a short pause', () => {
    jest.useFakeTimers();
    try {
      render(<AdminHangoutRegistrations />);
      fireEvent.change(screen.getByLabelText('Filter by support'), { target: { value: 'with' } });
      expect(lastParams()).toMatchObject({ support: 'with' });

      fireEvent.change(screen.getByLabelText('Search registrations'), { target: { value: 'bola' } });
      expect(lastParams().search).toBeUndefined();
      act(() => jest.advanceTimersByTime(400));
      expect(lastParams()).toMatchObject({ search: 'bola', page: 1 });
    } finally {
      jest.useRealTimers();
    }
  });

  test('exports with the current filters', async () => {
    mockExport.mockResolvedValue(new Blob(['#,Full name'], { type: 'text/csv' }));
    URL.createObjectURL = jest.fn(() => 'blob:csv');
    URL.revokeObjectURL = jest.fn();
    render(<AdminHangoutRegistrations />);

    fireEvent.change(screen.getByLabelText('Filter by game'), { target: { value: 'Archery' } });
    fireEvent.click(screen.getByRole('button', { name: /Export CSV/ }));

    await waitFor(() => expect(mockExport).toHaveBeenCalledWith({ game: 'Archery', sort: 'created_at', direction: 'desc' }));
  });

  test('says so when nothing matches and offers to clear the filters', () => {
    mockUseRegistrations.mockReturnValue({
      data: { data: { ...RESPONSE.data, registrations: [], meta: { ...RESPONSE.data.meta, total: 0, from: null, to: null } } },
      isLoading: false, isFetching: false, isError: false, refetch: jest.fn(),
    });
    render(<AdminHangoutRegistrations />);
    fireEvent.change(screen.getByLabelText('Filter by support'), { target: { value: 'without' } });

    expect(screen.getByText('No registrations match your filters')).toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /Clear filters/ })[0]);
    expect(lastParams().support).toBeUndefined();
  });

  test('offers a retry when the list fails to load', () => {
    const refetch = jest.fn();
    mockUseRegistrations.mockReturnValue({ data: undefined, isLoading: false, isFetching: false, isError: true, refetch });
    render(<AdminHangoutRegistrations />);
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }));
    expect(refetch).toHaveBeenCalled();
  });
});
