"use client";

/**
 * Fallback statis buat hero 3D kalau WebGL nggak tersedia / context-nya gagal.
 * Murni CSS (pakai .cube-fallback dari globals.css) — nol canvas, nol JS 3D.
 */
export default function HeroFallback({ className = "" }) {
  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center overflow-hidden ${className}`}
      aria-hidden="true"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 72%)",
        }}
      />

      <div className="relative flex items-center justify-center" style={{ perspective: "900px" }}>
        <div className="cube-fallback">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      <p className="mono-label relative mt-14 text-center text-accent">
        webgl off · fallback mode
      </p>
      <p className="mono-label relative mt-1.5 text-center opacity-70">
        cube matrix static render
      </p>
    </div>
  );
}
