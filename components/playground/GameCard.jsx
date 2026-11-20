"use client";

import { ArrowUpRight } from "lucide-react";
import { useBestScore, formatScore } from "@/lib/scores";
import GameIcon from "@/components/games/GameIcon";

/**
 * Satu kartrid di grid playground. Shell kaca + surface cekung bikin kartunya
 * kebaca sebagai objek fisik; lift + dek miring cuma di kartu ini karena
 * seluruh permukaannya memang satu tombol.
 */
export default function GameCard({ item, onOpen, playLabel = "Play" }) {
  const [best] = useBestScore(item.id);

  return (
    <button
      type="button"
      onClick={() => onOpen(item)}
      className="card-shell card-lift group"
      aria-label={`${playLabel} ${item.title}`}
    >
      <div className="card-surface flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="card-badge">{item.code}</span>
          <span className="truncate font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted">
            {item.kind === "TOOL" ? "tool" : item.best ? `best ${best ? formatScore(best) : "0"}` : ""}
          </span>
        </div>

        <div className="mt-4 mb-4 flex items-start gap-3">
          <span className="card-dock">
            <GameIcon name={item.icon} size={17} />
          </span>
          <div className="min-w-0">
            <h3 className="break-words text-[0.98rem] font-semibold leading-snug text-ink">{item.title}</h3>
            <p className="mt-1 text-[0.78rem] leading-relaxed text-muted">{item.desc}</p>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-line pt-3">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-ink transition-colors group-hover:text-accent-2">
            {playLabel}
          </span>
          <ArrowUpRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent-2"
          />
        </div>
      </div>
    </button>
  );
}
