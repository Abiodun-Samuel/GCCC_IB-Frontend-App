import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { render, setMatchMediaReducedMotion } from '../test-utils';
import { HelmetProvider } from 'react-helmet-async';
import HangoutPage from '@/pages/Home/HangoutPage';
import { HANGOUT_GAMES } from '@/components/hangout/hangoutGames';

const mockMutateAsync = jest.fn();
jest.mock('@/queries/hangout.query', () => ({
  useHangout: () => ({
    isLoading: false,
    refetch: jest.fn(),
    data: {
      data: {
        title: 'GCCC Hangout 2026',
        starts_at: '2026-11-28T10:00:00+01:00',
        registration_open: true,
        registrations_count: 0,
        games: jest.requireActual('@/components/hangout/hangoutGames').HANGOUT_GAMES
          .map((g) => ({ name: g.name, registrations_count: 0 })),
        support_account: {
          account_name: 'Olajide Israel Okikiola', bank: 'Moniepoint', account_number: '9018140371', payment_description: 'GCCC Hangout 2026',
        },
      },
    },
  }),
  useHangoutRegistration: () => ({ mutateAsync: mockMutateAsync, isPending: false }),
}));
jest.mock('@/lib/toastify', () => ({ Toast: { success: jest.fn(), error: jest.fn() } }));
// jsdom can't draw on a canvas; the share card's drawing is stubbed.
jest.mock('@/components/hangout/shareImage', () => ({
  ...jest.requireActual('@/components/hangout/shareImage'),
  createShareImage: jest.fn(() => Promise.resolve(new Blob(['card'], { type: 'image/jpeg' }))),
}));

const type = (label, value) => fireEvent.input(screen.getByLabelText(label), { target: { value } });
const fillDetails = () => {
  type('Full name', ' Ada Obi ');
  type('Email address', 'ada@example.com');
  type('Phone number', '08012345678');
};
const pickGame = (name) => fireEvent.click(screen.getByRole('radio', { name: new RegExp(name) }));
const submit = () => fireEvent.click(screen.getByRole('button', { name: 'Register' }));
const form = () => screen.getByRole('region', { name: /Register|You’re in|Registration updated/ });

const renderPage = () => render(<HelmetProvider><HangoutPage /></HelmetProvider>);

beforeAll(() => {
  setMatchMediaReducedMotion(true);
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  URL.createObjectURL = jest.fn(() => 'blob:card');
  URL.revokeObjectURL = jest.fn();
});
afterAll(() => setMatchMediaReducedMotion(false));
beforeEach(() => mockMutateAsync.mockReset());

