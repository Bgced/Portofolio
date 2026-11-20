"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import GameHud from "@/components/games/GameHud";
import { useBestScore, formatScore } from "@/lib/scores";
import { sfx } from "@/lib/sfx";

const W = 320;
const H = 420;

const PIPE_W = 46;
const PIPE_SPEED = 122; // logical px per second — same pace at every frame rate
const PIPE_GAP = 116;
const PIPE_SPACING = 150;
const EDGE = 34; // min/max room above and below a gap

const BIRD_X = 74;
const BIRD_R = 10;
const START_Y = H * 0.45;
const GRAVITY = 1500; // px / s²
const FLAP_V = -410; // px / s — jump height ≈ 56px, a little under the gap
const MAX_FALL = 520;

const STEP = 1 / 120;

const C = {
  canvas: "#04070A",
  surface: "#081014",
  surface2: "#0C171C",
  ink: "#E9F6FA",
  muted: "#7E96A1",
  line: "#182A31",
  accent: "#22D3EE",
  accent2: "#38BDF8",
  danger: "#ff5d5d",
  ok: "#35d6a4",
};

const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

function createState() {
  return {
    phase: "idle", // idle | playing | dead
    y: START_Y,
    vy: 0,
    rot: 0,
    pipes: [],
    score: 0,
    time: 0, // idle-bob clock
    ground: 0, // ground scroll offset
    shake: 0, // death impact timer
  };
}

function resetState(state) {
  Object.assign(state, createState());
}

function randomGapY() {
  const half = PIPE_GAP / 2;
  const lo = EDGE + half;
  const hi = H - EDGE - half;
  return lo + Math.random() * Math.max(1, hi - lo);
}

function spawnPipe(state, x) {
  state.pipes.push({ x, gapY: randomGapY(), passed: false });
}

/** Advance the world by `dt` seconds. Returns "score" / "hit" when something matters. */
function step(state, dt) {
  if (state.phase === "idle") {
    // Gentle hover so the idle screen feels alive.
    state.time += dt;
    state.y = START_Y + Math.sin(state.time * 3) * 6;
    state.rot = Math.sin(state.time * 3) * 0.12;
    state.ground += PIPE_SPEED * dt;
    return null;
  }

  if (state.phase === "dead") {
    // Impact: a short red flash, then the bird simply rests where it fell.
    if (state.shake > 0) state.shake = Math.max(0, state.shake - dt);
    return null;
  }

  state.vy = Math.min(MAX_FALL, state.vy + GRAVITY * dt);
  state.y += state.vy * dt;

  // Tilt follows velocity: nose up when rising, nose down when falling.
  const target = Math.max(-0.45, Math.min(1.15, state.vy / 560));
  state.rot += (target - state.rot) * Math.min(1, dt * 12);

  state.ground += PIPE_SPEED * dt;

  let event = null;
  for (let i = 0; i < state.pipes.length; i += 1) {
    const p = state.pipes[i];
    p.x -= PIPE_SPEED * dt;
    if (!p.passed && p.x + PIPE_W < BIRD_X - BIRD_R) {
      p.passed = true;
      state.score += 1;
      event = "score";
    }
  }

  // Drop pipes once fully off-screen, then top up the queue right-to-left.
  while (state.pipes.length && state.pipes[0].x + PIPE_W < -4) state.pipes.shift();
  while (
    state.pipes.length === 0 ||
    state.pipes[state.pipes.length - 1].x < W - PIPE_SPACING
  ) {
    const last = state.pipes[state.pipes.length - 1];
    if (!last) {
      spawnPipe(state, W + 20);
    } else if (last.x + PIPE_SPACING < W - 40) {
      spawnPipe(state, W + 20); // queue ran dry: refill off-screen, never in the bird
    } else {
      spawnPipe(state, last.x + PIPE_SPACING);
    }
  }

  // Ceiling is a bounce, not a death — hitting it kills your altitude anyway.
  if (state.y < BIRD_R + 2) {
    state.y = BIRD_R + 2;
    state.vy = Math.max(0, state.vy);
  }

  const floor = H - 2;
  if (state.y + BIRD_R >= floor) {
    state.y = floor - BIRD_R;
    state.shake = 0.5;
    return "hit";
  }

  if (collides(state)) {
    state.shake = 0.5;
    return "hit";
  }

  return event;
}

function collides(state) {
  const r = BIRD_R - 1;
  for (let i = 0; i < state.pipes.length; i += 1) {
    const p = state.pipes[i];
    if (BIRD_X + r <= p.x || BIRD_X - r >= p.x + PIPE_W) continue;
    const gapTop = p.gapY - PIPE_GAP / 2;
    const gapBottom = p.gapY + PIPE_GAP / 2;
    if (state.y - r < gapTop || state.y + r > gapBottom) return true;
  }
  return false;
}

