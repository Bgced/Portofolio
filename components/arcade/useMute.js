"use client";

import { useSyncExternalStore } from "react";
import { sfx } from "@/lib/sfx";

/** Subscribes to the global mute flag (shared with the 3D mascot). */
export function useMute() {
  const muted = useSyncExternalStore(
    (callback) => sfx.subscribe(callback),
    () => sfx.isMuted(),
    () => false
  );

  return { muted, toggle: () => sfx.toggle() };
}
