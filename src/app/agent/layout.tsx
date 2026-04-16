import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Agent"
        subtitle="Claude sales coach · trained on LADDER + roofing ops"
        action={
          <Badge variant="default" className="gap-1.5 px-2 py-1">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Claude Opus 4.6
            </span>
          </Badge>
        }
      />
      <main className="h-[calc(100dvh-4rem)]">{children}</main>
    </>
  );
}
