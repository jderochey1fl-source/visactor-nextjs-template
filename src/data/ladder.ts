import type { StageInfo, LadderStage } from "@/types/types";

export const ladderStages: StageInfo[] = [
  {
    key: "locate",
    letter: "L",
    name: "Locate",
    shortName: "Locate",
    description:
      "Identify qualified prospects — storm-hit zones, aged roofs, referral-ready neighborhoods.",
    order: 1,
  },
  {
    key: "approach",
    letter: "A",
    name: "Approach",
    shortName: "Approach",
    description:
      "First meaningful contact. Appointment set, opening pattern interrupted, trust established.",
    order: 2,
  },
  {
    key: "diagnose",
    letter: "D",
    name: "Diagnose",
    shortName: "Diagnose",
    description:
      "On-site inspection. Document damage, scope the job, teach the homeowner what you see.",
    order: 3,
  },
  {
    key: "design",
    letter: "D",
    name: "Design",
    shortName: "Design",
    description:
      "Present findings, material options, and the recommended system. Co-design with the homeowner.",
    order: 4,
  },
  {
    key: "estimate",
    letter: "E",
    name: "Estimate",
    shortName: "Estimate",
    description:
      "Written estimate delivered. Financing presented. Insurance claim supported. Close or schedule.",
    order: 5,
  },
  {
    key: "relationship",
    letter: "R",
    name: "Relationship",
    shortName: "Relationship",
    description:
      "Signed. Install quality. Referral capture. Warranty registered. Raving fan.",
    order: 6,
  },
];

export const stageByKey: Record<LadderStage, StageInfo> = Object.fromEntries(
  ladderStages.map((s) => [s.key, s]),
) as Record<LadderStage, StageInfo>;

// Current funnel counts (prospects currently in each stage)
export const funnelCounts: { stage: LadderStage; count: number }[] = [
  { stage: "locate", count: 482 },
  { stage: "approach", count: 196 },
  { stage: "diagnose", count: 84 },
  { stage: "design", count: 47 },
  { stage: "estimate", count: 28 },
  { stage: "relationship", count: 19 },
];

// Trailing-30 stage velocity (avg days in each stage)
export const stageVelocity: { stage: LadderStage; avgDays: number }[] = [
  { stage: "locate", avgDays: 3.2 },
  { stage: "approach", avgDays: 2.1 },
  { stage: "diagnose", avgDays: 4.4 },
  { stage: "design", avgDays: 5.8 },
  { stage: "estimate", avgDays: 6.3 },
  { stage: "relationship", avgDays: 12.0 },
];

// Stage-to-stage conversion (trailing 90 days)
export const stageConversion: {
  from: LadderStage;
  to: LadderStage;
  rate: number;
}[] = [
  { from: "locate", to: "approach", rate: 0.41 },
  { from: "approach", to: "diagnose", rate: 0.43 },
  { from: "diagnose", to: "design", rate: 0.56 },
  { from: "design", to: "estimate", rate: 0.6 },
  { from: "estimate", to: "relationship", rate: 0.68 },
];

// Revenue trend — last 12 weeks
export const revenueTrend = [
  { week: "W-12", signed: 142000, forecast: 180000 },
  { week: "W-11", signed: 168000, forecast: 175000 },
  { week: "W-10", signed: 155000, forecast: 190000 },
  { week: "W-9", signed: 201000, forecast: 210000 },
  { week: "W-8", signed: 187000, forecast: 205000 },
  { week: "W-7", signed: 224000, forecast: 240000 },
  { week: "W-6", signed: 196000, forecast: 220000 },
  { week: "W-5", signed: 248000, forecast: 260000 },
  { week: "W-4", signed: 272000, forecast: 280000 },
  { week: "W-3", signed: 241000, forecast: 285000 },
  { week: "W-2", signed: 298000, forecast: 310000 },
  { week: "W-1", signed: 314000, forecast: 325000 },
];

export const kpis = {
  pipelineValue: 4_820_000,
  pipelineChange: 0.14,
  closeRate: 0.287,
  closeRateChange: 0.031,
  avgDealSize: 18_400,
  avgDealChange: 0.07,
  cycleDays: 34,
  cycleChange: -0.09, // negative = faster = good
};

export const nextActions: {
  id: string;
  prospect: string;
  stage: LadderStage;
  action: string;
  due: string;
  heat: "hot" | "warm" | "cold";
  value: number;
}[] = [
  {
    id: "na-1",
    prospect: "M. Delgado",
    stage: "estimate",
    action: "Re-send financing terms — 9.99% / 84mo",
    due: "Today, 2:00 PM",
    heat: "hot",
    value: 26400,
  },
  {
    id: "na-2",
    prospect: "K. Nakamura",
    stage: "design",
    action: "Present shingle vs. standing-seam comparison",
    due: "Today, 4:30 PM",
    heat: "hot",
    value: 41200,
  },
  {
    id: "na-3",
    prospect: "Willow Creek HOA",
    stage: "diagnose",
    action: "Drone inspection walkthrough with board",
    due: "Tomorrow, 9:00 AM",
    heat: "warm",
    value: 312000,
  },
  {
    id: "na-4",
    prospect: "T. Okafor",
    stage: "approach",
    action: "Callback after voicemail — mention storm date",
    due: "Tomorrow, 11:00 AM",
    heat: "warm",
    value: 17800,
  },
  {
    id: "na-5",
    prospect: "B. Kowalski",
    stage: "estimate",
    action: "Send post-install referral ask",
    due: "Fri, 10:00 AM",
    heat: "cold",
    value: 0,
  },
];
