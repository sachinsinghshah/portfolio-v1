"use client";

import SectionHeading from "@/components/ui/SectionHeading";

const testimonials = [
  {
    quote: "Sachin delivered our project ahead of schedule and exceeded every expectation. His attention to detail is remarkable.",
    name: "Priya Sharma",
    role: "CTO",
    company: "TechNova Solutions",
    avatarInitials: "PS",
  },
  {
    quote: "Working with Sachin transformed our development workflow. He doesn't just write code — he solves business problems.",
    name: "Alex Chen",
    role: "Product Manager",
    company: "CloudPeak Labs",
    avatarInitials: "AC",
  },
  {
    quote: "The most reliable developer I've worked with. Sachin's code is clean, well-documented, and built to last.",
    name: "Maria Rodriguez",
    role: "Lead Engineer",
    company: "PixelWave Studio",
    avatarInitials: "MR",
  },
  {
    quote: "Sachin took our vague idea and turned it into a polished product. His communication throughout was exceptional.",
    name: "James Walker",
    role: "Founder",
    company: "LaunchPad Startups",
    avatarInitials: "JW",
  },
  {
    quote: "I've worked with many developers but Sachin stands out for his ability to understand business context and translate it into great technical solutions.",
    name: "Sarah Kim",
    role: "VP Engineering",
    company: "DataStream Inc",
    avatarInitials: "SK",
  },
];

export default function Testimonials() {
  const doubled = [...testimonials, ...testimonials];

  return (
    <section
      id="testimonials"
      style={{ padding: "100px 0", maxWidth: "100%", overflow: "hidden" }}
    >
      <div style={{ padding: "0 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <SectionHeading title="What People Say" />
      </div>

      <div
        style={{
          overflow: "hidden",
          maskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
        }}
      >
        <div className="marquee-track">
          {doubled.map((t, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: "340px",
                margin: "0 12px",
                background: "var(--bg-secondary)",
                border: "1px solid var(--border)",
                borderRadius: "16px",
                padding: "24px",
              }}
            >
              <p
                style={{
                  color: "var(--text-secondary)",
                  fontSize: "14px",
                  lineHeight: 1.8,
                  fontStyle: "italic",
                  marginBottom: "20px",
                }}
              >
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "var(--accent-muted)",
                    border: "1px solid var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--accent)",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "var(--font-mono)",
                    flexShrink: 0,
                  }}
                >
                  {t.avatarInitials}
                </div>
                <div>
                  <p style={{ color: "var(--text-primary)", fontSize: "14px", fontWeight: 600 }}>{t.name}</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "12px", fontFamily: "var(--font-mono)" }}>
                    {t.role}, {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
