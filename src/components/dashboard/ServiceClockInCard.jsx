import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { Calendar, Check, CheckCircle2, Clock, Radio, Youtube } from 'lucide-react';

import Button from '@/components/ui/Button';
import { HandIcon } from '@/icons';
import { BRAND, BRAND_RGB } from '@/components/common/AnimatedBackground';
import { useTodaysService } from '@/queries/service.query';
import { useMarkAttendance } from '@/queries/attendance.query';
import animationData from '@/utils/animation.json';
import { resolveAttendanceSource } from '@/components/dashboard/attendanceSource';

const SERVICE_STATUS = { UPCOMING: 'upcoming', ONGOING: 'ongoing', ENDED: 'ended' };

const TEAL = '#07c4b8';

const Shell = ({ children, testId }) => (
  <section
    data-testid={testId}
    aria-label="Today&rsquo;s service"
    className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 dark:border-gray-800 dark:bg-gray-900"
  >
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full"
      style={{
        background: `radial-gradient(circle, rgba(${BRAND_RGB},0.10) 0%, transparent 70%)`,
      }}
    />
    <div className="relative z-10 flex flex-col items-center gap-6 text-center">{children}</div>
  </section>
);

const Eyebrow = ({ children }) => (
  <p className="text-[10px] font-black uppercase tracking-[0.24em]" style={{ color: BRAND }}>
    {children}
  </p>
);

const IconCircle = memo(({ icon: Icon }) => (
  <div
    className="flex h-20 w-20 items-center justify-center rounded-full"
    style={{ background: `rgba(${BRAND_RGB},0.10)` }}
  >
    <Icon size={38} style={{ color: BRAND }} strokeWidth={1.4} />
  </div>
));
IconCircle.displayName = 'ClockIn.IconCircle';

const TimeUnit = memo(({ value, label }) => (
  <div className="flex flex-col items-center gap-1.5">
    <div
      className="min-w-[62px] rounded-xl px-2 py-3 text-center"
      style={{ background: `rgba(${BRAND_RGB},0.08)` }}
    >
      <span className="text-2xl font-black tabular-nums tracking-tight text-gray-900 sm:text-3xl dark:text-white">
        {String(value).padStart(2, '0')}
      </span>
    </div>
    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-400">{label}</span>
  </div>
));
TimeUnit.displayName = 'ClockIn.TimeUnit';

