import { useEffect, useMemo, useState, useContext } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import UploadFile from "../components/UploadFile";
import FileList from "../components/file-list/FileList";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import ScrollToTop from "../components/ScrollToTop";
import MobileMenu from "../components/mobile-menu/MobileMenu";
import HelpModal from "../components/mobile-menu/HelpModal";
import { ChevronDown, ChevronUp, AlertCircle, Upload as UploadIcon } from "lucide-react";

import { Search, X } from "lucide-react";
import { AuthContext } from "../context/AuthContext";
import { demoFiles } from "../data/demoFiles";

export default function Home() {
  // ================= AUTH =================
  const { user } = useContext(AuthContext);

  // ================= FILE STATE =================
  const [userFiles, setUserFiles] = useState([]); // real files
  const files = user ? userFiles : demoFiles; // switch source

  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // ================= DELETE STATE =================
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // ================= UI STATE =================
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [showHelp, setShowHelp] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  // ================= PAGINATION =================
  const FILES_PER_BATCH = 6;
  const [visibleCount, setVisibleCount] = useState(FILES_PER_BATCH);
  const isExpanded = isDesktop && visibleCount > FILES_PER_BATCH;

  useEffect(() => {
    setVisibleCount(FILES_PER_BATCH);
  }, [search, filter, files]);

  // ================= FETCH USER FILES =================
  const fetchFiles = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await api.get("/files");
      setUserFiles(res.data);
    } catch (err) {
      console.error("Failed to fetch files", err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🔐 Load / Clear files on auth change
  useEffect(() => {
    if (user) {
      fetchFiles();
    } else {
      setUserFiles([]); // 🔥 clear on logout
    }
  }, [user]);

  // ================= HELP MODAL =================
  useEffect(() => {
    const openHelp = () => setShowHelp(true);
    window.addEventListener("open-help", openHelp);
    return () => window.removeEventListener("open-help", openHelp);
  }, []);

  // ================= RESIZE =================
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
    } catch {
      toast.error("Failed to delete file");
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = [...new Set(selectedIds)];

    // 🔥 VERY IMPORTANT: clear selection first
    setSelectedIds([]);

    try {
      setDeleting(true);

      await Promise.all(
        idsToDelete.map((id) => api.delete(`/files/${id}`))
      );

      toast.success(`Deleted ${idsToDelete.length} files successfully`);
      fetchFiles();
    } catch (err) {
      console.error("Bulk delete failed:", err);
      toast.error("Failed to delete selected files");
    } finally {
      setDeleting(false);
    }
  };

  // ================= VIEW =================
  const showStats = isDesktop || filter === "stats";
  const desktopFiles = isDesktop
    ? filteredFiles.slice(0, visibleCount)
    : filteredFiles;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Header
        onMenuOpen={() => setIsMenuOpen(true)}
        hasFiles={files.length > 0}
      />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 pt-16 sm:pt-20 md:pt-24 py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
        {/* 🔓 PREVIEW MODE BANNER */}
        {!user && (
          <div className="bg-linear-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl sm:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 flex items-start gap-2 sm:gap-3 animate-in">
            <div className="p-1.5 sm:p-2 bg-orange-100 rounded-lg shrink-0">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-orange-900 mb-0.5">
                Preview Mode Active
              </p>
              <p className="text-[10px] sm:text-xs text-orange-700">
                Login to upload, download, or delete files.
              </p>
            </div>
          </div>
        )}

        {/* ================= STATS ================= */}
        {showStats && (
          <section className="bg-linear-to-br from-white/80 to-blue-50/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-md border border-white/20 p-4 sm:p-6 md:p-8">
            {!isDesktop && (
              <button
                onClick={() => setFilter("all")}
                className="
                  inline-flex items-center gap-1.5 sm:gap-2 mb-4 sm:mb-6
                  px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl
                  bg-white/80 backdrop-blur-sm
                  border border-gray-200
                  text-gray-700 font-semibold text-xs sm:text-sm
                  shadow-md sm:shadow-lg hover:shadow-xl
                  hover:bg-white hover:border-gray-300
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <svg
                  className="h-3.5 w-3.5 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                <span>Back to Files</span>
              </button>
            )}

            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1.5 sm:mb-2">
                File Statistics
              </h2>
              <p className="text-xs sm:text-sm text-gray-600">
                Overview of your file storage and activity
              </p>
            </div>

            <StatsCards files={files} loading={loading} />
          </section>
        )}

        {/* ================= UPLOAD ================= */}
        <div id="upload-section">
          {user ? (
            <UploadFile onUploadSuccess={fetchFiles} />
          ) : (
            <div className="bg-linear-to-br from-white to-orange-50/30 border-2 border-dashed border-orange-200 rounded-2xl sm:rounded-3xl shadow-md sm:shadow-lg p-4 sm:p-6 md:p-8">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 sm:p-4 bg-orange-100 rounded-xl sm:rounded-2xl mb-3 sm:mb-4">
                  <UploadIcon className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">
                  Upload Files
                </h3>
                <p className="text-xs sm:text-sm text-orange-700 mb-3 sm:mb-4">
                  Login to upload your files and start managing them.
                </p>
                <a
                  href="/login"
                  className="px-5 py-2 sm:px-6 sm:py-2.5 bg-linear-to-r from-blue-600 to-indigo-500 text-white font-semibold rounded-lg sm:rounded-xl shadow-md sm:shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 active:scale-[0.98] transition-all text-xs sm:text-sm"
                >
                  Login to Upload
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ================= FILE LIST ================= */}
        {(!showStats || isDesktop) && (
          <section>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-lg sm:shadow-xl border border-white/20 p-3 sm:p-4 md:p-6 space-y-3 sm:space-y-4 md:space-y-5">

              {/* Header + Search */}
              <div className="space-y-2  sm:flex sm:items-center sm:justify-between sm:space-y-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                    {user ? "Your Files" : "Sample Files"}
                  </h2>

                  {files.length > 0 && (
                    <button
                      onClick={() => setShowMobileSearch((p) => !p)}
                      className="sm:hidden p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                    >
                      {showMobileSearch ? (
                        <X className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      ) : (
                        <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                      )}
                    </button>
                  )}
                </div>

                {files.length > 0 && (
                  <div
                    className={`relative sm:max-w-xs md:max-w-sm ${showMobileSearch ? "block" : "hidden sm:block"
                      }`}
                  >
                    <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-gray-400" />
                    <input
                      type="search"
                      placeholder="Search files..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 text-sm rounded-lg sm:rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all bg-white shadow-sm"
                      autoFocus={showMobileSearch}
                    />
                  </div>
                )}
              </div>

              {/* FILE LIST */}
              <FileList
                files={desktopFiles}
                loading={loading}
                selectedIds={selectedIds}
                setSelectedIds={setSelectedIds}
                isDesktop={isDesktop}
                onDelete={(payload) => {
                  setShowBulkConfirm(true);
                  setDeleteId(Array.isArray(payload) ? null : payload);
                }}
              />

              {/* VIEW MORE / LESS */}
              {isDesktop && filteredFiles.length > FILES_PER_BATCH && (
                <div className="flex justify-center gap-2 sm:gap-3 pt-1 sm:pt-2">
                  {visibleCount < filteredFiles.length && (
                    <button
                      onClick={() => setVisibleCount((p) => p + FILES_PER_BATCH)}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold
                        text-blue-600 bg-linear-to-r from-blue-50 to-indigo-50
                        border border-blue-200 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl
                        hover:from-blue-100 hover:to-indigo-100 active:scale-95 transition-all"
                    >
                      View More
                      <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  )}

                  {isExpanded && (
                    <button
                      onClick={() => setVisibleCount(FILES_PER_BATCH)}
                      className="flex items-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold
                        text-gray-700 bg-linear-to-r from-gray-100 to-gray-200
                        border border-gray-300 rounded-lg sm:rounded-xl shadow-md sm:shadow-lg hover:shadow-xl
                        hover:from-gray-200 hover:to-gray-300 active:scale-95 transition-all"
                    >
                      View Less
                      <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <HelpModal open={showHelp} onClose={() => setShowHelp(false)} />

      <ConfirmDeleteModal
        open={showBulkConfirm}
        onClose={() => setShowBulkConfirm(false)}
        loading={deleting}
        count={selectedIds.length}
        onConfirm={async () => {
          deleteId ? await handleConfirmDelete() : await handleBulkDelete();
          setShowBulkConfirm(false);
        }}
      />

      <MobileMenu
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        setFilter={setFilter}
      />

      <ScrollToTop />

      {/* Animation Styles */}
      <style>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}