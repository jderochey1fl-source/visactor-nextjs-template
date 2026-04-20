export type FourDecision = {
  number: string;
  title: string;
  lead: string;
  subheading?: string;
  bullets?: string[];
  test?: { label: string; good: string; bad: string };
  mathExample?: { label: string; lines: string[]; conclusion: string };
  checkpoints?: { day: string; question: string }[];
  aiPrompt?: { label: string; prompt: string; note?: string };
  principle?: string;
};

export const fourDecisions: FourDecision[] = [
  {
    number: "01",
    title: "Who exactly are you targeting?",
    lead: 'Not "VP of Sales at mid-market SaaS companies." That is a category, not a target.',
    subheading: "An elite-level ICP definition includes:",
    bullets: [
      "Specific company size range — headcount AND revenue, not one or the other.",
      "Funding stage or revenue model that creates the specific pain you solve.",
      "Tech stack signals that indicate they have the problem (Salesforce + Outreach is a different buyer than HubSpot + Gmail).",
      "Timing signals — what event in their world makes them likely to buy RIGHT NOW, not eventually.",
    ],
    aiPrompt: {
      label: "AI application",
      prompt:
        "Build me an ICP definition for a company that sells [X]. Include: headcount range, revenue range, funding stage, 3 tech stack signals that indicate they have the problem, and 5 trigger events that would make them likely to buy in the next 90 days.",
      note: "The output of this prompt becomes the brief you hand to every AI tool in your campaign stack. Every tool — Apollo, Clay, Sales Navigator — gets this exact definition. Garbage ICP in means garbage list out.",
    },
  },
  {
    number: "02",
    title: "What is the ONE problem you solve?",
    lead: "Not your top three value props. One problem. The most acute, most painful, most expensive problem your ICP has right now.",
    subheading:
      "Elite reps make this decision before writing a single word of outreach because every message in the campaign will be built around it.",
    test: {
      label: "The test",
      good: "Companies scaling their SDR team past 10 reps consistently see ramp time blow past 90 days and it costs them a full quarter of quota production.",
      bad: "We help sales teams be more efficient.",
    },
    principle:
      "Can you say it in one sentence that a prospect would nod at immediately? If not, you do not have a problem statement yet — you have a category.",
  },
  {
    number: "03",
    title: "What does your campaign need to achieve?",
    lead: 'Not "book meetings." Specifically: how many meetings per week, from how large a list, over what time period?',
    subheading:
      "These numbers tell you how much list you need, how many touches your sequence requires, and what reply rate you need to hit your goal.",
    mathExample: {
      label: "Working-backwards example",
      lines: [
        "Goal: 10 meetings per week.",
        "Assumption: 5% of replies convert to meetings.",
        "Assumption: 3% reply rate on cold outreach.",
        "Math: 10 ÷ 0.05 = 200 replies per week.",
        "Math: 200 ÷ 0.03 = 6,667 outreach touches per week.",
      ],
      conclusion:
        "Either your list needs to be massive, your reply rate needs to be higher than 3%, or your meeting goal needs to be adjusted.",
    },
    principle:
      "Elite reps do this math before launching. Average reps launch and wonder why they are not hitting their meeting goal.",
  },
  {
    number: "04",
    title: "What does success look like at Day 7, 14, and 30?",
    lead: "A campaign without defined checkpoints cannot be managed.",
    subheading: "Before launching, write down:",
    checkpoints: [
      {
        day: "Day 7",
        question:
          "What open rate, reply rate, and meeting rate tells you the campaign is on track?",
      },
      {
        day: "Day 14",
        question:
          "What data point would cause you to pause and rewrite the messaging?",
      },
      {
        day: "Day 30",
        question:
          "What result justifies scaling this campaign? What result means you kill it and start over?",
      },
    ],
    principle:
      "These are not guesses. They are commitments. Elite reps manage campaigns like data experiments, not like hope.",
  },
];
