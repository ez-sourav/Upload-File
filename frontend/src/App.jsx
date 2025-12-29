import { useEffect, useMemo, useState } from "react";
import api from "./api/api";
import toast from "react-hot-toast";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import UploadFile from "./components/UploadFile";
import FileList from "./components/file-list/FileList";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

import MobileMenu from "./components/mobile-menu/MobileMenu";
import { Search } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  // Responsive state (IMPORTANT)
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuOpen={() => setIsMenuOpen(true)} />

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
              <h2 className="text-base md:text-lg font-semibold">Your Files</h2>

              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="search"
                  placeholder="Search files..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300 bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* ✅ BULK ACTION BAR (ADD HERE) */}
            {selectedIds.length > 0 && (
              <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
                <span className="text-sm font-medium text-blue-700">
                  {selectedIds.length} selected
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedIds([])}
                    className="text-sm text-gray-600 hover:underline"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={() => setShowBulkConfirm(true)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}

            {/* File Grid */}
            <FileList
              files={filteredFiles}
              onDelete={(id) => {
                setShowBulkConfirm(true);
                setDeleteId(id);
              }}
              loading={loading}
              selectedIds={selectedIds}
              setSelectedIds={setSelectedIds}
              isDesktop={isDesktop}
            />
          </section>
        )}
      </main>

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
    </div>
  );
}
