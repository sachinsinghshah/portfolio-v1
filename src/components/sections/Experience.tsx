"use client";

import { motion } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";

const experiences = [
  {
    company: "8om Internet",
    role: "Software Engineer",
    period: "May 2023 – Present",
    description: "Building scalable backend systems, APIs, and user-centric web applications.",
    bullets: [
      "Designed, developed, and maintained scalable backend services and APIs supporting multiple production applications",
      "Developed React/Next.js applications with SSR and SSG, improving page load performance by 40%",
      "Created a reusable UI component library, reducing development effort by 25%",
      "Collaborated closely with UI/UX designers and product managers to convert wireframes into responsive interfaces",
      "Automated deployments using CI/CD pipelines and containerized applications with Docker",
      "Conducted code reviews, enforced best practices, and mentored junior developers",
    ],
  },
  {
    company: "100Xdevs",
    role: "Full Stack Web Development",
    period: "2023",
    description: "Intensive full-stack development certification program.",
    bullets: [
      "Completed an intensive full-stack web development program covering modern JavaScript, React, Node.js, and databases",
      "Built and shipped multiple production-grade projects as part of the curriculum",
      "Gained hands-on experience with system design, authentication patterns, and deployment workflows",
    ],
  },
  {
    company: "MITRC, Alwar",
    role: "B.Tech in Computer Science",
    period: "2015 – 2019",
    description: "Bachelor of Technology in Computer Science and Engineering.",
    bullets: [
      "Studied core CS fundamentals: data structures, algorithms, operating systems, and computer networks",
      "Completed coursework in database management, software engineering, and web technologies",
      "Developed foundational problem-solving skills that underpin all engineering work",
    ],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        padding: "100px 24px",
        background: "var(--bg-secondary)",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        <SectionHeading title="Experience" />

        <div style={{ position: "relative" }}>
          {/* Timeline line */}
          <div
            style={{
              position: "absolute",
              left: "24px",
              top: 0,
              bottom: 0,
              width: "2px",
              background: "var(--border)",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.company + exp.role}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                style={{
                  display: "flex",
                  gap: "32px",
                  paddingLeft: "60px",
                  position: "relative",
                  paddingBottom: i < experiences.length - 1 ? "48px" : 0,
                }}
              >
                {/* Timeline dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "16px",
                    top: "8px",
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                    background: "var(--accent)",
                    border: "3px solid var(--bg-secondary)",
                    flexShrink: 0,
                    zIndex: 1,
                  }}
                />

                {/* Card */}
                <div
                  style={{
                    background: "var(--bg-primary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    padding: "24px",
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    <div>
                      <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "2px" }}>
                        {exp.role}
                      </h3>
                      <p style={{ color: "var(--accent)", fontSize: "15px", fontWeight: 600 }}>
                        {exp.company}
                      </p>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "13px",
                        color: "var(--text-muted)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {exp.period}
                    </span>
                  </div>

                  <ul style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", listStyle: "none" }}>
                    {exp.bullets.map((bullet) => (
                      <li key={bullet} style={{ color: "var(--text-secondary)", fontSize: "14px", display: "flex", gap: "10px", lineHeight: 1.6 }}>
                        <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>▸</span>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
