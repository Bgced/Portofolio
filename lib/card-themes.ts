export type CardThemeId = "clay" | "espresso" | "olive";

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
  clay: {
    id: "clay",
    label: "Copper",
    accent: "#D48C55",
    accent2: "#E29D68",
    border: "rgba(212, 140, 85, 0.34)",
    borderSoft: "rgba(244, 241, 234, 0.10)",
    soft: "rgba(212, 140, 85, 0.14)",
    cardBg: "#1B1815",
    pageBg: "#12100E",
    grid: "rgba(244, 241, 234, 0.05)",
    muted: "#9C948A",
  },
  espresso: {
    id: "espresso",
    label: "Espresso",
    accent: "#8A5535",
    accent2: "#B9764A",
    border: "rgba(138, 85, 53, 0.34)",
    borderSoft: "rgba(35, 31, 32, 0.10)",
    soft: "rgba(138, 85, 53, 0.10)",
    cardBg: "#F7F4EF",
    pageBg: "#EFEAE2",
    grid: "rgba(92, 58, 33, 0.06)",
    muted: "#6E665F",
  },
  olive: {
    id: "olive",
    label: "Olive",
    accent: "#5E6B3F",
    accent2: "#8C9A63",
    border: "rgba(94, 107, 63, 0.32)",
    borderSoft: "rgba(35, 31, 32, 0.10)",
    soft: "rgba(94, 107, 63, 0.10)",
    cardBg: "#F5F2EA",
    pageBg: "#EDE9DF",
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
