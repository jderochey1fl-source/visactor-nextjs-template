import { generateText, Output } from "ai";
import { z } from "zod";
import { SALES_COACH_SYSTEM_PROMPT } from "@/data/knowledge-base";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const rebuttalOptionSchema = z.object({
  lever: z
    .enum([
      "their-timeline",
      "implementation-reality",
      "external-event",
      "confidence-question",
      "transparent-counter",
    ])
    .describe("Which of the 5 rebuttal levers this option uses."),
  headline: z
    .string()
    .describe(
      "A 3-6 word label the rep can scan at a glance on a live call (e.g. 'Anchor on their Q3 launch date').",
    ),
  script: z
    .string()
    .describe(
      "The exact spoken script — 1-3 sentences. Conversational, confident, no corporate language. The rep will read this out loud.",
    ),
});

const analysisSchema = z.object({
  realConcern: z
    .string()
    .describe(
      "The real concern behind the stated objection — what the prospect is actually worried about but not saying directly. 1-2 tight sentences.",
    ),
  diagnosticQuestion: z
    .string()
    .describe(
      "ONE question the rep can ask to surface the real concern. Must sound natural when spoken out loud, not like a marketing survey.",
    ),
  response: z
    .string()
    .describe(
      "A 2-sentence response that addresses the real concern without being defensive. Conversational, confident, specific. No corporate speak.",
    ),
  bridge: z
    .string()
    .describe(
      "A bridge that moves the conversation forward toward the next commitment or next step. One sentence.",
    ),
  rebuttals: z
    .array(rebuttalOptionSchema)
    .length(5)
    .describe(
      "EXACTLY 5 high-level rebuttal options — one for EACH lever in this order: their-timeline, implementation-reality, external-event, confidence-question, transparent-counter. Each must be specific to the objection and the ICP; do not be generic. Never fake a deadline, never invent other buyers.",
    ),
  category: z
    .enum([
      "price",
      "timing",
      "trust",
      "authority",
      "integration",
      "competitor",
      "process",
    ])
    .describe("Which category the objection falls into."),
});

export async function POST(req: Request) {
  const body = (await req.json()) as {
    statedObjection: string;
    product: string;
    icp: string;
    stage?: string;
    dealName?: string;
  };

  const prompt = `A rep has brought you this objection to analyze.

STATED OBJECTION (verbatim):
"${body.statedObjection}"

CONTEXT:
- Product / service: ${body.product || "(not provided)"}
- ICP / buyer profile: ${body.icp || "(not provided)"}
${body.stage ? `- LADDER stage: ${body.stage}` : ""}
${body.dealName ? `- Deal: ${body.dealName}` : ""}

Analyze this objection using the 4-part framework:
1) The REAL concern behind the stated objection (not what they said — what they MEAN).
2) A single DIAGNOSTIC question that surfaces the real concern.
3) A 2-sentence RESPONSE that addresses the real concern without being defensive.
4) A BRIDGE sentence that moves the conversation forward.

Then generate EXACTLY 5 high-level rebuttal options — one per lever, in this exact order:

A) their-timeline — Anchor on a deadline or event the prospect has told you about. If you don't know one, infer a plausible one from the ICP (e.g. "storm season", "next inspection cycle", "Q3 hiring ramp"). Connect their own clock to the cost of waiting.
B) implementation-reality — Be honest about how long delivery / install / go-live takes. Translate "sign date" into "live date". Make the downstream delay concrete.
C) external-event — Only use REAL, documented events: scheduled pricing changes, cohort starts, availability windows, material cost increases. If nothing real applies, produce a script that NAMES this fact ("there's no real external deadline pushing this") instead of manufacturing one. Never fake scarcity.
D) confidence-question — Deploy this exact closing question or a close variation: "What would need to be true for you to feel completely confident moving forward?" Surface any remaining objection.
E) transparent-counter — When the objection is a smokescreen or the other 4 levers would feel pushy, counter with honesty. Acknowledge the tradeoff, no pressure, no manufactured urgency. Never imply other buyers are interested unless they are.

Also classify the objection into one of: price, timing, trust, authority (co-decider or approval gate), integration (tech stack fit — Spotio, SalesRabbit, JobNimbus, AccuLynx, Leap, HubSpot), competitor, or process.

Your output must sound like a spoken script — short sentences, contractions where natural, no "leveraging" or "synergies" or any other corporate language. The rep is going to say this tonight.`;

  const { experimental_output } = await generateText({
    model: "anthropic/claude-opus-4.6",
    system: SALES_COACH_SYSTEM_PROMPT,
    prompt,
    experimental_output: Output.object({ schema: analysisSchema }),
  });

  return Response.json(experimental_output);
}
