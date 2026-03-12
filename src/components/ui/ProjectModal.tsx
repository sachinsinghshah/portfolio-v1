"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ExternalLink, Github } from "lucide-react";
import Image from "next/image";
import { Project } from "@/types";
import TechBadge from "@/components/ui/TechBadge";

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.75)",
            backdropFilter: "blur(4px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={project.title}
            style={{
              background: "var(--bg-secondary)",
              borderRadius: "16px 16px 0 0",
              width: "100%",
              maxWidth: "760px",
              maxHeight: "90vh",
              overflowY: "auto",
              position: "relative",
            }}
          >
            {/* Header — screenshot with gradient overlay */}
            <div
              style={{
                height: "200px",
                borderRadius: "16px 16px 0 0",
                position: "relative",
                overflow: "hidden",
                display: "flex",
                alignItems: "flex-end",
                padding: "24px",
              }}
            >
              {/* Screenshot */}
              <Image
                src={`/screenshots/${project.slug}.png`}
                alt={`${project.title} preview`}
                fill
                style={{ objectFit: "cover", objectPosition: "top center" }}
                sizes="760px"
              />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.1) 100%)",
              }} />
              {/* Text */}
              <div style={{ position: "relative", zIndex: 1 }}>
                <h2 style={{ fontSize: "28px", fontWeight: 700, color: "white", marginBottom: "4px" }}>
                  {project.title}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.85)", fontSize: "15px" }}>{project.tagline}</p>
              </div>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              style={{
                position: "absolute",
                top: "16px",
                right: "16px",
                zIndex: 10,
                background: "rgba(0,0,0,0.5)",
                border: "none",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "white",
              }}
            >
              <X size={18} />
            </button>

            {/* Body */}
            <div style={{ padding: "32px" }}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "32px" }}>
                {project.description}
              </p>

              {/* Three columns */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: "24px",
                  marginBottom: "32px",
                }}
              >
                {[
                  { heading: "The Problem", text: project.problem, color: "#f5576c" },
                  { heading: "The Solution", text: project.solution, color: "var(--accent)" },
                  { heading: "The Result", text: project.result, color: "#43e97b" },
                ].map(({ heading, text, color }) => (
                  <div
                    key={heading}
                    style={{
                      background: "var(--bg-tertiary)",
                      borderRadius: "12px",
                      padding: "20px",
                    }}
                  >
                    <h3 style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {heading}
                    </h3>
                    <p style={{ color: "var(--text-secondary)", fontSize: "14px", lineHeight: 1.7 }}>
                      {text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Tech stack */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Tech Stack
                </h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {project.techStack.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </div>

              {/* Features */}
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "13px", fontFamily: "var(--font-mono)", color: "var(--text-muted)", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Key Features
                </h3>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                  {project.features.map((f) => (
                    <li key={f} style={{ color: "var(--text-secondary)", fontSize: "14px", display: "flex", alignItems: "flex-start", gap: "10px" }}>
                      <span style={{ color: "var(--accent)", marginTop: "2px", flexShrink: 0 }}>▸</span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action buttons */}
              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--accent)",
                    color: "white",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  <ExternalLink size={14} /> Live Demo
                </a>
                {project.githubUrl ? (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontWeight: 600,
                    fontSize: "14px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <Github size={14} /> Source Code
                </a>
                ) : (
                  <span style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "var(--bg-tertiary)",
                    color: "var(--text-muted)",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontFamily: "var(--font-mono)",
                    border: "1px solid var(--border)",
                  }}>
                    🔒 Private / Company Project
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
