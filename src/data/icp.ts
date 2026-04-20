export type IcpDefinition = {
  label: string;
  product: string;
  tagline: string;
  buyerPersonas: string[];
  headcount: string;
  revenue: string;
  growthStage: string;
  services: string[];
  techStackSignals: string[];
  triggerEvents: string[];
  disqualifiers: string[];
  oneProblem: {
    smarthire: string;
    smartterritory: string;
  };
};

/**
 * Ladder sells to roofing COMPANIES, not to homeowners.
 * This ICP definition is the brief every research, list-build,
 * and outreach tool in the stack should run against.
 */
export const ladderIcp: IcpDefinition = {
  label: "Ladder ICP — Mid-size US roofing companies",
  product: "SmartHire + SmartTerritory",
  tagline: "Hire reps who stay. Send them where they'll close.",
  buyerPersonas: [
    "Owner / Operator",
    "VP of Sales / Sales Director",
    "Sales Manager (primary buyer for SmartTerritory)",
    "General Manager / COO",
  ],
  headcount: "25 – 200 employees",
  revenue: "$5M – $50M in annual revenue",
  growthStage:
    "Profitable, past the founder-only stage, actively growing a canvass or storm-restoration crew. Not a solo operator, not an enterprise national.",
  services: [
    "Residential roof replacement (primary)",
    "Storm restoration / insurance claim work",
    "Light commercial as secondary revenue",
  ],
  techStackSignals: [
    "Canvassing tool active (Spotio / SalesRabbit) — proves live door-to-door motion",
    "Project CRM in place (JobNimbus / AccuLynx / Leap) — organized enough to onboard Ladder",
    "Active job postings on Indeed / ZipRecruiter for canvassers or sales reps",
  ],
  triggerEvents: [
    "NOAA hail 1\"+ or wind 60mph+ in their primary metro within the last 90 days",
    "3+ active sales or canvasser postings in the last 30 days",
    "Observable rep turnover on LinkedIn — 3+ departures in the last 90 days",
    "Recent geographic expansion — new market, new office, new state",
    "Leadership change — new VP Sales, Sales Manager, or GM hired in the last 60 days",
  ],
  disqualifiers: [
    "Solo operator or sub-10 employees — too small to run the platform",
    "Enterprise nationals (500+ employees, $100M+) — not our ICP yet",
    "Pure commercial / industrial roofing with no residential canvass motion",
    "Homeowners or property owners — we sell to roofing companies, not to their customers",
  ],
  oneProblem: {
    smarthire:
      "60% of roofing sales hires quit in 90 days. Every bad hire burns ~$11K and a full selling season rebuilding the bench.",
    smartterritory:
      "60% of every canvass day is knocks on doors that will never buy. Good reps waste time on the wrong houses, and it compounds into an entire missed quarter of pipeline.",
  },
};
