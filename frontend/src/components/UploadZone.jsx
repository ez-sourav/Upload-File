import { useState, useMemo } from "react";
import {
  Upload,
  FileImage,
  FileText,
  File,
  X,
  CheckCircle2,
  AlertCircle,
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

  const totalSize =
    selectedFiles?.reduce((acc, file) => acc + file.size, 0) || 0;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* DROP ZONE */}
      <div
        onDragOver={!isMobile ? onDragOver : undefined}
        onDragLeave={!isMobile ? onDragLeave : undefined}
        onDrop={!isMobile ? onDrop : undefined}
        className={`relative border-2 border-dashed rounded-xl md:rounded-2xl
          transition-all duration-300
          ${
            isDragging && !isMobile
              ? "border-blue-500 bg-blue-50 scale-[1.02]"
              : "border-gray-300 bg-linear-to-br from-gray-50 to-white"
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
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />

        <div className="p-6 md:p-12 text-center">
          <div className="mx-auto mb-4">
            <div className="inline-flex p-4 rounded-full bg-blue-50 ring-8 ring-blue-50">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          {/* TEXT */}
          <h3 className="font-semibold text-base md:text-lg text-gray-900 mb-2">
            {isMobile
              ? "Tap to upload files"
              : isDragging
              ? "Drop your files here"
              : "Upload Files"}
          </h3>

          <p className="text-xs md:text-sm text-gray-600 px-2">
            {isMobile ? (
              "Choose files from your device"
            ) : (
              <>
                Drag and drop your files here, or{" "}
                <label
                  htmlFor="file-upload"
                  className="text-blue-600 font-medium cursor-pointer underline"
                >
                  browse
                </label>
              </>
            )}
          </p>

          <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              All file types
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
              Max 20MB
            </span>
          </div>
        </div>
      </div>

      {/* ERROR + FILE LIST (UNCHANGED) */}
      {errors.length > 0 && (
        <div className="space-y-2">
          {errors.map((error, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200"
            >
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <p className="text-sm text-red-800 flex-1">{error}</p>
              <button
                onClick={() =>
                  setErrors((prev) => prev.filter((_, i) => i !== index))
                }
              >
                <X className="h-4 w-4 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-semibold">
                Selected Files ({selectedFiles.length})
              </p>
              <p className="text-xs text-gray-500">
                Total size: {formatSize(totalSize)}
              </p>
            </div>
            <button
              onClick={clearAll}
              className="text-xs text-red-600 hover:text-red-700"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg border bg-white"
              >
                {getFileIcon(file)}
                <div className="flex-1 truncate">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button onClick={() => removeFile(index)}>
                  <X className="h-4 w-4 text-gray-400 hover:text-red-600" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
