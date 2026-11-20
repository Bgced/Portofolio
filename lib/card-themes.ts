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
    accent: "#E9F6FA",
    accent2: "#7E96A1",
    border: "rgba(233, 246, 250, 0.22)",
    borderSoft: "rgba(233, 246, 250, 0.10)",
    soft: "rgba(233, 246, 250, 0.07)",
    cardBg: "#081014",
    pageBg: "#04070A",
    grid: "rgba(233, 246, 250, 0.05)",
    muted: "#7E96A1",
  },
  cyan: {
    id: "cyan",
    label: "Blue",
    accent: "#22D3EE",
    accent2: "#38BDF8",
    border: "rgba(34, 211, 238, 0.42)",
    borderSoft: "rgba(233, 246, 250, 0.10)",
    soft: "rgba(34, 211, 238, 0.14)",
    cardBg: "#081014",
    pageBg: "#04070A",
    grid: "rgba(34, 211, 238, 0.08)",
    muted: "#7E96A1",
  },
  putih: {
    id: "putih",
    label: "Light",
    accent: "#04070A",
    accent2: "#26333D",
    border: "rgba(5, 7, 9, 0.18)",
    borderSoft: "rgba(5, 7, 9, 0.09)",
    soft: "rgba(5, 7, 9, 0.05)",
    cardBg: "#FFFFFF",
    pageBg: "#F2FAFC",
    grid: "rgba(5, 7, 9, 0.06)",
    muted: "#33454F",
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
