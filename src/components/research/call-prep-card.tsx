"use client";

import {
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building2,
  Copy,
  DollarSign,
  Map,
  MessageSquareQuote,
  RefreshCw,
  Target,
  Users,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ResearchResult } from "@/types/types";

export function CallPrepCard({
  result,
  onReset,
}: {
  result: ResearchResult;
  onReset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const text = buildTextReport(result);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // no-op
    }
  };

  const contact =
    result.prospect.contactName && result.prospect.contactTitle
      ? `${result.prospect.contactName} · ${result.prospect.contactTitle}`
      : result.prospect.contactName ?? null;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="font-mono uppercase">
                Call Prep Card
              </Badge>
              <Badge variant="muted" className="font-mono">
                CPC-{Math.floor(Math.random() * 9000 + 1000)}
              </Badge>
            </div>
            <h2 className="text-xl font-semibold tracking-tight">
              {result.prospect.companyName}
            </h2>
            <p className="text-sm text-muted-foreground">
              {result.prospect.hqCity}, {result.prospect.hqState}
              {result.prospect.website ? ` · ${result.prospect.website}` : ""}
              {contact ? ` · ${contact}` : ""}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copy}>
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied" : "Copy"}
            </Button>
            <Button variant="outline" size="sm" onClick={onReset}>
              <RefreshCw className="h-3.5 w-3.5" />
              New
            </Button>
          </div>
        </div>

        <div className="rounded-md border border-primary/20 bg-background/70 p-4">
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-primary">
            <MessageSquareQuote className="h-3.5 w-3.5" />
            Opening line
          </div>
          <p className="mt-2 text-base font-medium leading-relaxed">
            &ldquo;{result.callPrep.openingLine}&rdquo;
          </p>
        </div>
      </div>

      {/* Intel grid */}
      <div className="grid grid-cols-1 gap-4 tablet:grid-cols-2">
        <IntelCard
          icon={Building2}
          label="Company"
          accent="primary"
          rows={[
            ["Headcount", result.companyIntel.estHeadcount],
            ["Revenue (est.)", result.companyIntel.estRevenue],
            ["Years active", `${result.companyIntel.yearsActive} yrs`],
            ["Motion", result.companyIntel.primaryMotion],
            ["States", result.companyIntel.statesServed.join(", ")],
          ]}
        />
        <IntelCard
          icon={Users}
          label="Sales motion"
          accent="hot"
          rows={[
            [
              "Canvassing",
              result.salesMotion.canvassingActive ? "Active" : "Inactive",
            ],
            ["Rep count", result.salesMotion.estSalesReps],
            ["Channel", result.salesMotion.dominantChannel],
            ["Tech stack", result.salesMotion.techStack.join(", ")],
            ["Retention", result.salesMotion.retentionSignal],
          ]}
        />
        <IntelCard
          icon={Briefcase}
          label="Hiring signals"
          accent="success"
          rows={[
            [
              "Open roles",
              `${result.hiringSignals.openRolesCount} live`,
            ],
            [
              "Recent roles",
              result.hiringSignals.recentRoles.join(" · "),
            ],
            ["Job boards", result.hiringSignals.jobBoards.join(", ")],
            ["Churn signal", result.hiringSignals.recentHireChurn],
          ]}
        />
        <IntelCard
          icon={Map}
          label="Territory & storms"
          accent="warning"
          rows={[
            ["Primary metro", result.territorySignals.primaryMetro],
            ["Storm window", result.territorySignals.stormWindow],
            [
              "Closed-deal density",
              result.territorySignals.closedDealDensity,
            ],
            [
              "Competitors",
              result.territorySignals.keyCompetitors.join(", "),
            ],
            ["Knock waste", result.territorySignals.knockWasteSignal],
          ]}
        />
      </div>

      {/* Tactical */}
      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-3">
        <SectionCard icon={Target} title="Priority points" accent="primary">
          <ol className="flex flex-col gap-2">
            {result.callPrep.priorityPoints.map((p, i) => (
              <li key={p} className="flex gap-2">
                <span className="mt-0.5 font-mono text-xs font-bold text-primary">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-sm leading-relaxed">{p}</span>
              </li>
            ))}
          </ol>
        </SectionCard>

        <SectionCard
          icon={AlertTriangle}
          title="Likely objections"
          accent="hot"
        >
          <ul className="flex flex-col gap-2">
            {result.callPrep.likelyObjections.map((o) => (
              <li
                key={o}
                className="rounded-md border border-border bg-background px-3 py-2 text-sm leading-snug"
              >
                {o}
              </li>
            ))}
          </ul>
        </SectionCard>

        <div className="flex flex-col gap-4">
          <SectionCard
            icon={DollarSign}
            title="Pricing anchor"
            accent="success"
          >
            <p className="text-sm leading-relaxed">
              {result.callPrep.pricingAnchor}
            </p>
          </SectionCard>
          <SectionCard icon={ArrowRight} title="Next step" accent="warning">
            <p className="text-sm font-medium leading-relaxed">
              {result.callPrep.nextStep}
            </p>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

