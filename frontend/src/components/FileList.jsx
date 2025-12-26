import FileCard from "./FileCard";
import EmptyState from "./EmptyState";

export default function FileList({ files, onDelete }) {
  // EMPTY STATE
  if (!files || files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="mt-4 md:mt-6 px-1 sm:px-0">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}
