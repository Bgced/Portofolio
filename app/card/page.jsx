import { Suspense } from "react";
import CardView from "@/components/card/CardView";

export const metadata = {
  title: "Kartu Ucapan — Cekael",
  description: "Kartu ucapan digital dari Cekael. Scan QR, baca pesannya, senyum dikit.",
};

function CardSkeleton() {
  return (
    <div className="flex min-h-[100svh] items-center justify-center bg-[#12100E]">
      <div className="w-full max-w-[34rem] px-4">
        <div className="animate-pulse rounded-[1.6rem] border border-[#D48C55]/20 bg-[#0b0e11] p-8">
          <div className="h-5 w-28 rounded-full bg-surface-2" />
          <div className="mt-10 h-3 w-16 rounded bg-surface-2" />
          <div className="mt-3 h-10 w-2/3 rounded bg-surface-2" />
          <div className="mt-8 space-y-2.5">
            <div className="h-3 w-full rounded bg-surface-2" />
            <div className="h-3 w-11/12 rounded bg-surface-2" />
            <div className="h-3 w-3/4 rounded bg-surface-2" />
          </div>
          <div className="mt-10 h-px w-full bg-surface-2" />
          <div className="mt-4 h-3 w-24 rounded bg-surface-2" />
        </div>
        <p className="mt-4 text-center font-mono text-[0.6rem] uppercase tracking-[0.2em] text-[#9C948A]">
          buka kartunya…
        </p>
      </div>
    </div>
  );
}

export default function CardPage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <CardView />
    </Suspense>
  );
}
