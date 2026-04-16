"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  MessageSquare,
  Target,
  X,
} from "lucide-react";
import type { Deal } from "@/types/types";
import { ladderStages } from "@/data/ladder";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

interface Props {
  deal: Deal | null;
  open: boolean;
  onClose: () => void;
}

export function DealDrawer({ deal, open, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!deal) return null;

  const stage = ladderStages.find((s) => s.id === deal.stage);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 transition",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        className={cn(
          "absolute inset-0 bg-foreground/20 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
        onClick={onClose}
      />
      <aside
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col bg-card shadow-xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
        role="dialog"
        aria-label={`Deal: ${deal.company}`}
      >
        <header className="flex items-start justify-between gap-4 border-b border-border p-6">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              <span>{deal.company}</span>
              <span className="font-mono">·</span>
              <span>{deal.industry}</span>
            </div>
            <h2 className="truncate font-serif text-2xl font-semibold tracking-tight text-foreground">
              {deal.contact}
            </h2>
            <p className="truncate text-sm text-muted-foreground">
              {deal.title}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close drawer"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-3 gap-4">
            <Stat label="Value" value={currency(deal.value)} />
            <Stat label="Stage" value={stage?.letter ?? "-"} />
            <Stat label="Days" value={`${deal.daysInStage}d`} />
          </div>

          <Separator className="my-6" />

          <section className="flex flex-col gap-3">
            <SectionHeader
              icon={<Target className="h-4 w-4" />}
              title="Current LADDER Stage"
            />
            <div className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded bg-accent/15 font-mono text-sm font-semibold text-accent">
                  {stage?.letter}
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {stage?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {stage?.description}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {deal.blockers.length > 0 && (
            <section className="mt-6 flex flex-col gap-3">
              <SectionHeader
                icon={<AlertTriangle className="h-4 w-4 text-destructive" />}
                title="Blockers"
              />
              <ul className="flex flex-col gap-2">
                {deal.blockers.map((b, i) => (
                  <li
                    key={i}
                    className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-foreground"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="mt-6 flex flex-col gap-3">
            <SectionHeader
              icon={<CheckCircle2 className="h-4 w-4 text-accent" />}
              title="Next Actions"
            />
            <ul className="flex flex-col gap-2">
              {deal.nextActions.map((a, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg border border-border bg-card p-3 text-sm text-foreground"
                >
                  <span className="mt-1 h-1.5 w-1.5 flex-none rounded-full bg-accent" />
                  <span>{a}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-6 flex flex-col gap-3">
            <SectionHeader
              icon={<MessageSquare className="h-4 w-4 text-primary" />}
              title="Activity Log"
            />
            <ol className="flex flex-col gap-3">
              {deal.activity.map((a, i) => (
                <li key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    {i < deal.activity.length - 1 && (
                      <span className="mt-1 h-full w-px bg-border" />
                    )}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-foreground">
                        {a.type}
                      </p>
                      <span className="font-mono text-xs text-muted-foreground">
                        {a.date}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {a.note}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-6 flex flex-col gap-3">
            <SectionHeader title="Products" />
            <div className="flex flex-wrap gap-2">
              {deal.products.map((p) => (
                <Badge key={p} variant="secondary">
                  {p}
                </Badge>
              ))}
            </div>
          </section>
        </div>

        <footer className="border-t border-border p-4">
          <Button variant="default" className="w-full">
            Move to next LADDER stage
          </Button>
        </footer>
      </aside>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-muted/30 p-3">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-mono text-lg font-semibold text-foreground">
        {value}
      </span>
    </div>
  );
}

function SectionHeader({
  icon,
  title,
}: {
  icon?: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {title}
      </h3>
    </div>
  );
}
