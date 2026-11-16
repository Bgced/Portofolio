"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Tracks which section is currently in view (for nav highlighting + the 2D mascot).
 *  Scroll-based so it works even when IntersectionObserver callbacks are throttled
 *  (background tabs, some headless/low-power contexts). */
export function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    let lastRun = 0;

    const pick = () => {
      const probe = window.innerHeight * 0.4;
      let current = ids[0];
      let bestTop = -Infinity;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top;
        // closest section above the probe line — order in `ids` never matters
        if (top <= probe && top > bestTop) {
          bestTop = top;
          current = id;
        }
      }

      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 6) {
        current = ids[ids.length - 1];
      }

      // identity-checked setter keeps this from re-rendering on every scroll frame
      setActive((prev) => (prev === current ? prev : current));
    };

    // Timestamp throttle rather than rAF: rAF is suspended in background tabs,
    // which would silently freeze the nav highlight.
    const onScroll = () => {
      const now = Date.now();
      if (now - lastRun < 100) return;
      lastRun = now;
      pick();
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("visibilitychange", pick);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", pick);
    };
  }, [ids]);

  return active;
}

/** True when the user asked the OS for reduced motion. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const onChange = (event) => setReduced(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}

/** Fires once when the element first scrolls into view. */
export function useInViewOnce(options = { threshold: 0.2 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setInView(true);
        observer.disconnect();
      }
    }, options);
    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}

/** Small persisted-state helper that is SSR safe. */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setReady(true);
  }, [key]);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore */
    }
  }, [key, value, ready]);

  return [value, setValue, ready];
}

/** Smooth-scrolls to a hash while keeping the URL clean enough for anchors. */
export function useScrollTo() {
  return useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);
}
