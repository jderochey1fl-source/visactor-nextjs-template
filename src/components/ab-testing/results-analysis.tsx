"use client";

import {
  CheckCircle2,
  Flag,
  Gauge,
  MinusCircle,
  Scale,
  ShieldAlert,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useMemo } from "react";
import type { GoalMetric } from "@/components/ab-testing/ab-testing-lab";
import type { VariantState } from "@/components/ab-testing/variant-form";
import { Badge } from "@/components/ui/badge";
import {
  formatLift,
  pct,
  rates,
  sampleStatus,
  twoProportionTest,
} from "@/lib/ab-stats";
import { cn } from "@/lib/utils";

type Props = {
  testName: string;
  variable: string;
  goalMetric: GoalMetric;
  variantA: VariantState;
  variantB: VariantState;
};

export function ResultsAnalysis({
  testName,
  variable,
  goalMetric,
  variantA,
  variantB,
}: Props) {
  const rA = rates(variantA);
  const rB = rates(variantB);

  const openTest = useMemo(
    () =>
      twoProportionTest(
        variantA.opens,
        Math.max(variantA.sends, 1),
        variantB.opens,
        Math.max(variantB.sends, 1),
      ),
    [variantA, variantB],
  );
  const replyTest = useMemo(
    () =>
      twoProportionTest(
        variantA.replies,
        Math.max(variantA.sends, 1),
        variantB.replies,
        Math.max(variantB.sends, 1),
      ),
    [variantA, variantB],
  );
  const meetingTest = useMemo(
    () =>
      twoProportionTest(
        variantA.meetings,
        Math.max(variantA.sends, 1),
        variantB.meetings,
        Math.max(variantB.sends, 1),
      ),
    [variantA, variantB],
  );

  const sample = sampleStatus(variantA.sends, variantB.sends);

  const primaryTest =
    goalMetric === "open"
      ? openTest
      : goalMetric === "meeting"
        ? meetingTest
        : replyTest;

  const verdict = deriveVerdict({
    sample,
    openTest,
    replyTest,
    meetingTest,
    primary: primaryTest,
    goalMetric,
  });

  const hasData = variantA.sends > 0 || variantB.sends > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-border bg-card/50 p-12 text-center">
        <Gauge className="h-8 w-8 text-muted-foreground" />
        <h3 className="text-base font-semibold">No results yet</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Enter sends, opens, replies, and meetings for both variants on the
          Setup tab. Analysis appears here automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Header summary */}
      <header className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold tracking-tight">{testName}</h2>
          <Badge variant="muted" className="font-mono">
            testing: {variable}
          </Badge>
          <Badge variant="muted" className="font-mono">
            goal: {goalMetric}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{verdict.summary}</p>
      </header>

      {/* Sample size banner */}
      <SampleBanner
        status={sample}
        nA={variantA.sends}
        nB={variantB.sends}
      />

      {/* Metric comparison grid */}
      <section className="grid grid-cols-1 gap-3 laptop:grid-cols-3">
        <MetricBlock
          label="Open rate"
          rateA={rA.openRate}
          rateB={rB.openRate}
          test={openTest}
          isPrimary={goalMetric === "open"}
        />
        <MetricBlock
          label="Reply rate"
          rateA={rA.replyRate}
          rateB={rB.replyRate}
          test={replyTest}
          isPrimary={goalMetric === "reply"}
        />
        <MetricBlock
          label="Meeting rate"
          rateA={rA.meetingRate}
          rateB={rB.meetingRate}
          test={meetingTest}
          isPrimary={goalMetric === "meeting"}
        />
      </section>

      {/* Verdict panel */}
      <section
        className={cn(
          "flex flex-col gap-3 rounded-lg border p-5",
          verdict.tone === "winner" && "border-success/50 bg-success/5",
          verdict.tone === "warning" && "border-hot/40 bg-hot/5",
          verdict.tone === "neutral" && "border-border bg-card",
        )}
      >
        <header className="flex items-center gap-2">
          {verdict.tone === "winner" ? (
            <Trophy className="h-5 w-5 text-success" />
          ) : verdict.tone === "warning" ? (
            <ShieldAlert className="h-5 w-5 text-hot" />
          ) : (
            <Scale className="h-5 w-5 text-primary" />
          )}
          <h3 className="text-sm font-semibold uppercase tracking-wider">
            {verdict.headline}
          </h3>
        </header>
        <p className="text-sm leading-relaxed text-foreground/90">
          {verdict.body}
        </p>
        {verdict.action && (
          <div className="flex items-start gap-2 rounded-md border border-primary/30 bg-primary/5 p-3 text-sm">
            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground/90">
              <strong>Next move:</strong> {verdict.action}
            </span>
          </div>
        )}
      </section>
    </div>
  );
}

