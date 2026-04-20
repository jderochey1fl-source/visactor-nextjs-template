"use client";

import { VoiceProvider, useVoice } from "@humeai/voice-react";
import {
  AlertTriangle,
  Flag,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
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
  onEnd: (transcript: string) => void;
};

type SessionConfig = {
  systemPrompt: string;
  configId: string | null;
  voiceGender: "male" | "female";
  maleConfigAvailable: boolean;
};

/**
 * Voice Role Play panel (Hume EVI).
 *
 * API flow:
 *   1. POST /api/roleplay/hume-session       → scenario system prompt + right configId
 *   2. POST /api/roleplay/hume-token         → short-lived access token
 *   3. <VoiceProvider> wraps the <Call> body (event handlers only — per Hume React SDK)
 *   4. Inside <Call>, useVoice().connect({ auth, configId, sessionSettings })
 *
 * The access token is minted server-side so HUME_API_KEY / HUME_SECRET never
 * touch the browser.
 */
export function VoiceCallPanel(props: Props) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [session, setSession] = useState<SessionConfig | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { scenario, persona, mode, difficulty } = props;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [tokenRes, sessionRes] = await Promise.all([
          fetch("/api/roleplay/hume-token", { method: "POST" }),
          fetch("/api/roleplay/hume-session", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              scenarioId: scenario.id,
              personaId: persona.id,
              mode,
              difficulty,
            }),
          }),
        ]);

        if (!tokenRes.ok) {
          const body = await tokenRes.json().catch(() => ({}));
          throw new Error(
            body?.error ??
              "Could not mint a Hume access token. Check HUME_API_KEY and HUME_SECRET.",
          );
        }
        if (!sessionRes.ok) {
          const body = await sessionRes.json().catch(() => ({}));
          throw new Error(
            body?.error ?? "Could not build the Hume session prompt.",
          );
        }

        const { accessToken: token } = (await tokenRes.json()) as {
          accessToken: string;
        };
        const s = (await sessionRes.json()) as SessionConfig;

        if (cancelled) return;
        setAccessToken(token);
        setSession(s);
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof Error ? e.message : "Failed to prepare voice session.";
        setError(msg);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scenario.id, persona.id, mode, difficulty]);

  if (error) {
    return (
      <SceneShell {...props}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/40 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="text-sm font-semibold">Voice unavailable</div>
          <div className="max-w-md text-xs text-muted-foreground">{error}</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => props.onEnd("")}
            className="mt-2"
          >
            Back to setup
          </Button>
        </div>
      </SceneShell>
    );
  }

  if (!accessToken || !session) {
    return (
      <SceneShell {...props}>
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-12 w-12 animate-pulse rounded-full border border-border bg-card" />
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Preparing voice session…
          </div>
        </div>
      </SceneShell>
    );
  }

  return (
    <VoiceProvider>
      <Call {...props} session={session} accessToken={accessToken} />
    </VoiceProvider>
  );
}

/**
 * Inner Call component — MUST be a child of <VoiceProvider> because
 * useVoice() reads from its context. Owns the actual connect(), transcript
 * stream, mic/hangup UI, and the end-and-debrief hand-off.
 */
