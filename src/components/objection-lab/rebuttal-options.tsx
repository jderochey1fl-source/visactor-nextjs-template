"use client";

import {
  Calculator,
  Check,
  Copy,
  Info,
  PencilLine,
  Plus,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { RoiAttachmentEditor } from "@/components/objection-lab/roi-attachment";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { leverByKey, REBUTTAL_LEVERS } from "@/data/rebuttal-levers";
import { formatMoney, roiLabel } from "@/lib/ladder-roi";
import { cn } from "@/lib/utils";
import type {
  RebuttalLeverKey,
  RebuttalOption,
  RoiAttachment,
} from "@/types/types";

type Props = {
  value: RebuttalOption[];
  onChange: (next: RebuttalOption[]) => void;
};

export function RebuttalOptions({ value, onChange }: Props) {
  const byLever = useMemo(() => {
    const map = new Map<RebuttalLeverKey, RebuttalOption>();
    for (const r of value) map.set(r.lever, r);
    return map;
  }, [value]);

  function updateAt(lever: RebuttalLeverKey, patch: Partial<RebuttalOption>) {
    const existing = byLever.get(lever);
    const base: RebuttalOption = existing ?? {
      lever,
      headline: "",
      script: "",
    };
    const next: RebuttalOption = { ...base, ...patch, lever };
    const others = value.filter((r) => r.lever !== lever);
    // Keep canonical lever order from REBUTTAL_LEVERS.
    const merged = REBUTTAL_LEVERS.map((l) =>
      l.key === lever ? next : (byLever.get(l.key) ?? null),
    ).filter((r): r is RebuttalOption => r !== null);
    onChange(merged.length === value.length ? merged : [...others, next]);
  }

  return (
    <section className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <header className="flex items-start gap-3">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-hot/10 text-hot">
          <Info className="h-4 w-4" />
        </div>
        <div className="flex flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              High-level rebuttal options
            </p>
            <Badge variant="outline" className="font-mono text-[10px]">
              5 levers
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            One option per legitimate urgency / closing lever. Attach a Ladder
            ROI figure when the rebuttal lands better with a dollar number.
          </p>
        </div>
      </header>

      <div className="flex flex-col gap-3">
        {REBUTTAL_LEVERS.map((lever) => {
          const option = byLever.get(lever.key);
          return (
            <RebuttalCard
              key={lever.key}
              leverKey={lever.key}
              headline={option?.headline ?? ""}
              script={option?.script ?? ""}
              roi={option?.roi}
              onHeadlineChange={(v) => updateAt(lever.key, { headline: v })}
              onScriptChange={(v) => updateAt(lever.key, { script: v })}
              onRoiChange={(next) => updateAt(lever.key, { roi: next })}
            />
          );
        })}
      </div>
    </section>
  );
}

function RebuttalCard({
  leverKey,
  headline,
  script,
  roi,
  onHeadlineChange,
  onScriptChange,
  onRoiChange,
}: {
  leverKey: RebuttalLeverKey;
  headline: string;
  script: string;
  roi?: RoiAttachment;
  onHeadlineChange: (v: string) => void;
  onScriptChange: (v: string) => void;
  onRoiChange: (next: RoiAttachment | undefined) => void;
}) {
  const lever = leverByKey(leverKey);
  const Icon = lever.icon;
  const [copied, setCopied] = useState(false);
  const [roiEditorOpen, setRoiEditorOpen] = useState(false);
  const hasContent = Boolean(headline || script);

  async function handleCopy() {
    const body = [
      headline ? `— ${headline}` : null,
      script,
      roi?.sentence ? `\n${roi.sentence}` : null,
    ]
      .filter(Boolean)
      .join("\n");
    if (!body) return;
    await navigator.clipboard.writeText(body);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <article
      className={cn(
        "flex flex-col gap-2 rounded-md border bg-background p-4",
        hasContent ? "border-border" : "border-dashed border-border/60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div
            className={cn(
              "flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/60",
              lever.colorClass,
            )}
          >
            <Icon className="h-4 w-4" />
          </div>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
                {lever.name}
              </p>
              <span className="font-mono text-[10px] text-muted-foreground">
                {lever.tagline}
              </span>
            </div>
            <input
              type="text"
              value={headline}
              onChange={(e) => onHeadlineChange(e.target.value)}
              placeholder="Short label for live-call scanning…"
              className="mt-1 w-full bg-transparent text-sm font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none"
            />
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          disabled={!hasContent}
          className="gap-1.5"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      <Textarea
        value={script}
        onChange={(e) => onScriptChange(e.target.value)}
        rows={3}
        className="resize-none text-sm"
        placeholder={`Script using the ${lever.name.toLowerCase()} lever — 1-3 sentences the rep can say live.`}
      />

      {roi && !roiEditorOpen ? (
        <RoiChip
          attachment={roi}
          onEdit={() => setRoiEditorOpen(true)}
          onRemove={() => onRoiChange(undefined)}
        />
      ) : null}

      {!roi && !roiEditorOpen ? (
        <div className="flex items-center justify-between pt-1">
          <p className="text-[10px] text-muted-foreground">
            Optional: attach a Ladder ROI figure if it strengthens this rebuttal.
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setRoiEditorOpen(true)}
            disabled={!hasContent}
            className="gap-1.5 text-primary hover:text-primary"
          >
            <Plus className="h-3.5 w-3.5" />
            Add ROI math
          </Button>
        </div>
      ) : null}

      {roiEditorOpen ? (
        <RoiAttachmentEditor
          value={roi}
          onChange={onRoiChange}
          onClose={() => setRoiEditorOpen(false)}
        />
      ) : null}
    </article>
  );
}

function RoiChip({
  attachment,
  onEdit,
  onRemove,
}: {
  attachment: RoiAttachment;
  onEdit: () => void;
  onRemove: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-primary/30 bg-primary/5 p-2">
      <div className="flex min-w-0 items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/15 text-primary">
          <Calculator className="h-3 w-3" />
        </div>
        <div className="flex min-w-0 flex-col">
          <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
            ROI attached · {roiLabel(attachment.kind)}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">
            {formatMoney(attachment.monthlyWaste)}/mo wasted · save{" "}
            {formatMoney(attachment.savingsMin)}-
            {formatMoney(attachment.savingsMax)}/mo
          </p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-7 gap-1 px-2 text-[11px]"
        >
          <PencilLine className="h-3 w-3" />
          Edit
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onRemove}
          className="h-7 gap-1 px-2 text-[11px] text-destructive hover:text-destructive"
        >
          <Trash2 className="h-3 w-3" />
          Remove
        </Button>
      </div>
    </div>
  );
}