function MetricBlock({
  label,
  rateA,
  rateB,
  test,
  isPrimary,
}: {
  label: string;
  rateA: number;
  rateB: number;
  test: ReturnType<typeof twoProportionTest>;
  isPrimary: boolean;
}) {
  const winner = test.winner;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-lg border bg-card p-4",
        isPrimary ? "border-primary/40 ring-1 ring-primary/10" : "border-border",
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium">{label}</h4>
        {isPrimary && (
          <Badge variant="muted" className="font-mono text-[10px]">
            primary
          </Badge>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2">
        <RateCell label="A" rate={rateA} highlight={winner === "A"} />
        <RateCell label="B" rate={rateB} highlight={winner === "B"} />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Relative lift</span>
        <span
          className={cn(
            "font-mono font-semibold tabular-nums",
            test.relativeLift > 0 && "text-success",
            test.relativeLift < 0 && "text-hot",
          )}
        >
          {formatLift(test.relativeLift)}
        </span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Confidence</span>
        <span className="font-mono tabular-nums text-foreground">
          {pct(test.confidence, 0)}
        </span>
      </div>
      <div className="mt-1 flex items-center gap-1.5 text-[11px]">
        {test.isSignificant ? (
          <>
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span className="text-success">Statistically significant</span>
          </>
        ) : (
          <>
            <MinusCircle className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-muted-foreground">Not yet significant</span>
          </>
        )}
      </div>
    </div>
  );
}

function RateCell({
  label,
  rate,
  highlight,
}: {
  label: string;
  rate: number;
  highlight: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-md border p-2",
        highlight
          ? "border-success/60 bg-success/10"
          : "border-border bg-muted/30",
      )}
    >
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        Variant {label}
      </span>
      <span className="font-mono text-base font-semibold tabular-nums">
        {pct(rate)}
      </span>
    </div>
  );
}

function SampleBanner({
  status,
  nA,
  nB,
}: {
  status: ReturnType<typeof sampleStatus>;
  nA: number;
  nB: number;
}) {
  const copy: Record<
    typeof status,
    { label: string; tone: "warning" | "neutral" | "ok"; body: string }
  > = {
    insufficient: {
      label: "Insufficient sample",
      tone: "warning",
      body: `Min ${Math.min(nA, nB)} sends per variant. Results below 100/variant are noise, not signal. Keep sending until both variants pass 100 — 200+ is where reliable patterns emerge.`,
    },
    directional: {
      label: "Directional only",
      tone: "neutral",
      body: `Both variants between 100–199 sends. You have a direction — do not scale yet. Push to 200+ per variant before making a call on a close test.`,
    },
    reliable: {
      label: "Reliable sample",
      tone: "ok",
      body: `Both variants are at 200+ sends. Trust the significance check below and scale the winner.`,
    },
  };
  const c = copy[status];
  return (
    <div
      className={cn(
        "flex items-start gap-2 rounded-md border p-3 text-xs leading-relaxed",
        c.tone === "warning" && "border-hot/40 bg-hot/5 text-foreground/90",
        c.tone === "neutral" && "border-border bg-muted/40 text-foreground/90",
        c.tone === "ok" && "border-success/40 bg-success/5 text-foreground/90",
      )}
    >
      <Flag
        className={cn(
          "mt-0.5 h-4 w-4 shrink-0",
          c.tone === "warning" && "text-hot",
          c.tone === "neutral" && "text-primary",
          c.tone === "ok" && "text-success",
        )}
      />
      <div>
        <strong className="text-foreground">{c.label}</strong> — {c.body}
      </div>
    </div>
  );
}

