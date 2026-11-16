"use client";

import { motion } from "framer-motion";

export default function SectionHeading({ index = "01", kicker, title, intro, className = "" }) {
  return (
    <div className={`mb-8 flex flex-col gap-3 sm:mb-10 ${className}`}>
      <motion.p
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 font-mono text-[10px] tracking-[0.28em] text-cyan-400/80 uppercase"
      >
        <span className="h-px w-6 bg-cyan-400/60" />
        {index} / {kicker}
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="text-3xl font-semibold tracking-tight text-slate-100 sm:text-4xl"
      >
        {title}
      </motion.h2>
      {intro && <p className="max-w-xl text-sm leading-relaxed text-slate-400">{intro}</p>}
    </div>
  );
}
