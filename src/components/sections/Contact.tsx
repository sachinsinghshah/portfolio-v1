"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Github, Linkedin, Twitter, Mail, Loader2 } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import SectionHeading from "@/components/ui/SectionHeading";

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormData>({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copyText, setCopyText] = useState("Copy Email");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form submitted:", form);
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: "", email: "", subject: "", message: "" });
    setTimeout(() => setSuccess(false), 6000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const copyEmail = async () => {
    await navigator.clipboard.writeText(siteConfig.email);
    setCopyText("Copied! ✓");
    setTimeout(() => setCopyText("Copy Email"), 2000);
  };

  const socials = [
    { icon: Github, href: siteConfig.social.github, label: "GitHub" },
    { icon: Linkedin, href: siteConfig.social.linkedin, label: "LinkedIn" },
    { icon: Twitter, href: siteConfig.social.twitter, label: "Twitter" },
    { icon: Mail, href: `mailto:${siteConfig.email}`, label: "Email" },
  ];

  const inputStyle = (hasError?: string) => ({
    width: "100%",
    background: "var(--bg-tertiary)",
    border: `1px solid ${hasError ? "#f5576c" : "var(--border)"}`,
    borderRadius: "8px",
    padding: "12px 16px",
    color: "var(--text-primary)",
    fontSize: "15px",
    fontFamily: "var(--font-sans)",
    outline: "none",
    transition: "border-color 0.2s",
  });

  return (
    <section
      id="contact"
      style={{
        padding: "100px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <SectionHeading
        title="Get In Touch"
        subtitle="Have a project in mind? Let's build something great together."
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "64px",
          maxWidth: "680px",
        }}
      >
        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name */}
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Your name"
                style={inputStyle(errors.name)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.name ? "#f5576c" : "var(--border)")}
              />
              {errors.name && <p style={{ color: "#f5576c", fontSize: "12px", marginTop: "4px" }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="your@email.com"
                style={inputStyle(errors.email)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.email ? "#f5576c" : "var(--border)")}
              />
              {errors.email && <p style={{ color: "#f5576c", fontSize: "12px", marginTop: "4px" }}>{errors.email}</p>}
            </div>

            {/* Subject */}
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                Subject *
              </label>
              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="What's this about?"
                style={inputStyle(errors.subject)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.subject ? "#f5576c" : "var(--border)")}
              />
              {errors.subject && <p style={{ color: "#f5576c", fontSize: "12px", marginTop: "4px" }}>{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <label style={{ display: "block", color: "var(--text-secondary)", fontSize: "13px", marginBottom: "6px", fontFamily: "var(--font-mono)" }}>
                Message *
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Tell me about your project..."
                rows={5}
                style={{ ...inputStyle(errors.message), resize: "vertical" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = errors.message ? "#f5576c" : "var(--border)")}
              />
              {errors.message && <p style={{ color: "#f5576c", fontSize: "12px", marginTop: "4px" }}>{errors.message}</p>}
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={submitting}
              whileHover={{ scale: submitting ? 1 : 1.03 }}
              whileTap={{ scale: submitting ? 1 : 0.97 }}
              style={{
                background: "var(--accent)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "14px 28px",
                fontSize: "15px",
                fontWeight: 600,
                cursor: submitting ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                opacity: submitting ? 0.8 : 1,
              }}
            >
              {submitting ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <Loader2 size={16} />
                  </motion.div>
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </motion.button>

            {/* Success message */}
            <AnimatePresence>
              {success && (
                <motion.p
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    color: "#43e97b",
                    fontSize: "14px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  ✓ Message sent! I&apos;ll get back to you soon.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </form>

        {/* Social links */}
        <div>
          <p style={{ color: "var(--text-muted)", fontSize: "13px", fontFamily: "var(--font-mono)", marginBottom: "16px" }}>
            OR FIND ME ON
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontFamily: "var(--font-mono)",
                  background: "var(--bg-secondary)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--accent-muted)";
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "var(--bg-secondary)";
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-secondary)";
                }}
              >
                <Icon size={15} /> {label}
              </motion.a>
            ))}

            {/* Easter egg: Copy Email */}
            <motion.button
              onClick={copyEmail}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                color: copyText === "Copied! ✓" ? "var(--accent)" : "var(--text-muted)",
                background: copyText === "Copied! ✓" ? "var(--accent-muted)" : "transparent",
                cursor: "pointer",
                fontSize: "12px",
                fontFamily: "var(--font-mono)",
                transition: "all 0.2s",
              }}
            >
              📋 {copyText}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
