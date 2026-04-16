"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Building2, Clock, DollarSign } from "lucide-react";
import { deals } from "@/data/deals";
import { ladderStages } from "@/data/ladder";
import type { Deal, LadderStageId } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
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

  const byStage = useMemo(() => {
    const map = new Map<LadderStageId, Deal[]>();
    for (const stage of ladderStages) map.set(stage.id, []);
    for (const d of deals) map.get(d.stage)?.push(d);
    return map;
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {ladderStages.map((stage) => {
          const stageDeals = byStage.get(stage.id) ?? [];
          const total = stageDeals.reduce((s, d) => s + d.value, 0);
          return (
            <div key={stage.id} className="flex min-w-0 flex-col gap-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="flex h-6 w-6 flex-none items-center justify-center rounded bg-accent/15 font-mono text-xs font-semibold text-accent">
                    {stage.letter}
                  </span>
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {stage.title}
                  </h3>
                </div>
                <Badge variant="outline" className="font-mono text-xs">
                  {stageDeals.length}
                </Badge>
              </div>
              <p className="font-mono text-xs text-muted-foreground">
                {currency(total)} total
              </p>
              <div className="flex flex-col gap-3">
                {stageDeals.length === 0 ? (
                  <Card className="flex items-center justify-center border-dashed bg-muted/30 p-4 text-xs text-muted-foreground">
                    No deals in stage
                  </Card>
                ) : (
                  stageDeals.map((deal) => (
                    <DealCard
                      key={deal.id}
                      deal={deal}
                      onClick={() => setSelected(deal)}
                    />
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

function DealCard({ deal, onClick }: { deal: Deal; onClick: () => void }) {
  const temp =
    deal.temperature === "hot"
      ? "bg-accent/15 text-accent"
      : deal.temperature === "warm"
        ? "bg-primary/10 text-primary"
        : "bg-muted text-muted-foreground";

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-left transition hover:border-primary/40 hover:shadow-sm",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building2 className="h-3 w-3 flex-none" />
            <span className="truncate">{deal.company}</span>
          </div>
          <p className="truncate text-sm font-semibold text-foreground">
            {deal.contact}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {deal.title}
          </p>
        </div>
        <span
          className={cn(
            "flex-none rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            temp,
          )}
        >
          {deal.temperature}
        </span>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-border pt-3">
        <div className="flex items-center gap-1.5 text-xs text-foreground">
          <DollarSign className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono font-medium">{currency(deal.value)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span className="font-mono">{deal.daysInStage}d</span>
        </div>
      </div>

      {deal.blockers.length > 0 && (
        <div className="flex items-start gap-1.5 rounded-md bg-destructive/10 p-2 text-xs text-destructive">
          <AlertTriangle className="mt-0.5 h-3 w-3 flex-none" />
          <span className="line-clamp-2">{deal.blockers[0]}</span>
        </div>
      )}
    </button>
  );
}
