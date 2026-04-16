"use client";

import { useCallback, useState } from "react";
import { researchAgents, demoResearchResult } from "@/data/research";
import type { ResearchResult } from "@/types/types";
import { AgentPipeline, type AgentStatus } from "./agent-pipeline";
import { CallPrepCard } from "./call-prep-card";
import { ProspectForm, type ProspectInput } from "./prospect-form";

type Phase = "idle" | "running" | "complete";

export function ResearchWorkbench() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [statuses, setStatuses] = useState<Record<string, AgentStatus>>(() =>
    Object.fromEntries(researchAgents.map((a) => [a.id, "pending"])),
  );
  const [prospect, setProspect] = useState<ProspectInput | null>(null);
  const [result, setResult] = useState<ResearchResult | null>(null);

  const run = useCallback((input: ProspectInput) => {
    setProspect(input);
    setResult(null);
    setPhase("running");
    setStatuses(
      Object.fromEntries(researchAgents.map((a) => [a.id, "pending"])),
    );

    const timings = [400, 1100, 1800, 2500, 3300];
    researchAgents.forEach((agent, idx) => {
      setTimeout(() => {
        setStatuses((s) => ({ ...s, [agent.id]: "running" }));
      }, timings[idx] - 300);
      setTimeout(() => {
        setStatuses((s) => ({ ...s, [agent.id]: "done" }));
        if (idx === researchAgents.length - 1) {
          setResult({
            ...demoResearchResult,
            prospect: {
              name: input.name || demoResearchResult.prospect.name,
              address:
                input.address || demoResearchResult.prospect.address,
            },
          });
          setPhase("complete");
        }
      }, timings[idx] + 400);
    });
  }, []);

  const reset = useCallback(() => {
    setPhase("idle");
    setProspect(null);
    setResult(null);
    setStatuses(
      Object.fromEntries(researchAgents.map((a) => [a.id, "pending"])),
    );
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 laptop:grid-cols-[360px_1fr]">
      <div className="flex flex-col gap-4">
        <ProspectForm onSubmit={run} disabled={phase === "running"} />
      </div>

      <div className="flex flex-col gap-6">
        <AgentPipeline
          statuses={statuses}
          phase={phase}
          prospect={prospect}
        />

        {phase === "complete" && result ? (
          <CallPrepCard result={result} onReset={reset} />
        ) : (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
            <p className="text-sm font-medium">
              {phase === "running"
                ? "Synthesizing intelligence..."
                : "Run research to see the call prep card."}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Opening line, priority points, likely objections, pricing anchor,
              and the next step — synthesized from the five agents above.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
