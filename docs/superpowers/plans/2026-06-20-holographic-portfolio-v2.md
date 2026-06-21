# Holographic Portfolio (V2) — Next.js Port Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the existing Next.js 16 portfolio to match the approved claude_design "Holographic Portfolio" (V2) — a near-black, blue/purple/cyan neon glassmorphism design with an avatar 3D stage, orbiting skills galaxy, glass project showcase, game-level experience path, and a holographic radar contact globe — implemented as real React components.

**Architecture:** Keep the Next.js App Router structure. Port the design's CSS verbatim into `globals.css` (it is a finely-tuned system; rewriting it as Tailwind utilities would cause drift). Most sections become **server components** that emit the design's markup as JSX with the design's class names and `data-*` attributes. All global interaction behavior from the design's `script.js` (particles, custom cursor, magnetic buttons, 3D tilt, scroll-reveal, count-up, typed code, hero parallax) is ported into a single `"use client"` component, `SiteInteractions`, mounted once in the layout. Nav (scroll-spy / solid-on-scroll / mobile menu) and the contact form use local React state in their own client components. Fonts via `next/font/google`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4 (kept for preflight + occasional utilities), `next/font`. No new runtime dependencies. `@playwright/test` added as a dev dependency for the final smoke-test task. (`motion` and `lucide-react` remain installed but are no longer imported after the port; removal is an optional cleanup step.)

**Spec / source of truth:** The approved design is archived in-repo at `docs/design-reference/v2/` (`index.html`, `styles.css`, `sections.css`, `script.js`). These files ARE the spec — tasks reference them directly instead of reproducing every CSS line.

**Verification note:** This is visual design work; strict test-first TDD does not map cleanly (this matches the precedent in `docs/superpowers/plans/2026-06-12-dark-workshop-redesign.md`). Discipline used instead: **every task ends with `npm run build` passing and a `npm run dev` visual check**, and the final task (Task 10) adds Playwright smoke tests covering behavior (every section renders, nav anchors scroll, mobile menu toggles, the contact form shows its success note, zero console errors). Between Tasks 2–8 the page is in visual transition (new layout shell + a mix of new and not-yet-ported sections) but always builds and renders.

---

## Global Constraints

