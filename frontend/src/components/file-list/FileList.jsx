import FileCard from "../FileCard";
import EmptyState from "../EmptyState";

import useFileSelection from "./useFileSelection";
import SelectionToolbar from "./SelectionToolbar";

export default function FileList({
  files,
  onDelete,
  loading,
  selectedIds,
  setSelectedIds,
  isDesktop,
}) {
  if (loading) {
    return (
      <div className="mt-4 md:mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <FileCard key={i} isLoading />
          ))}
        </div>
      </div>
    );
  }

  if (!files || files.length === 0) {
    return <EmptyState />;
  }

  // 🔥 Selection logic (NEW)
  const {
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
    hasSelection,
  } = useFileSelection({
    files,
    selectedIds,
    setSelectedIds,
  });

  return (
    <div className="mt-4 md:mt-6 space-y-3">
      {/* ✅ SELECT ALL TOOLBAR */}
      {hasSelection && (
        <SelectionToolbar
          selectedCount={selectedIds.length}
          isAllSelected={isAllSelected}
          onSelectAll={selectAll}
          onClear={clearSelection}
        />
      )}

      {/* File Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2  gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            onDelete={onDelete}
            isSelected={selectedIds.includes(file._id)}
            onSelect={() => toggleSelect(file._id)}
            hasSelection={hasSelection}
            isDesktop={isDesktop}
            clearSelection={clearSelection}
          />
        ))}
      </div>
    </div>
  );
}
