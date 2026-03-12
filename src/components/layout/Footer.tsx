"use client";

import { motion } from "motion/react";
import { Github, Linkedin, Twitter, Mail, ArrowUp } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import { scrollToSection } from "@/lib/utils";

export default function Footer() {
  const socials = [
    { icon: Github, href: siteConfig.social.github, label: "GitHub" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
  ];

  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border)",
        padding: "32px 24px",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <p style={{ color: "var(--text-muted)", fontSize: "14px", fontFamily: "var(--font-mono)" }}>
          Designed &amp; Built by {siteConfig.name} · 2025
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              whileHover={{ scale: 1.15 }}
              style={{
                color: "var(--text-muted)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.color = "var(--accent)";
                el.style.borderColor = "var(--accent)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.color = "var(--text-muted)";
                el.style.borderColor = "var(--border)";
              }}
            >
              <Icon size={16} />
            </motion.a>
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => scrollToSection("hero")}
            aria-label="Back to top"
            style={{
              background: "var(--accent-muted)",
              border: "1px solid var(--accent)",
              color: "var(--accent)",
              borderRadius: "8px",
              padding: "6px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "12px",
              fontFamily: "var(--font-mono)",
            }}
          >
            <ArrowUp size={12} /> Top
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
