import type { SVGProps } from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

// LADDER framework stages
export type LadderStage =
  | "locate"
  | "approach"
  | "diagnose"
  | "design"
  | "estimate"
  | "relationship";

export type StageInfo = {
  key: LadderStage;
  letter: string;
  name: string;
  shortName: string;
  description: string;
  order: number;
};

export type Prospect = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  propertyType: "residential" | "commercial";
  source: "storm" | "referral" | "canvass" | "inbound" | "partner";
  phone?: string;
  email?: string;
};

export type Deal = {
  id: string;
  prospect: Prospect;
  stage: LadderStage;
  value: number;
  owner: string;
  openedAt: string;
  lastTouchAt: string;
  daysInStage: number;
  health: number; // 0-100
  nextAction: string;
  nextActionDue: string;
  notes: string;
  tags: string[];
};

export type ActivityEvent = {
  id: string;
  dealId: string;
  prospectName: string;
  type: "stage_move" | "note" | "call" | "inspection" | "proposal" | "signed";
  from?: LadderStage;
  to?: LadderStage;
  owner: string;
  message: string;
  at: string;
};

export type ObjectionCategory =
  | "price"
  | "timing"
  | "trust"
  | "spouse"
  | "insurance"
  | "competitor"
  | "process";

export type Objection = {
  id: string;
  category: ObjectionCategory;
  title: string;
  quote: string;
  whyItHappens: string;
  reframe: string;
  script: string;
  closingMove: string;
};

export type RebuttalLeverKey =
  | "their-timeline"
  | "implementation-reality"
  | "external-event"
  | "confidence-question"
  | "transparent-counter";

export type RoiKind = "hiring-waste" | "territory-waste";

export type HiringRoiInputs = {
  salesRepsPerMonth: number;
  canvassersPerMonth: number;
};

export type TerritoryRoiInputs = {
  canvassers: number;
  knocksPerCanvasserPerDay: number;
  workingDaysPerMonth: number;
  deadZonePct: number;
  costPerKnock: number;
};

export type RoiAttachment =
  | {
      kind: "hiring-waste";
      inputs: HiringRoiInputs;
      monthlyWaste: number;
      annualWaste: number;
      savingsMin: number;
      savingsMax: number;
      sentence: string;
    }
  | {
      kind: "territory-waste";
      inputs: TerritoryRoiInputs;
      monthlyWaste: number;
      annualWaste: number;
      savingsMin: number;
      savingsMax: number;
      sentence: string;
    };

export type RebuttalOption = {
  lever: RebuttalLeverKey;
  headline: string;
  script: string;
  roi?: RoiAttachment;
};

export type ObjectionAnalysis = {
  realConcern: string;
  diagnosticQuestion: string;
  response: string;
  bridge: string;
  rebuttals: RebuttalOption[];
};

export type LoggedObjectionStatus = "draft" | "practicing" | "mastered";

export type LoggedObjection = {
  id: string;
  createdAt: string;
  updatedAt: string;
  statedObjection: string;
  category: ObjectionCategory;
  context: {
    product: string;
    icp: string;
    stage?: string;
    dealName?: string;
  };
  analysis: ObjectionAnalysis;
  status: LoggedObjectionStatus;
  roleplayTestsPassed: number;
  notes?: string;
  tags: string[];
};

export type PlaybookSection = {
  heading: string;
  body?: string;
  bullets?: string[];
  callout?: {
    kind: "prompt" | "warning" | "principle" | "example";
    label?: string;
    text: string;
  };
};

export type PlaybookModuleCategory =
  | "architecture"
  | "list-quality"
  | "diagnostics"
  | "states"
  | "tools"
  | "reply-handling"
  | "onboarding"
  | "habits"
  | "pipeline"
  | "prep"
  | "follow-up"
  | "forecasting"
  | "urgency"
  | "elite-rep";

export type PlaybookModule = {
  id: string;
  category: PlaybookModuleCategory;
  number: string;
  title: string;
  summary: string;
  sections: PlaybookSection[];
};

export type ResearchAgent = {
  id: string;
  name: string;
  role: string;
  description: string;
  outputs: string[];
};

export type ResearchResult = {
  prospect: {
    companyName: string;
    contactName?: string;
    contactTitle?: string;
    website?: string;
    hqCity: string;
    hqState: string;
  };
  companyIntel: {
    estHeadcount: string;
    estRevenue: string;
    yearsActive: number;
    primaryMotion: string;
    services: string[];
    statesServed: string[];
  };
  salesMotion: {
    canvassingActive: boolean;
    estSalesReps: string;
    dominantChannel: string;
    techStack: string[];
    retentionSignal: string;
  };
  hiringSignals: {
    openRolesCount: number;
    recentRoles: string[];
    jobBoards: string[];
    recentHireChurn: string;
  };
  territorySignals: {
    primaryMetro: string;
    stormWindow: string;
    closedDealDensity: string;
    keyCompetitors: string[];
    knockWasteSignal: string;
  };
  callPrep: {
    openingLine: string;
    priorityPoints: string[];
    likelyObjections: string[];
    pricingAnchor: string;
    nextStep: string;
  };
};
