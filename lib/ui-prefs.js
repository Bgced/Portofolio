/**
 * Store kecil untuk preferensi tampilan (tema latar 3D, radius card, aksen).
 * Semua nilai ditulis ke CSS custom property di <html> supaya Tailwind
 * (`rounded-card`, `bg-accent`) langsung ikut berubah tanpa re-render besar.
 *
 * SSR-safe: file ini nggak pernah menyentuh window/document saat import.
 * Pembacaan localStorage selalu lewat `applyStored()` yang dipanggil di useEffect.
 */

export const ACCENTS = [
  { id: "hitam", idLabel: "Hitam", enLabel: "Black", light: "#E9EAEA", dark: "#E9EAEA" },
  { id: "cyan", idLabel: "Cyan", enLabel: "Cyan", light: "#2AA9D6", dark: "#2AA9D6" },
  { id: "putih", idLabel: "Putih", enLabel: "White", light: "#FFFFFF", dark: "#FFFFFF" },
];

export const RADII = [
  { id: "sharp", value: "0px", idLabel: "Kotak", enLabel: "Square" },
  { id: "soft", value: "4px", idLabel: "Rapi", enLabel: "Neat" },
  { id: "round", value: "6px", idLabel: "Lunak", enLabel: "Soft" },
];

export const SCENE_MOODS = [
  { id: "wire", idLabel: "Garis", enLabel: "Lines" },
  { id: "off", idLabel: "Mati", enLabel: "Off" },
];

const STORAGE_KEY = "cekael-ui-prefs";
const DEFAULTS = { accent: "cyan", radius: "soft", scene: "wire" };

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
  root.style.setProperty("--accent", accent.dark);
  root.style.setProperty("--accent-2", accent.dark);
  root.style.setProperty("--accent-hover", `color-mix(in srgb, ${accent.dark} 82%, #E9EAEA)`);
  root.style.setProperty(
    "--accent-soft",
    `color-mix(in srgb, ${accent.dark} 12%, transparent)`
  );
  root.style.setProperty("--radius-card", radius.value);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("cekael:prefs", { detail: { ...safe } }));
  }
}