type Verdict = {
  tone: "winner" | "neutral" | "warning";
  headline: string;
  summary: string;
  body: string;
  action?: string;
};

function deriveVerdict({
  sample,
  openTest,
  replyTest,
  primary,
  goalMetric,
}: {
  sample: ReturnType<typeof sampleStatus>;
  openTest: ReturnType<typeof twoProportionTest>;
  replyTest: ReturnType<typeof twoProportionTest>;
  meetingTest: ReturnType<typeof twoProportionTest>;
  primary: ReturnType<typeof twoProportionTest>;
  goalMetric: GoalMetric;
}): Verdict {
  if (sample === "insufficient") {
    return {
      tone: "warning",
      headline: "Keep sending",
      summary: "Sample size is below 100 per variant — results could be luck.",
      body: "Do not declare a winner yet. Continue sending until both variants clear 100 (preferably 200) before reading results.",
    };
  }

  // Classic diagnostic from the spec: open-rate gap but reply-rate parity
  const openDiff = Math.abs(openTest.relativeLift);
  const replyDiff = Math.abs(replyTest.relativeLift);

  if (
    openTest.isSignificant &&
    !replyTest.isSignificant &&
    openDiff > 0.15 &&
    replyDiff < 0.05
  ) {
    return {
      tone: "neutral",
      headline: "Subject works, body doesn't",
      summary: "Open rates moved, reply rates didn't. Subject is not your problem.",
      body: "The subject line drove the open gap, but the body is failing to convert. Optimize the body first — rewrite Touch 1's opening and value statement before testing anything else.",
      action: "Rewrite Variant B's body. Keep the winning subject. Re-run the test.",
    };
  }

  if (
    !openTest.isSignificant &&
    replyTest.isSignificant &&
    openDiff < 0.05
  ) {
    return {
      tone: "winner",
      headline: "Body or opening wins",
      summary: "Same open rate, different reply rate — the body is the variable.",
      body: "Opens are parity but replies diverged. The opening line or body copy of the winning variant is what's driving the lift.",
      action: "Scale the winner. Log the winning pattern in the Playbook and apply to the next campaign.",
    };
  }

  if (primary.isSignificant && primary.winner === "B") {
    return {
      tone: "winner",
      headline: "Variant B wins",
      summary: `B beat A on ${metricLabel(goalMetric)} with ${pct(primary.confidence, 0)} confidence.`,
      body: `Both open and reply rates (and meeting rate if applicable) favor Variant B. The change you made is a real improvement, not noise.`,
      action: "Scale Variant B immediately. Batch in 50–100 sends, never more than 20% list growth per week.",
    };
  }

  if (primary.isSignificant && primary.winner === "A") {
    return {
      tone: "warning",
      headline: "Variant A wins — your change hurt",
      summary: `A beat B on ${metricLabel(goalMetric)}. The new variant underperformed.`,
      body: "The change you tested made things worse at a statistically significant level. Kill Variant B and keep the control.",
      action: "Keep Variant A. Next test: try a different approach to the same variable — don't iterate on this one.",
    };
  }

  return {
    tone: "neutral",
    headline: "Too close to call",
    summary: "No significant difference between variants yet.",
    body: `With current volume, neither variant shows a clear edge on ${metricLabel(goalMetric)}. Either keep sending to grow the sample, or design a bigger swing — smaller tweaks rarely move the needle.`,
    action: "Push both variants to 200+ sends, or design a more aggressive Variant B with a fundamentally different approach.",
  };
}

function metricLabel(g: GoalMetric) {
  return g === "open" ? "open rate" : g === "meeting" ? "meeting rate" : "reply rate";
}
