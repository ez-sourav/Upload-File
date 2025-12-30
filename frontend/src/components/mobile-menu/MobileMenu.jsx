import { X, FileImage, FileText, Upload, Files, Home, Settings, HelpCircle, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import HelpModal from "./HelpModal";




export default function MobileMenu({ open, onClose, setFilter }) {
  const [activeItem, setActiveItem] = useState("All Files");
  const [showHelp, setShowHelp] = useState(false);

  
  useEffect(() => {
  if (open) {
    document.documentElement.style.overflow = "hidden"; // html
    document.body.style.overflow = "hidden";            // body
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };
}, [open]);


  const menuItems = [
  { name: "Upload Files", icon: Upload, filter: "upload", highlight: true },
  { name: "All Files", icon: Files, filter: "all" },
  { name: "Images", icon: FileImage, filter: "image" },
  { name: "Documents", icon: FileText, filter: "document" },
  { name: "Recent Files", icon: FileText, filter: "recent" },
  { name: "Stats", icon: FileText, filter: "stats" },
];


  const bottomItems = [
    { name: "Settings", icon: Settings },
    { name: "Help", icon: HelpCircle },
  ];

  const handleItemClick = (item) => {
  setActiveItem(item.name);
  setFilter(item.filter);
  onClose();
};

const handleBottomItemClick = (item) => {
  if (item.name === "Help") {
    setShowHelp(true);
    
    return;
  }

  if (item.name === "Settings") {
    // Future: open settings modal
    // For now:
    alert("Settings coming soon");
    onClose();
  }
};


  return (
    <>
      {/* Overlay with fade animation */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40 bg-black/60 backdrop-blur-sm
          transition-all duration-300 ease-out
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      />

      {/* Drawer with slide animation */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-72 bg-white
          shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header with gradient */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-sm">
              <Home className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">File Upload</h2>
              <p className="text-xs text-gray-500">Manage your files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/80 active:bg-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Main menu items */}
        <nav className="flex-1 px-4 py-5 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;
            
            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                className={`
                 w-full flex items-center gap-3 px-4 py-3 rounded-xl
    text-gray-700 font-medium text-sm
    hover:bg-gray-100 active:bg-gray-200
    transition-colors duration-200
                  ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : item.highlight
                      ? "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-5 w-5 ${isActive ? "text-white" : item.highlight ? "text-green-600" : "text-gray-500"}`} />
                  <span className="text-sm font-semibold">{item.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-blue-100 text-blue-700"
                        }
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-white" />
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Bottom menu items */}
        {/* Bottom menu items */}
<div className="px-4 py-3 space-y-1">
  {bottomItems.map((item) => {
    const Icon = item.icon;
    return (
      <button
        key={item.name}
        onClick={() => handleBottomItemClick(item)}
        className="
          w-full flex items-center gap-3 px-4 py-3 rounded-xl
          text-gray-700 font-medium text-sm
          hover:bg-gray-100 active:bg-gray-200
          transition-colors duration-200
        "
      >
        <Icon className="h-4 w-4 text-gray-500" />
        <span>{item.name}</span>
      </button>
    );
  })}
</div>


        {/* Footer with better styling */}
        <div className="px-4 py-4 border-t border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">
              © {new Date().getFullYear()} File Upload
            </span>
            <span className="px-2 py-1 rounded-md bg-green-100 text-green-700 font-semibold">
              v1.0
            </span>
          </div>
        </div>
      </aside>
      <HelpModal
  open={showHelp}
  onClose={() => {
    setShowHelp(false);
    onClose(); // close menu AFTER help closes
  }}
/>


    </>
  );
}