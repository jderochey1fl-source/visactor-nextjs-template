import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { SALES_COACH_SYSTEM_PROMPT } from "@/data/knowledge-base";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: "anthropic/claude-opus-4.6",
    system: SALES_COACH_SYSTEM_PROMPT,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
