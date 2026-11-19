"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROFILE } from "@/lib/content";
import { useLang } from "@/components/providers";
import TechArsenal from "@/components/sections/TechArsenal";

const BIO_STATS = [
  { value: "4", idLabel: "Project jadi", enLabel: "Projects built" },
  { value: "6", idLabel: "Modul kalkulasi", enLabel: "Calculation modules" },
  { value: "2", idLabel: "Tahun ngulik web", enLabel: "Years on the web" },
];

const TERMINAL_LINES = [
  { cmd: "whoami", out: "cedric_kilian" },
  { cmd: "status", out: "open_to_work", tone: "ok" },
  { cmd: "stack", out: "next.js · three.js · tailwind" },
];

export default function About() {
  const { t, lang } = useLang();
  const en = lang === "en";

  return (
    <section id="about" className="section-shell">
      <SectionHeading
        index="01"
        kicker={t("about.kicker")}
        title={t("about.title")}
        accent={t("about.accent")}
        intro={t("about.intro")}
      />

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        {/* portrait */}
        <div className="h-full lg:col-span-4 lg:row-span-2">
          <div className="panel panel-hover h-full overflow-hidden">
            <div className="relative h-full min-h-[360px] sm:min-h-[430px]">
              <Image
                src="/profile.jpg"
                alt="Foto Cedric Kilian, front-end developer dan mahasiswa Electrical Engineering UNY"
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 92vw"
                className="object-cover object-center opacity-90"
                priority={false}
              />
              <div aria-hidden="true" className="photo-scrim" />

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-lg font-semibold leading-tight text-ink">{PROFILE.name}</p>
                <p className="mt-1 text-[0.74rem] leading-snug text-muted">{PROFILE.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* bio */}
        <div className="h-full lg:col-span-8">
          <div className="panel panel-hover flex h-full flex-col gap-3 p-5 sm:p-6">
            <p className="text-[0.95rem] leading-relaxed text-ink">{t("about.p1")}</p>
            <p className="text-[0.88rem] leading-relaxed text-muted">{t("about.p2")}</p>
            <p className="text-[0.88rem] leading-relaxed text-muted">{t("about.p3")}</p>
            <div className="mt-auto pt-3">
              <div className="grid grid-cols-3 divide-x divide-line-soft overflow-hidden border border-line-soft bg-surface-2/45">
                {BIO_STATS.map((stat) => (
                  <div key={stat.idLabel} className="px-2.5 py-2">
                    <p className="font-mono text-lg font-semibold leading-none text-accent">{stat.value}</p>
                    <p className="mt-1 font-mono text-[0.5rem] uppercase leading-tight tracking-[0.1em] text-muted">
                      {en ? stat.enLabel : stat.idLabel}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="pill">UNY · Electrical Engineering</span>
                <span className="pill pill-accent">{t("about.available")}</span>
              </div>
            </div>
          </div>
        </div>

        {/* terminal: pojok flat, titik warna dibuang */}
        <div className="h-full lg:col-span-5">
          <div className="panel panel-hover h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
              <span className="mono-label text-[0.6rem]">ck@terminal</span>
            </div>
            <div className="space-y-2.5 p-4 font-mono text-[0.72rem] leading-relaxed sm:p-5">
              {TERMINAL_LINES.map((line) => (
                <div key={line.cmd}>
                  <p className="text-muted">
                    <span className="text-accent">$</span> {line.cmd}
                  </p>
                  <p className={`pl-3 ${line.tone === "ok" ? "text-ok" : "text-ink"}`}>
                    → {line.out}
                  </p>
                </div>
              ))}
              <p className="text-muted">
                <span className="text-accent">$</span>
                <span className="caret" aria-hidden="true" />
              </p>
            </div>
          </div>
        </div>

        {/* interactive tech arsenal */}
        <div className="h-full lg:col-span-7">
          <TechArsenal />
        </div>
      </div>
    </section>
  );
}
