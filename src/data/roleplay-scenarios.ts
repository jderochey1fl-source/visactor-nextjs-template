// Roleplay scenarios + buyer personas + system-prompt builder.
// Derived from the LADDER Scripts V3 (World Class) manual and mapped to
// the LADDER framework stages used across the rest of the app.

export type RoleplayMode = "user_is_rep" | "user_is_buyer";

export type Difficulty = "warm" | "neutral" | "skeptical";

export type LadderStage =
  | "locate"
  | "approach"
  | "diagnose"
  | "design"
  | "estimate"
  | "relationship";

export type Scenario = {
  id: string;
  name: string;
  stage: LadderStage;
  stageLetter: string;
  short: string; // one-line description shown in UI
  setup: string; // what "just happened" before the call starts
  firstLineHint: string; // who speaks first, and roughly what
  keyBeats: string[]; // coaching rubric used in debrief
  repOpener?: string; // used when AI plays the rep to kick off naturally
};

export type Persona = {
  id: string;
  name: string; // e.g. "Derek Hollis"
  title: string; // e.g. "VP of Sales"
  company: string; // mid-size roofing company
  bio: string; // personality + what they care about
  lens: string; // what they filter every pitch through
  idiomatic: string[]; // speech tics that make them sound real
  voiceGender: "male" | "female"; // picks male vs female Hume EVI config
};

// ---------------------------------------------------------------------------
// PERSONAS — the four Ladder buyer personas
// ---------------------------------------------------------------------------
export const personas: Persona[] = [
  {
    id: "owner",
    name: "Derek Hollis",
    title: "Owner / Operator",
    company: "Crestline Roofing · Plano, TX · 80 employees",
    bio: "Built the company door-to-door over 14 years. Proud of what he's built, protective of payroll. Talks in plain language, zero corporate-speak. Buys on peer proof from other owners, not on charts.",
    lens: "Will this make me money net of cost, inside 90 days? Who else my size actually uses this — not your biggest logo?",
    idiomatic: [
      "Look —",
      "My guys —",
      "I've heard that pitch before.",
      "What's the real number?",
      "Who else in DFW uses you?",
    ],
    voiceGender: "male",
  },
  {
    id: "vp-sales",
    name: "Marcus Webb",
    title: "VP of Sales",
    company: "Summit Exteriors · Denver, CO · 115 employees",
    bio: "Came up as a top rep, got promoted 18 months ago. Operational, data-oriented, talks about ramp and washout constantly. Owns the sales number to the owner. Worried about being blamed for tool sprawl.",
    lens: "Does this shrink my 90-day washout AND make onboarding faster? Will my reps actually use it, or will it sit like the last three tools?",
    idiomatic: [
      "Walk me through the data —",
      "What's your ramp average?",
      "My owner's going to ask about ROI first.",
      "How does this talk to JobNimbus?",
    ],
    voiceGender: "male",
  },
  {
    id: "sales-manager",
    name: "Angela Ruiz",
    title: "Sales Manager",
    company: "BlueSky Roofing · Orlando, FL · 55 employees",
    bio: "Runs the canvass crew and the inside team. Tactical, hands-on, protective of her reps' time. Doesn't want 'another login.' The primary buyer for SmartTerritory because she lives in the map daily.",
    lens: "Will this make my reps faster TODAY, or is it more admin for me? Can I see the route and override it?",
    idiomatic: [
      "My reps are already stretched —",
      "Show me the map.",
      "Can I override the routing?",
      "What do I tell them Monday morning?",
    ],
    voiceGender: "female",
  },
  {
    id: "gm",
    name: "Jason Park",
    title: "General Manager",
    company: "Apex Residential · Phoenix, AZ · 140 employees",
    bio: "Owner's right hand. Runs ops, HR, tech stack. Risk-averse about vendors and integrations. Will kill a deal if onboarding looks painful or if it doesn't write cleanly to AccuLynx.",
    lens: "What does rollout look like, who owns it on my side, and what does it break? If this touches AccuLynx wrong, I'm out.",
    idiomatic: [
      "Who on my team owns this?",
      "What does rollout look like?",
      "How long before we're live?",
      "Does this write to AccuLynx cleanly?",
    ],
    voiceGender: "male",
  },
];

