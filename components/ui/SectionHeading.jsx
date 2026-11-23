"use client";

/**
 * Section header: label mono + judul besar + paragraf intro. Tanpa nomor urut
 * (dulu "02 — ABOUT"), cukup label biar nggak template.
 *
 * Dibungkus Reveal -> tiap heading muncul dengan animasi pas section kena scroll
 * (Windows & mobile, hormati prefers-reduced-motion).
 */
import Reveal from "@/components/ui/Reveal";

export default function SectionHeading({ index = "01", kicker = "", title, accent, intro, className = "" }) {
  return (
    <Reveal className={`mb-8 sm:mb-10 ${className}`}>
      <p className="eyebrow">
        {kicker || title}
      </p>

      <h2 className="display-title mt-4 max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)]">
        <span className="hologram" data-holo={title}>
          {title}
        </span>
        {accent ? (
          <>
            {" "}
            <span className="hologram text-accent-2" data-holo={accent}>
              {accent}
            </span>
          </>
        ) : null}
      </h2>

      {intro ? (
        <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted sm:text-[0.98rem]">
          {intro}
        </p>
      ) : null}
    </Reveal>
  );
}