- **Framework versions stay put:** Next.js `16.1.6`, React `19.2.3`, Tailwind `^4`. Do not upgrade.
- **Dark only.** No theme toggle, no light theme. The old `[data-theme="light"]` block and `ThemeToggle` are removed.
- **Design fidelity first.** Match `docs/design-reference/v2/` exactly for layout, color, spacing, and motion. Class names and `data-*` hooks must match the design so the ported `script.js` behaviors bind correctly.
- **Real content over design placeholders** (see Content Reconciliation below) — use the real data in `src/data/*`, not the placeholder handles baked into the design HTML.
- **Accessibility:** all purely-decorative atmosphere (`.fog`, `.grid-bg`, `#particles`, `.scanlines`, cursor, globe, galaxy) is `aria-hidden` / non-focusable; real content stays in semantic HTML. Respect `prefers-reduced-motion` (the design's CSS + `script.js` already gate on it; preserve that).
- **No `console.log`/debug noise** in committed code.
- **Commit at the end of every task** with the exact message given.

---

## Content Reconciliation (decisions baked into this plan)

The design HTML contains placeholder/preview content. The port uses the repo's real data instead:

1. **Social URLs** — use `siteConfig.social` (real): LinkedIn `https://www.linkedin.com/in/sachin-singh-shah-464156173/`, X `https://x.com/ShahSinghSachin`, GitHub `https://github.com/sachinsinghshah`. NOT the design's `linkedin.com/in/sachinsinghshah` / `twitter.com/sachinsinghshah` placeholders.
2. **Projects** — driven by real `src/data/projects.ts` (4 real projects). A new `projectShowcase` map (Task 1) supplies the design's presentation layer (featured = Lawly AI; cards = Chat App → "Chatify", Shah Properties, WebscrapingHQ → "WebScrapingHQ"), reusing the existing screenshots in `public/screenshots/<slug>.png` and the real `liveUrl`/`githubUrl`. No case-study modal — the design uses simple out-links (the old `ProjectModal` is deleted). *(The rich problem/solution/result copy stays in `projects.ts` for SEO/future use.)*
3. **Contact card** — Email + GitHub use real values; the third row is a non-link **Location** ("India · Open to Relocate") — the design's `tel:` placeholder number is dropped.
4. **Stats / checks / experience copy** — keep the design's content (3+/25+/15+/100%, the four check items, the three experience milestones). These are accurate to the user (3+ yrs since May 2023; 8om Internet; 100xDevs; B.Tech MITRC).
5. **The "Tweaks" panel** (`tweaks.css` / `tweaks.js` — aura/atmosphere/motion switcher) is a claude_design **preview-only** affordance and is **out of scope**. It is NOT ported. (`prefers-reduced-motion` handling is kept.)
6. **Avatar art** — the design's stylized cutout avatars (`avatar-portrait.png` for the hero stage, `avatar-core.png` for the galaxy core) are pulled from the design project into `public/v2/` (Task 1, Step 6). If an asset exceeds the design API's 256 KiB read cap, fall back to the existing `/avatar.jpeg` (documented inline).

---

## Final File Structure

```
src/
├── app/
│   ├── layout.tsx          MODIFY — next/font vars, atmosphere + interactions + nav/rail/footer shell
│   ├── page.tsx            MODIFY — section order: Hero, About, Skills, Projects, Experience, Contact
│   └── globals.css         REWRITE — tailwind + design system (styles.css + sections.css) 
├── components/
│   ├── layout/
│   │   ├── Background.tsx       CREATE — fog, grid, scanlines, particles canvas, cursor nodes (server)
│   │   ├── SiteInteractions.tsx CREATE — "use client", ports script.js global behaviors
│   │   ├── CustomCursor.tsx     (removed — folded into Background + SiteInteractions)
│   │   ├── Navbar.tsx           REWRITE — "use client", logo/links/CTA/burger, scroll-spy + solid
│   │   ├── SocialRail.tsx       CREATE — fixed left social rail (server)
│   │   ├── Footer.tsx           REWRITE — design footer (server)
│   │   └── PageTransition.tsx   DELETE
│   ├── sections/
│   │   ├── Hero.tsx             REWRITE (server) — avatar stage + chips + copy
│   │   ├── About.tsx            REWRITE (server) — workstation laptop + stats + features
│   │   ├── Skills.tsx           REWRITE (server) — galaxy + mobile fallback
│   │   ├── Projects.tsx         REWRITE (server) — featured laptop + 3 cards
│   │   ├── Experience.tsx       REWRITE (server) — path + milestones
│   │   ├── Contact.tsx          REWRITE ("use client") — globe + list + form
│   │   └── Testimonials.tsx     DELETE
│   └── ui/
│       ├── icons.tsx            CREATE — all inline SVGs (tech logos, social, ui) as components
│       ├── ProjectModal.tsx     DELETE
│       ├── TechBadge.tsx        DELETE
│       ├── SectionHeading.tsx   DELETE (unused after port)
│       └── ThemeToggle.tsx      DELETE
├── data/
│   ├── siteConfig.ts       MODIFY — navLinks (design order incl. Home)
│   ├── projects.ts         MODIFY — add `projectShowcase` presentation map
│   ├── skills.ts           CREATE — galaxy planets + mobile fallback list
│   └── experience.ts       CREATE — three milestones
├── lib/
│   └── utils.ts            KEEP — cn(), scrollToSection()
└── types/
    └── index.ts            MODIFY — drop Testimonial & Skill; add SkillPlanet, ExperienceItem, ProjectCardMeta
public/
└── v2/                     CREATE — avatar-portrait.png, avatar-core.png (design avatars)
```

Section ids (DOM order): `home`, `about`, `skills`, `projects`, `experience`, `contact`.

---

### Task 1: Foundation — design system CSS, fonts, data, types, assets

**Files:**
- Rewrite: `src/app/globals.css`
- Modify: `src/app/layout.tsx` (font setup only)
- Modify: `src/data/siteConfig.ts`
- Modify: `src/data/projects.ts` (append `projectShowcase`)
- Create: `src/data/skills.ts`
- Create: `src/data/experience.ts`
- Modify: `src/types/index.ts`
- Create: `public/v2/avatar-portrait.png`, `public/v2/avatar-core.png`

**Interfaces (Produces):**
- `siteConfig.navLinks: { label: string; href: string }[]` — six entries, design order.
- `projectShowcase: { featuredSlug: string; cardSlugs: string[]; meta: Record<string, ProjectCardMeta> }`.
- `skillPlanets: SkillPlanet[]`, `skillFallback: string[]`.
- `experienceItems: ExperienceItem[]`.
- Types `SkillPlanet`, `ExperienceItem`, `ProjectCardMeta`.

- [ ] **Step 1: Rewrite `src/app/globals.css`**

Create the file with this exact structure:
1. Line 1: `@import "tailwindcss";`
2. Then paste the **entire contents** of `docs/design-reference/v2/styles.css`, with ONLY these edits inside its `:root{...}` block — replace the three font lines:
   ```css
   --font-d:var(--font-space-grotesk),"Space Grotesk",sans-serif;
   --font-b:var(--font-sora),"Sora",sans-serif;
   --font-m:var(--font-jetbrains-mono),"JetBrains Mono",monospace;
   ```
3. Then paste the **entire contents** of `docs/design-reference/v2/sections.css`.
4. Then append this trailing block (skip-link, reduced-motion safety, and a `.galaxy-core`/`.pcard .shot` relative-position guard for `next/image fill`):

```css
/* ---- Next.js port additions ---- */
.skip-link{
  position:absolute;top:-40px;left:0;background:var(--blue);color:#fff;
  padding:8px 16px;z-index:300;text-decoration:none;border-radius:0 0 8px 0;font-family:var(--font-m);font-size:12px;
}
.skip-link:focus{top:0}

:focus-visible{outline:2px solid var(--blue-soft);outline-offset:3px;border-radius:4px}

/* next/image fill needs a positioned ancestor */
.galaxy-core,.pcard .shot,.laptop-screen .shot{position:relative}

@media (prefers-reduced-motion:reduce){
  .stage-glow,.ring,.avatar-main,.chip,.ws-laptop,.ws-window,.ringset,.planet .spinner,
  .path-line::after,.g-sweep,.g-globe::before,.g-sat .rot,.mouse span,.hero h1 .alive{animation:none!important}
}
```

> Note: the design's `styles.css` already includes `* {margin:0;padding:0;box-sizing:border-box}`, body background/colors, `::selection`, scrollbar styles, the atmosphere layers, custom-cursor nodes, layout primitives, glass, buttons, nav/social-rail, and `.reveal`. The design's `sections.css` includes every section's styles. Do not duplicate or rewrite them — copy verbatim.

- [ ] **Step 2: Add fonts in `src/app/layout.tsx`** (font setup only; full shell rewrite is Task 2)

At the top, add imports and font instances, and apply the variable classes + `dark` intent to `<html>`. Leave the existing `<body>` children as-is for now:

```tsx
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400","500","600","700"], variable: "--font-space-grotesk" });
const body = Sora({ subsets: ["latin"], weight: ["300","400","500","600","700"], variable: "--font-sora" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400","500"], variable: "--font-jetbrains-mono" });
```

Change the opening tag to:
```tsx
<html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
```

- [ ] **Step 3: Update `src/data/siteConfig.ts` navLinks** (design order, includes Home)

Replace the `navLinks` array with:
```ts
navLinks: [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
],
```
Leave `name`, `title` ("Full-Stack Developer"), `tagline`, `email`, `resumeUrl`, `social` unchanged.

- [ ] **Step 4: Update `src/types/index.ts`**

**Keep `Skill` and `Testimonial` for now** (deleting them here would break the not-yet-ported old components and fail the build). They are removed later: `Testimonial` in Task 2 (when `Testimonials.tsx` is deleted), `Skill` in Task 5 (when `Skills.tsx` is rewritten). For this task, only ADD:
```ts
export interface ProjectCardMeta {
  display: string;          // card/featured heading (e.g. "Chatify")
  category: string;         // badge text (e.g. "Full Stack")
  subtitle: string;         // mono sub-line (e.g. "MERN · Socket.IO · JWT")
  blurb?: string;           // featured-only paragraph
  tags?: string[];          // featured-only tag pills
}

export interface SkillPlanet {
  name: string;
  icon: string;             // key into the TechIcon map (see ui/icons.tsx)
  ring: 1 | 2 | 3;
  angle: string;            // e.g. "-58deg"
  radius: number;           // px: 200 | 310 | 420
  delay: string;            // decorative, e.g. ".5s"
}

export interface ExperienceItem {
  level: string;            // "LVL 03"
  icon: string;             // key into TechIcon map: "layers" | "brackets" | "cap"
  date: string;
  role: string;
  org: string;
  description: string;
}
```
Keep `Project`, `Experience` (legacy, still referenced nowhere harmful), `NavLink`, `SiteConfig`.

- [ ] **Step 5: Append `projectShowcase` to `src/data/projects.ts`**

After the `projects` array, add:
```ts
import { ProjectCardMeta } from "@/types";

export const projectShowcase: {
  featuredSlug: string;
  cardSlugs: string[];
  meta: Record<string, ProjectCardMeta>;
} = {
  featuredSlug: "lawly-ai-saas",
  cardSlugs: ["chat-app-v1", "shah-properties", "webscrapinghq"],
  meta: {
    "lawly-ai-saas": {
      display: "LawlyAI — Legal SaaS",
      category: "AI / SaaS",
      subtitle: "Next.js · TypeScript · AI",
      blurb:
        "An AI-powered legal automation platform that generates contracts, tracks compliance deadlines and delivers expert guidance. Built with Next.js, TypeScript & Tailwind for modern businesses.",
      tags: ["Next.js", "TypeScript", "Tailwind", "AI"],
    },
    "chat-app-v1": { display: "Chatify", category: "Full Stack", subtitle: "MERN · Socket.IO · JWT" },
    "shah-properties": { display: "Shah Properties", category: "Web App", subtitle: "Next.js · Real Estate Platform" },
    "webscrapinghq": { display: "WebScrapingHQ", category: "AI / API", subtitle: "AI Scraping API · DaaS" },
  },
};
```
(Update the existing `import { Project } from "@/types";` line to also import `ProjectCardMeta`, or add the separate import as shown.)

- [ ] **Step 6: Fetch avatar assets into `public/v2/`**

The design avatars live in the claude_design project. Pull them via the design MCP and write to `public/v2/`:
- Read `assets/avatar-portrait.png` and `assets/avatar-core.png` (project `47573194-94a1-4a1d-a06f-b6fcca551317`) using the design `get_file` method (returns base64).
- Decode and write to `public/v2/avatar-portrait.png` and `public/v2/avatar-core.png`.
- **Fallback:** if a read returns `truncated: true` (over the 256 KiB cap), instead copy `public/avatar.jpeg` to the missing path (`public/v2/avatar-portrait.png` / `avatar-core.png`) so the components still render; note it in the commit body.

- [ ] **Step 7: Create `src/data/skills.ts`**

```ts
import { SkillPlanet } from "@/types";

export const skillPlanets: SkillPlanet[] = [
  // inner ring (rs1, r=200)
  { name: "React",      icon: "react",      ring: 1, angle: "-58deg", radius: 200, delay: "0s" },
  { name: "Next.js",    icon: "nextjs",     ring: 1, angle: "66deg",  radius: 200, delay: ".5s" },
  { name: "TypeScript", icon: "typescript", ring: 1, angle: "192deg", radius: 200, delay: "1s" },
  // mid ring (rs2, r=310)
  { name: "Node.js",    icon: "nodejs",     ring: 2, angle: "-22deg", radius: 310, delay: ".2s" },
  { name: "PostgreSQL", icon: "postgresql", ring: 2, angle: "58deg",  radius: 310, delay: ".7s" },
  { name: "Prisma",     icon: "prisma",     ring: 2, angle: "160deg", radius: 310, delay: "1.2s" },
  { name: "Tailwind",   icon: "tailwind",   ring: 2, angle: "238deg", radius: 310, delay: ".9s" },
  // outer ring (rs3, r=420)
  { name: "MongoDB",    icon: "mongodb",    ring: 3, angle: "18deg",  radius: 420, delay: ".4s" },
  { name: "Docker",     icon: "docker",     ring: 3, angle: "146deg", radius: 420, delay: "1.1s" },
  { name: "AWS",        icon: "aws",        ring: 3, angle: "302deg", radius: 420, delay: ".6s" },
];

export const skillFallback: string[] = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind", "MongoDB", "Docker",
];
```

- [ ] **Step 8: Create `src/data/experience.ts`**

```ts
import { ExperienceItem } from "@/types";

export const experienceItems: ExperienceItem[] = [
  {
    level: "LVL 03", icon: "layers", date: "May 2023 — Present",
    role: "Software Engineer", org: "@ 8om Internet",
    description:
      "Architecting React/Next.js apps with SSR & SSG (40% faster loads), a 30+ component TypeScript library, Turborepo monorepo and GitHub Actions CI/CD — while mentoring junior developers.",
  },
  {
    level: "LVL 02", icon: "brackets", date: "2023",
    role: "Full Stack Certification", org: "@ 100xDevs",
    description:
      "Completed an intensive Full Stack Web Development program — mastering the modern MERN & Next.js ecosystem end-to-end, from databases to deployment.",
  },
  {
    level: "LVL 01", icon: "cap", date: "2015 — 2019",
    role: "B.Tech, Computer Science", org: "@ MITRC, Alwar",
    description:
      "Built the foundations — algorithms, systems and a love for turning logic into living, interactive software that people use.",
  },
];
```

- [ ] **Step 9: Verify build**

Run: `npm run build`
Expected: build succeeds with zero type errors. (Old section components still compile; they will look unstyled because their old CSS classes/vars are gone — that is expected during transition.)

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat(v2): foundation — holographic design system, fonts, data, types, avatars"
```

---

### Task 2: Layout shell — icons, atmosphere, interactions, nav, rail, footer, composition

**Files:**
- Create: `src/components/ui/icons.tsx`
- Create: `src/components/layout/Background.tsx`
- Create: `src/components/layout/SiteInteractions.tsx`
- Create: `src/components/layout/SocialRail.tsx`
- Rewrite: `src/components/layout/Navbar.tsx`
- Rewrite: `src/components/layout/Footer.tsx`
- Rewrite: `src/app/layout.tsx`
- Rewrite: `src/app/page.tsx`
- Append: `src/app/globals.css` (responsive nav)
- Modify: `src/types/index.ts` (remove `Testimonial`)
- Delete: `src/components/layout/PageTransition.tsx`, `src/components/layout/CustomCursor.tsx`, `src/components/ui/ThemeToggle.tsx`, `src/components/sections/Testimonials.tsx`

**Interfaces (Produces):**
- `icons.tsx` exports: `GithubIcon, LinkedinIcon, XIcon, MailIcon, ArrowRightIcon, PaperPlaneIcon, ExternalLinkIcon, CodeIcon, DownloadIcon, CheckIcon, PhoneIcon, BurgerIcon` (each `() => JSX.Element`, no props); `TechIcon({ name }: { name: string })`; `FeatureIcon({ name }: { name: string })`; `ExpIcon({ name }: { name: string })`.
- `<Background/>`, `<SiteInteractions/>`, `<Navbar/>`, `<SocialRail/>`, `<Footer/>` components.

- [ ] **Step 1: Create `src/components/ui/icons.tsx`**

All inline SVGs from the design, as components. SVGs carry no width/height — the design CSS sizes them via descendant selectors (`.btn svg`, `.chip i svg`, `.social-rail a svg`, etc.).

```tsx
import type { JSX } from "react";

/* ---------- Social ---------- */
export const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.79-4.58 5.05.36.32.68.94.68 1.91 0 1.38-.01 2.49-.01 2.83 0 .27.18.6.69.49A10.26 10.26 0 0 0 22 12.25C22 6.58 17.52 2 12 2z"/></svg>
);
export const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14zM8.34 18.34v-8H5.67v8h2.67zM7 9.13a1.55 1.55 0 1 0 0-3.1 1.55 1.55 0 0 0 0 3.1zm11.34 9.21v-4.4c0-2.35-1.26-3.44-2.94-3.44-1.35 0-1.96.74-2.3 1.27v-1.09h-2.67c.04.75 0 8 0 8h2.67v-4.47c0-.24.02-.48.09-.65.19-.48.63-.97 1.37-.97.97 0 1.36.74 1.36 1.82v4.27h2.42z"/></svg>
);
export const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.5 8.6L23.3 22h-6.9l-5.4-7.1L4.8 22H1.7l8-9.2L1 2h7l4.9 6.5L18.9 2zm-2.4 18h1.9L7.6 3.9H5.5L16.5 20z"/></svg>
);
export const MailIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>
);

