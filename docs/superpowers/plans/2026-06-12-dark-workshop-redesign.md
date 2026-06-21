# Dark Workshop Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the portfolio as "The Dark Workshop" — near-black editorial design with blueprint-grid texture, serif/mono typography, and real 3D (one shared WebGL canvas with per-section views: hero wireframe structure, skill constellation, GitHub contribution terrain, contact globe).

**Architecture:** Next.js 16 App Router, single fixed `<Canvas>` (React Three Fiber) behind the page using drei `<View>` scissor rendering; each 3D accent lazy-loaded via `next/dynamic` so three.js stays out of the initial bundle. All inline `style={{}}` objects replaced with Tailwind v4 classes + `@theme` tokens. Lenis smooth scroll. GitHub data via an API route with a real-data static fallback.

**Tech Stack:** Next.js 16, React 19, Tailwind 4, motion, three, @react-three/fiber v9, @react-three/drei v10, lenis, @playwright/test.

**Spec:** `docs/superpowers/specs/2026-06-12-portfolio-redesign-design.md`

**Verification note:** This is visual 3D work; strict test-first TDD does not map cleanly. Discipline used instead: every task ends with `npm run build` passing + a dev-server check, and Task 11 adds automated Playwright e2e tests covering behavior (sections render, overlay opens/closes, GitHub fallback, zero page errors). Between Tasks 2–9 the page is in a visual transition (old + new sections coexist) but always builds and renders.

---

## Design tokens (reference for all tasks)

| Token | Value | Tailwind utility |
|---|---|---|
| ink (bg) | `#0b0c0e` | `bg-ink` |
| ink-2 (raised bg) | `#121417` | `bg-ink-2` |
| ink-3 | `#1a1d21` | `bg-ink-3` |
| paper (text) | `#e8e6df` | `text-paper` |
| paper-dim | `#8a8f98` | `text-paper-dim` |
| paper-faint | `#5b6068` | `text-paper-faint` |
| mint (accent) | `#52f2a8` | `text-mint` / `bg-mint` |
| line (borders) | `#ffffff14` | `border-line` |
| serif | Instrument Serif | `font-serif` |
| mono | JetBrains Mono | `font-mono` |
| sans | Inter | `font-sans` |

Section ids (in order): `hero`, `about`, `projects`, `skills`, `experience`, `github`, `contact`.

---

### Task 1: Foundation — dependencies, fonts, design tokens

**Files:**
- Modify: `package.json` (via npm install)
- Modify: `src/app/globals.css` (full rewrite)
- Modify: `src/app/layout.tsx`
- Modify: `src/data/siteConfig.ts:14-20` (navLinks)
- Modify: `src/types/index.ts` (remove Testimonial, add GitHubStats, add `outcome` to Project)
- Modify: `src/data/projects.ts` (add `outcome` field to each project)

- [ ] **Step 1: Install dependencies**

```bash
npm install three @react-three/fiber @react-three/drei lenis
npm install -D @types/three @playwright/test
npx playwright install chromium
```

Expected: installs succeed. R3F v9.x / drei v10.x (React 19 compatible) and three ≥0.17x.

- [ ] **Step 2: Rewrite `src/app/globals.css`** (full replacement)

```css
@import "tailwindcss";

@theme {
  --color-ink: #0b0c0e;
  --color-ink-2: #121417;
  --color-ink-3: #1a1d21;
  --color-paper: #e8e6df;
  --color-paper-dim: #8a8f98;
  --color-paper-faint: #5b6068;
  --color-mint: #52f2a8;
  --color-line: #ffffff14;
  --font-serif: var(--font-instrument-serif), Georgia, "Times New Roman", serif;
  --font-sans: var(--font-inter), system-ui, -apple-system, sans-serif;
  --font-mono: var(--font-jetbrains-mono), "SF Mono", monospace;
}

/* Legacy aliases for not-yet-rewritten components — REMOVED IN TASK 10 */
:root {
  --bg-primary: #0b0c0e;
  --bg-secondary: #121417;
  --bg-tertiary: #1a1d21;
  --text-primary: #e8e6df;
  --text-secondary: #8a8f98;
  --text-muted: #5b6068;
  --accent: #52f2a8;
  --accent-hover: #7df5be;
  --accent-muted: rgba(82, 242, 168, 0.15);
  --border: #ffffff14;
  --glass: rgba(11, 12, 14, 0.8);
  --font-sans: var(--font-inter), system-ui, sans-serif;
  --font-mono: var(--font-jetbrains-mono), monospace;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
}

body {
  background-color: var(--color-ink);
  color: var(--color-paper);
  font-family: var(--font-sans);
  line-height: 1.6;
  overflow-x: hidden;
}

body.cursor-none,
body.cursor-none a,
body.cursor-none button {
  cursor: none;
}

/* Film grain */
body::after {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
  background-repeat: repeat;
}

/* Blueprint grid */
.blueprint-grid {
  background-image: linear-gradient(var(--color-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--color-line) 1px, transparent 1px);
  background-size: 48px 48px;
}

::selection {
  background-color: var(--color-mint);
  color: var(--color-ink);
}

:focus-visible {
  outline: 2px solid var(--color-mint);
  outline-offset: 3px;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: var(--color-ink);
}
::-webkit-scrollbar-thumb {
  background: var(--color-ink-3);
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--color-paper-faint);
}

.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--color-mint);
  color: var(--color-ink);
  padding: 8px 16px;
  z-index: 100;
  text-decoration: none;
  font-family: var(--font-mono);
  font-size: 12px;
}
.skip-link:focus {
  top: 0;
}

@keyframes ticker-scroll {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.ticker-track {
  display: flex;
  width: max-content;
  animation: ticker-scroll 35s linear infinite;
}
.ticker-track:hover {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .ticker-track {
    animation: none;
  }
}
```

Note: `scroll-behavior: smooth` intentionally removed (Lenis takes over in Task 2; `scrollIntoView({ behavior: "smooth" })` calls still animate).

- [ ] **Step 3: Update `src/app/layout.tsx`** (full replacement — fonts added, structure unchanged for now)

```tsx
import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import PageTransition from "@/components/layout/PageTransition";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const serif = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
});
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} — ${siteConfig.title}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.title}`,
    description: siteConfig.tagline,
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable}`}>
      <body className="bg-ink font-sans text-paper antialiased">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <PageTransition />
        <CustomCursor />
        <Navbar />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

(`PageTransition` and the old `Navbar`/`Footer`/`CustomCursor` are still imported here — they get replaced in Task 2.)

- [ ] **Step 4: Update types in `src/types/index.ts`** (full replacement)

```ts
export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
  outcome: string; // short metric line shown on the project row
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  gradient: string;
  year: number;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  bullets: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  tagline: string;
  email: string;
  resumeUrl: string;
  social: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  navLinks: NavLink[];
}

