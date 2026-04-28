"use client";

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { Temperature } from "@/data/trigger-hunter-mock";

const REGIONS = [
  "All",
  "Texas",
  "Florida",
  "Colorado",
  "Oklahoma",
  "Kansas",
  "Georgia",
] as const;

const TEMPS: Array<{ id: Temperature | "all"; label: string }> = [
  { id: "all", label: "All temps" },
  { id: "hot", label: "Hot" },
  { id: "warm", label: "Warm" },
  { id: "cool", label: "Cool" },
];

export type SignalFilterState = {
  query: string;
  region: (typeof REGIONS)[number];
  temperature: Temperature | "all";
};

export function SignalFilters({
  state,
  onChange,
}: {
  state: SignalFilterState;
  onChange: (next: SignalFilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border/60 bg-card p-3 laptop:flex-row laptop:items-center">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={state.query}
          onChange={(e) => onChange({ ...state, query: e.target.value })}
          placeholder="Filter by company, city, owner..."
          className="pl-9"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TEMPS.map((t) => (
          <Button
            key={t.id}
            type="button"
            size="sm"
            variant={state.temperature === t.id ? "default" : "outline"}
            onClick={() => onChange({ ...state, temperature: t.id })}
            className={cn(
              "h-8 px-3 text-xs",
              state.temperature === t.id &&
                t.id === "hot" &&
                "bg-hot text-hot-foreground hover:bg-hot/90",
            )}
          >
            {t.label}
          </Button>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {REGIONS.map((r) => (
          <Button
            key={r}
            type="button"
            size="sm"
            variant={state.region === r ? "secondary" : "ghost"}
            onClick={() => onChange({ ...state, region: r })}
            className="h-8 px-2.5 text-xs"
          >
            {r}
          </Button>
        ))}
      </div>
    </div>
  );
}
