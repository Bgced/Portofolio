"use client";

import { useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { X } from "lucide-react";
import { useLang } from "@/components/providers";
import { getGameComponent } from "@/components/games/registry";
import { getToolComponent } from "@/components/playground/toolRegistry";
import { CATALOG_BY_ID } from "@/lib/games";

/**
 * Modal player: satu wadah buat 9 game (lazy chunk) dan 4 tool.
 * Escape / klik backdrop = tutup; body dikunci selama terbuka.
 */
export default function GameModal({ openId, onClose }) {
  const { t } = useLang();
  const panelRef = useRef(null);
  const item = openId ? CATALOG_BY_ID[openId] : null;

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (!openId) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const timer = window.setTimeout(() => panelRef.current?.focus(), 30);

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
      window.clearTimeout(timer);
    };
  }, [openId, close]);

  if (!item) return null;

  const Tool = getToolComponent(item.id);
  const Game = Tool ? null : getGameComponent(item.id);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={item.title}
      className="fixed inset-0 z-[70] flex items-end justify-center bg-[rgba(3,5,7,0.82)] p-0 sm:items-center sm:p-6"
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className="palette-panel relative max-h-[92svh] w-full max-w-[34rem] overflow-y-auto rounded-[26px] border border-line bg-surface p-4 outline-none sm:p-5"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-2">
              {item.code} · {item.kind}
            </p>
            <h2 className="mt-1 truncate text-[1.05rem] font-semibold text-ink">{item.title}</h2>
          </div>

          <button
            type="button"
            onClick={close}
            aria-label={t("playground.close")}
            className="grid h-8 w-8 shrink-0 place-items-center border border-line text-muted transition-colors hover:border-accent hover:text-ink"
          >
            <X size={15} aria-hidden="true" />
          </button>
        </div>

        {Tool ? (
          <Tool />
        ) : Game ? (
          <Game />
        ) : (
          <div className="playfield grid min-h-[280px] place-items-center">
            <p className="mono-label text-[0.6rem]">{t("playground.noJs")}</p>
          </div>
        )}

        {item.hint ? (
          <p className="mt-3 border-t border-line pt-2 text-center font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted">
            {item.hint}
          </p>
        ) : null}
      </div>
    </div>
  );
}
