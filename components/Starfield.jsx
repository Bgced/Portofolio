"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers";
import { SEASONS } from "@/lib/content";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { bgSettings } from "@/lib/bgSettings";

const SEASON_DURATION = 10_000;

function makeParticle(type, width, height, randomY) {
  const base = {
    x: Math.random() * width,
    y: randomY ? Math.random() * height : -20,
    vx: 0,
    vy: 0,
    alpha: 1,
    size: 2,
    rot: Math.random() * Math.PI * 2,
    rotSpeed: 0,
    phase: Math.random() * Math.PI * 2,
    type,
  };
  switch (type) {
    case "snow":
      return { ...base, vy: Math.random() * 0.8 + 0.3, vx: (Math.random() - 0.5) * 0.5, size: Math.random() * 2 + 1, alpha: Math.random() * 0.4 + 0.2, color: "#e8f0ff" };
    case "rain":
      return { ...base, vy: Math.random() * 6 + 5, vx: Math.random() * 1.5 - 0.75, size: Math.random() * 0.8 + 0.4, alpha: Math.random() * 0.2 + 0.1, color: "#80b8e8" };
    case "petals":
      return { ...base, vy: Math.random() * 1.2 + 0.5, vx: Math.sin(Math.random() * Math.PI) * 0.8, size: Math.random() * 5 + 3, alpha: Math.random() * 0.4 + 0.2, rotSpeed: Math.random() * 0.03 - 0.015, color: Math.random() > 0.5 ? "#ffb3d9" : "#ffc0cb" };
    case "leaves":
      return { ...base, vy: Math.random() * 1.5 + 0.6, vx: Math.random() * 1.5 - 0.75, size: Math.random() * 6 + 3, alpha: Math.random() * 0.5 + 0.15, rotSpeed: Math.random() * 0.04 - 0.02, color: Math.random() > 0.5 ? "#e07020" : "#c8a000" };
    case "fireflies":
      return { ...base, vy: Math.random() * 0.4 - 0.05, vx: (Math.random() - 0.5) * 0.8, size: Math.random() * 2 + 1, alpha: 0, color: Math.random() > 0.5 ? "#ffdd88" : "#ffffaa" };
    default:
      return base;
  }
}

/**
 * Starfield + seasonal particles. One rAF loop, all state in refs, and it
 * stops completely when the tab is hidden or reduced motion is requested.
 */
