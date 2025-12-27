import { useEffect, useMemo, useState } from "react";
import api from "./api/api";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import UploadFile from "./components/UploadFile";
import FileList from "./components/FileList";
import ConfirmDeleteModal from "./components/ConfirmDeleteModal";

import { Search } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // DELETE MODAL STATE
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Fetch all files
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

  // Search filter
  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    return files.filter((file) =>
      file.originalName.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/files/${deleteId}`);
      setDeleteId(null);
      fetchFiles();
    } catch (err) {
      console.error("Delete failed", err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 md:pt-24 py-6 md:py-8 space-y-6 md:space-y-8">
        <StatsCards files={files} />

        <UploadFile onUploadSuccess={fetchFiles} />

        <section className="space-y-3 md:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <h2 className="text-base md:text-lg font-semibold">
              Your Files
              {filteredFiles.length !== files.length && (
                <span className="ml-2 text-xs md:text-sm font-normal text-gray-500">
                  ({filteredFiles.length} of {files.length})
                </span>
              )}
            </h2>

            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full pl-10 pr-3 py-2
                  rounded-lg border border-gray-300
                  bg-gray-100 text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                "
              />
            </div>
          </div>

          <FileList
            files={filteredFiles}
            onDelete={(id) => setDeleteId(id)}
            loading={loading}
          />
        </section>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      <ConfirmDeleteModal
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
      />
    </div>
  );
}