export interface GitHubStats {
  total: number;
  days: { date: string; count: number }[];
  repos: { count: number; topLanguages: string[] };
}
```

(The `Skill` and `Testimonial` interfaces are deleted — Skill is replaced by `SkillDomain` in `src/data/skills.ts` in Task 7; Testimonials are removed per spec.)

- [ ] **Step 5: Add `outcome` to each project in `src/data/projects.ts`**

Add one line to each project object (after `result`):

```ts
// webscrapinghq:
outcome: "multiple enterprise clients · zero-downtime deploys",
// lawly-ai-saas:
outcome: "legal docs in <5 min instead of days",
// shah-properties:
outcome: "₹1.56+ Cr inventory showcased · live lead capture",
// chat-app-v1:
outcome: "instant delivery · zero polling",
```

- [ ] **Step 6: Update navLinks in `src/data/siteConfig.ts`**

Replace the `navLinks` array:

```ts
navLinks: [
  { label: "About", href: "#about" },
  { label: "Work", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Log", href: "#experience" },
  { label: "Contact", href: "#contact" },
],
```

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: build succeeds. (Old components still compile because legacy CSS aliases keep `--bg-primary` etc. defined.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: foundation — 3D deps, fonts, Dark Workshop design tokens"
```

---

### Task 2: Layout shell — SmoothScroll, Navbar, Footer, CustomCursor

**Files:**
- Create: `src/lib/useMediaQuery.ts`
- Create: `src/components/layout/SmoothScroll.tsx`
- Create: `src/components/ui/SectionLabel.tsx`
- Modify: `src/components/layout/Navbar.tsx` (full rewrite)
- Modify: `src/components/layout/Footer.tsx` (full rewrite)
- Modify: `src/components/layout/CustomCursor.tsx` (full rewrite)
- Modify: `src/app/layout.tsx`
- Delete: `src/components/layout/PageTransition.tsx`, `src/components/ui/ThemeToggle.tsx`

- [ ] **Step 1: Create `src/lib/useMediaQuery.ts`**

```ts
"use client";

import { useCallback, useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

export function usePrefersReducedMotion(): boolean {
  return useMediaQuery("(prefers-reduced-motion: reduce)");
}

export function useIsCoarsePointer(): boolean {
  return useMediaQuery("(pointer: coarse)");
}
```

- [ ] **Step 2: Create `src/components/layout/SmoothScroll.tsx`**

```tsx
"use client";

import { ReactLenis } from "lenis/react";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

export default function SmoothScroll() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return null;
  return <ReactLenis root options={{ duration: 1.1 }} />;
}
```

- [ ] **Step 3: Create `src/components/ui/SectionLabel.tsx`**

```tsx
export default function SectionLabel({ index, title }: { index: string; title: string }) {
  return (
    <p className="mb-5 font-mono text-[10px] tracking-[0.25em] text-mint">
      {index} — {title}
    </p>
  );
}
```

- [ ] **Step 4: Rewrite `src/components/layout/Navbar.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "@/data/siteConfig";
import { scrollToSection } from "@/lib/utils";

function useISTTime(): string | null {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Kolkata",
        }).format(new Date())
      );
    update();
    const id = setInterval(update, 30_000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function Navbar() {
  const time = useISTTime();
  const [open, setOpen] = useState(false);

  const go = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    setOpen(false);
    scrollToSection(href.slice(1));
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-ink/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 font-mono text-[11px] tracking-widest text-paper-dim">
        <a href="#hero" onClick={(e) => go(e, "#hero")} className="text-paper" data-cursor>
          SSS<span className="text-mint">.</span>DEV
        </a>
        <ul className="hidden gap-7 md:flex">
          {siteConfig.navLinks.map((link, i) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => go(e, link.href)}
                className="transition-colors hover:text-mint"
                data-cursor
              >
                <span className="text-mint/60">0{i + 1}</span> {link.label.toUpperCase()}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden items-center gap-2 md:flex">
          <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-mint" aria-hidden />
          <span suppressHydrationWarning>IST {time ?? "--:--"}</span>
          <span className="text-paper-faint">—</span>
          <span>OPEN TO WORK</span>
        </div>
        <button
          className="text-paper md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Toggle menu"
        >
          {open ? "[ CLOSE ]" : "[ MENU ]"}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-line bg-ink px-6 py-6 md:hidden"
          >
            <ul className="flex flex-col gap-5 font-mono text-xs tracking-widest text-paper-dim">
              {siteConfig.navLinks.map((link, i) => (
                <li key={link.href}>
                  <a href={link.href} onClick={(e) => go(e, link.href)}>
                    <span className="text-mint/60">0{i + 1}</span> {link.label.toUpperCase()}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
```

- [ ] **Step 5: Rewrite `src/components/layout/Footer.tsx`**

```tsx
export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-line px-6 py-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 font-mono text-[10px] tracking-widest text-paper-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} SACHIN SINGH SHAH</span>
        <span>BUILT WITH NEXT.JS + THREE.JS — DESIGNED IN THE DARK</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/layout/CustomCursor.tsx`** (crosshair + lagging ring)

```tsx
"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsCoarsePointer, usePrefersReducedMotion } from "@/lib/useMediaQuery";

export default function CustomCursor() {
  const coarse = useIsCoarsePointer();
  const reduced = usePrefersReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 300, damping: 28 });
  const ringY = useSpring(y, { stiffness: 300, damping: 28 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (coarse) return;
    document.body.classList.add("cursor-none");
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setActive(Boolean(t?.closest("a, button, [data-cursor]")));
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerover", onOver);
    return () => {
      document.body.classList.remove("cursor-none");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, [coarse, x, y]);

  if (coarse || reduced) return null;

  return (
    <>
      {/* Crosshair */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9999]"
        style={{ x, y }}
      >
        <span className="absolute -top-[6px] left-0 h-3 w-px -translate-x-1/2 bg-mint" />
        <span className="absolute -left-[6px] top-0 h-px w-3 -translate-y-1/2 bg-mint" />
      </motion.div>
      {/* Lagging ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[9998] rounded-full border border-mint/40"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ width: active ? 44 : 26, height: active ? 44 : 26 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}
```

- [ ] **Step 7: Delete dead components and update layout**

```bash
rm src/components/layout/PageTransition.tsx src/components/ui/ThemeToggle.tsx
```

In `src/app/layout.tsx`: remove the `PageTransition` import and `<PageTransition />` element; add `import SmoothScroll from "@/components/layout/SmoothScroll";` and render `<SmoothScroll />` as the first child of `<body>` (before the skip link).

Check nothing else imports the deleted files:
Run: `grep -rn "ThemeToggle\|PageTransition" src/`
Expected: no matches. (If old Navbar referenced ThemeToggle, the rewrite in Step 4 already removed it.)

- [ ] **Step 8: Verify**

Run: `npm run build`
Expected: success.
Run: `npm run dev`, open http://localhost:3000 — new nav with IST clock, crosshair cursor on desktop, smooth scroll active, mobile menu works at narrow width.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: layout shell — lenis smooth scroll, mono navbar with IST clock, crosshair cursor"
```

---

### Task 3: Shared WebGL canvas infrastructure

**Files:**
- Create: `src/components/three/SceneCanvas.tsx`
- Create: `src/components/three/ThreeCanvasLoader.tsx`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Create `src/components/three/SceneCanvas.tsx`**

```tsx
"use client";

import { Canvas } from "@react-three/fiber";
import { View, Preload } from "@react-three/drei";

export default function SceneCanvas() {
  return (
    <Canvas
      eventSource={document.body}
      eventPrefix="client"
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }}
    >
      <View.Port />
      <Preload all />
    </Canvas>
  );
}
```

How this works: every 3D accent in later tasks renders a drei `<View className="...">` in normal page flow. The View renders a plain tracking `<div>` there, and portals its R3F children into this single canvas, which scissor-renders each view exactly over its tracking div. `eventSource={document.body}` lets pointer events (hover/drag in Task 7) reach the 3D even though the canvas itself is `pointer-events: none`. `document.body` is safe here because this file is only ever imported with `ssr: false`.

- [ ] **Step 2: Create `src/components/three/ThreeCanvasLoader.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const SceneCanvas = dynamic(() => import("./SceneCanvas"), { ssr: false });

