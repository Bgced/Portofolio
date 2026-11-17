/**
 * Helper encoding QR — UTF-8 safe.
 * Jangan pakai btoa(JSON.stringify(...)): begitu ada emoji, browser throw
 * InvalidCharacterError. TextEncoder -> bytes -> base64url aman untuk URL.
 */

export function bytesToBase64Url(bytes) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

export function base64UrlToBytes(value) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function encodePayload(data) {
  return bytesToBase64Url(new TextEncoder().encode(JSON.stringify(data)));
}

export function decodePayload(value) {
  if (!value) return null;
  try {
    const text = new TextDecoder().decode(base64UrlToBytes(value));
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export function buildCardUrl(payload, origin) {
  const base = origin || (typeof window !== "undefined" ? window.location.origin : "");
  return `${base}/card?d=${encodePayload(payload)}`;
}

export function normalizeUrl(input) {
  const raw = (input || "").trim();
  if (!raw) return "";
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw)) return raw;
  return `https://${raw.replace(/^\/+/, "")}`;
}

export function normalizeWaNumber(input) {
  let digits = (input || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) digits = `62${digits.slice(1)}`;
  if (digits.startsWith("620")) digits = `62${digits.slice(3)}`;
  return digits;
}

export function buildWaUrl(number, message) {
  const n = normalizeWaNumber(number);
  if (!n) return "";
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${n}${text}`;
}

/** Escape karakter reserved format WIFI:T:...;S:...;P:...;; */
function escapeWifi(value) {
  return String(value || "").replace(/([\\;,":])/g, "\\$1");
}

export function buildWifiValue(ssid, password, security = "WPA") {
  if (!ssid) return "";
  const type = ["WPA", "WEP", "nopass"].includes(security) ? security : "WPA";
  const pass = type === "nopass" ? "" : `P:${escapeWifi(password)};`;
  return `WIFI:T:${type};S:${escapeWifi(ssid)};${pass};`;
}

export const QR_COLORS = [
  { id: "black", label: "Hitam Klasik", value: "#000000" },
  { id: "cyan", label: "Deep Cyan", value: "#0284C7" },
];

export const QR_EVENTS = ["Terima Kasih Umum", "Kunjungan Booth/Event", "Kolaborasi Project", "Apresiasi Spesial"];

export const QR_MESSAGE_TEMPLATE =
  "Makasih banyak ya udah mampir dan ngobrol soal project ini. Seneng banget bisa kenalan — kalau ada ide seru, kabarin aja. Sampai ketemu di project berikutnya!";
