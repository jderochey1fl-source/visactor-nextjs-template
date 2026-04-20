"use client";

import { VChart } from "@visactor/react-vchart";
import type { IAreaChartSpec } from "@visactor/vchart";
import { revenueTrend } from "@/data/ladder";

const series = revenueTrend.flatMap((p) => [
  { week: p.week, value: p.signed, type: "Signed" },
  { week: p.week, value: p.forecast, type: "Forecast" },
]);

const spec: IAreaChartSpec = {
  type: "area",
  data: [{ id: "revenue", values: series }],
  xField: "week",
  yField: "value",
  seriesField: "type",
  stack: false,
  padding: [8, 8, 8, 8],
  point: { visible: true, style: { size: 4 } },
  area: {
    style: {
      fillOpacity: 0.15,
    },
  },
  line: { style: { lineWidth: 2 } },
  color: ["#1d4ed8", "#f97316"],
  legends: [
    {
      visible: true,
      orient: "top",
      position: "end",
      padding: 0,
      item: { label: { style: { fontSize: 11 } } },
    },
  ],
  axes: [
    {
      orient: "bottom",
      label: { style: { fontSize: 10, fill: "#94a3b8" } },
      domainLine: { visible: false },
      tick: { visible: false },
    },
    {
      orient: "left",
      label: {
        style: { fontSize: 10, fill: "#94a3b8" },
        formatMethod: (val) =>
          typeof val === "number"
            ? `$${Math.round(val / 1000)}k`
            : String(val),
      },
      grid: { style: { lineDash: [2, 2] } },
      domainLine: { visible: false },
      tick: { visible: false },
    },
  ],
  tooltip: {
    trigger: ["click", "hover"],
    mark: {
      content: {
        value: (d) => `$${Number(d?.value ?? 0).toLocaleString()}`,
      },
    },
  },
  animationEnter: { easing: "cubicInOut" },
};

export function RevenueChart() {
  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Signed vs. Forecast
          </h2>
          <p className="text-xs text-muted-foreground">
            Trailing 12 weeks &middot; all reps
          </p>
        </div>
        <span className="rounded-md border border-border bg-muted/50 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          weekly
        </span>
      </div>
      <div className="min-h-[260px] flex-grow">
        <VChart spec={spec} />
      </div>
    </div>
  );
}
