"use client";

import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import { PROJECTS } from "@/lib/content";
import { ArrowRightIcon } from "@/components/Icons";
import Reveal from "@/components/Reveal";

export default function Projects() {
  const { t } = useLang();

  return (
    <section id="projects" className="section-shell scroll-mt-20">
      <SectionHeading index="03" kicker="work" title={t("projects.title")} intro={t("projects.intro")} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((project, index) => (
          <Reveal key={project.title} delay={(index % 3) * 0.05}>
            <article className="group relative flex h-full flex-col overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/35 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/35 hover:bg-slate-900/60 hover:shadow-[0_20px_60px_-30px_rgba(0,210,255,0.5)]">
              {/* visual header */}
              <div className="relative flex h-28 items-center justify-center overflow-hidden border-b border-slate-800/80 bg-slate-950/60">
                <div className="absolute inset-0 grid-texture opacity-40" />
                <span
                  className={`relative font-mono text-2xl font-bold tracking-tight ${
                    project.kind === "project" ? "text-cyan-300" : "text-slate-400"
                  }`}
                >
                  {project.code}
                </span>
                <span className="absolute right-2 top-2 rounded border border-slate-700/70 px-1.5 py-0.5 font-mono text-[8px] tracking-[0.16em] text-slate-500 uppercase">
                  {project.kind === "project" ? t("nav.projects") : "knowledge"}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-sm font-semibold leading-snug text-slate-100">{project.title}</h3>
                <p className="mt-2 flex-1 text-[12px] leading-relaxed text-slate-400">{project.desc}</p>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-700/70 bg-slate-800/40 px-1.5 py-0.5 font-mono text-[9px] text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {project.href && (
                  <a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold text-cyan-300 transition hover:text-cyan-200"
                  >
                    {t("projects.demo")}
                    <ArrowRightIcon width={13} height={13} className="transition group-hover:translate-x-0.5" />
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}

        <Reveal delay={0.1}>
          <div className="flex h-full min-h-[220px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-700/70 bg-slate-900/20 p-5 text-center transition hover:border-cyan-400/30">
            <span className="grid h-10 w-10 place-items-center rounded-full border border-slate-700 text-lg text-slate-500">+</span>
            <p className="text-xs text-slate-400">{t("projects.soon")}</p>
            <p className="font-mono text-[10px] tracking-wider text-slate-600">{t("projects.soonSub")}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
