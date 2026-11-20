"use client";

/**
 * Section header bergaya referensi: label HUD bernomor ("02 — ABOUT"),
 * judul besar, lalu satu paragraf intro. Tanpa animasi masuk.
 */
export default function SectionHeading({ index = "01", kicker = "", title, accent, intro, className = "" }) {
  return (
    <div className={`mb-8 sm:mb-10 ${className}`}>
      <p className="eyebrow">
        {index}
        {kicker ? ` — ${kicker}` : ""}
      </p>

      <h2 className="display-title mt-4 max-w-3xl text-[clamp(1.9rem,5vw,3.4rem)]">
        {title}
        {accent ? (
          <>
            {" "}
            <span className="text-accent-2">{accent}</span>
          </>
        ) : null}
      </h2>

      {intro ? (
        <p className="mt-4 max-w-2xl text-[0.92rem] leading-relaxed text-muted sm:text-[0.98rem]">
          {intro}
        </p>
      ) : null}
    </div>
  );
}
