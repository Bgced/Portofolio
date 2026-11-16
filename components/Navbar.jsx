"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang, useTheme } from "@/components/providers";
import { useActiveSection } from "@/lib/hooks";
import { CloseIcon, MenuIcon, MoonIcon, SunIcon } from "@/components/Icons";
import { sfx } from "@/lib/sfx";

const LINKS = [
  { id: "about", key: "nav.about" },
  { id: "skills", key: "nav.skills" },
  { id: "projects", key: "nav.projects" },
  { id: "journey", key: "nav.journey" },
  { id: "insight", key: "nav.insight" },
  { id: "arcade", key: "nav.arcade" },
  { id: "contact", key: "nav.contact" },
];

const SECTION_IDS = ["home", ...LINKS.map((link) => link.id)];

function Logo() {
  return (
    <a href="#home" className="nav-logo group flex items-center gap-2" aria-label="Cedric Kilian — home">
      <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-cyan-400/30 bg-slate-900/70">
        <span className="font-mono text-[15px] font-bold tracking-tight text-cyan-300">CK</span>
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.9)]" />
      </span>
      <span className="hidden text-xs font-semibold tracking-[0.18em] text-slate-300 uppercase transition group-hover:text-cyan-300 sm:block">
        Cedric Kilian
      </span>
    </a>
  );
}

export default function Navbar() {
  const { t, lang, toggleLang } = useLang();
  const { theme, toggleTheme } = useTheme();
  const active = useActiveSection(SECTION_IDS);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      if ((y > 24) !== lastY.current) {
        lastY.current = y > 24;
        setScrolled(y > 24);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6" aria-label="Navigasi utama">
        <Logo />

        <ul className="hidden items-center gap-0.5 lg:flex">
          {LINKS.map(({ id, key }) => {
            const isActive = active === id;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => sfx.play("click")}
                  className={`relative rounded-md px-2.5 py-2 text-[11px] font-medium tracking-wide transition ${
                    isActive ? "text-cyan-300" : "text-slate-400 hover:text-slate-100"
                  }`}
                >
                  {t(key)}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2 -bottom-0.5 h-px bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.8)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleLang}
            aria-label={t("ui.lang")}
            className="grid h-8 min-w-8 place-items-center rounded-md border border-slate-700/80 px-1.5 font-mono text-[10px] font-semibold tracking-wide text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            type="button"
            onClick={() => {
              toggleTheme();
              sfx.play("click");
            }}
            aria-label={t("ui.theme")}
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-700/80 text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-300"
          >
            {theme === "dark" ? <MoonIcon width={14} height={14} /> : <SunIcon width={14} height={14} />}
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen((value) => !value);
              sfx.play("click");
            }}
            aria-label={t("ui.menu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="grid h-8 w-8 place-items-center rounded-md border border-slate-700/80 text-slate-300 transition hover:border-cyan-400/40 lg:hidden"
          >
            {menuOpen ? <CloseIcon width={15} height={15} /> : <MenuIcon width={15} height={15} />}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <motion.div
          id="mobile-menu"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden border-t border-slate-800 bg-slate-950/95 backdrop-blur-xl lg:hidden"
        >
            <ul className="mx-auto grid max-w-6xl gap-1 px-4 py-3">
              {LINKS.map(({ id, key }) => (
                <li key={id}>
                  <a
                    href={`#${id}`}
                    onClick={() => {
                      setMenuOpen(false);
                      sfx.play("click");
                    }}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition ${
                      active === id ? "bg-cyan-400/10 text-cyan-300" : "text-slate-300 hover:bg-slate-900"
                    }`}
                  >
                    {t(key)}
                    <span className="font-mono text-[10px] text-slate-600">
                      {String(LINKS.findIndex((l) => l.id === id) + 1).padStart(2, "0")}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
    </header>
  );
}
