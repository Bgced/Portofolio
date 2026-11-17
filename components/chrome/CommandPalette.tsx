"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { useTheme } from "next-themes";
import {
  ArrowUp,
  Calculator,
  Copy,
  CornerDownLeft,
  ExternalLink,
  FolderKanban,
  HeartPulse,
  Home,
  Mail,
  Moon,
  QrCode,
  Search,
  Sparkles,
  Sun,
  UserRound,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useLang } from "@/components/providers";
import { useToast } from "@/components/ui/ToastProvider";
import { PROFILE } from "@/lib/content";

type ItemGroup = "navigate" | "tools" | "actions";

type PaletteItem = {
  id: string;
  label: string;
  hint?: string;
  keywords: string;
  group: ItemGroup;
  icon: LucideIcon;
  run: () => void;
};

const GROUP_LABEL: Record<ItemGroup, { id: string; en: string }> = {
  navigate: { id: "Navigasi", en: "Navigate" },
  tools: { id: "Buka Tool", en: "Open tool" },
  actions: { id: "Aksi Cepat", en: "Quick actions" },
};

const GROUP_ORDER: ItemGroup[] = ["navigate", "tools", "actions"];

async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback di bawah */
  }

  const field = document.createElement("textarea");
  try {
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

function prefersReducedMotion(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const { lang } = useLang();
  const { resolvedTheme, setTheme } = useTheme();
  const { toast } = useToast();

  const en = lang === "en";
  const isDark = resolvedTheme !== "light";

  const rememberFocus = useCallback(() => {
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  const openPalette = useCallback(() => {
    rememberFocus();
    setOpen(true);
  }, [rememberFocus]);

  const close = useCallback(() => {
    setOpen(false);
    window.requestAnimationFrame(() => lastFocused.current?.focus());
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const combo = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (combo) {
        event.preventDefault();
        if (open) {
          close();
        } else {
          openPalette();
        }
        return;
      }
      if (event.key === "Escape" && open) close();
    };

    const onOpenRequest = () => openPalette();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("cekael:command", onOpenRequest);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("cekael:command", onOpenRequest);
    };
  }, [open, openPalette, close]);

  useEffect(() => {
    if (!open) return undefined;

    setQuery("");
    setActiveIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 30);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  const goSection = useCallback(
    (id: string) => {
      close();
      window.requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [close]
  );

  const goTool = useCallback(
    (tab: "qr" | "ai" | "calc" | "bmi") => {
      close();
      window.dispatchEvent(new CustomEvent("cekael:playground", { detail: { tab } }));
      window.requestAnimationFrame(() => {
        document.getElementById("playground")?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      });
    },
    [close]
  );

  const items = useMemo<PaletteItem[]>(() => {
    const navigate: PaletteItem[] = [
      {
        id: "nav-home",
        label: en ? "Hero" : "Home (Hero)",
        hint: "#home",
        keywords: "hero home awal start",
        group: "navigate",
        icon: Home,
        run: () => goSection("home"),
      },
      {
        id: "nav-about",
        label: en ? "About & Tech Arsenal" : "Tentang & Senjata Ngoding",
        hint: "#about",
        keywords: "about tentang bio tech stack arsenal skill",
        group: "navigate",
        icon: UserRound,
        run: () => goSection("about"),
      },
      {
        id: "nav-projects",
        label: en ? "Projects" : "Karya & Project",
        hint: "#projects",
        keywords: "projects karya portfolio showcase electrical",
        group: "navigate",
        icon: FolderKanban,
        run: () => goSection("projects"),
      },
      {
        id: "nav-playground",
        label: "Playground",
        hint: "#playground",
        keywords: "playground tools",
        group: "navigate",
        icon: Sparkles,
        run: () => goSection("playground"),
      },
      {
        id: "nav-stack",
        label: en ? "Setup & Daily Drivers" : "Setup & Daily Driver",
        hint: "#stack",
        keywords: "stack setup tools daily driver",
        group: "navigate",
        icon: Wrench,
        run: () => goSection("stack"),
      },
      {
        id: "nav-contact",
        label: en ? "Contact" : "Kontak",
        hint: "#contact",
        keywords: "contact kontak email whatsapp hire",
        group: "navigate",
        icon: Mail,
        run: () => goSection("contact"),
      },
    ];

    const tools: PaletteItem[] = [
      {
        id: "tool-ai",
        label: "Cekael AI",
        hint: "playground / 02",
        keywords: "ai chat asisten cekael bot",
        group: "tools",
        icon: Sparkles,
        run: () => goTool("ai"),
      },
      {
        id: "tool-qr",
        label: "Universal QR Studio",
        hint: "playground / 01",
        keywords: "qr studio qrcode wifi whatsapp card ucapan",
        group: "tools",
        icon: QrCode,
        run: () => goTool("qr"),
      },
      {
        id: "tool-calc",
        label: en ? "Calculator" : "Kalkulator",
        hint: "playground / 03",
        keywords: "kalkulator calculator hitung calc",
        group: "tools",
        icon: Calculator,
        run: () => goTool("calc"),
      },
      {
        id: "tool-bmi",
        label: en ? "BMI Check" : "Cek BMI",
        hint: "playground / 04",
        keywords: "bmi berat badan kesehatan health",
        group: "tools",
        icon: HeartPulse,
        run: () => goTool("bmi"),
      },
    ];

    const actions: PaletteItem[] = [
      {
        id: "action-theme",
        label: isDark
          ? en
            ? "Switch to Light Mode"
            : "Ganti ke Mode Terang"
          : en
            ? "Switch to Dark Mode"
            : "Ganti ke Mode Gelap",
        hint: isDark ? "sun" : "moon",
        keywords: "theme tema dark light gelap terang mode",
        group: "actions",
        icon: isDark ? Sun : Moon,
        run: () => {
          const next = isDark ? "light" : "dark";
          setTheme(next);
          toast({
            title: en ? `${next === "light" ? "Light" : "Dark"} mode on` : `Mode ${next === "light" ? "terang" : "gelap"} aktif`,
            variant: "success",
          });
        },
      },
      {
        id: "action-copy-email",
        label: en ? "Copy Cekael's Email" : "Copy Email Cekael",
        hint: PROFILE.email,
        keywords: `copy email salin ${PROFILE.email}`,
        group: "actions",
        icon: Copy,
        run: async () => {
          const ok = await copyText(PROFILE.email);
          toast({
            title: ok
              ? en
                ? "Email copied!"
                : "Email tersalin!"
              : en
                ? "Couldn't copy the email"
                : "Gagal nyalin email",
            description: ok ? PROFILE.email : undefined,
            variant: ok ? "success" : "error",
          });
        },
      },
      {
        id: "action-electrical",
        label: en ? "Open Electrical Cekael ↗" : "Buka Electrical Cekael ↗",
        hint: "electricalcekael.vercel.app",
        keywords: "electrical cekael lab engineering external project",
        group: "actions",
        icon: ExternalLink,
        run: () => {
          window.open("https://electricalcekael.vercel.app", "_blank", "noopener,noreferrer");
          toast({
            title: en ? "Opening Electrical Cekael…" : "Membuka Electrical Cekael…",
            variant: "info",
          });
        },
      },
      {
        id: "action-top",
        label: en ? "Back to Top" : "Balik ke Atas",
        hint: "↑",
        keywords: "top atas scroll kembali home",
        group: "actions",
        icon: ArrowUp,
        run: () => {
          close();
          window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" });
        },
      },
    ];

    return [...navigate, ...tools, ...actions];
    // `t` bukan dipakai langsung di sini, tapi perubahan bahasa harus rebuild label.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [en, isDark, goSection, goTool, setTheme, toast, close]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((item) =>
      `${item.label} ${item.hint ?? ""} ${item.keywords}`.toLowerCase().includes(needle)
    );
  }, [items, query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  const grouped = useMemo(
    () =>
      GROUP_ORDER.map((group) => ({
        group,
        label: GROUP_LABEL[group][en ? "en" : "id"],
        entries: filtered.filter((item) => item.group === group),
      })).filter((entry) => entry.entries.length > 0),
    [filtered, en]
  );

  const runItem = useCallback(
    (item: PaletteItem | undefined) => {
      if (!item) return;
      close();
      item.run();
    },
    [close]
  );

  const onPanelKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) => (filtered.length ? (prev + 1) % filtered.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) => (filtered.length ? (prev - 1 + filtered.length) % filtered.length : 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runItem(filtered[activeIndex]);
      return;
    }
    if (event.key === "Tab") {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'input, button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[85] flex items-start justify-center bg-canvas/72 px-3 pt-[10vh] backdrop-blur-md sm:pt-[14vh]"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={en ? "Command palette" : "Command palette"}
        onKeyDown={onPanelKeyDown}
        className="palette-panel relative w-full max-w-[580px] overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-[0_40px_120px_-35px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
      >
        {/* title bar */}
        <div className="flex items-center justify-between border-b border-line-soft px-3.5 py-2">
          <div className="flex items-center gap-2 font-mono text-[0.58rem] uppercase tracking-[0.16em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_var(--glow)]" aria-hidden="true" />
            ck@command · /palette
          </div>
          <kbd className="rounded border border-line-soft bg-surface-2 px-1.5 py-0.5 font-mono text-[0.55rem] tracking-[0.1em] text-muted">
            ESC
          </kbd>
        </div>

        {/* search */}
        <div className="flex items-center gap-2.5 border-b border-line-soft px-4 py-3">
          <Search size={16} className="shrink-0 text-accent" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={en ? "Type a section, tool, or action…" : "Ketik section, tool, atau aksi…"}
            aria-label={en ? "Search commands" : "Cari command"}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-[0.88rem] text-ink outline-none placeholder:text-muted/60"
          />
          <span className="hidden shrink-0 font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted/60 sm:block">
            {filtered.length} cmd
          </span>
        </div>

        {/* results */}
        <div className="max-h-[54vh] overflow-y-auto overscroll-contain px-2 py-2 sm:max-h-[58vh]">
          {filtered.length === 0 ? (
            <div className="px-4 py-10 text-center">
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {en ? "no command found" : "command nggak ketemu"}
              </p>
              <p className="mt-2 text-[0.74rem] text-muted/70">
                {en ? "Try “qr”, “about”, or “email”." : "Coba “qr”, “tentang”, atau “email”."}
              </p>
            </div>
          ) : (
            grouped.map((group) => (
              <div key={group.group} className="mb-1 last:mb-0">
                <p className="px-2.5 pb-1 pt-2 font-mono text-[0.54rem] uppercase tracking-[0.18em] text-muted/60">
                  {group.label}
                </p>
                <ul>
                  {group.entries.map((item) => {
                    const index = filtered.findIndex((entry) => entry.id === item.id);
                    const active = index === activeIndex;
                    const Icon = item.icon;
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onMouseEnter={() => setActiveIndex(index)}
                          onFocus={() => setActiveIndex(index)}
                          onClick={() => runItem(item)}
                          aria-current={active ? "true" : undefined}
                          className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                            active ? "bg-accent-soft text-ink" : "text-muted hover:bg-surface-2 hover:text-ink"
                          }`}
                        >
                          <span
                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-md border ${
                              active
                                ? "border-accent/50 bg-canvas/40 text-accent"
                                : "border-line-soft bg-surface-2 text-muted"
                            }`}
                          >
                            <Icon size={13} strokeWidth={1.9} aria-hidden="true" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate text-[0.82rem] font-medium leading-snug">{item.label}</span>
                            {item.hint ? (
                              <span className="mt-0.5 block truncate font-mono text-[0.56rem] uppercase tracking-[0.12em] text-muted/60">
                                {item.hint}
                              </span>
                            ) : null}
                          </span>
                          {active ? (
                            <CornerDownLeft size={12} className="shrink-0 text-accent" aria-hidden="true" />
                          ) : null}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))
          )}
        </div>

        {/* footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line-soft bg-surface-2/40 px-3.5 py-2 font-mono text-[0.56rem] uppercase tracking-[0.1em] text-muted/70">
          <span className="flex items-center gap-3">
            <span>↑↓ {en ? "move" : "geser"}</span>
            <span>↵ {en ? "pick" : "pilih"}</span>
            <span>esc {en ? "close" : "tutup"}</span>
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <kbd className="rounded border border-line-soft px-1 py-0.5">⌘</kbd>
            <kbd className="rounded border border-line-soft px-1 py-0.5">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
