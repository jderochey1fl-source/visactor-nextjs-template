export type PromptTemplateCategory =
  | "Post-Call Debrief"
  | "Cold Outreach"
  | "Pipeline Management"
  | "Pre-Call Research"
  | "Follow-Up"
  | "Forecasting"
  | "Objections"
  | "Campaign Mastery"
  | "Weekly Review";

export type PromptTemplate = {
  id: string;
  title: string;
  category: PromptTemplateCategory;
  description: string;
  source: string;
  // {placeholder} tokens are where the rep pastes or types concrete inputs
  prompt: string;
};

export const promptTemplates: PromptTemplate[] = [
  // Post-Call Debrief
  {
    id: "post-call-debrief",
    title: "Post-Call Debrief — 3-Minute Extract",
    category: "Post-Call Debrief",
    description:
      "Run this after every call. Surfaces new objections, competitor intel, interest signals, and a rewrite of your worst moment.",
    source: "Module — AI Application (Post-Call)",
    prompt: `Here are my notes from a sales call today: {paste your call notes}.

Extract:
(1) Any new objections I haven't heard before.
(2) Any competitor mentions and what was said.
(3) Any signals that predicted this prospect's level of interest.
(4) One thing I should have said differently.

Save every output in a running document I can review weekly.`,
  },

  // Weekly Review
  {
    id: "weekly-activity-review",
    title: "Weekly Activity / Outcome Pattern Review",
    category: "Weekly Review",
    description:
      "Drop in your week's activity data and outcomes. Claude finds the patterns, wasted time, and what to double down on.",
    source: "Module — AI Application (Weekly Review)",
    prompt: `Here is my sales activity data from this week:
{paste activity data — calls, emails, demos, meetings}

Here are the outcomes:
{paste outcomes — booked, lost, advanced, stalled}

What patterns do you see? Where am I spending time that is NOT producing results? What should I do more of based on this data?`,
  },

  // Cold Outreach
  {
    id: "subject-line-variants",
    title: "Cold Email — Subject Line Variants",
    category: "Cold Outreach",
    description:
      "10 subject line variations for a specific cold email target.",
    source: "Module 1 — Cold Outreach · Lesson 2",
    prompt: `Write 10 subject line variations for a cold email to {title} at {company type / size / industry}.

Context:
- They recently {trigger event / signal}.
- I sell {product / outcome}.

Rules:
- Under 6 words each.
- No clickbait, no emojis, no ALL CAPS.
- Mix: curiosity, specificity, referral-style, pattern-interrupt.`,
  },
  {
    id: "full-cold-email",
    title: "Cold Email — Full Draft",
    category: "Cold Outreach",
    description:
      "80-100 word cold email with signal-first opening and single-outcome value statement.",
    source: "Module 1 — Cold Outreach · Lesson 2",
    prompt: `Write a cold email to a {title} at a {company size} {industry} company that just {trigger event}.

I sell {product} that {primary outcome / metric}.

Rules:
- 80-100 words.
- Signal-first opening (reference the trigger, not me).
- Single outcome value statement (pick the strongest metric).
- CTA for a 15-minute call.
- No marketing language.
- Do NOT start with "I".`,
  },
  {
    id: "ab-test-openings",
    title: "Cold Email — A/B Testable Openings",
    category: "Cold Outreach",
    description:
      "Generate testable opening variations against a control email.",
    source: "Module 1 — Cold Outreach · Lesson 4",
    prompt: `I have a cold email with a {current reply rate}% reply rate and this opening:

"{paste current opening line}"

Give me 5 alternative opening lines to A/B test. Each should:
- Use a different angle (signal, peer reference, question, contrarian claim, micro-specific compliment).
- Be under 25 words.
- Keep the rest of the email intact.

For each, explain the hypothesis: why it might beat the control.`,
  },

  // Pipeline Management
  {
    id: "coverage-ratio-monitor",
    title: "Pipeline Coverage Ratio Monitor",
    category: "Pipeline Management",
    description:
      "Check current quarter pipeline vs quota and alert if coverage falls below 3x.",
    source: "Module 2 — Pipeline Management · Lesson 1",
    prompt: `Show me my current quarter pipeline value vs my quota and alert me if coverage falls below 3x.

Current pipeline (deal, stage, amount, close date):
{paste deals}

Quota for the quarter: {quota amount}

Output:
- Total weighted pipeline value.
- Coverage ratio.
- If under 3x, list the gap and 3 concrete actions to close it this week.`,
  },
  {
    id: "stalled-deals",
    title: "Stalled Deals / Stage Velocity",
    category: "Pipeline Management",
    description:
      "Find deals stuck in stage 14+ days with last activity and next scheduled touch.",
    source: "Module 2 — Pipeline Management · Lesson 1",
    prompt: `Show me all deals that have been in the same stage for more than 14 days.

Deals:
{paste deals — name, stage, days in stage, last activity date, next scheduled touch}

For each stalled deal:
- Diagnose the most likely reason it's stalled (in 1 sentence).
- Recommend the ONE next action that will either advance or disqualify it.
- Score re-engagement priority: HOT / WARM / KILL.`,
  },

  // Pre-Call Research
  {
    id: "company-pre-call-research",
    title: "Pre-Call — Company Context (Minutes 1-3)",
    category: "Pre-Call Research",
    description:
      "5-bullet summary of the target company to anchor the call.",
    source: "Module 2 — Pipeline Management · Lesson 2",
    prompt: `Give me a 5-bullet summary of {company name}:

1. What they do and who they serve.
2. Size, stage, and most recent funding or revenue milestone.
3. 1-2 likely business priorities this quarter (based on public signals).
4. Known tech stack or vendors in my category.
5. Any recent news, hires, or product launches in the last 90 days.

Make it sharp enough to reference in the first 2 minutes of a call without sounding like I Googled them.`,
  },
  {
    id: "prospect-pre-call-research",
    title: "Pre-Call — Prospect Context (Minutes 3-5)",
    category: "Pre-Call Research",
    description:
      "Translate a LinkedIn profile into leverage for the call.",
    source: "Module 2 — Pipeline Management · Lesson 2",
    prompt: `Based on this LinkedIn profile summary:

{paste LinkedIn summary / experience / about}

Tell me:
1. What they probably care about in their current role (goals + pressure).
2. What they likely owned or accomplished in their last 1-2 roles that's relevant to what I sell.
3. One credible hook I can use in the first 60 seconds to earn the right to the conversation.
4. One question I should ask that others on the call probably won't.`,
  },

  // Follow-Up
  {
    id: "recap-email",
    title: "Post-Discovery Recap Email",
    category: "Follow-Up",
    description:
      "Follow-up that re-anchors the pain, confirms next step, and sounds human.",
    source: "Module 2 — Pipeline Management · Lesson 3",
    prompt: `Write a post-discovery call follow-up email for a call with {name} at {company}.

Pain / problem they described:
{paste pain}

Impact / cost of the problem:
{paste impact}

Agreed next step:
{paste next step + date}

Rules:
- Under 120 words.
- Open by reflecting their words back (not mine).
- One crisp value statement tied to THEIR metric.
- Confirm the next step with a specific date/time.
- No attachments, no fluff, no "just following up".`,
  },
  {
    id: "value-add-followup",
    title: "Value-Add Follow-Up (3 Resources)",
    category: "Follow-Up",
    description:
      "Find 3 recent, relevant resources to send between touches without being salesy.",
    source: "Module 2 — Pipeline Management · Lesson 3",
    prompt: `Find me 3 recent articles or resources about {topic / pain / industry trend} that would be genuinely useful to a {title} at {company type}.

For each:
- 1-sentence summary.
- Why it matters to them specifically.
- A 2-sentence outreach note I can send with the link (no CTA, no pitch).`,
  },

  // Forecasting
  {
    id: "weekly-forecast-review",
    title: "Weekly Forecast Review",
    category: "Forecasting",
    description:
      "Stress-test every Commit and Best Case deal against 4 reality checks.",
    source: "Module 2 — Pipeline Management · Lesson 4",
    prompt: `Review my current pipeline. For each deal marked Commit or Best Case, tell me:

(1) Last engagement date.
(2) Number of stakeholders involved.
(3) Days since last two-way communication.
(4) Whether a next step is scheduled.

Flag any deal where TWO or more of these are concerning.

Deals:
{paste Commit + Best Case deals — name, amount, close date, stage, last engagement, stakeholders, next step}`,
  },

  // Objections
  {
    id: "objection-playbook-builder",
    title: "Personal Objection Playbook Builder",
    category: "Objections",
    description:
      "Build a response playbook for the 5 objections you hear most.",
    source: "Module 3 — Objections & Closing · Lesson 10",
    prompt: `I sell {product} to {ICP / title}.

The top 5 objections I hear are:
1. {objection 1}
2. {objection 2}
3. {objection 3}
4. {objection 4}
5. {objection 5}

For each, give me:
- The REFRAME (1 sentence that changes the frame).
- The SCRIPT (3-5 sentence response, conversational, first person).
- The CLOSING MOVE (the specific question I ask after the response to test if it landed).

Do not sound like a sales script. Sound like a human who has heard this 200 times.`,
  },
  {
    id: "objection-roleplay",
    title: "Objection Role-Play Stress Test",
    category: "Objections",
    description:
      "Claude plays a skeptical VP and tells you whether your response actually landed.",
    source: "Module 3 — Objections & Closing · Lesson 10",
    prompt: `Role-play as a skeptical {title} at a {company type / size}. I will give you my objection response and you tell me whether it would land or whether you would remain unconvinced. Be harsh. Do not let me off the hook.

My response to the objection "{state objection}":

"{paste my response verbatim}"

Evaluate:
- Did it actually address what I'd be thinking, or did it dodge?
- What's the follow-up push-back you'd give me in real life?
- Rewrite the response in my voice, better.`,
  },

  // Campaign Mastery
  {
    id: "icp-builder",
    title: "ICP Definition Builder",
    category: "Campaign Mastery",
    description:
      "Build a tight, testable ICP definition you can actually list-build from.",
    source: "Module 1 — Campaign Architecture",
    prompt: `Build me an ICP definition for a company that sells {product / outcome}.

Return:
- Firmographics (industry, size, revenue band, geography).
- Tech or vendor signals that indicate fit.
- Trigger events that indicate urgency (hiring, funding, leadership change, filings, etc.).
- Disqualifiers (who looks like ICP but isn't).
- 3 target titles and why each buys, blocks, or champions.
- A 1-sentence "this is who we sell to" statement I can put on a campaign brief.`,
  },
  {
    id: "list-audit",
    title: "List Audit + Personalization Hooks",
    category: "Campaign Mastery",
    description:
      "Score a prospect list against your ICP and surface per-prospect hooks.",
    source: "Module 1 — AI List Building",
    prompt: `Review this list of prospects against my ICP definition:

ICP:
{paste ICP definition}

Prospects:
{paste list — name, title, company, industry, size, signal}

For each prospect:
- Fit score (A / B / C / disqualify).
- The strongest personalization hook (1 line, pulled from a real signal, not generic).
- Recommended first touch: cold email / LinkedIn / referral path / skip.`,
  },
  {
    id: "campaign-touch-1",
    title: "Campaign — Touch 1 Email",
    category: "Campaign Mastery",
    description:
      "Write the first touch of a multi-step outbound campaign.",
    source: "Module 1 — Campaign Messaging",
    prompt: `Write a cold email for a campaign targeting {ICP titles} at {company type / industry}.

Campaign thesis (why we're reaching out now):
{paste thesis}

Offer / outcome we deliver:
{paste offer}

Rules for Touch 1:
- 70-90 words.
- Open with the signal / thesis, not me.
- One outcome statement with a specific metric.
- CTA is a direct question, not "worth a quick call?".
- No "hope this finds you well". No "circling back".`,
  },
  {
    id: "reply-sentiment",
    title: "Campaign — Reply Sentiment Categorization",
    category: "Campaign Mastery",
    description:
      "Bucket inbound replies into 5 categories and learn what they say about your targeting.",
    source: "Module 1 — Launching a Campaign",
    prompt: `Categorize these email replies into:
(1) Interested — wants to talk.
(2) Not now — timing issue.
(3) Wrong person — needs a referral.
(4) Competitor — already using something.
(5) Hard no — not relevant.

Replies:
{paste replies — one per line or labeled}

For each category, tell me:
- What it suggests about my targeting.
- What it suggests about my messaging.
- The ONE change I should make before the next send.`,
  },
  {
    id: "campaign-diagnose",
    title: "Campaign Diagnose — Root Cause",
    category: "Campaign Mastery",
    description:
      "14-day campaign check. Find the real bottleneck before you keep sending.",
    source: "Module 2 — Campaign Diagnostics · Lesson 1",
    prompt: `Here is my campaign data after 14 days:

- Sent: {#}
- Delivered: {#}
- Open rate: {%}
- Reply rate: {%}
- Positive reply rate: {%}
- Booked calls: {#}
- Opportunities created: {#}

Sample of replies:
{paste 5-10 replies}

Sample of messaging:
{paste Touch 1 + Touch 2}

Diagnose:
- Where is the bottleneck (list, deliverability, subject line, body, CTA, targeting)?
- What's the evidence?
- What's the ONE test I should run next? Define the hypothesis and the metric that would prove or disprove it.`,
  },
  {
    id: "campaign-postmortem",
    title: "Campaign Post-Mortem",
    category: "Campaign Mastery",
    description:
      "Dead campaign autopsy. What to keep, kill, and copy into the next one.",
    source: "Module 2 — Campaign Diagnostics · Lesson 2",
    prompt: `This campaign failed. Here are the metrics:

{paste final metrics — sends, replies, booked, closed}

Messaging used:
{paste full sequence}

List criteria:
{paste ICP / list source}

Tell me:
- What actually killed it (root cause, not symptoms).
- What worked that I should carry forward.
- What I should NEVER repeat.
- The 3 specific changes I'll make in the next campaign, in priority order.`,
  },
  {
    id: "reply-handling",
    title: "Reply Handling Helper",
    category: "Campaign Mastery",
    description:
      "Got a reply. What do I actually send back? Claude writes the response.",
    source: "Module 2 — Campaign Diagnostics · Lesson 4",
    prompt: `Here is a reply I received to my cold outreach:

"{paste reply}"

Context on the prospect:
{title, company, what I originally pitched}

Tell me:
- What they're really saying (reading between the lines).
- The best response strategy (advance, educate, defer, or disqualify).
- Draft the reply in my voice — under 80 words — that moves this forward without being pushy.`,
  },
];

export const promptCategories: PromptTemplateCategory[] = [
  "Post-Call Debrief",
  "Weekly Review",
  "Pre-Call Research",
  "Pipeline Management",
  "Forecasting",
  "Objections",
  "Follow-Up",
  "Cold Outreach",
  "Campaign Mastery",
];
