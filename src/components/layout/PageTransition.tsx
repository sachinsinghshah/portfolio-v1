"use client";

import { useState } from "react";
import { motion } from "motion/react";

export default function PageTransition() {
  const [done, setDone] = useState(false);

  if (done) return null;

  return (
    <motion.div
      initial={{ y: 0 }}
      animate={{ y: "-100%" }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.1 }}
      onAnimationComplete={() => setDone(true)}
      style={{
        position: "fixed",
        inset: 0,
        background: "var(--accent)",
        zIndex: 99999,
        pointerEvents: "none",
      }}
    />
  );
}
