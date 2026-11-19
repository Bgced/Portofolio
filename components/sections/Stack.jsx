"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import { SKILL_GROUPS, TOOLS } from "@/lib/content";
import { SKILL_GROUPS_EN, TOOLS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";

export default function Stack() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const groups = SKILL_GROUPS.map((group) =>
    en ? { ...group, ...(SKILL_GROUPS_EN[group.code] ?? {}) } : group
  );
  const tools = TOOLS.map((tool) => (en ? { ...tool, ...(TOOLS_EN[tool.title] ?? {}) } : tool));

  return (
    <section id="stack" className="section-shell">
      <SectionHeading
        index="04"
        kicker={t("stack.kicker")}
        title={t("stack.title")}
        accent={t("stack.accent")}
        intro={t("stack.intro")}
      />

      {/* skill groups: susunan beda-beda, bukan grid seragam */}
      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        {groups.map((group, index) => (
          <div
            key={group.code}
            className={`panel panel-hover h-full p-5 sm:p-6 ${index === 0 ? "lg:col-span-7" : index === 1 ? "lg:col-span-5" : "lg:col-span-6"}`}
          >
            <span className="font-mono text-[0.66rem] tracking-[0.2em] text-accent">{group.code}</span>

            <h3 className="mt-3 text-[1.05rem] font-semibold leading-snug text-ink">
              {group.title}
            </h3>
            <p className="mt-2 text-[0.84rem] leading-relaxed text-muted">{group.blurb}</p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {group.items.map((item) => (
                <span key={item} className="pill transition-colors">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* daily drivers */}
      <div className="mt-10 mb-3 flex items-center gap-3">
        <p className="mono-label text-[0.6rem]">{t("stack.drivers")}</p>
        <span className="hairline flex-1" aria-hidden="true" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {tools.map((tool) => (
          <div key={tool.title} className="panel panel-hover h-full flex flex-col p-4">
            <span className="pill pill-accent self-start text-[0.55rem]">{tool.tag}</span>
            <h4 className="mt-3 text-[0.88rem] font-semibold leading-snug text-ink">
              {tool.title}
            </h4>
            <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">{tool.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
