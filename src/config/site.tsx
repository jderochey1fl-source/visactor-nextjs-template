import {
  BookOpen,
  Briefcase,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Sparkles,
  Telescope,
} from "lucide-react";

export type SiteConfig = typeof siteConfig;
export type Navigation = {
  icon: LucideIcon;
  name: string;
  href: string;
  description?: string;
};

export const siteConfig = {
  title: "ASCEND — LADDER Sales OS",
  description:
    "The operating system for roofing sales teams running the LADDER framework.",
  brand: {
    name: "ASCEND",
    tagline: "LADDER Sales OS",
  },
};

export const navigations: Navigation[] = [
  {
    icon: LayoutDashboard,
    name: "Command Center",
    href: "/",
    description: "KPIs, funnel, and today's priorities",
  },
  {
    icon: Telescope,
    name: "Research",
    href: "/research",
    description: "Pre-call intelligence in 60 seconds",
  },
  {
    icon: Briefcase,
    name: "Deals",
    href: "/deals",
    description: "Pipeline with health scoring",
  },
  {
    icon: Sparkles,
    name: "Agent",
    href: "/agent",
    description: "Your AI sales coach",
  },
  {
    icon: Mail,
    name: "Email Generator",
    href: "/email-generator",
    description: "Full 6-touch LADDER sequence",
  },
  {
    icon: BookOpen,
    name: "Playbook",
    href: "/playbook",
    description: "Objection handling library",
  },
];
