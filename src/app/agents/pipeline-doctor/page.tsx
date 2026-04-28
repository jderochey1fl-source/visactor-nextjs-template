import { TopNav } from "@/components/nav";
import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { ComingSoonAgent } from "@/components/agents/coming-soon-agent";
import { getAgent } from "@/data/agents";
import { notFound } from "next/navigation";

export default function PipelineDoctorPage() {
  const agent = getAgent("pipeline-doctor");
  if (!agent) notFound();
  return (
    <>
      <TopNav
        title={agent.name}
        subtitle={agent.tagline}
        action={
          <Badge variant="outline" className="gap-1.5 px-2 py-1">
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Coming soon
            </span>
          </Badge>
        }
      />
      <main>
        <Container className="py-6">
          <ComingSoonAgent agent={agent} />
        </Container>
      </main>
    </>
  );
}