export default function ThreeCanvasLoader() {
  const [supported, setSupported] = useState(false);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      setSupported(Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl")));
    } catch {
      setSupported(false);
    }
  }, []);
  if (!supported) return null;
  return <SceneCanvas />;
}
```

If WebGL is unavailable, no canvas mounts and every section must still look complete (the tracking divs are empty and invisible — sections are designed in later tasks so 3D is additive, never load-bearing).

- [ ] **Step 3: Mount in `src/app/layout.tsx`**

Add `import ThreeCanvasLoader from "@/components/three/ThreeCanvasLoader";` and render `<ThreeCanvasLoader />` immediately after `<CustomCursor />`. Also change `<main id="main-content">` to `<main id="main-content" className="relative z-10">` so page content layers above the fixed canvas.

- [ ] **Step 4: Verify**

Run: `npm run build` — success.
Run: `npm run dev`, open the page, check DevTools console: no errors; a fixed `<canvas>` element exists at z-index 0.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: shared lazy-loaded WebGL canvas with drei View infrastructure"
```

---

### Task 4: Hero — editorial type + wireframe structure 3D

**Files:**
- Create: `src/components/three/HeroStructure.tsx`
- Modify: `src/components/sections/Hero.tsx` (full rewrite)

- [ ] **Step 1: Create `src/components/three/HeroStructure.tsx`**

```tsx
"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, Float, Edges, PerspectiveCamera } from "@react-three/drei";
import { usePrefersReducedMotion, useIsCoarsePointer } from "@/lib/useMediaQuery";

const MINT = "#52f2a8";
const PAPER = "#e8e6df";

function Ring({
  radius,
  rotation,
  opacity,
}: {
  radius: number;
  rotation: [number, number, number];
  opacity: number;
}) {
  const geometry = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);
  return (
    <lineLoop geometry={geometry} rotation={rotation}>
      <lineBasicMaterial color={MINT} transparent opacity={opacity} />
    </lineLoop>
  );
}

function Particles({ count }: { count: number }) {
  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.1 + Math.random() * 1.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, [count]);
  return (
    <points geometry={geometry}>
      <pointsMaterial color={MINT} size={0.025} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function Structure() {
  const pointerGroup = useRef<THREE.Group>(null);
  const spinGroup = useRef<THREE.Group>(null);
  const reduced = usePrefersReducedMotion();
  const coarse = useIsCoarsePointer();

  useFrame((state, delta) => {
    if (reduced) return;
    if (spinGroup.current) spinGroup.current.rotation.y += delta * 0.18;
    if (pointerGroup.current) {
      pointerGroup.current.rotation.x = THREE.MathUtils.lerp(
        pointerGroup.current.rotation.x,
        state.pointer.y * 0.25,
        0.04
      );
      pointerGroup.current.rotation.z = THREE.MathUtils.lerp(
        pointerGroup.current.rotation.z,
        state.pointer.x * 0.15,
        0.04
      );
    }
  });

  return (
    <group ref={pointerGroup}>
      <group ref={spinGroup}>
        <mesh>
          <icosahedronGeometry args={[1.5, 1]} />
          <meshBasicMaterial visible={false} />
          <Edges>
            <lineBasicMaterial color={MINT} transparent opacity={0.55} />
          </Edges>
        </mesh>
        <mesh rotation={[0.4, 0.8, 0]}>
          <octahedronGeometry args={[0.75, 0]} />
          <meshBasicMaterial visible={false} />
          <Edges>
            <lineBasicMaterial color={PAPER} transparent opacity={0.3} />
          </Edges>
        </mesh>
        <Ring radius={2.0} rotation={[Math.PI / 2.4, 0, 0.2]} opacity={0.45} />
        <Ring radius={2.45} rotation={[Math.PI / 1.9, 0, -0.4]} opacity={0.3} />
        <Ring radius={2.8} rotation={[Math.PI / 2.1, 0.3, 0.6]} opacity={0.18} />
        <Particles count={coarse ? 120 : 320} />
      </group>
    </group>
  );
}

export default function HeroView() {
  return (
    <View className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 0, 6.5]} fov={45} />
      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4}>
        <Structure />
      </Float>
    </View>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/sections/Hero.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import dynamic from "next/dynamic";
import { scrollToSection } from "@/lib/utils";

const HeroView = dynamic(() => import("@/components/three/HeroStructure"), { ssr: false });

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section
      id="hero"
      className="blueprint-grid relative flex min-h-svh items-center overflow-hidden px-6 pt-16"
    >
      {/* 3D structure — right half on desktop, dimmed backdrop on mobile */}
      <div
        className="absolute inset-y-0 right-0 w-full opacity-40 md:w-1/2 md:opacity-100"
        aria-hidden
      >
        <HeroView />
        {/* Engineering callout labels — desktop only */}
        <span className="absolute left-[18%] top-[24%] hidden font-mono text-[9px] tracking-wider text-mint/70 md:block">
          struct.core ──┐
        </span>
        <span className="absolute bottom-[20%] right-[12%] hidden font-mono text-[9px] tracking-wider text-paper-faint md:block">
          rotation: cursor.xy
        </span>
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-6 font-mono text-[11px] tracking-[0.22em] text-mint"
        >
          FULL-STACK ENGINEER — BUILDING PRODUCTION SYSTEMS SINCE 2023
        </motion.p>
        <h1 className="font-serif text-[clamp(56px,11vw,150px)] leading-[0.95] tracking-tight text-paper">
          <motion.span {...fadeUp} transition={{ delay: 0.2, duration: 0.7 }} className="block">
            Sachin
          </motion.span>
          <motion.span {...fadeUp} transition={{ delay: 0.32, duration: 0.7 }} className="block">
            <em className="text-paper-dim">Singh</em> Shah
          </motion.span>
        </h1>
        <motion.p
          {...fadeUp}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mt-7 max-w-md text-base leading-relaxed text-paper-dim"
        >
          I design and ship systems people rely on — scraping pipelines, AI SaaS, real-time
          apps. Every layer, end to end.
        </motion.p>
        <motion.div
          {...fadeUp}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="mt-9 flex flex-wrap gap-4 font-mono text-[11px] tracking-widest"
        >
          <button
            onClick={() => scrollToSection("projects")}
            className="bg-mint px-6 py-3 font-bold text-ink transition-transform hover:-translate-y-0.5"
            data-cursor
          >
            VIEW WORK →
          </button>
          <button
            onClick={() => scrollToSection("contact")}
            className="border border-paper/25 px-6 py-3 text-paper transition-colors hover:border-mint hover:text-mint"
            data-cursor
          >
            CONTACT
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-6 left-6 font-mono text-[10px] tracking-widest text-paper-faint">
        SCROLL ↓
      </div>
      <div className="absolute bottom-6 right-6 font-mono text-[10px] tracking-widest text-paper-faint">
        001 / 006
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` — success.
Dev check: hero shows serif name over blueprint grid; glowing wireframe structure on the right rotates slowly and tilts toward the cursor; buttons scroll to sections; no console errors. Resize to mobile width: structure dims behind text.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: hero — editorial serif type with interactive wireframe 3D structure"
```

---

### Task 5: About section

**Files:**
- Modify: `src/components/sections/About.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `src/components/sections/About.tsx`**

