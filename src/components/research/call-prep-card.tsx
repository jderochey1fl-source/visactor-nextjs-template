"use client";

import {
  AlertTriangle,
  ArrowRight,
  Building,
  CloudLightning,
  Copy,
  DollarSign,
  MessageSquareQuote,
  RefreshCw,
  Target,
  UserCircle,
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
              {result.prospect.name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {result.prospect.address}
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
          icon={Building}
          label="Property"
          accent="primary"
          rows={[
            ["Year built (est.)", String(result.propertyIntel.estYearBuilt)],
            [
              "Roof age (est.)",
              `${result.propertyIntel.estRoofAge} yrs`,
            ],
            ["Sqft", result.propertyIntel.sqft.toLocaleString()],
            ["Material", result.propertyIntel.material],
            ["Pitch", result.propertyIntel.pitch],
          ]}
        />
        <IntelCard
          icon={CloudLightning}
          label="Storm history"
          accent="hot"
          rows={[
            ["Last event", result.stormHistory.lastMajorEvent],
            ["Hail max", result.stormHistory.hailMaxSize],
            ["Wind peak", result.stormHistory.windPeak],
            [
              "Claim likelihood",
              `${Math.round(result.stormHistory.claimLikelihood * 100)}%`,
            ],
          ]}
        />
        <IntelCard
          icon={UserCircle}
          label="Owner profile"
          accent="success"
          rows={[
            ["Persona", result.ownerProfile.likelyPersona],
            ["Tenure", `${result.ownerProfile.tenureYears} yrs`],
            ["Income", result.ownerProfile.incomeBracket],
            [
              "Priorities",
              result.ownerProfile.priorities.slice(0, 2).join(" · "),
            ],
          ]}
        />
        <IntelCard
          icon={Target}
          label="Competitive"
          accent="warning"
          rows={[
            [
              "Recent quotes",
              result.competitive.recentlyQuotedBy.join(", "),
            ],
            [
              "Nbhd installs",
              `${result.competitive.neighborhoodInstalls} in 90d`,
            ],
            ["Dominant material", result.competitive.dominantMaterial],
          ]}
        />
      </div>

      {/* Tactical */}
      <div className="grid grid-cols-1 gap-4 laptop:grid-cols-3">
        <SectionCard
          icon={Target}
          title="Priority points"
          accent="primary"
        >
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
          <SectionCard icon={DollarSign} title="Pricing anchor" accent="success">
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
  lines.push(`CALL PREP — ${r.prospect.name} (${r.prospect.address})`);
  lines.push("");
  lines.push(`OPENING LINE:\n${r.callPrep.openingLine}`);
  lines.push("");
  lines.push("PROPERTY:");
  lines.push(
    `- Built ${r.propertyIntel.estYearBuilt}, roof est. ${r.propertyIntel.estRoofAge} yrs, ${r.propertyIntel.sqft} sqft, ${r.propertyIntel.material}, ${r.propertyIntel.pitch}`,
  );
  lines.push("STORM:");
  lines.push(
    `- ${r.stormHistory.lastMajorEvent} | hail ${r.stormHistory.hailMaxSize} | wind ${r.stormHistory.windPeak} | claim likelihood ${Math.round(r.stormHistory.claimLikelihood * 100)}%`,
  );
  lines.push("OWNER:");
  lines.push(
    `- ${r.ownerProfile.likelyPersona} | ${r.ownerProfile.tenureYears}y | ${r.ownerProfile.incomeBracket}`,
  );
  lines.push(`- Priorities: ${r.ownerProfile.priorities.join("; ")}`);
  lines.push("COMPETITIVE:");
  lines.push(
    `- Quoted by: ${r.competitive.recentlyQuotedBy.join(", ")} | ${r.competitive.neighborhoodInstalls} nbhd installs | ${r.competitive.dominantMaterial}`,
  );
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
