"use client";

import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PlaygroundTabs from "@/components/playground/PlaygroundTabs";
import { useLang } from "@/components/providers";

const NOTES_ID = [
  { code: "01", title: "QR Studio beneran", body: "Lima mode QR, preview live, download PNG HD. Semua di browser." },
  { code: "02", title: "Kalkulator beneran", body: "State machine sendiri, bukan gambar. Bisa keyboard juga." },
  { code: "03", title: "BMI real-time", body: "Validasi input + range berat sehat, hitung di browser." },
  { code: "04", title: "Cekael AI hybrid", body: "Coba Gemini/OpenAI dulu, kalau nggak ada ya brain lokal." },
];

const NOTES = [
  { code: "01", title: "QR Studio, for real", body: "Five QR modes, live preview, HD PNG download. All in your browser." },
  { code: "02", title: "A real calculator", body: "Its own state machine, not an image. Keyboard works too." },
  { code: "03", title: "Real-time BMI", body: "Input validation + healthy weight range, computed in the browser." },
  { code: "04", title: "Hybrid Cekael AI", body: "Tries Gemini/OpenAI first, then falls back to the local brain." },
];

export default function Playground() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const notes = en ? NOTES : NOTES_ID;

  return (
    <section id="playground" className="section-shell scroll-mt-24">
      <SectionHeading
        index="03"
        kicker={t("sections.playgroundKicker")}
        title={t("sections.playgroundTitle")}
        accent={t("sections.playgroundAccent")}
        intro={t("sections.playgroundIntro")}
      />

      <Reveal>
        <PlaygroundTabs />
      </Reveal>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {notes.map((note, index) => (
          <Reveal key={note.code} delay={0.05 + index * 0.05}>
            <div className="h-full rounded-xl border border-line-soft bg-surface p-3">
              <p className="mono-label">tool_{note.code}</p>
              <p className="mt-1.5 text-[0.82rem] font-semibold text-ink">{note.title}</p>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">{note.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 font-mono text-[0.66rem] leading-relaxed text-muted">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        {en
          ? "Everything runs in your browser — no data is sent unless you use the online Cekael AI."
          : "Semua jalan di browser kamu - nggak ada data yang dikirim kecuali kamu pake Cekael AI online."}
      </p>
    </section>
  );
}
