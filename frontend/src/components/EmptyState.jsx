import { FolderOpen } from "lucide-react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-16 px-4 text-center">
      
      {/* Icon */}
      <div className="p-4 md:p-6 rounded-full bg-gray-100 mb-4 md:mb-6">
        <FolderOpen className="h-10 w-10 md:h-12 md:w-12 text-gray-400" />
      </div>

      {/* Title */}
      <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-1 md:mb-2">
        No files uploaded yet
      </h3>

      {/* Description */}
      <p className="text-sm md:text-base text-gray-500 max-w-xs md:max-w-md">
        Upload your first file using the upload zone above. Supports all
        documents and images.
      </p>

    </div>
  );
}
