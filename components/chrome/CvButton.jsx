"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";

/**
 * Tombol unduh CV. Karena /cv.pdf belum tentu ada, tombol nyembunyi sendiri
 * kalau file-nya nggak ketemu (HEAD /cv.pdf → 404). Nggak ada link mati.
 */
export default function CvButton({ className = "", en = true }) {
  const [exists, setExists] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/cv.pdf", { method: "HEAD" })
      .then((res) => {
        if (alive) setExists(res.ok);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!exists) return null;

  return (
    <a href="/cv.pdf" download className={className}>
      <Download size={13} aria-hidden="true" />
      {en ? "Download CV" : "Unduh CV"}
    </a>
  );
}