import { MARQUEE } from "@/lib/content";

/** Strip marquee industrial — server component, animasi murni CSS. */
export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];

  return (
    <div
      className="relative overflow-hidden border-y py-3.5"
      style={{
        borderColor: "var(--line-soft)",
        background: "color-mix(in srgb, var(--surface) 45%, transparent)",
      }}
      aria-hidden="true"
    >
      <div className="marquee-track items-center gap-8 whitespace-nowrap">
        {items.map((item, index) => (
          <span
            key={`${item}-${index}`}
            className="flex items-center gap-8 font-mono text-[10px] tracking-[0.22em] text-muted uppercase"
          >
            {item}
            <span className="h-1 w-1 rotate-45 bg-accent/70" />
          </span>
        ))}
      </div>
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-28"
        style={{ background: "linear-gradient(to right, var(--bg), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-28"
        style={{ background: "linear-gradient(to left, var(--bg), transparent)" }}
      />
    </div>
  );
}
