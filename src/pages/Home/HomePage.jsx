import { useCallback, useEffect, useState, useRef, memo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from "lottie-react";
import dayjs from "dayjs";

// Components
import Animated from "@/components/common/Animated";
import Button from "@/components/ui/Button";
import HomepageComponentCard from "@/components/common/HomepageComponentCard";
import Avatar from "@/components/ui/Avatar";
import ConfettiShower from "@/components/dashboard/ConfettiShower";

// Icons
import {
  BookIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  HandIcon,
  SparklesIcon,
  TelegramIcon,
  YoutubeIcon
} from "@/icons";

import {
  Heart,
  Briefcase,
  Cross,
  Church,
  Droplets,
  Users,
  Target,
  Calendar,
  Clock
} from 'lucide-react';

// Hooks & Utils
import { useMarkAttendance } from "@/queries/attendance.query";
import { useCoreAppData, useTodaysService } from "@/queries/service.query";
import { useAuthStore } from "@/store/auth.store";
import { generateInitials } from "@/utils/helper";
import { bibleVerses } from "@/utils/data";
import animationData from '../../utils/animation.json';

// ============= CONSTANTS =============
const ATTENDANCE_SOURCES = {
  ONLINE: 'online',
  ONSITE: 'onsite',
};

const SERVICE_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  ENDED: 'ended',
};

// Consistent color scheme from birthday card
const THEME = {
  gradient: {
    background: 'from-pink-500/10 to-purple-500/10',
    glow: 'from-pink-500/20 via-purple-500/20 to-blue-500/20',
    border: 'border-pink-400/20',
  },
  colors: {
    primary: 'pink-300',
    secondary: 'purple-400',
    accent: 'blue-400',
  }
};

