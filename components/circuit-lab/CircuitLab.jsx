"use client";

import { useState } from "react";
import { useLang } from "@/components/providers";
import ResistorTool from "./ResistorTool";
import OhmLedTool from "./OhmLedTool";
import RcTool from "./RcTool";

const COPY = {
  en: {
    kicker: "B1 — Electrical tools",
    title: "Circuit",
    accent: "Lab",
    intro: "Three quick EE calculators that actually compute. Pick a tab, tweak the values, copy the result — shareable by URL.",
    tabResistor: "Resistor",
    tabOhm: "Ohm + LED",
    tabRc: "RC",
    note: "Semua perhitungan jalan lokal di browser. Nggak ada data yang dikirim ke mana-mana.",
  },
  id: {
    kicker: "B1 — Tool teknik elektro",
    title: "Circuit",
    accent: "Lab",
    intro: "Tiga kalkulator elektro cepat yang beneran ngitung. Pilih tab, ubah nilainya, salin hasilnya — bisa dibagi lewat URL.",
    tabResistor: "Resistor",
    tabOhm: "Ohm + LED",
    tabRc: "RC",
    note: "Semua perhitungan jalan lokal di browser. Nggak ada data yang dikirim ke mana-mana.",
  },
};

export default function CircuitLab() {
  const { lang } = useLang();
  const t = COPY[lang];
  const [tab, setTab] = useState("resistor"); // 'resistor' | 'ohm' | 'rc'

  const tabs = [
    { id: "resistor", label: t.tabResistor },
    { id: "ohm", label: t.tabOhm },
    { id: "rc", label: t.tabRc },
  ];

  return (
    <section id="circuit-lab" className="section-shell">
      {/* Heading */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-px w-8 bg-line" />
          <span className="mono-label">{t.kicker}</span>
        </div>
        <h2 className="mb-3 text-[clamp(2rem,4vw,3rem)] font-black leading-none tracking-[-0.045em] text-ink">
          {t.title}{" "}
          <span className="text-accent">{t.accent}</span>
        </h2>
        <p className="max-w-2xl text-[0.9rem] leading-relaxed text-muted">
          {t.intro}
        </p>
      </div>

      {/* Tab switcher */}
      <div className="mb-6 flex gap-1 border-b border-line">
        {tabs.map(item => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={`relative px-4 py-2.5 font-mono text-[0.85rem] transition-colors ${
              tab === item.id
                ? "text-ink"
                : "text-muted hover:text-ink"
            }`}
            aria-pressed={tab === item.id}
          >
            {item.label}
            {tab === item.id && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent" />
            )}
          </button>
        ))}
      </div>

      {/* Active tool */}
      <div>
        {tab === "resistor" && <ResistorTool />}
        {tab === "ohm" && <OhmLedTool />}
        {tab === "rc" && <RcTool />}
      </div>

      {/* Note */}
      <p className="mt-6 max-w-2xl text-[0.78rem] leading-relaxed text-muted">
        {t.note}
      </p>
    </section>
  );
}