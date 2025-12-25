import { useState } from "react";
import api from "../api/api";

export default function UploadFile({ refresh }) {
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const uploadFile = async () => {
    // reset messages
    setError("");
    setSuccess("");

    if (!file) {
      setError("❌ Upload failed. Please try again");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      await api.post("/files/upload", formData);

      setSuccess("✅ File uploaded successfully");
      setFile(null);
      refresh();
    } catch (err) {
  console.log("UPLOAD ERROR 👉", err);

  console.log("RESPONSE 👉", err.response);
  console.log("DATA 👉", err.response?.data);

  setError(
    err.response?.data?.error || "❌ Upload failed. Please try again"
  );
}
finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: "25px" }}>
      <h3>Upload File</h3>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />

      <br />
      <br />

      <button onClick={uploadFile} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {/* ❌ Error Message */}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}

      {/* ✅ Success Message */}
      {success && (
        <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
      )}
    </div>
  );
}
