import { useState } from "react";
import api from "../api/api";
import UploadZone from "./UploadZone";
import toast from "react-hot-toast";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function UploadFile({ onUploadSuccess }) {

  const { user } = useContext(AuthContext);
const navigate = useNavigate();


  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const uploadFiles = async () => {

    // 🔐 AUTH GUARD (PREVIEW MODE)
  if (!user) {
    toast.error("Please login to upload files");
    navigate("/login");
    return;
  }


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
    <div className="bg-white shadow rounded-xl p-4 md:p-6 mb-6 md:mb-8">
      
      {/* Title */}
      <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4">
        Upload Files
      </h3>

      {!user && (
  <p className="mb-3 text-sm text-orange-600 bg-orange-50 px-3 py-2 rounded">
    You are in preview mode. Login to upload files.
  </p>
)}


      {/* Upload Zone */}
      <UploadZone
        selectedFiles={selectedFiles}
        setSelectedFiles={setSelectedFiles}
        isUploading={loading}
      />

      {/* Upload Button */}
      {selectedFiles.length > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={uploadFiles}
            disabled={loading || !user}
            className="
  w-full sm:w-auto
  bg-blue-600 text-white
  px-4 md:px-5 py-2
  rounded-lg text-sm
  disabled:opacity-50 disabled:cursor-not-allowed
"
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
