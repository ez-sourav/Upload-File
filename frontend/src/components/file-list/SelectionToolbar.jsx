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
      <div className="bg-linear-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg overflow-hidden">
        <div className="px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 flex items-center justify-between gap-2 sm:gap-3 md:gap-4">
          {/* Left: Select All Toggle */}
          <button
            onClick={isAllSelected ? onClear : onSelectAll}
            className="flex items-center gap-1.5 sm:gap-2 md:gap-2.5 text-white font-medium text-xs sm:text-sm md:text-base transition-all hover:scale-105 active:scale-95"
          >
            <div className="p-0.5 sm:p-1 bg-white/20 rounded-md sm:rounded-lg backdrop-blur-sm transition-colors hover:bg-white/30">
              {isAllSelected ? (
                <CheckSquare className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              ) : (
                <Square className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5" />
              )}
            </div>
            <span className="hidden sm:inline">
              {isAllSelected ? "Deselect All" : "Select All"}
            </span>
            <span className="sm:hidden">
              {isAllSelected ? "Deselect" : "Select"}
            </span>
          </button>

          {/* Center: Selected Count Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="px-2.5 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 bg-white/20 backdrop-blur-sm rounded-full">
              <span className="text-white font-semibold text-xs sm:text-sm md:text-base whitespace-nowrap">
                <span className="hidden xs:inline">{selectedCount} </span>
                <span className="xs:hidden">{selectedCount}</span>
                <span className="hidden xs:inline">{selectedCount === 1 ? "Selected" : "Selected"}</span>
              </span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
            {/* Delete */}
            <button
              onClick={onDelete}
              className="p-1 sm:p-1.5 bg-red-500/90 rounded-md sm:rounded-lg hover:bg-red-600 transition-all active:scale-95"
              aria-label="Delete selected"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
            </button>

            {/* Close */}
            <button
              onClick={onClear}
              className="p-1 sm:p-1.5 bg-white/20 rounded-md sm:rounded-lg hover:bg-white/30 transition-all active:scale-95"
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white" />
            </button>
          </div>
        </div>

        {/* Progress bar indicator */}
        <div className="h-0.5 sm:h-1 bg-white/20">
          <div
            className="h-full bg-white/40 transition-all duration-300 ease-out"
            style={{ width: isAllSelected ? "100%" : "0%" }}
          />
        </div>
      </div>
      
      {/* Animation Styles */}
      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
        
        /* Custom xs breakpoint */
        @media (min-width: 475px) {
          .xs\:inline {
            display: inline;
          }
          .xs\:hidden {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}