const CountdownTimer = memo(({ secondsUntilStart, onRefresh }) => {
  const [left, setLeft] = useState(secondsUntilStart || 0);
  const calledRef = useRef(false);

  useEffect(() => {
    if (left <= 0) {
      // Fire the refetch exactly once when the clock runs out, then let the
      // refreshed service payload move us into the ongoing branch.
      if (!calledRef.current) {
        calledRef.current = true;
        onRefresh();
      }
      return undefined;
    }
    const id = setInterval(() => setLeft((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(id);
  }, [left, onRefresh]);

  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-1.5">
        <Clock size={11} style={{ color: BRAND }} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
          Starts In
        </span>
      </div>
      <div className="flex items-center gap-2.5">
        <TimeUnit value={h} label="Hrs" />
        <span className="mb-5 select-none text-xl font-black text-gray-300">:</span>
        <TimeUnit value={m} label="Min" />
        <span className="mb-5 select-none text-xl font-black text-gray-300">:</span>
        <TimeUnit value={s} label="Sec" />
      </div>
    </div>
  );
});
CountdownTimer.displayName = 'ClockIn.CountdownTimer';

const ClockInButton = memo(({ onClockIn, isPending }) => (
  <div className="flex flex-col items-center gap-6">
    {!isPending ? (
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full"
          style={{
            inset: -32,
            background: `radial-gradient(circle, rgba(${BRAND_RGB},0.18) 0%, transparent 62%)`,
          }}
        />
        <motion.button
          type="button"
          onClick={onClockIn}
          disabled={isPending}
          className="relative cursor-pointer rounded-full disabled:opacity-50"
          style={{
            padding: '1.9rem',
            background: `linear-gradient(135deg, ${BRAND} 0%, ${TEAL} 100%)`,
            boxShadow: `0 0 48px rgba(${BRAND_RGB},0.34), 0 8px 28px rgba(0,0,0,0.16)`,
            border: '2px solid rgba(255,255,255,0.30)',
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Clock in for today&rsquo;s service"
        >
          <HandIcon />
        </motion.button>
      </div>
    ) : (
      <Lottie animationData={animationData} loop style={{ width: 170, height: 170 }} />
    )}
    <div className="space-y-1">
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        {isPending ? 'Submitting…' : 'Tap to Clock In'}
      </p>
      <p className="text-xs text-gray-500">
        {isPending ? 'Recording your attendance…' : 'Mark your attendance for today'}
      </p>
    </div>
  </div>
));
ClockInButton.displayName = 'ClockIn.ClockInButton';

const AttendanceDetail = ({ attendance }) =>
  attendance ? (
    <div
      className="inline-flex flex-col gap-1 rounded-xl px-4 py-2.5 text-left text-xs"
      style={{ background: `rgba(${BRAND_RGB},0.07)` }}
    >
      {attendance.mode && (
        <span className="text-gray-500">
          Mode{' '}
          <span className="font-semibold capitalize" style={{ color: BRAND }}>
            {attendance.mode}
          </span>
        </span>
      )}
      {attendance.marked_at && (
        <span className="text-gray-500">
          Time{' '}
          <span className="font-semibold" style={{ color: BRAND }}>
            {attendance.marked_at}
          </span>
        </span>
      )}
    </div>
  ) : null;

const RecapLinks = memo(() => (
  <div className="flex flex-col items-center justify-center gap-2 pt-1 sm:flex-row">
    <a
      href="https://www.youtube.com/@GcccIbadan"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-85 active:scale-95"
      style={{ background: '#cc0000' }}
    >
      <Youtube size={13} />
      Watch Recap
    </a>
    <a
      href="https://t.me/gcccibadan"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold text-white transition-all hover:opacity-85 active:scale-95"
      style={{ background: BRAND }}
    >
      <Radio size={13} />
      Get Audio
    </a>
  </div>
));
RecapLinks.displayName = 'ClockIn.RecapLinks';

/**
 * Self-service attendance clock-in.
 *
 * Moved here from the public home page, which is now a purely outward-facing
 * surface. The `?source` param had to come with it: the QR codes printed for the
 * building carry it, and HomePage forwards those scans here.
 */
const ServiceClockInCard = () => {
  const [searchParams] = useSearchParams();
  const source = resolveAttendanceSource(searchParams);

  const { data, isLoading, isError, refetch } = useTodaysService();
  const { mutate, isPending, isSuccess } = useMarkAttendance();

  const {
    service,
    service_status: status,
    seconds_until_start: secondsUntilStart,
    can_mark: canMark,
    attendance,
  } = data || {};

  const handleRefresh = useCallback(() => refetch(), [refetch]);

  const handleClockIn = useCallback(
    (e) => {
      e.preventDefault();
      if (!service?.id) return;
      mutate({ service_id: service.id, mode: source, status: 'present' });
    },
    [service?.id, source, mutate]
  );

  if (isLoading) {
    return (
      <Shell testId="clockin-loading">
        <Lottie animationData={animationData} loop style={{ width: 170, height: 170 }} />
        <p className="text-xs text-gray-500">Loading today&rsquo;s service…</p>
      </Shell>
    );
  }

  if (isError || !status) {
    return (
      <Shell testId="clockin-no-service">
        <IconCircle icon={Calendar} />
        <div className="space-y-2">
          <p className="text-base font-bold text-gray-900 dark:text-white">No Service Today</p>
          <p className="mx-auto max-w-[240px] text-xs leading-relaxed text-gray-500">
            No service is scheduled right now. Stay connected through our platforms.
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button
            startIcon={<Youtube />}
            variant="danger"
            href="https://www.youtube.com/@GcccIbadan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch on YouTube
          </Button>
          <Button
            startIcon={<Radio />}
            href="https://t.me/gcccibadan"
            target="_blank"
            rel="noopener noreferrer"
          >
            Telegram
          </Button>
        </div>
      </Shell>
    );
  }

  if (status === SERVICE_STATUS.UPCOMING) {
    return (
      <Shell testId="clockin-countdown">
        <Eyebrow>Today&rsquo;s Service</Eyebrow>
        <p className="text-lg font-bold text-gray-900 dark:text-white">
          {service?.name || 'GCCC Ibadan'}
        </p>
        <CountdownTimer secondsUntilStart={secondsUntilStart || 0} onRefresh={handleRefresh} />
      </Shell>
    );
  }

  if (status === SERVICE_STATUS.ENDED) {
    return (
      <Shell testId="clockin-ended">
        <IconCircle icon={Clock} />
        <div className="space-y-2">
          <p className="text-base font-bold text-gray-900 dark:text-white">Service Has Ended</p>
          <p className="mx-auto max-w-[240px] text-xs leading-relaxed text-gray-500">
            {service?.name || 'The service'} has ended. The attendance window is now closed.
          </p>
          {attendance ? (
            <div
              className="inline-block rounded-xl px-4 py-2.5 text-left text-xs"
              style={{ background: `rgba(${BRAND_RGB},0.07)` }}
            >
              <p className="flex items-center gap-1.5 font-semibold" style={{ color: BRAND }}>
                <Check size={11} />
                You marked your attendance
              </p>
              {attendance.marked_at && (
                <p className="mt-0.5 text-gray-500">{attendance.marked_at}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-gray-400">Attendance was not recorded.</p>
          )}
        </div>
        <RecapLinks />
      </Shell>
    );
  }

  // Ongoing. `isSuccess` covers the moment right after a successful mutation,
  // before the service query has refetched and cleared `can_mark`.
  const recorded = isSuccess || (Boolean(data) && !canMark && Boolean(attendance));

  if (recorded) {
    return (
      <Shell testId="clockin-recorded">
        <div
          className="flex h-20 w-20 items-center justify-center rounded-full"
          style={{ background: `rgba(${BRAND_RGB},0.10)` }}
        >
          <CheckCircle2 size={40} style={{ color: BRAND }} strokeWidth={1.4} />
        </div>
        <div className="space-y-2">
          <p className="text-base font-bold text-gray-900 dark:text-white">Attendance Recorded</p>
          <p className="mx-auto max-w-[240px] text-xs leading-relaxed text-gray-500">
            Your presence has been recorded. Thank you for being here today.
          </p>
          <AttendanceDetail attendance={attendance} />
        </div>
      </Shell>
    );
  }

  return (
    <Shell testId="clockin-active">
      <Eyebrow>Today&rsquo;s Service</Eyebrow>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {service?.name || 'GCCC Ibadan'}
      </p>
      <ClockInButton onClockIn={handleClockIn} isPending={isPending} />
    </Shell>
  );
};

export default memo(ServiceClockInCard);
