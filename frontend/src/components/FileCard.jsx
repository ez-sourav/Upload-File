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

  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);

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

  // ---- SKELETON ----
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg md:rounded-xl shadow animate-pulse">
        <div className="aspect-video md:aspect-4/3 bg-gray-200 rounded-t-lg md:rounded-t-xl" />
        <div className="px-3 py-2 md:p-4 space-y-2 md:space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  const downloadFile = () => {
  const url = `http://localhost:3000/files/download/${file._id}`;
  window.open(url, "_self");
};

const previewFile = () => {
  window.open(file.fileUrl, "_blank");
};

const canPreview = isImage || isPdf;


  return (
    <div className="relative group bg-white rounded-lg md:rounded-xl shadow transition-all duration-300 hover:shadow-lg md:hover:scale-[1.02]">
      {/* ================= DESKTOP PREVIEW (UNCHANGED) ================= */}
      <div className="hidden md:block relative aspect-video md:aspect-4/3 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-lg md:rounded-t-xl">
        {isImage && !imageError ? (
          <img
            src={file.fileUrl}
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

        {/* Hover Overlay */}
        <div className="hidden md:flex absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 pb-4 z-10">
          <button
            onClick={previewFile}
            className="p-2.5 bg-white rounded-full hover:bg-gray-100"
          >
            <Eye className="h-5 w-5" />
          </button>

          <button
           onClick={downloadFile}
            className="p-2.5 bg-white rounded-full hover:bg-gray-100"
          >
            <Download className="h-5 w-5" />
          </button>

          <button
            onClick={() => onDelete(file._id)}
            className="p-2.5 bg-red-600 text-white rounded-full hover:bg-red-700"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Badge */}
        <span
          className={`absolute top-3 left-3 px-2 py-0.5 rounded-full text-xs font-medium ${
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

      {/* ================= INFO ================= */}
      <div className="relative px-3 py-2 md:p-4">
        {/* ---------- MOBILE LIST HEADER ---------- */}
        <div className="flex items-center gap-3 md:justify-between">
          {/* Left: Icon + Text */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile icon */}
            <div className="md:hidden shrink-0">
              {isImage ? (
                <FileImage className="h-9 w-9 text-red-400" />
              ) : isPdf ? (
                <FileText className="h-9 w-9 text-red-400" />
              ) : (
                <FileText className="h-9 w-9 text-purple-400" />
              )}
            </div>

            {/* Name + subtitle */}
            <div className="min-w-0">
              <h3
                className="font-medium truncate text-sm md:text-base"
                title={file.originalName}
              >
                {file.originalName}
              </h3>

              {/* Mobile subtitle */}
              <p className="md:hidden text-xs text-gray-500 mt-0.5">
                You opened ·{" "}
                {new Date(file.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Right: Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setMobileSheetOpen(true); // 📱 mobile
                } else {
                  setMenuOpen(!menuOpen); // 🖥 desktop
                }
              }}
              className="p-2 rounded-full hover:bg-gray-100 hover:cursor-pointer"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mt-2 w-36 md:w-40 bg-white rounded-xl shadow-xl z-50 overflow-hidden">
                <button
                  onClick={() => {
                    previewFile();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:cursor-pointer hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  Preview
                </button>

                <button
                  onClick={() => {downloadFile(); setMobileSheetOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:cursor-pointer hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 text-green-600" />
                  Download
                </button>

                <button
                  onClick={() => {
                    onDelete(file._id);
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:cursor-pointer text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ---------- DESKTOP META ---------- */}
        <div className="hidden md:flex mt-3 items-center gap-4 text-xs text-gray-500">
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

      {/* ================= MOBILE BOTTOM SHEET ================= */}
      {mobileSheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileSheetOpen(false)}
          />

          {/* Bottom Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-xl animate-slideUp">
            <div className="p-4 space-y-2">
              <button
                onClick={() => {
                  previewFile();
                  setMobileSheetOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 text-base hover:bg-gray-50 rounded-xl"
              >
                <Eye className="h-5 w-5 text-blue-600" />
                Preview
              </button>

              <button
                onClick={() => {
                  downloadFile();

                  setMobileSheetOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 text-base hover:bg-gray-50 rounded-xl"
              >
                <Download className="h-5 w-5 text-green-600" />
                Download
              </button>

              <button
                onClick={() => {
                  onDelete(file._id);
                  setMobileSheetOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 text-base text-red-600 hover:bg-red-50 rounded-xl"
              >
                <Trash2 className="h-5 w-5" />
                Delete
              </button>

              <button
                onClick={() => setMobileSheetOpen(false)}
                className="w-full px-4 py-4 text-base font-medium text-gray-600 hover:bg-gray-100 rounded-xl"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
