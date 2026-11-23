"use client";

import { ArrowLeft } from "lucide-react";
import { CATALOG_BY_ID } from "@/lib/games";
import { getGameComponent } from "@/components/games/registry";
import { getToolComponent } from "@/components/playground/toolRegistry";
import { useLang } from "@/components/providers";

/**
 * Permukaan main buat satu kartrid (game atau tool). Dipakai di /play/[slug].
 * Game & tool-nya sama persis kayak di modal — cuma pindah ke halaman sendiri
 * biar bisa di-share. Skor tetap lokal di localStorage, nggak ada leaderboard.
 */
export default function PlaySurface({ id }) {
  const { lang } = useLang();
  const en = lang === "en";
  const item = CATALOG_BY_ID[id];

  if (!item) return null;

  const Tool = getToolComponent(id);
  const Game = Tool ? null : getGameComponent(id);

  return (
    <main className="relative z-10 mx-auto w-full max-w-[38rem] px-4 pb-20 pt-24 sm:pt-28">
      <a
        href="/#playground"
        className="mono-label inline-flex items-center gap-1.5 text-muted transition-colors hover:text-accent-2"
      >
        <ArrowLeft size={12} aria-hidden="true" />
        {en ? "Back to playground" : "Balik ke playground"}
      </a>

      <header className="mt-5 mb-4">
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-2">
          {item.code} · {item.kind}
        </p>
        <h1 className="mt-1 text-[1.5rem] font-semibold tracking-[-0.02em] text-ink">{item.title}</h1>
        <p className="mt-1 text-[0.85rem] leading-relaxed text-muted">{item.desc}</p>
      </header>

      <div className="border border-line bg-surface p-4">
        {Tool ? (
          <Tool />
        ) : Game ? (
          <Game />
        ) : (
          <div className="playfield grid min-h-[280px] place-items-center">
            <p className="mono-label text-[0.6rem]">
              {en ? "This cartridge needs JavaScript." : "Kartrid ini butuh JavaScript."}
            </p>
          </div>
        )}
      </div>

      {item.hint ? (
        <p className="mt-3 border-t border-line pt-2 text-center font-mono text-[0.56rem] uppercase tracking-[0.16em] text-muted">
          {item.hint}
        </p>
      ) : null}
    </main>
  );
}