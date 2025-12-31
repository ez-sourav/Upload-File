import { useEffect, useRef, useState } from "react";
import {
  FileImage,
  FileText,
  File,
  FileArchive,
  FileSpreadsheet,
  Download,
  Trash2,
  Eye,
  MoreVertical,
  Calendar,
  HardDrive,
  Check,
} from "lucide-react";
import api from "../api/api";
import toast from "react-hot-toast";

export default function FileCard({
  file,
  isDemo = false,
  onDelete,
  isLoading = false,
  isSelected = false,
  hasSelection = false,
  onSelect,
  clearSelection,
  isDesktop,
}) {
  if (!file) return null;

  const [menuOpen, setMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const menuRef = useRef(null);

  const longPressTimer = useRef(null);
  const LONG_PRESS_DURATION = 450; // ms

  // ---- FILE TYPE CHECKS ----
  const isImage = file?.fileType?.startsWith("image/");
  const isPdf = file?.fileType === "application/pdf";
  const canPreview = isImage || isPdf;

  const fileName = file.originalName?.toLowerCase() || "";

  const isWord = fileName.endsWith(".doc") || fileName.endsWith(".docx");
  const isExcel = fileName.endsWith(".xls") || fileName.endsWith(".xlsx");
  const isZip =
    fileName.endsWith(".zip") ||
    fileName.endsWith(".rar") ||
    fileName.endsWith(".7z");

  const touchStartY = useRef(0);
  const touchCurrentY = useRef(0);

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

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const downloadFile = async () => {
    if (isDemo) {
      toast.error("Login to download files");
      return;
    }
    try {
      const res = await api.get(`/files/download/${file._id}`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      toast.error("Download failed. Please login again.");
    }
  };

  const previewFile = () => {
    if (!canPreview) {
      toast.error("Preview available only for images and PDF files");
      return;
    }
    window.open(file.fileUrl, "_blank");
  };

  const handleTouchStart = () => {
    if (isDesktop) return;
    longPressTimer.current = setTimeout(() => {
      onSelect?.();
    }, LONG_PRESS_DURATION);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };
  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // ---- SKELETON ----
  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg animate-pulse overflow-hidden">
        <div className="aspect-video md:aspect-4/3 bg-linear-to-br from-gray-200 to-gray-300" />
        <div className="px-4 py-3 md:p-5 space-y-3">
          <div className="h-4 bg-gray-200 rounded-lg w-3/4" />
          <div className="h-3 bg-gray-200 rounded-lg w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group rounded-2xl shadow-lg transition-all duration-300 overflow-hidden
        ${
          isSelected
            ? "ring-2 ring-blue-500 bg-linear-to-br from-blue-50 to-indigo-50 shadow-blue-500/30"
            : "bg-white hover:shadow-xl md:hover:scale-[1.02]"
        }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={() => {
        if (isDesktop) return;
        if (hasSelection) {
          onSelect?.();
        }
      }}
    >
      {/* Desktop checkbox */}
      {isDesktop && (
        <div
          className="absolute top-3 right-3 z-30 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            if (isDemo) return;
            onSelect?.();
          }}
        >
          <div
            className={`h-6 w-6 rounded-xl border-2 flex items-center justify-center transition-all duration-200 shadow-lg
              ${
                isSelected
                  ? "bg-linear-to-br from-blue-500 to-indigo-600 border-blue-600 scale-110"
                  : "bg-white/95 backdrop-blur-sm border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
          >
            {isSelected && <Check className="h-4 w-4 text-white stroke-3" />}
          </div>
        </div>
      )}

      {/* ================= DESKTOP PREVIEW ================= */}
      <div className="hidden md:block relative h-40 bg-linear-to-br from-gray-100 to-gray-200 overflow-hidden">
        {isImage && !imageError ? (
          <img
            src={file.fileUrl}
            alt={file.originalName}
            onError={() => setImageError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-linear-to-br from-gray-50 to-gray-100">
            {isPdf ? (
              <File className="h-14 w-14 text-red-500" />
            ) : isWord ? (
              <FileText className="h-14 w-14 text-blue-600" />
            ) : isExcel ? (
              <FileSpreadsheet className="h-14 w-14 text-green-600" />
            ) : isZip ? (
              <FileArchive className="h-14 w-14 text-yellow-500" />
            ) : (
              <FileText className="h-14 w-14 text-purple-400" />
            )}
          </div>
        )}

        {/* Hover Overlay */}
        {!hasSelection && (
          <div className="hidden md:flex absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 items-center justify-center gap-3 z-10">
            <button
              onClick={() => !isSelected && previewFile()}
              disabled={!canPreview}
              className={`p-3 rounded-xl shadow-xl transition-all hover:scale-110 active:scale-95
                ${
                  canPreview
                    ? "bg-white hover:bg-gray-100"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
            >
              <Eye
                className={`h-5 w-5 ${
                  canPreview ? "text-blue-600" : "text-gray-400"
                }`}
              />
            </button>

            <button
              onClick={downloadFile}
              className="p-3 shadow-xl bg-white rounded-xl hover:bg-gray-100 hover:scale-110 active:scale-95 transition-all"
            >
              <Download className="h-5 w-5 text-green-600" />
            </button>

            <button
              onClick={() => {
                if (isDemo) {
                  toast.error("Login to delete files");
                  return;
                }
                if (!isSelected) onDelete(file._id);
              }}
              disabled={isDemo || isSelected}
              className={`p-3 shadow-xl rounded-xl transition-all hover:scale-110 active:scale-95 ${
                isSelected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Trash2 className="h-5 w-5 text-white" />
            </button>
          </div>
        )}

        {/* Badge */}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-xl text-xs font-semibold shadow-lg backdrop-blur-sm ${
            isImage
              ? "bg-blue-100/90 text-blue-700"
              : isPdf
              ? "bg-red-100/90 text-red-700"
              : isWord
              ? "bg-blue-100/90 text-blue-700"
              : isExcel
              ? "bg-green-100/90 text-green-700"
              : isZip
              ? "bg-yellow-100/90 text-yellow-700"
              : "bg-gray-100/90 text-gray-700"
          }`}
        >
          {isImage
            ? "Image"
            : isPdf
            ? "PDF"
            : isWord
            ? "Word"
            : isExcel
            ? "Excel"
            : isZip
            ? "ZIP"
            : "File"}
        </span>
      </div>

      {/* ================= INFO ================= */}
      <div className="relative px-4 py-3 md:px-5 md:py-4">
        <div className="flex items-center gap-3 md:justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="md:hidden shrink-0 p-2 bg-linear-to-br from-gray-50 to-gray-100 rounded-xl">
              {isImage ? (
                <FileImage className="h-8 w-8 text-blue-500" />
              ) : isPdf ? (
                <File className="h-8 w-8 text-red-500" />
              ) : isWord ? (
                <FileText className="h-8 w-8 text-blue-600" />
              ) : isExcel ? (
                <FileSpreadsheet className="h-8 w-8 text-green-600" />
              ) : isZip ? (
                <FileArchive className="h-8 w-8 text-yellow-500" />
              ) : (
                <FileText className="h-8 w-8 text-gray-400" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-semibold truncate text-sm md:text-base text-gray-900">
                {file.originalName}
              </h3>

              <p className="md:hidden text-xs text-gray-500 mt-1 font-medium">
                {new Date(file.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>

          {/* Mobile selected indicator */}
          {!isDesktop && hasSelection && (
            <div
              className={`ml-2 flex items-center justify-center
                h-7 w-7 rounded-xl border-2 shadow-sm
                transition-all duration-200
                ${
                  isSelected
                    ? "bg-linear-to-br from-blue-500 to-indigo-600 border-blue-600 scale-110"
                    : "bg-white border-gray-300"
                }`}
            >
              {isSelected && <Check className="h-4 w-4 text-white stroke-3" />}
            </div>
          )}

          {/* Menu */}
          <div className="relative shrink-0" ref={menuRef}>
            <button
              onTouchStart={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                if (hasSelection) {
                  clearSelection?.();
                }
                window.innerWidth < 768
                  ? setMobileSheetOpen(true)
                  : setMenuOpen(!menuOpen);
              }}
              className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <MoreVertical className="h-5 w-5 text-gray-600" />
            </button>

            {menuOpen && (
              <div className="absolute right-0 bottom-full mb-2 w-44 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                <button
                  onClick={() => {
                    previewFile();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-blue-50 transition-colors"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span>Preview</span>
                </button>

                <button
                  onClick={() => {
                    downloadFile();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  <Download className="h-4 w-4 text-green-600" />
                  <span>Download</span>
                </button>

                <button
                  onClick={() => {
                    if (isDemo) {
                      toast.error("Login to delete files");
                      return;
                    }
                    onDelete(file._id);
                    setMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-sm font-medium
                    ${
                      isDemo
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-red-600 hover:bg-red-50"
                    }`}
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop meta */}
        <div className="hidden md:flex mt-4 items-center gap-4 text-xs text-gray-600 font-medium">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
            <HardDrive className="h-3.5 w-3.5" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 rounded-lg">
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
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileSheetOpen(false)}
          />

          {/* Bottom Sheet */}
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp"
            onTouchStart={(e) => {
              touchStartY.current = e.touches[0].clientY;
            }}
            onTouchMove={(e) => {
              touchCurrentY.current = e.touches[0].clientY;
            }}
            onTouchEnd={() => {
              const deltaY = touchCurrentY.current - touchStartY.current;
              if (deltaY > 80) {
                setMobileSheetOpen(false);
              }
              touchStartY.current = 0;
              touchCurrentY.current = 0;
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-4 pb-3">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>

            {/* File info header */}
            <div className="px-5 pb-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-linear-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-sm">
                  {isImage ? (
                    <FileImage className="h-9 w-9 text-blue-500" />
                  ) : isPdf ? (
                    <File className="h-9 w-9 text-red-500" />
                  ) : isWord ? (
                    <FileText className="h-9 w-9 text-blue-600" />
                  ) : isExcel ? (
                    <FileSpreadsheet className="h-9 w-9 text-green-600" />
                  ) : isZip ? (
                    <FileArchive className="h-9 w-9 text-yellow-500" />
                  ) : (
                    <FileText className="h-9 w-9 text-gray-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {file.originalName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 font-medium">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-5 space-y-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  previewFile();
                  setMobileSheetOpen(false);
                }}
                disabled={hasSelection || !canPreview}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all
                  ${
                    hasSelection
                      ? "text-gray-400 cursor-not-allowed bg-gray-50"
                      : "text-gray-900 active:scale-[0.98] hover:bg-blue-50"
                  }`}
              >
                <div
                  className={`p-3 rounded-xl shadow-sm ${
                    hasSelection ? "bg-gray-200" : "bg-blue-100"
                  }`}
                >
                  <Eye
                    className={`h-5 w-5 ${
                      hasSelection ? "text-gray-400" : "text-blue-600"
                    }`}
                  />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Preview</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {canPreview ? "View file content" : "Preview not supported"}
                  </p>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDemo) {
                    toast.error("Login to download files");
                    return;
                  }
                  downloadFile();
                  setMobileSheetOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-900 active:scale-[0.98] hover:bg-green-50 transition-all"
              >
                <div className="p-3 bg-green-100 rounded-xl shadow-sm">
                  <Download className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Download</p>
                  <p className="text-xs text-gray-500 mt-0.5">Save to device</p>
                </div>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (isDemo) {
                    toast.error("Login to delete files");
                    return;
                  }
                  onDelete(file._id);
                  setMobileSheetOpen(false);
                }}
                className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-600 active:scale-[0.98] hover:bg-red-50 transition-all"
              >
                <div className="p-3 bg-red-100 rounded-xl shadow-sm">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold">Delete</p>
                  <p className="text-xs text-red-400 mt-0.5">Remove permanently</p>
                </div>
              </button>
            </div>

            {/* Cancel */}
            <div className="px-5 pb-6 pt-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMobileSheetOpen(false);
                }}
                className="w-full px-4 py-4 font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-2xl transition-all active:scale-[0.98]"
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