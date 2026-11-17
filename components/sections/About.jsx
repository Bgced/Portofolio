"use client";

import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { NOTES, PROFILE } from "@/lib/content";

const FOCUS = ["React / Next.js", "3D Web", "Embedded / IoT", "AI-Assisted Dev"];

const TERMINAL_LINES = [
  { cmd: "whoami", out: "cedric_kilian" },
  { cmd: "status", out: "open_to_work", tone: "ok" },
  { cmd: "base", out: "yogyakarta, id" },
];

export default function About() {
  return (
    <section id="about" className="section-shell">
      <SectionHeading
        index="01"
        kicker="tentang"
        title="Bukan cuma ngoding."
        accent="Gue juga ngulik sirkuit."
        intro="Software engineer yang kuliah teknik elektro — dua dunia yang ternyata nyambung banget."
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
                  available
                </span>
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[0.55rem] uppercase tracking-[0.18em] text-accent">operator</p>
                <p className="mt-1 text-lg font-semibold leading-tight text-ink">{PROFILE.name}</p>
                <p className="mt-1 text-[0.74rem] leading-snug text-muted">{PROFILE.role}</p>
                <p className="mt-3 flex items-center gap-1.5 font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
                  <MapPin size={11} aria-hidden="true" />
                  Sleman · Yogyakarta
                </p>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* bio */}
        <Reveal delay={0.05} className="h-full lg:col-span-8">
          <div className="panel panel-hover flex h-full flex-col gap-3 p-5 sm:p-6">
            <p className="mono-label">// profil singkat</p>
            <p className="text-[0.95rem] leading-relaxed text-ink">
              Gue <span className="font-semibold text-accent">Cedric</span> — lebih sering ngoprek
              daripada ngomong. Fokus gue bikin web yang cepat, rapi, dan nggak bikin mata sakit:
              React, Next.js, Tailwind, plus Three.js kalau butuh sentuhan visual 3D.
            </p>
            <p className="text-[0.88rem] leading-relaxed text-muted">
              Di kampus gue ambil S1 Teknik Elektro di UNY. Jadi selain ngurus component dan state,
              gue juga belajar rangkaian, sistem digital, sampai mikrokontroler. Kombinasi ini yang
              bikin cara gue nyelesaiin masalah agak beda dari yang cuma ngoding.
            </p>
            <p className="text-[0.88rem] leading-relaxed text-muted">
              Yang paling gue suka: bikin sesuatu dari nol. Mulai dari folder kosong, sketsa di
              kertas, sampai akhirnya jalan di browser atau nyala di breadboard.
            </p>
            <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
              <span className="pill">S1 Teknik Elektro</span>
              <span className="pill">UNY · Yogyakarta</span>
              <span className="pill pill-accent">open to work</span>
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

        {/* stats + focus */}
        <Reveal delay={0.15} className="h-full lg:col-span-3">
          <TiltCard max={5} className="panel panel-hover h-full p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-3xl font-semibold leading-none text-accent">3+</p>
              <span className="mono-label text-right text-[0.55rem]">project live</span>
            </div>
            <div className="hairline my-3" />
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-mono text-3xl font-semibold leading-none text-ink">6</p>
              <span className="mono-label text-right text-[0.55rem]">modul elektro</span>
            </div>
            <p className="mt-4 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-accent">
              electrical × web
            </p>
            <ul className="mt-2 flex flex-wrap gap-1.5">
              {FOCUS.map((item) => (
                <li key={item} className="pill">
                  {item}
                </li>
              ))}
            </ul>
          </TiltCard>
        </Reveal>

        {/* notes strip */}
        <Reveal delay={0.2} className="lg:col-span-12">
          <div className="panel px-4 py-4 sm:px-5">
            <div className="mb-3 flex items-center justify-between">
              <p className="mono-label">// catatan terbaru</p>
              <ArrowUpRight size={13} className="text-accent" aria-hidden="true" />
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {NOTES.map((note) => (
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
