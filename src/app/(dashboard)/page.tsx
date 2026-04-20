import { ActivityFeed } from "@/components/command-center/activity-feed";
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
      <KpiGrid />

      <Container className="grid grid-cols-1 gap-6 border-b border-border py-6 laptop:grid-cols-3">
        <section className="laptop:col-span-2">
          <LadderFunnel />
        </section>
        <section className="laptop:col-span-1">
          <StageVelocity />
        </section>
      </Container>

      <Container className="grid grid-cols-1 gap-6 border-b border-border py-6 laptop:grid-cols-3">
        <section className="flex flex-col rounded-lg border border-border bg-card p-5 laptop:col-span-2">
          <RevenueChart />
        </section>
        <section className="flex flex-col rounded-lg border border-border bg-card p-5 laptop:col-span-1">
          <NextActions />
        </section>
      </Container>

      <Container
        id="outbound-math"
        className="border-b border-border bg-muted/30 py-6 scroll-mt-16"
      >
        <FunnelCalculators />
      </Container>

      <Container className="py-6">
        <section className="rounded-lg border border-border bg-card p-5">
          <ActivityFeed />
        </section>
      </Container>
    </div>
  );
}
