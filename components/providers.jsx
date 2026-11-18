"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
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
 * Satu tema saja: Editorial Warm Dark.
 * <html> sudah membawa class="dark" dari server (app/layout.jsx), jadi nggak
 * ada script tema, nggak ada flicker, dan nggak mungkin hydration mismatch.
 */
export function Providers({ children }) {
  return (
    <LanguageProvider>
      <ToastProvider>{children}</ToastProvider>
    </LanguageProvider>
  );
}
