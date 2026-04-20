import type { StageInfo, LadderStage } from "@/types/types";

/**
 * LADDER framework, applied to Ladder's own B2B SaaS motion selling
 * SmartHire + SmartTerritory into mid-size US roofing companies.
 * Same mnemonic the company teaches roofing reps, now running
 * Ladder's internal pipeline end-to-end.
 */
export const ladderStages: StageInfo[] = [
  {
    key: "locate",
    letter: "L",
    name: "Locate",
    shortName: "Locate",
    description:
      "Build the target list. Surface mid-size roofing companies with active canvasser postings, rep churn, storm triggers in their metro, and the tech-stack signals (Spotio/SalesRabbit + JobNimbus/AccuLynx/Leap) that prove Ladder fit.",
    order: 1,
  },
  {
    key: "approach",
    letter: "A",
    name: "Approach",
    shortName: "Approach",
    description:
      "First meaningful contact with an Owner, VP Sales, Sales Manager, or GM. Break pattern by leading with a signal they can't deny — not a pitch. Win the stage when a discovery call is booked with the right stakeholder.",
    order: 2,
  },
  {
    key: "diagnose",
    letter: "D",
    name: "Diagnose",
    shortName: "Diagnose",
    description:
      "Discovery call. Quantify the cost of their status quo in THEIR numbers — washout rate × rep cost, dead-zone knocks × hourly cost, closed-deal density vs. canvass distribution. Earn the right to propose.",
    order: 3,
  },
  {
    key: "design",
    letter: "D",
    name: "Design",
    shortName: "Design",
    description:
      "Map product fit. SmartHire for washout pain, SmartTerritory for canvass waste, Both when scale is constrained in both dimensions. Identify the full stakeholder set before building a proposal.",
    order: 4,
  },
  {
    key: "estimate",
    letter: "E",
    name: "Estimate",
    shortName: "Estimate",
    description:
      "Proposal with ROI model. Pricing reviewed with the decision committee. Contract terms and onboarding plan walked live — never emailed as a one-way drop.",
    order: 5,
  },
  {
    key: "relationship",
    letter: "R",
    name: "Relationship",
    shortName: "Relationship",
    description:
      "Signed. 10–14 day onboarding. Weekly health reviews through month one. Expansion to additional crews, markets, or products. The job isn't done until they refer a peer roofer.",
    order: 6,
  },
];

export const stageByKey: Record<LadderStage, StageInfo> = Object.fromEntries(
  ladderStages.map((s) => [s.key, s]),
) as Record<LadderStage, StageInfo>;

// Current funnel counts (companies currently in each stage of Ladder's pipeline)
export const funnelCounts: { stage: LadderStage; count: number }[] = [
  { stage: "locate", count: 428 },
  { stage: "approach", count: 164 },
  { stage: "diagnose", count: 71 },
  { stage: "design", count: 38 },
  { stage: "estimate", count: 22 },
  { stage: "relationship", count: 14 },
];

// Trailing-30 stage velocity (avg days in each stage for B2B SaaS cycle)
export const stageVelocity: { stage: LadderStage; avgDays: number }[] = [
  { stage: "locate", avgDays: 4.8 },
  { stage: "approach", avgDays: 6.2 },
  { stage: "diagnose", avgDays: 9.1 },
  { stage: "design", avgDays: 11.4 },
  { stage: "estimate", avgDays: 10.6 },
  { stage: "relationship", avgDays: 32.0 },
];

// Stage-to-stage conversion (trailing 90 days)
export const stageConversion: {
  from: LadderStage;
  to: LadderStage;
  rate: number;
}[] = [
  { from: "locate", to: "approach", rate: 0.38 },
  { from: "approach", to: "diagnose", rate: 0.44 },
  { from: "diagnose", to: "design", rate: 0.54 },
  { from: "design", to: "estimate", rate: 0.58 },
  { from: "estimate", to: "relationship", rate: 0.64 },
];

// Revenue trend — new ARR signed per week, last 12 weeks
export const revenueTrend = [
  { week: "W-12", signed: 42_000, forecast: 58_000 },
  { week: "W-11", signed: 51_000, forecast: 62_000 },
  { week: "W-10", signed: 48_000, forecast: 70_000 },
  { week: "W-9", signed: 67_000, forecast: 78_000 },
  { week: "W-8", signed: 58_000, forecast: 74_000 },
  { week: "W-7", signed: 81_000, forecast: 92_000 },
  { week: "W-6", signed: 72_000, forecast: 88_000 },
  { week: "W-5", signed: 96_000, forecast: 104_000 },
  { week: "W-4", signed: 103_000, forecast: 112_000 },
  { week: "W-3", signed: 89_000, forecast: 118_000 },
  { week: "W-2", signed: 118_000, forecast: 125_000 },
  { week: "W-1", signed: 124_000, forecast: 132_000 },
];

// Ladder B2B SaaS KPIs — realistic early/mid-stage SaaS numbers
export const kpis = {
  pipelineValue: 1_840_000, // Total ARR in open pipeline
  pipelineChange: 0.16,
  closeRate: 0.248,
  closeRateChange: 0.028,
  avgDealSize: 14_800, // Blended SmartHire + SmartTerritory ACV
  avgDealChange: 0.09,
  cycleDays: 52,
  cycleChange: -0.11, // negative = faster = good
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
    prospect: "Crestline Roofing",
    stage: "estimate",
    action:
      "Send SmartHire + SmartTerritory combined proposal — Derek + GM reviewing Fri",
    due: "Today, 2:00 PM",
    heat: "hot",
    value: 28_800,
  },
  {
    id: "na-2",
    prospect: "Summit Exteriors",
    stage: "design",
    action:
      "Walk through SmartTerritory overlay on their 4 primary closing zips",
    due: "Today, 4:30 PM",
    heat: "hot",
    value: 19_200,
  },
  {
    id: "na-3",
    prospect: "BlueSky Roofing",
    stage: "diagnose",
    action:
      "Discovery with Owner + Sales Manager — quantify 90-day rep washout cost",
    due: "Tomorrow, 9:00 AM",
    heat: "warm",
    value: 22_400,
  },
  {
    id: "na-4",
    prospect: "Ironclad Roofing",
    stage: "approach",
    action:
      "Callback after voicemail — reference 7 rep departures on LinkedIn",
    due: "Tomorrow, 11:00 AM",
    heat: "warm",
    value: 16_500,
  },
  {
    id: "na-5",
    prospect: "Apex Storm Restoration",
    stage: "estimate",
    action: "Post-signature expansion — add second metro to SmartTerritory",
    due: "Fri, 10:00 AM",
    heat: "cold",
    value: 0,
  },
];
