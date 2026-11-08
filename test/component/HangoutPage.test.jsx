import { fireEvent, screen, within } from '@testing-library/react';
import { render, setMatchMediaReducedMotion } from '../test-utils';
import { HelmetProvider } from 'react-helmet-async';
import HangoutPage from '@/pages/Home/HangoutPage';
import { HANGOUT_GAMES } from '@/components/hangout/hangoutGames';

// The page is public: no auth store or token is provided anywhere here.
let mockHangoutQuery = {};
jest.mock('@/queries/hangout.query', () => ({
  useHangout: () => mockHangoutQuery,
  useHangoutRegistration: () => ({ mutateAsync: jest.fn(), isPending: false }),
}));
jest.mock('@/lib/toastify', () => ({ Toast: { success: jest.fn(), error: jest.fn() } }));

const ACCOUNT = {
  account_name: 'Olajide Israel Okikiola', bank: 'Moniepoint', account_number: '9018140371', payment_description: 'GCCC Hangout 2026',
};
const apiGames = (counts = {}) => HANGOUT_GAMES.map((g) => ({ name: g.name, registrations_count: counts[g.name] ?? 0 }));
const INFO = {
  title: 'GCCC Hangout 2026',
  starts_at: '2026-11-28T10:00:00+01:00',
  registration_open: true,
  registrations_count: 0,
  games: apiGames(),
  support_account: ACCOUNT,
};
const ready = (info = {}) => { mockHangoutQuery = { isLoading: false, data: { data: { ...INFO, ...info } }, refetch: jest.fn() }; };

const renderPage = () => render(<HelmetProvider><HangoutPage /></HelmetProvider>);

beforeAll(() => {
  setMatchMediaReducedMotion(true);
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});
afterAll(() => setMatchMediaReducedMotion(false));

