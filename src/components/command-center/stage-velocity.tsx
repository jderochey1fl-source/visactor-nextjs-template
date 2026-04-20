import { ladderStages, stageVelocity } from "@/data/ladder";
import { cn } from "@/lib/utils";

export function StageVelocity() {
  const max = Math.max(...stageVelocity.map((s) => s.avgDays));

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Stage Velocity
        </h2>
        <p className="text-xs text-muted-foreground">
          Avg days in stage vs. per-stage target &middot; Relationship is
          retention, no clock
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {stageVelocity.map((v) => {
          const stage = ladderStages.find((s) => s.key === v.stage)!;
          const pct = (v.avgDays / max) * 100;
          const hasTarget = v.targetDays !== null;
          const overBenchmark =
            hasTarget && v.avgDays > (v.targetDays as number);
          const targetPct = hasTarget
            ? ((v.targetDays as number) / max) * 100
            : 0;

          return (
            <div key={v.stage} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    {stage.letter}
                  </span>
                  <span className="text-sm">{stage.name}</span>
                  {hasTarget ? (
                    <span className="font-mono text-[10px] text-muted-foreground">
                      target {v.targetDays}d
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                      retention
                    </span>
                  )}
                </div>
                <span
                  className={cn(
                    "font-mono text-sm",
                    overBenchmark ? "text-hot" : "text-foreground",
                  )}
                >
                  {v.avgDays.toFixed(1)}d
                </span>
              </div>
              <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    !hasTarget
                      ? "bg-success"
                      : overBenchmark
                        ? "bg-hot"
                        : "bg-primary",
                  )}
                  style={{ width: `${pct}%` }}
                />
                {hasTarget ? (
                  <div
                    className="absolute top-0 h-full w-px bg-foreground/40"
                    style={{ left: `${targetPct}%` }}
                    aria-label="target"
                  />
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
