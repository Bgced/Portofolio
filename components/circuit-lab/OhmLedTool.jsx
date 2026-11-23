"use client";

import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/components/providers";
import { solveOhm, solveLed } from "@/lib/circuit/ohm";
import { formatOhms, formatSI } from "@/lib/circuit/format";
import FloatingCard from "@/components/ui/FloatingCard";

const COPY = {
  en: {
    title: "Ohm's Law + LED Resistor",
    modeOhm: "Ohm's Law",
    modeLed: "LED Resistor",
    voltage: "Voltage (V)",
    current: "Current (A)",
    resistance: "Resistance (Ω)",
    power: "Power (W)",
    supplyV: "Supply (Vs)",
    ledV: "LED forward (Vf)",
    ledI: "LED current (mA)",
    ledType: "LED type",
    resultR: "Required R",
    resultRe24: "E24 standard",
    resultPower: "Resistor power",
    copy: "Salin hasil",
    copied: "Tersalin",
    errorVs: "Vs harus lebih besar dari Vf",
    selectTwo: "Isi dua dari V/I/R",
  },
  id: {
    title: "Hukum Ohm + Resistor LED",
    modeOhm: "Hukum Ohm",
    modeLed: "Resistor LED",
    voltage: " Tegangan (V)",
    current: "Arus (A)",
    resistance: "Resistansi (Ω)",
    power: "Daya (W)",
    supplyV: "Suplai (Vs)",
    ledV: "LED forward (Vf)",
    ledI: "Arus LED (mA)",
    ledType: "Tipe LED",
    resultR: "R dibutuhkan",
    resultRe24: "Standar E24",
    resultPower: "Daya resistor",
    copy: "Salin hasil",
    copied: "Tersalin",
    errorVs: "Vs harus lebih besar dari Vf",
    selectTwo: "Isi dua dari V/I/R",
  },
};

const LED_PRESETS = {
  red: { label: "Red", vf: 2.0 },
  green: { label: "Green", vf: 2.1 },
  blue: { label: "Blue", vf: 3.0 },
  white: { label: "White", vf: 3.2 },
};

function parseNum(str) {
  const cleaned = String(str).trim().replace(',', '.');
  if (!cleaned) return null;
  const val = parseFloat(cleaned);
  return Number.isFinite(val) ? val : null;
}