describe('HangoutPage', () => {
  const getHero = () => screen.getByRole('heading', { level: 1 }).closest('section');

  test('opens with the hangout, its date, time and venue', () => {
    ready();
    renderPage();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('GCCC IBHangout2026');
    const hero = getHero();
    expect(within(hero).getByText('Saturday 28 November 2026')).toBeInTheDocument();
    expect(within(hero).getByText('10:00 AM')).toBeInTheDocument();
    expect(within(hero).getByText('Agodi Gardens')).toBeInTheDocument();
    expect(within(hero).getByText('Registration is open')).toBeInTheDocument();
  });

  test('the hero shows the church family in photos, with no spinning wheel', () => {
    ready();
    renderPage();
    const hero = getHero();
    expect(within(hero).getAllByRole('img').length).toBeGreaterThanOrEqual(8);
    expect(within(hero).getAllByRole('img').every((img) => /h-auto w-full/.test(img.className))).toBe(true);
    expect(screen.queryByRole('button', { name: /spin/i })).not.toBeInTheDocument();
    expect(within(hero).getByText('10 games')).toBeInTheDocument();
  });

  test('tells the story of Agodi Gardens right after the hero', () => {
    ready();
    renderPage();
    const about = screen.getByRole('region', { name: 'About Agodi Gardens' });
    expect(about.previousElementSibling).toHaveAttribute('aria-labelledby', 'hangout-title');
    expect(within(about).getByText(/about 150 acres/)).toBeInTheDocument();
    expect(within(about).queryByText('1967')).not.toBeInTheDocument();
    expect(within(about).getByAltText('The Agodi Gardens name sign on a stone wall')).toBeInTheDocument();
    expect(within(about).getByRole('link', { name: 'Eukoha' })).toBeInTheDocument();
    expect(within(about).getByRole('button', { name: 'Play video: Agodi Gardens from the air' })).toBeInTheDocument();
    ['Mini zoo', 'The lake', 'Picnic lawns', 'Woodland walks'].forEach((name) => expect(within(about).getByText(name)).toBeInTheDocument());
  });

  test('has every section once, and no duplicate headings', () => {
    ready();
    renderPage();
    const headings = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual([
      'About Agodi Gardens', 'Pick your game', 'Register', 'Eat, drink and refresh',
      'Our church family', 'Getting to Agodi Gardens', 'Good to know',
    ]);
    expect(screen.getByTitle('Map of Agodi Gardens, Ibadan')).toBeInTheDocument();
    // The Agodi photo is in the About section only.
    expect(screen.getAllByAltText('The Agodi Gardens name sign on a stone wall')).toHaveLength(1);
  });

  test('is for church members: nothing invites first-timers, friends or "everyone"', () => {
    ready();
    const { container } = renderPage();
    expect(container.textContent).not.toMatch(/first[- ]?timers?|open to everyone|anyone can|bring (a|your) friends?|friends and family/i);
    expect(screen.getByText(/for members of GCCC Ibadan/)).toBeInTheDocument();
  });

  test('shows each game once, as the picker, with its photo', () => {
    ready();
    const { container } = renderPage();
    const radios = screen.getAllByRole('radio');
    expect(radios.map((r) => r.value)).toEqual(HANGOUT_GAMES.map((g) => g.name));
    expect(screen.getAllByText('Paintball', { selector: 'span' })).toHaveLength(1);
    expect(container.querySelector('img[src="/images/hangout/games/paintball-800.jpg"]')).toBeInTheDocument();
  });

  test('shows only the games the API offers, with how many have picked each', () => {
    ready({ games: [{ name: 'Archery', registrations_count: 4 }, { name: 'Golf Putting', registrations_count: 0 }] });
    renderPage();
    expect(screen.getAllByRole('radio').map((r) => r.value)).toEqual(['Archery', 'Golf Putting']);
    expect(screen.getByText('4 going')).toBeInTheDocument();
  });

  test('badges the most picked game', () => {
    ready({ games: apiGames({ Paintball: 12, Archery: 3 }) });
    renderPage();
    const card = screen.getByText('Most picked').closest('li');
    expect(within(card).getByText('Paintball')).toBeInTheDocument();
  });

  test('photos keep their own shape: only video thumbnails and the all-3:2 gallery are fitted to a frame', () => {
    ready();
    const { container } = renderPage();
    const gallery = screen.getByRole('region', { name: 'Our church family' });
    const fitted = [...container.querySelectorAll('img')].filter((img) => /object-cover/.test(img.className));
    expect(fitted.filter((img) => !gallery.contains(img))).toEqual([...container.querySelectorAll('img[src*="i.ytimg.com"]')]);
  });

  test('“Photos & video” opens the game window with photos, a video and its tips', async () => {
    ready();
    renderPage();
    const opener = screen.getByRole('button', { name: 'More about Paintball: photos and video' });
    fireEvent.click(opener);

    const dialog = screen.getByRole('dialog', { name: 'Paintball' });
    expect(within(dialog).getByText('Photo 1 of 3')).toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole('button', { name: 'Next photo' }));
    expect(within(dialog).getByText('Photo 2 of 3')).toBeInTheDocument();
    expect(within(dialog).getByText('Paintball is played in a mask and protective gear.')).toBeInTheDocument();

    fireEvent.click(within(dialog).getByRole('button', { name: /Play video: Paintballing in Lagos/ }));
    expect(within(dialog).getByTitle('Paintballing in Lagos for the first time')).toHaveAttribute('src', expect.stringContaining('youtube-nocookie.com/embed/jMMdQDbzcac'));

    fireEvent.click(within(dialog).getByRole('button', { name: 'Pick Paintball' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Paintball/ })).toBeChecked();
    expect(opener).toHaveFocus();
  });

  test('the game window closes on Escape', () => {
    ready();
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'More about Archery: photos and video' }));
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('credits Creative Commons photos where they appear', () => {
    ready();
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: 'More about Board Games: photos and video' }));
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByRole('link', { name: 'Dotun55' })).toHaveAttribute('href', 'https://commons.wikimedia.org/wiki/File:Girls_playing_ayo.jpg');
    expect(within(dialog).getByRole('link', { name: 'CC BY-SA 4.0' })).toBeInTheDocument();
  });

  test('lays on food, snacks, drinks and refreshments', () => {
    ready();
    renderPage();
    const section = screen.getByRole('region', { name: 'Eat, drink and refresh' });
    expect(within(section).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Food', 'Snacks', 'Drinks', 'Refreshments']);
    expect(within(section).getByRole('link', { name: 'Nimah salihu' })).toBeInTheDocument();
  });

  test('lines the church family photos up in an even grid', () => {
    ready();
    renderPage();
    const cells = within(screen.getByRole('region', { name: 'Our church family' })).getAllByRole('listitem');
    expect(cells).toHaveLength(9);
    cells.forEach((cell) => expect(cell).toHaveClass('aspect-[3/2]'));
  });

  test('has no planning committee section', () => {
    ready();
    renderPage();
    expect(screen.queryByText(/planning committee/i)).not.toBeInTheDocument();
    expect(screen.queryByText('Jesunifesimi')).not.toBeInTheDocument();
  });

  test('waits for the API before saying anything about registration, but still shows the games', () => {
    mockHangoutQuery = { isLoading: true };
    renderPage();
    expect(screen.queryByText('Registration is open')).not.toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Register' })).not.toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /^More about/ })).toHaveLength(HANGOUT_GAMES.length);
  });

  test('offers a retry when the API fails', () => {
    mockHangoutQuery = { isLoading: false, data: undefined, refetch: jest.fn() };
    renderPage();
    fireEvent.click(screen.getByRole('button', { name: /Try again/ }));
    expect(mockHangoutQuery.refetch).toHaveBeenCalled();
    expect(screen.getByRole('heading', { name: '10 games at Agodi' })).toBeInTheDocument();
  });

  test('says registration has closed, and nothing can be picked', async () => {
    ready({ registration_open: false });
    renderPage();
    expect(screen.getByText('Registration closed')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Registration has closed' })).toBeInTheDocument();
    expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'See the games' })).toBeInTheDocument();
  });
});
