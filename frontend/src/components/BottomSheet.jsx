import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

export default function BottomSheet({ open, onClose, children }) {
  const startY = useRef(0);
  const currentY = useRef(0);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Mobile Bottom Sheet (hidden on desktop) */}
      <div className="fixed inset-0 z-9999 md:hidden">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Sheet */}
        <div
          className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl sm:rounded-t-3xl shadow-2xl animate-slideUp max-h-[85vh] flex flex-col"
          onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
          onTouchMove={(e) => (currentY.current = e.touches[0].clientY)}
          onTouchEnd={() => {
            if (currentY.current - startY.current > 80) onClose();
            startY.current = 0;
            currentY.current = 0;
          }}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 sm:pt-4 pb-2 sm:pb-3">
            <div className="w-10 sm:w-12 h-1 sm:h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Content with scroll */}
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Desktop Modal (hidden on mobile) */}
      <div className="hidden md:block fixed inset-0 z-9999">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md lg:max-w-lg xl:max-w-xl bg-white rounded-2xl lg:rounded-3xl shadow-2xl animate-scaleIn max-h-[85vh] flex flex-col">
          {/* Modal Header (visual indicator) */}
          <div className="flex justify-center pt-4 pb-3 border-b border-gray-100">
            <div className="w-12 lg:w-16 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Content with scroll */}
          <div className="overflow-y-auto flex-1">
            {children}
          </div>
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </>,
    document.body
  );
}