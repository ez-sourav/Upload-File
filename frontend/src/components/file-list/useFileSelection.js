import { useMemo } from "react";

export default function useFileSelection({
  files = [],
  selectedIds = [],
  setSelectedIds,
}) {
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedIds(files.map((f) => f._id));
  };

  const clearSelection = () => {
    setSelectedIds([]);
  };

  const isAllSelected = useMemo(() => {
    return files.length > 0 && selectedIds.length === files.length;
  }, [files, selectedIds]);

  const hasSelection = selectedIds.length > 0;

  return {
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
    hasSelection,
  };
}
