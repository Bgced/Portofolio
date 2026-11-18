"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/components/providers";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { ArrowUpIcon, CloseIcon } from "@/components/Icons";
import { sfx } from "@/lib/sfx";

/* --------------------------- Scroll progress -------------------------- */
export function ScrollProgress() {
  const fill = useRef(null);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      if (fill.current) fill.current.style.width = `${pct}%`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="fixed inset-x-0 top-0 z-[70] h-0.5 bg-transparent" aria-hidden="true">
      <div
        ref={fill}
        className="h-full w-0 bg-gradient-to-r from-cyan-500 via-cyan-300 to-emerald-400 shadow-[0_0_10px_rgba(0,210,255,0.8)]"
      />
    </div>
  );
}

/* ----------------------------- Cursor glow ---------------------------- */
export function CursorGlow() {
  const glow = useRef(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return undefined;
    if (window.matchMedia("(pointer: coarse)").matches) return undefined;
    const node = glow.current;
    if (!node) return undefined;

    let tx = 0;
    let ty = 0;
    let gx = 0;
    let gy = 0;
    let raf = 0;

    const follow = () => {
      gx += (tx - gx) * 0.12;
      gy += (ty - gy) * 0.12;
      node.style.transform = `translate3d(${gx - 180}px, ${gy - 180}px, 0)`;
      if (Math.abs(tx - gx) > 0.4 || Math.abs(ty - gy) > 0.4) {
        raf = requestAnimationFrame(follow);
      } else {
        raf = 0;
      }
    };

    const onMove = (event) => {
      tx = event.clientX;
      ty = event.clientY;
      node.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(follow);
    };
    const onLeave = () => {
      node.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={glow}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 h-[360px] w-[360px] rounded-full opacity-0 transition-opacity duration-500 [background:radial-gradient(circle,rgba(0,210,255,0.09),transparent_65%)]"
    />
  );
}

/* ------------------------------- Preloader ---------------------------- */
export function Preloader() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 850);
    return () => clearTimeout(timer);
  }, []);

  // Unmount immediately when finished: framer-motion exit animations can hang
  // (see PortfolioArcade) and a stuck overlay would block the whole page.
  if (done) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[90] grid place-items-center bg-surface"
      aria-hidden="true"
    >
          <div className="flex flex-col items-center gap-4">
            <span className="font-mono text-2xl font-bold tracking-tight text-accent">CK</span>
            <div className="h-0.5 w-40 overflow-hidden rounded-full bg-slate-800">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 0.85, ease: "easeInOut" }}
                className="h-full w-1/2 bg-accent"
              />
            </div>
            <span className="font-mono text-[9px] tracking-[0.3em] text-slate-600 uppercase">initialising</span>
          </div>
    </motion.div>
  );
}

/* ------------------------------ Back to top --------------------------- */
export function BackToTop() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return visible ? (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => {
            sfx.play("click");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          aria-label={t("ui.backToTop")}
          className="fixed bottom-4 left-4 z-40 grid h-9 w-9 place-items-center rounded-full border border-line bg-surface/95 text-muted backdrop-blur transition hover:border-accent/50 hover:text-accent sm:bottom-6 sm:left-6"
        >
          <ArrowUpIcon width={15} height={15} />
        </motion.button>
  ) : null;
}

/* --------------------------- Thank-you toast -------------------------- */
export function ThankYouToast() {
  const { t } = useLang();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let showTimer;
    let hideTimer;
    try {
      if (window.localStorage.getItem("ck_visited")) return undefined;
      window.localStorage.setItem("ck_visited", "1");
    } catch {
      return undefined;
    }
    showTimer = setTimeout(() => setVisible(true), 2000);
    hideTimer = setTimeout(() => setVisible(false), 9000);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const words = (text) => text.split(" ");

  return visible ? (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-20 left-4 z-50 max-w-[280px] rounded-xl border border-line bg-surface/95 p-3.5 shadow-2xl backdrop-blur sm:bottom-24 sm:left-6"
      role="status"
    >
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 text-accent">♥</span>
            <div>
              <p className="flex flex-wrap gap-x-1 text-xs font-semibold text-ink">
                {words(t("ui.thanksTitle")).map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + index * 0.07 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
              <p className="mt-1 flex flex-wrap gap-x-1 text-[11px] leading-relaxed text-muted">
                {words(t("ui.thanksSub")).map((word, index) => (
                  <motion.span
                    key={`${word}-${index}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + index * 0.05 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setVisible(false)}
              aria-label="close"
              className="ml-auto text-slate-600 transition hover:text-ink"
            >
              <CloseIcon width={13} height={13} />
            </button>
          </div>
    </motion.div>
  ) : null;
}
