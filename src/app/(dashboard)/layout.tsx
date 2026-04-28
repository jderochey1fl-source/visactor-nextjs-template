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
        subtitle="LADDER mastery · drill cadence · today's priorities"
      />
      <main>{children}</main>
    </>
  );
}
