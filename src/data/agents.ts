import {
  type LucideIcon,
  Calculator,
  Mic2,
  Radar,
  Sparkles,
  Stethoscope,
  Telescope,
} from "lucide-react";

export type AgentStatus = "active" | "coming_soon";

export type Agent = {
  slug: string;
  href: string;
  name: string;
  /** One-line summary used on cards and as the TopNav subtitle. */
  tagline: string;
  /** Two-to-three sentence description shown on the agent's own page. */
  description: string;
  icon: LucideIcon;
  status: AgentStatus;
  /**
   * Live metric the card shows under the agent name when active.
   * For coming-soon agents this can be a teaser like "Q1 2026".
   */
  signal?: string;
  /**
   * Which other agent this one feeds into. Used to hint the orchestration
   * story on the landing page ("Trigger Hunter -> Pre-Call Prep -> Voice
   * Sparring").
   */
  feedsInto?: string[];
  /**
   * Why this agent matters in one sentence. Shown on the agent's own
   * "coming soon" or active landing page.
   */
  whyItMatters: string;
};

export const agents: Agent[] = [
  {
    slug: "trigger-hunter",
    href: "/agents/trigger-hunter",
    name: "Trigger Hunter",
    tagline: "Hot accounts ranked by storm + hiring signals",
    description:
      "Crawls NOAA storm reports, Indeed/ZipRecruiter postings, and roofing operator chatter to surface roofing shops in the 72-hour window where they're most likely to buy. Scores each account on signal strength, fit, and freshness, then drops the call-ready dossier into your queue.",
    icon: Radar,
    status: "active",
    signal: "3 hot accounts today",
    feedsInto: ["pre-call", "voice-sparring"],
    whyItMatters:
      "The single highest-leverage thing a founding AE can do is call the right shop on the right day. This is that.",
  },
  {
    slug: "coach",
    href: "/agents/coach",
    name: "Coach Chat",
    tagline: "Claude sales coach trained on LADDER + roofing ops",
    description:
      "Your text-based sparring partner for live deal questions, objection rehearsal, and pre-call gut-checks. Knows your pipeline, your ICP, and the LADDER framework. Available 24/7.",
    icon: Sparkles,
    status: "active",
    signal: "Always on",
    whyItMatters:
      "Most reps lose deals between calls, not on them. Coach is the thing you ping at 9pm before tomorrow's discovery.",
  },
  {
    slug: "pre-call",
    href: "/agents/pre-call",
    name: "Pre-Call Prep",
    tagline: "Multi-source dossier in 90 seconds",
    description:
      "Fans out across LinkedIn, the company website, Facebook (for owner-led shops), Indeed, and recent storm activity to assemble a one-page dossier the moment you accept the meeting. Includes the owner's bio, the company's posture, and three credible openers tied to verifiable signals.",
    icon: Telescope,
    status: "coming_soon",
    signal: "Next up",
    feedsInto: ["voice-sparring"],
    whyItMatters:
      "Walking into a discovery cold is the most expensive mistake an AE makes. Prep makes the first 90 seconds earned, not lucky.",
  },
  {
    slug: "voice-sparring",
    href: "/agents/voice-sparring",
    name: "Voice Sparring",
    tagline: "Live voice reps against the buyer you're about to call",
    description:
      "Hume-powered voice roleplay using the actual buyer's persona, signals, and recent quotes. Practice the cold opener, the discovery flow, or the toughest objection three times before the real call. Optional Voss/Miner coach overlay grades you on tonality and tactical empathy.",
    icon: Mic2,
    status: "coming_soon",
    signal: "After Pre-Call",
    whyItMatters:
      "Reps learn from reps, not from books. This makes 10 reps a day cheaper than 1 real call.",
  },
  {
    slug: "pipeline-doctor",
    href: "/agents/pipeline-doctor",
    name: "Pipeline Doctor",
    tagline: "Monday-morning sanity check on every open deal",
    description:
      "Audits your pipeline for stalled deals, missing next-steps, and stage inflation. Recommends specific moves: re-engage with this signal, drop this deal back to qualification, ask this question on Tuesday. Honest about which deals are real and which are wishes.",
    icon: Stethoscope,
    status: "coming_soon",
    signal: "Soon",
    whyItMatters:
      "The fastest way to hit quota is to stop lying to yourself about which deals are alive.",
  },
  {
    slug: "roi-calc",
    href: "/agents/roi-calc",
    name: "ROI Calculator",
    tagline: "Quantify status quo cost in their numbers",
    description:
      "Drop in the prospect's crew count, lead volume, and washout rate; get a defensible cost-of-status-quo number tied to their actual ops. Generates the one-pager you send Friday afternoon.",
    icon: Calculator,
    status: "coming_soon",
    signal: "Soon",
    whyItMatters:
      "Buyers don't buy on features. They buy when the cost of not changing is louder than the price of changing.",
  },
];

export function getAgent(slug: string): Agent | undefined {
  return agents.find((a) => a.slug === slug);
}

export const activeAgents = agents.filter((a) => a.status === "active");
export const comingSoonAgents = agents.filter(
  (a) => a.status === "coming_soon",
);
