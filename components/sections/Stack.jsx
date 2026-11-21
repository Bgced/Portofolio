"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { SKILL_GROUPS, TOOLS } from "@/lib/content";
import { SKILL_GROUPS_EN, TOOLS_EN } from "@/lib/content-en";
import { useLang } from "@/components/providers";

/**
 * Toolkit gaya referensi: empat baris bernomor, label di kiri, isi di kanan.
 * Plus satu baris kecil "juga di kit" buat alat pendukung.
 */
export default function Stack() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const groups = SKILL_GROUPS.map((group) =>
    en ? { ...group, ...(SKILL_GROUPS_EN[group.code] ?? {}) } : group
  );
  const extras = TOOLS.map((tool) => (en ? { ...tool, ...(TOOLS_EN[tool.title] ?? {}) } : tool));

  return (
    <section id="stack" className="section-shell">
      <SectionHeading
        index="05"
        kicker={t("stack.kicker")}
        title={t("stack.title")}
        accent={t("stack.accent")}
        intro={t("stack.intro")}
      />

      <div className="border-t border-line">
        {groups.map((group, i) => (
          <Reveal
            key={group.code}
            delay={i * 60}
            className="grid gap-2 border-b border-line py-5 sm:grid-cols-[8rem_minmax(0,1fr)] sm:gap-6"
          >
            <h3 className="text-[0.95rem] font-semibold leading-snug text-ink">{group.title}</h3>

            <div className="min-w-0">
              <p className="text-[0.82rem] leading-relaxed text-muted">{group.blurb}</p>
              <div className="mt-2.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[0.66rem] uppercase tracking-[0.1em] text-muted">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={120} className="mt-6">
        <p className="mono-label">{t("stack.drivers")}</p>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {extras.map((tool) => (
            <span key={tool.title} className="pill">
              {tool.title}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
