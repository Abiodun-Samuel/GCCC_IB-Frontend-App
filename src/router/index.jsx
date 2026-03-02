import { lazy, Suspense } from 'react';

import HomeLayout from '../layout/HomeLayout';
import AppLayout from '../layout/AppLayout';
import ProtectedRoute from '../layout/route/ProtectedRoute';
import AdminProtectedRoute from '../layout/route/AdminProtectedRoute';
import LeadersProtectedRoute from '../layout/route/LeadersProtectedRoute';
import PublicRoute from '../layout/route/PublicRoute';
import PageLoader from '@/components/ui/PageLoader';
import ErrorBoundary from '@/components/error/ErrorBoundary';

// ─── Lazy imports — every page code-split ─────────────────────────────────────
// Public / Home
const HomePage = lazy(() => import('@/components/Home/HomePage'));
const LoginPage = lazy(() => import('../pages/Home/Auth/LoginPage'));
const ResetPasswordPage = lazy(() => import('@/pages/Home/Auth/ResetPasswordPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/Home/Auth/ForgotPasswordPage'));
const FormPage = lazy(() => import('../pages/Home/FormPage'));
const FirstTimerWelcomePage = lazy(() => import('../pages/Home/FirstTimerWelcomePage'));
const EventRegistrationPage = lazy(() => import('@/pages/Home/EventRegistrationPage'));

// Dashboard
const DashboardPage = lazy(() => import('../pages/Dashboard/DashboardPage'));
const AttendancePage = lazy(() => import('../pages/Dashboard/AttendancePage'));
const UserProfilePage = lazy(() => import('../pages/Dashboard/UserProfilePage'));
const EventsPage = lazy(() => import('@/pages/Dashboard/EventsPage'));
const MessagesPage = lazy(() => import('@/pages/Dashboard/MessagesPage'));
const FirstTimerDetailsPage = lazy(() => import('../pages/Dashboard/FirstTimerDetailsPage'));
const MemberDetailsPage = lazy(() => import('../pages/Dashboard/MemberDetailsPage'));
const ServiceAttendancePage = lazy(() => import('@/pages/Dashboard/ServiceAttendancePage')); // ← was eager
const FirstTimerPage = lazy(() => import('@/pages/Dashboard/FirstTimerPage'));               // ← was eager
const UserRedeemPage = lazy(() => import('@/pages/Dashboard/UserRedeemPage'));               // ← was eager

// Admin
const AdminDashboardPage = lazy(() => import('../pages/Admin/AdminDashboardPage'));
const AdminAttendancePage = lazy(() => import('../pages/Admin/AdminAttendancePage'));
const AdminAttendanceReportPage = lazy(() => import('@/pages/Admin/AdminAttendanceReportPage'));
const AdminFirstTimerPage = lazy(() => import('../pages/Admin/AdminFirstTimerPage'));
const AdminFirstTimerReportPage = lazy(() => import('@/pages/Admin/AdminFirstTimerReportPage'));
const AdminMembersPage = lazy(() => import('../pages/Admin/AdminMembersPage'));
const AdminFormsPage = lazy(() => import('../pages/Admin/AdminFormsPage'));
const AdminFollowupFeedbacksPage = lazy(() => import('../pages/Admin/AdminFollowupFeedbacksPage'));
const AdminSettingsPage = lazy(() => import('../pages/Admin/AdminSettingsPage'));
const AdminEventsPage = lazy(() => import('@/pages/Admin/AdminEventsPage'));
const AdminEventRegistrationPage = lazy(() => import('@/pages/Admin/AdminEventRegistrationPage')); // ← was eager
const AdminRedeemableItemsPage = lazy(() => import('@/pages/Admin/AdminRedeemableItemsPage'));     // ← was eager

// Leaders
const LeadersDashboardPage = lazy(() => import('../pages/Leaders/LeadersDashboardPage'));
const LeadersUnitPage = lazy(() => import('../pages/Leaders/LeadersUnitPage'));

// Errors
const NotFoundPage = lazy(() => import('../pages/Error/NotfoundPage'));
// ─── Suspense + ErrorBoundary wrapper ─────────────────────────────────────────
const withSuspense = (Component) => (
  <ErrorBoundary>
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// ─── Routes ───────────────────────────────────────────────────────────────────
const AppRoutes = [
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: withSuspense(HomePage) },

      // Auth — redirect to dashboard if already logged in
      {
        element: <PublicRoute />,
        children: [
          { path: 'login', element: withSuspense(LoginPage) },
          { path: 'reset-password', element: withSuspense(ResetPasswordPage) },
          { path: 'forgot-password', element: withSuspense(ForgotPasswordPage) },
        ],
      },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'forms', element: withSuspense(FormPage) },
        ],
      },

      // Public pages
      { path: 'events/:eventId/registration', element: withSuspense(EventRegistrationPage) },
      { path: 'first-timer/welcome', element: withSuspense(FirstTimerWelcomePage) },
    ],
  },

  {
    path: '/dashboard',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: withSuspense(DashboardPage) },

          // Member routes
          { path: 'attendance', element: withSuspense(AttendancePage) },
          { path: 'attendance/report', element: withSuspense(AdminAttendanceReportPage) },
          { path: 'profile', element: withSuspense(UserProfilePage) },
          { path: 'events', element: withSuspense(EventsPage) },
          { path: 'messages', element: withSuspense(MessagesPage) },
          { path: 'first-timers/:firstTimerId', element: withSuspense(FirstTimerDetailsPage) },
          { path: 'members/:memberId', element: withSuspense(MemberDetailsPage) },
          { path: 'service-attendance', element: withSuspense(ServiceAttendancePage) },
          { path: 'first-timers', element: withSuspense(FirstTimerPage) },
          { path: 'reward-store', element: withSuspense(UserRedeemPage) },
          { path: 'first-timers/report', element: withSuspense(AdminFirstTimerReportPage) },

          // Admin routes
          {
            path: 'admin',
            element: <AdminProtectedRoute />,
            children: [
              { index: true, element: withSuspense(AdminDashboardPage) },
              { path: 'attendance', element: withSuspense(AdminAttendancePage) },
              { path: 'events', element: withSuspense(AdminEventsPage) },
              { path: 'events/:eventId/registration', element: withSuspense(AdminEventRegistrationPage) },
              { path: 'first-timers', element: withSuspense(AdminFirstTimerPage) },
              { path: 'members', element: withSuspense(AdminMembersPage) },
              { path: 'forms', element: withSuspense(AdminFormsPage) },
              { path: 'followup-feedbacks', element: withSuspense(AdminFollowupFeedbacksPage) },
              { path: 'settings', element: withSuspense(AdminSettingsPage) },
              { path: 'redeemable-items', element: withSuspense(AdminRedeemableItemsPage) },
            ],
          },

          // Leaders routes
          {
            path: 'leaders',
            element: <LeadersProtectedRoute />,
            children: [
              { index: true, element: withSuspense(LeadersDashboardPage) },
              { path: 'units', element: withSuspense(LeadersUnitPage) },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: withSuspense(NotFoundPage) },
];

export default AppRoutes;