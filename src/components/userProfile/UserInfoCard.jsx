import { useModal } from '../../hooks/useModal';
import {
  EditIcon,
  UserIcon,
  EmailIcon,
  PhoneIcon,
  GenderIcon,
  CalendarIcon,
  LocationIcon,
  MapIcon,
  WhatsAppIcon,
} from '../../icons';
import { useAuthStore } from '../../store/auth.store';
import Button from '../ui/Button';
import PersonalInfoGrid from '@/components/userProfile/info/PersonalInfoGrid';
import LocationSection from '@/components/userProfile/info/LocationSection';
import EditProfileModal from '@/components/userProfile/info/EditProfileModal';
import dayjs from 'dayjs';

export default function UserInfoCard() {
  const { user } = useAuthStore();
  const { isOpen, openModal, closeModal } = useModal();

  const personalInfo = [
    {
      label: 'First Name',
      value: user?.first_name,
      icon: UserIcon,
    },
    {
      label: 'Last Name',
      value: user?.last_name,
      icon: UserIcon,
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: EmailIcon,
    },
    {
      label: 'Phone',
      value: user?.phone_number,
      icon: PhoneIcon,
    },
    {
      label: 'Phone (Whatsapp)',
      value: user?.whatsapp_number,
      icon: WhatsAppIcon,
    },
    {
      label: 'Gender',
      value: user?.gender,
      icon: GenderIcon,
    },
    {
      label: 'Date of Birth',
      value: user?.date_of_birth ? dayjs(user?.date_of_birth).format("DD MMMM") : null,
      icon: CalendarIcon,
    },
  ];

  const locationInfo = [
    {
      label: 'Country',
      value: user?.country,
      icon: LocationIcon,
    },
    {
      label: 'City/State',
      value: user?.city_or_state,
      icon: MapIcon,
    },
  ];

  return (
    <>
      <div className="overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-700/60 bg-white dark:bg-gray-800/50 backdrop-blur-sm transition-colors mb-6">
        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700/60 lg:px-6 lg:pt-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Personal Information
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Your basic profile and contact details
            </p>
          </div>
          <Button
            variant="neutral"
            onClick={openModal}
          >
            <EditIcon width={16} height={16} className="text-gray-700 dark:text-gray-300" />
          </Button>
        </div>

        <div className="px-5 py-5 lg:px-6 lg:py-6">
          <PersonalInfoGrid items={personalInfo} />
        </div>

        {/* Location Section */}
        <div className="px-5 pb-5 lg:px-6 lg:pb-6">
          <LocationSection
            locationInfo={locationInfo}
            address={user?.address}
            LocationIcon={LocationIcon}
          />
        </div>
      </div>

      {/* Modal */}
      <EditProfileModal
        isOpen={isOpen}
        onClose={closeModal}
      />
    </>
  );
}
