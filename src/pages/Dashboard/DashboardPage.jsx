import { useState, useCallback } from 'react';

import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AttendanceMetrics from '@/components/dashboard/metrics/AttendanceMetrics';
import ServiceClockInCard from '@/components/dashboard/ServiceClockInCard';
import MonthlyTarget from '@/components/dashboard/MonthlyTarget';
import BibleVerseDisplay from '@/components/dashboard/BibleVerseDisplay';
import VideoCarousel from '@/components/media/VideoCarousel';
import QuickActionsSection from '@/components/dashboard/QuickActionsSection';
import { useUsersMonthlyAttendanceStats } from '@/queries/attendance.query';
import { DashboardIcon } from '@/icons';
import FirstTimerAssigned from '@/components/dashboard/assigned/FirstTimerAssigned';
import AssignedMembers from '@/components/dashboard/assigned/AssignedMembers';
import { Units } from '@/utils/constant';
import { useHasUnit } from '@/hooks/useUnitPermission';
import { useAuthStore } from '@/store/auth.store';
import AssignedAbsentMembers from '@/components/dashboard/assigned/AssignedAbsentMembers';

// Constants
const getCurrentDateParams = () => ({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1,
});

// Custom Hooks
const useDateFilter = () => {
  const [params, setParams] = useState(getCurrentDateParams);
  const handleDateChange = useCallback((newParams) => {
    setParams(newParams);
  }, []);
  return {
    params,
    handleDateChange,
  };
};



const DashboardPage = () => {
  const { params, handleDateChange } = useDateFilter();
  const { data, isLoading, isError, error } = useUsersMonthlyAttendanceStats(params?.year, params?.month);
  const hasFollowUp = useHasUnit(Units.FOLLOW_UP);
  const { isMember } = useAuthStore()
  const attendanceProps = { data, isLoading, isError, error, params }

  return (
    <>
      <PageMeta title="Dashboard | GCCC Ibadan" />
      <PageBreadcrumb icon={DashboardIcon} pageTitle="Dashboard" description={'See your latest attendance summary, current giving status, and important community updates at a glance.'} />

      <main className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12">
          <ServiceClockInCard />
        </div>

        <section className="relative col-span-12 space-y-5 xl:col-span-7">
          <AttendanceMetrics {...attendanceProps} handleDateChange={handleDateChange} />
          <BibleVerseDisplay />
        </section>

        <MonthlyTarget {...attendanceProps} handleDateChange={handleDateChange} />
        <QuickActionsSection />

        <section className="col-span-12 my-5">
          <VideoCarousel />
        </section>

        {hasFollowUp && <FirstTimerAssigned />}

        {isMember && <AssignedMembers />}

        {isMember && <AssignedAbsentMembers />}
      </main>
    </>
  );
};

export default DashboardPage;