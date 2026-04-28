// Realistic mock data for the Trigger Hunter tab. Once Supabase is wired,
// these types map 1:1 to the SQL schema in INTEGRATION.md so we can swap
// the data source without touching any UI.

export type Temperature = "hot" | "warm" | "cool";

export type SignalSource =
  | "noaa-storm-events"
  | "indeed-rep-jobs"
  | "ziprecruiter-rep-jobs"
  | "craigslist-rep-jobs"
  | "apollo-firmographic"
  | "linkedin-leadership-change";

export type SignalEvent = {
  id: string;
  type: string; // e.g. "Hail event", "New AE hired", "Sales leader change"
  source: SignalSource;
  summary: string; // human-readable evidence line
  capturedAt: string; // ISO date
  weight: number; // 0-100, used by composite score
};

export type DecisionMaker = {
  name: string;
  title: string;
  linkedinHandle?: string;
  emailMasked?: string; // e.g. "j****@crestlineroofing.com"
  phoneMasked?: string;
};

export type StormProfile = {
  lastEventDate: string;
  hailSizeInches: number;
  ehImpactRadius: number;
  countiesAffected: string[];
};

export type HiringMomentum = {
  newReps30d: number;
  newReps90d: number;
  openCanvasserPostings: number;
  velocity: "accelerating" | "steady" | "cooling";
};

export type Subscores = {
  opportunity: number; // storm + market
  painSignal: number; // hiring activity, leader churn
  fit: number; // size, tier, region
  decisionAccess: number; // DM contacts found
  timing: number; // recency of signals
};

export type Account = {
  id: string;
  name: string;
  domain: string;
  city: string;
  state: string;
  region: "Texas" | "Florida" | "Colorado" | "Oklahoma" | "Kansas" | "Georgia";
  employeeCount: number;
  crmTier: 1 | 2 | 3;
  temperature: Temperature;
  compositeScore: number; // 0-100
  scoreDelta: number; // change vs 7d ago
  subscores: Subscores;
  signals: SignalEvent[];
  decisionMakers: DecisionMaker[];
  storm?: StormProfile;
  hiring: HiringMomentum;
  recommendedPlay: string;
  recommendedOpener: string;
  status: "new" | "contacted" | "meeting-booked" | "won" | "passed";
  lastTouchAt?: string;
};

// ---- The 12 mock accounts ----

