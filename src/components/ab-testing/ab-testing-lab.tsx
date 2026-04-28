"use client";

import {
  AlertTriangle,
  FlaskConical,
  Info,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ResultsAnalysis } from "@/components/ab-testing/results-analysis";
import { VariantForm, type VariantState } from "@/components/ab-testing/variant-form";
import { VariantGenerator } from "@/components/ab-testing/variant-generator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionGroup } from "@/components/ui/option-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export type TestVariable =
  | "opening-line"
  | "subject-line"
  | "cta"
  | "value-statement"
  | "length";

export type GoalMetric = "reply" | "open" | "meeting";

const TEST_VARIABLES: Array<{
  id: TestVariable;
  label: string;
  rank: number;
  blurb: string;
}> = [
  {
    id: "opening-line",
    label: "Opening line",
    rank: 1,
    blurb: "Highest leverage variable.",
  },
  {
    id: "subject-line",
    label: "Subject line",
    rank: 2,
    blurb: "Affects opens only. Secondary if your goal is replies.",
  },
  { id: "cta", label: "CTA", rank: 3, blurb: "Meeting length, framing, day specificity." },
  {
    id: "value-statement",
    label: "Value statement",
    rank: 4,
    blurb: "Same product, different outcome framing.",
  },
  {
    id: "length",
    label: "Email length",
    rank: 5,
    blurb: "Test 75 words vs 125 words — same message.",
  },
];

const GOAL_METRICS: Array<{ id: GoalMetric; label: string }> = [
  { id: "reply", label: "Reply rate" },
  { id: "open", label: "Open rate" },
  { id: "meeting", label: "Meeting rate" },
];

const emptyVariant: VariantState = {
  content: "",
  sends: 0,
  opens: 0,
  replies: 0,
  meetings: 0,
};

export function ABTestingLab() {
  const [testVariable, setTestVariable] = useState<TestVariable>("opening-line");
  const [goalMetric, setGoalMetric] = useState<GoalMetric>("reply");
  const [testName, setTestName] = useState<string>("Untitled test");
  const [variantA, setVariantA] = useState<VariantState>(emptyVariant);
  const [variantB, setVariantB] = useState<VariantState>(emptyVariant);

  const activeVariable = useMemo(
    () => TEST_VARIABLES.find((v) => v.id === testVariable)!,
    [testVariable],
  );

  function applyGeneratedToVariantB(text: string) {
    setVariantB((prev) => ({ ...prev, content: text }));
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-5 w-5 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">A/B Testing Lab</h1>
          <Badge variant="muted" className="font-mono">
            one variable per test
          </Badge>
        </div>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          A/B testing tells you what&apos;s working — but only if you test{" "}
          <strong className="text-foreground">one variable at a time</strong>{" "}
          and reach statistical significance before drawing conclusions. Enter
          two variants, log the results, and the lab tells you the winner, the
          confidence level, and what to scale next.
        </p>
      </header>

      {/* Test config bar */}
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
        <div className="grid grid-cols-1 gap-4 laptop:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="test-name">Test name</Label>
            <Input
              id="test-name"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
              placeholder="e.g. Opening line — SmartHire to TX roofing VPs"
            />
          </div>
          <OptionGroup<TestVariable>
            label="Variable being tested"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  Pick exactly one thing to vary.
                </strong>
                <span className="text-muted-foreground">
                  Variables are ranked by leverage —{" "}
                  <strong className="text-foreground">
                    #1 Opening line
                  </strong>{" "}
                  moves results the most, #5 length the least. Whatever you
                  pick is the only thing that should differ between Variant A
                  and Variant B; everything else stays identical so the lift
                  is attributable.
                </span>
              </div>
            }
            value={testVariable}
            onChange={setTestVariable}
            options={TEST_VARIABLES.map((v) => ({
              value: v.id,
              label: v.label,
              prefix: `#${v.rank}`,
            }))}
          />
          <OptionGroup<GoalMetric>
            label="Primary goal metric"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  What "winning" means in this test.
                </strong>
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Reply rate</strong> is
                  the right default for outbound — replies turn into pipeline.{" "}
                  <strong className="text-foreground">Open rate</strong> is
                  only useful when you&apos;re testing subject lines.{" "}
                  <strong className="text-foreground">Meeting rate</strong> is
                  the gold standard but needs more sends to reach
                  significance.
                </span>
              </div>
            }
            value={goalMetric}
            onChange={setGoalMetric}
            options={GOAL_METRICS.map((g) => ({ value: g.id, label: g.label }))}
          />
        </div>

        <div className="flex items-start gap-2 rounded-md border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <div>
            <strong className="text-foreground">{activeVariable.label}:</strong>{" "}
            {activeVariable.blurb}{" "}
            <span className="text-foreground/80">
              Change only this field between Variant A and Variant B. Keep
              everything else identical.
            </span>
          </div>
        </div>
      </section>

      {/* AI variant generator */}
      <VariantGenerator
        variable={testVariable}
        currentText={variantA.content}
        onApply={applyGeneratedToVariantB}
      />

      {/* Variant inputs */}
      <Tabs defaultValue="setup" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="setup">
            <FlaskConical className="mr-1.5 h-3.5 w-3.5" />
            Setup & results
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup">
          <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
            <VariantForm
              label="Variant A (control)"
              accent="muted"
              variable={testVariable}
              value={variantA}
              onChange={setVariantA}
            />
            <VariantForm
              label="Variant B (challenger)"
              accent="primary"
              variable={testVariable}
              value={variantB}
              onChange={setVariantB}
            />
          </div>

          <aside className="mt-4 flex items-start gap-2 rounded-md border border-hot/40 bg-hot/5 p-3 text-xs leading-relaxed text-foreground/80">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-hot" />
            <div>
              <strong className="text-foreground">Do not test two variables at once.</strong>{" "}
              If you change subject AND opening in the same test you cannot
              know which drove the lift.{" "}
              <Sparkles className="inline h-3 w-3 text-primary" /> Use the AI
              variant generator above to spin up 5 alternatives that vary only
              the selected field.
            </div>
          </aside>
        </TabsContent>

        <TabsContent value="analysis">
          <ResultsAnalysis
            testName={testName}
            variable={activeVariable.label}
            goalMetric={goalMetric}
            variantA={variantA}
            variantB={variantB}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
