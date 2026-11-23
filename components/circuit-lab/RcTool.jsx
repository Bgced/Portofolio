"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useLang } from "@/components/providers";
import { rcTau, rcCharge, rcDischarge } from "@/lib/circuit/rc";
import { formatSI } from "@/lib/circuit/format";
import FloatingCard from "@/components/ui/FloatingCard";

const COPY = {
  en: {
    title: "RC Charge / Discharge",
    resistance: "Resistance (R)",
    capacitance: "Capacitance (C)",
    mode: "Mode",
    charge: "Charge",
    discharge: "Discharge",
    tau: "Time constant (τ)",
    time: "Time (t)",
    voltage: "Voltage",
    copy: "Salin hasil",
    copied: "Tersalin",
    formulaCharge: "v(t) = V0(1 - e^(-t/RC))",
    formulaDischarge: "v(t) = V0 × e^(-t/RC)",
    dragCursor: "Drag the cursor on the graph",
  },
  id: {
    title: "RC Isi / Kosong",
    resistance: "Resistansi (R)",
    capacitance: "Kapasitansi (C)",
    mode: "Mode",
    charge: "Isi",
    discharge: "Kosong",
    tau: "Konstanta waktu (τ)",
    time: "Waktu (t)",
    voltage: "Tegangan",
    copy: "Salin hasil",
    copied: "Tersalin",
    formulaCharge: "v(t) = V0(1 - e^(-t/RC))",
    formulaDischarge: "v(t) = V0 × e^(-t/RC)",
    dragCursor: "Geser kursor di grafik",
  },
};

// Log scale helper: convert 0-1000 slider to R or C value
function logScale(sliderVal, minExp, maxExp) {
  const min = Math.pow(10, minExp);
  const max = Math.pow(10, maxExp);
  const logMin = Math.log10(min);
  const logMax = Math.log10(max);
  const logVal = logMin + (sliderVal / 1000) * (logMax - logMin);
  return Math.pow(10, logVal);
}

function inverseLogScale(val, minExp, maxExp) {
  const logMin = minExp;
  const logMax = maxExp;
  const logVal = Math.log10(val);
  return ((logVal - logMin) / (logMax - logMin)) * 1000;
}