describe('Registering for the hangout', () => {
  test('asks for a game first, without sending anything', async () => {
    renderPage();
    fillDetails();
    submit();
    expect(await screen.findByText('Pick the game you want to play first.')).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
    expect(screen.getByText('You haven’t picked a game yet.')).toBeInTheDocument();
  });

  test('form fields are filled, with no border or outline', () => {
    renderPage();
    ['Full name', 'Email address', 'Phone number', 'WhatsApp number (optional)', 'Amount you’d like to give (optional)']
      .forEach((label) => expect(screen.getByLabelText(label)).toHaveClass('border-0', 'outline-none'));
  });

  test('shows the picked game in the form', () => {
    renderPage();
    pickGame('Archery');
    expect(within(form()).getByText('Archery')).toBeInTheDocument();
    expect(within(form()).getByRole('button', { name: 'Change game' })).toBeInTheDocument();
  });

  test('shows the support account and encourages giving, with no suggested amounts', () => {
    renderPage();
    type('Full name', 'Ada Obi');
    expect(screen.getByText('Give towards the day')).toBeInTheDocument();
    expect(screen.getByText(/God loves a cheerful giver/)).toBeInTheDocument();
    expect(screen.getByText('9018140371')).toBeInTheDocument();
    expect(screen.getByText('Moniepoint')).toBeInTheDocument();
    expect(screen.getByText('Olajide Israel Okikiola')).toBeInTheDocument();
    expect(screen.getByText('GCCC Hangout 2026 - Ada Obi')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /^₦/ })).not.toBeInTheDocument();
    expect(screen.getByLabelText(/Amount you’d like to give/)).not.toBeRequired();
  });

  test('registers without support, then offers the share card and account', async () => {
    mockMutateAsync.mockResolvedValue({ data: { updated: false } });
    renderPage();
    pickGame('Archery');
    fillDetails();
    submit();

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledWith({
      full_name: 'Ada Obi',
      email: 'ada@example.com',
      phone_number: '08012345678',
      whatsapp_number: null,
      game: 'Archery',
      support_amount: null,
    }));
    expect(await screen.findByRole('heading', { name: 'You’re in, Ada!' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Your place for Archery is saved');
    expect(screen.getByText(/If you’d still like to give towards the day/)).toBeInTheDocument();

    const share = screen.getByRole('complementary', { name: 'Invite other members' });
    expect(await within(share).findByAltText('Hangout card: Ada is going to the GCCC IB Hangout 2026, playing Archery')).toHaveAttribute('src', 'blob:card');
    expect(within(share).queryByRole('link', { name: /WhatsApp/ })).not.toBeInTheDocument();
    // Registered: the games show the member's game and can't be re-picked from here.
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.getByText('Your game')).toBeInTheDocument();
  });

  describe('sharing the card', () => {
    const registerAda = async () => {
      mockMutateAsync.mockResolvedValue({ data: { updated: false } });
      renderPage();
      pickGame('Archery');
      fillDetails();
      submit();
      const share = await screen.findByRole('complementary', { name: 'Invite other members' });
      await within(share).findByAltText(/Hangout card: Ada is going/);
      return share;
    };

    afterEach(() => {
      delete navigator.canShare;
      delete navigator.share;
      delete navigator.clipboard;
    });

    test('shares the image, the invite message and the hangout link together', async () => {
      navigator.canShare = jest.fn(() => true);
      navigator.share = jest.fn(() => Promise.resolve());
      const share = await registerAda();

      fireEvent.click(within(share).getByRole('button', { name: 'Share image' }));

      await waitFor(() => expect(navigator.share).toHaveBeenCalledTimes(1));
      const [{ files, title, text }] = navigator.share.mock.calls[0];
      expect(files).toHaveLength(1);
      expect(files[0]).toBeInstanceOf(File);
      expect(files[0]).toMatchObject({ name: 'gccc-hangout-2026-ada.jpg', type: 'image/jpeg' });
      expect(title).toBe('GCCC Hangout 2026');
      expect(text).toContain("I'm playing Archery");
      expect(text).toMatch(/register here: http:\/\/localhost(:\d+)?\/hangout$/);
    });

    test('where files can’t be shared, saves the image and copies the message', async () => {
      navigator.clipboard = { writeText: jest.fn(() => Promise.resolve()) };
      const share = await registerAda();

      fireEvent.click(within(share).getByRole('button', { name: 'Share image' }));

      await waitFor(() => expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining('/hangout')));
      const { Toast } = jest.requireMock('@/lib/toastify');
      expect(Toast.success).toHaveBeenCalledWith(expect.stringContaining('Image saved and invite copied'));
    });

    test('closing the share sheet is not an error', async () => {
      navigator.canShare = jest.fn(() => true);
      navigator.share = jest.fn(() => Promise.reject(Object.assign(new Error('cancel'), { name: 'AbortError' })));
      const share = await registerAda();
      const { Toast } = jest.requireMock('@/lib/toastify');
      Toast.error.mockClear();

      fireEvent.click(within(share).getByRole('button', { name: 'Share image' }));

      await waitFor(() => expect(navigator.share).toHaveBeenCalled());
      expect(Toast.error).not.toHaveBeenCalled();
    });
  });

  test('sends the pledge and thanks the member', async () => {
    mockMutateAsync.mockResolvedValue({ data: { updated: false } });
    renderPage();
    pickGame('Paintball');
    fillDetails();
    type('WhatsApp number (optional)', '08087654321');
    type('Amount you’d like to give (optional)', '₦5,000');
    expect(screen.getByText('Thank you! You’re pledging ₦5,000.')).toBeInTheDocument();
    submit();

    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledWith(expect.objectContaining({
      whatsapp_number: '08087654321', game: 'Paintball', support_amount: 5000,
    })));
    expect(await screen.findByText('Thank you for pledging ₦5,000. Please transfer it to this account:')).toBeInTheDocument();
  });

  test('says when an existing registration was updated, and lets the member change it again', async () => {
    mockMutateAsync.mockResolvedValue({ data: { updated: true } });
    renderPage();
    pickGame('Bowling');
    fillDetails();
    submit();
    expect(await screen.findByRole('heading', { name: 'Registration updated, Ada.' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Change my registration/ }));
    expect(await screen.findByLabelText('Email address')).toHaveValue('ada@example.com');
    expect(screen.getByRole('radio', { name: /Bowling/ })).toBeChecked();
  });

  test('rejects an amount that is not a number above zero', async () => {
    renderPage();
    pickGame('Archery');
    fillDetails();
    type('Amount you’d like to give (optional)', 'five thousand');
    submit();
    expect(await screen.findByText('Enter the amount as a number, for example 5000.')).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  test('puts a server validation message on its field', async () => {
    mockMutateAsync.mockRejectedValue({ data: { errors: { phone_number: ['Enter a valid phone number.'] } } });
    renderPage();
    pickGame('Archery');
    fillDetails();
    submit();
    expect(await screen.findByText('Enter a valid phone number.')).toBeInTheDocument();
    expect(screen.getByLabelText('Phone number')).toHaveAttribute('aria-invalid', 'true');
  });

  test('a game the server no longer offers sends the member back to pick again', async () => {
    mockMutateAsync.mockRejectedValue({ data: { errors: { game: ['The selected game is invalid.'] } } });
    renderPage();
    pickGame(HANGOUT_GAMES[0].name);
    fillDetails();
    submit();
    expect(await screen.findByText('The selected game is invalid.')).toBeInTheDocument();
  });
});
