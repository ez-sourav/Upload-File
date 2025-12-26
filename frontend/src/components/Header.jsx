import { useState } from "react";
import { Files, Menu } from "lucide-react";
import MobileMenu from "./MobileMenu";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-card/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">

            {/* Left side */}
            <div className="flex items-center gap-3">

              {/* Hamburger (mobile only) */}
              <button
                onClick={() => setMenuOpen(true)}
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-5 w-5" />
              </button>

              {/* App Icon */}
              <div className="app-icon">
                <Files
                  size={20}
                  className="md:hidden"
                  color="white"
                  strokeWidth={2}
                />
                <Files
                  size={24}
                  className="hidden md:block"
                  color="white"
                  strokeWidth={2}
                />
              </div>

              {/* Title */}
              <div className="flex flex-col min-w-0">
                <h1 className="text-base md:text-xl font-bold truncate">
                  File Upload
                </h1>
                <p className="hidden sm:block text-sm text-muted-foreground truncate">
                  Upload, manage, and download your files
                </p>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}
