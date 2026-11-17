"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin, Move3D, Play } from "lucide-react";
import { HERO_STATS, PROFILE } from "@/lib/content";
import { useInView } from "@/lib/hooks";

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
      className="relative w-full overflow-hidden pt-24 pb-14 sm:pt-28 lg:flex lg:min-h-[calc(100svh-64px)] lg:flex-col lg:justify-center lg:pt-24 lg:pb-12"
    >
      {/* ambient accent, murni dekorasi */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-0 h-[420px] w-[420px] rounded-full bg-accent/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-accent/5 blur-[120px]"
      />

      <div className="relative mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[1.02fr_0.98fr] lg:gap-12">
        {/* ------------------------------- copy ------------------------------- */}
        <div className="relative z-10 min-w-0">
          <motion.div className="flex flex-wrap items-center gap-2" {...fade(0)}>
            <span className="pill pill-accent">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
              open to work
            </span>
            <span className="pill">
              <MapPin size={11} className="text-accent" aria-hidden="true" />
              based in yogyakarta
            </span>
          </motion.div>

          <motion.p className="eyebrow mt-6" {...fade(0.06)}>
            markas digital · ck-01
          </motion.p>

          <motion.h1
            className="mt-3 text-[clamp(2.35rem,6.6vw,4.35rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink [overflow-wrap:break-word]"
            {...fade(0.12)}
          >
            Yo, gue <span className="text-gradient glow-text">Cekael</span>!
          </motion.h1>

          <motion.p
            className="mt-5 max-w-xl text-[0.98rem] leading-relaxed text-muted sm:text-[1.06rem]"
            {...fade(0.18)}
          >
            Selamat datang di <span className="font-medium text-ink">markas digital gue</span> —
            tempat kode, sirkuit, dan visual 3D ketemu jadi satu.
          </motion.p>

          <motion.p
            className="mt-3 max-w-xl text-[0.88rem] leading-relaxed text-muted"
            {...fade(0.24)}
          >
            Gue {PROFILE.name}, {PROFILE.role} dari {PROFILE.major},{" "}
            {PROFILE.university}. Bikin antarmuka yang rapi, cepat, dan enak dipakai — plus
            eksperimen WebGL yang tetap ringan.
          </motion.p>

          <motion.div className="mt-8 flex flex-wrap items-center gap-3" {...fade(0.3)}>
            <a href="#projects" className="btn btn-primary group">
              Gas Lihat Karya
              <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
            <a href="#playground" className="btn btn-ghost group">
              <Play size={13} aria-hidden="true" className="text-accent" />
              Coba Playground
            </a>
          </motion.div>

          <motion.div
            className="mt-10 grid max-w-md grid-cols-3 gap-3 border-t border-line-soft pt-5"
            {...fade(0.36)}
          >
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="min-w-0">
                <p className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                  {stat.value}
                </p>
                <p className="mono-label mt-2 leading-tight">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ------------------------------- 3D scene ------------------------------- */}
        <div ref={sceneRef} className="relative min-w-0">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-5 rounded-[2.2rem] bg-accent/5 blur-2xl"
          />

          <div
            role="img"
            aria-label="Matriks kubus 3D interaktif — drag atau scroll buat muter"
            className="panel corner-frame relative overflow-hidden p-2 sm:p-3"
          >
            <div className="relative h-[340px] w-full max-w-full overflow-hidden rounded-[0.8rem] border border-line-soft bg-surface-2 sm:h-[440px] lg:h-[540px]">
              <HeroScene inView={sceneInView} className="absolute inset-0" />

              {/* HUD — pointer-events-none biar drag tetap kena canvas */}
              <div className="pointer-events-none absolute inset-0 z-10">
                <span className="absolute left-0 top-0 h-4 w-4 border-l border-t border-accent/50" />
                <span className="absolute right-0 top-0 h-4 w-4 border-r border-t border-accent/50" />
                <span className="absolute bottom-0 left-0 h-4 w-4 border-b border-l border-accent/50" />
                <span className="absolute bottom-0 right-0 h-4 w-4 border-b border-r border-accent/50" />

                <span className="mono-label absolute left-3 top-3 text-accent">
                  ck-01 / cube matrix
                </span>

                <span className="absolute right-3 top-3 flex items-center gap-1.5">
                  <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-ok" aria-hidden="true" />
                  <span className="mono-label">live</span>
                </span>

                <span className="mono-label absolute bottom-3 left-3 hidden sm:block">
                  drag / scroll / parallax
                </span>
                <span className="mono-label absolute bottom-3 right-3 hidden sm:block">
                  scene / cube_matrix_v3
                </span>

                <span className="absolute inset-x-0 bottom-9 hidden justify-center sm:flex">
                  <span className="pill bg-surface/80">
                    <Move3D size={11} className="text-accent" aria-hidden="true" />
                    scroll / drag buat muter
                  </span>
                </span>
              </div>
            </div>
          </div>

          <p className="mono-label mt-3 flex items-center justify-between gap-3">
            <span>webgl · r3f 9</span>
            <span className="text-accent">60 fps target</span>
          </p>
        </div>
      </div>
    </section>
  );
}
