import { InfoField } from "@/components/dashboard/members/InfoField";
import { SectionCard } from "@/components/dashboard/members/SectionCard";
import { CalendarIcon2, CityIcon, MailIcon, MapPinIcon, PhoneIcon, UserIcon, WhatsAppIcon } from "@/icons";

export const PersonalInformation = ({ user }) => {
    return (
        <SectionCard
            title="Personal Information"
            description="Your basic profile and contact details"
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <InfoField icon={UserIcon} label="First Name" value={user.first_name} />
                <InfoField icon={UserIcon} label="Last Name" value={user.last_name} />
                <InfoField type={'email'} icon={MailIcon} label="Email Address" value={user.email} />
                <InfoField type={'phone'} icon={PhoneIcon} label="Phone" value={user.phone_number} />
                <InfoField type={'whatsapp'} icon={WhatsAppIcon} label="Phone (Whatsapp)" value={user.whatsapp_number} />
                <InfoField icon={UserIcon} label="Gender" value={user.gender} />
                <InfoField icon={CalendarIcon2} label="Date of Birth" value={user.date_of_birth} />
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-2">
                    <MapPinIcon className="w-4 h-4" />
                    Location Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <InfoField icon={MapPinIcon} label="Country" value={user.country} />
                    <InfoField icon={CityIcon} label="City/State" value={user.city_or_state} />
                    <InfoField icon={MapPinIcon} label="Address" value={user.address} />
                </div>
            </div>
        </SectionCard>
    );
};