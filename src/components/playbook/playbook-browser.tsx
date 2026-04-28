"use client";

import {
  ArrowRight,
  Check,
  Copy,
  Lightbulb,
  MessageSquareQuote,
  Quote,
  Search,
  Sparkles,
  Target,
  TriangleAlert,
} from "lucide-react";
import { useMemo, useState } from "react";
import { objectionCategories, objections } from "@/data/objections";
import {
  playbookCategoryLabel,
  playbookModules,
} from "@/data/playbook-modules";
import type {
  Objection,
  PlaybookModule,
  PlaybookModuleCategory,
  PlaybookSection,
} from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { FourDecisionsPanel } from "./four-decisions-panel";

const categoryLabel: Record<Objection["category"], string> = Object.fromEntries(
  objectionCategories.map((c) => [c.key, c.label]),
) as Record<Objection["category"], string>;

const moduleCategoryKeys = Array.from(
  new Set(playbookModules.map((m) => m.category)),
) as PlaybookModuleCategory[];

export function PlaybookBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | Objection["category"]>(
    "all",
  );
  const [copied, setCopied] = useState<string | null>(null);

  const [moduleQuery, setModuleQuery] = useState("");
  const [moduleCategory, setModuleCategory] = useState<
    "all" | PlaybookModuleCategory
  >("all");

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

  const filteredModules = useMemo(() => {
    const q = moduleQuery.trim().toLowerCase();
    return playbookModules.filter((m) => {
      if (moduleCategory !== "all" && m.category !== moduleCategory)
        return false;
      if (!q) return true;
      const haystack = [
        m.title,
        m.summary,
        ...m.sections.flatMap((s) => [
          s.heading,
          s.body ?? "",
          ...(s.bullets ?? []),
          s.callout?.text ?? "",
        ]),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [moduleQuery, moduleCategory]);

  const copyScript = (id: string, text: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(id);
    setTimeout(() => setCopied(null), 1400);
  };

  return (
    <Tabs
      defaultValue="decisions"
      variant="prominent"
      className="flex flex-col gap-5"
    >
      <TabsList>
        <TabsTrigger value="decisions">Four Decisions</TabsTrigger>
        <TabsTrigger value="campaign">Campaign Playbook</TabsTrigger>
        <TabsTrigger value="objections">Objections</TabsTrigger>
      </TabsList>

      <TabsContent value="campaign" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
          <div className="relative w-full tablet:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={moduleQuery}
              onChange={(e) => setModuleQuery(e.target.value)}
              placeholder="Search frameworks, prompts, principles..."
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            <CategoryChip
              label="All"
              active={moduleCategory === "all"}
              onClick={() => setModuleCategory("all")}
            />
            {moduleCategoryKeys.map((key) => (
              <CategoryChip
                key={key}
                label={playbookCategoryLabel[key]}
                active={moduleCategory === key}
                onClick={() => setModuleCategory(key)}
              />
            ))}
          </div>
        </div>

        {filteredModules.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center text-sm text-muted-foreground">
            No modules match your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 laptop:grid-cols-2">
            {filteredModules.map((m) => (
              <ModuleCard
                key={m.id}
                module={m}
                copied={copied === m.id}
                onCopy={() => {
                  const body = [
                    `${m.number} — ${m.title}`,
                    "",
                    m.summary,
                    "",
                    ...m.sections.map((s) =>
                      [
                        s.heading,
                        s.body,
                        ...(s.bullets ?? []).map((b) => `• ${b}`),
                        s.callout ? `[${s.callout.label ?? s.callout.kind}] ${s.callout.text}` : "",
                      ]
                        .filter(Boolean)
                        .join("\n"),
                    ),
                  ].join("\n\n");
                  copyScript(m.id, body);
                }}
              />
            ))}
          </div>
        )}
      </TabsContent>

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

      <TabsContent value="decisions">
        <FourDecisionsPanel />
      </TabsContent>
    </Tabs>
  );
}

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

function ModuleCard({
  module,
  copied,
  onCopy,
}: {
  module: PlaybookModule;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-border bg-card p-5">
      <header className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <Badge variant="secondary" className="font-mono uppercase tracking-wider">
            {playbookCategoryLabel[module.category]}
          </Badge>
          <div className="flex items-center gap-1.5">
            <Badge variant="muted" className="font-mono">
              {module.number}
            </Badge>
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
        </div>
        <h3 className="text-base font-semibold leading-snug tracking-tight">
          {module.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {module.summary}
        </p>
      </header>

      <div className="flex flex-col gap-4">
        {module.sections.map((section, i) => (
          <ModuleSection key={i} section={section} />
        ))}
      </div>
    </article>
  );
}

function ModuleSection({ section }: { section: PlaybookSection }) {
  return (
    <section className="flex flex-col gap-2">
      <Label>{section.heading}</Label>
      {section.body ? (
        <p className="text-sm leading-relaxed text-foreground/90">
          {section.body}
        </p>
      ) : null}
      {section.bullets && section.bullets.length > 0 ? (
        <ul className="flex flex-col gap-1.5">
          {section.bullets.map((b, i) => (
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
      {section.callout ? <Callout callout={section.callout} /> : null}
    </section>
  );
}

function Callout({
  callout,
}: {
  callout: NonNullable<PlaybookSection["callout"]>;
}) {
  const config = calloutConfig[callout.kind];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "flex gap-2 rounded-md border p-3 text-sm",
        config.container,
      )}
    >
      <Icon className={cn("mt-0.5 h-4 w-4 shrink-0", config.icon_color)} />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "font-mono text-[10px] font-bold uppercase tracking-wider",
            config.label_color,
          )}
        >
          {callout.label ?? config.default_label}
        </span>
        <span className="leading-relaxed text-foreground">{callout.text}</span>
      </div>
    </div>
  );
}

const calloutConfig = {
  prompt: {
    icon: Sparkles,
    icon_color: "text-primary",
    label_color: "text-primary",
    container: "border-primary/30 bg-primary/5",
    default_label: "AI prompt",
  },
  warning: {
    icon: TriangleAlert,
    icon_color: "text-hot",
    label_color: "text-hot",
    container: "border-hot/30 bg-hot/5",
    default_label: "Warning",
  },
  principle: {
    icon: Lightbulb,
    icon_color: "text-success",
    label_color: "text-success",
    container: "border-success/30 bg-success/5",
    default_label: "Principle",
  },
  example: {
    icon: Quote,
    icon_color: "text-muted-foreground",
    label_color: "text-muted-foreground",
    container: "border-border bg-muted/40",
    default_label: "Example",
  },
} as const;

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}