export const MOCK_ACCOUNTS: Account[] = [
  {
    id: "acct_crestline",
    name: "Crestline Roofing",
    domain: "crestlineroofing.com",
    city: "Plano",
    state: "TX",
    region: "Texas",
    employeeCount: 80,
    crmTier: 2,
    temperature: "hot",
    compositeScore: 92,
    scoreDelta: +18,
    subscores: {
      opportunity: 95,
      painSignal: 88,
      fit: 96,
      decisionAccess: 90,
      timing: 94,
    },
    signals: [
      {
        id: "sig_1",
        type: "Hail event",
        source: "noaa-storm-events",
        summary:
          "2.5\" hail across Collin & Dallas counties on Apr 14 — 40-min EH dwell",
        capturedAt: "2026-04-14T22:18:00Z",
        weight: 95,
      },
      {
        id: "sig_2",
        type: "Hiring sprint",
        source: "indeed-rep-jobs",
        summary: "6 new AE postings in 12 days — base $65k + comm",
        capturedAt: "2026-04-21T14:00:00Z",
        weight: 88,
      },
      {
        id: "sig_3",
        type: "Canvasser surge",
        source: "craigslist-rep-jobs",
        summary: "12 active door-knocker ads across DFW metro",
        capturedAt: "2026-04-22T09:30:00Z",
        weight: 78,
      },
    ],
    decisionMakers: [
      {
        name: "Derek Hollis",
        title: "Owner / Operator",
        linkedinHandle: "derek-hollis-crestline",
        emailMasked: "d****@crestlineroofing.com",
        phoneMasked: "(214) ***-2401",
      },
      {
        name: "Marisa Quinn",
        title: "Director of Sales",
        linkedinHandle: "marisa-quinn",
        emailMasked: "m****@crestlineroofing.com",
      },
    ],
    storm: {
      lastEventDate: "2026-04-14",
      hailSizeInches: 2.5,
      ehImpactRadius: 8.4,
      countiesAffected: ["Collin", "Dallas", "Denton"],
    },
    hiring: {
      newReps30d: 6,
      newReps90d: 11,
      openCanvasserPostings: 12,
      velocity: "accelerating",
    },
    recommendedPlay: "Hot — call today. Lead with the Apr 14 EH dwell map.",
    recommendedOpener:
      "Derek, this is — saw your team posted 6 AE roles in twelve days, right after the April 14th storm dropped 2.5\" hail across Collin and Dallas. That tracks with what we see at every shop scaling into a storm. Worth 15 minutes to compare what your top 3 reps closed last month vs your bottom 3?",
    status: "new",
  },
  {
    id: "acct_summit",
    name: "Summit Exteriors",
    domain: "summitexteriors.com",
    city: "Aurora",
    state: "CO",
    region: "Colorado",
    employeeCount: 115,
    crmTier: 1,
    temperature: "hot",
    compositeScore: 89,
    scoreDelta: +22,
    subscores: {
      opportunity: 94,
      painSignal: 92,
      fit: 88,
      decisionAccess: 78,
      timing: 90,
    },
    signals: [
      {
        id: "sig_4",
        type: "Hail event",
        source: "noaa-storm-events",
        summary:
          "1.75\" hail across Adams & Arapahoe counties on Apr 8 — repeat hit Apr 19",
        capturedAt: "2026-04-19T20:42:00Z",
        weight: 92,
      },
      {
        id: "sig_5",
        type: "Sales leader change",
        source: "linkedin-leadership-change",
        summary:
          "New VP of Sales appointed Mar 24 — Marcus Webb, former enterprise AE at GAF",
        capturedAt: "2026-03-24T13:00:00Z",
        weight: 85,
      },
      {
        id: "sig_6",
        type: "Hiring sprint",
        source: "ziprecruiter-rep-jobs",
        summary: "4 outside sales postings flagged 'urgent'",
        capturedAt: "2026-04-20T11:00:00Z",
        weight: 80,
      },
    ],
    decisionMakers: [
      {
        name: "Marcus Webb",
        title: "VP of Sales",
        linkedinHandle: "marcus-webb-vp",
        emailMasked: "m****@summitexteriors.com",
      },
      {
        name: "Katie Bjornson",
        title: "Owner",
        linkedinHandle: "katie-bjornson",
      },
    ],
    storm: {
      lastEventDate: "2026-04-19",
      hailSizeInches: 1.75,
      ehImpactRadius: 6.2,
      countiesAffected: ["Adams", "Arapahoe", "Denver"],
    },
    hiring: {
      newReps30d: 4,
      newReps90d: 7,
      openCanvasserPostings: 5,
      velocity: "accelerating",
    },
    recommendedPlay:
      "New VP of Sales + double storm hit. Reach Webb before he picks his stack.",
    recommendedOpener:
      "Marcus, congrats on the VP role at Summit — saw the LinkedIn announcement. With the back-to-back hail hits across Adams and Arapahoe, my guess is the first 90 days are about ramp speed, not headcount. Worth 15 minutes to show you how shops your size are getting a new AE to break-even by week 6 instead of week 14?",
    status: "new",
  },
  {
    id: "acct_bluesky",
    name: "BlueSky Roofing",
    domain: "blueskyroofing.com",
    city: "Orlando",
    state: "FL",
    region: "Florida",
    employeeCount: 55,
    crmTier: 2,
    temperature: "hot",
    compositeScore: 86,
    scoreDelta: +9,
    subscores: {
      opportunity: 84,
      painSignal: 90,
      fit: 92,
      decisionAccess: 82,
      timing: 80,
    },
    signals: [
      {
        id: "sig_7",
        type: "Tropical wind event",
        source: "noaa-storm-events",
        summary:
          "Sub-tropical gusts to 78 mph across Orange & Seminole on Apr 11",
        capturedAt: "2026-04-11T03:00:00Z",
        weight: 78,
      },
      {
        id: "sig_8",
        type: "Sales manager hire",
        source: "linkedin-leadership-change",
        summary: "Angela Ruiz promoted to Sales Manager Apr 2",
        capturedAt: "2026-04-02T16:00:00Z",
        weight: 70,
      },
      {
        id: "sig_9",
        type: "Canvass crew expansion",
        source: "indeed-rep-jobs",
        summary: "8 'door-to-door' postings in 21 days",
        capturedAt: "2026-04-18T10:00:00Z",
        weight: 82,
      },
    ],
    decisionMakers: [
      {
        name: "Angela Ruiz",
        title: "Sales Manager",
        linkedinHandle: "angela-ruiz-bluesky",
        emailMasked: "a****@blueskyroofing.com",
        phoneMasked: "(407) ***-5512",
      },
    ],
    storm: {
      lastEventDate: "2026-04-11",
      hailSizeInches: 0,
      ehImpactRadius: 4.8,
      countiesAffected: ["Orange", "Seminole"],
    },
    hiring: {
      newReps30d: 8,
      newReps90d: 14,
      openCanvasserPostings: 9,
      velocity: "accelerating",
    },
    recommendedPlay: "Reach Angela direct — she lives in the routing daily.",
    recommendedOpener:
      "Angela, congrats on the manager seat. Watching your job posts — eight canvasser slots in three weeks tells me you're scaling the door team faster than the inside flow can keep up. That's exactly the gap most shops in Orange County are fighting right now. Worth 15 minutes Thursday or Friday?",
    status: "contacted",
    lastTouchAt: "2026-04-23T14:22:00Z",
  },
  {
    id: "acct_apex",
    name: "Apex Residential",
    domain: "apexresidential.com",
    city: "Phoenix",
    state: "AZ",
    region: "Texas",
    employeeCount: 140,
    crmTier: 1,
    temperature: "hot",
    compositeScore: 84,
    scoreDelta: +6,
    subscores: {
      opportunity: 70,
      painSignal: 92,
      fit: 90,
      decisionAccess: 86,
      timing: 82,
    },
    signals: [
      {
        id: "sig_10",
        type: "Tool stack signal",
        source: "linkedin-leadership-change",
        summary:
          "GM Jason Park posted re: 'killing one of our 4 sales tools' Apr 17",
        capturedAt: "2026-04-17T18:30:00Z",
        weight: 90,
      },
      {
        id: "sig_11",
        type: "Hiring sprint",
        source: "indeed-rep-jobs",
        summary: "5 AE postings, all 'AccuLynx experience required'",
        capturedAt: "2026-04-15T12:00:00Z",
        weight: 84,
      },
    ],
    decisionMakers: [
      {
        name: "Jason Park",
        title: "General Manager",
        linkedinHandle: "jason-park-gm",
        emailMasked: "j****@apexresidential.com",
      },
      {
        name: "Sandra Gonzalez",
        title: "VP Operations",
        linkedinHandle: "sandra-gonzalez",
      },
    ],
    hiring: {
      newReps30d: 5,
      newReps90d: 9,
      openCanvasserPostings: 3,
      velocity: "steady",
    },
    recommendedPlay:
      "Jason is publicly evaluating tool sprawl. Bring an integration story.",
    recommendedOpener:
      "Jason, saw your post about cutting one of the four sales tools — at 140 people that's the right call. The job posts requiring AccuLynx tell me that's the system of record, so the question is which of the other three is doing work AccuLynx already does. Worth a 15-minute look at how three other shops your size made that call?",
    status: "new",
  },
  // -------- WARM tier --------
  {
    id: "acct_alpine",
    name: "Alpine Roofing Co",
    domain: "alpineroof.co",
    city: "Colorado Springs",
    state: "CO",
    region: "Colorado",
    employeeCount: 42,
    crmTier: 3,
    temperature: "warm",
    compositeScore: 71,
    scoreDelta: +4,
    subscores: {
      opportunity: 78,
      painSignal: 62,
      fit: 78,
      decisionAccess: 60,
      timing: 70,
    },
    signals: [
      {
        id: "sig_12",
        type: "Hail event",
        source: "noaa-storm-events",
        summary: "1.25\" hail across El Paso County Apr 6",
        capturedAt: "2026-04-06T19:14:00Z",
        weight: 70,
      },
      {
        id: "sig_13",
        type: "Hiring",
        source: "indeed-rep-jobs",
        summary: "2 AE postings in last 30 days",
        capturedAt: "2026-04-18T08:00:00Z",
        weight: 55,
      },
    ],
    decisionMakers: [
      {
        name: "Carl Whitaker",
        title: "Owner",
        linkedinHandle: "carl-whitaker-alpine",
      },
    ],
    storm: {
      lastEventDate: "2026-04-06",
      hailSizeInches: 1.25,
      ehImpactRadius: 4.1,
      countiesAffected: ["El Paso"],
    },
    hiring: {
      newReps30d: 2,
      newReps90d: 4,
      openCanvasserPostings: 2,
      velocity: "steady",
    },
    recommendedPlay: "Watch list — re-score after next storm cycle.",
    recommendedOpener:
      "Carl, after the El Paso County hail on April 6th most shops your size are deciding whether to add reps or push the existing team harder. Curious which way you're leaning. Worth 15 minutes?",
    status: "new",
  },
  {
    id: "acct_vanguard",
    name: "Vanguard Exteriors",
    domain: "vanguardext.com",
    city: "Tulsa",
    state: "OK",
    region: "Oklahoma",
    employeeCount: 68,
    crmTier: 2,
    temperature: "warm",
    compositeScore: 69,
    scoreDelta: -3,
    subscores: {
      opportunity: 60,
      painSignal: 75,
      fit: 80,
      decisionAccess: 58,
      timing: 65,
    },
    signals: [
      {
        id: "sig_14",
        type: "Hiring",
        source: "ziprecruiter-rep-jobs",
        summary: "3 outside sales postings Apr 1 — Apr 22",
        capturedAt: "2026-04-22T10:00:00Z",
        weight: 70,
      },
    ],
    decisionMakers: [
      {
        name: "Renata Walsh",
        title: "Owner",
        linkedinHandle: "renata-walsh-vanguard",
      },
    ],
    hiring: {
      newReps30d: 3,
      newReps90d: 6,
      openCanvasserPostings: 1,
      velocity: "steady",
    },
    recommendedPlay: "No fresh storm. Hiring activity worth a quick LinkedIn touch.",
    recommendedOpener:
      "Renata, three reps in 22 days is a real growth signal — usually means the close rate is fine but ramp speed is the bottleneck. That's the gap we close for shops your size. Worth 15 minutes this week?",
    status: "new",
  },
  {
    id: "acct_legacy",
    name: "Legacy Storm Solutions",
    domain: "legacystormsol.com",
    city: "Wichita",
    state: "KS",
    region: "Kansas",
    employeeCount: 95,
    crmTier: 1,
    temperature: "warm",
    compositeScore: 67,
    scoreDelta: +1,
    subscores: {
      opportunity: 64,
      painSignal: 70,
      fit: 86,
      decisionAccess: 50,
      timing: 64,
    },
    signals: [
      {
        id: "sig_15",
        type: "Tool change rumor",
        source: "linkedin-leadership-change",
        summary: "CRO posted re: 'evaluating sales stack' Apr 9",
        capturedAt: "2026-04-09T14:00:00Z",
        weight: 72,
      },
    ],
    decisionMakers: [
      {
        name: "Brad Olufsen",
        title: "CRO",
        linkedinHandle: "brad-olufsen",
      },
    ],
    hiring: {
      newReps30d: 1,
      newReps90d: 3,
      openCanvasserPostings: 0,
      velocity: "steady",
    },
    recommendedPlay: "Watch the stack-evaluation thread; engage with comparison data.",
    recommendedOpener:
      "Brad, saw your post about evaluating the stack — at 95 people most shops we work with end up consolidating around AccuLynx and one disposition layer. Worth 15 minutes to compare what three peer shops landed on?",
    status: "new",
  },
  {
    id: "acct_horizon",
    name: "Horizon Roofing Group",
    domain: "horizonroofs.com",
    city: "Atlanta",
    state: "GA",
    region: "Georgia",
    employeeCount: 50,
    crmTier: 2,
    temperature: "warm",
    compositeScore: 64,
    scoreDelta: +8,
    subscores: {
      opportunity: 58,
      painSignal: 62,
      fit: 76,
      decisionAccess: 64,
      timing: 60,
    },
    signals: [
      {
        id: "sig_16",
        type: "Wind event",
        source: "noaa-storm-events",
        summary: "60 mph straight-line winds across Fulton County Apr 13",
        capturedAt: "2026-04-13T22:00:00Z",
        weight: 60,
      },
      {
        id: "sig_17",
        type: "Hiring",
        source: "craigslist-rep-jobs",
        summary: "2 active D2D ads in metro Atlanta",
        capturedAt: "2026-04-20T09:00:00Z",
        weight: 55,
      },
    ],
    decisionMakers: [
      {
        name: "Talia Brooks",
        title: "Sales Director",
        linkedinHandle: "talia-brooks-horizon",
      },
    ],
    hiring: {
      newReps30d: 2,
      newReps90d: 5,
      openCanvasserPostings: 2,
      velocity: "steady",
    },
    recommendedPlay: "Soft signal. Email touch with storm map.",
    recommendedOpener:
      "Talia, the Apr 13th wind event in Fulton wasn't a hail show but it was enough to surface marginal roofs. Worth 15 minutes to compare what your top 3 reps close vs your bottom 3 in the next 30 days?",
    status: "new",
  },
  // -------- COOL tier --------
  {
    id: "acct_cornerstone",
    name: "Cornerstone Construction",
    domain: "cornerstoneconstruction.com",
    city: "Houston",
    state: "TX",
    region: "Texas",
    employeeCount: 32,
    crmTier: 3,
    temperature: "cool",
    compositeScore: 48,
    scoreDelta: -2,
    subscores: {
      opportunity: 40,
      painSignal: 50,
      fit: 62,
      decisionAccess: 38,
      timing: 50,
    },
    signals: [
      {
        id: "sig_18",
        type: "Hiring",
        source: "indeed-rep-jobs",
        summary: "1 AE posting open 41 days",
        capturedAt: "2026-03-15T10:00:00Z",
        weight: 35,
      },
    ],
    decisionMakers: [],
    hiring: {
      newReps30d: 0,
      newReps90d: 1,
      openCanvasserPostings: 0,
      velocity: "cooling",
    },
    recommendedPlay: "Re-score quarterly. Not worth a touch yet.",
    recommendedOpener: "—",
    status: "new",
  },
  {
    id: "acct_skyline",
    name: "Skyline Pro Roofing",
    domain: "skylinepro.io",
    city: "Tampa",
    state: "FL",
    region: "Florida",
    employeeCount: 25,
    crmTier: 3,
    temperature: "cool",
    compositeScore: 44,
    scoreDelta: 0,
    subscores: {
      opportunity: 45,
      painSignal: 40,
      fit: 50,
      decisionAccess: 38,
      timing: 48,
    },
    signals: [],
    decisionMakers: [
      {
        name: "Ramon Ortiz",
        title: "Owner",
        linkedinHandle: "ramon-ortiz-skyline",
      },
    ],
    hiring: {
      newReps30d: 0,
      newReps90d: 0,
      openCanvasserPostings: 0,
      velocity: "cooling",
    },
    recommendedPlay: "Below fit threshold. Park.",
    recommendedOpener: "—",
    status: "passed",
  },
  {
    id: "acct_evergreen",
    name: "Evergreen Roofworks",
    domain: "evergreenroofworks.com",
    city: "Lawrence",
    state: "KS",
    region: "Kansas",
    employeeCount: 38,
    crmTier: 2,
    temperature: "cool",
    compositeScore: 42,
    scoreDelta: -5,
    subscores: {
      opportunity: 38,
      painSignal: 35,
      fit: 60,
      decisionAccess: 40,
      timing: 38,
    },
    signals: [],
    decisionMakers: [
      {
        name: "Chad Petersen",
        title: "Owner",
        linkedinHandle: "chad-petersen",
      },
    ],
    hiring: {
      newReps30d: 0,
      newReps90d: 1,
      openCanvasserPostings: 0,
      velocity: "cooling",
    },
    recommendedPlay: "Inactive. Re-score after next regional storm.",
    recommendedOpener: "—",
    status: "new",
  },
  {
    id: "acct_meridian",
    name: "Meridian Storm Restoration",
    domain: "meridianrestoration.net",
    city: "Norman",
    state: "OK",
    region: "Oklahoma",
    employeeCount: 18,
    crmTier: 3,
    temperature: "cool",
    compositeScore: 38,
    scoreDelta: -1,
    subscores: {
      opportunity: 30,
      painSignal: 40,
      fit: 45,
      decisionAccess: 30,
      timing: 42,
    },
    signals: [],
    decisionMakers: [],
    hiring: {
      newReps30d: 0,
      newReps90d: 0,
      openCanvasserPostings: 0,
      velocity: "cooling",
    },
    recommendedPlay: "Below 25-rep fit floor. Skip.",
    recommendedOpener: "—",
    status: "passed",
  },
];

