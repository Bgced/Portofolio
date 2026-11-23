"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Easter egg: Konami code (↑↑↓↓←→←→ B A) buka overlay "dev info" gaya
 * terminal flat. FPS cuma di-sample pas overlay kebuka. Esc nutup. Nggak
 * ada petunjuk apa pun di UI.
 */

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function DevOverlay() {
  const [open, setOpen] = useState(false);
  const [fps, setFps] = useState(null);
  const [info, setInfo] = useState(null);
  const progress = useRef(0);

  useEffect(() => {
    const onKey = (event) => {
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === KONAMI[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          setOpen((value) => !value);
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Kumpulin info + sample FPS cuma selama overlay kebuka.
  useEffect(() => {
    if (!open) return undefined;
    const nav = window.navigator;
    const conn = nav.connection || nav.mozConnection || nav.webkitConnection;
    setInfo({
      viewport: `${window.innerWidth}×${window.innerHeight}`,
      dpr: window.devicePixelRatio,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "on" : "off",
      effectiveType: conn?.effectiveType || "n/a",
      commit: (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "").slice(0, 7) || "local",
    });

    let raf = 0;
    let frames = 0;
    const start = performance.now();
    const tick = () => {
      frames += 1;
      const elapsed = performance.now() - start;
      if (elapsed < 1000) {
        raf = window.requestAnimationFrame(tick);
      } else {
        setFps(Math.round((frames * 1000) / elapsed));
      }
    };
    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [open]);

  if (!open) return null;

  const rows = info
    ? [
        ["commit", info.commit],
        ["viewport", info.viewport],
        ["dpr", String(info.dpr)],
        ["fps", fps == null ? "sampling…" : String(fps)],
        ["reduced-motion", info.reducedMotion],
        ["network", info.effectiveType],
      ]
    : [];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="dev info"
      className="fixed bottom-4 right-4 z-[90] w-[min(92vw,320px)] border border-line bg-[#0B0C0E] p-3 font-mono text-[0.66rem] text-[#9AA0A6]"
    >
      <div className="mb-2 flex items-center gap-2 text-[#4ADE9B]">
        <span className="inline-block h-2 w-2 bg-[#4ADE9B]" aria-hidden="true" />
        dev info
      </div>
      <dl className="flex flex-col gap-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="text-[#5C636B]">{label}</dt>
            <dd className="text-[#F2F1ED]">{value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-2 text-[0.58rem] text-[#5C636B]">esc to close</p>
    </div>
  );
}