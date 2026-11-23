"use client";

import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { useBestScore, formatScore } from "@/lib/scores";
import GameIcon from "@/components/games/GameIcon";

/**
 * Satu kartrid di grid playground. Kartu ini Link ke /play/[slug] (bukan
 * modal) biar tiap game/tool bisa di-share. Skor tetap lokal di device.
 */
export default function GameCard({ item, playLabel = "Play" }) {
  const [best] = useBestScore(item.id);

  // Badge cuma kalau ada isinya: TOOL atau BEST n. Kosong = biarin kosong.
  const badge = item.kind === "TOOL" ? "tool" : best ? `best ${formatScore(best)}` : "";

  return (
    <Link
      href={`/play/${item.id}`}
      className="card-shell card-lift group block"
      aria-label={`${playLabel} ${item.title}`}
    >
      <div className="card-surface flex flex-col">
        <div className="flex items-center justify-between gap-2">
          <span className="card-badge">{item.code}</span>
          <span className="truncate font-mono text-[0.56rem] uppercase tracking-[0.14em] text-muted">
            {badge}
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
          <span className="card-cta">
            <Play
              size={10}
              aria-hidden="true"
              className="opacity-0 transition-opacity duration-200 group-hover:opacity-100"
            />
            {playLabel}
          </span>
          <ArrowRight
            size={13}
            aria-hidden="true"
            className="transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:text-accent"
          />
        </div>
      </div>
    </Link>
  );
}
