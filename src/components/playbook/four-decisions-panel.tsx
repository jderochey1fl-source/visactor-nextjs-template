"use client";

import { Check, Copy, Lightbulb, Sparkles, Target } from "lucide-react";
import { useState } from "react";
import { fourDecisions, type FourDecision } from "@/data/four-decisions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function FourDecisionsPanel() {
  return (
    <div className="flex flex-col gap-5">
      <header className="flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
            The four decisions that come before everything else
          </span>
        </div>
        <p className="text-sm leading-relaxed text-foreground/90">
          Elite reps make these four decisions BEFORE writing a single word of
          outreach, BEFORE opening Apollo or Clay, BEFORE picking a sequence
          template. Skip them and you are iterating a broken campaign instead
          of launching a working one.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
        {fourDecisions.map((d) => (
          <DecisionCard key={d.number} decision={d} />
        ))}
      </div>
    </div>
  );
}

function DecisionCard({ decision }: { decision: FourDecision }) {
  const [copied, setCopied] = useState(false);

  const copyPrompt = () => {
    if (!decision.aiPrompt) return;
    navigator.clipboard.writeText(decision.aiPrompt.prompt).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary font-mono text-sm font-bold text-primary-foreground">
          {decision.number}
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <h3 className="text-base font-semibold leading-snug tracking-tight">
            {decision.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {decision.lead}
          </p>
        </div>
      </header>

      {decision.subheading ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          {decision.subheading}
        </p>
      ) : null}

      {decision.bullets && decision.bullets.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {decision.bullets.map((b, i) => (
            <li
              key={i}
              className="flex gap-2 text-sm leading-relaxed text-foreground/90"
            >
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {decision.test ? (
        <section className="flex flex-col gap-2">
          <Label>{decision.test.label}</Label>
          <div className="flex flex-col gap-2">
            <div className="rounded-md border border-success/30 bg-success/5 p-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-success">
                Passes
              </span>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                &ldquo;{decision.test.good}&rdquo;
              </p>
            </div>
            <div className="rounded-md border border-hot/30 bg-hot/5 p-3">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-hot">
                Fails
              </span>
              <p className="mt-1 text-sm leading-relaxed text-foreground">
                &ldquo;{decision.test.bad}&rdquo;
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {decision.mathExample ? (
        <section className="flex flex-col gap-2">
          <Label>{decision.mathExample.label}</Label>
          <ul className="flex flex-col gap-1 rounded-md border border-border bg-muted/30 p-3 font-mono text-xs">
            {decision.mathExample.lines.map((line, i) => (
              <li key={i} className="text-foreground/90">
                {line}
              </li>
            ))}
          </ul>
          <p className="rounded-md bg-primary/5 px-3 py-2 text-sm font-medium leading-relaxed text-foreground">
            {decision.mathExample.conclusion}
          </p>
        </section>
      ) : null}

      {decision.checkpoints && decision.checkpoints.length > 0 ? (
        <section className="flex flex-col gap-2">
          <Label>Checkpoints</Label>
          <div className="flex flex-col gap-2">
            {decision.checkpoints.map((c, i) => (
              <div
                key={i}
                className="flex gap-3 rounded-md border border-border bg-background p-3"
              >
                <Badge
                  variant="secondary"
                  className="h-fit shrink-0 font-mono uppercase tracking-wider"
                >
                  {c.day}
                </Badge>
                <span className="text-sm leading-relaxed text-foreground/90">
                  {c.question}
                </span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {decision.aiPrompt ? (
        <section
          className={cn(
            "flex flex-col gap-2 rounded-md border border-primary/30 bg-primary/5 p-3",
          )}
        >
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">
                {decision.aiPrompt.label}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={copyPrompt}>
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy
                </>
              )}
            </Button>
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {decision.aiPrompt.prompt}
          </p>
          {decision.aiPrompt.note ? (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {decision.aiPrompt.note}
            </p>
          ) : null}
        </section>
      ) : null}

      {decision.principle ? (
        <section className="flex gap-2 rounded-md border border-success/30 bg-success/5 p-3 text-sm">
          <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-success" />
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-success">
              Principle
            </span>
            <span className="leading-relaxed text-foreground">
              {decision.principle}
            </span>
          </div>
        </section>
      ) : null}
    </article>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}
