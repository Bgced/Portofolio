"use client";

import { ArrowUpRight, Plus } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { PROJECTS } from "@/lib/content";
import { PROJECTS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";

/** Tumpukan plat isometrik murni CSS — pengganti visual 3D di kartu featured. */
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
          className="absolute inset-0 rounded-[0.6rem] border border-accent/35"
          style={{
            transform: `rotateX(58deg) rotateZ(45deg) translateZ(${layer * 15}px)`,
            background:
              layer === 0
                ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                : "color-mix(in srgb, var(--surface-2) 82%, transparent)",
            boxShadow: "0 0 26px color-mix(in srgb, var(--accent) 12%, transparent) inset",
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
        index="02"
        kicker={t("projects.kicker")}
        title={t("projects.title")}
        intro={t("projects.intro")}
      />

      <div className="grid gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {/* ---------------- featured ---------------- */}
        <Reveal className="h-full md:col-span-2 xl:col-span-3">
          <TiltCard max={4} className="panel panel-hover h-full overflow-hidden">
            <article className="grid h-full lg:grid-cols-[0.85fr_1.15fr]">
              {/* visual */}
              <div className="relative flex min-h-[240px] flex-col justify-between overflow-hidden border-b border-line-soft p-5 lg:min-h-[360px] lg:border-b-0 lg:border-r">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-70"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px)",
                    backgroundSize: "28px 28px",
                    maskImage: "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 78%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 80% 80% at 50% 40%, black, transparent 78%)",
                  }}
                />

                <div className="relative flex items-center justify-between">
                  <span className="pill pill-accent">{featured.code}</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-ok/40 bg-surface-2 px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-ok">
                    <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                    live
                  </span>
                </div>

                <div className="relative flex flex-1 items-center justify-center py-6">
                  <span
                    aria-hidden="true"
                    className="absolute font-mono text-[4.5rem] font-semibold leading-none tracking-[-0.06em] text-accent/10 sm:text-[6.5rem]"
                  >
                    EE-01
                  </span>
                  <CubeStack />
                </div>

                <div className="relative flex items-end justify-between gap-3">
                  <div>
                    <p className="mono-label text-[0.55rem]">build</p>
                    <p className="mt-0.5 font-mono text-[0.7rem] text-ink">next.js · r3f · tailwind</p>
                  </div>
                  <p className="font-mono text-[0.62rem] tracking-[0.18em] text-muted">
                    {featured.year}
                  </p>
                </div>
              </div>

              {/* copy */}
              <div className="flex flex-col gap-4 p-5 sm:p-6 lg:p-7">
                <div className="flex items-center gap-2">
                  <span className="pill">{t("projects.featured")}</span>
                  <span className="mono-label text-[0.55rem]">{t("projects.lab")}</span>
                </div>

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
                    className="btn btn-primary group w-full sm:w-auto"
                  >
                    {t("projects.cta")} ↗
                  </a>
                </div>
              </div>
            </article>
          </TiltCard>
        </Reveal>

        {/* ---------------- sisa project ---------------- */}
        {rest.map((project, index) => {
          const archived = project.status === "ARCHIVE";
          return (
            <Reveal key={project.id} delay={0.05 + (index % 3) * 0.05} className="h-full">
              <TiltCard
                max={6}
                className={`panel panel-hover flex h-full flex-col overflow-hidden p-4 sm:p-5 ${
                  archived ? "border-dashed" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.62rem] tracking-[0.2em] text-accent">
                    {project.code}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] ${
                      archived
                        ? "border-line-soft bg-surface-2 text-ink/70"
                        : "border-ok/40 bg-surface-2 text-ok"
                    }`}
                  >
                    {!archived ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 rounded-full bg-ok"
                      />
                    ) : null}
                    {project.status}
                  </span>
                </div>

                <div className="mt-4 flex items-baseline justify-between gap-2">
                  <p className="mono-label text-[0.55rem]">{project.year}</p>
                  <span className="mono-label text-[0.52rem]" aria-hidden="true">
                    ▚▚
                  </span>
                </div>

                <h3
                  className={`mt-1 text-[0.98rem] font-semibold leading-snug ${
                    archived ? "text-muted" : "text-ink"
                  }`}
                >
                  {project.title}
                </h3>

                <p className="mt-2 flex-1 text-[0.8rem] leading-relaxed text-muted">{project.desc}</p>

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
                  <ArrowUpRight
                    size={13}
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-0.5"
                  />
                </a>
              </TiltCard>
            </Reveal>
          );
        })}

        {/* ---------------- next project ---------------- */}
        <Reveal delay={0.15} className="h-full md:col-span-2 xl:col-span-3">
          <div className="flex h-full flex-col items-center justify-center gap-2 rounded-[1.1rem] border border-dashed border-line px-5 py-6 text-center sm:flex-row sm:gap-4 sm:text-left">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line-soft text-accent">
              <Plus size={15} aria-hidden="true" />
            </span>
            <div>
              <p className="text-[0.8rem] text-muted">{t("projects.next")}</p>
              <p className="mono-label mt-1 text-[0.52rem]">{t("projects.queue")}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
