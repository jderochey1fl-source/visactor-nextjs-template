import { Activity, Flame, Snowflake, Sun, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Stat = {
  label: string;
  value: number | string;
  icon: typeof Flame;
  accent: "hot" | "warm" | "cool" | "neutral";
};

export function SignalStatStrip({
  hot,
  warm,
  cool,
  newSignals7d,
  total,
}: {
  hot: number;
  warm: number;
  cool: number;
  newSignals7d: number;
  total: number;
}) {
  const stats: Stat[] = [
    { label: "Hot", value: hot, icon: Flame, accent: "hot" },
    { label: "Warm", value: warm, icon: Sun, accent: "warm" },
    { label: "Cool", value: cool, icon: Snowflake, accent: "cool" },
    {
      label: "New signals · 7d",
      value: newSignals7d,
      icon: Activity,
      accent: "neutral",
    },
    {
      label: "Tracked accounts",
      value: total,
      icon: TrendingUp,
      accent: "neutral",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 tablet:grid-cols-3 laptop:grid-cols-5">
      {stats.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.label} className="border-border/60">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {s.label}
                </span>
                <span className="text-2xl font-semibold tabular-nums">
                  {s.value}
                </span>
              </div>
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-md",
                  s.accent === "hot" && "bg-hot/10 text-hot",
                  s.accent === "warm" &&
                    "bg-amber-500/10 text-amber-600 dark:text-amber-500",
                  s.accent === "cool" && "bg-muted text-muted-foreground",
                  s.accent === "neutral" && "bg-muted text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
