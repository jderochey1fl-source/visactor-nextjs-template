import type { ResearchAgent, ResearchResult } from "@/types/types";

export const researchAgents: ResearchAgent[] = [
  {
    id: "agent-property",
    name: "Property Intelligence",
    role: "Property fundamentals",
    description:
      "Pulls year built, square footage, last permits, estimated roof age, pitch, and primary material from county + MLS signals.",
    outputs: ["Year built", "Roof age est.", "Sqft", "Pitch", "Last permit"],
  },
  {
    id: "agent-storm",
    name: "Storm & Damage History",
    role: "Weather forensics",
    description:
      "Maps the property against NOAA hail/wind events, nearby insurance claim density, and visible damage signals from aerial imagery.",
    outputs: [
      "Last major event",
      "Hail max size",
      "Wind peak",
      "Claim likelihood",
    ],
  },
  {
    id: "agent-owner",
    name: "Owner Profile",
    role: "Behavioral context",
    description:
      "Builds a lightweight persona: likely life stage, tenure in home, income bracket, and priorities that tend to drive the buying decision.",
    outputs: ["Persona", "Tenure", "Income bracket", "Priorities"],
  },
  {
    id: "agent-competitive",
    name: "Competitive Landscape",
    role: "Market pressure",
    description:
      "Detects recent quotes from competitors in the zip, neighborhood install density, and the dominant material being installed nearby.",
    outputs: [
      "Recent quotes by",
      "Neighborhood installs",
      "Dominant material",
    ],
  },
  {
    id: "agent-synth",
    name: "Call Prep Synthesizer",
    role: "Pre-call card",
    description:
      "Synthesizes the four intelligence streams into a 60-second call prep card: opening line, priority points, likely objections, pricing anchor, and the next step.",
    outputs: [
      "Opening line",
      "Priority points",
      "Likely objections",
      "Pricing anchor",
      "Next step",
    ],
  },
];

// Demo research result — used to simulate the pipeline output.
export const demoResearchResult: ResearchResult = {
  prospect: {
    name: "Marco Delgado",
    address: "2184 Birchfield Ln, Lewisville, TX",
  },
  propertyIntel: {
    estYearBuilt: 2006,
    estRoofAge: 18,
    sqft: 2840,
    material: "3-tab asphalt shingle",
    pitch: "6/12",
  },
  stormHistory: {
    lastMajorEvent: "Mar 24, 2026 — EF-hail / wind gust 68mph",
    hailMaxSize: "1.75 in (golf ball)",
    windPeak: "68 mph",
    claimLikelihood: 0.87,
  },
  ownerProfile: {
    likelyPersona: "Established family, second child recent",
    incomeBracket: "$145k–$185k",
    tenureYears: 9,
    priorities: [
      "Protect family / avoid interior damage",
      "Not be the only house on the street that hasn't replaced",
      "Finance-friendly so cash stays free",
    ],
  },
  competitive: {
    recentlyQuotedBy: ["Summit Roofing", "BlueSky Exteriors"],
    neighborhoodInstalls: 14,
    dominantMaterial: "Architectural / impact-resistant shingle",
  },
  callPrep: {
    openingLine:
      "Hey Marco — noticed 14 of your neighbors replaced their roofs after the March 24th storm. Wanted to make sure you got a fair look at yours before the insurance window closes.",
    priorityPoints: [
      "He's 18 years into a 20-year shingle — end of useful life regardless of storm.",
      "Hail 1.75in exceeds impact threshold for his current 3-tab — claim is very defensible.",
      "9-year tenure + growing family — protecting interior matters more than saving $2k.",
      "Two competitors already quoted — be the bid that sets the standard, not the cheapest.",
    ],
    likelyObjections: [
      "'Summit gave me a lower number' — reframe on apples-to-apples scope, not companies.",
      "'We need to talk to our insurance first' — offer to join the adjuster meeting.",
      "'Let us think about it' — pre-empt with a decision call, not an open-ended follow-up.",
    ],
    pricingAnchor:
      "Impact-resistant architectural system: $24k–$28k installed. Insurance covers ~80% net of deductible. Out-of-pocket range $2.8k–$4.1k.",
    nextStep:
      "Book the adjuster walkthrough this week. If uninsured claim path, book financing call within 48 hours.",
  },
};
