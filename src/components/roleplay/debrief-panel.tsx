"use client";

import { Copy, Download, FileJson, FileText, RefreshCw, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import type {
  Persona,
  RoleplayMode,
  Scenario,
} from "@/data/roleplay-scenarios";

type Props = {
  scenario: Scenario;
  persona: Persona;
  mode: RoleplayMode;
  transcript: string;
  onRestart: () => void;
  onNewScene: () => void;
};

// Build a filesystem-safe slug for filenames.
function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

// Format the local timestamp as YYYY-MM-DD-HHmm for filenames.
function stamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

// Trigger a file download in the browser. Cleans up the object URL after.
function triggerDownload(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function DebriefPanel({
  scenario,
  persona,
  mode,
  transcript,
  onRestart,
  onNewScene,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [debrief, setDebrief] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/roleplay/debrief", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            scenarioId: scenario.id,
            personaId: persona.id,
            mode,
            transcript,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Debrief failed.");
        if (!cancelled) setDebrief(data.debrief);
      } catch (e) {
        if (!cancelled)
          setError(
            e instanceof Error ? e.message : "Could not generate debrief.",
          );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    run();
    return () => {
      cancelled = true;
    };
  }, [scenario.id, persona.id, mode, transcript]);

  const copyAll = async () => {
    const body = `${scenario.name} — debrief\n\n${debrief ?? ""}\n\n---\nTRANSCRIPT:\n${transcript}`;
    await navigator.clipboard.writeText(body);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const baseName = `roleplay-${slugify(scenario.name)}-${slugify(persona.name)}-${stamp()}`;

  const downloadTranscript = () => {
    const header = [
      `LADDER ROLE-PLAY — TRANSCRIPT`,
      `Scenario:    ${scenario.name}`,
      `Persona:     ${persona.name} (${persona.title}, ${persona.company})`,
      `Played as:   ${mode === "user_is_rep" ? "REP" : "BUYER"}`,
      `Captured:    ${new Date().toLocaleString()}`,
      ``,
      `------------------------------------------------------------`,
      ``,
    ].join("\n");
    triggerDownload(`${baseName}-transcript.txt`, header + transcript, "text/plain;charset=utf-8");
  };

  const downloadDebrief = () => {
    if (!debrief) return;
    const md = [
      `# Role-Play Debrief — ${scenario.name}`,
      ``,
      `- **Persona:** ${persona.name} (${persona.title}, ${persona.company})`,
      `- **Played as:** ${mode === "user_is_rep" ? "Rep" : "Buyer"}`,
      `- **Captured:** ${new Date().toLocaleString()}`,
      ``,
      `## Coach's Notes`,
      ``,
      debrief,
      ``,
      `## Coaching Rubric`,
      ``,
      ...scenario.keyBeats.map((b, i) => `${i + 1}. ${b}`),
      ``,
    ].join("\n");
    triggerDownload(`${baseName}-debrief.md`, md, "text/markdown;charset=utf-8");
  };

  const downloadJson = () => {
    const payload = {
      capturedAt: new Date().toISOString(),
      mode,
      scenario: {
        id: scenario.id,
        name: scenario.name,
        stage: scenario.stage,
        stageLetter: scenario.stageLetter,
        keyBeats: scenario.keyBeats,
      },
      persona: {
        id: persona.id,
        name: persona.name,
        title: persona.title,
        company: persona.company,
      },
      transcript,
      debrief,
    };
    triggerDownload(`${baseName}-session.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="border-b border-border bg-card/40 px-6 py-3">
        <div className="mx-auto flex max-w-3xl flex-col gap-1">
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <Trophy className="h-3 w-3 text-primary" />
            <span className="text-primary">Debrief</span>
            <span>·</span>
            <span>{scenario.name}</span>
          </div>
          <div className="text-xs text-foreground/80">
            Ran as <strong>{mode === "user_is_rep" ? "REP" : "BUYER"}</strong>{" "}
            against <strong>{persona.name}</strong>.
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* Key beats rubric */}
          <section className="rounded-md border border-border bg-card p-4">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Coaching rubric for this scenario
            </div>
            <ul className="flex flex-col gap-1.5 text-sm">
              {scenario.keyBeats.map((b, i) => (
                <li key={i} className="flex gap-2">
                  <span className="font-mono text-xs text-muted-foreground">
                    {i + 1}.
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* AI debrief */}
          <section className="rounded-md border border-primary/30 bg-primary/5 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-primary">
                Coach&apos;s notes
              </div>
              {debrief ? (
                <div className="flex flex-wrap items-center gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyAll}
                    className="gap-1.5"
                  >
                    <Copy className="h-3 w-3" />
                    {copied ? "Copied" : "Copy all"}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={downloadDebrief}
                    className="gap-1.5"
                    title="Download debrief as Markdown"
                  >
                    <Download className="h-3 w-3" />
                    Debrief (.md)
                  </Button>
                </div>
              ) : null}
            </div>
            {loading ? (
              <div className="text-sm text-muted-foreground">
                Analyzing transcript...
              </div>
            ) : error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                {debrief}
              </div>
            )}
          </section>

          {/* Transcript */}
          <section className="rounded-md border border-border bg-card p-4">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Transcript
              </div>
              <div className="flex flex-wrap items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={downloadTranscript}
                  className="gap-1.5"
                  title="Download transcript as plain text"
                >
                  <FileText className="h-3 w-3" />
                  Transcript (.txt)
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={downloadJson}
                  className="gap-1.5"
                  title="Download full session (scenario, persona, transcript, debrief)"
                >
                  <FileJson className="h-3 w-3" />
                  Session (.json)
                </Button>
              </div>
            </div>
            <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-foreground/90">
              {transcript}
            </pre>
          </section>

          <div className="flex flex-col gap-2 tablet:flex-row">
            <Button onClick={onRestart} variant="outline" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Run same scenario again
            </Button>
            <Button onClick={onNewScene} className="gap-2">
              New scene
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
