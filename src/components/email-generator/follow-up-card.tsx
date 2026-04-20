"use client";

import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Gift,
  Pencil,
  RotateCcw,
  Save,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FOLLOW_UP_META, type FollowUpEmail } from "@/data/follow-up";
import { cn } from "@/lib/utils";

type Props = {
  email: FollowUpEmail;
  onChange: (next: FollowUpEmail) => void;
};

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

const TYPE_ICON = {
  recap: CheckCircle2,
  "value-add": Gift,
  "re-engagement": Clock,
} as const;

export function FollowUpCard({ email, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSubject, setDraftSubject] = useState(email.subject);
  const [draftBody, setDraftBody] = useState(email.body);
  const [copied, setCopied] = useState(false);

  const meta = FOLLOW_UP_META[email.type];
  const liveWordCount = countWords(isEditing ? draftBody : email.body);
  const target = meta.wordTarget;
  const inRange =
    liveWordCount >= target.min && liveWordCount <= target.max;
  const Icon = TYPE_ICON[email.type];

  const sendLabel =
    email.sendAfterDays === 0
      ? "Send within 2h"
      : `Send day +${email.sendAfterDays}`;

  const handleSave = () => {
    onChange({
      ...email,
      subject: draftSubject,
      body: draftBody,
      wordCount: countWords(draftBody),
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    setDraftSubject(email.subject);
    setDraftBody(email.body);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        `Subject: ${email.subject}\n\n${email.body}`,
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="size-4" />
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {email.label}
            </h3>
            <Badge variant="secondary">{sendLabel}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{email.intent}</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant={inRange ? "outline" : "destructive"}
            className={cn(
              "font-mono text-[11px]",
              inRange && "border-emerald-500/40 text-emerald-600",
            )}
          >
            {liveWordCount} / {target.min}-{target.max} words
          </Badge>
          {isEditing ? (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={handleReset}
                className="h-8"
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} className="h-8">
                <Save className="mr-1.5 size-3.5" />
                Save
              </Button>
            </>
          ) : (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditing(true)}
                className="h-8"
              >
                <Pencil className="mr-1.5 size-3.5" />
                Edit
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCopy}
                className="h-8"
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 size-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 size-3.5" />
                    Copy
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </header>

      {isEditing ? (
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Subject
          </span>
          <Input
            value={draftSubject}
            onChange={(e) => setDraftSubject(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-1 rounded-md border border-border bg-muted/40 px-3 py-2">
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Subject
          </span>
          <p className="font-medium text-foreground">{email.subject}</p>
        </div>
      )}

      {isEditing ? (
        <Textarea
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          rows={Math.max(6, Math.min(18, Math.ceil(draftBody.length / 60)))}
          className="font-sans text-sm leading-relaxed"
        />
      ) : (
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {email.body}
        </div>
      )}

      {email.type === "value-add" &&
      email.resourceIdeas &&
      email.resourceIdeas.length > 0 ? (
        <aside className="rounded-md border border-border bg-muted/30 p-3">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Resource ideas to attach
          </p>
          <ul className="flex flex-col gap-1 text-sm text-foreground">
            {email.resourceIdeas.map((idea, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                <span>{idea}</span>
              </li>
            ))}
          </ul>
        </aside>
      ) : null}
    </article>
  );
}
