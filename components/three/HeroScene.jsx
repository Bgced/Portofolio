"use client";

import { Component, Suspense, memo, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Edges, Float } from "@react-three/drei";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { usePrefersReducedMotion, useWebGLSupport } from "@/lib/hooks";
import HeroFallback from "./HeroFallback";

/* ------------------------------------------------------------------
   Palet — dua varian, diturunkan dari resolvedTheme next-themes.
------------------------------------------------------------------- */
const PALETTES = {
  dark: {
    body: "#08090b",
    bodyAccent: "#10151a",
    edge: "#00f0ff",
    edgeSoft: "#0b6f7a",
    ambient: 0.5,
    key: 1.55,
    fill: 0.4,
    coreGlow: 5.5,
    keyColor: "#d7feff",
    bodyMetalness: 0.42,
  },
  light: {
    body: "#dbe3ec",
    bodyAccent: "#eef3f8",
    edge: "#0284c7",
    edgeSoft: "#7dd3fc",
    ambient: 1.02,
    key: 2.2,
    fill: 0.6,
    coreGlow: 0,
    keyColor: "#ffffff",
    bodyMetalness: 0.16,
  },
};

/* ------------------------------------------------------------------
   Data cube — statis, dihitung sekali di module scope.
------------------------------------------------------------------- */
const GRID = 3;
const GAP = 1.05;
const CUBE_SIZE = 0.9;
const CENTER = (GRID - 1) / 2;

const EXPLODED = new Set(["0,0,2", "2,2,0", "2,0,1", "0,2,2"]);

const CUBES = (() => {
  const list = [];
  for (let x = 0; x < GRID; x += 1) {
    for (let y = 0; y < GRID; y += 1) {
      for (let z = 0; z < GRID; z += 1) {
        const key = `${x},${y},${z}`;
        const dx = x - CENTER;
        const dy = y - CENTER;
        const dz = z - CENTER;
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1;
        const burst = EXPLODED.has(key) ? 0.52 : 0;
        const tilt = ((x * 7 + y * 13 + z * 23) % 5 - 2) * 0.014;
        const exploded = EXPLODED.has(key);

        list.push({
          key,
          position: [
            dx * GAP + (dx / len) * burst,
            dy * GAP + (dy / len) * burst,
            dz * GAP + (dz / len) * burst,
          ],
          rotation: exploded
            ? [tilt + 0.34, tilt * 1.6 - 0.28, -tilt + 0.2]
            : [tilt, tilt * 1.6, -tilt],
          scale: exploded ? 0.9 : 1,
          exploded,
        });
      }
    }
  }
  return list;
})();

const SATELLITES = [
  { position: [2.2, 1.4, -0.5], size: 0.3, speed: 1.15, float: 1.3 },
  { position: [-2.3, -0.85, 0.4], size: 0.22, speed: 0.9, float: 1.1 },
  { position: [1.65, -1.85, 0.95], size: 0.26, speed: 1.35, float: 1.5 },
  { position: [-1.8, 1.7, -1.15], size: 0.18, speed: 1.6, float: 1.2 },
];

const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------------
   Cube matrix inti
------------------------------------------------------------------- */
const CubeMatrix = memo(function CubeMatrix({ palette }) {
  const geometry = useMemo(() => new THREE.BoxGeometry(CUBE_SIZE, CUBE_SIZE, CUBE_SIZE), []);

  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.body),
        roughness: 0.58,
        metalness: palette.bodyMetalness,
        flatShading: false,
        // geser face sedikit ke belakang biar garis Edges nggak z-fighting
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    [palette.body, palette.bodyMetalness]
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.bodyAccent),
        roughness: 0.4,
        metalness: palette.bodyMetalness + 0.15,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    [palette.bodyAccent, palette.bodyMetalness]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => bodyMaterial.dispose(), [bodyMaterial]);
  useEffect(() => () => accentMaterial.dispose(), [accentMaterial]);

  return (
    <group>
      {CUBES.map((cube) => (
        <mesh
          key={cube.key}
          geometry={geometry}
          material={cube.exploded ? accentMaterial : bodyMaterial}
          position={cube.position}
          rotation={cube.rotation}
          scale={cube.scale}
        >
          <Edges color={palette.edge} lineWidth={1.15} />
        </mesh>
      ))}

      {/* glow inti — cuma nyala di dark theme */}
      {palette.coreGlow > 0 ? (
        <pointLight
          position={[0, 0, 0.9]}
          color={palette.edge}
          intensity={palette.coreGlow}
          distance={7}
          decay={2}
        />
      ) : null}
    </group>
  );
});