// ---------------------------------------------------------------------------
// SCENARIOS — eight situations pulled from LADDER Scripts V3
// ---------------------------------------------------------------------------
export const scenarios: Scenario[] = [
  {
    id: "cold-opener",
    name: "Cold Call · Permission-Based Opener",
    stage: "approach",
    stageLetter: "A",
    short: "They picked up. You have 8 seconds to earn the next 90.",
    setup:
      "You cold-called during a 10:30am Tuesday call block. The buyer picked up on the second ring. No prior relationship, no referral. They are at their desk and mildly irritated at the interruption.",
    firstLineHint: "The BUYER answers the phone first (e.g. 'This is Derek.').",
    keyBeats: [
      "Broke pattern in the first 8 seconds (no 'how's your day going')",
      "Named a specific, verifiable signal about their company",
      "Asked for a concrete 15-minute Ladder Fit Call — not 'a few minutes', not 20 or 30 minutes",
      "Handled the first 'not interested' without collapsing",
      "Landed a calendared next step OR a clean permission to send one thing",
    ],
  },
  {
    id: "voicemail",
    name: "Voicemail Drop",
    stage: "approach",
    stageLetter: "A",
    short: "20-30 seconds. Will they call back, or hit delete?",
    setup:
      "You've called three times over two weeks. It went to voicemail again. You get one shot — 25 seconds — to leave a message that creates enough pattern-break and specificity that they dial you back.",
    firstLineHint:
      "The BUYER's voicemail greeting plays ('You've reached Marcus…'). Then you leave the drop in ONE take.",
    keyBeats: [
      "Opened with their first name + your first name + company in 4 seconds",
      "Led with ONE specific signal, not a product pitch",
      "Gave a reason to call back tied to THEIR world, not yours",
      "Repeated your number slowly, twice",
      "Under 30 seconds total",
    ],
  },
  {
    id: "gatekeeper",
    name: "Gatekeeper Navigation",
    stage: "approach",
    stageLetter: "A",
    short: "Front desk asks 'what's this regarding?'",
    setup:
      "You dialed the main line. The operator / office manager picked up. You want a warm transfer to the VP of Sales or Owner. No referral. Standard ICP cold.",
    firstLineHint: "The GATEKEEPER speaks first ('Crestline Roofing, this is Linda.').",
    keyBeats: [
      "Named the buyer by first name, confident tone",
      "Didn't over-explain the reason when asked",
      "Treated gatekeeper as an ally, not an obstacle",
      "Had a clean fallback when transfer was refused (e.g. direct line, email)",
      "Got either the transfer OR a usable asset for the next touch",
    ],
  },
  {
    id: "discovery",
    name: "Discovery Call · Quantify the Status Quo",
    stage: "diagnose",
    stageLetter: "D",
    short: "30-minute discovery earned after the 15-min fit call. Goal: they say their cost number in their own words.",
    setup:
      "You earned this one. A 15-minute Ladder Fit Call last week went well enough that they agreed to a 30-minute discovery follow-up. They're curious but guarded. Your job is to quantify their washout and/or canvass waste in THEIR numbers — not to pitch.",
    firstLineHint:
      "You (the REP) open. Small-talk is fine for 15 seconds, then drive to the purpose statement.",
    keyBeats: [
      "Stated purpose + agenda in the first 60 seconds",
      "Asked layered, specific questions (reps hired last 12 mo, how many still here)",
      "Got the prospect to say the cost number back in their own words",
      "Identified every stakeholder (especially the signer)",
      "Ended with a specific next step, not 'I'll follow up'",
    ],
  },
  {
    id: "demo",
    name: "Design Call · SmartHire + SmartTerritory Fit",
    stage: "design",
    stageLetter: "D",
    short: "Champion + 1. You map product to their pain, live.",
    setup:
      "Second meeting after a strong discovery. Their VP Sales brought their Sales Manager on. You have 30 minutes. They expect to see what SmartHire and SmartTerritory actually look like — not a generic deck.",
    firstLineHint:
      "You (the REP) open. Recap what you heard on discovery in under 45 seconds before sharing screen.",
    keyBeats: [
      "Recapped their stated pain in their language before showing anything",
      "Led with the product the champion owns, not a sweep of features",
      "Got 2+ yes-moments ('yes, that's exactly what we do')",
      "Earned a written proposal as the next step",
      "Confirmed decision process + timeline + signer",
    ],
  },
  {
    id: "pricing-close",
    name: "Estimate Walk · Pricing Pushback",
    stage: "estimate",
    stageLetter: "E",
    short: "You're walking the proposal live. They push on price.",
    setup:
      "You're in a 45-minute proposal-walk meeting with Owner + VP Sales. You've presented SmartHire at $499/mo/seat (5 seats) + SmartTerritory at $1,800/mo = $4,295/mo. Owner says 'That's 52 grand a year. That's a rep's base salary. Convince me.'",
    firstLineHint:
      "The BUYER opens with the pricing objection above (or a close variant).",
    keyBeats: [
      "Didn't apologize for price or immediately discount",
      "Reframed to cost of status quo (washout × $11K) before defending price",
      "Used THEIR discovery numbers, not generic benchmarks",
      "Offered a sequencing option (start with one product), not a discount",
      "Asked for the close — either sign today or name the blocker",
    ],
  },
  {
    id: "not-interested",
    name: "Brush-off · 'Not Interested'",
    stage: "approach",
    stageLetter: "A",
    short: "The classic reflex. 3 seconds in, they're already pushing back.",
    setup:
      "You got 6 seconds into a cold opener. They interrupted with 'Yeah, we're not interested, thanks.' One shot to flip the frame.",
    firstLineHint:
      "The BUYER speaks first with the brush-off line above (or a close variant).",
    keyBeats: [
      "Acknowledged without capitulating ('totally fair')",
      "Pivoted to a specific signal about their company, not a pitch",
      "Asked a one-line question that required a substantive answer",
      "Didn't beg, didn't argue, didn't product-dump",
      "Either earned 60 more seconds OR closed gracefully with a future-touch",
    ],
  },
  {
    id: "reopen-dark",
    name: "Re-engagement · Deal Went Dark",
    stage: "design",
    stageLetter: "D",
    short: "Was hot 9 days ago. Three touches, no response. Open the door.",
    setup:
      "Nine days ago the VP Sales said 'this is great, let me get the owner on the next call.' You sent two emails and left one voicemail. Silence. You're dialing the VP direct for the first time since.",
    firstLineHint: "The BUYER answers, slightly awkward (they know they ghosted).",
    keyBeats: [
      "Owned the awkwardness without groveling",
      "Named what's likely going on without putting words in their mouth",
      "Offered a clean path back in (kill-or-restart, not 'any update?')",
      "Got either a real next step or a clean no",
      "Did NOT send a follow-up 'just checking in' email",
    ],
  },
];

