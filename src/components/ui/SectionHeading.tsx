"use client";

import { motion } from "motion/react";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
}

export default function SectionHeading({ title, subtitle }: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      style={{ marginBottom: "48px" }}
    >
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: "40px" }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        style={{
          height: "3px",
          background: "var(--accent)",
          borderRadius: "2px",
          marginBottom: "16px",
        }}
      />
      <h2
        style={{
          fontSize: "clamp(28px, 5vw, 48px)",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p style={{ color: "var(--text-secondary)", marginTop: "12px", fontSize: "18px" }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
