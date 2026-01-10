import { ShieldIcon, StarIcon, UsersIcon } from '@/icons';
import {
  Users,
  Shield,
  Star,
  User,
  UserPlus,
  BookOpen,
  Briefcase,
  UserX
} from 'lucide-react';

export const navItems = [
  {
    icon: 'DashboardIcon',
    name: 'Dashboard',
    path: '/dashboard',
  },
  {
    icon: 'AttendanceIcon2',
    name: 'Attendance',
    path: '/dashboard/attendance',
  },
  {
    icon: 'EventIcon',
    name: 'Events',
    path: '/dashboard/events',
  },
  {
    icon: 'UserIcon',
    name: 'Profile',
    path: '/dashboard/profile',
  },
];
export const adminNavItems = [
  {
    icon: 'AdminIcon',
    name: 'Admin',
    subItems: [
      {
        name: 'Dashboard',
        path: '/dashboard/admin',
        pro: true,
      },
      { name: 'Attendance', path: '/dashboard/admin/attendance', pro: true },
      { name: 'Events', path: '/dashboard/admin/events', pro: true },

      {
        name: 'First Timers',
        path: '/dashboard/admin/first-timers',
        pro: true,
      },
      { name: 'Members', path: '/dashboard/admin/members', pro: true },
      { name: 'Forms', path: '/dashboard/admin/forms', pro: true },
      {
        name: 'Follow-Up Feedbacks',
        path: '/dashboard/admin/followup-feedbacks',
        pro: true,
      },
      {
        name: 'Settings',
        path: '/dashboard/admin/settings',
        pro: true,
      },
    ],
  },
];
export const leaderNavItems = [
  {
    icon: 'LeaderIcon',
    name: 'Leaders',
    subItems: [
      {
        name: 'Dashboard',
        path: '/dashboard/leaders',
        pro: false,
      },
      {
        name: 'Attendance Records',
        path: '/dashboard/attendance-records',
        pro: true,
      },
      {
        name: 'Units',
        path: '/dashboard/leaders/units',
        pro: false,
      },
    ],
  },
];

export const gradients = [
  'from-blue-500 to-purple-600 dark:from-blue-600 dark:to-purple-700',
  'from-pink-500 to-rose-600 dark:from-pink-600 dark:to-rose-700',
  'from-emerald-500 to-teal-600 dark:from-emerald-600 dark:to-teal-700',
  'from-orange-500 to-red-600 dark:from-orange-600 dark:to-red-700',
  'from-violet-500 to-purple-600 dark:from-violet-600 dark:to-purple-700',
  'from-cyan-500 to-blue-600 dark:from-cyan-600 dark:to-blue-700',
  'from-fuchsia-500 to-pink-600 dark:from-fuchsia-600 dark:to-pink-700',
  'from-lime-500 to-green-600 dark:from-lime-600 dark:to-green-700',
  'from-amber-500 to-orange-600 dark:from-amber-600 dark:to-orange-700',
  'from-indigo-500 to-blue-600 dark:from-indigo-600 dark:to-blue-700',
  'from-rose-500 to-pink-600 dark:from-rose-600 dark:to-pink-700',
  'from-teal-500 to-cyan-600 dark:from-teal-600 dark:to-cyan-700',
  'from-red-500 to-orange-600 dark:from-red-600 dark:to-orange-700',
  'from-purple-500 to-fuchsia-600 dark:from-purple-600 dark:to-fuchsia-700',
  'from-sky-500 to-indigo-600 dark:from-sky-600 dark:to-indigo-700',
];

export const avatarGradients = [
  'from-blue-500 to-purple-600',
  'from-pink-500 to-rose-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-violet-500 to-purple-600',
  'from-cyan-500 to-blue-600',
  'from-fuchsia-500 to-pink-600',
  'from-lime-500 to-green-600',
  'from-amber-500 to-orange-600',
  'from-indigo-500 to-blue-600',
  'from-rose-500 to-pink-600',
  'from-teal-500 to-cyan-600',
  'from-red-500 to-orange-600',
  'from-purple-500 to-fuchsia-600',
  'from-sky-500 to-indigo-600',
];

export const assistantGradients = [
  'from-purple-500 to-pink-600',
  'from-rose-500 to-orange-600',
  'from-teal-500 to-emerald-600',
  'from-red-500 to-pink-600',
  'from-purple-500 to-indigo-600',
  'from-blue-500 to-cyan-600',
  'from-pink-500 to-fuchsia-600',
  'from-green-500 to-lime-600',
  'from-orange-500 to-amber-600',
  'from-blue-500 to-indigo-600',
  'from-pink-500 to-rose-600',
  'from-cyan-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-fuchsia-500 to-purple-600',
  'from-indigo-500 to-sky-600',
];
export const ROLE_CONFIGS = {
  admin: {
    label: 'Admin',
    color: 'error',
    icon: ShieldIcon,
    bgClass:
      'from-slate-700 to-slate-900 dark:from-slate-800 dark:to-slate-950',
  },
  leader: {
    label: 'Leader',
    color: 'warning',
    icon: StarIcon,
    bgClass:
      'from-indigo-600 to-purple-700 dark:from-indigo-700 dark:to-purple-800',
  },
  member: {
    label: 'Member',
    color: 'primary',
    icon: UsersIcon,
    bgClass: 'from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700',
  },
};