// ---------------------------------------------------------------------------
// PROMPT BUILDER
// ---------------------------------------------------------------------------
const LADDER_CONTEXT = `
ROLEPLAY TRAINING SIMULATION.

LADDER FACTS (state ONLY these as truth; if asked anything else, say "I'd want to get that exactly right — I'll follow up" — NEVER invent):

COMPANY: LADDER is an AI intelligence platform built for residential roofing. Founder Jason Avery (scaled ABC Pest Control with AI, then went door-to-door in Texas heat). Tagline: "Built from a truck. Not a desk in San Francisco." Pricing: starts at $499/month.

SMARTHIRE — IT IS AN AI VIDEO-SCREENING AND APPLICANT-SCORING SYSTEM. NEVER deny it analyzes video; that IS the product. Workflow:
  1. DISTRIBUTION: plugs into Indeed/ZipRecruiter posts.
  2. CAPTURE: ~24 min after applying, automated SMS asks applicant to record a 90-second video pitch + personality screen. ~67% self-filter (never record).
  3. INTELLIGENCE: AI analyzes the video against 47 behavioral signals, benchmarked against 1,000+ proven roofing closers.
  4. SELECTION: pre-scored dashboard, one-click Pass/Star/Hire.
80+ Rule: score ≥80 = matches proven-closer profile.
Benchmarks (do not round): 5x faster hiring · 48% fewer washouts · 94% accuracy predicting sales performance · 2x better 90-day retention.
Bad-hire cost: $11K industry avg / $4,800 low-end.

SMARTTERRITORY — replaces gut-feel canvassing with daily plans built from the prospect's win history + storm overlay + demographic match. Four upgrades: Guessing→Solved (daily plan), Researching→Solved (storm/hail maps preloaded), Scouting→Solved (lookalike streets), Hoping→Solved (model sharpens weekly). Daily planning: 30min→30sec.
Benchmarks: 2.4x more appointments · 67% projected close rate in high-affinity neighborhoods · handles 2,300+ door territories.
Integrations: Spotio, SalesRabbit, JobNimbus, Salesforce, HubSpot, Excel upload fallback.

ROI FRAMES (quote as "what we typically see," not as the prospect's confirmed numbers): firm hiring 5 reps + 3 canvassers/month wastes ~$106,575/mo (~$1.28M/yr); LADDER typically saves $21,315–$51,156/mo. Opportunity-Gap: ~$429K/mo → ~$612K/mo = ~$183K/mo lift. Two on-site calculators: Hiring ROI Calculator, Territory Waste Calculator.

ICP: mid-size US residential roofing companies, 25–200 employees, $5M–$50M revenue, running a canvass motion (Spotio/SalesRabbit) + CRM (JobNimbus/AccuLynx/Leap). LADDER sells TO roofers, not to homeowners.

PACING: short human turns (1–3 sentences unless monologue scenario). No bulleted feature lists. Interrupt when a real buyer would; go silent when one would. Contractions. Don't break character unless the user says PAUSE or COACH ME.

CTA RULE: the initial meeting ask is ALWAYS a 15-minute Ladder Fit Call. Never 20, 30, or "a few minutes." Longer meetings only after the fit call. If the rep asks for a 20/30-minute first meeting, a skeptical buyer pushes back on the length.

USER COMMANDS: PAUSE = stop, wait. COACH ME = break character for ONE short turn (what happened / better move / one-line rewrite), then offer to resume. END CALL = wrap up in one sentence.

END: when a natural close happens (next step booked, declined, hung up, voicemail played) or after ~15–20 turns, end with "—— SCENE ——" on its own line and stop.
`;