// ============= SHARED COMPONENTS =============
const AnimatedGlow = memo(() => (
  <motion.div
    className={`absolute -inset-1 bg-gradient-to-r ${THEME.gradient.glow} rounded-2xl blur-xl`}
    animate={{ opacity: [0.5, 0.8, 0.5] }}
    transition={{
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  />
));
AnimatedGlow.displayName = 'AnimatedGlow';

const Card = memo(({ children, className = "" }) => (
  <div className="relative group">
    <AnimatedGlow />
    <div className={`relative px-6 py-5 rounded-2xl bg-gradient-to-br ${THEME.gradient.background} backdrop-blur-sm border ${THEME.gradient.border} shadow-lg ${className}`}>
      {children}
    </div>
  </div>
));
Card.displayName = 'Card';

const IconWrapper = memo(({ icon: Icon, animated = false, bgColor = "pink-400/20", iconColor = "pink-300" }) => {
  const content = (
    <div className={`p-2 rounded-lg bg-${bgColor}`}>
      <Icon className={`w-5 h-5 text-${iconColor}`} />
    </div>
  );

  if (!animated) return <div className="shrink-0">{content}</div>;

  return (
    <div className="shrink-0">
      <motion.div
        animate={{
          rotate: [0, 10, -10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {content}
      </motion.div>
    </div>
  );
});
IconWrapper.displayName = 'IconWrapper';

// ============= GREETING CONTAINER =============
const GreetingContainer = memo(({ userName }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    <Card>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <IconWrapper icon={SparklesIcon} animated bgColor="purple-400/20" iconColor="purple-300" />

          <div className="flex-1 min-w-0">
            <motion.h1
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-lg sm:text-xl font-bold text-white tracking-tight truncate"
            >
              Hello 👋, {userName ?? 'Friend'}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-sm text-white/60 mt-0.5"
            >
              Welcome to GCCC Ibadan.
            </motion.p>
          </div>
        </div>

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="shrink-0"
        >
          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 shadow-lg shadow-pink-400/50" />
        </motion.div>
      </div>
    </Card>
  </motion.div>
));
GreetingContainer.displayName = 'GreetingContainer';

// ============= BIBLE VERSE CARD =============
const BibleVerseCard = memo(() => {
  const [currentVerse] = useState(() =>
    bibleVerses[Math.floor(Math.random() * bibleVerses.length)]
  );

  return (
    <Animated
      animation="fade-up"
      duration={0.6}
      delay={0.5}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <Card>
        <div className="flex items-start gap-4">
          <IconWrapper icon={BookIcon} />
          <div className="flex-1 space-y-2">
            <p className="text-xs font-semibold text-pink-300 uppercase tracking-wider">
              {currentVerse.verse}
            </p>
            <p className="text-sm text-white/80 leading-relaxed italic">
              "{currentVerse.text}"
            </p>
          </div>
        </div>
      </Card>
    </Animated>
  );
});
BibleVerseCard.displayName = 'BibleVerseCard';

// ============= MAIN CONTAINER WRAPPER =============
const MainContainer = memo(({ children }) => (
  <Animated
    animation="fade-up"
    duration={0.6}
    delay={0.2}
    className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
  >
    <div className="px-4 relative sm:px-6 py-8 rounded-3xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 backdrop-blur-sm border border-pink-400/10 shadow-2xl shadow-black/20">
      <div className="flex justify-center mb-8">
        <img className="h-10" src='/images/logo/gccc.png' alt="GCCC Logo" />
      </div>
      {children}
    </div>
  </Animated>
));
MainContainer.displayName = 'MainContainer';

// ============= SEO TEXT =============
const SEOText = memo(({ scenario, serviceName }) => {
  const seoContent = {
    none: "There is no church service scheduled today, but the Lord is always near. Stay connected with us through our online platforms.",
    upcoming: `Get ready! ${serviceName} begins very soon. Prepare your heart for worship and fellowship.`,
    ongoing: `${serviceName} is currently in progress. Join us in worship and receive the Word of God.`,
    marked: "Thank you for marking your presence! Your faithfulness in fellowshipping with fellow believers honors God.",
    ended: `${serviceName} has ended. We hope you were blessed by today's service. Stay connected for upcoming services.`
  };

  const content = seoContent[scenario] || seoContent.none;

  return (
    <p className="text-sm sm:text-base text-white/70 leading-relaxed text-center px-4 max-w-xl mx-auto">
      {content}
    </p>
  );
});
SEOText.displayName = 'SEOText';

// ============= COUNTDOWN TIMER =============
const TimeUnit = memo(({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="relative">
      <div className="absolute inset-0 bg-pink-500/10 blur-lg rounded-2xl" />
      <div className={`relative bg-gradient-to-br ${THEME.gradient.background} backdrop-blur-md rounded-xl px-4 py-3 sm:px-6 sm:py-4 border border-white/10 shadow-lg`}>
        <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
    </div>
    <span className="text-xs text-white/50 mt-1.5 font-medium uppercase tracking-wide">
      {label}
    </span>
  </div>
));
TimeUnit.displayName = 'TimeUnit';

const CountdownTimer = memo(({ secondsUntilStart, onRefresh }) => {
  const [timeLeft, setTimeLeft] = useState(secondsUntilStart || 0);
  const hasRefetchedRef = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!hasRefetchedRef.current) {
        hasRefetchedRef.current = true;
        onRefresh();
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onRefresh]);

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="w-full space-y-4">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 mb-3">
          <ClockIcon className={`w-5 h-5 text-${THEME.colors.primary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Service Starts In
          </h3>
        </div>
      </div>

      <div className="flex justify-center items-center gap-2 sm:gap-4">
        <TimeUnit value={hours} label="Hours" />
        <span className="text-2xl sm:text-3xl font-bold text-white/30 pb-6">:</span>
        <TimeUnit value={minutes} label="Minutes" />
        <span className="text-2xl sm:text-3xl font-bold text-white/30 pb-6">:</span>
        <TimeUnit value={seconds} label="Seconds" />
      </div>

      {timeLeft <= 0 && (
        <div className="text-center pt-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/20 border border-pink-400/30`}
          >
            <div className="w-2 h-2 rounded-full bg-pink-400" />
            <span className="text-sm text-pink-300 font-medium">
              Checking service status...
            </span>
          </motion.div>
        </div>
      )}
    </div>
  );
});
CountdownTimer.displayName = 'CountdownTimer';

// ============= CLOCK IN BUTTON =============
const ClockInButton = memo(({ onClockIn, isPending }) => (
  <div className="space-y-6 w-full">
    <div className="flex flex-col items-center space-y-5">
      {!isPending ? (
        <div className="bg-purple-600/30 rounded-full">
          <motion.button
            onClick={onClockIn}
            disabled={isPending}
            className="rounded-full bg-gradient-to-br from-pink-500 to-purple-500 p-9 cursor-pointer relative disabled:opacity-50 disabled:cursor-not-allowed"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1.1 }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: 1.5,
              ease: 'easeInOut',
            }}
            aria-label="Clock in for attendance"
          >
            <HandIcon height={150} width={150} />
          </motion.button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
          <Lottie
            animationData={animationData}
            loop
            style={{ width: 180, height: 180 }}
            className="relative z-10"
          />
        </div>
      )}

      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2">
          <ClockIcon className={`w-5 h-5 text-${THEME.colors.primary}`} />
          <p className="text-lg font-bold text-white">
            {isPending ? 'Submitting...' : 'Tap to Clock In'}
          </p>
        </div>
        <p className="text-sm text-white/70 max-w-md mx-auto px-4">
          {isPending ? 'Recording your attendance...' : "Mark your attendance for today's service"}
        </p>
      </div>
    </div>
  </div>
));
ClockInButton.displayName = 'ClockInButton';

