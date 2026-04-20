import { Clock, DollarSign, Percent, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type KPI = {
  label: string;
  value: string;
  subtitle: string;
  tag?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: "primary" | "hot" | "success";
};

// Day-1 founding-AE reality. No manufactured momentum badges.
const items: KPI[] = [
  {
    label: "Pipeline Value",
    value: "$0",
    subtitle: "target: $500K",
    tag: "YEAR 1 QUOTA",
    icon: DollarSign,
    accent: "primary",
  },
  {
    label: "Close Rate",
    value: "—",
    subtitle: "baseline pending",
    icon: Percent,
    accent: "success",
  },
  {
    label: "Avg Deal Size",
    value: "$5,988",
    subtitle: "annual contract value",
    tag: "~$499/mo",
    icon: TrendingUp,
    accent: "hot",
  },
  {
    label: "Cycle Time",
    value: "45d",
    subtitle: "target",
    tag: "ESTIMATE",
    icon: Clock,
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
