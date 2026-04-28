"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionGroup } from "@/components/ui/option-group";
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

      <OptionGroup<FollowUpInputs["meetingType"]>
        label="Meeting type"
        help={
          <div className="flex flex-col gap-1.5">
            <strong className="text-foreground">
              What kind of meeting just ended?
            </strong>
            <span className="text-muted-foreground">
              The follow-up changes shape based on what happened.{" "}
              <strong className="text-foreground">Discovery</strong> recaps
              their words and confirms pain.{" "}
              <strong className="text-foreground">Demo</strong> reinforces
              the moment that landed and proposes a next step.{" "}
              <strong className="text-foreground">Stakeholder review</strong>{" "}
              addresses the new room of skeptics.{" "}
              <strong className="text-foreground">Check-in</strong> is the
              short, low-friction nudge that asks for a date.
            </span>
          </div>
        }
        value={inputs.meetingType}
        onChange={(v) => update("meetingType", v)}
        options={MEETING_TYPES.map((type) => ({
          value: type,
          label: type.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        }))}
      />

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

      <OptionGroup<FollowUpInputs["tone"]>
        label="Tone"
        help={
          <div className="flex flex-col gap-1.5">
            <strong className="text-foreground">
              How the follow-up should feel when read.
            </strong>
            <span className="text-muted-foreground">
              <strong className="text-foreground">Direct</strong> for senior
              buyers who want the ask in sentence one.{" "}
              <strong className="text-foreground">Warm</strong> when the call
              built strong rapport and they expect a more human note.{" "}
              <strong className="text-foreground">Analytical</strong> when
              you have ROI math or specific numbers to anchor on.
            </span>
          </div>
        }
        value={inputs.tone}
        onChange={(v) => update("tone", v)}
        options={[
          { value: "direct", label: "Direct" },
          { value: "warm", label: "Warm" },
          { value: "analytical", label: "Analytical" },
        ]}
      />

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
