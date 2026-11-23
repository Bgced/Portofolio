"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { usePrefersReducedMotion } from "@/lib/hooks";

/* Foto ganti tiap 4 detik, transisi crossfade halus.
   - Pause otomatis pas hover/focus (biar bisa dilihat).
   - Hormati prefers-reduced-motion: nggak auto-putar (foto pertama diam). */
const PHOTOS = [
  "/photos/p1.webp",
  "/photos/p2.webp",
  "/photos/p3.webp",
  "/photos/p4.webp",
  "/photos/p5.webp",
  "/photos/p6.webp",
];

const INTERVAL = 4000;

export default function PhotoSlideshow() {
  const reduced = usePrefersReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduced || paused) return undefined;
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % PHOTOS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, [reduced, paused]);

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      {PHOTOS.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt=""
          fill
          sizes="(min-width: 1024px) 304px, (min-width: 640px) 60vw, 92vw"
          priority={i === 0}
          className={`photo-img object-cover object-center transition-opacity duration-700 ease-out motion-reduce:transition-none ${
            i === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
    </div>
  );
}