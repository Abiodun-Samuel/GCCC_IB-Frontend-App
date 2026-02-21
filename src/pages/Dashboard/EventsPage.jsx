import EventsList from '@/components/events/EventsList';
import ComponentCard from '../../components/common/ComponentCard';
import PageBreadcrumb from '../../components/common/PageBreadCrumb';
import PageMeta from '../../components/common/PageMeta';
import { EventIcon } from '@/icons';

const EventsPage = () => {
  return (
    <>
      <PageMeta title="Events | GCCC Ibadan" />
      <PageBreadcrumb
        icon={EventIcon}
        pageTitle="Events"
        description={
          'Join us for life - changing encounters and spiritual growth opportunities'
        }
      />
      <ComponentCard>
        <EventsList />
      </ComponentCard>
    </>
  );
};

export default EventsPage;
