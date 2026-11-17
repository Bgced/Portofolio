"use client";

import { motion } from "framer-motion";

export default function SectionHeading({
  index = "01",
  kicker = "section",
  title,
  accent,
  intro,
  align = "left",
  className = "",
}) {
  const isCenter = align === "center";

  return (
    <div className={`mb-8 sm:mb-10 ${isCenter ? "mx-auto text-center" : ""} ${className}`}>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.4 }}
        className={`eyebrow ${isCenter ? "justify-center" : ""}`}
      >
        {index} / {kicker}
      </motion.p>

      <motion.h2
        initial={{ opacity: 0, y: 14 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-70px" }}
        transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className="mt-3 max-w-3xl text-[clamp(1.85rem,4.6vw,3.15rem)] font-semibold leading-[1.03] tracking-[-0.03em] text-balance"
      >
        {title}
        {accent ? <span className="text-gradient"> {accent}</span> : null}
      </motion.h2>

      {intro ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.5, delay: 0.12 }}
          className={`mt-4 max-w-xl text-[0.92rem] leading-relaxed text-muted ${isCenter ? "mx-auto" : ""}`}
        >
          {intro}
        </motion.p>
      ) : null}
    </div>
  );
}
