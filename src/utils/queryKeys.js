export const QUERY_KEYS = {
  FORM_MESSAGES: {
    ALL: (type) => ['formMessages', type],
    DETAIL: (id) => ['formMessages', id],
  },

  FOLLOWUP_FEEDBACKS: {
    FIRST_TIMERS: ['followup-feedbacks', 'first-timers'],
    ALL_MEMBERS: ['followup-feedbacks', 'all-members'],
    ABSENT_MEMBERS: ['followup-feedbacks', 'absent-members'],
    MEMBER_FIRST_TIMER: (id) => ['followup-feedbacks', id],
  },

  // refactored
  FOLLOW_UP_STATUSES: {
    ALL: ['followup-status'],
    DETAIL: (statusId) => ['followup-status', statusId],
  },
  MEMBERS: {
    ALL_USERS: ['all_users'],
    ALL: (params) => ['allmembers', params],
    LIST: (params) => ['members', 'list', params],
    DETAIL: (id) => ['members', 'detail', id],
    ROLE: (role, params) => [('members', role, params)],
  },
  ATTENDANCE_RECORDS: {
    ALL: ['attendance-records'],
    DETAIL: (id) => ['attendance-records', id],
    ROLE: (role) => [('attendance-records', role)],
  },
  USER: {
    ABSENT: ['all_absent_members'],
    ASSIGNED_MEMBER: ['assigned_members'],
  },

  SERVICES: {
    ALL: ['services'],
    TODAY: ['services', 'today'],
    CORE_DATA: ['core data'],
    DETAIL: (id) => ['services', 'detail', id],
  },

  FIRST_TIMERS: {
    ALL: (params) => ['all-first-timers', params],
    FIRSTTIMER_FOLLOWUPS: ['first-timers', 'FIRSTTIMER_FOLLOWUPS'],
    DETAIL: (id) => ['first-timers', id],
    FOLLOWUPS: (id) => ['FOLLOWUPS', id],
    FIRST_TIMERS_ANALYTICS: (params) => [
      'admin',
      'first-timers-analytics',
      params,
    ],
    ASSIGNED: ['assigned'],
  },
  UNITS: {
    ALL: ['units'],
  },

  //////////////////////////////////////////////////////////////////////////////////////////////////
  AUTH: {
    ME: ['auth', 'me'],
    PROFILE: ['auth', 'profile'],
  },

  ADMIN: {
    ALL: ['admin'],
    ANALYTICS: (params) => ['admin', 'analytics', params],
  },

  EVENTS: {
    ALL: ['events'],
    DETAIL: (id) => ['events', 'detail', id],
  },

  PAYMENT: {
    INITIATE: (payloadHash) => ['payment', 'initiate', payloadHash],
    VERIFY: (reference) => ['payment', 'verify', reference],
  },

  ATTENDANCE: {
    ALL: ['attendance'],
    HISTORY: ['attendance', 'history'],
    REPORT: (params) => ['attendance', 'report', params],
    ALL_RECORDS: (params) => ['attendance', 'all-records', params],
    ALL_RECORDS_USER: (params) => ['attendance', 'all-records_user', params],
    BY_MONTH_YEAR: (month, year) => ['attendance', 'filtered', month, year],
    USER_BY_MONTH_YEAR: (month, year) => [
      'attendance',
      'filtered',
      month,
      year,
    ],
  },
};
