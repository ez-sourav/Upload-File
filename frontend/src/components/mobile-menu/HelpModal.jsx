import { X, Upload, FileText, HelpCircle,Eye } from "lucide-react";

export default function HelpModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 ">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="absolute bottom-0 left-0 right-0
    bg-white shadow-2xl animate-slideUp overflow-y-auto
    h-screen sm:h-auto
    sm:max-h-[85vh]
    rounded-none sm:rounded-t-3xl">

        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Help</h2>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">

          {/* Upload Help */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-semibold text-gray-900">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Upload className="h-4 w-4 text-blue-600" />
              </div>
              <span>How to upload files</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Drag and drop files into the upload box</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Or click <b className="text-gray-900">Browse</b> to select files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Maximum file size: <b className="text-gray-900">20MB</b></span>
              </li>
            </ul>
          </div>

          {/* File Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-semibold text-gray-900">
              <div className="p-2 bg-green-50 rounded-lg">
                <FileText className="h-4 w-4 text-green-600" />
              </div>
              <span>File actions</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Tap a file to select it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Long press to select multiple files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 mt-0.5">•</span>
                <span>Use toolbar to delete or clear selection</span>
              </li>
            </ul>
          </div>

          {/* FAQ */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-semibold text-gray-900">
              <div className="p-2 bg-purple-50 rounded-lg">
                <HelpCircle className="h-4 w-4 text-purple-600" />
              </div>
              <span>FAQs</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Only supported file types are allowed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Uploads may fail if file size exceeds limit</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">•</span>
                <span>Deleted files cannot be recovered</span>
              </li>
            </ul>
          </div>

         {/* Preview support */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5 font-semibold text-gray-900">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Eye className="h-4 w-4 text-indigo-600" />
              </div>
              <span>Preview support</span>
            </div>
            <ul className="space-y-2 text-sm text-gray-600 pl-1">
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Images (JPG, PNG, WEBP, etc.)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>PDF files</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-600 mt-0.5">•</span>
                <span>Text files (.txt)</span>
              </li>
            </ul>
            <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              Other file types (Word, Excel, ZIP, etc.) cannot be previewed and must be downloaded.
            </p>
          </div>


        </div>

        {/* Footer */}
        <div className="px-6 pb-8 pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 text-white font-semibold hover:from-blue-700 hover:to-blue-800 active:from-blue-800 active:to-blue-900 transition-all shadow-sm"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}