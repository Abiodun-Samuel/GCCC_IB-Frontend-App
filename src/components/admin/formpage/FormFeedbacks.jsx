import FormCard from '@/components/admin/formpage/FormCard';
import { FormsSkeleton } from '@/components/skeleton';
import { Tabs } from '@/components/ui/tab/Tabs';
import useQueryParam from '@/hooks/useQueryParam';
import { PrayerIcon, QuestionIcon, TestimonyIcon } from '@/icons';
import { useMemo, useState } from 'react';
import useFormMessagesSelection from '@/hooks/useFormMessagesSelection';
import { EmptyState } from '@/components/common/EmptyState';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/modal/Modal';
import { useModal } from '@/hooks/useModal';
import { DeleteConfirmation } from '@/components/ui/DeleteConfirmation';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/utils/permissions';

const FormFeedbacks = () => {
  const { can } = usePermission();
  const [activeTab, setActiveTab] = useQueryParam('tab', 'prayer');
  const {
    isOpen: isOpenDeleteModal,
    openModal: openDeleteModal,
    closeModal: closeDeleteModal,
  } = useModal();

  const [isSuccessDelete, setIsSuccessDelete] = useState(false);

  const {
    data = [],
    isLoading,
    selectedIds,
    isAllSelected,
    isIndeterminate,
    toggleSelect,
    toggleSelectAll,
    isUpdating,
    isDeleting,
    updateSelected,
    deleteSelected,
    refetch, isRefetching
  } = useFormMessagesSelection(activeTab);

  const handleDelete = async () => {
    try {
      await deleteSelected();
      setIsSuccessDelete(true);

      setTimeout(() => {
        setIsSuccessDelete(false);
        closeDeleteModal();
      }, 2000);
    } catch (error) { }
  };

  const tabs = useMemo(
    () => [
      { key: 'prayer', label: 'Prayers', icon: PrayerIcon },
      { key: 'question', label: 'Questions', icon: QuestionIcon },
      { key: 'testimony', label: 'Testimonies', icon: TestimonyIcon },
    ],
    []
  );

  // Check permission based on active tab
  const hasViewPermission = useMemo(() => {
    switch (activeTab) {
      case 'prayer':
        return can(PERMISSIONS.PRAYER_REQUEST_VIEW);
      case 'question':
        return can(PERMISSIONS.QUESTION_VIEW);
      case 'testimony':
        return true;
      default:
        return false;
    }
  }, [activeTab, can]);

  const hasEditPermission = useMemo(() => {
    switch (activeTab) {
      case 'prayer':
        return can(PERMISSIONS.PRAYER_REQUEST_VIEW)
      case 'question':
        return can(PERMISSIONS.QUESTION_VIEW);
      case 'testimony':
        return true;
      default:
        return false;
    }
  }, [activeTab, can]);

  const hasDeletePermission = useMemo(() => {
    switch (activeTab) {
      case 'prayer':
        return can(PERMISSIONS.PRAYER_REQUEST_VIEW)
      case 'question':
        return can(PERMISSIONS.QUESTION_VIEW);
      case 'testimony':
        return true;
      default:
        return false;
    }
  }, [activeTab, can]);

  // Show access denied if no view permission
  if (!hasViewPermission) {
    return (
      <div className="max-w-5xl p-2 mx-auto bg-white shadow dark:bg-gray-800 sm:p-5 rounded-xl">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="justify-center mb-5"
        />
        <div className="flex items-center justify-center py-12">
          <EmptyState
            title="Access Denied"
            description={`You don't have permission to view ${activeTab.toLowerCase()}s`}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-5xl p-2 mx-auto bg-white shadow dark:bg-gray-800 sm:p-5 rounded-xl">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          className="justify-center mb-5"
        />

        {isLoading || isRefetching ? (
          <FormsSkeleton />
        ) : (
          <div className="space-y-5">
            {/* Only show action bar if user has edit or delete permissions */}
            {data.length > 0 && (hasEditPermission || hasDeletePermission) && (
              <div className="flex flex-col justify-between gap-3 p-3 border border-gray-200 rounded-lg sm:flex-row sm:items-center bg-gray-50 dark:bg-gray-700/40 dark:border-gray-700">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-200 rounded cursor-pointer dark:bg-gray-700">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    id="forms"
                    onChange={(e) => toggleSelectAll(e.target.checked)}
                  />
                  <label
                    htmlFor="forms"
                    className="text-base text-gray-700 cursor-pointer dark:text-gray-300"
                  >
                    {selectedIds.length > 0
                      ? `${selectedIds.length} selected`
                      : 'Select all items'}
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  {/* Only show Mark completed button if user has edit permission */}
                  {hasEditPermission && (
                    <Button
                      variant="success"
                      size="sm"
                      loading={isUpdating}
                      disabled={selectedIds.length === 0 || isUpdating}
                      onClick={() => updateSelected(true)}
                    >
                      Mark completed
                    </Button>
                  )}

                  {/* Only show Delete button if user has delete permission */}
                  {hasDeletePermission && (
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={selectedIds.length === 0}
                      loading={isDeleting}
                      onClick={openDeleteModal}
                    >
                      Delete
                    </Button>
                  )}

                  <Button
                    size="sm"
                    variant="outline-primary"
                    loading={isRefetching}
                    onClick={refetch}
                  >
                    Refesh
                  </Button>
                </div>
              </div>
            )}

            {data.length > 0 ? (
              data.map((person) => (
                <FormCard
                  key={person.id}
                  person={person}
                  selected={selectedIds.includes(person.id)}
                  onToggleSelect={(checked) => toggleSelect(person.id, checked)}
                  canEdit={hasEditPermission}
                  canDelete={hasDeletePermission}
                />
              ))
            ) : (
              <EmptyState title={`No ${activeTab.toLowerCase()} available`} />
            )}
          </div>
        )}
      </div>

      {/* Only show delete modal if user has delete permission */}
      {hasDeletePermission && (
        <Modal
          title="Delete"
          isOpen={isOpenDeleteModal}
          onClose={closeDeleteModal}
        >
          <div className="space-y-4">
            <DeleteConfirmation isSuccess={isSuccessDelete} />
            {!isSuccessDelete && (
              <div className="flex justify-end gap-3 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeDeleteModal}
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  loading={isDeleting}
                  size="sm"
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default FormFeedbacks;
