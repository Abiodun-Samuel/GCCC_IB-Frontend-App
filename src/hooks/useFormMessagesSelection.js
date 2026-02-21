import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  useAllFormMessages,
  useUpdateFormMessages,
  useDeleteFormMessages,
} from '@/queries/form.query';

export function useFormMessagesSelection(type) {
  const { data = [], isLoading, refetch, isRefetching } = useAllFormMessages(type);

  const [selectedIds, setSelectedIds] = useState([]);

  const allIds = useMemo(() => data.map((p) => p.id), [data]);

  const allIdsKey = useMemo(() => allIds.join(','), [allIds]);

  const isAllSelected =
    selectedIds.length > 0 && selectedIds.length === allIds.length;
  const isIndeterminate =
    selectedIds.length > 0 && selectedIds.length < allIds.length;

  useEffect(() => {
    setSelectedIds([]);
  }, [type]);

  useEffect(() => {
    setSelectedIds((prev) => {
      const filtered = prev.filter((id) => allIds.includes(id));
      if (filtered.length === prev.length) return prev;
      return filtered;
    });
  }, [allIdsKey]);

  const toggleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) => {
      const set = new Set(prev);
      if (checked) set.add(id);
      else set.delete(id);
      return Array.from(set);
    });
  }, []);

  const toggleSelectAll = useCallback(
    (checked) => {
      setSelectedIds(checked ? allIds : []);
    },
    [allIds]
  );

  const clearSelection = useCallback(() => setSelectedIds([]), []);

  const { mutate: updateMessages, isPending: isUpdating } =
    useUpdateFormMessages({
      onSuccess: () => {
        clearSelection();
      },
    });

  const { mutateAsync: deleteMessages, isPending: isDeleting } =
    useDeleteFormMessages({
      onSuccess: () => {
        clearSelection();
      },
    });

  const updateSelected = useCallback(
    (attended) => {
      if (selectedIds.length === 0) return;
      updateMessages({ ids: selectedIds, attended, type });
    },
    [selectedIds, updateMessages]
  );

  const deleteSelected = useCallback(async () => {
    if (selectedIds.length === 0) return;
    await deleteMessages({ ids: selectedIds, type });
  }, [selectedIds, deleteMessages]);

  return {
    data,
    isLoading,
    refetch,
    selectedIds,
    isAllSelected,
    isIndeterminate,
    toggleSelect,
    toggleSelectAll,
    isUpdating,
    isDeleting,
    updateSelected,
    deleteSelected, isRefetching
  };
}

export default useFormMessagesSelection;
