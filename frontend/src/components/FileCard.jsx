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

export default function FileCard({ file, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const menuRef = useRef(null);

  // ---- FILE TYPE CHECKS (FIXED) ----
  const isImage = file.fileType?.startsWith("image/");
  const isPdf = file.fileType === "application/pdf";
  const isDocument = !isImage && !isPdf; // Word, Excel, etc.

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

  return (
    <div className="relative group bg-white rounded-xl shadow transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">
      {/* Preview */}
      <div className="relative aspect-4/3 bg-gray-100 overflow-hidden rounded-t-xl">
        {isImage && !imageError ? (
          <img
            src={`http://localhost:3000/${file.path}`}
            alt={file.originalName}
            onError={() => setImageError(true)}
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

        {/* Hover Overlay */}
        <div
          className="hidden md:flex absolute inset-0 bg-black/60
          opacity-0 md:group-hover:opacity-100
          transition items-center justify-center gap-3 z-10 "
        >
          <button
            onClick={() =>
              window.open(`http://localhost:3000/${file.path}`, "_blank")
            }
            className="p-2.5 rounded-full bg-white hover:cursor-pointer hover:bg-gray-100"
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
            className="p-2.5 rounded-full bg-red-600 text-white hover:cursor-pointer hover:bg-red-700"
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

          {/* 3-dot dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-md hover:bg-gray-100 hover:cursor-pointer"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-36 bg-white rounded-md shadow-lg z-50">
                <button
                  onClick={() =>
                    window.open(`http://localhost:3000/${file.path}`, "_blank")
                  }
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:cursor-pointer hover:bg-gray-100"
                >
                  <Eye className="h-4 w-4" /> Preview
                </button>

                <a
                  href={`http://localhost:3000/files/download/${file._id}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm hover:cursor-pointer hover:bg-gray-100"
                >
                  <Download className="h-4 w-4" /> Download
                </a>

                <button
                  onClick={() => onDelete(file._id)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm hover:cursor-pointer text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" /> Delete
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
