import { Button } from "@/components/ui/button";
import { TopNav } from "@/components/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Command Center"
        subtitle="LADDER funnel · pipeline health · today's priorities"
        action={
          <Button size="sm" className="gap-1.5">
            <span className="font-mono text-xs uppercase tracking-wider">
              Sync CRM
            </span>
          </Button>
        }
      />
      <main>{children}</main>
    </>
  );
}