/* ------------------------------------------------------------------
   Satelit
------------------------------------------------------------------- */
const Satellite = memo(function Satellite({ spec, palette, animate }) {
  const geometry = useMemo(
    () => new THREE.BoxGeometry(spec.size, spec.size, spec.size),
    [spec.size]
  );
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(palette.body),
        roughness: 0.5,
        metalness: 0.5,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1,
      }),
    [palette.body]
  );

  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const cube = (
    <mesh geometry={geometry} material={material} rotation={[0.5, 0.7, 0.2]}>
      <Edges color={palette.edgeSoft} lineWidth={1} />
    </mesh>
  );

  if (!animate) {
    return <group position={spec.position}>{cube}</group>;
  }

  return (
    <Float
      speed={spec.speed}
      rotationIntensity={0.55}
      floatIntensity={spec.float}
      floatingRange={[-0.12, 0.12]}
    >
      <group position={spec.position}>{cube}</group>
    </Float>
  );
});

/* ------------------------------------------------------------------
   Rig — auto-rotate + drag (dengan inertia) + parallax pointer
------------------------------------------------------------------- */
function Rig({ reduced, children }) {
  const outer = useRef(null);
  const inner = useRef(null);
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  const st = useRef({
    targetX: -0.2,
    targetY: 0.45,
    curX: -0.2,
    curY: 0.45,
    vx: 0,
    vy: 0,
    dragging: false,
    lastX: 0,
    lastY: 0,
    pointerX: 0,
    pointerY: 0,
    scroll: 0,
    scrollTarget: 0,
  });

  useEffect(() => {
    const el = gl.domElement;
    const s = st.current;
    let activePointer = null;

    const onDown = (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      s.dragging = true;
      s.vx = 0;
      s.vy = 0;
      s.lastX = event.clientX;
      s.lastY = event.clientY;
      activePointer = event.pointerId;
      try {
        el.setPointerCapture(event.pointerId);
      } catch {
        /* pointer capture opsional */
      }
    };

    const onMove = (event) => {
      const rect = el.getBoundingClientRect();
      const width = Math.max(rect.width, 1);
      const height = Math.max(rect.height, 1);
      s.pointerX = ((event.clientX - rect.left) / width) * 2 - 1;
      s.pointerY = ((event.clientY - rect.top) / height) * 2 - 1;

      if (!s.dragging) return;

      const dx = event.clientX - s.lastX;
      const dy = event.clientY - s.lastY;
      s.lastX = event.clientX;
      s.lastY = event.clientY;

      const k = 0.0062;
      s.targetY += dx * k;
      s.targetX = clamp(s.targetX + dy * k * 0.85, -0.85, 0.85);
      s.vy = clamp(dx * k, -0.14, 0.14);
      s.vx = clamp(dy * k * 0.85, -0.08, 0.08);
      invalidate();
    };

    const onUp = (event) => {
      if (activePointer !== null && event && event.pointerId !== activePointer) return;
      if (!s.dragging) return;
      s.dragging = false;
      activePointer = null;
      try {
        if (event && el.hasPointerCapture(event.pointerId)) {
          el.releasePointerCapture(event.pointerId);
        }
      } catch {
        /* ignore */
      }
      invalidate();
    };

    const onLeave = () => {
      // pointer keluar canvas: parallax balik ke tengah, drag tetap jalan sampai pointerup
      s.pointerX = 0;
      s.pointerY = 0;
    };

    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerup", onUp);

    return () => {
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerup", onUp);
    };
  }, [gl, invalidate]);

  /**
   * Scroll-driven motion: setiap gulir ngubah rotasi + posisi matriks,
   * jadi objeknya tetap "hidup" walau mouse nggak gerak.
   */
  useEffect(() => {
    const s = st.current;

    const syncScroll = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      s.scrollTarget = clamp(window.scrollY / max, 0, 1);
      invalidate();
    };

    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    window.addEventListener("resize", syncScroll);

    return () => {
      window.removeEventListener("scroll", syncScroll);
      window.removeEventListener("resize", syncScroll);
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const s = st.current;
    const dt = Math.min(delta, 1 / 30);
    const autoSpeed = reduced ? 0 : 0.2;

    if (!s.dragging) {
      // inertia setelah dilepas
      s.targetY += s.vy;
      s.targetX = clamp(s.targetX + s.vx, -0.85, 0.85);

      const decay = Math.exp(-3.4 * dt);
      s.vy *= decay;
      s.vx *= decay;

      const idle = Math.abs(s.vy) < 0.0012 && Math.abs(s.vx) < 0.0012;
      s.targetY += (idle ? autoSpeed : autoSpeed * 0.15) * dt;
    }

    s.curY = THREE.MathUtils.damp(s.curY, s.targetY, 6, dt);
    s.curX = THREE.MathUtils.damp(s.curX, s.targetX, 6, dt);
    s.scroll = reduced
      ? s.scrollTarget
      : THREE.MathUtils.damp(s.scroll, s.scrollTarget, 4.2, dt);

    const spin = s.scroll;

    if (reduced) {
      // tanpa animasi: langsung ikut pointer, tanpa momentum
      s.curX = s.targetX;
      s.curY = s.targetY;
      s.vx = 0;
      s.vy = 0;
    }

    if (inner.current) {
      inner.current.rotation.y = s.curY + spin * Math.PI * 1.25;
      inner.current.rotation.x = s.curX + Math.sin(spin * Math.PI) * 0.2;
      inner.current.rotation.z = spin * 0.34;
      inner.current.position.y = -spin * 0.85;
      inner.current.scale.setScalar(1 + spin * 0.05);
    }

    if (outer.current) {
      const px = reduced ? 0 : s.pointerX;
      const py = reduced ? 0 : s.pointerY;
      outer.current.rotation.y = THREE.MathUtils.damp(outer.current.rotation.y, px * 0.18, 3, dt);
      outer.current.rotation.x = THREE.MathUtils.damp(outer.current.rotation.x, py * 0.12, 3, dt);
      outer.current.position.x = THREE.MathUtils.damp(outer.current.position.x, px * 0.22, 3, dt);
      outer.current.position.y = THREE.MathUtils.damp(outer.current.position.y, -py * 0.16, 3, dt);
    }
  });

  return (
    <group ref={outer}>
      <group ref={inner} rotation={[-0.2, 0.45, 0]}>
        {children}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------
   Isi scene
------------------------------------------------------------------- */
const SceneContents = memo(function SceneContents({ palette, reduced }) {
  return (
    <>
      <ambientLight intensity={palette.ambient} />
      <directionalLight position={[4, 6, 6]} intensity={palette.key} color={palette.keyColor} />
      <directionalLight
        position={[-5, -3.5, -4]}
        intensity={palette.fill}
        color={palette.edgeSoft}
      />
      <pointLight position={[-3.5, 3, 3.5]} intensity={palette.key * 0.6} color={palette.edge} />

      <group scale={1.06} position={[0, -0.1, 0]}>
        <Rig reduced={reduced}>
          <CubeMatrix palette={palette} />
          {SATELLITES.map((spec) => (
            <Satellite
              key={spec.position.join(":")}
              spec={spec}
              palette={palette}
              animate={!reduced}
            />
          ))}
        </Rig>
      </group>
    </>
  );
});

/** Pastikan frame baru digambar kalau tema berubah saat frameloop='demand'. */
function ThemeInvalidator({ paletteKey }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [paletteKey, invalidate]);
  return null;
}

/**
 * Kadang ResizeObserver bawaan R3F nggak ngeh ukuran parent (terutama pas
 * Canvas di-mount di dalam panel yang baru muncul / frameloop='never').
 * Sizer ini maksa canvas ngikutin ukuran container + redraw.
 */
function CanvasSizer() {
  const gl = useThree((state) => state.gl);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    const parent = gl.domElement.parentElement;
    if (!parent) return undefined;

    let raf = 0;
    const apply = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = parent.getBoundingClientRect();
        if (rect.width > 1 && rect.height > 1) {
          gl.setSize(rect.width, rect.height, true);
          invalidate();
        }
      });
    };

    apply();

    let observer = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(apply);
      observer.observe(parent);
    }
    window.addEventListener("resize", apply);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (observer) observer.disconnect();
      window.removeEventListener("resize", apply);
    };
  }, [gl, invalidate]);

  return null;
}

