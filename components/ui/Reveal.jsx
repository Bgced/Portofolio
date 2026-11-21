"use client";

/**
 * Reveal — bungkus konten biar muncul dengan fade + naik pas masuk viewport.
 *
 * Pakai IntersectionObserver sekali jalan (nggak balik lagi), jadi section
 * nggak kedip-kedip pas di-scroll naik-turun. Hormati prefers-reduced-motion.
 *
 * Pemakaian:
 *   <Reveal delay={80}>
 *     <p>...</p>
 *   </Reveal>
 *
 * `as` buat ganti elemen pembungkus (default div). `className` diteruskan.
 */

import { useEffect, useRef } from "react";

export default function Reveal({
  children,
  delay = 0,
  as: Tag = "div",
  className,
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;

    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      node.setAttribute("data-reveal", "in");
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      data-reveal=""
      style={delay ? { "--reveal-delay": `${delay}ms` } : undefined}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}