export type CardThemeId = "clay" | "espresso" | "olive";

export type CardTheme = {
  id: CardThemeId;
  label: string;
  accent: string;
  accent2: string;
  border: string;
  borderSoft: string;
  soft: string;
  glow: string;
  cardBg: string;
  pageBg: string;
  grid: string;
  muted: string;
};

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  clay: {
    id: "clay",
    label: "Terracotta Clay",
    accent: "#C88A55",
    accent2: "#E0A878",
    border: "rgba(200, 138, 85, 0.34)",
    borderSoft: "rgba(242, 239, 233, 0.10)",
    soft: "rgba(200, 138, 85, 0.14)",
    glow: "rgba(200, 138, 85, 0.35)",
    cardBg: "rgba(31, 28, 25, 0.92)",
    pageBg: "#161412",
    grid: "rgba(200, 138, 85, 0.06)",
    muted: "#A39B91",
  },
  espresso: {
    id: "espresso",
    label: "Espresso Cream",
    accent: "#7C4A2D",
    accent2: "#B9764A",
    border: "rgba(124, 74, 45, 0.34)",
    borderSoft: "rgba(35, 31, 32, 0.10)",
    soft: "rgba(124, 74, 45, 0.10)",
    glow: "rgba(124, 74, 45, 0.28)",
    cardBg: "rgba(247, 244, 239, 0.96)",
    pageBg: "#F7F4EF",
    grid: "rgba(92, 58, 33, 0.06)",
    muted: "#6E665F",
  },
  olive: {
    id: "olive",
    label: "Olive Sand",
    accent: "#5E6B3F",
    accent2: "#A8B878",
    border: "rgba(94, 107, 63, 0.32)",
    borderSoft: "rgba(35, 31, 32, 0.10)",
    soft: "rgba(94, 107, 63, 0.12)",
    glow: "rgba(94, 107, 63, 0.25)",
    cardBg: "rgba(249, 247, 241, 0.96)",
    pageBg: "#F5F2EA",
    grid: "rgba(94, 107, 63, 0.06)",
    muted: "#6B6A5C",
  },
};

export const CARD_THEME_IDS = Object.keys(CARD_THEMES) as CardThemeId[];
export const CARD_THEME_LIST = CARD_THEME_IDS.map((id) => CARD_THEMES[id]);

export function isCardThemeId(value: unknown): value is CardThemeId {
  return typeof value === "string" && value in CARD_THEMES;
}

export function resolveCardTheme(value: string | null | undefined): CardTheme {
  return isCardThemeId(value) ? CARD_THEMES[value] : CARD_THEMES.clay;
}
