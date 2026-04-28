import { TopNav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";

export default function TriggerHunterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Trigger Hunter"
        subtitle="Find shops that just got hit by a storm or a hiring sprint — before they pick a tool"
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
