"use client";

import dynamic from "next/dynamic";

/**
 * Tool curated, dimuat lazy (ssr:false) biar bundle awal tetap kecil.
 * Dipakai bareng GameModal dan halaman /play/[slug].
 */
export const TOOL_COMPONENTS = {
  qr: dynamic(() => import("@/components/playground/QrStudio"), { ssr: false }),
  calc: dynamic(() => import("@/components/playground/CyberCalc"), { ssr: false }),
  bmi: dynamic(() => import("@/components/playground/BmiCalc"), { ssr: false }),
  ai: dynamic(() => import("@/components/playground/CekaelAI"), { ssr: false }),
};

export function getToolComponent(id) {
  return TOOL_COMPONENTS[id] ?? null;
}