"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  Check,
  Copy,
  Download,
  ExternalLink,
  Link2,
  MessageCircle,
  QrCode,
  RotateCcw,
  Sparkles,
  Type,
  Wifi,
} from "lucide-react";
import { useLang } from "@/components/providers";
import { useToast } from "@/components/ui/ToastProvider";
import { CARD_THEME_LIST } from "@/lib/card-themes";
import {
  QR_COLORS,
  QR_EVENTS,
  QR_MESSAGE_TEMPLATE,
  buildCardUrl,
  buildWaUrl,
  buildWifiValue,
  normalizeUrl,
} from "@/lib/qr";

const MODES = [
  { id: "card", icon: QrCode, idLabel: "Ucapan", enLabel: "Greeting" },
  { id: "link", icon: Link2, idLabel: "Link", enLabel: "Link" },
  { id: "wifi", icon: Wifi, idLabel: "Wi-Fi", enLabel: "Wi-Fi" },
  { id: "wa", icon: MessageCircle, idLabel: "WhatsApp", enLabel: "WhatsApp" },
  { id: "text", icon: Type, idLabel: "Teks", enLabel: "Text" },
];

const inputClass =
  "w-full rounded-lg border border-line-soft bg-canvas/60 px-3 py-2.5 text-[0.85rem] text-ink outline-none transition-colors placeholder:text-muted/55 focus:border-accent/70";

function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mono-label mb-1.5 flex items-baseline justify-between gap-2">
        <span>{label}</span>
        {hint ? <span className="normal-case tracking-normal text-muted/70">{hint}</span> : null}
      </span>
      {children}
    </label>
  );
}