function Call({
  scenario,
  persona,
  mode,
  session,
  accessToken,
  onEnd,
}: Props & { session: SessionConfig; accessToken: string }) {
  const { connect, disconnect, messages, status, mute, unmute, isMuted } =
    useVoice();

  const [elapsed, setElapsed] = useState(0);
  const [connectError, setConnectError] = useState<string | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isLive = status.value === "connected";
  const isConnecting = status.value === "connecting";

  useEffect(() => {
    if (isLive && startedAtRef.current === null) {
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => {
        if (startedAtRef.current) {
          setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
        }
      }, 500);
    }
    if (!isLive && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
      startedAtRef.current = null;
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isLive]);

  // Build transcript from the streaming messages array.
  const lines = useMemo(() => {
    return messages
      .filter(
        (m) => m.type === "user_message" || m.type === "assistant_message",
      )
      .map((m) => {
        const role = m.type === "user_message" ? "user" : "assistant";
        // Hume streams messages with a `message` object that has `content`.
        const content =
          (m as unknown as { message?: { content?: string } }).message
            ?.content ?? "";
        return { role, text: content };
      })
      .filter((l) => l.text.trim().length > 0);
  }, [messages]);

  const start = async () => {
    setConnectError(null);
    try {
      await connect({
        auth: { type: "accessToken", value: accessToken },
        ...(session.configId ? { configId: session.configId } : {}),
        sessionSettings: {
          type: "session_settings",
          systemPrompt: session.systemPrompt,
        },
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Could not connect to Hume EVI.";
      setConnectError(msg);
    }
  };

  const hangUp = () => {
    disconnect();
  };

  const toggleMute = () => {
    if (isMuted) unmute();
    else mute();
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

    if (isLive || isConnecting) {
      disconnect();
    }
    onEnd(transcript);
  };

  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  const needsMaleConfigHint =
    mode === "user_is_rep" &&
    session.voiceGender === "male" &&
    !session.maleConfigAvailable;

  return (
    <SceneShell
      scenario={scenario}
      persona={persona}
      mode={mode}
      difficulty={"neutral"}
      onEnd={onEnd}
    >
      <div className="flex flex-col items-center gap-3">
        <div
          className={cn(
            "flex h-28 w-28 items-center justify-center rounded-full border-4 transition-all",
            isLive
              ? "border-primary bg-primary/10"
              : isConnecting
                ? "border-warning bg-warning/10 animate-pulse"
                : "border-border bg-card",
          )}
        >
          {isLive ? (
            <Mic
              className={cn(
                "h-10 w-10 text-primary",
                !isMuted && "animate-pulse",
              )}
            />
          ) : isConnecting ? (
            <PhoneCall className="h-10 w-10 text-warning" />
          ) : (
            <Mic className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {isLive
              ? `On call · ${mm}:${ss}`
              : isConnecting
                ? "Connecting…"
                : "Ready to dial"}
          </div>
          <div className="text-sm font-semibold">
            {mode === "user_is_rep"
              ? `${persona.name} — ${persona.title}`
              : "Ladder AE"}
          </div>
          <div className="text-xs text-muted-foreground">{persona.company}</div>
        </div>
      </div>

      {needsMaleConfigHint ? (
        <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/5 px-3 py-2 text-xs text-warning">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>
            Using the default (female) Hume voice for this male persona. Add
            <code className="mx-1 rounded bg-card px-1 py-0.5 text-[11px]">
              HUME_CONFIG_MALE
            </code>
            in project vars to get a matching male voice.
          </span>
        </div>
      ) : null}

      {connectError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {connectError}
        </div>
      ) : null}

      <div className="flex items-center gap-3">
        {!isLive && !isConnecting ? (
          <Button size="lg" onClick={start} className="gap-2">
            <PhoneCall className="h-4 w-4" />
            Start call
          </Button>
        ) : null}
        {isLive ? (
          <Button
            size="lg"
            variant="outline"
            onClick={toggleMute}
            className="gap-2"
          >
            {isMuted ? (
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
        {isLive || isConnecting ? (
          <Button
            size="lg"
            variant="destructive"
            onClick={hangUp}
            className="gap-2"
          >
            <PhoneOff className="h-4 w-4" />
            Hang up
          </Button>
        ) : null}
      </div>

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

      <div className="absolute inset-x-0 bottom-0 border-t border-border bg-card px-6 py-3">
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
    </SceneShell>
  );
}

function SceneShell({
  scenario,
  difficulty,
  children,
}: Props & { children: React.ReactNode }) {
  return (
    <div className="relative flex h-full flex-col bg-background">
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
            <span>voice · Hume EVI</span>
          </div>
          <div className="text-xs text-foreground/80">{scenario.setup}</div>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 pb-20 pt-8">
        {children}
      </div>
    </div>
  );
}
