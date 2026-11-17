"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes dipakai supaya theme sudah dipasang sebelum paint
 * (script inline di <head>) — jadi nggak ada flicker / hydration mismatch.
 * attribute="class" -> <html class="dark"> atau <html class="light">.
 */
export function Providers({ children }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      storageKey="cekael-theme"
      disableTransitionOnChange={false}
    >
      {children}
    </NextThemesProvider>
  );
}
