"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import PlaygroundTabs from "@/components/playground/PlaygroundTabs";
import { useLang } from "@/components/providers";

const CARDS = [
  { key: "playground.cardQr", title: "QR Studio" },
  { key: "playground.cardCalc", title: "Kalkulator" },
  { key: "playground.cardBmi", title: "Cek BMI" },
  { key: "playground.cardAi", title: "Cekael AI" },
];

export default function Playground() {
  const { t } = useLang();

  return (
    <section id="playground" className="section-shell scroll-mt-24">
      <SectionHeading
        index="03"
        kicker={t("sections.playgroundKicker")}
        title={t("sections.playgroundTitle")}
        accent={t("sections.playgroundAccent")}
        intro={t("sections.playgroundIntro")}
      />

      <PlaygroundTabs />

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {CARDS.map((card) => (
          <div key={card.key} className="panel h-full p-4">
            <h3 className="text-[0.88rem] font-semibold leading-snug text-ink">{card.title}</h3>
            <p className="mt-2 text-[0.78rem] leading-relaxed text-muted">{t(card.key)}</p>
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-[0.78rem] leading-relaxed text-muted">
        <span className="mt-[0.5rem] h-1 w-1 shrink-0 bg-accent" aria-hidden="true" />
        {t("sections.allLocal")}
      </p>
    </section>
  );
}
