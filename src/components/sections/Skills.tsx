"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionHeading from "@/components/ui/SectionHeading";

const skillsData = {
  Frontend: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "HTML5 / CSS3", "Responsive Design", "Accessibility (WCAG)"],
  Backend: ["Node.js", "Python", "Express.js", "GraphQL", "REST APIs", "Socket.IO"],
  Database: ["PostgreSQL", "MongoDB", "Prisma ORM"],
  "Cloud & DevOps": ["AWS (EC2, S3, CloudFront)", "Docker", "Digital Ocean", "GitHub Actions", "CI/CD Pipelines", "Vercel"],
  "Tools & Testing": ["Turborepo", "Playwright", "Webpack", "Jest", "Postman", "Astro", "Git"],
};

type TabKey = keyof typeof skillsData;

const tabs: TabKey[] = Object.keys(skillsData) as TabKey[];

export default function Skills() {
  const [activeTab, setActiveTab] = useState<TabKey>("Frontend");

  return (
    <section
      id="skills"
      style={{ padding: "100px 24px", maxWidth: "1200px", margin: "0 auto" }}
    >
      <SectionHeading title="Skills & Tools" />

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          marginBottom: "40px",
        }}
      >
        {tabs.map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: "8px 20px",
              borderRadius: "999px",
              border: activeTab === tab ? "1px solid var(--accent)" : "1px solid var(--border)",
              background: activeTab === tab ? "var(--accent-muted)" : "transparent",
              color: activeTab === tab ? "var(--accent)" : "var(--text-secondary)",
              cursor: "pointer",
              fontSize: "14px",
              fontFamily: "var(--font-mono)",
              transition: "all 0.2s",
            }}
          >
            {tab}
          </motion.button>
        ))}
      </div>

      {/* Skills grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
          }}
        >
          {skillsData[activeTab].map((skill, i) => (
            <motion.div
              key={skill}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05 }}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "12px",
                padding: "20px 16px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                cursor: "default",
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: "var(--accent)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: "var(--text-primary)",
                  fontSize: "14px",
                  fontWeight: 500,
                }}
              >
                {skill}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
