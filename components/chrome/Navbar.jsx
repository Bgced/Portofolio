"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, PROFILE, SECTION_IDS } from "@/lib/content";
import { useActiveSection, useScrollLock } from "@/lib/hooks";
import ThemeToggle from "@/components/chrome/ThemeToggle";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);

  useScrollLock(open);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
    ? "border-b border-line-soft bg-canvas/80 backdrop-blur-xl"
    : "border-b border-transparent bg-transparent";

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${shellClass}`}>
      <div className="mx-auto flex h-16 w-full max-w-[1180px] items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-7">
        {/* logo */}
        <a
          href="#home"
          onClick={() => setOpen(false)}
          className="group flex items-center gap-3"
          aria-label={`${PROFILE.name} — ke bagian markas`}
        >
          <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 font-mono text-[0.72rem] font-semibold tracking-[0.06em] text-accent transition-colors group-hover:border-accent">
            CK
            <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[0.78rem] font-semibold tracking-[0.22em] text-ink">CEKAEL</span>
            <span className="mono-label mt-1 text-[0.55rem] tracking-[0.18em]">Cedric Kilian</span>
          </span>
        </a>

        {/* desktop nav */}
        <nav aria-label="Navigasi utama" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                aria-current={isActive ? "true" : undefined}
                className={`relative rounded-md px-3 py-2 text-[0.78rem] font-medium transition-colors duration-200 ${
                  isActive ? "text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 -bottom-px h-px origin-left bg-accent transition-transform duration-300 ${
                    isActive ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a href="#contact" className="btn btn-primary hidden lg:inline-flex">
            Gas Kolab
          </a>

          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-ink transition-colors hover:border-accent hover:text-accent lg:hidden"
          >
            {open ? <X size={17} aria-hidden="true" /> : <Menu size={17} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* mobile drawer */}
      <div
        id="mobile-nav"
        hidden={!open}
        className="border-t border-line-soft bg-canvas/95 backdrop-blur-xl lg:hidden"
      >
        <nav aria-label="Navigasi mobile" className="mx-auto w-full max-w-[1180px] px-4 py-4 sm:px-7">
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    onClick={() => setOpen(false)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex items-center justify-between border-b border-line-soft py-3 text-[0.9rem] transition-colors ${
                      isActive ? "text-accent" : "text-muted hover:text-ink"
                    }`}
                  >
                    {link.label}
                    <span className="mono-label text-[0.55rem] tracking-[0.2em]">
                      {String(NAV_LINKS.indexOf(link) + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#contact"
            onClick={() => setOpen(false)}
            className="btn btn-primary mt-4 w-full"
          >
            Gas Kolab
          </a>
        </nav>
      </div>
    </header>
  );
}