/* ---------- UI ---------- */
export const ArrowRightIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
);
export const PaperPlaneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m22 2-7 20-4-9-9-4 20-7z"/></svg>
);
export const ExternalLinkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 17 17 7M9 7h8v8"/></svg>
);
export const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>
);
export const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14"/></svg>
);
export const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 6 9 17l-5-5"/></svg>
);
export const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2H7a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.7.7A2 2 0 0 1 22 16.9z"/></svg>
);
export const BurgerIcon = () => (<><span /><span /><span /></>);

/* ---------- Tech logos (galaxy + hero chips) ---------- */
const TECH: Record<string, JSX.Element> = {
  react: (<svg viewBox="0 0 24 24" fill="none" stroke="#61DAFB" strokeWidth="1.3"><circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/></svg>),
  nextjs: (<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.1"><circle cx="12" cy="12" r="10"/><path d="M8 7v10M8 7l8 11M16 7v8"/></svg>),
  nodejs: (<svg viewBox="0 0 24 24" fill="#83CD29"><path d="M12 1.6 3 6.8v10.4l9 5.2 9-5.2V6.8L12 1.6zm0 3 6 3.46v6.9L12 18.4 6 14.96v-6.9L12 4.6z"/></svg>),
  postgresql: (<svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.2"><ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.66 3.13 3 7 3s7-1.34 7-3V6"/></svg>),
  prisma: (<svg viewBox="0 0 24 24" fill="#fff"><path d="M19 18 13 2h-2L5 18l1.5 1.2L12 7l4 9.5-3-.7-1 1.4 7 2.8z"/></svg>),
  tailwind: (<svg viewBox="0 0 24 24" fill="#38BDF8"><path d="M12 6c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.74.18 1.27.72 1.86 1.32C13.3 10.7 14.4 11.8 16.5 11.8c2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.74-.18-1.27-.72-1.86-1.32C15.2 7.1 14.1 6 12 6zM6.5 12.2c-2.7 0-4.3 1.3-5 4 1-1.3 2.2-1.8 3.5-1.5.74.18 1.27.72 1.86 1.32C7.8 16.9 8.9 18 11 18c2.7 0 4.3-1.3 5-4-1 1.3-2.2 1.8-3.5 1.5-.74-.18-1.27-.72-1.86-1.32-.94-.96-2.04-2.06-4.14-2.06z"/></svg>),
  mongodb: (<svg viewBox="0 0 24 24" fill="#4DB33D"><path d="M12 2c1 4 4 5 4 10 0 4-2 6-4 8-2-2-4-4-4-8 0-5 3-6 4-10z"/></svg>),
  docker: (<svg viewBox="0 0 24 24" fill="none" stroke="#2496ED" strokeWidth="1.3"><rect x="3" y="10" width="4" height="4"/><rect x="8" y="10" width="4" height="4"/><rect x="8" y="5" width="4" height="4"/><rect x="13" y="10" width="4" height="4"/><path d="M3 17c4 2 13 1 16-5 1 1 2 1 2 1"/></svg>),
  aws: (<svg viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="1.3"><path d="M4 13c5 4 11 4 16 0M3 16c6 4 12 4 18 0M7 8h4l2 3"/></svg>),
};
export function TechIcon({ name }: { name: string }) {
  return TECH[name] ?? null;
}

/* ---------- About feature chips ---------- */
const FEATURE: Record<string, JSX.Element> = {
  pixel: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></svg>),
  perf: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z"/></svg>),
  mobile: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>),
  anim: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"/></svg>),
  arch: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>),
  best: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>),
};
export function FeatureIcon({ name }: { name: string }) {
  return FEATURE[name] ?? null;
}

