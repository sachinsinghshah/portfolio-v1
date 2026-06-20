export interface Project {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  problem: string;
  solution: string;
  result: string;
  techStack: string[];
  features: string[];
  liveUrl: string;
  githubUrl: string;
  gradient: string;
  year: number;
}

export interface ProjectCardMeta {
  display: string;
  category: string;
  subtitle: string;
  blurb?: string;
  tags?: string[];
}

export interface SkillPlanet {
  name: string;
  icon: string;
  ring: 1 | 2 | 3;
  angle: string;
  radius: number;
  delay: string;
}

export interface ExperienceItem {
  level: string;
  icon: string;
  date: string;
  role: string;
  org: string;
  description: string;
}

export interface Skill {
  name: string;
  category: 'frontend' | 'backend' | 'tools' | 'database' | 'cloud' | 'design';
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  description: string;
  bullets: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatarInitials: string;
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
