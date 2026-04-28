import { Activity, Flame, Target, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

type KPI = {
  label: string;
  value: string;
  subtitle: string;
  tag?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "hot" | "success";
};

// Training-flavored KPIs. No CRM, no pipeline. These are the four numbers a
// rep should see first thing every morning. STUB values — every one of these
// goes live from Neon the moment role-plays start persisting.
const items: KPI[] = [
  {
    label: "Practice Pace",
    value: "3 / 5",
    subtitle: "drills this week",
    tag: "60% OF GOAL",
    icon: Target,
    accent: "primary",
  },
  {
    label: "Mastery Score",
    value: "64",
    subtitle: "avg across LADDER stages",
    tag: "OUT OF 100",
    icon: Activity,
    accent: "hot",
  },
  {
    label: "Streak",
    value: "4d",
    subtitle: "consecutive drill days",
    tag: "PR: 11d",
    icon: Flame,
    accent: "success",
  },
  {
    label: "Top Miss",
    value: "Diagnose",
    subtitle: "weakest LADDER stage",
    tag: "DRILL TODAY",
    icon: TrendingDown,
  },
];

export function KpiGrid() {
  return (
    <div className="grid grid-cols-1 gap-px border-y border-border bg-border phone:grid-cols-2 laptop:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.label} {...item} />
      ))}
    </div>
  );
}

function KpiCard({ label, value, subtitle, tag, icon: Icon, accent }: KPI) {
  return (
    <div className="relative flex flex-col gap-3 bg-card p-5 transition-colors hover:bg-muted/40">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md",
            accent === "primary" && "bg-primary/10 text-primary",
            accent === "hot" && "bg-hot/10 text-hot",
            accent === "success" && "bg-success/10 text-success",
            !accent && "bg-muted text-muted-foreground",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">
          {value}
        </span>
        {tag ? (
          <span className="inline-flex items-center rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {tag}
          </span>
        ) : null}
      </div>
      <span className="text-xs text-muted-foreground">{subtitle}</span>
    </div>
  );
}
