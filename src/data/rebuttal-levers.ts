import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Calendar,
  Clock,
  Megaphone,
  MessageCircleQuestion,
  Shield,
} from "lucide-react";

export type RebuttalLeverKey =
  | "their-timeline"
  | "implementation-reality"
  | "external-event"
  | "confidence-question"
  | "transparent-counter";

export type RebuttalLever = {
  key: RebuttalLeverKey;
  name: string;
  tagline: string;
  description: string;
  example: string;
  icon: LucideIcon;
  colorClass: string;
};

export const REBUTTAL_LEVERS: RebuttalLever[] = [
  {
    key: "their-timeline",
    name: "Their Timeline",
    tagline: "The prospect's own calendar",
    description:
      "The most powerful urgency comes from a deadline the prospect already told you about. No artificial pressure — you're just doing the math on their clock.",
    example:
      "You mentioned Q3 hiring is when this becomes critical — that's 6 weeks away. If we start onboarding this week you're in place before the ramp.",
    icon: Calendar,
    colorClass: "text-primary",
  },
  {
    key: "implementation-reality",
    name: "Implementation Reality",
    tagline: "Honest dates, real downstream impact",
    description:
      "Map signing date to go-live date. Make the cost of delay concrete. Never fake a deadline — sophisticated buyers see through it and it destroys trust.",
    example:
      "Average implementation is 3 weeks. Sign this week, you're live on [date]. Push to next month, that date moves to [date].",
    icon: Clock,
    colorClass: "text-amber-500",
  },
  {
    key: "external-event",
    name: "External Event",
    tagline: "Only if the event is real",
    description:
      "Pricing changes, cohort start dates, onboarding availability, material cost increases. Use them only when they are actually scheduled and documented.",
    example:
      "Manufacturer is pushing through a 6% price increase on this shingle line April 1. Lock pricing this week and that change doesn't apply to your job.",
    icon: Megaphone,
    colorClass: "text-hot",
  },
  {
    key: "confidence-question",
    name: "Confidence Question",
    tagline: "The question that closes more deals than any technique",
    description:
      "\"What would need to be true for you to feel completely confident moving forward?\" Surfaces any remaining objection and hands them the path to yes on their own terms.",
    example:
      "I want to make sure we're solving the right thing — what would need to be true for you to feel completely confident moving forward?",
    icon: MessageCircleQuestion,
    colorClass: "text-emerald-500",
  },
  {
    key: "transparent-counter",
    name: "Transparent Counter",
    tagline: "Honesty beats a polished rebuttal",
    description:
      "When the objection is a smokescreen, name it without being defensive. Never fake scarcity, never imply phantom buyers. Your reputation is smaller than you think.",
    example:
      "I'm not going to pretend there's a discount expiring tonight. Here's the actual tradeoff I'd weigh if I were in your seat…",
    icon: Shield,
    colorClass: "text-sky-500",
  },
];

export const NEVER_DO: { title: string; detail: string; icon: LucideIcon }[] = [
  {
    icon: AlertTriangle,
    title: "Never fake a deadline",
    detail:
      "Never tell a prospect a discount expires today unless it genuinely does.",
  },
  {
    icon: AlertTriangle,
    title: "Never invent other buyers",
    detail:
      "Never imply other buyers are interested unless they are. Buyers talk to each other.",
  },
];

export function leverByKey(key: RebuttalLeverKey): RebuttalLever {
  return (
    REBUTTAL_LEVERS.find((l) => l.key === key) ?? REBUTTAL_LEVERS[0]
  );
}
