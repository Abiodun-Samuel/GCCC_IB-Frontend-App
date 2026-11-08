import { memo, useCallback, useState } from 'react';
import { Copy, ExternalLink, Loader2, LocateFixed, Navigation } from 'lucide-react';
import { Toast } from '@/lib/toastify';
import { VENUE } from './hangoutContent';
import { CONTAINER, PRIMARY_BUTTON, SECONDARY_BUTTON, SECTION, SECTION_TITLE } from './hangoutStyles';
import { directionsUrl, mapEmbedUrl } from './hangoutUtils';

// GeolocationPositionError codes → what the person can do about it.
const GEO_ERRORS = {
  1: 'Location access is blocked. Allow it in your browser settings, or tap Open in Google Maps, which can find you itself.',
  2: "Your location couldn't be found. Check that location services are on and try again.",
  3: 'Finding your location took too long. Try again.',
};
const GEO_UNSUPPORTED = "This browser can't share your location. Tap Open in Google Maps for directions instead.";

const VenueSection = () => {
  const [origin, setOrigin] = useState(null);
  const [geo, setGeo] = useState({ status: 'idle', message: null });

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setGeo({ status: 'error', message: GEO_UNSUPPORTED });
      return;
    }
    setGeo({ status: 'locating', message: null });
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setOrigin({ lat: coords.latitude, lng: coords.longitude });
        setGeo({ status: 'ready', message: null });
      },
      (error) => setGeo({ status: 'error', message: GEO_ERRORS[error.code] ?? GEO_ERRORS[2] }),
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 5 * 60 * 1000 },
    );
  }, []);

  const copyAddress = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(`${VENUE.name}, ${VENUE.address}`);
      Toast.success('Address copied.');
    } catch {
      Toast.error("Couldn't copy the address. Select it on the page and copy it instead.");
    }
  }, []);

  const locating = geo.status === 'locating';

  return (
    <section id="venue" className={`${SECTION} bg-(--hg-surface)`} aria-labelledby="venue-title">
      <div className={CONTAINER}>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <h2 id="venue-title" className={SECTION_TITLE}>Getting to {VENUE.name}</h2>
            <address className="mt-8 not-italic">
              <p className="text-xl font-bold text-(--hg-ink)">{VENUE.name}</p>
              <p className="mt-1 text-lg text-(--hg-ink)">{VENUE.address}</p>
            </address>
            <p className="mt-4 max-w-md text-base leading-relaxed text-(--hg-muted)">{VENUE.directions}</p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button type="button" onClick={locate} disabled={locating} className={`${PRIMARY_BUTTON} px-5 py-3 text-sm`}>
                {locating ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : <LocateFixed size={16} aria-hidden="true" />}
                {locating ? 'Finding you…' : origin ? 'Update my route' : 'Show my route'}
              </button>
              <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className={SECONDARY_BUTTON}>
                <ExternalLink size={16} aria-hidden="true" />
                Open in Google Maps
              </a>
              <button type="button" onClick={copyAddress} className={SECONDARY_BUTTON}>
                <Copy size={16} aria-hidden="true" />
                Copy address
              </button>
            </div>

            <div aria-live="polite" className="mt-5 min-h-6">
              {geo.status === 'ready' && (
                <p className="flex items-start gap-2.5 text-base text-(--hg-ink)">
                  <Navigation size={18} className="mt-0.5 shrink-0 text-(--hg-brand)" aria-hidden="true" />
                  <span>The map now shows the driving route from where you are, with the distance and travel time.</span>
                </p>
              )}
              {geo.status === 'error' && <p role="alert" className="text-base text-red-600 dark:text-red-400">{geo.message}</p>}
            </div>
          </div>

          <div className="relative min-h-90 overflow-hidden rounded-4xl bg-(--hg-bg) sm:min-h-110 lg:min-h-130">
            <iframe
              key={origin ? `${origin.lat},${origin.lng}` : 'venue'}
              src={mapEmbedUrl(origin)}
              title={origin ? `Driving route from your location to ${VENUE.name}` : `Map of ${VENUE.name}, Ibadan`}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default memo(VenueSection);
