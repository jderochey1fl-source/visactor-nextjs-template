"use client";

import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  Clock,
  MapPin,
  Phone,
  Mail,
  Tag,
  User,
  X,
  Activity,
} from "lucide-react";
import type { Deal } from "@/types/types";
import { ladderStages, stageByKey } from "@/data/ladder";
import { activity } from "@/data/deals";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const currency = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function DealDrawer({
  deal,
  open,
  onClose,
}: {
  deal: Deal | null;
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open, onClose]);

  if (!deal) return null;

  const stage = stageByKey[deal.stage];
  const stageIdx = ladderStages.findIndex((s) => s.key === deal.stage);
  const nextStage = ladderStages[stageIdx + 1];
  const dealActivity = activity.filter((a) => a.dealId === deal.id);
  const healthTone =
    deal.health >= 70
      ? "text-success"
      : deal.health >= 45
        ? "text-warning"
        : "text-destructive";
  const healthBar =
    deal.health >= 70
      ? "bg-success"
      : deal.health >= 45
        ? "bg-warning"
        : "bg-destructive";

  return (
    <div
      className={cn(
        "fixed inset-0 z-50",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity",
          open ? "opacity-100" : "opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-label={`Deal ${deal.prospect.name}`}
        className={cn(
          "absolute right-0 top-0 flex h-full w-full max-w-xl flex-col border-l border-border bg-card shadow-2xl transition-transform",
          open ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-start justify-between gap-3 border-b border-border p-5">
          <div className="flex min-w-0 flex-col gap-2">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="font-mono uppercase tracking-wider">
                {stage.letter} — {stage.name}
              </Badge>
              <Badge variant="muted" className="font-mono">
                {deal.id}
              </Badge>
              <Badge
                variant={
                  deal.prospect.productFocus === "both"
                    ? "default"
                    : deal.prospect.productFocus === "smarthire"
                      ? "secondary"
                      : "warning"
                }
              >
                {deal.prospect.productFocus === "both"
                  ? "SmartHire + SmartTerritory"
                  : deal.prospect.productFocus === "smarthire"
                    ? "SmartHire"
                    : "SmartTerritory"}
              </Badge>
            </div>
            <h2 className="truncate text-xl font-semibold tracking-tight">
              {deal.prospect.name}
            </h2>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {deal.prospect.contactName ? (
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  {deal.prospect.contactName}
                  {deal.prospect.contactTitle
                    ? `, ${deal.prospect.contactTitle}`
                    : null}
                </span>
              ) : null}
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {deal.prospect.city}, {deal.prospect.state}
              </span>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-3 gap-3">
            <Stat label="Value" value={currency(deal.value)} />
            <Stat label="Days in stage" value={`${deal.daysInStage}d`} />
            <Stat
              label="Health"
              value={deal.health.toString()}
              tone={healthTone}
            />
          </div>

          <div className="mt-3">
            <Progress value={deal.health} indicatorClassName={healthBar} />
          </div>

          <Separator className="my-5" />

          <Section icon={<ArrowRight className="h-4 w-4 text-primary" />} title="Next Action">
            <div className="rounded-md border border-primary/30 bg-primary/5 p-3">
              <p className="text-sm font-medium leading-snug">
                {deal.nextAction}
              </p>
              <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                <span className="font-mono">Due {deal.nextActionDue}</span>
                {nextStage ? (
                  <span className="font-mono uppercase tracking-wider">
                    next → {nextStage.letter} {nextStage.shortName}
                  </span>
                ) : null}
              </div>
            </div>
          </Section>

          <Section icon={<User className="h-4 w-4 text-muted-foreground" />} title="Prospect">
            <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Source
              </dt>
              <dd className="capitalize">{deal.prospect.source}</dd>
              {deal.prospect.phone ? (
                <>
                  <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Phone className="h-3 w-3" /> Phone
                  </dt>
                  <dd>{deal.prospect.phone}</dd>
                </>
              ) : null}
              {deal.prospect.email ? (
                <>
                  <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    <Mail className="h-3 w-3" /> Email
                  </dt>
                  <dd className="truncate">{deal.prospect.email}</dd>
                </>
              ) : null}
              <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                Owner
              </dt>
              <dd>{deal.owner}</dd>
              <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" /> Opened
              </dt>
              <dd>{deal.openedAt}</dd>
              <dt className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                <Clock className="h-3 w-3" /> Last touch
              </dt>
              <dd>{deal.lastTouchAt}</dd>
            </dl>
          </Section>

          <Section
            icon={<AlertTriangle className="h-4 w-4 text-muted-foreground" />}
            title="Notes"
          >
            <p className="rounded-md border border-border bg-muted/30 p-3 text-sm leading-relaxed text-foreground/90">
              {deal.notes}
            </p>
          </Section>

          {deal.tags.length > 0 ? (
            <Section
              icon={<Tag className="h-4 w-4 text-muted-foreground" />}
              title="Tags"
            >
              <div className="flex flex-wrap gap-1.5">
                {deal.tags.map((t) => (
                  <Badge key={t} variant="outline" className="font-mono">
                    {t}
                  </Badge>
                ))}
              </div>
            </Section>
          ) : null}

          <Section
            icon={<Activity className="h-4 w-4 text-muted-foreground" />}
            title="Activity"
          >
            {dealActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No activity yet for this deal.
              </p>
            ) : (
              <ol className="flex flex-col gap-3">
                {dealActivity.map((a, i) => {
                  const moveLabel =
                    a.type === "stage_move" && a.from && a.to
                      ? `${stageByKey[a.from].name} → ${stageByKey[a.to].name}`
                      : null;
                  return (
                    <li key={a.id} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <span className="mt-1 h-2 w-2 rounded-full bg-primary" />
                        {i < dealActivity.length - 1 ? (
                          <span className="mt-1 h-full w-px bg-border" />
                        ) : null}
                      </div>
                      <div className="flex flex-1 flex-col gap-1 pb-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-medium capitalize">
                            {a.type.replace("_", " ")}
                          </span>
                          {moveLabel ? (
                            <span className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]">
                              {moveLabel}
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {a.message}
                        </p>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <span>{a.owner}</span>
                          <span className="text-border">·</span>
                          <span className="font-mono">{relativeTime(a.at)}</span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>
        </div>

        <footer className="flex gap-2 border-t border-border p-4">
          <Button variant="outline" className="flex-1">
            Log activity
          </Button>
          <Button className="flex-1">
            {nextStage
              ? `Advance to ${nextStage.shortName}`
              : "Mark won"}
          </Button>
        </footer>
      </aside>
    </div>
  );
}

function Stat({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-md border border-border bg-muted/20 p-3">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className={cn("font-mono text-lg font-semibold", tone)}>
        {value}
      </span>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-5 flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}