```tsx
"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { siteConfig } from "@/data/siteConfig";
import SectionLabel from "@/components/ui/SectionLabel";

const techs = [
  "React.js", "Next.js", "TypeScript", "Python", "Node.js",
  "PostgreSQL", "MongoDB", "Docker", "AWS", "Playwright",
  "GraphQL", "Tailwind CSS", "Prisma ORM", "GitHub Actions",
  "Turborepo", "Socket.IO", "Astro", "Digital Ocean",
];

const paragraphs = [
  <>
    I&apos;m a software engineer currently building production systems at{" "}
    <span className="text-paper">8om Internet</span>. I work across the full stack — from
    Python scraping pipelines and REST APIs on the backend to React and Next.js interfaces on
    the frontend — and I care about every layer in between. I hold a B.Tech in Computer
    Science and have been writing production code professionally since 2023.
  </>,
  <>
    My approach is straightforward: understand the problem deeply before writing a single
    line, build systems that are fast and maintainable, and sweat the details that users
    actually feel — page load times, intuitive flows, error states that help instead of
    confuse. I&apos;ve shipped everything from AI-powered web scraping platforms and legal
    SaaS tools to real estate listing sites and real-time chat applications.
  </>,
  <>
    I&apos;m open to relocation and genuinely excited by hard problems. When I&apos;m not at
    the keyboard I&apos;m usually reading about system design, exploring new tools, or
    thinking about the next thing I want to build.
  </>,
];

export default function About() {
  const tickerItems = [...techs, ...techs];

  return (
    <section id="about" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel index="01" title="ABOUT / PROFILE" />
        <div className="grid gap-14 md:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="mb-8 font-serif text-3xl leading-snug text-paper md:text-4xl">
              Understand the problem deeply.
              <br />
              <em className="text-paper-dim">Then write the code.</em>
            </h2>
            {paragraphs.map((p, i) => (
              <p key={i} className="mb-4 text-[15px] leading-loose text-paper-dim">
                {p}
              </p>
            ))}
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block border-b border-mint/50 pb-0.5 font-mono text-[11px] tracking-widest text-mint transition-colors hover:border-mint"
              data-cursor
            >
              [ ↓ RESUME.PDF ]
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex items-start justify-center"
          >
            <div>
              <div className="relative h-[300px] w-[240px] border border-mint/30">
                <Image
                  src="/avatar.jpeg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover object-top"
                  sizes="240px"
                />
                {/* Blueprint corner brackets */}
                <span className="absolute -left-[7px] -top-[7px] h-3.5 w-3.5 border-l-2 border-t-2 border-mint" />
                <span className="absolute -right-[7px] -top-[7px] h-3.5 w-3.5 border-r-2 border-t-2 border-mint" />
                <span className="absolute -bottom-[7px] -left-[7px] h-3.5 w-3.5 border-b-2 border-l-2 border-mint" />
                <span className="absolute -bottom-[7px] -right-[7px] h-3.5 w-3.5 border-b-2 border-r-2 border-mint" />
              </div>
              <p className="mt-3 font-mono text-[9px] tracking-[0.2em] text-paper-faint">
                FIG. 01 — THE ENGINEER
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stack registry ticker — full bleed */}
      <div className="mt-20 overflow-hidden border-y border-line py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="ticker-track">
          {tickerItems.map((tech, i) => (
            <span
              key={i}
              className="mx-5 whitespace-nowrap font-mono text-[11px] tracking-widest text-paper-faint"
            >
              {tech.toUpperCase()} <span className="text-mint/50">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build` — success. Dev check: editorial split layout, corner-bracketed photo with `FIG. 01` caption, full-bleed mono ticker.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat: about — editorial split with blueprint-framed photo and stack ticker"
```

---

### Task 6: Projects — case-study rows + overlay

**Files:**
- Create: `src/components/ui/CaseStudyOverlay.tsx`
- Modify: `src/components/sections/Projects.tsx` (full rewrite)
- Delete: `src/components/ui/ProjectModal.tsx`, `src/components/ui/TechBadge.tsx`

- [ ] **Step 1: Create `src/components/ui/CaseStudyOverlay.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { X, ArrowUpRight, Github } from "lucide-react";
import { useLenis } from "lenis/react";
import { Project } from "@/types";

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 font-mono text-[10px] tracking-[0.25em] text-mint">{label}</p>
      <p className="text-sm leading-relaxed text-paper-dim">{children}</p>
    </div>
  );
}

