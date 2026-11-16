"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, OrbitControls, RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { sfx } from "@/lib/sfx";
import { useLang } from "@/components/providers";
import { usePrefersReducedMotion } from "@/lib/hooks";

const CYAN = "#00d2ff";
const AMBER = "#ffb020";
const METAL = "#1b2536";
const METAL_DARK = "#0e1626";

const damp = THREE.MathUtils.damp;
const easeInOutCubic = (p) => (p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2);

const SPEECH = {
  id: [
    "Halo! Cek project Teknik Elektro & Web saya di bawah!",
    "Sistem stabil. Mau lihat arcade-nya?",
    "Klik aku lagi, aku nggak keberatan kok. ⚡",
  ],
  en: [
    "Hi! Check out my Electrical & Web projects below!",
    "Systems stable. Want to see the arcade?",
    "Click me again — I don't mind. ⚡",
  ],
};

/**
 * A floating, stylised low-poly engineer robot.
 * All per-frame animation is done through refs + delta inside useFrame,
 * so this component never re-renders while the scene is running.
 */
function Robot({ scrollRef, reduced, onSpeak }) {
  const root = useRef(null);
  const body = useRef(null);
  const head = useRef(null);
  const visorMat = useRef(null);
  const eyeL = useRef(null);
  const eyeR = useRef(null);
  const antennaTip = useRef(null);
  const chestMat = useRef(null);
  const ringA = useRef(null);
  const ringB = useRef(null);
  const ringC = useRef(null);
  const handL = useRef(null);
  const handR = useRef(null);

  // animation state in refs — never in React state (avoids re-renders at 60fps)
  const anim = useRef({
    spinT: -1,
    squashT: -1,
    visorTarget: new THREE.Color(CYAN),
    eyeScale: 1,
  });

  const visorColors = useMemo(() => [new THREE.Color(CYAN), new THREE.Color(AMBER)], []);

  useEffect(() => {
    return () => {
      document.body.style.cursor = "";
    };
  }, []);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.elapsedTime;
    const a = anim.current;

    // 1. continuous hover — sine on the root, phase-shifted for the hands
    if (root.current) {
      const float = reduced ? 0 : Math.sin(t * 1.15) * 0.075;
      root.current.position.y = -0.18 + float;
      const scroll = scrollRef.current ?? 0;
      root.current.rotation.z = damp(root.current.rotation.z, reduced ? 0 : scroll * 0.07, 3, dt);
      root.current.rotation.x = damp(
        root.current.rotation.x,
        reduced ? 0 : -0.04 + scroll * 0.05,
        3,
        dt
      );
    }

    // 2. head + eyes follow the pointer, smoothly damped
    if (head.current) {
      const px = state.pointer.x;
      const py = state.pointer.y;
      head.current.rotation.y = damp(head.current.rotation.y, reduced ? 0 : px * 0.42, 5, dt);
      head.current.rotation.x = damp(head.current.rotation.x, reduced ? 0 : -py * 0.26, 5, dt);
      head.current.position.y = 1.16 + (reduced ? 0 : Math.sin(t * 1.5 + 0.6) * 0.02);
    }

    const eyeTargetX = reduced ? 0 : state.pointer.x * 0.055;
    const eyeTargetY = reduced ? 0 : -state.pointer.y * 0.035;
    for (const eye of [eyeL.current, eyeR.current]) {
      if (!eye) continue;
      eye.position.x = damp(eye.position.x, (eye === eyeL.current ? -0.19 : 0.19) + eyeTargetX, 8, dt);
      eye.position.y = damp(eye.position.y, 0.02 + eyeTargetY, 8, dt);
    }

    // blink every ~4s, damped so it never snaps
    const blinkCycle = t % 4.2;
    const blinkTarget = !reduced && blinkCycle > 4.02 ? 0.12 : 1;
    a.eyeScale = damp(a.eyeScale, blinkTarget, 22, dt);
    if (eyeL.current) eyeL.current.scale.y = a.eyeScale;
    if (eyeR.current) eyeR.current.scale.y = a.eyeScale;

    // 3. thruster rings spin at different speeds
    if (!reduced) {
      if (ringA.current) ringA.current.rotation.y += dt * 0.85;
      if (ringB.current) ringB.current.rotation.y -= dt * 1.25;
      if (ringC.current) ringC.current.rotation.y += dt * 1.9;
    }

    // 4. detached hands bob and drift
    if (handL.current) {
      handL.current.position.y = 0.42 + (reduced ? 0 : Math.sin(t * 1.35 + 1.1) * 0.07);
      handL.current.rotation.z = reduced ? 0 : Math.sin(t * 0.9) * 0.1;
    }
    if (handR.current) {
      handR.current.position.y = 0.42 + (reduced ? 0 : Math.sin(t * 1.35 + 2.4) * 0.07);
      handR.current.rotation.z = reduced ? 0 : Math.sin(t * 0.9 + 1.6) * 0.1;
    }

    // 5. click reaction: full 360° spin
    if (a.spinT >= 0) {
      a.spinT += dt;
      const p = Math.min(a.spinT / 0.85, 1);
      if (root.current) root.current.rotation.y = easeInOutCubic(p) * Math.PI * 2;
      if (p >= 1) {
        a.spinT = -1;
        if (root.current) root.current.rotation.y = 0;
      }
    }

    // 6. click reaction: squash & stretch on the body only
    if (a.squashT >= 0) {
      a.squashT += dt;
      const p = Math.min(a.squashT / 0.42, 1);
      const amount = Math.sin(p * Math.PI) * 0.16;
      if (body.current) {
        body.current.scale.set(1 - amount * 0.55, 1 + amount, 1 - amount * 0.55);
      }
      if (p >= 1) {
        a.squashT = -1;
        if (body.current) body.current.scale.set(1, 1, 1);
      }
    }

    // 7. visor + antenna + chest glow
    if (visorMat.current) {
      visorMat.current.color.lerp(a.visorTarget, 1 - Math.exp(-6 * dt));
      visorMat.current.emissive.lerp(a.visorTarget, 1 - Math.exp(-6 * dt));
      visorMat.current.emissiveIntensity = 1.5 + Math.sin(t * 2.2) * 0.35;
    }
    if (antennaTip.current) {
      antennaTip.current.emissiveIntensity = 1.8 + Math.sin(t * 3.1) * 0.9;
    }
    if (chestMat.current) {
      chestMat.current.emissiveIntensity = 1.1 + Math.sin(t * 1.8 + 1) * 0.4;
    }
  });

  const handleClick = useCallback(
    (event) => {
      event.stopPropagation();
      const a = anim.current;
      a.spinT = 0;
      a.squashT = 0;
      a.visorTarget.copy(a.visorTarget.equals(visorColors[0]) ? visorColors[1] : visorColors[0]);
      sfx.play("place");
      onSpeak?.();
    },
    [onSpeak, visorColors]
  );

  return (
    <group
      ref={root}
      position={[0, -0.18, 0]}
      onClick={handleClick}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "";
      }}
    >
      {/* ---------------------------- BODY ---------------------------- */}
      <group ref={body}>
        <RoundedBox args={[1.02, 0.94, 0.7]} radius={0.16} smoothness={4} position={[0, 0.38, 0]}>
          <meshStandardMaterial color={METAL} metalness={0.72} roughness={0.34} />
        </RoundedBox>

        {/* chest reactor */}
        <RoundedBox args={[0.58, 0.4, 0.05]} radius={0.07} smoothness={3} position={[0, 0.42, 0.36]}>
          <meshStandardMaterial
            ref={chestMat}
            color="#06121b"
            emissive={CYAN}
            emissiveIntensity={1.2}
            roughness={0.25}
            metalness={0.4}
          />
        </RoundedBox>

        {/* chest strips */}
        <mesh position={[-0.17, 0.42, 0.395]}>
          <boxGeometry args={[0.13, 0.03, 0.012]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
        <mesh position={[0.17, 0.42, 0.395]}>
          <boxGeometry args={[0.13, 0.03, 0.012]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={2.2} toneMapped={false} />
        </mesh>

        {/* shoulder pads */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.56, 0.62, 0]}>
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.13, 0.11, 0.12, 16]} />
              <meshStandardMaterial color={METAL_DARK} metalness={0.8} roughness={0.3} />
            </mesh>
            <mesh position={[side * 0.08, 0, 0]}>
              <sphereGeometry args={[0.045, 12, 12]} />
              <meshStandardMaterial
                color={side > 0 ? AMBER : CYAN}
                emissive={side > 0 ? AMBER : CYAN}
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* neck */}
        <mesh position={[0, 0.92, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.14, 16]} />
          <meshStandardMaterial color={METAL_DARK} metalness={0.85} roughness={0.25} />
        </mesh>
      </group>

      {/* ---------------------------- HEAD ---------------------------- */}
      <group ref={head} position={[0, 1.16, 0]}>
        <RoundedBox args={[0.96, 0.72, 0.66]} radius={0.17} smoothness={4}>
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.32} />
        </RoundedBox>

        {/* visor frame */}
        <RoundedBox args={[0.82, 0.42, 0.08]} radius={0.09} smoothness={3} position={[0, 0.03, 0.33]}>
          <meshStandardMaterial ref={visorMat} color={CYAN} emissive={CYAN} emissiveIntensity={1.5} toneMapped={false} />
        </RoundedBox>

        {/* dark glass behind the glow */}
        <RoundedBox args={[0.72, 0.32, 0.04]} radius={0.07} smoothness={3} position={[0, 0.03, 0.375]}>
          <meshStandardMaterial color="#031019" metalness={0.9} roughness={0.15} />
        </RoundedBox>

        {/* expressive eyes */}
        <mesh ref={eyeL} position={[-0.19, 0.02, 0.4]}>
          <boxGeometry args={[0.13, 0.09, 0.03]} />
          <meshStandardMaterial color="#d6fbff" emissive="#9ff4ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>
        <mesh ref={eyeR} position={[0.19, 0.02, 0.4]}>
          <boxGeometry args={[0.13, 0.09, 0.03]} />
          <meshStandardMaterial color="#d6fbff" emissive="#9ff4ff" emissiveIntensity={3} toneMapped={false} />
        </mesh>

        {/* ear modules */}
        {[-1, 1].map((side) => (
          <group key={side} position={[side * 0.5, 0.02, 0]} rotation={[0, 0, Math.PI / 2]}>
            <mesh>
              <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
              <meshStandardMaterial color={METAL_DARK} metalness={0.85} roughness={0.3} />
            </mesh>
            <mesh position={[0, side * 0.06, 0]}>
              <torusGeometry args={[0.055, 0.012, 8, 24]} />
              <meshStandardMaterial
                color={side > 0 ? AMBER : CYAN}
                emissive={side > 0 ? AMBER : CYAN}
                emissiveIntensity={1.6}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* antennae */}
        <group position={[-0.24, 0.36, 0]}>
          <mesh position={[0, 0.19, 0]}>
            <cylinderGeometry args={[0.018, 0.026, 0.38, 8]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.4, 0]}>
            <sphereGeometry args={[0.055, 14, 14]} />
            <meshStandardMaterial
              ref={antennaTip}
              color={AMBER}
              emissive={AMBER}
              emissiveIntensity={2}
              toneMapped={false}
            />
          </mesh>
        </group>
        <group position={[0.26, 0.34, -0.02]}>
          <mesh position={[0, 0.14, 0]}>
            <cylinderGeometry args={[0.014, 0.02, 0.28, 8]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.9} roughness={0.3} />
          </mesh>
          <mesh position={[0, 0.3, 0]}>
            <sphereGeometry args={[0.04, 12, 12]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={2.2} toneMapped={false} />
          </mesh>
        </group>
      </group>

      {/* ------------------------ THRUSTER RINGS ---------------------- */}
      <group position={[0, -0.16, 0]}>
        <group ref={ringA}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.36, 0]}>
            <torusGeometry args={[0.6, 0.022, 10, 64]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.7} toneMapped={false} />
          </mesh>
        </group>
        <group ref={ringB}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.44, 0]}>
            <torusGeometry args={[0.74, 0.014, 8, 64]} />
            <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.3} toneMapped={false} />
          </mesh>
        </group>
        <group ref={ringC}>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.52, 0]}>
            <torusGeometry args={[0.48, 0.01, 8, 48]} />
            <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.1} toneMapped={false} />
          </mesh>
        </group>

        {/* thruster glow */}
        <pointLight position={[0, -0.6, 0]} color={CYAN} intensity={9} distance={3.4} decay={2} />
        <mesh position={[0, -0.62, 0]}>
          <sphereGeometry args={[0.16, 16, 16]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.14} toneMapped={false} />
        </mesh>
      </group>

      {/* --------------------------- HANDS --------------------------- */}
      <group ref={handL} position={[-1.02, 0.42, 0.12]}>
        <RoundedBox args={[0.26, 0.3, 0.2]} radius={0.08} smoothness={3}>
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.34} />
        </RoundedBox>
        {[-0.075, 0, 0.075].map((x, i) => (
          <mesh key={x} position={[x, 0.21 - Math.abs(i - 1) * 0.02, 0]} rotation={[0, 0, (i - 1) * 0.14]}>
            <boxGeometry args={[0.055, 0.17, 0.14]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.014, 8, 20]} />
          <meshStandardMaterial color={CYAN} emissive={CYAN} emissiveIntensity={1.5} toneMapped={false} />
        </mesh>
      </group>

      <group ref={handR} position={[1.02, 0.42, 0.12]}>
        <RoundedBox args={[0.26, 0.3, 0.2]} radius={0.08} smoothness={3}>
          <meshStandardMaterial color={METAL} metalness={0.7} roughness={0.34} />
        </RoundedBox>
        {[-0.075, 0, 0.075].map((x, i) => (
          <mesh key={x} position={[x, 0.21 - Math.abs(i - 1) * 0.02, 0]} rotation={[0, 0, (i - 1) * 0.14]}>
            <boxGeometry args={[0.055, 0.17, 0.14]} />
            <meshStandardMaterial color={METAL_DARK} metalness={0.75} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[0, -0.15, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.014, 8, 20]} />
          <meshStandardMaterial color={AMBER} emissive={AMBER} emissiveIntensity={1.4} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function LoadingPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-[11px] tracking-[0.24em] text-slate-500 uppercase">
        <span className="h-10 w-10 animate-spin rounded-full border border-slate-700 border-t-cyan-400" />
        booting mascot
      </div>
    </div>
  );
}

/**
 * InteractiveMascot3D
 * - 60fps-friendly: refs + delta only, no state inside useFrame
 * - dpr capped at 2
 * - pauses the whole render loop via frameloop="never" when off-screen
 * - static ContactShadows (frames={1}) instead of a real-time shadow map
 */
export default function InteractiveMascot3D({ className = "" }) {
  const { lang } = useLang();
  const wrapRef = useRef(null);
  const scrollRef = useRef(0);
  const bubbleTimer = useRef(null);

  const [inView, setInView] = useState(true);
  const [bubble, setBubble] = useState(null);
  const reduced = usePrefersReducedMotion();

  // Pause rendering entirely when the mascot leaves the viewport.
  // IntersectionObserver is the primary signal; a rAF-throttled rect check on
  // scroll backs it up for environments where IO callbacks are throttled.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return undefined;

    let lastRun = 0;
    const recheck = () => {
      const rect = node.getBoundingClientRect();
      const visible = rect.bottom > -160 && rect.top < window.innerHeight + 160;
      setInView((prev) => (prev === visible ? prev : visible));
    };
    // timestamp throttle: rAF stops running in background tabs
    const onScroll = () => {
      const now = Date.now();
      if (now - lastRun < 120) return;
      lastRun = now;
      recheck();
    };

    recheck();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let observer;
    if (typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
        rootMargin: "140px 0px",
        threshold: 0.01,
      });
      observer.observe(node);
    }

    return () => {
      observer?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Page scroll feeds the tilt without triggering React renders.
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => () => clearTimeout(bubbleTimer.current), []);

  const speakIdx = useRef(0);

  const speak = useCallback(() => {
    const lines = SPEECH[lang] ?? SPEECH.id;
    const line = lines[speakIdx.current % lines.length];
    speakIdx.current += 1;
    setBubble(line);
    clearTimeout(bubbleTimer.current);
    bubbleTimer.current = setTimeout(() => setBubble(null), 5200);
  }, [lang]);

  return (
    <div ref={wrapRef} className={`relative h-full w-full ${className}`}>
      {/* speech bubble */}
      <div
        aria-live="polite"
        className={`pointer-events-none absolute left-1/2 top-2 z-20 w-[min(19rem,86vw)] -translate-x-1/2 transition-all duration-300 ${
          bubble ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
        }`}
      >
        {bubble && (
          <div className="mascot-bubble relative rounded-xl border border-cyan-400/30 bg-slate-950/90 px-4 py-3 text-center text-[13px] leading-snug text-slate-200 shadow-[0_0_40px_-12px_rgba(0,210,255,0.6)] backdrop-blur">
            {bubble}
            <span className="mascot-bubble-tail" aria-hidden="true" />
          </div>
        )}
      </div>

      <Canvas
        frameloop={inView ? "always" : "never"}
        dpr={[1, 2]}
        shadows={false}
        camera={{ position: [0, 0.55, 4.5], fov: 38 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        aria-hidden="true"
        style={{ touchAction: "pan-y" }}
      >
        <ambientLight intensity={0.55} />
        <directionalLight position={[3.5, 5, 4]} intensity={1.55} color="#dff6ff" />
        <pointLight position={[-3, 1.5, 2.5]} intensity={16} distance={9} color={CYAN} />
        <pointLight position={[3, -1, 2]} intensity={10} distance={8} color={AMBER} />

        <Suspense fallback={null}>
          <Robot scrollRef={scrollRef} reduced={reduced} onSpeak={speak} />
        </Suspense>

        <ContactShadows
          frames={1}
          position={[0, -0.98, 0]}
          opacity={0.42}
          scale={5.4}
          blur={2.6}
          far={2.4}
          resolution={256}
          color="#0891b2"
        />

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping
          dampingFactor={0.08}
          rotateSpeed={0.55}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.75}
          target={[0, 0.25, 0]}
        />
      </Canvas>

      {/* keyboard-accessible alternative to tapping the canvas */}
      <button
        type="button"
        onClick={speak}
        className="absolute bottom-0 right-0 z-20 rounded-full border border-slate-700/80 bg-slate-950/70 px-3 py-1 text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase backdrop-blur transition hover:border-cyan-400/50 hover:text-cyan-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {lang === "en" ? "Say hi" : "Sapa"} 👋
      </button>
      <p className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pr-24 text-left font-mono text-[9px] tracking-[0.2em] text-slate-600 uppercase">
        {t("hero.hint")}
      </p>
    </div>
  );
}

export { LoadingPlaceholder };
