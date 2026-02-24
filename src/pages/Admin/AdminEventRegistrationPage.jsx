import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import ComponentCard from '@/components/common/ComponentCard';
import AdminEventRegistration from '@/components/admin/events/AdminEventRegistration';

const AdminEventRegistrationPage = () => {
    return (
        <>
            <PageMeta title="Admin: Event Registration Record | GCCC Ibadan" />
            <PageBreadcrumb
                pageTitle="Admin: Events Registration Record"
                description={'Log, track, and manage all users registered for the event.'}
            />
            <ComponentCard>
                <AdminEventRegistration />
            </ComponentCard>
        </>
    );
};

export default AdminEventRegistrationPage;
