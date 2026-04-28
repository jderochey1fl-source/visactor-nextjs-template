"use client";

import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Account } from "@/data/trigger-hunter-mock";

export function AccountRow({
  account,
  selected,
  onSelect,
}: {
  account: Account;
  selected: boolean;
  onSelect: () => void;
}) {
  const tempVariant: Record<Account["temperature"], "hot" | "warning" | "muted"> =
    {
      hot: "hot",
      warm: "warning",
      cool: "muted",
    };

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group w-full rounded-lg border bg-card p-4 text-left transition-all hover:border-foreground/20 hover:shadow-sm",
        selected
          ? "border-hot/40 shadow-sm ring-1 ring-hot/20"
          : "border-border/60",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold">{account.name}</h3>
            <Badge variant={tempVariant[account.temperature]} className="shrink-0">
              {account.temperature.toUpperCase()}
            </Badge>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {account.city}, {account.state} · {account.employeeCount} employees
            · Tier {account.crmTier}
          </p>
        </div>

        <div className="shrink-0 text-right">
          <div className="text-xl font-semibold tabular-nums">
            {account.compositeScore}
          </div>
          <div className="flex items-center justify-end gap-0.5 font-mono text-[10px] uppercase tracking-wider">
            {account.scoreDelta > 0 && (
              <>
                <ArrowUpRight className="h-3 w-3 text-success" />
                <span className="text-success">+{account.scoreDelta}</span>
              </>
            )}
            {account.scoreDelta < 0 && (
              <>
                <ArrowDownRight className="h-3 w-3 text-destructive" />
                <span className="text-destructive">{account.scoreDelta}</span>
              </>
            )}
            {account.scoreDelta === 0 && (
              <>
                <Minus className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">flat</span>
              </>
            )}
            <span className="ml-1 text-muted-foreground">7d</span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {account.signals.slice(0, 3).map((s) => (
          <span
            key={s.id}
            className="rounded-md border border-border/60 bg-muted/40 px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
          >
            {s.type}
          </span>
        ))}
        {account.signals.length === 0 && (
          <span className="text-[10px] italic text-muted-foreground">
            no fresh signals
          </span>
        )}
      </div>
    </button>
  );
}
