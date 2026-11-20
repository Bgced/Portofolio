"use client";

import { ArrowUpRight } from "lucide-react";
import { useBestScore, formatScore } from "@/lib/scores";
import GameIcon from "@/components/games/GameIcon";

/**
 * Satu kartrid di grid playground. Menampilkan kode (C-01/T-01), rekor
 * lokal, judul, deskripsi, dan tombol buka. Klik di mana saja = buka.
 */
export default function GameCard({ item, onOpen, onPlay, playLabel = "Play" }) {
  const [best] = useBestScore(item.id);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="cartridge group text-left"
      aria-label={`${playLabel} ${item.title}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-2">
          {item.code} · {item.kind}
        </span>
        {item.best ? (
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
            best <span className="text-ink">{best ? formatScore(best) : "0"}</span>
          </span>
        ) : (
          <span className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
            {item.kind === "TOOL" ? "tool" : ""}
          </span>
        )}
      </div>

      <div className="mt-4 flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center border border-line bg-surface-2 text-accent-2">
          <GameIcon name={item.icon} size={17} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[0.98rem] font-semibold leading-snug text-ink">{item.title}</h3>
          <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{item.desc}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent-2">
          {playLabel}
        </span>
        <ArrowUpRight size={13} aria-hidden="true" className="text-muted transition-colors group-hover:text-accent-2" />
      </div>
    </button>
  );
}
