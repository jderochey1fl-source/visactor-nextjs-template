import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// LADDER Mastery — the centerpiece of the Command Center.
//
// One row per letter of LADDER's selling framework. Each row scores the rep
// 0–100 on that stage and surfaces a one-line coaching tip. The lowest-scoring
// letter is highlighted in hot orange and pinned as "Today's Drill" with a
// one-click CTA into the role-play tool aimed at the matching scenario.
//
// STUB: scores, tips, and avg are illustrative. Every value here will be
// computed in Neon from persisted role-play debriefs:
//   SELECT stage_letter, AVG(score) FROM roleplay_debriefs
//   WHERE user_id = $1 AND captured_at >= now() - interval '14 days'
//   GROUP BY stage_letter;
// ---------------------------------------------------------------------------

type LadderRow = {
  letter: "L" | "A" | "D1" | "D2" | "E" | "R";
  display: string;
  name: string;
  blurb: string;
  score: number;
  tip: string;
  drillScenarioId: string;
};

const rows: LadderRow[] = [
  {
    letter: "L",
    display: "L",
    name: "Lead",
    blurb: "Cold-open hook that earns the next 30 seconds.",
    score: 72,
    tip: "Strong opener — your hook lands 3 of 4 calls. Push for the 4th.",
    drillScenarioId: "cold-call-opener",
  },
  {
    letter: "A",
    display: "A",
    name: "Ask",
    blurb: "Layered discovery — questions that earn quantified answers.",
    score: 55,
    tip: "Layer your discovery — 2 follow-ups beats 4 unrelated first-questions.",
    drillScenarioId: "discovery-deep-dive",
  },
  {
    letter: "D1",
    display: "D",
    name: "Diagnose",
    blurb: "Translate prospect pain into the dollar cost of status quo.",
    score: 41,
    tip: "Quote a number in their data — not yours. 'At 5 reps × $11K bad-hire cost…'",
    drillScenarioId: "cost-of-status-quo",
  },
  {
    letter: "D2",
    display: "D",
    name: "Demonstrate",
    blurb: "Tight proof and story — never a feature list.",
    score: 68,
    tip: "Solid proof. Don't drift into a feature dump if they push for one.",
    drillScenarioId: "proof-without-product-dump",
  },
  {
    letter: "E",
    display: "E",
    name: "Earn",
    blurb: "Convert interest into a calendared 15-minute Fit Call.",
    score: 82,
    tip: "Closing the 15-min ask cleanly. Keep it.",
    drillScenarioId: "earn-the-fit-call",
  },
  {
    letter: "R",
    display: "R",
    name: "Re-engage",
    blurb: "Re-open dark deals after brush-offs and silence.",
    score: 34,
    tip: "Today's drill. Run the 're-opener after brush-off' scenario twice.",
    drillScenarioId: "reopener-after-brushoff",
  },
];

const TARGET_ROW = "Practice Goal: 5 drills/week · 14-day rolling window";

function tone(score: number): "red" | "yellow" | "green" {
  if (score < 50) return "red";
  if (score < 70) return "yellow";
  return "green";
}

function avg(rows: LadderRow[]): number {
  return Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length);
}

export function LadderMastery() {
  const overall = avg(rows);
  const weakest = rows.reduce((m, r) => (r.score < m.score ? r : m), rows[0]);

  return (
    <section className="relative overflow-hidden rounded-lg border-2 border-hot/40 bg-gradient-to-br from-hot/[0.06] via-card to-card">
      {/* hot orange anchor rail */}
      <div aria-hidden className="absolute left-0 top-0 h-full w-1 bg-hot" />

      <div className="relative grid grid-cols-1 gap-0 laptop:grid-cols-3">
        {/* Mastery chart — 2/3 width on laptop */}
        <div className="laptop:col-span-2 border-b border-border laptop:border-b-0 laptop:border-r">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hot" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-hot">
                LADDER Mastery
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-2xl font-semibold tracking-tight text-foreground">
                  {overall}
                </span>
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  / 100
                </span>
              </div>
              <span className="hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground laptop:inline">
                14-day avg
              </span>
            </div>
          </header>

          <ol className="divide-y divide-border">
            {rows.map((row) => {
              const t = tone(row.score);
              const isWeakest = row.letter === weakest.letter;
              return (
                <li
                  key={row.letter}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 transition-colors",
                    isWeakest ? "bg-hot/[0.04]" : "hover:bg-muted/30",
                  )}
                >
                  {/* Letter chip */}
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border font-mono text-base font-bold",
                      isWeakest
                        ? "border-hot bg-hot text-hot-foreground"
                        : t === "red"
                          ? "border-destructive/40 bg-destructive/10 text-destructive"
                          : t === "yellow"
                            ? "border-warning/40 bg-warning/10 text-warning"
                            : "border-success/40 bg-success/10 text-success",
                    )}
                    aria-hidden
                  >
                    {row.display}
                  </div>

                  {/* Name + blurb + bar */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {row.name}
                        </span>
                        <span className="hidden text-xs text-muted-foreground tablet:inline">
                          {row.blurb}
                        </span>
                      </div>
                      <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
                        {row.score}
                      </span>
                    </div>

                    {/* progress bar */}
                    <div
                      className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted"
                      role="meter"
                      aria-valuenow={row.score}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${row.name} mastery score`}
                    >
                      <div
                        className={cn(
                          "h-full rounded-full transition-[width]",
                          isWeakest
                            ? "bg-hot"
                            : t === "red"
                              ? "bg-destructive"
                              : t === "yellow"
                                ? "bg-warning"
                                : "bg-success",
                        )}
                        style={{ width: `${row.score}%` }}
                      />
                    </div>

                    {/* tip */}
                    <p
                      className={cn(
                        "mt-1.5 text-xs leading-relaxed",
                        isWeakest
                          ? "font-medium text-hot"
                          : "text-muted-foreground",
                      )}
                    >
                      {row.tip}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <footer className="border-t border-border px-6 py-3">
            <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              {TARGET_ROW}
            </p>
          </footer>
        </div>

        {/* Today's Drill panel — 1/3 width */}
        <aside className="flex flex-col justify-between bg-hot/[0.06] p-6">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-hot" aria-hidden />
              <span className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-hot">
                Today&apos;s Drill
              </span>
            </div>

            <h3 className="mt-3 text-balance text-xl font-semibold leading-tight tracking-tight">
              Lock in <span className="text-hot">{weakest.name}</span>.
            </h3>

            <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
              {weakest.blurb} You&apos;re sitting at{" "}
              <span className="font-mono font-semibold text-foreground">
                {weakest.score}/100
              </span>{" "}
              — the lowest of the six. Two reps moves the score in a week.
            </p>

            <div className="mt-4 rounded-md border border-hot/30 bg-card/60 p-3">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                Coach&apos;s Note
              </p>
              <p className="mt-1.5 text-xs leading-relaxed text-foreground">
                {weakest.tip}
              </p>
            </div>
          </div>

          <Link
            href={`/roleplay?scenario=${weakest.drillScenarioId}`}
            className="group mt-6 inline-flex items-center justify-center gap-1.5 rounded-md bg-hot px-4 py-2.5 text-sm font-semibold text-hot-foreground transition-colors hover:bg-hot/90"
          >
            Start drill
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </aside>
      </div>
    </section>
  );
}
