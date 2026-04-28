import {
  BookOpen,
  Bot,
  Briefcase,
  FlaskConical,
  LayoutDashboard,
  type LucideIcon,
  Mail,
  Mic,
  ShieldAlert,
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
    icon: Bot,
    name: "Agents",
    href: "/agents",
    description: "Trigger Hunter, Coach, and the rest of your AI workforce",
  },
  {
    icon: Briefcase,
    name: "Deals",
    href: "/deals",
    description: "Pipeline with health scoring",
  },
  {
    icon: Mic,
    name: "Role Play",
    href: "/roleplay",
    description: "Live reps against an AI buyer — text or voice",
  },
  {
    icon: Mail,
    name: "Email Generator",
    href: "/email-generator",
    description: "Full 6-touch LADDER sequence",
  },
  {
    icon: FlaskConical,
    name: "A/B Testing",
    href: "/ab-testing",
    description: "One variable per test, with significance checks",
  },
  {
    icon: ShieldAlert,
    name: "Objection Lab",
    href: "/objection-lab",
    description: "Log, analyze, and role-play objections",
  },
  {
    icon: BookOpen,
    name: "Playbook",
    href: "/playbook",
    description: "Objection handling library",
  },
];
