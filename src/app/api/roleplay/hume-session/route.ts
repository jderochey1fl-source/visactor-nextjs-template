import { NextResponse } from "next/server";
import {
  buildSystemPrompt,
  personas,
  scenarios,
  type Difficulty,
  type RoleplayMode,
} from "@/data/roleplay-scenarios";

export const runtime = "nodejs";

/**
 * Builds the system prompt + opening-turn hint for a scenario and returns it
 * to the browser. The browser sends this to Hume EVI as a session_settings
 * message right after the WebSocket opens, so the default Hume assistant
 * behavior is overridden with our scenario-specific character + rubric.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      scenarioId?: string;
      personaId?: string;
      mode?: RoleplayMode;
      difficulty?: Difficulty;
    };

    const scenario = scenarios.find((s) => s.id === body.scenarioId);
    const persona = personas.find((p) => p.id === body.personaId);
    const mode: RoleplayMode = body.mode ?? "user_is_rep";
    const difficulty: Difficulty = body.difficulty ?? "neutral";

    if (!scenario || !persona) {
      return NextResponse.json(
        { error: "Unknown scenario or persona." },
        { status: 400 },
      );
    }

    const systemPrompt = buildSystemPrompt({
      mode,
      scenario,
      persona,
      difficulty,
    });

    return NextResponse.json({
      systemPrompt,
      openingLine: scenario.repOpener ?? null,
      scenarioName: scenario.name,
      personaName: persona.name,
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[roleplay/hume-session] failed", err);
    return NextResponse.json({ error: "Session build failed" }, { status: 500 });
  }
}
