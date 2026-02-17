import { Files, Image, FileText, HardDrive } from "lucide-react";

export default function StatsCards({ files = [], loading = false }) {
  // ✅ Skeleton UI
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-3 md:p-4 animate-pulse border border-gray-100"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-gray-200 h-10 w-10" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-20 bg-gray-200 rounded-lg" />
                <div className="h-3 w-24 bg-gray-200 rounded-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const total = files.length;

  const images = files.filter((f) => f.fileType?.startsWith("image/")).length;

  const documents = files.filter((f) => !f.fileType?.startsWith("image/"))
    .length;

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatCard
        icon={Files}
        label="Total Files"
        value={total}
        iconColor="text-blue-600"
      />

      <StatCard
        icon={HardDrive}
        label="Storage Used"
        value={formatSize(totalSize)}
        iconColor="text-purple-600"
      />

      <StatCard
        icon={Image}
        label="Images"
        value={images}
        iconColor="text-green-600"
      />

      <StatCard
        icon={FileText}
        label="Documents"
        value={documents}
        iconColor="text-red-600"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow p-3 md:p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        {/* ICON (LEFT) */}
        <div className={`p-2.5 rounded-lg bg-gray-100 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>

        {/* TEXT (RIGHT) */}
        <div className="flex flex-col">
          <span className="text-lg md:text-xl font-semibold text-gray-900 leading-tight">
            {value}
          </span>
          <span className="text-xs md:text-sm text-gray-500 leading-tight">
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