export default function QrStudio() {
  const { lang } = useLang();
  const { toast } = useToast();
  const en = lang === "en";

  const [mode, setMode] = useState("card");
  const [origin, setOrigin] = useState("");
  const [recipient, setRecipient] = useState("");
  const [sender, setSender] = useState("Cedric Kilian");
  const [event, setEvent] = useState(QR_EVENTS[0]);
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [ssid, setSsid] = useState("");
  const [password, setPassword] = useState("");
  const [security, setSecurity] = useState("WPA");
  const [phone, setPhone] = useState("");
  const [waMessage, setWaMessage] = useState("");
  const [rawText, setRawText] = useState("");
  const [color, setColor] = useState(QR_COLORS[0].value);
  const [cardTheme, setCardTheme] = useState("cyan");
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const hdRef = useRef(null);

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  useEffect(() => {
    if (!copied) return undefined;
    const timer = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(timer);
  }, [copied]);

  useEffect(() => {
    if (!saved) return undefined;
    const timer = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(timer);
  }, [saved]);

  const value = useMemo(() => {
    switch (mode) {
      case "card": {
        if (!origin) return "";
        return buildCardUrl(
          { v: 1, n: recipient.trim() || (en ? "Friend" : "Teman"), s: sender.trim(), e: event, m: message.trim() },
          origin,
          cardTheme
        );
      }
      case "link":
        return normalizeUrl(url);
      case "wifi":
        return buildWifiValue(ssid, password, security);
      case "wa":
        return buildWaUrl(phone, waMessage);
      case "text":
        return rawText.trim();
      default:
        return "";
    }
  }, [mode, origin, recipient, sender, event, message, url, ssid, password, security, phone, waMessage, rawText, en, cardTheme]);

  const canPreview = mode === "card" || mode === "link" || mode === "wa";

  const copy = async () => {
    if (!value) return;
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        ok = true;
      }
    } catch {
      ok = false;
    }

    if (!ok) {
      const field = document.createElement("textarea");
      try {
        field.value = value;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        ok = document.execCommand("copy");
      } catch {
        ok = false;
      } finally {
        if (field.parentNode) field.parentNode.removeChild(field);
      }
    }

    setCopied(ok);
    toast({
      title: ok
        ? en
          ? "Link copied!"
          : "Link tersalin!"
        : en
          ? "Couldn't copy the link"
          : "Gagal nyalin link",
      description: ok
        ? mode === "card"
          ? en
            ? "Paste it anywhere — the card is inside."
            : "Tempel di mana aja — kartunya udah di dalam."
          : undefined
        : en
          ? "Try selecting the preview link manually."
          : "Coba seleksi link preview-nya manual.",
      variant: ok ? "success" : "error",
    });
  };

  const download = () => {
    const canvas =
      hdRef.current?.querySelector("canvas") ??
      Array.from(document.querySelectorAll("#qr_panel canvas")).find((node) => node.width >= 1000);
    if (!canvas || !value) {
      toast({
        title: en ? "Nothing to download yet" : "Belum ada yang bisa di-download",
        description: en ? "Fill the form so the QR shows up first." : "Isi form dulu biar QR-nya muncul.",
        variant: "error",
      });
      return;
    }
    const name =
      mode === "card"
        ? `qr-ucapan-${(recipient || "cekael").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cekael"}`
        : `qr-${mode}`;

    canvas.toBlob((blob) => {
      if (!blob) {
        toast({
          title: en ? "PNG failed to render" : "PNG gagal dibikin",
          variant: "error",
        });
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `${name}.png`;
      link.href = url;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
      setSaved(true);
      toast({
        title: en ? "QR PNG saved" : "QR PNG tersimpan",
        description: `${name}.png · 1024 × 1024`,
        variant: "success",
      });
    }, "image/png");
  };

  const shareToWhatsApp = () => {
    if (!value) return;
    const intro =
      mode === "card"
        ? en
          ? "I made you a digital greeting card. Scan the QR or open this link:"
          : "Aku bikinin kartu ucapan digital buat kamu. Scan QR-nya atau buka link ini ya:"
        : en
          ? "Here's the QR I made. Scan it or open this link:"
          : "Nih QR yang aku bikin. Scan atau buka link ini:";
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(`${intro}\n${value}`)}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
    toast({
      title: en ? "WhatsApp opened" : "WhatsApp kebuka",
      description: en ? "Pick a contact and hit send." : "Pilih kontak terus langsung kirim.",
      variant: "success",
    });
  };

  const reset = () => {
    setRecipient("");
    setMessage("");
    setUrl("");
    setSsid("");
    setPassword("");
    setSecurity("WPA");
    setPhone("");
    setWaMessage("");
    setRawText("");
    setColor(QR_COLORS[0].value);
    setCardTheme("cyan");
  };

  const openPreview = () => {
    if (!value || !canPreview) return;
    window.open(value, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_290px]">
      <div className="min-w-0">
        {/* mode tabs */}
        <div className="no-scrollbar -mx-1 flex flex-wrap gap-1 pb-1">
          {MODES.map((item) => {
            const Icon = item.icon;
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setMode(item.id)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-2 font-mono text-[0.64rem] uppercase tracking-[0.1em] transition-colors ${
                  active
                    ? "border-line bg-accent-soft text-accent"
                    : "border-line-soft bg-surface/40 text-muted hover:text-ink"
                }`}
              >
                <Icon size={12} aria-hidden="true" />
                {en ? item.enLabel : item.idLabel}
              </button>
            );
          })}
        </div>

        <div className="mt-3 space-y-3">
          {mode === "card" ? (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label={en ? "Recipient" : "Nama Penerima"}>
                  <input
                    className={inputClass}
                    value={recipient}
                    onChange={(event) => setRecipient(event.target.value)}
                    placeholder={en ? "Who is this for?" : "Buat siapa nih?"}
                    maxLength={40}
                  />
                </Field>
                <Field label={en ? "Sender" : "Pengirim"}>
                  <input
                    className={inputClass}
                    value={sender}
                    onChange={(event) => setSender(event.target.value)}
                    placeholder="Cedric Kilian"
                    maxLength={40}
                  />
                </Field>
              </div>

              <Field label={en ? "Event category" : "Kategori Event"}>
                <select className={inputClass} value={event} onChange={(event) => setEvent(event.target.value)}>
                  {QR_EVENTS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <div>
                <span className="mono-label mb-1.5 block">{en ? "Card theme" : "Tema Kartu"}</span>
                <div className="flex flex-wrap gap-1.5">
                  {CARD_THEME_LIST.map((theme) => {
                    const active = cardTheme === theme.id;
                    return (
                      <button
                        key={theme.id}
                        type="button"
                        onClick={() => setCardTheme(theme.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[0.68rem] transition-colors ${
                          active
                            ? "border-accent/70 bg-accent-soft text-ink"
                            : "border-line-soft bg-surface/40 text-muted hover:text-ink"
                        }`}
                      >
                        <span
                          className="h-3 w-3 rounded-full border border-black/20"
                          style={{ backgroundColor: theme.accent }}
                          aria-hidden="true"
                        />
                        {theme.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Field label={en ? "Message" : "Pesan Ucapan"} hint={`${message.length}/300`}>
                <textarea
                  className={`${inputClass} min-h-[104px] resize-y leading-relaxed`}
                  value={message}
                  onChange={(event) => setMessage(event.target.value.slice(0, 300))}
                  placeholder={en ? "Write something warm…" : "Tulis pesan hangatnya di sini…"}
                  maxLength={300}
                />
              </Field>

              <button
                type="button"
                onClick={() => setMessage(QR_MESSAGE_TEMPLATE)}
                className="btn btn-ghost !px-3 !py-2 !text-[0.72rem]"
              >
                <Sparkles size={12} aria-hidden="true" className="text-accent" />
                {en ? "Auto-fill message" : "Isi Pesan Otomatis"}
              </button>
            </>
          ) : null}

          {mode === "link" ? (
            <Field label={en ? "Destination URL" : "Link / Domain Tujuan"} hint="https://">
              <input
                className={inputClass}
                value={url}
                onChange={(event) => setUrl(event.target.value)}
                placeholder="electricalcekael.vercel.app"
                inputMode="url"
                autoCapitalize="none"
                spellCheck={false}
              />
            </Field>
          ) : null}

          {mode === "wifi" ? (
            <>
              <Field label="Nama Wi-Fi (SSID)">
                <input
                  className={inputClass}
                  value={ssid}
                  onChange={(event) => setSsid(event.target.value)}
                  placeholder="WiFi Kos Cekael"
                  maxLength={64}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Password">
                  <input
                    className={inputClass}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    maxLength={64}
                    disabled={security === "nopass"}
                  />
                </Field>
                <Field label={en ? "Security" : "Keamanan"}>
                  <select className={inputClass} value={security} onChange={(event) => setSecurity(event.target.value)}>
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Tanpa Password</option>
                  </select>
                </Field>
              </div>
              <p className="font-mono text-[0.62rem] leading-relaxed text-muted">
                {en
                  ? "Scan with a phone camera — it connects to the network instantly, no typing."
                  : "Scan pakai kamera HP — langsung connect ke jaringan, nggak perlu ngetik password."}
              </p>
            </>
          ) : null}

          {mode === "wa" ? (
            <>
              <Field label={en ? "WhatsApp number" : "Nomor WhatsApp"} hint="08… / 62…">
                <input
                  className={inputClass}
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="0897 2007 113"
                  inputMode="tel"
                />
              </Field>
              <Field label={en ? "Pre-filled message" : "Pesan Otomatis"}>
                <textarea
                  className={`${inputClass} min-h-[88px] resize-y leading-relaxed`}
                  value={waMessage}
                  onChange={(event) => setWaMessage(event.target.value.slice(0, 300))}
                  placeholder={en ? "Hi Cekael, I wanted to talk about…" : "Halo Cekael, aku mau ngobrol soal…"}
                  maxLength={300}
                />
              </Field>
            </>
          ) : null}

          {mode === "text" ? (
            <Field label={en ? "Free text" : "Teks / Catatan Bebas"} hint={`${rawText.length}/300`}>
              <textarea
                className={`${inputClass} min-h-[130px] resize-y leading-relaxed`}
                value={rawText}
                onChange={(event) => setRawText(event.target.value.slice(0, 300))}
                placeholder={en ? "Anything you want to turn into a QR…" : "Apa aja yang mau kamu jadiin QR…"}
                maxLength={300}
              />
            </Field>
          ) : null}

          {/* warna QR */}
          <div>
            <span className="mono-label mb-1.5 block">{en ? "QR color" : "Warna QR"}</span>
            <div className="flex flex-wrap gap-2">
              {QR_COLORS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setColor(option.value)}
                  aria-pressed={color === option.value}
                  className={`flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[0.7rem] transition-colors ${
                    color === option.value
                      ? "border-accent/70 bg-accent-soft text-ink"
                      : "border-line-soft bg-surface/40 text-muted hover:text-ink"
                  }`}
                >
                  <span
                    className="h-3 w-3 rounded-sm border border-black/20"
                    style={{ backgroundColor: option.value }}
                    aria-hidden="true"
                  />
                  {option.id === "black" ? (en ? "Classic black" : "Hitam Klasik") : "Deep Cyan"}
                </button>
              ))}
            </div>
          </div>

          <button type="button" onClick={reset} className="flex items-center gap-1.5 font-mono text-[0.62rem] uppercase tracking-[0.12em] text-muted transition-colors hover:text-accent">
            <RotateCcw size={11} aria-hidden="true" />
            {en ? "Reset form" : "Reset form"}
          </button>
        </div>
      </div>

      {/* preview */}
      <aside className="order-first min-w-0 rounded-xl border border-line-soft bg-surface-2/50 p-3 lg:order-none">
        <div className="flex items-center justify-between gap-2">
          <span className="mono-label text-accent">live preview</span>
          <span className="mono-label">{mode.toUpperCase()}</span>
        </div>

        <div className="mt-3 flex items-center justify-center rounded-lg bg-white p-3">
          {value ? (
            <QRCodeCanvas
              value={value}
              size={196}
              level="M"
              marginSize={4}
              bgColor="#FFFFFF"
              fgColor={color}
              aria-label={en ? "QR code preview" : "Preview QR code"}
              className="h-auto max-w-full"
            />
          ) : (
            <div className="flex h-[196px] w-[196px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-slate-300 text-center">
              <QrCode size={26} className="text-slate-400" aria-hidden="true" />
              <p className="px-4 font-mono text-[0.6rem] uppercase leading-relaxed tracking-[0.1em] text-slate-500">
                {en ? "fill the form first" : "isi form dulu ya"}
              </p>
            </div>
          )}
        </div>

        <p className="mt-2 break-all font-mono text-[0.58rem] leading-relaxed text-muted/80">
          {value ? `${value.slice(0, 58)}${value.length > 58 ? "…" : ""}` : en ? "quiet zone 4 modules · error correction M" : "quiet zone 4 modul · koreksi error M"}
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <button type="button" onClick={copy} disabled={!value} className="btn btn-ghost !px-2 !py-2 !text-[0.7rem] disabled:opacity-40">
            {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
            {copied ? (en ? "Copied!" : "Tersalin!") : en ? "Copy link" : "Copy Link"}
          </button>
          <button type="button" onClick={download} disabled={!value} className="btn btn-ghost !px-2 !py-2 !text-[0.7rem] disabled:opacity-40">
            <Download size={12} aria-hidden="true" />
            {saved ? (en ? "Saved!" : "Tersimpan!") : "PNG HD"}
          </button>
        </div>

        <button
          type="button"
          onClick={shareToWhatsApp}
          disabled={!value}
          className="btn btn-ghost mt-2 w-full !px-2 !py-2 !text-[0.7rem] disabled:opacity-40"
        >
          <MessageCircle size={12} aria-hidden="true" className="text-ok" />
          {en ? "Share to WhatsApp" : "Share ke WA"}
        </button>

        <button
          type="button"
          onClick={openPreview}
          disabled={!value || !canPreview}
          className="btn btn-primary mt-2 w-full !px-2 !py-2 !text-[0.7rem] disabled:opacity-40"
        >
          <ExternalLink size={12} aria-hidden="true" />
          {en ? "Preview result" : "Preview Hasil"}
        </button>

        <p className="mt-2 text-center font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted/70">
          1024 × 1024 px · white quiet zone
        </p>

        {/* canvas HD tersembunyi buat download */}
        <div ref={hdRef} className="pointer-events-none fixed -left-[9999px] top-0" aria-hidden="true">
          {value ? (
            <QRCodeCanvas value={value} size={1024} level="M" marginSize={4} bgColor="#FFFFFF" fgColor={color} />
          ) : null}
        </div>
      </aside>
    </div>
  );
}
