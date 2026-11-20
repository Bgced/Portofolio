"use client";

import { useEffect, useState } from "react";
import { Menu, Play, Search, X } from "lucide-react";
import { NAV_LINKS, PROFILE, SECTION_IDS } from "@/lib/content";
import { useActiveSection, useScrollLock } from "@/lib/hooks";
import LanguageToggle from "@/components/chrome/LanguageToggle";
import { useLang } from "@/components/providers";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const { t } = useLang();

  useScrollLock(open);

  useEffect(() => {
    let raf = 0;
    const apply = () => {
      raf = 0;
      const next = window.scrollY > 24;
      setScrolled((prev) => (prev === next ? prev : next));
    };
    const request = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", request, { passive: true });
    return () => {
      window.removeEventListener("scroll", request);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shellClass = scrolled
    ? "border-b border-line bg-canvas"
    : "border-b border-transparent bg-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${shellClass}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-7">
        {/* wordmark */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
          aria-label={`${PROFILE.name} — ${t("nav.homeLabel")}`}
        >
          <span className="grid h-8 w-8 place-items-center border border-accent bg-accent-soft font-mono text-[0.68rem] font-semibold text-accent-2">
            CK
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.92rem] font-semibold tracking-[-0.01em] text-ink">Cedric Kilian</span>
            <span className="mt-1 font-mono text-[0.54rem] uppercase tracking-[0.2em] text-muted">
              frontend dev
            </span>
          </span>
        </a>

        {/* desktop nav */}
        <nav aria-label={t("nav.main")} className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative px-2.5 py-2 font-mono text-[0.64rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
                  isActive ? "text-ink" : "text-muted hover:text-ink"
                }`}
              >
                {t(`nav.${link.id}`)}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-2.5 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("cekael:command"))}
            aria-label="Open command palette (Ctrl + K)"
            title="Command palette · Ctrl/⌘ + K"
            className="hidden h-9 items-center gap-1.5 border border-line bg-surface px-2 text-muted transition-colors hover:border-accent hover:text-accent-2 sm:inline-flex"
          >
            <Search size={14} strokeWidth={1.9} aria-hidden="true" />
            <kbd className="font-mono text-[0.52rem] tracking-[0.06em] text-muted/80">⌘K</kbd>
          </button>

          <LanguageToggle />

          <a href="#playground" className="hidden items-center gap-1.5 bg-accent px-3 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] text-white transition-colors hover:bg-accent-hover sm:inline-flex">
            <Play size={12} aria-hidden="true" />
            {t("nav.playNow")}
          </a>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? t("nav.close") : t("nav.open")}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-9 w-9 place-items-center border border-line bg-surface text-ink transition-colors hover:border-accent lg:hidden"
          >
            {open ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div id="mobile-nav" hidden={!open} className="border-t border-line bg-canvas lg:hidden">
        <nav aria-label={t("nav.mobile")} className="mx-auto w-full max-w-[1180px] px-4 py-4 sm:px-7">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link, index) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center justify-between border-b border-line py-3 text-[0.9rem] transition-colors ${
                      isActive ? "text-accent-2" : "text-muted hover:text-ink"
                    }`}
                  >
                    {t(`nav.${link.id}`)}
                    <span className="font-mono text-[0.55rem] uppercase tracking-[0.2em] text-muted">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="mt-4 flex items-center justify-between gap-3">
            <a href="#playground" onClick={() => setOpen(false)} className="btn btn-primary flex-1">
              <Play size={13} aria-hidden="true" />
              {t("nav.playNow")}
            </a>
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
