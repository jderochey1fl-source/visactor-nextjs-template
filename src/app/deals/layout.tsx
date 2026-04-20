import { TopNav } from "@/components/nav";
import { Button } from "@/components/ui/button";

export default function DealsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav
        title="Deals"
        subtitle="Pipeline · health scoring · stage drift"
        action={
          <Button size="sm" variant="outline" className="gap-1.5">
            <span className="font-mono text-xs uppercase tracking-wider">
              Add deal
            </span>
          </Button>
        }
      />
      <main>{children}</main>
    </>
  );
}
