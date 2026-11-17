"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { NOTES, PROFILE } from "@/lib/content";
import { NOTES_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";
import TechArsenal from "@/components/sections/TechArsenal";

const BIO_STATS = [
  { value: "3+", idLabel: "Project jadi", enLabel: "Projects built" },
  { value: "480+", idLabel: "Cangkir kopi", enLabel: "Cups of coffee" },
  { value: "12+", idLabel: "Tech stack", enLabel: "Tech stack" },
];

const TERMINAL_LINES = [
  { cmd: "whoami", out: "cedric_kilian" },
  { cmd: "status", out: "open_to_work", tone: "ok" },
  { cmd: "stack", out: "next.js · three.js · tailwind" },
];

export default function About() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const notes = NOTES.map((note, index) => (en ? { ...note, ...(NOTES_EN[index] ?? {}) } : note));

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
        <Reveal className="h-full lg:col-span-4 lg:row-span-2">
          <TiltCard max={6} className="panel panel-hover corner-frame h-full overflow-hidden">
            <div className="relative h-full min-h-[360px] sm:min-h-[430px]">
              <Image
                src="/profile.jpg"
                alt="Foto Cedric Kilian, software engineer dan mahasiswa Teknik Elektro UNY"
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 60vw, 92vw"
                className="object-cover object-center opacity-90"
                priority={false}
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-canvas via-canvas/25 to-transparent"
              />

              <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3">
                <span className="pill pill-accent">ID / CEK-2026</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/40 bg-surface-2 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ok">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                  {t("about.available")}
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-accent">{t("about.operator")}</p>
                <p className="mt-1 text-lg font-semibold leading-tight text-ink">{PROFILE.name}</p>
                <p className="mt-1 text-[0.74rem] leading-snug text-muted">{PROFILE.role}</p>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* bio */}
        <Reveal delay={0.05} className="h-full lg:col-span-8">
          <div className="panel panel-hover flex h-full flex-col gap-3 p-5 sm:p-6">
            <p className="mono-label">{t("about.profile")}</p>
            <p className="text-[0.95rem] leading-relaxed text-ink">
              {t("about.p1")}
            </p>
            <p className="text-[0.88rem] leading-relaxed text-muted">
              {t("about.p2")}
            </p>
            <p className="text-[0.88rem] leading-relaxed text-muted">
              {t("about.p3")}
            </p>
            <div className="mt-auto pt-3">
              <div className="grid grid-cols-3 divide-x divide-line-soft overflow-hidden rounded-lg border border-line-soft bg-surface-2/45">
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
                <span className="pill">S1 Teknik Elektro</span>
                <span className="pill">UNY · Electrical Engineering</span>
                <span className="pill pill-accent">open to work</span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* terminal */}
        <Reveal delay={0.1} className="h-full lg:col-span-5">
          <TiltCard max={5} className="panel panel-hover h-full overflow-hidden">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
              <span className="mono-label text-[0.55rem]">ck@terminal</span>
              <span className="flex gap-1.5" aria-hidden="true">
                <span className="h-1.5 w-1.5 rounded-full bg-line" />
                <span className="h-1.5 w-1.5 rounded-full bg-line" />
                <span className="h-1.5 w-1.5 rounded-full bg-accent/60" />
              </span>
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
          </TiltCard>
        </Reveal>

        {/* interactive tech arsenal */}
        <Reveal delay={0.15} className="h-full lg:col-span-7">
          <TechArsenal />
        </Reveal>

        {/* notes strip */}
        <Reveal delay={0.2} className="lg:col-span-12">
          <div className="panel px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="mono-label">{t("about.notes")}</p>
              <ArrowUpRight size={13} className="text-accent" aria-hidden="true" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {notes.map((note) => (
                <a
                  key={note.title}
                  href="#playground"
                  className="group flex items-start gap-2.5 rounded-lg border border-line-soft bg-surface-2 p-3 transition-colors duration-200 hover:border-line hover:bg-surface"
                >
                  <span className="pill pill-accent shrink-0">{note.tag}</span>
                  <span className="text-[0.76rem] leading-snug text-muted transition-colors group-hover:text-ink">
                    {note.title}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
