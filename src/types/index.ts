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