function drawPipe(ctx, x, top, bottom) {
  ctx.fillStyle = C.surface2;
  ctx.fillRect(x, top, PIPE_W, bottom - top);
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.strokeRect(x + 0.5, top + 0.5, PIPE_W - 1, bottom - top - 1);

  // Accent rail on the left face + two dashes for a bit of texture.
  ctx.fillStyle = C.accent;
  ctx.fillRect(x + 5, top + 4, 3, bottom - top - 8);
  ctx.fillStyle = C.line;
  ctx.fillRect(x + PIPE_W - 12, top + 10, 5, 14);
}

function drawWorld(ctx, state) {
  ctx.fillStyle = C.canvas;
  ctx.fillRect(0, 0, W, H);

  // Grid — flat hairlines.
  ctx.strokeStyle = C.surface2;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let x = 0; x <= W; x += 24) {
    ctx.moveTo(x + 0.5, 0);
    ctx.lineTo(x + 0.5, H);
  }
  for (let y = 0; y <= H; y += 24) {
    ctx.moveTo(0, y + 0.5);
    ctx.lineTo(W, y + 0.5);
  }
  ctx.stroke();

  // Pipes
  for (let i = 0; i < state.pipes.length; i += 1) {
    const p = state.pipes[i];
    if (p.x > W || p.x + PIPE_W < 0) continue;
    const gapTop = p.gapY - PIPE_GAP / 2;
    const gapBottom = p.gapY + PIPE_GAP / 2;
    drawPipe(ctx, p.x, 0, gapTop);
    drawPipe(ctx, p.x, gapBottom, H);

    // Lips at the gap edges.
    ctx.fillStyle = C.accent;
    ctx.fillRect(p.x - 3, gapTop - 9, PIPE_W + 6, 9);
    ctx.fillRect(p.x - 3, gapBottom, PIPE_W + 6, 9);
    ctx.strokeStyle = C.accent2;
    ctx.strokeRect(p.x - 2.5, gapTop - 8.5, PIPE_W + 5, 8);
    ctx.strokeRect(p.x - 2.5, gapBottom + 0.5, PIPE_W + 5, 8);
  }

  // Ground band with scrolling ticks.
  const gy = H - 26;
  ctx.fillStyle = C.surface;
  ctx.fillRect(0, gy, W, H - gy);
  ctx.fillStyle = C.line;
  ctx.fillRect(0, gy, W, 1);
  const shift = state.ground % 16;
  ctx.fillStyle = C.surface2;
  for (let x = -16 + shift; x < W; x += 16) {
    ctx.fillRect(x, gy + 1, 8, 3);
  }

  // Bird
  ctx.save();
  ctx.translate(BIRD_X, state.y);
  ctx.rotate(state.rot);
  ctx.fillStyle = state.shake > 0 ? C.danger : C.accent2;
  ctx.strokeStyle = C.ink;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  // Eye
  ctx.fillStyle = C.canvas;
  ctx.beginPath();
  ctx.arc(4, -3, 2.6, 0, Math.PI * 2);
  ctx.fill();
  // Beak
  ctx.fillStyle = C.accent;
  ctx.strokeStyle = C.line;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(BIRD_R - 2, -1);
  ctx.lineTo(BIRD_R + 6, 1);
  ctx.lineTo(BIRD_R - 2, 4);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Death flash
  if (state.shake > 0) {
    ctx.globalAlpha = Math.min(0.22, state.shake * 0.4);
    ctx.fillStyle = C.danger;
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1;
  }
}

function centerText(ctx, text, y, size, color, weight = 700) {
  ctx.font = `${weight} ${size}px ${MONO}`;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, y);
}

function drawOverlay(ctx, state, best) {
  if (state.phase === "idle") {
    // Dim the world a touch so the copy reads.
    ctx.fillStyle = C.surface;
    ctx.globalAlpha = 0.82;
    ctx.fillRect(48, 84, W - 96, 132);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    ctx.strokeRect(48.5, 84.5, W - 97, 131);

    centerText(ctx, "FLAPPY BIRD", 122, 19, C.ink);
    centerText(ctx, "SPACE OR TAP", 158, 12, C.accent2, 600);
    centerText(ctx, `BEST ${formatScore(best)}`, 186, 10, C.muted, 500);
  }

  if (state.phase === "dead") {
    ctx.fillStyle = C.surface;
    ctx.globalAlpha = 0.9;
    ctx.fillRect(40, 118, W - 80, 150);
    ctx.globalAlpha = 1;
    ctx.strokeStyle = C.danger;
    ctx.lineWidth = 1;
    ctx.strokeRect(40.5, 118.5, W - 81, 149);

    centerText(ctx, "GAME OVER", 150, 17, C.ink);
    centerText(ctx, `SCORE ${formatScore(state.score)}`, 184, 12, C.accent2, 600);
    centerText(ctx, `BEST ${formatScore(Math.max(best, state.score))}`, 206, 10, C.muted, 500);
    centerText(ctx, "PLAY AGAIN — SPACE OR TAP", 244, 10, C.muted, 500);
  }
}

