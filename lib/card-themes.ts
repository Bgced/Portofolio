export type CardThemeId = "hitam" | "cyan" | "putih";

export type CardTheme = {
  id: CardThemeId;
  label: string;
  accent: string;
  accent2: string;
  border: string;
  borderSoft: string;
  soft: string;
  cardBg: string;
  pageBg: string;
  grid: string;
  muted: string;
};

export const CARD_THEMES: Record<CardThemeId, CardTheme> = {
  hitam: {
    id: "hitam",
    label: "Hitam",
    accent: "#E9EAEA",
    accent2: "#8C9399",
    border: "rgba(233, 234, 234, 0.24)",
    borderSoft: "rgba(233, 234, 234, 0.10)",
    soft: "rgba(233, 234, 234, 0.08)",
    cardBg: "#0A0B0C",
    pageBg: "#0A0B0C",
    grid: "rgba(233, 234, 234, 0.05)",
    muted: "#8C9399",
  },
  cyan: {
    id: "cyan",
    label: "Cyan",
    accent: "#2AA9D6",
    accent2: "#4CC0E8",
    border: "rgba(42, 169, 214, 0.36)",
    borderSoft: "rgba(233, 234, 234, 0.10)",
    soft: "rgba(42, 169, 214, 0.12)",
    cardBg: "#111315",
    pageBg: "#0A0B0C",
    grid: "rgba(42, 169, 214, 0.06)",
    muted: "#8C9399",
  },
  putih: {
    id: "putih",
    label: "Putih",
    accent: "#0A0B0C",
    accent2: "#4A5054",
    border: "rgba(10, 11, 12, 0.20)",
    borderSoft: "rgba(10, 11, 12, 0.10)",
    soft: "rgba(10, 11, 12, 0.06)",
    cardBg: "#FFFFFF",
    pageBg: "#F4F4F3",
    grid: "rgba(10, 11, 12, 0.06)",
    muted: "#5A6165",
  },
};

export const CARD_THEME_IDS = Object.keys(CARD_THEMES) as CardThemeId[];
export const CARD_THEME_LIST = CARD_THEME_IDS.map((id) => CARD_THEMES[id]);

export function isCardThemeId(value: unknown): value is CardThemeId {
  return typeof value === "string" && value in CARD_THEMES;
}

export function resolveCardTheme(value: string | null | undefined): CardTheme {
  return isCardThemeId(value) ? CARD_THEMES[value] : CARD_THEMES.hitam;
}
