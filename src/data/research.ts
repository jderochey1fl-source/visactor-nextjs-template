import type { ResearchAgent, ResearchResult } from "@/types/types";

/**
 * Five-agent pipeline for researching a ROOFING COMPANY prospect.
 * Ladder sells SmartHire + SmartTerritory to mid-size roofing companies —
 * these agents pull the signals that prove fit for each product.
 */
export const researchAgents: ResearchAgent[] = [
  {
    id: "agent-company",
    name: "Company Intelligence",
    role: "Firmographic fundamentals",
    description:
      "Pulls headcount estimate, revenue range, years in business, services offered, and states served from LinkedIn, website, and public records.",
    outputs: [
      "Headcount",
      "Revenue est.",
      "Services",
      "States served",
      "Years active",
    ],
  },
  {
    id: "agent-motion",
    name: "Sales Motion Analyzer",
    role: "How they sell today",
    description:
      "Maps dominant channel (canvass vs. storm chase vs. retail lead gen), rep count estimate, tech stack in use, and retention signals from LinkedIn tenure.",
    outputs: [
      "Rep count",
      "Channel mix",
      "Tech stack",
      "Retention signal",
    ],
  },
  {
    id: "agent-hiring",
    name: "Hiring Signals",
    role: "SmartHire trigger",
    description:
      "Scans active job postings across Indeed, ZipRecruiter, and LinkedIn, recent role turnover, and churn signals that surface the cost of their current hiring process.",
    outputs: ["Open roles", "Recent churn", "Job boards", "Role mix"],
  },
  {
    id: "agent-territory",
    name: "Territory & Storm Mapper",
    role: "SmartTerritory trigger",
    description:
      "Identifies primary metros, recent NOAA storm events in their footprint, competitor density, and estimated canvass waste on their current motion.",
    outputs: [
      "Primary metro",
      "Storm window",
      "Competitors",
      "Knock waste est.",
    ],
  },
  {
    id: "agent-synth",
    name: "Ladder Fit Synthesizer",
    role: "Pre-call card",
    description:
      "Synthesizes the four streams into a 60-second pre-call card: opening line grounded in a real signal, priority points, likely objections, pricing anchor, and next step.",
    outputs: [
      "Opening line",
      "Priority points",
      "Likely objections",
      "Pricing anchor",
      "Next step",
    ],
  },
];

/**
 * Demo result — a realistic mid-size TX roofing company profile
 * that fits Ladder's ICP on both SmartHire (high turnover + active
 * canvasser openings) and SmartTerritory (recent DFW hail + concentrated
 * closed-deal zip codes).
 */
export const demoResearchResult: ResearchResult = {
  prospect: {
    companyName: "Crestline Roofing",
    contactName: "Derek Hollis",
    contactTitle: "VP of Sales",
    website: "crestlineroofing.com",
    hqCity: "Plano",
    hqState: "TX",
  },
  companyIntel: {
    estHeadcount: "75 – 95 employees",
    estRevenue: "$18M – $24M",
    yearsActive: 14,
    primaryMotion: "Residential storm restoration + retail mix",
    services: [
      "Residential roof replacement",
      "Storm restoration",
      "Insurance supplement support",
      "Light commercial (TPO)",
    ],
    statesServed: ["TX", "OK"],
  },
  salesMotion: {
    canvassingActive: true,
    estSalesReps: "16 – 22 reps (≈ 8 canvassers, ≈ 8 closers)",
    dominantChannel: "Door-to-door canvass + post-storm follow-up",
    techStack: ["Spotio", "JobNimbus", "HubSpot (light)"],
    retentionSignal: "7 sales reps departed in the last 6 months on LinkedIn",
  },
  hiringSignals: {
    openRolesCount: 6,
    recentRoles: [
      "Canvasser (4 openings)",
      "Sales Manager",
      "Project Consultant",
    ],
    jobBoards: ["Indeed", "ZipRecruiter", "Facebook Jobs"],
    recentHireChurn: "High — est. 55% of sales hires leave within 90 days",
  },
  territorySignals: {
    primaryMetro: "Dallas – Fort Worth",
    stormWindow:
      'Mar 24, 2026 — hail 1.75" (EF threshold) across the North Plano / Frisco corridor',
    closedDealDensity:
      "Concentrated in 4 zip codes — ≈ 40% of wins, ≈ 10% of knocks",
    keyCompetitors: [
      "Summit Roofing",
      "BlueSky Exteriors",
      "Elevated Roofing",
    ],
    knockWasteSignal:
      "Estimated ~60% of canvass volume on doors unlikely to convert",
  },
  callPrep: {
    openingLine:
      "Derek — saw Crestline has 4 canvasser openings live on Indeed and 7 sales reps turned over in the last six months. Ladder cuts roofing sales hire washouts by 48% in 90 days. Worth 20 minutes this week?",
    priorityPoints: [
      "Active canvass motion + storm-restoration mix — SmartHire and SmartTerritory both fit directly.",
      "Hiring waste: 55% 90-day turnover × ~$11K per bad hire is real money every quarter — SmartHire ROI is clear in one conversation.",
      "DFW March 24 hail event plus 4 concentrated closing zip codes — SmartTerritory compounds the wins they already have instead of asking them to change motion.",
      "Running Spotio + JobNimbus already — SmartTerritory plugs in without a CRM migration.",
    ],
    likelyObjections: [
      "\"We just need more reps\" — reframe: more reps without better hiring = more washouts, not more revenue.",
      "\"My GM handles canvass routes\" — reframe: SmartTerritory turns 30 minutes of guessing into 30 seconds of data.",
      "\"We already use hail maps\" — reframe: hail maps are an input; SmartTerritory scores by where YOU actually closed.",
      "Price pushback on $499+/mo — reframe: one avoided washout pays for a full year.",
    ],
    pricingAnchor:
      "SmartHire starts at $499/mo. SmartTerritory priced against closed-deal volume. Combined platform ROI typically 3 – 6x in Q1 from washout savings alone.",
    nextStep:
      "Book a 20-minute Ladder Fit Call with Derek + his GM. Bring the ROI calculator pre-populated with Crestline's recent hiring and canvass numbers.",
  },
};
