import { ArrowDownRight, ArrowUpRight, Clock, DollarSign, Percent, TrendingUp } from "lucide-react";
import { kpis } from "@/data/ladder";
import { cn } from "@/lib/utils";

type KPI = {
  label: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  invertColor?: boolean; // e.g. faster cycle = good, so negative change = green
  accent?: "primary" | "hot" | "success";
};

const items: KPI[] = [
  {
    label: "Pipeline Value",
    value: `$${(kpis.pipelineValue / 1_000_000).toFixed(2)}M`,
    change: kpis.pipelineChange,
    changeLabel: "vs. last 30d",
    icon: DollarSign,
    accent: "primary",
  },
  {
    label: "Close Rate",
    value: `${(kpis.closeRate * 100).toFixed(1)}%`,
    change: kpis.closeRateChange,
    changeLabel: "vs. last 30d",
    icon: Percent,
    accent: "success",
  },
  {
    label: "Avg Deal Size",
    value: `$${(kpis.avgDealSize / 1000).toFixed(1)}k`,
    change: kpis.avgDealChange,
    changeLabel: "vs. last 30d",
    icon: TrendingUp,
    accent: "hot",
  },
  {
    label: "Cycle Time",
    value: `${kpis.cycleDays}d`,
    change: kpis.cycleChange,
    changeLabel: "locate → signed",
    icon: Clock,
    invertColor: true,
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

function KpiCard({ label, value, change, changeLabel, icon: Icon, invertColor, accent }: KPI) {
  const positive = invertColor ? change < 0 : change > 0;
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
        <span
          className={cn(
            "inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-xs font-medium",
            positive
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {change >= 0 ? "+" : ""}
          {(change * 100).toFixed(1)}%
          {positive ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownRight className="h-3 w-3" />
          )}
        </span>
      </div>
      <span className="text-xs text-muted-foreground">{changeLabel}</span>
    </div>
  );
}
