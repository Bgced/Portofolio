import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import PlaygroundTabs from "@/components/playground/PlaygroundTabs";

const NOTES = [
  { code: "01", title: "Kalkulator beneran", body: "State machine sendiri, bukan gambar. Bisa keyboard juga." },
  { code: "02", title: "BMI real-time", body: "Validasi input + range berat sehat, hitung di browser." },
  { code: "03", title: "Cekael AI hybrid", body: "Coba Gemini/OpenAI dulu, kalau nggak ada ya brain lokal." },
];

export default function Playground() {
  return (
    <section id="playground" className="section-shell scroll-mt-24">
      <SectionHeading
        index="03"
        kicker="playground"
        title="Playground &"
        accent="Mini Tools"
        intro="Bukan screenshot, bukan mockup — tiga tool di bawah ini beneran jalan di browser lo. Coba pencet-pencet, sengaja gue bikin biar bisa lo bongkar."
      />

      <Reveal>
        <PlaygroundTabs />
      </Reveal>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {NOTES.map((note, index) => (
          <Reveal key={note.code} delay={0.05 + index * 0.05}>
            <div className="h-full rounded-xl border border-line-soft bg-surface/40 p-3">
              <p className="mono-label">tool_{note.code}</p>
              <p className="mt-1.5 text-[0.82rem] font-semibold text-ink">{note.title}</p>
              <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">{note.body}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 font-mono text-[0.66rem] leading-relaxed text-muted">
        <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
        Semua jalan di browser lo - nggak ada data yang dikirim kecuali lo pake Cekael AI online.
      </p>
    </section>
  );
}
