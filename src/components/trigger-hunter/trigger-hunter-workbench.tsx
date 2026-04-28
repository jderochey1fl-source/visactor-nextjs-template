"use client";

import { useMemo, useState } from "react";
import {
  type Account,
  MOCK_ACCOUNTS,
  summarizeAccounts,
} from "@/data/trigger-hunter-mock";
import { AccountDetail } from "./account-detail";
import { AccountRow } from "./account-row";
import {
  type SignalFilterState,
  SignalFilters,
} from "./signal-filters";
import { SignalStatStrip } from "./signal-stat-strip";

export function TriggerHunterWorkbench() {
  const [filters, setFilters] = useState<SignalFilterState>({
    query: "",
    region: "All",
    temperature: "all",
  });
  const [selectedId, setSelectedId] = useState<string>(MOCK_ACCOUNTS[0].id);

  const summary = useMemo(() => summarizeAccounts(MOCK_ACCOUNTS), []);

  const filtered = useMemo(() => {
    return MOCK_ACCOUNTS.filter((a) => {
      if (filters.temperature !== "all" && a.temperature !== filters.temperature)
        return false;
      if (filters.region !== "All" && a.region !== filters.region) return false;
      if (filters.query.trim().length > 0) {
        const q = filters.query.toLowerCase();
        const haystack =
          `${a.name} ${a.city} ${a.state} ${a.domain} ${a.decisionMakers
            .map((d) => d.name)
            .join(" ")}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => b.compositeScore - a.compositeScore);
  }, [filters]);

  const selected: Account | undefined =
    filtered.find((a) => a.id === selectedId) ?? filtered[0];

  return (
    <div className="flex flex-col gap-5">
      <SignalStatStrip {...summary} />

      <SignalFilters state={filters} onChange={setFilters} />

      <div className="grid grid-cols-1 gap-5 laptop:grid-cols-[minmax(0,360px)_1fr]">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {filtered.length} accounts · ranked by score
            </span>
          </div>
          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center">
              <p className="text-sm">No accounts match these filters.</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Loosen the temperature or region filter and try again.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((a) => (
                <AccountRow
                  key={a.id}
                  account={a}
                  selected={selected?.id === a.id}
                  onSelect={() => setSelectedId(a.id)}
                />
              ))}
            </div>
          )}
        </div>

        <div className="min-w-0">
          {selected ? (
            <AccountDetail account={selected} />
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/30 p-10 text-center">
              <p className="text-sm">Select an account to see signal detail.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
