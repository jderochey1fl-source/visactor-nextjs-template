import { Calculator, Sparkles, Target } from "lucide-react";
import Link from "next/link";

import { CallPrepHypothesis } from "@/components/command-center/call-prep-hypothesis";
import { DemoBanner } from "@/components/command-center/demo-banner";
import { FunnelCalculators } from "@/components/command-center/funnel-calculators";
import { KpiGrid } from "@/components/command-center/kpi-grid";
import { MyLast7Days } from "@/components/command-center/my-last-7-days";
import { SkillsHeatmap } from "@/components/command-center/skills-heatmap";
import { TodaysDrill } from "@/components/command-center/todays-drill";
import Container from "@/components/container";

export default function CommandCenterPage() {
  return (
    <div>
      <DemoBanner />
      <KpiGrid />

      {/* Coaching cockpit hierarchy:
          1) MyLast7Days  — what the rep actually did this week
          2) SkillsHeatmap + TodaysDrill — where they're sharp / cold + the AI's
             one-click answer to the biggest gap.
          Replaces the old LadderFunnel/StageVelocity/RevenueChart/NextActions/
          ActivityFeed pipeline cluster. Those components still exist for the
          /deals route; they just don't belong on the home page where they
          mis-position ASCEND as a CRM. */}
      <Container className="border-b border-border py-6">
        <MyLast7Days />
      </Container>

      <Container className="grid grid-cols-1 gap-6 border-b border-border py-6 laptop:grid-cols-3">
        <section className="laptop:col-span-2">
          <SkillsHeatmap />
        </section>
        <section className="laptop:col-span-1">
          <TodaysDrill />
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

      <Container className="py-8">
        <CallPrepHypothesis />
      </Container>
    </div>
  );
}
