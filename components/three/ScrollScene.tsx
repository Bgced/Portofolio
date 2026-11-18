"use client";

/**
 * ScrollScene — satu Canvas persistent (fixed, z-0, pointer-events-none) untuk
 * seluruh halaman. Objek minimalis (balok, ring, wireframe) disebar di
 * kedalaman berbeda, lalu kamera + rotasi digerakkan oleh progress scroll.
 *
 * Prinsip biar aman:
 * - satu Canvas saja sepanjang umur app -> nggak ada context WebGL bolak-balik
 * - frameloop "demand": frame cuma digambar saat scroll/pointer/tema berubah
 * - semua geometry/material di-dispose di cleanup
 * - nggak ada event listener yang dipasang ke canvas (pointer-events-none)
 */

import { Component, Suspense, memo, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePrefersReducedMotion, useWebGLSupport } from "@/lib/hooks";
import { loadPrefs } from "@/lib/ui-prefs";

type Mood = "clay" | "wire" | "off";

const PALETTES = {
  light: {
    clay: "#E7DFD2",
    clayEdge: "#C9BCA8",
    wire: "#8A6A50",
    ring: "#B08968",
    light: 2.1,
    ambient: 1.15,
  },
  dark: {
    clay: "#2A2521",
    clayEdge: "#3B342D",
    wire: "#9C948A",
    ring: "#D48C55",
    light: 1.5,
    ambient: 0.42,
  },
} as const;

type Shape = {
  key: string;
  kind: "box" | "ring" | "torus";
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  spin: number;
  drift: number;
};

/** Layout statis — dihitung sekali di module scope, bukan tiap render. */
const SHAPES: Shape[] = [
  { key: "a", kind: "box", position: [-4.6, 2.4, -6], rotation: [0.4, 0.6, 0.1], scale: 1.15, spin: 0.1, drift: 0.5 },
  { key: "b", kind: "ring", position: [4.4, 1.6, -8], rotation: [1.1, 0.2, 0.3], scale: 1.5, spin: 0.06, drift: 0.7 },
  { key: "c", kind: "torus", position: [2.6, -2.6, -5], rotation: [0.8, 0.9, 0.2], scale: 1.05, spin: 0.14, drift: 0.35 },
  { key: "d", kind: "box", position: [-3.2, -3.4, -9], rotation: [0.2, 0.9, 0.4], scale: 1.7, spin: 0.08, drift: 0.6 },
  { key: "e", kind: "ring", position: [0.6, 3.6, -11], rotation: [0.3, 0.4, 0.9], scale: 2.1, spin: 0.05, drift: 0.9 },
  { key: "f", kind: "torus", position: [-1.4, -1.2, -7.5], rotation: [1.3, 0.5, 0.1], scale: 0.8, spin: 0.18, drift: 0.45 },
  { key: "g", kind: "box", position: [5.2, -1.8, -12], rotation: [0.5, 0.2, 0.7], scale: 2.4, spin: 0.04, drift: 0.8 },
  { key: "h", kind: "ring", position: [-5.6, -0.6, -13], rotation: [0.9, 1.2, 0.2], scale: 2.6, spin: 0.03, drift: 1 },
];

const damp = THREE.MathUtils.damp;
const clamp = THREE.MathUtils.clamp;

/* ------------------------------------------------------------------ */
/*  Objek                                                              */
/* ------------------------------------------------------------------ */

const ShapeMesh = memo(function ShapeMesh({
  shape,
  palette,
  mood,
}: {
  shape: Shape;
  palette: (typeof PALETTES)["light"] | (typeof PALETTES)["dark"];
  mood: Mood;
}) {
  const wire = mood === "wire";

  const geometry = useMemo(() => {
    if (shape.kind === "box") return new THREE.BoxGeometry(1, 1, 1);
    if (shape.kind === "ring") return new THREE.TorusGeometry(0.75, 0.035, 16, 96);
    return new THREE.TorusKnotGeometry(0.55, 0.14, 96, 12);
  }, [shape.kind]);

  const material = useMemo(() => {
    if (wire) {
      return new THREE.MeshBasicMaterial({ color: palette.wire, wireframe: true, transparent: true, opacity: 0.55 });
    }
    return new THREE.MeshStandardMaterial({
      color: palette.clay,
      roughness: 0.92,
      metalness: 0.02,
      flatShading: true,
    });
  }, [wire, palette.wire, palette.clay]);

  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: palette.clayEdge, transparent: true, opacity: 0.5 }),
    [palette.clayEdge]
  );

  const edges = useMemo(() => {
    if (shape.kind !== "box") return null;
    const geo = new THREE.EdgesGeometry(geometry);
    return geo;
  }, [geometry, shape.kind]);

  useEffect(
    () => () => {
      geometry.dispose();
    },
    [geometry]
  );
  useEffect(
    () => () => {
      material.dispose();
    },
    [material]
  );
  useEffect(
    () => () => {
      edgeMaterial.dispose();
    },
    [edgeMaterial]
  );
  useEffect(
    () => () => {
      edges?.dispose();
    },
    [edges]
  );

  return (
    <group position={shape.position} rotation={shape.rotation} scale={shape.scale}>
      <mesh geometry={geometry} material={material} />
      {edges ? <lineSegments geometry={edges} material={edgeMaterial} /> : null}
    </group>
  );
});

