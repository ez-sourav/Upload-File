import { X, FileImage, FileText, Upload, Files, Home, HelpCircle, ChevronRight, LogIn, UserPlus, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import HelpModal from "./HelpModal";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function MobileMenu({ open, onClose, setFilter }) {
  const [activeItem, setActiveItem] = useState("All Files");
  const [showHelp, setShowHelp] = useState(false);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
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

  const bottomItems = [{ name: "Help", icon: HelpCircle }];

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

      {/* Drawer with slide animation - Responsive width */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full 
          w-full xs:w-80 sm:w-96 md:w-105 lg:w-115
          max-w-[90vw] sm:max-w-md md:max-w-lg
          bg-white shadow-2xl flex flex-col
          transform transition-transform duration-300 ease-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header with linear - Responsive padding */}
        <div className="flex items-center justify-between px-4 sm:px-5 md:px-6 py-4 sm:py-5 border-b border-gray-200 bg-linear-to-r from-blue-50 to-purple-50">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-white shadow-sm">
              <Home className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-gray-900">File Upload</h2>
              <p className="text-[10px] sm:text-xs text-gray-500">Manage your files</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl hover:bg-white/80 active:bg-white transition-colors"
            aria-label="Close menu"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6 text-gray-600" />
          </button>
        </div>

        {/* Main menu items - Responsive spacing */}
        <nav className="flex-1 px-3 sm:px-4 md:px-5 py-3 sm:py-4 md:py-5 space-y-1 sm:space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.name;

            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item)}
                className={`
                  w-full flex items-center justify-between gap-2 sm:gap-3 
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  font-medium text-xs sm:text-sm transition-all duration-200
                  ${
                    isActive
                      ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                      : item.highlight
                      ? "bg-linear-to-r from-green-50 to-emerald-50 text-green-700 hover:from-green-100 hover:to-emerald-100"
                      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                  }
                `}
              >
                <div className="flex items-center gap-2 sm:gap-3">
                  <Icon className={`h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "text-white" : item.highlight ? "text-green-600" : "text-gray-500"}`} />
                  <span className="text-xs sm:text-sm font-semibold">{item.name}</span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  {item.badge && (
                    <span
                      className={`
                        px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold
                        ${isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"}
                      `}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Bottom menu items - Responsive spacing */}
        <div className="px-3 sm:px-4 md:px-5 py-2.5 sm:py-3 space-y-1">
          {bottomItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => handleBottomItemClick(item)}
                className="
                  w-full flex items-center gap-2 sm:gap-3 
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  text-gray-700 font-medium text-xs sm:text-sm
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

        {/* Enhanced Auth Section - Responsive */}
        <div className="border-t border-gray-200 bg-linear-to-br from-gray-50 to-slate-50">
          {!user ? (
            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 space-y-2 sm:space-y-2.5">
              {/* Login Button */}
              <button
                onClick={() => {
                  navigate("/login");
                  onClose();
                }}
                className="
                  w-full flex items-center justify-center gap-2 sm:gap-2.5 
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  bg-linear-to-r from-blue-600 to-blue-500
                  text-white font-semibold text-xs sm:text-sm
                  shadow-lg shadow-blue-500/25
                  hover:shadow-xl hover:shadow-blue-500/30
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </button>

              {/* Register Button */}
              <button
                onClick={() => {
                  navigate("/register");
                  onClose();
                }}
                className="
                  w-full flex items-center justify-center gap-2 sm:gap-2.5 
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  bg-linear-to-r from-green-600 to-emerald-500
                  text-white font-semibold text-xs sm:text-sm
                  shadow-lg shadow-green-500/25
                  hover:shadow-xl hover:shadow-green-500/30
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Account</span>
              </button>
            </div>
          ) : (
            <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 space-y-2.5 sm:space-y-3">
              {/* User Info Card */}
              <div className="px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl bg-linear-to-br from-blue-50 to-indigo-50 border border-blue-100">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-white shadow-sm">
                    <User className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] sm:text-xs font-medium text-gray-500 mb-0.5">
                      Logged in as
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                  onClose();
                }}
                className="
                  w-full flex items-center justify-center gap-2 sm:gap-2.5 
                  px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl
                  bg-linear-to-r from-red-600 to-rose-500
                  text-white font-semibold text-xs sm:text-sm
                  shadow-lg shadow-red-500/25
                  hover:shadow-xl hover:shadow-red-500/30
                  active:scale-[0.98]
                  transition-all duration-200
                "
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer - Responsive */}
        <div className="px-3 sm:px-4 md:px-5 py-3 sm:py-4 border-t border-gray-200 bg-linear-to-r from-gray-50 to-gray-100">
          <div className="flex items-center justify-between text-[10px] sm:text-xs">
            <span className="text-gray-500 font-medium">
              © {new Date().getFullYear()} File Upload
            </span>
            <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-green-100 text-green-700 font-semibold">
              v1.0
            </span>
          </div>
        </div>
      </aside>

      <HelpModal
        open={showHelp}
        onClose={() => {
          setShowHelp(false);
          onClose();
        }}
      />
    </>
  );
}