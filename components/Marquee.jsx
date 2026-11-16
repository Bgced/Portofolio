"use client";

import { MARQUEE } from "@/lib/content";

export default function Marquee() {
  const items = [...MARQUEE, ...MARQUEE];

  return (
    <div className="relative my-6 overflow-hidden border-y border-slate-800/60 bg-slate-950/40 py-3" aria-hidden="true">
      <div className="marquee-track items-center gap-8 whitespace-nowrap">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-8 font-mono text-[11px] tracking-[0.2em] text-slate-500 uppercase">
            {item}
            <span className="h-1 w-1 rounded-full bg-cyan-400/50" />
          </span>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-950 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-950 to-transparent" />
    </div>
  );
}
