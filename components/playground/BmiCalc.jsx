"use client";

import { useMemo, useState } from "react";
import { HeartPulse, RotateCcw } from "lucide-react";
import { useLang } from "@/components/providers";

const MIN_BMI = 15;
const MAX_BMI = 40;

const BANDS = [
  { from: 15, to: 18.5, label: "Kurus", bar: "bg-[#E0574F]" },
  { from: 18.5, to: 25, label: "Ideal", bar: "bg-ok" },
  { from: 25, to: 30, label: "Overweight", bar: "bg-[#E0574F]" },
  { from: 30, to: 40, label: "Obesitas", bar: "bg-danger" },
];

function categorize(bmi, en) {
  if (bmi < 18.5) {
    return {
      key: "kurus",
      label: en ? "Underweight" : "Kurus",
      tone: "text-[#E0574F]",
      border: "border-[#E0574F]/40",
      bg: "bg-[#E0574F]/10",
      msg: en
        ? "Under the healthy range. Add more nutritious meals."
        : "Masih di bawah rentang sehat. Tambah porsi makan bergizi.",
    };
  }
  if (bmi < 25) {
    return {
      key: "ideal",
      label: "Ideal",
      tone: "text-ok",
      border: "border-ok/40",
      bg: "bg-ok/10",
      msg: en
        ? "You're in the ideal range. Keep the routine going."
        : "Badan kamu di rentang ideal. Pertahankan polanya.",
    };
  }
  if (bmi < 30) {
    return {
      key: "overweight",
      label: "Overweight",
      tone: "text-[#E0574F]",
      border: "border-[#E0574F]/40",
      bg: "bg-[#E0574F]/10",
      msg: en
        ? "A bit above the range. Start with a short run now and then."
        : "Sedikit di atas rentang. Mulai jalan kaki atau lari rutin.",
    };
  }
  return {
    key: "obesitas",
    label: en ? "Obese" : "Obesitas",
    tone: "text-danger",
    border: "border-danger/40",
    bg: "bg-danger/10",
    msg: en
      ? "This is in the obese range — get moving and sort out your eating pattern!"
      : "Waduh udah masuk Obesitas, gas olahraga & atur pola makan!",
  };
}

function parseField(raw, en) {
  const cleaned = String(raw).replace(",", ".").trim();
  if (!cleaned) return { value: null, error: null };
  if (!/^\d*\.?\d*$/.test(cleaned))
    return { value: null, error: en ? "Numbers only, no letters or symbols." : "Isi angka aja ya, jangan huruf atau simbol." };
  const value = Number.parseFloat(cleaned);
  if (!Number.isFinite(value))
    return { value: null, error: en ? "That number doesn't parse, try again." : "Angkanya nggak kebaca nih, coba ulang." };
  if (value <= 0)
    return { value: null, error: en ? "It has to be greater than 0." : "Harus lebih dari 0 dong, masa iya segitu." };
  return { value, error: null };
}

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

