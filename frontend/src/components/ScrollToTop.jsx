import { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const hideTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY > 300;

      // Show button when scrolled
      if (scrolled) {
        setVisible(true);

        // Reset auto-hide timer
        if (hideTimer.current) {
          clearTimeout(hideTimer.current);
        }

        hideTimer.current = setTimeout(() => {
          setVisible(false);
        }, 3000); // ⏱ auto-hide delay (2s)
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimer.current) clearTimeout(hideTimer.current);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setVisible(false);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`
        fixed bottom-6 left-5 md:left-auto md:right-6 z-40

        flex items-center justify-center
        h-11 w-11 rounded-full
        bg-blue-600 text-white
        shadow-lg shadow-blue-600/30
        transition-all duration-300 ease-out
        hover:bg-blue-700 active:scale-95
        ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-4 pointer-events-none"
        }
      `}
      aria-label="Scroll to top"
    >
      <ArrowUp className="h-5 w-5 stroke-[2.5]" />
    </button>
  );
}
