"use client";

import { useState } from "react";
import { useLang } from "@/components/providers";
import SectionHeading from "@/components/SectionHeading";
import { PROFILE } from "@/lib/content";
import Reveal from "@/components/Reveal";
import {
  CheckIcon,
  CopyIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  WhatsAppIcon,
} from "@/components/Icons";
import { sfx } from "@/lib/sfx";

const LINKS = [
  { href: `mailto:${PROFILE.email}`, label: PROFILE.email, Icon: MailIcon, copy: true },
  { href: PROFILE.whatsapp, label: PROFILE.phone, Icon: WhatsAppIcon },
  { href: PROFILE.linkedin, label: "Cedric Kilian Lasmana", Icon: LinkedInIcon },
  { href: PROFILE.instagram, label: "@cekaaell", Icon: InstagramIcon },
];

export default function Contact() {
  const { t } = useLang();
  const [copied, setCopied] = useState(false);

  const copyEmail = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await navigator.clipboard.writeText(PROFILE.email);
      setCopied(true);
      sfx.play("match");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — the mailto link still works */
    }
  };

  return (
    <section id="contact" className="section-shell scroll-mt-20">
      <SectionHeading index="08" kicker="contact" title={t("contact.title")} intro={t("contact.intro")} />

      <Reveal>
        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-cyan-400/20 bg-gradient-to-r from-cyan-400/10 via-slate-900/40 to-transparent p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-cyan-400/30 bg-slate-950/60 text-cyan-300">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4c-1.4 0-2.8-.3-4-.9L3 21l2-5.5a8.4 8.4 0 1 1 16-4z" />
              </svg>
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-100">{t("contact.feedbackTitle")}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{t("contact.feedbackDesc")}</p>
            </div>
          </div>
          <a
            href={`mailto:${PROFILE.email}?subject=Kritik%20dan%20Saran%20Website%20Portofolio`}
            className="shrink-0 rounded-lg bg-cyan-400 px-3 py-2 text-[11px] font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            {t("contact.feedbackBtn")}
          </a>
        </div>
      </Reveal>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <Reveal>
          <ul className="grid gap-2 sm:grid-cols-2">
            {LINKS.map(({ href, label, Icon, copy }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith("mailto") ? undefined : "_blank"}
                  rel={href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                  className="group flex h-full items-center gap-3 rounded-lg border border-slate-800/80 bg-slate-900/35 px-3 py-3 transition hover:border-cyan-400/35 hover:bg-slate-900/60"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md border border-slate-700/70 bg-slate-950/50 text-slate-400 transition group-hover:border-cyan-400/30 group-hover:text-cyan-300">
                    <Icon width={15} height={15} />
                  </span>
                  <span className="min-w-0 flex-1 truncate text-xs text-slate-300">{label}</span>
                  {copy && (
                    <button
                      type="button"
                      onClick={copyEmail}
                      aria-label="copy email"
                      className="grid h-6 w-6 place-items-center rounded text-slate-500 transition hover:text-cyan-300"
                    >
                      {copied ? <CheckIcon width={13} height={13} /> : <CopyIcon width={13} height={13} />}
                    </button>
                  )}
                </a>
              </li>
            ))}
          </ul>
          {copied && <p className="mt-2 font-mono text-[10px] text-emerald-400">{t("contact.copied")}</p>}
        </Reveal>

        <Reveal delay={0.08}>
          <div className="relative h-full overflow-hidden rounded-xl border border-slate-800/80 bg-slate-950/60 p-4">
            <div className="absolute inset-0 grid-texture opacity-25" aria-hidden="true" />
            <div className="relative font-mono text-[11px] leading-relaxed text-slate-400">
              <p className="text-slate-600">$ whoami</p>
              <p className="text-cyan-300">cedric_kilian</p>
              <p className="mt-2 text-slate-600">$ status</p>
              <p className="text-emerald-300">open_to_work · yogyakarta, id</p>
              <p className="mt-2 text-slate-600">$ focus</p>
              <p className="text-slate-300">electrical engineering × web</p>
              <p className="mt-3 flex items-center gap-2 text-[10px] text-slate-500">
                <span className="h-1 w-1 animate-pulse rounded-full bg-emerald-400" /> usually replies within a day
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
