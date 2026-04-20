"use client";

import { ChevronDown, Zap } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { NEVER_DO, REBUTTAL_LEVERS } from "@/data/rebuttal-levers";
import { cn } from "@/lib/utils";

export function TopRebuttalFactors() {
  const [open, setOpen] = useState(true);

  return (
    <section className="border-b border-border bg-card/40">
      <div className="mx-auto w-full max-w-6xl px-6 py-4">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">
                  Top rebuttal factors
                </p>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {REBUTTAL_LEVERS.length} levers
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Every AI-generated rebuttal pulls from one of these levers.
              </p>
            </div>
          </div>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open ? "rotate-180" : "rotate-0",
            )}
          />
        </button>

        {open ? (
          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 laptop:grid-cols-5">
              {REBUTTAL_LEVERS.map((lever) => {
                const Icon = lever.icon;
                return (
                  <article
                    key={lever.key}
                    className="flex flex-col gap-2 rounded-md border border-border bg-background p-3"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md bg-muted/60",
                          lever.colorClass,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-foreground">
                        {lever.name}
                      </p>
                    </div>
                    <p className="text-[11px] font-medium leading-snug text-foreground">
                      {lever.tagline}
                    </p>
                    <p className="text-[11px] leading-relaxed text-muted-foreground">
                      {lever.description}
                    </p>
                  </article>
                );
              })}
            </div>

            <div className="flex flex-col gap-1 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-destructive">
                Never do
              </p>
              <ul className="flex flex-col gap-0.5 text-[11px] text-foreground">
                {NEVER_DO.map((n) => (
                  <li key={n.title}>
                    <span className="font-semibold">{n.title}.</span>{" "}
                    <span className="text-muted-foreground">{n.detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
