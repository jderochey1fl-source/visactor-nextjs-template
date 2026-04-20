"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  newObjectionId,
  useContextDefaults,
} from "@/lib/objection-store";
import type { LoggedObjection, ObjectionAnalysis } from "@/types/types";

const STAGE_OPTIONS = [
  "",
  "Locate",
  "Approach",
  "Diagnose",
  "Design",
  "Estimate",
  "Relationship",
];

type Props = {
  onAnalyzed: (draft: LoggedObjection) => void;
  onCancel: () => void;
};

export function LoggerForm({ onAnalyzed, onCancel }: Props) {
  const { defaults, save: saveDefaults } = useContextDefaults();

  const [statedObjection, setStatedObjection] = useState("");
  const [product, setProduct] = useState("");
  const [icp, setIcp] = useState("");
  const [stage, setStage] = useState("");
  const [dealName, setDealName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product && defaults.product) setProduct(defaults.product);
    if (!icp && defaults.icp) setIcp(defaults.icp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults]);

  const canAnalyze =
    statedObjection.trim().length >= 3 && product.trim() && icp.trim();

  async function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!canAnalyze || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/objection-analyze", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          statedObjection: statedObjection.trim(),
          product: product.trim(),
          icp: icp.trim(),
          stage: stage || undefined,
          dealName: dealName.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`Analysis failed (${res.status})`);
      const analysis = (await res.json()) as ObjectionAnalysis & {
        category: LoggedObjection["category"];
      };
      saveDefaults({ product: product.trim(), icp: icp.trim() });

      const now = new Date().toISOString();
      const draft: LoggedObjection = {
        id: newObjectionId(),
        createdAt: now,
        updatedAt: now,
        statedObjection: statedObjection.trim(),
        category: analysis.category,
        context: {
          product: product.trim(),
          icp: icp.trim(),
          stage: stage || undefined,
          dealName: dealName.trim() || undefined,
        },
        analysis: {
          realConcern: analysis.realConcern,
          diagnosticQuestion: analysis.diagnosticQuestion,
          response: analysis.response,
          bridge: analysis.bridge,
          rebuttals: Array.isArray(analysis.rebuttals)
            ? analysis.rebuttals
            : [],
        },
        status: "draft",
        roleplayTestsPassed: 0,
        tags: [],
      };
      onAnalyzed(draft);
    } catch (err) {
      console.error("[v0] objection analyze failed", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong analyzing the objection.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleAnalyze}
      className="grid grid-cols-1 gap-6 tablet:grid-cols-5"
    >
      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 tablet:col-span-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">The objection</h2>
          <p className="text-xs text-muted-foreground">
            Paste or type exactly what the prospect said — quotes, not your
            paraphrase.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="stated">Stated objection</Label>
          <Textarea
            id="stated"
            value={statedObjection}
            onChange={(e) => setStatedObjection(e.target.value)}
            placeholder={`e.g. "We just need more reps — we don't need another software subscription."`}
            rows={5}
            className="resize-none"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="stage">Deal stage (optional)</Label>
            <select
              id="stage"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
              className="flex h-10 w-full rounded-md border border-border bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {STAGE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s || "—"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="dealName">Deal / prospect (optional)</Label>
            <Input
              id="dealName"
              value={dealName}
              onChange={(e) => setDealName(e.target.value)}
              placeholder="Crestline Roofing · Derek Hollis"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5 tablet:col-span-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-semibold">Context</h2>
          <p className="text-xs text-muted-foreground">
            Tells the AI what you sell and who is pushing back. Saved as
            defaults for next time.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="product">Product / service</Label>
          <Input
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Ladder SmartHire + SmartTerritory"
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="icp">Who is the buyer (ICP)</Label>
          <Textarea
            id="icp"
            value={icp}
            onChange={(e) => setIcp(e.target.value)}
            placeholder="Owner / VP Sales / Sales Director at a 25-200 employee US roofing company running a canvass or storm-restoration motion."
            rows={3}
            className="resize-none"
            required
          />
        </div>

        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-2 pt-2">
          <Button
            type="submit"
            disabled={!canAnalyze || loading}
            className="gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            {loading ? "Analyzing..." : "Analyze with AI"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </section>
    </form>
  );
}