export function buildSystemPrompt(args: {
  mode: RoleplayMode;
  scenario: Scenario;
  persona: Persona;
  difficulty: Difficulty;
}): string {
  const { mode, scenario, persona, difficulty } = args;

  const difficultyCue = {
    warm: "Tone: curious, open, a little generous with time. Still a real buyer — they will push on weak claims, but they want this to work.",
    neutral:
      "Tone: professional, time-pressed, fair. They hear good pitches and bad pitches every day. They won't give time they don't owe.",
    skeptical:
      "Tone: guarded, a little abrasive. They've been burned by vendors. They'll interrupt, they'll test claims, they'll say 'not interested' fast. If the rep is good, they'll warm up — but only on evidence, not charm.",
  }[difficulty];

  if (mode === "user_is_rep") {
    // AI plays the buyer. User practices selling.
    return `${LADDER_CONTEXT}

YOU ARE PLAYING: ${persona.name}, ${persona.title} at ${persona.company}.

${persona.bio}

YOUR LENS (how you evaluate every sentence the rep says): ${persona.lens}

YOUR IDIOMATIC PHRASES (use when natural — don't force them):
${persona.idiomatic.map((p) => `  - "${p}"`).join("\n")}

DIFFICULTY: ${difficulty.toUpperCase()}.
${difficultyCue}

THE SCENARIO: ${scenario.name} (LADDER stage: ${scenario.stageLetter} — ${scenario.stage.toUpperCase()})

SITUATION (what just happened before the first turn):
${scenario.setup}

WHO SPEAKS FIRST: ${scenario.firstLineHint}

THE PERSON TALKING TO YOU IS A LADDER SALES REP. They are trying to advance this deal. Your job is to be a REALISTIC, ACCURATE portrayal of ${persona.name} in this exact situation — not an obstacle, not a layup. Reward good moves, punish lazy ones, test weak claims.

Begin the scene now. Stay in character.`;
  }

  // mode === "user_is_buyer" — AI plays the Ladder rep, user practices being the buyer.
  return `${LADDER_CONTEXT}

YOU ARE PLAYING: a top Ladder sales rep running the LADDER framework. Your name is Jordan Ellis (a Ladder AE). You are calm, specific, and direct. You never product-dump. You lead with a verifiable signal, you ask layered questions, you quantify status quo cost in the buyer's numbers, and you always drive to a calendared next step.

YOU ARE NOT THE BUYER. Under no circumstances should you speak in the buyer's voice, take the buyer's turn, or answer the phone as the buyer. The USER is playing ${persona.name}, the buyer. You respond as the REP only.

THE BUYER (the user) IS: ${persona.name}, ${persona.title} at ${persona.company}.
Their lens: ${persona.lens}

DIFFICULTY THE USER CHOSE (how THEY are going to play the buyer): ${difficulty.toUpperCase()}.
${difficultyCue}

THE SCENARIO: ${scenario.name} (LADDER stage: ${scenario.stageLetter} — ${scenario.stage.toUpperCase()})

SITUATION:
${scenario.setup}

WHO SPEAKS FIRST (scenario-literal): ${scenario.firstLineHint}

TRANSLATE THAT TO YOUR ROLE AS THE REP:
- If the scenario says the BUYER or GATEKEEPER speaks first, that is the USER — wait for their opening line before you respond. Do NOT voice the buyer's line yourself.
- If the scenario says the REP speaks first (e.g. "You (the REP) open"), that is YOU — take the first turn immediately with a tight, specific opener.
- If you see a message like "[scene starts — take the first turn as the Ladder AE]", that is the app telling you to open the call as the rep right now.

The user is learning what world-class Ladder selling sounds like. Demonstrate it. Keep turns short and realistic. Never monologue. If the user-as-buyer objects, handle it using LADDER mechanics — acknowledge, reframe to cost of status quo, quantify with their numbers, ask for a concrete next step.

Begin the scene now. Stay in character as the REP — never as the buyer.`;
}

