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
    label: "Navy",
    accent: "#EAF1FF",
    accent2: "#8299C4",
    border: "rgba(234, 241, 255, 0.22)",
    borderSoft: "rgba(234, 241, 255, 0.10)",
    soft: "rgba(234, 241, 255, 0.07)",
    cardBg: "#0A1226",
    pageBg: "#050B1F",
    grid: "rgba(234, 241, 255, 0.05)",
    muted: "#8299C4",
  },
  cyan: {
    id: "cyan",
    label: "Blue",
    accent: "#2A5FE8",
    accent2: "#6F9BFF",
    border: "rgba(42, 95, 232, 0.42)",
    borderSoft: "rgba(234, 241, 255, 0.10)",
    soft: "rgba(42, 95, 232, 0.14)",
    cardBg: "#0A1226",
    pageBg: "#050B1F",
    grid: "rgba(42, 95, 232, 0.08)",
    muted: "#8299C4",
  },
  putih: {
    id: "putih",
    label: "Light",
    accent: "#050B1F",
    accent2: "#3A4A6B",
    border: "rgba(5, 11, 31, 0.18)",
    borderSoft: "rgba(5, 11, 31, 0.09)",
    soft: "rgba(5, 11, 31, 0.05)",
    cardBg: "#FFFFFF",
    pageBg: "#F2F5FB",
    grid: "rgba(5, 11, 31, 0.06)",
    muted: "#4E5F82",
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
