// components/file-list/SelectionToolbar.jsx
import { CheckSquare, Square, X, Trash2 } from "lucide-react";

export default function SelectionToolbar({
  selectedCount,
  isAllSelected,
  onSelectAll,
  onClear,
  onDelete,
}) {
  return (
    <div className="sticky top-0 z-20 animate-slideDown">
      <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg overflow-hidden">
        <div className="px-4 md:px-5 py-1.5 md:py-2 flex items-center justify-between gap-4">
          {/* Left: Select All Toggle */}
          <button
            onClick={isAllSelected ? onClear : onSelectAll}
            className="flex items-center gap-2.5 text-white font-medium text-sm md:text-base transition-all hover:scale-105 active:scale-95"
          >
            <div className="p-1 bg-white/20 rounded-lg backdrop-blur-sm transition-colors hover:bg-white/30">
              {isAllSelected ? (
                <CheckSquare className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Square className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </div>
            <span className="hidden sm:inline">
              {isAllSelected ? "Deselect All" : "Select All"}
            </span>
            <span className="sm:hidden">
              {isAllSelected ? "Deselect" : "Select All"}
            </span>
          </button>

          {/* Center: Selected Count Badge */}
          <div className="flex items-center gap-2">
            <div className="px-3 md:px-4 py-1.5 md:py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-semibold text-sm md:text-base">
                {selectedCount} {selectedCount === 1 ? "Selected" : "Selected"}
              </span>
            </div>
          </div>

          {/* Right: Clear Button +Delete Btn */}
          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-1.5 bg-red-500/90 rounded-lg hover:bg-red-600 transition-all"
              aria-label="Delete selected"
            >
              <Trash2 className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </button>

            {/* Close */}
            <button
              onClick={onClear}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-all"
              aria-label="Clear selection"
            >
              <X className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Progress bar indicator */}
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-white/40 transition-all duration-300 ease-out"
            style={{ width: isAllSelected ? "100%" : "0%" }}
          />
        </div>
      </div>
    </div>
  );
}
