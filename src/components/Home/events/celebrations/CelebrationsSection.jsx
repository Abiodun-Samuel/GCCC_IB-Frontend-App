import { memo, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import dayjs from 'dayjs';
import { Cake, CalendarHeart, Gift } from 'lucide-react';

import { BRAND_RGB, PAGE_BG } from '@/components/common/AnimatedBackground';
import { AnniversaryCard, BirthdayCard } from './CelebrationCard';

const RED = '#e84545';
const RED_RGB = '232,69,69';
const CYAN_RGB = '6,182,212';

const TABS = { BIRTHDAYS: 'birthdays', ANNIVERSARIES: 'anniversaries' };

const CelebTab = memo(({ id, Icon, label, count, active, onClick, accentRGB }) => (
  <button
    type="button"
    role="tab"
    aria-selected={active}
    aria-controls={`celeb-panel-${id}`}
    onClick={() => onClick(id)}
    className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[11px] font-bold transition-all duration-200"
    style={
      active
        ? {
            background: `linear-gradient(135deg, rgba(${accentRGB},0.22) 0%, rgba(${accentRGB},0.10) 100%)`,
            border: `1px solid rgba(${accentRGB},0.32)`,
            color: '#fff',
            boxShadow: `0 0 14px rgba(${accentRGB},0.18)`,
          }
        : {
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.36)',
          }
    }
  >
    <Icon size={11} />
    {label}
    <span
      className="flex h-[17px] min-w-[17px] items-center justify-center rounded-full px-1 text-[9px] font-black"
      style={
        active
          ? { background: `rgba(${accentRGB},0.26)`, color: '#fff' }
          : { background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.28)' }
      }
    >
      {count}
    </span>
  </button>
));
CelebTab.displayName = 'Celebrations.Tab';

const ScrollTrack = memo(({ children }) => (
  <div className="relative">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-14"
      style={{ background: `linear-gradient(to right, transparent, ${PAGE_BG}cc)` }}
    />
    <div
      className="flex gap-3 overflow-x-auto"
      style={{
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        scrollSnapType: 'x mandatory',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {children}
      <div className="w-8 shrink-0" aria-hidden="true" />
    </div>
  </div>
));
ScrollTrack.displayName = 'Celebrations.ScrollTrack';

/**
 * Birthdays and anniversaries for the current month.
 *
 * Renders nothing at all when there is nothing to celebrate — an empty
 * "Celebrations" panel is worse than no panel.
 */
const CelebrationsSection = memo(({ birthdayList = [], anniversaryList = [] }) => {
  const annEntries = useMemo(
    () =>
      anniversaryList.flatMap((person) =>
        (person.anniversaries ?? []).map((ann) => ({ ann, person }))
      ),
    [anniversaryList]
  );

  const hasBirthdays = birthdayList.length > 0;
  const hasAnniversaries = annEntries.length > 0;

  const [tab, setTab] = useState(hasBirthdays ? TABS.BIRTHDAYS : TABS.ANNIVERSARIES);

  if (!hasBirthdays && !hasAnniversaries) return null;

  const grand = birthdayList.length + annEntries.length;
  const monthLabel = dayjs().format('MMMM YYYY');

  const tabs = [
    hasBirthdays && {
      id: TABS.BIRTHDAYS,
      Icon: Cake,
      label: 'Birthdays',
      count: birthdayList.length,
      accentRGB: RED_RGB,
    },
    hasAnniversaries && {
      id: TABS.ANNIVERSARIES,
      Icon: Gift,
      label: 'Anniversaries',
      count: annEntries.length,
      accentRGB: BRAND_RGB,
    },
  ].filter(Boolean);

  const showBirthdays = tab === TABS.BIRTHDAYS && hasBirthdays;

  return (
    <section data-testid="celebrations" aria-label="Celebrations this month" className="relative w-full">
      <div
        className="relative overflow-hidden rounded-3xl"
        style={{
          background: 'rgba(255,255,255,0.028)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(22px)',
          WebkitBackdropFilter: 'blur(22px)',
        }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 2% 0%, rgba(${RED_RGB},0.050) 0%, transparent 55%), radial-gradient(ellipse 45% 55% at 100% 100%, rgba(${BRAND_RGB},0.055) 0%, transparent 55%)`,
          }}
        />

        <div
          aria-hidden="true"
          className="h-[2px] w-full shrink-0"
          style={{
            background: `linear-gradient(90deg, transparent 0%, rgba(${RED_RGB},0.60) 20%, rgba(${BRAND_RGB},0.55) 50%, rgba(${CYAN_RGB},0.48) 80%, transparent 100%)`,
          }}
        />

        <div className="relative z-10 p-5 sm:p-6 lg:p-7">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-[2px] w-3.5 rounded-full" style={{ background: RED }} />
                <span
                  className="text-[9px] font-black uppercase tracking-[0.22em]"
                  style={{ color: `rgba(${RED_RGB},0.75)` }}
                >
                  {monthLabel}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-lg font-black leading-tight tracking-tight text-white sm:text-xl">
                  Celebrations
                </h3>
                <span
                  className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[5px] text-[10px] font-black text-white/75"
                  style={{
                    background: `linear-gradient(135deg, rgba(${RED_RGB},0.14), rgba(${BRAND_RGB},0.10))`,
                    border: `1px solid rgba(${RED_RGB},0.18)`,
                  }}
                >
                  <CalendarHeart size={9} style={{ color: RED }} />
                  {grand} milestone{grand !== 1 ? 's' : ''} this month
                </span>
              </div>

              <p className="mt-0.5 text-[11px] text-white/26">
                Send heartfelt wishes to members celebrating this month
              </p>
            </div>

            {tabs.length > 1 && (
              <div
                role="tablist"
                aria-label="Celebration type"
                className="flex shrink-0 items-center gap-2 self-start sm:self-center"
              >
                {tabs.map((t) => (
                  <CelebTab key={t.id} {...t} active={tab === t.id} onClick={setTab} />
                ))}
              </div>
            )}
          </div>

          <div
            aria-hidden="true"
            className="mb-5 h-px w-full"
            style={{
              background: `linear-gradient(90deg, transparent, rgba(${RED_RGB},0.18), rgba(${BRAND_RGB},0.14), transparent)`,
            }}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={showBirthdays ? 'birthdays' : 'anniversaries'}
              id={`celeb-panel-${showBirthdays ? TABS.BIRTHDAYS : TABS.ANNIVERSARIES}`}
              role="tabpanel"
              initial={{ opacity: 0, x: showBirthdays ? -8 : 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showBirthdays ? 8 : -8 }}
              transition={{ duration: 0.18 }}
            >
              <ScrollTrack>
                {showBirthdays
                  ? birthdayList.map((p, i) => (
                      <div key={p.id} style={{ scrollSnapAlign: 'start' }}>
                        <BirthdayCard person={p} index={i} />
                      </div>
                    ))
                  : annEntries.map(({ ann, person }, i) => (
                      <div key={`${person.id}-${i}`} style={{ scrollSnapAlign: 'start' }}>
                        <AnniversaryCard anniversary={ann} person={person} index={i} />
                      </div>
                    ))}
              </ScrollTrack>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
});
CelebrationsSection.displayName = 'Celebrations.Section';

export default CelebrationsSection;
