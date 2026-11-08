import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowUpRight, Calendar } from 'lucide-react';

import AnimatedBackground, {
  BRAND,
  BRAND_RGB,
  PAGE_BG,
} from '@/components/common/AnimatedBackground';
import ConfettiShower from '@/components/dashboard/ConfettiShower';
import { SECTION_SPACING } from '@/utils/constant';
import Reveal from '@/components/Home/shared/Reveal';
import SectionHeader from '@/components/Home/shared/SectionHeader';
import { useClosestEvent, useEvents } from '@/queries/events.query';
import { useCoreAppData } from '@/queries/service.query';
import { useAuthStore } from '@/store/auth.store';

import EventCard from './EventCard';
import EventsIndex from './EventsIndex';
import { FeaturedSkeleton } from './EventSkeletons';
import CelebrationsSection from './celebrations/CelebrationsSection';

const IndexSkeleton = () => (
  <div data-testid="events-index-skeleton" className="animate-pulse">
    {[0, 1, 2].map((i) => (
      <div
        key={i}
        className="flex items-center gap-8 border-t py-7"
        style={{ borderColor: 'rgba(255,255,255,0.10)' }}
      >
        <div className="h-3 w-8 rounded bg-white/10" />
        <div className="h-3 w-28 rounded bg-white/10" />
        <div className="h-5 flex-1 rounded bg-white/10" />
      </div>
    ))}
  </div>
);

const ViewAllLink = () => (
  <Link
    to="/dashboard/events"
    className="inline-flex items-center gap-1.5 text-xs font-bold transition-opacity hover:opacity-80"
    style={{ color: BRAND }}
  >
    All Events
    <ArrowUpRight size={14} />
  </Link>
);

/**
 * Events.
 *
 * One event gets the large photographic treatment: whatever is live right now,
 * or the next one up if nothing is. Everything else is an index, not a grid of
 * cards — a list of facts with the photography carried by a cursor preview.
 */
const EventsSection = () => {
  const { isAuthenticated } = useAuthStore();

  const {
    data: closestData,
    isLoading: featuredLoading,
    isError: featuredError,
  } = useClosestEvent();

  const { data: listData, isLoading: listLoading, isError: listError } = useEvents({ per_page: 8 });

  // Internally gated on isAuthenticated, so guests fire no request.
  const { data: coreData } = useCoreAppData();
  const { birthday_list: birthdayList = [], anniversary_list: anniversaryList = [] } =
    coreData || {};

  const hasCelebrations =
    birthdayList.length > 0 || anniversaryList.some((p) => p.anniversaries?.length);

  const all = useMemo(() => {
    const list = listData?.data;
    return Array.isArray(list) ? list : [];
  }, [listData]);

  // A live event always wins the feature slot. Otherwise promote the closest
  // upcoming one, so the slot is never empty while events exist.
  const featured = useMemo(() => {
    const live = all.find((e) => e.status === 'ongoing');
    if (live) return live;

    const closest = closestData?.data ?? null;
    if (closest) return closest;

    return all.find((e) => e.status !== 'past') ?? null;
  }, [all, closestData]);

  const upcoming = useMemo(
    () => all.filter((e) => e.id !== featured?.id && e.status !== 'past'),
    [all, featured?.id]
  );

  const isLive = featured?.status === 'ongoing';

  const renderFeatured = () => {
    if (featuredLoading || listLoading) return <FeaturedSkeleton />;

    if (featuredError && !featured) {
      return (
        <div
          data-testid="featured-error"
          className="flex flex-col items-center justify-center rounded-2xl p-12 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <AlertCircle size={28} style={{ color: '#f87171' }} className="mb-3" />
          <p className="text-sm font-bold text-white">Could not load the next event</p>
          <p className="mt-1 text-xs text-white/30">Try refreshing the page.</p>
        </div>
      );
    }

    if (!featured) {
      return (
        <div
          data-testid="featured-empty"
          className="flex flex-col items-center justify-center rounded-2xl p-16 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{
              background: `rgba(${BRAND_RGB},0.07)`,
              border: `1px solid rgba(${BRAND_RGB},0.10)`,
            }}
          >
            <Calendar size={24} style={{ color: `rgba(${BRAND_RGB},0.35)` }} strokeWidth={1.3} />
          </div>
          <p className="mb-1.5 text-sm font-bold text-white">Nothing Scheduled</p>
          <p className="max-w-[240px] text-xs leading-relaxed text-white/30">
            No event is on the calendar right now. Check back soon.
          </p>
        </div>
      );
    }

    return <EventCard event={featured} />;
  };

  return (
    <section
      id="events"
      className={`relative w-full overflow-hidden ${SECTION_SPACING}`}
      style={{ backgroundColor: PAGE_BG }}
    >
      <AnimatedBackground withBaseBg />
      {isAuthenticated && hasCelebrations && <ConfettiShower duration={15} />}

      <div className="container relative z-10 mx-auto flex flex-col gap-16 px-4 sm:gap-20">
        <div>
          <SectionHeader
            tone="dark"
            eyebrow={isLive ? 'Happening Now' : 'What Is On'}
            titleLead={isLive ? 'Live' : 'Gather With'}
            titleAccent={isLive ? 'Right Now' : 'Us'}
            subtitle="Services, conferences and everything else happening at GCCC Ibadan."
            action={isAuthenticated ? <ViewAllLink /> : null}
          />

          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <Reveal className="lg:col-span-5">{renderFeatured()}</Reveal>

            <div className="lg:col-span-7">
              <div className="mb-6 flex items-baseline justify-between gap-4">
                <h3 className="text-[10px] font-black uppercase tracking-[0.24em] text-white/40">
                  Coming Up
                </h3>
                {!listLoading && !listError && upcoming.length > 0 && (
                  <span className="text-[11px] font-black tabular-nums text-white/25">
                    {String(upcoming.length).padStart(2, '0')}
                  </span>
                )}
              </div>

              {listLoading && <IndexSkeleton />}

              {!listLoading && listError && (
                <div
                  data-testid="events-index-error"
                  className="rounded-2xl p-8 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <p className="text-xs text-white/40">Could not load upcoming events.</p>
                </div>
              )}

              {!listLoading && !listError && upcoming.length > 0 && (
                <EventsIndex events={upcoming} />
              )}

              {!listLoading && !listError && upcoming.length === 0 && (
                <p
                  data-testid="events-index-empty"
                  className="border-t py-8 text-sm text-white/30"
                  style={{ borderColor: 'rgba(255,255,255,0.10)' }}
                >
                  Nothing else on the calendar yet.
                </p>
              )}
            </div>
          </div>
        </div>

        {isAuthenticated && (
          <CelebrationsSection birthdayList={birthdayList} anniversaryList={anniversaryList} />
        )}
      </div>
    </section>
  );
};

export default memo(EventsSection);
