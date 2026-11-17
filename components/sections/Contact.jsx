"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Briefcase,
  Camera,
  Check,
  Copy,
  Mail,
  MessageCircle,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { PROFILE, SOCIALS } from "@/lib/content";

const ICONS = {
  mail: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  instagram: Camera,
};

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const copyEmail = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(PROFILE.email);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      // fallback buat browser / konteks non-secure yang blokir clipboard API
      const field = document.createElement("textarea");
      try {
        field.value = PROFILE.email;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        if (field.parentNode) field.parentNode.removeChild(field);
      }
    }

    if (!ok) return;
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section id="contact" className="section-shell">
      <SectionHeading
        index="05"
        kicker="kontak"
        title="Ide lo bagus?"
        accent="Gas ngobrol."
        intro="Kolaborasi, magang, project freelance, atau sekadar nanya soal elektro dan web — semua boleh."
      />

      <Reveal>
        <div className="panel corner-frame relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 12% 0%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 70%)",
            }}
          />

          <div className="relative grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* CTA */}
            <div className="p-5 sm:p-7 lg:p-9">
              <p className="eyebrow">sinyal terbuka</p>
              <h3 className="mt-4 max-w-[22ch] text-[clamp(1.6rem,3.4vw,2.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-ink">
                Punya rencana? <span className="text-gradient">Kirim brief-nya.</span>
              </h3>
              <p className="mt-3 max-w-[46ch] text-[0.88rem] leading-relaxed text-muted">
                Ceritain aja idenya, mau rapi atau masih acak-acakan. Gue bales dengan pertanyaan
                yang jelas, bukan template.
              </p>

              <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a href={`mailto:${PROFILE.email}`} className="btn btn-primary w-full sm:w-auto">
                  <Mail size={15} aria-hidden="true" />
                  Kirim Email
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-live="polite"
                  className="btn btn-ghost w-full sm:w-auto"
                >
                  {copied ? (
                    <Check size={15} aria-hidden="true" className="text-ok" />
                  ) : (
                    <Copy size={15} aria-hidden="true" />
                  )}
                  {copied ? "Email kesalin!" : "Copy email"}
                </button>
              </div>

              <p className="mt-4 font-mono text-[0.68rem] tracking-[0.06em] text-muted">
                {PROFILE.email}
              </p>

              <p className="mono-label mt-6 text-[0.52rem] leading-relaxed">
                biasanya bales &lt; 24 jam · senin–sabtu
              </p>
            </div>

            {/* socials + status */}
            <div className="border-t border-line-soft p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
              <div className="flex items-center gap-2.5 rounded-lg border border-ok/30 bg-surface-2 px-3 py-3">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="pulse-dot absolute inset-0 rounded-full bg-ok" />
                </span>
                <div>
                  <p className="text-[0.78rem] font-semibold text-ink">Open buat kolaborasi</p>
                  <p className="mt-0.5 text-[0.68rem] text-muted">
                    magang · freelance · project bareng
                  </p>
                </div>
              </div>

              <ul className="mt-4 flex flex-col gap-1.5">
                {SOCIALS.map((social) => {
                  const Icon = ICONS[social.icon] ?? Mail;
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-2 transition-colors hover:border-line-soft hover:bg-surface-2"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line-soft text-muted transition-colors group-hover:border-line group-hover:text-accent">
                          <Icon size={13} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted">
                            {social.label}
                          </span>
                          <span className="block truncate text-[0.78rem] text-ink transition-colors group-hover:text-accent">
                            {social.value}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className="shrink-0 text-muted transition-transform group-hover:-translate-y-0.5 group-hover:text-accent"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-4 rounded-lg border border-line-soft bg-surface-2 p-3 font-mono text-[0.62rem] leading-relaxed text-muted">
                <p>
                  <span className="text-accent">$</span> ping cedric --channel=email
                </p>
                <p className="mt-1 text-ok">→ latency 0.9*24h · packet loss 0%</p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
