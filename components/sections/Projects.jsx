"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROJECTS } from "@/lib/content";
import { PROJECTS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";

/** Tumpukan plat isometrik murni CSS: garis tipis cyan di atas hitam, tanpa glow. */
function CubeStack() {
  return (
    <div
      aria-hidden="true"
      className="float-y relative mx-auto h-28 w-28 sm:h-32 sm:w-32"
      style={{ perspective: "700px" }}
    >
      {[0, 1, 2, 3].map((layer) => (
        <span
          key={layer}
          className="absolute inset-0 rounded-[6px] border border-accent/35"
          style={{
            transform: `rotateX(58deg) rotateZ(45deg) translateZ(${layer * 15}px)`,
            background:
              layer === 0
                ? "color-mix(in srgb, var(--accent) 10%, transparent)"
                : "color-mix(in srgb, var(--surface-2) 88%, transparent)",
          }}
        />
      ))}
    </div>
  );
}

export default function Projects() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const localized = PROJECTS.map((project) =>
    en ? { ...project, ...(PROJECTS_EN[project.id] ?? {}) } : project
  );
  const featured = localized.find((project) => project.featured) ?? localized[0];
  const rest = localized.filter((project) => project.id !== featured.id);

  return (
    <section id="projects" className="section-shell">
      <SectionHeading
        index="04"
        kicker={t("projects.kicker")}
        title={t("projects.title")}
        accent={t("projects.accent")}
        intro={t("projects.intro")}
      />

      {/* susunan beda-beda per project, bukan grid seragam */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        {/* featured: penuh, visual + copy berdampingan */}
        <div className="lg:col-span-12">
          <article className="panel grid h-full overflow-hidden lg:grid-cols-[0.85fr_1.15fr]">
            <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden border-b border-line-soft p-5 lg:min-h-[360px] lg:border-b-0 lg:border-r">


              <div className="relative flex items-center justify-between gap-2">
                <span className="pill pill-accent">{featured.code}</span>
                <span className="border border-ok/40 bg-surface-2 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.1em] text-ok">
                  live
                </span>
              </div>

              <div className="relative flex flex-1 items-center justify-center py-6">
                <CubeStack />
              </div>

              <div className="relative flex items-end justify-between gap-3">
                <div>
                  <p className="mono-label">build</p>
                  <p className="mt-0.5 font-mono text-[0.7rem] text-ink">next.js · r3f · tailwind</p>
                </div>
                <p className="font-mono text-[0.64rem] tracking-[0.14em] text-muted">
                  {featured.year}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7">
              <span className="pill w-fit">{t("projects.featured")}</span>

              <h3 className="max-w-[26ch] text-[clamp(1.4rem,2.6vw,2rem)] font-semibold leading-[1.1] tracking-[-0.02em] text-ink">
                {featured.title}
              </h3>

              <p className="max-w-[52ch] text-[0.88rem] leading-relaxed text-muted">
                {featured.desc}
              </p>

              <ul className="mt-1 flex flex-col gap-2">
                {featured.highlights?.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-[0.8rem] text-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.42rem] h-1 w-1 shrink-0 rotate-45 bg-accent"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-1.5">
                {featured.tags.map((tag) => (
                  <span key={tag} className="pill">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-auto pt-2">
                <a
                  href={featured.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full sm:w-auto"
                >
                  {t("projects.cta")}
                  <ArrowUpRight size={14} aria-hidden="true" />
                </a>
              </div>
            </div>
          </article>
        </div>

        {/* dua project berdampingan */}
        {rest.slice(0, 2).map((project) => {
          const archived = project.status === "ARCHIVE";
          return (
            <div key={project.id} className="lg:col-span-6">
              <article
                className={`panel flex h-full flex-col overflow-hidden p-4 sm:p-5 ${
                  archived ? "border-dashed" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.64rem] tracking-[0.16em] text-accent">
                    {project.code}
                  </span>
                  <span
                    className={`border px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] ${
                      archived
                        ? "border-line-soft bg-surface-2 text-ink/70"
                        : "border-ok/40 bg-surface-2 text-ok"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <p className="mono-label">{project.year}</p>
                </div>

                <h3
                  className={`mt-1 text-[1.02rem] font-semibold leading-snug ${
                    archived ? "text-muted" : "text-ink"
                  }`}
                >
                  {project.title}
                </h3>

                <p className="mt-2 flex-1 text-[0.82rem] leading-relaxed text-muted">
                  {project.desc}
                </p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span key={tag} className="pill">
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-4 inline-flex items-center gap-1.5 border-t border-line-soft pt-3 text-[0.76rem] font-semibold transition-colors ${
                    archived ? "text-muted hover:text-ink" : "text-accent hover:text-ink"
                  }`}
                >
                  {project.cta}
                  <ArrowUpRight size={13} aria-hidden="true" />
                </a>
              </article>
            </div>
          );
        })}

        {/* project terakhir: baris lebar, beda susunan */}
        {rest.slice(2).map((project) => {
          const archived = project.status === "ARCHIVE";
          return (
            <div key={project.id} className="lg:col-span-12">
              <article
                className={`panel flex h-full flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:p-5 ${
                  archived ? "border-dashed" : ""
                }`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[0.64rem] tracking-[0.16em] text-accent">
                      {project.code}
                    </span>
                    <span className="mono-label">{project.year}</span>
                  </div>
                  <h3
                    className={`mt-1.5 text-[1.02rem] font-semibold leading-snug ${
                      archived ? "text-muted" : "text-ink"
                    }`}
                  >
                    {project.title}
                  </h3>
                  <p className="mt-1.5 text-[0.82rem] leading-relaxed text-muted">
                    {project.desc}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-3">
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span key={tag} className="pill">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 text-[0.76rem] font-semibold transition-colors ${
                      archived ? "text-muted hover:text-ink" : "text-accent hover:text-ink"
                    }`}
                  >
                    {project.cta}
                    <ArrowUpRight size={13} aria-hidden="true" />
                  </a>
                </div>
              </article>
            </div>
          );
        })}

        {/* antrian project */}
        <div className="lg:col-span-12">
          <div className="flex h-full flex-col items-start justify-center gap-2 border border-dashed border-line px-5 py-5 text-left sm:flex-row sm:items-center sm:gap-4">
            <span className="grid h-8 w-8 shrink-0 place-items-center border border-line-soft text-accent">
              <Plus size={14} aria-hidden="true" />
            </span>
            <p className="text-[0.82rem] text-muted">{t("projects.next")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