// ---- aggregate helpers used by the inbox header ----

export function summarizeAccounts(accounts: Account[]) {
  const hot = accounts.filter((a) => a.temperature === "hot").length;
  const warm = accounts.filter((a) => a.temperature === "warm").length;
  const cool = accounts.filter((a) => a.temperature === "cool").length;
  const newSignals7d = accounts.reduce((sum, a) => {
    const recent = a.signals.filter((s) => {
      const ms = Date.parse(s.capturedAt);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - ms < sevenDays || a.scoreDelta > 0;
    }).length;
    return sum + recent;
  }, 0);
  return { hot, warm, cool, newSignals7d, total: accounts.length };
}

export function temperatureColor(temp: Temperature): {
  bg: string;
  text: string;
  ring: string;
  label: string;
} {
  switch (temp) {
    case "hot":
      return {
        bg: "bg-hot/10",
        text: "text-hot",
        ring: "ring-hot/30",
        label: "HOT",
      };
    case "warm":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-600 dark:text-amber-500",
        ring: "ring-amber-500/30",
        label: "WARM",
      };
    case "cool":
      return {
        bg: "bg-muted",
        text: "text-muted-foreground",
        ring: "ring-border",
        label: "COOL",
      };
  }
}

export function sourceLabel(source: SignalSource): string {
  switch (source) {
    case "noaa-storm-events":
      return "NOAA Storm Events";
    case "indeed-rep-jobs":
      return "Indeed";
    case "ziprecruiter-rep-jobs":
      return "ZipRecruiter";
    case "craigslist-rep-jobs":
      return "Craigslist";
    case "apollo-firmographic":
      return "Apollo";
    case "linkedin-leadership-change":
      return "LinkedIn";
  }
}