export default function FlappyBird() {
  const [best, submitBest] = useBestScore("flappy");
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState("idle");

  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const bestRef = useRef(0);
  const rafRef = useRef(0);
  const lastRef = useRef(0);
  const accRef = useRef(0);
  const phaseRef = useRef("idle");
  const frameRef = useRef(null); // latest rAF callback, so restart() can re-attach

  if (!stateRef.current) {
    stateRef.current = createState();
    // One pipe on the idle screen so the stage never looks empty.
    spawnPipe(stateRef.current, W - 30);
  }

  useEffect(() => {
    bestRef.current = best;
  }, [best]);

  /** One key/click/tap entry point. */
  const flap = useCallback(() => {
    const s = stateRef.current;
    if (!s) return;
    if (s.phase === "idle") {
      resetState(s);
      s.phase = "playing";
      s.pipes.push({ x: W + 20, gapY: randomGapY(), passed: false });
      s.y = START_Y;
      s.vy = FLAP_V;
      phaseRef.current = s.phase;
      setPhase(s.phase);
      setScore(0);
      sfx.play("flip");
      return;
    }
    if (s.phase === "dead") {
      resetState(s);
      phaseRef.current = s.phase;
      setPhase(s.phase);
      setScore(0);
      lastRef.current = 0;
      accRef.current = 0;
      if (!rafRef.current && !document.hidden) {
        rafRef.current = window.requestAnimationFrame(frameRef.current);
      }
      return;
    }
    s.vy = FLAP_V;
    sfx.play("flip");
  }, []);

  const kill = useCallback(() => {
    const s = stateRef.current;
    s.phase = "dead";
    phaseRef.current = "dead";
    setPhase("dead");
    submitBest(s.score);
    sfx.play("lose");
  }, [submitBest]);

  // Simulate + render loop. Never runs while the tab is hidden.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let dpr = 1;
    const resize = () => {
      const rect = wrapRef.current ? wrapRef.current.getBoundingClientRect() : null;
      const cssW = rect && rect.width > 0 ? rect.width : W;
      dpr = Math.min(3, window.devicePixelRatio || 1);
      canvas.width = Math.round(cssW * dpr);
      canvas.height = Math.round(cssW * (H / W) * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    if (wrapRef.current) ro.observe(wrapRef.current);

    const frame = (now) => {
      rafRef.current = 0;
      const s = stateRef.current;
      const last = lastRef.current || now;
      let dt = (now - last) / 1000;
      lastRef.current = now;
      if (!(dt > 0)) dt = 0;
      dt = Math.min(dt, 0.1);

      accRef.current += dt;
      let hit = false;
      let scored = 0;
      while (accRef.current >= STEP) {
        accRef.current -= STEP;
        const ev = step(s, STEP);
        if (ev === "score") scored += 1;
        if (ev === "hit") hit = true;
      }
      if (hit) kill();
      if (scored) {
        setScore(s.score);
        sfx.play("click");
      }

      const k = (canvas.width / W) || 1;
      ctx.setTransform(k, 0, 0, k, 0, 0);
      ctx.clearRect(0, 0, W, H);
      drawWorld(ctx, s);
      drawOverlay(ctx, s, bestRef.current);

      if (phaseRef.current !== "dead") rafRef.current = window.requestAnimationFrame(frame);
    };

    frameRef.current = frame;
    rafRef.current = window.requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
        rafRef.current = 0;
      } else if (!rafRef.current && phaseRef.current !== "dead") {
        lastRef.current = 0;
        accRef.current = 0;
        rafRef.current = window.requestAnimationFrame(frame);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
    };
  }, [kill]);

  // Keyboard.
  useEffect(() => {
    const onKey = (e) => {
      if (e.code !== "Space" && e.key !== " ") return;
      e.preventDefault();
      if (e.repeat) return;
      flap();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  const restart = () => {
    const s = stateRef.current;
    resetState(s);
    phaseRef.current = "idle";
    setPhase("idle");
    setScore(0);
    lastRef.current = 0;
    accRef.current = 0;
    if (!rafRef.current && !document.hidden) {
      lastRef.current = 0;
      accRef.current = 0;
      rafRef.current = window.requestAnimationFrame(frameRef.current);
    }
  };

  return (
    <div className="w-full max-w-[340px] mx-auto space-y-3">
      <GameHud
        title="Flappy Bird"
        score={formatScore(score)}
        best={formatScore(best)}
        extra={phase === "dead" ? "over" : "space / tap"}
        onRestart={restart}
        restartLabel="Reset"
      />

      <div ref={wrapRef} className="playfield overflow-hidden">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Flappy Bird. Score ${score}, best ${best}. Press space or tap to flap.`}
          className="block h-auto w-full touch-manipulation select-none"
          style={{ aspectRatio: `${W} / ${H}` }}
          onPointerDown={(e) => {
            e.preventDefault();
            flap();
          }}
        />
      </div>

      <p className="mono-label text-center">
        {phase === "dead" ? "tap the board to fly again" : "space / tap → flap"}
      </p>
    </div>
  );
}
