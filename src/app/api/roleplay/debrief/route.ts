import { generateText } from "ai";
import {
  buildDebriefPrompt,
  personas,
  scenarios,
  type RoleplayMode,
} from "@/data/roleplay-scenarios";

export const maxDuration = 30;

type Body = {
  scenarioId: string;
  personaId: string;
  mode: RoleplayMode;
  transcript: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const scenario =
    scenarios.find((s) => s.id === body.scenarioId) ?? scenarios[0]!;
  const persona =
    personas.find((p) => p.id === body.personaId) ?? personas[0]!;

  if (!body.transcript?.trim()) {
    return Response.json(
      {
        error:
          "No transcript provided. Run at least a few turns before debriefing.",
      },
      { status: 400 },
    );
  }

  const prompt = buildDebriefPrompt({
    mode: body.mode,
    scenario,
    persona,
    transcript: body.transcript,
  });

  try {
    const { text } = await generateText({
      model: "anthropic/claude-opus-4.6",
      prompt,
      temperature: 0.4,
    });

    return Response.json({ debrief: text });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[roleplay:debrief] generation failed", err);
    return Response.json(
      { error: "Debrief generation failed. Try again." },
      { status: 500 },
    );
  }
}
