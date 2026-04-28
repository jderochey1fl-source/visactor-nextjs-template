"use client";

import { Check, Copy, HelpCircle, RotateCcw, Target } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
      <header className="relative mb-6 overflow-hidden rounded-lg border-2 border-hot/30 bg-gradient-to-br from-hot/[0.08] via-hot/[0.03] to-transparent p-5">
        <div
          className="absolute left-0 top-0 h-full w-1 bg-hot"
          aria-hidden="true"
        />
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-hot/40 bg-hot/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-hot">
              <Target className="h-3 w-3" aria-hidden="true" />
              Flagship Toolkit
            </span>
            <h2 className="text-2xl font-semibold tracking-tight text-foreground">
              Call Prep Hypothesis
            </h2>
            <p className="max-w-2xl text-sm text-muted-foreground">
              The single sentence that keeps discovery focused. Fill in the
              fields, grab the line, paste it at the top of your call prep
              doc. The orange-marked fields are the three that matter — the
              rest just sharpen your output.
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
        </div>
      </header>

      <div className="grid grid-cols-1 gap-5 laptop:grid-cols-2">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-3 laptop:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <RequiredLabel htmlFor="hp-company">Company</RequiredLabel>
            <Input
              id="hp-company"
              placeholder="Crestline Roofing"
              value={fields.company}
              onChange={(e) => update("company", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <OptionalLabel htmlFor="hp-prospect-name">Prospect</OptionalLabel>
            <Input
              id="hp-prospect-name"
              placeholder="Derek Hollis"
              value={fields.prospectName}
              onChange={(e) => update("prospectName", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <OptionalLabel htmlFor="hp-role">Role</OptionalLabel>
          <Input
            id="hp-role"
            placeholder="Owner / VP Sales / Sales Manager"
            value={fields.prospectRole}
            onChange={(e) => update("prospectRole", e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <RequiredLabel
            htmlFor="hp-challenge"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  One specific pain — not three value props.
                </strong>
                <span>
                  Bad: &ldquo;hiring problems.&rdquo; Good: &ldquo;60% of
                  sales hires wash out inside 90 days.&rdquo; The more
                  numerical and observable, the better — you want a pain you
                  can read off their site or their job posts, not a
                  category.
                </span>
              </div>
            }
          >
            Primary challenge
          </RequiredLabel>
          <Input
            id="hp-challenge"
            placeholder="60% of sales hires wash out inside 90 days"
            value={fields.challenge}
            onChange={(e) => update("challenge", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            One specific pain — not three value props.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <RequiredLabel
            htmlFor="hp-evidence"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  Cite the research, trigger, or data point.
                </strong>
                <span>
                  This is the &ldquo;because&rdquo; clause that earns you
                  the meeting. Concrete trumps inferred — Indeed postings,
                  LinkedIn departures, NOAA storms, news mentions, financial
                  filings. If you can&apos;t name a source, you don&apos;t
                  have evidence yet — keep researching.
                </span>
              </div>
            }
          >
            Evidence / signal
          </RequiredLabel>
          <Textarea
            id="hp-evidence"
            rows={3}
            placeholder="4 canvasser openings live on Indeed for 30+ days, and 7 sales reps visible on LinkedIn as having left in the last 6 months"
            value={fields.evidence}
            onChange={(e) => update("evidence", e.target.value)}
          />
          <p className="text-xs text-muted-foreground">
            Why you think that — the research, trigger, or data point.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <OptionalLabel
            htmlFor="hp-impact"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  Quantify the cost of doing nothing.
                </strong>
                <span>
                  Optional but high-leverage when you can pin it down — it
                  turns the hypothesis from &ldquo;a problem&rdquo; into
                  &ldquo;a problem with a price tag.&rdquo; If you don&apos;t
                  have the number yet, leave it blank and earn it in
                  discovery.
                </span>
              </div>
            }
          >
            Business impact
          </OptionalLabel>
          <Input
            id="hp-impact"
            placeholder="$90K in wasted hiring spend last year against 5 net retained reps"
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

/* ----------------------------- Field labels ----------------------------- */

/**
 * Required field label — bright hot-orange uppercase mono with a hot
 * asterisk. Reads unmistakably as "this is a configurable input that
 * affects your output." Optional `help` opens a popover with examples
 * of what makes a strong answer for this field.
 */
function RequiredLabel({
  htmlFor,
  help,
  children,
}: {
  htmlFor: string;
  help?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-hot"
      >
        {children}
        <span className="ml-1 text-hot" aria-hidden="true">
          *
        </span>
        <span className="sr-only">(required)</span>
      </Label>
      {help ? <HelpHint label={`Help — ${String(children)}`}>{help}</HelpHint> : null}
    </div>
  );
}

/**
 * Optional field label — same family as RequiredLabel but in the muted
 * tone so the eye lands on required fields first.
 */
function OptionalLabel({
  htmlFor,
  help,
  children,
}: {
  htmlFor: string;
  help?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Label
        htmlFor={htmlFor}
        className="font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground"
      >
        {children}
        <span className="ml-1 normal-case tracking-normal text-muted-foreground/70">
          (optional)
        </span>
      </Label>
      {help ? <HelpHint label={`Help — ${String(children)}`}>{help}</HelpHint> : null}
    </div>
  );
}

/**
 * Inline (?) help button. Click to open a small popover with guidance.
 * Uses the same hot-orange treatment as other "configurable" surfaces
 * across the app for visual consistency.
 */
function HelpHint({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={label}
          className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-hot/40 bg-hot/10 text-hot transition-colors hover:border-hot hover:bg-hot/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hot/40"
        >
          <HelpCircle className="h-3 w-3" aria-hidden="true" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        align="start"
        className="w-72 text-xs leading-relaxed text-muted-foreground"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}
