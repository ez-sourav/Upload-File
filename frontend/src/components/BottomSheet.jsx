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
    <div className="fixed inset-0 z-9999 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl animate-slideUp"
        onTouchStart={(e) => (startY.current = e.touches[0].clientY)}
        onTouchMove={(e) => (currentY.current = e.touches[0].clientY)}
        onTouchEnd={() => {
          if (currentY.current - startY.current > 80) onClose();
          startY.current = 0;
          currentY.current = 0;
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {children}
      </div>
    </div>,
    document.body
  );
}
