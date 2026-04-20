"use client";

import { Drama, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type {
  LoggedObjection,
  LoggedObjectionStatus,
  ObjectionCategory,
} from "@/types/types";

const CATEGORY_LABEL: Record<ObjectionCategory, string> = {
  price: "Price",
  timing: "Timing",
  trust: "Trust",
  spouse: "Spouse",
  insurance: "Insurance",
  competitor: "Competitor",
  process: "Process",
};

const STATUS_LABEL: Record<LoggedObjectionStatus, string> = {
  draft: "Draft",
  practicing: "Practicing",
  mastered: "Mastered",
};

const STATUS_STYLE: Record<LoggedObjectionStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  practicing: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  mastered: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
};

type Props = {
  items: LoggedObjection[];
  onOpen: (draft: LoggedObjection) => void;
  onDelete: (id: string) => void;
  onLogNew: () => void;
};

export function LibraryList({ items, onOpen, onDelete, onLogNew }: Props) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ObjectionCategory>("all");
  const [status, setStatus] = useState<"all" | LoggedObjectionStatus>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((o) => {
      if (category !== "all" && o.category !== category) return false;
      if (status !== "all" && o.status !== status) return false;
      if (!q) return true;
      return (
        o.statedObjection.toLowerCase().includes(q) ||
        o.analysis.realConcern.toLowerCase().includes(q) ||
        o.analysis.response.toLowerCase().includes(q) ||
        o.context.product.toLowerCase().includes(q) ||
        o.context.icp.toLowerCase().includes(q) ||
        o.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [items, query, category, status]);

  if (items.length === 0) {
    return <EmptyState onLogNew={onLogNew} />;
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search objections, scripts, tags..."
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={category}
            onChange={(v) => setCategory(v as "all" | ObjectionCategory)}
            options={[
              { value: "all", label: "All categories" },
              ...Object.entries(CATEGORY_LABEL).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <Select
            value={status}
            onChange={(v) => setStatus(v as "all" | LoggedObjectionStatus)}
            options={[
              { value: "all", label: "All statuses" },
              ...Object.entries(STATUS_LABEL).map(([value, label]) => ({
                value,
                label,
              })),
            ]}
          />
          <Button onClick={onLogNew} className="gap-2">
            <Plus className="h-4 w-4" />
            Log new
          </Button>
        </div>
      </div>

      <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {filtered.length} of {items.length} objection{items.length === 1 ? "" : "s"}
      </p>

      <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">
        {filtered.map((o) => (
          <LibraryCard
            key={o.id}
            objection={o}
            onOpen={() => onOpen(o)}
            onDelete={() => {
              if (confirm("Delete this logged objection?")) onDelete(o.id);
            }}
          />
        ))}
      </div>
    </div>
  );
}

function LibraryCard({
  objection,
  onOpen,
  onDelete,
}: {
  objection: LoggedObjection;
  onOpen: () => void;
  onDelete: () => void;
}) {
  return (
    <article
      className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/40 hover:bg-muted/30"
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-col gap-3 text-left"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-2 text-sm font-semibold leading-snug">
            &ldquo;{objection.statedObjection}&rdquo;
          </p>
          <span
            className={cn(
              "shrink-0 rounded-md px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider",
              STATUS_STYLE[objection.status],
            )}
          >
            {STATUS_LABEL[objection.status]}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="text-[10px]">
            {CATEGORY_LABEL[objection.category]}
          </Badge>
          {objection.roleplayTestsPassed > 0 ? (
            <Badge variant="outline" className="gap-1 text-[10px]">
              <Drama className="h-3 w-3" />
              {objection.roleplayTestsPassed}
            </Badge>
          ) : null}
          {objection.context.dealName ? (
            <span className="text-[11px] text-muted-foreground">
              {objection.context.dealName}
            </span>
          ) : null}
        </div>
        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          <span className="font-mono uppercase tracking-wider text-foreground/60">
            Real concern:
          </span>{" "}
          {objection.analysis.realConcern}
        </p>
      </button>
      <div className="flex items-center justify-between border-t border-border pt-2">
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          Updated{" "}
          {new Date(objection.updatedAt).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          })}
        </p>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="flex items-center gap-1 rounded px-1.5 py-1 text-[11px] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
          aria-label="Delete"
        >
          <Trash2 className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 rounded-md border border-border bg-background px-3 text-xs"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function EmptyState({ onLogNew }: { onLogNew: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <Plus className="h-6 w-6" />
      </div>
      <div className="flex max-w-md flex-col gap-2">
        <h3 className="text-lg font-semibold">Your library is empty</h3>
        <p className="text-sm text-muted-foreground">
          Every objection you hear is intelligence. Log the last 10 you heard —
          the AI will give you the real concern, diagnostic question, response,
          and bridge for each. Then pressure-test with role-play until each one
          comes out naturally.
        </p>
      </div>
      <Button onClick={onLogNew} className="gap-2">
        <Plus className="h-4 w-4" />
        Log your first objection
      </Button>
    </div>
  );
}
