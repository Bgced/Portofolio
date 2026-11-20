"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Download, Loader2, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { toPng } from "html-to-image";
import { decodePayload } from "@/lib/qr";
import {
  CARD_THEME_LIST,
  resolveCardTheme,
  type CardTheme,
  type CardThemeId,
} from "@/lib/card-themes";
import { useToast } from "@/components/ui/ToastProvider";
import { useLang } from "@/components/providers";

type CardData = {
  name: string;
  sender: string;
  event: string;
  message: string;
};

function fireConfetti(reduced: boolean, colors: string[]): (() => void) | undefined {
  if (reduced) return undefined;
  confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors, scalar: 0.9 });
  const timer = window.setTimeout(() => {
    confetti({ particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors });
    confetti({ particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors });
  }, 240);
  return () => window.clearTimeout(timer);
}

function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40) || "cekael"
  );
}

function EmptyState({ en }: { en: boolean }) {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
      </div>
      <div className="relative w-full max-w-md border border-line bg-surface p-7 text-left">
        <span className="flex h-11 w-11 items-center justify-center border border-line bg-surface-2">
          <Sparkles size={20} className="text-accent" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-ink">
          {en ? "Card not found" : "Kartunya belum ketemu"}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {en
            ? "The QR link is empty or broken. No worries, you can make a new greeting card in seconds."
            : "Link QR-nya kosong atau rusak. Tenang, lo bisa bikin kartu ucapan baru dalam hitungan detik."}
        </p>
        <Link href="/#playground" className="btn btn-primary mt-6 w-full">
          {en ? "Make a greeting QR" : "Bikin QR Ucapan"}
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

function ThemeSwatch({
  theme,
  active,
  onSelect,
}: {
  theme: CardTheme;
  active: boolean;
  onSelect: (id: CardThemeId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(theme.id)}
      aria-pressed={active}
      title={theme.label}
      className="inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.1em] transition-colors"
      style={{
        borderColor: active ? theme.accent : "rgba(233,246,250,0.14)",
        backgroundColor: active ? theme.soft : "rgba(233,246,250,0.04)",
        color: active ? theme.accent : "var(--muted)",
      }}
    >
      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{ backgroundColor: theme.accent }}
        aria-hidden="true"
      />
      {theme.label}
    </button>
  );
}

