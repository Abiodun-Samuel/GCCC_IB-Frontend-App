import Button from "@/components/ui/Button";
import { useModal } from "@/hooks/useModal";
import CreateTimeline from "@/components/dashboard/timeline/CreateTimeline";
import Modal from "@/components/ui/modal/Modal";

const TimelineHeader = () => {
    const { isOpen, openModal, closeModal } = useModal();

    return (
        <>
            <div className="mb-10 mx-auto">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold bg-linear-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent mb-1">
                    Activity Timeline
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400">
                    Track all interactions and follow-ups.
                </p>
                <Button onClick={openModal} className="mt-2" variant="ghost">
                    + New feedback
                </Button>
            </div>
            <Modal
                title='New Feedback'
                isOpen={isOpen}
                onClose={closeModal}
            >
                <CreateTimeline onClose={closeModal} />
            </Modal>
        </>
    );
}




export default TimelineHeader;
