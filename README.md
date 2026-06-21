# Sachin Singh Shah — Developer Portfolio

A single-page, dark "holographic" developer portfolio built with Next.js 16, TypeScript, and Tailwind CSS v4 — neon glassmorphism, an avatar orbital stage, an orbiting skills galaxy, a glass project showcase, a game-level experience path, and a radar contact globe.

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
npm run dev        # http://localhost:3000
npm run build && npm run start
npm run test:e2e   # Playwright smoke tests
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

- **Design system & all animations:** `src/app/globals.css` — ported from the approved design archived in `docs/design-reference/v2/`.
- **Global interactions** (particle constellation, custom cursor, magnetic buttons, 3D tilt, scroll-reveal, count-ups, hero parallax): `src/components/layout/SiteInteractions.tsx`.
- **Content:** edit `src/data/*`. Project screenshots live in `public/screenshots/<slug>.png`; avatars in `public/v2/`.
- Dark only. Respects `prefers-reduced-motion`. The contact form is front-end only (no backend).

## Avatar note

The hero/galaxy avatars live in `public/v2/` as transparent-cutout PNGs
(`avatar-portrait.png`, `avatar-core.png`). The hero (`.avatar-main`) renders the cutout
floating inside the orbital rings (`object-fit:contain` + drop-shadow); the galaxy core crops
its image into the circular core (`object-fit:cover`). Swap the files in place to change the
photo — keep them as transparent cutouts so the hero figure reads against the background.

## Deployment

Push to GitHub and import on Vercel — Next.js is auto-detected, no config needed.
