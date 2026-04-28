import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/data/agents";
import { getAgent } from "@/data/agents";

export function ComingSoonAgent({ agent }: { agent: Agent }) {
  const Icon = agent.icon;
  const downstream = (agent.feedsInto ?? [])
    .map((slug) => getAgent(slug))
    .filter(Boolean) as Agent[];

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/agents"
        className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All agents
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Coming soon
              </p>
              <CardTitle className="mt-1 text-xl md:text-2xl">
                {agent.name}
              </CardTitle>
              <CardDescription className="mt-1">
                {agent.tagline}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <div>
            <p className="text-sm leading-relaxed">{agent.description}</p>
          </div>

          <div className="rounded-md border border-hot/30 bg-hot/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-hot">
              Why it matters
            </p>
            <p className="mt-1.5 text-sm leading-relaxed">{agent.whyItMatters}</p>
          </div>

          {downstream.length ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Feeds into
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {downstream.map((next) => (
                  <Link
                    key={next.slug}
                    href={next.href}
                    className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-sm hover:border-hot/40 hover:text-hot"
                  >
                    {next.name}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex items-center gap-3">
        <Button asChild variant="outline">
          <Link href="/agents">Back to agents</Link>
        </Button>
        <p className="text-xs text-muted-foreground">
          Building this next once Trigger Hunter is in production with real
          scrapers.
        </p>
      </div>
    </div>
  );
}
