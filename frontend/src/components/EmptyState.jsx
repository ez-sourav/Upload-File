import { FolderOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="p-6 rounded-full bg-gray-100 mb-6">
        <FolderOpen className="h-12 w-12 text-gray-400" />
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        No files uploaded yet
      </h3>

      <p className="text-gray-500 max-w-md">
        Upload your first file using the upload zone above. Supports all
        documents and images.
      </p>
    </div>
  );
}
