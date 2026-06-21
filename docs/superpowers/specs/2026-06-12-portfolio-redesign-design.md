# Portfolio Redesign — "The Dark Workshop"

**Date:** 2026-06-12
**Status:** Approved by user (experience + technical sections)

## Goal

Transform the existing portfolio (functional but generic, inline-styled, "vibe coded") into a distinctive, interactive site with real 3D graphics that reads as the portfolio of an advanced developer. Everything in service of credibility: no fake content, no decoration without purpose.

## Design Direction

**The Dark Workshop** — fusion of "Engineering Terminal" (brutalist tech) and "Gallery Minimal" (editorial refinement), chosen by the user from visual mockups.

### Design tokens

- Canvas: near-black ink `#0b0c0e`
- Text: paper-white `#e8e6df`, secondary `#8a8f98`, muted `#566` range
- Accent: mint glow `#52f2a8`
- Background: subtle blueprint grid (1px lines, ~48px cells, ~3% white)
- Type: serif display for headlines (e.g. Instrument Serif via `next/font`), JetBrains Mono for technical labels, Inter for body
- Motifs: engineering-drawing annotations (`fig. 01`, measurement marks, section counters `001/006`), monospace micro-labels, corner brackets
- **No theme toggle** — dark only, fully committed. Remove existing light theme + ThemeToggle.

### Global experience

- Lenis smooth scrolling
- Crosshair-style custom cursor (desktop only; disabled on touch)
- One fixed full-viewport WebGL canvas behind the page renders all 3D
- motion (already installed) for 2D entrance/scroll animations

## Page Structure (top to bottom)

1. **Nav** — `SSS.DEV` wordmark, five numbered anchor links (01 ABOUT, 02 WORK, 03 SKILLS, 04 LOG, 05 CONTACT — the GitHub section is reached by scroll, not nav), live status readout: `● IST <time> — OPEN TO WORK`. The scroll counter (`001/006`) counts all six full sections from Hero to Contact and is independent of the nav numbering.
2. **Hero** — huge serif name, monospace kicker ("FULL-STACK ENGINEER — BUILDING PRODUCTION SYSTEMS SINCE 2023"), signature 3D piece: glowing wireframe structure (orbiting rings, lattice core, drifting particles) reacting to cursor and scroll, with floating engineering callout labels. Section counter + scroll hint at bottom.
3. **About** — editorial split. Headline: "Understand the problem deeply. *Then write the code.*" Existing three paragraphs kept. Photo framed with blueprint corner marks and annotations. Resume download as monospace link. Tech ticker kept, restyled monospace.
4. **Projects ("Selected Work")** — the centerpiece. Full-width case-study rows (not cards) with large index numbers. Active/hovered row expands showing live screenshot in a 3D-tilting frame following the cursor. Click opens a full-screen case-study overlay (problem / solution / result / stack — existing content from `data/projects.ts`). Outcome metrics lead each row.
5. **Skills ("The Constellation")** — real 3D node graph: skills as glowing nodes connected within domains (frontend / backend / data / infra). Drag to rotate, hover highlights connections. Monospace domain list beside it for scanability (this list is the accessible/mobile-first representation).
6. **Experience ("The Log")** — changelog aesthetic: monospace dates, serif roles, entries expand on click to reveal bullets with stagger. Existing content kept.
7. **GitHub ("Proof of Work")** — replaces Testimonials (current testimonials are not real → deleted). Real contribution data rendered as a 3D extruded terrain (bar height = commit count), subtle rotation on scroll, plus stats (commits, repos, top languages).
8. **Contact ("Transmit")** — big serif CTA "Let's build something real.", email link, social links, wireframe globe with glowing marker on Dehradun (30.3°N 78.0°E). Footer meta line.

## Technical Architecture

### Dependencies (new)

`three`, `@react-three/fiber`, `@react-three/drei`, `lenis`. Everything else stays: Next.js 16, React 19, Tailwind 4, motion, lucide-react.

### Structure

```
src/
├── app/
│   ├── layout.tsx          — next/font setup (serif, mono, sans), providers
│   ├── page.tsx            — section composition (server component)
│   └── api/github/route.ts — GitHub contributions proxy (revalidate: 24h)
├── components/
│   ├── three/
│   │   ├── SceneCanvas.tsx        — the ONE fixed <Canvas>, lazy-loaded, drei <View> root
│   │   ├── HeroStructure.tsx      — wireframe lattice + rings + particles
│   │   ├── SkillConstellation.tsx — 3D node graph
│   │   ├── ContributionTerrain.tsx— extruded GitHub graph
│   │   └── ContactGlobe.tsx       — wireframe globe + Dehradun marker
│   ├── sections/  — Hero, About, Projects, Skills, Experience, GitHubActivity, Contact (rewritten)
│   ├── layout/    — Navbar, Footer, CustomCursor (crosshair), SmoothScroll (Lenis)
│   └── ui/        — CaseStudyOverlay, SectionLabel, etc.
└── data/          — projects.ts & siteConfig.ts kept; testimonials deleted
```

### Key decisions

- **One canvas, multiple views**: drei `<View>` tracks DOM placeholder divs per section; scissor-rect rendering means off-screen 3D costs ~nothing. Single WebGL context avoids mobile context-loss issues.
- **Styling migration**: replace all inline `style={{}}` objects with Tailwind v4 classes + CSS custom properties for tokens. This is the single biggest de-"vibe-coding" change.
- **GitHub data**: server route calls GitHub GraphQL contributions API using `GITHUB_TOKEN` env var, cached 24h. Fallback: bundled static snapshot of contribution data if the API fails or token missing — the section must never render broken/empty.

### Performance & resilience

- 3D bundle lazy-loaded via `next/dynamic`; static gradient placeholder until loaded; page interactive before three.js arrives
- `prefers-reduced-motion` → no animation loop; static rendered frame
- No WebGL2 / low device memory → simplified scenes (fewer particles, no postprocessing)
- DPR capped at 2; no shadow maps; glow via additive blending (no bloom postprocessing pass)
- Target: 60fps on mid-range hardware, Lighthouse performance 90+

### Accessibility

- All 3D is decorative: `aria-hidden`, real content in semantic HTML
- Skill constellation's data also present as the text list; contribution terrain accompanied by text stats
- Keyboard navigation and visible focus states preserved; custom cursor and hover-tilt disabled on touch devices

## Out of Scope

- Light theme / theme toggle (removed)
- New written content (existing copy in `data/` is kept, lightly retouched to fit new layout)
- Blog, CMS, multi-page routing — stays a single page
- Re-capturing project screenshots (optional follow-up; existing ones work)

## Verification

- `npm run build` passes with zero type errors
- Playwright smoke tests: every section renders; case-study overlay opens/closes; GitHub section renders with fallback data when API unavailable
- Manual: cursor interactivity, scroll behavior, mobile layout, reduced-motion mode
- Lighthouse run at the end (target 90+ performance)

## Assets

No new assets required. Existing `public/screenshots/*`, `avatar.jpeg`, `resume.pdf` are reused. `GITHUB_TOKEN` env var needed for live GitHub data (works without it via fallback).
