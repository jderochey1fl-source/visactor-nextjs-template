import { ArrowRight, Sparkles, SkipForward } from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// STUB DATA — once Neon is wired, this component should:
//   1. Read the heatmap result set.
//   2. Pick the row with the longest red streak (or highest staleness if tied).
//   3. Map scenario id + persona id back to the pickable defaults on /roleplay.
//   4. Pre-fill /roleplay query params so the rep lands one click away from start.
// Today this is hard-coded to mirror the worst-case red row in SkillsHeatmap.
// ---------------------------------------------------------------------------
const drill = {
  scenarioId: "objection-mapping-tool",
  scenarioName: "Objection · 'We already have a mapping tool'",
  rationale:
    "You haven't drilled this in 18 days and your last score was 54. This is the objection most likely to derail your Q4 SmartTerritory deals.",
  recommendedPersona: "Jason Park · GM, Apex Residential",
  difficulty: "Skeptical",
  estimatedMinutes: 6,
};

export function TodaysDrill() {
  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border-2 border-hot/40 bg-gradient-to-br from-hot/5 via-card to-card p-5">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-hot/40 bg-hot/10 px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-hot">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          Today&apos;s Drill
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-base font-semibold leading-snug tracking-tight text-balance">
          {drill.scenarioName}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground text-pretty">
          {drill.rationale}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-2 border-y border-border py-3">
        <div className="flex flex-col gap-0.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Persona
          </dt>
          <dd className="text-sm font-medium leading-tight">
            {drill.recommendedPersona}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Difficulty
          </dt>
          <dd className="text-sm font-medium leading-tight">
            {drill.difficulty}
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Est. Time
          </dt>
          <dd className="text-sm font-medium leading-tight">
            ~{drill.estimatedMinutes} min
          </dd>
        </div>
        <div className="flex flex-col gap-0.5">
          <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            Mode
          </dt>
          <dd className="text-sm font-medium leading-tight">Voice or text</dd>
        </div>
      </dl>

      <div className="mt-auto flex flex-col gap-2">
        <Link
          href={`/roleplay?scenario=${drill.scenarioId}`}
          className="group inline-flex items-center justify-center gap-2 rounded-md bg-hot px-4 py-2.5 font-semibold text-primary-foreground transition-colors hover:bg-hot/90"
        >
          Start Role-Play
          <ArrowRight
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        <Link
          href="/roleplay"
          className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <SkipForward className="h-3 w-3" aria-hidden="true" />
          Skip &mdash; pick the next gap
        </Link>
      </div>
    </div>
  );
}