/* ---------- Experience node icons ---------- */
const EXP: Record<string, JSX.Element> = {
  layers: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>),
  brackets: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>),
  cap: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/></svg>),
};
export function ExpIcon({ name }: { name: string }) {
  return EXP[name] ?? null;
}
```

- [ ] **Step 2: Create `src/components/layout/Background.tsx`** (server component — atmosphere + cursor nodes)

```tsx
export default function Background() {
  return (
    <>
      <div className="fog" aria-hidden />
      <div className="grid-bg" aria-hidden />
      <canvas id="particles" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div className="cur-ring" aria-hidden />
      <div className="cur-dot" aria-hidden />
    </>
  );
}
```

- [ ] **Step 3: Create `src/components/layout/SiteInteractions.tsx`** (client — ports `script.js` global behaviors)

This is a faithful port of `docs/design-reference/v2/script.js` MINUS the nav/scroll-spy/mobile-menu (now in `Navbar`) and the contact form (now in `Contact`). It runs once after mount and cleans up on unmount.

```tsx
"use client";

import { useEffect } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: number[]; a: number };

export default function SiteInteractions() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(max-width: 860px)").matches || "ontouchstart" in window;
    const cleanups: Array<() => void> = [];

    /* Particles */
    const cv = document.getElementById("particles") as HTMLCanvasElement | null;
    const ctx = cv?.getContext("2d");
    if (cv && ctx && !reduce) {
      let W = 0, H = 0, parts: Particle[] = [], raf = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const COL = [[59, 130, 246], [139, 92, 246], [6, 182, 212]];
      const resize = () => {
        W = cv.width = innerWidth * DPR; H = cv.height = innerHeight * DPR;
        cv.style.width = innerWidth + "px"; cv.style.height = innerHeight + "px";
        const n = Math.min(90, Math.floor((innerWidth * innerHeight) / 18000));
        parts = Array.from({ length: n }, () => ({
          x: Math.random() * W, y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22 * DPR, vy: (Math.random() - 0.5) * 0.22 * DPR,
          r: (Math.random() * 1.6 + 0.5) * DPR, c: COL[Math.floor(Math.random() * COL.length)],
          a: Math.random() * 0.5 + 0.25,
        }));
      };
      const mouse = { x: -9999, y: -9999 };
      const onMouse = (e: MouseEvent) => { mouse.x = e.clientX * DPR; mouse.y = e.clientY * DPR; };
      const LINK = 130 * DPR;
      const tick = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i]; p.x += p.vx; p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          for (let j = i + 1; j < parts.length; j++) {
            const q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
            if (d < LINK) {
              ctx.strokeStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${(1 - d / LINK) * 0.5})`;
              ctx.lineWidth = 0.6 * DPR; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
          const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (md < LINK * 1.6) {
            ctx.strokeStyle = `rgba(160,190,255,${(1 - md / (LINK * 1.6)) * 0.5})`;
            ctx.lineWidth = 0.7 * DPR; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
          }
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7);
          ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`; ctx.fill();
        }
        raf = requestAnimationFrame(tick);
      };
      resize(); addEventListener("resize", resize); addEventListener("mousemove", onMouse); tick();
      cleanups.push(() => { cancelAnimationFrame(raf); removeEventListener("resize", resize); removeEventListener("mousemove", onMouse); });
    }

    /* Custom cursor */
    if (!touch) {
      const dot = document.querySelector<HTMLElement>(".cur-dot");
      const ring = document.querySelector<HTMLElement>(".cur-ring");
      if (dot && ring) {
        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;
        const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`; };
        addEventListener("mousemove", onMove);
        const loop = () => { rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18; ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`; raf = requestAnimationFrame(loop); };
        loop();
        const hots = Array.from(document.querySelectorAll("[data-hot], a, button, input, textarea"));
        const enter = () => ring.classList.add("hot");
        const leave = () => ring.classList.remove("hot");
        hots.forEach((el) => { el.addEventListener("mouseenter", enter); el.addEventListener("mouseleave", leave); });
        cleanups.push(() => { cancelAnimationFrame(raf); removeEventListener("mousemove", onMove); hots.forEach((el) => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); }); });
      }
    }

    /* Magnetic buttons */
    if (!touch) {
      document.querySelectorAll<HTMLElement>("[data-mag]").forEach((el) => {
        const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`; };
        const out = () => { el.style.transform = ""; };
        el.addEventListener("mousemove", move); el.addEventListener("mouseleave", out);
        cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", out); });
      });
    }

    /* 3D tilt */
    if (!touch) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: MouseEvent) => { const r = el.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`; };
        const out = () => { el.style.transform = "perspective(900px) rotateY(0) rotateX(0)"; };
        el.addEventListener("mousemove", move); el.addEventListener("mouseleave", out);
        cleanups.push(() => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", out); });
      });
    }

    /* Reveal on scroll */
    const io = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* Count-up */
    const animCount = (el: HTMLElement) => {
      const target = +(el.dataset.count || "0"), suf = el.dataset.suffix || "", dur = 1500, t0 = performance.now();
      const step = (t: number) => { const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(target * e) + suf; if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) { animCount(en.target as HTMLElement); cio.unobserve(en.target); } }); }, { threshold: 0.5 });
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());

    /* Typed code lines */
    const lines = document.querySelectorAll<HTMLElement>("#codeBlock .ln");
    const block = document.getElementById("codeBlock");
    if (lines.length && block) {
      const cb = new IntersectionObserver((ents) => { ents.forEach((en) => { if (en.isIntersecting) { lines.forEach((l, i) => { l.style.animationDelay = i * 0.12 + "s"; }); cb.disconnect(); } }); }, { threshold: 0.4 });
      cb.observe(block);
      cleanups.push(() => cb.disconnect());
    }

    /* Hero parallax */
    if (!touch && !reduce) {
      const stage = document.querySelector<HTMLElement>(".stage");
      const floats = Array.from(document.querySelectorAll<HTMLElement>("[data-float]"));
      const av = document.querySelector<HTMLElement>(".avatar-main");
      if (stage) {
        const move = (e: MouseEvent) => { const r = stage.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; floats.forEach((f, i) => { const d = ((i % 3) + 1) * 10; f.style.translate = `${x * d}px ${y * d}px`; }); if (av) av.style.translate = `${x * -14}px ${y * -14}px`; };
        const out = () => { floats.forEach((f) => { f.style.translate = ""; }); if (av) av.style.translate = ""; };
        stage.addEventListener("mousemove", move); stage.addEventListener("mouseleave", out);
        cleanups.push(() => { stage.removeEventListener("mousemove", move); stage.removeEventListener("mouseleave", out); });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
```

- [ ] **Step 4: Rewrite `src/components/layout/Navbar.tsx`** (client — scroll-spy, solid-on-scroll, mobile menu)

```tsx
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
      secs.forEach((s) => { if (window.scrollY >= s.offsetTop - 160) cur = s.id; });
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
          <span>Sachin<span style={{ color: "var(--blue-soft)" }}>.</span>dev</span>
        </a>
        <div className={open ? "nav-links open" : "nav-links"} id="navLinks">
          {siteConfig.navLinks.map((l) => (
            <a key={l.href} href={l.href} className={active === l.href.slice(1) ? "active" : undefined} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
        </div>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary" data-mag data-hot onClick={() => setOpen(false)}>
            Let&apos;s Talk <ArrowRightIcon />
          </a>
          <button className="burger" id="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            <span /><span /><span />
          </button>
        </div>
      </div>
    </nav>
  );
}
```

- [ ] **Step 5: Create `src/components/layout/SocialRail.tsx`** (server)

```tsx
import { siteConfig } from "@/data/siteConfig";
import { GithubIcon, LinkedinIcon, XIcon, MailIcon } from "@/components/ui/icons";

export default function SocialRail() {
  return (
    <div className="social-rail" aria-label="Social links">
      <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-hot aria-label="GitHub"><GithubIcon /></a>
      <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" data-hot aria-label="LinkedIn"><LinkedinIcon /></a>
      <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" data-hot aria-label="X"><XIcon /></a>
      <a href={`mailto:${siteConfig.email}`} data-hot aria-label="Email"><MailIcon /></a>
    </div>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/layout/Footer.tsx`** (server)

```tsx
export default function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <p>
          Designed &amp; built by Sachin Singh Shah <span className="heart">◆</span> Crafted to feel alive · {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Append responsive-nav CSS to `src/app/globals.css`**

The design's `styles.css` never collapses the nav on small screens (its mobile menu CSS lived only in inline JS). Add this at the end of `globals.css`:

```css
/* responsive nav (was inline-JS-only in the original design) */
@media (max-width:860px){
  .nav-links{display:none}
  .nav-links.open{
    display:flex;position:absolute;top:72px;left:20px;right:20px;flex-direction:column;
    background:rgba(7,12,28,.96);backdrop-filter:blur(16px);padding:14px;
    border:1px solid var(--line);border-radius:16px;gap:4px;
  }
  .burger{display:flex}
}
```

- [ ] **Step 8: Rewrite `src/app/layout.tsx`** (full shell — keep the font setup from Task 1)

```tsx
import type { Metadata } from "next";
import { Space_Grotesk, Sora, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/data/siteConfig";
import Background from "@/components/layout/Background";
import SiteInteractions from "@/components/layout/SiteInteractions";
import Navbar from "@/components/layout/Navbar";
import SocialRail from "@/components/layout/SocialRail";
import Footer from "@/components/layout/Footer";

const display = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"], variable: "--font-space-grotesk" });
const body = Sora({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"], variable: "--font-sora" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-jetbrains-mono" });

export const metadata: Metadata = {
  title: { default: `${siteConfig.name} — ${siteConfig.title}`, template: `%s | ${siteConfig.name}` },
  description: siteConfig.tagline,
  openGraph: { title: `${siteConfig.name} — ${siteConfig.title}`, description: siteConfig.tagline, type: "website" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">Skip to content</a>
        <Background />
        <SiteInteractions />
        <Navbar />
        <SocialRail />
        <main id="main-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Rewrite `src/app/page.tsx`** (design section order, no Testimonials)

```tsx
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Skills from "@/components/sections/Skills";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
    </>
  );
}
```

- [ ] **Step 10: Delete dead files and the `Testimonial` type**

```bash
rm src/components/layout/PageTransition.tsx src/components/layout/CustomCursor.tsx src/components/ui/ThemeToggle.tsx src/components/sections/Testimonials.tsx
```
Remove the `Testimonial` interface from `src/types/index.ts`.
Verify nothing references the removed names:
Run: `grep -rn "PageTransition\|CustomCursor\|ThemeToggle\|Testimonials\|Testimonial" src/`
Expected: no matches.

> The section components (`Hero`/`About`/`Skills`/`Projects`/`Experience`/`Contact`) are still their OLD implementations at this point — they compile and render (unstyled, since old CSS is gone) and get rewritten in Tasks 3–8. `Skills.tsx` still imports the `Skill` type (kept until Task 5).

- [ ] **Step 11: Verify**

Run: `npm run build`
Expected: success.
Run: `npm run dev` → open http://localhost:3000. Check: black canvas with drifting particle constellation + fog + grid behind content; custom dot+ring cursor follows mouse (desktop) and grows on hover over links; nav turns solid on scroll and highlights the active section; left social rail visible ≥1120px; mobile menu opens/closes under 860px. DevTools console: no errors. (Old sections look unstyled — expected.)

- [ ] **Step 12: Commit**

```bash
git add -A
git commit -m "feat(v2): layout shell — atmosphere, particles, cursor, magnetic/tilt, nav, social rail, footer"
```

---

### Task 3: Hero section

**Files:**
- Rewrite: `src/components/sections/Hero.tsx`

**Interfaces (Consumes):** `TechIcon`, `ArrowRightIcon`, `PaperPlaneIcon` from `ui/icons`; `/v2/avatar-portrait.png` (Task 1).

- [ ] **Step 1: Rewrite `src/components/sections/Hero.tsx`** (server component)

```tsx
import Image from "next/image";
import { TechIcon, ArrowRightIcon, PaperPlaneIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="hero sec-pad" id="home">
      <div className="wrap hero-grid">
        <div className="stage reveal">
          <div className="stage-glow" aria-hidden />
          <div className="ring r1" aria-hidden><span className="node" /></div>
          <div className="ring r2" aria-hidden><span className="node" /></div>
          <div className="ring r3" aria-hidden />
          <div className="platform" aria-hidden />
          <Image className="avatar-main" src="/v2/avatar-portrait.png" alt="Sachin Singh Shah" width={520} height={760} priority />
          <div className="chip c1" data-float><i><TechIcon name="react" /></i>React</div>
          <div className="chip c2" data-float><i><TechIcon name="nextjs" /></i>Next.js</div>
          <div className="chip c3" data-float><i style={{ background: "#3178C6" }}><b style={{ font: "700 11px var(--font-d)", color: "#fff" }}>TS</b></i>TypeScript</div>
          <div className="chip c4" data-float><i><TechIcon name="nodejs" /></i>Node.js</div>
          <div className="chip c5" data-float><i><TechIcon name="postgresql" /></i>PostgreSQL</div>
          <div className="chip c6" data-float><i><TechIcon name="prisma" /></i>Prisma</div>
        </div>

        <div className="hero-copy">
          <span className="kicker reveal"><span className="dot" />Full Stack Developer</span>
          <h1 className="reveal" data-d="1">Building Digital<br />Experiences That<br /><span className="alive">Feel Alive.</span></h1>
          <p className="lead reveal" data-d="2">I craft modern, scalable and interactive web experiences with React, Next.js &amp; Node — engineered for speed, built to feel alive.</p>
          <div className="hero-actions reveal" data-d="3">
            <a href="#projects" className="btn btn-primary" data-mag data-hot>View My Work <ArrowRightIcon /></a>
            <a href="#contact" className="btn btn-ghost" data-mag data-hot>Let&apos;s Connect <PaperPlaneIcon /></a>
          </div>
          <div className="scroll-cue reveal" data-d="4"><span className="mouse"><span /></span>Scroll to explore</div>
        </div>
      </div>
    </section>
  );
}
```

> `width`/`height` on `<Image>` are intrinsic hints only — the design rule `.avatar-main{height:100%;width:auto;object-fit:contain}` controls actual sizing. If the Task 1 fallback (`avatar.jpeg`) is in use, `object-fit:contain` still renders it cleanly on the stage.

- [ ] **Step 2: Verify**

Run: `npm run build` — success.
Dev check: hero is a two-column grid — avatar on a glowing platform with three rotating rings and six floating tech chips on the left, headline "Building Digital Experiences That Feel Alive." on the right; chips + avatar parallax to the cursor; `View My Work`/`Let's Connect` buttons are magnetic. Mobile (<980px): single column, chips c2/c5 hidden.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(v2): hero — avatar stage, orbital rings, floating tech chips, parallax"
```

---

### Task 4: About section

**Files:**
- Rewrite: `src/components/sections/About.tsx`
- Append: `src/app/globals.css` (code-line block fix)

**Interfaces (Consumes):** `CheckIcon`, `DownloadIcon`, `FeatureIcon` from `ui/icons`; `siteConfig.resumeUrl`.

- [ ] **Step 1: Append the code-line fix to `src/app/globals.css`**

The design's `.code .ln` spans are inline; they must stack as lines. Add:
```css
.code .ln{display:block}
```

- [ ] **Step 2: Rewrite `src/components/sections/About.tsx`** (server component)

```tsx
import { CheckIcon, DownloadIcon, FeatureIcon } from "@/components/ui/icons";
import { siteConfig } from "@/data/siteConfig";

const checks = [
  "Clean & scalable architecture",
  "40% faster load times via SSR & CDN",
  "Design-systems & reusable components",
  "CI/CD, Docker & cloud deployment",
];

const stats = [
  { count: 3, suffix: "+", label: "Years Experience" },
  { count: 25, suffix: "+", label: "Projects Completed" },
  { count: 15, suffix: "+", label: "Technologies" },
  { count: 100, suffix: "%", label: "Client Satisfaction" },
];

const features = [
  { icon: "pixel", label: "Pixel Perfect Design" },
  { icon: "perf", label: "Performance Optimized" },
  { icon: "mobile", label: "Mobile Responsive" },
  { icon: "anim", label: "Interactive Animations" },
  { icon: "arch", label: "Clean Code Architecture" },
  { icon: "best", label: "Best Practices" },
];

export default function About() {
  return (
    <section className="sec-pad" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-copy">
            <span className="kicker reveal"><span className="dot" />About Me</span>
            <h3 className="reveal" data-d="1" style={{ marginTop: 22 }}>Turning ideas into<br />living software.</h3>
            <p className="reveal" data-d="1">I&apos;m Sachin — a Software Engineer at 8om Internet building React/Next.js applications with SSR &amp; SSG. I love turning ideas into beautiful, interactive and performant web products that people actually enjoy using.</p>
            <div className="checks reveal" data-d="2">
              {checks.map((c) => (
                <div className="check" key={c}><i><CheckIcon /></i>{c}</div>
              ))}
            </div>
            <a href={siteConfig.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost reveal" data-d="3" data-mag data-hot>
              Download Resume <DownloadIcon />
            </a>
          </div>

          <div className="workstation reveal" data-d="2">
            <div className="ws-laptop">
              <div className="bar"><i /><i /><i /></div>
              <div className="code" id="codeBlock">
                <span className="ln"><span className="c-com">{"// shipping experiences that feel alive"}</span></span>
                <span className="ln"><span className="c-key">const</span> <span className="c-var">dev</span> = <span className="c-fn">createDeveloper</span>{"({"}</span>
                <span className="ln">{"  "}<span className="c-var">name</span>: <span className="c-str">{'"Sachin Singh Shah"'}</span>,</span>
                <span className="ln">{"  "}<span className="c-var">stack</span>: [<span className="c-str">{'"Next.js"'}</span>, <span className="c-str">{'"Node"'}</span>, <span className="c-str">{'"TS"'}</span>],</span>
                <span className="ln">{"  "}<span className="c-var">passion</span>: <span className="c-str">{'"building the web"'}</span>,</span>
                <span className="ln">{"});"}</span>
                <span className="ln" />
                <span className="ln"><span className="c-fn">dev</span>.<span className="c-fn">ship</span>(<span className="c-str">{'"something great"'}</span>);</span>
              </div>
            </div>
            <div className="ws-window w1 glass"><div className="v" data-count="40" data-suffix="%">0%</div><div className="l">faster loads</div></div>
            <div className="ws-window w2 glass"><div className="v" data-count="30" data-suffix="+">0+</div><div className="l">UI components</div></div>
          </div>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <div className="stat glass reveal" data-d={i === 0 ? undefined : String(i)} key={s.label}>
              <div className="num grad-text" data-count={s.count} data-suffix={s.suffix}>{`0${s.suffix}`}</div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="features">
          {features.map((f, i) => (
            <div className="feature glass reveal" data-d={i === 0 ? undefined : String(i)} key={f.label}>
              <div className="fi"><FeatureIcon name={f.icon} /></div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Verify**

Run: `npm run build` — success.
Dev check: editorial split — copy + check list + magnetic Resume button on the left; floating laptop with a typed code block (lines fade in line-by-line when scrolled into view) plus two glass stat windows on the right; below, a 4-up stats row whose numbers count up (3+/25+/15+/100%), then a 6-up feature chip grid.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(v2): about — workstation laptop, typed code, count-up stats, feature grid"
```

---

### Task 5: Skills galaxy

**Files:**
- Rewrite: `src/components/sections/Skills.tsx`
- Modify: `src/types/index.ts` (remove `Skill`)

**Interfaces (Consumes):** `skillPlanets`, `skillFallback` (Task 1); `TechIcon`; `/v2/avatar-core.png`.

- [ ] **Step 1: Rewrite `src/components/sections/Skills.tsx`** (server component)

```tsx
import Image from "next/image";
import type { CSSProperties } from "react";
import { TechIcon } from "@/components/ui/icons";
import { skillPlanets, skillFallback } from "@/data/skills";

export default function Skills() {
  return (
    <section className="sec-pad" id="skills">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal"><span className="dot" />My Skills</span>
          <h2 className="reveal" data-d="1">Technologies I <span className="grad-text">Work With</span></h2>
          <p className="reveal" data-d="2">A galaxy of tools I orbit daily to build modern, scalable and interactive applications.</p>
        </div>

        <div className="galaxy reveal" data-d="1">
          <div className="orbit o1" aria-hidden><span className="node" /></div>
          <div className="orbit o2" aria-hidden><span className="node" /></div>
          <div className="orbit o3" aria-hidden />
          <div className="galaxy-core">
            <Image src="/v2/avatar-core.png" alt="Sachin" fill sizes="260px" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
            <span className="core-label">SACHIN · CORE</span>
          </div>

          {[1, 2, 3].map((ring) => (
            <div className={`ringset rs${ring}`} key={ring} aria-hidden>
              {skillPlanets.filter((p) => p.ring === ring).map((p) => (
                <div className="planet" key={p.name} style={{ "--r": `${p.radius}px`, "--a": p.angle, "--dly": p.delay } as CSSProperties}>
                  <div className="spinner">
                    <div className="body">
                      <div className="ic" style={p.icon === "typescript" ? { background: "radial-gradient(circle at 34% 28%,#5b9bf0,#1f5bbf 70%)" } : undefined}>
                        {p.icon === "typescript"
                          ? <b style={{ font: "700 18px var(--font-d)", color: "#fff", position: "relative", zIndex: 1 }}>TS</b>
                          : <TechIcon name={p.icon} />}
                      </div>
                      <span className="nm">{p.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="skill-fallback">
          {skillFallback.map((s) => (<div className="ic glass" key={s}>{s}</div>))}
        </div>
      </div>
    </section>
  );
}
```

> `skillPlanets` defines the TypeScript planet with `icon: "typescript"`, which `TechIcon` does not provide — it is rendered as the special gradient "TS" sphere, exactly matching the design.

- [ ] **Step 2: Remove the `Skill` interface from `src/types/index.ts`**

Delete the `Skill` interface (now unused — `Skills.tsx` no longer imports it).
Run: `grep -rn "interface Skill\b\|: Skill\b\|Skill\[\]" src/`
Expected: no matches.

- [ ] **Step 3: Verify**

Run: `npm run build` — success.
Dev check (≥860px): central circular avatar core labelled "SACHIN · CORE", three orbit rings each carrying revolving spherical planets (inner: React/Next.js/TypeScript; mid: Node/PostgreSQL/Prisma/Tailwind; outer: MongoDB/Docker/AWS); planets stay upright and show their name on hover. Mobile (<860px): the orbit hides and the 3×3 glass fallback grid shows instead.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(v2): skills — orbital galaxy with revolving tech planets + mobile fallback"
```

---

### Task 6: Projects showcase

**Files:**
- Rewrite: `src/components/sections/Projects.tsx`
- Delete: `src/components/ui/ProjectModal.tsx`, `src/components/ui/TechBadge.tsx`

**Interfaces (Consumes):** `projects`, `projectShowcase` (Task 1); `ExternalLinkIcon`, `CodeIcon`; `/screenshots/<slug>.png` (existing).

- [ ] **Step 1: Rewrite `src/components/sections/Projects.tsx`** (server component)

```tsx
import Image from "next/image";
import { projects, projectShowcase } from "@/data/projects";
import { ExternalLinkIcon, CodeIcon } from "@/components/ui/icons";

export default function Projects() {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const featured = bySlug[projectShowcase.featuredSlug];
  const fMeta = projectShowcase.meta[projectShowcase.featuredSlug];

  return (
    <section className="sec-pad" id="projects">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal"><span className="dot" />My Work</span>
          <h2 className="reveal" data-d="1">Featured <span className="grad-text">Projects</span></h2>
          <p className="reveal" data-d="2">A collection of products that showcase my passion for building exceptional, real-world software.</p>
        </div>

        <div className="proj-featured glass reveal" style={{ padding: 40 }}>
          <div className="feat-info">
            <div className="pnum">01</div>
            <h3>{fMeta.display}</h3>
            <p>{fMeta.blurb}</p>
            <div className="tags">
              {fMeta.tags?.map((t) => (<span className="tag" key={t}>{t}</span>))}
            </div>
            <div className="feat-actions">
              <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-mag data-hot>Live Demo <ExternalLinkIcon /></a>
              {featured.githubUrl && (
                <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-mag data-hot>Code <CodeIcon /></a>
              )}
            </div>
          </div>
          <div className="laptop reveal" data-d="2">
            <div className="laptop-screen" data-tilt>
              <div className="bar"><i /><i /><i /></div>
              <div className="shot">
                <Image src={`/screenshots/${featured.slug}.png`} alt={featured.title} fill sizes="(max-width:980px) 90vw, 640px" style={{ objectFit: "cover", objectPosition: "top" }} />
              </div>
            </div>
            <div className="laptop-base" />
            <div className="laptop-glow" aria-hidden />
          </div>
        </div>

        <div className="proj-grid" style={{ marginTop: 24 }}>
          {projectShowcase.cardSlugs.map((slug, i) => {
            const p = bySlug[slug];
            const m = projectShowcase.meta[slug];
            return (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className="pcard glass reveal" data-d={i === 0 ? undefined : String(i)} data-tilt data-hot key={slug}>
                <span className="badge">{m.category}</span>
                <div className="shot">
                  <Image src={`/screenshots/${slug}.png`} alt={m.display} fill sizes="(max-width:980px) 90vw, 400px" style={{ objectFit: "cover", objectPosition: "top" }} />
                </div>
                <div className="meta"><h4>{m.display}</h4><span>{m.subtitle}</span></div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Delete replaced components**

```bash
rm src/components/ui/ProjectModal.tsx src/components/ui/TechBadge.tsx
```
Run: `grep -rn "ProjectModal\|TechBadge" src/`
Expected: no matches.

- [ ] **Step 3: Verify**

Run: `npm run build` — success.
Dev check: a featured glass card (LawlyAI) with stroked "01" index, blurb, tag pills, and Live Demo/Code buttons, beside a tilting laptop showing the Lawly screenshot; below, a 3-card grid (Chatify, Shah Properties, WebScrapingHQ) — each tilts to the cursor, lifts its border glow on hover, and links to the real `liveUrl`. Screenshots resolve from `/screenshots/<slug>.png`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(v2): projects — featured laptop + tilting card grid wired to real project data"
```

---

### Task 7: Experience path

**Files:**
- Rewrite: `src/components/sections/Experience.tsx`

**Interfaces (Consumes):** `experienceItems` (Task 1); `ExpIcon`.

- [ ] **Step 1: Rewrite `src/components/sections/Experience.tsx`** (server component)

```tsx
import { ExpIcon } from "@/components/ui/icons";
import { experienceItems } from "@/data/experience";

export default function Experience() {
  return (
    <section className="sec-pad" id="experience">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal"><span className="dot" />My Journey</span>
          <h2 className="reveal" data-d="1">The Path So <span className="grad-text">Far</span></h2>
          <p className="reveal" data-d="2">Every milestone, a new level unlocked on the way to building better software.</p>
        </div>

        <div className="path-wrap">
          <div className="path-line" aria-hidden />
          {experienceItems.map((it, i) => (
            <div className="milestone reveal" data-d={i === 0 ? undefined : String(i)} key={it.level}>
              <div className="ms-node">
                <ExpIcon name={it.icon} />
              </div>
              <span className="ms-level">{it.level}</span>
              <div className="glass">
                <div className="ms-date">{it.date}</div>
                <div className="ms-row"><h4>{it.role}</h4><span className="org">{it.org}</span></div>
                <p>{it.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify**

Run: `npm run build` — success.
Dev check: a vertical gradient path line with a downward-flowing light pulse; three milestone glass cards (LVL 03 → LVL 01), each with a glowing node icon, monospace date, serif role + org, and description; cards nudge right + glow on hover.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(v2): experience — game-level milestone path"
```

---

### Task 8: Contact section

**Files:**
- Rewrite: `src/components/sections/Contact.tsx` (client component)

**Interfaces (Consumes):** `siteConfig`; `MailIcon`, `GithubIcon`, `LinkedinIcon`, `XIcon`, `PhoneIcon`, `PaperPlaneIcon`.

- [ ] **Step 1: Rewrite `src/components/sections/Contact.tsx`**

```tsx
"use client";

import { useState } from "react";
import { siteConfig } from "@/data/siteConfig";
import { MailIcon, GithubIcon, LinkedinIcon, XIcon, PhoneIcon, PaperPlaneIcon } from "@/components/ui/icons";

export default function Contact() {
  const [note, setNote] = useState<{ text: string; error: boolean }>({ text: "", error: false });
  const [sending, setSending] = useState(false);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setNote({ text: "⚠ Please fill in name, email and message.", error: true });
      return;
    }
    setNote({ text: "◆ Transmitting message...", error: false });
    setSending(true);
    setTimeout(() => {
      setNote({ text: "✓ Message sent! I'll get back to you soon.", error: false });
      setSending(false);
      form.reset();
    }, 1300);
  };

  return (
    <section className="sec-pad" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="kicker reveal"><span className="dot" />Get In Touch</span>
            <div className="globe-wrap reveal" data-d="1" style={{ marginTop: 30, justifyContent: "flex-start" }} aria-hidden>
              <div className="globe">
                <div className="g-globe" />
                <div className="g-sweep" />
                <span className="blip b1" /><span className="blip b2" /><span className="blip b3" />
                <div className="g-core" />
              </div>
              <div className="g-orbit oa" /><div className="g-orbit ob" />
              <div className="g-sat sa"><div className="rot"><i /></div></div>
              <div className="g-sat sb"><div className="rot"><i /></div></div>
            </div>
            <h3 className="reveal" data-d="1">Let&apos;s Build<br />Something Great.</h3>
            <p className="reveal" data-d="2">Have a project in mind, or just want to say hi? My inbox is always open — let&apos;s create something that feels alive.</p>
            <div className="contact-list reveal" data-d="2">
              <a className="citem glass" href={`mailto:${siteConfig.email}`} data-hot>
                <div className="ci"><MailIcon /></div>
                <div className="ct"><div className="k">Email</div><div className="v">{siteConfig.email}</div></div>
              </a>
              <a className="citem glass" href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-hot>
                <div className="ci"><GithubIcon /></div>
                <div className="ct"><div className="k">GitHub</div><div className="v">github.com/sachinsinghshah</div></div>
              </a>
              <div className="citem glass">
                <div className="ci"><PhoneIcon /></div>
                <div className="ct"><div className="k">Location</div><div className="v">India · Open to Relocate</div></div>
              </div>
            </div>
          </div>

          <form className="form glass reveal" data-d="1" id="contactForm" noValidate onSubmit={onSubmit}>
            <div className="row">
              <div className="field"><label htmlFor="cf-name">Your Name</label><input id="cf-name" type="text" name="name" placeholder="Jane Doe" required /></div>
              <div className="field"><label htmlFor="cf-email">Your Email</label><input id="cf-email" type="email" name="email" placeholder="jane@company.com" required /></div>
            </div>
            <div className="field"><label htmlFor="cf-subject">Subject</label><input id="cf-subject" type="text" name="subject" placeholder="Let's work together" /></div>
            <div className="field"><label htmlFor="cf-msg">Message</label><textarea id="cf-msg" name="message" placeholder="Tell me about your project..." required /></div>
            <button type="submit" className="btn btn-primary" data-mag data-hot disabled={sending}>Send Message <PaperPlaneIcon /></button>
            <div className="form-note" id="formNote" style={{ color: note.error ? "#ff6b8a" : "var(--cyan)" }}>{note.text}</div>
          </form>
        </div>

        <div className="dock-glow" aria-hidden />
        <div className="dock">
          <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="GitHub"><GithubIcon /></a>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="LinkedIn"><LinkedinIcon /></a>
          <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="X"><XIcon /></a>
          <a href={`mailto:${siteConfig.email}`} data-mag data-hot aria-label="Email"><MailIcon /></a>
        </div>
      </div>
    </section>
  );
}
```

> The contact form is front-end only (mirrors the design's fake "transmit"); there is no backend. A real email integration is out of scope for this redesign.

- [ ] **Step 2: Verify**

Run: `npm run build` — success.
Dev check: left column has the holographic radar globe (rotating meridians, sweeping beam, pinging blips, tilted satellite orbits), headline, and a contact list (Email + GitHub links, Location info); right column is the glass form. Submitting with a missing field shows the red warning; a valid submit shows "Transmitting…" then the success note and resets. Social dock centered below.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "feat(v2): contact — radar globe, contact list, validated form, social dock"
```

---

### Task 9: Cleanup, no-JS safety, README

**Files:**
- Delete: `src/components/ui/SectionHeading.tsx` (if unused)
- Modify: `src/app/layout.tsx` (noscript reveal fallback)
- Modify: `README.md`
- Optional: `package.json` (drop unused deps)

- [ ] **Step 1: Remove now-dead UI helper**

Run: `grep -rn "SectionHeading" src/`
If no non-definition matches, delete it: `rm src/components/ui/SectionHeading.tsx`

- [ ] **Step 2: No-JS reveal fallback in `src/app/layout.tsx`**

The `.reveal` elements start at `opacity:0` and are revealed by `SiteInteractions`. Add a `<noscript>` inside `<head>`-equivalent so content is visible if JS fails. Add this as the first child of `<body>` (before the skip link):

```tsx
<noscript>
  <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
</noscript>
```

- [ ] **Step 3: Drop unused dependencies (optional)**

Run: `grep -rn "motion/react\|from \"motion\"\|lucide-react" src/`
Expected: no matches (the port uses neither). If clean:
```bash
npm uninstall motion lucide-react
```
If anything still imports them, skip this step.

- [ ] **Step 4: Update `README.md`** (replace the whole file)

```markdown
# Sachin Singh Shah — Developer Portfolio

A single-page, dark "holographic" developer portfolio built with Next.js 16, TypeScript, and Tailwind CSS v4 — neon glassmorphism, an avatar 3D stage, an orbiting skills galaxy, a glass project showcase, a game-level experience path, and a radar contact globe.

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `next` | 16.1.6 | App Router, Image optimisation, SSG |
| `react` / `react-dom` | 19.2.3 | UI rendering |
| `tailwindcss` | ^4 | Preflight + utilities (design system lives in `globals.css`) |
| `next/font` | — | Space Grotesk (display), Sora (body), JetBrains Mono (mono) |

## Getting Started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm run start
npm run test:e2e # Playwright smoke tests
```

## Structure

```
src/
├── app/                layout.tsx · page.tsx · globals.css (full design system)
├── components/
│   ├── layout/         Background, SiteInteractions, Navbar, SocialRail, Footer
│   ├── sections/       Hero, About, Skills, Projects, Experience, Contact
│   └── ui/             icons.tsx (all inline SVGs)
├── data/               siteConfig.ts · projects.ts (+ projectShowcase) · skills.ts · experience.ts
├── lib/                utils.ts
└── types/              index.ts
```

- **Design system & all animations:** `src/app/globals.css` (ported from the approved design archived in `docs/design-reference/v2/`).
- **Global interactions** (particle constellation, custom cursor, magnetic buttons, 3D tilt, scroll-reveal, count-ups, hero parallax): `src/components/layout/SiteInteractions.tsx`.
- **Content:** edit `src/data/*`. Project screenshots live in `public/screenshots/<slug>.png`; avatars in `public/v2/`.
- Dark only. Respects `prefers-reduced-motion`. The contact form is front-end only (no backend).

## Deployment

Push to GitHub and import on Vercel — Next.js is auto-detected, no config needed.
```

- [ ] **Step 5: Verify**

Run: `npm run build` — success.
Run: `grep -rn "PageTransition\|ThemeToggle\|Testimonial\|ProjectModal\|TechBadge\|SectionHeading" src/` — expected: no matches.
Dev check: full page top-to-bottom matches `docs/design-reference/v2/index.html`; resize through 1120 / 980 / 860 / 560 breakpoints; toggle OS reduced-motion and confirm animations stop and all content is visible.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "chore(v2): cleanup dead components, no-JS reveal fallback, refresh README"
```

---

### Task 10: Playwright smoke tests

**Files:**
- Modify: `package.json` (devDeps + `test:e2e` script)
- Create: `playwright.config.ts`
- Create: `e2e/smoke.spec.ts`

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test
npx playwright install chromium
```

- [ ] **Step 2: Add the test script to `package.json`**

Add to `"scripts"`: `"test:e2e": "playwright test"`.

- [ ] **Step 3: Create `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  retries: 0,
  use: { baseURL: "http://localhost:3000", trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    timeout: 120_000,
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 4: Create `e2e/smoke.spec.ts`**

```ts
import { test, expect } from "@playwright/test";

const SECTIONS = ["home", "about", "skills", "projects", "experience", "contact"];

test("every section renders and there are no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/");
  for (const id of SECTIONS) {
    await expect(page.locator(`#${id}`)).toBeAttached();
  }
  await expect(page.locator("#projects .pcard")).toHaveCount(3);
  expect(errors, errors.join("\n")).toEqual([]);
});

test("nav anchor scrolls to a section", async ({ page }) => {
  await page.goto("/");
  await page.locator('.nav-links a[href="#projects"]').click();
  await expect(page).toHaveURL(/#projects$/);
  await expect(page.locator("#projects")).toBeInViewport();
});

test("mobile menu toggles", async ({ page }) => {
  await page.setViewportSize({ width: 414, height: 896 });
  await page.goto("/");
  await expect(page.locator("#navLinks")).toBeHidden();
  await page.locator("#burger").click();
  await expect(page.locator("#navLinks")).toBeVisible();
});

test("contact form shows the success note on valid submit", async ({ page }) => {
  await page.goto("/");
  await page.fill('#contactForm input[name="name"]', "Jane Doe");
  await page.fill('#contactForm input[name="email"]', "jane@company.com");
  await page.fill('#contactForm textarea[name="message"]', "Hello there!");
  await page.locator('#contactForm button[type="submit"]').click();
  await expect(page.locator("#formNote")).toContainText("Message sent", { timeout: 4000 });
});

test("invalid submit shows a validation warning", async ({ page }) => {
  await page.goto("/");
  await page.locator('#contactForm button[type="submit"]').click();
  await expect(page.locator("#formNote")).toContainText("Please fill in");
});
```

- [ ] **Step 5: Run the tests**

Run: `npm run test:e2e`
Expected: all specs pass. (If `#navLinks` visibility assertions flake, confirm the Task 2 responsive-nav CSS is present in `globals.css`.)

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "test(v2): playwright smoke tests — sections, nav, mobile menu, contact form"
```

---

## Plan Self-Review

- **Spec coverage:** Every section of `docs/design-reference/v2/index.html` maps to a task — atmosphere/cursor/nav/rail/footer (Task 2), Hero (3), About (4), Skills (5), Projects (6), Experience (7), Contact (8). Every block in `styles.css` + `sections.css` ships via the `globals.css` copy (Task 1). Every behavior in `script.js` ships via `SiteInteractions` (Task 2) except nav (Task 2 Navbar) and the form (Task 8). The `tweaks.*` panel is intentionally out of scope (documented).
- **Build-green ordering:** Type removals lag their consumers — `Testimonial` removed in Task 2 (with `Testimonials.tsx`), `Skill` in Task 5 (with `Skills.tsx` rewrite). Deleted components are removed only once nothing imports them, each guarded by a `grep`.
- **Type consistency:** `SkillPlanet`/`ExperienceItem`/`ProjectCardMeta` defined in Task 1 are consumed with matching field names in Tasks 5/7/6; `skillPlanets`, `skillFallback`, `experienceItems`, `projectShowcase` names match between data and components; icon-map exports in Task 2 (`TechIcon`, `FeatureIcon`, `ExpIcon`, and the named icons) match every consumer import.
- **Known non-blocking notes:** contact form is front-end only; if an avatar asset exceeds the 256 KiB design-API read cap, the documented `/avatar.jpeg` fallback keeps the build green and the page complete.

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-06-20-holographic-portfolio-v2.md`. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task with review between tasks. Fast iteration, clean context per task.
2. **Inline Execution** — execute the tasks in this session using `superpowers:executing-plans`, with build/dev checkpoints for review.

Which approach?
