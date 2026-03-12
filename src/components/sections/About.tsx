"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { Download } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import SectionHeading from "@/components/ui/SectionHeading";

const techs = [
  "React.js", "Next.js", "TypeScript", "Python", "Node.js",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "Playwright",
  "GraphQL", "Tailwind CSS", "Prisma ORM", "GitHub Actions",
  "Turborepo", "Socket.IO", "Astro", "Digital Ocean",
];

export default function About() {
  const tickerItems = [...techs, ...techs];

  return (
    <section
      id="about"
      style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <SectionHeading title="About Me" />

      {/* Split layout */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "48px",
          marginBottom: "64px",
        }}
        className="about-grid"
      >
        {/* Left: text */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "17px", lineHeight: 1.8, marginBottom: "16px" }}>
            I&apos;m a software engineer currently building production systems at <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>8om Internet</span>. I work across the full stack — from Python scraping pipelines and REST APIs on the backend to React and Next.js interfaces on the frontend — and I care about every layer in between. I hold a B.Tech in Computer Science and have been writing production code professionally since 2023.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "17px", lineHeight: 1.8, marginBottom: "16px" }}>
            My approach is straightforward: understand the problem deeply before writing a single line, build systems that are fast and maintainable, and sweat the details that users actually feel — page load times, intuitive flows, error states that help instead of confuse. I&apos;ve shipped everything from AI-powered web scraping platforms and legal SaaS tools to real estate listing sites and real-time chat applications.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: "17px", lineHeight: 1.8, marginBottom: "32px" }}>
            I&apos;m open to relocation and genuinely excited by hard problems. When I&apos;m not at the keyboard I&apos;m usually reading about system design, exploring new tools, or thinking about the next thing I want to build.
          </p>

          <motion.a
            href={siteConfig.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "var(--accent)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: 600,
              fontSize: "15px",
            }}
          >
            <Download size={16} />
            Download Resume
          </motion.a>
        </motion.div>

        {/* Right: avatar placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="about-avatar-wrap"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="float-animation"
            style={{
              width: "260px",
              height: "320px",
              borderRadius: "20px",
              overflow: "hidden",
              flexShrink: 0,
              border: "2px solid var(--border)",
              position: "relative",
            }}
          >
            <Image
              src="/avatar.jpeg"
              alt={siteConfig.name}
              fill
              style={{ objectFit: "cover", objectPosition: "center top" }}
              sizes="260px"
              priority
            />
          </div>
        </motion.div>
      </div>

      {/* Tech ticker */}
      <div
        style={{
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 10%, black 90%, transparent 100%)",
        }}
      >
        <div className="ticker-track">
          {tickerItems.map((tech, i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                padding: "6px 16px",
                margin: "0 6px",
                borderRadius: "999px",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                fontSize: "13px",
                fontFamily: "var(--font-mono)",
                whiteSpace: "nowrap",
                background: "var(--bg-secondary)",
              }}
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 3fr 2fr !important;
          }
        }
      `}</style>
    </section>
  );
}