export default function OhmLedTool() {
  const { lang } = useLang();
  const t = COPY[lang];

  const [mode, setMode] = useState("led"); // 'ohm' | 'led'
  const [V, setV] = useState("");
  const [I, setI] = useState("");
  const [R, setR] = useState("");
  const [Vs, setVs] = useState("9");
  const [ledType, setLedType] = useState("red");
  const [If_mA, setIf_mA] = useState("10");
  const [copied, setCopied] = useState(false);

  // Load from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get("ol_mode");
      if (modeParam === "ohm" || modeParam === "led") setMode(modeParam);

      if (modeParam === "ohm") {
        const v = params.get("ol_v");
        const i = params.get("ol_i");
        const r = params.get("ol_r");
        if (v) setV(v);
        if (i) setI(i);
        if (r) setR(r);
      } else {
        const vs = params.get("ol_vs");
        const lt = params.get("ol_lt");
        const ifma = params.get("ol_if");
        if (vs) setVs(vs);
        if (lt && LED_PRESETS[lt]) setLedType(lt);
        if (ifma) setIf_mA(ifma);
      }
    } catch {
      // ignore
    }
  }, []);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("ol_mode", mode);

    if (mode === "ohm") {
      if (V) params.set("ol_v", V);
      else params.delete("ol_v");
      if (I) params.set("ol_i", I);
      else params.delete("ol_i");
      if (R) params.set("ol_r", R);
      else params.delete("ol_r");
      params.delete("ol_vs");
      params.delete("ol_lt");
      params.delete("ol_if");
    } else {
      if (Vs) params.set("ol_vs", Vs);
      else params.delete("ol_vs");
      params.set("ol_lt", ledType);
      if (If_mA) params.set("ol_if", If_mA);
      else params.delete("ol_if");
      params.delete("ol_v");
      params.delete("ol_i");
      params.delete("ol_r");
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [mode, V, I, R, Vs, ledType, If_mA]);

  const ohmResult = useMemo(() => {
    if (mode !== "ohm") return null;
    const v = parseNum(V);
    const i = parseNum(I);
    const r = parseNum(R);

    const provided = [v, i, r].filter(x => x !== null && x > 0);
    if (provided.length !== 2) return null;

    try {
      const result = solveOhm({ V: v ?? undefined, I: i ?? undefined, R: r ?? undefined });
      return result;
    } catch {
      return null;
    }
  }, [mode, V, I, R]);

  const ledResult = useMemo(() => {
    if (mode !== "led") return null;
    const vs = parseNum(Vs);
    const vf = LED_PRESETS[ledType].vf;
    const ifma = parseNum(If_mA);

    if (vs === null || vs <= 0 || ifma === null || ifma <= 0) return null;

    return solveLed({ Vs: vs, Vf: vf, If_mA: ifma });
  }, [mode, Vs, ledType, If_mA]);

  const handleCopy = async () => {
    let text = "";
    if (mode === "ohm" && ohmResult) {
      text = `V=${ohmResult.V.toFixed(2)}V I=${(ohmResult.I * 1000).toFixed(2)}mA R=${formatOhms(ohmResult.R)} P=${ohmResult.P.toFixed(3)}W`;
    } else if (mode === "led" && ledResult?.valid) {
      text = `R=${formatOhms(ledResult.R_e24)} P=${ledResult.P_R_W.toFixed(2)}W`;
    }
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const currentOpacity = useMemo(() => {
    if (mode === "led" && ledResult?.valid) {
      const mA = parseNum(If_mA) || 10;
      return Math.min(0.9, 0.3 + mA / 50);
    }
    return 0.5;
  }, [mode, ledResult, If_mA]);

  // LED schematic: battery -> resistor -> LED, updates with current
  const Schematic = () => (
    <svg viewBox="0 0 360 120" className="mb-4 w-full" role="img" aria-label="LED circuit schematic">
      {/* wires */}
      <g stroke="#9AA0A6" strokeWidth="2" fill="none" strokeLinecap="round">
        <path d="M20 60 H90" />
        <path d="M150 60 H210" />
        <path d="M270 60 H340 V30 H20 V60" opacity="0" />
      </g>
      {/* battery (Vs) */}
      <g stroke="#9AA0A6" strokeWidth="2">
        <line x1="55" y1="40" x2="55" y2="80" />
        <line x1="68" y1="48" x2="68" y2="72" />
        <line x1="20" y1="60" x2="55" y2="60" />
        <line x1="68" y1="60" x2="90" y2="60" />
      </g>
      {/* resistor */}
      <rect x="90" y="52" width="60" height="16" fill="none" stroke="#9AA0A6" strokeWidth="2" rx="2" />
      {/* LED triangle + bar */}
      <g>
        <polygon points="210,44 210,76 246,60" fill="#38BDF8" opacity={currentOpacity} />
        <line x1="246" y1="44" x2="246" y2="76" stroke="#38BDF8" strokeWidth="2" opacity={currentOpacity} />
        <line x1="246" y1="60" x2="290" y2="60" stroke="#9AA0A6" strokeWidth="2" />
        <line x1="290" y1="60" x2="290" y2="92" stroke="#9AA0A6" strokeWidth="2" />
        <line x1="290" y1="92" x2="38" y2="92" stroke="#9AA0A6" strokeWidth="2" />
        <line x1="38" y1="92" x2="38" y2="62" stroke="#9AA0A6" strokeWidth="2" />
      </g>
      <text x="55" y="30" textAnchor="middle" fontSize="11" fill="#9AA0A6" fontFamily="monospace">Vs</text>
      <text x="120" y="46" textAnchor="middle" fontSize="11" fill="#9AA0A6" fontFamily="monospace">R</text>
    </svg>
  );

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <FloatingCard surfaceClassName="card-surface--flush">
        <div className="border-b border-line-soft px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="mono-label">{t.title}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setMode("ohm")}
                className={`rounded-[3px] px-2 py-1 font-mono text-[0.7rem] transition-colors ${
                  mode === "ohm" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
                }`}
                aria-pressed={mode === "ohm"}
              >
                {t.modeOhm}
              </button>
              <button
                type="button"
                onClick={() => setMode("led")}
                className={`rounded-[3px] px-2 py-1 font-mono text-[0.7rem] transition-colors ${
                  mode === "led" ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
                }`}
                aria-pressed={mode === "led"}
              >
                {t.modeLed}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {mode === "ohm" && (
            <>
              <p className="font-mono text-[0.75rem] text-muted">{t.selectTwo}</p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="ol-v" className="mono-label mb-1.5 block">
                    {t.voltage}
                  </label>
                  <input
                    id="ol-v"
                    type="text"
                    inputMode="decimal"
                    value={V}
                    onChange={e => setV(e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none placeholder:text-muted/50 focus:border-accent/70"
                  />
                </div>
                <div>
                  <label htmlFor="ol-i" className="mono-label mb-1.5 block">
                    {t.current}
                  </label>
                  <input
                    id="ol-i"
                    type="text"
                    inputMode="decimal"
                    value={I}
                    onChange={e => setI(e.target.value)}
                    placeholder={lang === "en" ? "e.g. 0.001" : "contoh: 0,001"}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none placeholder:text-muted/50 focus:border-accent/70"
                  />
                </div>
                <div>
                  <label htmlFor="ol-r" className="mono-label mb-1.5 block">
                    {t.resistance}
                  </label>
                  <input
                    id="ol-r"
                    type="text"
                    inputMode="decimal"
                    value={R}
                    onChange={e => setR(e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none placeholder:text-muted/50 focus:border-accent/70"
                  />
                </div>
              </div>
            </>
          )}

          {mode === "led" && (
            <>
              <div>
                <label htmlFor="ol-vs" className="mono-label mb-1.5 block">
                  {t.supplyV}
                </label>
                <input
                  id="ol-vs"
                  type="text"
                  inputMode="decimal"
                  value={Vs}
                  onChange={e => setVs(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none placeholder:text-muted/50 focus:border-accent/70"
                />
              </div>

              <div>
                <label htmlFor="ol-lt" className="mono-label mb-1.5 block">
                  {t.ledType}
                </label>
                <select
                  id="ol-lt"
                  value={ledType}
                  onChange={e => setLedType(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none focus:border-accent/70"
                >
                  {Object.entries(LED_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.label} (Vf tipikal: {preset.vf}V)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="ol-if" className="mono-label mb-1.5 block">
                  {t.ledI}
                </label>
                <input
                  id="ol-if"
                  type="text"
                  inputMode="decimal"
                  value={If_mA}
                  onChange={e => setIf_mA(e.target.value)}
                  className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.9rem] text-ink outline-none placeholder:text-muted/50 focus:border-accent/70"
                />
              </div>
            </>
          )}
        </div>
      </FloatingCard>

      <FloatingCard surfaceClassName="card-surface--flush" aria-live="polite">
        <div className="border-b border-line-soft px-4 py-2.5">
          <span className="mono-label">{lang === "en" ? "Result" : "Hasil"}</span>
        </div>

        <div className="p-4">
          {mode === "ohm" && ohmResult && (
            <div className="space-y-3">
              <div>
                <p className="mono-label">{t.voltage}</p>
                <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                  {ohmResult.V.toFixed(2)} V
                </p>
              </div>
              <div>
                <p className="mono-label">{t.current}</p>
                <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                  {(ohmResult.I * 1000).toFixed(2)} mA
                </p>
              </div>
              <div>
                <p className="mono-label">{t.resistance}</p>
                <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                  {formatOhms(ohmResult.R)}
                </p>
              </div>
              <div>
                <p className="mono-label">{t.power}</p>
                <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                  {ohmResult.P.toFixed(3)} W
                </p>
              </div>

              <button type="button" onClick={handleCopy} className="btn btn-ghost w-full">
                {copied ? t.copied : t.copy}
              </button>
            </div>
          )}

          {mode === "led" && ledResult && (
            <div>
              {ledResult.valid ? (
                <div className="space-y-3">
                  <Schematic />
                  <div>
                    <p className="mono-label">{t.resultR}</p>
                    <p className="mt-1 font-mono text-[1.5rem] font-bold text-ink">
                      {formatOhms(ledResult.R)}
                    </p>
                  </div>
                  <div>
                    <p className="mono-label">{t.resultRe24}</p>
                    <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                      {formatOhms(ledResult.R_e24)}
                    </p>
                  </div>
                  <div>
                    <p className="mono-label">{t.resultPower}</p>
                    <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
                      {ledResult.P_R_W.toFixed(3)} W
                    </p>
                  </div>

                  <button type="button" onClick={handleCopy} className="btn btn-ghost w-full">
                    {copied ? t.copied : t.copy}
                  </button>
                </div>
              ) : (
                <div className="rounded-[5px] border border-[#B5DA8E]/30 bg-[#B5DA8E]/10 p-3">
                  <p className="text-[0.78rem] text-[#B5DA8E]">{t.errorVs}</p>
                </div>
              )}
            </div>
          )}

          {!ohmResult && mode === "ohm" && (
            <p className="py-8 text-center font-mono text-[0.78rem] text-muted">
              {t.selectTwo}
            </p>
          )}

          {!ledResult && mode === "led" && (
            <p className="py-8 text-center font-mono text-[0.78rem] text-muted">
              {lang === "en" ? "Enter supply voltage and current" : "Isi tegangan suplai dan arus"}
            </p>
          )}
        </div>
      </FloatingCard>
    </div>
  );
}