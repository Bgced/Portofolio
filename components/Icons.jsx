"use client";

import { sfx } from "@/lib/sfx";

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

export function SunIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
    </svg>
  );
}

export function MoonIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function MenuIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}

export function CloseIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function CopyIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="9" y="9" width="12" height="12" rx="2" />
      <path d="M5 15V5a2 2 0 0 1 2-2h10" />
    </svg>
  );
}

export function CheckIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function MailIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m22 7-10 6L2 7" />
    </svg>
  );
}

export function WhatsAppIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8.1 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}

export function LinkedInIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A6 6 0 0 1 16 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function InstagramIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowUpIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M19 12H5M11 18l-6-6 6-6" />
    </svg>
  );
}

export function VolumeOnIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
    </svg>
  );
}

export function VolumeOffIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M11 5 6 9H2v6h4l5 4z" />
      <path d="m16 9 5 6M21 9l-5 6" />
    </svg>
  );
}

export function GamepadIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M7.5 8h9a4.5 4.5 0 0 1 4.4 5.4l-.7 3.4a2.4 2.4 0 0 1-4.2 1L14.5 16h-5L8 17.8a2.4 2.4 0 0 1-4.2-1l-.7-3.4A4.5 4.5 0 0 1 7.5 8z" />
      <path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13.5h.01" />
    </svg>
  );
}

export function BoltIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M13 2 4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
    </svg>
  );
}

export function GroundIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3v10" />
      <path d="M5 13h14M7.5 17h9M10 21h4" />
    </svg>
  );
}

export function BugIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="7" y="8" width="10" height="12" rx="5" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2M3 12h3M18 12h3M4 18l2.5-2M20 18l-2.5-2M4 7l2.5 2M20 7l-2.5 2" />
    </svg>
  );
}

export function TrophyIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M8 4h8v5a4 4 0 0 1-8 0z" />
      <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5M12 13v4M8 21h8M10 17h4" />
    </svg>
  );
}

export function ClockIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  );
}

export function SparkIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
      <path d="M18.5 15.5 19 17l1.5.5-1.5.5-.5 1.5-.5-1.5L16 17.5l1.5-.5z" />
    </svg>
  );
}

export function GridIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function RotateIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </svg>
  );
}

/* ---------- Electronics component glyphs (memory game) ---------- */
export function ResistorIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12h4l1.5-3 2.5 6 2.5-6 2.5 6 1.5-3h4" />
    </svg>
  );
}

export function CapacitorIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12h7M15 12h7" />
      <path d="M9 6v12M15 6v12" />
    </svg>
  );
}

export function DiodeIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 12h6M16 12h6" />
      <path d="M8 7v10l8-5z" />
      <path d="M16 7v10" />
    </svg>
  );
}

export function LedIcon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 17h6M10 21h4M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3z" />
      <path d="M18 4l2-1M19 8h2M15 2v2" />
    </svg>
  );
}

export function ChipIcon(props) {
  return (
    <svg {...base} {...props}>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M10 2v4M14 2v4M10 18v4M14 18v4M2 10h4M2 14h4M18 10h4M18 14h4" />
      <rect x="10" y="10" width="4" height="4" rx="1" />
    </svg>
  );
}

export function TransistorIcon(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 5v14M8 9l6-3M8 15l6 3M14 4v6M14 14v6" />
    </svg>
  );
}

export const COMPONENT_GLYPHS = {
  resistor: ResistorIcon,
  capacitor: CapacitorIcon,
  diode: DiodeIcon,
  led: LedIcon,
  chip: ChipIcon,
  transistor: TransistorIcon,
};

export function playHover() {
  sfx.play("hover");
}
