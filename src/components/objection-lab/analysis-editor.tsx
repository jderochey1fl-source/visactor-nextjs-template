"use client";

import {
  ArrowRight,
  Copy,
  Drama,
  HelpCircle,
  MessageCircle,
  Quote,
  Save,
  Target,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { RebuttalOptions } from "@/components/objection-lab/rebuttal-options";
import { RoleplayPanel } from "@/components/objection-lab/roleplay-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { leverByKey } from "@/data/rebuttal-levers";
import { cn } from "@/lib/utils";
import type {
  LoggedObjection,
  LoggedObjectionStatus,
  ObjectionCategory,
  RebuttalOption,
} from "@/types/types";

const CATEGORIES: { value: ObjectionCategory; label: string }[] = [
  { value: "price", label: "Price" },
  { value: "timing", label: "Timing" },
  { value: "trust", label: "Trust" },
  { value: "spouse", label: "Spouse / Partner" },
  { value: "insurance", label: "Insurance" },
  { value: "competitor", label: "Competitor" },
  { value: "process", label: "Process" },
];

const STATUSES: { value: LoggedObjectionStatus; label: string }[] = [
  { value: "draft", label: "Draft — not yet tested" },
  { value: "practicing", label: "Practicing — tested, still refining" },
  { value: "mastered", label: "Mastered — comes out naturally" },
];

type Props = {
  draft: LoggedObjection;
  isNew: boolean;
  onSave: (next: LoggedObjection) => void;
  onDiscard: () => void;
  onRoleplayPassed: (id: string) => void;
};

type Tab = "analysis" | "roleplay";

export function AnalysisEditor({
  draft,
  isNew,
  onSave,
  onDiscard,
  onRoleplayPassed,
}: Props) {
  const [tab, setTab] = useState<Tab>("analysis");
  const [local, setLocal] = useState<LoggedObjection>(draft);

  function update<K extends keyof LoggedObjection>(
    key: K,
    value: LoggedObjection[K],
  ) {
    setLocal((prev) => ({ ...prev, [key]: value }));
  }

  function updateAnalysis<K extends keyof LoggedObjection["analysis"]>(
    key: K,
    value: LoggedObjection["analysis"][K],
  ) {
    setLocal((prev) => ({ ...prev, analysis: { ...prev.analysis, [key]: value } }));
  }

  function copyAll() {
    const rebuttalsBlock =
      local.analysis.rebuttals && local.analysis.rebuttals.length > 0
        ? [
            ``,
            `Rebuttal options:`,
            ...local.analysis.rebuttals.map((r) => {
              const lever = leverByKey(r.lever);
              const lines = [
                `  [${lever.name}${r.headline ? ` — ${r.headline}` : ""}]`,
                `  ${r.script}`,
              ];
              if (r.roi?.sentence) {
                lines.push(`  ROI · ${r.roi.sentence}`);
              }
              return lines.join("\n");
            }),
          ]
        : [];
    const block = [
      `OBJECTION: ${local.statedObjection}`,
      ``,
      `Real concern: ${local.analysis.realConcern}`,
      `Diagnostic question: ${local.analysis.diagnosticQuestion}`,
      `Response: ${local.analysis.response}`,
      `Bridge: ${local.analysis.bridge}`,
      ...rebuttalsBlock,
    ].join("\n");
    void navigator.clipboard.writeText(block);
  }

  function updateRebuttals(next: RebuttalOption[]) {
    setLocal((prev) => ({
      ...prev,
      analysis: { ...prev.analysis, rebuttals: next },
    }));
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Quote className="h-4 w-4" />
            </div>
            <div className="flex flex-col gap-1">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stated objection
              </p>
              <p className="text-base font-medium leading-snug">
                &ldquo;{local.statedObjection}&rdquo;
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="capitalize">
              {local.category}
            </Badge>
            {local.context.stage ? (
              <Badge variant="secondary">{local.context.stage}</Badge>
            ) : null}
            {local.roleplayTestsPassed > 0 ? (
              <Badge variant="outline" className="gap-1">
                <Drama className="h-3 w-3" />
                {local.roleplayTestsPassed} passed
              </Badge>
            ) : null}
            <StatusBadge status={local.status} />
          </div>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            <span className="font-mono uppercase tracking-wider text-foreground/70">
              Product:
            </span>{" "}
            {local.context.product}
          </span>
          <span>
            <span className="font-mono uppercase tracking-wider text-foreground/70">
              ICP:
            </span>{" "}
            {local.context.icp}
          </span>
          {local.context.dealName ? (
            <span>
              <span className="font-mono uppercase tracking-wider text-foreground/70">
                Deal:
              </span>{" "}
              {local.context.dealName}
            </span>
          ) : null}
        </div>
      </header>

      <div className="flex items-center gap-1 border-b border-border">
        <TabButton
          active={tab === "analysis"}
          onClick={() => setTab("analysis")}
          label="Analysis"
        />
        <TabButton
          active={tab === "roleplay"}
          onClick={() => setTab("roleplay")}
          label="Role-Play Test"
        />
      </div>

      {tab === "analysis" ? (
        <div className="flex flex-col gap-4">
          <PartCard
            icon={Target}
            accent="text-destructive"
            label="Real concern"
            helper="What the prospect is actually worried about but not saying directly."
          >
            <Textarea
              value={local.analysis.realConcern}
              onChange={(e) => updateAnalysis("realConcern", e.target.value)}
              rows={3}
              className="resize-none"
            />
          </PartCard>

          <PartCard
            icon={HelpCircle}
            accent="text-primary"
            label="Diagnostic question"
            helper="One question you can ask to surface the real concern."
          >
            <Textarea
              value={local.analysis.diagnosticQuestion}
              onChange={(e) =>
                updateAnalysis("diagnosticQuestion", e.target.value)
              }
              rows={2}
              className="resize-none"
            />
          </PartCard>

          <PartCard
            icon={MessageCircle}
            accent="text-emerald-500"
            label="Response"
            helper="2 sentences that address the real concern without being defensive. Spoken words, not corporate."
          >
            <Textarea
              value={local.analysis.response}
              onChange={(e) => updateAnalysis("response", e.target.value)}
              rows={4}
              className="resize-none"
            />
          </PartCard>

          <PartCard
            icon={ArrowRight}
            accent="text-amber-500"
            label="Bridge"
            helper="One sentence that moves the conversation forward."
          >
            <Textarea
              value={local.analysis.bridge}
              onChange={(e) => updateAnalysis("bridge", e.target.value)}
              rows={2}
              className="resize-none"
            />
          </PartCard>

          <RebuttalOptions
            value={local.analysis.rebuttals ?? []}
            onChange={updateRebuttals}
          />

          <div className="grid grid-cols-1 gap-4 rounded-lg border border-border bg-card p-5 tablet:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={local.category}
                onChange={(e) =>
                  update("category", e.target.value as ObjectionCategory)
                }
                className="flex h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={local.status}
                onChange={(e) =>
                  update("status", e.target.value as LoggedObjectionStatus)
                }
                className="flex h-10 rounded-md border border-border bg-background px-3 text-sm"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="tablet:col-span-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                value={local.tags.join(", ")}
                onChange={(e) =>
                  update(
                    "tags",
                    e.target.value
                      .split(",")
                      .map((t) => t.trim())
                      .filter(Boolean),
                  )
                }
                placeholder="storm, price-gap, kitchen-table"
              />
            </div>
            <div className="tablet:col-span-2">
              <Label htmlFor="notes">Private notes (optional)</Label>
              <Textarea
                id="notes"
                value={local.notes ?? ""}
                onChange={(e) => update("notes", e.target.value)}
                rows={2}
                className="resize-none"
                placeholder="What you'd say differently next time, field notes, etc."
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={copyAll}
              className="gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy all
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onDiscard}
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {isNew ? "Discard" : "Back without saving"}
            </Button>
            <Button type="button" onClick={() => onSave(local)} className="gap-2">
              <Save className="h-4 w-4" />
              {isNew ? "Save to Library" : "Save changes"}
            </Button>
          </div>
        </div>
      ) : (
        <RoleplayPanel
          draft={local}
          onPassed={() => {
            onRoleplayPassed(local.id);
            setLocal((prev) => {
              const tests = prev.roleplayTestsPassed + 1;
              const status: LoggedObjectionStatus =
                tests >= 3 ? "mastered" : tests >= 1 ? "practicing" : "draft";
              return { ...prev, roleplayTestsPassed: tests, status };
            });
          }}
        />
      )}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "border-b-2 px-4 py-2 font-mono text-[11px] font-medium uppercase tracking-wider transition-colors",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function PartCard({
  icon: Icon,
  accent,
  label,
  helper,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
  label: string;
  helper: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60",
            accent,
          )}
        >
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="text-xs text-muted-foreground">{helper}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

function StatusBadge({ status }: { status: LoggedObjectionStatus }) {
  const styles: Record<LoggedObjectionStatus, string> = {
    draft: "bg-muted text-muted-foreground",
    practicing: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
    mastered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  };
  const label =
    status === "mastered"
      ? "Mastered"
      : status === "practicing"
        ? "Practicing"
        : "Draft";
  return (
    <span
      className={cn(
        "rounded-md px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
        styles[status],
      )}
    >
      {label}
    </span>
  );
}
