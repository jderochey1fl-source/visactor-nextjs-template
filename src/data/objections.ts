import type { Objection, ObjectionCategory } from "@/types/types";

/**
 * Ladder-specific objection library. Every objection is one a Ladder
 * sales rep would hear from a roofing-company Owner, VP Sales, Sales
 * Manager, or GM evaluating SmartHire and/or SmartTerritory.
 */
export const objections: Objection[] = [
  {
    id: "OBJ-001",
    category: "price",
    title: "$499+/mo is a lot for hiring software",
    quote: "$499 a seat, plus SmartTerritory on top? That's real money.",
    whyItHappens:
      "They're anchoring on the sticker price without running it against their actual washout cost. Most roofing companies have never math-ed their bad-hire spend line by line.",
    reframe:
      "Price is a number. Cost is what bad hires and dead-zone knocks are already billing you every month — whether you see it or not.",
    script:
      "Fair. Let me make the math boring for a second. Industry 90-day washout on roofing sales hires is 55-65%. Per washout — wasted recruiting, onboarding, ramp salary — is roughly $11K. If you hired 8 reps last year and lost 4 of them, that's $44K you already spent and didn't book. SmartHire runs about $6K a year for that same seat. One avoided washout covers it.",
    closingMove:
      "Pull up their actual hire count from the last 12 months and run it live in the ROI calculator. Numbers close where pitches don't.",
  },
  {
    id: "OBJ-002",
    category: "timing",
    title: "We'll look at this next quarter",
    quote: "Storm season just hit, we can't change anything right now.",
    whyItHappens:
      "Legitimate surface concern — peak season is peak operational load. But the real cost: they're hiring fastest and wasting canvass time hardest during the exact window they say they don't have time for Ladder.",
    reframe:
      "Storm season is exactly when bad hiring and dead-zone knocks cost the most. Waiting is the expensive option, not the safe one.",
    script:
      "That's the moment SmartHire and SmartTerritory save the most — you're hiring under pressure and your canvassers are burning daylight right now. Onboarding is 10 days. If we start Monday, you're live before your May push. If we wait till Q3, you've already paid for another bad hire cycle and missed the storm window.",
    closingMove:
      "Offer a Monday kickoff and a specific live date: 'April 28 you're live.' Concrete beats vague.",
  },
  {
    id: "OBJ-003",
    category: "authority",
    title: "My GM / co-owner needs to be on this",
    quote: "My GM handles canvass routes — I can't sign this without him.",
    whyItHappens:
      "Real 70% of the time. The other 30% it's a soft brush-off. Either way, the answer is the same: get both decision-makers on one call, don't play telephone.",
    reframe:
      "Decisions this size should be made together. Don't make me pitch it twice and hope it translates right.",
    script:
      "Completely — SmartTerritory is only as good as the GM running canvass, so he should be in the room. Rather than me send a deck and hope it survives the handoff, can we get the three of us on a 15-minute call this week? I'll run the hiring-waste and knocks-per-close math on your actual numbers, he'll see the tool, and you'll leave with a clear yes or no.",
    closingMove:
      "Book the joint call before you leave the current one. Do NOT email the deck and wait.",
  },
  {
    id: "OBJ-004",
    category: "trust",
    title: "I've never heard of Ladder",
    quote: "You're a newer company — how do I know you'll be around in 2 years?",
    whyItHappens:
      "Every roofing owner has been burned by a vendor who disappeared mid-contract. They need proof of permanence, not adjectives.",
    reframe:
      "Trust is earned with specifics, not with a brand story. Show the work.",
    script:
      "Fair question. Three specifics: we're funded through 2028, our renewal rate on mid-size roofers is 94%, and three companies your size in TX will take a reference call this week — Apex, Summit, and Crestline's GM. I'll introduce you to whichever one looks closest to your business. You hear it from them, not from me.",
    closingMove:
      "Offer the reference call by name, before they ask. Warm-intro the one most relevant to their situation.",
  },
  {
    id: "OBJ-005",
    category: "integration",
    title: "Will this actually work with our stack?",
    quote:
      "We're on Spotio and JobNimbus already. The last 'integration' took 4 months.",
    whyItHappens:
      "They've been burned by vendors whose 'integrations' were a zap and a prayer. They need to see the integration work, not hear that it does.",
    reframe:
      "The integration question isn't theoretical — it's testable. Let's test it.",
    script:
      "SmartTerritory pushes daily priority routes directly into Spotio — same app your canvassers open every morning, no training. SmartHire writes hires into JobNimbus with Owner, Stage, and Fit Score. I can show both working end-to-end in 10 minutes on a screen share. If either doesn't fit your actual setup, I'll tell you straight and we stop.",
    closingMove:
      "Offer the live integration demo this week. Nothing kills integration FUD faster than watching it work.",
  },
  {
    id: "OBJ-006",
    category: "competitor",
    title: "We're also looking at [competitor]",
    quote: "We're demoing a couple of other hiring tools this month.",
    whyItHappens:
      "Responsible buyer behavior, not a real objection. Your job: be the proposal the others are measured against.",
    reframe:
      "Good. Be the reference proposal. The deeper ours goes, the weaker theirs will feel.",
    script:
      "Smart — I'd do the same. Two asks: first, let ours be the last one you evaluate. The retention math and the integration work we put on paper usually sets the bar. Second, when you see the others, send me what they quote and what they promise on integration — I'll tell you exactly where their proposal is thin. Either way you end up with a better decision.",
    closingMove:
      "Lock a specific follow-up date after their other evals. 'Let's talk Thursday after you've seen them both.'",
  },
  {
    id: "OBJ-007",
    category: "process",
    title: "Just send us the pricing",
    quote: "Can you just email me the pricing and I'll review internally?",
    whyItHappens:
      "They're trying to avoid the conversation because the earlier call didn't build enough value. Emailed pricing = dead pricing.",
    reframe:
      "An emailed quote is a number without a reason. A walked quote is a decision.",
    script:
      "I could — but I'd be doing you a disservice. The number on its own doesn't show the washout-cost math or what the SmartTerritory zip overlay will actually look like on your neighborhoods. 15 minutes side-by-side and you'll have the answer, not just the price. What evening or early morning works this week?",
    closingMove:
      "If they insist, send the pricing AND schedule a 15-min walkthrough. Never just drop.",
  },
  {
    id: "OBJ-008",
    category: "timing",
    title: "We'll revisit in a few months",
    quote: "Circle back with us in the fall.",
    whyItHappens:
      "Either they don't see urgency, they can't prioritize it this quarter, or they hope the problem resolves itself. Cost of delay is usually invisible to them.",
    reframe:
      "Roofing hire costs and dead-zone canvass time don't get cheaper — they compound.",
    script:
      "I hear you, and I won't chase. But the math runs the other way: every month you wait, you hire another 1-2 reps who have a 60% chance of washing out, and your canvassers spend another 22 working days on doors that won't buy. A 3-month delay typically costs a mid-size roofer $18-30K in washout and lost canvass hours. If that's okay, we wait. If it's not, let's find a 15-minute window this week.",
    closingMove:
      "Quantify the delay cost in THEIR numbers, then re-ask for a specific 15-minute slot.",
  },
  {
    id: "OBJ-009",
    category: "trust",
    title: "How do we know this actually works?",
    quote:
      "Every vendor says they'll fix hiring. What makes you different?",
    whyItHappens:
      "They've been sold 'revolutionary' platforms before. They need evidence, not adjectives.",
    reframe:
      "Lean into the fatigue. Don't argue you're different — prove it with numbers they can verify.",
    script:
      "Fatigue is fair. Three things, all verifiable: SmartHire customer-average 90-day washout drops from 58% to 27% in Q1 — that's from our monthly health data, not a case study. SmartTerritory reduces knocks-per-close by 32% in week two on average. And we don't pitch testimonials — I'll set up a call this week with a peer roofer your size so you hear the number directly from them.",
    closingMove:
      "Immediately offer the peer reference call with a named company at their size and motion.",
  },
  {
    id: "OBJ-010",
    category: "price",
    title: "Can you discount?",
    quote: "If we sign today, can you come down 20%?",
    whyItHappens:
      "Natural negotiation reflex. Most owners ask. Some mean it. Your job: don't discount — trade.",
    reframe:
      "Discounts teach the market your price isn't real. Trade instead.",
    script:
      "I never discount — but I trade. If you can help me three ways, I can sharpen this: sign a 12-month instead of month-to-month, let us use your 90-day results as a named case study, and introduce us to two peer roofers in TX or OK. That's roughly $9K of value on our end, so I can meet you at [adjusted number]. Deal?",
    closingMove:
      "Lead with 'I never discount — but I trade.' Reframes the entire negotiation in one line.",
  },
];

export const objectionCategories: {
  key: ObjectionCategory;
  label: string;
  blurb: string;
}[] = [
  { key: "price", label: "Price", blurb: "Reframe price vs. washout cost" },
  { key: "timing", label: "Timing", blurb: "Cost of delay, not pressure" },
  { key: "trust", label: "Trust", blurb: "Specifics over adjectives" },
  {
    key: "authority",
    label: "Authority",
    blurb: "Co-decider alignment (Owner + GM)",
  },
  {
    key: "integration",
    label: "Integration",
    blurb: "Works with Spotio, JobNimbus, AccuLynx",
  },
  { key: "competitor", label: "Competitor", blurb: "Be the reference proposal" },
  { key: "process", label: "Process", blurb: "Never just email pricing" },
];
