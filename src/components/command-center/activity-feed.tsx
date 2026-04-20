import {
  CheckCircle2,
  FileText,
  MessageSquare,
  Monitor,
  Move,
  Phone,
} from "lucide-react";
import { activity } from "@/data/deals";
import { stageByKey } from "@/data/ladder";
import type { ActivityEvent } from "@/types/types";

const iconByType: Record<ActivityEvent["type"], React.ComponentType<{ className?: string }>> =
  {
    signed: CheckCircle2,
    stage_move: Move,
    proposal: FileText,
    demo: Monitor,
    note: MessageSquare,
    call: Phone,
  };

const colorByType: Record<ActivityEvent["type"], string> = {
  signed: "bg-success/10 text-success",
  stage_move: "bg-primary/10 text-primary",
  proposal: "bg-hot/10 text-hot",
  demo: "bg-warning/15 text-warning",
  note: "bg-muted text-muted-foreground",
  call: "bg-secondary text-secondary-foreground",
};

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function ActivityFeed() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-base font-semibold tracking-tight">
            Activity
          </h2>
          <p className="text-xs text-muted-foreground">
            Everything that moved across the team
          </p>
        </div>
      </div>
      <ul className="flex flex-col">
        {activity.map((e, idx) => {
          const Icon = iconByType[e.type];
          const moveLabel =
            e.type === "stage_move" && e.from && e.to
              ? `${stageByKey[e.from].name} → ${stageByKey[e.to].name}`
              : null;
          return (
            <li key={e.id} className="flex gap-3 py-3">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${colorByType[e.type]}`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                {idx < activity.length - 1 ? (
                  <span className="mt-1 h-full w-px flex-grow bg-border" />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-grow flex-col gap-0.5 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium">{e.prospectName}</span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {e.dealId}
                  </span>
                  {moveLabel ? (
                    <span className="rounded border border-border bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-foreground">
                      {moveLabel}
                    </span>
                  ) : null}
                </div>
                <p className="text-sm text-muted-foreground">{e.message}</p>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{e.owner}</span>
                  <span className="text-border">&bull;</span>
                  <span className="font-mono">{relativeTime(e.at)}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
