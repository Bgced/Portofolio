"use client";

import { useLang } from "@/components/providers";
import { PROFILE } from "@/lib/content";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-5 py-10 text-center">
        <p className="font-mono text-[10px] tracking-[0.28em] text-accent/70 uppercase">CK / 2026</p>
        <p className="text-sm text-ink">{t("footer.built")}</p>
        <p className="text-[11px] text-muted">{t("footer.credit")}</p>
        <p className="mt-1 flex items-center gap-2 font-mono text-[10px] text-slate-600">
          <span className="h-1 w-1 animate-pulse rounded-full bg-ok" />
          {PROFILE.university} · Electrical Engineering
        </p>
      </div>
    </footer>
  );
}
