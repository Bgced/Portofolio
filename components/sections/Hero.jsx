"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Move3D, Play } from "lucide-react";
import { PROFILE } from "@/lib/content";
import { useInView } from "@/lib/hooks";
import { useLang } from "@/components/providers";

const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3">
      <span className="h-10 w-10 animate-spin rounded-full border border-line border-t-accent" />
      <span className="mono-label">nyiapin scene 3d</span>
    </div>
  ),
});

const EASE = [0.22, 1, 0.36, 1];

export default function Hero() {
  const reduced = useReducedMotion();
  const [sceneRef, sceneInView] = useInView({ threshold: 0.05, rootMargin: "180px" });
  const { t } = useLang();

  // Selalu render initial style yang sama di server & client; reduced motion
  // cuma memangkas durasi. Ini yang bikin hydration bersih.
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
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-24"
    >
      {/* 3D scene transparan — bukan kartu, beneran jadi latar belakang */}
      <div
        ref={sceneRef}
        role="img"
        aria-label={t("hero.sceneLabel")}
        className="pointer-events-auto absolute inset-y-0 right-0 z-0 w-full opacity-40 sm:opacity-50 lg:w-[62%] lg:opacity-100"
      >
        <HeroScene inView={sceneInView} className="absolute inset-0" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, var(--bg) 0%, color-mix(in srgb, var(--bg) 78%, transparent) 30%, transparent 66%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-canvas to-transparent"
        />
      </div>

      {/* glow ambien tipis */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/4 top-1/4 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-accent/10 blur-[150px]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.7fr)] lg:gap-8">
        <div className="pointer-events-none min-w-0 max-w-[36rem]">
          <motion.div className="pointer-events-auto flex flex-wrap items-center gap-2" {...fade(0)}>
            <span className="pill pill-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              {t("hero.status")}
            </span>
          </motion.div>

          <motion.p className="eyebrow mt-7" {...fade(0.06)}>
            {t("hero.eyebrow")}
          </motion.p>

          <motion.h1
            className="mt-3 text-[clamp(2.5rem,7vw,4.75rem)] font-semibold leading-[0.95] tracking-[-0.045em] text-balance text-ink [overflow-wrap:break-word]"
            {...fade(0.12)}
          >
            {t("hero.greeting")} <span className="text-gradient glow-text">Cekael</span>!
          </motion.h1>

          <motion.p
            className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink/85 sm:text-[1.08rem]"
            {...fade(0.18)}
          >
            {t("hero.intro")}
          </motion.p>

          <motion.p
            className="mt-3 max-w-xl text-[0.9rem] leading-relaxed text-muted"
            {...fade(0.24)}
          >
            {t("hero.bio", {
              name: PROFILE.name,
              role: PROFILE.role,
              major: PROFILE.major,
              university: PROFILE.university,
            })}
          </motion.p>

          <motion.div className="pointer-events-auto mt-8 flex flex-wrap items-center gap-3" {...fade(0.3)}>
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
            className="mt-10 grid max-w-sm grid-cols-2 gap-3 border-t border-line-soft pt-5"
            {...fade(0.36)}
          >
            <div className="min-w-0">
              <p className="font-mono text-[1.35rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.5rem]">
                3+
              </p>
              <p className="mono-label mt-2 leading-tight">{t("hero.statProjects")}</p>
            </div>
            <div className="min-w-0">
              <p className="font-mono text-[1.35rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.5rem]">
                6
              </p>
              <p className="mono-label mt-2 leading-tight">{t("hero.statModules")}</p>
            </div>
          </motion.div>
        </div>

        {/* ruang kosong di kanan biar kubus bisa bernapas + HUD minimal */}
        <div className="pointer-events-none relative hidden min-h-[440px] lg:block">
          <span className="mono-label absolute right-0 top-0 text-accent">ck-01 / cube matrix</span>
          <span className="absolute bottom-6 right-0 flex items-center gap-1.5">
            <Move3D size={11} className="text-accent" aria-hidden="true" />
            <span className="mono-label">{t("hero.scrollHint")}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
