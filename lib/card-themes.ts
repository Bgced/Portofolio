export type CardThemeId = "cyan" | "purple" | "matrix";

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
  cyan: {
    id: "cyan",
    label: "Cyber Cyan",
    accent: "#00F0FF",
    accent2: "#7DF9FF",
    border: "rgba(0, 240, 255, 0.30)",
    borderSoft: "rgba(255, 255, 255, 0.08)",
    soft: "rgba(0, 240, 255, 0.12)",
    glow: "rgba(0, 240, 255, 0.45)",
    cardBg: "rgba(11, 14, 17, 0.80)",
    pageBg: "#050505",
    grid: "rgba(0, 240, 255, 0.045)",
    muted: "#94A3B8",
  },
  purple: {
    id: "purple",
    label: "Neon Purple",
    accent: "#B26BFF",
    accent2: "#E879F9",
    border: "rgba(178, 107, 255, 0.36)",
    borderSoft: "rgba(255, 255, 255, 0.08)",
    soft: "rgba(178, 107, 255, 0.15)",
    glow: "rgba(178, 107, 255, 0.50)",
    cardBg: "rgba(17, 12, 24, 0.84)",
    pageBg: "#08050D",
    grid: "rgba(178, 107, 255, 0.055)",
    muted: "#A9A3B8",
  },
  matrix: {
    id: "matrix",
    label: "Emerald Matrix",
    accent: "#34D399",
    accent2: "#A7F3D0",
    border: "rgba(52, 211, 153, 0.34)",
    borderSoft: "rgba(255, 255, 255, 0.08)",
    soft: "rgba(52, 211, 153, 0.13)",
    glow: "rgba(52, 211, 153, 0.45)",
    cardBg: "rgba(7, 17, 13, 0.84)",
    pageBg: "#030B07",
    grid: "rgba(52, 211, 153, 0.055)",
    muted: "#9CB8AB",
  },
};

export const CARD_THEME_IDS = Object.keys(CARD_THEMES) as CardThemeId[];
export const CARD_THEME_LIST = CARD_THEME_IDS.map((id) => CARD_THEMES[id]);

export function isCardThemeId(value: unknown): value is CardThemeId {
  return typeof value === "string" && value in CARD_THEMES;
}

export function resolveCardTheme(value: string | null | undefined): CardTheme {
  return isCardThemeId(value) ? CARD_THEMES[value] : CARD_THEMES.cyan;
}
