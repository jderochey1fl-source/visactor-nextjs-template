import { cn } from "@/lib/utils";
import type { Subscores } from "@/data/trigger-hunter-mock";

const ROWS: Array<{
  key: keyof Subscores;
  label: string;
  description: string;
}> = [
  {
    key: "opportunity",
    label: "Opportunity",
    description: "Storm intensity, market density",
  },
  {
    key: "painSignal",
    label: "Pain signal",
    description: "Hiring sprint, leader change, tool churn",
  },
  {
    key: "fit",
    label: "Fit",
    description: "Size, region, ICP tier",
  },
  {
    key: "decisionAccess",
    label: "Decision access",
    description: "Verified DM contacts found",
  },
  {
    key: "timing",
    label: "Timing",
    description: "Recency of signals",
  },
];

export function ScoreBreakdown({ subscores }: { subscores: Subscores }) {
  return (
    <div className="flex flex-col gap-3">
      {ROWS.map((row) => {
        const value = subscores[row.key];
        const color =
          value >= 80
            ? "bg-hot"
            : value >= 65
            ? "bg-amber-500"
            : "bg-muted-foreground/40";
        return (
          <div key={row.key} className="flex flex-col gap-1.5">
            <div className="flex items-baseline justify-between gap-3">
              <div>
                <span className="text-xs font-semibold">{row.label}</span>
                <span className="ml-2 text-[10px] text-muted-foreground">
                  {row.description}
                </span>
              </div>
              <span className="text-xs font-mono tabular-nums">{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all", color)}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
