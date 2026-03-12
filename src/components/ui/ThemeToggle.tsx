"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "999px",
        padding: "6px 12px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        color: "var(--text-secondary)",
        transition: "border-color 0.2s, color 0.2s",
      }}
    >
      <motion.div
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? <Moon size={14} /> : <Sun size={14} />}
      </motion.div>
    </button>
  );
}
