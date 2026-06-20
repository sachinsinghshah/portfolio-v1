import { SkillPlanet } from "@/types";

export const skillPlanets: SkillPlanet[] = [
  // inner ring (rs1, r=200)
  { name: "React", icon: "react", ring: 1, angle: "-58deg", radius: 200, delay: "0s" },
  { name: "Next.js", icon: "nextjs", ring: 1, angle: "66deg", radius: 200, delay: ".5s" },
  { name: "TypeScript", icon: "typescript", ring: 1, angle: "192deg", radius: 200, delay: "1s" },
  // mid ring (rs2, r=310)
  { name: "Node.js", icon: "nodejs", ring: 2, angle: "-22deg", radius: 310, delay: ".2s" },
  { name: "PostgreSQL", icon: "postgresql", ring: 2, angle: "58deg", radius: 310, delay: ".7s" },
  { name: "Prisma", icon: "prisma", ring: 2, angle: "160deg", radius: 310, delay: "1.2s" },
  { name: "Tailwind", icon: "tailwind", ring: 2, angle: "238deg", radius: 310, delay: ".9s" },
  // outer ring (rs3, r=420)
  { name: "MongoDB", icon: "mongodb", ring: 3, angle: "18deg", radius: 420, delay: ".4s" },
  { name: "Docker", icon: "docker", ring: 3, angle: "146deg", radius: 420, delay: "1.1s" },
  { name: "AWS", icon: "aws", ring: 3, angle: "302deg", radius: 420, delay: ".6s" },
];

export const skillFallback: string[] = [
  "React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Prisma", "Tailwind", "MongoDB", "Docker",
];
