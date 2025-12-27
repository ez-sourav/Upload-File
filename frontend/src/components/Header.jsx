import { Files, Menu,  } from "lucide-react";

export default function Header({ onMenuOpen }) {
  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4">
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
                h-10 w-10
                rounded-xl
                bg-linear-to-br from-gray-100 to-gray-50
                text-gray-700
                hover:from-gray-200 hover:to-gray-100
                active:scale-95
                focus:outline-none
                focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
                transition-all duration-200
                shadow-sm
              "
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* App Icon with gradient background */}
            <div className="flex items-center justify-center h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl bg-linear-to-br from-blue-600 to-blue-500 shadow-lg shadow-blue-500/30">
              <Files
                className="h-5 w-5 md:h-6 md:w-6"
                color="white"
                strokeWidth={2.5}
              />
            </div>

            {/* Title & Description */}
            <div className="flex flex-col min-w-0 leading-tight">
              <h1 className="text-base md:text-xl font-bold text-gray-900 truncate">
                File Upload
              </h1>
              <p className="hidden sm:block text-xs md:text-sm text-gray-500 truncate font-medium">
                Upload, manage, and download your files
              </p>
            </div>

          </div>

    
        </div>
      </div>
    </header>
  );
}