export default function CaseStudyOverlay({
  project,
  index,
  onClose,
}: {
  project: Project;
  index: number;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      window.removeEventListener("keydown", onKey);
    };
  }, [lenis, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-ink/90 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
        className="mx-auto mt-[6svh] h-[88svh] w-[min(920px,92vw)] overflow-y-auto border border-line bg-ink-2 p-6 md:p-10"
      >
        <div className="mb-6 flex items-center justify-between">
          <p className="font-mono text-[10px] tracking-[0.25em] text-mint">
            CASE STUDY — {String(index + 1).padStart(2, "0")} / {project.year}
          </p>
          <button
            ref={closeRef}
            onClick={onClose}
            aria-label="Close case study"
            className="border border-line p-2 text-paper-dim transition-colors hover:border-mint hover:text-mint"
            data-cursor
          >
            <X size={14} />
          </button>
        </div>

        <div className="relative mb-8 aspect-video w-full overflow-hidden border border-line">
          <Image
            src={`/screenshots/${project.slug}.png`}
            alt={`${project.title} screenshot`}
            fill
            className="object-cover object-top"
            sizes="(max-width: 920px) 92vw, 920px"
          />
        </div>

        <h3 className="font-serif text-4xl text-paper">{project.title}</h3>
        <p className="mt-2 text-sm text-paper-dim">{project.tagline}</p>

        <div className="mt-8 grid gap-8 md:grid-cols-3">
          <Block label="PROBLEM">{project.problem}</Block>
          <Block label="SOLUTION">{project.solution}</Block>
          <Block label="RESULT">{project.result}</Block>
        </div>

        <div className="mt-8">
          <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-mint">KEY FEATURES</p>
          <ul className="grid gap-2 md:grid-cols-2">
            {project.features.map((f) => (
              <li key={f} className="text-sm leading-relaxed text-paper-dim">
                <span className="text-mint">▸</span> {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 border-t border-line pt-6">
          <p className="mb-3 font-mono text-[10px] tracking-[0.25em] text-mint">STACK</p>
          <p className="font-mono text-[11px] tracking-wider text-paper-dim">
            {project.techStack.join(" · ").toUpperCase()}
          </p>
        </div>

        <div className="mt-8 flex flex-wrap gap-4 font-mono text-[11px] tracking-widest">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-mint px-5 py-3 font-bold text-ink"
              data-cursor
            >
              VISIT LIVE <ArrowUpRight size={13} />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-paper/25 px-5 py-3 text-paper transition-colors hover:border-mint hover:text-mint"
              data-cursor
            >
              <Github size={13} /> SOURCE
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/sections/Projects.tsx`**

```tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { projects } from "@/data/projects";
import { Project } from "@/types";
import SectionLabel from "@/components/ui/SectionLabel";
import CaseStudyOverlay from "@/components/ui/CaseStudyOverlay";
import { useIsCoarsePointer } from "@/lib/useMediaQuery";

function ProjectRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const coarse = useIsCoarsePointer();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(mx, [0, 1], [8, -8]), { stiffness: 180, damping: 20 });
  const rotateX = useSpring(useTransform(my, [0, 1], [-6, 6]), { stiffness: 180, damping: 20 });

  return (
    <button
      onClick={onOpen}
      data-cursor
      onMouseMove={(e) => {
        if (coarse) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width);
        my.set((e.clientY - r.top) / r.height);
      }}
      className="group grid w-full grid-cols-[48px_1fr] items-center gap-6 border-t border-line py-7 text-left transition-colors hover:bg-ink-2/60 md:grid-cols-[64px_1fr_240px] md:gap-10"
    >
      <span className="font-serif text-3xl text-paper-faint/70 transition-colors group-hover:text-mint">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span>
        <span className="block font-serif text-2xl text-paper md:text-3xl">{project.title}</span>
        <span className="mt-1 block text-xs leading-relaxed text-paper-dim">
          {project.outcome}
        </span>
        <span className="mt-2 block font-mono text-[9px] tracking-[0.15em] text-mint/80">
          {project.techStack.slice(0, 5).join(" · ").toUpperCase()}
        </span>
      </span>
      <motion.span
        style={coarse ? undefined : { rotateX, rotateY, transformPerspective: 700 }}
        className="relative hidden h-32 overflow-hidden border border-line opacity-50 saturate-0 transition-[opacity,filter,border-color] duration-500 group-hover:border-mint/40 group-hover:opacity-100 group-hover:saturate-100 md:block"
      >
        <Image
          src={`/screenshots/${project.slug}.png`}
          alt=""
          fill
          className="object-cover object-top"
          sizes="240px"
        />
      </motion.span>
    </button>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <section id="projects" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel index="02" title="SELECTED WORK" />
        <h2 className="mb-12 font-serif text-3xl text-paper md:text-4xl">
          Four systems, <em className="text-paper-dim">in production.</em>
        </h2>
        <div className="border-b border-line">
          {projects.map((project, i) => (
            <ProjectRow key={project.id} project={project} index={i} onOpen={() => setSelected(i)} />
          ))}
        </div>
        <p className="mt-4 font-mono text-[9px] tracking-widest text-paper-faint">
          // CLICK A ROW FOR THE FULL CASE STUDY
        </p>
      </div>
      <AnimatePresence>
        {selected !== null && (
          <CaseStudyOverlay
            project={projects[selected]}
            index={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
```

- [ ] **Step 3: Delete replaced components**

```bash
rm src/components/ui/ProjectModal.tsx src/components/ui/TechBadge.tsx
```

Run: `grep -rn "ProjectModal\|TechBadge" src/`
Expected: no matches.

- [ ] **Step 4: Verify**

Run: `npm run build` — success. Dev check: rows with big indices; screenshots desaturated until hover, tilt with cursor; click opens overlay; Escape and backdrop-click close it; page scroll locked while open.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: projects — case-study rows with 3D-tilt screenshots and overlay"
```

---

### Task 7: Skills — 3D constellation

**Files:**
- Create: `src/data/skills.ts`
- Create: `src/components/three/SkillConstellation.tsx`
- Modify: `src/components/sections/Skills.tsx` (full rewrite)

- [ ] **Step 1: Create `src/data/skills.ts`**

```ts
export interface SkillDomain {
  name: string;
  skills: string[];
}

export const skillDomains: SkillDomain[] = [
  { name: "frontend", skills: ["react", "next.js", "typescript", "tailwind", "motion"] },
  { name: "backend", skills: ["node.js", "python", "express", "graphql", "socket.io"] },
  { name: "data", skills: ["postgresql", "mongodb", "prisma"] },
  { name: "infra", skills: ["docker", "aws", "ci/cd", "vercel", "playwright"] },
];
```

- [ ] **Step 2: Create `src/components/three/SkillConstellation.tsx`**

```tsx
"use client";

import { useMemo, useState } from "react";
import * as THREE from "three";
import { View, Text, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { skillDomains } from "@/data/skills";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const MINT = "#52f2a8";
const PAPER = "#e8e6df";

interface Node {
  name: string;
  domain: string;
  isHub: boolean;
  pos: THREE.Vector3;
}

function buildGraph() {
  const nodes: Node[] = [];
  const edges: [THREE.Vector3, THREE.Vector3, string][] = []; // [a, b, domain]
  const hubRadius = 1.7;
  const hubs: THREE.Vector3[] = [];

  skillDomains.forEach((domain, d) => {
    const angle = (d / skillDomains.length) * Math.PI * 2;
    const hub = new THREE.Vector3(
      Math.cos(angle) * hubRadius,
      Math.sin(angle * 2) * 0.35,
      Math.sin(angle) * hubRadius
    );
    hubs.push(hub);
    nodes.push({ name: domain.name, domain: domain.name, isHub: true, pos: hub });

    domain.skills.forEach((skill, s) => {
      // Deterministic positions (no Math.random — stable across renders)
      const a = angle + ((s - (domain.skills.length - 1) / 2) * Math.PI) / 5.5;
      const lift = ((s % 3) - 1) * 0.55;
      const p = new THREE.Vector3(
        Math.cos(a) * (hubRadius + 0.9),
        hub.y + lift,
        Math.sin(a) * (hubRadius + 0.9)
      );
      nodes.push({ name: skill, domain: domain.name, isHub: false, pos: p });
      edges.push([hub, p, domain.name]);
    });
  });

  // Hub-to-hub ring
  for (let i = 0; i < hubs.length; i++) {
    edges.push([hubs[i], hubs[(i + 1) % hubs.length], "ring"]);
  }
  return { nodes, edges };
}

function Edge({
  a,
  b,
  highlighted,
}: {
  a: THREE.Vector3;
  b: THREE.Vector3;
  highlighted: boolean;
}) {
  const geometry = useMemo(
    () => new THREE.BufferGeometry().setFromPoints([a, b]),
    [a, b]
  );
  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={MINT} transparent opacity={highlighted ? 0.65 : 0.14} />
    </lineSegments>
  );
}

function Constellation() {
  const { nodes, edges } = useMemo(buildGraph, []);
  const [hoveredDomain, setHoveredDomain] = useState<string | null>(null);
  const reduced = usePrefersReducedMotion();

  return (
    <>
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.5}
        autoRotate={!reduced}
        autoRotateSpeed={0.5}
      />
      {edges.map(([a, b, domain], i) => (
        <Edge key={i} a={a} b={b} highlighted={hoveredDomain === domain} />
      ))}
      {nodes.map((node) => {
        const active = hoveredDomain === node.domain;
        return (
          <group key={`${node.domain}-${node.name}`} position={node.pos}>
            <mesh
              onPointerOver={(e) => {
                e.stopPropagation();
                setHoveredDomain(node.domain);
              }}
              onPointerOut={() => setHoveredDomain(null)}
            >
              <sphereGeometry args={[node.isHub ? 0.09 : 0.05, 16, 16]} />
              <meshBasicMaterial color={active ? "#ffffff" : MINT} />
            </mesh>
            <Text
              position={[0, node.isHub ? 0.22 : 0.16, 0]}
              fontSize={node.isHub ? 0.16 : 0.11}
              color={node.isHub ? PAPER : active ? PAPER : "#8a8f98"}
              anchorX="center"
              anchorY="bottom"
            >
              {node.name}
            </Text>
          </group>
        );
      })}
    </>
  );
}

export default function ConstellationView() {
  return (
    <View className="h-full w-full" style={{ pointerEvents: "auto", touchAction: "pan-y" }}>
      <PerspectiveCamera makeDefault position={[0, 1.2, 5.2]} fov={50} />
      <Constellation />
    </View>
  );
}
```

- [ ] **Step 3: Rewrite `src/components/sections/Skills.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { skillDomains } from "@/data/skills";
import SectionLabel from "@/components/ui/SectionLabel";

const ConstellationView = dynamic(() => import("@/components/three/SkillConstellation"), {
  ssr: false,
});

export default function Skills() {
  return (
    <section id="skills" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel index="03" title="CAPABILITIES" />
        <h2 className="mb-12 font-serif text-3xl text-paper md:text-4xl">The constellation.</h2>
        <div className="grid gap-12 md:grid-cols-[3fr_2fr]">
          <div className="order-2 h-[340px] md:order-1 md:h-[440px]" aria-hidden>
            <ConstellationView />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="order-1 space-y-6 self-center font-mono text-xs leading-relaxed md:order-2"
          >
            {skillDomains.map((domain) => (
              <div key={domain.name}>
                <p className="mb-1 tracking-[0.2em] text-mint">▸ {domain.name.toUpperCase()}</p>
                <p className="tracking-wider text-paper-dim">{domain.skills.join(", ")}</p>
              </div>
            ))}
            <p className="pt-2 text-[9px] tracking-widest text-paper-faint">
              // DRAG THE CONSTELLATION TO ROTATE — HOVER A NODE TO TRACE ITS DOMAIN
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
```

Note: the mono text list is the canonical/accessible representation (real DOM text); the 3D graph is decorative (`aria-hidden`).

- [ ] **Step 4: Verify**

Run: `npm run build` — success. Dev check: constellation auto-rotates; dragging rotates it; hovering a node brightens its domain's edges; text list readable on mobile (list first, graph below).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: skills — interactive 3D constellation with domain list"
```

---

### Task 8: Experience — "The Log"

**Files:**
- Create: `src/data/experience.ts`
- Modify: `src/components/sections/Experience.tsx` (full rewrite)

- [ ] **Step 1: Create `src/data/experience.ts`** (content moved verbatim from the old component)

```ts
import { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    company: "8om Internet",
    role: "Software Engineer",
    period: "2023 — now",
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
    period: "2015 — 19",
    description: "Bachelor of Technology in Computer Science and Engineering.",
    bullets: [
      "Studied core CS fundamentals: data structures, algorithms, operating systems, and computer networks",
      "Completed coursework in database management, software engineering, and web technologies",
      "Developed foundational problem-solving skills that underpin all engineering work",
    ],
  },
];
```

- [ ] **Step 2: Rewrite `src/components/sections/Experience.tsx`**

```tsx
"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { experiences } from "@/data/experience";
import SectionLabel from "@/components/ui/SectionLabel";

export default function Experience() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section id="experience" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-4xl px-6">
        <SectionLabel index="04" title="THE LOG" />
        <h2 className="mb-12 font-serif text-3xl text-paper md:text-4xl">
          Changelog of a career.
        </h2>
        <div className="border-b border-line">
          {experiences.map((exp, i) => {
            const open = openIdx === i;
            const current = i === 0;
            return (
              <div key={exp.company + exp.role} className="border-t border-line">
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  data-cursor
                  className="grid w-full grid-cols-[110px_1fr_auto] items-baseline gap-4 py-6 text-left md:grid-cols-[150px_1fr_auto]"
                >
                  <span
                    className={`font-mono text-[11px] tracking-wider ${
                      current ? "text-mint" : "text-paper-faint"
                    }`}
                  >
                    {exp.period}
                  </span>
                  <span>
                    <span className="block font-serif text-xl text-paper md:text-2xl">
                      {exp.role}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] tracking-widest text-paper-dim">
                      {exp.company.toUpperCase()}
                    </span>
                  </span>
                  <span className="font-mono text-sm text-mint" aria-hidden>
                    {open ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <ul className="space-y-2 pb-7 pl-[110px] pr-4 md:pl-[150px]">
                        {exp.bullets.map((b, j) => (
                          <motion.li
                            key={b}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.08 + j * 0.05, duration: 0.3 }}
                            className="text-sm leading-relaxed text-paper-dim"
                          >
                            <span className="text-mint">▸</span> {b}
                          </motion.li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` — success. Dev check: first entry expanded by default; clicking toggles with smooth height animation and staggered bullets; current role's date is mint.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: experience — changelog-style expandable log"
```

---

### Task 9: GitHub "Proof of Work" — snapshot, API route, 3D terrain

**Files:**
- Create: `scripts/snapshot-github.mjs`
- Create: `src/data/githubFallback.ts` (generated)
- Create: `src/app/api/github/route.ts`
- Create: `src/components/three/ContributionTerrain.tsx`
- Create: `src/components/sections/GitHubActivity.tsx`
- Modify: `package.json` (add script)

- [ ] **Step 1: Create `scripts/snapshot-github.mjs`**

```js
// Snapshots real GitHub contribution data into src/data/githubFallback.ts
// so the Proof of Work section never renders empty (and never shows fake data).
import { writeFile } from "node:fs/promises";

const USERNAME = "sachinsinghshah";

const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`);
if (!res.ok) {
  console.error(`Contribution fetch failed: ${res.status}`);
  process.exit(1);
}
const data = await res.json();
const days = data.contributions.map((c) => ({ date: c.date, count: c.count }));
const total = data.total.lastYear ?? Object.values(data.total)[0] ?? 0;

let repos = { count: 0, topLanguages: [] };
try {
  const r = await fetch(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`, {
    headers: { accept: "application/vnd.github+json" },
  });
  if (r.ok) {
    const list = await r.json();
    const langs = {};
    for (const repo of list) {
      if (repo.language) langs[repo.language] = (langs[repo.language] ?? 0) + 1;
    }
    repos = {
      count: list.length,
      topLanguages: Object.entries(langs)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([lang]) => lang),
    };
  }
} catch {
  // repo stats are optional in the snapshot
}

const out = `// Generated by scripts/snapshot-github.mjs — real data snapshot from ${new Date().toISOString().slice(0, 10)}
// Regenerate with: npm run snapshot:github
import type { GitHubStats } from "@/types";

export const githubFallback: GitHubStats = ${JSON.stringify({ total, days, repos }, null, 2)};
`;
await writeFile("src/data/githubFallback.ts", out);
console.log(`Wrote src/data/githubFallback.ts — ${total} contributions, ${days.length} days`);
```

- [ ] **Step 2: Add npm script and run the snapshot**

In `package.json` scripts, add: `"snapshot:github": "node scripts/snapshot-github.mjs"`.

Run: `npm run snapshot:github`
Expected: `Wrote src/data/githubFallback.ts — <N> contributions, ~365 days`. Inspect the generated file — it must contain real dates/counts.

If the public API is unreachable from this machine, STOP and ask the user to run it (or provide a `GITHUB_TOKEN`) — do not invent fallback numbers.

- [ ] **Step 3: Create `src/app/api/github/route.ts`**

```ts
import { NextResponse } from "next/server";
import { githubFallback } from "@/data/githubFallback";
import type { GitHubStats } from "@/types";

export const revalidate = 86400;

const USERNAME = "sachinsinghshah";

interface GraphQLDay {
  date: string;
  contributionCount: number;
}

async function fetchContributions(): Promise<Pick<GitHubStats, "total" | "days">> {
  const token = process.env.GITHUB_TOKEN;
  if (token) {
    const query = `query { user(login: "${USERNAME}") { contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount } } } } } }`;
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: { authorization: `bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ query }),
      next: { revalidate: 86400 },
    });
    if (res.ok) {
      const json = await res.json();
      const cal = json?.data?.user?.contributionsCollection?.contributionCalendar;
      if (cal) {
        return {
          total: cal.totalContributions,
          days: cal.weeks.flatMap((w: { contributionDays: GraphQLDay[] }) =>
            w.contributionDays.map((d) => ({ date: d.date, count: d.contributionCount }))
          ),
        };
      }
    }
  }
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${USERNAME}?y=last`,
    { next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error(`public contributions api: ${res.status}`);
  const json = await res.json();
  return {
    total: json.total.lastYear ?? 0,
    days: json.contributions.map((c: { date: string; count: number }) => ({
      date: c.date,
      count: c.count,
    })),
  };
}

async function fetchRepoStats(): Promise<GitHubStats["repos"]> {
  const res = await fetch(
    `https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=pushed`,
    { headers: { accept: "application/vnd.github+json" }, next: { revalidate: 86400 } }
  );
  if (!res.ok) throw new Error(`repos api: ${res.status}`);
  const list: { language: string | null }[] = await res.json();
  const langs = new Map<string, number>();
  for (const repo of list) {
    if (repo.language) langs.set(repo.language, (langs.get(repo.language) ?? 0) + 1);
  }
  return {
    count: list.length,
    topLanguages: [...langs.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([lang]) => lang),
  };
}

export async function GET() {
  try {
    const [contrib, repos] = await Promise.all([
      fetchContributions(),
      fetchRepoStats().catch(() => githubFallback.repos),
    ]);
    return NextResponse.json({ ...contrib, repos, source: "live" });
  } catch {
    return NextResponse.json({ ...githubFallback, source: "fallback" });
  }
}
```

- [ ] **Step 4: Create `src/components/three/ContributionTerrain.tsx`**

```tsx
"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import type { GitHubStats } from "@/types";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const CELL = 0.085;

function Terrain({ days }: { days: GitHubStats["days"] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const reduced = usePrefersReducedMotion();
  const max = useMemo(() => Math.max(1, ...days.map((d) => d.count)), [days]);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    const color = new THREE.Color();
    const weeks = Math.ceil(days.length / 7);
    days.forEach((day, i) => {
      const week = Math.floor(i / 7);
      const dow = i % 7;
      const h = 0.04 + (day.count / max) * 1.1;
      matrix.makeScale(1, h, 1);
      matrix.setPosition((week - weeks / 2) * CELL, h / 2 - 0.55, (dow - 3) * CELL);
      mesh.setMatrixAt(i, matrix);
      color.set("#52f2a8").multiplyScalar(0.22 + 0.78 * (day.count / max));
      mesh.setColorAt(i, color);
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [days, max]);

  useFrame((state) => {
    if (reduced || !groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.12) * 0.22;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh
        key={days.length}
        ref={meshRef}
        args={[undefined, undefined, days.length]}
      >
        <boxGeometry args={[0.07, 1, 0.07]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>
    </group>
  );
}

export default function TerrainView({ days }: { days: GitHubStats["days"] }) {
  return (
    <View className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 2.2, 4.6]} fov={42} />
      <Terrain days={days} />
    </View>
  );
}
```

(The `key={days.length}` forces instancedMesh re-creation if the day count changes between fallback and live data, since instance count is fixed at construction.)

- [ ] **Step 5: Create `src/components/sections/GitHubActivity.tsx`**

```tsx
"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { siteConfig } from "@/data/siteConfig";
import { githubFallback } from "@/data/githubFallback";
import type { GitHubStats } from "@/types";
import SectionLabel from "@/components/ui/SectionLabel";

const TerrainView = dynamic(() => import("@/components/three/ContributionTerrain"), {
  ssr: false,
});

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-serif text-3xl text-paper">{value}</p>
      <p className="mt-1 font-mono text-[10px] tracking-widest text-paper-dim">{label}</p>
    </div>
  );
}

export default function GitHubActivity() {
  const [stats, setStats] = useState<GitHubStats>(githubFallback);

  useEffect(() => {
    fetch("/api/github")
      .then((r) => (r.ok ? r.json() : null))
      .then((d: GitHubStats | null) => {
        if (d?.days?.length) setStats(d);
      })
      .catch(() => {
        /* fallback already rendered */
      });
  }, []);

  return (
    <section id="github" className="relative border-t border-line py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionLabel index="05" title="PROOF OF WORK" />
        <h2 className="mb-10 font-serif text-3xl text-paper md:text-4xl">
          A year of commits, <em className="text-paper-dim">in relief.</em>
        </h2>

        <div className="h-[240px] md:h-[320px]" aria-hidden>
          <TerrainView days={stats.days} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="mt-10 flex flex-wrap items-end justify-between gap-8"
        >
          <div className="flex flex-wrap gap-12">
            <Stat value={stats.total.toLocaleString()} label="CONTRIBUTIONS / LAST 12 MO" />
            <Stat value={String(stats.repos.count)} label="PUBLIC REPOS" />
            <Stat
              value={stats.repos.topLanguages.join(" · ") || "—"}
              label="TOP LANGUAGES"
            />
          </div>
          <a
            href={siteConfig.social.github}
            target="_blank"
            rel="noopener noreferrer"
            className="border-b border-mint/50 pb-0.5 font-mono text-[11px] tracking-widest text-mint transition-colors hover:border-mint"
            data-cursor
          >
            [ VIEW GITHUB ↗ ]
          </a>
        </motion.div>
      </div>
    </section>
  );
}
```

- [ ] **Step 6: Verify (including fallback path)**

Run: `npm run build` — success.
Dev check 1: section renders glowing 3D terrain + real stats.
Dev check 2 (fallback): in DevTools → Network, block the `/api/github` request (right-click → Block request URL), reload — section still renders identically from the snapshot. Unblock after.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: proof of work — GitHub contribution 3D terrain with real-data fallback"
```

---

### Task 10: Contact + globe, page composition, cleanup

**Files:**
- Create: `src/components/three/ContactGlobe.tsx`
- Modify: `src/components/sections/Contact.tsx` (full rewrite)
- Modify: `src/app/page.tsx`
- Modify: `src/app/globals.css` (remove legacy aliases)
- Delete: `src/components/sections/Testimonials.tsx`, `src/components/ui/SectionHeading.tsx`

- [ ] **Step 1: Create `src/components/three/ContactGlobe.tsx`**

```tsx
"use client";

import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { View, PerspectiveCamera } from "@react-three/drei";
import { usePrefersReducedMotion } from "@/lib/useMediaQuery";

const MINT = "#52f2a8";
const RADIUS = 1.35;

// Dehradun: 30.32 N, 78.03 E
function latLonToVec3(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

const MARKER = latLonToVec3(30.32, 78.03, RADIUS);

function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const reduced = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (reduced) return;
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.12;
    if (pulseRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.4) * 0.35;
      pulseRef.current.scale.setScalar(s);
    }
  });

  return (
    // Initial rotation turns Dehradun toward the camera
    <group ref={groupRef} rotation={[0.25, -1.2, 0]}>
      <mesh>
        <sphereGeometry args={[RADIUS, 28, 18]} />
        <meshBasicMaterial color={MINT} wireframe transparent opacity={0.13} />
      </mesh>
      <group position={MARKER}>
        <mesh>
          <sphereGeometry args={[0.045, 12, 12]} />
          <meshBasicMaterial color={MINT} />
        </mesh>
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.07, 0.085, 32]} />
          <meshBasicMaterial color={MINT} transparent opacity={0.5} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  );
}

