import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import AdminEventsList from '@/components/admin/events/AdminEventsList';

const AdminFirstTimerPage = () => {
  return (
    <>
      <PageMeta title="Admin: Event Record | GCCC Ibadan" />
      <PageBreadcrumb
        pageTitle="Admin: Events Record"
        description={
          'Log, track, and manage all first timer`s records, follow-up process and assign care tasks.'
        }
      />
      <ComponentCard>
        <AdminEventsList />
      </ComponentCard>
    </>
  );
};

export default AdminFirstTimerPage;
