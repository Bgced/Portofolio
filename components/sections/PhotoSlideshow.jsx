"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

/* Foto ganti tiap 4 detik, transisi crossfade halus (700ms).
   Selalu auto-putar; prefers-reduced-motion cuma bikin transisi instan
   (motion-reduce:transition-none), fotonya tetap berganti. */
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
  const [index, setIndex] = useState(0);

  // Selalu ganti tiap 4 detik. Reduced-motion -> transisi instan (CSS), bukan freeze.
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((value) => (value + 1) % PHOTOS.length);
    }, INTERVAL);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0">
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