export default function GlobeView() {
  return (
    <View className="h-full w-full">
      <PerspectiveCamera makeDefault position={[0, 0.4, 4]} fov={45} />
      <Globe />
    </View>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/sections/Contact.tsx`**

```tsx
"use client";

import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { Github, Linkedin, Twitter } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";
import SectionLabel from "@/components/ui/SectionLabel";

const GlobeView = dynamic(() => import("@/components/three/ContactGlobe"), { ssr: false });

const socials = [
  { label: "GITHUB", href: siteConfig.social.github, icon: Github },
  { label: "LINKEDIN", href: siteConfig.social.linkedin, icon: Linkedin },
  { label: "X / TWITTER", href: siteConfig.social.twitter, icon: Twitter },
];

export default function Contact() {
  return (
    <section id="contact" className="blueprint-grid relative overflow-hidden border-t border-line py-24 md:py-36">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-[3fr_2fr]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
        >
          <SectionLabel index="06" title="TRANSMIT" />
          <h2 className="font-serif text-[clamp(40px,7vw,88px)] leading-[1.02] text-paper">
            Let&apos;s build
            <br />
            <em className="text-paper-dim">something real.</em>
          </h2>
          <a
            href={`mailto:${siteConfig.email}`}
            className="mt-9 inline-block border-b border-mint/50 pb-1 font-mono text-sm tracking-wider text-mint transition-colors hover:border-mint"
            data-cursor
          >
            {siteConfig.email} ↗
          </a>
          <div className="mt-12 flex flex-wrap gap-6">
            {socials.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-mono text-[10px] tracking-widest text-paper-dim transition-colors hover:text-mint"
                data-cursor
              >
                <Icon size={13} /> {label}
              </a>
            ))}
          </div>
        </motion.div>

        <div className="relative hidden md:block" aria-hidden>
          <div className="h-[340px] w-full">
            <GlobeView />
          </div>
          <p className="absolute bottom-2 right-2 text-right font-mono text-[9px] leading-relaxed tracking-widest text-paper-faint">
            DEHRADUN, IN
            <br />
            30.3°N 78.0°E
          </p>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Update `src/app/page.tsx`** (full replacement)

```tsx
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Experience from "@/components/sections/Experience";
import GitHubActivity from "@/components/sections/GitHubActivity";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Experience />
      <GitHubActivity />
      <Contact />
    </>
  );
}
```

- [ ] **Step 4: Delete dead files and the legacy CSS aliases**

```bash
rm src/components/sections/Testimonials.tsx src/components/ui/SectionHeading.tsx
```

In `src/app/globals.css`, delete the entire `/* Legacy aliases ... */ :root { ... }` block added in Task 1.

Run: `grep -rn "Testimonials\|SectionHeading\|--bg-primary\|--text-primary\|--accent\b" src/`
Expected: no matches.

- [ ] **Step 5: Verify the complete page**

Run: `npm run build` — success, zero type errors.
Dev check: full scroll-through — all six numbered sections in order, all four 3D views render, no console errors, mobile layout sane at 390px width.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: contact globe, final page composition, remove testimonials and legacy styles"
```

---

### Task 11: Playwright e2e tests + final verification

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/portfolio.spec.ts`
- Modify: `package.json` (test script)
- Modify: `.gitignore`

- [ ] **Step 1: Create `playwright.config.ts`**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 30_000,
  use: {
    baseURL: "http://localhost:3000",
    viewport: { width: 1280, height: 800 },
  },
  webServer: {
    command: "npm run build && npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 240_000,
  },
});
```

Add to `package.json` scripts: `"test:e2e": "playwright test"`.
Add to `.gitignore`:

```
test-results/
playwright-report/
```

- [ ] **Step 2: Create `tests/e2e/portfolio.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const SECTION_IDS = ["hero", "about", "projects", "skills", "experience", "github", "contact"];