export default function Starfield() {
  const { theme } = useTheme();
  const reduced = usePrefersReducedMotion();
  const starsRef = useRef(null);
  const seasonRef = useRef(null);
  const seasonIndex = useRef(0);
  const linkDist = useRef(100);
  const frame = useRef(0);

  // keep link distance in sync with the Skills demo slider without re-rendering
  useEffect(() => bgSettings.subscribe((value) => { linkDist.current = value; }), []);

  useEffect(() => {
    const starCanvas = starsRef.current;
    const seasonCanvas = seasonRef.current;
    if (!starCanvas || !seasonCanvas) return undefined;

    const starCtx = starCanvas.getContext("2d");
    const seasonCtx = seasonCanvas.getContext("2d");
    if (!starCtx || !seasonCtx) return undefined;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let stars = [];
    let particles = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      for (const canvas of [starCanvas, seasonCanvas]) {
        canvas.width = width;
        canvas.height = height;
      }
      const count = Math.min(170, Math.floor((width * height) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.3 + 0.3,
        alpha: Math.random() * 0.6 + 0.25,
        twinkle: Math.random() * 0.015 + 0.004,
        angle: Math.random() * Math.PI * 2,
      }));
    };

    const spawnParticles = () => {
      const season = SEASONS[seasonIndex.current];
      const count = width < 640 ? 40 : 70;
      particles = Array.from({ length: count }, () => makeParticle(season.particles, width, height, true));
    };

    const drawStars = () => {
      starCtx.clearRect(0, 0, width, height);
      for (const star of stars) {
        star.angle += star.twinkle;
        const alpha = star.alpha * (0.7 + 0.3 * Math.sin(star.angle));
        starCtx.beginPath();
        starCtx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        starCtx.fillStyle = `rgba(200,230,255,${alpha.toFixed(3)})`;
        starCtx.fill();
      }

      // constellation lines — density controlled by the Skills demo slider
      const threshold = (linkDist.current / 100) * 120;
      if (threshold < 8) return;
      starCtx.lineWidth = 0.4;
      for (let i = 0; i < stars.length; i += 1) {
        for (let j = i + 1; j < stars.length; j += 1) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist > threshold) continue;
          const alpha = (1 - dist / threshold) * 0.16;
          starCtx.beginPath();
          starCtx.moveTo(stars[i].x, stars[i].y);
          starCtx.lineTo(stars[j].x, stars[j].y);
          starCtx.strokeStyle = `rgba(0,200,255,${alpha.toFixed(3)})`;
          starCtx.stroke();
        }
      }
    };

    const updateParticles = () => {
      const season = SEASONS[seasonIndex.current];
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.rotSpeed;
        if (p.type === "fireflies") {
          p.phase += 0.05;
          p.alpha = 0.3 + 0.7 * Math.abs(Math.sin(p.phase));
          p.vx += (Math.random() - 0.5) * 0.08;
          p.vy += (Math.random() - 0.5) * 0.06;
          p.vx *= 0.99;
          p.vy *= 0.99;
        } else if (p.type === "petals") {
          p.vx = Math.sin(p.y * 0.01) * 1.2;
        }
        if (p.y > height + 30) Object.assign(p, makeParticle(season.particles, width, height, false));
        if (p.x < -30) p.x = width + 30;
        if (p.x > width + 30) p.x = -30;
      }
    };

    const drawParticles = () => {
      seasonCtx.clearRect(0, 0, width, height);
      seasonCtx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        seasonCtx.save();
        seasonCtx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        if (p.type === "snow") {
          seasonCtx.beginPath();
          seasonCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          seasonCtx.fillStyle = p.color;
          seasonCtx.fill();
        } else if (p.type === "rain") {
          seasonCtx.beginPath();
          seasonCtx.moveTo(p.x, p.y);
          seasonCtx.lineTo(p.x + p.vx * 2.5, p.y + p.vy * 2.5);
          seasonCtx.strokeStyle = p.color;
          seasonCtx.lineWidth = p.size;
          seasonCtx.lineCap = "round";
          seasonCtx.stroke();
        } else if (p.type === "petals" || p.type === "leaves") {
          seasonCtx.translate(p.x, p.y);
          seasonCtx.rotate(p.rot);
          seasonCtx.beginPath();
          const squash = p.type === "leaves" ? 0.5 : 1;
          seasonCtx.ellipse(0, 0, p.size * 0.55, p.size * (squash === 1 ? 1 : 0.55), 0, 0, Math.PI * 2);
          seasonCtx.fillStyle = p.color;
          seasonCtx.fill();
        } else if (p.type === "fireflies") {
          seasonCtx.beginPath();
          seasonCtx.arc(p.x, p.y, p.size * 4, 0, Math.PI * 2);
          seasonCtx.fillStyle = `rgba(100,200,255,${p.alpha * 0.07})`;
          seasonCtx.fill();
          seasonCtx.beginPath();
          seasonCtx.arc(p.x, p.y, p.size * 0.9, 0, Math.PI * 2);
          seasonCtx.fillStyle = `rgba(220,255,255,${p.alpha * 0.85})`;
          seasonCtx.fill();
        }
        seasonCtx.restore();
      }
      seasonCtx.globalCompositeOperation = "source-over";
    };

    resize();
    spawnParticles();

    if (reduced || theme === "light") {
      // static, single paint — no animation loop at all
      drawStars();
      drawParticles();
      return undefined;
    }

    let last = 0;
    const loop = (time) => {
      if (time - last > 1000 / 45) {
        last = time;
        drawStars();
        updateParticles();
        drawParticles();
      }
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);

    let seasonTimer = setInterval(() => {
      seasonIndex.current = (seasonIndex.current + 1) % SEASONS.length;
      spawnParticles();
    }, SEASON_DURATION);

    const onResize = () => {
      resize();
      spawnParticles();
    };
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame.current);
      } else {
        frame.current = requestAnimationFrame(loop);
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(frame.current);
      clearInterval(seasonTimer);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [theme, reduced]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-slate-950" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(0,120,180,0.16),transparent_55%),radial-gradient(ellipse_at_85%_15%,rgba(0,210,255,0.08),transparent_50%)]" />
      <canvas ref={starsRef} className="absolute inset-0 h-full w-full opacity-90" />
      <canvas ref={seasonRef} className="absolute inset-0 h-full w-full opacity-80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,#020617_100%)]" />
    </div>
  );
}
