import { Building2, CloudRain, Globe, MapPin, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Account } from "@/data/trigger-hunter-mock";
import { DecisionMakers } from "./decision-makers";
import { RecommendedPlay } from "./recommended-play";
import { ScoreBreakdown } from "./score-breakdown";
import { SignalTimeline } from "./signal-timeline";

export function AccountDetail({ account }: { account: Account }) {
  const tempVariant: Record<Account["temperature"], "hot" | "warning" | "muted"> =
    {
      hot: "hot",
      warm: "warning",
      cool: "muted",
    };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Building2 className="h-5 w-5 shrink-0" />
                <span className="truncate">{account.name}</span>
                <Badge variant={tempVariant[account.temperature]}>
                  {account.temperature.toUpperCase()}
                </Badge>
              </CardTitle>
              <div className="mt-2 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  {account.domain}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {account.city}, {account.state}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {account.employeeCount} employees
                </span>
                <span className="font-mono uppercase tracking-wider">
                  Tier {account.crmTier}
                </span>
              </div>
            </div>

            <div className="text-right">
              <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Composite score
              </div>
              <div className="text-3xl font-semibold tabular-nums leading-none">
                {account.compositeScore}
              </div>
              <div className="mt-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                {account.scoreDelta >= 0 ? "+" : ""}
                {account.scoreDelta} · 7d
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScoreBreakdown subscores={account.subscores} />
        </CardContent>
      </Card>

      <RecommendedPlay account={account} />

      {account.storm && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CloudRain className="h-4 w-4" />
              Most recent storm
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
              <Stat label="Date" value={account.storm.lastEventDate} />
              <Stat
                label="Hail"
                value={
                  account.storm.hailSizeInches > 0
                    ? `${account.storm.hailSizeInches}"`
                    : "wind only"
                }
              />
              <Stat
                label="EH radius"
                value={`${account.storm.ehImpactRadius} mi`}
              />
              <Stat
                label="Counties"
                value={account.storm.countiesAffected.join(", ")}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiring momentum</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 tablet:grid-cols-4">
            <Stat label="New reps · 30d" value={account.hiring.newReps30d} />
            <Stat label="New reps · 90d" value={account.hiring.newReps90d} />
            <Stat
              label="Open canvasser ads"
              value={account.hiring.openCanvasserPostings}
            />
            <Stat label="Velocity" value={account.hiring.velocity} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Signal timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <SignalTimeline signals={account.signals} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Decision makers</CardTitle>
        </CardHeader>
        <CardContent>
          <DecisionMakers contacts={account.decisionMakers} />
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-semibold capitalize">{value}</span>
    </div>
  );
}
