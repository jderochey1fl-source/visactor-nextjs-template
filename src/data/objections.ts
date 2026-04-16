import type { Objection } from "@/types/types";

export const objections: Objection[] = [
  {
    id: "OBJ-001",
    category: "price",
    title: "Your price is too high",
    quote: "Your guy down the street is $4,000 less.",
    whyItHappens:
      "The prospect has been anchored on a stripped-down scope or a lowball bid. They don't yet see the delta in materials, warranty, install quality, or crew.",
    reframe:
      "Price is a number. Cost is what you actually pay over time. The cheaper bid almost never installs the same system — it's apples to something else.",
    script:
      "Totally fair to compare. Can I ask — does their bid include decking replacement as needed, ice & water in the valleys, synthetic underlayment, and the manufacturer-backed 50-year system warranty? Because if it doesn't, the $4,000 gap is the delta between those two systems — not between two companies doing the same job.",
    closingMove:
      "Let's put both bids side by side line-for-line. If theirs truly matches ours apples-to-apples, I'll meet their number. Fair?",
  },
  {
    id: "OBJ-002",
    category: "timing",
    title: "We need to think about it",
    quote: "Let us sleep on it and we'll get back to you.",
    whyItHappens:
      "Either (a) they don't have a real objection but haven't been given a reason to act, or (b) there's an unspoken concern — usually money, spouse alignment, or trust — they're too polite to name.",
    reframe:
      "\"Think about it\" isn't a decision. Name the actual concern so you can solve it, not defer it.",
    script:
      "I hear you — this isn't a small decision. Most folks who tell me they want to think about it are really weighing one of three things: the investment, whether the timing works for the family, or whether we're the right crew. Which of those is closest for you?",
    closingMove:
      "If they name it, you solve it now. If they don't, schedule a specific time — 48 hours — for a decision call. Never leave it open.",
  },
  {
    id: "OBJ-003",
    category: "spouse",
    title: "I need to talk to my spouse",
    quote: "My wife/husband isn't here — I need to run it by them.",
    whyItHappens:
      "Legitimate 60% of the time. The other 40% it's a polite delay tactic. Either way, never present without both decision-makers present — this is a prevention problem, not an objection problem.",
    reframe:
      "Great — decisions this size should be made together. Let's not make you play telephone.",
    script:
      "Absolutely, this is a both-of-you decision. Rather than me leave a folder and hope it gets translated right, can we get them on a quick 10-minute call right now? Or I'll come back tomorrow evening when you're both home — whichever works.",
    closingMove:
      "Book the re-present with both present. Do NOT leave the written estimate as a drop-off.",
  },
  {
    id: "OBJ-004",
    category: "trust",
    title: "I've never heard of your company",
    quote: "How do I know you'll still be here when I need a warranty call?",
    whyItHappens:
      "Storm-chaser PTSD. They've seen fly-by-night roofers. They need proof of permanence, not sales language.",
    reframe:
      "Trust is earned with specifics, not adjectives. Show don't tell.",
    script:
      "Completely fair — there are a lot of roofers who show up after a storm and disappear. Three things that matter: we've been licensed at this address since [year]; here's our Google reviews pulled up right now — that's [N] reviews averaging [X] stars; and the warranty isn't mine, it's the manufacturer's — they stand behind it whether I'm here or not. Want me to show you three jobs we installed in this zip code last year?",
    closingMove:
      "Open Google Maps, show three nearby installs you can drive them past. Local proof crushes skepticism.",
  },
  {
    id: "OBJ-005",
    category: "insurance",
    title: "I'm waiting on the adjuster",
    quote: "The insurance company hasn't approved the full scope yet.",
    whyItHappens:
      "Adjuster lowballed or missed line items. The homeowner feels stuck between us and them.",
    reframe:
      "You don't work for the insurance company — you work for the homeowner. Your job is to get them paid fairly for the damage they actually have.",
    script:
      "You don't have to fight them — that's what we do. I'll prepare a supplement packet with photos, measurements, and Xactimate-aligned line items for the things they missed. We meet the adjuster on-site, walk the roof together, and 8 out of 10 times they approve it on the spot. You don't write a bigger check — the carrier does.",
    closingMove:
      "Book the re-inspection with the adjuster THIS week. Momentum dies in insurance delays.",
  },
  {
    id: "OBJ-006",
    category: "competitor",
    title: "We're getting other bids",
    quote: "We're getting three bids before we decide.",
    whyItHappens:
      "Responsible homeowner behavior, often HOA-mandated. Not a real objection — a process. Your job is to be the bid that sets the standard the others are measured against.",
    reframe:
      "Fine. Be the reference bid. Go so thorough and specific they have nothing to compare.",
    script:
      "Smart — I'd do the same. Two asks: first, can I be the last bid you see? The detail in ours usually sets the bar, and the other bids tend to collapse against it. Second, when you see the others, send me theirs — I'll tell you exactly where their scope is thinner. You'll end up with a better roof either way.",
    closingMove:
      "Set the next-step date. 'Let's talk Thursday after you've seen the other two.' Lock the callback.",
  },
  {
    id: "OBJ-007",
    category: "process",
    title: "Can you just drop off the estimate?",
    quote: "Just leave the estimate and I'll call you if we're interested.",
    whyItHappens:
      "They're trying to avoid a sales conversation, which means the conversation didn't build enough value. This is a design failure, not an objection — but you can still recover.",
    reframe:
      "An estimate without a walkthrough is a piece of paper. An estimate with a story is a decision.",
    script:
      "I could — but I'd be doing you a disservice. A written estimate shows numbers, not the why behind them. Twenty minutes side-by-side at your kitchen table and you'll actually understand what you're buying and why it's priced the way it is. When does your schedule work — evening or weekend?",
    closingMove:
      "If they insist: send the estimate AND schedule a 15-min call to walk it live. Never just drop.",
  },
  {
    id: "OBJ-008",
    category: "timing",
    title: "We'll do it next year",
    quote: "Our roof is fine for another year or two.",
    whyItHappens:
      "Either (a) they don't see urgency, (b) they can't afford it right now, or (c) they hope the problem self-resolves. The decision frame is short-term thinking vs. total cost.",
    reframe:
      "Roofs don't get cheaper to replace. They get more expensive — materials, labor, and the damage underneath.",
    script:
      "I hear you, and I'd never pressure you into a roof you don't need. But here's the math — deferring a replacement one year typically costs 6–9% more in materials and labor, and that's before any interior damage from a bad season. If the budget's the issue, let's talk about financing that lets you stop the damage clock while spreading the cost. That's a different conversation than 'do we spend $X today?'",
    closingMove:
      "Introduce financing as a timing-shift, not a price-shift. Re-anchor: 'Stop the damage now, pay for it over time.'",
  },
  {
    id: "OBJ-009",
    category: "trust",
    title: "Are you a storm chaser?",
    quote: "You knocked on my door right after the storm — are you even local?",
    whyItHappens:
      "Valid skepticism. The homeowner wants to confirm you'll be around for warranty claims, not just to write a check.",
    reframe:
      "Lean in. Don't apologize for canvassing — professionalize it.",
    script:
      "Totally fair question. Yes, we canvass after storms — because FEMA and the insurance industry say 60% of hail damage is missed by homeowners until it leaks 6 months later. No, we're not fly-by-night — our office is [address], we've been here since [year], and every warranty claim comes through the same local number you dial today. Would it help if I showed you three other jobs we've done in this neighborhood you can drive past?",
    closingMove:
      "Immediately pull up Google Maps with pins on recent local installs. Permanence is proven visually.",
  },
  {
    id: "OBJ-010",
    category: "price",
    title: "Can you come down on price?",
    quote: "Is there any flexibility on the number?",
    whyItHappens:
      "Natural negotiation reflex. Most people ask. Some mean it. Your job: don't discount mindlessly — trade.",
    reframe:
      "Discounts teach the market your price isn't real. Trade instead.",
    script:
      "I never discount — but I trade. If you can help me three ways, I can sharpen this: sign today so I can lock in today's material pricing, let us put a sign in your yard for 30 days, and introduce us to two neighbors. That's roughly [$X] of value to us, so I can meet you at [price]. Deal?",
    closingMove:
      "Lead with: 'I never discount — but I trade.' It instantly reframes the entire negotiation.",
  },
];

export const objectionCategories: {
  key: Objection["category"];
  label: string;
  blurb: string;
}[] = [
  { key: "price", label: "Price", blurb: "Reframe price vs. cost" },
  { key: "timing", label: "Timing", blurb: "Urgency without pressure" },
  { key: "trust", label: "Trust", blurb: "Prove permanence" },
  { key: "spouse", label: "Spouse / Partner", blurb: "Two-decider frame" },
  { key: "insurance", label: "Insurance", blurb: "Work the claim" },
  { key: "competitor", label: "Competitor", blurb: "Be the reference bid" },
  { key: "process", label: "Process", blurb: "Never just drop an estimate" },
];
