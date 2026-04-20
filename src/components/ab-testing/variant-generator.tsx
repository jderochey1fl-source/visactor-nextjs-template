"use client";

import { Check, Copy, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useState } from "react";
import type { TestVariable } from "@/components/ab-testing/ab-testing-lab";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Variant = {
  approach: string;
  text: string;
  rationale: string;
};

type Props = {
  variable: TestVariable;
  currentText: string;
  onApply: (text: string) => void;
};

const VARIABLE_HINT: Record<TestVariable, string> = {
  "opening-line":
    "5 alternative opening lines — one per approach: job signal, funding/growth signal, direct problem, counterintuitive observation, peer reference.",
  "subject-line":
    "5 alternative subject lines — question, curiosity gap, direct benefit, personalized signal, ultra-short.",
  cta:
    "5 alternative CTAs — specific time, interest check, resource offer, multiple-choice, one-question ask.",
  "value-statement":
    "5 alternative value statements — time saved, revenue gained, risk removed, cost avoided, status / peer parity.",
  length:
    "5 alternative rewrites varying only length — 40, 75, 100, 125, 150 words of the same core offer.",
};

export function VariantGenerator({ variable, currentText, onApply }: Props) {
  const [context, setContext] = useState<string>(
    "Ladder SaaS outbound to mid-size US roofing companies (25-200 employees). Buyers are Owners, VPs of Sales, or Sales Managers. Pain = 90-day sales rep washout + canvass waste.",
  );
  const [current, setCurrent] = useState<string>(currentText);
  const [variants, setVariants] = useState<Variant[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  async function generate() {
    setIsLoading(true);
    setError(null);
    setVariants(null);
    try {
      const res = await fetch("/api/ab-variants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variable,
          current: current || currentText,
          context,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { variants: Variant[] };
      setVariants(data.variants);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to generate variants.");
    } finally {
      setIsLoading(false);
    }
  }

  async function copyVariant(text: string, idx: number) {
    await navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  }

  return (
    <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex flex-wrap items-center gap-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider">
          AI variant generator
        </h3>
        <Badge variant="muted" className="font-mono text-[10px]">
          claude opus 4.6
        </Badge>
      </header>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {VARIABLE_HINT[variable]} Five testable variants in 30 seconds instead
        of 30 minutes.
      </p>

      <div className="grid grid-cols-1 gap-3 laptop:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gen-context">Product / ICP context</Label>
          <Input
            id="gen-context"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="e.g. Ladder SmartHire to TX roofing-company VPs of Sales"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="gen-current">
            Current version (the one to beat)
          </Label>
          <Textarea
            id="gen-current"
            rows={2}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            placeholder="Paste your current opening / subject / CTA / value statement…"
            className="resize-none"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <Button
          onClick={generate}
          disabled={isLoading}
          className="gap-1.5"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {isLoading ? "Generating…" : "Generate 5 variants"}
        </Button>
        {error && <span className="text-xs text-hot">{error}</span>}
      </div>

      {variants && variants.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            5 variants
          </div>
          <ul className="flex flex-col gap-2">
            {variants.map((v, i) => (
              <li
                key={i}
                className="flex flex-col gap-2 rounded-md border border-border bg-muted/30 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="muted" className="font-mono text-[10px]">
                    #{i + 1} · {v.approach}
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => copyVariant(v.text, i)}
                      className="h-7 gap-1 px-2 text-xs"
                    >
                      {copiedIdx === i ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      Copy
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onApply(v.text)}
                      className="h-7 gap-1 px-2 text-xs"
                    >
                      <Wand2 className="h-3 w-3" />
                      Use as Variant B
                    </Button>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                  {v.text}
                </p>
                <p className="text-xs italic leading-relaxed text-muted-foreground">
                  {v.rationale}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
