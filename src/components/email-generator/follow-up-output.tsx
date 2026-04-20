"use client";

import { Check, Copy, Download, MessageSquareText } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { FollowUpBundle, FollowUpEmail } from "@/data/follow-up";

import { FollowUpCard } from "./follow-up-card";

type Props = {
  bundle: FollowUpBundle | null;
  isGenerating: boolean;
  error: string | null;
  onChange: (next: FollowUpBundle) => void;
};

function toMarkdown(bundle: FollowUpBundle) {
  return bundle.emails
    .map((e) => {
      const header = `## ${e.label} — ${
        e.sendAfterDays === 0
          ? "Send within 2 hours"
          : `Send day +${e.sendAfterDays}`
      }`;
      const resources =
        e.type === "value-add" && e.resourceIdeas && e.resourceIdeas.length > 0
          ? `\n\n**Resource ideas to attach**\n${e.resourceIdeas.map((r) => `- ${r}`).join("\n")}`
          : "";
      return `${header}\n\n**Subject:** ${e.subject}\n\n${e.body}${resources}\n`;
    })
    .join("\n---\n\n");
}

export function FollowUpOutput({
  bundle,
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

  if (isGenerating && !bundle) {
    return <FollowUpSkeleton />;
  }

  if (!bundle) {
    return <EmptyState />;
  }

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(toMarkdown(bundle));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      // ignore
    }
  };

  const handleDownload = () => {
    const blob = new Blob([toMarkdown(bundle)], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "post-meeting-follow-up.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateEmail = (next: FollowUpEmail) => {
    onChange({
      ...bundle,
      emails: bundle.emails.map((e) => (e.type === next.type ? next : e)),
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Post-Meeting Follow-Up Set
          </h2>
          <p className="text-sm text-muted-foreground">
            Three emails on a 0 / +4 / +14 day cadence. Edit before sending.
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
        {bundle.emails.map((email) => (
          <FollowUpCard
            key={email.type}
            email={email}
            onChange={updateEmail}
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card/50 p-8 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <MessageSquareText className="size-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">
        Capture the meeting
      </h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        Drop in the prospect context, what they said, and the next step. Claude
        generates the recap, value-add, and re-engagement emails in one shot.
      </p>
    </div>
  );
}

function FollowUpSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
        >
          <div className="flex items-center gap-2">
            <div className="size-7 animate-pulse rounded-full bg-muted" />
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="h-5 w-24 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-3 w-full max-w-md animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-11/12 animate-pulse rounded bg-muted" />
          <div className="h-4 w-10/12 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
