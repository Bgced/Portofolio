"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import TiltCard from "@/components/ui/TiltCard";
import { NOTES, SKILL_GROUPS, TOOLS } from "@/lib/content";
import { NOTES_EN, SKILL_GROUPS_EN, TOOLS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";

export default function Stack() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const groups = SKILL_GROUPS.map((group) =>
    en ? { ...group, ...(SKILL_GROUPS_EN[group.code] ?? {}) } : group
  );
  const tools = TOOLS.map((tool) => (en ? { ...tool, ...(TOOLS_EN[tool.title] ?? {}) } : tool));
  const notes = NOTES.map((note, index) => (en ? { ...note, ...(NOTES_EN[index] ?? {}) } : note));

  return (
    <section id="stack" className="section-shell">
      <SectionHeading
        index="04"
        kicker={t("stack.kicker")}
        title={t("stack.title")}
        accent={t("stack.accent")}
        intro={t("stack.intro")}
      />

      {/* skill groups */}
      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
        {groups.map((group, index) => (
          <Reveal key={group.code} delay={index * 0.06} className="h-full">
            <TiltCard max={5} className="panel panel-hover group h-full p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <span className="font-mono text-[0.66rem] tracking-[0.24em] text-accent">
                  {group.code}
                </span>
                <span className="mono-label text-[0.52rem]">module {index + 1}/4</span>
              </div>

              <h3 className="mt-4 text-[1.05rem] font-semibold leading-snug text-ink">
                {group.title}
              </h3>
              <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{group.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span key={item} className="pill transition-colors group-hover:border-line">
                    {item}
                  </span>
                ))}
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>

      {/* daily drivers */}
      <Reveal delay={0.05}>
        <div className="mt-10 mb-3 flex items-center gap-3">
          <p className="mono-label text-[0.58rem]">{t("stack.drivers")}</p>
          <span className="hairline flex-1" aria-hidden="true" />
          <p className="mono-label text-[0.52rem]">04 unit</p>
        </div>
      </Reveal>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool, index) => (
          <Reveal key={tool.title} delay={index * 0.05} className="h-full">
            <div className="panel panel-hover flex h-full flex-col p-4">
              <span className="pill pill-accent self-start text-[0.55rem]">{tool.tag}</span>
              <h4 className="mt-3 text-[0.88rem] font-semibold leading-snug text-ink">
                {tool.title}
              </h4>
              <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">{tool.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>

      {/* log */}
      <Reveal delay={0.05}>
        <div className="mt-10 mb-3 flex items-center gap-3">
          <p className="mono-label text-[0.58rem]">{t("stack.log")}</p>
          <span className="hairline flex-1" aria-hidden="true" />
          <p className="mono-label text-[0.52rem]">read-only</p>
        </div>
      </Reveal>

      <div className="grid gap-3 md:grid-cols-3">
        {notes.map((note, index) => (
          <Reveal key={note.title} delay={index * 0.06} className="h-full">
            <article className="panel panel-hover flex h-full flex-col p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="pill pill-accent">{note.tag}</span>
                <span className="mono-label text-[0.5rem]">
                  log-{String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <h4 className="mt-3 text-[0.84rem] font-semibold leading-snug text-ink">
                {note.title}
              </h4>
              <p className="mt-2 text-[0.76rem] leading-relaxed text-muted">{note.body}</p>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
