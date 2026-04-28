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

    // Hume EVI session_settings.system_prompt has a hard 8,000 character
    // limit. If we exceed it, the WebSocket accepts the connection, fails
    // validation, and disconnects within ~400ms with no readable error
    // surfaced to the client. Fail loud here so we see the regression
    // immediately instead of debugging a silent disconnect.
    const HUME_PROMPT_LIMIT = 8000;
    if (systemPrompt.length > HUME_PROMPT_LIMIT) {
      // eslint-disable-next-line no-console
      console.error(
        `[roleplay/hume-session] system prompt is ${systemPrompt.length} chars (limit ${HUME_PROMPT_LIMIT}). mode=${mode} scenario=${scenario.id} persona=${persona.id}`,
      );
      return NextResponse.json(
        {
          error: `System prompt is ${systemPrompt.length} characters; Hume's limit is ${HUME_PROMPT_LIMIT}. The buildSystemPrompt() output for mode='${mode}' scenario='${scenario.id}' is too long. Trim LADDER_REP_PRODUCT_FACTS or BUYER_FRAME in src/data/roleplay-scenarios.ts.`,
        },
        { status: 500 },
      );
    }

    // Pick the Hume config that matches the persona's voice gender when the
    // AI is playing the buyer. When the AI plays the rep (user_is_buyer
    // mode), we use the default female config since the rep is us either way.
    //
    // Hume config IDs are UUIDs. If someone pasted a system prompt or
    // anything else into the env var, fail fast with a readable error
    // instead of 400'ing inside the Hume websocket with an opaque message.
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const sanitize = (raw: string | undefined): string | null => {
      if (!raw) return null;
      const trimmed = raw.trim();
      return UUID_RE.test(trimmed) ? trimmed : null;
    };

    const femaleConfigId = sanitize(process.env.HUME_CONFIG);
    const maleConfigId = sanitize(process.env.HUME_CONFIG_MALE);

    if (process.env.HUME_CONFIG && !femaleConfigId) {
      return NextResponse.json(
        {
          error:
            "HUME_CONFIG is set but is not a valid UUID. Paste only the config ID from the Hume dashboard (e.g. 'f66f...'), not the system prompt.",
        },
        { status: 500 },
      );
    }
    if (process.env.HUME_CONFIG_MALE && !maleConfigId) {
      return NextResponse.json(
        {
          error:
            "HUME_CONFIG_MALE is set but is not a valid UUID. Paste only the config ID from the Hume dashboard (e.g. '6358dc46-...'), not the system prompt.",
        },
        { status: 500 },
      );
    }

    let configId: string | null = femaleConfigId;
    if (mode === "user_is_rep" && persona.voiceGender === "male") {
      configId = maleConfigId ?? femaleConfigId;
    }

    return NextResponse.json({
      systemPrompt,
      openingLine: scenario.repOpener ?? null,
      scenarioName: scenario.name,
      personaName: persona.name,
      configId,
      voiceGender: persona.voiceGender,
      maleConfigAvailable: Boolean(maleConfigId),
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("[roleplay/hume-session] failed", err);
    return NextResponse.json({ error: "Session build failed" }, { status: 500 });
  }
}
