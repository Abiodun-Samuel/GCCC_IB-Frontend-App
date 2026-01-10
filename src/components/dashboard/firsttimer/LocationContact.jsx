import EditLocation from '@/components/dashboard/firsttimer/edit/EditLocation';
import { InfoField } from '@/components/dashboard/firsttimer/InfoField'
import { SectionCard } from '@/components/dashboard/firsttimer/SectionCard'
import Modal from '@/components/ui/modal/Modal';
import { useModal } from '@/hooks/useModal';
import { MapPinIcon, MessageSquareIcon } from '@/icons'

const LocationContact = ({ firstTimerData }) => {
    const { isOpen, openModal, closeModal } = useModal();
    return (
        <>
            <SectionCard title="Location & Contact" icon={MapPinIcon} onEdit={openModal}>
                <InfoField icon={MapPinIcon} label="Address" value={firstTimerData.address} fullWidth />
                <InfoField icon={MapPinIcon} label="Located in Ibadan" value={firstTimerData.located_in_ibadan ? 'Yes' : 'No'} fullWidth />
                <InfoField icon={MessageSquareIcon} label="Interest in joining our whatsapp community" value={firstTimerData.whatsapp_interest ? 'Yes' : 'No'} fullWidth />
            </SectionCard>
            <Modal
                title={`Edit ${firstTimerData?.full_name}`}
                isOpen={isOpen}
                onClose={closeModal}
            >
                <EditLocation firstTimerData={firstTimerData} onClose={closeModal} />
            </Modal>
        </>
    )
}

export default LocationContact