import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";

export default function ResearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Research"
        subtitle="5-agent prospect intelligence · call prep in under a minute"
        action={
          <Badge variant="hot" className="gap-1.5 px-2 py-1">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse-dot rounded-full bg-hot" />
            <span className="font-mono text-[10px] uppercase tracking-wider">
              Agents online
            </span>
          </Badge>
        }
      />
      <main>{children}</main>
    </>
  );
}
