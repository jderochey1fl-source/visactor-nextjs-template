import {
  buildSystemPrompt,
  personas,
  scenarios,
  type Difficulty,
  type RoleplayMode,
} from "@/data/roleplay-scenarios";

export const runtime = "edge";

type Body = {
  scenarioId: string;
  personaId: string;
  mode: RoleplayMode;
  difficulty: Difficulty;
};

// Returns a Vapi inline assistant config. The client-side Vapi SDK
// accepts this shape directly via `vapi.start(assistantConfig)`.
export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  const scenario =
    scenarios.find((s) => s.id === body.scenarioId) ?? scenarios[0]!;
  const persona =
    personas.find((p) => p.id === body.personaId) ?? personas[0]!;
  const mode: RoleplayMode = body.mode ?? "user_is_rep";
  const difficulty: Difficulty = body.difficulty ?? "neutral";

  const system = buildSystemPrompt({ mode, scenario, persona, difficulty });

  // For "user_is_rep" the AI plays the buyer and should pick up the phone
  // (for scenarios where the buyer speaks first). For "user_is_buyer" the
  // AI plays the rep and opens with a natural cold-call opener.
  const firstMessage =
    mode === "user_is_rep"
      ? buyerFirstLine(scenario.id, persona.name)
      : "Hey — thanks for taking my call. Quick one: I saw a couple specific things about your shop that made me want to reach out. Got 30 seconds?";

  const assistantName =
    mode === "user_is_rep"
      ? `${persona.name} — ${persona.title}`
      : "Ladder AE";

  // Vapi inline assistant. Uses OpenAI GPT-4o for latency-sensitive voice
  // (Claude Opus via Vapi exists but adds ~400ms per turn). The system
  // prompt is the EXACT same one the text chat uses, so coaching stays
  // consistent between modes.
  const assistant = {
    name: assistantName,
    firstMessage,
    model: {
      provider: "openai",
      model: "gpt-4o",
      temperature: 0.85,
      messages: [{ role: "system", content: system }],
    },
    voice: {
      provider: "11labs",
      // Two voices that sound like real US roofing-industry stakeholders.
      // Rachel for female personas (Angela), Adam for male personas.
      voiceId: voiceForPersona(persona.id, mode),
      stability: 0.55,
      similarityBoost: 0.8,
    },
    transcriber: {
      provider: "deepgram",
      model: "nova-2",
      language: "en-US",
    },
    silenceTimeoutSeconds: 20,
    maxDurationSeconds: 900, // 15 min hard cap per session
    backgroundSound: "office",
    endCallPhrases: ["—— SCENE ——", "end scene", "end the scene"],
  };

  return Response.json({ assistant });
}

function voiceForPersona(personaId: string, mode: RoleplayMode): string {
  // ElevenLabs voice IDs. Swap for your team's cloned voices when ready.
  if (mode === "user_is_buyer") {
    // AI is playing the Ladder AE — always the same voice.
    return "pNInz6obpgDQGcFmaJgB"; // Adam — AE voice
  }
  // AI is playing the buyer persona.
  if (personaId === "sales-manager") return "21m00Tcm4TlvDq8ikWAM"; // Rachel
  return "pNInz6obpgDQGcFmaJgB"; // Adam fallback for male personas
}

function buyerFirstLine(scenarioId: string, personaName: string): string {
  const first = personaName.split(" ")[0] ?? "";
  switch (scenarioId) {
    case "cold-opener":
      return `This is ${first}.`;
    case "voicemail":
      return `Hi, you've reached ${personaName}. Leave a message and I'll get back to you.`;
    case "gatekeeper":
      return "Crestline Roofing, this is Linda — how can I help you?";
    case "not-interested":
      return `Yeah, we're not interested, thanks.`;
    case "reopen-dark":
      return `Oh — hey. Sorry, meant to circle back with you. What's up?`;
    default:
      return `This is ${first}.`;
  }
}
