import {
  Menu,
  HelpCircle,
  Search,
  Upload,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header({ onMenuOpen, hasFiles }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left group - Logo & Brand */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger (mobile only) */}
            <button
              onClick={onMenuOpen}
              aria-label="Open menu"
              className="
                md:hidden
                inline-flex items-center justify-center
                h-10 w-10 rounded-xl
                bg-linear-to-br from-gray-100 to-gray-200
                text-gray-700
                hover:from-gray-200 hover:to-gray-300
                active:scale-95
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200
                shadow-md hover:shadow-lg
                border border-gray-300/50
              "
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* App Icon & Brand Name */}
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-linear-to-br from-blue-600 to-indigo-500 rounded-xl shadow-lg shadow-blue-500/30">
                <Upload className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold text-gray-900  sm:inline bg-linear-to-r from-gray-900 to-gray-700 bg-clip-text">
                FileManager
              </span>
            </div>
          </div>

          {/* Right group - Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Search (desktop only, if files exist) */}
            {hasFiles && (
              <button
                onClick={() =>
                  document.querySelector('input[type="search"]')?.focus()
                }
                title="Search files"
                className="
                  hidden md:inline-flex items-center gap-2
                  h-9 px-3.5 rounded-xl
                  text-gray-600 hover:text-gray-900
                  bg-gray-50 hover:bg-gray-100
                  border border-gray-200
                  active:scale-95 transition-all shadow-sm
                "
              >
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline text-sm font-semibold">
                  Search
                </span>
              </button>
            )}

            {/* Help (desktop only) */}
            <button
              onClick={() => window.dispatchEvent(new Event("open-help"))}
              title="Help"
              className="
                hidden md:inline-flex items-center gap-2
                h-9 px-3.5 rounded-xl
                text-gray-600 hover:text-gray-900
                bg-gray-50 hover:bg-gray-100
                border border-gray-200
                active:scale-95 transition-all shadow-sm
              "
            >
              <HelpCircle className="h-4 w-4" />
              <span className="hidden lg:inline text-sm font-semibold">
                Help
              </span>
            </button>

            {/* Auth Buttons */}
            {user ? (
              <>
                {/* User Avatar (desktop only) */}
                <div
                  className="
                    hidden md:flex
                    h-9 w-9 rounded-xl
                    bg-linear-to-br from-blue-600 to-indigo-600
                    text-white
                    items-center justify-center
                    font-bold uppercase text-sm
                    shadow-lg shadow-blue-500/30
                    border-2 border-white
                  "
                  title={user?.name || user?.email}
                >
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                </div>

                {/* Mobile Avatar (with tooltip) */}
                <div className="md:hidden relative group">
                  <div
                    className="
                      h-9 w-9 rounded-xl
                      bg-linear-to-br from-blue-600 to-indigo-600
                      text-white
                      flex items-center justify-center
                      font-bold uppercase text-sm
                      shadow-lg shadow-blue-500/30
                      border-2 border-white
                    "
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={logout}
                  className="
                    hidden md:inline-flex items-center gap-2
                    px-4 py-2 rounded-xl
                    bg-linear-to-r from-red-600 to-rose-500
                    text-white font-semibold text-sm
                    shadow-lg shadow-red-500/30
                    hover:shadow-xl hover:shadow-red-500/40
                    active:scale-[0.98]
                    transition-all duration-200
                  "
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login Button */}
                <a
                  href="/login"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-xl
                    text-gray-700 font-semibold text-sm
                    hover:text-gray-900
                    bg-gray-50 hover:bg-gray-100
                    border border-gray-200
                    active:scale-[0.98]
                    transition-all duration-200
                    shadow-sm
                  "
                >
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                </a>

                {/* Get Started Button */}
                <a
                  href="/register"
                  className="
                    inline-flex items-center gap-2
                    px-4 py-2 rounded-xl
                    bg-linear-to-r from-blue-600 to-indigo-500
                    text-white font-semibold text-sm
                    shadow-lg shadow-blue-500/30
                    hover:shadow-xl hover:shadow-blue-500/40
                    active:scale-[0.98]
                    transition-all duration-200
                  "
                >
                  <span>Get Started</span>
                </a>

                {/* Preview Mode Badge */}
                <span className="hidden md:inline-flex items-center px-3 py-1.5 bg-orange-50 text-orange-700 rounded-xl border border-orange-200 text-xs font-bold shadow-sm">
                  Preview Mode
                </span>
              </>
            )}
          </div>
        </div>
        
      </div>
    </header>
  );
}