test("renders all sections with hero heading", async ({ page }) => {
  await page.goto("/");
  for (const id of SECTION_IDS) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Shah");
});

test("case study overlay opens and closes", async ({ page }) => {
  await page.goto("/");
  await page.locator("#projects button", { hasText: "WebscrapingHQ" }).first().click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("PROBLEM");
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("experience entries expand and collapse", async ({ page }) => {
  await page.goto("/");
  const toggle = page.locator("#experience button", { hasText: "Software Engineer" });
  await expect(toggle).toHaveAttribute("aria-expanded", "true");
  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
});

test("github section shows contribution stats", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#github")).toContainText(/CONTRIBUTIONS/i);
  await expect(page.locator("#github")).toContainText(/PUBLIC REPOS/i);
});

test("github section survives API failure (fallback)", async ({ page }) => {
  await page.route("**/api/github", (route) => route.abort());
  await page.goto("/");
  await expect(page.locator("#github")).toContainText(/CONTRIBUTIONS/i);
});

test("no page errors on load and scroll", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await page.waitForTimeout(2000);
  await page.locator("#contact").scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  expect(errors).toEqual([]);
});

test.describe("reduced motion", () => {
  test.use({ contextOptions: { reducedMotion: "reduce" } });
  test("page renders without animation errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto("/");
    await expect(page.locator("#hero")).toBeVisible();
    await page.waitForTimeout(1500);
    expect(errors).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test suite**

Run: `npm run test:e2e`
Expected: all 7 tests PASS. If WebGL-related failures occur in headless mode, chromium's SwiftShader handles it by default — investigate actual errors rather than skipping.

- [ ] **Step 4: Final manual checklist**

- [ ] Hero structure follows cursor; smooth scroll feels right
- [ ] Project tilt + overlay; constellation drag; terrain renders; globe rotates with Dehradun marker
- [ ] 390px-wide mobile pass: menu, stacked layouts, no horizontal overflow
- [ ] OS reduced-motion enabled: no spinning/floating, content fully readable
- [ ] Lighthouse (DevTools, throttled): performance ≥ 90 — if lower, first suspects are particle count and DPR cap

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: playwright e2e suite for sections, overlay, github fallback, reduced motion"
```

---

## Post-plan notes (not tasks)

- `GITHUB_TOKEN` is optional. If the user adds it (`.env.local` / Vercel env), the route uses first-party GraphQL data; otherwise it uses the public contributions API, then the committed snapshot.
- Optional follow-up (user-approved as out of scope): re-capture project screenshots at higher resolution.
- The drei `View` geometries created with `useMemo(new THREE.*)` are not explicitly disposed; they live for the page lifetime by design (single-page site, views never unmount).
