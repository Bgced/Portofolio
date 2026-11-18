"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ArrowDown, Play } from "lucide-react";
import { PROFILE } from "@/lib/content";
import { useLang } from "@/components/providers";

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const { t } = useLang();

  const fade = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: reduced ? 0 : 0.55,
      delay: reduced ? 0 : delay,
      ease: EASE,
    },
  });

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-28"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-12">
        {/* copy */}
        <div className="min-w-0 max-w-[36rem]">
          <motion.div className="flex flex-wrap items-center gap-2" {...fade(0)}>
            <span className="pill pill-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t("hero.status")}
            </span>
            <span className="mono-label text-[0.55rem]">{t("hero.eyebrow")}</span>
          </motion.div>

          <motion.h1
            className="mt-6 text-[clamp(2.4rem,6.4vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-balance text-ink [overflow-wrap:break-word]"
            {...fade(0.08)}
          >
            {t("hero.greeting")} <span className="text-gradient">Cekael</span>.
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink/85 sm:text-[1.08rem]"
            {...fade(0.16)}
          >
            {t("hero.intro")}
          </motion.p>

          <motion.p className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted" {...fade(0.22)}>
            {t("hero.bio", {
              name: PROFILE.name,
              role: PROFILE.role,
              major: PROFILE.major,
              university: PROFILE.university,
            })}
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap items-center gap-3" {...fade(0.28)}>
            <a href="#projects" className="btn btn-primary group">
              {t("hero.viewWork")}
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a href="#playground" className="btn btn-ghost group">
              <Play size={13} aria-hidden="true" className="text-accent" />
              {t("hero.tryPlayground")}
            </a>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-sm grid-cols-2 gap-3 border-t border-line pt-5"
            {...fade(0.34)}
          >
            <div className="min-w-0">
              <p className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                4
              </p>
              <p className="mono-label mt-2 leading-tight">{t("hero.statProjects")}</p>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                6
              </p>
              <p className="mono-label mt-2 leading-tight">{t("hero.statModules")}</p>
            </div>
          </motion.div>
        </div>

        {/* foto editorial */}
        <motion.figure
          className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0 : 0.7, delay: reduced ? 0 : 0.2, ease: EASE }}
        >
          <div className="photo-editorial relative aspect-[4/5] rounded-[var(--radius-card)]">
            <Image
              src="/profile.jpg"
              alt="Foto Cedric Kilian, front-end developer"
              fill
              sizes="(min-width: 1024px) 400px, 88vw"
              className="object-cover object-center"
              priority
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
              <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-ink">
                {PROFILE.name}
                <span className="mt-1 block text-[0.52rem] tracking-[0.16em] text-ink/70">
                  {t("hero.photoCaption")}
                </span>
              </span>
              <span className="font-mono text-[0.52rem] uppercase tracking-[0.18em] text-ink/70">
                ck · 2026
              </span>
            </figcaption>
          </div>
        </motion.figure>
      </div>

      <a
        href="#about"
        className="mono-label absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-1.5 text-[0.55rem] transition-colors hover:text-accent sm:flex"
      >
        <ArrowDown size={11} aria-hidden="true" />
        {t("hero.scrollHint")}
      </a>
    </section>
  );
}
