"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_FOLLOW_UP_INPUTS,
  type FollowUpInputs,
} from "@/data/follow-up";

type Props = {
  onGenerate: (inputs: FollowUpInputs) => Promise<void>;
  isGenerating: boolean;
};

const MEETING_TYPES: FollowUpInputs["meetingType"][] = [
  "discovery",
  "demo",
  "stakeholder-review",
  "check-in",
];

export function FollowUpForm({ onGenerate, isGenerating }: Props) {
  const [inputs, setInputs] = useState<FollowUpInputs>(
    DEFAULT_FOLLOW_UP_INPUTS,
  );

  const update = <K extends keyof FollowUpInputs>(
    key: K,
    value: FollowUpInputs[K],
  ) => setInputs((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isGenerating) return;
    void onGenerate(inputs);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 rounded-lg border border-border bg-card p-5"
    >
      <header>
        <h2 className="text-base font-semibold text-foreground">
          Meeting Details
        </h2>
        <p className="text-sm text-muted-foreground">
          Capture what the prospect actually said. Specifics are what keeps
          follow-up from sounding like AI.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <Field label="Prospect name">
          <Input
            value={inputs.prospectName}
            onChange={(e) => update("prospectName", e.target.value)}
            required
          />
        </Field>
        <Field label="Prospect title">
          <Input
            value={inputs.prospectTitle}
            onChange={(e) => update("prospectTitle", e.target.value)}
            required
          />
        </Field>
        <Field label="Company">
          <Input
            value={inputs.company}
            onChange={(e) => update("company", e.target.value)}
            required
          />
        </Field>
        <Field label="Meeting date">
          <Input
            value={inputs.meetingDate}
            onChange={(e) => update("meetingDate", e.target.value)}
            placeholder="today / Tuesday / Oct 14"
            required
          />
        </Field>
      </div>

      <Field label="Meeting type">
        <div className="flex flex-wrap gap-2">
          {MEETING_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => update("meetingType", type)}
              className={[
                "rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition",
                inputs.meetingType === type
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              ].join(" ")}
            >
              {type.replace("-", " ")}
            </button>
          ))}
        </div>
      </Field>

      <Field
        label="Meeting notes"
        hint="What the prospect actually said - in their words, not your interpretation."
      >
        <Textarea
          value={inputs.meetingNotes}
          onChange={(e) => update("meetingNotes", e.target.value)}
          rows={5}
          required
        />
      </Field>

      <Field
        label="Specific challenges / priorities they mentioned"
        hint="Use these to shape the value-add resource ideas."
      >
        <Textarea
          value={inputs.challenges}
          onChange={(e) => update("challenges", e.target.value)}
          rows={2}
          required
        />
      </Field>

      <Field
        label="Agreed next step (with a date)"
        hint="Who does what, by when. Specific."
      >
        <Textarea
          value={inputs.nextStep}
          onChange={(e) => update("nextStep", e.target.value)}
          rows={2}
          required
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <Field label="Sender name">
          <Input
            value={inputs.senderName}
            onChange={(e) => update("senderName", e.target.value)}
            required
          />
        </Field>
        <Field label="Sender company">
          <Input
            value={inputs.senderCompany}
            onChange={(e) => update("senderCompany", e.target.value)}
            required
          />
        </Field>
      </div>

      <Field label="Tone">
        <div className="flex flex-wrap gap-2">
          {(["direct", "warm", "analytical"] as const).map((tone) => (
            <button
              key={tone}
              type="button"
              onClick={() => update("tone", tone)}
              className={[
                "rounded-md border px-3 py-1.5 text-sm font-medium capitalize transition",
                inputs.tone === tone
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground",
              ].join(" ")}
            >
              {tone}
            </button>
          ))}
        </div>
      </Field>

      <Button
        type="submit"
        disabled={isGenerating}
        className="mt-1 w-full tablet:w-auto tablet:self-start"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Generating all 3 follow-ups...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-4" />
            Generate follow-up set
          </>
        )}
      </Button>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-sm font-medium text-foreground">{label}</Label>
      {children}
      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