export default function RcTool() {
  const { lang } = useLang();
  const t = COPY[lang];

  const [rSlider, setRSlider] = useState(500); // 1kΩ middle on log scale
  const [cSlider, setCSlider] = useState(500); // 1µF middle
  const [mode, setMode] = useState("charge");
  const [cursorT, setCursorT] = useState(0.5); // 0-1 normalized position
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);

  // R: 1Ω to 1MΩ
  // C: 1pF to 1mF
  const R = useMemo(() => logScale(rSlider, 0, 6), [rSlider]);
  const C = useMemo(() => logScale(cSlider, -12, -3), [cSlider]);
  const tau = useMemo(() => rcTau(R, C), [R, C]);

  // Load from URL
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const r = params.get("rc_r");
      const c = params.get("rc_c");
      const m = params.get("rc_mode");
      if (r) setRSlider(parseFloat(r));
      if (c) setCSlider(parseFloat(c));
      if (m === "charge" || m === "discharge") setMode(m);
    } catch {
      // ignore
    }
  }, []);

  // Sync URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("rc_r", rSlider.toFixed(0));
    params.set("rc_c", cSlider.toFixed(0));
    params.set("rc_mode", mode);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [rSlider, cSlider, mode]);

  const timeAtCursor = useMemo(() => cursorT * 6 * tau, [cursorT, tau]); // 0 to 6τ

  const voltageAtCursor = useMemo(() => {
    if (mode === "charge") {
      return rcCharge(10, R, C, timeAtCursor);
    } else {
      return rcDischarge(10, R, C, timeAtCursor);
    }
  }, [mode, R, C, timeAtCursor]);

  const handleCopy = async () => {
    const text = `τ=${formatSI(tau, "s")} V(t=${formatSI(timeAtCursor, "s")})=${voltageAtCursor.toFixed(2)}V`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  // Generate graph path
  const graphData = useMemo(() => {
    const points = 100;
    const data = [];
    for (let i = 0; i <= points; i++) {
      const tNorm = i / points;
      const tSec = tNorm * 6 * tau;
      const v = mode === "charge"
        ? rcCharge(10, R, C, tSec)
        : rcDischarge(10, R, C, tSec);
      data.push({ x: 60 + tNorm * 280, y: 180 - (v / 10) * 160 });
    }
    return data;
  }, [mode, R, C, tau]);

  const pathD = useMemo(() => {
    if (!graphData.length) return "";
    let d = `M ${graphData[0].x} ${graphData[0].y}`;
    for (let i = 1; i < graphData.length; i++) {
      d += ` L ${graphData[i].x} ${graphData[i].y}`;
    }
    return d;
  }, [graphData]);

  const cursorX = 60 + cursorT * 280;
  const cursorY = 180 - (voltageAtCursor / 10) * 160;

  // Markers at τ and 5τ
  const tauX = 60 + (1 / 6) * 280;
  const tau5X = 60 + (5 / 6) * 280;
  const tauVoltage = mode === "charge" ? 10 * 0.632 : 10 * 0.368;
  const tau5Voltage = mode === "charge" ? 10 * 0.993 : 10 * 0.007;
  const tauY = 180 - (tauVoltage / 10) * 160;
  const tau5Y = 180 - (tau5Voltage / 10) * 160;

  // Pointer events for dragging
  const handlePointerDown = (e) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 360;
    const newCursorT = Math.max(0, Math.min(1, (x - 60) / 280));
    setCursorT(newCursorT);
  };

  const handlePointerMove = (e) => {
    if (e.buttons !== 1) return;
    handlePointerDown(e);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCursorT(prev => Math.max(0, prev - 0.02));
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCursorT(prev => Math.min(1, prev + 0.02));
    }
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <FloatingCard surfaceClassName="card-surface--flush">
        <div className="border-b border-line-soft px-4 py-2.5">
          <span className="mono-label">{t.title}</span>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="mono-label mb-2 block">{t.mode}</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setMode("charge")}
                className={`flex-1 rounded-[5px] border px-3 py-2 text-[0.78rem] transition-colors ${
                  mode === "charge"
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                {t.charge}
              </button>
              <button
                type="button"
                onClick={() => setMode("discharge")}
                className={`flex-1 rounded-[5px] border px-3 py-2 text-[0.78rem] transition-colors ${
                  mode === "discharge"
                    ? "border-accent bg-accent/10 text-ink"
                    : "border-line bg-surface text-muted hover:text-ink"
                }`}
              >
                {t.discharge}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="rc-r" className="mono-label mb-1.5 flex items-center justify-between">
              <span>{t.resistance}</span>
              <span className="font-mono text-[0.75rem]">{formatSI(R, "Ω")}</span>
            </label>
            <input
              id="rc-r"
              type="range"
              min="0"
              max="1000"
              value={rSlider}
              onChange={e => setRSlider(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="rc-c" className="mono-label mb-1.5 flex items-center justify-between">
              <span>{t.capacitance}</span>
              <span className="font-mono text-[0.75rem]">{formatSI(C, "F")}</span>
            </label>
            <input
              id="rc-c"
              type="range"
              min="0"
              max="1000"
              value={cSlider}
              onChange={e => setCSlider(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="rounded-[5px] border border-line bg-surface-2 p-3">
            <p className="mono-label">{t.tau}</p>
            <p className="mt-1 font-mono text-[1.3rem] font-bold text-ink">
              {formatSI(tau, "s")}
            </p>
          </div>

          <div className="rounded-[5px] border border-line bg-surface-2 p-3">
            <p className="mono-label">{lang === "en" ? "Formula" : "Formula"}</p>
            <p className="mt-1 font-mono text-[0.85rem] text-ink">
              {mode === "charge" ? t.formulaCharge : t.formulaDischarge}
            </p>
          </div>
        </div>
      </FloatingCard>

      <FloatingCard surfaceClassName="card-surface--flush" aria-live="polite">
        <div className="border-b border-line-soft px-4 py-2.5">
          <span className="mono-label">{lang === "en" ? "Graph" : "Grafik"}</span>
        </div>

        <div className="p-4">
          <svg
            ref={svgRef}
            viewBox="0 0 360 200"
            className="mb-4 w-full cursor-crosshair select-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            tabIndex={0}
            onKeyDown={handleKeyDown}
            role="img"
            aria-label={`RC ${mode} curve, τ=${formatSI(tau, "s")}`}
          >
            {/* axes */}
            <line x1="60" y1="180" x2="340" y2="180" stroke="#2A2E35" strokeWidth="2" />
            <line x1="60" y1="20" x2="60" y2="180" stroke="#2A2E35" strokeWidth="2" />
            <text x="350" y="185" fontSize="10" fill="#9AA0A6" fontFamily="monospace">t</text>
            <text x="50" y="15" fontSize="10" fill="#9AA0A6" fontFamily="monospace">V</text>

            {/* curve */}
            <path d={pathD} fill="none" stroke="#F5A524" strokeWidth="2.5" />

            {/* tau marker */}
            <circle cx={tauX} cy={tauY} r="4" fill="#38BDF8" />
            <text x={tauX + 5} y={tauY - 5} fontSize="9" fill="#38BDF8" fontFamily="monospace">
              τ
            </text>

            {/* 5tau marker */}
            <circle cx={tau5X} cy={tau5Y} r="4" fill="#38BDF8" />
            <text x={tau5X + 5} y={tau5Y - 5} fontSize="9" fill="#38BDF8" fontFamily="monospace">
              5τ
            </text>

            {/* draggable cursor */}
            <line x1={cursorX} y1="20" x2={cursorX} y2="180" stroke="#9AA0A6" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx={cursorX} cy={cursorY} r="6" fill="#F5A524" stroke="#14100A" strokeWidth="2" />
          </svg>

          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="mono-label">{t.time}</p>
                <p className="mt-1 font-mono text-[1.1rem] font-bold text-ink">
                  {formatSI(timeAtCursor, "s")}
                </p>
              </div>
              <div>
                <p className="mono-label">{t.voltage}</p>
                <p className="mt-1 font-mono text-[1.1rem] font-bold text-ink">
                  {voltageAtCursor.toFixed(2)} V
                </p>
              </div>
            </div>

            <p className="font-mono text-[0.72rem] text-muted">{t.dragCursor}</p>

            <button type="button" onClick={handleCopy} className="btn btn-ghost w-full">
              {copied ? t.copied : t.copy}
            </button>
          </div>
        </div>
      </FloatingCard>
    </div>
  );
}