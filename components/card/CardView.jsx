"use client";

import { useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { decodePayload } from "@/lib/qr";

function fireConfetti(reduced) {
  if (reduced) return;
  const colors = ["#00F0FF", "#7DF9FF", "#F8FAFC", "#0284C7"];
  confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 }, colors, scalar: 0.9 });
  const timer = setTimeout(() => {
    confetti({ particleCount: 55, angle: 60, spread: 60, origin: { x: 0, y: 0.75 }, colors });
    confetti({ particleCount: 55, angle: 120, spread: 60, origin: { x: 1, y: 0.75 }, colors });
  }, 240);
  return () => clearTimeout(timer);
}

function EmptyState() {
  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-5 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#00F0FF]/12 blur-[130px]" />
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-[#00F0FF]/25 bg-[#0d1013]/80 p-7 text-center backdrop-blur-xl">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[#00F0FF]/30 bg-[#00F0FF]/10">
          <Sparkles size={20} className="text-[#00F0FF]" aria-hidden="true" />
        </span>
        <h1 className="mt-5 text-xl font-semibold tracking-tight text-[#F8FAFC]">Kartunya belum ketemu</h1>
        <p className="mt-2 text-sm leading-relaxed text-[#94A3B8]">
          Link QR-nya kosong atau rusak. Tenang, kamu bisa bikin kartu ucapan baru dalam hitungan detik.
        </p>
        <Link href="/#playground" className="btn btn-primary mt-6 w-full">
          Bikin QR Ucapan
          <ArrowRight size={14} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

export default function CardView() {
  const params = useSearchParams();
  const done = useRef(false);

  const data = useMemo(() => {
    const payload = decodePayload(params.get("d"));
    if (!payload || typeof payload !== "object") return null;
    const name = typeof payload.n === "string" ? payload.n.slice(0, 80) : "";
    const sender = typeof payload.s === "string" ? payload.s.slice(0, 80) : "";
    const event = typeof payload.e === "string" ? payload.e.slice(0, 80) : "";
    const message = typeof payload.m === "string" ? payload.m.slice(0, 600) : "";
    if (!message && !name) return null;
    return { name, sender, event, message };
  }, [params]);

  useEffect(() => {
    if (!data || done.current) return undefined;
    done.current = true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return fireConfetti(reduced);
  }, [data]);

  if (!data) return <EmptyState />;

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-4 py-14 sm:px-6">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute left-1/2 top-1/4 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[#00F0FF]/14 blur-[150px]" />
        <div className="absolute -right-24 bottom-0 h-[360px] w-[360px] rounded-full bg-[#0284C7]/18 blur-[130px]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.045)_1px,transparent_1px)] [background-size:54px_54px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent_78%)]" />
      </div>

      <article className="relative w-full max-w-[34rem] overflow-hidden rounded-[1.6rem] border border-[#00F0FF]/28 bg-[#0b0e11]/72 p-1.5 shadow-[0_40px_120px_-40px_rgba(0,240,255,0.45)] backdrop-blur-2xl">
        <div className="rounded-[1.35rem] border border-white/8 bg-[radial-gradient(120%_120%_at_0%_0%,rgba(0,240,255,0.11),transparent_55%)] px-5 py-7 sm:px-9 sm:py-9">
          <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#00F0FF]/30 bg-[#00F0FF]/10 px-2.5 py-1 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-[#00F0FF]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00F0FF]" aria-hidden="true" />
              {data.event || "Kartu Ucapan"}
            </span>
            <span className="font-mono text-[0.58rem] uppercase tracking-[0.18em] text-[#94A3B8]">ck · card</span>
          </div>

          <p className="mt-8 font-mono text-[0.64rem] uppercase tracking-[0.22em] text-[#94A3B8]">Untuk</p>
          <h1 className="mt-2 break-words text-[clamp(2rem,8vw,3rem)] font-semibold leading-[1.02] tracking-[-0.04em] text-[#F8FAFC]">
            {data.name}
          </h1>

          <div className="my-6 h-px w-full bg-gradient-to-r from-[#00F0FF]/60 via-[#00F0FF]/15 to-transparent" aria-hidden="true" />

          <p className="whitespace-pre-wrap break-words text-[0.98rem] leading-relaxed text-[#E2E8F0] sm:text-[1.05rem]">
            {data.message}
          </p>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/8 pt-5">
            <div className="min-w-0">
              <p className="font-mono text-[0.58rem] uppercase tracking-[0.2em] text-[#94A3B8]">Dari</p>
              <p className="mt-1 break-words text-sm font-semibold text-[#F8FAFC]">{data.sender || "Cekael"}</p>
            </div>
            <p className="font-mono text-[0.56rem] uppercase tracking-[0.16em] text-[#94A3B8]/70">dibuat di cekael.vercel.app</p>
          </div>
        </div>
      </article>

      <div className="absolute inset-x-0 bottom-5 flex justify-center px-4">
        <Link
          href="/#playground"
          className="group inline-flex items-center gap-2 rounded-full border border-[#00F0FF]/25 bg-[#0d1013]/80 px-4 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-[#94A3B8] backdrop-blur-xl transition-colors hover:border-[#00F0FF]/50 hover:text-[#F8FAFC]"
        >
          Bikin QR kartu kamu sendiri
          <ArrowRight size={12} aria-hidden="true" className="text-[#00F0FF] transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
}
