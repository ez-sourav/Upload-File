import { useState } from "react";
import { Upload, FileImage, FileText, File, X, CheckCircle2, AlertCircle } from "lucide-react";

export default function UploadZone({
  selectedFiles = [],
  setSelectedFiles,
  isUploading,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    validateAndAddFiles(files);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    validateAndAddFiles(files);
    e.target.value = ""; // Reset input
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

    // Clear errors after 5 seconds
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
    if (file.type.startsWith("image/")) {
      return <FileImage className="h-5 w-5 text-blue-500" />;
    }
    if (file.type.includes("pdf")) {
      return <File className="h-5 w-5 text-red-500" />;
    }
    if (file.type.includes("document") || file.type.includes("word")) {
      return <FileText className="h-5 w-5 text-blue-600" />;
    }
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const totalSize = selectedFiles?.reduce((acc, file) => acc + file.size, 0) || 0;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* DROP ZONE */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl md:rounded-2xl
          transition-all duration-300 ease-in-out
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 scale-[1.02] shadow-lg shadow-blue-100"
              : "border-gray-300 bg-linear-to-br from-gray-50 to-white hover:border-blue-400 hover:shadow-md"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : "cursor-pointer"}
        `}
      >
        <input
          type="file"
          multiple
          accept="*/*"
          onChange={onFileChange}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          id="file-upload"
        />

        <div className="p-6 md:p-12 text-center">
          {/* Icon with animation */}
          <div className={`mx-auto mb-3 md:mb-4 transition-transform duration-300 ${isDragging ? "scale-110" : ""}`}>
            <div className="inline-flex p-3 md:p-4 rounded-full bg-linear-to-br from-blue-50 to-blue-100 ring-4 md:ring-8 ring-blue-50">
              <Upload className={`h-6 w-6 md:h-8 md:w-8 text-blue-600 ${isDragging ? "animate-bounce" : ""}`} />
            </div>
          </div>

          {/* Text */}
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-1.5 md:mb-2">
            {isDragging ? "Drop your files here" : "Upload Files"}
          </h3>
          
          <p className="text-xs md:text-sm text-gray-600 mb-1 px-2">
            Drag and drop your files here, or{" "}
            <label htmlFor="file-upload" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer underline decoration-2 underline-offset-2">
              browse
            </label>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mt-3 md:mt-4 text-[10px] md:text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-500" />
              All file types
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3 md:h-3.5 md:w-3.5 text-green-500" />
              Max 20MB per file
            </span>
          </div>
        </div>
      </div>

      {/* ERROR MESSAGES */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-2 md:gap-3 p-2.5 md:p-3 rounded-lg bg-red-50 border border-red-200 animate-slide-in"
            >
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs md:text-sm text-red-800 flex-1">{error}</p>
              <button
                onClick={() => setErrors((prev) => prev.filter((_, i) => i !== index))}
                className="text-red-400 hover:text-red-600 p-1"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* SELECTED FILES */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2.5 md:space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm font-semibold text-gray-900">
                Selected Files ({selectedFiles.length})
              </p>
              <p className="text-[10px] md:text-xs text-gray-500">
                Total size: {formatSize(totalSize)}
              </p>
            </div>
            <button
              onClick={clearAll}
              disabled={isUploading}
              className="text-[10px] md:text-xs font-medium text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-red-50 hover:cursor-pointer transition-colors"
            >
              Clear All
            </button>
          </div>

          {/* Files List */}
          <div className="space-y-2 max-h-56 md:max-h-64 overflow-y-auto pr-1 custom-scrollbar">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="group flex items-center gap-2.5 md:gap-3 p-2.5 md:p-3 rounded-lg md:rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
              >
                {/* File Icon */}
                <div className="shrink-0">
                  {getFileIcon(file)}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <div className="flex items-center gap-1.5 md:gap-2 mt-0.5">
                    <p className="text-[10px] md:text-xs text-gray-500">
                      {formatSize(file.size)}
                    </p>
                    <span className="text-gray-300">•</span>
                    <p className="text-[10px] md:text-xs text-gray-500 capitalize">
                      {file.type.split("/")[1] || "file"}
                    </p>
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  disabled={isUploading}
                  className="shrink-0 p-1.5 md:p-2 hover:cursor-pointer rounded-lg md:opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Remove file"
                >
                  <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}