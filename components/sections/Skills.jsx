"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import { SKILLS } from "@/lib/content";
import { bgSettings } from "@/lib/bgSettings";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";

export default function Skills() {
  const { t, lang } = useLang();
  const track = useRef(null);
  const [linkDist, setLinkDist] = useState(100);

  const scrollBy = (direction) => {
    track.current?.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  const updateLinkDist = (value) => {
    setLinkDist(value);
    bgSettings.set(value);
  };

  return (
    <section id="skills" className="section-shell scroll-mt-20">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading index="02" kicker="stack" title={t("skills.title")} intro={t("skills.intro")} className="mb-6" />
        <div className="mb-8 hidden gap-2 sm:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="previous skills"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700/80 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <ArrowLeftIcon width={15} height={15} />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="next skills"
            className="grid h-9 w-9 place-items-center rounded-lg border border-slate-700/80 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            <ArrowRightIcon width={15} height={15} />
          </button>
        </div>
      </div>

      <div
        ref={track}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SKILLS.map((skill, index) => (
          <motion.article
            key={skill.name}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="group w-[236px] shrink-0 snap-start rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 transition hover:border-cyan-400/30 hover:bg-slate-900/60"
          >
            <div className="mb-3 flex items-start justify-between">
              <span className="font-mono text-[9px] tracking-[0.2em] text-slate-600 uppercase">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="font-mono text-[10px] text-cyan-400/80">{skill.level}%</span>
            </div>
            <h3 className="text-sm font-semibold text-slate-100">{skill.name}</h3>
            <p className="mt-1.5 min-h-[52px] text-[11px] leading-relaxed text-slate-500">
              {skill.desc[lang] ?? skill.desc.id}
            </p>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.15 + index * 0.04, ease: [0.22, 1, 0.36, 1] }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-cyan-300 shadow-[0_0_10px_rgba(0,210,255,0.6)]"
              />
            </div>
          </motion.article>
        ))}
      </div>

      <p className="mt-1 font-mono text-[10px] tracking-wide text-slate-600">{t("skills.hint")} →</p>

      {/* background density demo */}
      <div className="mt-8 rounded-xl border border-slate-800/80 bg-slate-900/30 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="linkDist" className="text-[11px] text-slate-400">
            {t("skills.title")} · <span className="font-mono text-cyan-300">background link density</span>
          </label>
          <span className="font-mono text-[11px] text-slate-500">{linkDist}</span>
        </div>
        <input
          id="linkDist"
          type="range"
          min="0"
          max="100"
          value={linkDist}
          onChange={(event) => updateLinkDist(Number(event.target.value))}
          className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-slate-800 accent-cyan-400"
        />
        <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-600">
          <span>isolated</span>
          <span>fully connected</span>
        </div>
      </div>
    </section>
  );
}
