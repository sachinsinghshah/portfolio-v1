"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { projects } from "@/data/projects";
import { Project } from "@/types";
import SectionHeading from "@/components/ui/SectionHeading";
import ProjectModal from "@/components/ui/ProjectModal";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <section
      id="projects"
      style={{
        padding: "100px 24px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeading title="Selected Projects" />

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "20px",
          }}
          className="projects-grid"
        >
          {projects.map((project, i) => {
            const isWide = i === 0 || i === 3;
            return (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 2) * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setSelectedProject(project)}
                data-cursor="pointer"
                style={{
                  gridColumn: isWide ? "span 2" : "span 1",
                  borderRadius: "16px",
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  minHeight: isWide ? "320px" : "260px",
                  background: "var(--bg-tertiary)",
                }}
                className="project-card"
              >
                {/* Screenshot background */}
                <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
                  <Image
                    src={`/screenshots/${project.slug}.png`}
                    alt={`${project.title} preview`}
                    fill
                    style={{ objectFit: "cover", objectPosition: "top center", transition: "transform 0.5s ease" }}
                    className={`project-screenshot-${project.id}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>

                {/* Dark gradient overlay — heavier at bottom for text, light color tint at top */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.15) 100%)",
                    zIndex: 1,
                  }}
                />

                {/* Year badge */}
                <div
                  style={{
                    position: "absolute",
                    top: "16px",
                    right: "16px",
                    zIndex: 2,
                    background: "rgba(0,0,0,0.3)",
                    backdropFilter: "blur(4px)",
                    color: "rgba(255,255,255,0.8)",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {project.year}
                </div>

                {/* Content */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "24px",
                    zIndex: 2,
                  }}
                >
                  <h3
                    style={{
                      fontSize: isWide ? "28px" : "22px",
                      fontWeight: 700,
                      color: "white",
                      marginBottom: "6px",
                    }}
                  >
                    {project.title}
                  </h3>
                  <p
                    style={{
                      color: "rgba(255,255,255,0.8)",
                      fontSize: "14px",
                      marginBottom: "12px",
                    }}
                  >
                    {project.tagline}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "12px" }}>
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(4px)",
                          color: "rgba(255,255,255,0.9)",
                          padding: "3px 10px",
                          borderRadius: "999px",
                          fontSize: "11px",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      fontSize: "14px",
                      fontWeight: 600,
                    }}
                  >
                    View Details →
                  </motion.p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />

      <style>{`
        @media (max-width: 768px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
          .project-card {
            grid-column: span 1 !important;
          }
        }
        .project-card:hover .project-screenshot-1,
        .project-card:hover .project-screenshot-2,
        .project-card:hover .project-screenshot-3,
        .project-card:hover .project-screenshot-4 {
          transform: scale(1.06) translateY(-8px);
        }
      `}</style>
    </section>
  );
}
