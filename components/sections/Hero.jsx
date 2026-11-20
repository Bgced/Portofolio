"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { useLang } from "@/components/providers";
import { COUNT } from "@/lib/games";
import { getGameComponent } from "@/components/games/registry";

/**
 * Hero arcade: headline kapital (baris kedua outline) + kartrid Snake yang
 * langsung bisa dimainkan. Snake dimuat lazy supaya HTML pertama tetap ringan.
 */
export default function Hero() {
  const { t } = useLang();
  const [mounted, setMounted] = useState(false);
  const Snake = getGameComponent("snake");

  // Canvas game butuh DOM; tunda satu tick biar server-render tetap bersih.
  useEffect(() => setMounted(true), []);

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-14">
        {/* copy */}
        <div className="min-w-0">
          <p className="eyebrow">
            01 — {t("hero.eyebrow")}
          </p>

          <h1 className="display-title mt-5 text-[clamp(2.6rem,8.4vw,5.6rem)]">
            <span className="block">{t("hero.line1")}</span>
            <span className="display-outline block">{t("hero.line2")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted sm:text-[1.04rem]">
            {t("hero.intro")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#playground" className="btn btn-primary">
              <Play size={14} aria-hidden="true" />
              {t("hero.play")}
            </a>
            <a href="#projects" className="btn btn-ghost">
              {t("hero.seeWork")}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>

          {/* stats: gaya scoreboard */}
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-line pt-5">
            {[
              { value: COUNT.games, label: t("hero.statGames") },
              { value: COUNT.tools, label: t("hero.statTools") },
              { value: 0, label: t("hero.statMockups") },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`min-w-0 ${index > 0 ? "border-l border-line pl-4" : ""}`}
              >
                <dt className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.03em] text-ink sm:text-[1.9rem]">
                  {stat.value}
                </dt>
                <dd className="mt-2 font-mono text-[0.6rem] uppercase leading-tight tracking-[0.16em] text-muted">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>

          <p className="mt-6 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted">
            {t("hero.status", { games: COUNT.games, tools: COUNT.tools })}
          </p>
        </div>

        {/* kartrid snake */}
        <div className="relative w-full max-w-[26rem] lg:ml-auto">
          <div className="cartridge">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-2">
                C-01 · GAME
              </span>
              <span className="pill">{t("playground.keysHint")}</span>
            </div>
            {mounted && Snake ? <Snake /> : (
              <div className="playfield grid min-h-[300px] place-items-center">
                <p className="mono-label text-[0.6rem]">{t("playground.loading")}</p>
              </div>
            )}
          </div>
          <p className="mt-2 text-center font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
            {t("hero.scrollHint")} ↓
          </p>
        </div>
      </div>
    </section>
  );
}
