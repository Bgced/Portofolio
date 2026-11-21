"use client";

import { ArrowRight, Play } from "lucide-react";
import { useLang } from "@/components/providers";
import { COUNT } from "@/lib/games";
import { PROJECTS } from "@/lib/content";

/**
 * Hero: nama besar, satu kolom. Nggak ada game di sini — semua game ada di
 * section playground, biar halaman pertama fokus ke orangnya.
 */
export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pb-16 pt-28 sm:pt-32"
    >
      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-7">
        <div className="min-w-0 max-w-3xl">
          <p className="eyebrow">
            {t("hero.eyebrow")}
          </p>

          <h1 className="display-title mt-5 text-[clamp(2.6rem,8.4vw,5.6rem)]">
            <span className="block">{t("hero.line1")}</span>
            <span className="block text-accent-2">{t("hero.line2")}</span>
          </h1>

          <p className="mt-6 max-w-xl text-[0.98rem] leading-relaxed text-muted sm:text-[1.04rem]">
            {t("hero.intro")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn btn-primary">
              {t("hero.seeWork")}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
            <a href="#playground" className="btn btn-ghost">
              <Play size={14} aria-hidden="true" />
              {t("hero.play")}
            </a>
          </div>

          {/* stats: gaya scoreboard */}
          <dl className="mt-10 grid max-w-md grid-cols-3 border-t border-line pt-5">
            {[
              { value: COUNT.games, label: t("hero.statGames") },
              { value: COUNT.tools, label: t("hero.statTools") },
              { value: PROJECTS.length, label: t("hero.statProjects") },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className={`min-w-0 ${index > 0 ? "border-l border-line pl-4" : ""}`}
              >
                <dt className="font-display text-[1.6rem] font-extrabold leading-none tracking-[-0.03em] text-accent-2 sm:text-[1.9rem]">
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
      </div>
    </section>
  );
}
