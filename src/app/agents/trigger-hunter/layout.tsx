import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { getAgent } from "@/data/agents";

export default function TriggerHunterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const agent = getAgent("trigger-hunter");
  return (
    <>
      <TopNav
        title={agent?.name ?? "Trigger Hunter"}
        subtitle={
          agent?.tagline ??
          "Hot accounts ranked by storm + hiring signals"
        }
        action={
          <Badge variant="hot" className="gap-1.5 px-2 py-1">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse-dot rounded-full bg-hot" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Demo data
            </span>
          </Badge>
        }
      />
      <main>{children}</main>
    </>
  );
}
