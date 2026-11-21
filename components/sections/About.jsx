"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeftRight } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
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

const PHOTO_POS = {
  left: "order-1 lg:col-span-4 lg:order-1",
  right: "order-3 lg:col-span-4 lg:order-3",
};

const COPY_POS = {
  left: "order-2 lg:col-span-8 lg:order-2",
  right: "order-2 lg:col-span-4 lg:order-2",
};

export default function About() {
  const { t } = useLang();
  const [photoSide, setPhotoSide] = useState("left");

  // Baca pilihan posisi foto dari localStorage (client only).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cekael-about-photo");
      if (saved === "left" || saved === "right") setPhotoSide(saved);
    } catch {
      /* ignore */
    }
  }, []);

  const togglePhoto = () => {
    setPhotoSide((prev) => {
      const next = prev === "left" ? "right" : "left";
      try {
        window.localStorage.setItem("cekael-about-photo", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  };

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
        <Reveal
          className={`${PHOTO_POS[photoSide]} photo-side-shift lg:sticky lg:top-24 lg:self-start`}
        >
          <FloatingCard
            className="mx-auto w-full max-w-[19rem] lg:mx-0"
            surfaceClassName="card-surface--flush aspect-[4/5] w-full"
          >
            <div className="relative h-full w-full overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Cedric Kilian, front-end developer and Electrical Engineering student"
                fill
                sizes="(min-width: 1024px) 292px, (min-width: 640px) 60vw, 92vw"
                className="object-cover object-center"
              />
              <div aria-hidden="true" className="photo-scrim" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-mono text-[0.56rem] uppercase tracking-[0.18em] text-accent-2">
                  {t("about.available")}
                </p>
                <p className="mt-1 text-[1.05rem] font-semibold leading-tight text-ink">{PROFILE.name}</p>
                <p className="mt-1 text-[0.76rem] text-muted">{PROFILE.role}</p>
              </div>
            </div>
          </FloatingCard>

          {/* toggle posisi foto */}
          <button
            type="button"
            onClick={togglePhoto}
            className="mx-auto mt-2.5 flex w-full max-w-[19rem] items-center justify-center gap-2 rounded-[10px] border border-line bg-surface py-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted transition-colors hover:border-accent hover:text-accent-2 lg:mx-0"
            aria-label={t("about.photoPos", { side: photoSide === "left" ? t("about.posLeft") : t("about.posRight") })}
          >
            <ArrowLeftRight size={12} aria-hidden="true" />
            {t("about.photoPos", { side: photoSide === "left" ? t("about.posLeft") : t("about.posRight") })}
          </button>
        </Reveal>

        {/* copy + facts */}
        <Reveal delay={70} className={`${COPY_POS[photoSide]} order-2 lg:order-2`}>
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
