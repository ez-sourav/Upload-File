import { useEffect, useRef, useState } from "react";
import {
  FileImage,
  FileText,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  HardDrive,
} from "lucide-react";

export default function FileCard({ file, onDelete, isLoading = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);

  // ---- FILE TYPE CHECKS ----
  const isImage = file?.fileType?.startsWith("image/");
  const isPdf = file?.fileType === "application/pdf";
  const isDocument = !isImage && !isPdf;

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const formatSize = (bytes) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

  
    //  SKELETON LOADER
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow animate-pulse">
        <div className="aspect-4/3 bg-gray-200 rounded-t-xl" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
          <div className="flex gap-4">
            <div className="h-3 w-16 bg-gray-200 rounded" />
            <div className="h-3 w-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group bg-white rounded-xl shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Preview */}
      <div className="relative aspect-4/3 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-xl">
        {isImage && !imageError ? (
          <img
            src={`http://localhost:3000/${file.path}`}
            alt={file.originalName}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            {isPdf ? (
              <FileText className="h-16 w-16 text-red-400" />
            ) : isDocument ? (
              <FileText className="h-16 w-16 text-purple-400" />
            ) : (
              <FileImage className="h-16 w-16 text-gray-400" />
            )}
          </div>
        )}

        {/* Overlay (VISIBLE ON MOBILE NOW) */}
        <div className="flex absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 pb-4 z-10">
          <button
            onClick={() =>
              window.open(`http://localhost:3000/${file.path}`, "_blank")
            }
            className="p-2.5 rounded-full bg-white hover:bg-gray-100 hover:cursor-pointer"
          >
            <Eye className="h-5 w-5" />
          </button>

          <a
            href={`http://localhost:3000/files/download/${file._id}`}
            className="p-2.5 rounded-full bg-white hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
          </a>

          <button
            onClick={() => onDelete(file._id)}
            className="p-2.5 rounded-full bg-red-600 text-white hover:bg-red-700 hover:cursor-pointer"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Badge */}
        <span
          className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-medium ${
            isImage
              ? "bg-blue-100 text-blue-600"
              : isPdf
              ? "bg-red-100 text-red-600"
              : "bg-purple-100 text-purple-600"
          }`}
        >
          {isImage ? "Image" : isPdf ? "PDF" : "Document"}
        </span>
      </div>

      {/* Info */}
      <div className="relative p-4">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium truncate" title={file.originalName}>
            {file.originalName}
          </h3>

          {/* Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md hover:bg-gray-100 hover:cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-40 bg-white rounded-xl shadow-xl  z-50 overflow-hidden">
                <button
                  onClick={() => {
                    window.open(
                      `http://localhost:3000/${file.path}`,
                      "_blank"
                    );
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  Preview
                </button>

                <a
                  href={`http://localhost:3000/files/download/${file._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 text-green-600" />
                  Download
                </a>

                <button
                  onClick={() => {
                    onDelete(file._id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3.5 w-3.5" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(file.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "2-digit",
              year: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  );
}
