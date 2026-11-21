"use client";

/**
 * IntroOverlay — layar pembuka yang bisa ditutup (X / Escape / klik luar).
 *
 * Muncul sekali per browser (localStorage `cekael-intro`). Bisa dibuka lagi
 * lewat event `cekael:intro` (dipakai command palette).
 *
 * Nggak nge-blok halaman: overlay transparan dengan backdrop tipis, di belakang
 * tetap kelihatan. Fokus ditahan di dialog selama kebuka (R-32).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, X } from "lucide-react";
import { useLang } from "@/components/providers";
import { COUNT } from "@/lib/games";
import { PROJECTS } from "@/lib/content";

/**
 * IntroOverlay — layar pembuka yang bisa ditutup (X / Escape / klik luar).
 *
 * Muncul tiap halaman di-mount (tiap refresh / buka baru). Bisa juga dibuka
 * lagi lewat event `cekael:intro` (dipakai command palette).
 *
 * Nggak nge-blok halaman: overlay transparan dengan backdrop tipis, di belakang
 * tetap kelihatan. Fokus ditahan di dialog selama kebuka (R-32).
 */

export default function IntroOverlay() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);
  const { t } = useLang();

  // Muncul tiap mount (tiap refresh).
  useEffect(() => {
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    // Balikin fokus ke halaman
    window.requestAnimationFrame(() => {
      const home = document.getElementById("home");
      if (home) home.focus({ preventScroll: true });
      else lastFocused.current?.focus();
    });
  }, []);

  // Bisa dibuka lagi dari command palette / navbar
  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("cekael:intro", onOpen);
    return () => window.removeEventListener("cekael:intro", onOpen);
  }, []);

  // Escape nutup overlay
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Fokus ke tombol X pas kebuka
  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Klik backdrop nutup (area gelap di luar panel)
  const onBackdrop = (event) => {
    if (event.target === event.currentTarget) close();
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onMouseDown={onBackdrop}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(2,5,8,0.72)] p-4 backdrop-blur-[3px]"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="intro-title"
        className="palette-panel relative w-full max-w-[440px] overflow-hidden rounded-[20px] border border-line bg-surface shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
      >
        {/* bar atas: label + tombol X */}
        <div className="flex items-center justify-between border-b border-line-soft px-4 py-2.5">
          <p className="mono-label text-[0.56rem]">
            {t("intro.kicker")}
          </p>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label={t("intro.close")}
            className="grid h-7 w-7 place-items-center rounded-[6px] border border-line bg-surface-2 text-muted transition-colors hover:border-accent hover:text-accent-2"
          >
            <X size={13} aria-hidden="true" />
          </button>
        </div>

        {/* isi */}
        <div className="p-5 sm:p-6">
          <h2
            id="intro-title"
            className="text-[1.5rem] font-semibold leading-tight tracking-[-0.02em] text-ink"
          >
            {t("intro.title")}
          </h2>
          <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
            {t("intro.body", { games: COUNT.games, tools: COUNT.tools, projects: PROJECTS.length })}
          </p>

          <div className="mt-5 flex flex-col gap-2">
            <a
              href="#playground"
              onClick={close}
              className="btn btn-primary w-full"
            >
              {t("intro.ctaPlay")}
              <ArrowDown size={14} aria-hidden="true" />
            </a>
            <a
              href="#projects"
              onClick={close}
              className="btn btn-ghost w-full"
            >
              {t("intro.ctaWork")}
              <ArrowRight size={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}