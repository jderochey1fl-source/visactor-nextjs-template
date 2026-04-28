import { ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  activeAgents,
  agents,
  comingSoonAgents,
  getAgent,
} from "@/data/agents";
import { AgentCard } from "./agent-card";

export function AgentsLanding() {
  return (
    <div className="flex flex-col gap-8">
      <header className="relative overflow-hidden rounded-lg border border-hot/30 bg-gradient-to-br from-hot/[0.08] via-card to-card">
        {/* hot orange anchor rail */}
        <div
          aria-hidden
          className="absolute left-0 top-0 h-full w-1 bg-hot"
        />
        <div className="relative flex flex-col gap-5 px-6 py-10 md:px-10 md:py-14">
          <div className="flex items-center gap-2">
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hot" />
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-hot">
              The Agent Platform
            </p>
          </div>
          <h1 className="max-w-4xl text-balance text-3xl font-bold leading-[1.05] tracking-tight md:text-4xl lg:text-5xl">
            Eight specialists.{" "}
            <span className="text-hot">One outbound motion.</span>
          </h1>
          <p className="max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Your AE doesn&apos;t need another generalist tool. They need a
            bench. Each agent owns one move &mdash; trigger, dossier, drill,
            call. Chained together, they run the week.
          </p>
          <div className="mt-1 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-2">
              <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-hot" />
              <span className="text-foreground">{activeAgents.length} live</span>
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
              />
              {comingSoonAgents.length} on the roadmap
            </span>
            <span className="flex items-center gap-2">
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-muted-foreground/50"
              />
              Built to compose, not silo
            </span>
          </div>
        </div>
      </header>

      <section aria-labelledby="active-agents">
        <div className="mb-3 flex items-baseline justify-between">
          <h3
            id="active-agents"
            className="text-sm font-semibold uppercase tracking-wider text-hot"
          >
            Active · {activeAgents.length}
          </h3>
          <p className="text-xs text-muted-foreground">
            Live and running on real data or demo data
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {activeAgents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>

      <section aria-labelledby="orchestration">
        <Card className="border-hot/30 bg-hot/5">
          <CardHeader>
            <CardTitle id="orchestration">The orchestration is the moat</CardTitle>
            <CardDescription>
              Standalone agents are commodity. The chain is the product.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ol className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:gap-1">
              <FlowStep
                index={1}
                slug="trigger-hunter"
                detail="finds the hot account"
              />
              <FlowArrow />
              <FlowStep
                index={2}
                slug="pre-call"
                detail="builds the dossier"
              />
              <FlowArrow />
              <FlowStep
                index={3}
                slug="voice-sparring"
                detail="reps the opener"
              />
              <FlowArrow />
              <FlowStep
                index={4}
                slug="coach"
                detail="catches the curveballs"
              />
            </ol>
          </CardContent>
        </Card>
      </section>

      <section aria-labelledby="coming-soon">
        <div className="mb-3 flex items-baseline justify-between">
          <h3
            id="coming-soon"
            className="text-sm font-semibold uppercase tracking-wider text-muted-foreground"
          >
            Coming soon · {comingSoonAgents.length}
          </h3>
          <p className="text-xs text-muted-foreground">Roadmap, ranked by quota impact</p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {comingSoonAgents.map((agent) => (
            <AgentCard key={agent.slug} agent={agent} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FlowStep({
  index,
  slug,
  detail,
}: {
  index: number;
  slug: string;
  detail: string;
}) {
  const agent = getAgent(slug);
  if (!agent) return null;
  return (
    <li className="flex flex-1 items-center gap-3 rounded-md border border-border bg-card px-3 py-2">
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-hot/15 font-mono text-[11px] font-semibold text-hot">
        {index}
      </span>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{agent.name}</p>
        <p className="truncate text-xs text-muted-foreground">{detail}</p>
      </div>
    </li>
  );
}

function FlowArrow() {
  return (
    <li
      aria-hidden
      className="hidden shrink-0 items-center justify-center text-muted-foreground md:flex"
    >
      <ArrowRight className="h-4 w-4" />
    </li>
  );
}

// Re-export so unused imports stay tree-shaken
export const _agentsCount = agents.length;
