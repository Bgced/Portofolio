"use client";

import { useState, useMemo, useEffect } from "react";
import { useLang } from "@/components/providers";
import { resistorToOhms, ohmsToResistor, getTolerance, getColorHex, DIGIT_COLORS, MULTIPLIER_COLORS, TOLERANCE_COLORS } from "@/lib/circuit/resistor";
import { formatOhms } from "@/lib/circuit/format";
import FloatingCard from "@/components/ui/FloatingCard";

const COPY = {
  en: {
    title: "Resistor Color Code",
    subtitle: "Pick bands or type resistance",
    bands4: "4-band",
    bands5: "5-band",
    digit1: "Digit 1",
    digit2: "Digit 2",
    digit3: "Digit 3",
    multiplier: "Multiplier",
    tolerance: "Tolerance",
    result: "Resistance",
    reverseMode: "Reverse: type resistance",
    placeholder: "e.g. 4700 or 4.7k",
    copy: "Salin hasil",
    copied: "Tersalin",
    invalidNumber: "Masukin angka yang valid",
  },
  id: {
    title: "Kode Warna Resistor",
    subtitle: "Pilih band atau ketik resistansi",
    bands4: "4-band",
    bands5: "5-band",
    digit1: "Digit 1",
    digit2: "Digit 2",
    digit3: "Digit 3",
    multiplier: "Pengali",
    tolerance: "Toleransi",
    result: "Resistansi",
    reverseMode: "Kebalik: ketik resistansi",
    placeholder: "contoh: 4700 atau 4,7k",
    copy: "Salin hasil",
    copied: "Tersalin",
    invalidNumber: "Masukin angka yang valid",
  },
};

function parseResistance(str) {
  const cleaned = String(str).trim().toLowerCase().replace(',', '.');
  if (!cleaned) return null;
  
  // Handle k, M suffixes
  const match = cleaned.match(/^([\d.]+)\s*([km])?$/);
  if (!match) return null;
  
  const val = parseFloat(match[1]);
  if (!Number.isFinite(val)) return null;
  
  const suffix = match[2];
  if (suffix === 'k') return val * 1000;
  if (suffix === 'm') return val * 1e6;
  return val;
}

