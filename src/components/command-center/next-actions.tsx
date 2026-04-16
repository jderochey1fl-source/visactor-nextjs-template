import { ChevronRight, Flame } from "lucide-react";
import { nextActions } from "@/data/ladder";
import { stageByKey } from "@/data/ladder";
import { cn } from "@/lib/utils";

const heatStyles: Record<string, string> = {
  hot: "bg-hot/10 text-hot",
  warm: "bg-warning/15 text-warning",
  cold: "bg-muted text-muted-foreground",
};

export function NextActions() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Next Actions
          </h2>
          <p className="text-xs text-muted-foreground">
            Sorted by heat &middot; {nextActions.length} open
          </p>
        </div>
        <button
          type="button"
          className="text-[11px] font-medium text-primary hover:underline"
        >
          View all
        </button>
      </div>
      <ul className="flex flex-col gap-2">
        {nextActions.map((a) => {
          const stage = stageByKey[a.stage];
          return (
            <li
              key={a.id}
              className="group relative flex cursor-pointer items-start gap-3 rounded-md border border-border bg-card p-3 transition-colors hover:border-primary/40 hover:bg-muted/40"
            >
              <div
                className={cn(
                  "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
                  heatStyles[a.heat],
                )}
              >
                {a.heat === "hot" ? (
                  <Flame className="h-3.5 w-3.5" />
                ) : (
                  <span className="font-mono text-[10px] font-bold uppercase">
                    {stage.letter}
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-grow flex-col gap-0.5">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {a.prospect}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {stage.name}
                  </span>
                </div>
                <p className="line-clamp-2 text-xs text-muted-foreground">
                  {a.action}
                </p>
                <div className="mt-1 flex items-center gap-2 text-[11px]">
                  <span className="font-mono text-muted-foreground">
                    {a.due}
                  </span>
                  {a.value > 0 ? (
                    <>
                      <span className="text-border">&bull;</span>
                      <span className="font-mono text-foreground">
                        ${a.value.toLocaleString()}
                      </span>
                    </>
                  ) : null}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 self-center text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
