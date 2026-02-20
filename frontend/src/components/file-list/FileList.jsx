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
      <div className="mt-4 md:mt-6 animate-in fade-in duration-300">
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-in fade-in slide-in-from-bottom-2 duration-500"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <FileCard isLoading />
            </div>
          ))}
        </div>
      </div>
    );
  }


  if (!files || files.length === 0) {
    return (
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <EmptyState />
      </div>
    );
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
        <div className="animate-in slide-in-from-top fade-in duration-300">
          <SelectionToolbar
            selectedCount={selectedIds.length}
            isAllSelected={isAllSelected}
            onSelectAll={selectAll}
            onClear={clearSelection}
            onDelete={() => onDelete(selectedIds)}
          />
        </div>
      )}

      {/* File Grid */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}
      >
        {files.map((file, index) => (
          <div
            key={file._id}
            className="animate-in fade-in slide-in-from-bottom-2 duration-500"
            style={{ animationDelay: `${index * 30}ms` }}
          >
            <FileCard
              file={file}
              isDemo={file.isDemo}
              onDelete={onDelete}
              isSelected={selectedIds.includes(file._id)}
              onSelect={() => toggleSelect(file._id)}
              hasSelection={hasSelection}
              isDesktop={isDesktop}
              clearSelection={clearSelection}
            />
          </div>
        ))}
      </div>
    </div>
  );
}