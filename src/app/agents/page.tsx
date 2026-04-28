import { TopNav } from "@/components/nav";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { AgentsLanding } from "@/components/agents/agents-landing";
import { activeAgents, comingSoonAgents } from "@/data/agents";

export default function AgentsPage() {
  return (
    <>
      <TopNav
        title="Agents"
        subtitle="Your AI workforce — composable, not siloed"
        action={
          <div className="flex items-center gap-2">
            <Badge variant="hot" className="gap-1.5 px-2 py-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {activeAgents.length} active
              </span>
            </Badge>
            <Badge variant="outline" className="gap-1.5 px-2 py-1">
              <span className="font-mono text-[10px] uppercase tracking-wider">
                {comingSoonAgents.length} on deck
              </span>
            </Badge>
          </div>
        }
      />
      <main>
        <Container className="py-6">
          <AgentsLanding />
        </Container>
      </main>
    </>
  );
}
