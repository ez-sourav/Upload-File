import { Trash2, X, AlertTriangle } from "lucide-react";

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  loading,
  fileName,
}) {
  if (!open) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm sm:max-w-md rounded-2xl bg-white shadow-2xl animate-modal-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <h3
            id="modal-title"
            className="text-lg sm:text-xl font-semibold text-gray-900"
          >
            Delete File
          </h3>
          <button
            onClick={onClose}
            disabled={loading}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 hover:cursor-pointer"
            aria-label="Close modal"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="px-4 sm:px-6 py-5 text-center space-y-4">
          
          {/* Icon */}
          <div className="mx-auto flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-red-50 ring-8 ring-red-50 animate-pulse">
            <Trash2 className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
          </div>

          {/* Warning badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 animate-bounce" />
            <span className="text-xs sm:text-sm font-semibold text-amber-800">
              This action is permanent
            </span>
          </div>

          {/* Text */}
          <div className="space-y-2">
            <p className="text-sm sm:text-base font-medium text-gray-900">
              Are you sure you want to delete this file?
            </p>

            {fileName && (
              <p className="text-xs sm:text-sm text-gray-700 font-mono bg-gray-100 px-3 py-1.5 rounded-md truncate max-w-full mx-auto">
                {fileName}
              </p>
            )}

            <p className="text-xs sm:text-sm text-gray-500">
              This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-4 sm:px-6 py-4 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border-2 border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 active:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/40 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
                  />
                </svg>
                Deleting…
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