/* ------------------------------------------------------------------ */
/*  Rig: kamera + rotasi objek ikut scroll                             */
/* ------------------------------------------------------------------ */

function Rig({
  mood,
  palette,
  reduced,
}: {
  mood: Mood;
  palette: (typeof PALETTES)["light"] | (typeof PALETTES)["dark"];
  reduced: boolean;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);

  const scroll = useRef(0);
  const target = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const pointerTarget = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const read = () => {
      const doc = document.documentElement;
      const max = Math.max(doc.scrollHeight - window.innerHeight, 1);
      target.current = clamp(window.scrollY / max, 0, 1);
      invalidate();
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [invalidate]);

  useEffect(() => {
    let raf = 0;
    const onMove = (event: PointerEvent) => {
      pointerTarget.current = {
        x: (event.clientX / Math.max(window.innerWidth, 1)) * 2 - 1,
        y: (event.clientY / Math.max(window.innerHeight, 1)) * 2 - 1,
      };
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        invalidate();
      });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [invalidate]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    scroll.current = reduced ? target.current : damp(scroll.current, target.current, 4, dt);
    pointer.current.x = reduced ? 0 : damp(pointer.current.x, pointerTarget.current.x, 3, dt);
    pointer.current.y = reduced ? 0 : damp(pointer.current.y, pointerTarget.current.y, 3, dt);

    const p = scroll.current;
    const wide = size.width > 900;

    // Kamera: turun sedikit + geser samping mengikuti scroll (parallax ruang).
    camera.position.x = damp(camera.position.x, pointer.current.x * 0.45 + (wide ? 0.6 : 0), 3, dt);
    camera.position.y = damp(camera.position.y, -p * 2.4 - pointer.current.y * 0.3, 3, dt);
    camera.position.z = damp(camera.position.z, 9.2 - p * 1.4, 3, dt);
    camera.lookAt(0, -p * 1.4, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = damp(groupRef.current.rotation.y, p * Math.PI * 0.55 + pointer.current.x * 0.12, 2.5, dt);
      groupRef.current.rotation.x = damp(groupRef.current.rotation.x, -p * 0.22, 2.5, dt);
      groupRef.current.position.y = -p * 1.1;
    }
  });

  return (
    <group ref={groupRef}>
      {SHAPES.map((shape) => (
        <ShapeMesh key={shape.key} shape={shape} palette={palette} mood={mood} />
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Helper                                                             */
/* ------------------------------------------------------------------ */

function ThemeInvalidator({ token }: { token: string }) {
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => {
    invalidate();
  }, [token, invalidate]);
  return null;
}

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
    let observer: ResizeObserver | null = null;
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

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

/* ------------------------------------------------------------------ */
/*  Public component                                                   */
/* ------------------------------------------------------------------ */

export default function ScrollScene() {
  const [mood, setMood] = useState<Mood>("clay");
  const [tabHidden, setTabHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    setMood(loadPrefs().scene as Mood);

    const onPrefs = (event: Event) => {
      const detail = (event as CustomEvent<{ scene?: Mood }>).detail;
      if (detail?.scene) setMood(detail.scene);
    };
    window.addEventListener("cekael:prefs", onPrefs);

    const onVisibility = () => setTabHidden(document.visibilityState === "hidden");
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("cekael:prefs", onPrefs);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  // IntersectionObserver: hentikan loop saat canvas di luar viewport,
  // dan otomatis hidup lagi begitu balik ke layar (nggak freeze).
  useEffect(() => {
    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) setInView(entry.isIntersecting);
      },
      { threshold: 0 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Satu tema saja (dark), jadi palet scene nggak perlu nunggu tema client.
  const palette = PALETTES.dark;

  if (webgl === null) return null;
  if (!webgl || mood === "off") return null;

  const frameloop = tabHidden || !inView ? "never" : reduced ? "demand" : "always";

  return (
    <div ref={hostRef} className="scene-layer" aria-hidden="true">
      <SceneBoundary fallback={null}>
        <Canvas
          dpr={[1, 1.5]}
          frameloop={frameloop}
          shadows={false}
          camera={{ position: [0, 0, 9.2], fov: 42 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: false }}
          style={{ width: "100%", height: "100%" }}
        >
          <Suspense fallback={null}>
            <ambientLight intensity={palette.ambient} />
            <directionalLight position={[4, 6, 7]} intensity={palette.light} color="#FFF3E6" />
            <directionalLight position={[-6, -3, -5]} intensity={palette.light * 0.35} color={palette.ring} />
            <Rig mood={mood} palette={palette} reduced={reduced} />
            <CanvasSizer />
            <ThemeInvalidator token={mood} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
