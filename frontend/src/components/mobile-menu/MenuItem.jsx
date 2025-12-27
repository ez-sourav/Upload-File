export default function MenuItem({ icon, label, onClick, danger }) {
    console.log("setFilter:", setFilter);

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg
        active:bg-gray-100
        ${danger ? "text-red-600" : "text-gray-800"}`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
