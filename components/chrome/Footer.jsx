"use client";

import { useEffect, useState } from "react";
import { ArrowUp, Briefcase, Camera, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS, PROFILE, SOCIALS } from "@/lib/content";
import { useLang } from "@/components/providers";

const ICONS = {
  mail: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  instagram: Camera,
};

export default function Footer() {
  // Render tahun build dulu, lalu sinkronkan di client → nggak ada hydration mismatch saat ganti tahun.
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
    <footer className="relative z-10 mt-4 border-t border-line-soft bg-canvas">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* identitas */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center border border-line bg-surface-2 font-mono text-[0.72rem] font-semibold text-accent">
                CK
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[0.9rem] font-semibold text-ink">Cedric Kilian</span>
                <span className="mono-label mt-1 text-[0.55rem]">{PROFILE.major}</span>
              </div>
            </div>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-muted">
              {en
                ? "Code, circuits and 3D visuals, all on one screen."
                : "Ngoding, ngulik sirkuit, dan main 3D di satu layar."}
            </p>
            <p className="mt-3 inline-flex items-center gap-2 border border-line px-2.5 py-1 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted">
              {en ? "Open to work" : "Buka buat kerja bareng"}
            </p>
          </div>

          {/* nav + social */}
          <div className="grid grid-cols-2 gap-8 sm:gap-14">
            <nav aria-label="Navigasi footer">
              <p className="mono-label mb-3">{en ? "Sections" : "Section"}</p>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="text-[0.8rem] text-muted transition-colors hover:text-accent"
                    >
                      {t(`nav.${link.id}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="mono-label mb-3">{en ? "Elsewhere" : "Di tempat lain"}</p>
              <ul className="flex flex-col gap-2">
                {SOCIALS.map((social) => {
                  const Icon = ICONS[social.icon] ?? Mail;
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...(external
                          ? { target: "_blank", rel: "noopener noreferrer" }
                          : {})}
                        className="group flex items-center gap-2 text-[0.8rem] text-muted transition-colors hover:text-accent"
                      >
                        <Icon size={13} strokeWidth={1.8} aria-hidden="true" />
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

        {/* terminal sign-off */}
        <p className="font-mono text-[0.62rem] leading-relaxed text-muted">
          {en ? "Thanks for scrolling this far." : "Makasih udah scroll sampai sini."}
          <span className="caret" aria-hidden="true" />
        </p>

        <div className="mt-6 flex flex-col gap-2 text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>{t("footer.made")}</p>
          <p className="mono-label text-[0.58rem]">{t("footer.uni")}</p>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-[0.66rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-[0.55rem]">© {year} Cedric Kilian</p>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <p className="mono-label text-[0.55rem]">{t("footer.built")}</p>
            <button
              type="button"
              onClick={backToTop}
              className="group inline-flex items-center gap-1 font-mono text-[0.55rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent"
            >
              {en ? "Back to Top" : "Balik ke Atas"}
              <ArrowUp size={11} aria-hidden="true" className="transition-colors" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
