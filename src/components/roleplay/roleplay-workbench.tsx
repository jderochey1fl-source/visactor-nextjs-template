"use client";

import { useState } from "react";
import { DebriefPanel } from "@/components/roleplay/debrief-panel";
import { SetupPanel, type SetupState } from "@/components/roleplay/setup-panel";
import { TextChatPanel } from "@/components/roleplay/text-chat-panel";
import { VoiceCallPanel } from "@/components/roleplay/voice-call-panel";
import {
  personas,
  scenarios,
} from "@/data/roleplay-scenarios";

type Phase = "setup" | "running" | "debrief";

const DEFAULT_SETUP: SetupState = {
  mode: "user_is_rep",
  scenarioId: "cold-opener",
  personaId: "owner",
  difficulty: "neutral",
  channel: "text",
};

export function RoleplayWorkbench() {
  const [setup, setSetup] = useState<SetupState>(DEFAULT_SETUP);
  const [phase, setPhase] = useState<Phase>("setup");
  const [transcript, setTranscript] = useState<string>("");
  // Key used to fully remount the chat/voice panel between runs so prior state
  // (message history, Vapi connection) doesn't leak into the next scene.
  const [runKey, setRunKey] = useState(0);

  const scenario =
    scenarios.find((s) => s.id === setup.scenarioId) ?? scenarios[0]!;
  const persona =
    personas.find((p) => p.id === setup.personaId) ?? personas[0]!;

  // Voice runs through Hume EVI. HUME_API_KEY and HUME_CONFIG live server-
  // side; the voice panel fetches an access token + the scenario-specific
  // session config from /api/roleplay/*. If those fail, the panel shows a
  // clear error. We surface "available" to the setup UI optimistically and
  // let the Voice panel handle the actual provisioning.
  const voiceAvailable = true;

  const handleEnd = (t: string) => {
    setTranscript(t);
    setPhase("debrief");
  };

  const restart = () => {
    setRunKey((k) => k + 1);
    setTranscript("");
    setPhase("running");
  };

  const newScene = () => {
    setTranscript("");
    setPhase("setup");
    setRunKey((k) => k + 1);
  };

  if (phase === "setup") {
    return (
      <SetupPanel
        value={setup}
        onChange={setSetup}
        onStart={() => setPhase("running")}
        voiceAvailable={voiceAvailable}
      />
    );
  }

  if (phase === "debrief") {
    return (
      <DebriefPanel
        scenario={scenario}
        persona={persona}
        mode={setup.mode}
        transcript={transcript}
        onRestart={restart}
        onNewScene={newScene}
      />
    );
  }

  // running
  if (setup.channel === "voice") {
    return (
      <VoiceCallPanel
        key={runKey}
        scenario={scenario}
        persona={persona}
        mode={setup.mode}
        difficulty={setup.difficulty}
        onEnd={handleEnd}
      />
    );
  }

  return (
    <TextChatPanel
      key={runKey}
      scenario={scenario}
      persona={persona}
      mode={setup.mode}
      difficulty={setup.difficulty}
      onEnd={handleEnd}
    />
  );
}
