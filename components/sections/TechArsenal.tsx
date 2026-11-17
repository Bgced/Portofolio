"use client";

import { useState } from "react";
import { Bot, Boxes, Braces, Cpu, Layers, Wind, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers";

type Skill = {
  id: string;
  name: string;
  code: string;
  icon: LucideIcon;
  idDesc: string;
  enDesc: string;
  idUsed: string;
  enUsed: string;
};

const SKILLS: Skill[] = [
  {
    id: "next",
    name: "Next.js",
    code: "01",
    icon: Layers,
    idDesc:
      "App Router, server components, API route. Portfolio ini sendiri buktinya — dari halaman /card sampai endpoint AI, semuanya jalan di Next.js.",
    enDesc:
      "App Router, server components, API routes. This portfolio is the proof — from the /card page to the AI endpoint, it all runs on Next.js.",
    idUsed: "cekael.vercel.app · electricalcekael",
    enUsed: "cekael.vercel.app · electricalcekael",
  },
  {
    id: "typescript",
    name: "TypeScript",
    code: "02",
    icon: Braces,
    idDesc:
      "Strict mode biar bug ketangkep sebelum user nemu. Tipe buat state, props, dan payload QR — bukan sekadar tempelan biar keliatan pro.",
    enDesc:
      "Strict mode so bugs get caught before users do. Types for state, props, and QR payloads — not just decoration to look pro.",
    idUsed: "QR Studio · command palette",
    enUsed: "QR Studio · command palette",
  },
  {
    id: "r3f",
    name: "Three.js / R3F",
    code: "03",
    icon: Boxes,
    idDesc:
      "Kubus wireframe di hero, dikontrol scroll dan drag. Frameloop-nya demand biar baterai HP tetap aman, bukan animasi jalan terus tanpa guna.",
    enDesc:
      "The wireframe cubes in the hero, driven by scroll and drag. Demand frameloop keeps phone batteries safe instead of animating for nothing.",
    idUsed: "Hero 3D · cube matrix",
    enUsed: "Hero 3D · cube matrix",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    code: "04",
    icon: Wind,
    idDesc:
      "Design system cepat tanpa file CSS numpuk. Dark dan light mode pakai token yang sama, jadi warna nggak berantakan pas tema diganti.",
    enDesc:
      "A fast design system without a pile of CSS files. Dark and light mode share the same tokens, so colors stay sane when the theme flips.",
    idUsed: "Semua UI · dark/light",
    enUsed: "All UI · dark/light",
  },
  {
    id: "cpp",
    name: "C++ / Microcontroller",
    code: "05",
    icon: Cpu,
    idDesc:
      "Buat baca sensor, kontrol aktuator, dan ngoprek ESP32/Arduino. Kadang error-nya bukan di kode, tapi di kabel yang longgar — pengalaman mahal.",
    enDesc:
      "Reading sensors, driving actuators, tinkering with ESP32/Arduino. Sometimes the bug isn't in the code but a loose wire — expensive experience.",
    idUsed: "Lab elektro · embedded",
    enUsed: "Electro lab · embedded",
  },
  {
    id: "iot",
    name: "IoT & Robotics",
    code: "06",
    icon: Bot,
    idDesc:
      "Sensor → mikrokontroler → dashboard. Aku suka bikin sistem yang bisa dilihat datanya secara real-time, bukan cuma nyala doang.",
    enDesc:
      "Sensor → microcontroller → dashboard. I like building systems whose data you can actually watch in real time, not just something that turns on.",
    idUsed: "Project IoT · robotika",
    enUsed: "IoT projects · robotics",
  },
];

export default function TechArsenal() {
  const [activeId, setActiveId] = useState(SKILLS[0].id);
  const { lang } = useLang();
  const en = lang === "en";
  const active = SKILLS.find((skill) => skill.id === activeId) ?? SKILLS[0];

  return (
    <div id="tech-arsenal" className="panel panel-hover flex h-full flex-col p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="mono-label text-accent">// tech arsenal</p>
          <h3 className="mt-1 text-[1.02rem] font-semibold leading-tight text-ink">
            {en ? "Weapons of choice" : "Senjata ngoding"}
          </h3>
        </div>
        <span className="pill shrink-0 font-mono text-[0.52rem] uppercase tracking-[0.1em]">
          {en ? "hover / tap" : "hover / tap"}
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {SKILLS.map((skill) => {
          const Icon = skill.icon;
          const activeTile = skill.id === active.id;
          return (
            <button
              key={skill.id}
              type="button"
              aria-pressed={activeTile}
              onMouseEnter={() => setActiveId(skill.id)}
              onFocus={() => setActiveId(skill.id)}
              onClick={() => setActiveId(skill.id)}
              className={`group relative flex min-w-0 items-center gap-2 overflow-hidden rounded-lg border px-2.5 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                activeTile
                  ? "border-accent/55 bg-accent-soft shadow-[0_8px_26px_-18px_var(--glow)]"
                  : "border-line-soft bg-surface-2/60 hover:border-line"
              }`}
            >
              <span
                className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border transition-colors ${
                  activeTile
                    ? "border-accent/40 bg-canvas/40 text-accent"
                    : "border-line-soft bg-canvas/30 text-muted group-hover:text-ink"
                }`}
              >
                <Icon size={13} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span
                  className={`block text-[0.66rem] font-medium leading-tight sm:text-[0.7rem] ${
                    activeTile ? "text-ink" : "text-muted group-hover:text-ink"
                  }`}
                >
                  {skill.name}
                </span>
              </span>
              <span
                className={`shrink-0 font-mono text-[0.48rem] tracking-[0.08em] ${
                  activeTile ? "text-accent/70" : "text-muted/40"
                }`}
                aria-hidden="true"
              >
                {skill.code}
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={active.id}
        aria-live="polite"
        className="mt-3 flex-1 rounded-lg border border-line-soft bg-canvas/45 p-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">{active.name}</p>
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.1em] text-muted/60">
            {en ? "used in" : "dipakai di"} · {en ? active.enUsed : active.idUsed}
          </span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{en ? active.enDesc : active.idDesc}</p>
      </div>
    </div>
  );
}
