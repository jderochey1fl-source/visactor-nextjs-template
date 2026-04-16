"use client";

import {
  ArrowRight,
  Check,
  Copy,
  MessageSquareQuote,
  Search,
  Target,
} from "lucide-react";
import { useMemo, useState } from "react";
import { ladderStages } from "@/data/ladder";
import { objectionCategories, objections } from "@/data/objections";
import type { Objection } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const categoryLabel: Record<Objection["category"], string> = Object.fromEntries(
  objectionCategories.map((c) => [c.key, c.label]),
) as Record<Objection["category"], string>;

export function PlaybookBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Objection["category"]>(
    "all",
  );
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return objections.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (!q) return true;
      return (
        o.title.toLowerCase().includes(q) ||
        o.quote.toLowerCase().includes(q) ||
        o.script.toLowerCase().includes(q) ||
        o.whyItHappens.toLowerCase().includes(q)
      );
    });
  }, [query, category]);

  const copyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <Tabs defaultValue="objections" className="flex flex-col gap-5">
      <TabsList>
        <TabsTrigger value="objections">Objections</TabsTrigger>
        <TabsTrigger value="stages">LADDER stages</TabsTrigger>
      </TabsList>

      <TabsContent value="objections" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="relative w-full tablet:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search title, quote, script..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <CategoryChip
              label="All"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {objectionCategories.map((c) => (
              <CategoryChip
                key={c.key}
                label={c.label}
                active={category === c.key}
                onClick={() => setCategory(c.key)}
              />
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
            No scripts match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
            {filtered.map((o) => (
              <ObjectionCard
                key={o.id}
                objection={o}
                copied={copied === o.id}
                onCopy={() => copyScript(o.id, o.script)}
              />
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="stages" className="flex flex-col gap-3">
        {ladderStages.map((s, idx) => (
          <div
            key={s.key}
            className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5"
          >
            <div className="flex items-start gap-4">
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-lg font-bold text-primary-foreground",
                  accentByIndex[idx] ?? "bg-primary",
                )}
              >
                {s.letter}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold tracking-tight">
                    {s.name}
                  </h3>
                  <Badge variant="muted" className="font-mono">
                    stage {s.order}
                  </Badge>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </div>
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
}

const accentByIndex = [
  "bg-primary",
  "bg-primary/90",
  "bg-primary/80",
  "bg-hot/80",
  "bg-hot/90",
  "bg-success",
];

function CategoryChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function ObjectionCard({
  objection,
  copied,
  onCopy,
}: {
  objection: Objection;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="font-mono uppercase tracking-wider">
            {categoryLabel[objection.category]}
          </Badge>
          <Badge variant="muted" className="font-mono">
            {objection.id}
          </Badge>
        </div>
        <h3 className="text-base font-semibold tracking-tight">
          {objection.title}
        </h3>
        <blockquote className="flex gap-2 border-l-2 border-primary/50 bg-muted/30 px-3 py-2 text-sm italic text-foreground/90">
          <MessageSquareQuote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
          <span>&ldquo;{objection.quote}&rdquo;</span>
        </blockquote>
      </header>

      <section className="flex flex-col gap-1.5">
        <Label>Why it happens</Label>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {objection.whyItHappens}
        </p>
      </section>

      <section className="flex flex-col gap-1.5">
        <Label>Reframe</Label>
        <p className="rounded-md bg-primary/5 px-3 py-2 text-sm font-medium leading-relaxed text-foreground">
          {objection.reframe}
        </p>
      </section>

      <Separator />

      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label>Script</Label>
          <Button variant="outline" size="sm" onClick={onCopy}>
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
        <p className="rounded-md border border-border bg-background px-3 py-3 text-sm leading-relaxed">
          {objection.script}
        </p>
      </section>

      <section className="flex gap-2 rounded-md border border-hot/30 bg-hot/5 p-3 text-sm">
        <Target className="mt-0.5 h-4 w-4 shrink-0 text-hot" />
        <div className="flex min-w-0 flex-col gap-0.5">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-hot">
            Closing move
          </span>
          <span className="leading-relaxed text-foreground">
            {objection.closingMove}
          </span>
        </div>
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-hot" />
      </section>
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
