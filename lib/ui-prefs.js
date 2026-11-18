/**
 * Store kecil untuk preferensi tampilan (tema latar 3D, radius card, aksen).
 * Semua nilai ditulis ke CSS custom property di <html> supaya Tailwind
 * (`rounded-card`, `bg-accent`) langsung ikut berubah tanpa re-render besar.
 *
 * SSR-safe: file ini nggak pernah menyentuh window/document saat import.
 * Pembacaan localStorage selalu lewat `applyStored()` yang dipanggil di useEffect.
 */

export const ACCENTS = [
  { id: "terracotta", idLabel: "Terracotta", enLabel: "Terracotta", light: "#7C4A2D", dark: "#C88A55" },
  { id: "espresso", idLabel: "Espresso", enLabel: "Espresso", light: "#5C3A21", dark: "#B9764A" },
  { id: "olive", idLabel: "Olive", enLabel: "Olive", light: "#5E6B3F", dark: "#A8B878" },
  { id: "slate", idLabel: "Slate", enLabel: "Slate", light: "#4A5568", dark: "#9FB3C8" },
];

export const RADII = [
  { id: "sharp", value: "4px", idLabel: "Tajam", enLabel: "Sharp" },
  { id: "soft", value: "14px", idLabel: "Lembut", enLabel: "Soft" },
  { id: "round", value: "22px", idLabel: "Bulat", enLabel: "Round" },
];

export const SCENE_MOODS = [
  { id: "clay", idLabel: "Clay", enLabel: "Clay" },
  { id: "wire", idLabel: "Wireframe", enLabel: "Wireframe" },
  { id: "off", idLabel: "Mati", enLabel: "Off" },
];

const STORAGE_KEY = "cekael-ui-prefs";
const DEFAULTS = { accent: "terracotta", radius: "soft", scene: "clay" };

const VALID = {
  accent: new Set(ACCENTS.map((item) => item.id)),
  radius: new Set(RADII.map((item) => item.id)),
  scene: new Set(SCENE_MOODS.map((item) => item.id)),
};

export function sanitizePrefs(input) {
  const next = { ...DEFAULTS };
  if (!input || typeof input !== "object") return next;
  for (const key of Object.keys(DEFAULTS)) {
    const value = input[key];
    if (typeof value === "string" && VALID[key].has(value)) next[key] = value;
  }
  return next;
}

export function loadPrefs() {
  if (typeof window === "undefined") return { ...DEFAULTS };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return sanitizePrefs(JSON.parse(raw));
  } catch {
    return { ...DEFAULTS };
  }
}

export function savePrefs(prefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitizePrefs(prefs)));
  } catch {
    /* private mode — preferensi tetap jalan di sesi ini */
  }
}

/** Tulis preferensi ke CSS custom property di <html>. Aman dipanggil berulang. */
export function applyPrefs(prefs) {
  if (typeof document === "undefined") return;
  const safe = sanitizePrefs(prefs);
  const accent = ACCENTS.find((item) => item.id === safe.accent) ?? ACCENTS[0];
  const radius = RADII.find((item) => item.id === safe.radius) ?? RADII[1];

  const root = document.documentElement;
  root.dataset.accent = accent.id;
  root.dataset.radius = radius.id;
  root.dataset.scene = safe.scene;
  root.style.setProperty("--accent-light", accent.light);
  root.style.setProperty("--accent-dark", accent.dark);
  root.style.setProperty("--radius-card", radius.value);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cekael:prefs", { detail: { ...safe } }));
  }
}
