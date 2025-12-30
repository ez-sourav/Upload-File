import { Files, Menu, HelpCircle, Settings, Search } from "lucide-react";

export default function Header({ onMenuOpen, hasFiles }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/98 backdrop-blur-xl border-b border-gray-200/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left group */}
          <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
            {/* Hamburger (mobile only) */}
            <button
              onClick={onMenuOpen}
              aria-label="Open menu"
              className="
                md:hidden
                inline-flex items-center justify-center
                h-10 w-10 rounded-xl
                bg-linear-to-br from-gray-50 to-gray-100
                text-gray-700
                hover:from-gray-100 hover:to-gray-200
                active:scale-95
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                transition-all duration-200
                shadow-sm hover:shadow
                border border-gray-200/50
              "
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* App Icon */}
            <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-linear-to-br from-blue-600 via-blue-500 to-blue-600 shadow-lg shadow-blue-500/40">
              <Files
                className="h-5 w-5 md:h-6 md:w-6"
                color="white"
                strokeWidth={2.5}
              />
            </div>

            {/* Title & Description */}
            <div className="flex flex-col min-w-0 leading-tight">
              <h1 className="text-base md:text-xl font-bold text-gray-900 truncate tracking-tight">
                File Upload
              </h1>
              <p className="hidden sm:block text-xs md:text-sm text-gray-600 truncate font-medium">
                Upload, manage, and download your files
              </p>
            </div>
          </div>

          {/* Right group (desktop actions) */}
          <div className="hidden md:flex items-center gap-2">
            {/* Search */}
            {hasFiles && (
              <button
                onClick={() =>
                  document.querySelector('input[type="search"]')?.focus()
                }
                title="Search files"
                className="inline-flex items-center gap-2
                h-9 px-3 rounded-lg
                text-gray-600 hover:text-gray-900
                hover:bg-gray-100 active:bg-gray-200
                active:scale-95 transition-all"
              >
                <Search className="h-5 w-5" />
                <span className="hidden lg:inline text-sm font-medium">
                  Search
                </span>
              </button>
            )}

            {/* Help */}
            <button
              onClick={() => window.dispatchEvent(new Event("open-help"))}
              title="Help"
              className="
                inline-flex items-center gap-2
                h-9 px-3 rounded-lg
                text-gray-600 hover:text-gray-900
                hover:bg-gray-100 active:bg-gray-200
                active:scale-95 transition-all
              "
            >
              <HelpCircle className="h-5 w-5" />
              <span className="hidden lg:inline text-sm font-medium">Help</span>
            </button>

            {/* Settings */}
            <button
              onClick={() => alert("Settings coming soon")}
              title="Settings"
              className="
                inline-flex items-center gap-2
                h-9 px-3 rounded-lg
                text-gray-600 hover:text-gray-900
                hover:bg-gray-100 active:bg-gray-200
                active:scale-95 transition-all
              "
            >
              <Settings className="h-5 w-5" />
              <span className="hidden lg:inline text-sm font-medium">
                Settings
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
