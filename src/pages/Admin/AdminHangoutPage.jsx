import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import AdminHangoutRegistrations from '@/components/admin/hangout/AdminHangoutRegistrations';

const AdminHangoutPage = () => (
    <>
        <PageMeta title="Admin: Hangout Registrations | GCCC Ibadan" />
        <PageBreadcrumb
            pageTitle="Admin: Hangout Registrations"
            description="Everyone registered for the GCCC Hangout 2026, with their game and pledged support."
        />
        <ComponentCard>
            <AdminHangoutRegistrations />
        </ComponentCard>
    </>
);

export default AdminHangoutPage;
