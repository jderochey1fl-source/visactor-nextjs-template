"use client";

import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionGroup } from "@/components/ui/option-group";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_SEQUENCE_INPUTS,
  type SequenceInputs,
} from "@/data/email-sequence";

type Props = {
  onGenerate: (inputs: SequenceInputs) => Promise<void>;
  isGenerating: boolean;
};

export function SequenceForm({ onGenerate, isGenerating }: Props) {
  const [inputs, setInputs] = useState<SequenceInputs>(DEFAULT_SEQUENCE_INPUTS);

  const update = <K extends keyof SequenceInputs>(
    key: K,
    value: SequenceInputs[K],
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
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-foreground">
            Campaign Decisions
          </h2>
          <p className="text-sm text-muted-foreground">
            Four inputs drive the whole 6-touch sequence. Be specific.
          </p>
        </div>
      </header>

      <Field
        label="ICP (who exactly)"
        hint="Role, company size, funding stage, tech stack signals."
      >
        <Textarea
          value={inputs.icp}
          onChange={(e) => update("icp", e.target.value)}
          rows={2}
          required
        />
      </Field>

      <Field
        label="Trigger signal"
        hint="A real, timely, verifiable event in their world."
      >
        <Textarea
          value={inputs.triggerSignal}
          onChange={(e) => update("triggerSignal", e.target.value)}
          rows={2}
          required
        />
      </Field>

      <Field
        label="Problem you solve (one sentence)"
        hint="Most acute, most expensive, most painful. They should nod."
      >
        <Textarea
          value={inputs.problemStatement}
          onChange={(e) => update("problemStatement", e.target.value)}
          rows={2}
          required
        />
      </Field>

      <Field
        label="Specific outcome"
        hint="One measurable result, not a feature list."
      >
        <Textarea
          value={inputs.outcome}
          onChange={(e) => update("outcome", e.target.value)}
          rows={2}
          required
        />
      </Field>

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
        <Field label="Prospect company">
          <Input
            value={inputs.company}
            onChange={(e) => update("company", e.target.value)}
            required
          />
        </Field>
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
        <Field label="CTA preference" hint="Low friction only.">
          <Input
            value={inputs.ctaPreference}
            onChange={(e) => update("ctaPreference", e.target.value)}
            required
          />
        </Field>
      </div>

      <OptionGroup<SequenceInputs["tone"]>
        label="Tone"
        help={
          <div className="flex flex-col gap-1.5">
            <strong className="text-foreground">
              How the email should feel when read.
            </strong>
            <span className="text-muted-foreground">
              <strong className="text-foreground">Direct</strong> — short
              sentences, leads with the ask, best for senior buyers.{" "}
              <strong className="text-foreground">Warm</strong> — more
              relational, references their world before the ask.{" "}
              <strong className="text-foreground">Analytical</strong> — leans
              on numbers and ROI math, best when you have specifics.
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
            Generating 6-touch sequence...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 size-4" />
            Generate sequence
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
      {hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
