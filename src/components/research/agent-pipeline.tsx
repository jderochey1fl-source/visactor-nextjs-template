"use client";

import {
  Activity,
  Briefcase,
  Building2,
  CheckCircle2,
  Loader2,
  Map,
  Users,
} from "lucide-react";
import { researchAgents } from "@/data/research";
import { cn } from "@/lib/utils";
import type { ProspectInput } from "./prospect-form";

export type AgentStatus = "pending" | "running" | "done";

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  "agent-company": Building2,
  "agent-motion": Users,
  "agent-hiring": Briefcase,
  "agent-territory": Map,
  "agent-synth": Activity,
};

export function AgentPipeline({
  statuses,
  phase,
  prospect,
}: {
  statuses: Record<string, AgentStatus>;
  phase: "idle" | "running" | "complete";
  prospect: ProspectInput | null;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Agent pipeline
          </h2>
          <p className="text-xs text-muted-foreground">
            {prospect
              ? `Researching ${prospect.companyName} · ${prospect.hqCity}, ${prospect.hqState}`
              : "Waiting for company input"}
          </p>
        </div>
        <PhasePill phase={phase} />
      </div>

      <ol className="grid grid-cols-1 gap-3 tablet:grid-cols-2 laptop:grid-cols-5">
        {researchAgents.map((agent, idx) => {
          const status = statuses[agent.id] ?? "pending";
          const Icon = icons[agent.id] ?? Activity;
          return (
            <li
              key={agent.id}
              className={cn(
                "relative flex flex-col gap-2 rounded-md border bg-background p-3 transition-colors",
                status === "done"
                  ? "border-success/40 bg-success/5"
                  : status === "running"
                    ? "border-primary/50 bg-primary/5"
                    : "border-border",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-md",
                      status === "done"
                        ? "bg-success/10 text-success"
                        : status === "running"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                    agent {idx + 1}
                  </span>
                </span>
                <StatusDot status={status} />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold">{agent.name}</span>
                <span className="text-[11px] leading-tight text-muted-foreground">
                  {agent.role}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {agent.outputs.slice(0, 3).map((o) => (
                  <span
                    key={o}
                    className={cn(
                      "rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors",
                      status === "done" &&
                        "border-success/30 text-foreground",
                    )}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function StatusDot({ status }: { status: AgentStatus }) {
  if (status === "done") {
    return <CheckCircle2 className="h-4 w-4 text-success" />;
  }
  if (status === "running") {
    return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
  }
  return <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />;
}

function PhasePill({ phase }: { phase: "idle" | "running" | "complete" }) {
  const map: Record<string, { label: string; cls: string }> = {
    idle: { label: "idle", cls: "bg-muted text-muted-foreground" },
    running: { label: "running", cls: "bg-primary/10 text-primary" },
    complete: { label: "complete", cls: "bg-success/10 text-success" },
  };
  const { label, cls } = map[phase];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-2 py-1 font-mono text-[10px] uppercase tracking-wider",
        cls,
      )}
    >
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          phase === "running"
            ? "animate-pulse-dot bg-primary"
            : phase === "complete"
              ? "bg-success"
              : "bg-muted-foreground/40",
        )}
      />
      {label}
    </span>
  );
}
