import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";

export default function RoleplayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Role Play"
        subtitle="Live-fire practice against the LADDER Scripts V3 rubric"
        action={
          <Badge variant="default" className="gap-1.5 px-2 py-1">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse-dot rounded-full bg-primary" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Text · Voice-ready
            </span>
          </Badge>
        }
      />
      <main className="h-[calc(100dvh-4rem)]">{children}</main>
    </>
  );
}
