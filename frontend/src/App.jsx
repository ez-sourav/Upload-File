import { useState } from "react";
import UploadFile from "./components/UploadFile";
import FileList from "./components/FileList";

export default function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div style={{ padding: "30px" }}>
      <h2>📁 File Upload System</h2>

      <UploadFile refresh={() => setRefresh(!refresh)} />
      <FileList key={refresh} />
    </div>
  );
}
