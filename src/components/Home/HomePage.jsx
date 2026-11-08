import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth.store';
import { shouldRedirectToDashboard } from '@/components/Home/shared/homeRedirect';

import HeroSection from '@/components/Home/hero/HeroSection';
import AboutSection from '@/components/Home/about/AboutSection';
import GalleryRail from '@/components/Home/gallery/GalleryRail';
import EventsSection from '@/components/Home/events/EventsSection';
import GalleryMosaic from '@/components/Home/gallery/GalleryMosaic';
import MediaHub from '@/components/Home/media/MediaHub';
import QuickActionsSection from '@/components/Home/quick-actions/QuickActionsSection';

/**
 * The public home page.
 *
 * Sections alternate dark and light on purpose: the dark sections are the
 * photographic ones and the light sections are the breathing room between them.
 *
 * Section ids #about, #events and #media are load-bearing — the site header
 * scroll-nav targets them (see layout/home/Header.jsx).
 */
const HomePage = () => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // QR codes in the building point at /?source=onsite; clock-in lives on the
  // dashboard now, so those scans are forwarded there.
  const redirectTo = shouldRedirectToDashboard(location.search);
  if (redirectTo) return <Navigate to={redirectTo} replace />;

  return (
    <main className="w-full">
      <HeroSection />
      <AboutSection />
      <GalleryRail />
      <EventsSection />
      <GalleryMosaic />
      <MediaHub isAuthenticated={isAuthenticated} user={user} />
      <QuickActionsSection />
    </main>
  );
};

export default HomePage;
