"use client";

import { useCallback, useEffect, useMemo, useReducer, useRef } from "react";
import { CALC_KEYS } from "@/lib/content";

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const MAX_DIGITS = 14;
const PRECISION = 1e12;
const DIV_ZERO = "Nggak bisa dibagi 0 bro!";

/** Buang artefak float kayak 0.1+0.2 = 0.30000000000000004 */
function round(n) {
  if (!Number.isFinite(n)) return n;
  const r = Math.round(n * PRECISION) / PRECISION;
  return Object.is(r, -0) ? 0 : r;
}

/** Number -> string tanpa nol ekor, aman buat angka gede. */
function fmt(n) {
  if (!Number.isFinite(n)) return "0";
  const rounded = round(n);
  if (rounded !== 0 && (Math.abs(rounded) >= 1e13 || Math.abs(rounded) < 1e-9)) {
    return rounded.toExponential(6).replace(/\.?0+e/, "e");
  }
  const s = String(rounded);
  return s === "-0" ? "0" : s;
}

/** Grouping ribuan pakai koma, desimal tetap titik. Aman buat string parsial. */
function pretty(raw) {
  if (typeof raw !== "string") return "0";
  if (!/^-?\d*(\.\d*)?$/.test(raw)) return raw;
  const neg = raw.startsWith("-");
  const body = neg ? raw.slice(1) : raw;
  if (!body) return neg ? "-0" : "0";
  const [int, dec] = body.split(".");
  const grouped = (int || "0").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const hasDot = body.includes(".");
  return `${neg ? "-" : ""}${grouped}${hasDot ? `.${dec ?? ""}` : ""}`;
}

