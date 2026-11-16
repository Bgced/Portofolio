"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { dict } from "@/lib/i18n";

/* ----------------------------- Language ----------------------------- */
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ck_lang");
      if (stored === "en" || stored === "id") setLang(stored);
    } catch {
      /* ignore */
    }
  }, []);

  const changeLang = useCallback((next) => {
    setLang(next);
    try {
      window.localStorage.setItem("ck_lang", next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang((current) => {
      const next = current === "id" ? "en" : "id";
      try {
        window.localStorage.setItem("ck_lang", next);
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  /** t("nav.about") — falls back to Indonesian, then to the key itself. */
  const t = useCallback(
    (path) => {
      const read = (source) =>
        path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), source);
      return read(dict[lang]) ?? read(dict.id) ?? path;
    },
    [lang]
  );

  const value = useMemo(
    () => ({ lang, setLang: changeLang, toggleLang, t }),
    [lang, changeLang, toggleLang, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside <LanguageProvider>");
  return ctx;
}

/* ------------------------------- Theme ------------------------------ */
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("ck_theme");
      if (stored === "light" || stored === "dark") setTheme(stored);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      window.localStorage.setItem("ck_theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(() => ({ theme, setTheme, toggleTheme }), [theme, toggleTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

/* ------------------------------ Arcade ------------------------------ */
const ArcadeContext = createContext(null);

export function ArcadeProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openArcade = useCallback(() => setOpen(true), []);
  const closeArcade = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ open, openArcade, closeArcade }), [open, openArcade, closeArcade]);
  return <ArcadeContext.Provider value={value}>{children}</ArcadeContext.Provider>;
}

export function useArcade() {
  const ctx = useContext(ArcadeContext);
  if (!ctx) throw new Error("useArcade must be used inside <ArcadeProvider>");
  return ctx;
}

/* --------------------------- App providers -------------------------- */
export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ArcadeProvider>{children}</ArcadeProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
