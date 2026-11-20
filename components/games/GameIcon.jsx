"use client";

import {
  Bot,
  Calculator,
  Grid3x3,
  Hand,
  HeartPulse,
  Layers,
  Keyboard,
  QrCode,
  Square,
  Sparkles,
  Target,
  Timer,
  Trophy,
} from "lucide-react";

/** Ikon per kartrid; satu peta kecil biar data game tetap JSON-friendly. */
const ICONS = {
  snake: Target,
  tiles: Layers,
  grid: Grid3x3,
  hand: Hand,
  bird: Sparkles,
  blocks: Square,
  cards: Trophy,
  hammer: Timer,
  letters: Keyboard,
  qr: QrCode,
  calc: Calculator,
  bmi: HeartPulse,
  ai: Bot,
};

export default function GameIcon({ name, size = 16, className = "" }) {
  const Icon = ICONS[name] ?? Square;
  return <Icon size={size} strokeWidth={1.8} className={className} aria-hidden="true" />;
}
