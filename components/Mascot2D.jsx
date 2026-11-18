"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useActiveSection } from "@/lib/hooks";
import { useArcade, useLang } from "@/components/providers";
import { GamepadIcon, CloseIcon } from "@/components/Icons";
import { sfx } from "@/lib/sfx";

const SECTION_IDS = ["home", "about", "skills", "journey", "projects", "insight", "contact"];

/** Section id -> pose key */
function poseFor(section) {
  switch (section) {
    case "skills":
      return "coding";
    case "projects":
      return "tools";
    case "journey":
      return "coffee";
    case "insight":
      return "notes";
    case "contact":
      return "wave";
    case "arcade":
      return "arcade";
    default:
      return "idle";
  }
}

function MascotArt({ pose, waving }) {
  const eyes = pose === "coding" ? "coding" : pose === "arcade" ? "arcade" : "normal";

  return (
    <svg viewBox="0 0 140 156" className="h-full w-full" role="img" aria-label="Maskot asisten robot">
      <defs>
        <linearGradient id="m2-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00d2ff" />
          <stop offset="100%" stopColor="#0891b2" />
        </linearGradient>
        <linearGradient id="m2-shell" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#233348" />
          <stop offset="100%" stopColor="#131c2b" />
        </linearGradient>
        <filter id="m2-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* antenna */}
      <motion.g
        animate={waving ? { rotate: [-4, 4, -4] } : {}}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "64px 30px" }}
      >
        <path d="M64 30V18" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="64" cy="14" r="4.5" fill="#ffb020" filter="url(#m2-glow)" />
      </motion.g>
      <path d="M86 28V20" stroke="#334155" strokeWidth="2" strokeLinecap="round" />
      <circle cx="86" cy="17" r="3" fill="#00d2ff" filter="url(#m2-glow)" />

      {/* head */}
      <rect x="34" y="30" width="62" height="48" rx="15" fill="url(#m2-shell)" stroke="#334155" strokeWidth="2" />
      <rect x="43" y="41" width="44" height="25" rx="8" fill="#061521" stroke="#0e7490" strokeWidth="1.2" />

      {/* eyes */}
      {eyes === "normal" && (
        <>
          <rect x="53" y="48" width="9" height="8" rx="3" fill="#b9f5ff" filter="url(#m2-glow)" />
          <rect x="69" y="48" width="9" height="8" rx="3" fill="#b9f5ff" filter="url(#m2-glow)" />
        </>
      )}
      {eyes === "coding" && (
        <>
          <rect x="53" y="50" width="9" height="4" rx="2" fill="#b9f5ff" />
          <rect x="69" y="50" width="9" height="4" rx="2" fill="#b9f5ff" />
          {/* coding glasses */}
          <g stroke="#ffb020" strokeWidth="2" fill="none">
            <rect x="48" y="44" width="19" height="15" rx="4" />
            <rect x="70" y="44" width="19" height="15" rx="4" />
            <path d="M67 50h3M44 49l-4-2M90 49l4-2" />
          </g>
        </>
      )}
      {eyes === "arcade" && (
        <>
          <path d="M53 52l4-5 4 5" stroke="#00d2ff" strokeWidth="2.4" fill="none" strokeLinecap="round" />
          <path d="M69 52l4-5 4 5" stroke="#ffb020" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        </>
      )}

      {/* mouth */}
      <path
        d={pose === "wave" ? "M59 60q6 5 12 0" : "M59 60h12"}
        stroke="#7dd3fc"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />

      {/* body */}
      <rect x="46" y="82" width="38" height="34" rx="11" fill="url(#m2-shell)" stroke="#334155" strokeWidth="2" />
      <rect x="56" y="89" width="18" height="11" rx="3" fill="#062028" stroke="#00d2ff" strokeWidth="1" />
      <circle cx="65" cy="94.5" r="2.4" fill="#00d2ff" filter="url(#m2-glow)" />

      {/* thruster ring */}
      <ellipse cx="65" cy="122" rx="21" ry="5.5" fill="none" stroke="#00d2ff" strokeWidth="1.6" opacity="0.8" />
      <ellipse cx="65" cy="126" rx="13" ry="3" fill="#00d2ff" opacity="0.14" />

      {/* left arm */}
      <motion.g
        animate={waving ? { rotate: [0, -8, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "46px 88px" }}
      >
        <rect x="30" y="86" width="13" height="26" rx="6" fill="#1b2536" stroke="#334155" strokeWidth="1.8" />
        <circle cx="36.5" cy="114" r="6" fill="#1b2536" stroke="#334155" strokeWidth="1.8" />
      </motion.g>

      {/* right arm + prop */}
      <motion.g
        animate={waving ? { rotate: [0, 26, 2, 26, 0] } : {}}
        transition={waving ? { duration: 1.8, repeat: Infinity, ease: "easeInOut" } : {}}
        style={{ transformOrigin: "92px 88px" }}
      >
        <rect x="100" y="86" width="13" height="26" rx="6" fill="#1b2536" stroke="#334155" strokeWidth="1.8" />
        <circle cx="106.5" cy="114" r="6" fill="#1b2536" stroke="#334155" strokeWidth="1.8" />

        {pose === "tools" && (
          <g>
            <rect x="96" y="70" width="24" height="16" rx="3" fill="#ffb020" opacity="0.16" stroke="#ffb020" strokeWidth="1.4" />
            <path d="M100 78h5l2-3 3 5 2-2h4" stroke="#ffb020" strokeWidth="1.4" fill="none" />
            <path d="M112 86l7 16" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" />
            <circle cx="119" cy="102" r="2" fill="#ef4444" />
          </g>
        )}

        {pose === "coffee" && (
          <g>
            <rect x="99" y="104" width="18" height="15" rx="3" fill="#1b2536" stroke="#ffb020" strokeWidth="1.6" />
            <path d="M117 108h3a3 3 0 0 1 0 6h-3" stroke="#ffb020" strokeWidth="1.6" fill="none" />
            <motion.path
              d="M104 99q3-4 0-8M110 99q3-4 0-8"
              stroke="#94a3b8"
              strokeWidth="1.4"
              fill="none"
              animate={{ opacity: [0.15, 0.7, 0.15], y: [0, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
          </g>
        )}

        {pose === "notes" && (
          <g>
            <rect x="98" y="66" width="22" height="26" rx="3" fill="#0b1220" stroke="#334155" strokeWidth="1.6" />
            <path d="M102 73h14M102 78h14M102 83h9" stroke="#00d2ff" strokeWidth="1.6" strokeLinecap="round" />
          </g>
        )}
      </motion.g>

      {/* wave hand */}
      {waving && (
        <motion.g
          animate={{ rotate: [0, 18, -10, 18, 0] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "106px 112px" }}
        >
          <circle cx="106" cy="114" r="7" fill="#233348" stroke="#334155" strokeWidth="1.8" />
          <path d="M103 109v-5M106 108v-6M109 109v-5" stroke="#7dd3fc" strokeWidth="1.8" strokeLinecap="round" />
        </motion.g>
      )}
    </svg>
  );
}

export default function Mascot2D() {
  const { t, lang } = useLang();
  const { open, openArcade } = useArcade();
  const section = useActiveSection(SECTION_IDS);
  const reduced = useReducedMotion();
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const pose = useMemo(() => poseFor(open ? "arcade" : section), [section, open]);
  const line = t(`mascot.${pose === "arcade" ? "arcade" : section === "home" ? "idle" : section}`);

  const handleOpen = () => {
    openArcade();
  };

  if (collapsed) {
    return (
      <div className="fixed right-4 bottom-4 z-40 sm:right-6 sm:bottom-6">
        <button
          type="button"
          onClick={() => {
            setCollapsed(false);
            sfx.play("click");
          }}
          aria-label={lang === "en" ? "Show mascot" : "Tampilkan maskot"}
          className="grid h-12 w-12 place-items-center rounded-full border border-accent/40 bg-surface/95 text-accent shadow-[0_0_30px_-8px_rgba(0,210,255,0.7)] backdrop-blur transition hover:scale-105"
        >
          <span className="text-lg">🤖</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed right-3 bottom-3 z-40 flex w-[168px] flex-col items-end sm:right-6 sm:bottom-6 sm:w-[200px]">
      {!open && (
        <motion.div
          key={`${pose}-${line}`}
          initial={{ opacity: 0, y: 8, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-2 max-w-[200px] rounded-xl rounded-br-sm border border-line bg-surface/92 px-3 py-2 text-[11px] leading-snug text-ink shadow-xl backdrop-blur sm:text-xs"
        >
          {line}
          <span className="absolute -right-1 bottom-2 h-2.5 w-2.5 rotate-45 border-r border-b border-line bg-surface" />
        </motion.div>
      )}

      <motion.div
        drag={false}
        animate={reduced ? {} : { y: [0, -7, 0] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <button
          type="button"
          onClick={handleOpen}
          aria-label={t("arcade.open")}
          className="group relative block h-[118px] w-[110px] rounded-2xl border border-line/60 bg-gradient-to-b from-slate-900/40 to-surface/70 p-1.5 backdrop-blur-sm transition hover:border-accent/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:h-[138px] sm:w-[128px]"
        >
          <MascotArt pose={pose} waving={pose === "wave" || hovered} />

          <span className="absolute -left-1 -top-1 flex items-center gap-1 rounded-full border border-ok/40 bg-surface/95 px-1.5 py-0.5 text-[8px] font-medium tracking-wider text-emerald-300 uppercase">
            <span className="h-1 w-1 animate-pulse rounded-full bg-ok" />
            online
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            setCollapsed(true);
            sfx.play("click");
          }}
          aria-label={lang === "en" ? "Hide mascot" : "Sembunyikan maskot"}
          className="absolute -right-1 top-0 grid h-5 w-5 place-items-center rounded-full border border-line bg-surface text-muted transition hover:text-ink"
        >
          <CloseIcon width={11} height={11} />
        </button>

        <motion.button
          type="button"
          onClick={handleOpen}
          whileTap={{ scale: 0.96 }}
          className="mt-1.5 flex w-full items-center justify-center gap-1.5 rounded-lg border border-line bg-accent/10 px-2 py-1.5 text-[10px] font-semibold tracking-[0.12em] text-accent uppercase transition hover:border-cyan-300/60 hover:bg-accent/15"
        >
          <GamepadIcon width={13} height={13} />
          {t("arcade.navLabel")}
        </motion.button>
      </motion.div>
    </div>
  );
}
