import type { ReactElement } from "react";

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

/* ---------- Tech logos (galaxy + hero chips) ---------- */
const TECH: Record<string, ReactElement> = {
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
const FEATURE: Record<string, ReactElement> = {
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
const EXP: Record<string, ReactElement> = {
  layers: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>),
  brackets: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m8 6-6 6 6 6M16 6l6 6-6 6"/></svg>),
  cap: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1 2.7 3 6 3s6-2 6-3v-5"/></svg>),
};
export function ExpIcon({ name }: { name: string }) {
  return EXP[name] ?? null;
}
