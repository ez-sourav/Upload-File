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
import { Check } from "lucide-react";

export default function FileCard({
  file,
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
  const isDocument = !isImage && !isPdf;
  const canPreview = isImage || isPdf;

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

  const formatSize = (bytes) =>
    bytes < 1024 ? `${bytes} B` : `${(bytes / 1024).toFixed(1)} KB`;

  const downloadFile = () => {
    const url = `http://localhost:3000/files/download/${file._id}`;
    window.open(url, "_self");
  };

  const previewFile = () => {
    if (canPreview) {
      window.open(file.fileUrl, "_blank");
    }
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
      <div className="bg-white rounded-lg md:rounded-xl shadow animate-pulse">
        <div className="aspect-video md:aspect-4/3 bg-gray-200 rounded-t-lg md:rounded-t-xl" />
        <div className="px-3 py-2 md:p-4 space-y-2 md:space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative group rounded-lg md:rounded-xl shadow transition-all duration-300
        
        ${
          isSelected
            ? "ring-2 ring-blue-500 bg-blue-50"
            : "bg-white hover:shadow-lg md:hover:scale-[1.02]"
        }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onClick={() => {
        if (isDesktop) return;

        if (hasSelection) {
          onSelect?.(); // toggle selection
        }
      }}
    >
      {/*  Desktop checkbox*/}
     {isDesktop && (
        <div
          className="absolute top-3 right-3 z-30 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onSelect?.();
          }}
        >
          <div
            className={`h-5 w-5 rounded-lg border-2 flex items-center justify-center transition-all duration-200 shadow-sm
              ${
                isSelected
                  ? "bg-linear-to-br from-blue-500 to-blue-600 border-blue-600 scale-100"
                  : "bg-white/90 backdrop-blur-sm border-gray-300 hover:border-blue-400 hover:bg-blue-50"
              }`}
          >
            {isSelected && (
              <Check className="h-4 w-4 text-white stroke-3" />
            )}
          </div>
        </div>
      )}


      {/* ================= DESKTOP PREVIEW ================= */}
      <div className="hidden md:block relative h-32 bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden rounded-t-lg md:rounded-t-xl">
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
              <FileText className="h-12 w-12 text-red-400" />
            ) : isDocument ? (
              <FileText className="h-12 w-12 text-purple-400" />
            ) : (
              <FileImage className="h-12 w-12 text-gray-400" />
            )}
          </div>
        )}

        {/* Hover Overlay */}
        {!hasSelection && (
          <div className="hidden md:flex absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center gap-2 pb-4 z-10 ">
            <button
              onClick={() => !isSelected && previewFile()}
              className=" p-2 bg-white rounded-full shadow-sm hover:bg-gray-100"
            >
              <Eye className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={downloadFile}
              className=" p-2 shadow-sm  bg-white rounded-full hover:bg-gray-100"
            >
              <Download className="h-4.5 w-4.5" />
            </button>

            <button
              onClick={() => {
                if (!isSelected) onDelete(file._id);
              }}
              disabled={isSelected}
              className={` p-2  shadow-sm rounded-full text-white ${
                isSelected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              <Trash2 className="h-4.5 w-4.5" />
            </button>
          </div>
        )}
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
      <div className="relative px-3 py-2 md:px-4 md:py-3">
        <div className="flex items-center gap-3 md:justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="md:hidden shrink-0">
              {isImage ? (
                <FileImage className="h-9 w-9 text-red-400" />
              ) : isPdf ? (
                <FileText className="h-9 w-9 text-red-400" />
              ) : (
                <FileText className="h-9 w-9 text-purple-400" />
              )}
            </div>

            <div className="min-w-0">
              <h3 className="font-medium truncate text-sm md:text-[15px]">
                {file.originalName}
              </h3>

              <p className="md:hidden text-xs text-gray-500 mt-0.5">
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
      h-6 w-6 rounded-full border
      transition-all duration-200
      ${
        isSelected ? "bg-blue-600 border-blue-600" : "bg-white border-gray-300"
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
                  clearSelection?.(); // unselect all
                  // stop here
                }
                window.innerWidth < 768
                  ? setMobileSheetOpen(true)
                  : setMenuOpen(!menuOpen);
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
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 text-blue-600" />
                  Preview
                </button>

                <button
                  onClick={() => {
                    downloadFile();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50"
                >
                  <Download className="h-4 w-4 text-green-600" />
                  Download
                </button>

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

        {/* Desktop meta */}
        <div className="hidden md:flex mt-3 items-center gap-4 text-[11px] text-gray-500">
          <span className="flex items-center gap-1">
            <HardDrive className="h-3 w-3" />
            {formatSize(file.size)}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
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
      className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      onClick={() => setMobileSheetOpen(false)}
    />

    {/* Bottom Sheet */}
    <div
      className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp
                 transition-transform will-change-transform"
      onTouchStart={(e) => {
        touchStartY.current = e.touches[0].clientY;
      }}
      onTouchMove={(e) => {
        touchCurrentY.current = e.touches[0].clientY;
      }}
      onTouchEnd={() => {
        const deltaY = touchCurrentY.current - touchStartY.current;

        // Swipe-down threshold
        if (deltaY > 80) {
          setMobileSheetOpen(false);
        }

        touchStartY.current = 0;
        touchCurrentY.current = 0;
      }}
    >
      {/* Handle bar */}
      <div className="flex justify-center pt-3 pb-2">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>

      {/* File info header */}
      <div className="px-5 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-linear-to-br from-blue-50 to-blue-100 rounded-xl">
            {isImage ? (
              <FileImage className="h-5 w-5 text-blue-600" />
            ) : isPdf ? (
              <FileText className="h-5 w-5 text-red-600" />
            ) : (
              <FileText className="h-5 w-5 text-purple-600" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 truncate text-sm">
              {file.originalName}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {formatSize(file.size)}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-4 space-y-1.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            previewFile();
            setMobileSheetOpen(false);
          }}
          disabled={hasSelection}
          className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all
            ${
              hasSelection
                ? "text-gray-400 cursor-not-allowed bg-gray-50"
                : "text-gray-900 active:scale-[0.98] hover:bg-blue-50"
            }`}
        >
          <div className={`p-2 rounded-lg ${hasSelection ? "bg-gray-200" : "bg-blue-100"}`}>
            <Eye className={`h-5 w-5 ${hasSelection ? "text-gray-400" : "text-blue-600"}`} />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Preview</p>
            <p className="text-xs text-gray-500">View file content</p>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            downloadFile();
            setMobileSheetOpen(false);
          }}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                     text-gray-900 active:scale-[0.98] hover:bg-green-50"
        >
          <div className="p-2 bg-green-100 rounded-lg">
            <Download className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Download</p>
            <p className="text-xs text-gray-500">Save to device</p>
          </div>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file._id);
            setMobileSheetOpen(false);
          }}
          className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl
                     text-red-600 active:scale-[0.98] hover:bg-red-50"
        >
          <div className="p-2 bg-red-100 rounded-lg">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div className="flex-1 text-left">
            <p className="font-medium">Delete</p>
            <p className="text-xs text-red-400">Remove permanently</p>
          </div>
        </button>
      </div>

      {/* Cancel */}
      <div className="px-4 pb-6 pt-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setMobileSheetOpen(false);
          }}
          className="w-full px-4 py-3.5 font-semibold text-gray-700
                     bg-gray-100 hover:bg-gray-200 rounded-xl transition-all active:scale-[0.98]"
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
