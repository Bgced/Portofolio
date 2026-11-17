"use client";

import { useEffect, useRef } from "react";

/**
 * Bar tipis di atas viewport. Update lewat rAF + listener passive,
 * dan hanya menulis transform/opacity (nggak bikin layout ulang).
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    const apply = () => {
      frameRef.current = 0;
      const bar = barRef.current;
      if (!bar) return;

      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;

      bar.style.transform = `scaleX(${ratio.toFixed(4)})`;
      bar.style.opacity = ratio > 0.004 ? "1" : "0";
    };

    const request = () => {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request, { passive: true });

    return () => {
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px]" aria-hidden="true">
      <span
        ref={barRef}
        className="block h-full w-full origin-left bg-gradient-to-r from-accent-2 via-accent to-accent shadow-[0_0_14px_var(--glow)]"
        style={{ transform: "scaleX(0)", opacity: 0, transition: "opacity 200ms ease" }}
      />
    </div>
  );
}
