"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import PhotoSlideshow from "@/components/sections/PhotoSlideshow";
import { PROFILE } from "@/lib/content";
import { useLang } from "@/components/providers";
import TechArsenal from "@/components/sections/TechArsenal";
import FloatingCard from "@/components/ui/FloatingCard";
import Reveal from "@/components/ui/Reveal";

const FACTS = [
  { labelKey: "about.focus", valueKey: "about.focusValue" },
  { labelKey: "about.statusLabel", valueKey: "about.statusValue" },
  { labelKey: "about.interestLabel", valueKey: "about.interestValue" },
  { labelKey: "about.workLabel", valueKey: "about.workValue" },
];

const HOW = [
  { titleKey: "about.how1Title", bodyKey: "about.how1" },
  { titleKey: "about.how2Title", bodyKey: "about.how2" },
  { titleKey: "about.how3Title", bodyKey: "about.how3" },
];

/* Susunan tetap: foto di kanan pada desktop, di atas pada mobile. */
const PHOTO_POS = "order-1 lg:col-span-4 lg:order-2";
const COPY_POS = "order-2 lg:col-span-8 lg:order-1";

export default function About() {
  const { t } = useLang();

  return (
    <section id="about" className="section-shell">
      <SectionHeading
        index="02"
        kicker={t("about.kicker")}
        title={t("about.title")}
        accent={t("about.accent")}
        intro={t("about.intro")}
      />

      <div className="grid gap-4 sm:gap-5 lg:grid-cols-12">
        {/* foto + identitas — pindah kiri/kanan */}
        <Reveal className={`${PHOTO_POS} lg:sticky lg:top-24 lg:self-start`}>
          <FloatingCard
            className="mx-auto w-full max-w-[19rem] lg:mx-0"
            surfaceClassName="card-surface--flush aspect-[4/5] w-full"
          >
            <div className="photo-frame group relative h-full w-full overflow-hidden">
              <PhotoSlideshow />
              {/* scanline overlay */}
              <div aria-hidden="true" className="photo-scanlines pointer-events-none absolute inset-0" />
              {/* gradient scrim */}
              <div aria-hidden="true" className="photo-scrim" />
              {/* corner brackets */}
              <span aria-hidden="true" className="photo-corner photo-corner-tl" />
              <span aria-hidden="true" className="photo-corner photo-corner-tr" />
              <span aria-hidden="true" className="photo-corner photo-corner-bl" />
              <span aria-hidden="true" className="photo-corner photo-corner-br" />
              {/* info overlay */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-accent-2">
                  {t("about.available")}
                </p>
                <p className="mt-1 text-[1.05rem] font-semibold leading-tight text-ink">{PROFILE.name}</p>
                <p className="mt-1 text-[0.76rem] text-muted">{PROFILE.role}</p>
              </div>
              {/* hover hint */}
              <span className="photo-hint pointer-events-none absolute right-3 top-3 font-mono text-[0.52rem] uppercase tracking-[0.14em] text-accent-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                live
              </span>
            </div>
          </FloatingCard>
        </Reveal>

        {/* copy + facts */}
        <Reveal delay={70} className={COPY_POS}>
          <FloatingCard className="h-full" surfaceClassName="h-full">
            <p className="text-[0.92rem] leading-relaxed text-ink">{t("about.p1")}</p>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{t("about.p2")}</p>
            <p className="mt-3 text-[0.88rem] leading-relaxed text-muted">{t("about.p3")}</p>

            <dl className="mt-5 divide-y divide-line border-t border-line">
              {FACTS.map((fact) => (
                <div key={fact.labelKey} className="flex items-baseline justify-between gap-4 py-2.5">
                  <dt className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
                    {t(fact.labelKey)}
                  </dt>
                  <dd className="text-right text-[0.8rem] font-medium text-ink">{t(fact.valueKey)}</dd>
                </div>
              ))}
            </dl>
          </FloatingCard>
        </Reveal>

        {/* cara kerja */}
        <Reveal delay={120} className="lg:col-span-7">
          <FloatingCard className="h-full" surfaceClassName="flex h-full flex-col">
            <p className="mono-label">{t("about.workLabel")}</p>
            <ul className="mt-3 flex flex-col gap-3">
              {HOW.map((row) => (
                <li key={row.titleKey} className="border-l border-line pl-3">
                  <p className="text-[0.84rem] font-semibold text-ink">{t(row.titleKey)}</p>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed text-muted">{t(row.bodyKey)}</p>
                </li>
              ))}
            </ul>
          </FloatingCard>
        </Reveal>

        {/* arsenal */}
        <Reveal delay={160} className="lg:col-span-5">
          <TechArsenal />
        </Reveal>
      </div>
    </section>
  );
}
