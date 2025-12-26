import { useEffect, useMemo, useState } from "react";
import api from "./api/api";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import UploadFile from "./components/UploadFile";
import FileList from "./components/FileList";

import { Search } from "lucide-react";

export default function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

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

  // Search filter (Lovable-style)
  const filteredFiles = useMemo(() => {
    if (!search.trim()) return files;
    return files.filter((file) =>
      file.originalName.toLowerCase().includes(search.toLowerCase())
    );
  }, [files, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header />

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Stats Dashboard */}
        <StatsCards files={files} />

        {/* Upload Section */}
        <UploadFile onUploadSuccess={fetchFiles} />

        {/* Files Section */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">
              Your Files
              {filteredFiles.length !== files.length && (
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredFiles.length} of {files.length})
                </span>
              )}
            </h2>

            {/* Search */}
            <div className="relative max-w-xs w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-3 py-2 rounded-lg border border-gray-300  bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* File list */}
          {loading ? (
            <p className="text-gray-400 mt-6">Loading files...</p>
          ) : (
            <FileList
              files={filteredFiles}
              onDelete={async (id) => {
                if (!window.confirm("Delete this file?")) return;
                await api.delete(`/files/${id}`);
                fetchFiles();
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
}