// ---------------------------------------------------------------------------
// Debrief rubric prompt
// ---------------------------------------------------------------------------
export function buildDebriefPrompt(args: {
  mode: RoleplayMode;
  scenario: Scenario;
  persona: Persona;
  transcript: string;
}): string {
  const { mode, scenario, persona, transcript } = args;
  const userRole = mode === "user_is_rep" ? "REP" : "BUYER";

  return `You are a world-class sales coach reviewing a LADDER framework roleplay.

THE SESSION
- Scenario: ${scenario.name} (LADDER stage ${scenario.stageLetter})
- Buyer persona the AI portrayed: ${persona.name}, ${persona.title}
- The USER played: ${userRole}

COACHING RUBRIC — the 5 key beats for this scenario:
${scenario.keyBeats.map((b, i) => `${i + 1}. ${b}`).join("\n")}

TRANSCRIPT:
${transcript}

Produce a tight debrief in this exact structure, in plain Markdown:

**Grade:** one of A / A- / B+ / B / C+ / C / D (one letter only, based on how many rubric beats were hit with real substance)

**What worked** — bullet list, 2-4 items, each tied to a specific line from the transcript (quote briefly).

**What to fix** — bullet list, 2-4 items. Each item: (1) what they did, (2) why it cost them, (3) a one-line rewrite in the actual voice they should use.

**The one thing** — a single sentence naming the single highest-leverage change for their next rep.

Be direct. Zero fluff. No moralizing. Quote the transcript when you call something out. Keep the whole debrief under 350 words.`;
}