function IntelCard({
  icon: Icon,
  label,
  accent,
  rows,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  accent: "primary" | "hot" | "success" | "warning";
  rows: [string, string][];
}) {
  const accentBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    hot: "bg-hot/10 text-hot",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md ${accentBg[accent]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              {k}
            </dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  accent,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  accent: "primary" | "hot" | "success" | "warning";
  children: React.ReactNode;
}) {
  const accentBg: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    hot: "bg-hot/10 text-hot",
    success: "bg-success/10 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <span
          className={`flex h-7 w-7 items-center justify-center rounded-md ${accentBg[accent]}`}
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div>{children}</div>
    </div>
  );
}

function buildTextReport(r: ResearchResult) {
  const lines: string[] = [];
  const contact =
    r.prospect.contactName && r.prospect.contactTitle
      ? `${r.prospect.contactName} (${r.prospect.contactTitle})`
      : r.prospect.contactName ?? "";
  lines.push(
    `CALL PREP — ${r.prospect.companyName} · ${r.prospect.hqCity}, ${r.prospect.hqState}${
      contact ? ` · ${contact}` : ""
    }`,
  );
  lines.push("");
  lines.push(`OPENING LINE:\n${r.callPrep.openingLine}`);
  lines.push("");
  lines.push("COMPANY:");
  lines.push(
    `- ${r.companyIntel.estHeadcount} | ${r.companyIntel.estRevenue} | ${r.companyIntel.yearsActive} yrs | ${r.companyIntel.primaryMotion} | ${r.companyIntel.statesServed.join(", ")}`,
  );
  lines.push("SALES MOTION:");
  lines.push(
    `- Canvassing ${r.salesMotion.canvassingActive ? "ACTIVE" : "inactive"} | ${r.salesMotion.estSalesReps} | ${r.salesMotion.dominantChannel}`,
  );
  lines.push(`- Tech stack: ${r.salesMotion.techStack.join(", ")}`);
  lines.push(`- Retention: ${r.salesMotion.retentionSignal}`);
  lines.push("HIRING SIGNALS:");
  lines.push(
    `- ${r.hiringSignals.openRolesCount} open | roles: ${r.hiringSignals.recentRoles.join(", ")} | boards: ${r.hiringSignals.jobBoards.join(", ")}`,
  );
  lines.push(`- Churn: ${r.hiringSignals.recentHireChurn}`);
  lines.push("TERRITORY & STORMS:");
  lines.push(
    `- ${r.territorySignals.primaryMetro} | ${r.territorySignals.stormWindow}`,
  );
  lines.push(`- Closed-deal density: ${r.territorySignals.closedDealDensity}`);
  lines.push(
    `- Competitors: ${r.territorySignals.keyCompetitors.join(", ")}`,
  );
  lines.push(`- Knock waste: ${r.territorySignals.knockWasteSignal}`);
  lines.push("");
  lines.push("PRIORITY POINTS:");
  r.callPrep.priorityPoints.forEach((p, i) =>
    lines.push(`${i + 1}. ${p}`),
  );
  lines.push("");
  lines.push("LIKELY OBJECTIONS:");
  r.callPrep.likelyObjections.forEach((o) => lines.push(`- ${o}`));
  lines.push("");
  lines.push(`PRICING ANCHOR: ${r.callPrep.pricingAnchor}`);
  lines.push(`NEXT STEP: ${r.callPrep.nextStep}`);
  return lines.join("\n");
}
