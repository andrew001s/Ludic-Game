"use client";

import { motion } from "framer-motion";

export function GameLogo() {
  return (
    <motion.div
      className="flex flex-col items-start gap-2 select-none"
      initial={{ opacity: 0, x: -40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <h1
        className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-[0.15em] uppercase leading-none"
        style={{
          color: "#b8e6b0",
          textShadow:
            "2px 2px 0 #1a3a1a, 4px 4px 0 #0d1f0d, 0 0 20px rgba(74, 222, 128, 0.3)",
          fontFamily: '"Courier New", monospace',
          imageRendering: "pixelated",
        }}
      >
        NEXUS Ω
      </h1>
      <motion.p
        className="text-xs sm:text-sm tracking-[0.3em] uppercase text-green-600/70 ml-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          fontFamily: '"Courier New", monospace',
          imageRendering: "pixelated",
        }}
      >
        Guardianes de la Conservación{" "}
      </motion.p>
    </motion.div>
  );
}
