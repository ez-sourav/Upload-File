import { useState } from "react";
import { Upload, FileImage, FileText, X } from "lucide-react";

export default function UploadZone({
  selectedFiles,
  setSelectedFiles,
  isUploading,
}) {
  const [isDragging, setIsDragging] = useState(false);

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const onFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatSize = (bytes) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

  return (
    <div className="space-y-3 md:space-y-4">
      {/* DROP ZONE */}
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl
          p-6 md:p-10 text-center cursor-pointer transition
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-300"
          }
          ${isUploading ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        <input
          type="file"
          multiple
          accept="*/*"
          onChange={onFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />

        <Upload className="mx-auto h-8 w-8 md:h-10 md:w-10 text-gray-400 mb-2 md:mb-3" />

        <p className="font-medium text-sm md:text-base">
          {isDragging ? "Drop files here" : "Drag & drop files"}
        </p>

        <p className="text-xs md:text-sm text-gray-500">
          or tap to browse · All file types supported
        </p>

        <p className="text-[11px] md:text-xs text-gray-400 mt-1">
          Max file size: 20MB
        </p>
      </div>

      {/* SELECTED FILES */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs md:text-sm font-medium">
            Selected files ({selectedFiles.length})
          </p>

          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-2.5 md:p-3 rounded-lg bg-gray-50 border"
            >
              {file.type.startsWith("image/") ? (
                <FileImage className="h-4 w-4 md:h-5 md:w-5 text-blue-500" />
              ) : (
                <FileText className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
              )}

              <div className="flex-1 min-w-0">
                <p className="text-xs md:text-sm font-medium truncate">
                  {file.name}
                </p>
                <p className="text-[11px] md:text-xs text-gray-500">
                  {formatSize(file.size)}
                </p>
              </div>

              <button
                onClick={() => removeFile(index)}
                className="p-1.5 md:p-2 rounded-full hover:bg-red-100 text-gray-400 hover:text-red-600"
              >
                <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
