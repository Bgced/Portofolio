"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Muncul setelah 500px scroll, balik ke atas dengan smooth scroll. */
export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  // rAF-throttled: setState cuma dipanggil saat status benar-benar berubah.
  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      setVisible(window.scrollY > 500);
    };
    const request = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
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
      className={`fixed bottom-5 right-4 z-50 grid h-10 w-10 place-items-center rounded-[6px] border border-line bg-surface text-accent  transition-all duration-300 hover:border-accent hover:bg-accent hover:text-accent-ink sm:bottom-7 sm:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUp size={17} strokeWidth={2} aria-hidden="true" />
    </button>
  );
}
