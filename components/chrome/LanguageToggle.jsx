"use client";

import { Languages } from "lucide-react";
import { useLang } from "@/components/providers";

export default function LanguageToggle({ className = "" }) {
  const { lang, setLanguage, t } = useLang();

  return (
    <div
      role="group"
      aria-label={t("lang.switch")}
      className={`flex h-9 items-center gap-0.5 rounded-[6px] border border-line bg-surface-2 p-0.5 ${className}`}
    >
      <Languages size={13} className="ml-1 text-muted" aria-hidden="true" />
      {["id", "en"].map((code) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          aria-pressed={lang === code}
          className={`rounded-[4px] px-1.5 py-1 font-mono text-[0.6rem] font-semibold uppercase tracking-[0.1em] transition-colors ${
            lang === code ? "bg-accent text-accent-ink" : "text-muted hover:text-ink"
          }`}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
