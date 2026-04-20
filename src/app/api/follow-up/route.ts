import { generateText, Output } from "ai";
import { z } from "zod";

import type { FollowUpInputs } from "@/data/follow-up";

export const maxDuration = 60;

const emailSchema = z.object({
  type: z.enum(["recap", "value-add", "re-engagement"]),
  sendAfterDays: z.number().int().min(0).max(30),
  label: z.string(),
  subject: z
    .string()
    .describe("Subject line 4-7 words. No marketing language, no all-caps."),
  body: z.string().describe("The full message body, newlines allowed."),
  wordCount: z.number().int().min(20).max(300),
  intent: z
    .string()
    .describe("One sentence on the strategic purpose of this email."),
  resourceIdeas: z
    .array(z.string())
    .describe(
      "2-3 concrete resource ideas (case study / article / framework) the rep should attach to the value-add email. Empty array for other types.",
    ),
});

const bundleSchema = z.object({
  emails: z.array(emailSchema).length(3),
});

function buildPrompt(inputs: FollowUpInputs) {
  return `You are writing three post-meeting follow-up emails for a sales rep. Every email follows the LADDER post-meeting playbook precisely.

MEETING CONTEXT
- Prospect: ${inputs.prospectName}, ${inputs.prospectTitle} at ${inputs.company}
- Meeting type: ${inputs.meetingType}
- Meeting date: ${inputs.meetingDate}
- What the prospect actually said (use their words, not your interpretation):
${inputs.meetingNotes}
- Specific challenges / priorities mentioned:
${inputs.challenges}
- Agreed next step: ${inputs.nextStep}
- Sender: ${inputs.senderName} from ${inputs.senderCompany}
- Tone: ${inputs.tone}

GENERATE THREE EMAILS IN THIS EXACT ORDER

EMAIL 1 — RECAP (type: "recap", sendAfterDays: 0)
Target 60-100 words. Structure exactly:
- One sentence acknowledging the conversation (concrete, not "great chatting")
- 3 bullets of what you heard — in THEIR words, specific details from meetingNotes
- One clear next step with a specific date or time window, pulled from nextStep
Subject 4-7 words. No fluff. Signature: "${inputs.senderName}" on its own line. resourceIdeas: [].

EMAIL 2 — VALUE-ADD (type: "value-add", sendAfterDays: 4)
Target 60-120 words. Rules:
- Opens by referencing something specific the prospect said (from meetingNotes or challenges)
- Shares ONE genuinely useful resource idea related to one of their challenges
- No pitch, no "just checking in", no ask for a meeting
- Closes with a soft "happy to send more if useful" or similar low-friction line
Subject 4-7 words, resource-shaped (e.g. "framework you mentioned", not "following up").
Also populate resourceIdeas with 2-3 concrete, research-able suggestions (case study title, framework name, article topic) so the rep knows what to actually attach. Signature: "${inputs.senderName}".

EMAIL 3 — RE-ENGAGEMENT (type: "re-engagement", sendAfterDays: 14)
Target 40-90 words. Structure exactly:
- One sentence referencing something SPECIFIC from the original conversation (use details from meetingNotes)
- One sentence acknowledging time has passed without guilt-tripping
- Low-friction ask — "happy to pick back up whenever timing makes sense" style, not a meeting request
Subject 4-7 words, never "checking in". Never start with "Hope this finds you well". Signature: "${inputs.senderName}". resourceIdeas: [].

STYLE RULES (apply to all three)
- Vary sentence length deliberately - AI defaults to uniform rhythm, which sounds robotic
- Every line must use specifics from meetingNotes / challenges / nextStep - no sentence that could apply to any prospect
- Ban these phrases: "hope this finds you well", "circling back", "touching base", "just following up", "quick question", "reaching out"
- Conversational, direct, never marketingy
- Never repeat the prospect's first name more than once per email
- Compute actual body word count and put it in wordCount`;
}

export async function POST(req: Request) {
  try {
    const inputs = (await req.json()) as FollowUpInputs;

    const { experimental_output } = await generateText({
      model: "anthropic/claude-opus-4.6",
      experimental_output: Output.object({ schema: bundleSchema }),
      prompt: buildPrompt(inputs),
    });

    return Response.json(experimental_output);
  } catch (err) {
    console.error("[follow-up] generation failed", err);
    return Response.json(
      { error: "Failed to generate follow-up emails. Please try again." },
      { status: 500 },
    );
  }
}
