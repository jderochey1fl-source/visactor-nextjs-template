import { AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// STUB DATA — replace with a live query that joins:
//   roleplay_sessions  (most recent per scenario)
//   roleplay_debriefs  (score per session)
// returning one row per scenario with last_drilled_at + last_score.
//
// Heat thresholds (tunable):
//   green  = drilled within 7 days  AND last score >= 80
//   yellow = drilled within 14 days OR  last score 60-79
//   red    = drilled >14 days ago   OR  last score <60
//   gray   = never drilled
// ---------------------------------------------------------------------------
type Heat = "green" | "yellow" | "red" | "gray";

type SkillRow = {
  scenario: string; // scenario.id from roleplay-scenarios.ts
  short: string; // human-readable label
  lastDrilled: string; // 'just now' | '3d ago' | 'never'
  lastPersona: string; // who they ran it against
  score: number | null; // 0-100 or null
  heat: Heat;
};

const rows: SkillRow[] = [
  {
    scenario: "cold-opener",
    short: "Cold Call · Permission-Based Opener",
    lastDrilled: "1d ago",
    lastPersona: "Derek Hollis",
    score: 84,
    heat: "green",
  },
  {
    scenario: "objection-pricing",
    short: "Objection · Price Pushback",
    lastDrilled: "2d ago",
    lastPersona: "Marcus Webb",
    score: 76,
    heat: "yellow",
  },
  {
    scenario: "gatekeeper",
    short: "Gatekeeper Flip",
    lastDrilled: "5d ago",
    lastPersona: "Angela Ruiz",
    score: 72,
    heat: "yellow",
  },
  {
    scenario: "discovery",
    short: "Discovery · Quantifying Status Quo Cost",
    lastDrilled: "11d ago",
    lastPersona: "Marcus Webb",
    score: 58,
    heat: "red",
  },
  {
    scenario: "objection-mapping-tool",
    short: "Objection · 'We already have a mapping tool'",
    lastDrilled: "18d ago",
    lastPersona: "Jason Park",
    score: 54,
    heat: "red",
  },
  {
    scenario: "voicemail",
    short: "Voicemail · 22-second Hook",
    lastDrilled: "never",
    lastPersona: "—",
    score: null,
    heat: "gray",
  },
  {
    scenario: "reengagement",
    short: "Re-engagement · Dark Deal",
    lastDrilled: "never",
    lastPersona: "—",
    score: null,
    heat: "gray",
  },
  {
    scenario: "close",
    short: "Close · Calendared Next Step",
    lastDrilled: "9d ago",
    lastPersona: "Derek Hollis",
    score: 81,
    heat: "yellow",
  },
];

const heatStyles: Record<Heat, { dot: string; text: string; row: string }> = {
  green: {
    dot: "bg-success",
    text: "text-success",
    row: "border-success/20",
  },
  yellow: {
    dot: "bg-warning",
    text: "text-warning",
    row: "border-warning/20",
  },
  red: {
    dot: "bg-hot",
    text: "text-hot",
    row: "border-hot/40 bg-hot/5",
  },
  gray: {
    dot: "bg-muted-foreground/30",
    text: "text-muted-foreground",
    row: "border-border",
  },
};

const heatIcon = {
  green: CheckCircle2,
  yellow: Circle,
  red: AlertCircle,
  gray: Circle,
} as const;

export function SkillsHeatmap() {
  // Sort: red (most stale) first, then yellow, then gray (untouched), then green.
  // This puts the actionable gaps at the top of the list.
  const order: Record<Heat, number> = { red: 0, gray: 1, yellow: 2, green: 3 };
  const sorted = [...rows].sort((a, b) => order[a.heat] - order[b.heat]);

  const counts = rows.reduce(
    (acc, r) => {
      acc[r.heat] += 1;
      return acc;
    },
    { green: 0, yellow: 0, red: 0, gray: 0 } as Record<Heat, number>,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Skills Heatmap
          </h2>
          <p className="text-xs text-muted-foreground">
            Where you&apos;re sharp, where you&apos;re not &middot; gaps surface
            on top
          </p>
        </div>
        <div className="flex items-center gap-3 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-success" />
            {counts.green} sharp
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-warning" />
            {counts.yellow} fading
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-hot" />
            {counts.red} cold
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-sm bg-muted-foreground/30" />
            {counts.gray} untouched
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-1.5">
        {sorted.map((r) => {
          const styles = heatStyles[r.heat];
          const Icon = heatIcon[r.heat];
          return (
            <li
              key={r.scenario}
              className={cn(
                "grid grid-cols-[auto_1fr_auto] items-center gap-3 rounded-md border bg-card px-3 py-2.5 transition-colors hover:bg-muted/40",
                styles.row,
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-card">
                <Icon className={cn("h-4 w-4", styles.text)} />
              </div>

              <div className="flex min-w-0 flex-col gap-0.5 leading-tight">
                <span className="truncate text-sm font-medium">{r.short}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Last vs {r.lastPersona} &middot; {r.lastDrilled}
                </span>
              </div>

              <div className="flex flex-col items-end gap-0.5 leading-none">
                {r.score !== null ? (
                  <span
                    className={cn(
                      "font-mono text-sm font-semibold",
                      styles.text,
                    )}
                  >
                    {r.score}
                  </span>
                ) : (
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    no data
                  </span>
                )}
                <span
                  className={cn(
                    "font-mono text-[10px] uppercase tracking-wider",
                    styles.text,
                  )}
                >
                  {r.heat === "green" && "sharp"}
                  {r.heat === "yellow" && "fading"}
                  {r.heat === "red" && "cold"}
                  {r.heat === "gray" && "untouched"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
