"use client";

import {
  AlertTriangle,
  Briefcase,
  Building2,
  ChevronDown,
  ChevronUp,
  Target,
  Users,
  Wrench,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { OptionGroup } from "@/components/ui/option-group";
import { ladderIcp } from "@/data/icp";
import { cn } from "@/lib/utils";

export function IcpDefinition() {
  const [open, setOpen] = useState(true);
  const [focus, setFocus] = useState<"both" | "smarthire" | "smartterritory">(
    "both",
  );

  const problem =
    focus === "smarthire"
      ? ladderIcp.oneProblem.smarthire
      : focus === "smartterritory"
        ? ladderIcp.oneProblem.smartterritory
        : `${ladderIcp.oneProblem.smarthire} And — ${ladderIcp.oneProblem.smartterritory}`;

  return (
    <section
      aria-label="Ladder ICP definition"
      className="overflow-hidden rounded-lg border border-border bg-card"
    >
      <header className="flex items-start justify-between gap-4 border-b border-border bg-muted/20 px-5 py-4">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="font-mono uppercase">
              ICP
            </Badge>
            <Badge variant="muted" className="font-mono">
              {ladderIcp.product}
            </Badge>
          </div>
          <h2 className="text-base font-semibold tracking-tight">
            {ladderIcp.label}
          </h2>
          <p className="text-xs italic text-muted-foreground">
            {ladderIcp.tagline}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-8 items-center gap-1.5 rounded-md border border-border bg-background px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground"
          aria-expanded={open}
        >
          {open ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Show ICP
            </>
          )}
        </button>
      </header>

      {open ? (
        <div className="flex flex-col gap-5 p-5">
          <OptionGroup<"both" | "smarthire" | "smartterritory">
            label="Product focus"
            help={
              <div className="flex flex-col gap-1.5">
                <strong className="text-foreground">
                  Which Ladder product is this prospect for?
                </strong>
                <span className="text-muted-foreground">
                  Switching focus reframes the ONE-problem statement and the
                  trigger events below. Use{" "}
                  <strong className="text-foreground">SmartHire</strong> for
                  rep-recruiting / washout pain,{" "}
                  <strong className="text-foreground">SmartTerritory</strong>{" "}
                  for canvass and routing pain. Pick{" "}
                  <strong className="text-foreground">Both</strong> when the
                  account fits cleanly for either or you don&apos;t know yet.
                </span>
              </div>
            }
            value={focus}
            onChange={setFocus}
            options={[
              { value: "both", label: "Both products" },
              { value: "smarthire", label: "SmartHire focus" },
              { value: "smartterritory", label: "SmartTerritory focus" },
            ]}
          />

          <div className="rounded-md border border-primary/30 bg-primary/5 p-4">
            <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
              <Target className="h-3.5 w-3.5" />
              The ONE problem we solve
            </div>
            <p className="mt-2 text-sm leading-relaxed">{problem}</p>
          </div>

          <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
            <IcpBlock icon={Building2} label="Company profile">
              <DefRow k="Headcount" v={ladderIcp.headcount} />
              <DefRow k="Revenue" v={ladderIcp.revenue} />
              <DefRow k="Growth stage" v={ladderIcp.growthStage} wrap />
            </IcpBlock>

            <IcpBlock icon={Users} label="Buyer personas">
              <ul className="flex flex-col gap-1 text-sm">
                {ladderIcp.buyerPersonas.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {p}
                  </li>
                ))}
              </ul>
            </IcpBlock>

            <IcpBlock icon={Wrench} label="Services they run">
              <ul className="flex flex-col gap-1 text-sm">
                {ladderIcp.services.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <span className="h-1 w-1 rounded-full bg-muted-foreground" />
                    {p}
                  </li>
                ))}
              </ul>
            </IcpBlock>

            <IcpBlock icon={Briefcase} label="Tech stack signals">
              <ul className="flex flex-col gap-1 text-sm">
                {ladderIcp.techStackSignals.map((p) => (
                  <li key={p} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                    <span className="leading-snug">{p}</span>
                  </li>
                ))}
              </ul>
            </IcpBlock>
          </div>

          <IcpBlock icon={Zap} label="Trigger events (buy in next 90 days)">
            <ul className="flex flex-col gap-1.5 text-sm">
              {ladderIcp.triggerEvents.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span className="leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </IcpBlock>

          <IcpBlock
            icon={AlertTriangle}
            label="Disqualifiers (do not research)"
            tone="warning"
          >
            <ul className="flex flex-col gap-1.5 text-sm">
              {ladderIcp.disqualifiers.map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-hot" />
                  <span className="leading-snug">{p}</span>
                </li>
              ))}
            </ul>
          </IcpBlock>
        </div>
      ) : null}
    </section>
  );
}

function IcpBlock({
  icon: Icon,
  label,
  tone = "default",
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tone?: "default" | "warning";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2.5 rounded-md border p-4",
        tone === "warning"
          ? "border-hot/30 bg-hot/5"
          : "border-border bg-background",
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider",
          tone === "warning" ? "text-hot" : "text-muted-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div>{children}</div>
    </div>
  );
}

function DefRow({
  k,
  v,
  wrap = false,
}: {
  k: string;
  v: string;
  wrap?: boolean;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-3 text-sm",
        wrap
          ? "grid-cols-1 gap-y-0.5"
          : "grid-cols-[auto_1fr] items-baseline",
      )}
    >
      <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        {k}
      </span>
      <span className={cn("font-medium", !wrap && "text-right")}>{v}</span>
    </div>
  );
}
