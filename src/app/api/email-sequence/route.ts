import { generateText, Output } from "ai";
import { z } from "zod";

import type { SequenceInputs } from "@/data/email-sequence";

export const maxDuration = 60;

const touchSchema = z.object({
  number: z.number().int().min(1).max(6),
  day: z.number().int().min(1).max(16),
  channel: z.enum(["email", "linkedin"]),
  type: z.enum([
    "signal-hook",
    "connection-request",
    "insight-add",
    "conversational",
    "different-angle",
    "break-up",
  ]),
  label: z.string(),
  subject: z
    .string()
    .describe(
      "Subject line 4-7 words. Empty string for LinkedIn touches. No marketing language.",
    ),
  body: z.string().describe("The full message body, newlines allowed."),
  wordCount: z.number().int().min(10).max(300),
  intent: z
    .string()
    .describe("One sentence on the strategic purpose of this touch."),
});

const sequenceSchema = z.object({
  touches: z.array(touchSchema).length(6),
});

function buildPrompt(inputs: SequenceInputs) {
  return `You are writing a LADDER 6-touch outbound sequence. Every touch must follow the LADDER curriculum precisely.

CAMPAIGN INPUTS
- ICP: ${inputs.icp}
- Trigger Signal: ${inputs.triggerSignal}
- One-sentence Problem: ${inputs.problemStatement}
- Specific Outcome: ${inputs.outcome}
- Prospect: ${inputs.prospectName}, ${inputs.prospectTitle} at ${inputs.company}
- Sender: ${inputs.senderName} from ${inputs.senderCompany}
- CTA Preference: ${inputs.ctaPreference}
- Tone: ${inputs.tone}

HARD RULES (do not violate)
- Touch 1 (Day 1, email, signal-hook): 75-125 words, subject 4-7 words, signal-first opening, never begins with "I", five-component anatomy (Subject / Opening / Bridge / Value / CTA), do not mention sender company until signature, no superlatives, no marketing language, single low-friction CTA.
- Touch 2 (Day 3, linkedin, connection-request): <50 words, references the same signal without repeating the pitch, no sales ask, subject must be an empty string.
- Touch 3 (Day 5, email, insight-add): 50-75 words, subject 4-7 words, does NOT say "just following up", adds a new data point / framework / insight genuinely useful whether or not they buy, does not reference Touch 1 directly.
- Touch 4 (Day 8, linkedin, conversational): <60 words, one genuine open-ended question about their situation, no pitch, subject must be an empty string.
- Touch 5 (Day 12, email, different-angle): 75-110 words, subject 4-7 words, completely different frame than Touch 1 (if Touch 1 led with opportunity/growth, this leads with cost-of-inaction/risk; vice-versa).
- Touch 6 (Day 16, email, break-up): 40-75 words, subject 4-7 words, honest exit, no guilt-tripping, leaves door open, respectful.

STYLE
- Conversational, specific, never generic
- Avoid cliches: "hope this finds you well", "quick question", "circling back", "touching base", "just following up"
- Every sentence must earn its place; cut fluff
- Use the prospect's first name only at the top (or drop it entirely for signal-first openings)
- Sign all emails with "${inputs.senderName}" on its own line; no company tagline

OUTPUT
Return all 6 touches in order. For each, compute the actual word count of the body (not including subject) and put it in wordCount. Write a one-sentence intent describing what the touch is strategically doing.`;
}

export async function POST(req: Request) {
  try {
    const inputs = (await req.json()) as SequenceInputs;

    const { experimental_output } = await generateText({
      model: "anthropic/claude-opus-4.6",
      experimental_output: Output.object({ schema: sequenceSchema }),
      prompt: buildPrompt(inputs),
    });

    return Response.json(experimental_output);
  } catch (err) {
    console.error("[email-sequence] generation failed", err);
    return Response.json(
      { error: "Failed to generate sequence. Please try again." },
      { status: 500 },
    );
  }
}
