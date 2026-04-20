"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { ArrowUp, Bot, Flag, Pause, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type {
  Difficulty,
  Persona,
  RoleplayMode,
  Scenario,
} from "@/data/roleplay-scenarios";
import { cn } from "@/lib/utils";

type Props = {
  scenario: Scenario;
  persona: Persona;
  mode: RoleplayMode;
  difficulty: Difficulty;
  onEnd: (transcript: string) => void;
};

function getText(msg: UIMessage): string {
  if (!msg.parts) return "";
  return msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");
}

function messagesToTranscript(
  messages: UIMessage[],
  mode: RoleplayMode,
  personaName: string,
): string {
  return messages
    .map((m) => {
      const label =
        m.role === "user"
          ? mode === "user_is_rep"
            ? "REP (you)"
            : `${personaName} (you)`
          : mode === "user_is_rep"
            ? personaName
            : "Ladder AE";
      return `${label}: ${getText(m)}`;
    })
    .join("\n\n");
}

export function TextChatPanel({
  scenario,
  persona,
  mode,
  difficulty,
  onEnd,
}: Props) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/roleplay/chat",
      body: {
        scenarioId: scenario.id,
        personaId: persona.id,
        mode,
        difficulty,
      },
    }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  // Does the AI take turn 1? Depends on BOTH the scenario AND which side the
  // user is playing. If the user is the REP, the AI speaks first whenever the
  // scenario has the buyer/gatekeeper answering the phone. If the user is the
  // BUYER, the AI speaks first whenever the scenario has the rep opening the
  // call (discovery, demo, dark-deal re-open, etc.).
  const aiSpeaksFirst = useMemo(() => {
    const hint = scenario.firstLineHint.toLowerCase();
    const buyerOrGatekeeperOpens =
      hint.startsWith("the buyer") || hint.startsWith("the gatekeeper");
    const repOpens = hint.startsWith("you (the rep)");

    if (mode === "user_is_rep") return buyerOrGatekeeperOpens;
    // mode === "user_is_buyer"
    return repOpens;
  }, [scenario.firstLineHint, mode]);

  const kickedRef = useRef(false);
  useEffect(() => {
    if (kickedRef.current) return;
    if (aiSpeaksFirst && messages.length === 0) {
      kickedRef.current = true;
      // Silent "scene start" marker so the AI takes the first turn in the
      // right role. We hide these messages from the visible transcript.
      const kick =
        mode === "user_is_rep"
          ? "[scene starts — phone rings, you answer]"
          : "[scene starts — take the first turn as the Ladder AE]";
      sendMessage({ text: kick });
    }
  }, [aiSpeaksFirst, messages.length, mode, sendMessage]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isStreaming) return;
    sendMessage({ text: input });
    setInput("");
  };

  const coachMe = () => {
    if (isStreaming) return;
    sendMessage({ text: "PAUSE — coach me on my last turn, then resume." });
  };

  const endScene = () => {
    const transcript = messagesToTranscript(messages, mode, persona.name);
    onEnd(transcript);
  };

  const personaLabel =
    mode === "user_is_rep" ? persona.name : `${persona.name} (you)`;
  const aeLabel = mode === "user_is_rep" ? "REP (you)" : "Ladder AE";

  return (
    <div className="flex h-full flex-col bg-background">
      {/* Scene header */}
      <div className="border-b border-border bg-card/40 px-6 py-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="rounded-sm bg-primary/10 px-1.5 py-0.5 text-primary">
              {scenario.stageLetter} · {scenario.stage}
            </span>
            <span>{scenario.name}</span>
            <span>·</span>
            <span>{difficulty}</span>
          </div>
          <div className="text-xs text-foreground/80">{scenario.setup}</div>
        </div>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messages.length === 0 && !aiSpeaksFirst ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-3 px-6 py-16 text-center">
            <div className="text-sm font-medium">You speak first.</div>
            <div className="text-xs text-muted-foreground">
              {scenario.firstLineHint}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-8">
            {messages
              // Hide the silent scene-kick system message from the user view
              .filter(
                (m) =>
                  !(
                    m.role === "user" &&
                    getText(m).startsWith("[scene starts")
                  ),
              )

              .map((m) => (
                <Message
                  key={m.id}
                  message={m}
                  aeLabel={aeLabel}
                  personaLabel={personaLabel}
                  mode={mode}
                />
              ))}
            {isStreaming &&
            messages[messages.length - 1]?.role === "user" ? (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Bot className="h-4 w-4" />
                </div>
                <TypingDots />
              </div>
            ) : null}
          </div>
        )}
      </div>

      {/* Input */}
      <form
        onSubmit={submit}
        className="border-t border-border bg-card px-6 py-4"
      >
        <div className="mx-auto flex max-w-3xl flex-col gap-2">
          <div className="flex items-end gap-2">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit(e);
                }
              }}
              placeholder={
                mode === "user_is_rep"
                  ? "Your turn as the rep... (Enter to send · Shift+Enter for newline)"
                  : `Your turn as ${persona.name}... (Enter to send)`
              }
              rows={input.includes("\n") ? 4 : 2}
              className="max-h-48 resize-none"
              disabled={isStreaming}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!input.trim() || isStreaming}
              aria-label="Send turn"
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={coachMe}
                disabled={isStreaming || messages.length < 2}
                className="gap-1.5"
              >
                <Pause className="h-3.5 w-3.5" />
                Coach me
              </Button>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={endScene}
              disabled={messages.length < 2}
              className="gap-1.5"
            >
              <Flag className="h-3.5 w-3.5" />
              End & debrief
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

function Message({
  message,
  aeLabel,
  personaLabel,
  mode,
}: {
  message: UIMessage;
  aeLabel: string;
  personaLabel: string;
  mode: RoleplayMode;
}) {
  const isUser = message.role === "user";
  const text = getText(message);
  // Label depends on which side the user is playing
  const label = isUser
    ? mode === "user_is_rep"
      ? aeLabel
      : personaLabel
    : mode === "user_is_rep"
      ? personaLabel
      : aeLabel;

  return (
    <div
      className={cn(
        "flex items-start gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary",
        )}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={cn(
          "flex max-w-[85%] flex-col gap-1",
          isUser ? "items-end" : "items-start",
        )}
      >
        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
        <div
          className={cn(
            "whitespace-pre-wrap rounded-md px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-primary text-primary-foreground"
              : "border border-border bg-card text-foreground",
          )}
        >
          {text}
        </div>
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground" />
    </span>
  );
}
