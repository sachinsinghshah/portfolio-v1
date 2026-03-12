"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { scrollToSection } from "@/lib/utils";

export default function Hero() {
  const nameLetters = siteConfig.name.split("");

  return (
    <section
      id="hero"
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        padding: "80px 24px 40px",
        textAlign: "center",
      }}
    >
      {/* Dot grid background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "radial-gradient(circle, var(--text-muted) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          opacity: 0.3,
          animation: "dots-shift 20s linear infinite",
          zIndex: 0,
        }}
      />
      {/* Radial fade overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, var(--bg-primary) 80%)",
          zIndex: 1,
        }}
      />

      <div style={{ position: "relative", zIndex: 2, maxWidth: "900px", width: "100%" }}>
        {/* Animated name */}
        <div
          style={{
            fontSize: "clamp(56px, 12vw, 144px)",
            fontWeight: 800,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: "var(--text-primary)",
            marginBottom: "24px",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {nameLetters.map((letter, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {letter === " " ? "\u00a0" : letter}
            </motion.span>
          ))}
        </div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "clamp(14px, 2.5vw, 20px)",
            color: "var(--accent)",
            marginBottom: "20px",
            letterSpacing: "0.05em",
          }}
        >
          {siteConfig.title}
        </motion.p>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          style={{
            fontSize: "clamp(16px, 2.5vw, 22px)",
            color: "var(--text-secondary)",
            maxWidth: "600px",
            margin: "0 auto 40px",
            lineHeight: 1.5,
          }}
        >
          {siteConfig.tagline}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection("projects")}
            style={{
              background: "var(--accent)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            View My Work
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => scrollToSection("contact")}
            style={{
              background: "transparent",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              padding: "12px 28px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            Get In Touch
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        onClick={() => scrollToSection("about")}
        style={{
          position: "absolute",
          bottom: "32px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          zIndex: 2,
        }}
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </motion.button>
    </section>
  );
}
