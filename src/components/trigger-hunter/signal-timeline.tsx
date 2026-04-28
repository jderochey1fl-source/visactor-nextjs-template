import { Activity, Briefcase, CloudRain, UserPlus, Wrench } from "lucide-react";
import {
  type SignalEvent,
  type SignalSource,
  sourceLabel,
} from "@/data/trigger-hunter-mock";
import { cn } from "@/lib/utils";

function iconFor(source: SignalSource) {
  switch (source) {
    case "noaa-storm-events":
      return CloudRain;
    case "indeed-rep-jobs":
    case "ziprecruiter-rep-jobs":
    case "craigslist-rep-jobs":
      return Briefcase;
    case "linkedin-leadership-change":
      return UserPlus;
    case "apollo-firmographic":
      return Wrench;
    default:
      return Activity;
  }
}

function relTime(iso: string): string {
  const ms = Date.now() - Date.parse(iso);
  const days = Math.round(ms / (24 * 60 * 60 * 1000));
  if (days === 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  const months = Math.round(days / 30);
  return `${months}mo ago`;
}

export function SignalTimeline({ signals }: { signals: SignalEvent[] }) {
  if (signals.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-border bg-muted/30 p-4 text-center">
        <p className="text-xs text-muted-foreground">
          No fresh signals captured. Re-run a sweep or wait for the next cycle.
        </p>
      </div>
    );
  }

  return (
    <ol className="flex flex-col gap-3">
      {signals.map((s) => {
        const Icon = iconFor(s.source);
        const heat =
          s.weight >= 80
            ? "border-hot/40 bg-hot/5"
            : s.weight >= 65
            ? "border-amber-500/30 bg-amber-500/5"
            : "border-border/60 bg-muted/30";
        return (
          <li
            key={s.id}
            className={cn("flex gap-3 rounded-md border p-3", heat)}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border/60 bg-card text-foreground">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-semibold">{s.type}</span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {relTime(s.capturedAt)}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{s.summary}</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/70">
                source · {sourceLabel(s.source)} · weight {s.weight}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
