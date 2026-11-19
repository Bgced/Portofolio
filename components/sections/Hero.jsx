"use client";

import Image from "next/image";
import { ArrowUpRight, ArrowDown } from "lucide-react";
import { PROFILE } from "@/lib/content";
import { useLang } from "@/components/providers";

export default function Hero() {
  const { t } = useLang();

  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-20 lg:pt-28"
    >
      <div className="relative z-10 mx-auto grid w-full max-w-[1180px] items-center gap-10 px-5 sm:px-7 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.85fr)] lg:gap-12">
        {/* copy */}
        <div className="min-w-0 max-w-[38rem]">
          <p className="eyebrow">{t("hero.eyebrow")}</p>

          <h1 className="mt-6 text-[clamp(2.4rem,6.4vw,4.4rem)] font-semibold leading-[0.98] tracking-[-0.04em] text-balance text-ink [overflow-wrap:break-word]">
            {t("hero.greeting")}
          </h1>

          <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-ink/85 sm:text-[1.08rem]">
            {t("hero.intro")}
          </p>

          {/* satu highlight cyan per layar */}
          <p className="mt-4 max-w-xl border-l-2 border-accent pl-4 text-[0.9rem] leading-relaxed text-muted">
            {t("hero.highlight")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href="#projects" className="btn btn-primary">
              {t("hero.viewWork")}
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <a href="#playground" className="btn btn-ghost">
              {t("hero.tryPlayground")}
            </a>
          </div>

          <dl className="mt-10 grid max-w-lg grid-cols-3 gap-4 border-t border-line pt-5">
            <div className="min-w-0">
              <dt className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                4
              </dt>
              <dd className="mono-label mt-2 leading-tight">{t("hero.statProjects")}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                6
              </dt>
              <dd className="mono-label mt-2 leading-tight">{t("hero.statModules")}</dd>
            </div>
            <div className="min-w-0">
              <dt className="font-mono text-[1.3rem] font-semibold leading-none tracking-tight text-ink sm:text-[1.45rem]">
                2
              </dt>
              <dd className="mono-label mt-2 leading-tight">{t("hero.statYears")}</dd>
            </div>
          </dl>
        </div>

        {/* foto: monokrom, border 1px, radius kecil */}
        <figure className="relative mx-auto w-full max-w-[26rem] lg:mx-0 lg:ml-auto">
          <div className="photo-editorial aspect-[4/5]">
            <Image
              src="/profile.jpg"
              alt="Foto Cedric Kilian, front-end developer"
              fill
              sizes="(min-width: 1024px) 400px, 88vw"
              className="object-cover object-center"
              priority
            />
            <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-[rgba(10,11,12,0.72)] p-3">
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-ink">
                {PROFILE.name}
              </span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
                {t("hero.photoCaption")}
              </span>
            </figcaption>
          </div>
        </figure>
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