// ============= ATTENDANCE RECORDED STATE =============
const AttendanceRecordedState = memo(({ attendance }) => (
  <div className="space-y-6 w-full">
    <div className="flex flex-col items-center space-y-5">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-full" />
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className={`relative z-10 bg-gradient-to-br ${THEME.gradient.background} backdrop-blur-sm rounded-full p-6 border-4 ${THEME.gradient.border}`}
        >
          <CheckIcon className={`w-16 h-16 sm:w-20 sm:h-20 text-${THEME.colors.primary}`} />
        </motion.div>
      </div>

      <div className="text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <CalendarIcon className={`w-5 h-5 text-${THEME.colors.primary}`} />
          <h3 className="text-lg sm:text-xl font-bold text-white">
            Attendance Recorded!
          </h3>
        </div>
        <p className="text-sm text-white/70 max-w-md mx-auto px-4">
          Your attendance has been successfully recorded. Thank you!
        </p>

        {attendance && (
          <div className={`inline-flex flex-col gap-1.5 px-5 py-2.5 rounded-lg bg-white/5 border ${THEME.gradient.border}`}>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className={`font-semibold text-${THEME.colors.primary}`}>Mode:</span>
              <span className="capitalize">{attendance.mode}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/60">
              <span className={`font-semibold text-${THEME.colors.primary}`}>Time:</span>
              <span>{attendance.marked_at}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
));
AttendanceRecordedState.displayName = 'AttendanceRecordedState';

// ============= CAKE ICON =============
const CakeIcon = memo(({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
  </svg>
));
CakeIcon.displayName = 'CakeIcon';

// ============= BIRTHDAY CARD COMPONENT =============
const BirthdayPersonCard = memo(({ person, index }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.1 * index, duration: 0.4 }}
    className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
  >
    <Avatar
      src={person.avatar}
      name={generateInitials(`${person.first_name} ${person.last_name}`)}
      size="md"
    />
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-white truncate">
        {person.first_name} {person.last_name}
      </p>
      <p className="text-xs text-white/50">
        Wishing you a blessed day! 🎂
      </p>
      <p className="text-xs text-white/50">
        <b>Date: </b> {dayjs(person?.date_of_birth).format('DD MMM')}
      </p>
    </div>
    <motion.div
      animate={{ scale: [1, 1.2, 1] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="shrink-0"
    >
      <span className="text-2xl">🎈</span>
    </motion.div>
  </motion.div>
));
BirthdayPersonCard.displayName = 'BirthdayPersonCard';

const BirthdayCard = memo(({ birthdayList }) => {
  if (!birthdayList || birthdayList.length === 0) return null;

  return (
    <Animated
      animation="fade-up"
      duration={0.6}
      delay={0.6}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <Card>
        <div className="flex items-start gap-4 mb-4">
          <IconWrapper icon={CakeIcon} animated />
          <div className="flex-1">
            <h3 className={`text-sm font-semibold text-${THEME.colors.primary} uppercase tracking-wider mb-1`}>
              🎉 Birthday Celebrations
            </h3>
            <p className="text-xs text-white/70">
              Let's celebrate our beloved brothers and sisters on their special day!
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {birthdayList.map((person, index) => (
            <BirthdayPersonCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </Card>
    </Animated>
  );
});
BirthdayCard.displayName = 'BirthdayCard';

// Anniversary type labels
const ANNIVERSARY_LABELS = {
  wedding: 'Wedding Anniversary',
  work: 'Work Anniversary',
  salvation: 'Salvation Date',
  ordination: 'Ordination Date',
  baptism: 'Baptism Date',
  membership: 'Membership Date',
  custom: 'Custom',
};

// Helper: Calculate years since
const calculateYearsSince = (date) => {
  if (!date) return 0;
  const anniversaryDate = new Date(date);
  const today = new Date();
  let years = today.getFullYear() - anniversaryDate.getFullYear();
  const monthDiff = today.getMonth() - anniversaryDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < anniversaryDate.getDate())) {
    years--;
  }
  return years;
};

// Helper: Calculate days until next occurrence
const calculateDaysUntil = (date) => {
  if (!date) return null;
  const anniversaryDate = new Date(date);
  const today = new Date();

  let nextOccurrence = new Date(
    today.getFullYear(),
    anniversaryDate.getMonth(),
    anniversaryDate.getDate()
  );

  if (nextOccurrence < today) {
    nextOccurrence.setFullYear(today.getFullYear() + 1);
  }

  const diffTime = nextOccurrence - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

// Helper: Format date
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  });
};

// Anniversary type icons mapping (Lucide React)
const ANNIVERSARY_ICONS = {
  wedding: Heart,
  work: Briefcase,
  salvation: Cross,
  ordination: Church,
  baptism: Droplets,
  membership: Users,
  custom: Target,
};

// Anniversary type colors
const ANNIVERSARY_COLORS = {
  wedding: 'text-pink-500 bg-pink-500/10',
  work: 'text-blue-500 bg-blue-500/10',
  salvation: 'text-purple-500 bg-purple-500/10',
  ordination: 'text-indigo-500 bg-indigo-500/10',
  baptism: 'text-cyan-500 bg-cyan-500/10',
  membership: 'text-green-500 bg-green-500/10',
  custom: 'text-orange-500 bg-orange-500/10',
};


// Helper: Get ordinal suffix
const getOrdinalSuffix = (num) => {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return num + 'st';
  if (j === 2 && k !== 12) return num + 'nd';
  if (j === 3 && k !== 13) return num + 'rd';
  return num + 'th';
};

// Single Anniversary Item Component
const AnniversaryItem = memo(({ anniversary, person, index }) => {
  const yearsSince = calculateYearsSince(anniversary.date);
  const daysUntil = calculateDaysUntil(anniversary.date);
  const isToday = daysUntil === 0;
  const isUpcoming = daysUntil > 0 && daysUntil <= 7;

  const Icon = ANNIVERSARY_ICONS[anniversary.type] || Target;
  const iconColors = ANNIVERSARY_COLORS[anniversary.type] || ANNIVERSARY_COLORS.custom;
  const typeLabel = ANNIVERSARY_LABELS[anniversary.type] || anniversary.type;

  return (
    <Animated
      animation="fade-up"
      duration={0.4}
      delay={0.1 * index}
      className="group"
    >
      <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300">
        {/* Avatar Section */}
        <div className="relative flex-shrink-0">
          <Avatar
            src={person.avatar}
            name={generateInitials(`${person.first_name} ${person.last_name}`)}
            size="md"
          />


          {/* Anniversary Type Badge */}
          <div className={`absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center shadow-lg border border-white/20 ${iconColors}`}>
            <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
          </div>
        </div>

        {/* Info Section */}
        <div className="flex-1 min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2 mb-1.5 sm:mb-2">
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold text-white truncate">
                {person.first_name} {person.last_name}
              </h4>
              <p className="text-xs text-white/60 truncate mt-0.5">
                {anniversary.title || typeLabel}
              </p>
            </div>

            {/* Badge - Responsive */}
            <div className="flex-shrink-0">
              {isToday ? (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full shadow-lg animate-pulse whitespace-nowrap">
                  Today! 🎉
                </span>
              ) : isUpcoming ? (
                <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium text-blue-300 bg-blue-500/20 rounded-full border border-blue-400/30 whitespace-nowrap">
                  {daysUntil}d
                </span>
              ) : null}
            </div>
          </div>

          {/* Details Row - Responsive Layout */}
          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-1 text-[10px] sm:text-xs text-white/50">
            {/* Date */}
            <span className="flex items-center gap-1 whitespace-nowrap">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{formatDate(anniversary.date)}</span>
            </span>

            {/* Years Since */}
            {yearsSince > 0 && (
              <span className="flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3 h-3 flex-shrink-0" />
                <span>{getOrdinalSuffix(yearsSince)}</span>
              </span>
            )}

            {/* Type Label */}
            <span className="flex items-center gap-1">
              <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
              <span className="truncate hidden sm:inline">{typeLabel}</span>
              <span className="truncate sm:hidden">
                {typeLabel.split(' ')[0]}
              </span>
            </span>
          </div>
        </div>
      </div>
    </Animated>
  );
});
AnniversaryItem.displayName = 'AnniversaryItem';

// Person Anniversary Card - Shows all anniversaries for one person
const PersonAnniversaryCard = memo(({ person, index }) => {
  if (!person.anniversaries || person.anniversaries.length === 0) return null;

  return (
    <div className="space-y-2">
      {person.anniversaries.map((anniversary, annIndex) => (
        <AnniversaryItem
          key={`${person.id}-${annIndex}`}
          anniversary={anniversary}
          person={person}
          index={index + annIndex}
        />
      ))}
    </div>
  );
});
PersonAnniversaryCard.displayName = 'PersonAnniversaryCard';

// Main Anniversary Card Component
const AnniversaryCard = memo(({ anniversaryList }) => {
  if (!anniversaryList || anniversaryList.length === 0) return null;

  // Calculate total anniversaries count
  const totalAnniversaries = anniversaryList.reduce(
    (sum, person) => sum + (person.anniversaries?.length || 0),
    0
  );

  return (
    <Animated
      animation="fade-up"
      duration={0.6}
      delay={0.6}
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <Card>
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <IconWrapper icon={CakeIcon} animated />
          <div className="flex-1 min-w-0">
            <h3
              className={`text-sm font-semibold text-${THEME.colors.primary} uppercase tracking-wider mb-1`}
            >
              🎊 Special Anniversaries
            </h3>
            <p className="text-xs text-white/70">
              Celebrating {totalAnniversaries} special{' '}
              {totalAnniversaries === 1 ? 'milestone' : 'milestones'} with our beloved family!
            </p>
          </div>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {anniversaryList.map((person, index) => (
            <PersonAnniversaryCard key={person.id} person={person} index={index} />
          ))}
        </div>
      </Card>
    </Animated>
  );
});
AnniversaryCard.displayName = 'AnniversaryCard';

// ============= SERVICE ENDED STATE =============
const ServiceEndedState = memo(({ serviceName, attendance }) => (
  <div className="space-y-6 w-full">
    <div className="flex flex-col items-center space-y-5">
      <div className="relative">
        <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-full" />
        <div className={`relative z-10 bg-gradient-to-br ${THEME.gradient.background} backdrop-blur-sm rounded-full p-6 border-4 ${THEME.gradient.border}`}>
          <ClockIcon className={`w-16 h-16 sm:w-20 sm:h-20 text-${THEME.colors.primary}`} />
        </div>
      </div>

      <div className="text-center space-y-3">
        <h3 className="text-lg sm:text-xl font-bold text-white">
          Service Has Ended
        </h3>
        <p className="text-sm text-white/70 max-w-md mx-auto px-4">
          {serviceName} has ended. The attendance window is now closed.
        </p>

        {attendance ? (
          <div className={`inline-flex flex-col gap-1.5 px-5 py-2.5 rounded-lg bg-white/5 border ${THEME.gradient.border}`}>
            <p className={`text-sm text-${THEME.colors.primary} font-semibold`}>✓ You marked your attendance</p>
            <div className="text-xs text-white/50">
              {attendance.marked_at}
            </div>
          </div>
        ) : (
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white/5 border ${THEME.gradient.border}`}>
            <span className={`text-sm text-${THEME.colors.primary}`}>Attendance was not recorded</span>
          </div>
        )}
      </div>
    </div>
  </div>
));
ServiceEndedState.displayName = 'ServiceEndedState';

// ============= ACTION BUTTONS =============
const ActionButtons = memo(() => (
  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
    <Button
      variant="danger"
      href="https://youtube.com/@gccc_ibadan"
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<YoutubeIcon className="w-4 h-4" />}
    >
      Watch on YouTube
    </Button>
    <Button
      variant="primary"
      href="https://t.me/Pastoropeyemipeter"
      target="_blank"
      startIcon={<TelegramIcon className="w-4 h-4" />}
      rel="noopener noreferrer"
    >
      Download on Telegram
    </Button>
  </div>
));
ActionButtons.displayName = 'ActionButtons';

const RecapButtons = memo(() => (
  <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
    <Button
      variant="danger"
      href="https://youtube.com/@gccc_ibadan"
      target="_blank"
      rel="noopener noreferrer"
      startIcon={<YoutubeIcon className="w-4 h-4" />}
    >
      Watch Recap
    </Button>
    <Button
      variant="primary"
      href="https://t.me/Pastoropeyemipeter"
      target="_blank"
      startIcon={<TelegramIcon className="w-4 h-4" />}
      rel="noopener noreferrer"
    >
      Get Audio Message
    </Button>
  </div>
));
RecapButtons.displayName = 'RecapButtons';

// ============= SERVICE HEADER =============
const ServiceHeader = memo(({ service, isLive = false }) => (
  <div className="text-center space-y-1">
    <h2 className="text-xl sm:text-2xl font-semibold text-white">
      {service?.name || 'Service'}{isLive && ' is Live'}
    </h2>
    {service?.description && (
      <p className="text-sm text-white/60">{service.description}</p>
    )}
  </div>
));
ServiceHeader.displayName = 'ServiceHeader';

// ============= CONTENT COMPONENTS =============
const LoadingContent = memo(() => (
  <MainContainer>
    <div className="flex flex-col items-center space-y-6">
      <Animated
        animation="zoom-in"
        duration={0.5}
        delay={0.2}
        className="relative"
      >
        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
        <Lottie
          animationData={animationData}
          loop
          style={{ width: 200, height: 200 }}
          className="relative z-10"
        />
      </Animated>
      <div className="text-center space-y-1">
        <p className="text-base font-medium text-white">Loading service information...</p>
        <p className="text-sm text-white/60">Please wait</p>
      </div>
    </div>
  </MainContainer>
));
LoadingContent.displayName = 'LoadingContent';

const NoServiceContent = memo(() => (
  <MainContainer>
    <div className="flex flex-col space-y-8">
      <Animated animation="fade-up" duration={0.6} delay={0.2} className="space-y-6 w-full">
        <div className="flex flex-col items-center space-y-6">
          <div className="relative">
            <div className="absolute inset-0 bg-pink-500/10 blur-xl rounded-full" />
            <div className={`relative z-10 bg-gradient-to-br ${THEME.gradient.background} backdrop-blur-sm rounded-full p-6 border-4 ${THEME.gradient.border} mx-auto w-fit`}>
              <CalendarIcon className={`w-16 h-16 sm:w-20 sm:h-20 text-${THEME.colors.primary}`} />
            </div>
          </div>

          <div className="text-center space-y-3">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              No Service Scheduled Today
            </h2>
            <SEOText scenario="none" />
          </div>
        </div>
      </Animated>

      <Animated animation="fade-up" duration={0.6} delay={0.3}>
        <ActionButtons />
      </Animated>
    </div>
  </MainContainer>
));
NoServiceContent.displayName = 'NoServiceContent';

const UpcomingServiceContent = memo(({ service, secondsUntilStart, onRefresh }) => (
  <MainContainer>
    <div className="flex flex-col space-y-8">
      <ServiceHeader service={service} />
      <CountdownTimer secondsUntilStart={secondsUntilStart || 0} onRefresh={onRefresh} />
      <SEOText scenario="upcoming" serviceName={service?.name} />
    </div>
  </MainContainer>
));
UpcomingServiceContent.displayName = 'UpcomingServiceContent';

const EndedServiceContent = memo(({ service, attendance }) => (
  <MainContainer>
    <div className="flex flex-col space-y-8">
      <ServiceHeader service={service} />
      <ServiceEndedState serviceName={service?.name} attendance={attendance} />
      <SEOText scenario="ended" serviceName={service?.name} />
      <RecapButtons />
    </div>
  </MainContainer>
));
EndedServiceContent.displayName = 'EndedServiceContent';

const OngoingServiceContent = memo(({ service, showMarkedAttendance, attendance, onClockIn, isPending }) => (
  <MainContainer>
    <div className="flex flex-col space-y-8">
      <ServiceHeader service={service} isLive />
      <AnimatePresence mode="wait">
        {showMarkedAttendance ? (
          <AttendanceRecordedState key="recorded" attendance={attendance} />
        ) : (
          <ClockInButton key="clock-in" onClockIn={onClockIn} isPending={isPending} />
        )}
      </AnimatePresence>
      <SEOText scenario={showMarkedAttendance ? 'marked' : 'ongoing'} serviceName={service?.name} />
    </div>
  </MainContainer>
));
OngoingServiceContent.displayName = 'OngoingServiceContent';

// ============= MAIN PAGE COMPONENT =============
const HomePage = () => {
  const { data: serviceData, isLoading: isServiceLoading, isError, isFetching: isServiceFetching, refetch } = useTodaysService();
  const { data: coreData, isLoading: isCoreLoading, isFetching: isCoreFetching } = useCoreAppData();

  const { service, service_status, seconds_until_start, can_mark, attendance } = serviceData || {};
  const { birthday_list, anniversary_list } = coreData || {};


  const { mutate, isPending, isSuccess } = useMarkAttendance();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();

  const sourceParam = searchParams.get('source');
  const source = sourceParam === ATTENDANCE_SOURCES.ONLINE
    ? ATTENDANCE_SOURCES.ONLINE
    : ATTENDANCE_SOURCES.ONSITE;

  const showMarkedAttendance = isSuccess || (serviceData && !can_mark && attendance);
  const isLoadingState = isServiceLoading || isCoreLoading || isPending || isServiceFetching || isCoreFetching;

  const handleRefresh = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleClockIn = useCallback((e) => {
    e.preventDefault();
    if (!service?.id) return;

    mutate({
      service_id: service.id,
      mode: source,
      status: 'present',
    });
  }, [service?.id, source, mutate]);

  const renderContent = useCallback(() => {
    if (isLoadingState) {
      return <LoadingContent />;
    }

    if (isError) {
      return <NoServiceContent />;
    }

    switch (service_status) {
      case SERVICE_STATUS.UPCOMING:
        return (
          <UpcomingServiceContent
            service={service}
            secondsUntilStart={seconds_until_start}
            onRefresh={handleRefresh}
          />
        );

      case SERVICE_STATUS.ENDED:
        return (
          <EndedServiceContent
            service={service}
            attendance={attendance}
          />
        );

      case SERVICE_STATUS.ONGOING:
        return (
          <OngoingServiceContent
            service={service}
            showMarkedAttendance={showMarkedAttendance}
            attendance={attendance}
            onClockIn={handleClockIn}
            isPending={isPending}
          />
        );

      default:
        return <NoServiceContent />;
    }
  }, [
    isLoadingState,
    isError,
    service_status,
    service,
    seconds_until_start,
    handleRefresh,
    attendance,
    showMarkedAttendance,
    handleClockIn,
    isPending
  ]);

  return (
    <HomepageComponentCard>
      {(birthday_list || anniversary_list) && (birthday_list.length > 0 || anniversary_list?.length > 0) && <ConfettiShower duration={10} />}
      <GreetingContainer userName={user?.first_name} />
      {renderContent()}
      <BirthdayCard birthdayList={birthday_list} />
      <AnniversaryCard anniversaryList={anniversary_list} />
      <BibleVerseCard />
    </HomepageComponentCard>
  );
};

export default HomePage;