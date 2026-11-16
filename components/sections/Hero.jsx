"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers";
import { TYPING } from "@/lib/content";
import { ArrowRightIcon, MailIcon } from "@/components/Icons";

const InteractiveMascot3D = dynamic(() => import("@/components/InteractiveMascot3D"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <span className="h-10 w-10 animate-spin rounded-full border border-slate-700 border-t-cyan-400" />
        <span className="font-mono text-[9px] tracking-[0.28em] text-slate-600 uppercase">booting unit ck-01</span>
      </div>
    </div>
  ),
});

function TypingRole({ items }) {
  const [text, setText] = useState("");

  useEffect(() => {
    let index = 0;
    let char = 0;
    let deleting = false;
    let timer;

    const tick = () => {
      const full = items[index % items.length];
      char = deleting ? char - 1 : char + 1;
      setText(full.slice(0, char));

      let delay = deleting ? 32 : 65;
      if (!deleting && char === full.length) {
        deleting = true;
        delay = 1900;
      } else if (deleting && char === 0) {
        deleting = false;
        index += 1;
        delay = 380;
      }
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 250);
    return () => clearTimeout(timer);
  }, [items]);

  return (
    <span className="font-mono text-sm text-cyan-300 sm:text-base">
      {text}
      <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-cyan-400 align-middle" style={{ height: "1em" }} />
    </span>
  );
}

export default function Hero() {
  const { t, lang } = useLang();
  const items = useMemo(() => TYPING[lang] ?? TYPING.id, [lang]);

  return (
    <section id="home" className="relative overflow-hidden pt-24 sm:pt-28">
      <div className="pointer-events-none absolute inset-0 grid-texture opacity-30" aria-hidden="true" />
      <div className="section-shell relative grid items-center gap-10 pb-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8 lg:pb-20">
        {/* ------------------------------- copy ------------------------------- */}
        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/5 px-3 py-1 text-[10px] font-medium tracking-[0.16em] text-emerald-300 uppercase"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            {t("hero.badge")}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-1.5 text-sm text-slate-400"
          >
            {t("hero.greeting")}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="text-[2.6rem] leading-[0.95] font-semibold tracking-tight text-slate-50 sm:text-6xl lg:text-[4.15rem]"
          >
            Cedric{" "}
            <span className="bg-gradient-to-br from-cyan-300 via-cyan-400 to-sky-500 bg-clip-text text-transparent">
              Kilian
            </span>
          </motion.h1>

          <div className="mt-4 min-h-[26px]">
            <TypingRole items={items} />
          </div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-5 max-w-lg text-[15px] leading-relaxed text-slate-400"
          >
            {t("hero.desc")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-950 transition hover:bg-cyan-300 hover:shadow-[0_0_30px_-6px_rgba(0,210,255,0.8)]"
            >
              {t("hero.projects")}
              <ArrowRightIcon width={15} height={15} className="transition group-hover:translate-x-0.5" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700/80 px-4 py-2.5 text-xs font-semibold tracking-wide text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
            >
              <MailIcon width={15} height={15} />
              {t("hero.contact")}
            </a>
          </motion.div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] tracking-wider text-slate-500 uppercase">
            <span>⚡ Electrical Engineering · UNY</span>
            <span className="hidden h-3 w-px bg-slate-800 sm:block" />
            <span>&lt;/&gt; Web Development</span>
          </div>
        </div>

        {/* ------------------------------ mascot ------------------------------ */}
        <div className="relative">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(0,210,255,0.16),transparent_65%)] blur-2xl sm:h-[420px] sm:w-[420px]"
            aria-hidden="true"
          />

          <div className="relative h-[360px] w-full sm:h-[440px] lg:h-[500px]">
            <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-cyan-400/40" aria-hidden="true" />
            <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-cyan-400/40" aria-hidden="true" />
            <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-cyan-400/40" aria-hidden="true" />
            <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-cyan-400/40" aria-hidden="true" />

            <div className="absolute left-3 top-2 z-10 hidden font-mono text-[9px] tracking-[0.24em] text-cyan-400/60 uppercase sm:block">
              unit ck-01 · drag to orbit
            </div>

            <InteractiveMascot3D className="cursor-grab active:cursor-grabbing" />
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-slate-950 to-transparent" aria-hidden="true" />
    </section>
  );
}
