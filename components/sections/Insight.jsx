"use client";

import { useState } from "react";
import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import { INSIGHTS } from "@/lib/content";
import Reveal from "@/components/Reveal";

function InsightCard({ article, lang, t }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-slate-800/80 bg-slate-900/30 p-4 transition hover:border-cyan-400/25 hover:bg-slate-900/50 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="rounded border border-cyan-400/25 bg-cyan-400/5 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.14em] text-cyan-300/90 uppercase">
          {article.tag}
        </span>
        <span className="font-mono text-[9px] text-slate-600">2026</span>
      </div>

      <h3 className="mt-3 text-[15px] font-semibold leading-snug text-slate-100">{article.title}</h3>

      <div className={`mt-2 flex-1 space-y-2 text-[12px] leading-relaxed text-slate-400 ${open ? "" : "line-clamp-[6]"}`}>
        {article.body.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2 border-t border-slate-800/70 pt-3">
        <span className="font-mono text-[9px] tracking-wide text-slate-600 uppercase">
          {article.read} {t("insight.read")} · {article.topic}
        </span>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="text-[10px] font-semibold tracking-wide text-cyan-300/80 uppercase transition hover:text-cyan-200"
          aria-expanded={open}
        >
          {open ? (lang === "en" ? "less" : "tutup") : lang === "en" ? "read" : "baca"}
        </button>
      </div>
    </article>
  );
}

export default function Insight() {
  const { t, lang } = useLang();

  return (
    <section id="insight" className="section-shell scroll-mt-20">
      <SectionHeading index="05" kicker="notes" title={t("insight.title")} intro={t("insight.intro")} />

      <div className="grid gap-4 md:grid-cols-2">
        {INSIGHTS.map((article, index) => (
          <Reveal key={article.title} delay={(index % 2) * 0.05}>
            <InsightCard article={article} lang={lang} t={t} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
