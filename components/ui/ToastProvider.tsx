"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "info";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

type ToastRecord = {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
};

type ToastContextValue = {
  toast: (options: ToastOptions | string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
} as const;

const TONE = {
  success: {
    icon: "text-ok",
    ring: "border-ok/35",
    bar: "bg-ok",
  },
  error: {
    icon: "text-danger",
    ring: "border-danger/35",
    bar: "bg-danger",
  },
  info: {
    icon: "text-accent",
    ring: "border-accent/35",
    bar: "bg-accent",
  },
} as const;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastRecord[]>([]);
  const timers = useRef(new Map<number, ReturnType<typeof setTimeout>>());
  const seq = useRef(0);

  const remove = useCallback((id: number) => {
    const timer = timers.current.get(id);
    if (timer) clearTimeout(timer);
    timers.current.delete(id);
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastOptions | string) => {
      const options: ToastOptions = typeof input === "string" ? { title: input } : input;
      const id = (seq.current += 1);
      const record: ToastRecord = {
        id,
        title: options.title,
        description: options.description,
        variant: options.variant ?? "info",
        duration: options.duration ?? 3600,
      };

      setToasts((prev) => [...prev.slice(-3), record]);
      const timer = setTimeout(() => remove(id), record.duration);
      timers.current.set(id, timer);
    },
    [remove]
  );

  useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((timer) => clearTimeout(timer));
      map.clear();
    };
  }, []);

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-4 bottom-20 z-[95] flex flex-col items-stretch gap-2 sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-[356px] sm:items-start"
      >
        {toasts.map((item) => {
          const Icon = ICONS[item.variant];
          const tone = TONE[item.variant];
          return (
            <div
              key={item.id}
              role="status"
              className={`toast-item pointer-events-auto relative w-full overflow-hidden rounded-xl border bg-surface shadow-[0_24px_70px_-30px_rgba(0,0,0,0.8)]  ${tone.ring}`}
            >
              <span className={`absolute inset-y-0 left-0 w-[2px] ${tone.bar}`} aria-hidden="true" />
              <div className="flex items-start gap-3 px-3.5 py-3">
                <Icon size={16} strokeWidth={1.9} className={`mt-0.5 shrink-0 ${tone.icon}`} aria-hidden="true" />
                <div className="min-w-0 flex-1">
                  <p className="text-[0.8rem] font-semibold leading-snug text-ink">{item.title}</p>
                  {item.description ? (
                    <p className="mt-0.5 text-[0.7rem] leading-relaxed text-muted">{item.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  aria-label="Tutup notifikasi"
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-muted/70 transition-colors hover:bg-surface-2 hover:text-ink"
                >
                  <X size={12} aria-hidden="true" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast harus dipakai di dalam <ToastProvider>");
  return ctx;
}
