"use client";

import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  GitCompare,
  Mail,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------- */
/*  Benchmarks pulled from the LADDER outbound-math curriculum             */
/* ----------------------------------------------------------------------- */
const BENCH = {
  openRate: { good: 0.4, floor: 0.25 },
  replyRate: { good: 0.03, floor: 0.015 },
  replyToMeeting: { good: 0.6, floor: 0.35 },
  showRate: { good: 0.8, floor: 0.6 },
  wrongPerson: { ceiling: 0.1 }, // >10% of replies = bad list
};

/* ----------------------------------------------------------------------- */
/*  Root wrapper                                                           */
/* ----------------------------------------------------------------------- */
export function FunnelCalculators() {
  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <Calculator className="h-4 w-4 text-primary" />
            Outbound Math Toolkit
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Campaign diagnostics, reverse-goal math, and tier routing — all
            before you hit send.
          </p>
        </div>
      </header>

      <Tabs defaultValue="health">
        <TabsList>
          <TabsTrigger value="health">
            <span className="hidden phone:inline">Campaign Health</span>
            <span className="phone:hidden">Health</span>
          </TabsTrigger>
          <TabsTrigger value="goal">
            <span className="hidden phone:inline">Meeting Goal</span>
            <span className="phone:hidden">Goal</span>
          </TabsTrigger>
          <TabsTrigger value="compare">
            <span className="hidden phone:inline">Tier 1 vs Tier 3</span>
            <span className="phone:hidden">Tiers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health">
          <CampaignHealthCalc />
        </TabsContent>
        <TabsContent value="goal">
          <MeetingGoalCalc />
        </TabsContent>
        <TabsContent value="compare">
          <TierCompareCalc />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ======================================================================= */
/*  1) CAMPAIGN HEALTH                                                     */
/* ======================================================================= */
function CampaignHealthCalc() {
  const [sent, setSent] = useState(1500);
  const [opened, setOpened] = useState(525);
  const [replies, setReplies] = useState(23);
  const [interested, setInterested] = useState(8);
  const [wrongPerson, setWrongPerson] = useState(4);
  const [meetingsBooked, setMeetingsBooked] = useState(3);

  const safe = (n: number, d: number) => (d > 0 ? n / d : 0);

  const openRate = safe(opened, sent);
  const replyRate = safe(replies, sent);
  const replyToMeeting = safe(meetingsBooked, interested);
  const wrongPersonPct = safe(wrongPerson, replies);

  // Score each lever 0–25, total 100
  const scoreOpen = grade(openRate, BENCH.openRate.good, BENCH.openRate.floor);
  const scoreReply = grade(replyRate, BENCH.replyRate.good, BENCH.replyRate.floor);
  const scoreRTM = grade(
    replyToMeeting,
    BENCH.replyToMeeting.good,
    BENCH.replyToMeeting.floor,
  );
  const scoreList = invGrade(
    wrongPersonPct,
    BENCH.wrongPerson.ceiling,
    BENCH.wrongPerson.ceiling * 2,
  );
  const total = Math.round(
    scoreOpen * 25 + scoreReply * 25 + scoreRTM * 25 + scoreList * 25,
  );

  const verdict =
    total >= 80
      ? { label: "Healthy", tone: "success" as const }
      : total >= 55
        ? { label: "Needs tuning", tone: "warn" as const }
        : { label: "Critical", tone: "bad" as const };

  // Biggest lever to pull
  const levers = [
    { name: "Subject line / open rate", score: scoreOpen, delta: BENCH.openRate.good - openRate, fix: "Rewrite subject lines — test 3 variants." },
    { name: "Email body / reply rate", score: scoreReply, delta: BENCH.replyRate.good - replyRate, fix: "Rewrite body copy — clearer value prop, sharper CTA." },
    { name: "Reply handling / RTM conv", score: scoreRTM, delta: BENCH.replyToMeeting.good - replyToMeeting, fix: "Coach reply objection handling + booking links." },
    { name: "List quality", score: scoreList, delta: wrongPersonPct - BENCH.wrongPerson.ceiling, fix: "Tighten ICP filters — you're emailing the wrong seat." },
  ];
  const worst = [...levers].sort((a, b) => a.score - b.score)[0];

  return (
    <div className="grid grid-cols-1 gap-5 rounded-lg border border-border bg-card p-5 laptop:grid-cols-5">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 laptop:col-span-3">
        <NumberField label="Emails sent" value={sent} onChange={setSent} />
        <NumberField label="Opens" value={opened} onChange={setOpened} />
        <NumberField label="Total replies" value={replies} onChange={setReplies} />
        <NumberField label="Interested replies" value={interested} onChange={setInterested} />
        <NumberField label="Wrong-person replies" value={wrongPerson} onChange={setWrongPerson} />
        <NumberField label="Meetings booked" value={meetingsBooked} onChange={setMeetingsBooked} />
      </div>

      {/* Verdict */}
      <div className="flex flex-col gap-4 laptop:col-span-2">
        <div
          className={cn(
            "rounded-md border p-4",
            verdict.tone === "success" && "border-success/40 bg-success/10",
            verdict.tone === "warn" && "border-hot/40 bg-hot/10",
            verdict.tone === "bad" && "border-destructive/40 bg-destructive/10",
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Health score
            </span>
            <VerdictIcon tone={verdict.tone} />
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-4xl font-semibold text-foreground">
              {total}
            </span>
            <span className="text-sm text-muted-foreground">/ 100</span>
            <span
              className={cn(
                "ml-auto text-sm font-medium",
                verdict.tone === "success" && "text-success",
                verdict.tone === "warn" && "text-hot",
                verdict.tone === "bad" && "text-destructive",
              )}
            >
              {verdict.label}
            </span>
          </div>
          <Progress
            value={total}
            className="mt-3"
            indicatorClassName={cn(
              verdict.tone === "success" && "bg-success",
              verdict.tone === "warn" && "bg-hot",
              verdict.tone === "bad" && "bg-destructive",
            )}
          />
        </div>

        <div className="rounded-md border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <AlertTriangle className="h-3.5 w-3.5" />
            Biggest lever to pull
          </div>
          <p className="mt-1.5 text-sm font-semibold text-foreground">
            {worst.name}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{worst.fix}</p>
        </div>
      </div>

      {/* Rate readout */}
      <div className="grid grid-cols-2 gap-3 laptop:col-span-5 laptop:grid-cols-4">
        <RateRow
          label="Open rate"
          value={openRate}
          good={BENCH.openRate.good}
          floor={BENCH.openRate.floor}
        />
        <RateRow
          label="Reply rate"
          value={replyRate}
          good={BENCH.replyRate.good}
          floor={BENCH.replyRate.floor}
        />
        <RateRow
          label="Reply → meeting"
          value={replyToMeeting}
          good={BENCH.replyToMeeting.good}
          floor={BENCH.replyToMeeting.floor}
        />
        <RateRow
          label="Wrong person"
          value={wrongPersonPct}
          good={0}
          floor={BENCH.wrongPerson.ceiling}
          invert
        />
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  2) MEETING GOAL → EMAILS                                               */
/* ======================================================================= */
function MeetingGoalCalc() {
  const [meetings, setMeetings] = useState(15);
  const [replyRate, setReplyRate] = useState(2); // % — cold email positive reply
  const [replyToMeeting, setReplyToMeeting] = useState(40); // % — positive reply → booked
  const [showRate, setShowRate] = useState(80); // % — booked → held
  const [workingDays, setWorkingDays] = useState(20);
  const [capacity, setCapacity] = useState(75); // current emails/day

  const {
    booked,
    positiveReplies,
    emailsMonth,
    emailsDay,
  } = useMemo(() => {
    const rr = Math.max(replyRate, 0.01) / 100;
    const r2m = Math.max(replyToMeeting, 0.01) / 100;
    const sr = Math.max(showRate, 0.01) / 100;
    const booked = meetings / sr;
    const positiveReplies = booked / r2m;
    const emailsMonth = positiveReplies / rr;
    const emailsDay = emailsMonth / Math.max(workingDays, 1);
    return {
      booked: Math.ceil(booked),
      positiveReplies: Math.ceil(positiveReplies),
      emailsMonth: Math.ceil(emailsMonth),
      emailsDay: Math.ceil(emailsDay),
    };
  }, [meetings, replyRate, replyToMeeting, showRate, workingDays]);

  const gap = emailsDay - capacity;
  const feasible = gap <= 0;

  return (
    <div className="grid grid-cols-1 gap-5 rounded-lg border border-border bg-card p-5 laptop:grid-cols-5">
      {/* Inputs */}
      <div className="grid grid-cols-2 gap-3 laptop:col-span-3">
        <NumberField
          label="Meetings held / month"
          value={meetings}
          onChange={setMeetings}
        />
        <NumberField
          label="Working days"
          value={workingDays}
          onChange={setWorkingDays}
        />
        <NumberField
          label="Reply rate %"
          value={replyRate}
          onChange={setReplyRate}
          step={0.1}
          hint="Industry avg: 2%"
        />
        <NumberField
          label="Reply → meeting %"
          value={replyToMeeting}
          onChange={setReplyToMeeting}
          hint="Team avg: 40%"
        />
        <NumberField
          label="Show rate %"
          value={showRate}
          onChange={setShowRate}
          hint="Team avg: 80%"
        />
        <NumberField
          label="Current capacity / day"
          value={capacity}
          onChange={setCapacity}
        />
      </div>

      {/* Results */}
      <div className="flex flex-col gap-3 laptop:col-span-2">
        <ResultRow label="Meetings to book" value={booked} hint="÷ show rate" />
        <ResultRow
          label="Positive replies needed"
          value={positiveReplies}
          hint="÷ reply→meeting"
        />
        <ResultRow
          label="Emails / month"
          value={emailsMonth.toLocaleString()}
          hint="÷ reply rate"
        />
        <ResultRow
          label="Emails / day"
          value={emailsDay}
          emphasis
          hint={`÷ ${workingDays} days`}
        />

        <div
          className={cn(
            "mt-1 rounded-md border p-3 text-sm",
            feasible
              ? "border-success/40 bg-success/10 text-success"
              : "border-destructive/40 bg-destructive/10 text-destructive",
          )}
        >
          <div className="flex items-start gap-2">
            {feasible ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div className="text-foreground">
              {feasible ? (
                <>
                  <span className="font-semibold">Feasible.</span> You have{" "}
                  <span className="font-mono">{Math.abs(gap)}</span>{" "}
                  emails/day of headroom.
                </>
              ) : (
                <>
                  <span className="font-semibold">Not feasible at current capacity.</span>{" "}
                  Short by <span className="font-mono">{gap}</span> emails/day.
                  Improve reply rate, improve reply-to-meeting, or reset the
                  goal before launching.
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================================================= */
/*  3) TIER 1 vs TIER 3 — adjusted averages                                */
/* ======================================================================= */
function TierCompareCalc() {
  // Tier 1 — high-intent, slower, premium ACV
  const [t1Accounts, setT1Accounts] = useState(50);
  const [t1MeetingRate, setT1MeetingRate] = useState(8); // % meetings per account
  const [t1CloseRate, setT1CloseRate] = useState(25); // % close on meetings
  const [t1Acv, setT1Acv] = useState(45000);
  const [t1TouchHours, setT1TouchHours] = useState(2.5); // per account

  // Tier 3 — broad, automated, lower ACV
  const [t3Accounts, setT3Accounts] = useState(800);
  const [t3MeetingRate, setT3MeetingRate] = useState(1.2);
  const [t3CloseRate, setT3CloseRate] = useState(12);
  const [t3Acv, setT3Acv] = useState(9000);
  const [t3TouchHours, setT3TouchHours] = useState(0.15);

  const t1 = deriveTier(t1Accounts, t1MeetingRate, t1CloseRate, t1Acv, t1TouchHours);
  const t3 = deriveTier(t3Accounts, t3MeetingRate, t3CloseRate, t3Acv, t3TouchHours);

  const better = t1.revenuePerHour > t3.revenuePerHour ? "t1" : "t3";
  const lift =
    Math.max(t1.revenuePerHour, t3.revenuePerHour) /
      Math.max(Math.min(t1.revenuePerHour, t3.revenuePerHour), 1) -
    1;

  return (
    <div className="grid grid-cols-1 gap-5 rounded-lg border border-border bg-card p-5 laptop:grid-cols-5">
      <div className="laptop:col-span-2">
        <TierInputs
          label="Tier 1"
          tone="primary"
          accounts={t1Accounts}
          setAccounts={setT1Accounts}
          meetingRate={t1MeetingRate}
          setMeetingRate={setT1MeetingRate}
          closeRate={t1CloseRate}
          setCloseRate={setT1CloseRate}
          acv={t1Acv}
          setAcv={setT1Acv}
          touchHours={t1TouchHours}
          setTouchHours={setT1TouchHours}
        />
      </div>

      <div className="laptop:col-span-2">
        <TierInputs
          label="Tier 3"
          tone="hot"
          accounts={t3Accounts}
          setAccounts={setT3Accounts}
          meetingRate={t3MeetingRate}
          setMeetingRate={setT3MeetingRate}
          closeRate={t3CloseRate}
          setCloseRate={setT3CloseRate}
          acv={t3Acv}
          setAcv={setT3Acv}
          touchHours={t3TouchHours}
          setTouchHours={setT3TouchHours}
        />
      </div>

      {/* Verdict */}
      <div className="flex flex-col gap-3 laptop:col-span-1">
        <div
          className={cn(
            "rounded-md border p-4",
            better === "t1"
              ? "border-primary/40 bg-primary/10"
              : "border-hot/40 bg-hot/10",
          )}
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <GitCompare className="h-3.5 w-3.5" />
            Better route
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span
              className={cn(
                "font-mono text-3xl font-semibold",
                better === "t1" ? "text-primary" : "text-hot",
              )}
            >
              {better === "t1" ? "Tier 1" : "Tier 3"}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            +{(lift * 100).toFixed(0)}% revenue per sales hour
          </p>
        </div>

        <TierResult label="Tier 1" tone="primary" result={t1} winner={better === "t1"} />
        <TierResult label="Tier 3" tone="hot" result={t3} winner={better === "t3"} />
      </div>
    </div>
  );
}

function deriveTier(
  accounts: number,
  meetingRate: number,
  closeRate: number,
  acv: number,
  touchHours: number,
) {
  const meetings = accounts * (meetingRate / 100);
  const wins = meetings * (closeRate / 100);
  const revenue = wins * acv;
  const hours = accounts * touchHours;
  return {
    meetings,
    wins,
    revenue,
    hours,
    revenuePerHour: hours > 0 ? revenue / hours : 0,
    revenuePerAccount: accounts > 0 ? revenue / accounts : 0,
  };
}

function TierInputs({
  label,
  tone,
  accounts,
  setAccounts,
  meetingRate,
  setMeetingRate,
  closeRate,
  setCloseRate,
  acv,
  setAcv,
  touchHours,
  setTouchHours,
}: {
  label: string;
  tone: "primary" | "hot";
  accounts: number;
  setAccounts: (v: number) => void;
  meetingRate: number;
  setMeetingRate: (v: number) => void;
  closeRate: number;
  setCloseRate: (v: number) => void;
  acv: number;
  setAcv: (v: number) => void;
  touchHours: number;
  setTouchHours: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "inline-flex h-6 items-center rounded px-2 text-xs font-semibold uppercase tracking-wider",
            tone === "primary"
              ? "bg-primary/10 text-primary"
              : "bg-hot/10 text-hot",
          )}
        >
          {label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <NumberField label="Accounts" value={accounts} onChange={setAccounts} />
        <NumberField
          label="Meeting rate %"
          value={meetingRate}
          onChange={setMeetingRate}
          step={0.1}
        />
        <NumberField
          label="Close rate %"
          value={closeRate}
          onChange={setCloseRate}
        />
        <NumberField label="ACV $" value={acv} onChange={setAcv} step={500} />
        <NumberField
          label="Touch hours / acct"
          value={touchHours}
          onChange={setTouchHours}
          step={0.05}
        />
      </div>
    </div>
  );
}

function TierResult({
  label,
  tone,
  result,
  winner,
}: {
  label: string;
  tone: "primary" | "hot";
  result: ReturnType<typeof deriveTier>;
  winner: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-md border p-3",
        winner
          ? tone === "primary"
            ? "border-primary/40 bg-primary/5"
            : "border-hot/40 bg-hot/5"
          : "border-border bg-muted/30",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {winner ? (
          <TrendingUp
            className={cn(
              "h-3.5 w-3.5",
              tone === "primary" ? "text-primary" : "text-hot",
            )}
          />
        ) : (
          <TrendingDown className="h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="font-mono text-lg font-semibold text-foreground">
          ${Math.round(result.revenuePerHour).toLocaleString()}
        </span>
        <span className="text-xs text-muted-foreground">/ hr</span>
      </div>
      <p className="mt-0.5 text-xs text-muted-foreground">
        ${Math.round(result.revenue).toLocaleString()} rev ·{" "}
        {result.wins.toFixed(1)} wins · {Math.round(result.hours)} hrs
      </p>
    </div>
  );
}

/* ======================================================================= */
/*  Shared primitives                                                      */
/* ======================================================================= */
function NumberField({
  label,
  value,
  onChange,
  step = 1,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Input
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        step={step}
        min={0}
        onChange={(e) => {
          const n = Number(e.target.value);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        className="font-mono"
      />
      {hint ? (
        <span className="text-[11px] text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

function ResultRow({
  label,
  value,
  hint,
  emphasis,
}: {
  label: string;
  value: number | string;
  hint?: string;
  emphasis?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-md border px-3 py-2.5",
        emphasis ? "border-primary/40 bg-primary/10" : "border-border bg-muted/30",
      )}
    >
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {hint ? (
          <span className="text-[11px] text-muted-foreground/80">{hint}</span>
        ) : null}
      </div>
      <span
        className={cn(
          "font-mono text-xl font-semibold",
          emphasis ? "text-primary" : "text-foreground",
        )}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
        {typeof value === "number" && label.includes("/ day") ? (
          <Mail className="ml-1 inline h-4 w-4 align-text-bottom text-primary" />
        ) : null}
      </span>
    </div>
  );
}

function RateRow({
  label,
  value,
  good,
  floor,
  invert,
}: {
  label: string;
  value: number;
  good: number;
  floor: number;
  invert?: boolean;
}) {
  const score = invert
    ? invGrade(value, floor, floor * 2)
    : grade(value, good, floor);
  const tone: "success" | "warn" | "bad" =
    score >= 0.8 ? "success" : score >= 0.4 ? "warn" : "bad";
  const display = `${(value * 100).toFixed(1)}%`;
  return (
    <div className="flex flex-col gap-1.5 rounded-md border border-border bg-muted/20 p-3">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-mono text-xl font-semibold text-foreground">
          {display}
        </span>
        <span
          className={cn(
            "text-xs font-medium",
            tone === "success" && "text-success",
            tone === "warn" && "text-hot",
            tone === "bad" && "text-destructive",
          )}
        >
          {invert
            ? value <= good
              ? "clean"
              : value <= floor
                ? "watch"
                : "list issue"
            : value >= good
              ? "on target"
              : value >= floor
                ? "below target"
                : "critical"}
        </span>
      </div>
      <Progress
        value={Math.min(100, score * 100)}
        indicatorClassName={cn(
          tone === "success" && "bg-success",
          tone === "warn" && "bg-hot",
          tone === "bad" && "bg-destructive",
        )}
      />
    </div>
  );
}

function VerdictIcon({ tone }: { tone: "success" | "warn" | "bad" }) {
  if (tone === "success") return <CheckCircle2 className="h-4 w-4 text-success" />;
  if (tone === "warn") return <AlertTriangle className="h-4 w-4 text-hot" />;
  return <AlertTriangle className="h-4 w-4 text-destructive" />;
}

/* ------------------------------- Scoring ------------------------------- */
function grade(value: number, good: number, floor: number) {
  if (value >= good) return 1;
  if (value <= 0) return 0;
  if (value >= floor) return 0.4 + ((value - floor) / (good - floor)) * 0.6;
  return (value / floor) * 0.4;
}
function invGrade(value: number, good: number, ceiling: number) {
  // lower is better
  if (value <= good) return 1;
  if (value >= ceiling) return 0;
  return 1 - (value - good) / (ceiling - good);
}
