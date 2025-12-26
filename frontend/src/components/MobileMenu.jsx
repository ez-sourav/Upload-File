import { X } from "lucide-react";

export default function MobileMenu({ open, onClose }) {
  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/40"
        />
      )}

      {/* Drawer */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-lg
        transform transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button
            onClick={onClose}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Menu items */}
        <nav className="px-4 py-4 space-y-2 text-sm">
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
            All Files
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
            Images
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
            Documents
          </button>
          <button className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100">
            Upload Files
          </button>
        </nav>
      </aside>
    </>
  );
}
