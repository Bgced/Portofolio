"use client";

import { ArrowLeft, ArrowUpRight, GitBranch } from "lucide-react";
import { useLang } from "@/components/providers";

/** Halaman detail case study satu project (C2). */
export default function WorkDetail({ project }) {
  const { lang } = useLang();
  const en = lang === "en";
  const pick = (field) => field[lang] || field.id;
  const repoOk = project.links.repo && project.links.repo !== "TODO_ISI";

  return (
    <main className="relative z-10 mx-auto w-full max-w-[46rem] px-4 pb-20 pt-24 sm:pt-28">
      <a
        href="/#projects"
        className="mono-label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent-2"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        {en ? "Back to work" : "Balik ke work"}
      </a>

      <header className="mt-5">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-2">
          {project.code} · {project.year} · {project.status}
        </p>
        <h1 className="mt-1 text-[clamp(1.8rem,4vw,2.6rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">
          {project.title}
        </h1>
        <p className="mt-2 text-[0.9rem] text-muted">{project.role}</p>
      </header>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.stack.map((tech) => (
          <span key={tech} className="pill">
            {tech}
          </span>
        ))}
      </div>

      <dl className="mt-8 flex flex-col gap-6 border-t border-line pt-6">
        <div>
          <dt className="mono-label">{en ? "Problem" : "Masalah"}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">{pick(project.problem)}</dd>
        </div>
        <div>
          <dt className="mono-label">{en ? "What I built" : "Yang dibikin"}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">{pick(project.solution)}</dd>
        </div>
        <div>
          <dt className="mono-label">{en ? "Challenge" : "Tantangan"}</dt>
          <dd
            className={`mt-1.5 text-[0.95rem] leading-relaxed ${
              pick(project.challenge) === "TODO_ISI" ? "text-muted" : "text-ink"
            }`}
          >
            {pick(project.challenge) === "TODO_ISI"
              ? en
                ? "Belum diisi."
                : "Belum diisi."
              : pick(project.challenge)}
          </dd>
        </div>
        <div>
          <dt className="mono-label">{en ? "Result" : "Hasil"}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-ink">{pick(project.result)}</dd>
        </div>
      </dl>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <a
          href={project.links.live}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          {en ? "Live site" : "Buka web"}
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
        {repoOk ? (
          <a
            href={project.links.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            <GitBranch size={14} aria-hidden="true" />
            {en ? "Source" : "Source"}
          </a>
        ) : null}
      </div>
    </main>
  );
}