/* ------------------------------------------------------------------
   Error boundary buat kegagalan WebGL context
------------------------------------------------------------------- */
class CanvasBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    // context hilang / driver nolak — biarkan fallback CSS yang tampil
    if (this.props.onFail) this.props.onFail();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/* ------------------------------------------------------------------
   Loading skeleton
------------------------------------------------------------------- */
function SceneSkeleton() {
  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-3">
      <span className="spin-slow inline-block h-12 w-12 rotate-45 border border-line" />
      <span className="mono-label">booting scene ck-01</span>
    </div>
  );
}

/* ------------------------------------------------------------------
   Wrapper — Canvas + deteksi WebGL + tema
------------------------------------------------------------------- */
export default function HeroScene({ className = "", inView = true }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [crashed, setCrashed] = useState(false);
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();

  useEffect(() => setMounted(true), []);

  const isLight = mounted && resolvedTheme === "light";
  const palette = isLight ? PALETTES.light : PALETTES.dark;
  const paletteKey = isLight ? "light" : "dark";

  const frameloop = !inView ? "never" : reduced ? "demand" : "always";

  if (webgl === null) {
    return (
      <div className={`h-full w-full ${className}`}>
        <SceneSkeleton />
      </div>
    );
  }

  if (!webgl || crashed) {
    return (
      <div className={`h-full w-full ${className}`}>
        <HeroFallback />
      </div>
    );
  }

  return (
    <div className={`h-full w-full ${className}`}>
      <CanvasBoundary fallback={<HeroFallback />} onFail={() => setCrashed(true)}>
        <Canvas
          dpr={[1, 1.75]}
          frameloop={frameloop}
          shadows={false}
          camera={{ position: [0, 0, 9], fov: 38 }}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "high-performance",
            preserveDrawingBuffer: false,
          }}
          style={{ width: "100%", height: "100%", touchAction: "none" }}
          className="cursor-grab active:cursor-grabbing"
        >
          <Suspense fallback={null}>
            <SceneContents palette={palette} reduced={reduced} />
            <CanvasSizer />
            <ThemeInvalidator paletteKey={paletteKey} />
          </Suspense>
        </Canvas>
      </CanvasBoundary>
    </div>
  );
}
