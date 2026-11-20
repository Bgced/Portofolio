"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import {
  ArrowUpRight,
  Briefcase,
  Camera,
  Check,
  Copy,
  Mail,
  MessageCircle,
  QrCode,
  X,
} from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactForm from "@/components/sections/ContactForm";
import { PROFILE, SOCIALS } from "@/lib/content";
import { useLang } from "@/components/providers";
import { useToast } from "@/components/ui/ToastProvider";

const ICONS = {
  mail: Mail,
  whatsapp: MessageCircle,
  linkedin: Briefcase,
  instagram: Camera,
};

const VCARD = [
  "BEGIN:VCARD",
  "VERSION:3.0",
  "N:Lasmana;Cedric Kilian;;;",
  "FN:Cedric Kilian",
  "ORG:Universitas Negeri Yogyakarta",
  "TITLE:Front-End Developer",
  "TEL;TYPE=CELL:+628972007113",
  "EMAIL:cekaell3@gmail.com",
  "URL:https://cekael.vercel.app",
  "END:VCARD",
].join("\n");

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const timerRef = useRef(null);
  const { t, lang } = useLang();
  const { toast } = useToast();
  const en = lang === "en";

  useEffect(() => () => clearTimeout(timerRef.current), []);

  useEffect(() => {
    if (!qrOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setQrOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [qrOpen]);

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

    if (!ok) {
      toast({
        title: en ? "Couldn't copy the email" : "Gagal nyalin email",
        description: PROFILE.email,
        variant: "error",
      });
      return;
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2200);
    toast({
      title: en ? "Email copied!" : "Email tersalin!",
      description: PROFILE.email,
      variant: "success",
    });
  };

  return (
    <section id="contact" className="section-shell">
      <SectionHeading
        index="06"
        kicker={t("contact.kicker")}
        title={t("contact.title")}
        accent={t("contact.accent")}
        intro={t("contact.intro")}
      />

      <div className="panel relative overflow-hidden">
        <div className="relative grid lg:grid-cols-[0.92fr_1.08fr]">
          {/* kiri: direct + socials */}
          <div className="flex flex-col p-5 sm:p-7 lg:p-9">
            <p className="eyebrow">{t("contact.coin")}</p>

            <p className="mt-4 text-[0.86rem] leading-relaxed text-muted">{t("contact.reply")}</p>

              <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
                <a href={`mailto:${PROFILE.email}`} className="btn btn-primary w-full sm:w-auto">
                  <Mail size={15} aria-hidden="true" />
                  {t("contact.send")}
                </a>
                <a
                  href={`${PROFILE.whatsapp}?text=${encodeURIComponent(
                    en ? "Hi Cekael, I saw your portfolio and wanted to talk." : "Halo Cekael, gue liat portfolio lo dan mau ngobrol."
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost w-full sm:w-auto"
                >
                  <MessageCircle size={15} aria-hidden="true" className="text-accent" />
                  WhatsApp
                </a>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" onClick={copyEmail} aria-live="polite" className="btn btn-ghost !px-3 !py-2 !text-[0.74rem]">
                  {copied ? <Check size={13} aria-hidden="true" className="text-ok" /> : <Copy size={13} aria-hidden="true" />}
                  {copied ? (en ? "Copied!" : "Tersalin! ✅") : en ? "Copy email" : "Copy Email"}
                </button>
                <button type="button" onClick={() => setQrOpen(true)} className="btn btn-ghost !px-3 !py-2 !text-[0.74rem]">
                  <QrCode size={13} aria-hidden="true" className="text-accent" />
                  {en ? "Scan my contact QR" : "Scan QR Kontak"}
                </button>
              </div>

              <p className="mt-4 break-all font-mono text-[0.68rem] tracking-[0.04em] text-muted">{PROFILE.email}</p>
              <p className="mono-label mt-2 text-[0.52rem] leading-relaxed">{t("contact.reply")}</p>

              <ul className="mt-5 flex flex-col gap-1.5 border-t border-line-soft pt-4">
                {SOCIALS.map((social) => {
                  const Icon = ICONS[social.icon] ?? Mail;
                  const external = social.href.startsWith("http");
                  return (
                    <li key={social.label}>
                      <a
                        href={social.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="group flex items-center gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:border-line-soft hover:bg-surface-2"
                      >
                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md border border-line-soft text-muted transition-colors group-hover:border-line group-hover:text-accent">
                          <Icon size={13} aria-hidden="true" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block font-mono text-[0.55rem] uppercase tracking-[0.18em] text-muted">
                            {social.label}
                          </span>
                          <span className="block truncate text-[0.76rem] text-ink transition-colors group-hover:text-accent">
                            {social.value}
                          </span>
                        </span>
                        <ArrowUpRight
                          size={12}
                          aria-hidden="true"
                          className="shrink-0 text-muted transition-colors group-hover:text-accent"
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* kanan: form */}
            <div className="border-t border-line-soft p-5 sm:p-7 lg:border-l lg:border-t-0 lg:p-9">
              <ContactForm />
            </div>
        </div>
      </div>

      {/* modal QR kontak */}
      {qrOpen ? (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-canvas p-4 "
          role="dialog"
          aria-modal="true"
          aria-label={en ? "Contact QR code" : "QR kontak Cekael"}
          onClick={(event) => {
            if (event.target === event.currentTarget) setQrOpen(false);
          }}
        >
          <div className="relative w-full max-w-sm border border-line bg-surface p-5 text-center">
            <button
              type="button"
              onClick={() => setQrOpen(false)}
              aria-label={en ? "Close QR" : "Tutup QR"}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-line-soft text-muted transition-colors hover:border-line hover:text-ink"
            >
              <X size={14} aria-hidden="true" />
            </button>

            <p className="mono-label">{en ? "contact card" : "kartu kontak"}</p>
            <h3 className="mt-2 text-lg font-semibold text-ink">{PROFILE.name}</h3>
            <p className="mt-1 text-[0.76rem] text-muted">{PROFILE.role}</p>

            <div className="mx-auto mt-4 w-fit border border-line bg-white p-3">
              <QRCodeCanvas value={VCARD} size={208} level="M" marginSize={4} bgColor="#FFFFFF" fgColor="#000000" />
            </div>

            <p className="mt-3 font-mono text-[0.6rem] leading-relaxed text-muted">
              {en ? "Scan with your phone camera to save the contact." : "Scan pakai kamera HP buat simpan kontaknya."}
            </p>

            <div className="mt-4 flex flex-col gap-2">
              <Link href="/#playground" onClick={() => setQrOpen(false)} className="btn btn-primary w-full !py-2.5 !text-[0.76rem]">
                <QrCode size={13} aria-hidden="true" />
                {en ? "Open QR Studio" : "Buka QR Studio"}
              </Link>
              <a href={PROFILE.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-ghost w-full !py-2.5 !text-[0.76rem]">
                <MessageCircle size={13} aria-hidden="true" className="text-accent" />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
