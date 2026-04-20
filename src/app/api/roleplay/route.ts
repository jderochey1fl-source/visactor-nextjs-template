import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  roleplayPersonas,
  roleplayScenarios,
  type RoleplayDifficulty,
  type RoleplayMode,
} from "@/data/roleplay-scenarios";
import { buildRoleplayPrompt } from "@/lib/build-roleplay-prompt";

export const maxDuration = 30;

type Body = {
  messages: UIMessage[];
  mode?: RoleplayMode;
  personaId?: string;
  scenarioId?: string;
  difficulty?: RoleplayDifficulty;
  extraContext?: string;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  const {
    messages,
    mode = "icp",
    personaId,
    scenarioId,
    difficulty = "skeptical",
    extraContext,
  } = body;

  const persona =
    roleplayPersonas.find((p) => p.id === personaId) ?? roleplayPersonas[0];
  const scenario =
    roleplayScenarios.find((s) => s.id === scenarioId) ?? roleplayScenarios[0];

  const system = buildRoleplayPrompt({
    mode,
    persona,
    scenario,
    difficulty,
    extraContext,
    forVoice: false,
  });

  const result = streamText({
    model: "anthropic/claude-opus-4.6",
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
