"use client";

import { AlertTriangle, Clock, DollarSign, Flame, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { ladderStages, stageByKey } from "@/data/ladder";
import { deals } from "@/data/deals";
import type { Deal, LadderStage } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DealDrawer } from "./deal-drawer";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

export function PipelineBoard() {
  const [selected, setSelected] = useState<Deal | null>(null);
  const [filter, setFilter] = useState<"all" | "hot" | "drift" | "mine">("all");

  const filteredDeals = useMemo(() => {
    switch (filter) {
      case "hot":
        return deals.filter((d) => d.health >= 70);
      case "drift":
        return deals.filter((d) => d.daysInStage >= 10 || d.health < 50);
      case "mine":
        return deals.filter((d) => d.owner === "J. Reyes");
      default:
        return deals;
    }
  }, [filter]);

  const byStage = useMemo(() => {
    const map = new Map<LadderStage, Deal[]>();
    for (const s of ladderStages) map.set(s.key, []);
    for (const d of filteredDeals) map.get(d.stage)?.push(d);
    return map;
  }, [filteredDeals]);

  const totalValue = filteredDeals.reduce((s, d) => s + d.value, 0);

  return (
    <>
      <div className="mb-5 flex flex-col gap-4 tablet:flex-row tablet:items-center tablet:justify-between">
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All" count={deals.length} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterChip label="Hot (health ≥ 70)" active={filter === "hot"} onClick={() => setFilter("hot")} />
          <FilterChip label="Drift risk" active={filter === "drift"} onClick={() => setFilter("drift")} />
          <FilterChip label="Mine" active={filter === "mine"} onClick={() => setFilter("mine")} />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wider">Total</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {currency(totalValue)}
          </span>
          <span className="text-border">·</span>
          <span className="font-mono">{filteredDeals.length} deals</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2 laptop:grid-cols-3 desktop:grid-cols-6">
        {ladderStages.map((stage, idx) => {
          const stageDeals = byStage.get(stage.key) ?? [];
          const total = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage.key} className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-col gap-1 border-b border-border pb-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className={cn(
                        "flex h-6 w-6 shrink-0 items-center justify-center rounded font-mono text-xs font-bold text-primary-foreground",
                        accentByIndex[idx] ?? "bg-primary",
                      )}
                    >
                      {stage.letter}
                    </span>
                    <h3 className="truncate text-sm font-semibold">{stage.name}</h3>
                  </div>
                  <Badge variant="muted" className="font-mono">
                    {stageDeals.length}
                  </Badge>
                </div>
                <p className="font-mono text-[11px] text-muted-foreground">
                  {currency(total)}
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {stageDeals.length === 0 ? (
                  <div className="flex items-center justify-center rounded-md border border-dashed border-border bg-muted/20 p-5 text-xs text-muted-foreground">
                    No deals
                  </div>
                ) : (
                  stageDeals.map((d) => (
                    <DealCard key={d.id} deal={d} onClick={() => setSelected(d)} />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      <DealDrawer
        deal={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
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

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const healthTone =
    deal.health >= 70
      ? "bg-success/10 text-success"
      : deal.health >= 45
        ? "bg-warning/15 text-warning"
        : "bg-destructive/10 text-destructive";
  const drift = deal.daysInStage >= 10;
  const stage = stageByKey[deal.stage];

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-md border border-border bg-card p-3 text-left transition-colors hover:border-primary/40 hover:bg-muted/20"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-semibold">
            {deal.prospect.name}
          </span>
          <span className="flex items-center gap-1 truncate text-[11px] text-muted-foreground">
            <MapPin className="h-2.5 w-2.5 shrink-0" />
            {deal.prospect.city}, {deal.prospect.state}
          </span>
        </div>
        <span
          className={cn(
            "shrink-0 rounded px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider",
            healthTone,
          )}
        >
          {deal.health}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1 text-foreground">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono font-medium">{currency(deal.value)}</span>
        </div>
        <div
          className={cn(
            "flex items-center gap-1 font-mono",
            drift ? "text-hot" : "text-muted-foreground",
          )}
          title={`Days in ${stage.name}`}
        >
          {drift ? <Flame className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
          {deal.daysInStage}d
        </div>
      </div>

      <div className="flex items-start gap-1.5 rounded-sm bg-muted/40 p-2 text-[11px]">
        <AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" />
        <span className="line-clamp-2 text-foreground/90">{deal.nextAction}</span>
      </div>

      <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
        <span>{deal.owner}</span>
        <span>{deal.id}</span>
      </div>
    </button>
  );
}

function FilterChip({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
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
      {count !== undefined ? (
        <span className="ml-1.5 font-mono text-[10px] opacity-80">{count}</span>
      ) : null}
    </button>
  );
}
