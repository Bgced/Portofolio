"use client";

import { useCallback, useEffect, useState } from "react";

const PREFIX = "cekael:best:";

function read(key) {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 0;
  } catch {
    return 0;
  }
}

/**
 * Best score untuk satu kartrid. Disimpan lokal di perangkat ini saja.
 * `submit(score)` cuma naik kalau lebih tinggi dari rekor sebelumnya.
 */
export function useBestScore(key) {
  const [best, setBest] = useState(0);

  useEffect(() => {
    setBest(read(key));
  }, [key]);

  const submit = useCallback(
    (score) => {
      const value = Math.max(0, Math.round(Number(score) || 0));
      setBest((prev) => {
        if (value <= prev) return prev;
        try {
          window.localStorage.setItem(PREFIX + key, String(value));
        } catch {
          /* private mode: rekor tetap jalan di sesi ini */
        }
        return value;
      });
    },
    [key]
  );

  return [best, submit];
}

export function formatScore(value) {
  return new Intl.NumberFormat("en-US").format(Math.max(0, Math.round(value || 0)));
}
