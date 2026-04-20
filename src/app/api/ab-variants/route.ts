import { generateText, Output } from "ai";
import { z } from "zod";

export const maxDuration = 60;

const VariantsSchema = z.object({
  variants: z
    .array(
      z.object({
        approach: z.string(),
        text: z.string(),
        rationale: z.string(),
      }),
    )
    .length(5),
});

const VARIABLE_GUIDE: Record<string, string> = {
  "opening-line":
    "Generate 5 alternative opening lines. Each must use a different approach: (1) job posting / hiring signal, (2) funding / growth event signal, (3) direct problem statement, (4) counterintuitive observation, (5) peer reference. Keep each under 2 sentences.",
  "subject-line":
    "Generate 5 alternative subject lines. Each must use a different approach: (1) question, (2) curiosity gap, (3) direct specific benefit, (4) personalized with a signal, (5) ultra-short (3 words or less). Keep every subject under 9 words, no clickbait.",
  cta:
    "Generate 5 alternative CTAs. Each must use a different approach: (1) specific day + length (e.g. '15 min Thursday'), (2) interest check (no calendar), (3) resource offer instead of meeting, (4) multiple-choice (pick A/B), (5) one-question reply ask. Keep each to 1 sentence.",
  "value-statement":
    "Generate 5 alternative value statements for the same product. Each must target a different outcome: (1) time saved, (2) revenue gained, (3) risk removed, (4) cost avoided, (5) status / peer parity. Each under 2 sentences, concrete numbers where possible.",
  length:
    "Generate 5 alternative rewrites of the same cold email, varying only length and density: (1) 40 words, (2) 75 words, (3) 100 words, (4) 125 words, (5) 150 words. Keep the same core offer and opening hook across all 5.",
};

export async function POST(req: Request) {
  const body = await req.json();
  const variable = String(body.variable ?? "opening-line");
  const current = String(body.current ?? "");
  const context = String(body.context ?? "");
  const guide = VARIABLE_GUIDE[variable] ?? VARIABLE_GUIDE["opening-line"];

  const prompt = `You are an expert B2B cold-email copywriter for roofing and home-services sales teams.

Context: ${context || "roofing / home services cold outreach"}
Current reply rate on existing version: (unknown — assume it's underperforming)
Current version being tested:
"""
${current || "(not provided)"}
"""

TASK
${guide}

For each variant provide:
- approach: a 2-4 word label for the approach used
- text: the actual copy the rep would paste in
- rationale: one sentence on why this approach could outperform the current version

Return exactly 5 variants. No preamble, no numbering in the text field itself.`;

  const result = await generateText({
    model: "anthropic/claude-opus-4.6",
    prompt,
    experimental_output: Output.object({ schema: VariantsSchema }),
  });

  return Response.json(result.experimental_output);
}