export default function BmiCalc() {
  const { lang } = useLang();
  const en = lang === "en";
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [pulse, setPulse] = useState(0);

  const heightParsed = useMemo(() => parseField(height, en), [height, en]);
  const weightParsed = useMemo(() => parseField(weight, en), [weight, en]);

  const heightError =
    heightParsed.error ??
    (heightParsed.value !== null && heightParsed.value < 80
      ? en
        ? "That's baby height — double-check the number (cm)."
        : "Tinggi segitu kayak bayi bro, cek lagi ya (cm)."
      : heightParsed.value !== null && heightParsed.value > 250
        ? en
          ? "Over 2.5 meters? Check the unit, it should be cm."
          : "Lebih dari 2,5 meter? Cek satuannya, harus cm."
        : null);

  const weightError =
    weightParsed.error ??
    (weightParsed.value !== null && weightParsed.value < 20
      ? en
        ? "That weight is too low — check again (kg)."
        : "Berat segitu terlalu kecil, cek lagi ya (kg)."
      : weightParsed.value !== null && weightParsed.value > 350
        ? en
          ? "Over 350 kg? Make sure the unit is kg."
          : "Di atas 350 kg? Pastiin satuannya kg ya."
        : null);

  const ready = heightParsed.value !== null && weightParsed.value !== null && !heightError && !weightError;

  const result = useMemo(() => {
    if (!ready) return null;
    const m = heightParsed.value / 100;
    const bmi = weightParsed.value / (m * m);
    const rounded = Math.round(bmi * 10) / 10;
    return {
      bmi: rounded,
      category: categorize(rounded, en),
      healthyMin: Math.round(18.5 * m * m * 10) / 10,
      healthyMax: Math.round(24.9 * m * m * 10) / 10,
      position: clamp(((rounded - MIN_BMI) / (MAX_BMI - MIN_BMI)) * 100, 0, 100),
    };
  }, [ready, heightParsed.value, weightParsed.value, en]);

  const showHeightError = Boolean(heightError) && (height.length > 0 || submitted);
  const showWeightError = Boolean(weightError) && (weight.length > 0 || submitted);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    if (!ready) return;
    setPulse((n) => n + 1);
  };

  const reset = () => {
    setHeight("");
    setWeight("");
    setSubmitted(false);
    setPulse(0);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
      {/* ---------------- form ---------------- */}
      <form onSubmit={handleSubmit} className="panel corner-frame overflow-hidden">
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <div className="flex items-center gap-2">
            <HeartPulse className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          </div>
        </div>

        <div className="space-y-4 p-4">
          <div>
            <label htmlFor="bmi-height" className="mono-label mb-1.5 block">
              {en ? "height (cm)" : "tinggi badan (cm)"}
            </label>
            <div className="relative">
              <input
                id="bmi-height"
                name="height"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={en ? "e.g. 172" : "contoh: 172"}
                value={height}
                onChange={(event) => {
                  setHeight(event.target.value);
                  setSubmitted(false);
                }}
                aria-invalid={showHeightError}
                aria-describedby={showHeightError ? "bmi-height-error" : undefined}
                className={`w-full rounded-[6px] border bg-canvas px-3 py-3 pr-12 font-mono text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent/70 ${
                  showHeightError ? "border-danger/60" : "border-line-soft"
                }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] tracking-widest text-muted">
                CM
              </span>
            </div>
            {showHeightError ? (
              <p id="bmi-height-error" className="mt-1.5 text-[0.72rem] leading-snug text-danger">
                {heightError}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="bmi-weight" className="mono-label mb-1.5 block">
              {en ? "weight (kg)" : "berat badan (kg)"}
            </label>
            <div className="relative">
              <input
                id="bmi-weight"
                name="weight"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder={en ? "e.g. 64" : "contoh: 64"}
                value={weight}
                onChange={(event) => {
                  setWeight(event.target.value);
                  setSubmitted(false);
                }}
                aria-invalid={showWeightError}
                aria-describedby={showWeightError ? "bmi-weight-error" : undefined}
                className={`w-full rounded-[6px] border bg-canvas px-3 py-3 pr-12 font-mono text-base text-ink outline-none transition-colors placeholder:text-muted/60 focus:border-accent/70 ${
                  showWeightError ? "border-danger/60" : "border-line-soft"
                }`}
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 font-mono text-[0.65rem] tracking-widest text-muted">
                KG
              </span>
            </div>
            {showWeightError ? (
              <p id="bmi-weight-error" className="mt-1.5 text-[0.72rem] leading-snug text-danger">
                {weightError}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button type="submit" className="btn btn-primary flex-1 sm:flex-none">
              {en ? "Check Now" : "Cek Sekarang"}
            </button>
            <button type="button" onClick={reset} className="btn btn-ghost">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              Reset
            </button>
          </div>

          <p className="font-mono text-[0.68rem] leading-relaxed text-muted">
            {en
              ? "BMR? Not yet. This is BMI only — a rough estimate, not a substitute for a doctor's advice."
              : "BMR? belum. Ini BMI doang — hitungan kasar, bukan pengganti saran dokter."}
          </p>
        </div>
      </form>

      {/* ---------------- result ---------------- */}
      <div className="panel overflow-hidden" aria-live="polite">
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <span className="mono-label">{en ? "analysis result" : "hasil analisa"}</span>
          <span className={`pill ${result ? "pill-accent" : ""}`}>
            {result ? (submitted ? "checked" : "live") : "standby"}
          </span>
        </div>

        <div className="p-4">
          {result ? (
            <div key={pulse}>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <p className="mono-label">{en ? "your bmi" : "bmi kamu"}</p>
                  <p className={`mt-1 font-mono text-[clamp(2.4rem,9vw,3.4rem)] font-bold leading-none tabular-nums ${result.category.tone} glow-text`}>
                    {result.bmi.toFixed(1)}
                  </p>
                </div>
                <span
                  className={`rounded-[6px] border px-3 py-1 font-mono text-[0.65rem] uppercase tracking-widest ${result.category.border} ${result.category.bg} ${result.category.tone}`}
                >
                  {result.category.label}
                </span>
              </div>

              <p className="mt-3 text-[0.85rem] leading-relaxed text-ink">{result.category.msg}</p>

              {/* bar */}
              <div className="mt-5">
                <div
                  className="relative h-3 w-full overflow-visible rounded-[6px]"
                  role="img"
                  aria-label={en ? `BMI ${result.bmi.toFixed(1)}, category ${result.category.label}` : `BMI ${result.bmi.toFixed(1)}, kategori ${result.category.label}`}
                >
                  <div className="flex h-3 w-full overflow-hidden rounded-[6px] border border-line-soft">
                    {BANDS.map((band) => (
                      <span
                        key={band.label}
                        className={`${band.bar} h-full`}
                        style={{ width: `${((band.to - band.from) / (MAX_BMI - MIN_BMI)) * 100}%`, opacity: 0.85 }}
                      />
                    ))}
                  </div>
                  <span
                    className="absolute top-1/2 z-10 h-5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink ring-2 ring-canvas"
                    style={{ left: `${result.position}%` }}
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-2 flex justify-between font-mono text-[0.6rem] tracking-wider text-muted">
                  <span>15</span>
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>

              <div className="mt-5 rounded-[6px] border border-line-soft bg-surface-2 p-3">
                <p className="mono-label">{en ? `healthy weight range for ${heightParsed.value} cm` : `range berat sehat buat tinggi ${heightParsed.value} cm`}</p>
                <p className="mt-1.5 font-mono text-[0.95rem] text-ink">
                  {result.healthyMin.toFixed(1)} kg <span className="text-muted">—</span>{" "}
                  {result.healthyMax.toFixed(1)} kg
                </p>
                <p className="mt-1 text-[0.72rem] leading-relaxed text-muted">
                  {en
                    ? "Based on a BMI of 18.5–24.9. If your scale is outside this range, start slowly — no need to go extreme."
                    : "Patokan BMI 18.5–24.9. Kalau timbangan kamu di luar range ini, mulai pelan-pelan aja — nggak perlu ekstrem."}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[220px] flex-col items-center justify-center text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-[6px] border border-line bg-accent/5">
                <HeartPulse className="h-5 w-5 text-accent" aria-hidden="true" />
              </div>
              <p className="font-mono text-[0.78rem] text-ink">{en ? "waiting for data..." : "menunggu data..."}</p>
              <p className="mt-2 max-w-[26ch] text-[0.75rem] leading-relaxed text-muted">
                {en
                  ? 'Enter your height & weight and the result appears instantly. Hit "Check Now" to confirm.'
                  : 'Isi tinggi & berat badan, hasilnya langsung muncul. Tekan "Cek Sekarang" buat konfirmasi.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
