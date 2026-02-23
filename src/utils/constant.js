export const UserRole = Object.freeze({
  PASTOR: 'pastor',
  ADMIN: 'admin',
  LEADER: 'leader',
  MEMBER: 'member',
  FIRST_TIMER: 'firstTimer',
});

export const followupCommentTypes = [
  { id: 'Pre-Service', name: 'Pre-Service' },
  { id: 'Post-Service', name: 'Post-Service' },
  { id: 'Admin', name: 'Admin' },
  { id: 'Pastor', name: 'Pastor' },
  { id: 'Unit-Leader', name: 'Unit-Leader' },
  { id: 'Others', name: 'Others' },
];

export const UserRoles = [
  { id: 1, name: 'pastor' },
  { id: 2, name: 'admin' },
  { id: 3, name: 'leader' },
  { id: 4, name: 'member' },
  { id: 5, name: 'firstTimer' },
];

export const Units = Object.freeze({
  PRAYER: 'Prayer Unit',
  WORSHIP: 'Worship Team',
  MEDIA: 'Media Unit',
  FOLLOW_UP: 'Follow Up Unit',
  WELFARE: 'Welfare Unit',
  CHILDREN: 'Children Department',
  SOUND: 'Sound Team',
  SANITATION: 'Sanitation Unit',
  USHERING: 'Ushering Unit',
  FSP: 'FSP',
});

export const LoadingStates = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const Image = 'https://i.pravatar.cc/400?img=59';

export const years = [
  2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035,
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const textColors = [
  'text-red-500',
  'text-orange-500',
  'text-amber-500',
  'text-yellow-500',
  'text-lime-500',
  'text-green-500',
  'text-emerald-500',
  'text-teal-500',
  'text-cyan-500',
  'text-sky-500',
  'text-blue-500',
  'text-indigo-500',
  'text-violet-500',
  'text-purple-500',
  'text-fuchsia-500',
  'text-pink-500',
  'text-rose-500',
];

export const attendanceLevels = [
  {
    level: "The Sower's Seed", // Biblical title for foundation/start (0-25%)
    min: 0,
    max: 25,
    fromColor: '#f04438', // Cool Shade of Red (Starting phase/initial effort)
    toColor: '#f97066', // Lighter Red for gradient
    messages: [
      "Welcome back! Every journey starts with a single step. **Take it one service at a time**—we're excited to see you here!",
      "Ready to start strong? Making it to that **first service is the biggest win**. We're looking forward to fellowshipping with you.",
    ],
  },
  {
    level: "Faith's Foundation", // Biblical title for building/momentum (26-50%)
    min: 26,
    max: 50,
    fromColor: '#dc6803', // Warm Yellow/Orange (Building momentum)
    toColor: '#f79009', // Very Light Yellow for gradient
    messages: [
      "Great progress so far! You've found your rhythm. **Keep your momentum going, one service at a time.** Your consistency matters!",
      "Halfway to the point! You've shown great dedication this month. **Keep building that good habit** and prioritize the next service.",
    ],
  },
  {
    level: 'The Shining Lamp', // Biblical title for witness/consistency (51-75%)
    min: 51,
    max: 75,
    fromColor: '#3641f5',
    toColor: '#7592ff',
    messages: [
      "Fantastic! You've crushed more than half your goal. Don't slow down now—**finish strong, one service at a time!**",
      "You're in the home stretch! **This is where commitment pays off.** Keep showing up; your community is stronger because of your presence.",
    ],
  },
  {
    level: 'Finishing the Race',
    min: 76,
    max: 99,
    fromColor: '#039855',
    toColor: '#32d583',
    messages: [
      "You've almost hit your personal attendance goal for the month. **Take it one service at a time** — you've got this!",
      'Incredible dedication! You are just **one step away from meeting your monthly goal.** We celebrate your commitment to growing your faith!',
    ],
  },
  {
    level: 'The Good Steward', // Biblical title for 100% completion/mastery
    min: 100,
    max: 100,
    fromColor: '#6A0DAD', // Deep Purple/Violet (Celebratory, distinction)
    toColor: '#C3A6EE', // Lighter Purple for gradient
    messages: [
      "Mission accomplished! You've faithfully attended every service this month and met your goal. **Your dedication is a testament to your faith!**",
      "Congratulations! **100% attendance!** You've completed your goal. May the foundation you built this month carry you into the next.",
    ],
  },
];
export const QUICK_ACTION_LINKS = [
  {
    to: '/forms?tab=question',
    src: '/images/forms/question2.png',
    alt: 'question',
    external: true,
  },
  {
    to: '/forms?tab=prayer',
    src: '/images/forms/prayer2.png',
    alt: 'prayer',
    external: true,
  },
  {
    to: '/forms?tab=testimony',
    src: '/images/forms/testimony2.png',
    alt: 'testimony',
    external: true,
  },
];

export const SECTION_SPACING = 'py-20 sm:py-28 lg:py-36' //"py-24 sm:py-32 lg:py-40";