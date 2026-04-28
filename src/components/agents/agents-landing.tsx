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
      <header className="max-w-3xl">
        <p className="text-xs font-medium uppercase tracking-wider text-hot">
          Agent platform
        </p>
        <h2 className="mt-2 text-balance text-2xl font-semibold leading-tight tracking-tight md:text-3xl">
          One AI workforce. Each agent does one thing extremely well.
        </h2>
        <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
          Trigger Hunter finds the right shop on the right day. Pre-Call Prep
          turns that into a one-page dossier. Voice Sparring lets you rehearse
          the call three times before you dial. Coach is on call when something
          goes sideways. Built to compose, not to live in silos.
        </p>
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
