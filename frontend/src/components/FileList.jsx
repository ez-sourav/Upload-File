import { useEffect, useState } from "react";
import api from "../api/api";

export default function FileList() {
  const [files, setFiles] = useState([]);

  const fetchFiles = async () => {
    const res = await api.get("/files");
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const deleteFile = async (id) => {
  try {
    await api.delete(`/files/${id}`);
    fetchFiles();
  } catch (err) {
    console.error("Delete failed ", err.response?.data || err.message);
    alert(" Failed to delete file");
  }
};

  return (
    <div>
      <h3>Uploaded Files</h3>

      {files.length === 0 && <p>No files uploaded</p>}

      <ul>
        {files.map((file) => (
          <li key={file._id}>
            {file.originalName}
            {" "}
            <a
              href={`http://localhost:3000/files/download/${file._id}`}
              target="_blank"
            >
              ⬇ Download
            </a>
            {" "}
            <button onClick={() => deleteFile(file._id)}>
              ❌ Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
