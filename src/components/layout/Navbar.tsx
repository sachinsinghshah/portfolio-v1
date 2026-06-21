"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { ArrowRightIcon } from "@/components/ui/icons";

export default function Navbar() {
  const [solid, setSolid] = useState(false);
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = siteConfig.navLinks.map((l) => l.href.slice(1));
    const secs = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const onScroll = () => {
      setSolid(window.scrollY > 40);
      let cur = secs[0]?.id ?? "home";
      secs.forEach((s) => {
        if (window.scrollY >= s.offsetTop - 160) cur = s.id;
      });
      setActive(cur);
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={solid ? "nav solid" : "nav"} id="nav">
      <div className="nav-in">
        <a href="#home" className="logo" data-mag onClick={() => setOpen(false)}>
          <span className="logo-mark">SS</span>
          <span>
            Sachin<span style={{ color: "var(--blue-soft)" }}>.</span>dev
          </span>
        </a>
        <div className={open ? "nav-links open" : "nav-links"} id="navLinks">
          {siteConfig.navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={active === l.href.slice(1) ? "active" : undefined}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary" data-mag data-hot onClick={() => setOpen(false)}>
            Let&apos;s Talk <ArrowRightIcon />
          </a>
          <button
            className="burger"
            id="burger"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </nav>
  );
}
