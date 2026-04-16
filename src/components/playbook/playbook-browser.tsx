"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Copy, Search } from "lucide-react";
import { objections, objectionCategories } from "@/data/objections";
import { ladderStages } from "@/data/ladder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function PlaybookBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("all");
  const [copied, setCopied] = useState<string | null>(null);

  const filteredObjections = useMemo(() => {
    const q = query.trim().toLowerCase();
    return objections.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (!q) return true;
      return (
        o.objection.toLowerCase().includes(q) ||
        o.response.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [query, category]);

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Tabs defaultValue="objections" className="flex flex-col gap-6">
      <TabsList>
        <TabsTrigger value="objections">Objections</TabsTrigger>
        <TabsTrigger value="stages">LADDER stages</TabsTrigger>
      </TabsList>

      <TabsContent value="objections" className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search objections, scripts, tags…"
              className="pl-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <CategoryChip
              label="All"
              active={category === "all"}
              onClick={() => setCategory("all")}
            />
            {objectionCategories.map((c) => (
              <CategoryChip
                key={c.id}
                label={c.label}
                active={category === c.id}
                onClick={() => setCategory(c.id)}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredObjections.length === 0 ? (
            <Card className="col-span-full flex items-center justify-center border-dashed bg-muted/30 p-8 text-sm text-muted-foreground">
              No objections match your filters.
            </Card>
          ) : (
            filteredObjections.map((o) => (
              <Card key={o.id} className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-2">
                    <Badge variant="secondary" className="w-fit">
                      {
                        objectionCategories.find((c) => c.id === o.category)
                          ?.label
                      }
                    </Badge>
                    <p className="text-sm font-semibold text-foreground">
                      &ldquo;{o.objection}&rdquo;
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Response
                  </h4>
                  <p className="text-sm leading-relaxed text-foreground">
                    {o.response}
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap gap-1.5">
                    {o.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copy(o.id, o.response)}
                  >
                    <Copy className="mr-1.5 h-3 w-3" />
                    {copied === o.id ? "Copied" : "Copy"}
                  </Button>
                </div>
              </Card>
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="stages" className="flex flex-col gap-4">
        {ladderStages.map((s) => (
          <Card key={s.id} className="flex flex-col gap-4 p-6">
            <div className="flex items-start gap-4">
              <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-accent/15 font-mono text-lg font-semibold text-accent">
                {s.letter}
              </span>
              <div className="flex min-w-0 flex-col gap-1">
                <h3 className="font-serif text-xl font-semibold tracking-tight text-foreground">
                  {s.title}
                </h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <StageList title="Goals" items={s.goals} />
              <StageList title="Key questions" items={s.keyQuestions} />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ChevronRight className="h-3 w-3" />
              <span>
                Exit criteria:{" "}
                <span className="text-foreground">{s.exitCriteria}</span>
              </span>
            </div>
          </Card>
        ))}
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
        "rounded-full border px-3 py-1 text-xs font-medium transition",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function StageList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h4>
      <ul className="flex flex-col gap-1.5">
        {items.map((i, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2 text-sm text-foreground"
          >
            <span className="mt-2 h-1 w-1 flex-none rounded-full bg-accent" />
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
