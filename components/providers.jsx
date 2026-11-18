"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { translate } from "@/lib/site-copy";
import { ToastProvider } from "@/components/ui/ToastProvider";

const LangContext = createContext(null);

function LanguageProvider({ children }) {
  const [lang, setLang] = useState("id");

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem("cekael-lang");
    } catch {
      stored = null;
    }
    if (stored === "en" || stored === "id") setLang(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      window.localStorage.setItem("cekael-lang", lang);
    } catch {
      /* private mode — bahasa tetap jalan di sesi ini */
    }
  }, [lang]);

  const setLanguage = useCallback((next) => {
    setLang(next === "en" ? "en" : "id");
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "id" ? "en" : "id"));
  }, []);

  const t = useCallback((key, vars) => translate(key, lang, vars), [lang]);

  const value = useMemo(() => ({ lang, setLanguage, toggleLang, t }), [lang, setLanguage, toggleLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    return {
      lang: "id",
      setLanguage: () => {},
      toggleLang: () => {},
      t: (key, vars) => translate(key, "id", vars),
    };
  }
  return ctx;
}


/**
 * next-themes dipakai supaya theme sudah dipasang sebelum paint
 * (script inline di <head>) — jadi nggak ada flicker / hydration mismatch.
 * attribute="class" -> <html class="dark"> atau <html class="light">.
 */
export function Providers({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey="cekael-theme"
      disableTransitionOnChange={false}
    >
      <LanguageProvider>
        <ToastProvider>{children}</ToastProvider>
      </LanguageProvider>
    </NextThemesProvider>
  );
}
