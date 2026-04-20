import { ladderStages, stageVelocity } from "@/data/ladder";
import { cn } from "@/lib/utils";

export function StageVelocity() {
  const max = Math.max(...stageVelocity.map((s) => s.avgDays));
  const benchmark = 5; // internal target days in stage

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-base font-semibold tracking-tight">
          Stage Velocity
        </h2>
        <p className="text-xs text-muted-foreground">
          Avg days in stage &middot; target {benchmark}d
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {stageVelocity.map((v) => {
          const stage = ladderStages.find((s) => s.key === v.stage)!;
          const pct = (v.avgDays / max) * 100;
          const overBenchmark = v.avgDays > benchmark;
          return (
            <div key={v.stage} className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase text-muted-foreground">
                    {stage.letter}
                  </span>
                  <span className="text-sm">{stage.name}</span>
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
                    overBenchmark ? "bg-hot" : "bg-primary",
                  )}
                  style={{ width: `${pct}%` }}
                />
                <div
                  className="absolute top-0 h-full w-px bg-foreground/40"
                  style={{ left: `${(benchmark / max) * 100}%` }}
                  aria-label="target"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
