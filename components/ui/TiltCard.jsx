"use client";

import { memo, useRef } from "react";

/**
 * Card dengan efek tilt 3D. Nilai rotasi ditulis langsung ke CSS custom
 * properties lewat ref — jadi pointermove nggak memicu re-render React.
 */
function TiltCard({ children, className = "", max = 9, glare = true, ...rest }) {
  const ref = useRef(null);

  const handleMove = (event) => {
    const node = ref.current;
    if (!node) return;
    if (event.pointerType === "touch") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const rect = node.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;

    node.style.setProperty("--ry", `${((px - 0.5) * max * 2).toFixed(2)}deg`);
    node.style.setProperty("--rx", `${((0.5 - py) * max * 2).toFixed(2)}deg`);
    node.style.setProperty("--mx", `${(px * 100).toFixed(1)}%`);
    node.style.setProperty("--my", `${(py * 100).toFixed(1)}%`);
    node.dataset.tilting = "true";
  };

  const reset = () => {
    const node = ref.current;
    if (!node) return;
    node.style.setProperty("--rx", "0deg");
    node.style.setProperty("--ry", "0deg");
    node.dataset.tilting = "false";
  };

  return (
    <div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className={`tilt-card ${className}`}
      {...rest}
    >
      {children}
      {glare && <span className="tilt-glare" aria-hidden="true" />}
    </div>
  );
}

export default memo(TiltCard);