function toNumber(raw) {
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

function digitCount(raw) {
  return raw.replace(/[-.]/g, "").length;
}

function apply(a, b, op) {
  switch (op) {
    case "+":
      return { value: round(a + b) };
    case "−":
      return { value: round(a - b) };
    case "×":
      return { value: round(a * b) };
    case "÷":
      if (b === 0) return { error: DIV_ZERO };
      return { value: round(a / b) };
    default:
      return { value: b };
  }
}

const INITIAL = {
  display: "0",
  accumulator: null,
  operator: null,
  waiting: false,
  error: null,
  note: "",
  ticker: [],
};

function pushTicker(ticker, entry) {
  return [entry, ...ticker].slice(0, 4);
}

/* ------------------------------------------------------------------ */
/*  State machine                                                      */
/* ------------------------------------------------------------------ */

function reducer(state, action) {
  switch (action.type) {
    case "DIGIT": {
      if (state.error) return state;
      const d = action.digit;
      if (state.waiting) return { ...state, display: d, waiting: false, note: "" };
      if (state.display === "0") return { ...state, display: d };
      if (digitCount(state.display) >= MAX_DIGITS) return state;
      return { ...state, display: `${state.display}${d}` };
    }

    case "DECIMAL": {
      if (state.error) return state;
      if (state.waiting) return { ...state, display: "0.", waiting: false, note: "" };
      if (state.display.includes(".")) return state;
      return { ...state, display: `${state.display}.` };
    }

    case "OPERATOR": {
      if (state.error) return state;
      const op = action.op;
      // Dua operator beruntun -> ganti operator, jangan numpuk.
      if (state.waiting && state.operator) return { ...state, operator: op };

      if (state.operator && !state.waiting) {
        const current = toNumber(state.display);
        const result = apply(state.accumulator ?? 0, current, state.operator);
        if (result.error) {
          return { ...state, error: result.error, note: `${fmt(state.accumulator ?? 0)} ${state.operator} ${fmt(current)}`, waiting: true };
        }
        return {
          ...state,
          display: fmt(result.value),
          accumulator: result.value,
          operator: op,
          waiting: true,
          note: "",
          ticker: pushTicker(state.ticker, `${fmt(state.accumulator ?? 0)} ${state.operator} ${fmt(current)} = ${fmt(result.value)}`),
        };
      }

      return {
        ...state,
        accumulator: toNumber(state.display),
        operator: op,
        waiting: true,
        note: "",
      };
    }

    case "EQUALS": {
      if (state.error) return state;
      if (!state.operator || state.accumulator === null) {
        return { ...state, note: `${fmt(toNumber(state.display))} =`, waiting: true };
      }
      const current = toNumber(state.display);
      const result = apply(state.accumulator, current, state.operator);
      if (result.error) {
        return { ...state, error: result.error, waiting: true, operator: null };
      }
      const entry = `${fmt(state.accumulator)} ${state.operator} ${fmt(current)} = ${fmt(result.value)}`;
      return {
        ...state,
        display: fmt(result.value),
        accumulator: result.value,
        operator: null,
        waiting: true,
        note: entry,
        ticker: pushTicker(state.ticker, entry),
      };
    }

    case "PERCENT": {
      if (state.error) return state;
      const value = round(toNumber(state.display) / 100);
      return { ...state, display: fmt(value), waiting: false, note: "" };
    }

    case "SIGN": {
      if (state.error) return state;
      if (toNumber(state.display) === 0) return state;
      const flipped = state.display.startsWith("-") ? state.display.slice(1) : `-${state.display}`;
      return { ...state, display: flipped };
    }

    case "AC":
      return { ...INITIAL, ticker: state.ticker };

    case "DEL": {
      if (state.error) return { ...INITIAL, ticker: state.ticker };
      if (state.waiting) return { ...state, display: "0", waiting: false };
      const next = state.display.slice(0, -1);
      if (!next || next === "-") return { ...state, display: "0" };
      return { ...state, display: next };
    }

    default:
      return state;
  }
}

/* ------------------------------------------------------------------ */
/*  Keypad metadata                                                    */
/* ------------------------------------------------------------------ */

const OPERATORS = new Set(["÷", "×", "−", "+"]);

const ARIA = {
  AC: "Hapus semua perhitungan",
  DEL: "Hapus satu digit terakhir",
  "%": "Ubah jadi persen",
  "÷": "Bagi",
  "×": "Kali",
  "−": "Kurang",
  "+": "Tambah",
  "±": "Balik tanda positif negatif",
  "=": "Hitung hasil",
  ".": "Titik desimal",
};

const KEY_LABEL = {
  AC: "AC",
  DEL: "DEL",
};

function keyClasses(key) {
  const base =
    "relative flex min-h-[48px] select-none items-center justify-center rounded-xl border font-mono text-[0.95rem] font-semibold transition-all duration-150 active:translate-y-px active:scale-[0.98]";
  if (key === "=") {
    return `${base} border-accent/70 bg-accent text-accent-ink shadow-[0_10px_30px_-14px_var(--glow)] hover:brightness-110`;
  }
  if (key === "AC" || key === "DEL") {
    return `${base} border-danger/35 bg-danger/10 text-danger hover:border-danger/60 hover:bg-danger/15`;
  }
  if (OPERATORS.has(key) || key === "%") {
    return `${base} border-accent/30 bg-accent/10 text-accent hover:border-accent/60 hover:bg-accent/15`;
  }
  if (key === "±") {
    return `${base} border-line-soft bg-surface-2 text-muted hover:border-line hover:text-ink`;
  }
  return `${base} border-line-soft bg-surface text-ink hover:border-line hover:bg-surface-2`;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function CyberCalc({ active = true }) {
  const [state, dispatch] = useReducer(reducer, INITIAL);
  const press = useCallback((key) => {
    if (/^\d$/.test(key)) return dispatch({ type: "DIGIT", digit: key });
    if (key === ".") return dispatch({ type: "DECIMAL" });
    if (key === "=") return dispatch({ type: "EQUALS" });
    if (key === "%") return dispatch({ type: "PERCENT" });
    if (key === "±") return dispatch({ type: "SIGN" });
    if (key === "AC") return dispatch({ type: "AC" });
    if (key === "DEL") return dispatch({ type: "DEL" });
    if (OPERATORS.has(key)) return dispatch({ type: "OPERATOR", op: key });
    return undefined;
  }, []);

  const pressRef = useRef(press);
  pressRef.current = press;

  /* Keyboard control — cuma hidup kalau tab kalkulator kelihatan. */
  useEffect(() => {
    if (!active) return undefined;

    const isTypingTarget = (target) => {
      if (!target || typeof target !== "object") return false;
      const tag = target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return true;
      return Boolean(target.isContentEditable);
    };

    const onKeyDown = (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;

      const { key } = event;
      let mapped = null;

      if (/^[0-9]$/.test(key)) mapped = key;
      else if (key === "." || key === ",") mapped = ".";
      else if (key === "+") mapped = "+";
      else if (key === "-") mapped = "−";
      else if (key === "*" || key === "x" || key === "X") mapped = "×";
      else if (key === "/") mapped = "÷";
      else if (key === "%") mapped = "%";
      else if (key === "Enter" || key === "=") mapped = "=";
      else if (key === "Backspace") mapped = "DEL";
      else if (key === "Escape" || key === "Delete") mapped = "AC";

      if (!mapped) return;
      event.preventDefault();
      pressRef.current(mapped);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  const display = useMemo(() => (state.error ? DIV_ZERO : pretty(state.display)), [state.display, state.error]);

  const expression = useMemo(() => {
    if (state.error) return "ERROR / DIV_BY_ZERO";
    if (state.operator) {
      const head = `${pretty(fmt(state.accumulator ?? 0))} ${state.operator}`;
      return state.waiting ? head : `${head} ${pretty(state.display)}`;
    }
    return state.note || "READY";
  }, [state.accumulator, state.operator, state.waiting, state.display, state.note, state.error]);

  return (
    <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
      {/* ---------------- calculator ---------------- */}
      <div className="panel scanlines corner-frame overflow-hidden">
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-danger/70" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-accent/60" aria-hidden="true" />
            <span className="h-2 w-2 rounded-full bg-ok/60" aria-hidden="true" />
            <span className="mono-label ml-2">calc_terminal v2.1</span>
          </div>
          <span className={`pill ${state.error ? "" : "pill-accent"}`}>{state.error ? "error" : "online"}</span>
        </div>

        <div className="px-4 pb-4 pt-3">
          <div className="mb-3 flex min-h-[76px] flex-col items-end justify-end rounded-xl border border-line-soft bg-canvas px-3 py-2.5">
            <p className="max-w-full truncate font-mono text-[0.68rem] tracking-wide text-muted" aria-hidden="true">
              {expression}
            </p>
            <p
              aria-live="polite"
              aria-atomic="true"
              className={`mt-1 w-full text-right font-mono font-semibold tabular-nums ${
                state.error
                  ? "whitespace-normal break-words text-[0.85rem] leading-snug text-danger"
                  : "truncate text-[clamp(1.7rem,6vw,2.5rem)] leading-tight text-ink glow-text"
              }`}
            >
              {display}
            </p>
          </div>

          <div className="grid grid-cols-4 gap-2" role="group" aria-label="Keypad kalkulator">
            {CALC_KEYS.flat().map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => press(key)}
                aria-label={ARIA[key] ?? `Masukkan ${key}`}
                className={keyClasses(key)}
              >
                {KEY_LABEL[key] ?? key}
              </button>
            ))}
          </div>

          <p className="mono-label mt-3 text-center leading-relaxed">
            keyboard aktif: 0-9 · . + - * / % · enter = · backspace del · esc ac
          </p>
        </div>
      </div>

      {/* ---------------- side panel ---------------- */}
      <div className="space-y-3">
        <div className="panel p-4">
          <p className="mono-label">recent ops</p>
          {state.ticker.length === 0 ? (
            <p className="mt-3 font-mono text-[0.72rem] leading-relaxed text-muted">
              belum ada operasi.
              <br />
              coba 12 × 8 terus pencet =.
            </p>
          ) : (
            <ul className="mt-3 space-y-1.5">
              {state.ticker.map((entry, index) => (
                <li
                  key={`${entry}-${index}`}
                  className={`truncate font-mono text-[0.72rem] ${
                    index === 0 ? "text-accent" : "text-muted"
                  }`}
                  style={{ opacity: 1 - index * 0.18 }}
                >
                  <span className="text-line-soft">›</span> {entry}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="panel p-4">
          <p className="mono-label">catatan mesin</p>
          <ul className="mt-3 space-y-2 text-[0.78rem] leading-relaxed text-muted">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              Presisi dipangkas ke 12 digit, jadi 0.1 + 0.2 = 0.3 — bukan 0.30000000000000004.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              Operator dobel otomatis diganti, nggak numpuk jadi &quot;++&quot;.
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              Bagi 0 bikin mesin kunci. Tekan AC atau DEL buat bangunin.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
