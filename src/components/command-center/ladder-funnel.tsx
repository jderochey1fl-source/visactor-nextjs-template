import { ArrowRight } from "lucide-react";
import { funnelCounts, ladderStages, stageConversion } from "@/data/ladder";
import { cn } from "@/lib/utils";
import type { LadderStage } from "@/types/types";

const conversionByFrom = Object.fromEntries(
  stageConversion.map((c) => [c.from, c]),
) as Record<LadderStage, (typeof stageConversion)[number] | undefined>;

const accentByIndex = [
  "bg-primary",
  "bg-primary/90",
  "bg-primary/80",
  "bg-hot/80",
  "bg-hot/90",
  "bg-success",
];

export function LadderFunnel() {
  const max = Math.max(...funnelCounts.map((f) => f.count));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            LADDER Funnel
          </h2>
          <p className="text-xs text-muted-foreground">
            Prospects currently in each stage &middot; conversion is trailing 90d
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-primary" /> Discovery
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-hot" /> Close
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-success" /> Win
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        {ladderStages.map((stage, idx) => {
          const row = funnelCounts.find((f) => f.stage === stage.key);
          const count = row?.count ?? 0;
          const width = (count / max) * 100;
          const conv = conversionByFrom[stage.key];
          const next = ladderStages[idx + 1];
          return (
            <div
              key={stage.key}
              className="group grid grid-cols-[auto_1fr_auto] items-center gap-3"
            >
              <div className="flex w-[130px] items-center gap-2.5">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md font-mono text-sm font-bold text-primary-foreground",
                    accentByIndex[idx] ?? "bg-primary",
                  )}
                >
                  {stage.letter}
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-sm font-medium">{stage.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    stage {stage.order}
                  </span>
                </div>
              </div>

              <div className="relative h-9 w-full overflow-hidden rounded-md border border-border bg-muted/30">
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 flex items-center justify-end px-3 transition-all",
                    accentByIndex[idx] ?? "bg-primary",
                  )}
                  style={{ width: `${Math.max(width, 6)}%` }}
                >
                  <span className="font-mono text-sm font-semibold text-primary-foreground">
                    {count.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="flex w-[86px] items-center justify-end gap-1 text-right">
                {conv && next ? (
                  <>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-mono text-xs font-semibold text-foreground">
                      {(conv.rate * 100).toFixed(0)}%
                    </span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {next.letter}
                    </span>
                  </>
                ) : (
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    win
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
