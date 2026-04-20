"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { pct, rates } from "@/lib/ab-stats";
import { cn } from "@/lib/utils";
import type { TestVariable } from "./ab-testing-lab";

export type VariantState = {
  content: string;
  sends: number;
  opens: number;
  replies: number;
  meetings: number;
};

type Props = {
  label: string;
  accent: "primary" | "muted";
  variable: TestVariable;
  value: VariantState;
  onChange: (v: VariantState) => void;
};

const CONTENT_LABEL: Record<TestVariable, { label: string; placeholder: string; rows: number }> = {
  "opening-line": {
    label: "Opening line",
    placeholder: "Saw your team just posted for a second commercial PM…",
    rows: 3,
  },
  "subject-line": {
    label: "Subject line",
    placeholder: "Quick question about your Q4 roofing pipeline",
    rows: 1,
  },
  cta: {
    label: "CTA",
    placeholder: "Worth a 15-minute call Thursday at 10 to compare notes?",
    rows: 2,
  },
  "value-statement": {
    label: "Value statement",
    placeholder: "Teams that switched saved 9 hours/week on claim admin.",
    rows: 3,
  },
  length: {
    label: "Full email body",
    placeholder: "Paste the full email body here…",
    rows: 6,
  },
};

export function VariantForm({
  label,
  accent,
  variable,
  value,
  onChange,
}: Props) {
  const r = rates(value);
  const spec = CONTENT_LABEL[variable];

  function update<K extends keyof VariantState>(key: K, raw: string) {
    if (key === "content") {
      onChange({ ...value, content: raw });
      return;
    }
    const n = Math.max(0, parseInt(raw || "0", 10));
    onChange({ ...value, [key]: isNaN(n) ? 0 : n });
  }

  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-lg border bg-card p-5",
        accent === "primary"
          ? "border-primary/40 ring-1 ring-primary/10"
          : "border-border",
      )}
    >
      <header className="flex items-center justify-between">
        <h3
          className={cn(
            "font-mono text-xs font-semibold uppercase tracking-wider",
            accent === "primary" ? "text-primary" : "text-muted-foreground",
          )}
        >
          {label}
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span className="font-mono">{value.sends}</span>
          <span>sends</span>
        </div>
      </header>

      {/* Content input */}
      <div className="flex flex-col gap-1.5">
        <Label>{spec.label}</Label>
        {spec.rows === 1 ? (
          <Input
            value={value.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder={spec.placeholder}
          />
        ) : (
          <Textarea
            rows={spec.rows}
            value={value.content}
            onChange={(e) => update("content", e.target.value)}
            placeholder={spec.placeholder}
            className="resize-none"
          />
        )}
      </div>

      {/* Counts */}
      <div className="grid grid-cols-2 gap-3 laptop:grid-cols-4">
        <NumField
          label="Sends"
          value={value.sends}
          onChange={(v) => update("sends", v)}
        />
        <NumField
          label="Opens"
          value={value.opens}
          onChange={(v) => update("opens", v)}
        />
        <NumField
          label="Replies"
          value={value.replies}
          onChange={(v) => update("replies", v)}
        />
        <NumField
          label="Meetings"
          value={value.meetings}
          onChange={(v) => update("meetings", v)}
        />
      </div>

      {/* Live rates */}
      <div className="grid grid-cols-3 gap-2 rounded-md border border-border bg-muted/30 p-3 text-center">
        <Rate label="Open" rate={r.openRate} />
        <Rate label="Reply" rate={r.replyRate} />
        <Rate label="Meeting" rate={r.meetingRate} />
      </div>
    </section>
  );
}

function NumField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (raw: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        type="number"
        min={0}
        value={value === 0 ? "" : value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="font-mono"
      />
    </div>
  );
}

function Rate({ label, rate }: { label: string; rate: number }) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-sm font-semibold tabular-nums">
        {pct(rate)}
      </span>
    </div>
  );
}
