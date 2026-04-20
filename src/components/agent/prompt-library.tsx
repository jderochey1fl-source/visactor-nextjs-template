"use client";

import { BookOpen, Search, Wand2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  promptCategories,
  promptTemplates,
  type PromptTemplate,
  type PromptTemplateCategory,
} from "@/data/prompt-templates";
import { cn } from "@/lib/utils";

type PromptLibraryProps = {
  onUse: (prompt: string) => void;
};

type CategoryFilter = "All" | PromptTemplateCategory;

export function PromptLibrary({ onUse }: PromptLibraryProps) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return promptTemplates.filter((t) => {
      if (activeCategory !== "All" && t.category !== activeCategory) {
        return false;
      }
      if (!q) return true;
      return (
        t.title.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.prompt.toLowerCase().includes(q)
      );
    });
  }, [query, activeCategory]);

  return (
    <div className="flex h-full flex-col">
      {/* Header / filters */}
      <div className="border-b border-border bg-card/40 px-6 py-4">
        <div className="mx-auto flex max-w-4xl flex-col gap-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <BookOpen className="h-4 w-4" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-sm font-semibold tracking-tight">
                  Prompt Library
                </h2>
                <p className="text-xs text-muted-foreground">
                  One-click templates from the LADDER curriculum. Edit the
                  inputs before you send.
                </p>
              </div>
            </div>
            <Badge variant="outline" className="shrink-0 font-mono text-[10px] uppercase">
              {filtered.length} / {promptTemplates.length}
            </Badge>
          </div>

          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search prompts by name, pain, or stage..."
              className="pl-9"
              aria-label="Search prompt templates"
            />
          </div>

          <div className="flex flex-wrap gap-1.5">
            <CategoryChip
              label="All"
              active={activeCategory === "All"}
              onClick={() => setActiveCategory("All")}
            />
            {promptCategories.map((c) => (
              <CategoryChip
                key={c}
                label={c}
                active={activeCategory === c}
                onClick={() => setActiveCategory(c)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Template cards */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-3 px-6 py-6 tablet:grid-cols-2">
          {filtered.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                No templates match {'"'}
                {query}
                {'"'}.
              </p>
              <button
                type="button"
                className="font-mono text-[10px] uppercase tracking-wider text-primary hover:underline"
                onClick={() => {
                  setQuery("");
                  setActiveCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          ) : (
            filtered.map((t) => (
              <TemplateCard key={t.id} template={t} onUse={onUse} />
            ))
          )}
        </div>
      </div>
    </div>
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
        "rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}

function TemplateCard({
  template,
  onUse,
}: {
  template: PromptTemplate;
  onUse: (prompt: string) => void;
}) {
  const tokenCount = (template.prompt.match(/\{[^}]+\}/g) || []).length;

  return (
    <div className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-[10px] uppercase tracking-wider text-primary">
            {template.category}
          </span>
          <h3 className="text-sm font-semibold leading-snug tracking-tight">
            {template.title}
          </h3>
        </div>
        {tokenCount > 0 ? (
          <Badge
            variant="secondary"
            className="shrink-0 gap-1 font-mono text-[10px] uppercase"
            title={`${tokenCount} placeholder${tokenCount === 1 ? "" : "s"} to fill`}
          >
            <Wand2 className="h-3 w-3" />
            {tokenCount}
          </Badge>
        ) : null}
      </div>

      <p className="text-xs leading-relaxed text-muted-foreground">
        {template.description}
      </p>

      <pre className="line-clamp-4 whitespace-pre-wrap rounded-md border border-dashed border-border bg-muted/30 p-2.5 font-mono text-[11px] leading-relaxed text-muted-foreground">
        {template.prompt}
      </pre>

      <div className="flex items-center justify-between gap-2">
        <span className="truncate font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {template.source}
        </span>
        <button
          type="button"
          onClick={() => onUse(template.prompt)}
          className="shrink-0 rounded-md bg-primary px-3 py-1.5 font-mono text-[10px] font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Use template
        </button>
      </div>
    </div>
  );
}
