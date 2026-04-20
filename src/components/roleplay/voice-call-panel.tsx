"use client";

import Vapi from "@vapi-ai/web";
import { Flag, Mic, MicOff, PhoneCall, PhoneOff } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  publicKey: string;
  onEnd: (transcript: string) => void;
};

type CallStatus = "idle" | "connecting" | "live" | "ending";

type TurnLine = {
  role: "user" | "assistant";
  text: string;
  at: number;
};

export function VoiceCallPanel({
  scenario,
  persona,
  mode,
  difficulty,
  publicKey,
  onEnd,
}: Props) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [muted, setMuted] = useState(false);
  const [lines, setLines] = useState<TurnLine[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const vapiRef = useRef<Vapi | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lazy init Vapi once per mount
  useEffect(() => {
    if (!publicKey) return;
    const vapi = new Vapi(publicKey);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setStatus("live");
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startedAtRef.current) {
          setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }
      }, 500);
    });

    vapi.on("call-end", () => {
      setStatus("idle");
      if (timerRef.current) clearInterval(timerRef.current);
      startedAtRef.current = null;
    });

    vapi.on("error", (e: unknown) => {
      const msg = e instanceof Error ? e.message : "Vapi connection error.";
      setError(msg);
      setStatus("idle");
    });

    // Transcript stream. Vapi emits `message` with transcript roles.
    vapi.on("message", (m: Record<string, unknown>) => {
      if (m.type === "transcript" && m.transcriptType === "final") {
        const role = m.role === "user" ? "user" : "assistant";
        const transcript = typeof m.transcript === "string" ? m.transcript : "";
        if (!transcript.trim()) return;
        setLines((prev) => [
          ...prev,
          { role, text: transcript, at: Date.now() },
        ]);
      }
    });

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      vapi.stop();
      vapiRef.current = null;
    };
  }, [publicKey]);

  const start = async () => {
    setError(null);
    setLines([]);
    setStatus("connecting");
    try {
      const res = await fetch("/api/roleplay/vapi-config", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scenarioId: scenario.id,
          personaId: persona.id,
          mode,
          difficulty,
        }),
      });
      if (!res.ok) throw new Error("Failed to build assistant config.");
      const { assistant } = await res.json();
      await vapiRef.current?.start(assistant);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Could not start the call.";
      setError(msg);
      setStatus("idle");
    }
  };

  const stop = () => {
    setStatus("ending");
    vapiRef.current?.stop();
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    vapiRef.current?.setMuted(next);
  };

  const endAndDebrief = () => {
    const transcript = lines
      .map((l) => {
        const label =
          l.role === "user"
            ? mode === "user_is_rep"
              ? "REP (you)"
              : `${persona.name} (you)`
            : mode === "user_is_rep"
              ? persona.name
              : "Ladder AE";
        return `${label}: ${l.text}`;
      })
      .join("\n\n");

    // Stop the call if still live
    if (status === "live" || status === "connecting") {
      vapiRef.current?.stop();
    }
    onEnd(transcript);
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const canStart = status === "idle";
  const canStop = status === "live" || status === "connecting";

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
            <span>·</span>
            <span>voice</span>
          </div>
          <div className="text-xs text-foreground/80">{scenario.setup}</div>
        </div>
      </div>

      {/* Call status */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-8">
        <div className="flex flex-col items-center gap-3">
          <div
            className={cn(
              "flex h-28 w-28 items-center justify-center rounded-full border-4 transition-all",
              status === "live"
                ? "border-primary bg-primary/10"
                : status === "connecting"
                  ? "border-warning bg-warning/10 animate-pulse"
                  : "border-border bg-card",
            )}
          >
            {status === "live" ? (
              <Mic
                className={cn(
                  "h-10 w-10 text-primary",
                  !muted && "animate-pulse",
                )}
              />
            ) : status === "connecting" ? (
              <PhoneCall className="h-10 w-10 text-warning" />
            ) : (
              <Mic className="h-10 w-10 text-muted-foreground" />
            )}
          </div>
          <div className="flex flex-col items-center gap-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {status === "live"
                ? `On call · ${mm}:${ss}`
                : status === "connecting"
                  ? "Connecting..."
                  : "Ready to dial"}
            </div>
            <div className="text-sm font-semibold">
              {mode === "user_is_rep"
                ? `${persona.name} — ${persona.title}`
                : "Ladder AE"}
            </div>
            <div className="text-xs text-muted-foreground">
              {persona.company}
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        ) : null}

        {/* Controls */}
        <div className="flex items-center gap-3">
          {canStart ? (
            <Button size="lg" onClick={start} className="gap-2">
              <PhoneCall className="h-4 w-4" />
              Start call
            </Button>
          ) : null}
          {status === "live" ? (
            <Button
              size="lg"
              variant="outline"
              onClick={toggleMute}
              className="gap-2"
            >
              {muted ? (
                <>
                  <MicOff className="h-4 w-4" />
                  Unmute
                </>
              ) : (
                <>
                  <Mic className="h-4 w-4" />
                  Mute
                </>
              )}
            </Button>
          ) : null}
          {canStop ? (
            <Button
              size="lg"
              variant="destructive"
              onClick={stop}
              className="gap-2"
            >
              <PhoneOff className="h-4 w-4" />
              Hang up
            </Button>
          ) : null}
        </div>

        {/* Live transcript */}
        {lines.length > 0 ? (
          <div className="mt-4 w-full max-w-2xl">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Live transcript
            </div>
            <div className="max-h-64 overflow-y-auto rounded-md border border-border bg-card p-4">
              <ul className="flex flex-col gap-2">
                {lines.map((l, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-xs leading-relaxed"
                  >
                    <Badge
                      variant={l.role === "user" ? "default" : "muted"}
                      className="shrink-0 font-mono text-[9px]"
                    >
                      {l.role === "user"
                        ? mode === "user_is_rep"
                          ? "REP"
                          : "YOU"
                        : mode === "user_is_rep"
                          ? "BUYER"
                          : "AE"}
                    </Badge>
                    <span className="text-foreground/90">{l.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>

      {/* End & debrief */}
      <div className="border-t border-border bg-card px-6 py-3">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-2">
          <div className="text-xs text-muted-foreground">
            {lines.length > 0
              ? `${lines.length} turn${lines.length === 1 ? "" : "s"} captured.`
              : "Transcript streams here once the call starts."}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={endAndDebrief}
            disabled={lines.length < 2}
            className="gap-1.5"
          >
            <Flag className="h-3.5 w-3.5" />
            End & debrief
          </Button>
        </div>
      </div>
    </div>
  );
}
