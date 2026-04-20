import { generateText, Output } from "ai";
import { z } from "zod";
import { SALES_COACH_SYSTEM_PROMPT } from "@/data/knowledge-base";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

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
  category: z
    .enum([
      "price",
      "timing",
      "trust",
      "spouse",
      "insurance",
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

Also classify the objection into one of: price, timing, trust, spouse, insurance, competitor, process.

Your output must sound like a spoken script — short sentences, contractions where natural, no "leveraging" or "synergies" or any other corporate language. The rep is going to say this tonight.`;

  const { experimental_output } = await generateText({
    model: "anthropic/claude-opus-4.6",
    system: SALES_COACH_SYSTEM_PROMPT,
    prompt,
    experimental_output: Output.object({ schema: analysisSchema }),
  });

  return Response.json(experimental_output);
}