function ColorButton({ color, selected, onClick }) {
  const hex = getColorHex(color);
  const isLight = ['yellow', 'white', 'silver', 'gold'].includes(color);
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative flex items-center gap-2 rounded-[5px] border px-3 py-2 text-left text-[0.78rem] transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        selected
          ? 'border-accent bg-accent/10 text-ink'
          : 'border-line bg-surface hover:border-line/80 hover:bg-surface-2'
      }`}
      aria-pressed={selected}
    >
      <span
        className="inline-block h-4 w-4 flex-none rounded-[2px] border border-line/50"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <span className="font-mono capitalize">{color}</span>
    </button>
  );
}

export default function ResistorTool() {
  const { lang } = useLang();
  const t = COPY[lang];
  
  const [bandCount, setBandCount] = useState(4);
  const [digits, setDigits] = useState(['yellow', 'violet']);
  const [thirdDigit, setThirdDigit] = useState('black');
  const [mult, setMult] = useState('red');
  const [tol, setTol] = useState('gold');
  const [mode, setMode] = useState('forward'); // 'forward' | 'reverse'
  const [inputValue, setInputValue] = useState('');
  const [copied, setCopied] = useState(false);

  // Load from URL on mount
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const bands = params.get('rc_bands');
      if (bands) {
        const arr = bands.split(',');
        if (arr.length === 4) {
          setBandCount(4);
          setDigits([arr[0], arr[1]]);
          setMult(arr[2]);
          setTol(arr[3]);
        } else if (arr.length === 5) {
          setBandCount(5);
          setDigits([arr[0], arr[1]]);
          setThirdDigit(arr[2]);
          setMult(arr[3]);
          setTol(arr[4]);
        }
      }
      const rev = params.get('rc_rev');
      if (rev) {
        setMode('reverse');
        setInputValue(rev);
      }
    } catch {
      // ignore malformed URL
    }
  }, []);

  // Sync URL on change
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    
    if (mode === 'forward') {
      const bands = bandCount === 4
        ? [...digits, mult, tol].join(',')
        : [...digits, thirdDigit, mult, tol].join(',');
      params.set('rc_bands', bands);
      params.delete('rc_rev');
    } else {
      if (inputValue.trim()) {
        params.set('rc_rev', inputValue.trim());
      } else {
        params.delete('rc_rev');
      }
      params.delete('rc_bands');
    }
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [bandCount, digits, thirdDigit, mult, tol, mode, inputValue]);

  const result = useMemo(() => {
    if (mode === 'forward') {
      const bands = bandCount === 4
        ? [...digits, mult, tol]
        : [...digits, thirdDigit, mult, tol];
      try {
        const ohms = resistorToOhms(bands);
        const tolerance = getTolerance(tol);
        return {
          ohms,
          formatted: formatOhms(ohms),
          tolerance: `${(tolerance * 100).toFixed(tolerance < 0.01 ? 2 : 0)}%`,
          display: `${formatOhms(ohms)} ±${(tolerance * 100).toFixed(tolerance < 0.01 ? 2 : 0)}%`,
          bands
        };
      } catch {
        return null;
      }
    } else {
      const ohms = parseResistance(inputValue);
      if (ohms === null || ohms <= 0) return null;
      
      try {
        const bands = ohmsToResistor(ohms, bandCount);
        const tolerance = getTolerance(bands[bands.length - 1]);
        return {
          ohms,
          formatted: formatOhms(ohms),
          tolerance: `${(tolerance * 100).toFixed(tolerance < 0.01 ? 2 : 0)}%`,
          display: `${formatOhms(ohms)} ±${(tolerance * 100).toFixed(tolerance < 0.01 ? 2 : 0)}%`,
          bands
        };
      } catch {
        return null;
      }
    }
  }, [mode, bandCount, digits, thirdDigit, mult, tol, inputValue]);

  const handleCopy = async () => {
    if (!result) return;
    try {
      await navigator.clipboard.writeText(result.display);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const setDigit = (idx, color) => {
    setDigits(prev => {
      const next = [...prev];
      next[idx] = color;
      return next;
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
      <FloatingCard surfaceClassName="card-surface--flush">
        <div className="border-b border-line-soft px-4 py-2.5">
          <div className="flex items-center justify-between">
            <span className="mono-label">{t.title}</span>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setBandCount(4)}
                className={`rounded-[3px] px-2 py-1 font-mono text-[0.7rem] transition-colors ${
                  bandCount === 4 ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                }`}
                aria-pressed={bandCount === 4}
              >
                {t.bands4}
              </button>
              <button
                type="button"
                onClick={() => setBandCount(5)}
                className={`rounded-[3px] px-2 py-1 font-mono text-[0.7rem] transition-colors ${
                  bandCount === 5 ? 'bg-accent text-accent-ink' : 'text-muted hover:text-ink'
                }`}
                aria-pressed={bandCount === 5}
              >
                {t.bands5}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Mode toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('forward')}
              className={`flex-1 rounded-[5px] border px-3 py-2 text-[0.78rem] transition-colors ${
                mode === 'forward'
                  ? 'border-accent bg-accent/10 text-ink'
                  : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              {lang === 'en' ? 'Color → Value' : 'Warna → Nilai'}
            </button>
            <button
              type="button"
              onClick={() => setMode('reverse')}
              className={`flex-1 rounded-[5px] border px-3 py-2 text-[0.78rem] transition-colors ${
                mode === 'reverse'
                  ? 'border-accent bg-accent/10 text-ink'
                  : 'border-line bg-surface text-muted hover:text-ink'
              }`}
            >
              {t.reverseMode}
            </button>
          </div>

          {mode === 'reverse' && (
            <div>
              <label htmlFor="rc-input" className="mono-label mb-1.5 block">
                {lang === 'en' ? 'Resistance value' : 'Nilai resistansi'}
              </label>
              <input
                id="rc-input"
                type="text"
                inputMode="decimal"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                placeholder={t.placeholder}
                className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2.5 font-mono text-[0.9rem] text-ink outline-none transition-colors placeholder:text-muted/50 focus:border-accent/70"
              />
            </div>
          )}

          {mode === 'forward' && (
            <>
              {/* Digit 1 & 2 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label mb-1.5 block">{t.digit1}</label>
                  <select
                    value={digits[0]}
                    onChange={e => setDigit(0, e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.85rem] text-ink outline-none focus:border-accent/70"
                  >
                    {DIGIT_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mono-label mb-1.5 block">{t.digit2}</label>
                  <select
                    value={digits[1]}
                    onChange={e => setDigit(1, e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.85rem] text-ink outline-none focus:border-accent/70"
                  >
                    {DIGIT_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Third digit for 5-band */}
              {bandCount === 5 && (
                <div>
                  <label className="mono-label mb-1.5 block">{t.digit3}</label>
                  <select
                    value={thirdDigit}
                    onChange={e => setThirdDigit(e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.85rem] text-ink outline-none focus:border-accent/70"
                  >
                    {DIGIT_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Multiplier & Tolerance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mono-label mb-1.5 block">{t.multiplier}</label>
                  <select
                    value={mult}
                    onChange={e => setMult(e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.85rem] text-ink outline-none focus:border-accent/70"
                  >
                    {MULTIPLIER_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mono-label mb-1.5 block">{t.tolerance}</label>
                  <select
                    value={tol}
                    onChange={e => setTol(e.target.value)}
                    className="w-full rounded-[5px] border border-line bg-canvas px-3 py-2 font-mono text-[0.85rem] text-ink outline-none focus:border-accent/70"
                  >
                    {TOLERANCE_COLORS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>
      </FloatingCard>

      <FloatingCard surfaceClassName="card-surface--flush" aria-live="polite">
        <div className="border-b border-line-soft px-4 py-2.5">
          <span className="mono-label">{t.result}</span>
        </div>

        <div className="p-4">
          {result ? (
            <div>
              {/* Resistor 3D — silinder berbayang, semua band termasuk toleransi */}
              <svg
                viewBox="0 0 400 150"
                className="mb-4 w-full"
                role="img"
                aria-label={`${result.formatted} ${result.tolerance}`}
              >
                <defs>
                  <linearGradient id="rb" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#EBD27E" />
                    <stop offset="1" stopColor="#C9A94A" />
                  </linearGradient>
                  <linearGradient id="rshade" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.45" />
                    <stop offset="0.4" stopColor="#ffffff" stopOpacity="0" />
                    <stop offset="0.6" stopColor="#000000" stopOpacity="0" />
                    <stop offset="1" stopColor="#000000" stopOpacity="0.5" />
                  </linearGradient>
                  <clipPath id="rbclip">
                    <rect x="80" y="50" width="240" height="52" rx="10" />
                  </clipPath>
                </defs>

                {/* kaki */}
                <line x1="26" y1="76" x2="80" y2="76" stroke="#9AA0A6" strokeWidth="3" strokeLinecap="round" />
                <line x1="320" y1="76" x2="374" y2="76" stroke="#9AA0A6" strokeWidth="3" strokeLinecap="round" />

                {/* badan + band + bayangan silinder */}
                <ellipse cx="80" cy="76" rx="9" ry="26" fill="#B8993E" stroke="#2A2E35" strokeWidth="1.5" />
                <rect x="80" y="50" width="240" height="52" rx="10" fill="url(#rb)" stroke="#2A2E35" strokeWidth="1.5" />
                <g clipPath="url(#rbclip)">
                  {result.bands.map((color, i) => {
                    const n = result.bands.length;
                    const bw = 30;
                    const gap = (240 - n * bw) / (n + 1);
                    return (
                      <rect
                        key={i}
                        x={80 + gap * (i + 1) + bw * i}
                        y="50"
                        width={bw}
                        height="52"
                        fill={getColorHex(color)}
                      />
                    );
                  })}
                  <rect x="80" y="50" width="240" height="52" fill="url(#rshade)" />
                </g>
                <ellipse cx="320" cy="76" rx="9" ry="26" fill="#D9BB57" stroke="#2A2E35" strokeWidth="1.5" />
              </svg>

              <div className="space-y-2">
                <div>
                  <p className="mono-label">{lang === 'en' ? 'Resistance' : 'Resistansi'}</p>
                  <p className="mt-1 font-mono text-[1.5rem] font-bold text-ink">
                    {result.display}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className="btn btn-ghost w-full"
                >
                  {copied ? t.copied : t.copy}
                </button>
              </div>
            </div>
          ) : (
            <div className="flex min-h-[200px] items-center justify-center text-center">
              <p className="font-mono text-[0.78rem] text-muted">
                {mode === 'forward' ? t.subtitle : t.invalidNumber}
              </p>
            </div>
          )}
        </div>
      </FloatingCard>
    </div>
  );
}