export const ROLE_CONFIG = {
  admin: { label: 'Admin', color: 'error' },
  leader: { label: 'Leader', color: 'warning' },
  member: { label: 'Member', color: 'primary' },
};
export const MIME_TYPE_EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/svg+xml': 'svg',
};

export const DEFAULT_EXTENSION = 'jpg';

export const COMMUNITY = Object.freeze({
  OLD_IFE_ROAD: 'Old-Ife Road/Alakia/Iwo Road',
  IYANA_BODIJA: 'Iyana-Bodija/Express',
  AKOBO: 'Akobo',
  AGBOWO: 'Agbowo',
  UI: 'UI',
  OJOO_MONIYA: 'Ojoo/Moniya',
  ASHI_BODIJA: 'Ashi Bodija',
  GATE_IDI_APE: 'Bus-Stop Gate/Idi-Ape',
  SANGO_POLY_APETE: 'Sango/Poly Ibadan/Apete',
  RINGROAD_CHALLENGE: 'RingRoad/Challenge',
});

export const communityArray = Object.freeze(Object.values(COMMUNITY));

export const MONTH_OPTIONS = [
  { value: '01', text: 'January' },
  { value: '02', text: 'February' },
  { value: '03', text: 'March' },
  { value: '04', text: 'April' },
  { value: '05', text: 'May' },
  { value: '06', text: 'June' },
  { value: '07', text: 'July' },
  { value: '08', text: 'August' },
  { value: '09', text: 'September' },
  { value: '10', text: 'October' },
  { value: '11', text: 'November' },
  { value: '12', text: 'December' },
];

export const bibleVerses = [
  {
    verse: 'Hebrews 10:25',
    text: 'Not giving up meeting together, as some are in the habit of doing, but encouraging one another.',
  },
  {
    verse: 'Psalm 122:1',
    text: "I rejoiced with those who said to me, 'Let us go to the house of the Lord.'",
  },
  {
    verse: 'Psalm 95:6',
    text: 'Come, let us bow down in worship, let us kneel before the Lord our Maker.',
  },
  {
    verse: '1 Corinthians 16:13',
    text: 'Be on your guard; stand firm in the faith; be courageous; be strong.',
  },
  {
    verse: 'Colossians 3:16',
    text: 'Let the message of Christ dwell among you richly as you teach and admonish one another with all wisdom.',
  },
  {
    verse: 'Matthew 18:20',
    text: 'For where two or three gather in my name, there am I with them.',
  },
  {
    verse: 'Psalm 100:4',
    text: 'Enter his gates with thanksgiving and his courts with praise; give thanks to him and praise his name.',
  },
  {
    verse: 'Acts 2:46',
    text: 'Every day they continued to meet together in the temple courts. They broke bread in their homes and ate together with glad and sincere hearts.',
  },
];

export const ANNOUNCEMENTS = [
  { icon: '📋', text: 'Please mark your attendance during service' },
  {
    icon: '⛪',
    text: 'Sunday Service: 8:00 AM | Tuesday Service: 5:15 PM | Daily Prayer Online: 12:00 PM',
  },
  {
    icon: '🌟',
    text: 'Global Glory Team Meeting - Saturday, October 18th at 10:00 AM',
  },
  { icon: '⚡', text: 'Divine Demand - Daily on YouTube at 5:30 AM' },
  { icon: '🎤', text: 'Share your testimonies at www.gcccibadan.org/forms' },
  {
    icon: '🙏',
    text: 'Submit prayer requests anonymously at www.gcccibadan.org/forms',
  },
  { icon: '❓', text: 'Jesus Perspective Q&A - Second Tuesday of every month' },
  {
    icon: '📱',
    text: 'Follow us: Instagram, Facebook, YouTube & Telegram @GCCC Ibadan',
  },
  { icon: '🔋', text: 'Phone charging available before service' },
  { icon: '🔇', text: 'Please silence phones before entering church' },
  { icon: '🏪', text: 'Storehouse Open - Donate items (See Comfort)' },
  { icon: '📅', text: 'SOD 2025: The Call - Registration now open!' },
  { icon: '🎓', text: 'Volunteer for Secondary School Outreach' },
  {
    icon: '👨‍🎓',
    text: 'Student Fellowship - Wednesdays 6:00 PM, Alumni Hall UI',
  },
  {
    icon: '🌍',
    text: 'Global Fasting & Prayer - YouTube 6AM | Physical 6PM daily',
  },
];

export const ROLE_OPTIONS = [
  {
    value: 'pastor',
    text: 'Pastors',
    icon: BookOpen,
    description: 'Church pastors'
  },
  {
    value: 'admin',
    text: 'Admins',
    icon: Shield,
    description: 'Church administrators'
  },
  {
    value: 'leader',
    text: 'Leaders',
    icon: Star,
    description: 'Team leaders'
  },
  {
    value: 'member',
    text: 'Members',
    icon: User,
    description: 'Regular members'
  },
  {
    value: 'gloryTeam',
    text: 'Glory Team',
    icon: Briefcase,
    description: 'Members in units'
  },
  {
    value: 'nonGloryTeam',
    text: 'Non-Glory Team',
    icon: UserX,
    description: 'Not in any unit'
  },
  {
    value: 'all',
    text: 'All Users',
    icon: Users,
    description: 'All system users'
  },
  {
    value: 'firstTimer',
    text: 'First Timers',
    icon: UserPlus,
    description: 'New visitors'
  },
];