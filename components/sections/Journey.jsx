"use client";

import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import { JOURNEY } from "@/lib/content";
import Reveal from "@/components/Reveal";

export default function Journey() {
  const { t, lang } = useLang();

  return (
    <section id="journey" className="section-shell scroll-mt-20">
      <SectionHeading index="04" kicker="daily driver" title={t("journey.title")} intro={t("journey.intro")} />

      <div className="relative ml-2 sm:ml-4">
        <span
          className="absolute bottom-2 left-[7px] top-2 w-px bg-gradient-to-b from-cyan-400/60 via-slate-700 to-transparent"
          aria-hidden="true"
        />
        <ol className="space-y-4">
          {JOURNEY.map((item, index) => (
            <li key={item.title} className="relative pl-8">
              <span
                className={`absolute left-0 top-5 grid h-[15px] w-[15px] place-items-center rounded-full border ${
                  item.future ? "border-amber-400/60 bg-slate-950" : "border-cyan-400/60 bg-slate-950"
                }`}
                aria-hidden="true"
              >
                <span className={`h-1.5 w-1.5 rounded-full ${item.future ? "bg-amber-400" : "bg-cyan-400"}`} />
              </span>

              <Reveal delay={index * 0.05}>
                <article className="group rounded-xl border border-slate-800/80 bg-slate-900/35 p-4 transition hover:border-cyan-400/30 hover:bg-slate-900/55 sm:p-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded border border-slate-700/80 px-1.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-slate-500 uppercase">
                      {item.tag[lang] ?? item.tag.id}
                    </span>
                    <span className="font-mono text-[9px] text-slate-600">0{index + 1}</span>
                    {item.future && (
                      <span className="rounded border border-amber-400/30 bg-amber-400/5 px-1.5 py-0.5 text-[9px] tracking-wider text-amber-300 uppercase">
                        deployed
                      </span>
                    )}
                  </div>
                  <h3 className="mt-2 text-base font-semibold text-slate-100">{item.title}</h3>
                  <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-slate-400">
                    {item.desc[lang] ?? item.desc.id}
                  </p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
