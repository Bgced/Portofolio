"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

/**
 * Tombol switch tema. Placeholder berukuran sama dipakai sebelum mounted
 * supaya nggak ada hydration mismatch (server nggak tahu tema user).
 */
export default function ThemeToggle({ className = "" }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = resolvedTheme !== "light";
  const nextLabel = isDark ? "Aktifkan tema terang" : "Aktifkan tema gelap";

  if (!mounted) {
    return (
      <span
        aria-hidden="true"
        className={`grid h-9 w-9 place-items-center rounded-lg border border-line-soft bg-surface-2 ${className}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={nextLabel}
      title={nextLabel}
      className={`group grid h-9 w-9 place-items-center rounded-lg border border-line bg-surface-2 text-muted transition-colors duration-200 hover:border-accent hover:text-accent ${className}`}
    >
      {isDark ? (
        <Sun size={16} strokeWidth={1.8} aria-hidden="true" />
      ) : (
        <Moon size={16} strokeWidth={1.8} aria-hidden="true" />
      )}
    </button>
  );
}
