"use client";

import { Check, Copy, RotateCcw, Target } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type HypothesisFields = {
  company: string;
  prospectName: string;
  prospectRole: string;
  challenge: string;
  evidence: string;
  businessImpact: string;
};

const EMPTY: HypothesisFields = {
  company: "",
  prospectName: "",
  prospectRole: "",
  challenge: "",
  evidence: "",
  businessImpact: "",
};

function buildSentence(f: HypothesisFields): string {
  const company = f.company.trim() || "[Company]";
  const challenge = f.challenge.trim() || "[primary challenge]";
  const evidence = f.evidence.trim() || "[evidence from research]";

  let sentence = `I believe ${company}'s primary challenge is ${challenge} because ${evidence}.`;

  if (f.businessImpact.trim()) {
    sentence += ` If true, this is costing them ${f.businessImpact.trim()}.`;
  }

  sentence += ` My goal for this call is to confirm this is their real priority — or discover the actual one driving their decision.`;
  return sentence;
}

function buildBrief(f: HypothesisFields): string {
  const lines: string[] = [];
  lines.push("CALL PREP — HYPOTHESIS");
  lines.push("");
  if (f.company.trim()) lines.push(`Company: ${f.company.trim()}`);
  if (f.prospectName.trim() || f.prospectRole.trim()) {
    const name = f.prospectName.trim() || "—";
    const role = f.prospectRole.trim();
    lines.push(`Prospect: ${name}${role ? `, ${role}` : ""}`);
  }
  lines.push("");
  lines.push("Hypothesis:");
  lines.push(buildSentence(f));
  return lines.join("\n");
}

export function CallPrepHypothesis() {
  const [fields, setFields] = useState<HypothesisFields>(EMPTY);
  const [copiedKey, setCopiedKey] = useState<"sentence" | "brief" | null>(null);

  const sentence = useMemo(() => buildSentence(fields), [fields]);
  const brief = useMemo(() => buildBrief(fields), [fields]);

  const hasContent =
    fields.company.trim() ||
    fields.challenge.trim() ||
    fields.evidence.trim() ||
    fields.businessImpact.trim() ||
    fields.prospectName.trim() ||
    fields.prospectRole.trim();

  const readyToCopy =
    fields.company.trim() && fields.challenge.trim() && fields.evidence.trim();

  function update<K extends keyof HypothesisFields>(
    key: K,
    value: HypothesisFields[K],
  ) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  async function copyText(text: string, key: "sentence" | "brief") {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // ignore
    }
  }

  return (
    <section
      id="call-prep-hypothesis"
      className="rounded-lg border border-border bg-card p-5 scroll-mt-16"
    >
      <header className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <span className="inline-flex size-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Target className="size-4" aria-hidden="true" />
            </span>
            <h2 className="text-lg font-semibold tracking-tight">
              Call Prep Hypothesis
            </h2>
          </div>
          <p className="max-w-xl text-sm text-muted-foreground">
            The single sentence that keeps discovery focused. Fill in the
            fields, grab the line, paste it at the top of your call prep doc.
          </p>
        </div>
        {hasContent ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFields(EMPTY)}
            className="shrink-0"
          >
            <RotateCcw className="mr-2 size-3.5" aria-hidden="true" />
            Reset
          </Button>
        ) : null}
      </header>

      <div className="grid grid-cols-1 gap-5 laptop:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 laptop:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hp-company">Company *</Label>
              <Input
                id="hp-company"
                placeholder="Ridgeline Roofing"
                value={fields.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="hp-prospect-name">Prospect</Label>
              <Input
                id="hp-prospect-name"
                placeholder="Maria Alvarez"
                value={fields.prospectName}
                onChange={(e) => update("prospectName", e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hp-role">Role (optional)</Label>
            <Input
              id="hp-role"
              placeholder="Owner / GM / VP Ops"
              value={fields.prospectRole}
              onChange={(e) => update("prospectRole", e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hp-challenge">Primary challenge *</Label>
            <Input
              id="hp-challenge"
              placeholder="slowing lead-to-install cycle from 21 to 45 days"
              value={fields.challenge}
              onChange={(e) => update("challenge", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              One specific pain — not three value props.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hp-evidence">Evidence / signal *</Label>
            <Textarea
              id="hp-evidence"
              rows={3}
              placeholder="they pulled 3 permits last month vs. 9 the month before, and just added 2 sales reps on LinkedIn"
              value={fields.evidence}
              onChange={(e) => update("evidence", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Why you think that — the research, trigger, or data point.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="hp-impact">Business impact (optional)</Label>
            <Input
              id="hp-impact"
              placeholder="$180k in delayed revenue and 12 unhappy homeowners"
              value={fields.businessImpact}
              onChange={(e) => update("businessImpact", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
              Your discovery hypothesis
            </div>
            <blockquote className="border-l-2 border-primary pl-3 text-sm leading-relaxed text-foreground">
              {sentence}
            </blockquote>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => copyText(sentence, "sentence")}
              disabled={!readyToCopy}
              size="sm"
            >
              {copiedKey === "sentence" ? (
                <>
                  <Check className="mr-2 size-3.5" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-3.5" aria-hidden="true" />
                  Copy sentence
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyText(brief, "brief")}
              disabled={!readyToCopy}
            >
              {copiedKey === "brief" ? (
                <>
                  <Check className="mr-2 size-3.5" aria-hidden="true" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="mr-2 size-3.5" aria-hidden="true" />
                  Copy with context
                </>
              )}
            </Button>
          </div>

          {!readyToCopy ? (
            <p className="text-xs text-muted-foreground">
              Fill in Company, Challenge, and Evidence to enable copy.
            </p>
          ) : null}

          <div className="mt-auto rounded-md border border-dashed border-border bg-muted/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">How to use it:</span>{" "}
            Open the call with a diagnostic question aimed at this hypothesis.
            If they confirm, dig deeper. If they don&apos;t, stop pitching and
            discover the actual priority.
          </div>
        </div>
      </div>
    </section>
  );
}
