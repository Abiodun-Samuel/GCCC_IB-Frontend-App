import { useCallback, useMemo, useState } from 'react';
import PageMeta from '@/components/common/PageMeta';
import { useHangout } from '@/queries/hangout.query';
import HangoutTheme from '@/components/hangout/HangoutTheme';
import { useDisplayFont } from '@/components/hangout/useDisplayFont';
import HangoutHero from '@/components/hangout/HangoutHero';
import AboutAgodi from '@/components/hangout/AboutAgodi';
import GamesSection from '@/components/hangout/GamesSection';
import HangoutRegistration from '@/components/hangout/HangoutRegistration';
import ContinueBar from '@/components/hangout/ContinueBar';
import FoodAndDrinks from '@/components/hangout/FoodAndDrinks';
import ChurchGallery from '@/components/hangout/ChurchGallery';
import VenueSection from '@/components/hangout/VenueSection';
import HangoutFaq from '@/components/hangout/HangoutFaq';
import HangoutCredits from '@/components/hangout/HangoutCredits';
import { HANGOUT } from '@/components/hangout/hangoutContent';
import { EMPTY_FORM, resolveGames, scrollToSection, toDate } from '@/components/hangout/hangoutUtils';

/**
 * GCCC Hangout 2026 (public, /hangout), for church members. The games and
 * copy are designed in components/hangout; whether registration is open, the
 * support account and the counts come from the hangout API.
 *
 * The picked game lives here because the game cards, each game's "More
 * about" window and the registration form all use it.
 */
const HangoutPage = () => {
  useDisplayFont();
  const { data, isLoading, refetch } = useHangout();
  const info = data?.data ?? null;

  const status = isLoading ? 'loading' : info ? 'ready' : 'error';
  const open = status === 'ready' ? !!info.registration_open : null;
  const startsAt = useMemo(() => toDate(info?.starts_at) ?? toDate(HANGOUT.startsAt), [info?.starts_at]);
  const games = useMemo(() => resolveGames(info?.games), [info?.games]);

  const [selected, setSelected] = useState('');
  const [gameError, setGameError] = useState(null);
  const [result, setResult] = useState(null);
  const [defaults, setDefaults] = useState(EMPTY_FORM);

  const selectedGame = games.find((game) => game.name === selected) ?? null;
  const mode = !open ? 'view' : result ? 'locked' : 'pick';

  const pick = useCallback((name) => {
    setSelected(name);
    setGameError(null);
  }, []);
  const requireGame = useCallback((message) => {
    setGameError(message);
    scrollToSection('games');
  }, []);
  const handleRegistered = useCallback(({ updated, payload, values }) => {
    setResult({ updated, payload });
    setDefaults(values);
  }, []);
  const handleEdit = useCallback(() => setResult(null), []);

  return (
    <HangoutTheme>
      <PageMeta
        title="GCCC Hangout 2026 at Agodi Gardens | GCCC Ibadan"
        description="GCCC Ibadan members: join the church family at Agodi Gardens on Saturday 28 November 2026. Pick your game, register and enjoy food, drinks and the gardens."
      />

      <HangoutHero startsAt={startsAt} open={open} games={games} />
      <AboutAgodi />
      <GamesSection
        games={games}
        mode={mode}
        selected={selected}
        error={gameError}
        onSelect={pick}
        onRetry={refetch}
        loadFailed={status === 'error'}
      />
      <HangoutRegistration
        info={info}
        status={status}
        startsAt={startsAt}
        game={selectedGame}
        result={result}
        defaults={defaults}
        onRegistered={handleRegistered}
        onEdit={handleEdit}
        onMissingGame={requireGame}
      />
      <FoodAndDrinks />
      <ChurchGallery />
      <VenueSection />
      <HangoutFaq />
      <HangoutCredits />

      <ContinueBar gameName={selectedGame?.name} active={mode === 'pick'} />
    </HangoutTheme>
  );
};

export default HangoutPage;
