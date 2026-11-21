"use client";

/**
 * ScrollScene — satu Canvas persistent (fixed, z-0, pointer-events-none) untuk
 * seluruh halaman. Semua objeknya balok 3D (wireframe / solid) disebar di
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

type Mood = "wire" | "off";

const PALETTES = {
  light: {
    clay: "#E9F6FA",
    clayEdge: "#7E96A1",
    wire: "#22D3EE",
    rim: "#67E8F9",
    light: 2.1,
    ambient: 1.15,
  },
  dark: {
    clay: "#081014",
    clayEdge: "#22D3EE",
    wire: "#22D3EE",
    rim: "#67E8F9",
    light: 1.2,
    ambient: 0.3,
  },
} as const;

type Shape = {
  key: string;
  /** "box" = balok, "hex" = prisma segi enam (silinder 6 sisi). */
  kind: "box" | "hex";
  /** box: [x, y, z]. hex: [diameter, height, 0]. */
  size: [number, number, number];
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  spin: number;
  drift: number;
};

/** Layout statis — dihitung sekali di module scope, bukan tiap render.
 *  Balok + prisma heksagonal, sisi beda-beda biar nggak monoton. */
const SHAPES: Shape[] = [
  { key: "a", kind: "box", size: [1.1, 2.2, 0.9], position: [-4.6, 2.4, -6], rotation: [0.4, 0.6, 0.1], scale: 1.0, spin: 0.1, drift: 0.5 },
  { key: "b", kind: "box", size: [2.6, 0.8, 0.8], position: [4.4, 1.6, -8], rotation: [0.2, 0.2, 0.35], scale: 1.15, spin: 0.06, drift: 0.7 },
  { key: "c", kind: "box", size: [0.7, 2.8, 0.7], position: [2.6, -2.6, -5], rotation: [0.5, 0.9, 0.2], scale: 1.0, spin: 0.14, drift: 0.35 },
  { key: "d", kind: "box", size: [3.0, 1.2, 1.2], position: [-3.2, -3.4, -9], rotation: [0.2, 0.9, 0.4], scale: 1.25, spin: 0.08, drift: 0.6 },
  { key: "e", kind: "box", size: [4.2, 0.5, 1.6], position: [0.6, 3.6, -11], rotation: [0.3, 0.4, 0.9], scale: 1.1, spin: 0.05, drift: 0.9 },
  { key: "f", kind: "box", size: [0.9, 0.9, 0.9], position: [-1.4, -1.2, -7.5], rotation: [0.6, 0.5, 0.1], scale: 0.8, spin: 0.18, drift: 0.45 },
  { key: "g", kind: "box", size: [2.2, 2.2, 2.2], position: [5.2, -1.8, -12], rotation: [0.5, 0.2, 0.7], scale: 1.3, spin: 0.04, drift: 0.8 },
  { key: "h", kind: "box", size: [3.6, 0.7, 0.7], position: [-5.6, -0.6, -13], rotation: [0.9, 1.2, 0.2], scale: 1.4, spin: 0.03, drift: 1 },
  // Heksagon: bentuk yang beda dari balok biar siluetnya kebaca.
  { key: "i", kind: "hex", size: [1.8, 1.8, 0], position: [3.9, 3.3, -6.5], rotation: [0.25, 0.3, 0.0], scale: 1.0, spin: 0.09, drift: 0.55 },
  { key: "j", kind: "hex", size: [2.6, 1.1, 0], position: [-4.9, 3.5, -10.5], rotation: [1.15, 0.25, 0.18], scale: 1.15, spin: 0.07, drift: 0.75 },
  { key: "k", kind: "hex", size: [1.2, 2.6, 0], position: [5.7, 2.4, -14], rotation: [0.9, 0.6, 0.1], scale: 1.05, spin: 0.05, drift: 0.9 },
  { key: "l", kind: "hex", size: [2.2, 2.2, 0], position: [-6.4, 1.2, -8], rotation: [0.35, 0.9, 0.0], scale: 1.2, spin: 0.06, drift: 0.65 },
  { key: "m", kind: "hex", size: [1.5, 0.9, 0], position: [1.2, -3.8, -9.5], rotation: [0.8, 0.4, 0.15], scale: 0.95, spin: 0.1, drift: 0.5 },
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
    if (shape.kind === "hex") {
      const [diameter, height] = shape.size;
      return new THREE.CylinderGeometry(diameter / 2, diameter / 2, height, 6, 1);
    }
    const [x, y, z] = shape.size;
    return new THREE.BoxGeometry(x, y, z);
  }, [shape.kind, shape.size]);

  const material = useMemo(() => {
    if (wire) {
      return new THREE.MeshBasicMaterial({
        color: palette.wire,
        wireframe: true,
        transparent: true,
        // Heksagon: isi tipis aja, garis tepinya yang bawa bentuk.
        opacity: shape.kind === "hex" ? 0.07 : 0.42,
      });
    }
    return new THREE.MeshStandardMaterial({
      color: palette.clay,
      roughness: 0.92,
      metalness: 0.02,
      flatShading: true,
    });
  }, [wire, palette.wire, palette.clay, shape.kind]);

  const edgeMaterial = useMemo(
    () => new THREE.LineBasicMaterial({ color: palette.clayEdge, transparent: true, opacity: 0.6 }),
    [palette.clayEdge]
  );

  const edges = useMemo(() => new THREE.EdgesGeometry(geometry), [geometry]);

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
      <lineSegments geometry={edges} material={edgeMaterial} />
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
  mouse,
}: {
  mood: Mood;
  palette: (typeof PALETTES)["light"] | (typeof PALETTES)["dark"];
  reduced: boolean;
  /** true cuma di device ber-mouse (hover + pointer fine). Mobile: false. */
  mouse: boolean;
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

  // Pointer cuma dipasang di device ber-mouse. Di mobile listener-nya nggak
  // pernah nempel, jadi gesture jempol nggak pernah ngerusak framing scene.
  useEffect(() => {
    if (!mouse || reduced) {
      pointerTarget.current = { x: 0, y: 0 };
      pointer.current = { x: 0, y: 0 };
      return undefined;
    }
    let raf = 0;
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
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
  }, [invalidate, mouse, reduced]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 1 / 30);
    scroll.current = reduced ? target.current : damp(scroll.current, target.current, 4, dt);
    pointer.current.x = reduced ? 0 : damp(pointer.current.x, pointerTarget.current.x, 3, dt);
    pointer.current.y = reduced ? 0 : damp(pointer.current.y, pointerTarget.current.y, 3, dt);

    const p = scroll.current;
    const wide = size.width > 900;

    // Kamera: turun sedikit + geser samping mengikuti scroll (parallax ruang),
    // plus geser halus ngikutin mouse kalau device-nya ber-mouse.
    camera.position.x = damp(camera.position.x, pointer.current.x * 0.7 + (wide ? 0.6 : 0), 3, dt);
    camera.position.y = damp(camera.position.y, -p * 2.4 - pointer.current.y * 0.36, 3, dt);
    camera.position.z = damp(camera.position.z, 9.2 - p * 1.4, 3, dt);
    camera.lookAt(0, -p * 1.4, 0);

    if (groupRef.current) {
      groupRef.current.rotation.y = damp(
        groupRef.current.rotation.y,
        p * Math.PI * 0.55 + pointer.current.x * 0.18,
        2.5,
        dt
      );
      groupRef.current.rotation.x = damp(groupRef.current.rotation.x, -p * 0.22 - pointer.current.y * 0.05, 2.5, dt);
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

/**
 * Device ber-mouse: media query `(hover: hover) and (pointer: fine)`.
 * Mobile/tablet sentuhan -> false, jadi Rig nggak pernah dengerin pointermove.
 * Nilai awal false (aman buat SSR), hasil asli dipasang di effect.
 */
function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return undefined;
    }
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const apply = () => setFine(mq.matches);

    apply();
    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
    return undefined;
  }, []);

  return fine;
}

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
  const [mood, setMood] = useState<Mood>("wire");
  const [tabHidden, setTabHidden] = useState(false);
  const [inView, setInView] = useState(true);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const webgl = useWebGLSupport();
  const reduced = usePrefersReducedMotion();
  const mouse = useFinePointer();

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
            <directionalLight position={[4, 6, 7]} intensity={palette.light} color="#FFFFFF" />
            <directionalLight position={[-6, -3, -5]} intensity={palette.light * 0.3} color={palette.rim} />
            <Rig mood={mood} palette={palette} reduced={reduced} mouse={mouse} />
            <CanvasSizer />
            <ThemeInvalidator token={mood} />
          </Suspense>
        </Canvas>
      </SceneBoundary>
    </div>
  );
}
