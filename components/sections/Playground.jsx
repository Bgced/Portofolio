"use client";

import { useEffect, useState } from "react";
import { useLang } from "@/components/providers";
import { GAMES, TOOLS, COUNT, CATALOG_BY_ID } from "@/lib/games";
import GameCard from "@/components/playground/GameCard";
import GameModal from "@/components/playground/GameModal";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * Playground: katalog kartrid. Sembilan game di atas, empat tool di bawah.
 * Semua dibuka di modal yang sama supaya tetap satu pengalaman.
 */
export default function Playground() {
  const { t } = useLang();
  const [openId, setOpenId] = useState(null);

  // Command palette / shortcut bisa langsung buka kartrid: cekael:play
  useEffect(() => {
    const onPlay = (event) => {
      const id = event?.detail?.id;
      if (id && CATALOG_BY_ID[id]) setOpenId(id);
    };
    window.addEventListener("cekael:play", onPlay);
    return () => window.removeEventListener("cekael:play", onPlay);
  }, []);

  return (
    <section id="playground" className="section-shell">
      <SectionHeading
        index="03"
        kicker={t("playground.kicker")}
        title={t("playground.title")}
        accent={t("playground.accent")}
        intro={t("playground.intro", { games: COUNT.games, tools: COUNT.tools })}
      />

      {/* Games */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="mono-label">{t("playground.gamesHeading")}</p>
        <p className="mono-label text-[0.58rem]">{COUNT.games} titles</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {GAMES.map((item, i) => (
          <Reveal key={item.id} delay={i * 45}>
            <GameCard item={item} onOpen={(entry) => setOpenId(entry.id)} playLabel={t("playground.play")} />
          </Reveal>
        ))}
      </div>

      <p className="mt-4 max-w-2xl text-[0.78rem] leading-relaxed text-muted">
        {t("playground.note")}
      </p>

      <div className="hairline my-10" />

      {/* Tools */}
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="mono-label">{t("playground.toolsHeading")}</p>
        <p className="mono-label text-[0.58rem]">{COUNT.tools} tools</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((item, i) => (
          <Reveal key={item.id} delay={i * 45}>
            <GameCard item={item} onOpen={(entry) => setOpenId(entry.id)} playLabel={t("playground.open")} />
          </Reveal>
        ))}
      </div>

      <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.14em] text-muted">
        {t("playground.allLocal")}
      </p>

      <GameModal openId={openId} onClose={() => setOpenId(null)} />
    </section>
  );
}
