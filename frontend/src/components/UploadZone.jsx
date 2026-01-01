import { useState, useMemo } from "react";
import {
  Upload,
  FileImage,
  FileText,
  File,
  FileSpreadsheet,
  FileArchive,
  X,
  CheckCircle2,
  AlertCircle,
  Trash2,
  CloudUpload,
} from "lucide-react";

export default function UploadZone({
  selectedFiles = [],
  setSelectedFiles,
  isUploading,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  // ✅ Detect mobile once
  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  }, []);

  const onDragOver = (e) => {
    e.preventDefault();
    if (!isMobile) setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    if (!isMobile) setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    if (isMobile) return;

    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
    e.target.value = "";
  };

  const validateAndAddFiles = (files) => {
    const newErrors = [];
    const validFiles = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        newErrors.push(`${file.name} exceeds 20MB limit`);
      } else {
        validFiles.push(file);
      }
    });

    setErrors(newErrors);
    if (validFiles.length > 0) {
      setSelectedFiles((prev) => [...prev, ...validFiles]);
    }

    if (newErrors.length > 0) {
      setTimeout(() => setErrors([]), 5000);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setSelectedFiles([]);
    setErrors([]);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file) => {
    const type = file.type;
    const name = file.name?.toLowerCase();

    // 🖼 Images
    if (type.startsWith("image/")) {
      return <FileImage className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />;
    }

    // 📄 PDF
    if (type === "application/pdf") {
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />;
    }

    // 📝 Word
    if (
      type === "application/msword" ||
      type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      return <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />;
    }

    // 📊 Excel
    if (
      type === "application/vnd.ms-excel" ||
      type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      return <FileSpreadsheet className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />;
    }

    // 🗜 ZIP / RAR
    if (
      type === "application/zip" ||
      name.endsWith(".zip") ||
      name.endsWith(".rar")
    ) {
      return <FileArchive className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />;
    }

    // 📁 Default
    return <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />;
  };

  const totalSize =
    selectedFiles?.reduce((acc, file) => acc + file.size, 0) || 0;

  return (
    <div className="space-y-3 sm:space-y-4 md:space-y-5">
      {/* DROP ZONE */}
      <div
        onDragOver={!isMobile ? onDragOver : undefined}
        onDragLeave={!isMobile ? onDragLeave : undefined}
        onDrop={!isMobile ? onDrop : undefined}
        className={`relative border-2 border-dashed rounded-2xl sm:rounded-3xl
          transition-all duration-300 overflow-hidden
          ${
            isDragging && !isMobile
              ? "border-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 scale-[1.01] shadow-xl shadow-blue-500/20"
              : "border-gray-300 bg-linear-to-br from-white to-gray-50"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer hover:border-blue-400 hover:shadow-lg"}
        `}
      >
        <input
          type="file"
          multiple
          accept="*/*"
          onChange={onFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          id="file-upload"
        />

        <div className="p-6 sm:p-8 md:p-12 text-center relative pointer-events-none">
          {/* Animated background decoration */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-blue-500 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-indigo-500 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10">
            {/* Icon */}
            <div className="mx-auto mb-3 sm:mb-4 md:mb-5">
              <div className="inline-flex p-3 sm:p-4 md:p-5 rounded-xl sm:rounded-2xl bg-linear-to-br from-blue-500 to-indigo-500 shadow-lg sm:shadow-xl shadow-blue-500/30 ring-4 sm:ring-8 ring-blue-50 transition-transform hover:scale-105">
                <CloudUpload className="h-5 w-5 sm:h-6 sm:w-6 text-white" strokeWidth={2} />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base sm:text-lg md:text-xl text-gray-900 mb-1.5 sm:mb-2">
              {isMobile
                ? "Tap to Upload Files"
                : isDragging
                ? "Drop Your Files Here"
                : "Upload Your Files"}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-gray-600 px-2 mb-3 sm:mb-4 md:mb-5">
              {isMobile ? (
                "Choose files from your device"
              ) : (
                <>
                  Drag and drop your files here, or{" "}
                  <label
                    htmlFor="file-upload"
                    className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700 underline decoration-2 underline-offset-2"
                  >
                    browse
                  </label>
                </>
              )}
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <span className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">All file types</span>
              </span>
              <span className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-1.5 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm border border-gray-200">
                <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-500" />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-700">Max 20MB</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ERRORS */}
      {errors.length > 0 && (
        <div className="space-y-1.5 sm:space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-red-50 border border-red-200 shadow-sm animate-in"
            >
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm text-red-800 flex-1 font-medium">{error}</p>
              <button
                onClick={() =>
                  setErrors((prev) => prev.filter((_, i) => i !== index))
                }
                className="hover:bg-red-100 p-1 rounded-lg transition-colors"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* FILE LIST */}
      {selectedFiles.length > 0 && (
        <div className="bg-linear-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl border border-gray-200 shadow-md sm:shadow-lg p-4 sm:p-5 md:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-5 pb-3 sm:pb-4 border-b border-gray-200">
            <div>
              <p className="text-sm sm:text-base md:text-lg font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2">
                <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 bg-blue-100 text-blue-700 rounded-lg text-xs sm:text-sm font-bold">
                  {selectedFiles.length}
                </span>
                <span className="hidden xs:inline">Selected Files</span>
                <span className="xs:hidden">Files</span>
              </p>
              <p className="text-[10px] sm:text-xs md:text-sm text-gray-500 mt-0.5 sm:mt-1 font-medium">
                Total: {formatSize(totalSize)}
              </p>
            </div>
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs sm:text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all active:scale-95"
            >
              <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Clear All</span>
              <span className="xs:hidden">Clear</span>
            </button>
          </div>

          {/* File List */}
          <div className="space-y-2 sm:space-y-2.5 max-h-56 sm:max-h-64 overflow-y-auto custom-scrollbar">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-linear-to-br from-gray-50 to-gray-100 rounded-lg sm:rounded-xl group-hover:from-blue-50 group-hover:to-indigo-50 transition-colors shrink-0">
                  {getFileIcon(file)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-semibold text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 font-medium">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="shrink-0 p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors group/btn"
                >
                  <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400 group-hover/btn:text-red-600 transition-colors" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Scrollbar Styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slide-in 0.3s ease-out;
        }
        
        /* Custom xs breakpoint for extra small devices */
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