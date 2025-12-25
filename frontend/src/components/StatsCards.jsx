import {
  Files,
  Image,
  FileText,
  HardDrive
} from "lucide-react";

export default function StatsCards({ files }) {
  const total = files.length;
  const images = files.filter(f => f.fileType.startsWith("image")).length;
  const pdfs = files.filter(f => f.fileType === "application/pdf").length;

  const totalSize = files.reduce((acc, f) => acc + (f.size || 0), 0);

  const formatSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(1) + " " + sizes[i];
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
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
        label="PDFs"
        value={pdfs}
        iconColor="text-red-600"
      />
    </div>
  );
}

function StatCard({ icon: Icon, label, value, iconColor }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-lg bg-gray-100 ${iconColor}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <p className="text-xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
}
