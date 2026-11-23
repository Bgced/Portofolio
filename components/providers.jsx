"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "@/lib/site-copy";
import { ToastProvider } from "@/components/ui/ToastProvider";

const LangContext = createContext(null);

function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");

  useEffect(() => {
    let stored = null;
    try {
      stored = window.localStorage.getItem("cekael-lang");
    } catch {
      stored = null;
    }
    if (stored === "en" || stored === "id") setLang(stored);
  }, []);

  // Tema aksen pilihan audience (disimpan di localStorage).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("cekael-theme");
      if (saved === "amber" || saved === "cyan" || saved === "violet") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    } catch {
      /* private mode — pakai default amber */
    }
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
    setLang(next === "id" ? "id" : "en");
  }, []);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "id" : "en"));
  }, []);

  const t = useCallback((key, vars) => translate(key, lang, vars), [lang]);

  const value = useMemo(() => ({ lang, setLanguage, toggleLang, t }), [lang, setLanguage, toggleLang, t]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) {
    return {
      lang: "en",
      setLanguage: () => {},
      toggleLang: () => {},
      t: (key, vars) => translate(key, "en", vars),
    };
  }
  return ctx;
}


/**
 * Satu tema saja: Arcade navy. 
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