export default function CardView() {
  const params = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const { lang } = useLang();
  const en = lang === "en";
  const done = useRef(false);
  const cardRef = useRef<HTMLElement>(null);
  const [saving, setSaving] = useState(false);

  const data = useMemo<CardData | null>(() => {
    const raw = decodePayload(params.get("d")) as Record<string, unknown> | null;
    if (!raw || typeof raw !== "object") return null;
    const name = typeof raw.n === "string" ? raw.n.slice(0, 80) : "";
    const sender = typeof raw.s === "string" ? raw.s.slice(0, 80) : "";
    const event = typeof raw.e === "string" ? raw.e.slice(0, 80) : "";
    const message = typeof raw.m === "string" ? raw.m.slice(0, 600) : "";
    if (!message && !name) return null;
    return { name, sender, event, message };
  }, [params]);

  const theme = useMemo(() => resolveCardTheme(params.get("t")), [params]);

  useEffect(() => {
    if (!data || done.current) return undefined;
    done.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fireConfetti(reduced, [theme.accent, theme.accent2]);
  }, [data, theme]);

  const selectTheme = useCallback(
    (id: CardThemeId) => {
      const next = new URLSearchParams(params.toString());
      next.set("t", id);
      router.replace(`/card?${next.toString()}`, { scroll: false });
    },
    [params, router]
  );

  const saveCard = useCallback(async () => {
    if (!cardRef.current || !data || saving) return;
    setSaving(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: theme.pageBg,
      });
      const link = document.createElement("a");
      link.download = `kartu-${slugify(data.name)}-${theme.id}.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast({
        title: en ? "Card saved as PNG" : "Kartu tersimpan jadi PNG",
        description: en
          ? `${slugify(data.name)}-${theme.id}.png · ready for your phone gallery`
          : `${slugify(data.name)}-${theme.id}.png · siap di-share ke galeri HP`,
        variant: "success",
      });
    } catch {
      toast({
        title: en ? "Couldn't save the card" : "Gagal nyimpen kartu",
        description: en
          ? "Try again in a moment, or screenshot the card for now."
          : "Coba lagi sebentar, atau screenshot aja dulu kartunya.",
        variant: "error",
      });
    } finally {
      setSaving(false);
    }
  }, [data, en, saving, theme, toast]);

  if (!data) return <EmptyState en={en} />;

  return (
    <div
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 py-14 transition-colors duration-300 sm:px-6"
      style={{ backgroundColor: theme.pageBg }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      </div>

      <article
        ref={cardRef}
        className="relative w-full max-w-[34rem] overflow-hidden border border-line p-1.5"
        style={{
          borderColor: theme.border,
          backgroundColor: theme.cardBg,
        }}
      >
        <div
          className="border px-5 py-7 sm:px-9 sm:py-9"
          style={{
            borderColor: theme.borderSoft,
            backgroundColor: theme.soft,
          }}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className="inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em]"
              style={{ borderColor: theme.border, backgroundColor: theme.soft, color: theme.accent }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: theme.accent }}
                aria-hidden="true"
              />
              {data.event || (en ? "Greeting Card" : "Kartu Ucapan")}
            </span>
            <span
              className="font-mono text-[0.58rem] uppercase tracking-[0.18em]"
              style={{ color: theme.muted }}
            >
              {en ? "card" : "kartu"}
            </span>
          </div>

          <p
            className="mt-8 font-mono text-[0.64rem] uppercase tracking-[0.22em]"
            style={{ color: theme.muted }}
          >
            {en ? "To" : "Untuk"}
          </p>
          <h1 className="mt-2 break-words text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#E9F6FA]">
            {data.name}
          </h1>

          <div
            className="my-6 h-px w-full"
            style={{ backgroundColor: theme.borderSoft }}
            aria-hidden="true"
          />

          <p className="whitespace-pre-wrap break-words text-[0.98rem] leading-relaxed text-[#E9F6FA] sm:text-[1.05rem]">
            {data.message}
          </p>

          <div
            className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t pt-5"
            style={{ borderColor: theme.borderSoft }}
          >
            <div className="min-w-0">
              <p
                className="font-mono text-[0.58rem] uppercase tracking-[0.2em]"
                style={{ color: theme.muted }}
              >
                {en ? "From" : "Dari"}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-[#E9F6FA]">
                {data.sender || "Cedric Kilian"}
              </p>
            </div>
            <p
              className="font-mono text-[0.56rem] uppercase tracking-[0.16em] opacity-70"
              style={{ color: theme.muted }}
            >
              {en ? "made at cekael.vercel.app" : "dibuat di cekael.vercel.app"}
            </p>
          </div>
        </div>
      </article>

      {/* toolbar: theme + save */}
      <div className="relative mt-4 flex w-full max-w-[34rem] flex-col gap-2.5 border border-line bg-canvas p-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5">
          {CARD_THEME_LIST.map((item) => (
            <ThemeSwatch key={item.id} theme={item} active={item.id === theme.id} onSelect={selectTheme} />
          ))}
        </div>
        <button
          type="button"
          onClick={saveCard}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 border px-3.5 py-2 font-mono text-[0.6rem] uppercase tracking-[0.12em] transition-opacity disabled:opacity-60"
          style={{ backgroundColor: theme.accent, color: "#04141A" }}
        >
          {saving ? (
            <Loader2 size={12} className="animate-spin" aria-hidden="true" />
          ) : (
            <Download size={12} aria-hidden="true" />
          )}
          {saving ? (en ? "Rendering PNG…" : "Nyiapin PNG…") : en ? "Save Card (PNG)" : "Simpan Kartu (PNG)"}
        </button>
      </div>

      <Link
        href="/#playground"
        className="relative mt-4 inline-flex items-center gap-2 border border-line bg-canvas px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink"
      >
        {en ? "Make your own QR card" : "Bikin QR kartu lo sendiri"}
        <ArrowRight size={12} aria-hidden="true" style={{ color: theme.accent }} />
      </Link>
    </div>
  );
}
