"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Muncul setelah 500px scroll, balik ke atas dengan smooth scroll. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Balik ke atas"
      title="Balik ke atas"
      tabIndex={visible ? 0 : -1}
      className={`fixed bottom-5 right-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-line bg-surface/90 text-accent backdrop-blur transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink sm:bottom-7 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={17} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
