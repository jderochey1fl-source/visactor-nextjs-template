import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  buildSystemPrompt,
  personas,
  scenarios,
  type Difficulty,
  type RoleplayMode,
} from "@/data/roleplay-scenarios";

export const maxDuration = 60;

type Body = {
  messages: UIMessage[];
  scenarioId?: string;
  personaId?: string;
  mode?: RoleplayMode;
  difficulty?: Difficulty;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const {
    messages,
    scenarioId = "cold-opener",
    personaId = "owner",
    mode = "user_is_rep",
    difficulty = "neutral",
  } = body;

  const scenario =
    scenarios.find((s) => s.id === scenarioId) ?? scenarios[0]!;
  const persona = personas.find((p) => p.id === personaId) ?? personas[0]!;

  const system = buildSystemPrompt({ mode, scenario, persona, difficulty });

  const result = streamText({
    model: "anthropic/claude-opus-4.6",
    system,
    messages: await convertToModelMessages(messages),
    temperature: 0.85, // slightly higher for conversational realism
  });

  return result.toUIMessageStreamResponse();
}
