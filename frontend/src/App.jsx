import { useEffect, useMemo, useState } from "react";
import api from "./api/api";
import toast from "react-hot-toast";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import UploadFile from "./components/UploadFile";
import FileList from "./components/file-list/FileList";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

import ScrollToTop from "./components/ScrollToTop";


import MobileMenu from "./components/mobile-menu/MobileMenu";
import { Search, X,ChevronDown  } from "lucide-react";
import HelpModal from "./components/mobile-menu/HelpModal";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Delete modal
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk delete confirmation
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);

  // Multi-select state
  const [selectedIds, setSelectedIds] = useState([]);

  // Navigation / filter
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const [showHelp, setShowHelp] = useState(false);


  // Responsive state (IMPORTANT)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // Scroll view More
  const FILES_PER_BATCH = 6;
  
  const [visibleCount, setVisibleCount] = useState(FILES_PER_BATCH);
  const isExpanded = isDesktop && visibleCount > FILES_PER_BATCH;
  useEffect(() => {
    setVisibleCount(FILES_PER_BATCH);
  }, [search, filter, files]);

  // ================= FETCH FILES =================
  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await api.get("/files");
      setFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
  const openHelp = () => setShowHelp(true);
  window.addEventListener("open-help", openHelp);
  return () => window.removeEventListener("open-help", openHelp);
}, []);


  // ================= HANDLE RESIZE =================
  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ================= SCROLL TO UPLOAD =================
  useEffect(() => {
    if (filter === "upload") {
      document
        .getElementById("upload-section")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }, [filter]);

  // ================= SEARCH + FILTER =================
  const filteredFiles = useMemo(() => {
    let result = files;

    if (filter === "image") {
      result = result.filter((f) => f.fileType?.startsWith("image/"));
    }

    if (filter === "document") {
      result = result.filter((f) => f.fileType?.startsWith("application/"));
    }

    if (filter === "recent") {
      const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
      result = result.filter(
        (f) => new Date(f.createdAt).getTime() >= last7Days
      );
    }

    if (search.trim()) {
      result = result.filter((file) =>
        file.originalName.toLowerCase().includes(search.toLowerCase())
      );
    }

    return result;
  }, [files, search, filter]);

  // ================= DELETE =================
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);

      await api.delete(`/files/${deleteId}`);

      toast.success("Deleted 1 file successfully");

      setDeleteId(null);
      fetchFiles();
    } catch (err) {
      toast.error("Failed to delete file");
      console.error("Delete failed", err.message);
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    try {
      setDeleting(true);

      await Promise.all(selectedIds.map((id) => api.delete(`/files/${id}`)));

      toast.success(
        `Deleted ${selectedIds.length} file${
          selectedIds.length > 1 ? "s" : ""
        } successfully`
      );

      setSelectedIds([]);
      setDeleteId(null);
      fetchFiles();
    } catch (err) {
      toast.error("Failed to delete selected files");
      console.error(err);
    } finally {
      setDeleting(false);
    }
  };

  // ================= STATS VISIBILITY =================
  const showStats = isDesktop || filter === "stats";

  const desktopFiles = isDesktop
    ? filteredFiles.slice(0, visibleCount)
    : filteredFiles;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuOpen={() => setIsMenuOpen(true)} hasFiles={files.length > 0} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 py-6 md:py-8 space-y-6 md:space-y-8">
        {/* ================= STATS ================= */}
        {showStats && (
          <section className="bg-white rounded-xl shadow p-4 md:p-6">
            {/* Mobile back button */}
            {!isDesktop && (
              <button
                onClick={() => setFilter("all")}
                className="mb-4 text-sm text-blue-600 hover:underline"
              >
                ← Back to files
              </button>
            )}
            <StatsCards files={files} />
          </section>
        )}

        {/* ================= UPLOAD ================= */}
        <div id="upload-section">
          <UploadFile onUploadSuccess={fetchFiles} />
        </div>

        {/* ================= FILE LIST ================= */}
{(!showStats || isDesktop) && (
  <section className="space-y-3 md:space-y-4">
    {/* Header + Search */}
    <div className="space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">

      {/* Title + Mobile Search Toggle */}
      <div className="flex items-center justify-between sm:shrink-0">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900">
          Your Files
        </h2>

        {/* ✅ Mobile search toggle (only when files exist) */}
        {files.length > 0 && (
          <button
            onClick={() => setShowMobileSearch((prev) => !prev)}
            className="sm:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label={showMobileSearch ? "Close search" : "Open search"}
          >
            {showMobileSearch ? (
              <X className="h-5 w-5 text-gray-600" />
            ) : (
              <Search className="h-5 w-5 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* ✅ Search input (only when files exist) */}
      {files.length > 0 && (
        <div
          className={`relative w-full sm:max-w-sm transition-all duration-200 ${
            showMobileSearch ? "block" : "hidden sm:block"
          }`}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow hover:border-gray-300"
            autoFocus={showMobileSearch}
          />
        </div>
      )}

    </div>
 



            {/* File Grid */}
            <FileList
              files={desktopFiles}
              onDelete={(payload) => {
                setShowBulkConfirm(true);
                if (Array.isArray(payload)) {
                  setDeleteId(null); // bulk delete
                } else {
                  setDeleteId(payload); // single delete
                }
              }}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              isDesktop={isDesktop}
            />

           {isDesktop && (
  <div className="flex justify-center gap-4 pt-6 pb-2">
    {/* View more */}
    {visibleCount < filteredFiles.length && (
      <button
        onClick={() =>
          setVisibleCount((prev) => prev + FILES_PER_BATCH)
        }
        className="inline-flex hover:cursor-pointer items-center gap-2 px-5 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 active:bg-blue-200 transition-colors border border-blue-200"
      >
        <span>View more</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    )}

    {/* View less */}
    {isExpanded && (
      <button
        onClick={() => setVisibleCount(FILES_PER_BATCH)}
        className="inline-flex hover:cursor-pointer items-center gap-2 px-5 py-2 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors border border-gray-200"
      >
        <span>View less</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    )}
  </div>
)}

          </section>
        )}
      </main>

      <HelpModal
  open={showHelp}
  onClose={() => setShowHelp(false)}
/>

      {/* ================= DELETE MODAL ================= */}
      <ConfirmDeleteModal
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        onConfirm={async () => {
          if (deleteId) {
            await handleConfirmDelete();
          } else {
            await handleBulkDelete();
          }
          setShowBulkConfirm(false);
        }}
        loading={deleting}
        count={selectedIds.length}
      />

      {/* ================= MOBILE MENU ================= */}
      <div className="md:hidden">
        <MobileMenu
          open={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
          setFilter={setFilter}
        />
      </div>
      <ScrollToTop />

      
      
    </div>
  );
}
