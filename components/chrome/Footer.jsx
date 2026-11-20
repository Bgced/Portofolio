"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Briefcase, Camera, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS, PROFILE, SOCIALS } from "@/lib/content";
import { GAMES, TOOLS } from "@/lib/games";
import { useLang } from "@/components/providers";

const ICONS = {
  mail: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  instagram: Camera,
};

export default function Footer() {
  const [year, setYear] = useState(2026);
  const { t, lang } = useLang();
  const en = lang === "en";

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const backToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <footer className="relative z-10 border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-12">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_2fr]">
          {/* identitas */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-8 w-8 place-items-center border border-accent bg-accent-soft font-mono text-[0.66rem] font-semibold text-accent-2">
                CK
              </span>
              <span className="text-[0.92rem] font-semibold text-ink">Cedric Kilian</span>
            </div>

            <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">{t("footer.echo")}</p>

            <p className="mt-3 inline-flex items-center gap-2 border border-line px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted">
              {en ? "Open to work" : "Buka buat kerja bareng"}
            </p>
          </div>

          {/* kolom link: games, tools, links, connect */}
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            <div>
              <p className="mono-label mb-2.5">{t("footer.games")}</p>
              <ul className="flex flex-col gap-1.5">
                {GAMES.map((game) => (
                  <li key={game.id}>
                    <a href="#playground" className="text-[0.78rem] text-muted transition-colors hover:text-accent-2">
                      {game.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-label mb-2.5">{t("footer.tools")}</p>
              <ul className="flex flex-col gap-1.5">
                {TOOLS.map((tool) => (
                  <li key={tool.id}>
                    <a href="#playground" className="text-[0.78rem] text-muted transition-colors hover:text-accent-2">
                      {tool.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-label mb-2.5">{t("footer.links")}</p>
              <ul className="flex flex-col gap-1.5">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a href={`#${link.id}`} className="text-[0.78rem] text-muted transition-colors hover:text-accent-2">
                      {t(`nav.${link.id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="mono-label mb-2.5">{en ? "Connect" : "Kenalan"}</p>
              <ul className="flex flex-col gap-1.5">
                {SOCIALS.map((social) => {
                  const Icon = ICONS[social.icon] ?? Mail;
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="flex items-center gap-2 text-[0.78rem] text-muted transition-colors hover:text-accent-2"
                      >
                        <Icon size={12} strokeWidth={1.8} aria-hidden="true" />
                        {social.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div className="hairline my-8" />

        <div className="flex flex-col gap-2 text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em]">
            {t("footer.built", { year })}
          </p>
          <div className="flex items-center gap-4">
            <p className="font-mono text-[0.58rem] uppercase tracking-[0.14em]">{t("footer.made")}</p>
            <button
              type="button"
              onClick={backToTop}
              className="inline-flex items-center gap-1 font-mono text-[0.58rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-accent-2"
            >
              {en ? "Back to top" : "Balik ke atas"}
              <ArrowUp size={11} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
