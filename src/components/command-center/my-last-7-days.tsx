import {
  AlertTriangle,
  Flame,
  Mic,
  Shield,
  Target,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// STUB DATA — replace with live queries against Neon `roleplay_sessions` +
// `roleplay_turns` + `roleplay_debriefs` once the schema is wired up.
//
// Live queries to write later:
//   - roleplaysCompleted: count of sessions where ended_at is in last 7 days.
//   - scenariosCovered:   distinct scenario_id over last 7 days.
//   - objectionsDrilled:  count of turns tagged 'objection' (TBD tagging).
//   - topMiss:            most-frequent miss across debriefs in last 7 days.
//   - streakDays:         consecutive calendar days with >=1 completed session.
//   - vsLastWeek:         delta vs the prior 7-day window.
// ---------------------------------------------------------------------------
type Stat = {
  label: string;
  value: string;
  delta?: string;
  detail?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "hot" | "success" | "warning";
};

const stats: Stat[] = [
  {
    label: "Role-plays Completed",
    value: "12",
    delta: "+4 vs last week",
    icon: Mic,
    accent: "primary",
  },
  {
    label: "Scenarios Covered",
    value: "5 of 8",
    detail: "3 untouched",
    icon: Target,
    accent: "hot",
  },
  {
    label: "Objections Drilled",
    value: "9",
    detail: "Most: pricing pushback",
    icon: Shield,
    accent: "success",
  },
  {
    label: "Top Miss Flagged",
    value: "Cost-of-status-quo",
    detail: "AI flagged in 7 of 12",
    icon: AlertTriangle,
    accent: "warning",
  },
  {
    label: "Streak",
    value: "4d",
    detail: "Longest: 11d",
    icon: Flame,
    accent: "hot",
  },
];

export function MyLast7Days() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold tracking-tight">
              My Last 7 Days
            </h2>
            <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              Stub · live when Neon ships
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            What you actually did this week &middot; coaching cockpit, not a
            deal tracker
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-md border border-success/30 bg-success/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-success">
          <TrendingUp className="h-3 w-3" aria-hidden="true" />
          Up week-over-week
        </span>
      </div>

      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border tablet:grid-cols-3 laptop:grid-cols-5">
        {stats.map((s) => (
          <StatTile key={s.label} {...s} />
        ))}
      </div>
    </div>
  );
}

function StatTile({ label, value, delta, detail, icon: Icon, accent }: Stat) {
  return (
    <div className="relative flex flex-col gap-2 bg-card p-4 transition-colors hover:bg-muted/40">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md",
            accent === "primary" && "bg-primary/10 text-primary",
            accent === "hot" && "bg-hot/10 text-hot",
            accent === "success" && "bg-success/10 text-success",
            accent === "warning" && "bg-warning/15 text-warning",
            !accent && "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3 w-3" />
        </div>
      </div>
      <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
        {value}
      </span>
      {delta ? (
        <span className="font-mono text-[11px] text-success">{delta}</span>
      ) : null}
      {detail ? (
        <span className="text-[11px] text-muted-foreground">{detail}</span>
      ) : null}
    </div>
  );
}
