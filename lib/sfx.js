"use client";

/**
 * Tiny WebAudio SFX engine — no audio files, no network requests.
 * A single AudioContext is created lazily on the first user gesture.
 */

const STORAGE_KEY = "ck_arcade_muted";

const listeners = new Set();
let muted = false;
let hydrated = false;
let ctx = null;
let master = null;

function hydrate() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  try {
    muted = window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    muted = false;
  }
}

function ensureContext() {
  if (typeof window === "undefined") return null;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!ctx) {
    ctx = new AudioCtx();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

/**
 * One short synthesised blip.
 * @param {object} opts
 */
function tone({ freq = 440, to = null, dur = 0.08, type = "square", gain = 0.05, delay = 0 }) {
  const audio = ensureContext();
  if (!audio || muted) return;

  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const env = audio.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, to), start + dur);

  env.gain.setValueAtTime(0.0001, start);
  env.gain.exponentialRampToValueAtTime(gain, start + 0.012);
  env.gain.exponentialRampToValueAtTime(0.0001, start + dur);

  osc.connect(env);
  env.connect(master);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

const PATCHES = {
  click: () => {
    tone({ freq: 880, to: 660, dur: 0.05, type: "square", gain: 0.03 });
  },
  hover: () => {
    tone({ freq: 1320, to: 1480, dur: 0.03, type: "sine", gain: 0.015 });
  },
  place: () => {
    tone({ freq: 320, to: 520, dur: 0.09, type: "triangle", gain: 0.06 });
    tone({ freq: 640, dur: 0.05, type: "sine", gain: 0.025, delay: 0.04 });
  },
  flip: () => {
    tone({ freq: 520, to: 780, dur: 0.05, type: "triangle", gain: 0.03 });
  },
  match: () => {
    tone({ freq: 660, dur: 0.09, type: "sine", gain: 0.06 });
    tone({ freq: 880, dur: 0.09, type: "sine", gain: 0.05, delay: 0.09 });
    tone({ freq: 1320, dur: 0.12, type: "sine", gain: 0.04, delay: 0.18 });
  },
  error: () => {
    tone({ freq: 180, to: 90, dur: 0.22, type: "sawtooth", gain: 0.05 });
  },
  win: () => {
    [523, 659, 784, 1046].forEach((freq, i) => {
      tone({ freq, dur: 0.16, type: "triangle", gain: 0.06, delay: i * 0.1 });
    });
  },
  lose: () => {
    [392, 330, 262].forEach((freq, i) => {
      tone({ freq, dur: 0.18, type: "sawtooth", gain: 0.045, delay: i * 0.12 });
    });
  },
  arcadeOpen: () => {
    tone({ freq: 220, to: 660, dur: 0.16, type: "square", gain: 0.04 });
    tone({ freq: 990, dur: 0.1, type: "sine", gain: 0.03, delay: 0.14 });
  },
  arcadeClose: () => {
    tone({ freq: 660, to: 220, dur: 0.14, type: "square", gain: 0.035 });
  },
};

export const sfx = {
  play(name) {
    hydrate();
    if (muted) return;
    const patch = PATCHES[name];
    if (patch) patch();
  },
  isMuted() {
    hydrate();
    return muted;
  },
  setMuted(value) {
    hydrate();
    muted = Boolean(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, muted ? "1" : "0");
    } catch {
      /* ignore private-mode failures */
    }
    listeners.forEach((fn) => fn(muted));
  },
  toggle() {
    sfx.setMuted(!sfx.isMuted());
    if (!sfx.isMuted()) sfx.play("click");
  },
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
};
