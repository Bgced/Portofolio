"use client";

import { Briefcase, Camera, Mail, MessageCircle } from "lucide-react";
import { NAV_LINKS, PROFILE, SOCIALS } from "@/lib/content";

const ICONS = {
  mail: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  instagram: Camera,
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-4 border-t border-line-soft bg-canvas">
      <div className="mx-auto w-full max-w-[1180px] px-4 py-10 sm:px-7 sm:py-12">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          {/* identitas */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              <span className="relative grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 font-mono text-[0.72rem] font-semibold text-accent">
                CK
                <span className="absolute -right-1 -top-1 h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[0.78rem] font-semibold tracking-[0.22em] text-ink">CEKAEL</span>
                <span className="mono-label mt-1 text-[0.55rem]">{PROFILE.major}</span>
              </div>
            </div>
            <p className="mt-4 text-[0.82rem] leading-relaxed text-muted">
              Kode, sirkuit, dan visual 3D di satu markas digital.
            </p>
            <p className="mono-label mt-4 text-[0.58rem] leading-relaxed">
              {PROFILE.location}
            </p>
          </div>

          {/* nav + social */}
          <div className="grid grid-cols-2 gap-8 sm:gap-14">
            <nav aria-label="Navigasi footer">
              <p className="mono-label mb-3">Peta</p>
              <ul className="flex flex-col gap-2">
                {NAV_LINKS.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className="text-[0.8rem] text-muted transition-colors hover:text-accent"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div>
              <p className="mono-label mb-3">Sinyal</p>
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
          <span className="text-accent">$</span> echo &quot;mksh udah mampir&quot;
          <span className="caret" aria-hidden="true" />
        </p>

        <div className="mt-6 flex flex-col gap-2 text-[0.72rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>Dibuat oleh Cedric Kilian</p>
          <p className="mono-label text-[0.58rem]">Universitas Negeri Yogyakarta · Electrical Engineering</p>
        </div>

        <div className="mt-4 flex flex-col gap-1 text-[0.66rem] text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="mono-label text-[0.55rem]">© {year} CEK-2026 · All systems nominal</p>
          <p className="mono-label text-[0.55rem]">Built with Next.js &amp; Tailwind</p>
        </div>
      </div>
    </footer>
  );
}
