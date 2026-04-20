"use client";

import { Check, Copy, Download, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { EmailSequence, SequenceTouch } from "@/data/email-sequence";

import { TouchCard } from "./touch-card";

type Props = {
  sequence: EmailSequence | null;
  isGenerating: boolean;
  error: string | null;
  onChange: (next: EmailSequence) => void;
};

function toMarkdown(sequence: EmailSequence) {
  return sequence.touches
    .map((t) => {
      const heading = `## Touch ${t.number} — Day ${t.day} — ${t.label} (${t.channel === "email" ? "Email" : "LinkedIn"})`;
      const subject = t.channel === "email" ? `**Subject:** ${t.subject}\n\n` : "";
      return `${heading}\n\n${subject}${t.body}\n`;
    })
    .join("\n---\n\n");
}

export function SequenceOutput({
  sequence,
  isGenerating,
  error,
  onChange,
}: Props) {
  const [copiedAll, setCopiedAll] = useState(false);

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (isGenerating && !sequence) {
    return <SequenceSkeleton />;
  }

  if (!sequence) {
    return <EmptyState />;
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(sequence));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const blob = new Blob([toMarkdown(sequence)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ladder-sequence.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateTouch = (next: SequenceTouch) => {
    onChange({
      ...sequence,
      touches: sequence.touches.map((t) =>
        t.number === next.number ? next : t,
      ),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            6-Touch Sequence
          </h2>
          <p className="text-sm text-muted-foreground">
            Day 1 email → Day 16 break-up. Edit any touch before sending.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleCopyAll}>
            {copiedAll ? (
              <>
                <Check className="mr-1.5 size-3.5" />
                Copied all
              </>
            ) : (
              <>
                <Copy className="mr-1.5 size-3.5" />
                Copy all
              </>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-1.5 size-3.5" />
            Export .md
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {sequence.touches.map((touch) => (
          <TouchCard key={touch.number} touch={touch} onChange={updateTouch} />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        Ready to generate
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Fill in the four campaign decisions and Claude will draft the full
        LADDER 6-touch sequence — subject lines, bodies, LinkedIn notes, and
        the break-up email.
      </p>
    </div>
  );
}

function SequenceSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center gap-2">
            <div className="size-7 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            <div className="h-5 w-14 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-full max-w-md animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-9/12 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
