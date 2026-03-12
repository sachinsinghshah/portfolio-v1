import { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "webscrapinghq",
    title: "WebscrapingHQ",
    tagline: "Production-grade AI web scraping API platform & SaaS dashboard",
    description:
      "WebscrapingHQ is a production AI-powered web scraping platform I built and maintain as part of my work at 8om Internet. It consists of two tightly coupled systems: a high-throughput scraping API capable of extracting structured data from complex, JavaScript-heavy websites using browser automation — and a polished SaaS marketing site with an authenticated client dashboard where users submit jobs, monitor status in real time, and download results. The platform handles anti-bot fingerprinting, rate limiting, and distributed job queuing at scale.",
    problem:
      "Clients needed reliable structured data extraction from dynamic, heavily guarded websites — the kind that block naive scrapers within seconds. On top of that, they needed a self-serve dashboard to submit jobs, track progress, and pull results without engineering involvement on every request.",
    solution:
      "Built Python-based scraping pipelines using Playwright with custom anti-bot evasion, wrapped in a secure Node.js REST API with JWT auth, rate limiting, and per-consumer request validation. The Next.js client dashboard integrates in real time with the API for live job monitoring. The SaaS website was built with Astro for blazing-fast static delivery and SEO performance.",
    result:
      "Live in production at webscrapinghq.com — the platform reliably serves multiple enterprise clients with high job success rates and zero downtime deployments via Docker and cloud infrastructure.",
    techStack: [
      "Python",
      "Playwright",
      "Node.js",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Docker",
      "AWS",
      "Astro",
      "Tailwind CSS",
    ],
    features: [
      "Python scraping pipelines with browser automation and anti-bot handling",
      "Secure REST API with JWT auth, rate limiting & request validation",
      "Real-time job monitoring dashboard for clients",
      "SEO-optimised Astro marketing site with authenticated client portal",
    ],
    liveUrl: "https://www.webscrapinghq.com/",
    githubUrl: "",
    gradient: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
    year: 2024,
  },
  {
    id: "2",
    slug: "lawly-ai-saas",
    title: "Lawly AI",
    tagline: "AI-powered legal compliance & contract generation SaaS",
    description:
      "Lawly AI is an enterprise-grade SaaS platform that automates legal compliance, contract creation, and regulatory deadline tracking for businesses operating in India. Powered by GPT-4, it lets teams generate legally sound contracts in minutes, track GST, income tax, labour law, and data protection deadlines from a single dashboard, and get instant answers from an AI legal assistant — without needing a lawyer on retainer for routine tasks.",
    problem:
      "Small and mid-sized businesses in India were drowning in compliance obligations spread across multiple regulators — GST filings, labour law notices, data protection requirements — with no centralised way to track deadlines or generate standard contracts quickly. Missing a deadline meant penalties; hiring a lawyer for every routine document was expensive.",
    solution:
      "Lawly AI centralises every compliance obligation into a single calendar with multi-channel notifications (email, SMS, WhatsApp via Twilio/SendGrid). The GPT-4-powered contract generator produces jurisdiction-aware documents from plain-language inputs, while the AI Legal Assistant answers compliance questions in real time. Role-based access and Row-Level Security in Supabase ensure enterprise data isolation.",
    result:
      "Deployed on Vercel with Stripe and Razorpay payment integration, the platform is live and actively used, reducing routine legal document turnaround from days to under 5 minutes.",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Supabase",
      "OpenAI GPT-4",
      "Stripe",
      "Razorpay",
      "SendGrid",
      "Twilio",
      "Tailwind CSS",
      "Vercel",
    ],
    features: [
      "GPT-4 powered contract generator with jurisdiction-aware output",
      "Compliance calendar with email, SMS & WhatsApp deadline alerts",
      "Real-time AI Legal Assistant for GST, labour law & data protection queries",
      "Compliance scoring dashboard across multiple regulatory categories",
    ],
    liveUrl: "https://lawly-ai-saas.vercel.app",
    githubUrl: "https://github.com/sachinsinghshah/lawly-ai-saas",
    gradient: "linear-gradient(135deg, #1a1a2e 0%, #4f46e5 60%, #818cf8 100%)",
    year: 2025,
  },
  {
    id: "3",
    slug: "shah-properties",
    title: "Shah Properties",
    tagline: "Modern real estate platform for premium Dehradun properties",
    description:
      "Shah Properties is a production real estate listing website for a property business in Dehradun, Uttarakhand. It presents residential plots and properties across multiple localities with professional area-based photography, Indian pricing conventions (₹ in lakhs/crores), and dual measurement units (square yards and square feet). Buyers can browse by location, explore image galleries, and reach out directly through an integrated SMTP contact form.",
    problem:
      "Property buyers in Dehradun had no reliable, well-organised digital presence to explore listings from this agency — enquiries came in through word of mouth, making it hard to showcase inventory, share consistent photographs, or capture leads efficiently.",
    solution:
      "Built a Next.js 15 site with area-based property organisation so every locality (Kalyanpur, Pondha, Vikas Nagar, Dholas) has its own curated gallery. Nodemailer handles contact form submissions directly to the business inbox. Structured data and SEO metadata ensure the listings surface in local searches.",
    result:
      "Live at shahproperties.8bitcode.in, the site currently showcases 7+ listings totalling ₹1.56+ Crores, with Kalyanpur fully photographed and additional areas being onboarded.",
    techStack: [
      "Next.js 15",
      "TypeScript",
      "Tailwind CSS",
      "Nodemailer",
      "React Icons",
      "Vercel",
    ],
    features: [
      "Location-based property filtering across Dehradun areas",
      "Interactive image carousel gallery per listing",
      "Indian pricing format with ₹ in lakhs/crores",
      "SMTP-integrated contact form for lead capture",
    ],
    liveUrl: "https://shah-properties.vercel.app/",
    githubUrl: "https://github.com/sachinsinghshah/shah-properties",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
    year: 2025,
  },
  {
    id: "4",
    slug: "chat-app-v1",
    title: "Chat App",
    tagline: "Real-time MERN chat application with Socket.IO",
    description:
      "A full-stack real-time chat application built on the MERN stack. Users sign up, authenticate via JWT, and exchange messages that are delivered instantly across all connected clients through a persistent Socket.IO connection. The interface is built with React, Zustand for global state, and styled with Tailwind CSS and DaisyUI. Protected routes ensure only authenticated users access conversations, and toast notifications keep users informed of activity without interrupting the chat flow.",
    problem:
      "Building a chat application that feels genuinely real-time — no polling, no page refreshes, instant delivery — while also handling authentication securely and keeping the codebase clean enough to extend is surprisingly non-trivial with a standard REST-only approach.",
    solution:
      "Replaced HTTP polling with a bidirectional Socket.IO connection for instant message delivery. JWT tokens stored in HTTP-only cookies secure the auth layer without exposing credentials to client-side scripts. Zustand manages socket state and conversation data globally, keeping components lean and the data flow predictable.",
    result:
      "A working, deployable chat application demonstrating real-time full-stack architecture — the foundation for scaling to multi-room, group chat, or WebRTC-based features.",
    techStack: [
      "React",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Socket.IO",
      "JWT",
      "Zustand",
      "Tailwind CSS",
      "DaisyUI",
      "Vite",
    ],
    features: [
      "Instant message delivery via persistent Socket.IO connection",
      "JWT authentication with protected routes",
      "Zustand-powered global state for conversations and socket",
      "Toast notifications for real-time activity feedback",
    ],
    liveUrl: "https://chat-app-v1-prod.onrender.com/login",
    githubUrl: "https://github.com/sachinsinghshah/chat-app-v1",
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    year: 2024,
  },
];
