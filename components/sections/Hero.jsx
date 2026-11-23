"use client";

import { ArrowRight, Play } from "lucide-react";
import { useLang } from "@/components/providers";
import { COUNT } from "@/lib/games";
import { PROJECTS } from "@/lib/content";

/**
 * Hero — komposisi asimetris ala industrial portfolio: nama raksasa di kiri,
 * blok readout teknis di kanan, rail bertick di tepi kiri sebagai identitas.
 * Nggak ada game di sini — semua game ada di section playground.
 */
export default function Hero() {
  const { t } = useLang();

  // Yang dihitung cuma yang beneran live, biar cocok sama section Work.
  const liveProjects = PROJECTS.filter((project) => project.status === "LIVE").length;

  const readout = [
    { label: t("hero.statGames"), value: String(COUNT.games).padStart(2, "0") },
    { label: t("hero.statTools"), value: String(COUNT.tools).padStart(2, "0") },
    { label: t("hero.statProjects"), value: String(liveProjects).padStart(2, "0") },
  ];

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pb-20 pt-28 sm:pt-32"
    >
      {/* rail identitas: garis + tick marks di tepi kiri */}
      <div aria-hidden="true" className="hero-rail pointer-events-none absolute inset-y-0 left-0 hidden w-6 lg:block" />

      <div className="relative z-10 mx-auto w-full max-w-[1180px] px-5 sm:px-7">
        <div className="grid items-end gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <p className="eyebrow">{t("hero.eyebrow")}</p>

            <h1
              className="display-title mt-6 text-[clamp(2.9rem,9vw,6.4rem)]"
              aria-label="Cedric Kilian"
            >
              <span className="hologram block" data-holo={t("hero.line1")} aria-hidden="true">
                {t("hero.line1")}
              </span>
              <span className="hologram block text-accent" data-holo={t("hero.line2")} aria-hidden="true">
                {t("hero.line2")}
              </span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <a href="#projects" className="btn btn-primary">
                {t("hero.seeWork")}
                <ArrowRight size={14} aria-hidden="true" />
              </a>
              <a href="#playground" className="btn btn-ghost">
                <Play size={13} aria-hidden="true" />
                {t("hero.play")}
              </a>
            </div>
          </div>

          {/* readout teknis: panel amber solid sebagai penyeimbang sisi kiri */}
          <dl className="readout w-full max-w-[21rem] justify-self-start lg:w-[21rem]">
            <div className="readout-head">
              <span className="readout-head-label">{t("hero.readoutLabel")}</span>
              <span className="status-dot" aria-hidden="true" />
            </div>

            <div className="readout-rows">
              {readout.map((row, index) => (
                <div key={row.label} className="readout-row">
                  <span className="readout-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="readout-value">{row.value}</span>
                  <span className="readout-label">{row.label}</span>
                </div>
              ))}
            </div>

            <div className="readout-foot">
              <span>{t("hero.statusNote")}</span>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
