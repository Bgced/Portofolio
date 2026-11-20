"use client";

import { useState } from "react";
import { Bot, Boxes, Braces, Cpu, Layers, Wind, type LucideIcon } from "lucide-react";
import { useLang } from "@/components/providers";
import FloatingCard from "@/components/ui/FloatingCard";

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
      "App Router, server component, API route. Portfolio ini sendiri pakai Next.js, dari halaman /card sampai endpoint AI.",
    enDesc:
      "App Router, server components, API routes. This portfolio itself runs on Next.js, from the /card page to the AI endpoint.",
    idUsed: "cekael.vercel.app · electricalcekael",
    enUsed: "cekael.vercel.app · electricalcekael",
  },
  {
    id: "typescript",
    name: "TypeScript",
    code: "02",
    icon: Braces,
    idDesc:
      "Strict mode biar bug ketahuan sebelum user nemu. Tipe dipakai di state, props, dan payload QR.",
    enDesc:
      "Strict mode so bugs surface before users find them. Types for state, props, and QR payloads.",
    idUsed: "QR Studio · command palette",
    enUsed: "QR Studio · command palette",
  },
  {
    id: "r3f",
    name: "Three.js / R3F",
    code: "03",
    icon: Boxes,
    idDesc:
      "Latar 3D di seluruh halaman. Satu canvas saja, digerakkan scroll, dan frameloop-nya demand biar baterai HP tetap aman.",
    enDesc:
      "The 3D background across the page. One canvas, driven by scroll, with a demand frameloop so phone batteries stay safe.",
    idUsed: "Latar 3D · seluruh halaman",
    enUsed: "3D background · whole page",
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    code: "04",
    icon: Wind,
    idDesc:
      "Design system tanpa file CSS numpuk. Light dan dark mode pakai token yang sama, jadi warna tetap konsisten.",
    enDesc:
      "A design system without a pile of CSS files. Light and dark mode share the same tokens, so colors stay consistent.",
    idUsed: "Semua UI · light/dark",
    enUsed: "All UI · light/dark",
  },
  {
    id: "cpp",
    name: "C++ / Microcontroller",
    code: "05",
    icon: Cpu,
    idDesc:
      "Baca sensor, kontrol aktuator, dan ngoprek ESP32/Arduino. Kadang masalahnya bukan di kode, tapi kabel yang longgar.",
    enDesc:
      "Reading sensors, driving actuators, tinkering with ESP32/Arduino. Sometimes the issue isn't code, it's a loose wire.",
    idUsed: "Lab elektro · embedded",
    enUsed: "Electro lab · embedded",
  },
  {
    id: "iot",
    name: "IoT & Robotics",
    code: "06",
    icon: Bot,
    idDesc:
      "Sensor ke mikrokontroler ke dashboard. Datanya bisa dilihat langsung, bukan cuma nyala lalu diam.",
    enDesc:
      "Sensor to microcontroller to dashboard. You can watch the data live, instead of something that just turns on.",
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
    <FloatingCard
      id="tech-arsenal"
      className="h-full"
      surfaceClassName="card-surface--tight flex h-full flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="mt-1 text-[1.02rem] font-semibold leading-tight text-ink">
            {en ? "What I reach for" : "Yang gue pakai"}
          </h3>
        </div>
      </div>

      <div className="mt-3.5 grid auto-rows-[minmax(0,auto)] grid-cols-2 gap-1.5 sm:grid-cols-3">
        {SKILLS.map((skill, idx) => {
          const Icon = skill.icon;
          const activeTile = skill.id === active.id;
           // ukuran beda-beda biar grid nggak seragam
           const span = idx === 0 ? "col-span-2 sm:col-span-2" : idx === 3 ? "row-span-2" : "";
          return (
            <button
              key={skill.id}
              type="button"
              aria-pressed={activeTile}
              onMouseEnter={() => setActiveId(skill.id)}
              onFocus={() => setActiveId(skill.id)}
              onClick={() => setActiveId(skill.id)}
              className={`group relative flex min-w-0 items-center gap-2 overflow-hidden rounded-[12px] border px-2.5 py-2 text-left transition-colors duration-200 ${span} ${
                activeTile
                  ? "border-accent/55 bg-accent-soft"
                  : "border-line-soft bg-surface-2/60 hover:border-line"
              }`}
            >
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border transition-colors ${
                  activeTile
                    ? "border-accent/40 bg-canvas text-accent"
                    : "border-line-soft bg-canvas text-muted group-hover:text-ink"
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
            </button>
          );
        })}
      </div>

      <div
        key={active.id}
        aria-live="polite"
        className="mt-3 flex-1 rounded-xl border border-line-soft bg-canvas p-3"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="font-mono text-[0.62rem] uppercase tracking-[0.14em] text-accent">{active.name}</p>
          <span className="font-mono text-[0.52rem] uppercase tracking-[0.1em] text-muted/60">
            {en ? "used in" : "dipakai di"} · {en ? active.enUsed : active.idUsed}
          </span>
        </div>
        <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{en ? active.enDesc : active.idDesc}</p>
      </div>
    </FloatingCard>
  );
}
