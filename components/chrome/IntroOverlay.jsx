"use client";

/**
 * IntroOverlay — layar sambutan. Satu tombol "Iya, masuk" + centang
 * "jangan tampilkan lagi 10 menit".
 *
 * - Muncul tiap mount (tiap refresh / buka baru), KECUALI user centang
 *   diam selama 10 menit (timestamp di localStorage).
 * - Tombol X / Escape / klik luar tetap nutup tanpa nyentuh centangan.
 * - Bisa dibuka lagi manual lewat event `cekael:intro`.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { useLang } from "@/components/providers";
import { COUNT } from "@/lib/games";
import { PROJECTS } from "@/lib/content";
import { ACCENTS, applyPrefs, loadPrefs, savePrefs } from "@/lib/ui-prefs";

const SNOOZE_KEY = "cekael-intro-snooze";
const SNOOZE_MS = 10 * 60 * 1000; // 10 menit

export default function IntroOverlay() {
  const { t, lang } = useLang();
  const en = lang === "en";
  const [open, setOpen] = useState(true);
  const [snooze, setSnooze] = useState(false);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const [theme, setTheme] = useState("amber");

  // Sumber tema = store ui-prefs yang sama dipakai UiSandbox (inline --accent).
  const themeSwatch = (id) => {
    const found = ACCENTS.find((item) => item.id === id);
    return found ? found.dark : "#f5a524";
  };
  const themeLabel = (id) => {
    const found = ACCENTS.find((item) => item.id === id);
    if (!found) return id;
    return en ? found.enLabel : found.idLabel;
  };
  const THEME_IDS = ACCENTS.map((item) => item.id);

  // Baca tema tersimpan biar picker sinkron sama yang lagi aktif.
  useEffect(() => {
    const prefs = loadPrefs();
    applyPrefs(prefs);
    setTheme(prefs.accent);
  }, []);

  const pickTheme = (id) => {
    const prefs = { ...loadPrefs(), accent: id };
    applyPrefs(prefs);
    savePrefs(prefs);
    setTheme(id);
  };

  // Cek snooze di mount. Kalau masih dalam 10 menit, jangan buka overlay.
  useEffect(() => {
    let snoozed = false;
    try {
      const until = Number(window.localStorage.getItem(SNOOZE_KEY)) || 0;
      snoozed = Date.now() < until;
    } catch {
      snoozed = false;
    }
    if (snoozed) setOpen(false);
  }, []);

  const close = useCallback(() => {
    if (snooze) {
      try {
        window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
      } catch {
        /* private mode — snooze nggak persist, overlay nutup aja */
      }
    }
    setOpen(false);
    window.requestAnimationFrame(() => {
      const home = document.getElementById("home");
      if (home) home.focus({ preventScroll: true });
      else lastFocused.current?.focus();
    });
  }, [snooze]);

  // Lihat portofolio: tutup overlay + lompat ke section Work (#projects).
  const goPortfolio = useCallback(() => {
    if (snooze) {
      try {
        window.localStorage.setItem(SNOOZE_KEY, String(Date.now() + SNOOZE_MS));
      } catch {
        /* ignore */
      }
    }
    setOpen(false);
    window.requestAnimationFrame(() => {
      const target = document.getElementById("projects");
      const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth";
      if (target) target.scrollIntoView({ behavior, block: "start" });
      else document.getElementById("home")?.focus({ preventScroll: true });
    });
  }, [snooze]);

  // Bisa dibuka lagi dari command palette
  useEffect(() => {
    const onOpen = () => {
      setSnooze(false);
      setOpen(true);
    };
    window.addEventListener("cekael:intro", onOpen);
    return () => window.removeEventListener("cekael:intro", onOpen);
  }, []);

  // Escape nutup
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Fokus ke tombol utama pas kebuka
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, [open]);

  if (!open) return null;

  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <div
      role="presentation"
      onMouseDown={onBackdrop}
      className="overlay-backdrop fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(4,6,9,0.76)] p-4 backdrop-blur-[3px]"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        className="intro-panel relative w-full max-w-[400px] overflow-hidden rounded-[16px] border border-line bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* bar atas: label + tombol X */}
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <p className="mono-label text-[0.56rem]">{t("intro.kicker")}</p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("intro.close")}
            className="grid h-7 w-7 place-items-center rounded-[5px] border border-line bg-surface-2 text-muted transition-colors hover:border-accent hover:text-accent"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {/* isi */}
        <div className="p-5 sm:p-6">
          <div className="intro-body">
            <h2
              id="intro-title"
              className="text-[1.4rem] font-semibold leading-tight tracking-[-0.02em] text-ink"
            >
              {t("intro.title")}
            </h2>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
              {t("intro.body", { games: COUNT.games, tools: COUNT.tools, projects: PROJECTS.length })}
            </p>

            <div className="mt-4">
              <p className="mono-label mb-1.5">{en ? "Theme" : "Tema"}</p>
              <div className="flex flex-wrap gap-2" role="group" aria-label={en ? "Theme" : "Tema"}>
                {THEME_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => pickTheme(id)}
                    aria-pressed={theme === id}
                    className={`flex items-center gap-2 rounded-[5px] border px-2.5 py-1.5 font-mono text-[0.72rem] transition-colors ${
                      theme === id
                        ? "border-accent text-ink"
                        : "border-line text-muted hover:text-ink"
                    }`}
                  >
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-[2px] border border-line/50"
                      style={{ backgroundColor: themeSwatch(id) }}
                      aria-hidden="true"
                    />
                    {themeLabel(id)}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={close}
              className="btn btn-primary mt-5 w-full"
            >
              {t("intro.enter")}
              <ArrowRight size={14} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={goPortfolio}
              className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[6px] border border-line bg-surface-2 font-mono text-[0.8rem] text-ink transition-colors hover:border-accent hover:text-accent"
            >
              {t("intro.ctaPortfolio")}
              <ArrowRight size={14} aria-hidden="true" />
            </button>

            <label className="mt-3 flex cursor-pointer items-center gap-2 text-[0.74rem] text-muted">
              <span className="relative grid h-4 w-4 place-items-center">
                <input
                  type="checkbox"
                  checked={snooze}
                  onChange={(event) => setSnooze(event.target.checked)}
                  className="peer h-4 w-4 cursor-pointer appearance-none rounded-[3px] border border-line bg-surface-2 transition-colors checked:border-accent checked:bg-accent"
                />
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  className="pointer-events-none absolute h-3 w-3 scale-75 text-[color:var(--accent-ink)] opacity-0 transition-all peer-checked:scale-100 peer-checked:opacity-100"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 8.5 6.5 12 13 4.5" />
                </svg>
              </span>
              {t("intro.snooze")}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}