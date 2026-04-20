"use client";

import {
  Check,
  Copy,
  Linkedin,
  Mail,
  Pencil,
  RotateCcw,
  Save,
} from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { SequenceTouch } from "@/data/email-sequence";
import { cn } from "@/lib/utils";

type Props = {
  touch: SequenceTouch;
  onChange: (next: SequenceTouch) => void;
};

function countWords(s: string) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function wordCountTarget(type: SequenceTouch["type"]): {
  min: number;
  max: number;
} {
  switch (type) {
    case "signal-hook":
      return { min: 75, max: 125 };
    case "connection-request":
      return { min: 10, max: 50 };
    case "insight-add":
      return { min: 50, max: 75 };
    case "conversational":
      return { min: 10, max: 60 };
    case "different-angle":
      return { min: 75, max: 110 };
    case "break-up":
      return { min: 40, max: 75 };
  }
}

export function TouchCard({ touch, onChange }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftSubject, setDraftSubject] = useState(touch.subject);
  const [draftBody, setDraftBody] = useState(touch.body);
  const [copied, setCopied] = useState(false);

  const target = wordCountTarget(touch.type);
  const liveWordCount = countWords(isEditing ? draftBody : touch.body);
  const inRange =
    liveWordCount >= target.min && liveWordCount <= target.max;

  const isEmail = touch.channel === "email";
  const ChannelIcon = isEmail ? Mail : Linkedin;

  const handleSave = () => {
    onChange({
      ...touch,
      subject: draftSubject,
      body: draftBody,
      wordCount: countWords(draftBody),
    });
    setIsEditing(false);
  };

  const handleReset = () => {
    setDraftSubject(touch.subject);
    setDraftBody(touch.body);
    setIsEditing(false);
  };

  const handleCopy = async () => {
    const text = isEmail
      ? `Subject: ${touch.subject}\n\n${touch.body}`
      : touch.body;
    try {
      await navigator.clipboard.writeText(text);
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
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
              {touch.number}
            </span>
            <h3 className="text-base font-semibold text-foreground">
              {touch.label}
            </h3>
            <Badge variant="outline" className="gap-1">
              <ChannelIcon className="size-3" />
              {isEmail ? "Email" : "LinkedIn"}
            </Badge>
            <Badge variant="secondary">Day {touch.day}</Badge>
          </div>
          <p className="text-xs text-muted-foreground">{touch.intent}</p>
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

      {isEmail ? (
        isEditing ? (
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
            <p className="font-medium text-foreground">{touch.subject}</p>
          </div>
        )
      ) : null}

      {isEditing ? (
        <Textarea
          value={draftBody}
          onChange={(e) => setDraftBody(e.target.value)}
          rows={Math.max(6, Math.min(18, Math.ceil(draftBody.length / 60)))}
          className="font-sans text-sm leading-relaxed"
        />
      ) : (
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {touch.body}
        </div>
      )}
    </article>
  );
}
