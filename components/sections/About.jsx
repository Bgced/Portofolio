"use client";

import Image from "next/image";
import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";

const STATS = [
  { value: "S1", key: "UNY — Teknik Elektro", accent: "text-cyan-300" },
  { value: "SE", key: "Software Engineer", accent: "text-emerald-300" },
  { value: "WD", key: "Web Development", accent: "text-amber-300" },
];

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="section-shell scroll-mt-20">
      <SectionHeading index="01" kicker="about" title={t("about.title")} />

      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        {/* portrait */}
        <Reveal className="relative mx-auto w-full max-w-[320px] lg:mx-0">
          <div className="group relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/40">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />
            <div className="absolute inset-0 z-10 grid-texture opacity-30" />
            <Image
              src="/profile.jpg"
              alt="Cedric Kilian"
              width={480}
              height={600}
              priority={false}
              sizes="(max-width: 1024px) 320px, 320px"
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-4">
              <div>
                <p className="text-sm font-semibold text-slate-100">Cedric Kilian</p>
                <p className="font-mono text-[10px] tracking-wider text-cyan-300/80 uppercase">software engineer</p>
              </div>
              <span className="rounded-full border border-emerald-400/40 bg-slate-950/70 px-2 py-0.5 text-[9px] tracking-wider text-emerald-300 uppercase">
                open
              </span>
            </div>
            <span className="absolute left-3 top-3 z-20 font-mono text-[9px] tracking-[0.25em] text-cyan-400/70 uppercase">
              id / ck-2026
            </span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {STATS.map((stat) => (
              <div key={stat.value} className="rounded-lg border border-slate-800/80 bg-slate-900/40 px-2 py-2 text-center">
                <p className={`font-mono text-base font-bold ${stat.accent}`}>{stat.value}</p>
                <p className="mt-0.5 text-[8px] leading-tight tracking-wide text-slate-500 uppercase">{stat.key}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* copy */}
        <div className="space-y-4">
          {["about.p1", "about.p2", "about.p3"].map((key, index) => (
            <Reveal key={key} delay={index * 0.06}>
              <p className="text-[15px] leading-relaxed text-slate-400">
                {index === 0 ? <span className="text-slate-200">{t(key)}</span> : t(key)}
              </p>
            </Reveal>
          ))}

          <Reveal delay={0.2}>
            <div className="mt-6 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
              <p className="font-mono text-[10px] tracking-[0.24em] text-cyan-400/70 uppercase">current focus</p>
              <ul className="mt-3 grid gap-2 text-xs text-slate-400 sm:grid-cols-2">
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-cyan-400" /> Modern web apps (React / Next.js)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" /> Embedded & IoT fundamentals
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-amber-400" /> AI-assisted development
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-slate-500" /> Clean, accessible interfaces
                </li>
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
