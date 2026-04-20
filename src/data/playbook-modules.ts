import type {
  PlaybookModule,
  PlaybookModuleCategory,
} from "@/types/types";

export const playbookCategoryLabel: Record<PlaybookModuleCategory, string> = {
  architecture: "Architecture",
  "list-quality": "List quality",
  diagnostics: "Diagnostics",
  states: "Campaign states",
  tools: "Tool stack",
  "reply-handling": "Reply handling",
  onboarding: "First 30 days",
  habits: "Habits",
  pipeline: "Pipeline health",
  prep: "Call prep",
  "follow-up": "Follow-up",
  forecasting: "Forecasting",
  urgency: "Urgency",
  "elite-rep": "Elite rep systems",
};

export const playbookModules: PlaybookModule[] = [
  {
    id: "PB-001",
    category: "architecture",
    number: "Pillar 1",
    title: "The Four Decisions That Come Before Everything Else",
    summary:
      "Every elite campaign is architected before a single email is written. Four decisions define whether it wins or dies.",
    sections: [
      {
        heading: "Decision 1 — Who exactly are you targeting?",
        body: "Not \"VP of Sales at mid-market SaaS.\" That is a category, not a target. Elite ICP definitions include:",
        bullets: [
          "Specific company size range (headcount AND revenue, not one or the other)",
          "Funding stage or revenue model that creates the specific pain you solve",
          "Tech stack signals that indicate they have the problem (Salesforce + Outreach is a different buyer than HubSpot + Gmail)",
          "Timing signals — what event makes them likely to buy RIGHT NOW, not eventually",
        ],
        callout: {
          kind: "prompt",
          label: "AI application",
          text: "Build me an ICP definition for a company that sells [X]. Include: headcount range, revenue range, funding stage, 3 tech stack signals that indicate they have the problem, and 5 trigger events that would make them likely to buy in the next 90 days.",
        },
      },
      {
        heading: "Decision 2 — What is the ONE problem you solve?",
        body: 'Not your top three value props. One problem. The most acute, most painful, most expensive problem your ICP has right now. The test: can you say it in one sentence that a prospect would nod at immediately?',
        callout: {
          kind: "example",
          label: "A real problem statement",
          text: "Companies scaling their SDR team past 10 reps consistently see ramp time blow past 90 days — and it costs them a full quarter of quota production.",
        },
      },
      {
        heading: "Decision 3 — What does the campaign need to achieve?",
        body: "Not \"book meetings.\" How many meetings per week? From how large a list? Over what time period? Do the math before you launch.",
        callout: {
          kind: "example",
          label: "Working backwards",
          text: "Goal: 10 meetings/week. Reply→meeting: 5%. Reply rate: 3%. Math: 10 ÷ 0.05 = 200 replies/week. 200 ÷ 0.03 = 6,667 touches/week. Either your list scales, your reply rate improves, or your goal adjusts.",
        },
      },
      {
        heading: "Decision 4 — What does success look like at Day 7, 14, 30?",
        body: "A campaign without checkpoints cannot be managed. Before launching, write down:",
        bullets: [
          "Day 7: What open, reply, and meeting rate says we're on track?",
          "Day 14: What data point pauses the campaign for a rewrite?",
          "Day 30: What result justifies scaling? What result means kill and restart?",
        ],
      },
    ],
  },
  {
    id: "PB-002",
    category: "list-quality",
    number: "Pillar 2",
    title: "The Hierarchy of List Quality",
    summary:
      "Lists are not equal. Elite reps layer signal-triggered, intent-based, and firmographic lists — never rely on one alone.",
    sections: [
      {
        heading: "Tier 1 — Signal-triggered (highest quality)",
        body: "Prospects who have done something in the last 30 days signaling they have your problem right now — job postings, funding, leadership changes, product launches, hiring surges. Small lists, hard to build, convert at 3–5x any other list type.",
        callout: {
          kind: "principle",
          label: "Tool",
          text: 'Clay. Build workflows that monitor for trigger events and auto-add prospects. Example: "VP of Sales hired in the last 30 days at a 50–200 person SaaS company."',
        },
      },
      {
        heading: "Tier 2 — Intent-based (high quality)",
        body: "Prospects actively researching solutions in your category right now. Bombora, G2, 6sense surface companies consuming content related to your solution. Not hand-raisers, but clearly buying.",
      },
      {
        heading: "Tier 3 — Firmographic (baseline quality)",
        body: "Companies that match your ICP on paper — right size, industry, tech stack — but no signal they have the problem right now. Default list most reps build. Works, but converts at the lowest rate.",
      },
      {
        heading: "The elite approach — layer all three",
        bullets: [
          "Tier 1 signal-triggered as your primary campaign",
          "Tier 2 intent-based as a parallel campaign with different messaging",
          "Tier 3 firmographic only for volume plays when pipeline is thin",
        ],
      },
      {
        heading: "AI enrichment before any email sends",
        bullets: [
          "Email verification — never send to unverified addresses (destroys domain reputation)",
          "LinkedIn profile pull — confirms they are still in the role",
          "Recent news or activity check — surfaces personalization hooks",
          "Tech stack confirmation — validates ICP fit",
        ],
        callout: {
          kind: "prompt",
          label: "AI application",
          text: "Review this list of 200 prospects against my ICP definition: [paste ICP]. Flag any record that does not match on at least 3 of the 5 ICP criteria. For records that match, identify the strongest personalization hook for each based on their recent activity.",
        },
      },
    ],
  },
  {
    id: "PB-003",
    category: "diagnostics",
    number: "3",
    title: "The 72-Hour Decision Framework",
    summary:
      "The first 72 hours tell you what's working and what's not. Elite reps read the data decisively — average reps panic or overcorrect.",
    sections: [
      {
        heading: "What the data tells you",
        bullets: [
          "Open rate >40%, reply rate >3%: Campaign is working. Do not touch messaging. Let it run.",
          "Open rate >40%, reply rate <1%: Subject line works, body fails. Rewrite Touch 1 body before sending Touch 2.",
          "Open rate <25%, reply rate <1%: Both failing. Pause. Audit list quality and subject line before proceeding.",
          "Reply rate >5%: You have a winner. Scale the list immediately while messaging is hot.",
        ],
      },
      {
        heading: "What elite reps NEVER do in the first 72 hours",
        bullets: [
          "Never make changes based on fewer than 100 sends",
          "Never change two variables at once",
          "Never panic on a single low-open day — day-of-week and time-of-day matter enormously, one data point is noise",
        ],
        callout: {
          kind: "warning",
          text: "Wait for signal, then act decisively. Fast panic = slow recovery.",
        },
      },
    ],
  },
  {
    id: "PB-004",
    category: "diagnostics",
    number: "4",
    title: "Diagnostic Framework — Work Backwards From the Bottleneck",
    summary:
      "Every gap between funnel stages is a specific problem with a specific fix. Elite reps identify the biggest gap first and fix that before touching anything else.",
    sections: [
      {
        heading: "Step 1 — Map your funnel",
        body: "Sent → Opened → Replied → Meeting Booked → Meeting Held → Opportunity Created. Every gap = a specific problem.",
      },
      {
        heading: "The most common gaps and what they mean",
        bullets: [
          "Sent → Opened gap: Subject line failing or deliverability problem",
          "Opened → Replied gap: Body copy failing — wrong problem, wrong angle, wrong CTA",
          "Replied → Meeting gap: Reply handling is weak — what you say after the first reply determines booking rate",
          "Meeting → Opportunity gap: Discovery is failing — wrong people or wrong questions",
        ],
      },
      {
        heading: "Step 2 — Diagnose the root cause with AI",
        body: "Do not guess. Pull the data and ask AI to diagnose it.",
        callout: {
          kind: "prompt",
          label: "AI application",
          text: "Here is my campaign data after 14 days: [paste metrics]. Here are 10 sample emails I sent: [paste examples]. Here are 5 replies I received: [paste replies]. Based on this data, what is the most likely root cause of my [specific gap]? Give me 3 hypotheses ranked by likelihood and one specific test to confirm each.",
        },
      },
      {
        heading: "Step 3 — Test one hypothesis at a time",
        body: "Pick the highest-probability hypothesis. Design a test that isolates that single variable. Run on at least 100 sends before drawing a conclusion. Repeat. Elite reps run 2–3 diagnostic cycles per month on active campaigns.",
      },
      {
        heading: "The metric most reps ignore",
        body: "Reply-to-meeting conversion rate. Of every prospect who replied positively, what percentage actually booked a meeting? If this number is below 60%, your reply handling is the problem — not your outreach. The reply is just the beginning.",
      },
    ],
  },
  {
    id: "PB-005",
    category: "states",
    number: "5",
    title: "The Three Campaign States and What to Do in Each",
    summary:
      "Every campaign is in one of three states. The move is different in each — and getting it wrong is how reps waste months.",
    sections: [
      {
        heading: "State 1 — Working (Open 35%+, Reply 3%+, Meeting 1%+)",
        body: "Do not change anything. The instinct to optimize a working campaign is one of the most expensive mistakes in sales. Your only job is to scale the list.",
        bullets: [
          "Add prospects in batches of 50–100, not all at once",
          "Verify every new prospect meets your exact ICP before adding",
          "Monitor metrics after each batch — if they drop, the new batch has ICP problems",
          "Never add more than 20% to your list in a single week",
        ],
      },
      {
        heading: "State 2 — Underperforming (Open 20–35%, Reply 1–3%)",
        body: "Something is working, something is broken. This is the diagnostic state. Fix one thing. Measure. Fix the next thing.",
        bullets: [
          "1. List quality — wrong people makes everything else irrelevant",
          "2. Subject line — if they're not opening they're not reading",
          "3. Opening line — first sentence determines whether they read the rest",
          "4. CTA — if they read everything but don't reply, the ask is wrong",
          "5. Value statement — fix this last, hardest to test in isolation",
        ],
      },
      {
        heading: "State 3 — Dead (Open <20%, Reply <0.5%)",
        body: 'Kill it. The instinct to save a failing campaign by tweaking it is how reps waste months. A dead campaign means one of three things: wrong list, wrong problem, or wrong timing. None of those are fixed by rewriting your subject line.',
        callout: {
          kind: "prompt",
          label: "Post-mortem prompt",
          text: "This campaign failed. Here are the metrics: [paste]. Here is the ICP I targeted: [paste]. Here is the problem I claimed to solve: [paste]. Here are 5 sample emails: [paste]. What are the 3 most likely reasons this campaign failed? What should I do fundamentally differently in the next campaign?",
        },
      },
      {
        heading: "The decision most reps get wrong",
        body: "When to run multiple campaigns simultaneously. Answer: only when you can manage each as if it's your only campaign. Running three underperforming campaigns simultaneously is worse than running one campaign well.",
      },
    ],
  },
  {
    id: "PB-006",
    category: "tools",
    number: "6",
    title: "The Campaign Execution Stack",
    summary:
      "The minimum number of tools that accomplish your campaign goals wins. A rep running two tools well outperforms a rep running six tools poorly.",
    sections: [
      {
        heading: "List building & enrichment",
        bullets: [
          "Apollo — firmographic list building at scale. Best for Tier 3. Fast, large, volume plays.",
          "Clay — signal-triggered list building and enrichment. Best for Tier 1 and 2. Slower setup, dramatically higher quality output.",
          "LinkedIn Sales Navigator — human-verified prospect data. Best for enterprise campaigns with individual research.",
          "Bombora / 6sense — intent data. Shows who is actively researching your category. Best layered on top of firmographic to prioritize.",
        ],
      },
      {
        heading: "Outreach & sequencing",
        bullets: [
          "Outreach / Salesloft — enterprise-grade sequence management. High-volume coordinated campaigns, robust analytics, built-in A/B.",
          "Apollo Sequences — good for individual reps. Tightly integrated with Apollo list building.",
          "Instantly / Smartlead — pure email volume at scale. Less CRM integration but very high deliverability when configured correctly.",
        ],
      },
      {
        heading: "AI writing & personalization",
        bullets: [
          "Claude / ChatGPT — campaign strategy, message drafting, prompt engineering, diagnostic analysis. Not for sending — for thinking and building.",
          "Lavender — real-time email scoring. Tells you before you send whether your email will likely get a reply.",
          "Regie.ai / Copy.ai for Sales — personalization at scale. Takes your ICP and signal data and generates personalized first lines for hundreds of prospects simultaneously.",
        ],
      },
      {
        heading: "Analytics & optimization",
        bullets: [
          "Gong — call intelligence. Surfaces patterns across meetings that tell you what messaging is resonating.",
          "Clari — pipeline and forecast intelligence. Tells you which deals are real vs. pipeline theater.",
          "Your sequencing tool's native analytics — open rate, reply rate, click rate by touch. The foundation of your diagnostic process.",
        ],
        callout: {
          kind: "principle",
          text: "Master your core stack before adding anything new.",
        },
      },
    ],
  },
  {
    id: "PB-007",
    category: "reply-handling",
    number: "7",
    title: "Reply Handling — Where Most Campaigns Win or Die",
    summary:
      "Reply-to-meeting conversion is the metric most reps ignore. What you say after the reply determines the meeting — not what you sent to get it.",
    sections: [
      {
        heading: "Category 1 — Positive reply",
        body: '"Interested, tell me more" / "Sure, what does this look like?" Most reps send a calendar link immediately. Mistake 60% of the time. A link before context creates a meeting where the prospect shows up skeptical because they do not know what they agreed to.',
        callout: {
          kind: "example",
          label: "Elite response",
          text: "One sentence acknowledging interest. One sentence framing what the meeting accomplishes specifically — not 'a quick call to learn more' but 'a 15-minute call where I'll show you exactly how [specific company similar to theirs] solved [specific problem] and you can tell me whether it's relevant.' Then the calendar link.",
        },
      },
      {
        heading: "Category 2 — Soft interest reply",
        body: '"Maybe, depends on what you\'re selling." Do not send a link. Ask one diagnostic question first: "What would make it worth 15 minutes to you?" or "What\'s the biggest challenge you\'re dealing with on [specific problem] right now?" Their answer tells you whether it\'s real and gives you the framing for the invite.',
      },
      {
        heading: "Category 3 — Referral reply",
        body: '"Not the right person, you should talk to [Name]." Treat as a warm introduction, not a cold lead. Reply thanking them, ask if they\'d make an intro, and give them one sentence they can forward. Never cold outreach the referral directly without following up on the intro first.',
      },
      {
        heading: "Category 4 — Objection reply",
        body: '"We already have something" / "Not the right time." This is not a no — it\'s an invitation to diagnose. Respond with curiosity, not a pitch: "Completely understand — what are you currently using and how is it working?" opens a conversation. Sending your competitive comparison sheet closes it.',
      },
      {
        heading: "The 60-minute rule",
        body: "Reply to every positive reply within 60 minutes during business hours. Reply-rate-to-meeting conversion drops 40% when first response time exceeds 4 hours. Elite reps treat a positive reply like an inbound lead — highest priority item in their day when it arrives.",
        callout: {
          kind: "prompt",
          label: "AI application",
          text: "Here is a reply I received to my cold outreach: [paste reply]. Here is the original email I sent: [paste email]. Categorize this reply and give me the ideal response in under 75 words that advances toward a meeting without being pushy.",
        },
      },
    ],
  },
  {
    id: "PB-008",
    category: "onboarding",
    number: "8",
    title: "The Elite First 30-Day Framework",
    summary:
      "A rep who follows this framework has more pipeline at day 30 than most reps have at day 90 — not from working harder, but from building the right infrastructure first.",
    sections: [
      {
        heading: "Days 1–7 — Intelligence gathering",
        body: "Before writing a single email, answer five questions:",
        bullets: [
          "What does the top performer on this team do differently than everyone else? (Shadow them. Ask directly. Study their numbers.)",
          "What does the pipeline of a rep who hits 100%+ look like vs. a rep who misses? (Pull CRM data. The pattern is always visible.)",
          "What are the three objections that kill the most deals at this company?",
          "Which customer segments close fastest and at the highest rate? (Almost never the segment leadership thinks.)",
          "What AI tools does the team have access to that nobody is fully using?",
        ],
      },
      {
        heading: "Days 8–14 — Infrastructure build",
        body: "Build campaign infrastructure before launching anything:",
        bullets: [
          "ICP defined to elite level (your specific version based on week 1 learnings, not the company's generic one)",
          "List of 500 enriched, verified prospects segmented by signal tier",
          "Sequence architecture designed and loaded",
          "Reply handling templates saved and ready",
          "Weekly metrics dashboard built so you can see your own data without waiting for a manager report",
        ],
      },
      {
        heading: "Days 15–21 — Controlled launch",
        body: "Launch your first campaign to 50 prospects only. Not 500. Not your full list. 50. This is your pilot. You will learn things in the first 50 sends that change how you run the next 450. Monitor obsessively for 7 days.",
      },
      {
        heading: "Days 22–30 — Scale with conviction",
        body: "By day 22 you have real data. You know what messaging works. You know which segment responds. You know what the meetings look like. Now scale.",
        callout: {
          kind: "warning",
          label: "The mistake that kills most new reps",
          text: "Copying what the average rep on the team does. Their habits, sequences, and ICP definitions are all calibrated for average results. Study the top performer and ignore everyone else.",
        },
      },
    ],
  },
  {
    id: "PB-009",
    category: "elite-rep",
    number: "9",
    title: "The Three Things Elite Reps Build That Average Reps Don't",
    summary:
      "Elite sales performance compounds through systems — not effort. Three assets separate the top performer from the one trying to copy them.",
    sections: [
      {
        heading: "1. Institutional intelligence",
        body: "Elite reps document everything. Every objection and what worked to overcome it. Every competitor mention and what the prospect said. Every segment pattern. Every signal that predicted a closed deal. By month 6, an elite rep knows things about the market no one else in the company knows — not their manager, not marketing, not the CEO.",
        callout: {
          kind: "prompt",
          label: "AI application after every call",
          text: "Here are my notes from a sales call today: [paste notes]. Extract: (1) any new objections I haven't heard before, (2) any competitor mentions and what was said, (3) any signals that predicted this prospect's level of interest, (4) one thing I should have said differently. Save every output in a running document.",
        },
      },
      {
        heading: "2. Campaign systems others can't replicate",
        body: "Build campaigns so well-engineered that when your manager asks how you are hitting 140% of quota, you can show them exactly why it works — and they realize it took months to build and cannot be copied overnight. The best protection against being managed out or having your territory reassigned is being the person who built the system that runs the territory.",
      },
      {
        heading: "3. Market insight that informs company strategy",
        body: "The best sales reps eventually become the most informed people about what the market wants — more informed than product, marketing, or leadership. Because they talk to prospects every day. Elite reps share this proactively. They bring insights to their manager without being asked, write up patterns, flag when company messaging is out of sync with what prospects actually respond to. This behavior gets you promoted — and when budget cuts happen, you're last on the list because cutting you means losing the market intelligence you carry.",
      },
    ],
  },
  {
    id: "PB-010",
    category: "habits",
    number: "10",
    title: "The Internal Habits That Determine External Results",
    summary:
      "Elite sales performance is not about any single campaign or quarter — it's the compounding effect of small improvements made consistently over time.",
    sections: [
      {
        heading: "Habit 1 — Weekly self-audit",
        body: "Every Friday before you close your laptop, answer four questions honestly:",
        bullets: [
          "What worked this week that I should do more of?",
          "What did not work that I am still doing out of habit?",
          "Where did I lose time to activity that did not move pipeline?",
          "What is the one thing I will do differently next week?",
        ],
        callout: {
          kind: "prompt",
          label: "AI application",
          text: "Here is my sales activity data from this week: [paste]. Here are the outcomes: [paste]. What patterns do you see? Where am I spending time that is not producing results? What should I do more of based on this data?",
        },
      },
      {
        heading: "Habit 2 — Pipeline honesty",
        body: 'Once a week, look at every deal and ask: "If I had to bet $1,000 of my own money on whether this deal closes this quarter, would I?" If no, remove it from your forecast immediately. Most reps carry dead deals for months because removing them feels like admitting failure. A clean pipeline gives you accurate information — and accurate information is what good decisions are made from.',
      },
      {
        heading: "Habit 3 — Controlled response to losing streaks",
        body: "Every rep hits losing streaks. The difference between reps who recover quickly and reps who spiral is what they do in the first 48 hours:",
        bullets: [
          "Do not change everything at once. One change at a time.",
          "Do not abandon what was working before the streak. Losing streaks are usually temporary variance, not permanent failure.",
          "Do increase prospecting activity — deliberately, not frantically. More pipeline is the only reliable cure.",
          "Do review your data. Is this a streak or is something actually broken?",
        ],
      },
      {
        heading: "Habit 4 — Continuous campaign improvement",
        body: "Every campaign produces a documented lesson. What worked. What did not. What you would do differently. After 6 months, your campaigns are dramatically better. After 12 months, you are running campaigns most reps could not build even with the same tools.",
        callout: {
          kind: "principle",
          label: "The compounding effect",
          text: "A rep who improves 1% per week is 67% better after one year. That is not a metaphor. It is math. And it is available to anyone who builds the habits.",
        },
      },
    ],
  },
  {
    id: "PB-011",
    category: "pipeline",
    number: "11",
    title: "The Four Pipeline Health Metrics That Actually Matter",
    summary:
      "Pipeline health isn't about volume — it's about coverage, velocity, age, and engagement. Every Monday, every deal gets filtered through all four.",
    sections: [
      {
        heading: "1. Coverage ratio",
        body: "Formula: Total pipeline value ÷ Quota. Healthy coverage is 3x–4x your quota. If you need to close $100K this quarter, you need $300K–$400K in active pipeline. Below 3x means you are at risk regardless of how well you close.",
        callout: {
          kind: "prompt",
          text: "Show me my current quarter pipeline value vs my quota and alert me if coverage falls below 3x.",
        },
      },
      {
        heading: "2. Stage velocity",
        body: 'How long is each deal spending in each stage? Deals piling up in "Proposal Sent" or "Demo Completed" without moving are stalled — and stalled deals die.',
        callout: {
          kind: "prompt",
          text: "Show me all deals that have been in the same stage for more than 14 days. For each, show the last activity date and next scheduled touch.",
        },
      },
      {
        heading: "3. Deal age",
        body: "The older a deal, the less likely it is to close. A deal open for 120 days when your average sales cycle is 45 days is not a deal — it is a wish.",
      },
      {
        heading: "4. Engagement score",
        body: "Is the prospect actually engaging? Opening emails, attending meetings, involving other stakeholders? Low engagement in late-stage deals is a leading indicator of a deal going dark.",
        callout: {
          kind: "principle",
          label: "The pipeline review habit",
          text: "Every Monday, run your pipeline through these four filters. Deals that fail two or more get an immediate decision: accelerate with a specific action this week, or remove from forecast. A clean, accurate pipeline is more valuable than an inflated one.",
        },
      },
    ],
  },
  {
    id: "PB-012",
    category: "prep",
    number: "12",
    title: "The 10-Minute AI Prep Protocol",
    summary:
      "Reps without a hypothesis take 30 minutes to find what a prepared rep finds in 10. Here's exactly how to use ten minutes before any call.",
    sections: [
      {
        heading: "Minutes 1–3 — Company context",
        callout: {
          kind: "prompt",
          text: "Give me a 5-bullet summary of [Company Name]: what they sell, who they sell to, their approximate size, any recent news in the last 90 days, and what their primary growth challenge likely is based on their stage and market.",
        },
      },
      {
        heading: "Minutes 3–5 — Prospect context",
        body: "LinkedIn research on the specific person. Look for: how long in this role, what they did before, content they've posted recently, shared connections.",
        callout: {
          kind: "prompt",
          text: "Based on this LinkedIn profile summary [paste text], what are 3 likely priorities for this person, and what are 3 questions I should ask to understand their situation better?",
        },
      },
      {
        heading: "Minutes 5–7 — Signal review",
        body: "What signals triggered this deal? What email did they reply to? What subject line got the open? What pain point resonated? These are clues — walk into the call ready to go deeper on those areas.",
      },
      {
        heading: "Minutes 7–9 — Competitive landscape",
        body: "Are they likely using a competitor? What are the known weaknesses your solution addresses? Do not bring this up unsolicited — but be ready if it comes up.",
      },
      {
        heading: "Minutes 9–10 — Hypothesis formation",
        body: 'Write one sentence before the call: "I believe this prospect\'s primary challenge is [X] because [specific evidence]. My goal is to confirm this hypothesis or discover what the real challenge is." This single sentence keeps your discovery focused.',
      },
    ],
  },
  {
    id: "PB-013",
    category: "follow-up",
    number: "13",
    title: "The Three Types of Post-Meeting Follow-Up",
    summary:
      "Follow-up is not a formality — it is where deals move forward or die. Three distinct types, three distinct purposes.",
    sections: [
      {
        heading: "Type 1 — Recap email (send within 2 hours)",
        body: "This is not a summary of what you talked about. It is a document of shared understanding.",
        bullets: [
          "One sentence acknowledging the conversation",
          "3 bullets of what you heard (their words, not your interpretation)",
          "Clear next step with a date",
        ],
        callout: {
          kind: "prompt",
          text: "Write a post-discovery call follow-up email for a call with [Title] at [Company]. Key things they told me: [paste notes]. Next step agreed: [specific action]. Keep it under 100 words. Make it feel like I actually listened, not like a template.",
        },
      },
      {
        heading: "Type 2 — Value-add follow-up (3–5 days after, if no response)",
        body: "Send something genuinely useful — a relevant case study, an article about a challenge they mentioned, a framework that applies to their situation. Do not pitch.",
        callout: {
          kind: "prompt",
          text: "Find me 3 recent articles or resources about [specific challenge the prospect mentioned]. I want to send one as a value-add follow-up without it feeling like a sales move.",
        },
      },
      {
        heading: "Type 3 — Re-engagement (14 days after last contact)",
        body: "Reference something specific from your conversation + acknowledge time has passed + low-friction ask.",
        callout: {
          kind: "example",
          text: 'We talked about your Q3 ramp timeline in our last call — not sure if that\'s still the priority or if things have shifted. Either way, happy to pick back up whenever timing makes sense.',
        },
      },
      {
        heading: "What makes AI follow-up sound human",
        bullets: [
          "Include specific details from the actual conversation",
          "Vary sentence length — AI defaults to uniform length, which sounds robotic",
          "Remove any sentence that could apply to any prospect",
        ],
      },
    ],
  },
  {
    id: "PB-014",
    category: "forecasting",
    number: "14",
    title: "AI Forecasting — What the Scores Mean",
    summary:
      "Clari, Gong Forecast, and Salesforce Einstein analyze hundreds of data points per deal. Their probability score is more accurate than any rep's gut feel.",
    sections: [
      {
        heading: "How AI forecasting works",
        body: "Tools analyze email response rates, meeting frequency, stakeholder engagement, time in stage, and historical patterns from thousands of similar deals — producing a probability score more accurate than any rep's intuition.",
      },
      {
        heading: "What the scores mean",
        bullets: [
          "85%+ — Close this deal this quarter. Focus on removing final obstacles.",
          "60–84% — Real opportunity, something is missing. Likely a missing stakeholder, no submitted proposal, or champion not internally selling.",
          "40–59% — At risk. Requires immediate diagnosis. Is there still executive sponsorship?",
          "Below 40% — Remove from current quarter forecast. Keep in pipeline, do not count it.",
        ],
      },
      {
        heading: "Weekly AI forecast review prompt",
        callout: {
          kind: "prompt",
          text: "Review my current pipeline. For each deal marked Commit or Best Case, tell me: (1) last engagement date, (2) number of stakeholders involved, (3) days since last two-way communication, (4) whether a next step is scheduled. Flag any deal where two or more of these are concerning.",
        },
      },
      {
        heading: "Why reps resist AI forecasting",
        body: "Accurate AI forecasts expose deals reps know are not real. The discomfort is short-term. The benefit — knowing exactly where to focus energy in the last two weeks of a quarter — is career-defining.",
      },
    ],
  },
  {
    id: "PB-015",
    category: "urgency",
    number: "15",
    title: "The Three Legitimate Urgency Levers",
    summary:
      "Manufactured urgency destroys trust. Real urgency — theirs, not yours — closes deals at their own terms.",
    sections: [
      {
        heading: "1. Their timeline, not yours",
        body: "The most powerful urgency comes from the prospect's own calendar.",
        callout: {
          kind: "example",
          text: "You mentioned Q3 hiring is when this becomes critical — that's 6 weeks away. If we start onboarding this week, you'll have this in place before the ramp starts. If we wait another month, we're starting during the ramp, which is the hardest time to implement anything new.",
        },
      },
      {
        heading: "2. Implementation timeline",
        body: 'Be honest about it. "Our average implementation is 3 weeks. If we sign this week, you are live on [date]. If we push to next month, that date moves to [date]."',
      },
      {
        heading: "3. External events",
        body: "Pricing changes, cohort start dates, onboarding availability — if these are real, use them. If they are manufactured, do not. Sophisticated buyers see through artificial urgency and it destroys trust.",
      },
      {
        heading: "What never to do",
        callout: {
          kind: "warning",
          text: "Never tell a prospect a discount expires today unless it genuinely does. Never imply other buyers are interested unless they are. Buyers talk to each other. Your reputation in any market is smaller than you think.",
        },
      },
      {
        heading: "The question that closes more deals than any technique",
        callout: {
          kind: "principle",
          text: 'What would need to be true for you to feel completely confident moving forward? This surfaces any remaining objection and hands the prospect a path to yes on their own terms.',
        },
      },
    ],
  },
];
