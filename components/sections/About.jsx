"use client";

import Image from "next/image";
import SectionHeading from "@/components/ui/SectionHeading";
import { PROFILE } from "@/lib/content";
import { useLang } from "@/components/providers";
import TechArsenal from "@/components/sections/TechArsenal";

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

      <div className="grid gap-3 sm:gap-4 lg:grid-cols-12">
        {/* foto + identitas */}
        <div className="lg:col-span-5">
          <div className="cartridge h-full p-0">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <Image
                src="/profile.jpg"
                alt="Cedric Kilian, front-end developer and Electrical Engineering student"
                fill
                sizes="(min-width: 1024px) 440px, (min-width: 640px) 60vw, 92vw"
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
          </div>
        </div>

        {/* copy + facts */}
        <div className="lg:col-span-7">
          <div className="cartridge h-full">
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
          </div>
        </div>

        {/* cara kerja */}
        <div className="lg:col-span-7">
          <div className="cartridge h-full">
            <p className="mono-label">{t("about.workLabel")}</p>
            <ul className="mt-3 flex flex-col gap-3">
              {HOW.map((row) => (
                <li key={row.titleKey} className="border-l border-line pl-3">
                  <p className="text-[0.84rem] font-semibold text-ink">{t(row.titleKey)}</p>
                  <p className="mt-0.5 text-[0.8rem] leading-relaxed text-muted">{t(row.bodyKey)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* arsenal */}
        <div className="lg:col-span-5">
          <TechArsenal />
        </div>
      </div>
    </section>
  );
}
