import { useState } from "react";
import api from "../api/api";
import UploadZone from "./UploadZone";
import toast from "react-hot-toast";

export default function UploadFile({ onUploadSuccess }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setLoading(true);

    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        await api.post("/files/upload", formData);
      }

      toast.success(
  `${selectedFiles.length} file${
    selectedFiles.length > 1 ? "s" : ""
  } uploaded successfully`
);
      setSelectedFiles([]);
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      toast.error(
        err.response?.data?.error || "Upload failed. Please try again"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-xl p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">Upload Files</h3>

      <UploadZone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        isUploading={loading}
      />

      {selectedFiles.length > 0 && (
        <div className="mt-4 text-right">
          <button
            onClick={uploadFiles}
            disabled={loading}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50"
          >
            {loading
              ? "Uploading..."
              : `Upload ${selectedFiles.length} file${
                  selectedFiles.length > 1 ? "s" : ""
                }`}
          </button>
        </div>
      )}
    </div>
  );
}
