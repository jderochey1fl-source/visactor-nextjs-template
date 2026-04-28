import { Calculator, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { ActivityFeed } from "@/components/command-center/activity-feed";
import { CallPrepHypothesis } from "@/components/command-center/call-prep-hypothesis";
import { DemoBanner } from "@/components/command-center/demo-banner";
import { FunnelCalculators } from "@/components/command-center/funnel-calculators";
import { KpiGrid } from "@/components/command-center/kpi-grid";
import { LadderFunnel } from "@/components/command-center/ladder-funnel";
import { NextActions } from "@/components/command-center/next-actions";
import { RevenueChart } from "@/components/command-center/revenue-chart";
import { StageVelocity } from "@/components/command-center/stage-velocity";
import Container from "@/components/container";

export default function CommandCenterPage() {
  return (
    <div>
      <DemoBanner />
      <KpiGrid />

      <Container className="grid grid-cols-1 gap-6 border-b border-border py-6 laptop:grid-cols-3">
        <section className="laptop:col-span-2">
          <LadderFunnel />
        </section>
        <section className="laptop:col-span-1">
          <StageVelocity />
        </section>
      </Container>

      {/* Flagship tools anchor strip — pulls the eye straight to the two
          highest-leverage sections on the page (Outbound Math + Call Prep). */}
      <Container className="border-b border-border py-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-hot/40 bg-hot/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-hot">
            <Sparkles className="h-3 w-3" aria-hidden="true" />
            Flagship Toolkits
          </span>
          <Link
            href="#outbound-math"
            className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-hot/40 hover:bg-hot/5 hover:text-hot"
          >
            <Calculator className="h-4 w-4 text-hot" aria-hidden="true" />
            Outbound Math Toolkit
          </Link>
          <Link
            href="#call-prep-hypothesis"
            className="group inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-semibold text-foreground transition-colors hover:border-hot/40 hover:bg-hot/5 hover:text-hot"
          >
            <Target className="h-4 w-4 text-hot" aria-hidden="true" />
            Call Prep Hypothesis
          </Link>
          <span className="text-xs text-muted-foreground">
            Two diagnostics that earn the meeting before you hit send.
          </span>
        </div>
      </Container>

      <Container
        id="outbound-math"
        className="border-b border-border bg-muted/30 py-8 scroll-mt-16"
      >
        <FunnelCalculators />
      </Container>

      <Container className="border-b border-border py-8">
        <CallPrepHypothesis />
      </Container>

      <Container className="grid grid-cols-1 gap-6 border-b border-border py-6 laptop:grid-cols-3">
        <section className="flex flex-col rounded-lg border border-border bg-card p-5 laptop:col-span-2">
          <RevenueChart />
        </section>
        <section className="flex flex-col rounded-lg border border-border bg-card p-5 laptop:col-span-1">
          <NextActions />
        </section>
      </Container>

      <Container className="py-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <ActivityFeed />
        </section>
      </Container>
    </div>
  );
}
